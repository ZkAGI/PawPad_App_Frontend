import AsyncStorage from '@react-native-async-storage/async-storage';

const TEE_API_BASE = 'https://p8080.m125.opf-mainnet-rofl-35.rofl.app';

// ════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════

export interface TEEBackupFile {
  v: number;
  uid: string;
  nonce_b64: string;
  ct_b64: string;
  tag_b64: string;
}

export interface TEEWallet {
  chain: string;
  address: string;
}

export interface TEEWallets {
  evm: TEEWallet;
  solana: { address: string };
}

export interface TOTPConfig {
  otpauth_uri: string;
  secret?: string;
}

// /v1/connect response
export interface CreateWalletResponse {
  uid: string;
  wallets: TEEWallets;
  totp: TOTPConfig;
  backup_file: TEEBackupFile;
  backup_hash: string;
  sapphire: {
    ok: boolean;
    tx: { hash?: string; blockNumber?: number; status?: number };
  };
}

// /v1/login response
export interface LoginResponse {
  token: string;
}

// /v1/wallets response
export interface WalletsResponse {
  uid: string;
  wallets: TEEWallets;
}

// /v1/trade/config
export interface TradeConfig {
  tradingEnabled: boolean;
  maxTradeAmountUsdc: number;
  allowedAssets: string[];
}

export interface TradeConfigResponse {
  ok: boolean;
  config: TradeConfig & { uid: string };
}

// /v1/trade/history
export interface TradeHistoryItem {
  uid: string;
  asset: string;
  signal: 'BUY' | 'SELL';
  signalPrice: number;
  chain: string;
  txHash: string;
  amountIn: string;
  tokenIn: string;
  status: 'success' | 'pending' | 'failed';
  timestamp: string;
}

export interface TradeHistoryResponse {
  ok: boolean;
  history: TradeHistoryItem[];
}

// /v1/recovery/decrypt response
export interface DecryptBackupResponse {
  ok: boolean;
  payload: {
    v: number;
    uid: string;
    totpSecret: string;
    created_at: number;
  };
}

// /v1/recovery/rotate response
export interface RecoveryRotateResponse {
  ok: boolean;
