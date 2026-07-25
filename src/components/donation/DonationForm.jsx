import React from "react";

export default function DonationForm({
  form,
  handleChange,
  handleSubmit,
  loading,
}) {
  return (
    <form onSubmit={handleSubmit} className="donation-form">
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
        Recipient address
        <input
          name="recipientAddress"
          value={form.recipientAddress}
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
          readOnly
          required
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send donation"}
      </button>
    </form>
  );
}
