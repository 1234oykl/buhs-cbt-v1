import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../config/api";
import "./ExamPage.css";

function ExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tabSwitches, setTabSwitches] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  // =============================
  // CHECK LOGIN
  // =============================
  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
    }
  }, [navigate, token, user]);

  // =============================
  // SUBMIT EXAM
  // =============================
  const submitExam = useCallback(
    async (force = false) => {
      if (submitted) return;

      if (!force) {
        const confirmSubmit = window.confirm(
          "Are you sure you want to submit?"
        );

        if (!confirmSubmit) return;
      }

      setSubmitted(true);

      try {
        await api.post(
          "/results/submit",
          {
            student: user._id,
            exam: id,
            answers,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // CLEAR SAVED DATA
        localStorage.removeItem(`exam_${id}_answers`);
        localStorage.removeItem(`exam_time_${id}`);

        alert("Exam submitted successfully!");

        navigate("/student-dashboard");

      } catch (err) {
        console.log(
          "Submit error:",
          err.response?.data || err.message
        );

        alert(
          err.response?.data?.message ||
          "Error submitting exam."
        );

        setSubmitted(false);
      }
    },
    [answers, id, navigate, submitted, token, user]
  );

  // =============================
  // SAVE ANSWERS
  // =============================
  useEffect(() => {
    localStorage.setItem(
      `exam_${id}_answers`,
      JSON.stringify(answers)
    );
  }, [answers, id]);

  // =============================
  // RESTORE ANSWERS
  // =============================
  useEffect(() => {
    const savedAnswers = localStorage.getItem(
      `exam_${id}_answers`
    );

    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, [id]);

  // =============================
  // TIMER
  // =============================
  useEffect(() => {
    if (!exam || submitted) return;

    if (timeLeft <= 0) {
      submitExam(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const updated = prev - 1;

        localStorage.setItem(
          `exam_time_${id}`,
          updated
        );

        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);

  }, [exam, submitted, timeLeft, id, submitExam]);

  // =============================
  // RESTORE TIMER
  // =============================
  useEffect(() => {
    const savedTime = localStorage.getItem(
      `exam_time_${id}`
    );

    if (savedTime) {
      setTimeLeft(Number(savedTime));
    }
  }, [id]);

  // =============================
  // LOAD EXAM
  // =============================
  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);

        const res = await api.post(
          "/exams/start",
          { examId: id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setExam(res.data.exam);

        setQuestions(
          res.data.shuffledQuestions || []
        );

        const savedTime = localStorage.getItem(
          `exam_time_${id}`
        );

        setTimeLeft(
          savedTime
            ? Number(savedTime)
            : res.data.exam.duration * 60
        );

        setLoading(false);

      } catch (err) {
        console.log(
          "Error loading exam:",
          err.response?.data || err.message
        );

        setLoading(false);
      }
    };

    if (token) {
      fetchExam();
    }

  }, [id, token]);

  // =============================
  // ANTI-CHEAT
  // =============================
  useEffect(() => {
    const handleBlur = () => {
      if (submitted) return;

      setTabSwitches((prev) => {
        const updated = prev + 1;

        if (updated >= 2) {
          submitExam(true);
        } else {
          alert("Warning: Do not switch tabs!");
        }

        return updated;
      });
    };

    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener(
        "blur",
        handleBlur
      );
    };

  }, [submitted, submitExam]);

  // =============================
  // BLOCK COPY / PASTE
  // =============================
  useEffect(() => {
    const block = (e) => e.preventDefault();

    document.addEventListener("copy", block);
    document.addEventListener("paste", block);
    document.addEventListener("cut", block);

    return () => {
      document.removeEventListener("copy", block);
      document.removeEventListener("paste", block);
      document.removeEventListener("cut", block);
    };
  }, []);

  // =============================
  // HANDLE ANSWER
  // =============================
  const handleAnswer = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [current]: value,
    }));
  };

  // =============================
  // FORMAT TIME
  // =============================
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  // =============================
  // NAVIGATION
  // =============================
  const goToQuestion = (index) => {
    setCurrent(index);
  };

  // =============================
  // LOADING
  // =============================
  if (loading) {
    return (
      <h2 style={{ padding: "20px" }}>
        Loading Exam...
      </h2>
    );
  }

  if (!exam) {
    return (
      <h2 style={{ padding: "20px" }}>
        Exam not found
      </h2>
    );
  }

  const question = questions[current];

  if (!question) {
    return (
      <h2 style={{ padding: "20px" }}>
        No questions found
      </h2>
    );
  }

  return (
    <div className="cbt-wrapper">

      {/* HEADER */}
      <div className="cbt-header">

        <h2>{exam.title}</h2>

        <h3 className="timer">
          ⏳ Time Left: {formatTime(timeLeft)}
        </h3>

        <p>Tab Switches: {tabSwitches}</p>

      </div>

      {/* BODY */}
      <div className="cbt-body">

        {/* QUESTION PANEL */}
        <div className="question-panel">

          <h3>
            Question {current + 1} of {questions.length}
          </h3>

          <p className="question-text">
            {question.question}
          </p>

          <div className="options">

            {question.options?.map((opt, i) => (
              <label
                key={i}
                className={`option-item ${
                  answers[current] === opt
                    ? "selected"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name={`question-${current}`}
                  checked={answers[current] === opt}
                  onChange={() => handleAnswer(opt)}
                />

                <span>{opt}</span>

              </label>
            ))}

          </div>
        </div>

        {/* PALETTE */}
        <div className="palette-panel">

          <h3>Question Palette</h3>

          <div className="question-palette">

            {questions.map((q, index) => (
              <button
                key={index}
                className={`palette-btn ${
                  index === current
                    ? "active"
                    : ""
                } ${
                  answers[index]
                    ? "answered"
                    : ""
                }`}
                onClick={() =>
                  goToQuestion(index)
                }
              >
                {index + 1}
              </button>
            ))}

          </div>

          <p>
            Answered:{" "}
            {Object.keys(answers).length} /{" "}
            {questions.length}
          </p>

          <button
            className="submit-btn"
            onClick={() => submitExam(false)}
          >
            Finish & Submit
          </button>

        </div>
      </div>

      {/* FOOTER */}
      <div className="cbt-footer">

        <button
          disabled={current === 0}
          onClick={() =>
            setCurrent(current - 1)
          }
        >
          ⬅ Previous
        </button>

        <button
          disabled={
            current === questions.length - 1
          }
          onClick={() =>
            setCurrent(current + 1)
          }
        >
          Next ➡
        </button>

      </div>
    </div>
  );
}

export default ExamPage;