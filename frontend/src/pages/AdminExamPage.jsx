import { useState } from "react";
import api from "../config/api";
import { useNavigate } from "react-router-dom";

function AdminExamPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState("");
  const [examDate, setExamDate] = useState("");

  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);

  // ===== HANDLERS =====
  const handleQuestionChange = (i, value) => {
    const updated = [...questions];
    updated[i].question = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;

    // reset correctAnswer if it no longer matches
    if (updated[qIndex].correctAnswer === optIndex) {
      updated[qIndex].correctAnswer = "";
    }

    setQuestions(updated);
  };

  const handleCorrectAnswer = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = Number(value);
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // ===== SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !className || !subject || !duration || !examDate) {
      alert("Please fill all exam details");
      return;
    }

    for (let q of questions) {
      if (!q.question.trim()) {
        alert("All questions must have text");
        return;
      }
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.token || !user.isAdmin) {
        alert("Admin login required");
        navigate("/admin-login");
        return;
      }

      const examData = {
        title,
        className: className.toUpperCase(),
        subject,
        duration: Number(duration),
        date: examDate,
        questions,
      };

      await api.post("/exams", examData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      alert("Exam created successfully");
      navigate("/admin");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create exam");
    }
  };

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="container">

        {/* HEADER */}
        <h2 className="text-center fw-bold mb-4">
          📝 Create New Exam
        </h2>

        <form onSubmit={handleSubmit} className="card shadow p-4 border-0">

          {/* EXAM DETAILS */}
          <div className="row g-3">

            <div className="col-md-6">
              <label className="form-label">Exam Title</label>
              <input className="form-control" value={title}
                onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Class</label>
              <input className="form-control" value={className}
                onChange={(e) => setClassName(e.target.value)} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Subject</label>
              <input className="form-control" value={subject}
                onChange={(e) => setSubject(e.target.value)} />
            </div>

            <div className="col-md-3">
              <label className="form-label">Duration (mins)</label>
              <input type="number" className="form-control"
                value={duration}
                onChange={(e) => setDuration(e.target.value)} />
            </div>

            <div className="col-md-3">
              <label className="form-label">Exam Date</label>
              <input type="date" className="form-control"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)} />
            </div>

          </div>

          <hr className="my-4" />

          {/* QUESTIONS */}
          <h4 className="mb-3">Questions</h4>

          {questions.map((q, index) => (
            <div key={index} className="border rounded p-3 mb-3 bg-white">

              <div className="d-flex justify-content-between mb-2">
                <strong>Question {index + 1}</strong>

                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => removeQuestion(index)}
                >
                  Remove
                </button>
              </div>

              <textarea
                className="form-control mb-3"
                placeholder="Enter question"
                value={q.question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
              />

              {/* OPTIONS */}
              <div className="row g-2">
                {q.options.map((opt, i) => (
                  <div className="col-md-6" key={i}>
                    <input
                      className="form-control"
                      placeholder={`Option ${i + 1}`}
                      value={opt}
                      onChange={(e) =>
                        handleOptionChange(index, i, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>

              {/* CORRECT ANSWER (INDEX BASED) */}
              <div className="mt-3">
                <label className="form-label">Correct Answer</label>

                <select
                  className="form-select"
                  value={q.correctAnswer}
                  onChange={(e) =>
                    handleCorrectAnswer(index, e.target.value)
                  }
                >
                  <option value="">Select correct answer</option>
                  {q.options.map((opt, i) => (
                    <option key={i} value={i}>
                      {opt || `Option ${i + 1}`}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          ))}

          {/* ACTION BUTTONS */}
          <div className="d-flex flex-column flex-md-row gap-2">

            <button
              type="button"
              className="btn btn-secondary"
              onClick={addQuestion}
            >
              + Add Question
            </button>

            <button type="submit" className="btn btn-primary">
              Create Exam
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default AdminExamPage;