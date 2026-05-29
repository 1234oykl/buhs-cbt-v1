import { useNavigate } from "react-router-dom";

function ExamSubmitted() {
  const navigate = useNavigate();

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">

      <div className="card shadow-lg border-0 p-4 p-md-5 text-center" style={{ maxWidth: "500px", width: "100%" }}>

        <div className="mb-3">
          <h1 className="text-success fw-bold">
            ✅ Exam Submitted Successfully
          </h1>
        </div>

        <p className="text-muted mb-2">
          Your exam has been submitted successfully.
        </p>

        <p className="text-muted mb-4">
          Please wait for your result from the administrator.
        </p>

        <button
          className="btn btn-primary w-100 fw-bold py-2"
          onClick={() => navigate("/student-dashboard")}
        >
          Back to Dashboard
        </button>

      </div>

    </div>
  );
}

export default ExamSubmitted;