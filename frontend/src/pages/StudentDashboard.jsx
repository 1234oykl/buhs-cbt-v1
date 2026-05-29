
import { useEffect, useState } from "react";
import api from "../config/api";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./StudentDashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [student, setStudent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user?.token) {
          navigate("/login");
          return;
        }

        setStudent(user);

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const examsRes = await api.get("/exams", config);
        const resultsRes = await api.get(
          `/results/student/${user._id}`,
          config
        );

        setExams(examsRes.data || []);
        setResults(resultsRes.data || []);

        setLoading(false);
      } catch (err) {
        setError("Failed to load dashboard");
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const isExamCompleted = (examId) => {
    return results.some(
      (r) => r.exam?._id === examId || r.exam === examId
    );
  };

  const filteredExams = exams.filter((e) => {
    const searchMatch =
      (e.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.subject || "").toLowerCase().includes(search.toLowerCase());

    const classMatch =
      student?.className &&
      e.className &&
      student.className
        .trim()
        .toUpperCase()
        .startsWith(e.className.trim().toUpperCase());

    return searchMatch && classMatch;
  });

  const openInstructions = (exam) => {
    setSelectedExam(exam);
    setShowModal(true);
  };

  const startExam = () => {
    setShowModal(false);
    navigate(`/exam/${selectedExam._id}`);
  };

  return (
    <div className="container-fluid py-3 bg-light min-vh-100">

      {/* HEADER */}
      <div className="text-center mb-3">
        <h2 className="fw-bold text-primary">Student Dashboard</h2>
        <p className="mb-0">
          Welcome, <b>{student?.name}</b>
        </p>
      </div>

      {/* STUDENT INFO */}
      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center">

          <div>
            <p className="mb-1">
              <b>Class:</b> {student?.className}
            </p>
            <p className="mb-0">
              <b>Admission No:</b> {student?.admissionNo}
            </p>
          </div>

          <button
            className="btn btn-danger mt-2 mt-md-0"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search exam..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <h4 className="mb-3 fw-bold">Available Exams</h4>

      {/* LOADING / ERROR */}
      {loading && <p>Loading exams...</p>}
      {error && <p className="text-danger">{error}</p>}

      {/* EXAMS GRID */}
      <div className="row g-3">
        {filteredExams.map((exam) => {
          const completed = isExamCompleted(exam._id);

          return (
            <div className="col-12 col-md-6 col-lg-4" key={exam._id}>

              <div className="card h-100 shadow-sm">

                <div className="card-body">

                  <h5 className="fw-bold">{exam.title}</h5>

                  <div className="d-flex flex-wrap gap-2 my-2">
                    <span className="badge bg-primary">
                      {exam.subject || "No Subject"}
                    </span>
                    <span className="badge bg-secondary">
                      {exam.duration} mins
                    </span>
                    <span className="badge bg-info text-dark">
                      {exam.questions?.length || 0} Questions
                    </span>
                  </div>

                  <p className="mb-2">
                    📅{" "}
                    {exam.date
                      ? new Date(exam.date).toLocaleDateString()
                      : "No date"}
                  </p>

                  {completed && (
                    <span className="badge bg-success mb-2">
                      Completed
                    </span>
                  )}

                  <button
                    className="btn btn-primary w-100"
                    disabled={completed}
                    onClick={() => openInstructions(exam)}
                  >
                    {completed ? "Completed" : "Start Exam"}
                  </button>

                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {showModal && selectedExam && (
        <div className="modal show d-block bg-dark bg-opacity-75">

          <div className="modal-dialog modal-dialog-centered">

            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Exam Instructions</h5>
              </div>

              <div className="modal-body">

                <p><b>Exam:</b> {selectedExam.title}</p>
                <p><b>Subject:</b> {selectedExam.subject}</p>
                <p><b>Duration:</b> {selectedExam.duration} mins</p>
                <p>
                  <b>Total Questions:</b>{" "}
                  {selectedExam.questions?.length || 0}
                </p>

                <hr />

                <ul>
                  <li>Do not refresh the page.</li>
                  <li>Do not switch tabs.</li>
                  <li>Ensure stable internet connection.</li>
                  <li>No retake after submission.</li>
                </ul>

              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-success"
                  onClick={startExam}
                >
                  Start Now
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default StudentDashboard;

