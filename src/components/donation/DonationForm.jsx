import React from "react";

export default function DonationForm({
  form,
  handleChange,
  handleSubmit,
  loading,
}) {
  return (
    <form onSubmit={handleSubmit} className="donation-form">
      <label className="donation-field">
        Amount (ADA)
        <input
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          required
        />
      </label>
      <label className="donation-field">
        Recipient address
        <input
          name="recipientAddress"
          value={form.recipientAddress}
          onChange={handleChange}
          required
        />
      </label>
      <label className="donation-field">
        Wallet address
        <input
          name="walletAddress"
          value={form.walletAddress}
          onChange={handleChange}
          readOnly
          required
        />
      </label>
      <button className="primary-btn donation-submit" type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send donation"}
      </button>
    </form>
  );
}
