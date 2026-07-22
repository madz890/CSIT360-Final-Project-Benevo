import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { createDonation, updateWalletAddress } from "../lib/donationService";
import useFormState from "../hooks/useFormState";

function Donate() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const campaign = location.state?.campaign;

  const [form, handleChange] = useFormState({
    amount: "",
    walletAddress: "",
    txHash: "",
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
      await updateWalletAddress(user.id, form.walletAddress);
      await createDonation(
        {
          campaignId: campaign?.id,
          amount: Number(form.amount),
          walletAddress: form.walletAddress,
          txHash: form.txHash,
        },
        user.id,
      );
      setMessage("Donation recorded successfully.");
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.message || "Unable to record donation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Donate to campaign</h2>
      <p>{campaign?.title || "Select a campaign from the campaigns page"}</p>
      <form onSubmit={handleSubmit}>
        <label>
          Amount (ADA)
          <input
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Wallet address
          <input
            name="walletAddress"
            value={form.walletAddress}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Transaction hash
          <input
            name="txHash"
            value={form.txHash}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Recording..." : "Record donation"}
        </button>
      </form>
      {message ? <p className="message">{message}</p> : null}
    </div>
  );
}

export default Donate;
