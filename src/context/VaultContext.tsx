// /**
//  * ============================================
//  * PAWPAD VAULT CONTEXT
//  * ============================================
//  * 
//  * Provides vault state management across the app.
//  * Handles loading, caching, and syncing vault data.
//  */

// import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
// import vaultStorage, { Vault, toVault } from '../services/VaultStorage';
// import api from '../services/api';

// // ============================================
// // TYPES
// // ============================================

// interface VaultContextType {
//   // State
//   vaults: Vault[];
//   activeVault: Vault | null;
//   solVault: Vault | null;
//   zecVault: Vault | null;
//   isLoading: boolean;
//   error: string | null;
  
//   // Actions
//   loadVaults: () => Promise<void>;
//   addVault: (vault: Vault) => Promise<void>;
//   removeVault: (vaultId: string) => Promise<void>;
//   setActiveVault: (vaultId: string) => Promise<void>;
//   refreshBalance: (vaultId?: string) => Promise<void>;
//   refreshAllBalances: () => Promise<void>;
//   getVaultForFunding: (chain?: 'SOL' | 'ZEC') => Vault | null;
//   clearError: () => void;
// }

// // ============================================
// // CONTEXT
// // ============================================

// const VaultContext = createContext<VaultContextType | undefined>(undefined);

// // ============================================
// // PROVIDER
// // ============================================

// interface VaultProviderProps {
//   children: ReactNode;
// }

// export const VaultProvider: React.FC<VaultProviderProps> = ({ children }) => {
//   const [vaults, setVaults] = useState<Vault[]>([]);
//   const [activeVault, setActiveVaultState] = useState<Vault | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // ============================================
//   // COMPUTED VALUES
//   // ============================================
  
//   // Get SOL vault (first one found)
//   const solVault = vaults.find(v => v.chain === 'SOL') || null;
  
//   // Get ZEC vault (first one found)
//   const zecVault = vaults.find(v => v.chain === 'ZEC') || null;

//   // ============================================
//   // LOAD VAULTS ON MOUNT
//   // ============================================

//   useEffect(() => {
//     loadVaults();
//   }, []);

//   // ============================================
//   // ACTIONS
//   // ============================================

//   const loadVaults = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       const data = await vaultStorage.loadVaults();
//       setVaults(data.vaults);

//       // Set active vault
//       if (data.activeVaultId) {
//         const active = data.vaults.find(v => v.vault_id === data.activeVaultId);
//         setActiveVaultState(active || data.vaults[0] || null);
//       } else if (data.vaults.length > 0) {
//         setActiveVaultState(data.vaults[0]);
//       }

