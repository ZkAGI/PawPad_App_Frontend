// // // // services/teeService.ts

// // // const TEE_API_URL = 'https://p8080.m1363.opf-testnet-rofl-25.rofl.app/v1/connect';

// // // export interface TEEWallet {
// // //   chain: string;
// // //   address: string;
// // // }

// // // export interface TEEWallets {
// // //   evm: TEEWallet;
// // //   solana: {
// // //     address: string;
// // //   };
// // // }

// // // export interface TOTPConfig {
// // //   otpauth_uri: string;
// // // }

// // // export interface BackupFile {
// // //   v: number;
// // //   uid: string;
// // //   nonce_b64: string;
// // //   ct_b64: string;
// // //   tag_b64: string;
// // // }

// // // export interface SapphireTransaction {
// // //   ok: boolean;
// // //   tx: {
// // //     hash: string;
// // //     blockNumber: number;
// // //     status: number;
// // //   };
// // //   calldata: string;
// // //   signerAddress: string;
// // // }

// // // export interface TEEWalletResponse {
// // //   uid: string;
// // //   wallets: TEEWallets;
// // //   totp: TOTPConfig;
// // //   backup_file: BackupFile;
// // //   backup_hash: string;
// // //   sapphire: SapphireTransaction;
// // // }

// // // /**
// // //  * Creates a new TEE wallet by calling the Oasis TEE API
// // //  * Returns wallet addresses for EVM (Base) and Solana, plus backup data
// // //  */
// // // export async function createTEEWallet(): Promise<TEEWalletResponse> {
// // //   try {
// // //     const response = await fetch(TEE_API_URL, {
// // //       method: 'POST',
// // //       headers: {
// // //         'Content-Type': 'application/json',
// // //       },
// // //       body: JSON.stringify({}),
// // //     });

// // //     if (!response.ok) {
// // //       throw new Error(`TEE API error: ${response.status} ${response.statusText}`);
// // //     }

// // //     const data: TEEWalletResponse = await response.json();
    
// // //     // Validate response has required fields
// // //     if (!data.uid || !data.wallets || !data.backup_file) {
// // //       throw new Error('Invalid TEE API response: missing required fields');
// // //     }

// // //     return data;
// // //   } catch (error) {
// // //     console.error('TEE wallet creation failed:', error);
// // //     throw error;
// // //   }
// // // }

// // // /**
// // //  * Parses the TOTP URI to extract the secret for authenticator setup
// // //  * Uses regex parsing since React Native's URL polyfill is limited
// // //  */
// // // export function parseTOTPUri(uri: string): {
// // //   secret: string;
// // //   issuer: string;
// // //   account: string;
// // //   period: number;
// // //   digits: number;
// // //   algorithm: string;
// // // } {
// // //   // Parse otpauth://totp/Issuer:account?secret=XXX&period=30&digits=6&algorithm=SHA1&issuer=Issuer
  
// // //   // Extract the path part (Issuer:account)
// // //   const pathMatch = uri.match(/otpauth:\/\/totp\/([^?]+)/);
// // //   const pathPart = pathMatch ? decodeURIComponent(pathMatch[1]) : '';
// // //   const pathParts = pathPart.split(':');
  
// // //   // Extract query parameters using regex
// // //   const getParam = (param: string, defaultValue: string): string => {
// // //     const match = uri.match(new RegExp(`[?&]${param}=([^&]+)`));
// // //     return match ? decodeURIComponent(match[1]) : defaultValue;
// // //   };

// // //   return {
// // //     secret: getParam('secret', ''),
// // //     issuer: getParam('issuer', pathParts[0] || 'PawPad'),
// // //     account: pathParts[1] || pathParts[0] || '',
// // //     period: parseInt(getParam('period', '30'), 10),
// // //     digits: parseInt(getParam('digits', '6'), 10),
// // //     algorithm: getParam('algorithm', 'SHA1'),
// // //   };
// // // }

// // // /**
// // //  * Generates backup file JSON string for download/save
// // //  */
// // // export function generateBackupFileContent(backupFile: BackupFile): string {
// // //   return JSON.stringify(backupFile, null, 2);
// // // }

// // // /**
// // //  * Generates a filename for the backup file
// // //  */
// // // export function generateBackupFilename(uid: string): string {
// // //   const timestamp = new Date().toISOString().split('T')[0];
// // //   return `pawpad-tee-backup-${uid.substring(0, 8)}-${timestamp}.json`;
// // // }

// // // services/teeService.ts
// // // Complete TEE Wallet Service - All Endpoints

// // // const TEE_API_BASE = 'https://p8080.m1364.test-proxy-b.rofl.app';

// // // // ════════════════════════════════════════════════════════════════════════════
// // // // TYPES
// // // // ════════════════════════════════════════════════════════════════════════════

// // // export interface TEEBackupFile {
// // //   v: number;
// // //   uid: string;
// // //   nonce_b64: string;
// // //   ct_b64: string;
// // //   tag_b64: string;
// // // }

// // // export interface TEEWallet {
// // //   chain: string;
// // //   address: string;
// // // }

// // // export interface TEEWallets {
// // //   evm: TEEWallet;
// // //   solana: { address: string };
// // // }

// // // export interface TOTPConfig {
// // //   otpauth_uri: string;
// // //   secret?: string;
// // // }

// // // // /v1/connect response
// // // export interface CreateWalletResponse {
// // //   uid: string;
// // //   wallets: TEEWallets;
// // //   totp: TOTPConfig;
// // //   backup_file: TEEBackupFile;
// // //   backup_hash: string;
// // //   sapphire: {
// // //     ok: boolean;
// // //     tx: { hash?: string; blockNumber?: number; status?: number };
// // //   };
// // // }

// // // // /v1/login response
// // // export interface LoginResponse {
// // //   token: string;
// // // }

// // // // /v1/wallets response
// // // export interface WalletsResponse {
// // //   uid: string;
// // //   wallets: TEEWallets;
// // // }

// // // // /v1/trade/config
// // // export interface TradeConfig {
// // //   tradingEnabled: boolean;
// // //   maxTradeAmountUsdc: number;
// // //   allowedAssets: string[];
// // // }

// // // export interface TradeConfigResponse {
// // //   ok: boolean;
// // //   config: TradeConfig & { uid: string };
// // // }

// // // // /v1/trade/history
// // // export interface TradeHistoryItem {
// // //   uid: string;
// // //   asset: string;
// // //   signal: 'BUY' | 'SELL';
// // //   signalPrice: number;
// // //   chain: string;
// // //   txHash: string;
// // //   amountIn: string;
// // //   tokenIn: string;
// // //   status: 'success' | 'pending' | 'failed';
// // //   timestamp: string;
// // // }

// // // export interface TradeHistoryResponse {
// // //   ok: boolean;
// // //   history: TradeHistoryItem[];
// // // }

// // // // /v1/recovery/decrypt response
// // // export interface DecryptBackupResponse {
// // //   ok: boolean;
// // //   payload: {
// // //     v: number;
// // //     uid: string;
// // //     totpSecret: string;
// // //     created_at: number;
// // //   };
// // // }

// // // // /v1/recovery/rotate response
// // // export interface RecoveryRotateResponse {
// // //   ok: boolean;
// // //   message: string;
// // //   uid: string;
// // //   new_totp: {
// // //     otpauth_uri: string;
// // //     secret: string;
// // //   };
// // //   new_backup_file: TEEBackupFile;
// // // }

// // // // ════════════════════════════════════════════════════════════════════════════
// // // // SESSION MANAGEMENT
// // // // ════════════════════════════════════════════════════════════════════════════

// // // let sessionToken: string | null = null;
// // // let currentUid: string | null = null;

// // // export const setSession = (token: string, uid: string) => {
// // //   sessionToken = token;
// // //   currentUid = uid;
// // // };

// // // export const getSessionToken = (): string | null => {
// // //   return sessionToken;
// // // };

// // // export const clearSession = () => {
// // //   sessionToken = null;
// // //   currentUid = null;
// // // };

// // // export const isLoggedIn = (): boolean => {
// // //   return sessionToken !== null;
// // // };

// // // export const getCurrentUid = (): string | null => currentUid;

// // // // ════════════════════════════════════════════════════════════════════════════
// // // // HEALTH & STATUS ENDPOINTS
// // // // ════════════════════════════════════════════════════════════════════════════

// // // /**
// // //  * Health check
// // //  * GET /health
// // //  */
// // // export const healthCheck = async (): Promise<{ ok: boolean }> => {
// // //   const response = await fetch(`${TEE_API_BASE}/health`);
// // //   return response.json();
// // // };

// // // /**
// // //  * ROFL Status
// // //  * GET /v1/rofl/status
// // //  */
// // // export const getROFLStatus = async (): Promise<{ mock: boolean; appId: string }> => {
// // //   const response = await fetch(`${TEE_API_BASE}/v1/rofl/status`);
// // //   return response.json();
// // // };

// // // /**
// // //  * ROFL Signer Info
// // //  * GET /v1/rofl/signer
// // //  */
// // // export const getROFLSigner = async (): Promise<{
// // //   ok: boolean;
// // //   signer: {
// // //     address: string;
// // //     balance: string;
// // //     balanceFormatted: string;
// // //   };
// // // }> => {
// // //   const response = await fetch(`${TEE_API_BASE}/v1/rofl/signer`);
// // //   return response.json();
// // // };

// // // // ════════════════════════════════════════════════════════════════════════════
// // // // WALLET CREATION
// // // // ════════════════════════════════════════════════════════════════════════════

// // // /**
// // //  * Create new account (Registration)
// // //  * POST /v1/connect
// // //  */
// // // export const createWallet = async (): Promise<CreateWalletResponse> => {
// // //   console.log('[TEE] Creating new wallet...');
  
// // //   const response = await fetch(`${TEE_API_BASE}/v1/connect`, {
// // //     method: 'POST',
// // //     headers: {
// // //       'Content-Type': 'application/json',
// // //     },
// // //     body: JSON.stringify({}),
// // //   });

// // //   if (!response.ok) {
// // //     const error = await response.json().catch(() => ({}));
// // //     throw new Error(error.message || error.error || 'Failed to create wallet');
// // //   }

// // //   const data: CreateWalletResponse = await response.json();
// // //   console.log('[TEE] Wallet created:', data.uid);
// // //   return data;
// // // };

// // // // ════════════════════════════════════════════════════════════════════════════
// // // // AUTHENTICATION
// // // // ════════════════════════════════════════════════════════════════════════════

// // // /**
// // //  * Login with TOTP code
// // //  * POST /v1/login
// // //  * Returns JWT token (expires in 60 minutes)
// // //  */
// // // export const login = async (uid: string, totpCode: string): Promise<string> => {
// // //   console.log('[TEE] Logging in with UID:', uid);
  
// // //   const response = await fetch(`${TEE_API_BASE}/v1/login`, {
// // //     method: 'POST',
// // //     headers: {
// // //       'Content-Type': 'application/json',
// // //     },
// // //     body: JSON.stringify({
// // //       uid: uid,
// // //       totp_code: totpCode,
// // //     }),
// // //   });

// // //   if (!response.ok) {
// // //     const error = await response.json().catch(() => ({}));
// // //     const errorMsg = error.error || error.message || 'Login failed';
    
// // //     if (errorMsg.toLowerCase().includes('invalid')) {
// // //       throw new Error('Invalid authenticator code. Please try again.');
// // //     }
// // //     if (errorMsg.toLowerCase().includes('not found')) {
// // //       throw new Error('User not found. Please recover your wallet.');
// // //     }
// // //     throw new Error(errorMsg);
// // //   }

// // //   const data: LoginResponse = await response.json();
  
