import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { createCampaign } from "../lib/campaignService";
import useFormState from "../hooks/useFormState";

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
    <div className="card">
      <h2>Create a campaign</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Goal Amount (ADA)
          <input
            name="goalAmount"
            type="number"
            value={form.goalAmount}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Category
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Image URL
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create campaign"}
        </button>
      </form>
      {message ? <p className="message">{message}</p> : null}
    </div>
  );
}

export default CreateCampaign;