//     } catch (err: any) {
//       console.error('Failed to load vaults:', err);
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const addVault = useCallback(async (vaultData: Vault | any) => {
//     try {
//       setError(null);
      
//       // Convert to proper Vault type
//       const vault = toVault(vaultData);
      
//       // Save to storage
//       await vaultStorage.addVault(vault);
      
//       // Update state
//       setVaults(prev => {
//         const existing = prev.findIndex(v => v.vault_id === vault.vault_id);
//         if (existing >= 0) {
//           const updated = [...prev];
//           updated[existing] = vault;
//           return updated;
//         }
//         return [...prev, vault];
//       });

//       // Set as active if first vault of this chain
//       const existingForChain = vaults.find(v => v.chain === vault.chain);
//       if (!existingForChain) {
//         setActiveVaultState(vault);
//         await vaultStorage.setActiveVault(vault.vault_id);
//       }

//     } catch (err: any) {
//       console.error('Failed to add vault:', err);
//       setError(err.message);
//       throw err;
//     }
//   }, [vaults]);

//   const removeVault = useCallback(async (vaultId: string) => {
//     try {
//       setError(null);
      
//       await vaultStorage.removeVault(vaultId);
      
//       setVaults(prev => prev.filter(v => v.vault_id !== vaultId));
      
//       // Update active vault if needed
//       if (activeVault?.vault_id === vaultId) {
//         const remaining = vaults.filter(v => v.vault_id !== vaultId);
//         setActiveVaultState(remaining[0] || null);
//       }

//     } catch (err: any) {
//       console.error('Failed to remove vault:', err);
//       setError(err.message);
//       throw err;
//     }
//   }, [activeVault, vaults]);

//   const setActiveVault = useCallback(async (vaultId: string) => {
//     try {
//       setError(null);
      
//       const vault = vaults.find(v => v.vault_id === vaultId);
//       if (!vault) {
//         throw new Error('Vault not found');
//       }
      
//       await vaultStorage.setActiveVault(vaultId);
//       setActiveVaultState(vault);

//     } catch (err: any) {
//       console.error('Failed to set active vault:', err);
//       setError(err.message);
//       throw err;
//     }
//   }, [vaults]);

//   const refreshBalance = useCallback(async (vaultId?: string) => {
//     try {
//       const targetVaultId = vaultId || activeVault?.vault_id;
//       if (!targetVaultId) return;

//       const vault = vaults.find(v => v.vault_id === targetVaultId);
//       if (!vault) return;

//       // Fetch balance from API
//       let balance = 0;
      
//       if (vault.chain === 'SOL') {
//         const response = await api.getBalance(targetVaultId);
//         if (response.success) {
//           balance = response.balance;
//         }
//       } else if (vault.chain === 'ZEC') {
//         const response = await api.getFrostBalance(targetVaultId);
//         if (response.success) {
//           balance = response.balance?.confirmed || 0;
//         }
//       }

//       // Update storage and state
//       await vaultStorage.updateVaultBalance(targetVaultId, balance);
      
//       setVaults(prev => prev.map(v => 
//         v.vault_id === targetVaultId 
//           ? { ...v, balance, lastUpdated: new Date().toISOString() }
//           : v
//       ));

//     } catch (err: any) {
//       console.error('Failed to refresh balance:', err);
//       // Don't set error for balance refresh failures
//     }
//   }, [activeVault, vaults]);

//   const refreshAllBalances = useCallback(async () => {
//     for (const vault of vaults) {
//       await refreshBalance(vault.vault_id);
//     }
//   }, [vaults, refreshBalance]);

//   /**
//    * Get vault for funding - used by FundMe screen
//    * Returns the active vault or first vault of specified chain
//    */
//   const getVaultForFunding = useCallback((chain?: 'SOL' | 'ZEC'): Vault | null => {
//     if (chain) {
//       // Return first vault of specified chain
//       return vaults.find(v => v.chain === chain) || null;
//     }
    
//     // Return active vault or first available
//     return activeVault || vaults[0] || null;
//   }, [activeVault, vaults]);

//   const clearError = useCallback(() => {
//     setError(null);
//   }, []);

//   // ============================================
//   // CONTEXT VALUE
//   // ============================================

//   const value: VaultContextType = {
//     vaults,
//     activeVault,
//     solVault,
//     zecVault,
//     isLoading,
//     error,
//     loadVaults,
//     addVault,
//     removeVault,
//     setActiveVault,
//     refreshBalance,
//     refreshAllBalances,
//     getVaultForFunding,
//     clearError,
//   };

//   return (
//     <VaultContext.Provider value={value}>
//       {children}
//     </VaultContext.Provider>
//   );
// };

// // ============================================
// // HOOK
// // ============================================

// export const useVaults = (): VaultContextType => {
//   const context = useContext(VaultContext);
//   if (!context) {
//     throw new Error('useVaults must be used within a VaultProvider');
//   }
//   return context;
// };

// // ============================================
// // CONVENIENCE HOOKS
// // ============================================

// /**
//  * Get the active vault
//  */
// export const useActiveVault = (): Vault | null => {
//   const { activeVault } = useVaults();
//   return activeVault;
// };

// /**
//  * Get SOL vault
//  */
// export const useSolVault = (): Vault | null => {
//   const { solVault } = useVaults();
//   return solVault;
// };

// /**
//  * Get ZEC vault
//  */
// export const useZecVault = (): Vault | null => {
//   const { zecVault } = useVaults();
//   return zecVault;
// };

// /**
//  * Get vault for funding with automatic selection
//  */
// export const useVaultForFunding = (chain?: 'SOL' | 'ZEC'): Vault | null => {
//   const { getVaultForFunding } = useVaults();
//   return getVaultForFunding(chain);
// };

// export default VaultContext;

/**
 * ============================================
 * PAWPAD VAULT CONTEXT
 * ============================================
 * 
 * Provides vault state management across the app.
 * Handles loading, caching, and syncing vault data.
 */

// import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
// import vaultStorage, { Vault, toVault } from '../services/VaultStorage';
// import api from '../services/api';

// // ============================================
// // TYPES
// // ============================================

// interface VaultContextType {
//   // State
//   vaults: Vault[];
//   activeVault: Vault | null;
//   solVault: Vault | null;
//   zecVault: Vault | null;
//   isLoading: boolean;
//   error: string | null;
  
//   // Actions
//   loadVaults: () => Promise<void>;
//   addVault: (vault: any) => Promise<void>;  // Accept any vault-like object
//   removeVault: (vaultId: string) => Promise<void>;
//   setActiveVault: (vaultId: string) => Promise<void>;
//   refreshBalance: (vaultId?: string) => Promise<void>;
//   refreshAllBalances: () => Promise<void>;
//   getVaultForFunding: (chain?: 'SOL' | 'ZEC') => Vault | null;
//   clearError: () => void;
// }

// // ============================================
// // CONTEXT
// // ============================================

// const VaultContext = createContext<VaultContextType | undefined>(undefined);

// // ============================================
// // PROVIDER
// // ============================================

// interface VaultProviderProps {
//   children: ReactNode;
// }

// export const VaultProvider: React.FC<VaultProviderProps> = ({ children }) => {
//   const [vaults, setVaults] = useState<Vault[]>([]);
//   const [activeVault, setActiveVaultState] = useState<Vault | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // ============================================
//   // COMPUTED VALUES
//   // ============================================
  
//   // Get SOL vault (first one found)
//   const solVault = vaults.find(v => v.chain === 'SOL') || null;
  
//   // Get ZEC vault (first one found)
//   const zecVault = vaults.find(v => v.chain === 'ZEC') || null;

//   // ============================================
//   // LOAD VAULTS ON MOUNT
//   // ============================================

//   useEffect(() => {
//     loadVaults();
//   }, []);

//   // ============================================
//   // ACTIONS
//   // ============================================

//   const loadVaults = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       const data = await vaultStorage.loadVaults();
//       setVaults(data.vaults);

//       // Set active vault
//       if (data.activeVaultId) {
//         const active = data.vaults.find(v => v.vault_id === data.activeVaultId);
//         setActiveVaultState(active || data.vaults[0] || null);
//       } else if (data.vaults.length > 0) {
//         setActiveVaultState(data.vaults[0]);
//       }

//     } catch (err: any) {
//       console.error('Failed to load vaults:', err);
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const addVault = useCallback(async (vaultData: Vault | any) => {
//     try {
//       setError(null);
      
//       // Convert to proper Vault type
//       const vault = toVault(vaultData);
      
//       // Save to storage
//       await vaultStorage.addVault(vault);
      
//       // Update state
//       setVaults(prev => {
//         const existing = prev.findIndex(v => v.vault_id === vault.vault_id);
//         if (existing >= 0) {
//           const updated = [...prev];
//           updated[existing] = vault;
//           return updated;
//         }
//         return [...prev, vault];
//       });

//       // Set as active if first vault of this chain
//       const existingForChain = vaults.find(v => v.chain === vault.chain);
//       if (!existingForChain) {
//         setActiveVaultState(vault);
//         await vaultStorage.setActiveVault(vault.vault_id);
//       }

//     } catch (err: any) {
//       console.error('Failed to add vault:', err);
//       setError(err.message);
//       throw err;
//     }
//   }, [vaults]);

//   const removeVault = useCallback(async (vaultId: string) => {
//     try {
//       setError(null);
      
//       await vaultStorage.removeVault(vaultId);
      
//       setVaults(prev => prev.filter(v => v.vault_id !== vaultId));
      
//       // Update active vault if needed
//       if (activeVault?.vault_id === vaultId) {
//         const remaining = vaults.filter(v => v.vault_id !== vaultId);
//         setActiveVaultState(remaining[0] || null);
//       }

//     } catch (err: any) {
//       console.error('Failed to remove vault:', err);
//       setError(err.message);
//       throw err;
//     }
//   }, [activeVault, vaults]);

//   const setActiveVault = useCallback(async (vaultId: string) => {
//     try {
//       setError(null);
      
//       const vault = vaults.find(v => v.vault_id === vaultId);
//       if (!vault) {
//         throw new Error('Vault not found');
//       }
      
//       await vaultStorage.setActiveVault(vaultId);
//       setActiveVaultState(vault);

//     } catch (err: any) {
//       console.error('Failed to set active vault:', err);
//       setError(err.message);
//       throw err;
//     }
//   }, [vaults]);

//   const refreshBalance = useCallback(async (vaultId?: string) => {
//     try {
//       const targetVaultId = vaultId || activeVault?.vault_id;
//       if (!targetVaultId) return;

//       const vault = vaults.find(v => v.vault_id === targetVaultId);
//       if (!vault) return;

//       // Fetch balance from API
//       let balance = 0;
      
//       if (vault.chain === 'SOL') {
//         const response = await api.getBalance(targetVaultId);
//         if (response.success) {
//           balance = response.balance;
//         }
//       } else if (vault.chain === 'ZEC') {
//         const response = await api.getFrostBalance(targetVaultId);
//         if (response.success) {
//           balance = response.balance?.confirmed || 0;
//         }
//       }

//       // Update storage and state
//       await vaultStorage.updateVaultBalance(targetVaultId, balance);
      
//       setVaults(prev => prev.map(v => 
//         v.vault_id === targetVaultId 
//           ? { ...v, balance, lastUpdated: new Date().toISOString() }
//           : v
//       ));

//     } catch (err: any) {
//       console.error('Failed to refresh balance:', err);
//       // Don't set error for balance refresh failures
//     }
//   }, [activeVault, vaults]);

//   const refreshAllBalances = useCallback(async () => {
//     for (const vault of vaults) {
//       await refreshBalance(vault.vault_id);
//     }
//   }, [vaults, refreshBalance]);

//   /**
//    * Get vault for funding - used by FundMe screen
//    * Returns the active vault or first vault of specified chain
//    */
//   const getVaultForFunding = useCallback((chain?: 'SOL' | 'ZEC'): Vault | null => {
//     if (chain) {
//       // Return first vault of specified chain
//       return vaults.find(v => v.chain === chain) || null;
//     }
    
//     // Return active vault or first available
//     return activeVault || vaults[0] || null;
//   }, [activeVault, vaults]);

//   const clearError = useCallback(() => {
//     setError(null);
//   }, []);

//   // ============================================
//   // CONTEXT VALUE
//   // ============================================

//   const value: VaultContextType = {
//     vaults,
//     activeVault,
//     solVault,
//     zecVault,
//     isLoading,
//     error,
//     loadVaults,
//     addVault,
//     removeVault,
//     setActiveVault,
//     refreshBalance,
//     refreshAllBalances,
//     getVaultForFunding,
//     clearError,
//   };

//   return (
//     <VaultContext.Provider value={value}>
//       {children}
//     </VaultContext.Provider>
//   );
// };

// // ============================================
// // HOOK
// // ============================================

// export const useVaults = (): VaultContextType => {
//   const context = useContext(VaultContext);
//   if (!context) {
//     throw new Error('useVaults must be used within a VaultProvider');
//   }
//   return context;
// };

// // ============================================
// // CONVENIENCE HOOKS
// // ============================================

// /**
//  * Get the active vault
//  */
// export const useActiveVault = (): Vault | null => {
//   const { activeVault } = useVaults();
//   return activeVault;
// };

// /**
//  * Get SOL vault
//  */
// export const useSolVault = (): Vault | null => {
//   const { solVault } = useVaults();
//   return solVault;
// };

// /**
//  * Get ZEC vault
//  */
// export const useZecVault = (): Vault | null => {
//   const { zecVault } = useVaults();
//   return zecVault;
// };

// /**
//  * Get vault for funding with automatic selection
//  */
// export const useVaultForFunding = (chain?: 'SOL' | 'ZEC'): Vault | null => {
//   const { getVaultForFunding } = useVaults();
//   return getVaultForFunding(chain);
// };

// export default VaultContext;

// import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
// import vaultStorage, { Vault, toVault } from '../services/VaultStorage';
// import api from '../services/api';

// // ============================================
// // TYPES
// // ============================================

// interface VaultContextType {
//   // State
//   vaults: Vault[];
//   activeVault: Vault | null;
//   solVault: Vault | null;
//   zecVault: Vault | null;
//   isLoading: boolean;
//   error: string | null;
  
//   // Actions
//   loadVaults: () => Promise<void>;
//   addVault: (vault: any) => Promise<void>;
//   removeVault: (vaultId: string) => Promise<void>;
//   setActiveVault: (vaultId: string) => Promise<void>;
//   refreshBalance: (vaultId?: string) => Promise<void>;
//   refreshAllBalances: () => Promise<void>;
//   getVaultForFunding: (chain?: 'SOL' | 'ZEC') => Vault | null;
//   clearError: () => void;
// }

// // ============================================
// // CONTEXT
// // ============================================

// const VaultContext = createContext<VaultContextType | undefined>(undefined);

// // ============================================
// // PROVIDER
// // ============================================

// interface VaultProviderProps {
//   children: ReactNode;
// }

// export const VaultProvider: React.FC<VaultProviderProps> = ({ children }) => {
//   const [vaults, setVaults] = useState<Vault[]>([]);
//   const [activeVault, setActiveVaultState] = useState<Vault | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // ============================================
//   // COMPUTED VALUES
//   // ============================================
  
//   // Get SOL vault (first one found - either unified or legacy)
//   const solVault = vaults.find(v => v.chain === 'SOL' || v.sol) || null;
  
//   // Get ZEC vault (first one found - either unified or legacy)
//   const zecVault = vaults.find(v => v.chain === 'ZEC' || v.zec) || null;

//   // ============================================
//   // LOAD VAULTS ON MOUNT
//   // ============================================

//   useEffect(() => {
//     loadVaults();
//   }, []);

//   // ============================================
//   // ACTIONS
//   // ============================================

//   const loadVaults = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       const data = await vaultStorage.loadVaults();
//       setVaults(data.vaults);

//       // Set active vault
//       if (data.activeVaultId) {
//         const active = data.vaults.find(v => v.vault_id === data.activeVaultId);
//         setActiveVaultState(active || data.vaults[0] || null);
//       } else if (data.vaults.length > 0) {
//         setActiveVaultState(data.vaults[0]);
//       }

//     } catch (err: any) {
//       console.error('Failed to load vaults:', err);
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const addVault = useCallback(async (vaultData: Vault | any) => {
//     try {
//       setError(null);
      
//       // Convert to proper Vault type
//       const vault = toVault(vaultData);
      
//       // Save to storage
//       await vaultStorage.addVault(vault);
      
//       // Update state
//       setVaults(prev => {
//         const existing = prev.findIndex(v => v.vault_id === vault.vault_id);
//         if (existing >= 0) {
//           const updated = [...prev];
//           updated[existing] = vault;
//           return updated;
//         }
//         return [...prev, vault];
//       });

//       // Set as active if first vault
//       if (vaults.length === 0) {
//         setActiveVaultState(vault);
//         await vaultStorage.setActiveVault(vault.vault_id);
//       }

//     } catch (err: any) {
//       console.error('Failed to add vault:', err);
//       setError(err.message);
//       throw err;
//     }
//   }, [vaults]);

//   const removeVault = useCallback(async (vaultId: string) => {
//     try {
//       setError(null);
      
//       await vaultStorage.removeVault(vaultId);
      
//       setVaults(prev => prev.filter(v => v.vault_id !== vaultId));
      
//       // Update active vault if needed
//       if (activeVault?.vault_id === vaultId) {
//         const remaining = vaults.filter(v => v.vault_id !== vaultId);
//         setActiveVaultState(remaining[0] || null);
//       }

//     } catch (err: any) {
//       console.error('Failed to remove vault:', err);
//       setError(err.message);
//       throw err;
//     }
//   }, [activeVault, vaults]);

//   const setActiveVault = useCallback(async (vaultId: string) => {
//     try {
//       setError(null);
      
//       const vault = vaults.find(v => v.vault_id === vaultId);
//       if (!vault) {
//         throw new Error('Vault not found');
//       }
      
//       await vaultStorage.setActiveVault(vaultId);
//       setActiveVaultState(vault);

//     } catch (err: any) {
//       console.error('Failed to set active vault:', err);
//       setError(err.message);
//       throw err;
//     }
//   }, [vaults]);

//   const refreshBalance = useCallback(async (vaultId?: string) => {
//     try {
//       const targetVaultId = vaultId || activeVault?.vault_id;
//       if (!targetVaultId) return;

//       const vault = vaults.find(v => v.vault_id === targetVaultId);
//       if (!vault) return;

//       let balance = 0;

//       // ═══════════════════════════════════════════════════════════════
//       // Handle unified vaults (has both SOL and ZEC)
//       // ═══════════════════════════════════════════════════════════════
//       const isUnified = vault.vault_type === 'unified' || (vault.sol && vault.zec);
      
//       if (isUnified) {
//         try {
//           const response = await api.getUnifiedBalances(targetVaultId);
//           if (response.success) {
//             // For unified vaults, use total SOL balance as primary
//             balance = response.sol?.balance || 0;
//           }
//         } catch (e) {
//           console.log('Unified balance fetch failed, trying individual:', e);
//           // Fall back to individual fetches
//           if (vault.sol?.address) {
//             try {
//               const solResponse = await api.getSolBalance(vault.sol.address);
//               if (solResponse.success) {
//                 balance = solResponse.balance || 0;
//               }
//             } catch (solErr) {
//               console.log('SOL fallback failed:', solErr);
//             }
//           }
//         }
//       }
//       // ═══════════════════════════════════════════════════════════════
//       // Handle SOL-only vaults
//       // ═══════════════════════════════════════════════════════════════
//       else if (vault.chain === 'SOL' || vault.sol) {
//         const address = vault.sol?.address || vault.address;
//         if (address) {
//           try {
//             const response = await api.getSolBalance(address);
//             if (response.success) {
//               balance = response.balance || 0;
//             }
//           } catch (e) {
//             console.log('SOL balance fetch failed:', e);
//           }
//         }
//       }
//       // ═══════════════════════════════════════════════════════════════
//       // Handle ZEC-only vaults (FROST)
//       // ═══════════════════════════════════════════════════════════════
//       else if (vault.chain === 'ZEC' || vault.zec) {
//         const address = vault.zec?.address || vault.address;
//         if (address) {
//           try {
//             const response = await api.getZecBalance(address);
//             if (response.success) {
//               // Handle different response formats
//               if (typeof response.balance === 'number') {
//                 balance = response.balance;
//               } else if (typeof response.shielded_balance === 'number') {
//                 balance = response.shielded_balance;
//               } else if (typeof response.total_zec === 'number') {
//                 balance = response.total_zec;
//               }
//             }
//           } catch (e) {
//             console.log('ZEC balance fetch failed:', e);
//           }
//         }
//       }

//       // Update storage and state
//       await vaultStorage.updateVaultBalance(targetVaultId, balance);
      
//       setVaults(prev => prev.map(v => 
//         v.vault_id === targetVaultId 
//           ? { ...v, balance, lastUpdated: new Date().toISOString() }
//           : v
//       ));

//     } catch (err: any) {
//       console.error('Failed to refresh balance:', err);
//       // Don't set error for balance refresh failures
//     }
//   }, [activeVault, vaults]);

//   const refreshAllBalances = useCallback(async () => {
//     for (const vault of vaults) {
//       await refreshBalance(vault.vault_id);
//     }
//   }, [vaults, refreshBalance]);

//   /**
//    * Get vault for funding - used by FundMe screen
//    * Returns the active vault or first vault of specified chain
//    */
//   const getVaultForFunding = useCallback((chain?: 'SOL' | 'ZEC'): Vault | null => {
//     if (chain === 'SOL') {
//       return vaults.find(v => v.chain === 'SOL' || v.sol) || null;
//     }
//     if (chain === 'ZEC') {
//       return vaults.find(v => v.chain === 'ZEC' || v.zec) || null;
//     }
    
//     // Return active vault or first available
//     return activeVault || vaults[0] || null;
//   }, [activeVault, vaults]);

//   const clearError = useCallback(() => {
//     setError(null);
//   }, []);

//   // ============================================
//   // CONTEXT VALUE
//   // ============================================

//   const value: VaultContextType = {
//     vaults,
//     activeVault,
//     solVault,
//     zecVault,
//     isLoading,
//     error,
//     loadVaults,
//     addVault,
//     removeVault,
//     setActiveVault,
//     refreshBalance,
//     refreshAllBalances,
//     getVaultForFunding,
//     clearError,
//   };

//   return (
//     <VaultContext.Provider value={value}>
//       {children}
//     </VaultContext.Provider>
//   );
// };

// // ============================================
// // HOOK
// // ============================================

// export const useVaults = (): VaultContextType => {
//   const context = useContext(VaultContext);
//   if (!context) {
//     throw new Error('useVaults must be used within a VaultProvider');
//   }
//   return context;
// };

// // ============================================
// // CONVENIENCE HOOKS
// // ============================================

// export const useActiveVault = (): Vault | null => {
//   const { activeVault } = useVaults();
//   return activeVault;
// };

// export const useSolVault = (): Vault | null => {
//   const { solVault } = useVaults();
//   return solVault;
// };

// export const useZecVault = (): Vault | null => {
//   const { zecVault } = useVaults();
//   return zecVault;
// };

// export const useVaultForFunding = (chain?: 'SOL' | 'ZEC'): Vault | null => {
//   const { getVaultForFunding } = useVaults();
//   return getVaultForFunding(chain);
// };

// export default VaultContext;

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import vaultStorage, { Vault, toVault } from '../services/VaultStorage';
import api from '../services/api';

// ============================================
// TYPES
// ============================================

interface VaultContextType {
  // State
  vaults: Vault[];
  activeVault: Vault | null;
  solVault: Vault | null;
  zecVault: Vault | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadVaults: () => Promise<void>;
  addVault: (vault: any) => Promise<void>;
  removeVault: (vaultId: string) => Promise<void>;
  setActiveVault: (vaultIdOrVault: string | Vault) => Promise<void>;  // UPDATED
  refreshBalance: (vaultId?: string) => Promise<void>;
  refreshAllBalances: () => Promise<void>;
  getVaultForFunding: (chain?: 'SOL' | 'ZEC') => Vault | null;
  clearError: () => void;
}

// ============================================
// CONTEXT
// ============================================

const VaultContext = createContext<VaultContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

interface VaultProviderProps {
  children: ReactNode;
}

export const VaultProvider: React.FC<VaultProviderProps> = ({ children }) => {
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [activeVault, setActiveVaultState] = useState<Vault | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // COMPUTED VALUES
  // ============================================
  
  const solVault = vaults.find(v => v.chain === 'SOL' || v.sol) || null;
  const zecVault = vaults.find(v => v.chain === 'ZEC' || v.zec) || null;

  // ============================================
  // LOAD VAULTS ON MOUNT
  // ============================================

  useEffect(() => {
    loadVaults();
  }, []);

  // ============================================
  // ACTIONS
  // ============================================

  const loadVaults = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await vaultStorage.loadVaults();
      setVaults(data.vaults);

      if (data.activeVaultId) {
        const active = data.vaults.find(v => v.vault_id === data.activeVaultId);
        setActiveVaultState(active || data.vaults[0] || null);
      } else if (data.vaults.length > 0) {
        setActiveVaultState(data.vaults[0]);
      }

    } catch (err: any) {
      console.error('Failed to load vaults:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addVault = useCallback(async (vaultData: Vault | any) => {
    try {
      setError(null);
      
      const vault = toVault(vaultData);
      
      await vaultStorage.addVault(vault);
      
      setVaults(prev => {
        const existing = prev.findIndex(v => v.vault_id === vault.vault_id);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = vault;
          return updated;
        }
        return [...prev, vault];
      });

      // Set as active if first vault
      if (vaults.length === 0) {
        setActiveVaultState(vault);
        await vaultStorage.setActiveVault(vault.vault_id);
      }

    } catch (err: any) {
      console.error('Failed to add vault:', err);
      setError(err.message);
      throw err;
    }
  }, [vaults]);

  const removeVault = useCallback(async (vaultId: string) => {
    try {
      setError(null);
      
      await vaultStorage.removeVault(vaultId);
      
      setVaults(prev => prev.filter(v => v.vault_id !== vaultId));
      
      if (activeVault?.vault_id === vaultId) {
        const remaining = vaults.filter(v => v.vault_id !== vaultId);
        setActiveVaultState(remaining[0] || null);
      }

    } catch (err: any) {
      console.error('Failed to remove vault:', err);
      setError(err.message);
      throw err;
    }
  }, [activeVault, vaults]);

  // ═══════════════════════════════════════════════════════════════
  // FIXED: setActiveVault now accepts string OR Vault object
  // ═══════════════════════════════════════════════════════════════
  const setActiveVault = useCallback(async (vaultIdOrVault: string | Vault) => {
    try {
      setError(null);
      
      let vault: Vault | undefined;
      let vaultId: string;
      
      // Accept either vault ID string or vault object directly
      if (typeof vaultIdOrVault === 'string') {
        vaultId = vaultIdOrVault;
        
        // First check current state
        vault = vaults.find(v => v.vault_id === vaultId);
        
        // If not found in state, reload from storage (state might be stale)
        if (!vault) {
          console.log('[VaultContext] Vault not in state, checking storage...');
          const data = await vaultStorage.loadVaults();
          vault = data.vaults.find(v => v.vault_id === vaultId);
          
          // Update state with fresh data
          if (data.vaults.length > 0) {
            setVaults(data.vaults);
          }
        }
      } else {
        // Vault object passed directly - use it!
        vault = vaultIdOrVault;
        vaultId = vault.vault_id;
        
        // Also ensure it's in state
        setVaults(prev => {
          const exists = prev.some(v => v.vault_id === vaultId);
          return exists ? prev : [...prev, vault!];
        });
      }
      
      if (!vault) {
        throw new Error('Vault not found');
      }
      
      await vaultStorage.setActiveVault(vaultId);
      setActiveVaultState(vault);

    } catch (err: any) {
      console.error('Failed to set active vault:', err);
      setError(err.message);
      throw err;
    }
  }, [vaults]);

  const refreshBalance = useCallback(async (vaultId?: string) => {
    try {
      const targetVaultId = vaultId || activeVault?.vault_id;
      if (!targetVaultId) return;

      const vault = vaults.find(v => v.vault_id === targetVaultId);
      if (!vault) return;

      let balance = 0;

      const isUnified = vault.vault_type === 'unified' || (vault.sol && vault.zec);
      
      if (isUnified) {
        try {
          const response = await api.getUnifiedBalances(targetVaultId);
          if (response.success) {
            balance = response.sol?.balance || 0;
          }
        } catch (e) {
          console.log('Unified balance fetch failed, trying individual:', e);
          if (vault.sol?.address) {
            try {
              const solResponse = await api.getSolBalance(vault.sol.address);
              if (solResponse.success) {
                balance = solResponse.balance || 0;
              }
            } catch (solErr) {
              console.log('SOL fallback failed:', solErr);
            }
          }
        }
      } else if (vault.chain === 'SOL' || vault.sol) {
        const address = vault.sol?.address || vault.address;
        if (address) {
          try {
            const response = await api.getSolBalance(address);
            if (response.success) {
              balance = response.balance || 0;
            }
          } catch (e) {
            console.log('SOL balance fetch failed:', e);
          }
        }
      } else if (vault.chain === 'ZEC' || vault.zec) {
        const address = vault.zec?.address || vault.address;
        if (address) {
          try {
            const response = await api.getZecBalance(address);
            if (response.success) {
              if (typeof response.balance === 'number') {
                balance = response.balance;
              } else if (typeof response.shielded_balance === 'number') {
                balance = response.shielded_balance;
              } else if (typeof response.total_zec === 'number') {
                balance = response.total_zec;
              }
            }
          } catch (e) {
            console.log('ZEC balance fetch failed:', e);
          }
        }
      }

      await vaultStorage.updateVaultBalance(targetVaultId, balance);
      
      setVaults(prev => prev.map(v => 
        v.vault_id === targetVaultId 
          ? { ...v, balance, lastUpdated: new Date().toISOString() }
          : v
      ));

    } catch (err: any) {
      console.error('Failed to refresh balance:', err);
    }
  }, [activeVault, vaults]);

  const refreshAllBalances = useCallback(async () => {
    for (const vault of vaults) {
      await refreshBalance(vault.vault_id);
    }
  }, [vaults, refreshBalance]);

  const getVaultForFunding = useCallback((chain?: 'SOL' | 'ZEC'): Vault | null => {
    if (chain === 'SOL') {
      return vaults.find(v => v.chain === 'SOL' || v.sol) || null;
    }
    if (chain === 'ZEC') {
      return vaults.find(v => v.chain === 'ZEC' || v.zec) || null;
    }
    return activeVault || vaults[0] || null;
  }, [activeVault, vaults]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ============================================
  // CONTEXT VALUE
  // ============================================

  const value: VaultContextType = {
    vaults,
    activeVault,
    solVault,
    zecVault,
    isLoading,
    error,
    loadVaults,
    addVault,
    removeVault,
    setActiveVault,
    refreshBalance,
    refreshAllBalances,
    getVaultForFunding,
    clearError,
  };

  return (
    <VaultContext.Provider value={value}>
      {children}
    </VaultContext.Provider>
  );
};

// ============================================
// HOOK
// ============================================

export const useVaults = (): VaultContextType => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVaults must be used within a VaultProvider');
  }
  return context;
};

// ============================================
// CONVENIENCE HOOKS
// ============================================

export const useActiveVault = (): Vault | null => {
  const { activeVault } = useVaults();
  return activeVault;
};

export const useSolVault = (): Vault | null => {
  const { solVault } = useVaults();
  return solVault;
};

export const useZecVault = (): Vault | null => {
  const { zecVault } = useVaults();
  return zecVault;
};

export const useVaultForFunding = (chain?: 'SOL' | 'ZEC'): Vault | null => {
  const { getVaultForFunding } = useVaults();
  return getVaultForFunding(chain);
};

export default VaultContext;