// // //   // Store session
// // //   setSession(data.token, uid);
  
// // //   console.log('[TEE] Login successful, token received');
// // //   return data.token;
// // // };

// // // /**
// // //  * Logout - Clear local session
// // //  */
// // // export const logout = (): void => {
// // //   clearSession();
// // //   console.log('[TEE] Logged out');
// // // };

// // // // ════════════════════════════════════════════════════════════════════════════
// // // // AUTHENTICATED ENDPOINTS (require Bearer token)
// // // // ════════════════════════════════════════════════════════════════════════════

// // // /**
// // //  * Get authorization header
// // //  */
// // // const getAuthHeader = (): { Authorization: string } => {
// // //   const token = getSessionToken();
// // //   if (!token) {
// // //     throw new Error('Not logged in. Please authenticate first.');
// // //   }
// // //   return { Authorization: `Bearer ${token}` };
// // // };

// // // /**
// // //  * Get wallet addresses
// // //  * GET /v1/wallets
// // //  */
// // // export const getWallets = async (): Promise<WalletsResponse> => {
// // //   console.log('[TEE] Fetching wallets...');
  
// // //   const response = await fetch(`${TEE_API_BASE}/v1/wallets`, {
// // //     method: 'GET',
// // //     headers: {
// // //       'Content-Type': 'application/json',
// // //       ...getAuthHeader(),
// // //     },
// // //   });

// // //   if (!response.ok) {
// // //     if (response.status === 401) {
// // //       clearSession();
// // //       throw new Error('Session expired. Please login again.');
// // //     }
// // //     const error = await response.json().catch(() => ({}));
// // //     throw new Error(error.error || 'Failed to fetch wallets');
// // //   }

// // //   return response.json();
// // // };

// // // /**
// // //  * Configure trading settings
// // //  * POST /v1/trade/config
// // //  */
// // // export const setTradeConfig = async (config: TradeConfig): Promise<TradeConfigResponse> => {
// // //   console.log('[TEE] Setting trade config:', config);
  
// // //   const response = await fetch(`${TEE_API_BASE}/v1/trade/config`, {
// // //     method: 'POST',
// // //     headers: {
// // //       'Content-Type': 'application/json',
// // //       ...getAuthHeader(),
// // //     },
// // //     body: JSON.stringify(config),
// // //   });

// // //   if (!response.ok) {
// // //     if (response.status === 401) {
// // //       clearSession();
// // //       throw new Error('Session expired. Please login again.');
// // //     }
// // //     const error = await response.json().catch(() => ({}));
// // //     throw new Error(error.error || 'Failed to set trade config');
// // //   }

// // //   const data: TradeConfigResponse = await response.json();
// // //   console.log('[TEE] Trade config saved');
// // //   return data;
// // // };

// // // /**
// // //  * Get trade history
// // //  * GET /v1/trade/history
// // //  */
// // // export const getTradeHistory = async (): Promise<TradeHistoryResponse> => {
// // //   console.log('[TEE] Fetching trade history...');
  
// // //   const response = await fetch(`${TEE_API_BASE}/v1/trade/history`, {
// // //     method: 'GET',
// // //     headers: {
// // //       'Content-Type': 'application/json',
// // //       ...getAuthHeader(),
// // //     },
// // //   });

// // //   if (!response.ok) {
// // //     if (response.status === 401) {
// // //       clearSession();
// // //       throw new Error('Session expired. Please login again.');
// // //     }
// // //     const error = await response.json().catch(() => ({}));
// // //     throw new Error(error.error || 'Failed to fetch trade history');
// // //   }

// // //   const data: TradeHistoryResponse = await response.json();
// // //   console.log('[TEE] Got', data.history.length, 'trades');
// // //   return data;
// // // };

// // // // ════════════════════════════════════════════════════════════════════════════
// // // // RECOVERY ENDPOINTS
// // // // ════════════════════════════════════════════════════════════════════════════

// // // /**
// // //  * Decrypt backup file (to see contents)
// // //  * POST /v1/recovery/decrypt
// // //  */
// // // export const decryptBackup = async (backupFile: TEEBackupFile): Promise<DecryptBackupResponse> => {
// // //   console.log('[TEE] Decrypting backup...');
  
// // //   const response = await fetch(`${TEE_API_BASE}/v1/recovery/decrypt`, {
// // //     method: 'POST',
// // //     headers: {
// // //       'Content-Type': 'application/json',
// // //     },
// // //     body: JSON.stringify({
// // //       backup_file: backupFile,
// // //     }),
// // //   });

// // //   if (!response.ok) {
// // //     const error = await response.json().catch(() => ({}));
// // //     throw new Error(error.error || 'Failed to decrypt backup');
// // //   }

// // //   return response.json();
// // // };

// // // /**
// // //  * Recover account - Rotate credentials
// // //  * POST /v1/recovery/rotate
// // //  * Use when user lost phone/authenticator but has backup file
// // //  * Returns NEW totp and NEW backup_file (old ones become invalid)
// // //  */
// // // export const recoverAndRotate = async (backupFile: TEEBackupFile): Promise<RecoveryRotateResponse> => {
// // //   console.log('[TEE] Starting recovery/rotate for UID:', backupFile.uid);
  
// // //   const response = await fetch(`${TEE_API_BASE}/v1/recovery/rotate`, {
// // //     method: 'POST',
// // //     headers: {
// // //       'Content-Type': 'application/json',
// // //     },
// // //     body: JSON.stringify({
// // //       backup_file: backupFile,
// // //     }),
// // //   });

// // //   if (!response.ok) {
// // //     const error = await response.json().catch(() => ({}));
// // //     const errorMsg = error.error || error.message || 'Recovery failed';
    
// // //     if (errorMsg.toLowerCase().includes('not found')) {
// // //       throw new Error('User not found. Backup file may be invalid.');
// // //     }
// // //     throw new Error(errorMsg);
// // //   }

// // //   const data: RecoveryRotateResponse = await response.json();
// // //   console.log('[TEE] Recovery successful - new credentials generated');
// // //   return data;
// // // };

// // // // ════════════════════════════════════════════════════════════════════════════
// // // // HELPER FUNCTIONS
// // // // ════════════════════════════════════════════════════════════════════════════

// // // /**
// // //  * Parse TOTP URI to extract secret
// // //  */
// // // export const parseTOTPUri = (uri: string): {
// // //   secret: string;
// // //   issuer: string;
// // //   account: string;
// // // } => {
// // //   const getParam = (param: string, defaultValue: string): string => {
// // //     const match = uri.match(new RegExp(`[?&]${param}=([^&]+)`));
// // //     return match ? decodeURIComponent(match[1]) : defaultValue;
// // //   };

// // //   const pathMatch = uri.match(/otpauth:\/\/totp\/([^?]+)/);
// // //   const pathPart = pathMatch ? decodeURIComponent(pathMatch[1]) : '';
// // //   const [issuerFromPath, account] = pathPart.includes(':') 
// // //     ? pathPart.split(':') 
// // //     : ['PawPad', pathPart];

// // //   return {
// // //     secret: getParam('secret', ''),
// // //     issuer: getParam('issuer', issuerFromPath || 'PawPad'),
// // //     account: account || 'wallet',
// // //   };
// // // };

// // // /**
// // //  * Format wallet address for display
// // //  */
// // // export const formatAddress = (address: string, chars: number = 6): string => {
// // //   if (!address || address.length < chars * 2) return address;
// // //   return `${address.slice(0, chars)}...${address.slice(-chars)}`;
// // // };

// // // /**
// // //  * Format trade amount
// // //  */
// // // export const formatAmount = (amount: string | number, decimals: number = 2): string => {
// // //   const num = typeof amount === 'string' ? parseFloat(amount) : amount;
// // //   return num.toFixed(decimals);
// // // };

// // // // ════════════════════════════════════════════════════════════════════════════
// // // // DEFAULT EXPORT
// // // // ════════════════════════════════════════════════════════════════════════════

// // // export default {
// // //   // Health & Status
// // //   healthCheck,
// // //   getROFLStatus,
// // //   getROFLSigner,
  
// // //   // Wallet
// // //   createWallet,
// // //   getWallets,
  
// // //   // Auth
// // //   login,
// // //   logout,
// // //   isLoggedIn,
// // //   getSessionToken,
// // //   getCurrentUid,
  
// // //   // Trading
// // //   setTradeConfig,
// // //   getTradeHistory,
  
// // //   // Recovery
// // //   decryptBackup,
// // //   recoverAndRotate,
  
// // //   // Helpers
// // //   parseTOTPUri,
// // //   formatAddress,
// // //   formatAmount,
// // // };

// // // services/teeService.ts
// // // Complete TEE Wallet Service - All Endpoints

// // // services/teeService.ts
// // // Complete TEE Wallet Service - All Endpoints

// // const TEE_API_BASE = 'https://p8080.m125.opf-mainnet-rofl-35.rofl.app';

// // // ════════════════════════════════════════════════════════════════════════════
// // // TYPES
// // // ════════════════════════════════════════════════════════════════════════════

// // export interface TEEBackupFile {
// //   v: number;
// //   uid: string;
// //   nonce_b64: string;
// //   ct_b64: string;
// //   tag_b64: string;
// // }

// // export interface TEEWallet {
// //   chain: string;
// //   address: string;
// // }

// // export interface TEEWallets {
// //   evm: TEEWallet;
// //   solana: { address: string };
// // }

// // export interface TOTPConfig {
// //   otpauth_uri: string;
// //   secret?: string;
// // }

// // // /v1/connect response
// // export interface CreateWalletResponse {
// //   uid: string;
// //   wallets: TEEWallets;
// //   totp: TOTPConfig;
// //   backup_file: TEEBackupFile;
// //   backup_hash: string;
// //   sapphire: {
// //     ok: boolean;
// //     tx: { hash?: string; blockNumber?: number; status?: number };
// //   };
// // }

// // // /v1/login response
// // export interface LoginResponse {
// //   token: string;
// // }

// // // /v1/wallets response
// // export interface WalletsResponse {
// //   uid: string;
// //   wallets: TEEWallets;
// // }

// // // /v1/trade/config
// // export interface TradeConfig {
// //   tradingEnabled: boolean;
// //   maxTradeAmountUsdc: number;
// //   allowedAssets: string[];
// // }

// // export interface TradeConfigResponse {
// //   ok: boolean;
// //   config: TradeConfig & { uid: string };
// // }

// // // /v1/trade/history
// // export interface TradeHistoryItem {
// //   uid: string;
// //   asset: string;
// //   signal: 'BUY' | 'SELL';
// //   signalPrice: number;
// //   chain: string;
// //   txHash: string;
// //   amountIn: string;
// //   tokenIn: string;
// //   status: 'success' | 'pending' | 'failed';
// //   timestamp: string;
// // }

// // export interface TradeHistoryResponse {
// //   ok: boolean;
// //   history: TradeHistoryItem[];
// // }

// // // /v1/recovery/decrypt response
// // export interface DecryptBackupResponse {
// //   ok: boolean;
// //   payload: {
// //     v: number;
// //     uid: string;
// //     totpSecret: string;
// //     created_at: number;
// //   };
// // }

// // // /v1/recovery/rotate response
// // export interface RecoveryRotateResponse {
// //   ok: boolean;
// //   message: string;
// //   uid: string;
// //   new_totp: {
// //     otpauth_uri: string;
// //     secret: string;
// //   };
// //   new_backup_file: TEEBackupFile;
// // }

// // // ════════════════════════════════════════════════════════════════════════════
// // // SESSION MANAGEMENT
// // // ════════════════════════════════════════════════════════════════════════════

// // let sessionToken: string | null = null;
// // let currentUid: string | null = null;

