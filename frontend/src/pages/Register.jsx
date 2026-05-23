import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    className: "",
    admissionNo: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { name, className, admissionNo } = formData;

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  // =========================
  // HANDLE REGISTER
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !className || !admissionNo) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post(
        "http://127.0.0.1:5000/api/users/register",
        formData
      );

      setLoading(false);

      navigate("/login");

    } catch (err) {
      setLoading(false);

      console.log("FULL ERROR:", err);

      if (err.response) {
        setError(
          err.response.data.message ||
          "Registration failed"
        );
      } else {
        setError(
          "Server not reachable. Check backend."
        );
      }
    }
  };

  return (
    <div className="register-container">

      {/* REGISTER CARD */}
      <div className="register-card">

        {/* SCHOOL BRAND */}
        <div className="school-brand">

          <p className="school-subtitle">
            Student Registration Portal
          </p>
        </div>

        {/* TITLE */}
        <h1 className="register-title">
          Create Student Account
        </h1>

        {/* ERROR */}
        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {/* FORM */}
        <form
          className="register-form"
          onSubmit={handleSubmit}
        >

          {/* FULL NAME */}
          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              placeholder="Enter Full Name"
            />
          </div>

          {/* CLASS */}
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

          {/* ADMISSION NUMBER */}
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

          {/* BUTTON */}
          <button
            className="register-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner"></span>
            ) : (
              "Register"
            )}
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="register-link">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;