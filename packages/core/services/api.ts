import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.PAWPAD_API_URL || 'http://localhost:3000';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Vault
  async createVault(params: {
    vault_name: string;
    chain: 'SOL' | 'ZEC';
    email: string;
  }) {
    const { data } = await this.client.post('/api/vault/create', params);
    return data;
  }

  async getVault(vaultId: string) {
    const { data } = await this.client.get(`/api/vault/${vaultId}`);
    return data.vault;
  }

  async listVaults(chain?: string) {
    const params = chain ? { chain } : {};
    const { data } = await this.client.get('/api/vault/list', { params });
    return data.vaults;
  }

  // Transactions
  async sendTransaction(params: {
    vault_id: string;
    to: string;
    amount: number;
    chain: 'SOL' | 'ZEC';
  }) {
    const { data } = await this.client.post('/api/transaction/send', params);
    return data;
  }

  async getTransactionHistory(vaultId: string) {
    const { data } = await this.client.get(`/api/transaction/history/${vaultId}`);
    return data.transactions;
  }

  // Agents
  async getAgentStatus(agentId: string) {
    const { data } = await this.client.get(`/api/agent/${agentId}/status`);
    return data;
  }

  async configureAgent(agentId: string, config: Record<string, unknown>) {
    const { data } = await this.client.post(`/api/agent/${agentId}/configure`, config);
    return data;
  }

  // Health
  async healthCheck() {
    const { data } = await this.client.get('/health');
    return data;
  }
}

export const apiService = new ApiService();
export default apiService;