// // export const setSession = (token: string, uid: string) => {
// //   sessionToken = token;
// //   currentUid = uid;
// // };

// // export const getSessionToken = (): string | null => {
// //   return sessionToken;
// // };

// // export const clearSession = () => {
// //   sessionToken = null;
// //   currentUid = null;
// // };

// // export const isLoggedIn = (): boolean => {
// //   return sessionToken !== null;
// // };

// // export const getCurrentUid = (): string | null => currentUid;

// // // ════════════════════════════════════════════════════════════════════════════
// // // HEALTH & STATUS ENDPOINTS
// // // ════════════════════════════════════════════════════════════════════════════

// // /**
// //  * Health check
// //  * GET /health
// //  */
// // export const healthCheck = async (): Promise<{ ok: boolean }> => {
// //   const response = await fetch(`${TEE_API_BASE}/health`);
// //   return response.json();
// // };

// // /**
// //  * ROFL Status
// //  * GET /v1/rofl/status
// //  */
// // export const getROFLStatus = async (): Promise<{ mock: boolean; appId: string }> => {
// //   const response = await fetch(`${TEE_API_BASE}/v1/rofl/status`);
// //   return response.json();
// // };

// // /**
// //  * ROFL Signer Info
// //  * GET /v1/rofl/signer
// //  */
// // export const getROFLSigner = async (): Promise<{
// //   ok: boolean;
// //   signer: {
// //     address: string;
// //     balance: string;
// //     balanceFormatted: string;
// //   };
// // }> => {
// //   const response = await fetch(`${TEE_API_BASE}/v1/rofl/signer`);
// //   return response.json();
// // };

// // // ════════════════════════════════════════════════════════════════════════════
// // // WALLET CREATION
// // // ════════════════════════════════════════════════════════════════════════════

// // /**
// //  * Create new account (Registration)
// //  * POST /v1/connect
// //  */
// // export const createWallet = async (): Promise<CreateWalletResponse> => {
// //   console.log('[TEE] Creating new wallet...');
  
// //   const response = await fetch(`${TEE_API_BASE}/v1/connect`, {
// //     method: 'POST',
// //     headers: {
// //       'Content-Type': 'application/json',
// //     },
// //     body: JSON.stringify({}),
// //   });

// //   if (!response.ok) {
// //     const error = await response.json().catch(() => ({}));
// //     throw new Error(error.message || error.error || 'Failed to create wallet');
// //   }

// //   const data: CreateWalletResponse = await response.json();
// //   console.log('[TEE] Wallet created:', data.uid);
// //   return data;
// // };

// // // ════════════════════════════════════════════════════════════════════════════
// // // AUTHENTICATION
// // // ════════════════════════════════════════════════════════════════════════════

// // /**
// //  * Login with TOTP code
// //  * POST /v1/login
// //  * Returns JWT token (expires in 60 minutes)
// //  */
// // export const login = async (uid: string, totpCode: string): Promise<string> => {
// //   console.log('[TEE] Logging in with UID:', uid);
  
// //   const response = await fetch(`${TEE_API_BASE}/v1/login`, {
// //     method: 'POST',
// //     headers: {
// //       'Content-Type': 'application/json',
// //     },
// //     body: JSON.stringify({
// //       uid: uid,
// //       totp_code: totpCode,
// //     }),
// //   });

// //   if (!response.ok) {
// //     const error = await response.json().catch(() => ({}));
// //     const errorMsg = error.error || error.message || 'Login failed';
    
// //     if (errorMsg.toLowerCase().includes('invalid')) {
// //       throw new Error('Invalid authenticator code. Please try again.');
// //     }
// //     if (errorMsg.toLowerCase().includes('not found')) {
// //       throw new Error('User not found. Please recover your wallet.');
// //     }
// //     throw new Error(errorMsg);
// //   }

// //   const data: LoginResponse = await response.json();
  
// //   // Store session
// //   setSession(data.token, uid);
  
// //   console.log('[TEE] Login successful, token received');
// //   return data.token;
// // };

// // /**
// //  * Logout - Clear local session
// //  */
// // export const logout = (): void => {
// //   clearSession();
// //   console.log('[TEE] Logged out');
// // };

// // // ════════════════════════════════════════════════════════════════════════════
// // // AUTHENTICATED ENDPOINTS (require Bearer token)
// // // ════════════════════════════════════════════════════════════════════════════

// // /**
// //  * Get authorization header
// //  */
// // const getAuthHeader = (): { Authorization: string } => {
// //   const token = getSessionToken();
// //   if (!token) {
// //     throw new Error('Not logged in. Please authenticate first.');
// //   }
// //   return { Authorization: `Bearer ${token}` };
// // };

// // /**
// //  * Get wallet addresses
// //  * GET /v1/wallets
// //  */
// // export const getWallets = async (): Promise<WalletsResponse> => {
// //   console.log('[TEE] Fetching wallets...');
  
// //   const response = await fetch(`${TEE_API_BASE}/v1/wallets`, {
// //     method: 'GET',
// //     headers: {
// //       'Content-Type': 'application/json',
// //       ...getAuthHeader(),
// //     },
// //   });

// //   if (!response.ok) {
// //     if (response.status === 401) {
// //       clearSession();
// //       throw new Error('Session expired. Please login again.');
// //     }
// //     const error = await response.json().catch(() => ({}));
// //     throw new Error(error.error || 'Failed to fetch wallets');
// //   }

// //   return response.json();
// // };

// // /**
// //  * Configure trading settings
// //  * POST /v1/trade/config
// //  */
// // export const setTradeConfig = async (config: TradeConfig): Promise<TradeConfigResponse> => {
// //   console.log('[TEE] Setting trade config:', config);
  
// //   const response = await fetch(`${TEE_API_BASE}/v1/trade/config`, {
// //     method: 'POST',
// //     headers: {
// //       'Content-Type': 'application/json',
// //       ...getAuthHeader(),
// //     },
// //     body: JSON.stringify(config),
// //   });

// //   if (!response.ok) {
// //     if (response.status === 401) {
// //       clearSession();
// //       throw new Error('Session expired. Please login again.');
// //     }
// //     const error = await response.json().catch(() => ({}));
// //     throw new Error(error.error || 'Failed to set trade config');
// //   }

// //   const data: TradeConfigResponse = await response.json();
// //   console.log('[TEE] Trade config saved');
// //   return data;
// // };

// // /**
// //  * Get trade history
// //  * GET /v1/trade/history
// //  */
// // export const getTradeHistory = async (): Promise<TradeHistoryResponse> => {
// //   console.log('[TEE] Fetching trade history...');
  
// //   const response = await fetch(`${TEE_API_BASE}/v1/trade/history`, {
// //     method: 'GET',
// //     headers: {
// //       'Content-Type': 'application/json',
// //       ...getAuthHeader(),
// //     },
// //   });

// //   if (!response.ok) {
// //     if (response.status === 401) {
// //       clearSession();
// //       throw new Error('Session expired. Please login again.');
// //     }
// //     const error = await response.json().catch(() => ({}));
// //     throw new Error(error.error || 'Failed to fetch trade history');
// //   }

// //   const data: TradeHistoryResponse = await response.json();
// //   console.log('[TEE] Got', data.history.length, 'trades');
// //   return data;
// // };

// // // ════════════════════════════════════════════════════════════════════════════
// // // RECOVERY ENDPOINTS
// // // ════════════════════════════════════════════════════════════════════════════

// // /**
// //  * Decrypt backup file (to see contents)
// //  * POST /v1/recovery/decrypt
// //  */
// // export const decryptBackup = async (backupFile: TEEBackupFile): Promise<DecryptBackupResponse> => {
// //   console.log('[TEE] Decrypting backup...');
  
// //   const response = await fetch(`${TEE_API_BASE}/v1/recovery/decrypt`, {
// //     method: 'POST',
// //     headers: {
// //       'Content-Type': 'application/json',
// //     },
// //     body: JSON.stringify({
// //       backup_file: backupFile,
// //     }),
// //   });

// //   if (!response.ok) {
// //     const error = await response.json().catch(() => ({}));
// //     throw new Error(error.error || 'Failed to decrypt backup');
// //   }

// //   return response.json();
// // };

// // /**
// //  * Recover account - Rotate credentials
// //  * POST /v1/recovery/rotate
// //  * Use when user lost phone/authenticator but has backup file
// //  * Returns NEW totp and NEW backup_file (old ones become invalid)
// //  */
// // export const recoverAndRotate = async (backupFile: TEEBackupFile): Promise<RecoveryRotateResponse> => {
// //   console.log('[TEE] Starting recovery/rotate for UID:', backupFile.uid);
  
// //   const response = await fetch(`${TEE_API_BASE}/v1/recovery/rotate`, {
// //     method: 'POST',
// //     headers: {
// //       'Content-Type': 'application/json',
// //     },
// //     body: JSON.stringify({
// //       backup_file: backupFile,
// //     }),
// //   });

// //   if (!response.ok) {
// //     const error = await response.json().catch(() => ({}));
// //     const errorMsg = error.error || error.message || 'Recovery failed';
    
// //     if (errorMsg.toLowerCase().includes('not found')) {
// //       throw new Error('User not found. Backup file may be invalid.');
// //     }
// //     throw new Error(errorMsg);
// //   }

// //   const data: RecoveryRotateResponse = await response.json();
// //   console.log('[TEE] Recovery successful - new credentials generated');
// //   return data;
// // };

// // // ════════════════════════════════════════════════════════════════════════════
// // // WITHDRAW / SEND
// // // ════════════════════════════════════════════════════════════════════════════

// // export interface WithdrawRequest {
// //   chain: 'ethereum' | 'solana';
// //   token: 'native' | 'usdc';
// //   toAddress: string;
// //   amount: string;
// // }

// // export interface WithdrawResponse {
// //   ok: boolean;
// //   txHash?: string;
// //   error?: string;
// // }

// // /**
// //  * Withdraw/Send tokens from TEE wallet
// //  * Requires authentication (session token)
// //  */
// // export const withdraw = async (request: WithdrawRequest): Promise<WithdrawResponse> => {
// //   const token = await getSessionToken();
  
// //   if (!token) {
// //     return { ok: false, error: 'Not authenticated. Please login first.' };
// //   }

// //   try {
// //     console.log('[TEE] Withdraw request:', request);
    
// //     const response = await fetch(`${TEE_API_BASE}/v1/wallets/withdraw`, {
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': 'application/json',
// //         'Authorization': `Bearer ${token}`,
// //       },
// //       body: JSON.stringify(request),
// //     });

// //     const data = await response.json();
// //     console.log('[TEE] Withdraw response:', data);

// //     if (!response.ok) {
// //       return { 
// //         ok: false, 
// //         error: data.error || data.message || `HTTP ${response.status}` 
// //       };
// //     }

// //     return {
// //       ok: data.ok !== false,
// //       txHash: data.txHash || data.tx_hash || data.hash,
// //       error: data.error,
// //     };
// //   } catch (error: any) {
// //     console.error('[TEE] Withdraw error:', error);
// //     return { ok: false, error: error.message || 'Network error' };
// //   }
// // };

// // /**
// //  * Send ETH on Ethereum mainnet
// //  */
// // export const sendETH = async (toAddress: string, amount: string): Promise<WithdrawResponse> => {
// //   return withdraw({
// //     chain: 'ethereum', // API uses 'base' but we're on ETH mainnet
// //     token: 'native',
// //     toAddress,
// //     amount,
// //   });
// // };

// // /**
// //  * Send USDC on Ethereum mainnet
// //  */
// // export const sendUSDC_ETH = async (toAddress: string, amount: string): Promise<WithdrawResponse> => {
// //   return withdraw({
// //     chain: 'ethereum',
// //     token: 'usdc',
// //     toAddress,
// //     amount,
// //   });
// // };

