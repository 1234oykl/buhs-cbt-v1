import { useState } from "react";
import api from "../config/api"; // IMPORTANT FIX
import { useNavigate, Link } from "react-router-dom";
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

      console.log("LOGIN SUCCESS:", res.data);

      // Save user
      localStorage.setItem("user", JSON.stringify(res.data));

      // ROUTING FIX
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
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Student Login</h1>

        {error && <p className="error-message">{error}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Class</label>
            <input
              type="text"
              name="className"
              value={className}
              onChange={handleChange}
              placeholder="Enter Class (e.g SS1A)"
            />
          </div>

          <div className="form-group">
            <label>Admission Number</label>
            <input
              type="text"
              name="admissionNo"
              value={admissionNo}
              onChange={handleChange}
              placeholder="Enter Admission Number"
            />
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="login-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
