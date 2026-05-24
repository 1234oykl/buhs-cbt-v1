import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [student, setStudent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Fetch dashboard data
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

        // ✅ FIX: get ALL exams, backend should filter by class
        const examsRes = await axios.get(
          "http://localhost:5000/api/exams",
          config
        );

        const resultsRes = await axios.get(
          `http://localhost:5000/api/results/student/${user._id}`,
          config
        );

        setExams(examsRes.data || []);
        setResults(resultsRes.data || []);

        setLoading(false);
      } catch (err) {
        console.log(err.response?.data || err.message);
        setError("Failed to load dashboard");
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  // Filter exams (search + class match)
  const filteredExams = exams.filter((e) => {
    const searchMatch =
      (e.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.subject || "").toLowerCase().includes(search.toLowerCase());

    const classMatch =
      student?.className &&
      e.className &&
      student.className
        .toUpperCase()
        .startsWith(e.className.toUpperCase());

    return searchMatch && classMatch;
  });

  // Check if exam is completed
  const isExamCompleted = (examId) => {
    return results.some(
      (r) => r.exam?._id === examId || r.exam === examId
    );
  };

  // Open modal
  const openInstructions = (exam) => {
    setSelectedExam(exam);
    setShowModal(true);
  };

  // Start exam
  const startExam = () => {
    if (!selectedExam) return;

    setShowModal(false);
    navigate(`/exam/${selectedExam._id}`);
  };

  return (
    <div className="student-dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <p>
          Welcome, <b>{student?.name}</b>
        </p>
      </div>

      {/* STUDENT INFO */}
      <div className="student-info-card">
        <div>
          <p><b>Class:</b> {student?.className}</p>
          <p><b>Admission No:</b> {student?.admissionNo}</p>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* SEARCH */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search exam..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <h2 className="section-title">Available Exams</h2>

      {/* LOADING */}
      {loading && <p>Loading exams...</p>}

      {/* ERROR */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* EXAMS */}
      {!loading && filteredExams.length === 0 ? (
        <p>No exams available.</p>
      ) : (
        <div className="exam-grid">
          {filteredExams.map((exam) => {
            const completed = isExamCompleted(exam._id);

            return (
              <div className="exam-card" key={exam._id}>

                <h3>{exam.title}</h3>

                <div className="exam-meta">
                  <span className="badge subject">
                    {exam.subject || "No Subject"}
                  </span>
                  <span className="badge duration">
                    {exam.duration} mins
                  </span>
                  <span className="badge questions">
                    {exam.questions?.length || 0} Questions
                  </span>
                </div>

                <p className="exam-date">
                  📅 {exam.date
                    ? new Date(exam.date).toLocaleDateString()
                    : "No date"}
                </p>

                {completed && (
                  <p className="completed-badge">✅ Completed</p>
                )}

                <button
                  className="start-btn"
                  disabled={completed}
                  onClick={() => openInstructions(exam)}
                >
                  {completed ? "Completed" : "Start Exam"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      {showModal && selectedExam && (
        <div className="modal-overlay">
          <div className="modal-box">

            <h2>📌 Exam Instructions</h2>

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

            <button className="confirm-btn" onClick={startExam}>
              Start Now
            </button>

            <button
              className="cancel-btn"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default StudentDashboard;