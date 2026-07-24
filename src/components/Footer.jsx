import "../styles/footer.css";
import { Heart } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-top">

          <div className="footer-brand">

            <h2>
              <Heart fill="#F47A20" color="#F47A20" />
              Benevo
            </h2>

            <p>
              Secure, transparent, and blockchain-powered donations
              helping communities through verified campaigns.
            </p>

            <div className="footer-socials">

              <a href="#">
                <FaFacebookF />
              </a>

              <a href="#">
                <FaInstagram />
              </a>

              <a href="#">
                <FaTwitter />
              </a>

              <a href="#">
                <FaLinkedinIn />
              </a>

            </div>

          </div>

          <div className="footer-column">

            <h3>Quick Links</h3>

            <ul>

              <li><a href="#">Campaigns</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">FAQ</a></li>

            </ul>

          </div>

          <div className="footer-column">

            <h3>Platform</h3>

            <ul>

              <li><a href="#">How It Works</a></li>
              <li><a href="#">Blockchain</a></li>
              <li><a href="#">Transparency</a></li>
              <li><a href="#">Partners</a></li>

            </ul>

          </div>

          <div className="footer-column">

            <h3>Legal</h3>

            <ul>

              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms & Conditions</a></li>

            </ul>

          </div>

        </div>

        <div className="footer-bottom">

          <p>© 2026 Benevo. All rights reserved.</p>

          <p>
            <span>Trust</span> •
            <span> Transparency</span> •
            <span> Cardano Blockchain</span>
          </p>

        </div>

      </div>
    </footer>
  );
}