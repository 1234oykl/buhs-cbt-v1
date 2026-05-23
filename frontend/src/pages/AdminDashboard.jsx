import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("exams");

  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);

  // CHECK ADMIN LOGIN
  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin"));

    if (!admin || !admin.token || !admin.isAdmin) {
      navigate("/admin-login");
    }
  }, [navigate]);

  // FETCH DATA
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const admin = JSON.parse(localStorage.getItem("admin"));

        if (!admin) {
          navigate("/admin-login");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        };

        // FETCH ALL
        const resultsRes = await axios.get(
          "http://127.0.0.1:5000/api/results",
          config
        );

        const examsRes = await axios.get(
          "http://127.0.0.1:5000/api/exams",
          config
        );

        const usersRes = await axios.get(
          "http://127.0.0.1:5000/api/users/all",
          config
        );

        setResults(resultsRes.data || []);
        setExams(examsRes.data || []);

        const onlyStudents = usersRes.data.filter(
          (user) => !user.isAdmin
        );

        setStudents(onlyStudents);

        setLoading(false);
      } catch (error) {
        console.log(
          "ADMIN DASHBOARD ERROR:",
          error.response?.data || error.message
        );

        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin-login");
  };

  return (
    <div className="admin-dashboard">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">BUHS CBT</h2>

        <ul className="menu">
          <li
            className={activeTab === "exams" ? "active" : ""}
            onClick={() => setActiveTab("exams")}
          >
            Exams
          </li>

          <li
            className={activeTab === "results" ? "active" : ""}
            onClick={() => setActiveTab("results")}
          >
            Results
          </li>

          <li
            className={activeTab === "students" ? "active" : ""}
            onClick={() => setActiveTab("students")}
          >
            Students
          </li>
        </ul>
      </div>

      {/* MAIN */}
      <div className="main-content">
        {/* TOP */}
        <div className="top-bar">
          <h1>Admin Dashboard</h1>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* STATS */}
        <div className="stats-cards">
          <div className="card">
            <h3>Total Students</h3>
            <p>{students.length}</p>
          </div>

          <div className="card">
            <h3>Total Exams</h3>
            <p>{exams.length}</p>
          </div>

          <div className="card">
            <h3>Total Results</h3>
            <p>{results.length}</p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="content-box">
          {loading ? (
            <p>Loading data...</p>
          ) : (
            <>
              {/* EXAMS */}
              {activeTab === "exams" && (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <h2>Exams</h2>

                    <button
                      className="create-btn"
                      onClick={() => navigate("/admin-add-exam")}
                    >
                      + Create Exam
                    </button>
                  </div>

                  {exams.length === 0 ? (
                    <p>No exams available</p>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Duration</th>
                          <th>Questions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {exams.map((exam) => (
                          <tr key={exam._id}>
                            <td>{exam.title}</td>
                            <td>{exam.duration} mins</td>
                            <td>{exam.questions?.length}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </>
              )}

              {/* RESULTS */}
              {activeTab === "results" && (
                <>
                  <h2>Results</h2>

                  {results.length === 0 ? (
                    <p>No results available</p>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Exam</th>
                          <th>Score</th>
                        </tr>
                      </thead>

                      <tbody>
                        {results.map((result) => (
                          <tr key={result._id}>
                            <td>{result.student?.name}</td>
                            <td>{result.exam?.title}</td>
                            <td>{result.score}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </>
              )}

              {/* STUDENTS */}
              {activeTab === "students" && (
                <>
                  <h2>Students</h2>

                  {students.length === 0 ? (
                    <p>No students found</p>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Class</th>
                          <th>Admission No</th>
                        </tr>
                      </thead>

                      <tbody>
                        {students.map((student) => (
                          <tr key={student._id}>
                            <td>{student.name}</td>
                            <td>{student.className}</td>
                            <td>{student.admissionNo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;