import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { createCampaign } from "../lib/campaignService";
import useFormState from "../hooks/useFormState";
import Footer from "../components/Footer";

const categories = [
  "Education",
  "Healthcare",
  "Environment",
  "Emergency",
  "Animals",
];

function CreateCampaign() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, handleChange] = useFormState({
    title: "",
    description: "",
    goalAmount: "",
    category: "Education",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      setMessage("Please sign in first.");
      return;
    }

    setLoading(true);
    try {
      await createCampaign(form, user.id);
      setMessage("Campaign created successfully.");
      navigate("/campaigns");
    } catch (error) {
      setMessage(error.message || "Unable to create campaign.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="create-campaign-page">
        <div className="create-campaign-grid container">
          <section className="create-campaign-panel card">
            <span className="section-tag">Launch your mission</span>
            <h1>Create a campaign with Benevo</h1>
            <p>
              Build a verified Cardano fundraiser that reflects the Benevo vision:
              warm, simple, and trust-first. Add your story, goals, and an image to
              make your campaign stand out.
            </p>
            <ul className="feature-list">
              <li>Verified donation transparency</li>
              <li>Impact-focused campaign launch</li>
              <li>Modern, mobile-friendly form experience</li>
            </ul>
          </section>

          <section className="create-campaign-form card">
            <div className="form-header">
              <h2>Campaign details</h2>
              <p className="help-text">
                Fill in the information below and launch your campaign on the Benevo network.
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <label className="form-field">
                  <span>Campaign title</span>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="A brighter future for education"
                    required
                  />
                </label>

                <label className="form-field">
                  <span>Description</span>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the cause, impact, and how the funds will be used."
                    required
                  />
                </label>

                <label className="form-field">
                  <span>Goal amount (ADA)</span>
                  <input
                    name="goalAmount"
                    type="number"
                    min="0"
                    value={form.goalAmount}
                    onChange={handleChange}
                    placeholder="e.g. 2500"
                    required
                  />
                </label>

                <label className="form-field">
                  <span>Category</span>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="form-field">
                  <span>Image URL</span>
                  <input
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                    placeholder="Optional cover image link"
                  />
                </label>
              </div>

              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? "Creating campaign..." : "Create campaign"}
              </button>
            </form>
            {message ? <p className="message">{message}</p> : null}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default CreateCampaign;
