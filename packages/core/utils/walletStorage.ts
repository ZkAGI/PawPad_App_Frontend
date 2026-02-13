// utils/walletStorage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { TEEWalletResponse } from '../services/teeSevice';

const STORAGE_KEYS = {
  WALLET_TYPE: '@pawpad/wallet_type',
  TEE_WALLET_DATA: '@pawpad/tee_wallet',
  ACTIVE_WALLET: '@pawpad/active_wallet',
  BACKUP_CONFIRMED: '@pawpad/backup_confirmed',
};

export interface StoredWalletData {
  type: 'seed' | 'seedless' | 'tee';
  teeData?: TEEWalletResponse;
  createdAt: string;
  lastAccessed: string;
}

/**
 * Save TEE wallet data to storage
 */
export async function saveTEEWallet(walletData: TEEWalletResponse): Promise<void> {
  try {
    const storedData: StoredWalletData = {
      type: 'tee',
      teeData: walletData,
      createdAt: new Date().toISOString(),
      lastAccessed: new Date().toISOString(),
    };
    
    await AsyncStorage.setItem(STORAGE_KEYS.WALLET_TYPE, 'tee');
    await AsyncStorage.setItem(STORAGE_KEYS.TEE_WALLET_DATA, JSON.stringify(storedData));
    
    console.log('TEE wallet saved to storage');
  } catch (error) {
    console.error('Failed to save TEE wallet:', error);
    throw error;
  }
}

/**
 * Load TEE wallet data from storage
 */
export async function loadTEEWallet(): Promise<StoredWalletData | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TEE_WALLET_DATA);
    
    if (!data) {
      return null;
    }
    
    const parsed = JSON.parse(data) as StoredWalletData;
    
    // Update last accessed time
    parsed.lastAccessed = new Date().toISOString();
    await AsyncStorage.setItem(STORAGE_KEYS.TEE_WALLET_DATA, JSON.stringify(parsed));
    
    return parsed;
  } catch (error) {
    console.error('Failed to load TEE wallet:', error);
    return null;
  }
}

/**
 * Check if a wallet exists
 */
export async function hasWallet(): Promise<boolean> {
  try {
    const walletType = await AsyncStorage.getItem(STORAGE_KEYS.WALLET_TYPE);
    return walletType !== null;
  } catch (error) {
    console.error('Failed to check wallet existence:', error);
    return false;
  }
}

/**
 * Get the current wallet type
 */
export async function getWalletType(): Promise<'seed' | 'seedless' | 'tee' | null> {
  try {
    const walletType = await AsyncStorage.getItem(STORAGE_KEYS.WALLET_TYPE);
    return walletType as 'seed' | 'seedless' | 'tee' | null;
  } catch (error) {
    console.error('Failed to get wallet type:', error);
    return null;
  }
}

/**
 * Mark backup as confirmed
 */
export async function confirmBackup(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.BACKUP_CONFIRMED, 'true');
  } catch (error) {
    console.error('Failed to confirm backup:', error);
  }
}

/**
 * Check if backup is confirmed
 */
export async function isBackupConfirmed(): Promise<boolean> {
  try {
    const confirmed = await AsyncStorage.getItem(STORAGE_KEYS.BACKUP_CONFIRMED);
    return confirmed === 'true';
  } catch (error) {
    console.error('Failed to check backup status:', error);
    return false;
  }
}

/**
 * Clear all wallet data (for logout/reset)
 */
export async function clearWalletData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.WALLET_TYPE,
      STORAGE_KEYS.TEE_WALLET_DATA,
      STORAGE_KEYS.ACTIVE_WALLET,
      STORAGE_KEYS.BACKUP_CONFIRMED,
    ]);
    console.log('Wallet data cleared');
  } catch (error) {
    console.error('Failed to clear wallet data:', error);
    throw error;
  }
}

/**
 * Get wallet addresses for display
 */
export async function getWalletAddresses(): Promise<{
  evm?: { chain: string; address: string };
  solana?: { address: string };
} | null> {
  try {
    const walletData = await loadTEEWallet();
    
    if (!walletData?.teeData) {
      return null;
    }
    
    return {
      evm: walletData.teeData.wallets.evm,
      solana: walletData.teeData.wallets.solana,
    };
  } catch (error) {
    console.error('Failed to get wallet addresses:', error);
    return null;
  }
}