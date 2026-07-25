import { Link, NavLink, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import "../styles/navbar.css";

function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar">
        {/* Logo */}
        <NavLink to="/" className="logo">
          <div className="logo-icon">
            <Heart fill="white" size={18} />
          </div>

          <h2>Benevo</h2>
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

            {user && (
              <>
                <li>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Dashboard
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/create-campaign"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Create Campaign
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div className="nav-right">
          {user ? (
            <button className="donate-btn" onClick={handleSignOut}>
              Sign Out
            </button>
          ) : (
            <Link to="/auth" className="donate-btn">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
