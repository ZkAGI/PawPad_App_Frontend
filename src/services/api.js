import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// API CONFIGURATION
// ============================================================================

// Use Render backend for production, localhost for development
const API_BASE = 'https://pawpad-arcium-backend.onrender.com/api';

// For local development, uncomment one of these:
// const API_BASE = 'http://10.0.2.2:3001/api';     // Android emulator
// const API_BASE = 'http://localhost:3001/api';   // iOS simulator

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
  // UNIFIED VAULT METHODS
  // ============================================================================

  async createUnifiedVault(email, vaultName) {
    try {
      console.log('[Unified] Creating vault:', { email, vaultName });

      const response = await axios.post(
        `${this.baseUrl}/unified/create`,
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

  async getUnifiedVault(vaultId) {
    try {
      const response = await axios.get(`${this.baseUrl}/unified/${vaultId}`);
      return response.data;
    } catch (error) {
      console.error('[Unified] Get failed:', error.response?.data || error.message);
      throw error;
    }
  }

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

  // ============================================================================
// 🆕 SEED PHRASE RECOVERY - ADD THIS SECTION!
// ============================================================================

/**
 * Restore wallet from 12-word seed phrase
 */
async restoreFromSeedPhrase(seedPhrase, name = 'Restored Wallet', email = '') {
  try {
    console.log('[Restore] Restoring from seed phrase...');
    
    const response = await axios.post(`${this.baseUrl}/wallet/restore`, {
      seed_phrase: seedPhrase.trim(),
      name: name,
      email: email?.toLowerCase().trim(),
    });
    
    console.log('[Restore] Result:', response.data);
    return response.data;
  } catch (error) {
    console.error('[Restore] Failed:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.error || error.message 
    };
  }
}

/**
 * Verify a wallet can be restored (test decryption)
 */
async verifyWallet(address) {
  try {
    const response = await axios.get(`${this.baseUrl}/verify-wallet/${address}`);
    return response.data;
  } catch (error) {
    console.error('[Verify] Failed:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.error || error.message 
    };
  }
}

  // ============================================================================
  // BALANCE METHODS
  // ============================================================================

  async getSolBalance(address) {
    try {
      const response = await axios.get(`${this.baseUrl}/fund/solana-balance/${address}`);
      return response.data;
    } catch (error) {
      console.error('[Balance] SOL failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async getZecBalance(address) {
    try {
      const response = await axios.get(`${this.baseUrl}/fund/zec-balance/${address}`);
      return response.data;
    } catch (error) {
      console.error('[Balance] ZEC failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async getBalance(vaultId) {
    try {
      const response = await axios.get(`${this.baseUrl}/unified/${vaultId}/balances`);
      return { success: true, balance: response.data?.sol?.balance || 0 };
    } catch (error) {
      try {
        const response = await axios.get(`${this.baseUrl}/vault/${vaultId}`);
        return response.data;
      } catch (err) {
        throw error;
      }
    }
  }

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
  // SEND METHODS
  // ============================================================================

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
  // SWAP METHODS
  // ============================================================================

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

  async getSwapStatus(swapId) {
    try {
      const response = await axios.get(`${this.baseUrl}/fund/status/${swapId}`);
      return response.data;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ============================================================================
  // AI AGENT METHODS
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

  async getAgentForVault(vaultId) {
    try {
      const response = await axios.get(`${this.baseUrl}/ai/agents/vault/${vaultId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return { success: false, agent: null };
      }
      console.error('[Agent] getAgentForVault failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async startAutoTrading(agentId, intervalMinutes = 15) {
    try {
      const response = await axios.post(`${this.baseUrl}/ai/agents/${agentId}/auto-trade/start`, {
        interval: intervalMinutes,
      });
      return response.data;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async stopAutoTrading(agentId) {
    try {
      const response = await axios.post(`${this.baseUrl}/ai/agents/${agentId}/auto-trade/stop`);
      return response.data;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getSignals(asset = null) {
    try {
      const url = asset ? `${this.baseUrl}/ai/signals/${asset}` : `${this.baseUrl}/ai/signals`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return { success: false, signals: [] };
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
  // DARK POOL METHODS
  // ============================================================================

  async submitDarkPoolOrder(vaultId, type, asset, amount, price) {
    try {
      const response = await axios.post(`${this.baseUrl}/smartpool/order`, {
        vault_id: vaultId,
        type,
        asset,
        amount,
        price,
      });
      return response.data;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getDarkPoolStats() {
    try {
      const response = await axios.get(`${this.baseUrl}/smartpool/stats`);
      return response.data;
    } catch (error) {
      return { success: false, stats: { totalVolumeUsd: 0, ordersFilled: 0, mevSaved: 0 } };
    }
  }

  async getDarkPoolBook(asset) {
    try {
      const response = await axios.get(`${this.baseUrl}/smartpool/book/${asset}`);
      return response.data;
    } catch (error) {
      return { success: false, orders: [] };
    }
  }

  async getDarkPoolOrders(vaultId) {
    try {
      const response = await axios.get(`${this.baseUrl}/smartpool/orders/${vaultId}`);
      return response.data;
    } catch (error) {
      return { success: false, orders: [] };
    }
  }

  // ============================================================================
  // LENDING METHODS
  // ============================================================================

  async getLendingPool() {
    try {
      const response = await axios.get(`${this.baseUrl}/lending/pool`);
      return response.data;
    } catch (error) {
      return { success: true, pool: { maxLTV: 75, liquidationLTV: 85, currentInterestRate: 5, activeLoans: 0 } };
    }
  }

  async getLendingPosition(vaultId) {
    try {
      const response = await axios.get(`${this.baseUrl}/lending/position/${vaultId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { success: false, position: null };
      return { success: false, error: error.message };
    }
  }

  async depositCollateral(vaultId, asset, amount) {
    try {
      const response = await axios.post(`${this.baseUrl}/lending/deposit`, {
        vault_id: vaultId,
        asset,
        amount,
      });
      return response.data;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async borrow(vaultId, asset, amount) {
    try {
      const response = await axios.post(`${this.baseUrl}/lending/borrow`, {
        vault_id: vaultId,
        asset,
        amount,
      });
      return response.data;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async repayLoan(vaultId, asset, amount) {
    try {
      const response = await axios.post(`${this.baseUrl}/lending/repay`, {
        vault_id: vaultId,
        asset,
        amount,
      });
      return response.data;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async withdrawCollateral(vaultId, asset, amount) {
    try {
      const response = await axios.post(`${this.baseUrl}/lending/withdraw`, {
        vault_id: vaultId,
        asset,
        amount,
      });
      return response.data;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ============================================================================
  // TRANSACTION HISTORY METHODS (NEW!)
  // ============================================================================

  async getTransactions(vaultId, limit = 50, skip = 0) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transactions/${vaultId}?limit=${limit}&skip=${skip}`
      );
      return response.data;
    } catch (error) {
      console.error('[Transactions] Failed:', error.response?.data || error.message);
      return { success: false, transactions: [] };
    }
  }

  async getTrades(vaultId, limit = 50) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/trades/${vaultId}?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('[Trades] Failed:', error.response?.data || error.message);
      return { success: false, trades: [] };
    }
  }

  async getVaultStats(vaultId) {
    try {
      const response = await axios.get(`${this.baseUrl}/stats/${vaultId}`);
      return response.data;
    } catch (error) {
      console.error('[Stats] Failed:', error.response?.data || error.message);
      return { success: false, stats: null };
    }
  }

  async getBalanceHistory(vaultId, days = 30) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/balance-history/${vaultId}?days=${days}`
      );
      return response.data;
    } catch (error) {
      console.error('[BalanceHistory] Failed:', error.response?.data || error.message);
      return { success: false, history: [] };
    }
  }

  // ============================================================================
  // VAULT METHODS
  // ============================================================================

  async createVault(chain, email, vaultName) {
    console.log('[Legacy] Redirecting to unified vault creation');
    return this.createUnifiedVault(email, vaultName);
  }

  async getVault(vaultId) {
    try {
      const response = await axios.get(`${this.baseUrl}/unified/${vaultId}`);
      return response.data;
    } catch (error) {
      try {
        const response = await axios.get(`${this.baseUrl}/vault/${vaultId}`);
        return response.data;
      } catch (err) {
        throw error;
      }
    }
  }

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
  // FROST METHODS
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

  async getAgentStatus(agentId) {
  try {
    const response = await axios.get(`${this.baseUrl}/ai/agents/${agentId}/status`);
    return response.data;
  } catch (error) {
    console.error('[Agent] Status failed:', error.message);
    return { success: false, error: error.message };
  }
}

async runAgentNow(agentId) {
  try {
    const response = await axios.post(`${this.baseUrl}/ai/agents/${agentId}/run-now`);
    return response.data;
  } catch (error) {
    console.error('[Agent] Run now failed:', error.message);
    return { success: false, error: error.message };
  }
}

// ============================================================================
  // SEEDLESS WALLET METHODS (TOTP + Oasis TEE)
  // ============================================================================

  async createSeedlessVault(userId, email = '') {
    try {
      console.log('[Seedless] Creating vault for:', userId);
      const response = await axios.post(`${this.baseUrl}/seedless/create`, {
        userId,
        email
      });
      console.log('[Seedless] Created:', response.data);
      return response.data;
    } catch (error) {
      console.error('[Seedless] Create failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async verifySeedlessTOTP(totpSecret, code) {
    try {
      const response = await axios.post(`${this.baseUrl}/seedless/verify-totp`, {
        totpSecret,
        code,
      });
      return response.data;
    } catch (error) {
      console.error('[Seedless] TOTP verify failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async recoverSeedlessVault(backupFile, totpSecret, restoreToTEE = true) {
    try {
      console.log('[Seedless] Recovering vault...');
      const response = await axios.post(`${this.baseUrl}/seedless/recover`, {
        backupFile,
        totpSecret,
        restoreToTEE,
      });
      return response.data;
    } catch (error) {
      console.error('[Seedless] Recovery failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async decryptSeedlessBackup(backupFile, totpSecret) {
    try {
      const response = await axios.post(`${this.baseUrl}/seedless/decrypt-backup`, {
        backupFile,
        totpSecret,
      });
      return response.data;
    } catch (error) {
      console.error('[Seedless] Decrypt failed:', error.response?.data || error.message);
      throw error;
    }
  }

async getEngineStatus() {
  try {
    const response = await axios.get(`${this.baseUrl}/ai/engine/status`);
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