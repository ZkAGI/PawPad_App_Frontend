# 🐾 PawPad — Privacy-First Multi-Chain Wallet

PawPad is a privacy-first multi-chain wallet that eliminates seed phrases using **Oasis TEE (Trusted Execution Environment)** and **FROST MPC threshold signatures**. Available as a React Native mobile app and a Progressive Web App (PWA).

**Live PWA**: [paw-pad-app-frontend.vercel.app](https://paw-pad-app-frontend.vercel.app)

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   PawPad Client                  │
│         (React Native / PWA)                     │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌─────────┐  ┌──────────┐  ┌────────────────┐ │
│  │ Wallet  │  │  Agent   │  │   Recovery     │ │
│  │ Manager │  │ Trading  │  │   & Backup     │ │
│  └────┬────┘  └────┬─────┘  └───────┬────────┘ │
│       │            │                │           │
│       └────────────┼────────────────┘           │
│                    │                             │
│            ┌───────▼────────┐                   │
│            │   teeService   │                   │
│            │  (API Client)  │                   │
│            └───────┬────────┘                   │
└────────────────────┼────────────────────────────┘
                     │
          ┌──────────▼──────────┐
          │   Oasis ROFL TEE    │
          │   Hardware Enclave  │
          ├─────────────────────┤
          │ • Key generation    │
          │ • Transaction sign  │
          │ • TOTP auth         │
          │ • Encrypted backup  │
          │ • Trade execution   │
          └──────────┬──────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
   ┌────▼───┐  ┌────▼───┐  ┌────▼────┐
   │ Solana │  │  EVM   │  │ Sapphire│
   │Mainnet │  │Mainnet │  │ (Oasis) │
   └────────┘  └────────┘  └─────────┘
```

## TEE Security Model

All private keys are generated and stored **inside the Oasis TEE enclave**. Keys never leave the secure environment:

- **Wallet Creation**: Keys generated inside TEE → client receives addresses + TOTP secret + encrypted backup
- **Authentication**: TOTP-based (Google Authenticator compatible) → returns JWT session token
- **Transactions**: Client sends intent → TEE signs inside enclave → broadcasts to chain
- **Recovery**: Encrypted backup file + TOTP rotation → new credentials issued inside TEE
- **Trade Agent**: Configurable auto-trading with TEE-protected execution

## TEE API Endpoints

Base URL: `https://p8080.m125.opf-mainnet-rofl-35.rofl.app`

### Unauthenticated

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/v1/connect` | Create new wallet. Returns `uid`, `wallets` (Solana + EVM addresses), `totp` (QR URI + secret), `backup_file` (encrypted), Sapphire tx receipt |
| `POST` | `/v1/login` | Authenticate with `uid` + `totp_code`. Returns JWT `token` |
| `POST` | `/v1/recovery/rotate` | Upload encrypted backup file → rotates TOTP & backup. Returns new `totp`, new `backup_file` |
| `POST` | `/v1/recovery/decrypt` | Decrypt backup file (for verification) |

### Authenticated (JWT required in `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/v1/wallets` | Get wallet addresses (Solana + EVM) |
| `POST` | `/v1/wallets/withdraw` | Send tokens. Body: `{ chain, token, toAddress, amount }` |
| `POST` | `/v1/trade/config` | Set trade agent config: `{ tradingEnabled, maxTradeAmountUsdc, allowedAssets }` |
| `GET` | `/v1/trade/config` | Get current trade config |
| `GET` | `/v1/trade/history` | Get trade execution history |

### Supported Chains & Tokens

| Chain | Native | USDC |
|-------|--------|------|
| Solana | SOL | USDC (SPL) |
| Ethereum | ETH | USDC (ERC-20) |

## Project Structure

```
PawPad/
├── packages/
│   ├── web/                    # PWA (Vite + React + TypeScript)
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── onboarding/     # Splash, MXE explanation, wallet type selection
│   │   │   │   ├── tee/            # TEELogin, TEESetup, RecoverTEEWallet
│   │   │   │   ├── agents/         # AgentRouter, AgentSetup, AgentDashboard
│   │   │   │   ├── Home.tsx        # Main wallet view (balances, assets, actions)
│   │   │   │   ├── Send.tsx        # Send tokens (SOL/ETH/USDC)
│   │   │   │   ├── FundWallet.tsx  # Receive — QR codes + copy address
│   │   │   │   ├── Swap.tsx        # Coming soon
│   │   │   │   └── Settings.tsx    # Backup, wallet info, session, logout
│   │   │   ├── services/
│   │   │   │   └── teeService.ts   # All TEE API calls, session management
│   │   │   ├── components/
│   │   │   │   └── common/
│   │   │   │       └── BottomNav.tsx
│   │   │   └── App.tsx             # Routes
│   │   ├── public/
│   │   │   └── images/             # MXE vault images, chain icons
│   │   ├── api/
│   │   │   └── tee/proxy.js        # Vercel serverless CORS proxy
│   │   ├── vite.config.ts          # Dev proxy for TEE API
│   │   └── vercel.json             # Production routing
│   └── core/                       # Shared types (currently minimal)
├── mobile/                         # React Native app (existing)
├── android/                        # Android build
└── src/                            # Original RN source
```

## Setup & Development

### Prerequisites
- Node.js 18+
- npm

### Local Development

```bash
cd packages/web
npm install
npx vite
```

Opens at `http://localhost:5173`. The Vite dev server proxies `/tee-api/*` to the Oasis ROFL TEE server, bypassing CORS.

### Production Build

```bash
cd packages/web
npm install
npx vite build
```

Output in `packages/web/dist/`.

### Deployment (Vercel)

Vercel settings:
- **Root Directory**: `packages/web`
- **Framework**: Vite
- **Build Command**: `npx vite build`
- **Output Directory**: `dist`

The `api/tee/proxy.js` serverless function handles CORS in production by proxying TEE API requests server-side.

## User Flows

### Wallet Creation
```
Onboarding → MXE Explanation → Choose Wallet Type → Create TEE Wallet
→ TEE Setup (scan TOTP QR + download backup) → Home
```

### Login (returning user)
```
TEE Login → Enter TOTP code → JWT session → Home
```

### Recovery (lost device)
```
TEE Login → "Recover existing wallet" → Upload backup file (.json or .txt)
→ Credentials rotated → New TOTP QR + new backup → Login with new TOTP
```

### Send Tokens
```
Home → Send → Select chain (Solana/Ethereum) → Select token (native/USDC)
→ Enter address + amount → Review → Confirm → TX broadcast via TEE
```

### Agent Trading
```
Home → Agent → Setup (if not configured) → Select assets + max trade + risk level
→ Activate → Dashboard (view config, trade history)
```

## Backup File Format

Both `.json` and `.txt` files are supported with identical structure:

```json
{
  "v": 1,
  "uid": "64dddc1f30e70a98dd3532f5cf09e4bd",
  "nonce_b64": "xzmjfdqV6cmbcTUQ",
  "ct_b64": "NjJImRa4A38mBMBl...",
  "tag_b64": "PT5qzhZPQDJ-m4D19Z6i1g"
}
```

The backup is AES-GCM encrypted inside the TEE. It can only be decrypted by the TEE enclave during recovery. The `uid` identifies the wallet, and the encrypted payload contains the key material.

## Environment

| Context | TEE API Route | Mechanism |
|---------|---------------|-----------|
| Local dev | `/tee-api/*` | Vite proxy → ROFL server |
| Production | `/api/tee/*` | Vercel serverless function → ROFL server |

Both bypass browser CORS restrictions by making requests server-side.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, React Router v6
- **Styling**: CSS Variables + inline styles (mobile-first, 430px max-width)
- **PWA**: vite-plugin-pwa (service worker, installable)
- **TEE Backend**: Oasis ROFL (Sapphire EVM + TEE enclave)
- **Authentication**: TOTP (RFC 6238) + JWT sessions
- **Chains**: Solana (mainnet), Ethereum (mainnet)
- **Deployment**: Vercel (static + serverless)

## Smart Contracts (Oasis Sapphire)

| Contract | Address |
|----------|---------|
| Main | `f0bae285...` |
| csCSPR Token | `d0845023...` |
| Auction | `93d923e3...` |

## License

Proprietary — ZkAGI
