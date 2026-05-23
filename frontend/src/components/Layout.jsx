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