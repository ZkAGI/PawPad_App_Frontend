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

//   wallet_type?: 'seed' | 'seedless';
//   device_share?: string;
//   publicKey?: string; 

//   // Unified vault components (SOL + ZEC together)
//   sol?: {
//     address: string;
//     mpc_provider?: string;
//     mxe_cluster_id?: string;
//     vault_id?: string;
//   };

//   // zec?: {
//   //   address: string;
//   //   viewing_key?: string;
//   //   wallet_id?: string;
//   //   provider?: string;
//   // };

//   zec?: {
//     address?: string;
//     transparent_address?: string;  // NEW
//     unified_address?: string;      // NEW
//     sapling_address?: string;      // NEW
//     viewing_key?: string | null;
//     provider?: string;
//     mpc_provider?: string;
//   };

//   oasis?: {
//       txHash?: string;
//       walletIdHash?: string;
//       stored?: boolean;
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
// // AGENT PREFERENCES TYPE (for AgentCreating screen)
// // ============================================================================

// export interface AgentPreferences {
//   risk_level: 'conservative' | 'moderate' | 'aggressive'; 
//   trading_pairs: string[];
//   cross_chain_swaps: boolean;
//   dark_pool_trading: boolean;
//   max_position_size: number;
//   auto_rebalancing: boolean;
//   enable_lending?: boolean;
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
//   // ChainSelection: undefined;
//   ChainSelection: {
//   walletType?: 'seed' | 'seedless';
// };

  
//   // ═══════════════════════════════════════════════════════════════
//   // Vault Creation Flow
//   // ═══════════════════════════════════════════════════════════════
//   EmailInput: { 
//     chain?: string;
//     walletType?: 'seed' | 'seedless';
//   };
//   VaultNameInput: { 
//     chain?: string; 
//     email?: string;
//     walletType?: 'seed' | 'seedless';
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
//     email?: string;
//     vaultName: string;
//     vaultType?: 'personal' | 'shared' | 'unified';
//     threshold?: number;
//     participants?: Array<{ id: string; name: string }>;
//   };
//   VaultSuccess: { 
//     vault: VaultData;
//     walletType?: 'seed' | 'seedless';
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
//     agent?: AgentData;  // For editing existing agent
//   };
//   AgentPreferences: { 
//     vault?: VaultData;
//   } | undefined;
//   AgentCreating: { 
//     vault: VaultData; 
//     preferences: AgentPreferences;
//   };
//   AgentDashboard: { 
//     vault: VaultData;
//     agent?: AgentData;
//   };
//   AgentChat: { 
//     agent: AgentData;
//   };
  
//   // ═══════════════════════════════════════════════════════════════
//   // NEW: Privacy Features (Arcium)
//   // ═══════════════════════════════════════════════════════════════
//   Lending: {
//     vault_id: string;
//     vault?: VaultData;
//   };
//   DarkPool: {
//     vault_id: string;
//     vault?: VaultData;
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

//   CreatingSeedlessVault: {
//     email?: string;
//     vaultName?: string;
//   };
  
//   RecoverSeedlessVault: undefined;
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

// // NEW: Privacy feature navigation props
// export type LendingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Lending'>;
// export type DarkPoolScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DarkPool'>;
// export type AgentDashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AgentDashboard'>;

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

// // NEW: Privacy feature route props
// export type LendingScreenRouteProp = RouteProp<RootStackParamList, 'Lending'>;
// export type DarkPoolScreenRouteProp = RouteProp<RootStackParamList, 'DarkPool'>;
// export type AgentDashboardScreenRouteProp = RouteProp<RootStackParamList, 'AgentDashboard'>;
// export type AgentCreatingScreenRouteProp = RouteProp<RootStackParamList, 'AgentCreating'>;

