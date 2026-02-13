// services/frostApi.js

const API_URL = 'http://localhost:3000';

export const frostApi = {
  // Create Personal Vault (1-of-1)
  async createPersonalVault(vaultName, userId, ownerName) {
    const response = await fetch(`${API_URL}/api/frost/vault/personal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vaultName, userId, ownerName }),
    });
    return response.json();
  },

  // Create Shared Vault (m-of-n)
  async createSharedVault(vaultName, threshold, participants) {
    const response = await fetch(`${API_URL}/api/frost/vault/shared`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vaultName, threshold, participants }),
    });
    return response.json();
  },

  // Get Vault
  async getVault(vaultId) {
    const response = await fetch(`${API_URL}/api/frost/vault/${vaultId}`);
    return response.json();
  },

  // Get Balance
  async getBalance(vaultId) {
    const response = await fetch(`${API_URL}/api/frost/vault/${vaultId}/balance`);
    return response.json();
  },

  // Sign Transaction
  async signTransaction(vaultId, to, amount, memo, signers = []) {
    const response = await fetch(`${API_URL}/api/frost/vault/${vaultId}/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, amount, memo, signers }),
    });
    return response.json();
  },

  // List Vaults
  async listVaults(userId = null) {
    const url = userId 
      ? `${API_URL}/api/frost/vaults?userId=${userId}`
      : `${API_URL}/api/frost/vaults`;
    const response = await fetch(url);
    return response.json();
  },
};