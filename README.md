# Benevo · Cardano Donation Platform

<img src="public/favicon.svg" width="64" height="64" alt="Benevo favicon" align="right">

**Benevo** (CSIT360 Final Project) is a transparent, blockchain-verified donation platform built on **Cardano**. Campaign organizers publish causes, supporters connect their Cardano wallet (e.g. Nami, Eternl, Lace) to donate ADA, and every contribution is traced on-chain through **Blockfrost** so donors and visitors can verify funds with confidence.

Built with **React 19 + Vite**, **Supabase** (auth + campaign data), and **EMURGO Cardano Serialization Lib** (WASM / ASM.js fallback for tx building).

---

## Features

- 🔐 **Wallet Connect** — connect any CIP‑30 Cardano wallet extension (Nami, Eternl, Lace, …)
- ₳ **On-chain Donations** — build, sign, and submit pure ADA transactions directly in the browser
- ✅ **Blockfrost Verification** — every donation tx hash is looked up via Blockfrost to confirm it landed on-chain
- 🧾 **Transparent Donation History** — each campaign page shows recent donors, amounts, dates, and a copyable tx hash (expandable "View All" list)
- 📊 **Progress Bar Sums Real Donations** — raised amount reflects the max(stored campaign counter, sum of fetched donations) so progress always shows what the page can see
- 🎯 **Campaigns + Filtering** — browse all campaigns, filter by category (Education, Medical, Environment, Community, Disaster Relief, Animals)
- ➕ **Create Campaign** — verified organizers can launch new campaigns with image, goal, deadline, category, story
- 👤 **Auth + Dashboard** — Supabase Email auth, per-organizer dashboard of owned campaigns + stats
- 💎 **Benevo UI** — frosted-glass floating navbar, warm cream/orange theme, responsive cards, CSS-variable design system

---

## Tech Stack

| Layer        | Tooling                                                                 |
|--------------|-------------------------------------------------------------------------|
| Frontend     | **React 19** + **React Router 7**, **Vite 8** (Rolldown under the hood) |
| Blockchain   | **@emurgo/cardano-serialization-lib** WASM (ASM.js fallback) + CIP‑30   |
| Oracle/API   | **Blockfrost** (Cardano preprod — tx submission + lookup)              |
| Backend/DB   | **Supabase** (Postgres, Email Auth, Storage — optional, falls back gracefully) |
| Icons        | **Lucide React**                                                        |
| Styling      | Vanilla CSS with CSS variables + design tokens in `global.css`          |
| Build extras | `vite-plugin-wasm` + `vite-plugin-top-level-await`                      |
| Lint         | **ESLint 10** (`npm run lint`)                                          |

---

## Prerequisites

1. **Node.js 20+** (Vite 8 requires modern Node)
2. **A CIP-30 wallet extension** (Nami, Eternl, Lace, …) in Chrome/Brave/Edge
3. (Optional but recommended) A **Supabase project** + a **Blockfrost account** with a **preprod** project ID

---

## 1. Environment Variables

Create a `.env` file in the project root. All variables are `VITE_*` prefixed so Vite exposes them to the client.

```env
# ------------------------------------------------------------------
# Supabase  (for auth, campaigns, donation records, profiles)
# If missing, the app still runs — services return demo/fallback data.
# ------------------------------------------------------------------
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...YOUR-ANON-KEY

# ------------------------------------------------------------------
# Blockfrost  (Cardano preprod — tx submit + verify on-chain)
# Get one at:  https://blockfrost.io
# ------------------------------------------------------------------
VITE_BLOCKFROST_PROJECT_ID=preprod...YOUR-BLOCKFROST-PROJECT-ID

# ------------------------------------------------------------------
# Recipient address  (where donated ADA lands — preprod or mainnet)
# For preprod it starts with addr_test1...  ; mainnet addr1...
# ------------------------------------------------------------------
VITE_DONATION_ADDRESS=addr_test1qq...YOUR-RECIPIENT-ADDRESS
```

> See `src/lib/supabaseSchema.sql` for the tables, columns, and Row-Level Security policies expected in Supabase.

---

## 2. Install & Run

```bash
# 1) dependencies
npm install

# 2) dev server (HMR + Vite dev)
npm run dev

# 3) production build
npm run build

# 4) preview production build locally
npm run preview

# 5) lint
npm run lint
```

Vite will print a local URL such as `http://localhost:5173` — open it in a browser that has your Cardano wallet extension installed/enabled.

---

## Project Structure

