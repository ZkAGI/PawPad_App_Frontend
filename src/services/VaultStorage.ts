/**
 * ============================================
 * PAWPAD SECURE VAULT STORAGE
 * ============================================
 * 
 * Stores vault data securely with encryption.
 * Uses react-native-keychain for sensitive data
 * and AsyncStorage for non-sensitive metadata.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { Platform } from 'react-native';

// ============================================
// TYPES
// ============================================

export interface Vault {
  vault_id: string;
  vault_name: string;
  chain: 'SOL' | 'ZEC';
  address: string;
  mpc_provider: string;
  vault_type: 'personal' | 'shared';
  threshold?: number;
  totalParticipants?: number;
  participants?: Array<{ id: string; name: string }>;
  created_at: string;
  // Computed/UI fields
  balance?: number;
  lastUpdated?: string;
}

// Helper to convert VaultData (navigation type) to Vault (storage type)
export const toVault = (data: any): Vault => ({
  vault_id: data.vault_id,
  vault_name: data.vault_name,
  chain: data.chain as 'SOL' | 'ZEC',
  address: data.address,
  mpc_provider: data.mpc_provider,
  vault_type: data.vault_type || 'personal',
  threshold: data.threshold,
  totalParticipants: data.totalParticipants,
  participants: data.participants,
  created_at: data.created_at,
  balance: data.balance,
  lastUpdated: data.lastUpdated,
});

interface StoredVaultData {
  vaults: Vault[];
  activeVaultId: string | null;
  lastSync: string;
}

// ============================================
// STORAGE KEYS
// ============================================

const STORAGE_KEYS = {
  VAULT_DATA: '@pawpad/vaults',
  ACTIVE_VAULT: '@pawpad/active_vault',
  ENCRYPTION_KEY: 'pawpad_vault_key',
};

// ============================================
// ENCRYPTION HELPERS
// ============================================

class VaultEncryption {
  private static async getOrCreateKey(): Promise<string> {
    try {
      // Try to get existing key from keychain
      const credentials = await Keychain.getGenericPassword({
        service: STORAGE_KEYS.ENCRYPTION_KEY,
      });
      
      if (credentials) {
        return credentials.password;
      }
      
      // Generate new key if none exists
      const newKey = this.generateKey();
      await Keychain.setGenericPassword(
        'pawpad',
        newKey,
        { service: STORAGE_KEYS.ENCRYPTION_KEY }
      );
      
      return newKey;
    } catch (error) {
      // Fallback for devices without keychain support
      console.warn('Keychain not available, using fallback');
      return 'pawpad_fallback_key_' + Platform.OS;
    }
  }

  private static generateKey(): string {
    // Generate random key
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  }

  // Base64 encoding helpers (React Native compatible)
  private static toBase64(str: string): string {
    // Convert string to base64 without Buffer
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    let i = 0;
    
    while (i < str.length) {
      const a = str.charCodeAt(i++);
      const b = i < str.length ? str.charCodeAt(i++) : 0;
      const c = i < str.length ? str.charCodeAt(i++) : 0;
      
      const triplet = (a << 16) | (b << 8) | c;
      
      result += chars[(triplet >> 18) & 0x3f];
      result += chars[(triplet >> 12) & 0x3f];
      result += i > str.length + 1 ? '=' : chars[(triplet >> 6) & 0x3f];
      result += i > str.length ? '=' : chars[triplet & 0x3f];
    }
    
    return result;
  }

  private static fromBase64(base64: string): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    let i = 0;
    
    // Remove padding
    base64 = base64.replace(/=+$/, '');
    
    while (i < base64.length) {
      const a = chars.indexOf(base64[i++]);
      const b = chars.indexOf(base64[i++]);
      const c = chars.indexOf(base64[i++]);
      const d = chars.indexOf(base64[i++]);
      
      const triplet = (a << 18) | (b << 12) | (c << 6) | d;
      
      result += String.fromCharCode((triplet >> 16) & 0xff);
      if (c !== -1) result += String.fromCharCode((triplet >> 8) & 0xff);
      if (d !== -1) result += String.fromCharCode(triplet & 0xff);
    }
    
    return result;
  }

  // Simple XOR encryption (for demo - use proper crypto in production)
  static async encrypt(data: string): Promise<string> {
    const key = await this.getOrCreateKey();
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(
        data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return this.toBase64(result);
  }

  static async decrypt(encryptedData: string): Promise<string> {
    const key = await this.getOrCreateKey();
    const data = this.fromBase64(encryptedData);
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(
        data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return result;
  }
}

// ============================================
// VAULT STORAGE SERVICE
// ============================================

class VaultStorageService {
  private cache: StoredVaultData | null = null;

  // ============================================
  // CORE STORAGE METHODS
  // ============================================

  /**
   * Save all vault data (encrypted)
   */
  async saveVaults(vaults: Vault[], activeVaultId: string | null): Promise<void> {
    try {
      const data: StoredVaultData = {
        vaults,
        activeVaultId,
        lastSync: new Date().toISOString(),
      };

      // Encrypt sensitive data (addresses)
      const encryptedData = await VaultEncryption.encrypt(JSON.stringify(data));
      
      await AsyncStorage.setItem(STORAGE_KEYS.VAULT_DATA, encryptedData);
      
      // Update cache
      this.cache = data;
    } catch (error) {
      console.error('Failed to save vaults:', error);
      throw error;
    }
  }

  /**
   * Load all vault data (decrypted)
   */
  async loadVaults(): Promise<StoredVaultData> {
    try {
      // Return cache if available
      if (this.cache) {
        return this.cache;
      }

      const encryptedData = await AsyncStorage.getItem(STORAGE_KEYS.VAULT_DATA);
      
      if (!encryptedData) {
        return { vaults: [], activeVaultId: null, lastSync: '' };
      }

      const decrypted = await VaultEncryption.decrypt(encryptedData);
      const data: StoredVaultData = JSON.parse(decrypted);
      
      // Update cache
      this.cache = data;
      
      return data;
    } catch (error) {
      console.error('Failed to load vaults:', error);
      return { vaults: [], activeVaultId: null, lastSync: '' };
    }
  }

  // ============================================
  // VAULT CRUD OPERATIONS
  // ============================================

  /**
   * Add a new vault
   */
  async addVault(vault: Vault): Promise<void> {
    const data = await this.loadVaults();
    
    // Check if vault already exists
    const existingIndex = data.vaults.findIndex(v => v.vault_id === vault.vault_id);
    
    if (existingIndex >= 0) {
      // Update existing
      data.vaults[existingIndex] = vault;
    } else {
      // Add new
      data.vaults.push(vault);
    }
    
    // Set as active if it's the first vault or same chain as previous active
    if (!data.activeVaultId || data.vaults.length === 1) {
      data.activeVaultId = vault.vault_id;
    }
    
    await this.saveVaults(data.vaults, data.activeVaultId);
  }

  /**
   * Remove a vault
   */
  async removeVault(vaultId: string): Promise<void> {
    const data = await this.loadVaults();
    
    data.vaults = data.vaults.filter(v => v.vault_id !== vaultId);
    
    // Update active vault if needed
    if (data.activeVaultId === vaultId) {
      data.activeVaultId = data.vaults.length > 0 ? data.vaults[0].vault_id : null;
    }
    
    await this.saveVaults(data.vaults, data.activeVaultId);
  }

  /**
   * Update vault balance
   */
  async updateVaultBalance(vaultId: string, balance: number): Promise<void> {
    const data = await this.loadVaults();
    
    const vault = data.vaults.find(v => v.vault_id === vaultId);
    if (vault) {
      vault.balance = balance;
      vault.lastUpdated = new Date().toISOString();
      await this.saveVaults(data.vaults, data.activeVaultId);
    }
  }

  // ============================================
  // ACTIVE VAULT MANAGEMENT
  // ============================================

  /**
   * Set active vault
   */
  async setActiveVault(vaultId: string): Promise<void> {
    const data = await this.loadVaults();
    
    // Verify vault exists
    const vault = data.vaults.find(v => v.vault_id === vaultId);
    if (!vault) {
      throw new Error('Vault not found');
    }
    
    data.activeVaultId = vaultId;
    await this.saveVaults(data.vaults, data.activeVaultId);
  }

  /**
   * Get active vault
   */
  async getActiveVault(): Promise<Vault | null> {
    const data = await this.loadVaults();
    
    if (!data.activeVaultId) {
      return data.vaults.length > 0 ? data.vaults[0] : null;
    }
    
    return data.vaults.find(v => v.vault_id === data.activeVaultId) || null;
  }

  /**
   * Get active vault for a specific chain
   */
  async getActiveVaultForChain(chain: 'SOL' | 'ZEC'): Promise<Vault | null> {
    const data = await this.loadVaults();
    return data.vaults.find(v => v.chain === chain) || null;
  }

  // ============================================
  // QUERY METHODS
  // ============================================

  /**
   * Get all vaults
   */
  async getAllVaults(): Promise<Vault[]> {
    const data = await this.loadVaults();
    return data.vaults;
  }

  /**
   * Get vaults by chain
   */
  async getVaultsByChain(chain: 'SOL' | 'ZEC'): Promise<Vault[]> {
    const data = await this.loadVaults();
    return data.vaults.filter(v => v.chain === chain);
  }

  /**
   * Get vault by ID
   */
  async getVaultById(vaultId: string): Promise<Vault | null> {
    const data = await this.loadVaults();
    return data.vaults.find(v => v.vault_id === vaultId) || null;
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Clear all data (for logout/reset)
   */
  async clearAll(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.VAULT_DATA);
    this.cache = null;
  }

  /**
   * Export vaults (for backup - without encryption)
   */
  async exportVaults(): Promise<string> {
    const data = await this.loadVaults();
    // Remove sensitive fields for export
    const exportData = data.vaults.map(v => ({
      vault_name: v.vault_name,
      chain: v.chain,
      vault_type: v.vault_type,
      created_at: v.created_at,
    }));
    return JSON.stringify(exportData);
  }

  /**
   * Clear cache (force reload from storage)
   */
  clearCache(): void {
    this.cache = null;
  }
}

// Export singleton instance
export const vaultStorage = new VaultStorageService();
export default vaultStorage;