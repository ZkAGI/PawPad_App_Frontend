// /**
//  * Navigation Types - Complete Version
//  * 
//  * REPLACE your entire src/types/navigation.ts with this file
//  */

// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RouteProp } from '@react-navigation/native';

// // ============================================================================
// // VAULT DATA TYPE (with unified vault support)
// // ============================================================================

// export interface VaultData {
//   vault_id: string;
//   vault_name: string;
//   vault_type?: 'unified' | 'personal' | 'shared' | 'sol' | 'zec';
//   email?: string;
//   created_at?: string;

//   // Unified vault components (SOL + ZEC together)
//   sol?: {
//     address: string;
//     mpc_provider?: string;
//     mxe_cluster_id?: string;
//     vault_id?: string;
//   };

//   zec?: {
//     address: string;
//     viewing_key?: string;
//     wallet_id?: string;
//     provider?: string;
//   };

//   // Legacy fields (backwards compatibility)
//   chain?: string;
//   address?: string;
//   mpc_provider?: string;
//   balance?: number;
//   lastUpdated?: string;

//   // FROST-specific fields (for shared ZEC vaults)
//   threshold?: number;
//   totalParticipants?: number;
//   participants?: Array<{
//     id: string;
//     name: string;
//     hasKeyShare?: boolean;
//   }>;
//   groupPublicKey?: string;
// }

// // ============================================================================
// // HELPER FUNCTIONS
// // ============================================================================

// export function isUnifiedVault(vault: VaultData | null | undefined): boolean {
//   if (!vault) return false;
//   return vault.vault_type === 'unified' && !!vault.sol && !!vault.zec;
// }

// export function getSolAddress(vault: VaultData | null | undefined): string | null {
//   if (!vault) return null;
//   if (vault.sol?.address) return vault.sol.address;
//   if (vault.chain === 'SOL' && vault.address) return vault.address;
//   return null;
// }

// export function getZecAddress(vault: VaultData | null | undefined): string | null {
//   if (!vault) return null;
//   if (vault.zec?.address) return vault.zec.address;
//   if (vault.chain === 'ZEC' && vault.address) return vault.address;
//   return null;
// }

// // ============================================================================
// // AGENT DATA TYPE
// // ============================================================================

// export interface AgentData {
//   agent_id: string;
//   name: string;
//   status: 'active' | 'paused' | 'stopped';
//   preferences: {
//     riskLevel: string;
//     investmentStyle: string;
//     favoriteTokens: string[];
//     maxTradeSize: number;
//   };
//   performance?: {
//     totalTrades: number;
//     successRate: number;
//     totalProfit: number;
//   };
// }

// // ============================================================================
// // ROOT STACK PARAM LIST - ALL YOUR SCREENS
// // ============================================================================

// export type RootStackParamList = {
//   // ═══════════════════════════════════════════════════════════════
//   // Onboarding Flow
//   // ═══════════════════════════════════════════════════════════════
//   Onboarding: undefined;
//   MXEExplanation: undefined;
//   QuickSummary: undefined;
//   ChainSelection: undefined;
  
//   // ═══════════════════════════════════════════════════════════════
//   // Vault Creation Flow
//   // ═══════════════════════════════════════════════════════════════
//   EmailInput: { 
//     chain?: string;
//   };
//   VaultNameInput: { 
//     chain?: string; 
//     email?: string;
//   };
//   CreateVault: { 
//     chain?: string;
//   };
//   VaultSetup: { 
//     chain?: string; 
//     email?: string;
//   };
//   CreatingVault: { 
//     chain?: string; 
//     email?: string;  // Made optional to fix type errors
//     vaultName: string;
//     vaultType?: 'personal' | 'shared' | 'unified';
//     threshold?: number;
//     participants?: Array<{ id: string; name: string }>;
//   };
//   VaultSuccess: { 
//     vault: VaultData;
//   };
  
//   // ═══════════════════════════════════════════════════════════════
//   // Main Screens
//   // ═══════════════════════════════════════════════════════════════
//   Home: { 
//     vault?: VaultData;
//   } | undefined;
//   VaultDetails: { 
//     vault: VaultData;
//   };
//   Settings: undefined;
  
//   // ═══════════════════════════════════════════════════════════════
//   // Send/Receive
//   // ═══════════════════════════════════════════════════════════════
//   Send: { 
//     vault: VaultData; 
//     chain?: 'SOL' | 'ZEC';
//   };
//   Receive: { 
//     vault: VaultData; 
//     chain?: 'SOL' | 'ZEC';
//   };
//   SendConfirm: { 
//     vault: VaultData; 
//     to: string; 
//     amount: number; 
//     chain: 'SOL' | 'ZEC';
//     memo?: string;
//   };
  
//   // ═══════════════════════════════════════════════════════════════
//   // Swap
//   // ═══════════════════════════════════════════════════════════════
//   Swap: { 
//     vault?: VaultData;
//   } | undefined;
//   SwapConfirm: {
//     vault: VaultData;
//     direction: 'sol_to_zec' | 'zec_to_sol';
//     amount: number;
//     quote: object;
//   };
  