// // /**
// //  * Send SOL on Solana
// //  */
// // export const sendSOL = async (toAddress: string, amount: string): Promise<WithdrawResponse> => {
// //   return withdraw({
// //     chain: 'solana',
// //     token: 'native',
// //     toAddress,
// //     amount,
// //   });
// // };

// // /**
// //  * Send USDC on Solana
// //  */
// // export const sendUSDC_SOL = async (toAddress: string, amount: string): Promise<WithdrawResponse> => {
// //   return withdraw({
// //     chain: 'solana',
// //     token: 'usdc',
// //     toAddress,
// //     amount,
// //   });
// // };

// // // ════════════════════════════════════════════════════════════════════════════
// // // BALANCE FETCHING (Public RPCs - no auth needed)
// // // ════════════════════════════════════════════════════════════════════════════

// // const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';

// // // Multiple ETH RPC endpoints for fallback
// // const ETH_RPCS = [
// //   'https://ethereum-rpc.publicnode.com',
// //   'https://rpc.ankr.com/eth',
// //   'https://cloudflare-eth.com',
// // ];


// // /**
// //  * Make RPC call with fallback to multiple endpoints
// //  */
// // const ethRpcCall = async (body: object): Promise<any> => {
// //   for (const rpc of ETH_RPCS) {
// //     try {
// //       const response = await fetch(rpc, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(body),
// //       });
      
// //       const data = await response.json();
      
// //       if (!data.error) {
// //         return data;
// //       }
// //       console.log(`[RPC] ${rpc} returned error, trying next...`);
// //     } catch (err) {
// //       console.log(`[RPC] ${rpc} failed, trying next...`);
// //     }
// //   }
// //   return { error: 'All RPCs failed' };
// // };

// // /**
// //  * Get SOL balance for any Solana address
// //  */
// // export const getSolanaBalance = async (address: string): Promise<{
// //   sol: number;
// //   lamports: number;
// // }> => {
// //   try {
// //     const response = await fetch(SOLANA_RPC, {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify({
// //         jsonrpc: '2.0',
// //         id: 1,
// //         method: 'getBalance',
// //         params: [address],
// //       }),
// //     });

// //     const data = await response.json();
    
// //     if (data.error) {
// //       console.log('[Balance] Solana RPC error:', data.error);
// //       return { sol: 0, lamports: 0 };
// //     }

// //     const lamports = data.result?.value || 0;
// //     const sol = lamports / 1e9;
    
// //     console.log('[Balance] SOL:', sol);
// //     return { sol, lamports };
// //   } catch (error) {
// //     console.log('[Balance] Solana fetch error:', error);
// //     return { sol: 0, lamports: 0 };
// //   }
// // };

// // /**
// //  * Get ETH balance for any EVM address (Ethereum mainnet)
// //  */
// // export const getEvmBalance = async (address: string): Promise<{
// //   eth: number;
// //   wei: string;
// // }> => {
// //   try {
// //     const data = await ethRpcCall({
// //       jsonrpc: '2.0',
// //       id: 1,
// //       method: 'eth_getBalance',
// //       params: [address, 'latest'],
// //     });
    
// //     if (data.error) {
// //       console.log('[Balance] ETH RPC error:', data.error);
// //       return { eth: 0, wei: '0' };
// //     }

// //     const wei = data.result || '0x0';
// //     const eth = parseInt(wei, 16) / 1e18;
    
// //     console.log('[Balance] ETH:', eth);
// //     return { eth, wei };
// //   } catch (error) {
// //     console.log('[Balance] ETH fetch error:', error);
// //     return { eth: 0, wei: '0' };
// //   }
// // };

// // /**
// //  * Get USDC balance on Solana
// //  * USDC Mint: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
// //  */
// // export const getSolanaUsdcBalance = async (address: string): Promise<number> => {
// //   const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
  
// //   try {
// //     const response = await fetch(SOLANA_RPC, {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify({
// //         jsonrpc: '2.0',
// //         id: 1,
// //         method: 'getTokenAccountsByOwner',
// //         params: [
// //           address,
// //           { mint: USDC_MINT },
// //           { encoding: 'jsonParsed' },
// //         ],
// //       }),
// //     });

// //     const data = await response.json();
    
// //     if (data.error || !data.result?.value?.length) {
// //       return 0;
// //     }

// //     const tokenAccount = data.result.value[0];
// //     const amount = tokenAccount?.account?.data?.parsed?.info?.tokenAmount?.uiAmount || 0;
    
// //     console.log('[Balance] USDC (SOL):', amount);
// //     return amount;
// //   } catch (error) {
// //     console.log('[Balance] USDC Solana fetch error:', error);
// //     return 0;
// //   }
// // };

// // /**
// //  * Get USDC balance on Ethereum mainnet
// //  * USDC Contract: 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
// //  */
// // export const getEvmUsdcBalance = async (address: string): Promise<number> => {
// //   const USDC_CONTRACT = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // ETH mainnet USDC
  
// //   try {
// //     // ERC20 balanceOf(address) call
// //     const callData = '0x70a08231000000000000000000000000' + address.slice(2).toLowerCase();
    
// //     const data = await ethRpcCall({
// //       jsonrpc: '2.0',
// //       id: 1,
// //       method: 'eth_call',
// //       params: [
// //         { to: USDC_CONTRACT, data: callData },
// //         'latest',
// //       ],
// //     });
    
// //     if (data.error) {
// //       return 0;
// //     }

// //     // USDC has 6 decimals
// //     const balance = parseInt(data.result || '0x0', 16) / 1e6;
    
// //     console.log('[Balance] USDC (ETH):', balance);
// //     return balance;
// //   } catch (error) {
// //     console.log('[Balance] USDC ETH fetch error:', error);
// //     return 0;
// //   }
// // };

// // /**
// //  * Get all balances for a TEE wallet
// //  */
// // export const getAllBalances = async (
// //   solanaAddress: string | null,
// //   evmAddress: string | null
// // ): Promise<{
// //   solana: { sol: number; usdc: number };
// //   evm: { eth: number; usdc: number };
// // }> => {
// //   const results = {
// //     solana: { sol: 0, usdc: 0 },
// //     evm: { eth: 0, usdc: 0 },
// //   };

// //   // Fetch in parallel
// //   const promises: Promise<void>[] = [];

// //   if (solanaAddress) {
// //     promises.push(
// //       getSolanaBalance(solanaAddress).then(r => { results.solana.sol = r.sol; }),
// //       getSolanaUsdcBalance(solanaAddress).then(r => { results.solana.usdc = r; })
// //     );
// //   }

// //   if (evmAddress) {
// //     promises.push(
// //       getEvmBalance(evmAddress).then(r => { results.evm.eth = r.eth; }),
// //       getEvmUsdcBalance(evmAddress).then(r => { results.evm.usdc = r; })
// //     );
// //   }

// //   await Promise.allSettled(promises);
  
// //   console.log('[Balance] All balances:', results);
// //   return results;
// // };

// // // ════════════════════════════════════════════════════════════════════════════
// // // HELPER FUNCTIONS
// // // ════════════════════════════════════════════════════════════════════════════

// // /**
// //  * Parse TOTP URI to extract secret
// //  */
// // export const parseTOTPUri = (uri: string): {
// //   secret: string;
// //   issuer: string;
// //   account: string;
// // } => {
// //   const getParam = (param: string, defaultValue: string): string => {
// //     const match = uri.match(new RegExp(`[?&]${param}=([^&]+)`));
// //     return match ? decodeURIComponent(match[1]) : defaultValue;
// //   };

// //   const pathMatch = uri.match(/otpauth:\/\/totp\/([^?]+)/);
// //   const pathPart = pathMatch ? decodeURIComponent(pathMatch[1]) : '';
// //   const [issuerFromPath, account] = pathPart.includes(':') 
// //     ? pathPart.split(':') 
// //     : ['PawPad', pathPart];

// //   return {
// //     secret: getParam('secret', ''),
// //     issuer: getParam('issuer', issuerFromPath || 'PawPad'),
// //     account: account || 'wallet',
// //   };
// // };

// // /**
// //  * Format wallet address for display
// //  */
// // export const formatAddress = (address: string, chars: number = 6): string => {
// //   if (!address || address.length < chars * 2) return address;
// //   return `${address.slice(0, chars)}...${address.slice(-chars)}`;
// // };

// // /**
// //  * Format trade amount
// //  */
// // export const formatAmount = (amount: string | number, decimals: number = 2): string => {
// //   const num = typeof amount === 'string' ? parseFloat(amount) : amount;
// //   return num.toFixed(decimals);
// // };

// // // ════════════════════════════════════════════════════════════════════════════
// // // DEFAULT EXPORT
// // // ════════════════════════════════════════════════════════════════════════════

// // export default {
// //   // Health & Status
// //   healthCheck,
// //   getROFLStatus,
// //   getROFLSigner,
  
// //   // Wallet
// //   createWallet,
// //   getWallets,
  
// //   // Auth
// //   login,
// //   logout,
// //   isLoggedIn,
// //   getSessionToken,
// //   getCurrentUid,
  
// //   // Trading
// //   setTradeConfig,
// //   getTradeHistory,
  
// //   // Recovery
// //   decryptBackup,
// //   recoverAndRotate,
  
// //   // Balances (Public RPCs)
// //   getSolanaBalance,
// //   getEvmBalance,
// //   getSolanaUsdcBalance,
// //   getEvmUsdcBalance,
// //   getAllBalances,
  
// //   // Helpers
// //   parseTOTPUri,
// //   formatAddress,
// //   formatAmount,
// // };

// import AsyncStorage from '@react-native-async-storage/async-storage';

// const TEE_API_BASE = 'https://p8080.m125.opf-mainnet-rofl-35.rofl.app';

// // ════════════════════════════════════════════════════════════════════════════
// // TYPES
// // ════════════════════════════════════════════════════════════════════════════

// export interface TEEBackupFile {
//   v: number;
//   uid: string;
//   nonce_b64: string;
//   ct_b64: string;
//   tag_b64: string;
// }

// export interface TEEWallet {
//   chain: string;
//   address: string;
// }

// export interface TEEWallets {
//   evm: TEEWallet;
//   solana: { address: string };
// }

// export interface TOTPConfig {
//   otpauth_uri: string;
//   secret?: string;
// }

// // /v1/connect response
// export interface CreateWalletResponse {
//   uid: string;
//   wallets: TEEWallets;
//   totp: TOTPConfig;
//   backup_file: TEEBackupFile;
//   backup_hash: string;
//   sapphire: {
//     ok: boolean;
//     tx: { hash?: string; blockNumber?: number; status?: number };
//   };
// }

// // /v1/login response
// export interface LoginResponse {
//   token: string;
// }

// // /v1/wallets response
// export interface WalletsResponse {
//   uid: string;
//   wallets: TEEWallets;
// }

// // /v1/trade/config
// export interface TradeConfig {
//   tradingEnabled: boolean;
//   maxTradeAmountUsdc: number;
//   allowedAssets: string[];
// }

// export interface TradeConfigResponse {
//   ok: boolean;
//   config: TradeConfig & { uid: string };
// }

// // /v1/trade/history
// export interface TradeHistoryItem {
//   uid: string;
//   asset: string;
//   signal: 'BUY' | 'SELL';
//   signalPrice: number;
//   chain: string;
//   txHash: string;
//   amountIn: string;
//   tokenIn: string;
//   status: 'success' | 'pending' | 'failed';
//   timestamp: string;
// }

// export interface TradeHistoryResponse {
//   ok: boolean;
//   history: TradeHistoryItem[];
// }

