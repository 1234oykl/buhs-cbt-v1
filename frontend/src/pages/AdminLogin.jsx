import { useState } from "react";
import api from "../config/api";
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

    const email = formData.email.trim();
    const password = formData.password.trim();

    // ===== VALIDATION =====
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/users/admin/login", {
        email,
        password,
      });

      console.log("ADMIN LOGIN RESPONSE:", res.data);

      const { token, isAdmin, user } = res.data;

      if (!token) {
        setError("Invalid login response");
        return;
      }

      // ===== SAFE STORAGE =====
      localStorage.setItem(
        "user",
        JSON.stringify({
          token,
          isAdmin,
          user,
        })
      );

      setLoading(false);

      // ===== REDIRECT =====
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/login");
      }

    } catch (err) {
      setLoading(false);
      console.log(err.response?.data || err.message);
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
              autoComplete="username"
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
              autoComplete="current-password"
            />
          </div>

          <button
            className="login-btn"
            type="submit"
            disabled={loading}
          >
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