// // Seedless wallet navigation props
// export type CreatingSeedlessVaultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatingSeedlessVault'>;
// export type CreatingSeedlessVaultScreenRouteProp = RouteProp<RootStackParamList, 'CreatingSeedlessVault'>;
// export type RecoverSeedlessVaultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RecoverSeedlessVault'>;

// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RouteProp } from '@react-navigation/native';

// // ============================================================================
// // TEE WALLET RESPONSE TYPE (from Oasis API)
// // ============================================================================

// export interface TEEWallet {
//   chain: string;
//   address: string;
// }

// export interface TEEWallets {
//   evm: TEEWallet;
//   solana: {
//     address: string;
//   };
// }

// export interface TOTPConfig {
//   otpauth_uri: string;
// }

// export interface BackupFile {
//   v: number;
//   uid: string;
//   nonce_b64: string;
//   ct_b64: string;
//   tag_b64: string;
// }

// export interface SapphireTransaction {
//   ok: boolean;
//   tx: {
//     hash: string;
//     blockNumber: number;
//     status: number;
//   };
//   calldata: string;
//   signerAddress: string;
// }

// export interface TEEWalletResponse {
//   uid: string;
//   wallets: TEEWallets;
//   totp: TOTPConfig;
//   backup_file: BackupFile;
//   backup_hash: string;
//   sapphire: SapphireTransaction;
// }

// // ============================================================================
// // VAULT DATA TYPE (with unified vault support)
// // ============================================================================

// export interface VaultData {
//   vault_id: string;
//   vault_name: string;
//   vault_type?: 'unified' | 'personal' | 'shared' | 'sol' | 'zec' | 'tee';
//   email?: string;
//   created_at?: string;
//   totp?: {
//   otpauth_uri: string;
// };
// backup_file?: {
//   v: number;
//   uid: string;
//   nonce_b64: string;
//   ct_b64: string;
//   tag_b64: string;
// };

//   wallet_type?: 'seed' | 'seedless' | 'tee';
//   device_share?: string;
//   publicKey?: string; 

//   // Unified vault components (SOL + ZEC together)
//   sol?: {
//     address: string;
//     mpc_provider?: string;
//     mxe_cluster_id?: string;
//     vault_id?: string;
//   };

//   zec?: {
//     address?: string;
//     transparent_address?: string;
//     unified_address?: string;
//     sapling_address?: string;
//     viewing_key?: string | null;
//     provider?: string;
//     mpc_provider?: string;
//   };

//   // TEE wallet fields (EVM + Solana from Oasis)
//   tee?: {
//     uid: string;
//     evm: {
//       chain: string;
//       address: string;
//     };
//     solana: {
//       address: string;
//     };
//     backup_hash: string;
//     sapphire_tx?: string;
//   };

//   oasis?: {
//       txHash?: string;
//       walletIdHash?: string;
//       stored?: boolean;
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

// export function isTEEVault(vault: VaultData | null | undefined): boolean {
//   if (!vault) return false;
//   return vault.vault_type === 'tee' || vault.wallet_type === 'tee' || !!vault.tee;
// }

// export function getSolAddress(vault: VaultData | null | undefined): string | null {
//   if (!vault) return null;
//   // TEE vault - get Solana address from tee object
//   if (vault.tee?.solana?.address) return vault.tee.solana.address;
//   if (vault.sol?.address) return vault.sol.address;
//   if (vault.chain === 'SOL' && vault.address) return vault.address;
//   return null;
// }

// export function getEvmAddress(vault: VaultData | null | undefined): string | null {
//   if (!vault) return null;
//   // TEE vault - get EVM address from tee object
//   if (vault.tee?.evm?.address) return vault.tee.evm.address;
//   return null;
// }

// export function getZecAddress(vault: VaultData | null | undefined): string | null {
//   if (!vault) return null;
//   if (vault.zec?.address) return vault.zec.address;
//   if (vault.chain === 'ZEC' && vault.address) return vault.address;
//   return null;
// }

