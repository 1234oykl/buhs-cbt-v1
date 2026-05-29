
import { useState } from "react";
import api from "../config/api";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !className || !admissionNo) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/users/register", formData);

      setLoading(false);
      navigate("/login");
    } catch (err) {
      setLoading(false);

      setError(
        err.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-dark register-container">

      <div className="row w-100 justify-content-center">

        <div className="col-12 col-sm-10 col-md-7 col-lg-5">

          <div className="card shadow-lg border-0 rounded-4 register-card">

            <div className="card-body p-4">

              {/* HEADER */}
              <div className="text-center mb-3">
                <h2 className="fw-bold text-info">
                  BUHS CBT Portal
                </h2>
                <p className="text-muted mb-0">
                  Student Registration Portal
                </p>
              </div>

              <h4 className="text-center mb-3">
                Create Student Account
              </h4>

              {/* ERROR */}
              {error && (
                <div className="alert alert-danger text-center py-2">
                  {error}
                </div>
              )}

              {/* FORM */}
              <form onSubmit={handleSubmit}>

                {/* NAME */}
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    className="form-control form-control-lg"
                    placeholder="Enter Full Name"
                    required
                  />
                </div>

                {/* CLASS */}
                <div className="mb-3">
                  <label className="form-label">Class</label>
                  <input
                    type="text"
                    name="className"
                    value={className}
                    onChange={handleChange}
                    className="form-control form-control-lg"
                    placeholder="e.g SS1A"
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
                  className="btn btn-success w-100 btn-lg"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </button>

              </form>

              {/* LOGIN LINK */}
              <p className="text-center mt-3 mb-0">
                Already have an account?{" "}
                <Link to="/login" className="text-decoration-none">
                  Login
                </Link>
              </p>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Register;

