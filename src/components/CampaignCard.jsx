import "../styles/campaignCard.css";
import { CalendarDays, ArrowRight } from "lucide-react";

export default function CampaignCard({ campaign }) {
  const progress =
    campaign.goal_amount > 0
      ? Math.min(
          Math.round(
            (Number(campaign.current_amount) / Number(campaign.goal_amount)) *
              100
          ),
          100
        )
      : 0;

  return (
    <article className="campaign-card">
      {/* Image */}
      <div className="campaign-image">
        <img
          src={
            campaign.image_url ||
            "https://placehold.co/600x400?text=No+Image"
          }
          alt={campaign.title}
        />

        <span className="campaign-category">
          {campaign.category}
        </span>
      </div>

      {/* Body */}
      <div className="campaign-body">
        <h3>{campaign.title}</h3>

        <p>{campaign.description}</p>

        {/* Progress */}
        <div className="campaign-progress">
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
        </div>

        {/* Footer */}
        <div className="campaign-footer">
          <div className="campaign-days">
            <CalendarDays size={17} />
            {campaign.days_left} days left
          </div>

          <strong>{progress}%</strong>
        </div>

        <button className="primary-btn campaign-btn">
          Donate Now
          <ArrowRight size={18} />
        </button>
      </div>
    </article>
  );
}