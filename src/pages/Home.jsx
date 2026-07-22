import { Link } from "react-router-dom";
import "../styles/home.css";

function Home() {
  return (
    <div className="home">
      <h1>Welcome to ADAid</h1>
      <p>
        A blockchain donation platform where every contribution is tied to a
        verifiable Cardano transaction and stored in Supabase for easy reporting
        and public transparency.
      </p>
      <div className="home-actions">
        <Link className="browse-btn" to="/campaigns">
          Browse Campaigns
        </Link>
        <Link className="secondary-btn" to="/auth">
          Register or Sign In
        </Link>
      </div>
    </div>
  );
}

export default Home;
