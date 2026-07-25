import { Link, useNavigate } from "react-router-dom";
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
    <nav className="navbar">
      <h2 className="logo">ADAid</h2>

      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        {user ? (
          <>
            <li>
              <Link to="/campaigns">Campaigns</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/create-campaign">Create Campaign</Link>
            </li>
          </>
        ) : null}
      </ul>

      <div className="nav-actions">
        {user ? (
          <button className="wallet-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        ) : (
          <Link className="wallet-btn" to="/auth">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
