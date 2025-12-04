# 🐾 PawPad

### The Privacy-First Multi-Chain Wallet for Autonomous Agents

Why This Frontend Is Unique
PawPad isn't just a wallet UI — it's an agent control center. The frontend is designed around two layers:

Wallet Layer: Standard Send/Swap/Receive like any wallet
Agent Layer: Configure autonomous agents, monitor their status, review their transactions

Most wallets stop at layer 1. PawPad extends to layer 2, where you set up agents once and they act on your behalf — privately.
Tech Stack
PackageVersionPurposeReact Native0.82.1Cross-platform mobile frameworkTypeScript5.8.3Type safety@solana/web3.js1.98.4Solana blockchain interactions@coral-xyz/anchor0.32.1Solana program framework@react-navigation7.xScreen navigationreact-native-keychain10.0.0Secure key storagereact-native-reanimated4.1.5Smooth animationsaxios1.13.2API callsAsyncStorage2.2.0Local data persistence
---

## 📱 Download

**Android APK**: [`pawpad-v1.0.0.apk`](./releases/pawpad-v1.0.0.apk)


## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   PAWPAD                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│                              ┌─────────────────┐                                │
│                              │      USER       │                                │
│                              └────────┬────────┘                                │
│                                       │                                          │
│                         ┌─────────────┴─────────────┐                           │
│                         ▼                           ▼                           │
│              ┌─────────────────────┐    ┌─────────────────────┐                │
│              │    SEED WALLET      │    │  SEEDLESS WALLET    │                │
│              │  • BIP39 mnemonic   │    │  • FROST 2-of-2     │                │
│              │  • SOL + ZEC keys   │    │  • Oasis TEE share  │                │
│              │    in parallel      │    │  • NEAR Intents     │                │
│              └──────────┬──────────┘    └──────────┬──────────┘                │
│                         └────────────┬─────────────┘                            │
│                                      ▼                                          │
│              ┌───────────────────────────────────────────────┐                  │
│              │              UNIFIED VAULT                     │                  │
│              │   ┌─────────────┐       ┌─────────────┐       │                  │
│              │   │   Solana    │       │    Zcash    │       │                  │
│              │   │   • SOL     │       │   • t-addr  │       │                  │
│              │   │   • SPL     │       │   • z-addr  │       │                  │
│              │   │             │       │   • u-addr  │       │                  │
│              │   └─────────────┘       └─────────────┘       │                  │
│              └───────────────────────┬───────────────────────┘                  │
│                                      │                                          │
│    ┌─────────────────────────────────┼─────────────────────────────────┐       │
│    │              AUTONOMOUS AGENTS  │                                  │       │
│    ▼                    ▼            ▼            ▼                    ▼       │
│ ┌────────┐      ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────┐    │
│ │ZYNAPSE │      │  DARK POOL  │ │ PHILANTHROPY│ │    SWAP     │ │TRADING │    │
│ │SIGNALS │─────▶│  (Arcium)   │ │   AGENT     │ │   (NEAR)    │ │ AGENT  │    │
│ │        │      │             │ │             │ │             │ │        │    │
│ │ What   │      │ Encrypted   │ │ AI-powered  │ │ SOL ↔ ZEC   │ │ Auto   │    │
│ │ to buy │      │ order       │ │ ZEC         │ │ atomic      │ │ execute│    │
│ │ & sell │      │ matching    │ │ donations   │ │ swaps       │ │ trades │    │
│ └────────┘      └─────────────┘ └─────────────┘ └─────────────┘ └────────┘    │
│                                                                                  │
│                          ┌────────────────────┐                                 │
│                          │   WALLET ACTIONS   │                                 │
│                          │  Send │ Swap │ Rcv │                                 │
│                          └────────────────────┘                                 │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```


```

### 🔮 Coming Soon: Lit Protocol PKPs

```
Future: Lit Protocol Integration
     ├──► PKPs (Programmable Key Pairs) for threshold signing
     ├──► TEE-backed key storage
     ├──► Programmable signing conditions
     └──► Multi-chain support out of the box

Status: In test phase, available soon
```

---

## 🤖 Autonomous Agents

### How Agents Work

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   USER      │     │   AGENT     │     │   STATUS    │     │  AUTONOMOUS │
│   INPUT     │ ──▶ │  PROCESSES  │ ──▶ │   SHOWS     │ ──▶ │    TX       │
│             │     │             │     │             │     │             │
│ • Goals     │     │ • AI infer  │     │ • Pending   │     │ • Signs     │
│ • Limits    │     │ • Signals   │     │ • Executing │     │ • Broadcasts│
│ • Schedule  │     │ • Matching  │     │ • Complete  │     │ • Records   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘

User sets it up once → Agent runs autonomously → User monitors status
```

### Philanthropy Agent

| User Sets | Agent Does |
|-----------|------------|
| Causes (natural language) | Matches to verified foundations |
| Budget (ZEC/month) | Calculates allocation % |
| Source (SOL or ZEC) | Converts via NEAR Intents if needed |
| Auto-pay on/off | Executes & logs transactions |

### Trading Agent

| User Sets | Agent Does |
|-----------|------------|
| Risk level | Listens to Zynapse signals (by ZkAGI) |
| Max position | Evaluates against limits |
| Auto-execute | Places dark pool orders |
| Pairs to trade | Manages positions, reports PnL |

---

## 📱 Frontend

### Why This Frontend Is Unique

PawPad isn't just a wallet UI — it's an **agent control center**:

- **Wallet Layer**: Standard Send/Swap/Receive like any wallet
- **Agent Layer**: Configure autonomous agents, monitor status, review transactions

Most wallets stop at layer 1. PawPad extends to layer 2.

### Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| React Native | 0.82.1 | Cross-platform mobile |
| TypeScript | 5.8.3 | Type safety |
| @solana/web3.js | 1.98.4 | Solana interactions |
| @coral-xyz/anchor | 0.32.1 | Solana programs |
| @react-navigation | 7.x | Screen navigation |
| react-native-keychain | 10.0.0 | Secure key storage |
| react-native-reanimated | 4.1.5 | Smooth animations |
| axios | 1.13.2 | API calls |
| AsyncStorage | 2.2.0 | Local persistence |


### Note on Expo

> We initially planned Expo SDK but it caused compatibility issues with native crypto modules (`react-native-keychain`, `@solana/web3.js` polyfills). Had to go bare React Native. May revisit when Expo crypto support improves.

### Project Structure

```
mobile/
├── src/
│   ├── screens/
│   │   ├── onboarding/          # ChainSelect, WalletType, VaultSetup, Creating, Success
│   │   ├── wallet/              # Home, Send, Receive, Swap, History
│   │   ├── agents/              # PhilanthropyAgent, TradingAgent, AgentDashboard
│   │   └── settings/            # Backup, Security
│   ├── components/
│   │   ├── common/              # Button, Card, Input, Modal
│   │   ├── wallet/              # BalanceCard, TokenRow, AddressDisplay
│   │   └── agents/              # StatusBadge, ActivityFeed, SignalCard
│   ├── context/                 # VaultContext, AgentContext
│   └── services/                # api, helius, arcium, nearIntents, secureStorage
├── App.tsx
└── package.json
```

### Screen Flow

```
ONBOARDING
Chain Select ──► Wallet Type ──► Vault Setup ──► Creating ──► Success ──► Home

MAIN APP
                         HOME
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
      Send              Swap             Agents
   (manual)          (SOL↔ZEC)      (autonomous)
```


---

## 🚀 Running

### Mobile (Android)

```bash
cd mobile
npm install
npx react-native run-android
```
