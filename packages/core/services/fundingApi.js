// services/fundingApi.js

const API_URL = 'http://localhost:3000';

export const fundingApi = {
  // Get Supported Chains
  async getChains() {
    const response = await fetch(`${API_URL}/api/funding/chains`);
    return response.json();
  },

  // Get Quote
  async getQuote(sourceChain, sourceToken, amount, vaultId) {
    const response = await fetch(`${API_URL}/api/funding/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceChain, sourceToken, amount, vaultId }),
    });
    return response.json();
  },

  // Execute Funding
  async execute(quoteId, sourceWallet) {
    const response = await fetch(`${API_URL}/api/funding/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quoteId, sourceWallet }),
    });
    return response.json();
  },

  // Check Status
  async getStatus(fundingId) {
    const response = await fetch(`${API_URL}/api/funding/${fundingId}/status`);
    return response.json();
  },

  // Simulate (testnet)
  async simulate(sourceChain, sourceToken, amount, vaultId) {
    const response = await fetch(`${API_URL}/api/funding/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceChain, sourceToken, amount, vaultId }),
    });
    return response.json();
  },
};