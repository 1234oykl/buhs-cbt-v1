import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">

      <div className="overlay">
        <div className="card">
          <h1>Welcome to BUHS CBT Portal</h1>
          <p>Computer Based Testing System</p>

          <Link to="/login">
            <button className="cta-btn">
              Go to Student Dashboard →
            </button>
          </Link>

          <Link to="/admin-login">
            <button className="cta-btn">
              Go to Admin Dashboard →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;