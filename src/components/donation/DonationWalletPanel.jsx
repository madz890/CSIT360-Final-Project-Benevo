import React from "react";

export default function DonationWalletPanel({
  walletStatus,
  availableWallets,
  walletConnecting,
  onConnectWallet,
}) {
  return (
    <section className="wallet-panel">
      <p className="wallet-status">{walletStatus}</p>
      {availableWallets.length > 0 ? (
        <p className="wallet-copy">Detected wallets: {availableWallets.join(", ")}</p>
      ) : (
        <p className="wallet-copy">
          No Cardano wallet extension was detected. Install Nami, Eternl, or
          Lace to connect.
        </p>
      )}
      <button
        className="secondary-btn wallet-connect-btn"
        type="button"
        onClick={onConnectWallet}
        disabled={walletConnecting}
      >
        {walletConnecting ? "Connecting..." : "Connect wallet"}
      </button>
    </section>
  );
}