// // /v1/recovery/decrypt response
// export interface DecryptBackupResponse {
//   ok: boolean;
//   payload: {
//     v: number;
//     uid: string;
//     totpSecret: string;
//     created_at: number;
//   };
// }

// // /v1/recovery/rotate response
// export interface RecoveryRotateResponse {
//   ok: boolean;
//   message: string;
//   uid: string;
//   new_totp: {
//     otpauth_uri: string;
//     secret: string;
//   };
//   new_backup_file: TEEBackupFile;
// }

// // ════════════════════════════════════════════════════════════════════════════
// // SESSION MANAGEMENT - PERSISTED TO ASYNCSTORAGE
// // ════════════════════════════════════════════════════════════════════════════

// const SESSION_STORAGE_KEY = 'tee_session';
// const SESSION_EXPIRY_MS = 55 * 60 * 1000; // 55 minutes (token expires in 60)

// interface StoredSession {
//   token: string;
//   uid: string;
//   timestamp: number;
// }

// // In-memory cache
// let sessionToken: string | null = null;
// let currentUid: string | null = null;
// let sessionLoaded = false;

// /**
//  * Load session from AsyncStorage (call on app start)
//  */
// export const loadSession = async (): Promise<boolean> => {
//   try {
//     const stored = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
//     if (stored) {
//       const session: StoredSession = JSON.parse(stored);
      
//       // Check if session is still valid (not expired)
//       const elapsed = Date.now() - session.timestamp;
//       if (elapsed < SESSION_EXPIRY_MS) {
//         sessionToken = session.token;
//         currentUid = session.uid;
//         sessionLoaded = true;
//         console.log('[TEE Session] Loaded from storage, valid for', Math.round((SESSION_EXPIRY_MS - elapsed) / 60000), 'minutes');
//         return true;
//       } else {
//         console.log('[TEE Session] Stored session expired, clearing');
//         await clearSession();
//       }
//     }
//   } catch (error) {
//     console.log('[TEE Session] Load error:', error);
//   }
//   sessionLoaded = true;
//   return false;
// };

// /**
//  * Save session to memory AND AsyncStorage
//  */
// export const setSession = async (token: string, uid: string): Promise<void> => {
//   sessionToken = token;
//   currentUid = uid;
//   sessionLoaded = true;
  
//   try {
//     const session: StoredSession = {
//       token,
//       uid,
//       timestamp: Date.now(),
//     };
//     await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
//     console.log('[TEE Session] Saved to storage');
//   } catch (error) {
//     console.log('[TEE Session] Save error:', error);
//   }
// };

// /**
//  * Get session token (sync - from memory)
//  */
// export const getSessionToken = (): string | null => {
//   return sessionToken;
// };

// /**
//  * Clear session from memory AND storage
//  */
// export const clearSession = async (): Promise<void> => {
//   sessionToken = null;
//   currentUid = null;
//   try {
//     await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
//     console.log('[TEE Session] Cleared');
//   } catch (error) {
//     console.log('[TEE Session] Clear error:', error);
//   }
// };

// /**
//  * Check if logged in
//  */
// export const isLoggedIn = (): boolean => {
//   return sessionToken !== null;
// };

// /**
//  * Get current UID
//  */
// export const getCurrentUid = (): string | null => currentUid;

// /**
//  * Ensure session is loaded (call before using session)
//  */
// export const ensureSessionLoaded = async (): Promise<void> => {
//   if (!sessionLoaded) {
//     await loadSession();
//   }
// };

// // ════════════════════════════════════════════════════════════════════════════
// // HEALTH & STATUS ENDPOINTS
// // ════════════════════════════════════════════════════════════════════════════

// /**
//  * Health check
//  * GET /health
//  */
// export const healthCheck = async (): Promise<{ ok: boolean }> => {
//   const response = await fetch(`${TEE_API_BASE}/health`);
//   return response.json();
// };

// /**
//  * ROFL Status
//  * GET /v1/rofl/status
//  */
// export const getROFLStatus = async (): Promise<{ mock: boolean; appId: string }> => {
//   const response = await fetch(`${TEE_API_BASE}/v1/rofl/status`);
//   return response.json();
// };

// /**
//  * ROFL Signer Info
//  * GET /v1/rofl/signer
//  */
// export const getROFLSigner = async (): Promise<{
//   ok: boolean;
//   signer: {
//     address: string;
//     balance: string;
//     balanceFormatted: string;
//   };
// }> => {
//   const response = await fetch(`${TEE_API_BASE}/v1/rofl/signer`);
//   return response.json();
// };

// // ════════════════════════════════════════════════════════════════════════════
// // WALLET CREATION
// // ════════════════════════════════════════════════════════════════════════════

// /**
//  * Create new account (Registration)
//  * POST /v1/connect
//  */
// export const createWallet = async (): Promise<CreateWalletResponse> => {
//   console.log('[TEE] Creating new wallet...');
  
//   const response = await fetch(`${TEE_API_BASE}/v1/connect`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({}),
//   });

//   if (!response.ok) {
//     const error = await response.json().catch(() => ({}));
//     throw new Error(error.message || error.error || 'Failed to create wallet');
//   }

//   const data: CreateWalletResponse = await response.json();
//   console.log('[TEE] Wallet created:', data.uid);
//   return data;
// };

// // ════════════════════════════════════════════════════════════════════════════
// // AUTHENTICATION
// // ════════════════════════════════════════════════════════════════════════════

// /**
//  * Login with TOTP code
//  * POST /v1/login
//  * Returns JWT token (expires in 60 minutes)
//  */
// export const login = async (uid: string, totpCode: string): Promise<string> => {
//   console.log('[TEE] Logging in with UID:', uid);
  
//   const response = await fetch(`${TEE_API_BASE}/v1/login`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       uid: uid,
//       totp_code: totpCode,
//     }),
//   });

//   if (!response.ok) {
//     const error = await response.json().catch(() => ({}));
//     const errorMsg = error.error || error.message || 'Login failed';
    
//     if (errorMsg.toLowerCase().includes('invalid')) {
//       throw new Error('Invalid authenticator code. Please try again.');
//     }
//     if (errorMsg.toLowerCase().includes('not found')) {
//       throw new Error('User not found. Please recover your wallet.');
//     }
//     throw new Error(errorMsg);
//   }

//   const data: LoginResponse = await response.json();
  
//   // Store session (persisted to AsyncStorage)
//   await setSession(data.token, uid);
  
//   console.log('[TEE] Login successful, token saved');
//   return data.token;
// };

// /**
//  * Logout - Clear local session
//  */
// export const logout = (): void => {
//   clearSession();
//   console.log('[TEE] Logged out');
// };

// // ════════════════════════════════════════════════════════════════════════════
// // AUTHENTICATED ENDPOINTS (require Bearer token)
// // ════════════════════════════════════════════════════════════════════════════

// /**
//  * Get authorization header
//  */
// const getAuthHeader = (): { Authorization: string } => {
//   const token = getSessionToken();
//   if (!token) {
//     throw new Error('Not logged in. Please authenticate first.');
//   }
//   return { Authorization: `Bearer ${token}` };
// };

// /**
//  * Handle 401 response - clear session
//  */
// const handle401 = async () => {
//   await clearSession();
//   throw new Error('Session expired. Please login again.');
// };

// /**
//  * Get wallet addresses
//  * GET /v1/wallets
//  */
// export const getWallets = async (): Promise<WalletsResponse> => {
//   console.log('[TEE] Fetching wallets...');
  
//   const response = await fetch(`${TEE_API_BASE}/v1/wallets`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       ...getAuthHeader(),
//     },
//   });

//   if (!response.ok) {
//     if (response.status === 401) {
//       await handle401();
//     }
//     const error = await response.json().catch(() => ({}));
//     throw new Error(error.error || 'Failed to fetch wallets');
//   }

//   return response.json();
// };

// const TRADE_CONFIG_STORAGE_KEY = 'tee_trade_config';

// /**
//  * Configure trading settings (SET)
//  * POST /v1/trade/config
//  * Also saves config locally since GET may return 404
//  */
// export const setTradeConfig = async (config: TradeConfig): Promise<TradeConfigResponse> => {
//   console.log('[TEE] Setting trade config:', config);
  
//   const response = await fetch(`${TEE_API_BASE}/v1/trade/config`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       ...getAuthHeader(),
//     },
//     body: JSON.stringify(config),
//   });

//   if (!response.ok) {
//     if (response.status === 401) {
//       await handle401();
//     }
//     const error = await response.json().catch(() => ({}));
//     throw new Error(error.error || 'Failed to set trade config');
//   }

//   const data: TradeConfigResponse = await response.json();
//   console.log('[TEE] Trade config saved:', data.config);
  
//   // Save config locally for later retrieval (since GET returns 404)
//   try {
//     await AsyncStorage.setItem(TRADE_CONFIG_STORAGE_KEY, JSON.stringify(data.config));
//     console.log('[TEE] Trade config cached locally');
//   } catch (e) {
//     console.log('[TEE] Failed to cache config:', e);
//   }
  
//   return data;
// };

// /**
//  * Get current trade config
//  * First tries GET /v1/trade/config, falls back to local cache
//  */
// export const getTradeConfig = async (): Promise<TradeConfigResponse> => {
//   console.log('[TEE] Fetching trade config...');
  
//   // First try the API
//   try {
//     const response = await fetch(`${TEE_API_BASE}/v1/trade/config`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         ...getAuthHeader(),
//       },
//     });

//     if (response.ok) {
//       const data: TradeConfigResponse = await response.json();
//       if (data.config && data.config.uid) {
//         console.log('[TEE] Trade config fetched from API:', data.config);
//         // Update local cache
//         await AsyncStorage.setItem(TRADE_CONFIG_STORAGE_KEY, JSON.stringify(data.config));
//         return data;
//       }
//     }
    
//     if (response.status === 401) {
//       await handle401();
//     }
//   } catch (e) {
//     console.log('[TEE] API fetch failed:', e);
//   }
  
//   // Fallback: Try local cache
//   try {
//     const cached = await AsyncStorage.getItem(TRADE_CONFIG_STORAGE_KEY);
//     if (cached) {
//       const config = JSON.parse(cached);
//       console.log('[TEE] Trade config from local cache:', config);
//       return { ok: true, config };
//     }
//   } catch (e) {
//     console.log('[TEE] Cache read failed:', e);
//   }
  
//   // Final fallback: defaults
//   console.log('[TEE] No config found, returning defaults');
//   return {
//     ok: true,
//     config: {
//       uid: '',
//       tradingEnabled: false,
//       maxTradeAmountUsdc: 100,
//       allowedAssets: ['SOL', 'ETH'],
//     },
//   };
// };

// /**
//  * Get trade history
//  * GET /v1/trade/history
//  */
// export const getTradeHistory = async (): Promise<TradeHistoryResponse> => {
//   console.log('[TEE] Fetching trade history...');
  
//   const response = await fetch(`${TEE_API_BASE}/v1/trade/history`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       ...getAuthHeader(),
//     },
//   });

//   if (!response.ok) {
//     if (response.status === 401) {
//       await handle401();
//     }
//     const error = await response.json().catch(() => ({}));
//     throw new Error(error.error || 'Failed to fetch trade history');
//   }

//   const data: TradeHistoryResponse = await response.json();
//   console.log('[TEE] Got', data.history.length, 'trades');
//   return data;
// };

// // ════════════════════════════════════════════════════════════════════════════
// // RECOVERY ENDPOINTS
// // ════════════════════════════════════════════════════════════════════════════

