// // import axios from 'axios';

// // const API_BASE = 'http://10.0.2.2:3000/api';

// // class PawPadAPI {
// //   constructor() {
// //     this.baseUrl = API_BASE;
// //   }

// //   async getTokens() {
// //     try {
// //       const response = await axios.get(`${this.baseUrl}/intent/tokens`);
// //       return response.data;
// //     } catch (error) {
// //       console.error('Failed to fetch tokens:', error.message);
// //       throw error;
// //     }
// //   }

// //   async getQuote(params) {
// //     try {
// //       const response = await axios.post(`${this.baseUrl}/intent/quote`, {
// //         from_chain: params.fromChain,
// //         to_chain: params.toChain,
// //         from_token: params.fromToken || 'USDC',
// //         to_token: params.toToken || params.toChain,
// //         amount: params.amount,
// //         recipient: params.recipient,
// //         sender: params.sender,
// //         dry_run: params.dryRun || false,
// //       });
// //       return response.data;
// //     } catch (error) {
// //       console.error('Failed to get quote:', error.message);
// //       throw error;
// //     }
// //   }

// //  async createVault(chain, email, vaultName) {
// //   try {
// //     const finalVaultName = vaultName || `${chain} Wallet - ${email.split('@')[0]}`;
    
// //     console.log('Creating vault with:', { vault_name: finalVaultName, chain, email });
    
// //     const response = await axios.post(`${this.baseUrl}/vault/create`, {
// //       vault_name: finalVaultName,
// //       chain: chain.toUpperCase(),
// //       email: email.toLowerCase().trim(),
// //     });
    
// //     console.log('Vault created:', response.data);
// //     return response.data;
// //   } catch (error) {
// //     console.error('Failed to create vault:', error.response?.data || error.message);
// //     throw error;
// //   }
// // }

// //   async getVault(vaultId) {
// //     try {
// //       const response = await axios.get(`${this.baseUrl}/vault/${vaultId}`);
// //       return response.data;
// //     } catch (error) {
// //       console.error('Failed to fetch vault:', error.message);
// //       throw error;
// //     }
// //   }

// //   async getPortfolio(userId) {
// //     try {
// //       const response = await axios.get(`${this.baseUrl}/intent/portfolio/${userId}`);
// //       return response.data;
// //     } catch (error) {
// //       console.error('Failed to fetch portfolio:', error.message);
// //       throw error;
// //     }
// //   }
// // }

// // const api = new PawPadAPI();
// // export default api;


// // services/api.js

// // import axios from 'axios';

// // // Use 10.0.2.2 for Android emulator, localhost for iOS simulator
// // const API_BASE = 'http://10.0.2.2:3001/api';

// // class PawPadAPI {
// //   constructor() {
// //     this.baseUrl = API_BASE;
// //   }

// //   // ============================================================================
// //   // EXISTING METHODS
// //   // ============================================================================

// //   async getTokens() {
// //     try {
// //       const response = await axios.get(`${this.baseUrl}/intent/tokens`);
// //       return response.data;
// //     } catch (error) {
// //       console.error('Failed to fetch tokens:', error.message);
// //       throw error;
// //     }
// //   }

// //   async getQuote(params) {
// //     try {
// //       const response = await axios.post(`${this.baseUrl}/intent/quote`, {
// //         from_chain: params.fromChain,
// //         to_chain: params.toChain,
// //         from_token: params.fromToken || 'USDC',
// //         to_token: params.toToken || params.toChain,
// //         amount: params.amount,
// //         recipient: params.recipient,
// //         sender: params.sender,
// //         dry_run: params.dryRun || false,
// //       });
// //       return response.data;
// //     } catch (error) {
// //       console.error('Failed to get quote:', error.message);
// //       throw error;
// //     }
// //   }

// //   // Original vault creation (for SOL - Arcium)
// //   async createVault(chain, email, vaultName) {
// //     try {
// //       const finalVaultName = vaultName || `${chain} Wallet - ${email.split('@')[0]}`;
      
// //       console.log('Creating vault with:', { vault_name: finalVaultName, chain, email });
      
// //       const response = await axios.post(`${this.baseUrl}/vault/create`, {
// //         vault_name: finalVaultName,
// //         chain: chain.toUpperCase(),
// //         email: email.toLowerCase().trim(),
// //       });
      
// //       console.log('Vault created:', response.data);
// //       return response.data;
// //     } catch (error) {
// //       console.error('Failed to create vault:', error.response?.data || error.message);
// //       throw error;
// //     }
// //   }

// //   async getVault(vaultId) {
// //     try {
// //       const response = await axios.get(`${this.baseUrl}/vault/${vaultId}`);
// //       return response.data;
// //     } catch (error) {
// //       console.error('Failed to fetch vault:', error.message);
// //       throw error;
// //     }
// //   }

// //   async getPortfolio(userId) {
// //     try {
// //       const response = await axios.get(`${this.baseUrl}/intent/portfolio/${userId}`);
// //       return response.data;
// //     } catch (error) {
// //       console.error('Failed to fetch portfolio:', error.message);
// //       throw error;
// //     }
// //   }

// //   // ============================================================================
// //   // FROST VAULT METHODS (NEW - ZEC)
// //   // ============================================================================

// //   /**
// //    * Create a Personal FROST Vault (1-of-1)
// //    * Single owner, simple key management
// //    */
// //   async createFrostPersonalVault(vaultName, userId, ownerName) {
// //     try {
// //       console.log('[FROST] Creating personal vault:', { vaultName, userId, ownerName });
      
// //       const response = await axios.post(`${this.baseUrl}/frost/vault/personal`, {
// //         vaultName,
// //         userId,
// //         ownerName,
// //       });
      
// //       console.log('[FROST] Personal vault created:', response.data);
// //       return response.data;
// //     } catch (error) {
// //       console.error('[FROST] Failed to create personal vault:', error.response?.data || error.message);
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Create a Shared FROST Vault (m-of-n)
// //    * Multiple participants with threshold signing
// //    * 
// //    * @param {string} vaultName - Name of the vault
// //    * @param {number} threshold - Minimum signers required (e.g., 2)
// //    * @param {Array} participants - Array of { id: string, name: string }
// //    */
// //   async createFrostSharedVault(vaultName, threshold, participants) {
// //     try {
// //       console.log('[FROST] Creating shared vault:', { vaultName, threshold, participants });
      
// //       const response = await axios.post(`${this.baseUrl}/frost/vault/shared`, {
// //         vaultName,
// //         threshold,
// //         participants,
// //       });
      
// //       console.log('[FROST] Shared vault created:', response.data);
// //       return response.data;
// //     } catch (error) {
// //       console.error('[FROST] Failed to create shared vault:', error.response?.data || error.message);
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Get FROST Vault Info
// //    */
// //   async getFrostVault(vaultId) {
// //     try {
// //       const response = await axios.get(`${this.baseUrl}/frost/vault/${vaultId}`);
// //       return response.data;
// //     } catch (error) {
// //       console.error('[FROST] Failed to get vault:', error.response?.data || error.message);
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Get FROST Vault Balance
// //    */
// //   async getFrostBalance(vaultId) {
// //     try {
// //       const response = await axios.get(`${this.baseUrl}/frost/vault/${vaultId}/balance`);
// //       return response.data;
// //     } catch (error) {
// //       console.error('[FROST] Failed to get balance:', error.response?.data || error.message);
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Sign Transaction with FROST Vault
// //    * 
// //    * @param {string} vaultId - Vault ID
// //    * @param {string} to - Recipient address
// //    * @param {number} amount - Amount in ZEC
// //    * @param {string} memo - Optional memo
// //    * @param {Array} signers - Array of signer IDs (for shared vaults)
// //    */
// //   async frostSign(vaultId, to, amount, memo = '', signers = []) {
// //     try {
// //       console.log('[FROST] Signing transaction:', { vaultId, to, amount, memo, signers });
      
// //       const response = await axios.post(`${this.baseUrl}/frost/vault/${vaultId}/sign`, {
// //         to,
// //         amount,
// //         memo,
// //         signers,
// //       });
      
// //       console.log('[FROST] Transaction signed:', response.data);
// //       return response.data;
// //     } catch (error) {
// //       console.error('[FROST] Failed to sign:', error.response?.data || error.message);
// //       throw error;
// //     }
// //   }

// //   /**
// //    * List all FROST Vaults
// //    * 
// //    * @param {string} userId - Optional filter by user ID
// //    */
// //   async listFrostVaults(userId = null) {
// //     try {
// //       const url = userId 
// //         ? `${this.baseUrl}/frost/vaults?userId=${userId}`
// //         : `${this.baseUrl}/frost/vaults`;
      
// //       const response = await axios.get(url);
// //       return response.data;
// //     } catch (error) {
// //       console.error('[FROST] Failed to list vaults:', error.response?.data || error.message);
// //       throw error;
// //     }
// //   }

// //   // ============================================================================
// //   // CROSS-CHAIN FUNDING METHODS (NEW - NEAR Intents)
// //   // ============================================================================

