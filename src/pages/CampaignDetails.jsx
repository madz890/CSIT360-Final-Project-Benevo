import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Check, CircleCheck, Copy, HeartHandshake, ShieldCheck, Users, Wallet } from "lucide-react";
import { fetchCampaignById } from "../lib/campaignService";
import { getCampaignDonations } from "../lib/donationService";
import Footer from "../components/Footer";
import "../styles/campaignDetails.css";

function CampaignDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState([]);
  const [donationsLoading, setDonationsLoading] = useState(true);
  const [showAllDonations, setShowAllDonations] = useState(false);
  const [copiedHash, setCopiedHash] = useState(null);

  useEffect(() => {
    let active = true;

    fetchCampaignById(id).then((data) => {
      if (active) {
        setCampaign(data);
        setLoading(false);
      }
    });

    getCampaignDonations(id).then((data) => {
      if (active) {
        setDonations(data);
        setDonationsLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [id]);

  const shortenHash = (hash) => {
    if (!hash) return "—";
    if (hash.length <= 12) return hash;
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHash(id);
      setTimeout(() => setCopiedHash(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Recently";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDonorName = (donation) => {
    const profiles = donation.profiles;
    if (!profiles) return "Anonymous";
    const orgName = profiles.organization_name;
    const fullName = profiles.full_name;
    if (orgName && orgName.trim()) return orgName;
    if (fullName && fullName.trim()) return fullName;
    return "Anonymous";
  };

  const getAvatarInitials = (donation) => {
    const name = getDonorName(donation);
    if (name === "Anonymous") return "?";
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return <main className="campaign-details-page"><p className="details-state">Loading campaign...</p></main>;
  }

  if (!campaign) {
    return (
      <>
        <main className="campaign-details-page">
          <section className="details-state">
            <h1>Campaign not found</h1>
            <p>This campaign may no longer be available.</p>
            <Link to="/campaigns" className="primary-btn">Browse Campaigns</Link>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const campaignAmount = Number(campaign.current_amount) || 0;
  const donationsSum = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const currentAmount = Math.max(campaignAmount, donationsSum);
  const goalAmount = Number(campaign.goal_amount) || 0;
  const progress = goalAmount > 0 ? Math.min(Math.round((currentAmount / goalAmount) * 100), 100) : 0;
  const organizer = campaign.profiles?.organization_name || campaign.profiles?.full_name || "Benevo verified organizer";

  return (
    <main className="campaign-details-page">
      <section className="details-hero">
        <div className="container">
          <Link className="back-link" to="/campaigns"><ArrowLeft size={18} /> Back to campaigns</Link>
          <div className="details-layout">
            <div className="details-image-wrap">
              <img
                src={campaign.image_url || "https://placehold.co/1200x800?text=Campaign"}
                alt={campaign.title}
                className="details-image"
              />
              <span className="details-category">{campaign.category}</span>
            </div>

            <div className="details-summary">
              <span className="details-verified"><CircleCheck size={17} /> Verified campaign</span>
              <h1>{campaign.title}</h1>
              <p>{campaign.description}</p>

              <div className="details-progress-copy">
                <strong>₳{currentAmount.toLocaleString()} raised</strong>
                <span>of ₳{goalAmount.toLocaleString()} goal</span>
              </div>
              <div className="details-progress"><span style={{ width: `${progress}%` }} /></div>
              <div className="details-stats">
                <span><strong>{progress}%</strong> funded</span>
                <span><CalendarDays size={16} /> {campaign.days_left ?? "Open"} {campaign.days_left ? "days left" : "campaign"}</span>
              </div>

              <button className="primary-btn details-donate" type="button" onClick={() => navigate("/donate", { state: { campaign } })}>
                <HeartHandshake size={19} /> Donate to this campaign
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="details-content container">
        <article className="details-story">
          <span className="section-tag">About this campaign</span>
          <h2>Every contribution brings this cause closer to its goal.</h2>
          <p>{campaign.description}</p>
          <p>Benevo records each donation through Cardano so supporters can give with confidence and follow a campaign’s progress transparently.</p>
        </article>

        <aside className="details-trust-card">
          <h2>Give with confidence</h2>
          <div><ShieldCheck size={21} /><span><strong>Blockchain verified</strong>Every transaction is traceable on Cardano.</span></div>
          <div><Wallet size={21} /><span><strong>Secure wallet donations</strong>Connect your Cardano wallet when you are ready.</span></div>
          <div><CircleCheck size={21} /><span><strong>Organized by {organizer}</strong>This campaign is part of the Benevo community.</span></div>
        </aside>
      </section>

      <section className="donations-section container">
        <div className="donations-header">
          <div>
            <span className="section-tag">Recent Donations</span>
            <h2 className="donations-title">
              {donations.length > 0
                ? `${donations.length} supporter${donations.length === 1 ? "" : "s"} so far`
                : "Support from the community"}
            </h2>
          </div>
          <span className="donations-icon"><Users size={24} /></span>
        </div>

        {donationsLoading ? (
          <div className="donations-loading">
            <HeartHandshake size={28} className="loading-spin" />
            <p>Loading donations...</p>
          </div>
        ) : donations.length === 0 ? (
          <div className="donations-empty">
            <div className="donations-empty-icon">
              <HeartHandshake size={36} />
            </div>
            <h3>No donations yet.</h3>
            <p>Be the first supporter of this campaign.</p>
            <button
              className="primary-btn donations-empty-btn"
              type="button"
              onClick={() => navigate("/donate", { state: { campaign } })}
            >
              Donate Now <HeartHandshake size={18} />
            </button>
          </div>
        ) : (
          <>
            <div className="donations-list">
              {(showAllDonations ? donations : donations.slice(0, 5)).map((donation) => (
                <article className="donation-card" key={donation.id}>
                  <div className="donation-card-top">
                    <div className="donation-avatar">
                      {getAvatarInitials(donation)}
                    </div>
                    <div className="donation-info">
                      <strong className="donation-name">{getDonorName(donation)}</strong>
                      <span className="donation-date">{formatDate(donation.created_at)}</span>
                    </div>
                    <div className="donation-amount">
                      ₳{Number(donation.amount || 0).toLocaleString()}
                    </div>
                  </div>
                  {donation.tx_hash && (
                    <div className="donation-tx">
                      <span className="donation-tx-label">Tx:</span>
                      <code className="donation-tx-hash">{shortenHash(donation.tx_hash)}</code>
                      <button
                        type="button"
                        className="donation-copy-btn"
                        onClick={() => copyToClipboard(donation.tx_hash, donation.id)}
                        aria-label="Copy transaction hash"
                        title="Copy transaction hash"
                      >
                        {copiedHash === donation.id ? (
                          <Check size={15} />
                        ) : (
                          <Copy size={15} />
                        )}
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
            {donations.length > 5 && (
              <div className="donations-expand">
                <button
                  type="button"
                  className="secondary-btn donations-expand-btn"
                  onClick={() => setShowAllDonations((prev) => !prev)}
                >
                  {showAllDonations ? "Show Less" : `View All Donations (${donations.length})`}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
    </main>
  );
}

export default CampaignDetails;
