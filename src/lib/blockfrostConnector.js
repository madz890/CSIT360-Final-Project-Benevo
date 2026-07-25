const BLOCKFROST_BASE_URL = "https://cardano-preprod.blockfrost.io/api/v0";
const BLOCKFROST_PROJECT_ID = import.meta.env.VITE_BLOCKFROST_PROJECT_ID || "";

let CSL_INSTANCE = null;

async function getCSL() {
  if (!CSL_INSTANCE) {
    try {
      const WASM = await import("@emurgo/cardano-serialization-lib-browser");
      if (typeof WASM.default === "function") {
        const initialized = await WASM.default();
        CSL_INSTANCE =
          initialized && Object.keys(initialized).length > 0
            ? initialized
            : WASM;
      } else {
        CSL_INSTANCE = WASM;
      }
    } catch (browserError) {
      console.warn(
        "getCSL: @emurgo/cardano-serialization-lib-browser failed, falling back to asmjs",
        browserError,
      );
      const ASMJS = await import("@emurgo/cardano-serialization-lib-asmjs");
      CSL_INSTANCE = ASMJS;
    }
  }
  return CSL_INSTANCE;
}

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

function normalizeAddress(AddressClass, address) {
  if (!address) {
    return "";
  }

  try {
    return AddressClass.from_bech32(address).to_bech32();
  } catch {
    try {
      return AddressClass.from_bytes(hexToBytes(address)).to_bech32();
    } catch {
      throw new Error(
        "Unable to parse the Cardano address. Use a valid bech32 or hex address.",
      );
    }
  }
}

function getBlockfrostHeaders() {
  return {
    project_id: BLOCKFROST_PROJECT_ID,
    "Content-Type": "application/json",
  };
}

function normalizeProtocolNumber(value, name) {
  const stringValue = String(value ?? "");
  if (!/^[0-9]+$/.test(stringValue)) {
    throw new Error(
      `Cardano protocol parameter ${name} is invalid or missing: ${stringValue}`,
    );
  }
  return stringValue;
}

function getCoinsPerUtxoByte(protocolParameters) {
  if (
    protocolParameters.coins_per_utxo_byte !== undefined &&
    protocolParameters.coins_per_utxo_byte !== null
  ) {
    return normalizeProtocolNumber(
      protocolParameters.coins_per_utxo_byte,
      "coins_per_utxo_byte",
    );
  }

  if (
    protocolParameters.coins_per_utxo_word !== undefined &&
    protocolParameters.coins_per_utxo_word !== null
  ) {
    const wordValue = Number(protocolParameters.coins_per_utxo_word);
    if (!Number.isFinite(wordValue)) {
      throw new Error(
        `Cardano protocol parameter coins_per_utxo_word is invalid: ${protocolParameters.coins_per_utxo_word}`,
      );
    }
    return String(Math.round(wordValue / 8));
  }

  throw new Error(
    "Missing Cardano protocol parameter coins_per_utxo_byte or coins_per_utxo_word.",
  );
}

