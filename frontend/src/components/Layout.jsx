import { Link, Outlet } from "react-router-dom";
import logo from "../assets/school-logo.png";
import Footer from "./Footer";
import "./Layout.css";

function Layout() {
  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="app-header">
        <Link to="/" className="logo-link">
          <img src={logo} alt="logo" className="logo" />
          <h2>BUHS CBT PORTAL</h2>
        </Link>
      </header>

      <div className="top-banner">
        <div className="fade-left"></div>

        <div className="ticker">
          <div className="ticker-track">
            🚀 Welcome to BUHS CBT Platform • 🧠 Practice Anytime, Anywhere • 🔒
            Secure Examination System • ⚡ Fast & Reliable Performance • 📊
            Track Your Progress Easily • 🚀 Do not Refresh the Page • 🧠 Do not
            Switch Tabs • 🔒 No Retake After Submission•
          </div>
        </div>

        <div className="fade-right"></div>
      </div>

      {/* PAGE CONTENT */}
      <main className="app-body">
        <Outlet />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default Layout;
