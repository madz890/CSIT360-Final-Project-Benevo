<<<<<<< Updated upstream
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { supabase } from "../supabaseClient";

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
=======
<<<<<<< Updated upstream
function Campaigns() {
  return <h1>Campaigns Page</h1>;
=======
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import CampaignCard from "../components/CampaignCard";
import "../styles/campaigns.css";

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Education",
    "Medical",
    "Disaster Relief",
    "Community",
    "Environment",
  ];
>>>>>>> Stashed changes

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
<<<<<<< Updated upstream
    const filtered = campaigns.filter((campaign) =>
      campaign.title.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredCampaigns(filtered);
  }, [search, campaigns]);
=======
    let filtered = campaigns;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (campaign) => campaign.category === selectedCategory
      );
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((campaign) =>
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCampaigns(filtered);
  }, [campaigns, selectedCategory, searchTerm]);
>>>>>>> Stashed changes

  async function fetchCampaigns() {
    setLoading(true);

    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
<<<<<<< Updated upstream
      // .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching campaigns:", error.message);
    } else {
      setCampaigns(data);
=======
      //.eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setCampaigns(data);
      setFilteredCampaigns(data);
>>>>>>> Stashed changes
    }

    setLoading(false);
  }

<<<<<<< Updated upstream
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading campaigns...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F4]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-green-900">
            Support Verified Causes
          </h1>

          <p className="mt-4 text-gray-600 max-w-2xl">
            Every donation is securely recorded on the Cardano blockchain,
            ensuring complete transparency and accountability.
          </p>

          {/* Search */}

          <div className="relative mt-8 max-w-xl">
            <Search
              size={20}
              className="absolute left-4 top-3.5 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-gray-300 py-3 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>
        </div>
      </section>

      {/* Campaigns */}

      <section className="max-w-7xl mx-auto px-6 py-12">
        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-24">
            <h2 className="text-3xl font-bold text-gray-700">
              No Campaigns Found
            </h2>

            <p className="mt-3 text-gray-500">
              There are currently no published campaigns.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredCampaigns.map((campaign) => {
              const percent =
                campaign.goal_amount > 0
                  ? Math.min(
                      (campaign.current_amount / campaign.goal_amount) * 100,
                      100
                    )
                  : 0;

              return (
                <div
                  key={campaign.id}
                  className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
                >
                  <img
                    src={
                      campaign.image_url ||
                      "https://placehold.co/600x400?text=Benevo"
                    }
                    alt={campaign.title}
                    className="h-56 w-full object-cover"
                  />

                  <div className="p-6">
                    <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                      {campaign.category}
                    </span>

                    <h2 className="mt-4 text-2xl font-bold text-gray-800">
                      {campaign.title}
                    </h2>

                    <p className="mt-3 text-gray-600 line-clamp-3">
                      {campaign.description}
                    </p>

                    {/* Progress */}

                    <div className="mt-6">
                      <div className="flex justify-between text-sm font-semibold">
                        <span>
                          ₳{" "}
                          {Number(campaign.current_amount).toLocaleString()}
                        </span>

                        <span>
                          Goal ₳{" "}
                          {Number(campaign.goal_amount).toLocaleString()}
                        </span>
                      </div>

                      <div className="mt-3 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-700 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="flex justify-between mt-3 text-sm text-gray-500">
                        <span>{percent.toFixed(0)}% Funded</span>

                        <span>{campaign.days_left} Days Left</span>
                      </div>
                    </div>

                    <button className="w-full mt-6 bg-green-800 hover:bg-green-900 text-white py-3 rounded-xl font-semibold transition">
                      Donate Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
=======
  return (
    <main className="campaigns-page">

{/* ================= HERO ================= */}

      <section className="campaigns-hero">
        <div className="container">

          <span className="section-tag">
            Explore Campaigns
          </span>

          <h1 className="campaigns-title">
            Discover Verified Campaigns
          </h1>

          <p className="campaigns-description">
            Find causes that inspire you and support them with secure, transparent
            donations.
          </p>

          <div className="campaign-tools">

            <input
              type="text"
              className="search-box"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="category-list">
              {categories.map((category) => (
                <button
                  key={category}
                  className={
                    selectedCategory === category
                      ? "category-btn active"
                      : "category-btn"
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* CAMPAIGNS */}

      <section className="campaigns-section">

        <div className="container">

          <div className="campaign-header">

            <h2>
              Active Campaigns
            </h2>

            <p>
              {filteredCampaigns.length} campaign
              {filteredCampaigns.length !== 1 && "s"} found
            </p>

          </div>

          {loading ? (
            <p className="loading">
              Loading campaigns...
            </p>
          ) : filteredCampaigns.length === 0 ? (
            <p className="loading">
              No campaigns found.
            </p>
          ) : (
            <div className="campaign-grid">

              {filteredCampaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                />
              ))}

            </div>
          )}

        </div>

      </section>

    </main>
  );
>>>>>>> Stashed changes
>>>>>>> Stashed changes
}

export default Campaigns;