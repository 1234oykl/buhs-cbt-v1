import logo from "../assets/my-logo.png";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        <img
          src={logo}
          alt="My Logo"
          className="footer-logo"
        />

        <div>
          <span style={{color: 'yellow'}}>|</span>
        </div>

        <div className="footer-text-container">
          <p className="footer-text">
            Developed by AkodTech
          </p>

          <p className="footer-copy">
            © 2026 All Rights Reserved
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;