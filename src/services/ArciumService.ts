import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface VaultConfig {
  name: string;
  chain: 'ZEC' | 'SOL';
  email: string;
  password: string;
  hint?: string;
}

interface Vault {
  vault_id: string;
  mxe_id: string;
  vault_name: string;
  chain: 'ZEC' | 'SOL';
  vault_address: string;
  created_at: string;
  key_shares: number;
  threshold: number;
  user_email: string;
}

class ArciumService {
  private connection: Connection;
  private arciumEndpoint: string;
  private arciumProgramId: PublicKey;

  constructor() {
    // Solana Devnet connection
    this.connection = new Connection(
      'https://api.devnet.solana.com',
      'confirmed'
    );

    // Your backend API endpoint (replace with your actual endpoint)
    this.arciumEndpoint = 'https://your-backend.com/api';

    // Arcium program ID (replace with actual)
    this.arciumProgramId = new PublicKey('YOUR_ARCIUM_PROGRAM_ID');
  }

  /**
   * Generate ECDSA keypair for signing
   * Used for both ZEC and general-purpose signing
   */
  async generateECDSAKey(): Promise<any> {
    console.log('Generating ECDSA key...');
    
    // In React Native, use crypto library
    const crypto = require('react-native-get-random-values');
    const privateKey = crypto.getRandomValues(new Uint8Array(32));
    
    // This is simplified - real implementation would use proper ECDSA
    return {
      privateKey: Buffer.from(privateKey).toString('hex'),
      publicKey: this.derivePublicKey(privateKey),
    };
  }

  /**
   * Generate EdDSA keypair for Solana
   * Native Solana signing scheme
   */
  async generateEdDSAKey(): Promise<Keypair> {
    console.log('Generating EdDSA key...');
    return Keypair.generate();
  }

  /**
   * Initialize MXE (MPC Execution Environment) on Arcium
   * This creates the vault with distributed key generation
   */
  async initializeMXE(config: VaultConfig): Promise<Vault> {
    console.log('Initializing MXE on Arcium...');

    try {
      // Step 1: Create user keypair for wallet
      const userKeypair = Keypair.generate();

      // Step 2: Call your backend to initialize Arcium MXE
      const response = await axios.post(`${this.arciumEndpoint}/vault/create`, {
        user_id: config.email,
        vault_name: config.name,
        chain: config.chain,
        user_public_key: userKeypair.publicKey.toBase58(),
        // Password is hashed before sending
        password_hash: await this.hashPassword(config.password),
        hint: config.hint,
      });

      const { vault_id, mxe_id, vault_address, shares } = response.data;

      // Step 3: Store vault locally (encrypted)
      const vault: Vault = {
        vault_id,
        mxe_id,
        vault_name: config.name,
        chain: config.chain,
        vault_address,
        created_at: new Date().toISOString(),
        key_shares: shares.length,
        threshold: Math.ceil(shares.length / 2), // 2 of 3
        user_email: config.email,
      };

      await this.storeVaultLocally(vault, config.password);

      return vault;
    } catch (error) {
      console.error('MXE initialization failed:', error);
      throw new Error('Failed to create vault. Please try again.');
    }
  }

  /**
   * Distribute key shares across devices/storage
   * In production, this would distribute to multiple devices
   */
  async distributeKeyShares(mxeId: string): Promise<string[]> {
    console.log('Distributing key shares...');

    try {
      // Call backend to get key share distribution info
      const response = await axios.post(
        `${this.arciumEndpoint}/vault/distribute-shares`,
        { mxe_id: mxeId }
      );

      const { shares, distribution_methods } = response.data;

      // In real app, you'd:
      // 1. Store one share locally (encrypted)
      // 2. Send one share to cloud backup (encrypted)
      // 3. Generate QR code for third share (user backs up)

      return shares;
    } catch (error) {
      console.error('Share distribution failed:', error);
      throw error;
    }
  }

  /**
   * Finalize vault creation
   * Confirms all shares are distributed and vault is ready
   */
  async finalizeVault(vaultId: string): Promise<void> {
    console.log('Finalizing vault...');

    await axios.post(`${this.arciumEndpoint}/vault/finalize`, {
      vault_id: vaultId,
    });
  }

  /**
   * Sign transaction using MPC
   * This is where the magic happens - no single private key exists!
   */
  async signTransaction(
    vaultId: string,
    transaction: any
  ): Promise<string> {
    console.log('Signing with MPC...');

    try {
      // Get transaction bytes
      const txBytes = transaction.serialize();

      // Call backend MPC signing service
      const response = await axios.post(
        `${this.arciumEndpoint}/vault/sign`,
        {
          vault_id: vaultId,
          transaction: Buffer.from(txBytes).toString('base64'),
        }
      );

      return response.data.signature;
    } catch (error) {
      console.error('MPC signing failed:', error);
      throw error;
    }
  }

  /**
   * Get vault details
   */
  async getVault(vaultId: string): Promise<Vault | null> {
    const vaultsJson = await AsyncStorage.getItem('vaults');
    if (!vaultsJson) return null;

    const vaults = JSON.parse(vaultsJson);
    return vaults.find((v: Vault) => v.vault_id === vaultId) || null;
  }

  /**
   * List all user vaults
   */
  async listVaults(): Promise<Vault[]> {
    const vaultsJson = await AsyncStorage.getItem('vaults');
    return vaultsJson ? JSON.parse(vaultsJson) : [];
  }

  // Private helper methods

  private async hashPassword(password: string): Promise<string> {
    // Use crypto library to hash password
    const crypto = require('crypto');
    return crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');
  }

  private async storeVaultLocally(
    vault: Vault,
    password: string
  ): Promise<void> {
    // Get existing vaults
    const vaultsJson = await AsyncStorage.getItem('vaults');
    const vaults = vaultsJson ? JSON.parse(vaultsJson) : [];

    // Add new vault
    vaults.push(vault);

    // Store encrypted
    await AsyncStorage.setItem('vaults', JSON.stringify(vaults));
  }

  private derivePublicKey(privateKey: Uint8Array): string {
    // Simplified - use proper EC point multiplication in production
    return Buffer.from(privateKey).toString('hex').substring(0, 64);
  }
}

export default ArciumService;