import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminExamPage.css";

function AdminAddExam() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState("");
  const [examDate, setExamDate] = useState("");

  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    },
  ]);

  // =========================
  // HANDLE QUESTION CHANGE
  // =========================
  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  // =========================
  // HANDLE OPTION CHANGE
  // =========================
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  // =========================
  // HANDLE CORRECT ANSWER
  // =========================
  const handleCorrectAnswer = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = value;
    setQuestions(updated);
  };

  // =========================
  // ADD QUESTION
  // =========================
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      },
    ]);
  };

  // =========================
  // REMOVE QUESTION
  // =========================
  const removeQuestion = (index) => {
    if (questions.length === 1) return;

    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  // =========================
  // SUBMIT EXAM
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !title ||
      !className ||
      !subject ||
      !duration ||
      !examDate
    ) {
      alert("Please fill all exam details.");
      return;
    }

    // Question validation
    for (let q of questions) {
      if (!q.question.trim()) {
        alert("Every question must have a question.");
        return;
      }

      if (q.options.some((opt) => opt.trim() === "")) {
        alert("All options must be filled.");
        return;
      }

      if (!q.correctAnswer) {
        alert("Please select the correct answer.");
        return;
      }
    }

    try {
      const admin = JSON.parse(localStorage.getItem("admin"));

      if (!admin || !admin.token) {
        alert("Admin login required");
        navigate("/admin-login");
        return;
      }

      const examData = {
        title,
        className,
        subject,
        duration: Number(duration),
        date: examDate,
        questions,
      };

      console.log("SENDING EXAM:", examData);

      await axios.post(
        "http://127.0.0.1:5000/api/exams",
        examData,
        {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        }
      );

      alert("Exam created successfully!");

      navigate("/admin-dashboard");
    } catch (err) {
      console.log("FULL ERROR:", err.response?.data || err.message);

      alert(
        err.response?.data?.message ||
          "Failed to create exam"
      );
    }
  };

  return (
    <div className="admin-add-exam">
      <h2>Create New Exam</h2>

      <form onSubmit={handleSubmit} className="exam-form">

        {/* EXAM TITLE */}
        <div className="form-group">
          <label>Exam Title</label>

          <input
            type="text"
            value={title}
            placeholder="Enter exam title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* CLASS */}
        <div className="form-group">
          <label>Class</label>

          <input
            type="text"
            value={className}
            placeholder="Enter class name (e.g SS1)"
            onChange={(e) => setClassName(e.target.value)}
          />
        </div>

        {/* SUBJECT */}
        <div className="form-group">
          <label>Subject</label>

          <input
            type="text"
            value={subject}
            placeholder="Enter subject"
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        {/* DURATION */}
        <div className="form-group">
          <label>Duration (minutes)</label>

          <input
            type="number"
            value={duration}
            placeholder="Enter duration"
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        {/* EXAM DATE */}
        <div className="form-group">
          <label>Exam Date</label>

          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
          />
        </div>

        <hr />

        <h3 style={{ color: "white" }}>Questions</h3>

        {questions.map((q, index) => (
          <div key={index} className="question-box">

            <div className="question-header">
              <h4 style={{ color: "white" }}>
                Question {index + 1}
              </h4>

              <button
                type="button"
                className="remove-btn"
                onClick={() => removeQuestion(index)}
              >
                Remove
              </button>
            </div>

            {/* QUESTION */}
            <textarea
              value={q.question}
              placeholder="Enter question..."
              onChange={(e) =>
                handleQuestionChange(index, e.target.value)
              }
            />

            {/* OPTIONS */}
            <div className="options-grid">
              {q.options.map((opt, optIndex) => (
                <input
                  key={optIndex}
                  type="text"
                  value={opt}
                  placeholder={`Option ${optIndex + 1}`}
                  onChange={(e) =>
                    handleOptionChange(
                      index,
                      optIndex,
                      e.target.value
                    )
                  }
                />
              ))}
            </div>

            {/* CORRECT ANSWER */}
            <div className="correct-answer">
              <label
                style={{
                  color: "white",
                  fontSize: "15px",
                }}
              >
                Correct Answer:
              </label>

              <select
                value={q.correctAnswer}
                onChange={(e) =>
                  handleCorrectAnswer(index, e.target.value)
                }
              >
                <option value="">
                  -- Select Correct Option --
                </option>

                {q.options.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt || `Option ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        {/* ADD QUESTION BUTTON */}
        <button
          type="button"
          className="add-btn"
          onClick={addQuestion}
        >
          + Add Another Question
        </button>

        {/* SUBMIT BUTTON */}
        <button type="submit" className="submit-btn">
          Create Exam
        </button>
      </form>
    </div>
  );
}

export default AdminAddExam;