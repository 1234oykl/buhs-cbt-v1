import { useEffect, useState } from "react";
import api from "../config/api";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./AdminDashboard.css";
import { rgba } from "framer-motion";

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("exams");

  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [leaders, setLeaders] = useState([]);

  const [classResults, setClassResults] = useState([]);

  const [loading, setLoading] = useState(true);
  const [examClassFilter, setExamClassFilter] = useState("ALL");
  const [resultClassFilter, setResultClassFilter] = useState("ALL");

  // ================= LOGIN CHECK =================
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.token || !user.isAdmin) {
      navigate("/admin-login");
    }
  }, [navigate]);

  // ================= FETCH DASHBOARD DATA =================
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user?.token) {
          navigate("/admin-login");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const resultsRes = await api.get("/results", config);
        const examsRes = await api.get("/exams", config);
        const usersRes = await api.get("/users/all", config);
        const leaderboardRes = await api.get("/results/leaderboard", config);
        const analyticsRes = await api.get(
          "/results/analytics/subjects",
          config,
        );

        setResults(resultsRes.data || []);
        setExams(examsRes.data || []);
        setAnalytics(analyticsRes.data || []);
        setLeaders(leaderboardRes.data || []);

        const onlyStudents = usersRes.data.filter((u) => !u.isAdmin);
        setStudents(onlyStudents);

        setLoading(false);
      } catch (err) {
        console.log("ADMIN ERROR:", err.response?.data || err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // ================= CLASS RESULT FETCH =================
  const fetchClassResults = async (className) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const res = await api.get(`/results/class/${className}`, config);

      setClassResults(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= GROUP CLASS RESULTS =================

  const classResultsWAEC = Array.isArray(results)
    ? results.filter((r) =>
        examClassFilter === "ALL"
          ? true
          : r.exam?.className === examClassFilter,
      )
    : [];

  // GROUP BY STUDENT
  const grouped = classResultsWAEC.reduce((acc, curr) => {
    const name = curr.student?.name || "Unknown";

    if (!acc[name]) {
      acc[name] = {
        name,
        results: [],
        total: 0,
      };
    }

    acc[name].results.push(curr);
    acc[name].total += curr.score || 0;

    return acc;
  }, {});

  // ================= PRINT =================
  const handlePrint = () => {
    window.print();
  };

  const downloadWAECOfficialPDF = async () => {
    const input = document.getElementById("waec-result");

    const canvas = await html2canvas(input, {
      scale: 2,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("WAEC_OFFICIAL_RESULT.pdf");
  };

  const studentsArray = Object.values(grouped || {})
    .sort((a, b) => b.total - a.total)
    .map((student, index) => ({
      ...student,
      position: index + 1,
      average: student.results.length
        ? (student.total / student.results.length).toFixed(2)
        : 0,
    }));

  const getGrade = (score) => {
    if (score >= 75) return "A1";
    if (score >= 70) return "B2";
    if (score >= 65) return "B3";
    if (score >= 60) return "C4";
    if (score >= 55) return "C5";
    if (score >= 50) return "C6";
    if (score >= 45) return "D7";
    if (score >= 40) return "E8";
    return "F9";
  };
  const filteredExams =
    examClassFilter === "ALL"
      ? results
      : results.filter(
          (r) =>
            r.student?.className === examClassFilter ||
            r.exam?.className === examClassFilter,
        );

  return (
    <div className="admin-dashboard">
      {/* SIDEBAR */}
      <div className="sidebar">
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

      {/* MAIN */}
      <div className="main-content">
        <div className="school-header">
          <div>
            <h1>Bacock Unversity High School CBT System</h1>
            <p>Computer Based Testing & Examination Management Platform</p>
          </div>

          <div>
            <strong>2025/2026 Academic Session</strong>
          </div>
        </div>
        <div className="top-bar">
          <h1 className="admindb">Admin Dashboard</h1>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/admin-login");
            }}
          >
            Logout
          </button>
        </div>

        {/* STATS */}
        <div className="dashboard-summary">
          <div className="summary-card">
            <h3>Total Students</h3>
            <p>{students.length}</p>
          </div>

          <div className="summary-card">
            <h3>Total Exams</h3>
            <p>{exams.length}</p>
          </div>

          <div className="summary-card">
            <h3>Total Results</h3>
            <p>{results.length}</p>
          </div>

          <div className="summary-card leaderboard-card">
            <h3>🏆 Top Students</h3>

            {leaders.slice(0, 5).map((l, i) => (
              <div key={l._id}>
                #{i + 1} {l.student?.name}
              </div>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="content-box">
          {/* ANALYTICS */}
          {activeTab === "analytics" && (
            <>
              <h2>Subject Performance</h2>

              {analytics.length === 0 ? (
                <p>No analytics data</p>
              ) : (
                <div>
                  {analytics.map((a) => (
                    <p key={a.subject}>
                      {a.subject}: {a.average.toFixed(1)}
                    </p>
                  ))}
                </div>
              )}
            </>
          )}

          {/* EXAMS */}
          {activeTab === "exams" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2>Exams</h2>

                <button
                  onClick={() => navigate("/admin-add-exam")}
                  className="create-btn"
                >
                  + Create Exam
                </button>
              </div>

              <table border="1" className="tb">
                <thead>
                  <tr className="gap-ros">
                    <th>Student</th>
                    <th>Exam</th>
                    <th>Class</th>
                    <th>Subject</th>
                    <th>Score</th>
                  </tr>
                </thead>

                <tbody>
                  {exams.map((r) => (
                    <tr key={r._id} className="gap-data">
                      <td>{r.student?.name}</td>
                      <td>{r.exam?.title}</td>
                      <td>{r.className || r.exam?.className}</td>
                      <td>{r.subject || r.exam?.subject}</td>
                      <td>{r.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* RESULTS (CLASS PRINT SYSTEM) */}
          {activeTab === "results" && (
            <>
              <h2>Class Result Sheet</h2>

              <select
                value={resultClassFilter}
                onChange={(e) => {
                  setResultClassFilter(e.target.value);
                  fetchClassResults(e.target.value);
                }}
              >
                <option value="ALL">All Classes</option>

                <option value="JS1A">JS1A</option>
                <option value="JS1B">JS1B</option>
                <option value="JS1C">JS1C</option>
                <option value="JS1D">JS1D</option>
                <option value="JS1E">JS1E</option>
                <option value="JS1F">JS1F</option>

                <option value="JS2A">JS2A</option>
                <option value="JS2B">JS2B</option>
                <option value="JS2C">JS2C</option>
                <option value="JS2D">JS2D</option>
                <option value="JS2E">JS2E</option>
                <option value="JS2F">JS2F</option>

                <option value="JS3A">JS3A</option>
                <option value="JS3B">JS3B</option>
                <option value="JS3C">JS3C</option>
                <option value="JS3D">JS3D</option>
                <option value="JS3E">JS3E</option>
                <option value="JS3F">JS3F</option>

                <option value="SS1A">SS1A</option>
                <option value="SS1B">SS1B</option>
                <option value="SS1C">SS1C</option>
                <option value="SS1D">SS1D</option>
                <option value="SS1E">SS1E</option>
                <option value="SS1F">SS1F</option>
                <option value="SS1G">SS1G</option>

                <option value="SS2A">SS2A</option>
                <option value="SS2B">SS2B</option>
                <option value="SS2C">SS2C</option>
                <option value="SS2D">SS2D</option>
                <option value="SS2E">SS2E</option>
                <option value="SS2F">SS2F</option>

                <option value="SS3A">SS3A</option>
                <option value="SS3B">SS3B</option>
                <option value="SS3C">SS3C</option>
                <option value="SS3D">SS3D</option>
                <option value="SS3E">SS3E</option>
                <option value="SS3F">SS3F</option>
              </select>

              <button
                onClick={downloadWAECOfficialPDF}
                style={{
                  marginLeft: 20,
                  padding: 10,
                  borderRadius: 5,
                  border: "none",
                  backgroundColor: "grey", color: "white"
                }}
              >
                Download BUHS Official Result
              </button>

              <div id="waec-result" style={{ background: "#fff", padding: 20 }}>
                <h2 style={{ textAlign: "center" }}>
                  BABCOCK UNIVERSITY HIGH SCHOOL EXAMINATION (BUHS)
                </h2>

                <h3>CLASS: {examClassFilter}</h3>

                <table border="1" width="100%" cellPadding="6">
                  <thead>
                    <tr>
                      <th>Position</th>
                      <th>Student</th>
                      <th>Total Score</th>
                      <th>Average</th>
                      <th>Grade</th>
                    </tr>
                  </thead>

                  <tbody>
                    {studentsArray.map((s) => (
                      <tr key={s.name}>
                        <td>{s.position}</td>
                        <td>{s.name}</td>
                        <td>{s.total}</td>
                        <td>{s.average}</td>
                        <td>{getGrade(s.average)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <hr />

                <h3>Subject Breakdown</h3>

                {studentsArray.map((s) => (
                  <div key={s.name}>
                    <h4>{s.name}</h4>

                    <table border="1" width="100%">
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Exam</th>
                          <th>Score</th>
                          <th>Grade</th>
                        </tr>
                      </thead>

                      <tbody>
                        {s.results.map((r) => (
                          <tr key={r._id}>
                            <td>{r.exam?.subject}</td>
                            <td>{r.exam?.title}</td>
                            <td>{r.score}</td>
                            <td>{getGrade(r.score)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <br />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* STUDENTS */}
          {activeTab === "students" && (
            <>
              <h2>Students</h2>

              <table border="1">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Admission No</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((s) => (
                    <tr key={s._id}>
                      <td>{s.name}</td>
                      <td>{s.className}</td>
                      <td>{s.admissionNo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
        <div className="dashboard-footer">
          <p>
            © 2026 Baptist Unity High School CBT Platform | Developed by
            AkodTech
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
