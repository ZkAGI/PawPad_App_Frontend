// ════════════════════════════════════════════════════════════════════════════
// PawPad TEE Service — Web Version
// Ported from src/services/teeSevice.ts (React Native)
// Replaces AsyncStorage with localStorage
// ════════════════════════════════════════════════════════════════════════════

const TEE_API_BASE = import.meta.env.DEV ? '/tee-api' : '/api/tee';

// ═══════ TYPES ═══════

export interface TEEBackupFile {
  v: number;
  uid: string;
  nonce_b64: string;
  ct_b64: string;
  tag_b64: string;
}

export interface TEEWallets {
  evm: { chain: string; address: string };
  solana: { address: string };
}

export interface TOTPConfig {
  otpauth_uri: string;
  secret?: string;
}

export interface CreateWalletResponse {
  uid: string;
  wallets: TEEWallets;
  totp: TOTPConfig;
  backup_file: TEEBackupFile;
  backup_hash: string;
  sapphire: { ok: boolean; tx: { hash?: string; blockNumber?: number; status?: number } };
}

export interface LoginResponse { token: string }
export interface WalletsResponse { uid: string; wallets: TEEWallets }

export interface TradeConfig {
  tradingEnabled: boolean;
  maxTradeAmountUsdc: number;
  allowedAssets: string[];
}

export interface TradeHistoryItem {
  uid: string; asset: string; signal: 'BUY' | 'SELL';
  signalPrice: number; chain: string; txHash: string;
  amountIn: string; tokenIn: string;
  status: 'success' | 'pending' | 'failed'; timestamp: string;
}

export interface WithdrawRequest {
  chain: 'ethereum' | 'solana';
  token: 'native' | 'usdc';
  toAddress: string;
  amount: string;
}

export interface WithdrawResponse { ok: boolean; txHash?: string; error?: string }

export interface RecoveryRotateResponse {
  ok: boolean; message: string; uid: string;
  new_totp: { otpauth_uri: string; secret: string };
  new_backup_file: TEEBackupFile;
}

// ═══════ SESSION MANAGEMENT (localStorage) ═══════

const SESSION_KEY = 'tee_session';
const SESSION_EXPIRY_MS = 55 * 60 * 1000;

interface StoredSession { token: string; uid: string; timestamp: number }

let sessionToken: string | null = null;
let currentUid: string | null = null;

export const loadSession = (): boolean => {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      const session: StoredSession = JSON.parse(stored);
      if (Date.now() - session.timestamp < SESSION_EXPIRY_MS) {
        sessionToken = session.token;
        currentUid = session.uid;
        return true;
      }
      clearSession();
    }
  } catch (e) { console.log('[TEE] Session load error:', e); }
  return false;
};

export const setSession = (token: string, uid: string): void => {
  sessionToken = token;
  currentUid = uid;
  localStorage.setItem(SESSION_KEY, JSON.stringify({ token, uid, timestamp: Date.now() }));
};

export const getSessionToken = (): string | null => sessionToken;
export const getCurrentUid = (): string | null => currentUid;
export const isLoggedIn = (): boolean => sessionToken !== null;

export const clearSession = (): void => {
  sessionToken = null;
  currentUid = null;
  localStorage.removeItem(SESSION_KEY);
};

const getAuthHeader = (): { Authorization: string } => {
  if (!sessionToken) throw new Error('Not logged in');
  return { Authorization: `Bearer ${sessionToken}` };
};

// ═══════ WALLET CREATION ═══════

export const createWallet = async (): Promise<CreateWalletResponse> => {
  console.log('[TEE] Creating new wallet...');
  const res = await fetch(`${TEE_API_BASE}/v1/connect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || 'Failed to create wallet');
  }
  const data: CreateWalletResponse = await res.json();
  console.log('[TEE] Wallet created:', data.uid, 'Solana:', data.wallets.solana.address, 'EVM:', data.wallets.evm.address);
  return data;
};

// ═══════ AUTH ═══════

export const login = async (uid: string, totpCode: string): Promise<string> => {
  console.log('[TEE] Logging in:', uid);
  const res = await fetch(`${TEE_API_BASE}/v1/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, totp_code: totpCode }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err.error || err.message || 'Login failed';
    if (msg.toLowerCase().includes('invalid')) throw new Error('Invalid authenticator code.');
    if (msg.toLowerCase().includes('not found')) throw new Error('User not found. Please recover.');
    throw new Error(msg);
  }
  const data: LoginResponse = await res.json();
  setSession(data.token, uid);
  return data.token;
};

