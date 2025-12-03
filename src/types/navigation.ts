// export type RootStackParamList = {
//   Onboarding: undefined;
//   MXEExplanation: undefined;
//   QuickSummary: undefined;
//   ChainSelection: undefined;
//   EmailInput: {
//     chain: string;
//   };
//   VaultNameInput: {
//     chain: string;
//     email: string;
//   };
//   CreatingVault: {
//     chain: string;
//     email: string;
//     vaultName: string;
//   };
//   VaultSuccess: {
//     vault: {
//       vault_id: string;
//       vault_name: string;
//       chain: string;
//       address: string;
//       mpc_provider: string;
//       created_at: string;
//     };
//   };
//   Home: {
//     vault?: {
//       vault_id: string;
//       vault_name: string;
//       chain: string;
//       address: string;
//       mpc_provider: string;
//       created_at: string;
//     };
//   };
//   Swap: undefined;
//   AgentPreferences: {
//     vault: {
//       vault_id: string;
//       vault_name: string;
//       chain: string;
//       address: string;
//       mpc_provider: string;
//       created_at: string;
//     };
//   };
//   AgentCreating: {
//     vault: {
//       vault_id: string;
//       vault_name: string;
//       chain: string;
//       address: string;
//       mpc_provider: string;
//       created_at: string;
//     };
//     preferences: {
//       vault_id: string;
//       risk_level: string;
//       auto_rebalance: boolean;
//       cross_chain_swaps: boolean;
//       dark_pool_trading: boolean;
//       max_position_size: number;
//       trading_pairs: string[];
//     };
//   };
//   AgentDashboard: {
//     vault: {
//       vault_id: string;
//       vault_name: string;
//       chain: string;
//       address: string;
//       mpc_provider: string;
//       created_at: string;
//     };
//     agent: {
//       agent_id: string;
//       vault_id: string;
//       preferences: {
//         risk_level: string;
//         auto_rebalance: boolean;
//         cross_chain_swaps: boolean;
//         dark_pool_trading: boolean;
//         max_position_size: number;
//         trading_pairs: string[];
//       };
//       created_at: string;
//     };
//   };
//   FundWallet: {
//     vault: {
//       vault_id: string;
//       vault_name: string;
//       chain: string;
//       address: string;
//       mpc_provider: string;
//       created_at: string;
//     };
//   };
// };

// declare global {
//   namespace ReactNavigation {
//     interface RootParamList extends RootStackParamList {}
//   }
// }

// types/navigation.ts

// Vault type shared across screens
// export interface VaultData {
//   vault_id: string;
//   vault_name: string;
//   chain: string;
//   address: string;
//   mpc_provider: string;
//   created_at: string;
//   email?: string;
//   // FROST-specific fields (ZEC vaults)
//   vault_type?: 'personal' | 'shared';
//   threshold?: number;
//   totalParticipants?: number;
//   participants?: Array<{
//     id: string;
//     name: string;
//     hasKeyShare?: boolean;
//   }>;
//   groupPublicKey?: string;
// }

// // Agent preferences
// export interface AgentPreferences {
//   vault_id: string;
//   risk_level: string;
//   auto_rebalance: boolean;
//   cross_chain_swaps: boolean;
//   dark_pool_trading: boolean;
//   max_position_size: number;
//   trading_pairs: string[];
// }

// // Agent data
// export interface AgentData {
//   agent_id: string;
//   vault_id: string;
//   preferences: AgentPreferences;
//   created_at: string;
// }

// // Participant for shared vaults
// export interface Participant {
//   id: string;
//   name: string;
// }

// export type RootStackParamList = {
//   // Onboarding flow
//   Onboarding: undefined;
//   MXEExplanation: undefined;
//   QuickSummary: undefined;
//   Recovery: undefined;
//   Backup: undefined;
  
//   // Vault creation flow
//   ChainSelection: undefined;
  
//   EmailInput: {
//     chain: string;
//     walletType?: 'seed' | 'seedless';
//   };
  
//   VaultNameInput: {
//     chain: string;
//     email: string;
//   };
  
//   // NEW: Vault type selection (for ZEC)
//   VaultTypeSelection: {
//     chain: string;
//     email: string;
//     vaultName: string;
//   };
  
//   // NEW: Shared vault setup (participants)
//   SharedVaultSetup: {
//     chain: string;
//     email: string;
//     vaultName: string;
//   };
  
