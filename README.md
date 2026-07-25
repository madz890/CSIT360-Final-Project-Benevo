# CSIT360-Final-Project-Benevo

A blockchain donation transparency platform built with React and Vite. The app lets users connect a Cardano wallet, send ADA donations, verify transactions with Blockfrost, and save donation records when Supabase is configured.

## Documentation

- This `README.md` covers setup and usage.
- `PROJECT_OVERVIEW.md` explains the app structure, folder layout, and file responsibilities in detail.

## Setup

1. Install a Cardano browser wallet extension such as Nami in a supported browser.
2. Create a `.env` file in the project root with:

```env
VITE_BLOCKFROST_PROJECT_ID=mainnetm3TwGjqcjqTPeNuex194tvX0KYNsl5jf
VITE_DONATION_ADDRESS=addr1...yourRecipientAddress...
```

3. Install dependencies and start the app:

```bash
npm install
npm run dev
```

4. Open the local URL shown by Vite in a browser with Nami installed.

## How it works

- `src/lib/blockfrostConnector.js` handles wallet detection, Nami connection, transaction building, signing, submission, and Blockfrost verification.
- `src/hooks/useCardanoWallet.js` provides wallet state and connects to the browser wallet.
- `src/pages/Donate.jsx` sends ADA using the connected wallet and stores the tx hash.
- The app aims for pure ADA transfers with no datum or extra metadata.

## Important notes

- This app uses Cardano mainnet.
- Recipient addresses must be valid mainnet Bech32 addresses starting with `addr1...`.
- If the wallet has no ADA or no UTXOs, the transaction cannot be built or sent.
- If a wallet is not detected, make sure the app is opened in a supported browser with a wallet extension installed.

## Troubleshooting

- "No Cardano wallet extension was detected": open in Chrome/Brave with Nami and refresh.
- "Your connected wallet does not have any available ADA UTXOs": fund the wallet with ADA.
- "Unable to submit transaction to Blockfrost": verify the Blockfrost API key.