export const logout = (): void => { clearSession(); };

// ═══════ AUTHENTICATED ENDPOINTS ═══════

export const getWallets = async (): Promise<WalletsResponse> => {
  const res = await fetch(`${TEE_API_BASE}/v1/wallets`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
  });
  if (res.status === 401) { clearSession(); throw new Error('Session expired'); }
  if (!res.ok) throw new Error('Failed to fetch wallets');
  return res.json();
};

export const withdraw = async (req: WithdrawRequest): Promise<WithdrawResponse> => {
  if (!sessionToken) return { ok: false, error: 'Not authenticated' };
  try {
    const res = await fetch(`${TEE_API_BASE}/v1/wallets/withdraw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionToken}` },
      body: JSON.stringify(req),
    });
    const data = await res.json();
    if (!res.ok) { if (res.status === 401) clearSession(); return { ok: false, error: data.error || `HTTP ${res.status}` }; }
    return { ok: true, txHash: data.txHash || data.tx_hash || data.hash };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
};

export const sendSOL = (to: string, amount: string) => withdraw({ chain: 'solana', token: 'native', toAddress: to, amount });
export const sendETH = (to: string, amount: string) => withdraw({ chain: 'ethereum', token: 'native', toAddress: to, amount });
export const sendUSDC_SOL = (to: string, amount: string) => withdraw({ chain: 'solana', token: 'usdc', toAddress: to, amount });
export const sendUSDC_ETH = (to: string, amount: string) => withdraw({ chain: 'ethereum', token: 'usdc', toAddress: to, amount });

// ═══════ TRADING ═══════

export const setTradeConfig = async (config: TradeConfig) => {
  const res = await fetch(`${TEE_API_BASE}/v1/trade/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(config),
  });
  if (res.status === 401) { clearSession(); throw new Error('Session expired'); }
  if (!res.ok) throw new Error('Failed to set trade config');
  const data = await res.json();
  localStorage.setItem('tee_trade_config', JSON.stringify(data.config));
  return data;
};

export const getTradeConfig = async () => {
  try {
    const res = await fetch(`${TEE_API_BASE}/v1/trade/config`, {
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    });
    if (res.ok) { const d = await res.json(); if (d.config?.uid) return d; }
  } catch {}
  const cached = localStorage.getItem('tee_trade_config');
  if (cached) return { ok: true, config: JSON.parse(cached) };
  return { ok: true, config: { uid: '', tradingEnabled: false, maxTradeAmountUsdc: 100, allowedAssets: ['SOL', 'ETH'] } };
};

export const getTradeHistory = async () => {
  const res = await fetch(`${TEE_API_BASE}/v1/trade/history`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
  });
  if (res.status === 401) { clearSession(); throw new Error('Session expired'); }
  if (!res.ok) throw new Error('Failed to fetch trade history');
  return res.json();
};

// ═══════ RECOVERY ═══════

export const decryptBackup = async (backupFile: TEEBackupFile) => {
  const res = await fetch(`${TEE_API_BASE}/v1/recovery/decrypt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ backup_file: backupFile }),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Decrypt failed');
  return res.json();
};

