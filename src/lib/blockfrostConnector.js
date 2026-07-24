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

  const protocolParameters = await getProtocolParameters();
  console.log("sendAdaTransaction: protocolParameters", protocolParameters);

  if (!protocolParameters || typeof protocolParameters !== "object") {
    throw new Error(
      "Unable to load Cardano protocol parameters from Blockfrost.",
    );
  }

  const CardanoWasmDynamic =
    await import("@emurgo/cardano-serialization-lib-asmjs");
  const {
    Address: DynamicAddress,
    TransactionBuilder,
    TransactionBuilderConfigBuilder,
    TransactionOutput,
    TransactionUnspentOutput,
    TransactionWitnessSet,
    Transaction,
    LinearFee,
    BigNum,
    Value,
  } = CardanoWasmDynamic;

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

  try {
    getCoinsPerUtxoByte(protocolParameters);
  } catch (error) {
    throw new Error(
      `Missing Cardano protocol parameters from Blockfrost: ${error.message}`,
    );
  }

  const requestedAmount = Number(amount);
  if (!Number.isFinite(requestedAmount) || requestedAmount <= 0) {
    throw new Error("Enter a valid ADA amount greater than zero.");
  }

  const lovelaceAmount = BigNum.from_str(
    Math.round(requestedAmount * 1000000).toString(),
  );

  console.log("sendAdaTransaction: inputs", {
    recipientAddress,
    amount,
    requestedAmount,
    lovelaceAmount: lovelaceAmount.to_str?.() ?? "<unknown>",
  });

  const coinsPerUtxoByte = getCoinsPerUtxoByte(protocolParameters);
  console.log("sendAdaTransaction: coinsPerUtxoByte", coinsPerUtxoByte);

  const txBuilderConfigBuilder = TransactionBuilderConfigBuilder.new();
  const txBuilderConfigAfterFee = txBuilderConfigBuilder.fee_algo(
    LinearFee.new(
      BigNum.from_str(
        normalizeProtocolNumber(protocolParameters.min_fee_a, "min_fee_a"),
      ),
      BigNum.from_str(
        normalizeProtocolNumber(protocolParameters.min_fee_b, "min_fee_b"),
      ),
    ),
  );
  console.log("sendAdaTransaction: after fee_algo", txBuilderConfigAfterFee);

  const txBuilderConfigAfterPool = txBuilderConfigAfterFee.pool_deposit(
    BigNum.from_str(
      normalizeProtocolNumber(protocolParameters.pool_deposit, "pool_deposit"),
    ),
  );
  console.log(
    "sendAdaTransaction: after pool_deposit",
    txBuilderConfigAfterPool,
  );

  const txBuilderConfigAfterKey = txBuilderConfigAfterPool.key_deposit(
    BigNum.from_str(
      normalizeProtocolNumber(protocolParameters.key_deposit, "key_deposit"),
    ),
  );
  console.log("sendAdaTransaction: after key_deposit", txBuilderConfigAfterKey);

  const txBuilderConfigAfterValue = txBuilderConfigAfterKey.max_value_size(
    Number(
      normalizeProtocolNumber(protocolParameters.max_val_size, "max_val_size"),
    ),
  );
  console.log(
    "sendAdaTransaction: after max_value_size",
    txBuilderConfigAfterValue,
  );

  const txBuilderConfigAfterTx = txBuilderConfigAfterValue.max_tx_size(
    Number(
      normalizeProtocolNumber(protocolParameters.max_tx_size, "max_tx_size"),
    ),
  );
  console.log("sendAdaTransaction: after max_tx_size", txBuilderConfigAfterTx);

  const txBuilderConfigAfterCoins = txBuilderConfigAfterTx.coins_per_utxo_byte(
    BigNum.from_str(coinsPerUtxoByte),
  );
  console.log(
    "sendAdaTransaction: after coins_per_utxo_byte",
    txBuilderConfigAfterCoins,
  );

  let txBuilderConfig;
  try {
    txBuilderConfig = txBuilderConfigAfterCoins.build();
  } catch (innerError) {
    console.error("sendAdaTransaction: build failed", innerError);
    throw innerError;
  }

  console.log("sendAdaTransaction: txBuilderConfig created", txBuilderConfig);

  const txBuilder = TransactionBuilder.new(txBuilderConfig);

  let recipient;
  try {
    const normalizedRecipient = normalizeAddress(
      DynamicAddress,
      recipientAddress,
    );
    console.log("sendAdaTransaction: normalizedRecipient", normalizedRecipient);
    recipient = DynamicAddress.from_bech32(normalizedRecipient);
  } catch (innerError) {
    console.error("sendAdaTransaction: recipient address parse failed", {
      recipientAddress,
      innerError,
    });
    throw innerError;
  }

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

  const changeAddressValue =
    changeAddress || (await walletApi.getChangeAddress?.()) || "";
  const changeBech32 = normalizeAddress(DynamicAddress, changeAddressValue);

  if (!changeBech32) {
    throw new Error("Unable to obtain a change address from the wallet.");
  }

  txBuilder.add_change_if_needed(DynamicAddress.from_bech32(changeBech32));

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
  const rawAddress =
    addresses[0] ?? (await walletApi.getChangeAddress?.()) ?? "";

  const CardanoWasmDynamic =
    await import("@emurgo/cardano-serialization-lib-asmjs");
  const { Address: DynamicAddress } = CardanoWasmDynamic;
  const walletAddress = rawAddress
    ? normalizeAddress(DynamicAddress, rawAddress)
    : "";

  return {
    walletName,
    walletAddress,
    walletApi,
  };
}
