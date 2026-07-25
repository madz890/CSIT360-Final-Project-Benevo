import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchCampaigns } from "../lib/campaignService";
import "../styles/dashboard.css";

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns().then(setCampaigns);
  }, []);

  return (
    <div className="card">
      <h2>Browse campaigns</h2>
      <div className="campaign-list">
        {campaigns.map((campaign) => {
          const progress = Math.min(
            100,
            Math.round((campaign.current_amount / campaign.goal_amount) * 100),
          );
          return (
            <div key={campaign.id} className="card">
              {campaign.image_url ? (
                <img src={campaign.image_url} alt={campaign.title} />
              ) : null}
              <h3>{campaign.title}</h3>
              <p>{campaign.description}</p>
              <div className="progress-bar">
                <span style={{ width: `${progress}%` }} />
              </div>
              <p>
                {campaign.current_amount} / {campaign.goal_amount} ADA raised
              </p>
              <div className="home-actions">
                <Link className="browse-btn" to={`/campaign/${campaign.id}`}>
                  View details
                </Link>
                <button
                  className="secondary-btn"
                  onClick={() => navigate("/donate", { state: { campaign } })}
                >
                  Donate
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Campaigns;
