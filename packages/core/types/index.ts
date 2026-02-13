// Wallet types
export interface Vault {
  vault_id: string;
  vault_name: string;
  chain: 'SOL' | 'ZEC';
  address: string;
  mpc_provider: string;
  created_at: string;
}

export interface Balance {
  token: string;
  amount: number;
  usd_value: number;
  chain: 'SOL' | 'ZEC';
}

export interface Transaction {
  id: string;
  vault_id: string;
  type: 'send' | 'receive' | 'swap';
  amount: number;
  token: string;
  to?: string;
  from?: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
  signature?: string;
}

// Agent types
export interface Agent {
  id: string;
  type: 'philanthropy' | 'trading';
  name: string;
  status: 'active' | 'paused' | 'stopped';
  config: AgentConfig;
  last_action?: string;
  created_at: string;
}

export interface AgentConfig {
  chain: 'SOL' | 'ZEC';
  vault_id: string;
  max_amount_per_tx: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  [key: string]: unknown;
}

// Onboarding types
export type ChainOption = 'SOL' | 'ZEC' | 'BOTH';
export type WalletTypeOption = 'seed' | 'seedless';

export interface OnboardingState {
  chain: ChainOption | null;
  walletType: WalletTypeOption | null;
  vaultName: string;
}

// Navigation (web uses routes, mobile uses stack)
export type AppScreen =
  | 'onboarding'
  | 'home'
  | 'send'
  | 'receive'
  | 'swap'
  | 'history'
  | 'agents'
  | 'settings';
