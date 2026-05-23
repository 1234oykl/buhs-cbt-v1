import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const go = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return navigate("/login");

    if (user.isAdmin) navigate("/admin-dashboard");
    else navigate("/student-dashboard");
  };

  return (
    <div className="home">
      <div className="top-banner">
        <div className="fade-left"></div>

        <div className="ticker">
          <div className="ticker-track">
            🚀 Welcome to BUHS CBT Platform • 🧠 Practice Anytime, Anywhere • 🔒
            Secure Examination System • ⚡ Fast & Reliable Performance • 📊
            Track Your Progress Easily •
          </div>
        </div>

        <div className="fade-right"></div>
      </div>
      <div className="overlay">
        <div className="card">
          <h1>Welcome to BUHS CBT Portal</h1>
          <p>Computer Based Testing System</p>
          <Link to="/login">
            <button className="cta-btn">Go to Student Dashboard →</button>
          </Link>
          <Link to="/admin-login">
            <button className="cta-btn">Go to Admin Dashboard →</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
