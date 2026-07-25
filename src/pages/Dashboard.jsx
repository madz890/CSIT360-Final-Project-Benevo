import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { fetchUserDonations } from "../lib/donationService";
import "../styles/dashboard.css";

function Dashboard() {
  const { user, profile } = useAuth();
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    if (!user) return;
    fetchUserDonations(user.id).then(setDonations);
  }, [user]);

  return (
    <div className="dashboard-grid">
      <div className="card">
        <h2>Dashboard</h2>
        <p>Welcome back, {profile?.full_name || user?.email || "donor"}.</p>
        <p>Role: {profile?.role || "donor"}</p>
        <p>Wallet: {profile?.wallet_address || "Not connected"}</p>
        <Link className="button-link" to="/create-campaign">
          Create campaign
        </Link>
      </div>
      <div className="card">
        <h3>Your donation history</h3>
        {donations.length === 0 ? (
          <p>No donations recorded yet.</p>
        ) : (
          <ul>
            {donations.map((donation) => (
              <li key={donation.id}>
                <strong>{donation.amount} ADA</strong> to{" "}
                {donation.campaigns?.title || "campaign"}
                <br />
                <small>{donation.tx_hash || "Pending verification"}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
