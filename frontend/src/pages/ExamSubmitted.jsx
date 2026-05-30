import { useNavigate } from "react-router-dom";
import "./ExamSubmitted.css";

function ExamSubmitted() {
  const navigate = useNavigate();

  return (
    <div className="submitted-container">
      <div className="submitted-card">
        <h1>✅ Exam Submitted Successfully</h1>

        <p>
          Your exam has been submitted successfully.
        </p>

        <p>
          Please wait for your result from the administrator.
        </p>

        <button onClick={() => navigate("/studentdashboard")}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default ExamSubmitted;