import { useState } from "react";
import api from "../config/api";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    className: "",
    admissionNo: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { className, admissionNo } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/users/login", {
        className,
        admissionNo,
      });

      localStorage.setItem("user", JSON.stringify(res.data));

      if (res.data.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/student-dashboard");
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-sm-10 col-md-6 col-lg-4">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-4">
              <h2 className="text-center mb-4 fw-bold text-primary">
                Student Login
              </h2>

              {error && (
                <div className="alert alert-danger py-2 text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* CLASS */}
                <div className="mb-3">
                  <label className="form-label">Class</label>
                  <input
                    type="text"
                    name="className"
                    value={className}
                    onChange={handleChange}
                    className="form-control form-control-lg"
                    placeholder="e.g SS1"
                    required
                  />
                </div>

                {/* ADMISSION NUMBER */}
                <div className="mb-3">
                  <label className="form-label">Admission Number</label>
                  <input
                    type="text"
                    name="admissionNo"
                    value={admissionNo}
                    onChange={handleChange}
                    className="form-control form-control-lg"
                    placeholder="Enter Admission Number"
                    required
                  />
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 btn-lg"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <p className="text-center mt-3 mb-0">
                Don't have an account?{" "}
                <Link to="/register" className="text-decoration-none">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
