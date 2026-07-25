import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchCampaigns } from "../lib/campaignService";
import CampaignCard from "../components/CampaignCard";
import Footer from "../components/Footer";

import {
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import heroImage from "../assets/hero.png";
import "../styles/home.css";


function Home() {

const [campaigns, setCampaigns] = useState([]);
const [selectedCategory, setSelectedCategory] = useState("All");
const navigate = useNavigate();

useEffect(() => {
  fetchCampaigns().then((data) => {
    setCampaigns(data.slice(0, 3)); // only show 3 feat campaigns
  });
}, []);

const categories = ["All", "Education", "Healthcare", "Environment", "Emergency", "Animals"];
const featuredCampaigns = selectedCategory === "All"
  ? campaigns
  : campaigns.filter((campaign) => campaign.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <main className="home">
      <section className="hero">

        <div className="hero-circle hero-circle-1"></div>
        <div className="hero-circle hero-circle-2"></div>

        <div className="container hero-content">

          <div className="hero-text">

            <div className="hero-badge">
              <HeartHandshake size={18} />
              <span>Trusted by Cardano donors</span>
            </div>

            <h1>
              Transparency
              <br />
              <span>in Every Gift</span>
            </h1>

            <p>
              Empower lives through transparent blockchain donations.
              Every contribution is permanently recorded on Cardano,
              ensuring trust, accountability, and meaningful impact.
            </p>

            <div className="hero-buttons">

              <Link
                to="/campaigns"
                className="primary-btn"
              >
                Explore Campaigns
              </Link>

              <Link
                to="/auth"
                className="secondary-btn"
              >
                Get Started
              </Link>

            </div>

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

          <div className="hero-image">

            <img
              src={heroImage}
              alt="Benevo Hero"
            />

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

            <div className="donation-card">

              <img
                src="https://i.pravatar.cc/150?img=25"
                alt="Donor"
              />

              <div>
                <p>Latest Donation</p>
                <h2>₳250</h2>
              </div>

            </div>

          </div>

        </div>

      </section>

{/* featured campaigns */}

      <section className="featured">
        <div className="container">

          <h2 className="section-title">
            Featured Campaigns
          </h2>

          <p className="section-text">
            Support verified causes making real impact.
          </p>

          <div className="campaign-filter" aria-label="Filter featured campaigns">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={selectedCategory === category ? "active" : ""}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="campaign-grid">

            {featuredCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onDonate={() => navigate("/donate", { state: { campaign } })}
              />
            ))}

          </div>

          <div className="view-all">
            <Link
              to="/campaigns"
              className="primary-btn"
            >
              View All Campaigns
            </Link>
          </div>

        </div>
          </section>

{/* how it works */}


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

{/* transparency */}


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

{/* why benevo */}


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

// CTA

      <section className="cta">

        <div className="container">

          <div className="cta-card">
            <h2>
              Ready to Make a Difference?
            </h2>

            <p>
              Join 248+ donors who are creating real, transparent impact
              across the world.
            </p>

            <div className="cta-buttons">

              <Link to="/campaigns" className="primary-btn">
                Explore Campaigns
              </Link>

            </div>

          </div>

        </div>

      </section>

      <Footer />


    </main>
  );
}

export default Home;
