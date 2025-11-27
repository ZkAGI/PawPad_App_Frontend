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
export interface VaultData {
  vault_id: string;
  vault_name: string;
  chain: string;
  address: string;
  mpc_provider: string;
  created_at: string;
  // FROST-specific fields (ZEC vaults)
  vault_type?: 'personal' | 'shared';
  threshold?: number;
  totalParticipants?: number;
  participants?: Array<{
    id: string;
    name: string;
    hasKeyShare?: boolean;
  }>;
  groupPublicKey?: string;
}

// Agent preferences
export interface AgentPreferences {
  vault_id: string;
  risk_level: string;
  auto_rebalance: boolean;
  cross_chain_swaps: boolean;
  dark_pool_trading: boolean;
  max_position_size: number;
  trading_pairs: string[];
}

// Agent data
export interface AgentData {
  agent_id: string;
  vault_id: string;
  preferences: AgentPreferences;
  created_at: string;
}

// Participant for shared vaults
export interface Participant {
  id: string;
  name: string;
}

export type RootStackParamList = {
  // Onboarding flow
  Onboarding: undefined;
  MXEExplanation: undefined;
  QuickSummary: undefined;
  
  // Vault creation flow
  ChainSelection: undefined;
  
  EmailInput: {
    chain: string;
  };
  
  VaultNameInput: {
    chain: string;
    email: string;
  };
  
  // NEW: Vault type selection (for ZEC)
  VaultTypeSelection: {
    chain: string;
    email: string;
    vaultName: string;
  };
  
  // NEW: Shared vault setup (participants)
  SharedVaultSetup: {
    chain: string;
    email: string;
    vaultName: string;
  };
  
  CreatingVault: {
    chain: string;
    email: string;
    vaultName: string;
    // NEW: FROST-specific params
    vaultType?: 'personal' | 'shared';
    threshold?: number;
    participants?: Participant[];
  };
  
  VaultSuccess: {
    vault: VaultData;
  };
  
  // Main screens
  Home: {
    vault?: VaultData;
  };
  
  Swap: undefined;
  
  // Fund wallet with cross-chain support
  FundWallet: {
    vault: VaultData;
  };
  
  // NEW: Funding status tracking
  FundingStatus: {
    fundingId: string;
    vault: VaultData;
  };
  
  // Agent flow
  AgentPreferences: {
    vault: VaultData;
  };
  
  AgentCreating: {
    vault: VaultData;
    preferences: AgentPreferences;
  };
  
  AgentDashboard: {
    vault: VaultData;
    agent: AgentData;
  };
  
  // NEW: Transaction signing (for shared vaults)
  SignTransaction: {
    vault: VaultData;
    transaction: {
      to: string;
      amount: number;
      memo?: string;
    };
  };
  
  // NEW: Vault details/management
  VaultDetails: {
    vault: VaultData;
  };
  
  // NEW: Vault list
  VaultList: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}