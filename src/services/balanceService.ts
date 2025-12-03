// src/services/balanceService.ts
// Use backend API for balance fetching to avoid crypto.getRandomValues() issue

const API_BASE = 'http://10.0.2.2:3001';

interface BalanceResult {
  success: boolean;
  balance: number;
  balanceUsd: number;
  error?: string;
}

/**
 * Fetch balance for a vault using the backend API
 * This avoids the crypto.getRandomValues() issue in React Native
 */
export async function fetchVaultBalance(
  chain: string,
  address: string
): Promise<BalanceResult> {
  try {
    if (chain === 'SOL') {
      // Use backend Solana balance endpoint
      const response = await fetch(`${API_BASE}/api/fund/solana-balance/${address}`);
      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          balance: data.sol || 0,
          balanceUsd: data.usd || 0,
        };
      } else {
        throw new Error(data.error || 'Failed to fetch balance');
      }
    } else if (chain === 'ZEC') {
      // Use FROST balance endpoint
      const response = await fetch(`${API_BASE}/api/frost/balance/${address}`);
      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          balance: data.balance || 0,
          balanceUsd: data.balanceUsd || 0,
        };
      } else {
        throw new Error(data.error || 'Failed to fetch ZEC balance');
      }
    } else {
      return {
        success: false,
        balance: 0,
        balanceUsd: 0,
        error: `Unsupported chain: ${chain}`,
      };
    }
  } catch (error: any) {
    console.error('Balance fetch error:', error);
    return {
      success: false,
      balance: 0,
      balanceUsd: 0,
      error: error.message || 'Network error',
    };
  }
}

/**
 * Format balance for display
 */
export function formatBalance(balance: number, decimals: number = 4): string {
  if (balance === 0) return '0';
  if (balance < 0.0001) return '<0.0001';
  return balance.toFixed(decimals);
}

/**
 * Format USD value for display
 */
export function formatUsd(usd: number): string {
  if (usd === 0) return '$0.00';
  if (usd < 0.01) return '<$0.01';
  return `$${usd.toFixed(2)}`;
}

export default {
  fetchVaultBalance,
  formatBalance,
  formatUsd,
};