//   // ═══════════════════════════════════════════════════════════════
//   // Fund Wallet
//   // ═══════════════════════════════════════════════════════════════
//   FundWallet: { 
//     vault?: VaultData;
//   } | undefined;
//   FundConfirm: { 
//     vault: VaultData; 
//     sourceChain: string; 
//     amount: number;
//     quote: object;
//   };
  
//   // ═══════════════════════════════════════════════════════════════
//   // Recovery & Backup
//   // ═══════════════════════════════════════════════════════════════
//   Recovery: undefined;
//   RecoveryVerify: { 
//     email: string;
//   };
//   RecoverySuccess: { 
//     vaults: VaultData[];
//   };
//   Backup: { 
//     vault?: VaultData;
//   } | undefined;
//   BackupExport: { 
//     vault: VaultData;
//   };
  
//   // ═══════════════════════════════════════════════════════════════
//   // Agent Screens
//   // ═══════════════════════════════════════════════════════════════
//   AgentSetup: { 
//     vault: VaultData;
//   };
//   AgentPreferences: { 
//     vault?: VaultData;
//   } | undefined;
//   AgentCreating: { 
//     vault?: VaultData; 
//     preferences?: object;
//   } | undefined;
//   AgentDashboard: { 
//     agent?: AgentData; 
//     vault?: VaultData;
//   } | undefined;
//   AgentChat: { 
//     agent: AgentData;
//   };
  
//   // ═══════════════════════════════════════════════════════════════
//   // Transaction History
//   // ═══════════════════════════════════════════════════════════════
//   Transactions: { 
//     vault: VaultData;
//   };
//   TransactionDetails: { 
//     txId: string; 
//     vault: VaultData;
//   };
  
//   // ═══════════════════════════════════════════════════════════════
//   // Additional screens
//   // ═══════════════════════════════════════════════════════════════
//   QRScanner: { 
//     onScan?: (data: string) => void;
//   };
//   AddressBook: undefined;
//   Security: undefined;
//   About: undefined;
// };

// // ============================================================================
// // NAVIGATION PROP TYPES
// // ============================================================================

// export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// // Screen-specific navigation props
// export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
// export type VaultSuccessScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VaultSuccess'>;
// export type CreatingVaultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatingVault'>;
// export type SendScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Send'>;
// export type SwapScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Swap'>;
// export type ChainSelectionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChainSelection'>;
// export type QuickSummaryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'QuickSummary'>;

// // ============================================================================
// // ROUTE PROP TYPES
// // ============================================================================

// export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
// export type VaultSuccessScreenRouteProp = RouteProp<RootStackParamList, 'VaultSuccess'>;
// export type CreatingVaultScreenRouteProp = RouteProp<RootStackParamList, 'CreatingVault'>;
// export type SendScreenRouteProp = RouteProp<RootStackParamList, 'Send'>;
// export type SwapScreenRouteProp = RouteProp<RootStackParamList, 'Swap'>;
// export type EmailInputScreenRouteProp = RouteProp<RootStackParamList, 'EmailInput'>;
// export type ChainSelectionScreenRouteProp = RouteProp<RootStackParamList, 'ChainSelection'>;


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
// AGENT PREFERENCES TYPE (for AgentCreating screen)
// ============================================================================

export interface AgentPreferences {
  risk_level: 'Conservative' | 'Moderate' | 'Aggressive';
  trading_pairs: string[];
  cross_chain_swaps: boolean;
  dark_pool_trading: boolean;
  max_position_size: number;
  auto_rebalancing: boolean;
  enable_lending?: boolean;
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
    email?: string;
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
    agent?: AgentData;  // For editing existing agent
  };
  AgentPreferences: { 
    vault?: VaultData;
  } | undefined;
  AgentCreating: { 
    vault: VaultData; 
    preferences: AgentPreferences;
  };
  AgentDashboard: { 
    vault: VaultData;
    agent?: AgentData;
  };
  AgentChat: { 
    agent: AgentData;
  };
  
  // ═══════════════════════════════════════════════════════════════
  // NEW: Privacy Features (Arcium)
  // ═══════════════════════════════════════════════════════════════
  Lending: {
    vault_id: string;
    vault?: VaultData;
  };
  DarkPool: {
    vault_id: string;
    vault?: VaultData;
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

// NEW: Privacy feature navigation props
export type LendingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Lending'>;
export type DarkPoolScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DarkPool'>;
export type AgentDashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AgentDashboard'>;

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

// NEW: Privacy feature route props
export type LendingScreenRouteProp = RouteProp<RootStackParamList, 'Lending'>;
export type DarkPoolScreenRouteProp = RouteProp<RootStackParamList, 'DarkPool'>;
export type AgentDashboardScreenRouteProp = RouteProp<RootStackParamList, 'AgentDashboard'>;
export type AgentCreatingScreenRouteProp = RouteProp<RootStackParamList, 'AgentCreating'>;