// // Get all addresses from a TEE vault
// export function getTEEAddresses(vault: VaultData | null | undefined): {
//   evm: string | null;
//   solana: string | null;
// } {
//   if (!vault?.tee) {
//     return { evm: null, solana: null };
//   }
//   return {
//     evm: vault.tee.evm?.address || null,
//     solana: vault.tee.solana?.address || null,
//   };
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
// // AGENT PREFERENCES TYPE (for AgentCreating screen)
// // ============================================================================

// export interface AgentPreferences {
//   risk_level: 'conservative' | 'moderate' | 'aggressive'; 
//   trading_pairs: string[];
//   cross_chain_swaps: boolean;
//   dark_pool_trading: boolean;
//   max_position_size: number;
//   auto_rebalancing: boolean;
//   enable_lending?: boolean;
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
//   ChainSelection: {
//     walletType?: 'seed' | 'seedless' | 'tee';
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // TEE Wallet Flow (NEW)
//   // ═══════════════════════════════════════════════════════════════
//   TEEWalletCreated: {
//     walletData: TEEWalletResponse;
//   };
//   TEEBackupSetup: {
//     walletData: TEEWalletResponse;
//   };
  
//   // ═══════════════════════════════════════════════════════════════
//   // Vault Creation Flow
//   // ═══════════════════════════════════════════════════════════════
//   EmailInput: { 
//     chain?: string;
//     walletType?: 'seed' | 'seedless' | 'tee';
//   };
//   VaultNameInput: { 
//     chain?: string; 
//     email?: string;
//     walletType?: 'seed' | 'seedless' | 'tee';
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
//     email?: string;
//     vaultName: string;
//     vaultType?: 'personal' | 'shared' | 'unified' | 'tee';
//     threshold?: number;
//     participants?: Array<{ id: string; name: string }>;
//   };
//   VaultSuccess: { 
//     vault: VaultData;
//     walletType?: 'seed' | 'seedless' | 'tee';
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
//     chain?: 'SOL' | 'ZEC' | 'EVM';
//   };
//   Receive: { 
//     vault: VaultData; 
//     chain?: 'SOL' | 'ZEC' | 'EVM';
//   };
//   SendConfirm: { 
//     vault: VaultData; 
//     to: string; 
//     amount: number; 
//     chain: 'SOL' | 'ZEC' | 'EVM';
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
//     direction: 'sol_to_zec' | 'zec_to_sol' | 'sol_to_evm' | 'evm_to_sol';
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
//     agent?: AgentData;
//   };
//   AgentPreferences: { 
//     vault?: VaultData;
//   } | undefined;
//   AgentCreating: { 
//     vault: VaultData; 
//     preferences: AgentPreferences;
//   };
//   AgentDashboard: { 
//     vault: VaultData;
//     agent?: AgentData;
//   };
//   AgentChat: { 
//     agent: AgentData;
//   };
  
//   // ═══════════════════════════════════════════════════════════════
//   // Privacy Features (Arcium)
//   // ═══════════════════════════════════════════════════════════════
//   Lending: {
//     vault_id: string;
//     vault?: VaultData;
//   };
//   DarkPool: {
//     vault_id: string;
//     vault?: VaultData;
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

//   CreatingSeedlessVault: {
//     email?: string;
//     vaultName?: string;
//   };
  
//   RecoverSeedlessVault: undefined;
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

// // TEE wallet navigation props (NEW)
// export type TEEWalletCreatedScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TEEWalletCreated'>;
// export type TEEBackupSetupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TEEBackupSetup'>;

// // Privacy feature navigation props
// export type LendingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Lending'>;
// export type DarkPoolScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DarkPool'>;
// export type AgentDashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AgentDashboard'>;

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

// // TEE wallet route props (NEW)
// export type TEEWalletCreatedScreenRouteProp = RouteProp<RootStackParamList, 'TEEWalletCreated'>;
// export type TEEBackupSetupScreenRouteProp = RouteProp<RootStackParamList, 'TEEBackupSetup'>;