// /**
//  * Decrypt backup file (to see contents)
//  * POST /v1/recovery/decrypt
//  */
// export const decryptBackup = async (backupFile: TEEBackupFile): Promise<DecryptBackupResponse> => {
//   console.log('[TEE] Decrypting backup...');
  
//   const response = await fetch(`${TEE_API_BASE}/v1/recovery/decrypt`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       backup_file: backupFile,
//     }),
//   });

//   if (!response.ok) {
//     const error = await response.json().catch(() => ({}));
//     throw new Error(error.error || 'Failed to decrypt backup');
//   }

//   return response.json();
// };

// /**
//  * Recover account - Rotate credentials
//  * POST /v1/recovery/rotate
//  * Use when user lost phone/authenticator but has backup file
//  * Returns NEW totp and NEW backup_file (old ones become invalid)
//  */
// export const recoverAndRotate = async (backupFile: TEEBackupFile): Promise<RecoveryRotateResponse> => {
//   console.log('[TEE] Starting recovery/rotate for UID:', backupFile.uid);
  
//   const response = await fetch(`${TEE_API_BASE}/v1/recovery/rotate`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       backup_file: backupFile,
//     }),
//   });

//   if (!response.ok) {
//     const error = await response.json().catch(() => ({}));
//     const errorMsg = error.error || error.message || 'Recovery failed';
    
//     if (errorMsg.toLowerCase().includes('not found')) {
//       throw new Error('User not found. Backup file may be invalid.');
//     }
//     throw new Error(errorMsg);
//   }

//   const data: RecoveryRotateResponse = await response.json();
//   console.log('[TEE] Recovery successful - new credentials generated');
//   return data;
// };

// // ════════════════════════════════════════════════════════════════════════════
// // WITHDRAW / SEND
// // ════════════════════════════════════════════════════════════════════════════

// export interface WithdrawRequest {
//   chain: 'ethereum' | 'solana';
//   token: 'native' | 'usdc';
//   toAddress: string;
//   amount: string;
// }

// export interface WithdrawResponse {
//   ok: boolean;
//   txHash?: string;
//   error?: string;
// }

// /**
//  * Withdraw/Send tokens from TEE wallet
//  * Requires authentication (session token)
//  */
// export const withdraw = async (request: WithdrawRequest): Promise<WithdrawResponse> => {
//   const token = getSessionToken();
  
//   if (!token) {
//     return { ok: false, error: 'Not authenticated. Please login first.' };
//   }

//   try {
//     console.log('[TEE] Withdraw request:', request);
    
//     const response = await fetch(`${TEE_API_BASE}/v1/wallets/withdraw`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//       body: JSON.stringify(request),
//     });

//     const data = await response.json();
//     console.log('[TEE] Withdraw response:', data);

//     if (!response.ok) {
//       if (response.status === 401) {
//         await clearSession();
//       }
//       return { 
//         ok: false, 
//         error: data.error || data.message || `HTTP ${response.status}` 
//       };
//     }

//     return {
//       ok: data.ok !== false,
//       txHash: data.txHash || data.tx_hash || data.hash,
//       error: data.error,
//     };
//   } catch (error: any) {
//     console.error('[TEE] Withdraw error:', error);
//     return { ok: false, error: error.message || 'Network error' };
//   }
// };

// /**
//  * Send ETH on Ethereum mainnet
//  */
// export const sendETH = async (toAddress: string, amount: string): Promise<WithdrawResponse> => {
//   return withdraw({
//     chain: 'ethereum',
//     token: 'native',
//     toAddress,
//     amount,
//   });
// };

// /**
//  * Send USDC on Ethereum mainnet
//  */
// export const sendUSDC_ETH = async (toAddress: string, amount: string): Promise<WithdrawResponse> => {
//   return withdraw({
//     chain: 'ethereum',
//     token: 'usdc',
//     toAddress,
//     amount,
//   });
// };

// /**
//  * Send SOL on Solana
//  */
// export const sendSOL = async (toAddress: string, amount: string): Promise<WithdrawResponse> => {
//   return withdraw({
//     chain: 'solana',
//     token: 'native',
//     toAddress,
//     amount,
//   });
// };

// /**
//  * Send USDC on Solana
//  */
// export const sendUSDC_SOL = async (toAddress: string, amount: string): Promise<WithdrawResponse> => {
//   return withdraw({
//     chain: 'solana',
//     token: 'usdc',
//     toAddress,
//     amount,
//   });
// };

// // ════════════════════════════════════════════════════════════════════════════
// // BALANCE FETCHING (Public RPCs - no auth needed)
// // ════════════════════════════════════════════════════════════════════════════

// const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';

// const ETH_RPCS = [
//   'https://ethereum-rpc.publicnode.com',
//   'https://rpc.ankr.com/eth',
//   'https://cloudflare-eth.com',
// ];

// /**
//  * Make RPC call with fallback to multiple endpoints
//  */
// const ethRpcCall = async (body: object): Promise<any> => {
//   for (const rpc of ETH_RPCS) {
//     try {
//       const response = await fetch(rpc, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body),
//       });
      
//       const data = await response.json();
      
//       if (!data.error) {
//         return data;
//       }
//       console.log(`[RPC] ${rpc} returned error, trying next...`);
//     } catch (err) {
//       console.log(`[RPC] ${rpc} failed, trying next...`);
//     }
//   }
//   return { error: 'All RPCs failed' };
// };

// /**
//  * Get SOL balance for any Solana address
//  */
// export const getSolanaBalance = async (address: string): Promise<{
//   sol: number;
//   lamports: number;
// }> => {
//   try {
//     const response = await fetch(SOLANA_RPC, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         jsonrpc: '2.0',
//         id: 1,
//         method: 'getBalance',
//         params: [address],
//       }),
//     });

//     const data = await response.json();
    
//     if (data.error) {
//       console.log('[Balance] Solana RPC error:', data.error);
//       return { sol: 0, lamports: 0 };
//     }

//     const lamports = data.result?.value || 0;
//     const sol = lamports / 1e9;
    
//     console.log('[Balance] SOL:', sol);
//     return { sol, lamports };
//   } catch (error) {
//     console.log('[Balance] Solana fetch error:', error);
//     return { sol: 0, lamports: 0 };
//   }
// };

// /**
//  * Get ETH balance for any EVM address (Ethereum mainnet)
//  */
// export const getEvmBalance = async (address: string): Promise<{
//   eth: number;
//   wei: string;
// }> => {
//   try {
//     const data = await ethRpcCall({
//       jsonrpc: '2.0',
//       id: 1,
//       method: 'eth_getBalance',
//       params: [address, 'latest'],
//     });
    
//     if (data.error) {
//       console.log('[Balance] ETH RPC error:', data.error);
//       return { eth: 0, wei: '0' };
//     }

//     const wei = data.result || '0x0';
//     const eth = parseInt(wei, 16) / 1e18;
    
//     console.log('[Balance] ETH:', eth);
//     return { eth, wei };
//   } catch (error) {
//     console.log('[Balance] ETH fetch error:', error);
//     return { eth: 0, wei: '0' };
//   }
// };

// /**
//  * Get USDC balance on Solana
//  * USDC Mint: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
//  */
// export const getSolanaUsdcBalance = async (address: string): Promise<number> => {
//   const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
  
//   try {
//     const response = await fetch(SOLANA_RPC, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         jsonrpc: '2.0',
//         id: 1,
//         method: 'getTokenAccountsByOwner',
//         params: [
//           address,
//           { mint: USDC_MINT },
//           { encoding: 'jsonParsed' },
//         ],
//       }),
//     });

//     const data = await response.json();
    
//     if (data.error || !data.result?.value?.length) {
//       return 0;
//     }

//     const tokenAccount = data.result.value[0];
//     const amount = tokenAccount?.account?.data?.parsed?.info?.tokenAmount?.uiAmount || 0;
    
//     console.log('[Balance] USDC (SOL):', amount);
//     return amount;
//   } catch (error) {
//     console.log('[Balance] USDC Solana fetch error:', error);
//     return 0;
//   }
// };

// /**
//  * Get USDC balance on Ethereum mainnet
//  * USDC Contract: 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
//  */
// export const getEvmUsdcBalance = async (address: string): Promise<number> => {
//   const USDC_CONTRACT = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
  
//   try {
//     const callData = '0x70a08231000000000000000000000000' + address.slice(2).toLowerCase();
    
//     const data = await ethRpcCall({
//       jsonrpc: '2.0',
//       id: 1,
//       method: 'eth_call',
//       params: [
//         { to: USDC_CONTRACT, data: callData },
//         'latest',
//       ],
//     });
    
//     if (data.error) {
//       return 0;
//     }

//     const balance = parseInt(data.result || '0x0', 16) / 1e6;
    
//     console.log('[Balance] USDC (ETH):', balance);
//     return balance;
//   } catch (error) {
//     console.log('[Balance] USDC ETH fetch error:', error);
//     return 0;
//   }
// };

// /**
//  * Get all balances for a TEE wallet
//  */
// export const getAllBalances = async (
//   solanaAddress: string | null,
//   evmAddress: string | null
// ): Promise<{
//   solana: { sol: number; usdc: number };
//   evm: { eth: number; usdc: number };
// }> => {
//   const results = {
//     solana: { sol: 0, usdc: 0 },
//     evm: { eth: 0, usdc: 0 },
//   };

//   const promises: Promise<void>[] = [];

//   if (solanaAddress) {
//     promises.push(
//       getSolanaBalance(solanaAddress).then(r => { results.solana.sol = r.sol; }),
//       getSolanaUsdcBalance(solanaAddress).then(r => { results.solana.usdc = r; })
//     );
//   }

//   if (evmAddress) {
//     promises.push(
//       getEvmBalance(evmAddress).then(r => { results.evm.eth = r.eth; }),
//       getEvmUsdcBalance(evmAddress).then(r => { results.evm.usdc = r; })
//     );
//   }

//   await Promise.allSettled(promises);
  
//   console.log('[Balance] All balances:', results);
//   return results;
// };

// // ════════════════════════════════════════════════════════════════════════════
// // HELPER FUNCTIONS
// // ════════════════════════════════════════════════════════════════════════════

// /**
//  * Parse TOTP URI to extract secret
//  */
// export const parseTOTPUri = (uri: string): {
//   secret: string;
//   issuer: string;
//   account: string;
// } => {
//   const getParam = (param: string, defaultValue: string): string => {
//     const match = uri.match(new RegExp(`[?&]${param}=([^&]+)`));
//     return match ? decodeURIComponent(match[1]) : defaultValue;
//   };

//   const pathMatch = uri.match(/otpauth:\/\/totp\/([^?]+)/);
//   const pathPart = pathMatch ? decodeURIComponent(pathMatch[1]) : '';
//   const [issuerFromPath, account] = pathPart.includes(':') 
//     ? pathPart.split(':') 
//     : ['PawPad', pathPart];

//   return {
//     secret: getParam('secret', ''),
//     issuer: getParam('issuer', issuerFromPath || 'PawPad'),
//     account: account || 'wallet',
//   };
// };

// /**
//  * Format wallet address for display
//  */
// export const formatAddress = (address: string, chars: number = 6): string => {
//   if (!address || address.length < chars * 2) return address;
//   return `${address.slice(0, chars)}...${address.slice(-chars)}`;
// };

// /**
//  * Format trade amount
//  */
// export const formatAmount = (amount: string | number, decimals: number = 2): string => {
//   const num = typeof amount === 'string' ? parseFloat(amount) : amount;
//   return num.toFixed(decimals);
// };

// // ════════════════════════════════════════════════════════════════════════════
// // DEFAULT EXPORT
// // ════════════════════════════════════════════════════════════════════════════

// export default {
//   // Health & Status
//   healthCheck,
//   getROFLStatus,
//   getROFLSigner,
  