```
CSIT360-Final-Project-Benevo/
├── index.html                    # HTML entrypoint, <title>, browser favicon, theme-color
├── public/
│   ├── favicon.svg               # Benevo orange heart tile
│   └── icons.svg                 # shared icon sprite
├── src/
│   ├── main.jsx                  # React root, BrowserRouter, providers
│   ├── App.jsx                   # Navbar (rendered via Portal to body) + Routes outlet
│   ├── routes/AppRoutes.jsx      # All public & protected route definitions
│   ├── pages/
│   │   ├── Home.jsx              # Hero, featured campaigns, filter
│   │   ├── Campaigns.jsx         # All campaigns grid + category pills
│   │   ├── CampaignDetails.jsx   # Hero, about, progress, Donate, **Recent Donations**
│   │   ├── Donate.jsx            # Dedicated donate flow (wallet panel + confirmation)
│   │   ├── CreateCampaign.jsx    # Protected: new campaign form
│   │   ├── Dashboard.jsx         # Protected: organizer's campaigns + stats
│   │   ├── Profile.jsx           # Protected: profile edit
│   │   └── Auth.jsx              # Sign in / Sign up (Supabase Email)
│   ├── components/
│   │   ├── Navbar.jsx            # Floating pinned nav (React Portal → body)
│   │   ├── Footer.jsx
│   │   ├── CampaignCard.jsx
│   │   ├── FormField.jsx
│   │   ├── AuthToggle.jsx
│   │   ├── ProtectedRoute.jsx    # Redirects unauthenticated users
│   │   └── donation/
│   │       ├── DonationForm.jsx
│   │       └── DonationWalletPanel.jsx
│   ├── contexts/AuthContext.jsx  # Supabase auth session provider
│   ├── hooks/
│   │   ├── useCardanoWallet.js   # CIP-30 wallet state hook
│   │   └── useFormState.js
│   ├── lib/
│   │   ├── supabase.js           # createClient + isSupabaseConfigured flag
│   │   ├── supabaseService.js
│   │   ├── supabaseSchema.sql    # SQL to set up Supabase tables + RLS
│   │   ├── campaignService.js
│   │   ├── donationService.js    # createDonation + getCampaignDonations(newest first)
│   │   ├── profileService.js
│   │   └── blockfrostConnector.js# Wallet connect / build/sign/submit/verify
│   └── styles/                   # Page + component CSS, design tokens live in global.css
├── tests/blockfrostConnector.test.js
├── vite.config.js
├── eslint.config.js
├── package.json
└── README.md
```

---

## How Donations Work (Simplified)

1. User opens a **Campaign Details** page → clicks **Donate to this campaign**.
2. `DonationForm` → `DonationWalletPanel` prompts for the amount (ADA) and asks to connect a CIP-30 wallet.
3. `blockfrostConnector.js` looks up wallet UTXOs via the wallet API, builds the transaction (CSL WASM) paying `VITE_DONATION_ADDRESS` plus a `1.6` ADA change output back to sender.
4. The wallet extension pops up a **sign** dialog → user approves → the signed tx is submitted to Cardano preprod via Blockfrost `POST /tx/submit`.
5. Blockfrost lookup confirms the tx landed on-chain and returns the tx hash and a block height.
6. `donationService.createDonation(...)` writes the record (campaign_id, donor_id, amount, tx_hash, block_height, verified flag) into Supabase.
7. Back on Campaign Details → **Recent Donations** section re-renders with the newest card at the top, and the progress bar updates (raised = max(campaign.current_amount, sum of donation rows)).

---

## Important Notes

- **Default network is Cardano preprod.** `blockfrostConnector.js` uses `https://cardano-preprod.blockfrost.io/api/v0`. Switch the base URL (and `VITE_DONATION_ADDRESS`) to `https://cardano-mainnet.blockfrost.io` before running with real funds.
- Recipient addresses must be valid Bech32 (`addr_test1...` for preprod, `addr1...` for mainnet).
- If a wallet has no UTXOs / no ADA, the transaction cannot be built — the connector returns the message *"Your connected wallet does not have any available ADA UTXOs."*
- `isSupabaseConfigured` guards every Supabase call. Without the env vars, services return empty arrays/demo donations so all pages still render.

---

## Troubleshooting

| Symptom                                                      | Fix                                                          |
|--------------------------------------------------------------|--------------------------------------------------------------|
| "No Cardano wallet extension was detected"                   | Open in Chrome/Brave/Edge with Nami/Eternl/Lace installed. Refresh. |
| "Your connected wallet does not have any available ADA UTXOs" | Fund the wallet with test ADA (preprod faucet) or real ADA.   |
| "Unable to submit transaction to Blockfrost"                 | Verify `VITE_BLOCKFROST_PROJECT_ID` matches the correct network. |
| Floating navbar scrolls with the page                        | Ensure `#navbar-root` exists in `index.html` (the navbar is rendered via React Portal to it). |
| Recent donations / progress are empty                        | Check `isSupabaseConfigured` and confirm donations were inserted via Supabase (frontend has no direct SQL). |

---

## License / Course Info

CSIT360 Final Project · Team Benevo · Educational / capstone use.
