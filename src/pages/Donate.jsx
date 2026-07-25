import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { createDonation, updateWalletAddress } from "../lib/donationService";
import {
  sendAdaTransaction,
  verifyDonationTransaction,
  getFreshWalletApi,
} from "../lib/blockfrostConnector";
import useCardanoWallet from "../hooks/useCardanoWallet";
import useFormState from "../hooks/useFormState";
import DonationWalletPanel from "../components/donation/DonationWalletPanel";
import DonationForm from "../components/donation/DonationForm";
import { HeartHandshake, ShieldCheck, WalletCards } from "lucide-react";
import Footer from "../components/Footer";
import "../styles/donate.css";

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

    if (!walletName) {
      setMessage("Connect your wallet before sending the transaction.");
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
      const activeWalletApi = await getFreshWalletApi(walletName);
      const { txHash } = await sendAdaTransaction({
        walletApi: activeWalletApi,
        recipientAddress: form.recipientAddress,
        amount: form.amount,
      });

      const verification = await verifyDonationTransaction({
        txHash,
        walletAddress: form.walletAddress,
        amount: form.amount,
      });

      if (!verification.verified) {
        console.error("Donation verification failed:", verification);
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
      console.error("Donate error:", error);
      setMessage(
        error?.message ||
          "Unable to record donation. Try reconnecting your wallet and submitting again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="donate-page">
      <section className="donate-hero">
        <div className="container">
          <span className="section-tag">Secure Cardano donation</span>
          <h1>Make an impact today.</h1>
          <p>Your contribution is securely recorded on the Cardano blockchain.</p>
        </div>
      </section>

      <section className="container donate-layout">
        <aside className="donate-campaign-card">
          <span className="donate-card-label">You are supporting</span>
          <h2>{campaign?.title || "A Benevo campaign"}</h2>
          <p>{campaign?.description || "Select a campaign from the campaigns page to support a verified cause."}</p>
          <div className="donate-assurance"><ShieldCheck size={20} /><span>Verified campaign and transparent donation tracking.</span></div>
          <div className="donate-assurance"><HeartHandshake size={20} /><span>Every contribution helps bring a meaningful cause closer to its goal.</span></div>
        </aside>

        <div className="donate-form-card">
          <div className="donate-form-heading">
            <span className="donate-icon"><WalletCards size={22} /></span>
            <div><h2>Complete your donation</h2><p>Connect a Cardano wallet to donate securely.</p></div>
          </div>
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
      </section>
      <Footer />
    </main>
  );
}

export default Donate;
