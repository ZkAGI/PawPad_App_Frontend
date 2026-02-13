export const SUPPORTED_CHAINS = ['SOL', 'ZEC'] as const;

export const CHAIN_CONFIG = {
  SOL: {
    name: 'Solana',
    symbol: 'SOL',
    decimals: 9,
    rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    explorerUrl: 'https://solscan.io',
    color: '#9945FF',
  },
  ZEC: {
    name: 'Zcash',
    symbol: 'ZEC',
    decimals: 8,
    rpcUrl: process.env.ZCASH_RPC_URL || '',
    explorerUrl: 'https://blockchair.com/zcash',
    color: '#F4B728',
  },
} as const;

export const APP_CONFIG = {
  appName: 'PawPad',
  version: '2.0.0',
  apiBaseUrl: process.env.PAWPAD_API_URL || 'http://localhost:3000',
} as const;
