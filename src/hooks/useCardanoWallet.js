import { useEffect, useState } from "react";
import {
  connectCardanoWallet,
  getInstalledWallets,
} from "../lib/blockfrostConnector";

export default function useCardanoWallet() {
  const [walletAddress, setWalletAddress] = useState("");
  const [walletName, setWalletName] = useState("");
  const [walletApi, setWalletApi] = useState(null);
  const [walletStatus, setWalletStatus] = useState(
    "Connect a Cardano wallet to autofill your address.",
  );
  const [walletConnecting, setWalletConnecting] = useState(false);
  const [availableWallets, setAvailableWallets] = useState([]);

  useEffect(() => {
    setAvailableWallets(getInstalledWallets());
  }, []);

  const connectWallet = async () => {
    setWalletConnecting(true);
    setWalletStatus("Connecting to wallet...");

    try {
      const wallet = await connectCardanoWallet();
      setWalletAddress(wallet.walletAddress);
      setWalletName(wallet.walletName);
      setWalletApi(wallet.walletApi);
      setWalletStatus(`Connected to ${wallet.walletName}.`);
      return wallet;
    } catch (error) {
      setWalletStatus(error.message || "Unable to connect a wallet.");
      throw error;
    } finally {
      setWalletConnecting(false);
    }
  };

  return {
    walletAddress,
    setWalletAddress,
    walletName,
    walletApi,
    walletStatus,
    walletConnecting,
    availableWallets,
    connectWallet,
  };
}
