/**
 * PawPad Navigation Types
 * 
 * UPDATED: Unified Vault support (SOL + ZEC)
 */

// ═══════════════════════════════════════════════════════════════════════════
// VAULT DATA TYPE (UNIFIED)
// ═══════════════════════════════════════════════════════════════════════════

export interface VaultData {
  vault_id: string;
  vault_name: string;
  vault_type: 'unified' | 'sol' | 'zec' | 'personal' | 'shared';
  email?: string;
  created_at: string;

  // ═══════════════════════════════════════════════════════════════
  // UNIFIED VAULT: Contains both SOL and ZEC
  // ═══════════════════════════════════════════════════════════════
  
  // SOL Component (Arcium MPC)
  sol?: {
    address: string;
    mpc_provider: 'Arcium';
    mxe_cluster_id?: string;
  };

  // ZEC Component (Zcash SDK)
  zec?: {
    address: string;
    viewing_key?: string;
    provider?: 'ZcashSDK' | 'FROST';
  };

  // ═══════════════════════════════════════════════════════════════
  // LEGACY: Single-chain vault fields (backwards compatible)
  // ═══════════════════════════════════════════════════════════════
  chain?: string;
  address?: string;
  mpc_provider?: string;

  // FROST-specific fields (ZEC shared vaults)
  threshold?: number;
  totalParticipants?: number;
  participants?: Array<{
    id: string;
    name: string;
    hasKeyShare?: boolean;
  }>;
  groupPublicKey?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// BALANCE DATA TYPE
// ═══════════════════════════════════════════════════════════════════════════

export interface BalanceData {
  vault_id: string;
  
  sol?: {
    address: string;
    balance: number;    // SOL amount
    lamports: number;
    usd: number;
  };
  
  zec?: {
    address: string;
    shielded_balance: number;  // Shielded ZEC
    transparent_balance: number;
    total_zec: number;
    usd: number;
  };
  
  total_usd: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// BACKUP DATA TYPE
// ═══════════════════════════════════════════════════════════════════════════

export interface BackupData {
  version: string;
  export_date: string;
  wallet_type: 'pawpad_unified_mpc' | 'pawpad_mpc';
  
  vault: {
    vault_id: string;
    vault_name: string;
    vault_type: string;
    email?: string;
    created_at: string;
    
    // SOL component
    sol?: {
      address: string;
      mpc_provider: string;
      mxe_cluster_id?: string;
    };
    
    // ZEC component
    zec?: {
      address: string;
      viewing_key?: string;
    };
    
    // Legacy single-chain fields
    chain?: string;
    public_address?: string;
    mpc_provider?: string;
  };
  
  recovery_instructions?: string[];
  important_notes?: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION STACK
// ═══════════════════════════════════════════════════════════════════════════

export type RootStackParamList = {
  // Onboarding
  Welcome: undefined;
  QuickSummary: undefined;
  
  // Vault Creation
  ChainSelection: undefined;
  EmailInput: { chain: string };
  VaultNameInput: { chain: string; email: string; vaultType?: 'personal' | 'shared' };
  
  // FROST Shared Vault Setup
  ThresholdSetup: { chain: string; email: string; vaultName: string };
  ParticipantSetup: { 
    chain: string; 
    email: string; 
    vaultName: string; 
    threshold: number; 
    totalParticipants: number;
  };
  
  // Vault Creation Process
  CreatingVault: {
    chain: string;
    email: string;
    vaultName: string;
    vaultType?: 'personal' | 'shared';
    threshold?: number;
    participants?: Array<{ id: string; name: string }>;
  };
  
  // Vault Success (shows both SOL + ZEC for unified vaults)
  VaultSuccess: {
    vault: VaultData;
  };
  
  // Main App
  Home: {
    vault: VaultData;
  };
  
  // Funding & Transactions
  FundWallet: {
    vault: VaultData;
  };
  
  // Swap (SOL ↔ ZEC)
  Swap: {
    vault: VaultData;
    direction?: 'sol_to_zec' | 'zec_to_sol';
  };
  
  // Send
  SendSol: {
    vault: VaultData;
  };
  SendZec: {
    vault: VaultData;
  };
  
  // Recovery
  Recovery: undefined;
  
  // Settings
  Settings: {
    vault?: VaultData;
  };
  
  // Backup
  Backup: {
    vault: VaultData;
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if vault is unified (has both SOL and ZEC)
 */
export function isUnifiedVault(vault: VaultData): boolean {
  return vault.vault_type === 'unified' && !!vault.sol && !!vault.zec;
}

/**
 * Get SOL address from vault (works for both unified and legacy)
 */
export function getSolAddress(vault: VaultData): string | null {
  if (vault.sol?.address) return vault.sol.address;
  if (vault.chain === 'SOL' && vault.address) return vault.address;
  return null;
}

/**
 * Get ZEC address from vault (works for both unified and legacy)
 */
export function getZecAddress(vault: VaultData): string | null {
  if (vault.zec?.address) return vault.zec.address;
  if (vault.chain === 'ZEC' && vault.address) return vault.address;
  return null;
}

/**
 * Get display name for vault
 */
export function getVaultDisplayName(vault: VaultData): string {
  if (vault.vault_name) return vault.vault_name;
  if (vault.vault_type === 'unified') return 'Unified Wallet';
  if (vault.chain) return `${vault.chain} Wallet`;
  return 'Wallet';
}