//   CreatingVault: {
//     chain: string;
//     email: string;
//     vaultName: string;
//     // NEW: FROST-specific params
//     vaultType?: 'personal' | 'shared';
//     threshold?: number;
//     participants?: Participant[];
//   };
  
//   VaultSuccess: {
//     vault: VaultData;
//   };
  
//   // Main screens
//   Home: {
//     vault?: VaultData;
//   };
  
//   Swap: undefined;
  
//   // Fund wallet with cross-chain support
//   FundWallet: {
//     vault: VaultData;
//   };
  
//   // NEW: Funding status tracking
//   FundingStatus: {
//     fundingId: string;
//     vault: VaultData;
//   };
  
//   // Agent flow
//   AgentPreferences: {
//     vault: VaultData;
//   };
  
//   AgentCreating: {
//     vault: VaultData;
//     preferences: AgentPreferences;
//   };
  
//   AgentDashboard: {
//     vault: VaultData;
//     agent: AgentData;
//   };
  
//   // NEW: Transaction signing (for shared vaults)
//   SignTransaction: {
//     vault: VaultData;
//     transaction: {
//       to: string;
//       amount: number;
//       memo?: string;
//     };
//   };
  
//   // NEW: Vault details/management
//   VaultDetails: {
//     vault: VaultData;
//   };
  
//   // NEW: Vault list
//   VaultList: undefined;
// };

// declare global {
//   namespace ReactNavigation {
//     interface RootParamList extends RootStackParamList {}
//   }
// }

/**
 * Navigation Types - Complete Version
 * 
 * REPLACE your entire src/types/navigation.ts with this file
 */

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

// ============================================================================
// VAULT DATA TYPE (with unified vault support)
// ============================================================================

export interface VaultData {
  vault_id: string;
  vault_name: string;
  vault_type?: 'unified' | 'personal' | 'shared' | 'sol' | 'zec';
  email?: string;
  created_at?: string;

  // Unified vault components (SOL + ZEC together)
  sol?: {
    address: string;
    mpc_provider?: string;
    mxe_cluster_id?: string;
    vault_id?: string;
  };

  zec?: {
    address: string;
    viewing_key?: string;
    wallet_id?: string;
    provider?: string;
  };

  // Legacy fields (backwards compatibility)
  chain?: string;
  address?: string;
  mpc_provider?: string;
  balance?: number;
  lastUpdated?: string;

