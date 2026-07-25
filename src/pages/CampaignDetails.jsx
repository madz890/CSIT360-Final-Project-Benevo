import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, CircleCheck, HeartHandshake, ShieldCheck, Wallet } from "lucide-react";
import { fetchCampaignById } from "../lib/campaignService";
import Footer from "../components/Footer";
import "../styles/campaignDetails.css";

function CampaignDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchCampaignById(id).then((data) => {
      if (active) {
        setCampaign(data);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [id]);

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

  const currentAmount = Number(campaign.current_amount) || 0;
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
      <Footer />
    </main>
  );
}

export default CampaignDetails;
