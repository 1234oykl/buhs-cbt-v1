import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../config/api";
import "./ExamPage.css";

function ExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);

  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tabSwitches, setTabSwitches] = useState(0);

  const [attemptId, setAttemptId] = useState(null);

  const [answers, setAnswers] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  // ================= LOGIN CHECK =================
  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
    }
  }, [navigate, token, user]);

  // ================= LOAD EXAM =================
  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);

        const res = await api.post(
          "/exams/start",
          { examId: id },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data;

        setTitle(data.title);
        setDuration(data.duration);
        setQuestions(data.shuffledQuestions || []);
        setAttemptId(data.attemptId);

        setTimeLeft(data.duration * 60);

        setLoading(false);
      } catch (err) {
        console.log(err.response?.data || err.message);
        setLoading(false);
      }
    };

    if (token) fetchExam();
  }, [id, token]);

  // ================= SAVE ANSWERS =================
  const handleAnswer = (value) => {
    const questionId = questions[current]._id;

    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== questionId);

      return [
        ...filtered,
        { questionId, answer: value },
      ];
    });
  };

  // ================= FORMAT TIME =================
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  // ================= SUBMIT EXAM =================
  const submitExam = useCallback(
    async (force = false) => {
      if (submitted) return;

      if (!force) {
        const ok = window.confirm("Submit exam?");
        if (!ok) return;
      }

      setSubmitted(true);

      try {
        await api.post(
          "/results/submit",
          {
            exam: id,
            answers,
            attemptId,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        localStorage.removeItem(`exam_${id}_answers`);
        localStorage.removeItem(`exam_time_${id}`);

        alert("Submitted successfully");
        navigate("/student-dashboard");
      } catch (err) {
        console.log(err.response?.data || err.message);
        alert(err.response?.data?.message || "Submission failed");
        setSubmitted(false);
      }
    },
    [answers, id, attemptId, navigate, submitted, token]
  );

  // ================= TIMER =================
  useEffect(() => {
    if (!questions.length || submitted) return;

    if (timeLeft <= 0) {
      submitExam(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const updated = prev - 1;
        localStorage.setItem(`exam_time_${id}`, updated);
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted, questions.length, submitExam, id]);

  // ================= RESTORE TIMER =================
  useEffect(() => {
    const saved = localStorage.getItem(`exam_time_${id}`);
    if (saved) setTimeLeft(Number(saved));
  }, [id]);

  // ================= ANTI CHEAT =================
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
    return () => window.removeEventListener("blur", handleBlur);
  }, [submitted, submitExam]);

  // ================= BLOCK COPY =================
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

  // ================= UI STATES =================
  if (loading) return <h2>Loading Exam...</h2>;
  if (!questions.length) return <h2>No questions found</h2>;

  const question = questions[current];

  const getSelectedAnswer = (id) =>
    answers.find((a) => a.questionId === id)?.answer;

  return (
    <div className="cbt-wrapper">
      {/* HEADER */}
      <div className="cbt-header">
        <h2>{title}</h2>
        <h3>⏳ {formatTime(timeLeft)}</h3>
        <p>Tab Switches: {tabSwitches}</p>
      </div>

      {/* BODY */}
      <div className="cbt-body">
        {/* QUESTION */}
        <div className="question-panel">
          <h3>
            Question {current + 1} of {questions.length}
          </h3>

          <p>{question.question}</p>

          <div className="options">
            {question.options?.map((opt, i) => (
              <label
                key={i}
                className={`option-item ${
                  getSelectedAnswer(question._id) === opt ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  checked={getSelectedAnswer(question._id) === opt}
                  onChange={() => handleAnswer(opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* PALETTE */}
        <div className="palette-panel">
          <h3>Palette</h3>

          <div className="question-palette">
            {questions.map((q, i) => (
              <button
                key={i}
                className={`palette-btn ${
                  i === current ? "active" : ""
                } ${getSelectedAnswer(q._id) ? "answered" : ""}`}
                onClick={() => setCurrent(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <p>
            Answered: {answers.length} / {questions.length}
          </p>

          <button onClick={() => submitExam(false)}>
            Submit Exam
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="cbt-footer">
        <button disabled={current === 0} onClick={() => setCurrent(current - 1)}>
          Previous
        </button>

        <button
          disabled={current === questions.length - 1}
          onClick={() => setCurrent(current + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ExamPage;