//   // Wallet
//   createWallet,
//   getWallets,
  
//   // Auth & Session
//   login,
//   logout,
//   isLoggedIn,
//   getSessionToken,
//   getCurrentUid,
//   loadSession,
//   ensureSessionLoaded,
//   clearSession,
//   setSession,
  
//   // Trading
//   setTradeConfig,
//   getTradeConfig,
//   getTradeHistory,
  
//   // Recovery
//   decryptBackup,
//   recoverAndRotate,
  
//   // Balances (Public RPCs)
//   getSolanaBalance,
//   getEvmBalance,
//   getSolanaUsdcBalance,
//   getEvmUsdcBalance,
//   getAllBalances,
  
//   // Helpers
//   parseTOTPUri,
//   formatAddress,
//   formatAmount,
// };

import AsyncStorage from '@react-native-async-storage/async-storage';

const TEE_API_BASE = 'https://p8080.m125.opf-mainnet-rofl-35.rofl.app';

// ════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════

export interface TEEBackupFile {
  v: number;
  uid: string;
  nonce_b64: string;
  ct_b64: string;
  tag_b64: string;
}

export interface TEEWallet {
  chain: string;
  address: string;
}

export interface TEEWallets {
  evm: TEEWallet;
  solana: { address: string };
}

export interface TOTPConfig {
  otpauth_uri: string;
  secret?: string;
}

// /v1/connect response
export interface CreateWalletResponse {
  uid: string;
  wallets: TEEWallets;
  totp: TOTPConfig;
  backup_file: TEEBackupFile;
  backup_hash: string;
  sapphire: {
    ok: boolean;
    tx: { hash?: string; blockNumber?: number; status?: number };
  };
}

// /v1/login response
export interface LoginResponse {
  token: string;
}

// /v1/wallets response
export interface WalletsResponse {
  uid: string;
  wallets: TEEWallets;
}

// /v1/trade/config
export interface TradeConfig {
  tradingEnabled: boolean;
  maxTradeAmountUsdc: number;
  allowedAssets: string[];
}

export interface TradeConfigResponse {
  ok: boolean;
  config: TradeConfig & { uid: string };
}

// /v1/trade/history
export interface TradeHistoryItem {
  uid: string;
  asset: string;
  signal: 'BUY' | 'SELL';
  signalPrice: number;
  chain: string;
  txHash: string;
  amountIn: string;
  tokenIn: string;
  status: 'success' | 'pending' | 'failed';
  timestamp: string;
}

export interface TradeHistoryResponse {
  ok: boolean;
  history: TradeHistoryItem[];
}

// /v1/recovery/decrypt response
export interface DecryptBackupResponse {
  ok: boolean;
  payload: {
    v: number;
    uid: string;
    totpSecret: string;
    created_at: number;
  };
}

// /v1/recovery/rotate response
export interface RecoveryRotateResponse {
  ok: boolean;
  message: string;
  uid: string;
  new_totp: {
    otpauth_uri: string;
    secret: string;
  };
  new_backup_file: TEEBackupFile;
}

// ════════════════════════════════════════════════════════════════════════════
// SESSION MANAGEMENT - PERSISTED TO ASYNCSTORAGE
// ════════════════════════════════════════════════════════════════════════════

const SESSION_STORAGE_KEY = 'tee_session';
const SESSION_EXPIRY_MS = 55 * 60 * 1000; // 55 minutes (token expires in 60)

interface StoredSession {
  token: string;
  uid: string;
  timestamp: number;
}

// In-memory cache
let sessionToken: string | null = null;
let currentUid: string | null = null;
let sessionLoaded = false;

/**
 * Load session from AsyncStorage (call on app start)
 */
export const loadSession = async (): Promise<boolean> => {
  try {
    const stored = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) {
      const session: StoredSession = JSON.parse(stored);
      
      // Check if session is still valid (not expired)
      const elapsed = Date.now() - session.timestamp;
      if (elapsed < SESSION_EXPIRY_MS) {
        sessionToken = session.token;
        currentUid = session.uid;
        sessionLoaded = true;
        console.log('[TEE Session] Loaded from storage, valid for', Math.round((SESSION_EXPIRY_MS - elapsed) / 60000), 'minutes');
        return true;
      } else {
        console.log('[TEE Session] Stored session expired, clearing');
        await clearSession();
      }
    }
  } catch (error) {
    console.log('[TEE Session] Load error:', error);
  }
  sessionLoaded = true;
  return false;
};

/**
 * Save session to memory AND AsyncStorage
 */
export const setSession = async (token: string, uid: string): Promise<void> => {
  sessionToken = token;
  currentUid = uid;
  sessionLoaded = true;
  
  try {
    const session: StoredSession = {
      token,
      uid,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    console.log('[TEE Session] Saved to storage');
  } catch (error) {
    console.log('[TEE Session] Save error:', error);
  }
};

/**
 * Get session token (sync - from memory)
 */
export const getSessionToken = (): string | null => {
  return sessionToken;
};

/**
 * Clear session from memory AND storage
 */
export const clearSession = async (): Promise<void> => {
  sessionToken = null;
  currentUid = null;
  try {
    await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
    console.log('[TEE Session] Cleared');
  } catch (error) {
    console.log('[TEE Session] Clear error:', error);
  }
};

/**
 * Check if logged in
 */
export const isLoggedIn = (): boolean => {
  return sessionToken !== null;
};

/**
 * Get current UID
 */
export const getCurrentUid = (): string | null => currentUid;

/**
 * Ensure session is loaded (call before using session)
 */
export const ensureSessionLoaded = async (): Promise<void> => {
  if (!sessionLoaded) {
    await loadSession();
  }
};

// ════════════════════════════════════════════════════════════════════════════
// HEALTH & STATUS ENDPOINTS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Health check
 * GET /health
 */
export const healthCheck = async (): Promise<{ ok: boolean }> => {
  const response = await fetch(`${TEE_API_BASE}/health`);
  return response.json();
};

/**
 * ROFL Status
 * GET /v1/rofl/status
 */
export const getROFLStatus = async (): Promise<{ mock: boolean; appId: string }> => {
  const response = await fetch(`${TEE_API_BASE}/v1/rofl/status`);
  return response.json();
};

/**
 * ROFL Signer Info
 * GET /v1/rofl/signer
 */
export const getROFLSigner = async (): Promise<{
  ok: boolean;
  signer: {
    address: string;
    balance: string;
    balanceFormatted: string;
  };
}> => {
  const response = await fetch(`${TEE_API_BASE}/v1/rofl/signer`);
  return response.json();
};

// ════════════════════════════════════════════════════════════════════════════
// WALLET CREATION
// ════════════════════════════════════════════════════════════════════════════

/**
 * Create new account (Registration)
 * POST /v1/connect
 */
export const createWallet = async (): Promise<CreateWalletResponse> => {
  console.log('[TEE] Creating new wallet...');
  
  const response = await fetch(`${TEE_API_BASE}/v1/connect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || error.error || 'Failed to create wallet');
  }

  const data: CreateWalletResponse = await response.json();
  console.log('[TEE] Wallet created:', data.uid);
  return data;
};

// ════════════════════════════════════════════════════════════════════════════
// AUTHENTICATION
// ════════════════════════════════════════════════════════════════════════════

/**
 * Login with TOTP code
 * POST /v1/login
 * Returns JWT token (expires in 60 minutes)
 */
export const login = async (uid: string, totpCode: string): Promise<string> => {
  console.log('[TEE] Logging in with UID:', uid);
  
  const response = await fetch(`${TEE_API_BASE}/v1/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uid: uid,
      totp_code: totpCode,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const errorMsg = error.error || error.message || 'Login failed';
    
    if (errorMsg.toLowerCase().includes('invalid')) {
      throw new Error('Invalid authenticator code. Please try again.');
    }
    if (errorMsg.toLowerCase().includes('not found')) {
      throw new Error('User not found. Please recover your wallet.');
    }
    throw new Error(errorMsg);
  }

  const data: LoginResponse = await response.json();
  
  // Store session (persisted to AsyncStorage)
  await setSession(data.token, uid);
  
  console.log('[TEE] Login successful, token saved');
  return data.token;
};

/**
 * Logout - Clear local session
 */
export const logout = (): void => {
  clearSession();
  console.log('[TEE] Logged out');
};

// ════════════════════════════════════════════════════════════════════════════
// AUTHENTICATED ENDPOINTS (require Bearer token)
// ════════════════════════════════════════════════════════════════════════════

/**
 * Get authorization header
 */
const getAuthHeader = (): { Authorization: string } => {
  const token = getSessionToken();
  if (!token) {
    throw new Error('Not logged in. Please authenticate first.');
  }
  return { Authorization: `Bearer ${token}` };
};

/**
 * Handle 401 response - clear session
 */
const handle401 = async () => {
  await clearSession();
  throw new Error('Session expired. Please login again.');
};

/**
 * Get wallet addresses
 * GET /v1/wallets
 */
export const getWallets = async (): Promise<WalletsResponse> => {
  console.log('[TEE] Fetching wallets...');
  
  const response = await fetch(`${TEE_API_BASE}/v1/wallets`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      await handle401();
    }
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to fetch wallets');
  }

  return response.json();
};

const TRADE_CONFIG_STORAGE_KEY = 'tee_trade_config';

/**
 * Configure trading settings (SET)
 * POST /v1/trade/config
 * Also saves config locally since GET may return 404
 */
export const setTradeConfig = async (config: TradeConfig): Promise<TradeConfigResponse> => {
  console.log('[TEE] Setting trade config:', config);
  
  const response = await fetch(`${TEE_API_BASE}/v1/trade/config`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    if (response.status === 401) {
      await handle401();
    }
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to set trade config');
  }

  const data: TradeConfigResponse = await response.json();
  console.log('[TEE] Trade config saved:', data.config);
  
  // Save config locally for later retrieval (since GET returns 404)
  try {
    await AsyncStorage.setItem(TRADE_CONFIG_STORAGE_KEY, JSON.stringify(data.config));
    console.log('[TEE] Trade config cached locally');
  } catch (e) {
    console.log('[TEE] Failed to cache config:', e);
  }
  
  return data;
};

/**
 * Get current trade config
 * First tries GET /v1/trade/config, falls back to local cache
 */