// //   /**
// //    * Get Supported Chains for Cross-Chain Funding
// //    * Returns: { solana, ethereum, bitcoin, near, base, arbitrum }
// //    */
// //   async getFundingChains() {
// //     try {
// //       const response = await axios.get(`${this.baseUrl}/funding/chains`);
// //       return response.data;
// //     } catch (error) {
// //       console.error('[Funding] Failed to get chains:', error.response?.data || error.message);
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Get Funding Quote (Cross-Chain Swap)
// //    * 
// //    * @param {string} sourceChain - e.g., 'solana', 'ethereum', 'bitcoin'
// //    * @param {string} sourceToken - e.g., 'SOL', 'ETH', 'BTC', 'USDC'
// //    * @param {number} amount - Amount to swap
// //    * @param {string} vaultId - Destination ZEC vault ID
// //    */
// //   async getFundingQuote(sourceChain, sourceToken, amount, vaultId) {
// //     try {
// //       console.log('[Funding] Getting quote:', { sourceChain, sourceToken, amount, vaultId });
      
// //       const response = await axios.post(`${this.baseUrl}/funding/quote`, {
// //         sourceChain,
// //         sourceToken,
// //         amount,
// //         vaultId,
// //       });
      
// //       console.log('[Funding] Quote received:', response.data);
// //       return response.data;
// //     } catch (error) {
// //       console.error('[Funding] Failed to get quote:', error.response?.data || error.message);
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Execute Funding (Accept Quote and Start Swap)
// //    * 
// //    * @param {string} quoteId - Quote ID from getFundingQuote
// //    * @param {object} sourceWallet - { address: string } of source wallet
// //    */
// //   async executeFunding(quoteId, sourceWallet) {
// //     try {
// //       console.log('[Funding] Executing:', { quoteId, sourceWallet });
      
// //       const response = await axios.post(`${this.baseUrl}/funding/execute`, {
// //         quoteId,
// //         sourceWallet,
// //       });
      
// //       console.log('[Funding] Execution result:', response.data);
// //       return response.data;
// //     } catch (error) {
// //       console.error('[Funding] Failed to execute:', error.response?.data || error.message);
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Get Funding Status
// //    * 
// //    * @param {string} fundingId - Funding ID from executeFunding
// //    */
// //   async getFundingStatus(fundingId) {
// //     try {
// //       const response = await axios.get(`${this.baseUrl}/funding/${fundingId}/status`);
// //       return response.data;
// //     } catch (error) {
// //       console.error('[Funding] Failed to get status:', error.response?.data || error.message);
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Confirm Deposit (Called when deposit is detected)
// //    * 
// //    * @param {string} fundingId - Funding ID
// //    * @param {string} txHash - Transaction hash of the deposit
// //    */
// //   async confirmFundingDeposit(fundingId, txHash) {
// //     try {
// //       console.log('[Funding] Confirming deposit:', { fundingId, txHash });
      
// //       const response = await axios.post(`${this.baseUrl}/funding/${fundingId}/confirm`, {
// //         txHash,
// //       });
      
// //       return response.data;
// //     } catch (error) {
// //       console.error('[Funding] Failed to confirm:', error.response?.data || error.message);
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Simulate Full Funding Flow (Testnet Only)
// //    * Useful for testing without real funds
// //    * 
// //    * @param {string} sourceChain - e.g., 'solana'
// //    * @param {string} sourceToken - e.g., 'SOL'
// //    * @param {number} amount - Amount to simulate
// //    * @param {string} vaultId - Destination vault ID
// //    */
// //   async simulateFunding(sourceChain, sourceToken, amount, vaultId) {
// //     try {
// //       console.log('[Funding] Simulating:', { sourceChain, sourceToken, amount, vaultId });
      
// //       const response = await axios.post(`${this.baseUrl}/funding/simulate`, {
// //         sourceChain,
// //         sourceToken,
// //         amount,
// //         vaultId,
// //       });
      
// //       console.log('[Funding] Simulation result:', response.data);
// //       return response.data;
// //     } catch (error) {
// //       console.error('[Funding] Simulation failed:', error.response?.data || error.message);
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Get Testnet Faucet Info
// //    * Returns links to ZEC testnet faucets
// //    */
// //   async getTestnetFaucet() {
// //     try {
// //       const response = await axios.get(`${this.baseUrl}/funding/faucet`);
// //       return response.data;
// //     } catch (error) {
// //       console.error('[Funding] Failed to get faucet:', error.response?.data || error.message);
// //       throw error;
// //     }
// //   }

// //   // ============================================================================
// //   // HELPER METHODS
// //   // ============================================================================

// //   /**
// //    * Get balance for any vault (auto-detects FROST vs regular)
// //    */
// //   async getBalance(vault) {
// //     if (vault.chain === 'ZEC' || vault.mpc_provider === 'FROST') {
// //       return this.getFrostBalance(vault.vault_id);
// //     }
// //     // For SOL vaults, use existing balance endpoint
// //     return this.getVault(vault.vault_id);
// //   }

// //   /**
// //    * Create vault (auto-routes to FROST for ZEC)
// //    */
// //   async createVaultAuto(chain, email, vaultName, options = {}) {
// //     if (chain === 'ZEC') {
// //       if (options.vaultType === 'shared') {
// //         return this.createFrostSharedVault(
// //           vaultName,
// //           options.threshold,
// //           options.participants
// //         );
// //       }
// //       return this.createFrostPersonalVault(vaultName, email, vaultName);
// //     }
// //     return this.createVault(chain, email, vaultName);
// //   }

// //   /**
// //    * Sign transaction (auto-routes to FROST for ZEC)
// //    */
// //   async signTransaction(vault, to, amount, memo = '', signers = []) {
// //     if (vault.chain === 'ZEC' || vault.mpc_provider === 'FROST') {
// //       return this.frostSign(vault.vault_id, to, amount, memo, signers);
// //     }
// //     // For SOL vaults, use existing sign endpoint
// //     return axios.post(`${this.baseUrl}/vault/${vault.vault_id}/sign`, {
// //       to,
// //       amount,
// //       memo,
// //     });
// //   }

// //   // ============================================================================
// //   // AGENT METHODS (existing, kept for reference)
// //   // ============================================================================

// //   async createAgent(vaultId, preferences) {
// //     try {
// //       const response = await axios.post(`${this.baseUrl}/ai/agents`, {
// //         vault_id: vaultId,
// //         preferences,
// //       });
// //       return response.data;
// //     } catch (error) {
// //       console.error('Failed to create agent:', error.response?.data || error.message);
// //       throw error;
// //     }
// //   }

// //   async getAgent(agentId) {
// //     try {
// //       const response = await axios.get(`${this.baseUrl}/ai/agents/${agentId}`);
// //       return response.data;
// //     } catch (error) {
// //       console.error('Failed to get agent:', error.response?.data || error.message);
// //       throw error;
// //     }
// //   }

// //   async chatWithAgent(agentId, message) {
// //     try {
// //       const response = await axios.post(`${this.baseUrl}/ai/chat`, {
// //         agent_id: agentId,
// //         message,
// //       });
// //       return response.data;
// //     } catch (error) {
// //       console.error('Failed to chat with agent:', error.response?.data || error.message);
// //       throw error;
// //     }
// //   }

// //   // ============================================================================
// //   // HEALTH CHECK
// //   // ============================================================================

// //   async healthCheck() {
// //     try {
// //       const response = await axios.get(`${this.baseUrl.replace('/api', '')}/health`);
// //       return response.data;
// //     } catch (error) {
// //       console.error('Health check failed:', error.message);
// //       return { status: 'error', error: error.message };
// //     }
// //   }
// // }

// // const api = new PawPadAPI();
// // export default api;

// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Use 10.0.2.2 for Android emulator, localhost for iOS simulator
// const API_BASE = 'http://10.0.2.2:3001/api';

// class PawPadAPI {
//   constructor() {
//     this.baseUrl = API_BASE;
//   }

//   // ============================================================================
//   // AUTH TOKEN HELPER (NEW)
//   // ============================================================================

//   async getAuthHeaders() {
//     try {
//       const token = await AsyncStorage.getItem('authToken');
//       if (token) {
//         return { Authorization: `Bearer ${token}` };
//       }
//     } catch (error) {
//       console.error('Failed to get auth token:', error);
//     }
//     return {};
//   }

//   // ============================================================================
//   // RECOVERY METHODS (NEW)
//   // ============================================================================

//   /**
//    * Request recovery code via email
//    */
//   async recoverRequest(email) {
//     try {
//       console.log('[Recovery] Requesting code for:', email);
//       const response = await axios.post(`${this.baseUrl}/recover/request`, {
//         email: email.toLowerCase().trim(),
//       });
//       return response.data;
//     } catch (error) {
//       console.error('[Recovery] Failed to request code:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Verify recovery code and get vaults
//    */
//   async recoverVerify(email, code) {
//     try {
//       console.log('[Recovery] Verifying code for:', email);
//       const response = await axios.post(`${this.baseUrl}/recover/verify`, {
//         email: email.toLowerCase().trim(),
//         code,
//       });

//       // Store token if returned
//       if (response.data.token) {
//         await AsyncStorage.setItem('authToken', response.data.token);
//       }

//       return response.data;
//     } catch (error) {
//       console.error('[Recovery] Failed to verify:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   // ============================================================================
//   // BACKUP METHODS (NEW)
//   // ============================================================================