// // Privacy feature route props
// export type LendingScreenRouteProp = RouteProp<RootStackParamList, 'Lending'>;
// export type DarkPoolScreenRouteProp = RouteProp<RootStackParamList, 'DarkPool'>;
// export type AgentDashboardScreenRouteProp = RouteProp<RootStackParamList, 'AgentDashboard'>;
// export type AgentCreatingScreenRouteProp = RouteProp<RootStackParamList, 'AgentCreating'>;

// // Seedless wallet navigation props
// export type CreatingSeedlessVaultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatingSeedlessVault'>;
// export type CreatingSeedlessVaultScreenRouteProp = RouteProp<RootStackParamList, 'CreatingSeedlessVault'>;
// export type RecoverSeedlessVaultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RecoverSeedlessVault'>;
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

// ============================================================================
// TEE WALLET RESPONSE TYPE (from Oasis API)
// ============================================================================

export interface TEEWallet {
  chain: string;
  address: string;
}

export interface TEEWallets {
  evm: TEEWallet;
  solana: {
    address: string;
  };
}

export interface TOTPConfig {
  otpauth_uri: string;
}

export interface BackupFile {
  v: number;
  uid: string;
  nonce_b64: string;
  ct_b64: string;
  tag_b64: string;
}

export interface SapphireTransaction {
  ok: boolean;
  tx: {
    hash: string;
    blockNumber: number;
    status: number;
  };
  calldata: string;
  signerAddress: string;
}

export interface TEEWalletResponse {
  uid: string;
  wallets: TEEWallets;
  totp: TOTPConfig;
  backup_file: BackupFile;
  backup_hash: string;
  sapphire: SapphireTransaction;
}

// ============================================================================
// VAULT DATA TYPE (with unified vault support)
// ============================================================================

export interface VaultData {
  vault_id: string;
  vault_name: string;
  vault_type?: 'unified' | 'personal' | 'shared' | 'sol' | 'zec' | 'tee';
  email?: string;
  created_at?: string;

  // TOTP for TEE/Seedless wallets
  totp?: TOTPConfig;
  
  // Backup file for TEE wallets
  backup_file?: BackupFile;

  wallet_type?: 'seed' | 'seedless' | 'tee';
  device_share?: string;
  publicKey?: string; 

  // Unified vault components (SOL + ZEC together)
  sol?: {
    address: string;
    mpc_provider?: string;
    mxe_cluster_id?: string;
    vault_id?: string;
  };

  zec?: {
    address?: string;
    transparent_address?: string;
    unified_address?: string;
    sapling_address?: string;
    viewing_key?: string | null;
    provider?: string;
    mpc_provider?: string;
  };

  // TEE wallet fields (EVM + Solana from Oasis)
  tee?: {
    uid: string;
    evm: {
      chain: string;
      address: string;
    };
    solana: {
      address: string;
    };
    backup_hash: string;
    sapphire_tx?: string;
  };

