// /**
//  * ============================================
//  * PAWPAD SECURE VAULT STORAGE
//  * ============================================
//  * 
//  * Stores vault data securely with encryption.
//  * Uses react-native-keychain for sensitive data
//  * and AsyncStorage for non-sensitive metadata.
//  */

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Keychain from 'react-native-keychain';
// import { Platform } from 'react-native';

// // ============================================
// // TYPES
// // ============================================

// export interface Vault {
//   vault_id: string;
//   vault_name: string;
//   chain: 'SOL' | 'ZEC';
//   address: string;
//   mpc_provider: string;
//   vault_type: 'personal' | 'shared';
//   threshold?: number;
//   totalParticipants?: number;
//   participants?: Array<{ id: string; name: string }>;
//   created_at: string;
//   // Computed/UI fields
//   balance?: number;
//   lastUpdated?: string;
// }

// // Helper to convert VaultData (navigation type) to Vault (storage type)
// export const toVault = (data: any): Vault => ({
//   vault_id: data.vault_id,
//   vault_name: data.vault_name,
//   chain: data.chain as 'SOL' | 'ZEC',
//   address: data.address,
//   mpc_provider: data.mpc_provider,
//   vault_type: data.vault_type || 'personal',
//   threshold: data.threshold,
//   totalParticipants: data.totalParticipants,
//   participants: data.participants,
//   created_at: data.created_at,
//   balance: data.balance,
//   lastUpdated: data.lastUpdated,
// });

// interface StoredVaultData {
//   vaults: Vault[];
//   activeVaultId: string | null;
//   lastSync: string;
// }

// // ============================================
// // STORAGE KEYS
// // ============================================

