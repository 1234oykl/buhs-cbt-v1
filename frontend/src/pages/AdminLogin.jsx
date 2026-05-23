import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      const res = await axios.post(
        "http://localhost:5000/api/users/admin/login",
        formData,
      );

      console.log("ADMIN LOGIN RESPONSE:", res.data);

      // ✅ SAVE ADMIN SESSION
      if (res.data.isAdmin) {
        localStorage.setItem("admin", JSON.stringify(res.data));
        navigate("/admin-dashboard");
      }
      console.log("STORED ADMIN:", localStorage.getItem("admin"));

      setLoading(false);

      // 🔥 IMPORTANT: SAFE REDIRECT CHECK
      if (res.data?.isAdmin) {
        navigate("/admin-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (err) {
      console.log(err.response?.data || err.message);

      setLoading(false);
      setError(err.response?.data?.message || "Admin login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Admin Login</h1>

        {error && <p className="error-message">{error}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter admin email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="login-link">
          Back to Student Login? <Link to="/login">Student Login</Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
