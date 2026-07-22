import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { createDonation, updateWalletAddress } from "../lib/donationService";
import {
  sendAdaTransaction,
  verifyDonationTransaction,
} from "../lib/blockfrostConnector";
import useCardanoWallet from "../hooks/useCardanoWallet";
import useFormState from "../hooks/useFormState";
import DonationWalletPanel from "../components/donation/DonationWalletPanel";
import DonationForm from "../components/donation/DonationForm";

const DEFAULT_RECIPIENT_ADDRESS = import.meta.env.VITE_DONATION_ADDRESS || "";

function Donate() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const campaign = location.state?.campaign;

  const [form, handleChange, setForm] = useFormState({
    amount: "",
    walletAddress: "",
    recipientAddress: DEFAULT_RECIPIENT_ADDRESS,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const {
    walletName,
    walletApi,
    setWalletAddress,
    walletStatus,
    walletConnecting,
    availableWallets,
    connectWallet,
  } = useCardanoWallet();

  const handleConnectWallet = async () => {
    try {
      const wallet = await connectWallet();
      setForm((prev) => ({ ...prev, walletAddress: wallet.walletAddress }));
      setWalletAddress(wallet.walletAddress);
    } catch {
      // error handled by hook state
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      setMessage("Please sign in first.");
      return;
    }

    if (!walletApi) {
      setMessage("Connect your Nami wallet first.");
      return;
    }

    if (!form.walletAddress) {
      setMessage("Connect a wallet to fill in your address.");
      return;
    }

    if (!form.recipientAddress) {
      setMessage("Enter a recipient address for the ADA transfer.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { txHash } = await sendAdaTransaction({
        walletApi,
        recipientAddress: form.recipientAddress,
        amount: form.amount,
      });

      const verification = await verifyDonationTransaction({
        txHash,
        walletAddress: form.recipientAddress,
        amount: form.amount,
      });

      if (!verification.verified) {
        throw new Error(
          verification.message ||
            "The donation could not be verified on-chain.",
        );
      }

      await updateWalletAddress(user.id, form.walletAddress);
      await createDonation(
        {
          campaignId: campaign?.id,
          amount: Number(form.amount),
          walletAddress: form.walletAddress,
          txHash,
        },
        user.id,
      );
      setMessage(`Donation of ${form.amount} ADA sent successfully: ${txHash}`);
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
      <DonationWalletPanel
        walletName={walletName}
        walletStatus={walletStatus}
        availableWallets={availableWallets}
        walletConnecting={walletConnecting}
        onConnectWallet={handleConnectWallet}
      />
      <DonationForm
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        loading={loading}
      />
      {message ? <p className="message">{message}</p> : null}
    </div>
  );
}

export default Donate;
