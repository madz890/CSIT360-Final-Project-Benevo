import { Heart, Mail } from "lucide-react";
import "../styles/footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="footer-logo"><Heart size={18} fill="currentColor" /> <strong>Benevo</strong></div>
          <p>A transparent donation platform connecting generous people with verified causes that truly matter.</p>
          <div className="footer-socials" aria-label="Social links">
            <button type="button" aria-label="Facebook">f</button>
            <button type="button" aria-label="Instagram">i</button>
            <button type="button" aria-label="LinkedIn">in</button>
            <button type="button" aria-label="Email"><Mail size={15} /></button>
          </div>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <a href="/campaigns">Campaigns</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#faq">FAQ</a>
          <a href="#privacy">Privacy Policy</a>
        </div>

        <div className="footer-links">
          <h3>Platform</h3>
          <a href="#how-it-works">How It Works</a>
          <a href="#verification">Verification</a>
          <a href="#transparency">Transparency Report</a>
          <a href="#blog">Blog</a>
          <a href="#partners">Partners</a>
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
