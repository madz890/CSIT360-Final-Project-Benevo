import { ArrowRight, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/campaignCard.css";

function CampaignCard({ campaign, onDonate }) {
  const currentAmount = Number(campaign.current_amount) || 0;
  const goalAmount = Number(campaign.goal_amount) || 0;
  const progress =
    goalAmount > 0 ? Math.min(Math.round((currentAmount / goalAmount) * 100), 100) : 0;

  return (
    <article className="campaign-card">
      <div className="campaign-image">
        <img
          src={campaign.image_url || "https://placehold.co/600x400?text=No+Image"}
          alt={campaign.title}
        />
        <span className="campaign-category">{campaign.category}</span>
      </div>

      <div className="campaign-body">
        <h3>{campaign.title}</h3>
        <p>{campaign.description}</p>

        <div className="campaign-progress">
          <div className="progress-text">
            <span>₳{currentAmount.toLocaleString()}</span>
            <span>Goal ₳{goalAmount.toLocaleString()}</span>
          </div>
          <div className="progress-bar" aria-label={`${progress}% funded`}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="campaign-footer">
          <div className="campaign-days">
            <CalendarDays size={17} />
            {campaign.days_left ?? "—"} days left
          </div>
          <strong>{progress}%</strong>
        </div>

        <div className="campaign-actions">
          <button className="primary-btn campaign-btn" type="button" onClick={onDonate}>
            Donate
            <ArrowRight size={18} />
          </button>
          <Link className="secondary-btn campaign-btn campaign-details-btn" to={`/campaign/${campaign.id}`}>
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default CampaignCard;