export const getTradeConfig = async (): Promise<TradeConfigResponse> => {
  console.log('[TEE] Fetching trade config...');
  
  // First try the API
  try {
    const response = await fetch(`${TEE_API_BASE}/v1/trade/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });

    if (response.ok) {
      const data: TradeConfigResponse = await response.json();
      if (data.config && data.config.uid) {
        console.log('[TEE] Trade config fetched from API:', data.config);
        // Update local cache
        await AsyncStorage.setItem(TRADE_CONFIG_STORAGE_KEY, JSON.stringify(data.config));
        return data;
      }
    }
    
    if (response.status === 401) {
      await handle401();
    }
  } catch (e) {
    console.log('[TEE] API fetch failed:', e);
  }
  
  // Fallback: Try local cache
  try {
    const cached = await AsyncStorage.getItem(TRADE_CONFIG_STORAGE_KEY);
    if (cached) {
      const config = JSON.parse(cached);
      console.log('[TEE] Trade config from local cache:', config);
      return { ok: true, config };
    }
  } catch (e) {
    console.log('[TEE] Cache read failed:', e);
  }
  
  // Final fallback: defaults
  console.log('[TEE] No config found, returning defaults');
  return {
    ok: true,
    config: {
      uid: '',
      tradingEnabled: false,
      maxTradeAmountUsdc: 100,
      allowedAssets: ['SOL', 'ETH'],
    },
  };
};

/**
 * Get trade history
 * GET /v1/trade/history
 */
export const getTradeHistory = async (): Promise<TradeHistoryResponse> => {
  console.log('[TEE] Fetching trade history...');
  
  const response = await fetch(`${TEE_API_BASE}/v1/trade/history`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      await handle401();
    }
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to fetch trade history');
  }

  const data: TradeHistoryResponse = await response.json();
  console.log('[TEE] Got', data.history.length, 'trades');
  return data;
};

// ════════════════════════════════════════════════════════════════════════════
// RECOVERY ENDPOINTS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Decrypt backup file (to see contents)
 * POST /v1/recovery/decrypt
 */
export const decryptBackup = async (backupFile: TEEBackupFile): Promise<DecryptBackupResponse> => {
  console.log('[TEE] Decrypting backup...');
  
  const response = await fetch(`${TEE_API_BASE}/v1/recovery/decrypt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      backup_file: backupFile,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to decrypt backup');
  }

  return response.json();
};

/**
 * Recover account - Rotate credentials
 * POST /v1/recovery/rotate
 * Use when user lost phone/authenticator but has backup file
 * Returns NEW totp and NEW backup_file (old ones become invalid)
 */
export const recoverAndRotate = async (backupFile: TEEBackupFile): Promise<RecoveryRotateResponse> => {
  console.log('[TEE] Starting recovery/rotate for UID:', backupFile.uid);
  console.log('[TEE] Backup file being sent:', JSON.stringify(backupFile, null, 2));
  
  const response = await fetch(`${TEE_API_BASE}/v1/recovery/rotate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      backup_file: backupFile,
    }),
  });

  console.log('[TEE] Recovery response status:', response.status);
  console.log('[TEE] Recovery response ok:', response.ok);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.log('[TEE] Recovery error response:', error);
    const errorMsg = error.error || error.message || 'Recovery failed';
    
    if (errorMsg.toLowerCase().includes('not found')) {
      throw new Error('User not found. Backup file may be invalid.');
    }
    throw new Error(errorMsg);
  }

  const data: RecoveryRotateResponse = await response.json();
  console.log('[TEE] Recovery successful - full response:');
  console.log('[TEE] data.uid:', data.uid);
  console.log('[TEE] data.new_totp:', data.new_totp);
  console.log('[TEE] data.new_backup_file:', data.new_backup_file);
  console.log('[TEE] Full data:', JSON.stringify(data, null, 2));
  return data;
};

// ════════════════════════════════════════════════════════════════════════════
// WITHDRAW / SEND
// ════════════════════════════════════════════════════════════════════════════

export interface WithdrawRequest {
  chain: 'ethereum' | 'solana';
  token: 'native' | 'usdc';
  toAddress: string;
  amount: string;
}

export interface WithdrawResponse {
  ok: boolean;
  txHash?: string;
  error?: string;
}

/**
 * Withdraw/Send tokens from TEE wallet
 * Requires authentication (session token)
 */
export const withdraw = async (request: WithdrawRequest): Promise<WithdrawResponse> => {
  const token = getSessionToken();
  
  if (!token) {
    return { ok: false, error: 'Not authenticated. Please login first.' };
  }

  try {
    console.log('[TEE] Withdraw request:', request);
    
    const response = await fetch(`${TEE_API_BASE}/v1/wallets/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();
    console.log('[TEE] Withdraw response:', data);

    if (!response.ok) {
      if (response.status === 401) {
        await clearSession();
      }
      return { 
        ok: false, 
        error: data.error || data.message || `HTTP ${response.status}` 
      };
    }

    return {
      ok: data.ok !== false,
      txHash: data.txHash || data.tx_hash || data.hash,
      error: data.error,
    };
  } catch (error: any) {
    console.error('[TEE] Withdraw error:', error);
    return { ok: false, error: error.message || 'Network error' };
  }
};

/**
 * Send ETH on Ethereum mainnet
 */
export const sendETH = async (toAddress: string, amount: string): Promise<WithdrawResponse> => {
  return withdraw({
    chain: 'ethereum',
    token: 'native',
    toAddress,
    amount,
  });
};

/**
 * Send USDC on Ethereum mainnet
 */
export const sendUSDC_ETH = async (toAddress: string, amount: string): Promise<WithdrawResponse> => {
  return withdraw({
    chain: 'ethereum',
    token: 'usdc',
    toAddress,
    amount,
  });
};

/**
 * Send SOL on Solana
 */
export const sendSOL = async (toAddress: string, amount: string): Promise<WithdrawResponse> => {
  return withdraw({
    chain: 'solana',
    token: 'native',
    toAddress,
    amount,
  });
};

/**
 * Send USDC on Solana
 */
export const sendUSDC_SOL = async (toAddress: string, amount: string): Promise<WithdrawResponse> => {
  return withdraw({
    chain: 'solana',
    token: 'usdc',
    toAddress,
    amount,
  });
};

// ════════════════════════════════════════════════════════════════════════════
// BALANCE FETCHING (Public RPCs - no auth needed)
// ════════════════════════════════════════════════════════════════════════════

const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';

const ETH_RPCS = [
  'https://ethereum-rpc.publicnode.com',
  'https://rpc.ankr.com/eth',
  'https://cloudflare-eth.com',
];

/**
 * Make RPC call with fallback to multiple endpoints
 */
const ethRpcCall = async (body: object): Promise<any> => {
  for (const rpc of ETH_RPCS) {
    try {
      const response = await fetch(rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      const data = await response.json();
      
      if (!data.error) {
        return data;
      }
      console.log(`[RPC] ${rpc} returned error, trying next...`);
    } catch (err) {
      console.log(`[RPC] ${rpc} failed, trying next...`);
    }
  }
  return { error: 'All RPCs failed' };
};

/**
 * Get SOL balance for any Solana address
 */
export const getSolanaBalance = async (address: string): Promise<{
  sol: number;
  lamports: number;
}> => {
  try {
    const response = await fetch(SOLANA_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [address],
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.log('[Balance] Solana RPC error:', data.error);
      return { sol: 0, lamports: 0 };
    }

    const lamports = data.result?.value || 0;
    const sol = lamports / 1e9;
    
    console.log('[Balance] SOL:', sol);
    return { sol, lamports };
  } catch (error) {
    console.log('[Balance] Solana fetch error:', error);
    return { sol: 0, lamports: 0 };
  }
};

/**
 * Get ETH balance for any EVM address (Ethereum mainnet)
 */
export const getEvmBalance = async (address: string): Promise<{
  eth: number;
  wei: string;
}> => {
  try {
    const data = await ethRpcCall({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getBalance',
      params: [address, 'latest'],
    });
    
    if (data.error) {
      console.log('[Balance] ETH RPC error:', data.error);
      return { eth: 0, wei: '0' };
    }

    const wei = data.result || '0x0';
    const eth = parseInt(wei, 16) / 1e18;
    
    console.log('[Balance] ETH:', eth);
    return { eth, wei };
  } catch (error) {
    console.log('[Balance] ETH fetch error:', error);
    return { eth: 0, wei: '0' };
  }
};

/**
 * Get USDC balance on Solana
 * USDC Mint: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
 */
export const getSolanaUsdcBalance = async (address: string): Promise<number> => {
  const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
  
  try {
    const response = await fetch(SOLANA_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenAccountsByOwner',
        params: [
          address,
          { mint: USDC_MINT },
          { encoding: 'jsonParsed' },
        ],
      }),
    });

    const data = await response.json();
    
    if (data.error || !data.result?.value?.length) {
      return 0;
    }

    const tokenAccount = data.result.value[0];
    const amount = tokenAccount?.account?.data?.parsed?.info?.tokenAmount?.uiAmount || 0;
    
    console.log('[Balance] USDC (SOL):', amount);
    return amount;
  } catch (error) {
    console.log('[Balance] USDC Solana fetch error:', error);
    return 0;
  }
};

/**
 * Get USDC balance on Ethereum mainnet
 * USDC Contract: 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
 */
export const getEvmUsdcBalance = async (address: string): Promise<number> => {
  const USDC_CONTRACT = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
  
  try {
    const callData = '0x70a08231000000000000000000000000' + address.slice(2).toLowerCase();
    
    const data = await ethRpcCall({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_call',
      params: [
        { to: USDC_CONTRACT, data: callData },
        'latest',
      ],
    });
    
    if (data.error) {
      return 0;
    }

    const balance = parseInt(data.result || '0x0', 16) / 1e6;
    
    console.log('[Balance] USDC (ETH):', balance);
    return balance;
  } catch (error) {
    console.log('[Balance] USDC ETH fetch error:', error);
    return 0;
  }
};

/**
 * Get all balances for a TEE wallet
 */
export const getAllBalances = async (
  solanaAddress: string | null,
  evmAddress: string | null
): Promise<{
  solana: { sol: number; usdc: number };
  evm: { eth: number; usdc: number };
}> => {
  const results = {
    solana: { sol: 0, usdc: 0 },
    evm: { eth: 0, usdc: 0 },
  };

  const promises: Promise<void>[] = [];

  if (solanaAddress) {
    promises.push(
      getSolanaBalance(solanaAddress).then(r => { results.solana.sol = r.sol; }),
      getSolanaUsdcBalance(solanaAddress).then(r => { results.solana.usdc = r; })
    );
  }

  if (evmAddress) {
    promises.push(
      getEvmBalance(evmAddress).then(r => { results.evm.eth = r.eth; }),
      getEvmUsdcBalance(evmAddress).then(r => { results.evm.usdc = r; })
    );
  }

  await Promise.allSettled(promises);
  
  console.log('[Balance] All balances:', results);
  return results;
};

// ════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Parse TOTP URI to extract secret
 */
export const parseTOTPUri = (uri: string): {
  secret: string;
  issuer: string;
  account: string;
} => {
  const getParam = (param: string, defaultValue: string): string => {
    const match = uri.match(new RegExp(`[?&]${param}=([^&]+)`));
    return match ? decodeURIComponent(match[1]) : defaultValue;
  };

  const pathMatch = uri.match(/otpauth:\/\/totp\/([^?]+)/);
  const pathPart = pathMatch ? decodeURIComponent(pathMatch[1]) : '';
  const [issuerFromPath, account] = pathPart.includes(':') 
    ? pathPart.split(':') 
    : ['PawPad', pathPart];

  return {
    secret: getParam('secret', ''),
    issuer: getParam('issuer', issuerFromPath || 'PawPad'),
    account: account || 'wallet',
  };
};

/**
 * Format wallet address for display
 */
export const formatAddress = (address: string, chars: number = 6): string => {
  if (!address || address.length < chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

/**
 * Format trade amount
 */
export const formatAmount = (amount: string | number, decimals: number = 2): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return num.toFixed(decimals);
};

// ════════════════════════════════════════════════════════════════════════════
// DEFAULT EXPORT
// ════════════════════════════════════════════════════════════════════════════

export default {
  // Health & Status
  healthCheck,
  getROFLStatus,
  getROFLSigner,
  
  // Wallet
  createWallet,
  getWallets,
  
  // Auth & Session
  login,
  logout,
  isLoggedIn,
  getSessionToken,
  getCurrentUid,
  loadSession,
  ensureSessionLoaded,
  clearSession,
  setSession,
  
  // Trading
  setTradeConfig,
  getTradeConfig,
  getTradeHistory,
  
  // Recovery
  decryptBackup,
  recoverAndRotate,
  
  // Balances (Public RPCs)
  getSolanaBalance,
  getEvmBalance,
  getSolanaUsdcBalance,
  getEvmUsdcBalance,
  getAllBalances,
  
  // Helpers
  parseTOTPUri,
  formatAddress,
  formatAmount,
};