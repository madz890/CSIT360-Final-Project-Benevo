import "../styles/hero.css";

import {
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import heroImage from "../assets/benevo_hero.png";

export default function Hero() {
  return (
    <section className="hero">

      {/* Background Decorations */}

      <div className="hero-circle hero-circle-1"></div>
      <div className="hero-circle hero-circle-2"></div>

      <div className="container hero-content">

        {/* LEFT SIDE */}

        <div className="hero-text">

          <div className="hero-badge">

            <HeartHandshake size={18} />

            <span>Trusted by 250+ donors</span>

          </div>

          <h1>
            Transparency
            <br />

            <span> in Every Gift</span>

          </h1>

          <p>

            Empower lives through transparent blockchain donations.
            Every contribution is permanently recorded on Cardano,
            ensuring trust, accountability, and meaningful impact.

          </p>

          <div className="hero-buttons">

            <button className="primary-btn">
              Explore Campaigns
            </button>

            <button className="secondary-btn">
              Learn More
            </button>

          </div>

          {/* Statistics */}

          <div className="hero-stats">

            <div>

              <h2>32+</h2>

              <span>Campaigns</span>

            </div>

            <div>

              <h2>₳1.2M</h2>

              <span>Raised</span>

            </div>

            <div>

              <h2>250+</h2>

              <span>Donors</span>

            </div>

            <div>

              <h2>100%</h2>

              <span>Transparent</span>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="hero-image">

          <img
            src={heroImage}
            alt="Hero"
          />

          {/* Verification Card */}

          <div className="verify-card">

            <div className="verify-title">

              <CheckCircle2 />

              <h3>Verified Platform</h3>

            </div>

            <div className="verify-item">

              <ShieldCheck />

              Blockchain Verified

            </div>

            <div className="verify-item">

              <ShieldCheck />

              Secure Transactions

            </div>

            <div className="verify-item">

              <ShieldCheck />

              Transparent Donations

            </div>

          </div>

          {/* Donation Card */}

          <div className="donation-card">

            <img
              src="https://i.pravatar.cc/150?img=25"
              alt=""
            />

            <div>

              <p>Maria donated</p>

              <h2>₳250</h2>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}