export const recoverAndRotate = async (backupFile: TEEBackupFile): Promise<RecoveryRotateResponse> => {
  const res = await fetch(`${TEE_API_BASE}/v1/recovery/rotate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ backup_file: backupFile }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Recovery failed');
  }
  return res.json();
};

// ═══════ BALANCES (Public RPCs — no auth) ═══════

const SOLANA_RPC = 'https://solana-rpc.publicnode.com';
const ETH_RPCS = ['https://ethereum-rpc.publicnode.com', 'https://rpc.ankr.com/eth', 'https://cloudflare-eth.com'];

const ethRpcCall = async (body: object) => {
  for (const rpc of ETH_RPCS) {
    try { const r = await fetch(rpc, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); const d = await r.json(); if (!d.error) return d; } catch {}
  }
  return { error: 'All RPCs failed' };
};

export const getSolanaBalance = async (address: string) => {
  try {
    const r = await fetch(SOLANA_RPC, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getBalance', params: [address] }) });
    const d = await r.json();
    const lamports = d.result?.value || 0;
    return { sol: lamports / 1e9, lamports };
  } catch { return { sol: 0, lamports: 0 }; }
};

export const getEvmBalance = async (address: string) => {
  try {
    const d = await ethRpcCall({ jsonrpc: '2.0', id: 1, method: 'eth_getBalance', params: [address, 'latest'] });
    if (d.error) return { eth: 0, wei: '0' };
    const wei = d.result || '0x0';
    return { eth: parseInt(wei, 16) / 1e18, wei };
  } catch { return { eth: 0, wei: '0' }; }
};

export const getSolanaUsdcBalance = async (address: string) => {
  try {
    const r = await fetch(SOLANA_RPC, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getTokenAccountsByOwner', params: [address, { mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' }, { encoding: 'jsonParsed' }] }) });
    const d = await r.json();
    return d.result?.value?.[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmount || 0;
  } catch { return 0; }
};

export const getEvmUsdcBalance = async (address: string) => {
  try {
    const callData = '0x70a08231000000000000000000000000' + address.slice(2).toLowerCase();
    const d = await ethRpcCall({ jsonrpc: '2.0', id: 1, method: 'eth_call', params: [{ to: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', data: callData }, 'latest'] });
    return d.error ? 0 : parseInt(d.result || '0x0', 16) / 1e6;
  } catch { return 0; }
};

export const getAllBalances = async (solAddr: string | null, evmAddr: string | null) => {
  const r = { solana: { sol: 0, usdc: 0 }, evm: { eth: 0, usdc: 0 } };
  const p: Promise<void>[] = [];
  if (solAddr) { p.push(getSolanaBalance(solAddr).then(b => { r.solana.sol = b.sol; })); p.push(getSolanaUsdcBalance(solAddr).then(b => { r.solana.usdc = b; })); }
  if (evmAddr) { p.push(getEvmBalance(evmAddr).then(b => { r.evm.eth = b.eth; })); p.push(getEvmUsdcBalance(evmAddr).then(b => { r.evm.usdc = b; })); }
  await Promise.allSettled(p);
  return r;
};

// ═══════ HELPERS ═══════

export const parseTOTPUri = (uri: string) => {
  const getParam = (p: string, d: string) => { const m = uri.match(new RegExp(`[?&]${p}=([^&]+)`)); return m ? decodeURIComponent(m[1]) : d; };
  const pm = uri.match(/otpauth:\/\/totp\/([^?]+)/);
  const pp = pm ? decodeURIComponent(pm[1]) : '';
  const [issuer, account] = pp.includes(':') ? pp.split(':') : ['PawPad', pp];
  return { secret: getParam('secret', ''), issuer: getParam('issuer', issuer || 'PawPad'), account: account || 'wallet' };
};

export const formatAddress = (addr: string, n = 6) => !addr || addr.length < n * 2 ? addr : `${addr.slice(0, n)}...${addr.slice(-n)}`;

// ═══════ WALLET STORAGE HELPERS ═══════

const WALLET_KEY = 'tee_wallet';

export const saveWalletData = (data: { uid: string; wallets: TEEWallets }) => {
  localStorage.setItem(WALLET_KEY, JSON.stringify(data));
};

export const getStoredWallet = (): { uid: string; wallets: TEEWallets } | null => {
  try {
    const s = localStorage.getItem(WALLET_KEY);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
};

export const clearWalletData = () => localStorage.removeItem(WALLET_KEY);