//   /**
//    * Export backup metadata
//    */
//   async exportBackup() {
//     try {
//       const headers = await this.getAuthHeaders();
//       const response = await axios.get(`${this.baseUrl}/backup/export`, { headers });
//       console.log('[Backup] Exported:', response.data.vaults?.length, 'vaults');
//       return response.data;
//     } catch (error) {
//       console.error('[Backup] Export failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Import backup metadata
//    */
//   async importBackup(backupData) {
//     try {
//       const headers = await this.getAuthHeaders();
//       const response = await axios.post(
//         `${this.baseUrl}/backup/import`,
//         { backupData },
//         { headers }
//       );
//       console.log('[Backup] Imported:', response.data.restored, 'vaults');
//       return response.data;
//     } catch (error) {
//       console.error('[Backup] Import failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   // ============================================================================
//   // EXISTING METHODS
//   // ============================================================================

//   async getTokens() {
//     try {
//       const response = await axios.get(`${this.baseUrl}/intent/tokens`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to fetch tokens:', error.message);
//       throw error;
//     }
//   }

//   async getQuote(params) {
//     try {
//       const response = await axios.post(`${this.baseUrl}/intent/quote`, {
//         from_chain: params.fromChain,
//         to_chain: params.toChain,
//         from_token: params.fromToken || 'USDC',
//         to_token: params.toToken || params.toChain,
//         amount: params.amount,
//         recipient: params.recipient,
//         sender: params.sender,
//         dry_run: params.dryRun || false,
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Failed to get quote:', error.message);
//       throw error;
//     }
//   }

//   // Original vault creation (for SOL - Arcium)
//   async createVault(chain, email, vaultName) {
//     try {
//       const finalVaultName = vaultName || `${chain} Wallet - ${email.split('@')[0]}`;

//       console.log('Creating vault with:', { vault_name: finalVaultName, chain, email });

//       const response = await axios.post(`${this.baseUrl}/vault/create`, {
//         vault_name: finalVaultName,
//         chain: chain.toUpperCase(),
//         email: email.toLowerCase().trim(),
//       });

//       console.log('Vault created:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to create vault:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   async getVault(vaultId) {
//     try {
//       const response = await axios.get(`${this.baseUrl}/vault/${vaultId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to fetch vault:', error.message);
//       throw error;
//     }
//   }

//   async getPortfolio(userId) {
//     try {
//       const response = await axios.get(`${this.baseUrl}/intent/portfolio/${userId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to fetch portfolio:', error.message);
//       throw error;
//     }
//   }

//   // ============================================================================
//   // FROST VAULT METHODS (NEW - ZEC)
//   // ============================================================================

//   /**
//    * Create a Personal FROST Vault (1-of-1)
//    * Single owner, simple key management
//    */
//   async createFrostPersonalVault(vaultName, userId, ownerName) {
//     try {
//       console.log('[FROST] Creating personal vault:', { vaultName, userId, ownerName });

//       const response = await axios.post(`${this.baseUrl}/frost/vault/personal`, {
//         vaultName,
//         userId,
//         ownerName,
//       });

//       console.log('[FROST] Personal vault created:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('[FROST] Failed to create personal vault:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Create a Shared FROST Vault (m-of-n)
//    * Multiple participants with threshold signing
//    *
//    * @param {string} vaultName - Name of the vault
//    * @param {number} threshold - Minimum signers required (e.g., 2)
//    * @param {Array} participants - Array of { id: string, name: string }
//    */
//   async createFrostSharedVault(vaultName, threshold, participants) {
//     try {
//       console.log('[FROST] Creating shared vault:', { vaultName, threshold, participants });

//       const response = await axios.post(`${this.baseUrl}/frost/vault/shared`, {
//         vaultName,
//         threshold,
//         participants,
//       });

//       console.log('[FROST] Shared vault created:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('[FROST] Failed to create shared vault:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Get FROST Vault Info
//    */
//   async getFrostVault(vaultId) {
//     try {
//       const response = await axios.get(`${this.baseUrl}/frost/vault/${vaultId}`);
//       return response.data;
//     } catch (error) {
//       console.error('[FROST] Failed to get vault:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Get FROST Vault Balance
//    */
//   async getFrostBalance(vaultId) {
//     try {
//       const response = await axios.get(`${this.baseUrl}/frost/vault/${vaultId}/balance`);
//       return response.data;
//     } catch (error) {
//       console.error('[FROST] Failed to get balance:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Sign Transaction with FROST Vault
//    *
//    * @param {string} vaultId - Vault ID
//    * @param {string} to - Recipient address
//    * @param {number} amount - Amount in ZEC
//    * @param {string} memo - Optional memo
//    * @param {Array} signers - Array of signer IDs (for shared vaults)
//    */
//   async frostSign(vaultId, to, amount, memo = '', signers = []) {
//     try {
//       console.log('[FROST] Signing transaction:', { vaultId, to, amount, memo, signers });

//       const response = await axios.post(`${this.baseUrl}/frost/vault/${vaultId}/sign`, {
//         to,
//         amount,
//         memo,
//         signers,
//       });

//       console.log('[FROST] Transaction signed:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('[FROST] Failed to sign:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * List all FROST Vaults
//    *
//    * @param {string} userId - Optional filter by user ID
//    */
//   async listFrostVaults(userId = null) {
//     try {
//       const url = userId
//         ? `${this.baseUrl}/frost/vaults?userId=${userId}`
//         : `${this.baseUrl}/frost/vaults`;

//       const response = await axios.get(url);
//       return response.data;
//     } catch (error) {
//       console.error('[FROST] Failed to list vaults:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   // ============================================================================
//   // CROSS-CHAIN FUNDING METHODS (NEW - NEAR Intents)
//   // ============================================================================

//   /**
//    * Get Supported Chains for Cross-Chain Funding
//    * Returns: { solana, ethereum, bitcoin, near, base, arbitrum }
//    */
//   async getFundingChains() {
//     try {
//       const response = await axios.get(`${this.baseUrl}/funding/chains`);
//       return response.data;
//     } catch (error) {
//       console.error('[Funding] Failed to get chains:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Get Funding Quote (Cross-Chain Swap)
//    *
//    * @param {string} sourceChain - e.g., 'solana', 'ethereum', 'bitcoin'
//    * @param {string} sourceToken - e.g., 'SOL', 'ETH', 'BTC', 'USDC'
//    * @param {number} amount - Amount to swap
//    * @param {string} vaultId - Destination ZEC vault ID
//    */
//   async getFundingQuote(sourceChain, sourceToken, amount, vaultId) {
//     try {
//       console.log('[Funding] Getting quote:', { sourceChain, sourceToken, amount, vaultId });

//       const response = await axios.post(`${this.baseUrl}/funding/quote`, {
//         sourceChain,
//         sourceToken,
//         amount,
//         vaultId,
//       });

//       console.log('[Funding] Quote received:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('[Funding] Failed to get quote:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Execute Funding (Accept Quote and Start Swap)
//    *
//    * @param {string} quoteId - Quote ID from getFundingQuote
//    * @param {object} sourceWallet - { address: string } of source wallet
//    */
//   async executeFunding(quoteId, sourceWallet) {
//     try {
//       console.log('[Funding] Executing:', { quoteId, sourceWallet });

//       const response = await axios.post(`${this.baseUrl}/funding/execute`, {
//         quoteId,
//         sourceWallet,
//       });

//       console.log('[Funding] Execution result:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('[Funding] Failed to execute:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Get Funding Status
//    *
//    * @param {string} fundingId - Funding ID from executeFunding
//    */
//   async getFundingStatus(fundingId) {
//     try {
//       const response = await axios.get(`${this.baseUrl}/funding/${fundingId}/status`);
//       return response.data;
//     } catch (error) {
//       console.error('[Funding] Failed to get status:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Confirm Deposit (Called when deposit is detected)
//    *
//    * @param {string} fundingId - Funding ID
//    * @param {string} txHash - Transaction hash of the deposit
//    */
//   async confirmFundingDeposit(fundingId, txHash) {
//     try {
//       console.log('[Funding] Confirming deposit:', { fundingId, txHash });

//       const response = await axios.post(`${this.baseUrl}/funding/${fundingId}/confirm`, {
//         txHash,
//       });

//       return response.data;
//     } catch (error) {
//       console.error('[Funding] Failed to confirm:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Simulate Full Funding Flow (Testnet Only)
//    * Useful for testing without real funds
//    *
//    * @param {string} sourceChain - e.g., 'solana'
//    * @param {string} sourceToken - e.g., 'SOL'
//    * @param {number} amount - Amount to simulate
//    * @param {string} vaultId - Destination vault ID
//    */
//   async simulateFunding(sourceChain, sourceToken, amount, vaultId) {
//     try {
//       console.log('[Funding] Simulating:', { sourceChain, sourceToken, amount, vaultId });

//       const response = await axios.post(`${this.baseUrl}/funding/simulate`, {
//         sourceChain,
//         sourceToken,
//         amount,
//         vaultId,
//       });

//       console.log('[Funding] Simulation result:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('[Funding] Simulation failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Get Testnet Faucet Info
//    * Returns links to ZEC testnet faucets
//    */
//   async getTestnetFaucet() {
//     try {
//       const response = await axios.get(`${this.baseUrl}/funding/faucet`);
//       return response.data;
//     } catch (error) {
//       console.error('[Funding] Failed to get faucet:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   // ============================================================================
//   // HELPER METHODS
//   // ============================================================================