export async function getProtocolParameters() {
  const response = await fetch(
    `${BLOCKFROST_BASE_URL}/epochs/latest/parameters`,
    {
      headers: getBlockfrostHeaders(),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Unable to fetch Blockfrost protocol parameters: ${response.status} ${response.statusText} ${errorText}`,
    );
  }

  const parameters = await response.json();

  if (!parameters || typeof parameters !== "object") {
    throw new Error("Blockfrost protocol response is invalid.");
  }

  return parameters;
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

  const CSL = await getCSL();

  const protocolParameters = await getProtocolParameters();
  console.log("sendAdaTransaction: protocolParameters", protocolParameters);

  if (!protocolParameters || typeof protocolParameters !== "object") {
    throw new Error(
      "Unable to load Cardano protocol parameters from Blockfrost.",
    );
  }

  const requiredParams = [
    "min_fee_a",
    "min_fee_b",
    "pool_deposit",
    "key_deposit",
    "max_val_size",
    "max_tx_size",
  ];

  const missing = requiredParams.filter(
    (key) =>
      protocolParameters[key] === undefined || protocolParameters[key] === null,
  );
  if (missing.length > 0) {
    throw new Error(
      `Missing Cardano protocol parameters from Blockfrost: ${missing.join(", ")}`,
    );
  }

  const requestedAmount = Number(amount);
  if (!Number.isFinite(requestedAmount) || requestedAmount <= 0) {
    throw new Error("Enter a valid ADA amount greater than zero.");
  }

  const lovelaceAmount = CSL.BigNum.from_str(
    Math.round(requestedAmount * 1000000).toString(),
  );

  const coinsPerUtxoByte = getCoinsPerUtxoByte(protocolParameters);

  let txBuilderConfig;
  try {
    txBuilderConfig = CSL.TransactionBuilderConfigBuilder.new()
      .fee_algo(
        CSL.LinearFee.new(
          CSL.BigNum.from_str(
            normalizeProtocolNumber(protocolParameters.min_fee_a, "min_fee_a"),
          ),
          CSL.BigNum.from_str(
            normalizeProtocolNumber(protocolParameters.min_fee_b, "min_fee_b"),
          ),
        ),
      )
      .pool_deposit(
        CSL.BigNum.from_str(
          normalizeProtocolNumber(
            protocolParameters.pool_deposit,
            "pool_deposit",
          ),
        ),
      )
      .key_deposit(
        CSL.BigNum.from_str(
          normalizeProtocolNumber(
            protocolParameters.key_deposit,
            "key_deposit",
          ),
        ),
      )
      .max_value_size(
        Number(
          normalizeProtocolNumber(
            protocolParameters.max_val_size,
            "max_val_size",
          ),
        ),
      )
      .max_tx_size(
        Number(
          normalizeProtocolNumber(
            protocolParameters.max_tx_size,
            "max_tx_size",
          ),
        ),
      )
      .coins_per_utxo_byte(CSL.BigNum.from_str(coinsPerUtxoByte))
      .build();
  } catch (innerError) {
    console.error("sendAdaTransaction: build failed", innerError);
    throw innerError;
  }

  const txBuilder = CSL.TransactionBuilder.new(txBuilderConfig);

  let recipient;
  try {
    const normalizedRecipient = normalizeAddress(CSL.Address, recipientAddress);
    recipient = CSL.Address.from_bech32(normalizedRecipient);
  } catch (innerError) {
    console.error("sendAdaTransaction: recipient address parse failed", {
      recipientAddress,
      innerError,
    });
    throw innerError;
  }

  const output = CSL.TransactionOutput.new(
    recipient,
    CSL.Value.new(lovelaceAmount),
  );
  txBuilder.add_output(output);

  const utxos = (await walletApi.getUtxos?.()) ?? [];
  if (!Array.isArray(utxos) || utxos.length === 0) {
    throw new Error(
      "Your connected wallet does not have any available ADA UTXOs. Please fund the wallet with testnet ADA and try again.",
    );
  }

  const txInputs = CSL.TransactionUnspentOutputs.new();

  for (const utxoHex of utxos) {
    if (typeof utxoHex !== "string" || utxoHex.length === 0) {
      continue;
    }

    try {
      const utxo = CSL.TransactionUnspentOutput.from_bytes(hexToBytes(utxoHex));
      txInputs.add(utxo);
    } catch (error) {
      console.warn("Failed to decode UTXO:", error);
    }
  }

  if (txInputs.len() === 0) {
    throw new Error("No valid UTXOs found in the connected wallet.");
  }

  txBuilder.add_inputs_from(
    txInputs,
    CSL.CoinSelectionStrategyCIP2.LargestFirst,
  );

  const changeAddressValue =
    changeAddress || (await walletApi.getChangeAddress?.()) || "";
  const changeBech32 = normalizeAddress(CSL.Address, changeAddressValue);

  if (!changeBech32) {
    throw new Error("Unable to obtain a change address from the wallet.");
  }

  txBuilder.add_change_if_needed(CSL.Address.from_bech32(changeBech32));

  const txBody = txBuilder.build();
  const dummyWitnessSet = CSL.TransactionWitnessSet.new();
  const txToSign = CSL.Transaction.new(txBody, dummyWitnessSet);
  const txHex = bytesToHex(txToSign.to_bytes());

  const witnessHex = await walletApi.signTx(txHex, true);
  const witnessSet = CSL.TransactionWitnessSet.from_bytes(
    hexToBytes(witnessHex),
  );
  const signedTx = CSL.Transaction.new(txBody, witnessSet);
  const signedTxHex = bytesToHex(signedTx.to_bytes());

  if (typeof walletApi.submitTx === "function") {
    const txHash = await walletApi.submitTx(signedTxHex);
    return { txHash, signedTxHex };
  }

  const response = await fetch(`${BLOCKFROST_BASE_URL}/tx/submit`, {
    method: "POST",
    headers: {
      project_id: BLOCKFROST_PROJECT_ID,
      "Content-Type": "application/cbor",
    },
    body: hexToBytes(signedTxHex),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Unable to submit transaction to Blockfrost: ${errorText}`);
  }

  const txHash = await response.json();
  return { txHash, signedTxHex };
}

async function fetchBlockfrostTransactionUtxos(txHash) {
  const response = await fetch(
    `${BLOCKFROST_BASE_URL}/txs/${encodeURIComponent(txHash)}/utxos`,
    {
      headers: getBlockfrostHeaders(),
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Unable to verify the donation transaction with Blockfrost: ${response.status} ${response.statusText} ${errorText}`,
    );
  }

  return await response.json();
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

  let utxoData = null;
  const maxAttempts = 18;
  const delayMs = 5000;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    utxoData = await fetchBlockfrostTransactionUtxos(txHash);

    if (utxoData) {
      break;
    }

    if (attempt === maxAttempts) {
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  if (!utxoData) {
    return {
      verified: false,
      txHash,
      amountLovelace: null,
      message:
        "The transaction was submitted but is still waiting to be confirmed on Preprod. Please wait up to 90 seconds and try verification again.",
    };
  }

  const outputs = Array.isArray(utxoData.outputs) ? utxoData.outputs : [];

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

export async function getFreshWalletApi(preferredWallet = "nami") {
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

  return await window.cardano[walletName].enable();
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

  const walletApi = await getFreshWalletApi(walletName);
  const addresses = (await walletApi.getUsedAddresses?.()) ?? [];
  const rawAddress =
    addresses[0] ?? (await walletApi.getChangeAddress?.()) ?? "";

  const CSL = await getCSL();
  const walletAddress = rawAddress
    ? normalizeAddress(CSL.Address, rawAddress)
    : "";

  return {
    walletName,
    walletAddress,
    walletApi,
  };
}
