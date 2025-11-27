// import axios from 'axios';

// const API_BASE = 'http://10.0.2.2:3000/api';

// class PawPadAPI {
//   constructor() {
//     this.baseUrl = API_BASE;
//   }

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

//  async createVault(chain, email, vaultName) {
//   try {
//     const finalVaultName = vaultName || `${chain} Wallet - ${email.split('@')[0]}`;
    
//     console.log('Creating vault with:', { vault_name: finalVaultName, chain, email });
    
//     const response = await axios.post(`${this.baseUrl}/vault/create`, {
//       vault_name: finalVaultName,
//       chain: chain.toUpperCase(),
//       email: email.toLowerCase().trim(),
//     });
    
//     console.log('Vault created:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Failed to create vault:', error.response?.data || error.message);
//     throw error;
//   }
// }

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
// }

// const api = new PawPadAPI();
// export default api;


// services/api.js

import axios from 'axios';

// Use 10.0.2.2 for Android emulator, localhost for iOS simulator
const API_BASE = 'http://10.0.2.2:3001/api';

class PawPadAPI {
  constructor() {
    this.baseUrl = API_BASE;
  }

  // ============================================================================
  // EXISTING METHODS
  // ============================================================================

  async getTokens() {
    try {
      const response = await axios.get(`${this.baseUrl}/intent/tokens`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tokens:', error.message);
      throw error;
    }
  }

  async getQuote(params) {
    try {
      const response = await axios.post(`${this.baseUrl}/intent/quote`, {
        from_chain: params.fromChain,
        to_chain: params.toChain,
        from_token: params.fromToken || 'USDC',
        to_token: params.toToken || params.toChain,
        amount: params.amount,
        recipient: params.recipient,
        sender: params.sender,
        dry_run: params.dryRun || false,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get quote:', error.message);
      throw error;
    }
  }

  // Original vault creation (for SOL - Arcium)
  async createVault(chain, email, vaultName) {
    try {
      const finalVaultName = vaultName || `${chain} Wallet - ${email.split('@')[0]}`;
      
      console.log('Creating vault with:', { vault_name: finalVaultName, chain, email });
      
      const response = await axios.post(`${this.baseUrl}/vault/create`, {
        vault_name: finalVaultName,
        chain: chain.toUpperCase(),
        email: email.toLowerCase().trim(),
      });
      
      console.log('Vault created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to create vault:', error.response?.data || error.message);
      throw error;
    }
  }

  async getVault(vaultId) {
    try {
      const response = await axios.get(`${this.baseUrl}/vault/${vaultId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch vault:', error.message);
      throw error;
    }
  }

  async getPortfolio(userId) {
    try {
      const response = await axios.get(`${this.baseUrl}/intent/portfolio/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch portfolio:', error.message);
      throw error;
    }
  }

  // ============================================================================
  // FROST VAULT METHODS (NEW - ZEC)
  // ============================================================================

  /**
   * Create a Personal FROST Vault (1-of-1)
   * Single owner, simple key management
   */
  async createFrostPersonalVault(vaultName, userId, ownerName) {
    try {
      console.log('[FROST] Creating personal vault:', { vaultName, userId, ownerName });
      
      const response = await axios.post(`${this.baseUrl}/frost/vault/personal`, {
        vaultName,
        userId,
        ownerName,
      });
      
      console.log('[FROST] Personal vault created:', response.data);
      return response.data;
    } catch (error) {
      console.error('[FROST] Failed to create personal vault:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Create a Shared FROST Vault (m-of-n)
   * Multiple participants with threshold signing
   * 
   * @param {string} vaultName - Name of the vault
   * @param {number} threshold - Minimum signers required (e.g., 2)
   * @param {Array} participants - Array of { id: string, name: string }
   */
  async createFrostSharedVault(vaultName, threshold, participants) {
    try {
      console.log('[FROST] Creating shared vault:', { vaultName, threshold, participants });
      
      const response = await axios.post(`${this.baseUrl}/frost/vault/shared`, {
        vaultName,
        threshold,
        participants,
      });
      
      console.log('[FROST] Shared vault created:', response.data);
      return response.data;
    } catch (error) {
      console.error('[FROST] Failed to create shared vault:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get FROST Vault Info
   */
  async getFrostVault(vaultId) {
    try {
      const response = await axios.get(`${this.baseUrl}/frost/vault/${vaultId}`);
      return response.data;
    } catch (error) {
      console.error('[FROST] Failed to get vault:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get FROST Vault Balance
   */
  async getFrostBalance(vaultId) {
    try {
      const response = await axios.get(`${this.baseUrl}/frost/vault/${vaultId}/balance`);
      return response.data;
    } catch (error) {
      console.error('[FROST] Failed to get balance:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Sign Transaction with FROST Vault
   * 
   * @param {string} vaultId - Vault ID
   * @param {string} to - Recipient address
   * @param {number} amount - Amount in ZEC
   * @param {string} memo - Optional memo
   * @param {Array} signers - Array of signer IDs (for shared vaults)
   */
  async frostSign(vaultId, to, amount, memo = '', signers = []) {
    try {
      console.log('[FROST] Signing transaction:', { vaultId, to, amount, memo, signers });
      
      const response = await axios.post(`${this.baseUrl}/frost/vault/${vaultId}/sign`, {
        to,
        amount,
        memo,
        signers,
      });
      
      console.log('[FROST] Transaction signed:', response.data);
      return response.data;
    } catch (error) {
      console.error('[FROST] Failed to sign:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * List all FROST Vaults
   * 
   * @param {string} userId - Optional filter by user ID
   */
  async listFrostVaults(userId = null) {
    try {
      const url = userId 
        ? `${this.baseUrl}/frost/vaults?userId=${userId}`
        : `${this.baseUrl}/frost/vaults`;
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('[FROST] Failed to list vaults:', error.response?.data || error.message);
      throw error;
    }
  }

  // ============================================================================
  // CROSS-CHAIN FUNDING METHODS (NEW - NEAR Intents)
  // ============================================================================

  /**
   * Get Supported Chains for Cross-Chain Funding
   * Returns: { solana, ethereum, bitcoin, near, base, arbitrum }
   */
  async getFundingChains() {
    try {
      const response = await axios.get(`${this.baseUrl}/funding/chains`);
      return response.data;
    } catch (error) {
      console.error('[Funding] Failed to get chains:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get Funding Quote (Cross-Chain Swap)
   * 
   * @param {string} sourceChain - e.g., 'solana', 'ethereum', 'bitcoin'
   * @param {string} sourceToken - e.g., 'SOL', 'ETH', 'BTC', 'USDC'
   * @param {number} amount - Amount to swap
   * @param {string} vaultId - Destination ZEC vault ID
   */
  async getFundingQuote(sourceChain, sourceToken, amount, vaultId) {
    try {
      console.log('[Funding] Getting quote:', { sourceChain, sourceToken, amount, vaultId });
      
      const response = await axios.post(`${this.baseUrl}/funding/quote`, {
        sourceChain,
        sourceToken,
        amount,
        vaultId,
      });
      
      console.log('[Funding] Quote received:', response.data);
      return response.data;
    } catch (error) {
      console.error('[Funding] Failed to get quote:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Execute Funding (Accept Quote and Start Swap)
   * 
   * @param {string} quoteId - Quote ID from getFundingQuote
   * @param {object} sourceWallet - { address: string } of source wallet
   */
  async executeFunding(quoteId, sourceWallet) {
    try {
      console.log('[Funding] Executing:', { quoteId, sourceWallet });
      
      const response = await axios.post(`${this.baseUrl}/funding/execute`, {
        quoteId,
        sourceWallet,
      });
      
      console.log('[Funding] Execution result:', response.data);
      return response.data;
    } catch (error) {
      console.error('[Funding] Failed to execute:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get Funding Status
   * 
   * @param {string} fundingId - Funding ID from executeFunding
   */
  async getFundingStatus(fundingId) {
    try {
      const response = await axios.get(`${this.baseUrl}/funding/${fundingId}/status`);
      return response.data;
    } catch (error) {
      console.error('[Funding] Failed to get status:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Confirm Deposit (Called when deposit is detected)
   * 
   * @param {string} fundingId - Funding ID
   * @param {string} txHash - Transaction hash of the deposit
   */
  async confirmFundingDeposit(fundingId, txHash) {
    try {
      console.log('[Funding] Confirming deposit:', { fundingId, txHash });
      
      const response = await axios.post(`${this.baseUrl}/funding/${fundingId}/confirm`, {
        txHash,
      });
      
      return response.data;
    } catch (error) {
      console.error('[Funding] Failed to confirm:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Simulate Full Funding Flow (Testnet Only)
   * Useful for testing without real funds
   * 
   * @param {string} sourceChain - e.g., 'solana'
   * @param {string} sourceToken - e.g., 'SOL'
   * @param {number} amount - Amount to simulate
   * @param {string} vaultId - Destination vault ID
   */
  async simulateFunding(sourceChain, sourceToken, amount, vaultId) {
    try {
      console.log('[Funding] Simulating:', { sourceChain, sourceToken, amount, vaultId });
      
      const response = await axios.post(`${this.baseUrl}/funding/simulate`, {
        sourceChain,
        sourceToken,
        amount,
        vaultId,
      });
      
      console.log('[Funding] Simulation result:', response.data);
      return response.data;
    } catch (error) {
      console.error('[Funding] Simulation failed:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get Testnet Faucet Info
   * Returns links to ZEC testnet faucets
   */
  async getTestnetFaucet() {
    try {
      const response = await axios.get(`${this.baseUrl}/funding/faucet`);
      return response.data;
    } catch (error) {
      console.error('[Funding] Failed to get faucet:', error.response?.data || error.message);
      throw error;
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Get balance for any vault (auto-detects FROST vs regular)
   */
  async getBalance(vault) {
    if (vault.chain === 'ZEC' || vault.mpc_provider === 'FROST') {
      return this.getFrostBalance(vault.vault_id);
    }
    // For SOL vaults, use existing balance endpoint
    return this.getVault(vault.vault_id);
  }

  /**
   * Create vault (auto-routes to FROST for ZEC)
   */
  async createVaultAuto(chain, email, vaultName, options = {}) {
    if (chain === 'ZEC') {
      if (options.vaultType === 'shared') {
        return this.createFrostSharedVault(
          vaultName,
          options.threshold,
          options.participants
        );
      }
      return this.createFrostPersonalVault(vaultName, email, vaultName);
    }
    return this.createVault(chain, email, vaultName);
  }

  /**
   * Sign transaction (auto-routes to FROST for ZEC)
   */
  async signTransaction(vault, to, amount, memo = '', signers = []) {
    if (vault.chain === 'ZEC' || vault.mpc_provider === 'FROST') {
      return this.frostSign(vault.vault_id, to, amount, memo, signers);
    }
    // For SOL vaults, use existing sign endpoint
    return axios.post(`${this.baseUrl}/vault/${vault.vault_id}/sign`, {
      to,
      amount,
      memo,
    });
  }

  // ============================================================================
  // AGENT METHODS (existing, kept for reference)
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