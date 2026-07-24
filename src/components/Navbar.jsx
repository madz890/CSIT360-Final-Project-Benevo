import "../styles/navbar.css";
<<<<<<< Updated upstream
import { Heart } from "lucide-react";
=======
<<<<<<< Updated upstream
=======
import { Heart } from "lucide-react";
import { NavLink } from "react-router-dom";
>>>>>>> Stashed changes
>>>>>>> Stashed changes

export default function Navbar() {
  return (
<<<<<<< Updated upstream
    <header className="navbar-wrapper">
=======
<<<<<<< Updated upstream
    <nav className="navbar">
      <h2 className="logo">ADAid</h2>
>>>>>>> Stashed changes

      <div className="navbar">

<<<<<<< Updated upstream
        {/* Logo */}

        <div className="logo">

=======
      <button className="wallet-btn">
        Connect Wallet
      </button>
    </nav>
=======
    <header className="navbar-wrapper">
      <div className="navbar">

        {/* Logo */}
        <NavLink to="/" className="logo">
>>>>>>> Stashed changes
          <div className="logo-icon">
            <Heart fill="white" size={18} />
          </div>

          <h2>Benevo</h2>
<<<<<<< Updated upstream

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
=======
        </NavLink>

        {/* Navigation */}
        <nav>
          <ul className="nav-links">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/campaigns"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Campaigns
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                About
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="nav-right">

          <NavLink to="/campaigns" className="donate-btn">
            Donate Now
          </NavLink>
>>>>>>> Stashed changes

        </div>

      </div>
<<<<<<< Updated upstream

    </header>
=======
    </header>
>>>>>>> Stashed changes
>>>>>>> Stashed changes
  );
}