  // FROST-specific fields (for shared ZEC vaults)
  threshold?: number;
  totalParticipants?: number;
  participants?: Array<{
    id: string;
    name: string;
    hasKeyShare?: boolean;
  }>;
  groupPublicKey?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function isUnifiedVault(vault: VaultData | null | undefined): boolean {
  if (!vault) return false;
  return vault.vault_type === 'unified' && !!vault.sol && !!vault.zec;
}

export function getSolAddress(vault: VaultData | null | undefined): string | null {
  if (!vault) return null;
  if (vault.sol?.address) return vault.sol.address;
  if (vault.chain === 'SOL' && vault.address) return vault.address;
  return null;
}

export function getZecAddress(vault: VaultData | null | undefined): string | null {
  if (!vault) return null;
  if (vault.zec?.address) return vault.zec.address;
  if (vault.chain === 'ZEC' && vault.address) return vault.address;
  return null;
}

// ============================================================================
// AGENT DATA TYPE
// ============================================================================

export interface AgentData {
  agent_id: string;
  name: string;
  status: 'active' | 'paused' | 'stopped';
  preferences: {
    riskLevel: string;
    investmentStyle: string;
    favoriteTokens: string[];
    maxTradeSize: number;
  };
  performance?: {
    totalTrades: number;
    successRate: number;
    totalProfit: number;
  };
}

// ============================================================================
// ROOT STACK PARAM LIST - ALL YOUR SCREENS
// ============================================================================

export type RootStackParamList = {
  // ═══════════════════════════════════════════════════════════════
  // Onboarding Flow
  // ═══════════════════════════════════════════════════════════════
  Onboarding: undefined;
  MXEExplanation: undefined;
  QuickSummary: undefined;
  ChainSelection: undefined;
  
  // ═══════════════════════════════════════════════════════════════
  // Vault Creation Flow
  // ═══════════════════════════════════════════════════════════════
  EmailInput: { 
    chain?: string;
  };
  VaultNameInput: { 
    chain?: string; 
    email?: string;
  };
  CreateVault: { 
    chain?: string;
  };
  VaultSetup: { 
    chain?: string; 
    email?: string;
  };
  CreatingVault: { 
    chain?: string; 
    email?: string;  // Made optional to fix type errors
    vaultName: string;
    vaultType?: 'personal' | 'shared' | 'unified';
    threshold?: number;
    participants?: Array<{ id: string; name: string }>;
  };
  VaultSuccess: { 
    vault: VaultData;
  };
  
  // ═══════════════════════════════════════════════════════════════
  // Main Screens
  // ═══════════════════════════════════════════════════════════════
  Home: { 
    vault?: VaultData;
  } | undefined;
  VaultDetails: { 
    vault: VaultData;
  };
  Settings: undefined;
  
  // ═══════════════════════════════════════════════════════════════
  // Send/Receive
  // ═══════════════════════════════════════════════════════════════
  Send: { 
    vault: VaultData; 
    chain?: 'SOL' | 'ZEC';
  };
  Receive: { 
    vault: VaultData; 
    chain?: 'SOL' | 'ZEC';
  };
  SendConfirm: { 
    vault: VaultData; 
    to: string; 
    amount: number; 
    chain: 'SOL' | 'ZEC';
    memo?: string;
  };
  
  // ═══════════════════════════════════════════════════════════════
  // Swap
  // ═══════════════════════════════════════════════════════════════
  Swap: { 
    vault?: VaultData;
  } | undefined;
  SwapConfirm: {
    vault: VaultData;
    direction: 'sol_to_zec' | 'zec_to_sol';
    amount: number;
    quote: object;
  };
  
  // ═══════════════════════════════════════════════════════════════
  // Fund Wallet
  // ═══════════════════════════════════════════════════════════════
  FundWallet: { 
    vault?: VaultData;
  } | undefined;
  FundConfirm: { 
    vault: VaultData; 
    sourceChain: string; 
    amount: number;
    quote: object;
  };
  
  // ═══════════════════════════════════════════════════════════════
  // Recovery & Backup
  // ═══════════════════════════════════════════════════════════════
  Recovery: undefined;
  RecoveryVerify: { 
    email: string;
  };
  RecoverySuccess: { 
    vaults: VaultData[];
  };
  Backup: { 
    vault?: VaultData;
  } | undefined;
  BackupExport: { 
    vault: VaultData;
  };
  
  // ═══════════════════════════════════════════════════════════════
  // Agent Screens
  // ═══════════════════════════════════════════════════════════════
  AgentSetup: { 
    vault: VaultData;
  };
  AgentPreferences: { 
    vault?: VaultData;
  } | undefined;
  AgentCreating: { 
    vault?: VaultData; 
    preferences?: object;
  } | undefined;
  AgentDashboard: { 
    agent?: AgentData; 
    vault?: VaultData;
  } | undefined;
  AgentChat: { 
    agent: AgentData;
  };
  
  // ═══════════════════════════════════════════════════════════════
  // Transaction History
  // ═══════════════════════════════════════════════════════════════
  Transactions: { 
    vault: VaultData;
  };
  TransactionDetails: { 
    txId: string; 
    vault: VaultData;
  };
  
  // ═══════════════════════════════════════════════════════════════
  // Additional screens
  // ═══════════════════════════════════════════════════════════════
  QRScanner: { 
    onScan?: (data: string) => void;
  };
  AddressBook: undefined;
  Security: undefined;
  About: undefined;
};

// ============================================================================
// NAVIGATION PROP TYPES
// ============================================================================

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Screen-specific navigation props
export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
export type VaultSuccessScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VaultSuccess'>;
export type CreatingVaultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatingVault'>;
export type SendScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Send'>;
export type SwapScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Swap'>;
export type ChainSelectionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChainSelection'>;
export type QuickSummaryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'QuickSummary'>;

// ============================================================================
// ROUTE PROP TYPES
// ============================================================================

export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
export type VaultSuccessScreenRouteProp = RouteProp<RootStackParamList, 'VaultSuccess'>;
export type CreatingVaultScreenRouteProp = RouteProp<RootStackParamList, 'CreatingVault'>;
export type SendScreenRouteProp = RouteProp<RootStackParamList, 'Send'>;
export type SwapScreenRouteProp = RouteProp<RootStackParamList, 'Swap'>;
export type EmailInputScreenRouteProp = RouteProp<RootStackParamList, 'EmailInput'>;
export type ChainSelectionScreenRouteProp = RouteProp<RootStackParamList, 'ChainSelection'>;