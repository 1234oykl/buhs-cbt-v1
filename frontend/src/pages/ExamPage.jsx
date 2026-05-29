import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../config/api";
import "bootstrap/dist/css/bootstrap.min.css";
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
  const [tabSwitches, setTabSwitches] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    if (!user || !token) navigate("/login");
  }, [navigate, token, user]);

  const submitExam = useCallback(
    async (force = false) => {
      if (submitted) return;

      if (!force && !window.confirm("Submit exam?")) return;

      setSubmitted(true);

      try {
        await api.post(
          "/results/submit",
          { student: user._id, exam: id, answers },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        localStorage.removeItem(`exam_${id}_answers`);
        localStorage.removeItem(`exam_time_${id}`);

        alert("Submitted!");
        navigate("/student-dashboard");
      } catch (err) {
        setSubmitted(false);
      }
    },
    [answers, id, navigate, submitted, token, user]
  );

  useEffect(() => {
    localStorage.setItem(`exam_${id}_answers`, JSON.stringify(answers));
  }, [answers, id]);

  useEffect(() => {
    const saved = localStorage.getItem(`exam_${id}_answers`);
    if (saved) setAnswers(JSON.parse(saved));
  }, [id]);

  useEffect(() => {
    if (!exam || submitted) return;

    if (timeLeft <= 0) return submitExam(true);

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        const v = t - 1;
        localStorage.setItem(`exam_time_${id}`, v);
        return v;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [exam, submitted, timeLeft]);

  useEffect(() => {
    const saved = localStorage.getItem(`exam_time_${id}`);
    if (saved) setTimeLeft(Number(saved));
  }, [id]);

  useEffect(() => {
    const fetchExam = async () => {
      const res = await api.post(
        "/exams/start",
        { examId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setExam(res.data.exam);
      setQuestions(res.data.shuffledQuestions || []);
      setTimeLeft(res.data.exam.duration * 60);
    };

    fetchExam();
  }, [id, token]);

  const handleAnswer = (val) => {
    setAnswers((p) => ({ ...p, [current]: val }));
  };

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const q = questions[current];

  if (!exam) return <h3 className="p-3">Loading...</h3>;

  return (
    <div className="container-fluid bg-light min-vh-100">

      {/* HEADER */}
      <div className="row bg-dark text-white p-3 align-items-center">
        <div className="col-12 col-md-6">
          <h4>{exam.title}</h4>
        </div>

        <div className="col-12 col-md-6 text-md-end">
          <h5>⏳ {formatTime(timeLeft)}</h5>
          <small>Switches: {tabSwitches}</small>
        </div>
      </div>

      {/* BODY */}
      <div className="row p-2">

        {/* QUESTION */}
        <div className="col-12 col-md-8 mb-3">

          <div className="card p-3 shadow-sm">

            <h6>
              Question {current + 1} of {questions.length}
            </h6>

            <p className="fw-bold">{q?.question}</p>

            {q?.options?.map((opt, i) => (
              <div
                key={i}
                className={`form-check p-2 border rounded mb-2 ${
                  answers[current] === opt ? "bg-primary text-white" : ""
                }`}
              >
                <input
                  type="radio"
                  className="form-check-input"
                  checked={answers[current] === opt}
                  onChange={() => handleAnswer(opt)}
                />
                <label className="form-check-label ms-2">{opt}</label>
              </div>
            ))}

            <div className="d-flex justify-content-between mt-3">

              <button
                className="btn btn-secondary"
                disabled={current === 0}
                onClick={() => setCurrent(current - 1)}
              >
                Prev
              </button>

              <button
                className="btn btn-secondary"
                disabled={current === questions.length - 1}
                onClick={() => setCurrent(current + 1)}
              >
                Next
              </button>

            </div>

          </div>

        </div>

        {/* PALETTE */}
        <div className="col-12 col-md-4">

          <div className="card p-3 shadow-sm">

            <h6>Question Palette</h6>

            <div className="d-flex flex-wrap gap-2">

              {questions.map((_, i) => (
                <button
                  key={i}
                  className={`btn btn-sm ${
                    i === current
                      ? "btn-dark"
                      : answers[i]
                      ? "btn-success"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setCurrent(i)}
                >
                  {i + 1}
                </button>
              ))}

            </div>

            <p className="mt-2">
              Answered: {Object.keys(answers).length}/
              {questions.length}
            </p>

            <button
              className="btn btn-danger w-100"
              onClick={() => submitExam(false)}
            >
              Submit Exam
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default ExamPage;