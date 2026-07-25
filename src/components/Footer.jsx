import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="footer-logo"><Heart size={18} fill="currentColor" /> <strong>Benevo</strong></div>
          <p>A transparent donation platform connecting generous people with verified causes that truly matter.</p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/campaigns">Campaigns</Link>
          <Link to="/create-campaign">Create campaign</Link>
          <Link to="/donate">Donate</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Benevo. All rights reserved.</span>
        <span>Trust · Transparency · Impact</span>
      </div>
    </footer>
  );
}

export default Footer;
