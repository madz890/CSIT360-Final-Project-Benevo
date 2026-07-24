import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CalendarDays, Target, Wallet } from "lucide-react";
import { supabase } from "../supabaseClient";
import "../styles/campaignDetails.css";

function CampaignDetails() {
  const { id } = useParams();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState(10);

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  async function fetchCampaign() {
    setLoading(true);

    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
    } else {
      setCampaign(data);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="campaign-details-page">
        <div className="container">
          <p className="loading">Loading campaign...</p>
        </div>
      </main>
    );
  }

  if (!campaign) {
    return (
      <main className="campaign-details-page">
        <div className="container">
          <p className="loading">Campaign not found.</p>
        </div>
      </main>
    );
  }

  const progress =
    campaign.goal_amount > 0
      ? Math.min(
          Math.round(
            (Number(campaign.current_amount) /
              Number(campaign.goal_amount)) *
              100
          ),
          100
        )
      : 0;

  return (
    <main className="campaign-details-page">

      <div className="container">

        <img
          className="campaign-banner"
          src={
            campaign.image_url ||
            "https://placehold.co/1200x500?text=No+Image"
          }
          alt={campaign.title}
        />

        <div className="campaign-content">

          {/* LEFT */}

          <div className="campaign-info">

            <span className="campaign-category">
              {campaign.category}
            </span>

            <h1>{campaign.title}</h1>

            <p className="campaign-description">
              {campaign.description}
            </p>

          </div>

          {/* RIGHT */}

          <aside className="donation-card">

            <h3>Campaign Progress</h3>

            <div className="progress-text">
              <span>
                ₳{Number(campaign.current_amount).toLocaleString()}
              </span>

              <span>
                Goal ₳{Number(campaign.goal_amount).toLocaleString()}
              </span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <h2>{progress}% Funded</h2>

            <div className="detail-item">
              <Target size={18} />
              Goal ₳{Number(campaign.goal_amount).toLocaleString()}
            </div>

            <div className="detail-item">
              <CalendarDays size={18} />
              {campaign.days_left} days left
            </div>

            <hr />

            <h3>Donation Amount</h3>

            <div className="amount-buttons">

              {[10, 25, 50, 100].map((amount) => (
                <button
                  key={amount}
                  className={
                    selectedAmount === amount
                      ? "amount-btn active"
                      : "amount-btn"
                  }
                  onClick={() => setSelectedAmount(amount)}
                >
                  ₳{amount}
                </button>
              ))}

            </div>

            <input
              type="number"
              className="amount-input"
              placeholder="Custom amount"
              value={selectedAmount}
              onChange={(e) =>
                setSelectedAmount(Number(e.target.value))
              }
            />

            <div className="wallet-status">
              ● Wallet Not Connected
            </div>

            <button className="secondary-btn wallet-btn">
              Connect Wallet
            </button>

            <button className="primary-btn donate-action">
              Donate ₳{selectedAmount}
            </button>

          </aside>

        </div>

      </div>

    </main>
  );
}

export default CampaignDetails;