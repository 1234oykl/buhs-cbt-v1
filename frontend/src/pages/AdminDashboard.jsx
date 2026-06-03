import { useEffect, useState } from "react";
import api from "../config/api";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("exams");

  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [classFilter, setClassFilter] = useState("ALL");

  const [analytics, setAnalytics] = useState([]);

  const [leaders, setLeaders] = useState([]);

  // CHECK ADMIN LOGIN
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.token || !user.isAdmin) {
      navigate("/admin-login");
    }
  }, [navigate]);

  // FETCH DASHBOARD DATA
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || !user.token) {
          navigate("/admin-login");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        // FETCH RESULTS
        const resultsRes = await api.get("/results", config);

        const leaderboardRes = await api.get("/results/leaderboard", config);

        // FETCH EXAMS
        const examsRes = await api.get("/exams", config);

        // FETCH USERS
        const usersRes = await api.get("/users/all", config);

        const analyticsRes = await api.get(
          "/results/analytics/subjects",
          config,
        );
        console.log("ANALYTICS RESPONSE:", analyticsRes.data);
        console.log("ANALYTICS DATA:", analyticsRes.data);

        // SET STATES
        setResults(resultsRes.data || []);
        setExams(examsRes.data || []);
        setAnalytics(analyticsRes.data.data || analyticsRes.data || []);
        setLeaders(leaderboardRes.data.data || leaderboardRes.data || []);

        // FILTER ONLY STUDENTS
        const onlyStudents = usersRes.data.filter((user) => !user.isAdmin);

        setStudents(onlyStudents);

        setLoading(false);
      } catch (error) {
        console.log(
          "ADMIN DASHBOARD ERROR:",
          error.response?.data || error.message,
        );

        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/admin-login");
  };

  const filteredResults =
    classFilter === "ALL"
      ? results
      : results.filter((r) => r.exam?.className === classFilter);

  return (
    <div className="admin-dashboard">
      {/* SIDEBAR */}
      <div className="sidebar">
        {/* <h2 className="logo">BUHS CBT</h2> */}

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

          <li
            className={activeTab === "analytics" ? "active" : ""}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </li>
        </ul>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        {/* TOP BAR */}
        <div className="top-bar">
          <h1>Admin Dashboard</h1>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* STATS */}
        <div className="stats-cards">
          <h2>🏆 Top 10 Students</h2>

          <div className="leaderboard">
            {Array.isArray(leaders) &&
              leaders.map((l, i) => (
                <p key={l._id}>
                  #{i + 1} {l.student?.name} - {l.score}
                </p>
              ))}
          </div>

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
          {activeTab === "analytics" && (
            <>
              <h2>Subject Performance</h2>

              {analytics.length === 0 ? (
                <p>No analytics data</p>
              ) : (
                <div className="analytics-box">
                  {Array.isArray(analytics) &&
                    analytics.map((a) => (
                      <p key={a.subject}>
                        {a.subject}: {a.average.toFixed(1)}
                      </p>
                    ))}
                </div>
              )}
            </>
          )}

          {loading ? (
            <p>Loading data...</p>
          ) : (
            <>
              {/* EXAMS TAB */}
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
                    <div className="table-wrapper">
                      <select onChange={(e) => setClassFilter(e.target.value)}>
                        <option value="ALL">All Classes</option>
                        <option value="JS1">JS1</option>
                        <option value="JS2">JS2</option>
                        <option value="JS3">JS3</option>
                        <option value="SS1">SS1</option>
                        <option value="SS2">SS2</option>
                        <option value="SS3">SS3</option>
                      </select>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Student</th>
                            <th>Exam</th>
                            <th>Class</th>
                            <th>Subject</th>
                            <th>Score</th>
                          </tr>
                        </thead>

                        <tbody>
                          {filteredResults.map((result) => {
                            console.log("RESULT ROW:", result);

                            return (
                              <tr key={result._id}>
                                <td>{result.student?.name}</td>
                                <td>{result.exam?.title}</td>

                                <td>
                                  {result.exam?.className || result.className}
                                </td>

                                <td>
                                  {result.exam?.subject || result.subject}
                                </td>

                                <td>{result.score}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}

              {/* RESULTS TAB */}
              {activeTab === "results" && (
                <>
                  <h2>Results</h2>

                  {results.length === 0 ? (
                    <p>No results available</p>
                  ) : (
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Student</th>
                            <th>Exam</th>
                            <th>Class</th>
                            <th>Subject</th>
                            <th>Score</th>
                          </tr>
                        </thead>

                        <tbody>
                          {results.map((result) => (
                            <tr key={result._id}>
                              <td>{result.student?.name}</td>
                              <td>{result.exam?.title}</td>
                              <td>
                                {result.className ||
                                  result.exam?.className ||
                                  "N/A"}
                              </td>
                              <td>
                                {result.subject ||
                                  result.exam?.subject ||
                                  "N/A"}
                              </td>
                              <td>{result.score}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}

              {/* STUDENTS TAB */}
              {activeTab === "students" && (
                <>
                  <h2>Students</h2>

                  {students.length === 0 ? (
                    <p>No students found</p>
                  ) : (
                    <div className="table-wrapper">
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
                    </div>
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
