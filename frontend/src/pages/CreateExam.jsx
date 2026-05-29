import { useState } from "react";

function CreateExam() {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: null,
      },
    ]);
  };

  const handleQuestionChange = (value, i) => {
    const updated = [...questions];
    updated[i].question = value;
    setQuestions(updated);
  };

  const handleOptionChange = (value, qi, oi) => {
    const updated = [...questions];
    updated[qi].options[oi] = value;
    setQuestions(updated);
  };

  const setCorrectAnswer = (qi, oi) => {
    const updated = [...questions];
    updated[qi].correctAnswer = oi;
    setQuestions(updated);
  };

  const deleteQuestion = (i) => {
    setQuestions(questions.filter((_, index) => index !== i));
  };

  return (
    <div className="container py-4">

      {/* ===== HEADER ===== */}
      <h2 className="text-center fw-bold mb-4">
        🧠 CBT Exam Builder
      </h2>

      {/* ===== EXAM INFO ===== */}
      <div className="card shadow-sm p-3 mb-4">
        <div className="row g-3">

          <div className="col-md-6">
            <label className="form-label">Exam Title</label>
            <input
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter exam title"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Duration (minutes)</label>
            <input
              type="number"
              className="form-control"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g 60"
            />
          </div>

        </div>
      </div>

      {/* ===== QUESTIONS ===== */}
      {questions.map((q, i) => (
        <div key={i} className="card shadow-sm p-3 mb-3">

          {/* QUESTION HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">Question {i + 1}</h5>

            <button
              className="btn btn-danger btn-sm"
              onClick={() => deleteQuestion(i)}
            >
              Delete
            </button>
          </div>

          {/* QUESTION INPUT */}
          <textarea
            className="form-control mb-3"
            placeholder="Enter question"
            value={q.question}
            onChange={(e) =>
              handleQuestionChange(e.target.value, i)
            }
          />

          {/* OPTIONS */}
          <div className="row g-2">

            {q.options.map((opt, oi) => (
              <div className="col-md-6" key={oi}>

                <div className="input-group">

                  <input
                    className="form-control"
                    placeholder={`Option ${oi + 1}`}
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(
                        e.target.value,
                        i,
                        oi
                      )
                    }
                  />

                  <button
                    type="button"
                    className={`btn ${
                      q.correctAnswer === oi
                        ? "btn-success"
                        : "btn-outline-secondary"
                    }`}
                    onClick={() =>
                      setCorrectAnswer(i, oi)
                    }
                  >
                    ✔
                  </button>

                </div>

              </div>
            ))}

          </div>

        </div>
      ))}

      {/* ===== ACTIONS ===== */}
      <div className="d-flex justify-content-between mt-4">

        <button
          className="btn btn-success"
          onClick={addQuestion}
        >
          ➕ Add Question
        </button>

        <button
          className="btn btn-primary"
          onClick={() => console.log(questions)}
        >
          💾 Save Exam
        </button>

      </div>

    </div>
  );
}

export default CreateExam;