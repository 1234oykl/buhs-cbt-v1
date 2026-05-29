import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="container-fluid home-page p-0">
      {/* TOP TICKER */}
      <div className="bg-dark text-white py-2 overflow-hidden">
        <div className="ticker-wrapper">
          <div className="ticker-text">
            🚀 Welcome to BUHS CBT Platform • 🧠 Practice Anytime, Anywhere • 🔒
            Secure Examination System • ⚡ Fast & Reliable Performance • 📊
            Track Your Progress Easily •
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-primary bg-gradient">
        <div className="card shadow-lg border-0 p-4 p-md-5 text-center home-card">
          <h1 className="fw-bold text-primary">Welcome to BUHS CBT Portal</h1>

          <p className="text-muted mb-4">Computer Based Testing System</p>

          {/* STUDENT LOGIN */}
          <Link to="/login" className="text-decoration-none">
            <div className="cta-group">
              <Link to="/login">
                <button className="cta-btn primary">Student Login</button>
              </Link>

              <Link to="/admin-login">
                <button className="cta-btn secondary">Admin Login</button>
              </Link>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
