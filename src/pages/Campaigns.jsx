import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { fetchCampaigns } from "../lib/campaignService";
import CampaignCard from "../components/CampaignCard";
import Footer from "../components/Footer";
import "../styles/campaigns.css";

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns().then(setCampaigns);
  }, []);

  const categories = ["All", "Education", "Healthcare", "Environment", "Emergency", "Animals"];
  const normalizedSearch = search.trim().toLowerCase();
  const filteredCampaigns = campaigns
    .filter((campaign) => {
      const matchesCategory = selectedCategory === "All" || campaign.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = !normalizedSearch || [campaign.title, campaign.description, campaign.category]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch));
      return matchesCategory && matchesSearch;
    });

  return (
    <main className="campaigns-page">
      <section className="campaigns-hero">
        <div className="container">
          <h1>All Campaigns</h1>
          <p>Browse and support verified causes around the world.</p>
        </div>
      </section>

      <section className="campaigns-content container">
        <div className="campaigns-toolbar">
          <label className="campaign-search">
            <Search size={20} aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search campaigns..."
              aria-label="Search campaigns"
            />
          </label>
        </div>

        <div className="campaign-filter" aria-label="Filter campaigns by category">
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

        <p className="campaign-count">{filteredCampaigns.length} campaign{filteredCampaigns.length === 1 ? "" : "s"} found</p>

        <div className="campaigns-grid">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onDonate={() => navigate("/donate", { state: { campaign } })}
            />
          ))}
        </div>

        {filteredCampaigns.length === 0 ? <p className="campaign-empty">No campaigns match your search.</p> : null}
      </section>
      <Footer />
    </main>
  );
}

export default Campaigns;
