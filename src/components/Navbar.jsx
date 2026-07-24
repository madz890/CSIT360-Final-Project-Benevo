import "../styles/navbar.css";
import { Heart } from "lucide-react";

export default function Navbar() {
  return (
    <header className="navbar-wrapper">

      <div className="navbar">

        {/* Logo */}

        <div className="logo">

          <div className="logo-icon">
            <Heart fill="white" size={18} />
          </div>

          <h2>Benevo</h2>

        </div>

        {/* Navigation */}

        <nav>

          <ul className="nav-links">

            <li>
              <a className="active" href="#">
                Home
              </a>
            </li>

            <li>
              <a href="#">
                Campaigns
              </a>
            </li>

            <li>
              <a href="#">
                About
              </a>
            </li>

            <li>
              <a href="#">
                Contact
              </a>
            </li>

          </ul>

        </nav>

        {/* Right Side */}

        <div className="nav-right">

          <button className="login-btn">
            Login
          </button>

          <button className="donate-btn">
            Start Campaign
          </button>

        </div>

      </div>

    </header>
  );
}