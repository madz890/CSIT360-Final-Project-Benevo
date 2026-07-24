import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import CampaignCard from "../components/CampaignCard";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

import "../styles/home.css";

export default function Home() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch campaigns when the page loads
  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    setLoading(true);

    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      // .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setCampaigns(data);
    }

    setLoading(false);
  }

  return (
    <>
      <Hero />

<section className="featured">

  <div className="container">

    <span className="featured-tag">
      Featured Campaigns
    </span>

    <h2 className="section-title">
      Support Verified Causes
    </h2>

    <p className="featured-description">
      Every campaign on Benevo is carefully reviewed before it reaches
      our community. Donations are securely recorded on the Cardano
      blockchain for complete transparency.
    </p>

    <div className="campaign-filter">

      <button className="active">All</button>

      <button>Medical</button>

      <button>Education</button>

      <button>Disaster Relief</button>

      <button>Community</button>

    </div>

    {loading ? (

      <div className="loading">

        Loading campaigns...

      </div>

    ) : (

      <div className="campaign-grid">

        {campaigns.map((campaign) => (

          <CampaignCard
            key={campaign.id}
            campaign={campaign}
          />

        ))}

      </div>

    )}

    <div className="view-all">

      <button className="primary-btn">

        View All Campaigns

      </button>

    </div>

  </div>

</section>

{/* ================= HOW IT WORKS ================= */}

<section className="how-it-works">
  <div className="container">

    <span className="section-tag">
      How It Works
    </span>

    <h2 className="section-title">
      Donate with Confidence
    </h2>

    <p className="section-description">
      Benevo uses Cardano blockchain technology to ensure every donation
      is secure, transparent, and traceable from start to finish.
    </p>

    <div className="steps">

      <div className="step-card">

        <div className="step-number">
          01
        </div>

        <h3>Create or Discover</h3>

        <p>
          Browse verified campaigns or launch your own fundraiser with
          supporting documents.
        </p>

      </div>

      <div className="step-arrow">
        →
      </div>

      <div className="step-card">

        <div className="step-number">
          02
        </div>

        <h3>Donate Securely</h3>

        <p>
          Make donations using Cardano while every transaction is
          securely recorded on the blockchain.
        </p>

      </div>

      <div className="step-arrow">
        →
      </div>

      <div className="step-card">

        <div className="step-number">
          03
        </div>

        <h3>Track the Impact</h3>

        <p>
          Follow campaign updates and verify where your donations went
          through complete transparency.
        </p>

      </div>

    </div>

  </div>
</section>

{/* ================= TRANSPARENCY ================= */}

<section className="transparency">

  <div className="container transparency-container">

    <div className="transparency-left">

      <span className="section-tag">
        Blockchain Transparency
      </span>

      <h2 className="section-title">
        Every Donation is
        <span> Verifiable</span>
      </h2>

      <p className="section-description left">
        Every contribution made through Benevo is securely recorded on
        the Cardano blockchain, allowing donors to verify transactions,
        monitor campaign progress, and build trust through complete
        transparency.
      </p>

      <div className="feature-list">

        <div className="feature-item">
          <div className="feature-icon">✓</div>

          <div>
            <h4>Immutable Records</h4>
            <p>Transactions cannot be altered once recorded.</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">✓</div>

          <div>
            <h4>Secure Blockchain</h4>
            <p>Powered by Cardano's decentralized network.</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">✓</div>

          <div>
            <h4>Real-Time Tracking</h4>
            <p>Monitor every donation as campaigns progress.</p>
          </div>
        </div>

      </div>

    </div>

    <div className="transparency-right">

      <div className="blockchain-card">

        <span className="status">
          Verified Transaction
        </span>

        <h3>
          ₳250 Donation
        </h3>

        <div className="transaction">

          <p>Campaign</p>

          <strong>Medical Assistance Fund</strong>

        </div>

        <div className="transaction">

          <p>Transaction Hash</p>

          <strong>
            4af8...91bc...f24d
          </strong>

        </div>

        <div className="transaction">

          <p>Status</p>

          <strong className="success">
            Confirmed
          </strong>

        </div>

        <button className="secondary-btn">
          View on Cardano Explorer
        </button>

      </div>

    </div>

  </div>

</section>

{/* ================= WHY BENEVO ================= */}

<section className="why-benevo">

  <div className="container">

    <span className="section-tag">
      Why Choose Benevo
    </span>

    <h2 className="section-title">
      A Better Way to Give
    </h2>

    <p className="section-description">
      Benevo combines blockchain transparency with verified campaigns,
      giving donors confidence that every contribution makes a real impact.
    </p>

    <div className="benefits">

      <div className="benefit-card">
        <div className="benefit-icon">🔒</div>
        <h3>Secure Donations</h3>
        <p>
          Every transaction is protected through Cardano blockchain
          technology.
        </p>
      </div>

      <div className="benefit-card">
        <div className="benefit-icon">✔️</div>
        <h3>Verified Campaigns</h3>
        <p>
          Every fundraiser is reviewed before becoming visible to donors.
        </p>
      </div>

      <div className="benefit-card">
        <div className="benefit-icon">📊</div>
        <h3>Transparent Tracking</h3>
        <p>
          Follow donations from contribution to campaign completion.
        </p>
      </div>

      <div className="benefit-card">
        <div className="benefit-icon">❤️</div>
        <h3>Community Impact</h3>
        <p>
          Help communities grow through trusted and accountable giving.
        </p>
      </div>

    </div>

  </div>

</section>

{/* ================= CALL TO ACTION ================= */}

<section className="cta">

  <div className="container">

    <div className="cta-card">

      <span className="section-tag">
        Join Benevo Today
      </span>

      <h2>
        Ready to Make a Difference?
      </h2>

      <p>
        Whether you're supporting a verified campaign or starting one of
        your own, Benevo makes giving transparent, secure, and impactful
        through Cardano blockchain technology.
      </p>

      <div className="cta-buttons">

        <button className="primary-btn">
          Explore Campaigns
        </button>

        <button className="secondary-btn">
          Start a Campaign
        </button>

      </div>

    </div>

  </div>

</section>

    </>
  );
}