  oasis?: {
      txHash?: string;
      walletIdHash?: string;
      stored?: boolean;
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

export function isTEEVault(vault: VaultData | null | undefined): boolean {
  if (!vault) return false;
  return vault.vault_type === 'tee' || vault.wallet_type === 'tee' || !!vault.tee;
}

export function getSolAddress(vault: VaultData | null | undefined): string | null {
  if (!vault) return null;
  // TEE vault - get Solana address from tee object
  if (vault.tee?.solana?.address) return vault.tee.solana.address;
  if (vault.sol?.address) return vault.sol.address;
  if (vault.chain === 'SOL' && vault.address) return vault.address;
  return null;
}

export function getEvmAddress(vault: VaultData | null | undefined): string | null {
  if (!vault) return null;
  // TEE vault - get EVM address from tee object
  if (vault.tee?.evm?.address) return vault.tee.evm.address;
  return null;
}

export function getZecAddress(vault: VaultData | null | undefined): string | null {
  if (!vault) return null;
  if (vault.zec?.address) return vault.zec.address;
  if (vault.chain === 'ZEC' && vault.address) return vault.address;
  return null;
}

// Get all addresses from a TEE vault
export function getTEEAddresses(vault: VaultData | null | undefined): {
  evm: string | null;
  solana: string | null;
} {
  if (!vault?.tee) {
    return { evm: null, solana: null };
  }
  return {
    evm: vault.tee.evm?.address || null,
    solana: vault.tee.solana?.address || null,
  };
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
  risk_level: 'conservative' | 'moderate' | 'aggressive'; 
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
  ChainSelection: {
    walletType?: 'seed' | 'seedless' | 'tee';
  };

  // ═══════════════════════════════════════════════════════════════
  // TEE Wallet Flow (NEW)
  // ═══════════════════════════════════════════════════════════════
  TEESetup: {
    vault: VaultData;
  };
  TEELogin: undefined;
  TEEWalletCreated: {
    walletData: TEEWalletResponse;
  };
  TEEBackupSetup: {
    walletData: TEEWalletResponse;
  };
  RecoverTEEWallet: undefined;
  
  // ═══════════════════════════════════════════════════════════════
  // Vault Creation Flow
  // ═══════════════════════════════════════════════════════════════
  EmailInput: { 
    chain?: string;
    walletType?: 'seed' | 'seedless' | 'tee';
  };
  VaultNameInput: { 
    chain?: string; 
    email?: string;
    walletType?: 'seed' | 'seedless' | 'tee';
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
    vaultType?: 'personal' | 'shared' | 'unified' | 'tee';
    threshold?: number;
    participants?: Array<{ id: string; name: string }>;
  };
  VaultSuccess: { 
    vault: VaultData;
    walletType?: 'seed' | 'seedless' | 'tee';
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
    chain?: 'SOL' | 'ZEC' | 'EVM';
  };
  Receive: { 
    vault: VaultData; 
    chain?: 'SOL' | 'ZEC' | 'EVM';
  };
  SendConfirm: { 
    vault: VaultData; 
    to: string; 
    amount: number; 
    chain: 'SOL' | 'ZEC' | 'EVM';
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
    direction: 'sol_to_zec' | 'zec_to_sol' | 'sol_to_evm' | 'evm_to_sol';
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
    agent?: AgentData;
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
  // Privacy Features (Arcium)
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

  CreatingSeedlessVault: {
    email?: string;
    vaultName?: string;
  };
  
  RecoverSeedlessVault: undefined;
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

// TEE wallet navigation props (NEW)
export type TEEWalletCreatedScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TEEWalletCreated'>;
export type TEEBackupSetupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TEEBackupSetup'>;

// Privacy feature navigation props
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

// TEE wallet route props (NEW)
export type TEEWalletCreatedScreenRouteProp = RouteProp<RootStackParamList, 'TEEWalletCreated'>;
export type TEEBackupSetupScreenRouteProp = RouteProp<RootStackParamList, 'TEEBackupSetup'>;

// Privacy feature route props
export type LendingScreenRouteProp = RouteProp<RootStackParamList, 'Lending'>;
export type DarkPoolScreenRouteProp = RouteProp<RootStackParamList, 'DarkPool'>;
export type AgentDashboardScreenRouteProp = RouteProp<RootStackParamList, 'AgentDashboard'>;
export type AgentCreatingScreenRouteProp = RouteProp<RootStackParamList, 'AgentCreating'>;

// Seedless wallet navigation props
export type CreatingSeedlessVaultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatingSeedlessVault'>;
export type CreatingSeedlessVaultScreenRouteProp = RouteProp<RootStackParamList, 'CreatingSeedlessVault'>;
export type RecoverSeedlessVaultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RecoverSeedlessVault'>;