import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CircleCheck,
  HeartHandshake,
  ShieldCheck,
  WalletCards,
  Copy,
  Check,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { fetchUserDonations } from "../lib/donationService";
import Footer from "../components/Footer";
import "../styles/dashboard.css";

function shortenAddress(address) {
  return address && address.length > 20
    ? `${address.slice(0, 10)}…${address.slice(-8)}`
    : address || "Not connected";
}

function Dashboard() {
  const { user, profile } = useAuth();
  const [donations, setDonations] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetchUserDonations(user.id).then(setDonations);
  }, [user]);

  const handleCopy = (txHash, id) => {
    if (!txHash) return;
    navigator.clipboard.writeText(txHash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const name = profile?.full_name || user?.email?.split("@")[0] || "Donor";
  const totalDonated = donations.reduce(
    (total, donation) => total + (Number(donation.amount) || 0),
    0,
  );

  return (
    <>
      <main className="dashboard-page container">
        <section className="dashboard-welcome">
          <div>
            <span className="section-tag">Your Benevo space</span>
            <h1>Welcome back, {name}.</h1>
            <p>Track your giving and continue supporting transparent causes.</p>
          </div>
          <Link className="primary-btn dashboard-create" to="/create-campaign">
            Create a campaign <ArrowUpRight size={18} />
          </Link>
        </section>

        <section className="dashboard-stats" aria-label="Donation summary">
          <div className="dashboard-stat">
            <span className="dashboard-stat-icon">
              <HeartHandshake size={20} />
            </span>
            <div>
              <strong>₳{totalDonated.toLocaleString()}</strong>
              <span>Total donated</span>
            </div>
          </div>
          <div className="dashboard-stat">
            <span className="dashboard-stat-icon">
              <CircleCheck size={20} />
            </span>
            <div>
              <strong>{donations.length}</strong>
              <span>Donations made</span>
            </div>
          </div>
          <div className="dashboard-stat">
            <span className="dashboard-stat-icon">
              <ShieldCheck size={20} />
            </span>
            <div>
              <strong>100%</strong>
              <span>Transparent giving</span>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-card profile-card">
            <div className="dashboard-card-heading">
              <div>
                <span className="card-kicker">Account overview</span>
                <h2>Your profile</h2>
              </div>
              <span className="profile-avatar">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
            <dl className="profile-details">
              <div>
                <dt>Account</dt>
                <dd>{user?.email || "—"}</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd className="role-pill">{profile?.role || "donor"}</dd>
              </div>
              <div>
                <dt>
                  <WalletCards size={16} /> Connected wallet
                </dt>
                <dd className="wallet-address">
                  {shortenAddress(profile?.wallet_address)}
                </dd>
              </div>
            </dl>
          </article>

          <article className="dashboard-card donation-history">
            <div className="dashboard-card-heading">
              <div>
                <span className="card-kicker">Your activity</span>
                <h2>Donation history</h2>
              </div>
              <HeartHandshake className="history-icon" size={23} />
            </div>
            {donations.length === 0 ? (
              <div className="dashboard-empty">
                <HeartHandshake size={28} />
                <p>No donations recorded yet.</p>
                <Link to="/campaigns">Explore campaigns</Link>
              </div>
            ) : (
              <ul className="donation-list">
                {donations.map((donation) => (
                  <li key={donation.id}>
                    <span className="donation-mark">
                      <HeartHandshake size={17} />
                    </span>
                    <div>
                      <strong>
                        ₳{Number(donation.amount).toLocaleString()} to{" "}
                        {donation.campaigns?.title || "campaign"}
                      </strong>

                      {/* Using span container to prevent grid style breaking */}
                      <span className="tx-hash-wrapper">
                        <small
                          title={donation.tx_hash || "Pending verification"}
                        >
                          {shortenAddress(
                            donation.tx_hash || "Pending verification",
                          )}
                        </small>
                        {donation.tx_hash && (
                          <button
                            type="button"
                            className="tx-copy-btn"
                            onClick={() =>
                              handleCopy(donation.tx_hash, donation.id)
                            }
                            title="Copy full transaction hash"
                            aria-label="Copy full transaction hash"
                          >
                            {copiedId === donation.id ? (
                              <Check size={12} color="#16a34a" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        )}
                      </span>
                    </div>
                    <CircleCheck size={19} aria-label="Recorded" />
                  </li>
                ))}
              </ul>
            )}
          </article>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Dashboard;