//   /**
//    * Get balance for any vault (auto-detects FROST vs regular)
//    */
//   async getBalance(vault) {
//     if (vault.chain === 'ZEC' || vault.mpc_provider === 'FROST') {
//       return this.getFrostBalance(vault.vault_id);
//     }
//     // For SOL vaults, use existing balance endpoint
//     return this.getVault(vault.vault_id);
//   }

//   /**
//    * Create vault (auto-routes to FROST for ZEC)
//    */
//   async createVaultAuto(chain, email, vaultName, options = {}) {
//     if (chain === 'ZEC') {
//       if (options.vaultType === 'shared') {
//         return this.createFrostSharedVault(vaultName, options.threshold, options.participants);
//       }
//       return this.createFrostPersonalVault(vaultName, email, vaultName);
//     }
//     return this.createVault(chain, email, vaultName);
//   }

//   /**
//    * Sign transaction (auto-routes to FROST for ZEC)
//    */
//   async signTransaction(vault, to, amount, memo = '', signers = []) {
//     if (vault.chain === 'ZEC' || vault.mpc_provider === 'FROST') {
//       return this.frostSign(vault.vault_id, to, amount, memo, signers);
//     }
//     // For SOL vaults, use existing sign endpoint
//     return axios.post(`${this.baseUrl}/vault/${vault.vault_id}/sign`, {
//       to,
//       amount,
//       memo,
//     });
//   }

//   // ============================================================================
//   // AGENT METHODS (existing, kept for reference)
//   // ============================================================================

