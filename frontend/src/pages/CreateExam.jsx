import { useState } from "react";
import api from "../config/api";
import "./CreateExam.css";

function CreateExam() {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [questions, setQuestions] = useState([]);

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
        marks: 1,
      },
    ]);
  };

  // =========================
  // UPDATE QUESTION
  // =========================
  const handleQuestionChange = (value, index) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  // =========================
  // UPDATE OPTIONS
  // =========================
  const handleOptionChange = (value, qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  // =========================
  // SET CORRECT ANSWER
  // =========================
  const setCorrectAnswer = (value, index) => {
    const updated = [...questions];
    updated[index].correctAnswer = value;
    setQuestions(updated);
  };

  // =========================
  // DELETE QUESTION
  // =========================
  const deleteQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  // =========================
  // SUBMIT EXAM
  // =========================
  const handleSubmit = async () => {
    try {
      // VALIDATION
      if (!title || !duration) {
        return alert("Title and duration are required");
      }

      if (questions.length === 0) {
        return alert("Add at least one question");
      }

      for (let q of questions) {
        if (
          !q.question ||
          q.options.some((opt) => opt.trim() === "") ||
          !q.correctAnswer
        ) {
          return alert("Please complete all questions properly");
        }
      }

      // GET ADMIN
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user || !user.token || !user.isAdmin) {
        alert("Admin login required");
        return;
      }

      // API CALL (DEPLOYMENT SAFE)
      await api.post(
        "/exams",
        {
          title,
          duration,
          questions,
          createdAt: new Date(),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert("Exam created successfully!");

      // RESET FORM
      setTitle("");
      setDuration("");
      setQuestions([]);

    } catch (err) {
      console.log(
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message ||
          "Error creating exam"
      );
    }
  };

  return (
    <div className="exam-builder">

      <h1>🧠 Advanced Exam Builder</h1>

      {/* BASIC INFO */}
      <div className="exam-info">

        <input
          placeholder="Exam Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <input
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(e) =>
            setDuration(e.target.value)
          }
        />

      </div>

      {/* QUESTIONS */}
      {questions.map((q, qIndex) => (
        <div
          key={qIndex}
          className="question-card"
        >

          <h3>
            Question {qIndex + 1}
          </h3>

          <input
            placeholder="Enter question"
            value={q.question}
            onChange={(e) =>
              handleQuestionChange(
                e.target.value,
                qIndex
              )
            }
          />

          {/* OPTIONS */}
          {q.options.map(
            (opt, optIndex) => (
              <div
                key={optIndex}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >

                <input
                  placeholder={`Option ${
                    optIndex + 1
                  }`}
                  value={opt}
                  onChange={(e) =>
                    handleOptionChange(
                      e.target.value,
                      qIndex,
                      optIndex
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setCorrectAnswer(
                      opt,
                      qIndex
                    )
                  }
                  style={{
                    background:
                      q.correctAnswer ===
                      opt
                        ? "green"
                        : "#ccc",
                    color:
                      q.correctAnswer ===
                      opt
                        ? "white"
                        : "black",
                    padding: "5px",
                  }}
                >
                  {q.correctAnswer ===
                  opt
                    ? "✔ Correct"
                    : "Mark Correct"}
                </button>

              </div>
            )
          )}

          {/* DELETE QUESTION */}
          <button
            onClick={() =>
              deleteQuestion(qIndex)
            }
          >
            ❌ Delete Question
          </button>

        </div>
      ))}

      {/* ACTIONS */}
      <div className="actions">

        <button onClick={addQuestion}>
          ➕ Add Question
        </button>

        <button onClick={handleSubmit}>
          💾 Save Exam
        </button>

      </div>

    </div>
  );
}

export default CreateExam;