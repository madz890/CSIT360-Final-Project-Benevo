import { Link } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">ADAid</h2>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/campaigns">Campaigns</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
      </ul>

      <button className="wallet-btn">
        Connect Wallet
      </button>
    </nav>
  );
}

export default Navbar;