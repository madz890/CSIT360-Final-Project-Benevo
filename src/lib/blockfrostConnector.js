import {
  Address,
  TransactionBuilder,
  TransactionBuilderConfigBuilder,
  TransactionOutput,
  TransactionUnspentOutput,
  TransactionWitnessSet,
  Transaction,
  LinearFee,
  BigNum,
  Value,
} from "@emurgo/cardano-serialization-lib-browser";

const BLOCKFROST_BASE_URL = "https://cardano-mainnet.blockfrost.io/api/v0";
const BLOCKFROST_PROJECT_ID =
  import.meta.env.VITE_BLOCKFROST_PROJECT_ID ||
  "mainnetm3TwGjqcjqTPeNuex194tvX0KYNsl5jf";

function hexToBytes(hex) {
  if (!hex) {
    return new Uint8Array();
  }

  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function getBlockfrostHeaders() {
  return {
    project_id: BLOCKFROST_PROJECT_ID,
    "Content-Type": "application/json",
  };
}

export async function getProtocolParameters() {
  const response = await fetch(
    `${BLOCKFROST_BASE_URL}/epochs/latest/parameters`,
    {
      headers: getBlockfrostHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error("Unable to fetch Blockfrost protocol parameters.");
  }

  return response.json();
}

export async function sendAdaTransaction({
  walletApi,
  recipientAddress,
  amount,
  changeAddress,
}) {
  if (!walletApi) {
    throw new Error("Wallet API is not available. Connect a wallet first.");
  }

  if (!recipientAddress) {
    throw new Error("A recipient address is required for the transaction.");
  }

  const protocolParameters = await getProtocolParameters();
  const requestedAmount = Number(amount);
  if (!Number.isFinite(requestedAmount) || requestedAmount <= 0) {
    throw new Error("Enter a valid ADA amount greater than zero.");
  }

  const lovelaceAmount = BigNum.from_str(
    Math.round(requestedAmount * 1000000).toString(),
  );
  const txBuilderConfig = TransactionBuilderConfigBuilder.new()
    .fee_algo(
      LinearFee.new(
        BigNum.from_str(protocolParameters.min_fee_a),
        BigNum.from_str(protocolParameters.min_fee_b),
      ),
    )
    .pool_deposit(BigNum.from_str(protocolParameters.pool_deposit))
    .key_deposit(BigNum.from_str(protocolParameters.key_deposit))
    .max_value_size(protocolParameters.max_val_size)
    .max_tx_size(protocolParameters.max_tx_size)
    .coins_per_utxo_word(
      BigNum.from_str(protocolParameters.coins_per_utxo_word),
    )
    .build();

  const txBuilder = TransactionBuilder.new(txBuilderConfig);
  const recipient = Address.from_bech32(recipientAddress);
  const output = TransactionOutput.new(recipient, Value.new(lovelaceAmount));
  txBuilder.add_output(output);

  const utxos = (await walletApi.getUtxos?.()) ?? [];
  if (!Array.isArray(utxos) || utxos.length === 0) {
    throw new Error(
      "Your connected wallet does not have any available ADA UTXOs. Please fund the wallet with mainnet ADA and try again.",
    );
  }

  for (const utxoHex of utxos) {
    if (typeof utxoHex !== "string" || utxoHex.length === 0) {
      throw new Error(
        "Unable to parse wallet UTXOs. Make sure the wallet is connected and on Cardano mainnet.",
      );
    }

    let utxo;
    try {
      utxo = TransactionUnspentOutput.from_bytes(hexToBytes(utxoHex));
    } catch (error) {
      throw new Error(
        "Unable to decode wallet UTXO data. Please reconnect the wallet and ensure it supports the Cardano API.",
      );
    }

    txBuilder.add_input(
      utxo.output().address(),
      utxo.input(),
      utxo.output().amount(),
    );
  }

  const changeBech32 =
    changeAddress || (await walletApi.getChangeAddress?.()) || "";
  if (!changeBech32) {
    throw new Error("Unable to obtain a change address from the wallet.");
  }

  txBuilder.add_change_if_needed(Address.from_bech32(changeBech32));

  const txBody = txBuilder.build();
  const txBodyHex = bytesToHex(txBody.to_bytes());

  const witnessHex = await walletApi.signTx(txBodyHex, true);
  const witnessSet = TransactionWitnessSet.from_bytes(hexToBytes(witnessHex));
  const signedTx = Transaction.new(txBody, witnessSet);
  const signedTxHex = bytesToHex(signedTx.to_bytes());

  if (typeof walletApi.submitTx === "function") {
    const txHash = await walletApi.submitTx(signedTxHex);
    return { txHash, signedTxHex };
  }

  const response = await fetch(`${BLOCKFROST_BASE_URL}/tx/submit`, {
    method: "POST",
    headers: getBlockfrostHeaders(),
    body: hexToBytes(signedTxHex),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Unable to submit transaction to Blockfrost: ${errorText}`);
  }

  const txHash = await response.text();
  return { txHash, signedTxHex };
}

export async function verifyDonationTransaction({
  txHash,
  walletAddress,
  amount,
}) {
  if (!txHash) {
    return {
      verified: false,
      message: "A transaction hash is required for verification.",
    };
  }

  if (!walletAddress) {
    return {
      verified: false,
      message: "A wallet address is required before verification.",
    };
  }

  const requestedAmount = Number(amount);
  const requestedLovelace = Number.isFinite(requestedAmount)
    ? Math.round(requestedAmount * 1000000)
    : 0;

  const response = await fetch(
    `${BLOCKFROST_BASE_URL}/txs/${encodeURIComponent(txHash)}`,
    {
      headers: getBlockfrostHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Unable to verify the donation transaction with Blockfrost.",
    );
  }

  const transaction = await response.json();
  const outputs = Array.isArray(transaction.outputs) ? transaction.outputs : [];

  const matchingOutput = outputs.find((output) => {
    if (output.address !== walletAddress) {
      return false;
    }

    const lovelaceAmount = Array.isArray(output.amount)
      ? (output.amount.find((entry) => entry.unit === "lovelace")?.quantity ??
        "0")
      : "0";

    return requestedLovelace > 0
      ? Number(lovelaceAmount) >= requestedLovelace
      : true;
  });

  const amountLovelace = matchingOutput
    ? Number(
        Array.isArray(matchingOutput.amount)
          ? (matchingOutput.amount.find((entry) => entry.unit === "lovelace")
              ?.quantity ?? "0")
          : "0",
      )
    : null;

  return {
    verified: Boolean(matchingOutput),
    amountLovelace,
    txHash,
    message: matchingOutput
      ? "The donation transaction was verified on-chain."
      : "No matching donation output was found for that wallet address.",
  };
}

export function getInstalledWallets() {
  if (typeof window === "undefined" || !window.cardano) {
    return [];
  }

  return Object.entries(window.cardano)
    .filter(([, provider]) => provider && typeof provider.enable === "function")
    .map(([name]) => name);
}

export async function connectCardanoWallet(preferredWallet = "nami") {
  if (typeof window === "undefined" || !window.cardano) {
    throw new Error(
      "No Cardano wallet extension was detected in this browser.",
    );
  }

  const installedWallets = getInstalledWallets();
  const preferredName = preferredWallet?.toLowerCase();
  const walletName = installedWallets.includes(preferredName)
    ? preferredName
    : installedWallets[0];

  if (!walletName || !window.cardano[walletName]) {
    throw new Error("The selected wallet is not installed or available.");
  }

  const walletApi = await window.cardano[walletName].enable();
  const addresses = (await walletApi.getUsedAddresses?.()) ?? [];
  const walletAddress =
    addresses[0] ?? (await walletApi.getChangeAddress?.()) ?? "";

  return {
    walletName,
    walletAddress,
    walletApi,
  };
}