//   async createAgent(vaultId, preferences) {
//     try {
//       const response = await axios.post(`${this.baseUrl}/ai/agents`, {
//         vault_id: vaultId,
//         preferences,
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Failed to create agent:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   async getAgent(agentId) {
//     try {
//       const response = await axios.get(`${this.baseUrl}/ai/agents/${agentId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to get agent:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   async chatWithAgent(agentId, message) {
//     try {
//       const response = await axios.post(`${this.baseUrl}/ai/chat`, {
//         agent_id: agentId,
//         message,
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Failed to chat with agent:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   // ============================================================================
//   // HEALTH CHECK
//   // ============================================================================

//   async healthCheck() {
//     try {
//       const response = await axios.get(`${this.baseUrl.replace('/api', '')}/health`);
//       return response.data;
//     } catch (error) {
//       console.error('Health check failed:', error.message);
//       return { status: 'error', error: error.message };
//     }
//   }
// }

// const api = new PawPadAPI();
// export default api;


/**
 * PawPad API Service - TypeScript Version
 * 
 * REPLACE your entire src/services/api.ts with this file
 * This fixes all TypeScript errors and adds unified vault support
 */

// import axios, { AxiosResponse } from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Use 10.0.2.2 for Android emulator, localhost for iOS simulator
// const API_BASE = 'http://10.0.2.2:3001/api';

// // ============================================================================
// // TYPES
// // ============================================================================

// interface UnifiedVaultResponse {
//   success: boolean;
//   vault_id: string;
//   vault_name: string;
//   vault_type: 'unified';
//   email: string;
//   created_at: string;
//   sol: {
//     address: string;
//     mpc_provider: string;
//   };
//   zec: {
//     address: string;
//     viewing_key: string;
//   };
//   error?: string;
// }

// interface BalanceResponse {
//   success: boolean;
//   balance?: number;
//   sol?: number;
//   zec?: number;
//   address?: string;
//   error?: string;
// }

// interface UnifiedBalancesResponse {
//   success: boolean;
//   vault_id: string;
//   sol: {
//     address: string;
//     balance: number;
//     usd: number;
//   };
//   zec: {
//     address: string;
//     shielded_balance: number;
//     usd: number;
//   };
//   total_usd: number;
// }

// interface BackupResponse {
//   success: boolean;
//   backup: {
//     version: string;
//     export_date: string;
//     wallet_type: string;
//     vault: object;
//     recovery_instructions: string[];
//     important_notes: string[];
//   };
// }

// interface SwapQuoteResponse {
//   success: boolean;
//   quote_id: string;
//   direction: string;
//   input: { token: string; amount: number; address: string };
//   output: { token: string; amount: number; address: string };
//   fee: string;
//   provider: string;
//   expires_at: string;
// }

// interface SendResponse {
//   success: boolean;
//   tx_hash?: string;
//   tx_id?: string;
//   from: string;
//   to: string;
//   amount: number;
//   error?: string;
// }

// interface HealthResponse {
//   status: string;
//   version?: string;
//   services?: object;
//   error?: string;
// }

// // ============================================================================
// // API CLASS
// // ============================================================================

// class PawPadAPI {
//   baseUrl: string;

//   constructor() {
//     this.baseUrl = API_BASE;
//   }

//   // ============================================================================
//   // AUTH TOKEN HELPER
//   // ============================================================================

//   async getAuthHeaders(): Promise<{ Authorization?: string }> {
//     try {
//       const token = await AsyncStorage.getItem('authToken');
//       if (token) {
//         return { Authorization: `Bearer ${token}` };
//       }
//     } catch (error) {
//       console.error('Failed to get auth token:', error);
//     }
//     return {};
//   }

//   // ============================================================================
//   // UNIFIED VAULT METHODS (Creates both SOL + ZEC!)
//   // ============================================================================

//   /**
//    * Create Unified Vault (SOL + ZEC)
//    * This creates BOTH wallets in parallel!
//    */
//   async createUnifiedVault(email: string, vaultName: string): Promise<UnifiedVaultResponse> {
//     try {
//       console.log('[Unified] Creating vault:', { email, vaultName });

//       const response: AxiosResponse<UnifiedVaultResponse> = await axios.post(
//         `${this.baseUrl}/unified/create`,
//         {
//           vault_name: vaultName,
//           email: email.toLowerCase().trim(),
//         }
//       );

//       console.log('[Unified] Vault created:', response.data);
//       return response.data;
//     } catch (error: any) {
//       console.error('[Unified] Failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Get Unified Vault by ID
//    */
//   async getUnifiedVault(vaultId: string): Promise<any> {
//     try {
//       const response = await axios.get(`${this.baseUrl}/unified/${vaultId}`);
//       return response.data;
//     } catch (error: any) {
//       console.error('[Unified] Get failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * List Unified Vaults
//    */
//   async listUnifiedVaults(email?: string): Promise<any> {
//     try {
//       const url = email
//         ? `${this.baseUrl}/unified?email=${encodeURIComponent(email)}`
//         : `${this.baseUrl}/unified`;

//       const response = await axios.get(url);
//       return response.data;
//     } catch (error: any) {
//       console.error('[Unified] List failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Get Balances for Unified Vault (both SOL + ZEC)
//    */
//   async getUnifiedBalances(vaultId: string): Promise<UnifiedBalancesResponse> {
//     try {
//       console.log('[Unified] Getting balances for:', vaultId);
//       const response = await axios.get(`${this.baseUrl}/unified/${vaultId}/balances`);
//       return response.data;
//     } catch (error: any) {
//       console.error('[Unified] Balances failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Export Unified Vault Backup
//    */
//   async exportUnifiedBackup(vaultId: string): Promise<BackupResponse> {
//     try {
//       const response = await axios.get(`${this.baseUrl}/unified/${vaultId}/backup`);
//       return response.data;
//     } catch (error: any) {
//       console.error('[Unified] Backup failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   // ============================================================================
//   // SWAP METHODS (SOL ↔ ZEC via NEAR Intents)
//   // ============================================================================

//   /**
//    * Get Swap Quote (SOL → ZEC or ZEC → SOL)
//    */
//   async getSwapQuote(
//     vaultId: string,
//     direction: 'sol_to_zec' | 'zec_to_sol',
//     amount: number
//   ): Promise<SwapQuoteResponse> {
//     try {
//       console.log('[Swap] Getting quote:', { vaultId, direction, amount });
//       const response = await axios.post(`${this.baseUrl}/unified/swap/quote`, {
//         vault_id: vaultId,
//         direction,
//         amount,
//       });
//       return response.data;
//     } catch (error: any) {
//       console.error('[Swap] Quote failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Execute Swap
//    */
//   async executeSwap(
//     vaultId: string,
//     quoteId: string,
//     direction: string,
//     amount: number
//   ): Promise<any> {
//     try {
//       console.log('[Swap] Executing:', { vaultId, quoteId, direction });
//       const response = await axios.post(`${this.baseUrl}/unified/swap/execute`, {
//         vault_id: vaultId,
//         quote_id: quoteId,
//         direction,
//         amount,
//       });
//       return response.data;
//     } catch (error: any) {
//       console.error('[Swap] Execute failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   // ============================================================================
//   // SEND METHODS
//   // ============================================================================

//   /**
//    * Send SOL from Unified Vault
//    */
//   async sendSol(
//     vaultId: string,
//     to: string,
//     amount: number,
//     memo: string = ''
//   ): Promise<SendResponse> {
//     try {
//       console.log('[Send] SOL:', { vaultId, to, amount });
//       const response = await axios.post(`${this.baseUrl}/unified/${vaultId}/send/sol`, {
//         to,
//         amount,
//         memo,
//       });
//       return response.data;
//     } catch (error: any) {
//       console.error('[Send] SOL failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Send Shielded ZEC from Unified Vault
//    */
//   async sendZec(
//     vaultId: string,
//     to: string,
//     amount: number,
//     memo: string = ''
//   ): Promise<SendResponse> {
//     try {
//       console.log('[Send] ZEC:', { vaultId, to, amount });
//       const response = await axios.post(`${this.baseUrl}/unified/${vaultId}/send/zec`, {
//         to,
//         amount,
//         memo,
//       });
//       return response.data;
//     } catch (error: any) {
//       console.error('[Send] ZEC failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   // ============================================================================
//   // BALANCE METHODS (Direct)
//   // ============================================================================

//   /**
//    * Get SOL Balance (via Helius)
//    */
//   async getSolBalance(address: string): Promise<BalanceResponse> {
//     try {
//       const response = await axios.get(`${this.baseUrl}/fund/solana-balance/${address}`);
//       return response.data;
//     } catch (error: any) {
//       console.error('[Balance] SOL failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Get ZEC Balance
//    */
//   async getZecBalance(address: string): Promise<BalanceResponse> {
//     try {
//       const response = await axios.get(`${this.baseUrl}/fund/zec-balance/${address}`);
//       return response.data;
//     } catch (error: any) {
//       console.error('[Balance] ZEC failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   // ============================================================================
//   // LEGACY METHODS (backwards compatibility)
//   // ============================================================================

//   /**
//    * Create Vault - redirects to unified
//    * @deprecated Use createUnifiedVault instead
//    */
//   async createVault(
//     chain: string,
//     email: string,
//     vaultName: string
//   ): Promise<UnifiedVaultResponse> {
//     console.log('[Legacy] Redirecting to unified vault creation');
//     return this.createUnifiedVault(email, vaultName);
//   }

//   /**
//    * Get vault by ID
//    */
//   async getVault(vaultId: string): Promise<any> {
//     try {
//       const response = await axios.get(`${this.baseUrl}/unified/${vaultId}`);
//       return response.data;
//     } catch (error: any) {
//       // Try legacy endpoint
//       try {
//         const response = await axios.get(`${this.baseUrl}/vault/${vaultId}`);
//         return response.data;
//       } catch (err) {
//         throw error;
//       }
//     }
//   }

//   /**
//    * Get balance - auto-routes based on vault type
//    * This is the method that was causing errors!
//    */
//   async getBalance(vaultId: string): Promise<BalanceResponse> {
//     try {
//       // Try unified balances first
//       const response = await axios.get(`${this.baseUrl}/unified/${vaultId}/balances`);
//       return response.data;
//     } catch (error: any) {
//       // Fall back to legacy
//       try {
//         const response = await axios.get(`${this.baseUrl}/vault/${vaultId}`);
//         return response.data;
//       } catch (err) {
//         throw error;
//       }
//     }
//   }

//   /**
//    * Get FROST balance (for ZEC vaults)
//    */
//   async getFrostBalance(vaultId: string): Promise<BalanceResponse> {
//     try {
//       const response = await axios.get(`${this.baseUrl}/frost/vault/${vaultId}/balance`);
//       return response.data;
//     } catch (error: any) {
//       console.error('[FROST] Balance failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   // ============================================================================
//   // BACKUP & RECOVERY
//   // ============================================================================

//   /**
//    * Export backup - this was causing the error!
//    */
//   async exportBackup(): Promise<BackupResponse> {
//     try {
//       const headers = await this.getAuthHeaders();
//       const response = await axios.get(`${this.baseUrl}/backup/export`, { headers });
//       console.log('[Backup] Exported:', response.data.vaults?.length, 'vaults');
//       return response.data;
//     } catch (error: any) {
//       console.error('[Backup] Export failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Import backup
//    */
//   async importBackup(backupData: object): Promise<any> {
//     try {
//       const headers = await this.getAuthHeaders();
//       const response = await axios.post(
//         `${this.baseUrl}/backup/import`,
//         { backupData },
//         { headers }
//       );
//       return response.data;
//     } catch (error: any) {
//       console.error('[Backup] Import failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Request recovery code
//    */
//   async recoverRequest(email: string): Promise<any> {
//     try {
//       console.log('[Recovery] Requesting code for:', email);
//       const response = await axios.post(`${this.baseUrl}/recover/request`, {
//         email: email.toLowerCase().trim(),
//       });
//       return response.data;
//     } catch (error: any) {
//       console.error('[Recovery] Failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Verify recovery code
//    */
//   async recoverVerify(email: string, code: string): Promise<any> {
//     try {
//       const response = await axios.post(`${this.baseUrl}/recover/verify`, {
//         email: email.toLowerCase().trim(),
//         code,
//       });

//       if (response.data.token) {
//         await AsyncStorage.setItem('authToken', response.data.token);
//       }

//       return response.data;
//     } catch (error: any) {
//       console.error('[Recovery] Verify failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Recovery by email (unified vaults)
//    */
//   async recoverByEmail(email: string): Promise<any> {
//     try {
//       const response = await axios.get(
//         `${this.baseUrl}/unified/recovery/by-email/${encodeURIComponent(email)}`
//       );
//       return response.data;
//     } catch (error: any) {
//       console.error('[Recovery] By email failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   // ============================================================================
//   // FROST METHODS (for ZEC shared vaults)
//   // ============================================================================

//   async createFrostPersonalVault(
//     vaultName: string,
//     userId: string,
//     ownerName: string
//   ): Promise<any> {
//     try {
//       const response = await axios.post(`${this.baseUrl}/frost/vault/personal`, {
//         vaultName,
//         userId,
//         ownerName,
//       });
//       return response.data;
//     } catch (error: any) {
//       console.error('[FROST] Personal vault failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   async createFrostSharedVault(
//     vaultName: string,
//     threshold: number,
//     participants: Array<{ id: string; name: string }>
//   ): Promise<any> {
//     try {
//       const response = await axios.post(`${this.baseUrl}/frost/vault/shared`, {
//         vaultName,
//         threshold,
//         participants,
//       });
//       return response.data;
//     } catch (error: any) {
//       console.error('[FROST] Shared vault failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   async frostSign(
//     vaultId: string,
//     to: string,
//     amount: number,
//     memo: string = '',
//     signers: string[] = []
//   ): Promise<any> {
//     try {
//       const response = await axios.post(`${this.baseUrl}/frost/vault/${vaultId}/sign`, {
//         to,
//         amount,
//         memo,
//         signers,
//       });
//       return response.data;
//     } catch (error: any) {
//       console.error('[FROST] Sign failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   // ============================================================================
//   // AGENT METHODS
//   // ============================================================================

//   async createAgent(vaultId: string, preferences: object): Promise<any> {
//     try {
//       const response = await axios.post(`${this.baseUrl}/ai/agents`, {
//         vault_id: vaultId,
//         preferences,
//       });
//       return response.data;
//     } catch (error: any) {
//       console.error('Failed to create agent:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   async getAgent(agentId: string): Promise<any> {
//     try {
//       const response = await axios.get(`${this.baseUrl}/ai/agents/${agentId}`);
//       return response.data;
//     } catch (error: any) {
//       console.error('Failed to get agent:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   async chatWithAgent(agentId: string, message: string): Promise<any> {
//     try {
//       const response = await axios.post(`${this.baseUrl}/ai/chat`, {
//         agent_id: agentId,
//         message,
//       });
//       return response.data;
//     } catch (error: any) {
//       console.error('Failed to chat with agent:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   // ============================================================================
//   // HEALTH CHECK
//   // ============================================================================

//   async healthCheck(): Promise<HealthResponse> {
//     try {
//       const response = await axios.get(`${this.baseUrl.replace('/api', '')}/health`);
//       return response.data;
//     } catch (error: any) {
//       console.error('Health check failed:', error.message);
//       return { status: 'error', error: error.message };
//     }
//   }
// }

// const api = new PawPadAPI();
// export default api;
// export type { 
//   PawPadAPI, 
//   UnifiedVaultResponse, 
//   BalanceResponse, 
//   UnifiedBalancesResponse,
//   BackupResponse,
//   SwapQuoteResponse,
//   SendResponse,
//   HealthResponse 
// };

/**
 * PawPad API Service - TypeScript Version
 * 
 * REPLACE your entire src/services/api.ts with this file
 */

// import axios, { AxiosResponse } from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Use 10.0.2.2 for Android emulator, localhost for iOS simulator
// const API_BASE = 'http://10.0.2.2:3001/api';

// // ============================================================================
// // TYPES
// // ============================================================================

// export interface UnifiedVaultResponse {
//   success: boolean;
//   vault_id: string;
//   vault_name: string;
//   vault_type: 'unified';
//   email?: string;
//   created_at: string;
//   sol: {
//     address: string;
//     mpc_provider: string;
//   };
//   zec: {
//     address: string;
//     viewing_key: string;
//   };
//   error?: string;
// }

// export interface BalanceResponse {
//   success: boolean;
//   balance?: number;
//   sol?: number;
//   zec?: number;
//   address?: string;
//   // ZEC-specific fields
//   shielded_balance?: number;
//   transparent_balance?: number;
//   total_zec?: number;
//   // Nested balance object (for FROST)
//   confirmed?: number;
//   error?: string;
// }

// export interface UnifiedBalancesResponse {
//   success: boolean;
//   vault_id: string;
//   sol?: {
//     address: string;
//     balance: number;
//     usd: number;
//   };
//   zec?: {
//     address: string;
//     shielded_balance: number;
//     usd: number;
//   };
//   total_usd?: number;
// }

// export interface BackupResponse {
//   success: boolean;
//   backup?: {
//     version: string;
//     export_date: string;
//     wallet_type: string;
//     vault: object;
//     recovery_instructions: string[];
//     important_notes: string[];
//   };
//   vaults?: object[];
// }

// export interface SwapQuoteResponse {
//   success: boolean;
//   quote_id: string;
//   direction: string;
//   input: { token: string; amount: number; address: string };
//   output: { token: string; amount: number; address: string };
//   fee: string;
//   provider: string;
//   expires_at: string;
// }

// export interface SendResponse {
//   success: boolean;
//   tx_hash?: string;
//   tx_id?: string;
//   from: string;
//   to: string;
//   amount: number;
//   error?: string;
// }

// export interface HealthResponse {
//   status: string;
//   version?: string;
//   services?: object;
//   error?: string;
// }

// // ============================================================================
// // API CLASS
// // ============================================================================

// class PawPadAPI {
//   baseUrl: string;

//   constructor() {
//     this.baseUrl = API_BASE;
//   }

//   // ============================================================================
//   // AUTH TOKEN HELPER
//   // ============================================================================

//   async getAuthHeaders(): Promise<{ Authorization?: string }> {
//     try {
//       const token = await AsyncStorage.getItem('authToken');
//       if (token) {
//         return { Authorization: `Bearer ${token}` };
//       }
//     } catch (error) {
//       console.error('Failed to get auth token:', error);
//     }
//     return {};
//   }

//   // ============================================================================
//   // UNIFIED VAULT METHODS (Creates both SOL + ZEC!)
//   // ============================================================================

//   /**
//    * Create Unified Vault (SOL + ZEC)
//    * This creates BOTH wallets in parallel!
//    */
//   async createUnifiedVault(email: string, vaultName: string): Promise<UnifiedVaultResponse> {
//     try {
//       console.log('[Unified] Creating vault:', { email, vaultName });

//       const response: AxiosResponse<UnifiedVaultResponse> = await axios.post(
//         `${this.baseUrl}/unified/create`,
//         {
//           vault_name: vaultName,
//           email: email.toLowerCase().trim(),
//         }
//       );

//       console.log('[Unified] Vault created:', response.data);
//       return response.data;
//     } catch (error: any) {
//       console.error('[Unified] Failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Get Unified Vault by ID
//    */
//   async getUnifiedVault(vaultId: string): Promise<any> {
//     try {
//       const response = await axios.get(`${this.baseUrl}/unified/${vaultId}`);
//       return response.data;
//     } catch (error: any) {
//       console.error('[Unified] Get failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * List Unified Vaults
//    */
//   async listUnifiedVaults(email?: string): Promise<any> {
//     try {
//       const url = email
//         ? `${this.baseUrl}/unified?email=${encodeURIComponent(email)}`
//         : `${this.baseUrl}/unified`;

//       const response = await axios.get(url);
//       return response.data;
//     } catch (error: any) {
//       console.error('[Unified] List failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Get Balances for Unified Vault (both SOL + ZEC)
//    */
//   async getUnifiedBalances(vaultId: string): Promise<UnifiedBalancesResponse> {
//     try {
//       console.log('[Unified] Getting balances for:', vaultId);
//       const response = await axios.get(`${this.baseUrl}/unified/${vaultId}/balances`);
//       return response.data;
//     } catch (error: any) {
//       console.error('[Unified] Balances failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Export Unified Vault Backup
//    */
//   async exportUnifiedBackup(vaultId: string): Promise<BackupResponse> {
//     try {
//       const response = await axios.get(`${this.baseUrl}/unified/${vaultId}/backup`);
//       return response.data;
//     } catch (error: any) {
//       console.error('[Unified] Backup failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   // ============================================================================
//   // SWAP METHODS (SOL ↔ ZEC via NEAR Intents)
//   // ============================================================================

//   /**
//    * Get Swap Quote (SOL → ZEC or ZEC → SOL)
//    */
//   async getSwapQuote(
//     vaultId: string,
//     direction: 'sol_to_zec' | 'zec_to_sol',
//     amount: number
//   ): Promise<SwapQuoteResponse> {
//     try {
//       console.log('[Swap] Getting quote:', { vaultId, direction, amount });
//       const response = await axios.post(`${this.baseUrl}/unified/swap/quote`, {
//         vault_id: vaultId,
//         direction,
//         amount,
//       });
//       return response.data;
//     } catch (error: any) {
//       console.error('[Swap] Quote failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Execute Swap
//    */
//   async executeSwap(
//     vaultId: string,
//     quoteId: string,
//     direction: string,
//     amount: number
//   ): Promise<any> {
//     try {
//       console.log('[Swap] Executing:', { vaultId, quoteId, direction });
//       const response = await axios.post(`${this.baseUrl}/unified/swap/execute`, {
//         vault_id: vaultId,
//         quote_id: quoteId,
//         direction,
//         amount,
//       });
//       return response.data;
//     } catch (error: any) {
//       console.error('[Swap] Execute failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   // ============================================================================
//   // SEND METHODS
//   // ============================================================================

//   /**
//    * Send SOL from Unified Vault
//    */
//   async sendSol(
//     vaultId: string,
//     to: string,
//     amount: number,
//     memo: string = ''
//   ): Promise<SendResponse> {
//     try {
//       console.log('[Send] SOL:', { vaultId, to, amount });
//       const response = await axios.post(`${this.baseUrl}/unified/${vaultId}/send/sol`, {
//         to,
//         amount,
//         memo,
//       });
//       return response.data;
//     } catch (error: any) {
//       console.error('[Send] SOL failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Send Shielded ZEC from Unified Vault
//    */
//   async sendZec(
//     vaultId: string,
//     to: string,
//     amount: number,
//     memo: string = ''
//   ): Promise<SendResponse> {
//     try {
//       console.log('[Send] ZEC:', { vaultId, to, amount });
//       const response = await axios.post(`${this.baseUrl}/unified/${vaultId}/send/zec`, {
//         to,
//         amount,
//         memo,
//       });
//       return response.data;
//     } catch (error: any) {
//       console.error('[Send] ZEC failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   // ============================================================================
//   // BALANCE METHODS (Direct)
//   // ============================================================================

//   /**
//    * Get SOL Balance (via Helius)
//    */
//   async getSolBalance(address: string): Promise<BalanceResponse> {
//     try {
//       const response = await axios.get(`${this.baseUrl}/fund/solana-balance/${address}`);
//       return response.data;
//     } catch (error: any) {
//       console.error('[Balance] SOL failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Get ZEC Balance
//    */
//   async getZecBalance(address: string): Promise<BalanceResponse> {
//     try {
//       const response = await axios.get(`${this.baseUrl}/fund/zec-balance/${address}`);
//       return response.data;
//     } catch (error: any) {
//       console.error('[Balance] ZEC failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Get balance - generic helper that works with vault object
//    */
//   async getBalance(vaultId: string): Promise<BalanceResponse> {
//     try {
//       const response = await axios.get(`${this.baseUrl}/unified/${vaultId}/balances`);
//       return { success: true, balance: response.data?.sol?.balance || 0 };
//     } catch (error: any) {
//       // Try legacy endpoint
//       try {
//         const response = await axios.get(`${this.baseUrl}/vault/${vaultId}`);
//         return response.data;
//       } catch (err) {
//         throw error;
//       }
//     }
//   }

//   /**
//    * Get FROST balance (for ZEC vaults)
//    */
//   async getFrostBalance(vaultId: string): Promise<BalanceResponse> {
//     try {
//       const response = await axios.get(`${this.baseUrl}/frost/vault/${vaultId}/balance`);
//       return response.data;
//     } catch (error: any) {
//       console.error('[FROST] Balance failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   // ============================================================================
//   // LEGACY METHODS (backwards compatibility)
//   // ============================================================================

//   /**
//    * Create Vault - redirects to unified
//    * @deprecated Use createUnifiedVault instead
//    */
//   async createVault(
//     chain: string,
//     email: string,
//     vaultName: string
//   ): Promise<UnifiedVaultResponse> {
//     console.log('[Legacy] Redirecting to unified vault creation');
//     return this.createUnifiedVault(email, vaultName);
//   }

//   /**
//    * Get vault by ID
//    */
//   async getVault(vaultId: string): Promise<any> {
//     try {
//       const response = await axios.get(`${this.baseUrl}/unified/${vaultId}`);
//       return response.data;
//     } catch (error: any) {
//       // Try legacy endpoint
//       try {
//         const response = await axios.get(`${this.baseUrl}/vault/${vaultId}`);
//         return response.data;
//       } catch (err) {
//         throw error;
//       }
//     }
//   }

//   // ============================================================================
//   // BACKUP & RECOVERY
//   // ============================================================================

//   /**
//    * Export backup
//    */
//   async exportBackup(): Promise<BackupResponse> {
//     try {
//       const headers = await this.getAuthHeaders();
//       const response = await axios.get(`${this.baseUrl}/backup/export`, { headers });
//       console.log('[Backup] Exported:', response.data.vaults?.length, 'vaults');
//       return response.data;
//     } catch (error: any) {
//       console.error('[Backup] Export failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Import backup
//    */
//   async importBackup(backupData: object): Promise<any> {
//     try {
//       const headers = await this.getAuthHeaders();
//       const response = await axios.post(
//         `${this.baseUrl}/backup/import`,
//         { backupData },
//         { headers }
//       );
//       return response.data;
//     } catch (error: any) {
//       console.error('[Backup] Import failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Request recovery code
//    */
//   async recoverRequest(email: string): Promise<any> {
//     try {
//       console.log('[Recovery] Requesting code for:', email);
//       const response = await axios.post(`${this.baseUrl}/recover/request`, {
//         email: email.toLowerCase().trim(),
//       });
//       return response.data;
//     } catch (error: any) {
//       console.error('[Recovery] Failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Verify recovery code
//    */
//   async recoverVerify(email: string, code: string): Promise<any> {
//     try {
//       const response = await axios.post(`${this.baseUrl}/recover/verify`, {
//         email: email.toLowerCase().trim(),
//         code,
//       });

//       if (response.data.token) {
//         await AsyncStorage.setItem('authToken', response.data.token);
//       }

//       return response.data;
//     } catch (error: any) {
//       console.error('[Recovery] Verify failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   /**
//    * Recovery by email (unified vaults)
//    */
//   async recoverByEmail(email: string): Promise<any> {
//     try {
//       const response = await axios.get(
//         `${this.baseUrl}/unified/recovery/by-email/${encodeURIComponent(email)}`
//       );
//       return response.data;
//     } catch (error: any) {
//       console.error('[Recovery] By email failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   // ============================================================================
//   // FROST METHODS (for ZEC shared vaults)
//   // ============================================================================

//   async createFrostPersonalVault(
//     vaultName: string,
//     userId: string,
//     ownerName: string
//   ): Promise<any> {
//     try {
//       const response = await axios.post(`${this.baseUrl}/frost/vault/personal`, {
//         vaultName,
//         userId,
//         ownerName,
//       });
//       return response.data;
//     } catch (error: any) {
//       console.error('[FROST] Personal vault failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   async createFrostSharedVault(
//     vaultName: string,
//     threshold: number,
//     participants: Array<{ id: string; name: string }>
//   ): Promise<any> {
//     try {
//       const response = await axios.post(`${this.baseUrl}/frost/vault/shared`, {
//         vaultName,
//         threshold,
//         participants,
//       });
//       return response.data;
//     } catch (error: any) {
//       console.error('[FROST] Shared vault failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   async frostSign(
//     vaultId: string,
//     to: string,
//     amount: number,
//     memo: string = '',
//     signers: string[] = []
//   ): Promise<any> {
//     try {
//       const response = await axios.post(`${this.baseUrl}/frost/vault/${vaultId}/sign`, {
//         to,
//         amount,
//         memo,
//         signers,
//       });
//       return response.data;
//     } catch (error: any) {
//       console.error('[FROST] Sign failed:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   // ============================================================================
//   // AGENT METHODS
//   // ============================================================================

//   async createAgent(vaultId: string, preferences: object): Promise<any> {
//     try {
//       const response = await axios.post(`${this.baseUrl}/ai/agents`, {
//         vault_id: vaultId,
//         preferences,
//       });
//       return response.data;
//     } catch (error: any) {
//       console.error('Failed to create agent:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   async getAgent(agentId: string): Promise<any> {
//     try {
//       const response = await axios.get(`${this.baseUrl}/ai/agents/${agentId}`);
//       return response.data;
//     } catch (error: any) {
//       console.error('Failed to get agent:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   async chatWithAgent(agentId: string, message: string): Promise<any> {
//     try {
//       const response = await axios.post(`${this.baseUrl}/ai/chat`, {
//         agent_id: agentId,
//         message,
//       });
//       return response.data;
//     } catch (error: any) {
//       console.error('Failed to chat with agent:', error.response?.data || error.message);
//       throw error;
//     }
//   }

//   // ============================================================================
//   // HEALTH CHECK
//   // ============================================================================

//   async healthCheck(): Promise<HealthResponse> {
//     try {
//       const response = await axios.get(`${this.baseUrl.replace('/api', '')}/health`);
//       return response.data;
//     } catch (error: any) {
//       console.error('Health check failed:', error.message);
//       return { status: 'error', error: error.message };
//     }
//   }
// }

// const api = new PawPadAPI();
// export default api;

/**
 * PawPad API Service - JavaScript Version
 * 
 * REPLACE your entire src/services/api.js with this file
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use 10.0.2.2 for Android emulator, localhost for iOS simulator
const API_BASE = 'http://10.0.2.2:3001/api';

class PawPadAPI {
  constructor() {
    this.baseUrl = API_BASE;
  }

  // ============================================================================
  // AUTH TOKEN HELPER
  // ============================================================================

  async getAuthHeaders() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        return { Authorization: `Bearer ${token}` };
      }
    } catch (error) {
      console.error('Failed to get auth token:', error);
    }
    return {};
  }

  // ============================================================================
  // UNIFIED VAULT METHODS (Creates both SOL + ZEC!)
  // ============================================================================

  /**
   * Create Unified Vault (SOL + ZEC)
   * This creates BOTH wallets in parallel!
   */
//   async createUnifiedVault(email, vaultName) {
//   try {
//     console.log('[Unified] Creating vault:', { email, vaultName });

//     const response = await axios.post(
//       `${this.baseUrl}/vault/create`,  // ✅ Use the working endpoint
//       {
//         chain: 'SOL',
//         vault_name: vaultName,
//         email: email.toLowerCase().trim(),
//       }
//     );

//     console.log('[Unified] Vault created:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('[Unified] Failed:', error.response?.data || error.message);
//     throw error;
//   }
// }
async createUnifiedVault(email, vaultName) {
  try {
    console.log('[Unified] Creating vault:', { email, vaultName });

    const response = await axios.post(
      `${this.baseUrl}/unified/create`,  // ← Use unified endpoint!
      {
        vault_name: vaultName,
        email: email.toLowerCase().trim(),
      }
    );

    console.log('[Unified] Vault created:', response.data);
    return response.data;
  } catch (error) {
    console.error('[Unified] Failed:', error.response?.data || error.message);
    throw error;
  }
}
  /**
   * Get Unified Vault by ID
   */
  async getUnifiedVault(vaultId) {
    try {
      const response = await axios.get(`${this.baseUrl}/unified/${vaultId}`);
      return response.data;
    } catch (error) {
      console.error('[Unified] Get failed:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * List Unified Vaults
   */
  async listUnifiedVaults(email) {
    try {
      const url = email
        ? `${this.baseUrl}/unified?email=${encodeURIComponent(email)}`
        : `${this.baseUrl}/unified`;

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('[Unified] List failed:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get Balances for Unified Vault (both SOL + ZEC)
   */
  async getUnifiedBalances(vaultId) {
    try {
      console.log('[Unified] Getting balances for:', vaultId);
      const response = await axios.get(`${this.baseUrl}/unified/${vaultId}/balances`);
      return response.data;
    } catch (error) {
      console.error('[Unified] Balances failed:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Export Unified Vault Backup
   */
  async exportUnifiedBackup(vaultId) {
    try {
      const response = await axios.get(`${this.baseUrl}/unified/${vaultId}/backup`);
      return response.data;
    } catch (error) {
      console.error('[Unified] Backup failed:', error.response?.data || error.message);
      throw error;
    }
  }

  // ============================================================================
  // SWAP METHODS (SOL ↔ ZEC via NEAR Intents)
  // ============================================================================

  /**
   * Get Swap Quote (SOL → ZEC or ZEC → SOL)
   */
  async getSwapQuote(vaultId, direction, amount) {
    try {
      console.log('[Swap] Getting quote:', { vaultId, direction, amount });
      const response = await axios.post(`${this.baseUrl}/unified/swap/quote`, {
        vault_id: vaultId,
        direction,
        amount,
      });
      return response.data;
    } catch (error) {
      console.error('[Swap] Quote failed:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Execute Swap
   */
  async executeSwap(vaultId, quoteId, direction, amount) {
    try {
      console.log('[Swap] Executing:', { vaultId, quoteId, direction });
      const response = await axios.post(`${this.baseUrl}/unified/swap/execute`, {
        vault_id: vaultId,
        quote_id: quoteId,
        direction,
        amount,
      });
      return response.data;
    } catch (error) {
      console.error('[Swap] Execute failed:', error.response?.data || error.message);
      throw error;
    }
  }

  // ============================================================================
  // SEND METHODS
  // ============================================================================

  /**
   * Send SOL from Unified Vault
   */
  async sendSol(vaultId, to, amount, memo = '') {
    try {
      console.log('[Send] SOL:', { vaultId, to, amount });
      const response = await axios.post(`${this.baseUrl}/unified/${vaultId}/send/sol`, {
        to,
        amount,
        memo,
      });
      return response.data;
    } catch (error) {
      console.error('[Send] SOL failed:', error.response?.data || error.message);
      throw error;
    }
  }

/**
 * Universal Send - Uses NEAR Intents to send any token
 * Works for SOL, ZEC, USDC, ETH, etc.
 */
async send(fromAddress, toAddress, amount, token) {
  try {
    console.log('[Send]:', { fromAddress, toAddress, amount, token });
    
    const response = await axios.post(`${this.baseUrl}/send`, {
      from_address: fromAddress,
      to_address: toAddress,
      amount: amount,
      token: token,
    });
    
    console.log('[Send] Result:', response.data);
    return response.data;
  } catch (error) {
    console.error('[Send] Failed:', error.response?.data || error.message);
    throw error;
  }
}

  /**
   * Send Shielded ZEC from Unified Vault
   */
  async sendZec(vaultId, to, amount, memo = '') {
    try {
      console.log('[Send] ZEC:', { vaultId, to, amount });
      const response = await axios.post(`${this.baseUrl}/unified/${vaultId}/send/zec`, {
        to,
        amount,
        memo,
      });
      return response.data;
    } catch (error) {
      console.error('[Send] ZEC failed:', error.response?.data || error.message);
      throw error;
    }
  }

  // ============================================================================
  // BALANCE METHODS (Direct)
  // ============================================================================

  /**
   * Get SOL Balance (via Helius)
   */
  async getSolBalance(address) {
    try {
      const response = await axios.get(`${this.baseUrl}/fund/solana-balance/${address}`);
      return response.data;
    } catch (error) {
      console.error('[Balance] SOL failed:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get ZEC Balance
   */
  async getZecBalance(address) {
    try {
      const response = await axios.get(`${this.baseUrl}/fund/zec-balance/${address}`);
      return response.data;
    } catch (error) {
      console.error('[Balance] ZEC failed:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get balance - generic helper that works with vault object
   */
  async getBalance(vaultId) {
    try {
      const response = await axios.get(`${this.baseUrl}/unified/${vaultId}/balances`);
      return { success: true, balance: response.data?.sol?.balance || 0 };
    } catch (error) {
      // Try legacy endpoint
      try {
        const response = await axios.get(`${this.baseUrl}/vault/${vaultId}`);
        return response.data;
      } catch (err) {
        throw error;
      }
    }
  }

  /**
   * Get FROST balance (for ZEC vaults)
   */
  async getFrostBalance(vaultId) {
    try {
      const response = await axios.get(`${this.baseUrl}/frost/vault/${vaultId}/balance`);
      return response.data;
    } catch (error) {
      console.error('[FROST] Balance failed:', error.response?.data || error.message);
      throw error;
    }
  }

  // ============================================================================
  // LEGACY METHODS (backwards compatibility)
  // ============================================================================

  /**
   * Create Vault - redirects to unified
   * @deprecated Use createUnifiedVault instead
   */
  async createVault(chain, email, vaultName) {
    console.log('[Legacy] Redirecting to unified vault creation');
    return this.createUnifiedVault(email, vaultName);
  }

  /**
   * Get vault by ID
   */
  async getVault(vaultId) {
    try {
      const response = await axios.get(`${this.baseUrl}/unified/${vaultId}`);
      return response.data;
    } catch (error) {
      // Try legacy endpoint
      try {
        const response = await axios.get(`${this.baseUrl}/vault/${vaultId}`);
        return response.data;
      } catch (err) {
        throw error;
      }
    }
  }

  /**
   * Get tokens/chains info
   */
  async getTokens() {
    try {
      const response = await axios.get(`${this.baseUrl}/tokens`);
      return response.data;
    } catch (error) {
      console.error('[Tokens] Failed:', error.response?.data || error.message);
      return { supported_chains: ['SOL', 'ZEC'] };
    }
  }

  // ============================================================================
  // BACKUP & RECOVERY
  // ============================================================================

  /**
   * Export backup
   */
  async exportBackup() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.get(`${this.baseUrl}/backup/export`, { headers });
      console.log('[Backup] Exported:', response.data.vaults?.length, 'vaults');
      return response.data;
    } catch (error) {
      console.error('[Backup] Export failed:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Import backup
   */
  async importBackup(backupData) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.post(
        `${this.baseUrl}/backup/import`,
        { backupData },
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error('[Backup] Import failed:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Request recovery code
   */
  async recoverRequest(email) {
    try {
      console.log('[Recovery] Requesting code for:', email);
      const response = await axios.post(`${this.baseUrl}/recover/request`, {
        email: email.toLowerCase().trim(),
      });
      return response.data;
    } catch (error) {
      console.error('[Recovery] Failed:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Verify recovery code
   */
  async recoverVerify(email, code) {
    try {
      const response = await axios.post(`${this.baseUrl}/recover/verify`, {
        email: email.toLowerCase().trim(),
        code,
      });

      if (response.data.token) {
        await AsyncStorage.setItem('authToken', response.data.token);
      }

      return response.data;
    } catch (error) {
      console.error('[Recovery] Verify failed:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Recovery by email (unified vaults)
   */
  async recoverByEmail(email) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/unified/recovery/by-email/${encodeURIComponent(email)}`
      );
      return response.data;
    } catch (error) {
      console.error('[Recovery] By email failed:', error.response?.data || error.message);
      throw error;
    }
  }

  // ============================================================================
  // FROST METHODS (for ZEC shared vaults)
  // ============================================================================

  async createFrostPersonalVault(vaultName, userId, ownerName) {
    try {
      const response = await axios.post(`${this.baseUrl}/frost/vault/personal`, {
        vaultName,
        userId,
        ownerName,
      });
      return response.data;
    } catch (error) {
      console.error('[FROST] Personal vault failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async createFrostSharedVault(vaultName, threshold, participants) {
    try {
      const response = await axios.post(`${this.baseUrl}/frost/vault/shared`, {
        vaultName,
        threshold,
        participants,
      });
      return response.data;
    } catch (error) {
      console.error('[FROST] Shared vault failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async frostSign(vaultId, to, amount, memo = '', signers = []) {
    try {
      const response = await axios.post(`${this.baseUrl}/frost/vault/${vaultId}/sign`, {
        to,
        amount,
        memo,
        signers,
      });
      return response.data;
    } catch (error) {
      console.error('[FROST] Sign failed:', error.response?.data || error.message);
      throw error;
    }
  }

  // ============================================================================
  // AGENT METHODS
  // ============================================================================

  async createAgent(vaultId, preferences) {
    try {
      const response = await axios.post(`${this.baseUrl}/ai/agents`, {
        vault_id: vaultId,
        preferences,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create agent:', error.response?.data || error.message);
      throw error;
    }
  }

  async getAgent(agentId) {
    try {
      const response = await axios.get(`${this.baseUrl}/ai/agents/${agentId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get agent:', error.response?.data || error.message);
      throw error;
    }
  }

  async chatWithAgent(agentId, message) {
    try {
      const response = await axios.post(`${this.baseUrl}/ai/chat`, {
        agent_id: agentId,
        message,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to chat with agent:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
 * Restore wallet from backup (sends keys to backend)
 */
async restoreBackup(backupData) {
  try {
    console.log('[Backup] Restoring from backup...');
    const response = await axios.post(`${this.baseUrl}/backup/restore`, {
      backup: backupData
    });
    console.log('[Backup] Restore result:', response.data);
    return response.data;
  } catch (error) {
    console.error('[Backup] Restore failed:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Get swap quote using the fund/quote endpoint
 */
async getSwapQuote(vault, direction, amount) {
  try {
    const fromToken = direction === 'SOL_TO_ZEC' ? 'SOL' : 'ZEC';
    const toToken = direction === 'SOL_TO_ZEC' ? 'ZEC' : 'SOL';
    const destinationAddress = direction === 'SOL_TO_ZEC' 
      ? vault?.zec?.address 
      : vault?.sol?.address;
    
    console.log('[Swap] Getting quote:', { fromToken, toToken, amount, destinationAddress });
    
    const response = await axios.post(`${this.baseUrl}/fund/quote`, {
      from_token: fromToken,
      to_token: toToken,
      amount: amount,
      destination_address: destinationAddress,
      vault_id: vault?.vault_id,
    });
    
    return {
      success: true,
      quote: response.data
    };
  } catch (error) {
    console.error('[Swap] Quote failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || error.message };
  }
}

/**
 * Execute swap using the fund/bridge endpoint - THIS ACTUALLY EXECUTES!
 */
async executeSwap(vault, direction, amount) {
  try {
    console.log('[Swap] Executing:', { vaultId: vault?.vault_id, direction, amount });
    
    const fromToken = direction === 'SOL_TO_ZEC' ? 'SOL' : 'ZEC';
    const toToken = direction === 'SOL_TO_ZEC' ? 'ZEC' : 'SOL';
    const destinationAddress = direction === 'SOL_TO_ZEC' 
      ? vault?.zec?.address 
      : vault?.sol?.address;
    const refundAddress = direction === 'SOL_TO_ZEC'
      ? vault?.sol?.address
      : vault?.zec?.address;
    
    const response = await axios.post(`${this.baseUrl}/fund/execute`, {
      from_token: fromToken,
      to_token: toToken,
      amount: amount,
      destination_address: destinationAddress,
      refund_address: refundAddress,
    });
    
    console.log('[Swap] Response:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('[Swap] Execute failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || error.message };
  }
}

/**
 * Get swap status
 */
async getSwapStatus(swapId) {
  try {
    const response = await axios.get(`${this.baseUrl}/fund/status/${swapId}`);
    return response.data;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

  // ============================================================================
  // HEALTH CHECK
  // ============================================================================

  async healthCheck() {
    try {
      const response = await axios.get(`${this.baseUrl.replace('/api', '')}/health`);
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error.message);
      return { status: 'error', error: error.message };
    }
  }
}

const api = new PawPadAPI();
export default api;