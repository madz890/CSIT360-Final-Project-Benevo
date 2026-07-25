import React from "react";

export default function DonationWalletPanel({
  walletStatus,
  availableWallets,
  walletConnecting,
  onConnectWallet,
}) {
  return (
    <section className="wallet-panel">
      <p>{walletStatus}</p>
      {availableWallets.length > 0 ? (
        <p>Detected wallets: {availableWallets.join(", ")}</p>
      ) : (
        <p>
          No Cardano wallet extension was detected. Install Nami, Eternl, or
          Lace to connect.
        </p>
      )}
      <button
        type="button"
        onClick={onConnectWallet}
        disabled={walletConnecting}
      >
        {walletConnecting ? "Connecting..." : "Connect wallet"}
      </button>
    </section>
  );
}
