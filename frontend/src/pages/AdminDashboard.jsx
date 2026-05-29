
import { useEffect, useState } from "react";
import api from "../config/api";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("exams");
  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.token || !user.isAdmin) {
      navigate("/admin-login");
    }
  }, [navigate]);

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

        setResults(resultsRes.data || []);
        setExams(examsRes.data || []);
        setStudents(usersRes.data.filter((u) => !u.isAdmin));

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/admin-login");
  };

  return (
    <div className="container-fluid bg-light min-vh-100">

      <div className="row">

        {/* SIDEBAR */}
        <div className="col-12 col-md-3 col-lg-2 bg-dark text-white p-3">

          <h4 className="text-center mb-4">BUHS CBT</h4>

          <div className="list-group">

            <button
              className={`list-group-item list-group-item-action ${
                activeTab === "exams" ? "active" : ""
              }`}
              onClick={() => setActiveTab("exams")}
            >
              Exams
            </button>

            <button
              className={`list-group-item list-group-item-action ${
                activeTab === "results" ? "active" : ""
              }`}
              onClick={() => setActiveTab("results")}
            >
              Results
            </button>

            <button
              className={`list-group-item list-group-item-action ${
                activeTab === "students" ? "active" : ""
              }`}
              onClick={() => setActiveTab("students")}
            >
              Students
            </button>

          </div>

        </div>

        {/* MAIN */}
        <div className="col-12 col-md-9 col-lg-10 p-3">

          {/* TOP BAR */}
          <div className="d-flex justify-content-between align-items-center mb-3">

            <h3 className="fw-bold">Admin Dashboard</h3>

            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>

          </div>

          {/* STATS */}
          <div className="row g-3 mb-4">

            <div className="col-12 col-md-4">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h6>Total Students</h6>
                  <h3>{students.length}</h3>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h6>Total Exams</h6>
                  <h3>{exams.length}</h3>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h6>Total Results</h6>
                  <h3>{results.length}</h3>
                </div>
              </div>
            </div>

          </div>

          {/* CONTENT */}
          {loading ? (
            <p>Loading data...</p>
          ) : (
            <>
              {/* EXAMS */}
              {activeTab === "exams" && (
                <div>

                  <div className="d-flex justify-content-between mb-3">
                    <h4>Exams</h4>

                    <button
                      className="btn btn-primary"
                      onClick={() => navigate("/admin-add-exam")}
                    >
                      + Create Exam
                    </button>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead className="table-dark">
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
                            <td>{exam.questions?.length || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* RESULTS */}
              {activeTab === "results" && (
                <div>

                  <h4>Results</h4>

                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="table-dark">
                        <tr>
                          <th>Student</th>
                          <th>Exam</th>
                          <th>Score</th>
                        </tr>
                      </thead>

                      <tbody>
                        {results.map((r) => (
                          <tr key={r._id}>
                            <td>{r.student?.name}</td>
                            <td>{r.exam?.title}</td>
                            <td>{r.score}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* STUDENTS */}
              {activeTab === "students" && (
                <div>

                  <h4>Students</h4>

                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="table-dark">
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
                  </div>

                </div>
              )}
            </>
          )}

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;

