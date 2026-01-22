
// /**
//  * HomeScreen - Fixed with correct hooks order
//  * 
//  * CRITICAL: All hooks MUST be called before any conditional returns!
//  */

// import React, { useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   RefreshControl,
//   ActivityIndicator,
//   Platform,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList, VaultData, isUnifiedVault } from '../types/navigation';
// import { useVaults } from '../context/VaultContext';
// import api from '../services/api';
// import Clipboard from '@react-native-clipboard/clipboard';

// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
// type RouteType = RouteProp<RootStackParamList, 'Home'>;

// const HomeScreen = () => {
//   // ═══════════════════════════════════════════════════════════════
//   // ALL HOOKS MUST BE AT THE TOP
//   // ═══════════════════════════════════════════════════════════════
  
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<RouteType>();
//   const { activeVault, vaults, isLoading: contextLoading } = useVaults();
  
//   // State hooks
//   const [refreshing, setRefreshing] = useState(false);
//   const [solBalance, setSolBalance] = useState<number>(0);
//   const [solUsd, setSolUsd] = useState<number>(0);
//   const [zecBalance, setZecBalance] = useState<number>(0);
//   const [zecUsd, setZecUsd] = useState<number>(0);
//   const [loadingBalance, setLoadingBalance] = useState(false);
//   const [copied, setCopied] = useState(false);

//   // Get vault from route params or context
//   const routeVault = route.params?.vault;
//   const vault: VaultData | null = routeVault || (activeVault as VaultData | null);

//   const isSeedless = vault?.wallet_type === 'seedless';

//   // Check if unified vault
//   const unified = vault ? isUnifiedVault(vault) : false;
  
//   // Determine wallet type
//  // const hasSol = vault?.chain === 'SOL' || vault?.sol?.address || unified;
//  // const hasZec = vault?.chain === 'ZEC' || vault?.zec?.address || vault?.zec?.unified_address || vault?.zec?.transparent_address || unified;

//  const hasSol = !isSeedless && (vault?.chain === 'SOL' || vault?.sol?.address || vault?.chain === 'unified');
// const hasZec = isSeedless || vault?.chain === 'ZEC' || vault?.zec?.address || vault?.zec?.unified_address || vault?.zec?.transparent_address || vault?.chain === 'unified';
//   // Load balances callback
//   const loadBalances = useCallback(async () => {
//     if (!vault) return;
    
//     setLoadingBalance(true);
    
//     // Reset balances first to avoid stale data
//     setSolBalance(0);
//     setSolUsd(0);
//     setZecBalance(0);
//     setZecUsd(0);
    
//     try {
//       // Load SOL balance if wallet has SOL
//       if (hasSol) {
//         const address = vault.sol?.address || vault.address;
//         if (address) {
//           try {
//             const response = await api.getSolBalance(address);
//             const bal = response.sol || response.balance || 0;
//             const usd = response.usd || bal * 200;
//             setSolBalance(bal);
//             setSolUsd(usd);
//           } catch (err) {
//             console.log('SOL balance error:', err);
//           }
//         }
//       }
      
//       // Load ZEC balance if wallet has ZEC
//       // if (hasZec && vault.zec?.address) {
//       if (hasZec && (vault.zec?.address || vault.zec?.unified_address)) {
//   const zecAddress = vault.zec?.unified_address || vault.zec?.address;
//         try {
//           //const response = await api.getZecBalance(vault.zec.address);
//           const response = await api.getZecBalance(zecAddress!);
//           const bal = response.shielded_balance || response.balance || response.total_zec || 0;
//           const usd = response.usd || bal * 40;
//           setZecBalance(bal);
//           setZecUsd(usd);
//         } catch (err) {
//           console.log('ZEC balance error:', err);
//         }
//       }
//     } catch (error) {
//       console.log('Balance fetch error:', error);
//     } finally {
//       setLoadingBalance(false);
//     }
//   }, [vault, hasSol, hasZec]);

//   // Load on focus
//   useFocusEffect(
//     useCallback(() => {
//       if (vault) {
//         loadBalances();
//       }
//     }, [vault, loadBalances])
//   );

//   // ═══════════════════════════════════════════════════════════════
//   // HELPER FUNCTIONS
//   // ═══════════════════════════════════════════════════════════════

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await loadBalances();
//     setRefreshing(false);
//   };

//   // const copyAddress = () => {
//   //   const address = vault?.sol?.address || vault?.address;
//   //   if (!address) return;
//   //   Clipboard.setString(address);
//   //   setCopied(true);
//   //   setTimeout(() => setCopied(false), 2000);
//   // };
//   const copyAddress = () => {
//   const address = isSeedless 
//     ? (vault?.zec?.address || vault?.publicKey)
//     : (vault?.sol?.address || vault?.address);
//   if (!address) return;
//   Clipboard.setString(address);
//   setCopied(true);
//   setTimeout(() => setCopied(false), 2000);
// };

//   const formatAddress = (address: string | undefined) => {
//     if (!address) return 'No address';
//     return `${address.slice(0, 4)}...${address.slice(-4)}`;
//   };

//   const safeToFixed = (value: number | undefined | null, decimals: number = 2): string => {
//     if (value === undefined || value === null || isNaN(value)) {
//       return '0.00';
//     }
//     return value.toFixed(decimals);
//   };

//   // Calculate total - only include balances that actually exist
//   const totalUsd = (hasSol ? solUsd : 0) + (hasZec ? zecUsd : 0);

//   // ═══════════════════════════════════════════════════════════════
//   // RENDER - No vault state
//   // ═══════════════════════════════════════════════════════════════

//   if (!vault && !contextLoading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
//           <View style={styles.emptyCard}>
//             <Text style={styles.emptyEmoji}>🔐</Text>
//             <Text style={styles.emptyTitle}>No Wallet Found</Text>
//             <Text style={styles.emptyText}>Create a wallet to get started</Text>
//             <TouchableOpacity
//               style={styles.primaryButton}
//               onPress={() => navigation.navigate('ChainSelection')}
//             >
//               <Text style={styles.primaryButtonText}>Create Wallet</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.secondaryButton}
//               onPress={() => navigation.navigate('Recovery')}
//             >
//               <Text style={styles.secondaryButtonText}>Recover Wallet</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     );
//   }

//   if (contextLoading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#4ECDC4" />
//           <Text style={styles.loadingText}>Loading wallet...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // MAIN RENDER - Phantom Style
//   // ═══════════════════════════════════════════════════════════════
//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4ECDC4" />
//         }
//       >
//         {/* Header with wallet name and copy button */}
//         {/* <View style={styles.header}>
//           <View style={styles.walletNameRow}>
//             <Text style={styles.walletName}>{vault?.vault_name || 'My Wallet'}</Text>
//             <TouchableOpacity style={styles.copyButton} onPress={copyAddress}>
//               <Text style={styles.copyIcon}>{copied ? '✓' : '📋'}</Text>
//             </TouchableOpacity>
//           </View>
//           <Text style={styles.addressText}>
//             {formatAddress(vault?.sol?.address || vault?.address)}
//           </Text>
//         </View> */}
//         <View style={styles.header}>
//           <View style={styles.walletNameRow}>
//             <Text style={styles.walletName}>{vault?.vault_name || 'My Wallet'}</Text>
//             <TouchableOpacity style={styles.copyButton} onPress={copyAddress}>
//               <Text style={styles.copyIcon}>{copied ? '✓' : '📋'}</Text>
//             </TouchableOpacity>
//           </View>
//           <Text style={styles.addressText}>
//             {isSeedless 
//               ? formatAddress(vault?.zec?.address || vault?.publicKey)
//               : formatAddress(vault?.sol?.address || vault?.address)
//             }
//           </Text>
//         </View>

//         {/* Total Balance - Big centered */}
//         <View style={styles.balanceSection}>
//           {loadingBalance ? (
//             <ActivityIndicator color="#FFFFFF" size="large" />
//           ) : (
//             <>
//               <Text style={styles.totalBalance}>${safeToFixed(totalUsd, 2)}</Text>
//               <Text style={styles.balanceHint}>
//                 {totalUsd === 0 ? 'Fund your wallet to get started' : 'Pull down to refresh'}
//               </Text>
//             </>
//           )}
//         </View>

//         {/* Action Buttons Row - Phantom Style */}
//         <View style={styles.actionRow}>
//           {/* <TouchableOpacity
//             style={styles.actionItem}
//             onPress={() => vault && navigation.navigate('Receive', { vault, chain: 'SOL' })}
//           >
//             <View style={styles.actionIconBg}>
//               <Text style={styles.actionIcon}>📥</Text>
//             </View>
//             <Text style={styles.actionLabel}>Receive</Text>
//           </TouchableOpacity> */}

//           <TouchableOpacity
//             style={styles.actionItem}
//             onPress={() => vault && navigation.navigate('Send', { vault, chain: 'SOL' })}
//           >
//             <View style={styles.actionIconBg}>
//               <Text style={styles.actionIcon}>📤</Text>
//             </View>
//             <Text style={styles.actionLabel}>Send</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.actionItem}
//             onPress={() => navigation.navigate('Swap', { vault: vault || undefined })}
//           >
//             <View style={styles.actionIconBg}>
//               <Text style={styles.actionIcon}>🔄</Text>
//             </View>
//             <Text style={styles.actionLabel}>Swap</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.actionItem}
//             onPress={() => navigation.navigate('FundWallet', { vault: vault || undefined })}
//           >
//             <View style={styles.actionIconBg}>
//               <Text style={styles.actionIcon}>💵</Text>
//             </View>
//             <Text style={styles.actionLabel}>Buy</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Tokens Section Header */}
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Tokens</Text>
//         </View>

//         {/* Token List - Phantom Style */}
//         <View style={styles.tokenList}>
//           {/* SOL Token Row */}
//           {hasSol && (
//             <TouchableOpacity style={styles.tokenRow}>
//               <View style={styles.tokenIcon}>
//                 <View style={styles.solIcon}>
//                   <Text style={styles.tokenIconText}>◎</Text>
//                 </View>
//               </View>
//               <View style={styles.tokenInfo}>
//                 <Text style={styles.tokenName}>Solana</Text>
//                 <Text style={styles.tokenBalance}>{safeToFixed(solBalance, 4)} SOL</Text>
//               </View>
//               <View style={styles.tokenValue}>
//                 <Text style={styles.tokenUsd}>${safeToFixed(solUsd, 2)}</Text>
//               </View>
//             </TouchableOpacity>
//           )}

//           {/* ZEC Token Row - Only show if wallet has ZEC */}
//           {/* {hasZec && vault?.zec?.address && ( */}
//           {hasZec && (vault?.zec?.address || vault?.zec?.unified_address) && (
//             <TouchableOpacity style={styles.tokenRow}>
//               <View style={styles.tokenIcon}>
//                 <View style={styles.zecIcon}>
//                   <Text style={styles.tokenIconTextDark}>Z</Text>
//                 </View>
//               </View>
//               <View style={styles.tokenInfo}>
//                 <Text style={styles.tokenName}>Zcash</Text>
//                 <Text style={styles.tokenBalance}>{safeToFixed(zecBalance, 4)} ZEC</Text>
//               </View>
//               <View style={styles.tokenValue}>
//                 <Text style={styles.tokenUsd}>${safeToFixed(zecUsd, 2)}</Text>
//                 <View style={styles.shieldedTag}>
//                   <Text style={styles.shieldedTagText}>🔒 Shielded</Text>
//                 </View>
//               </View>
//             </TouchableOpacity>
//           )}

//           {/* Empty state if no tokens */}
//           {!hasSol && !hasZec && (
//             <View style={styles.emptyTokens}>
//               <Text style={styles.emptyTokensText}>No tokens yet</Text>
//             </View>
//           )}
//         </View>

//         {/* Quick Actions */}

//         {vault && (
//           <>
//             {/* Feature Cards - Vertical Stack */}
//             {!isSeedless && (
//               <TouchableOpacity
//                 style={styles.quickActionCard}
//                 onPress={() => navigation.navigate('DarkPool', { vault_id: vault.vault_id, vault })}
//               >
//                 <Text style={styles.quickActionEmoji}>🏊</Text>
//                 <View style={styles.quickActionInfo}>
//                   <Text style={styles.quickActionTitle}>Dark Pool Trading</Text>
//                   <Text style={styles.quickActionDesc}>MEV-protected encrypted orders</Text>
//                 </View>
//                 <Text style={styles.quickActionArrow}>→</Text>
//               </TouchableOpacity>
//             )}

//             {!isSeedless && (
//               <TouchableOpacity
//                 style={styles.quickActionCard}
//                 onPress={() => navigation.navigate('Lending', { vault_id: vault.vault_id, vault })}
//               >
//                 <Text style={styles.quickActionEmoji}>🏦</Text>
//                 <View style={styles.quickActionInfo}>
//                   <Text style={styles.quickActionTitle}>Private Lending</Text>
//                   <Text style={styles.quickActionDesc}>Borrow with Arcium privacy</Text>
//                 </View>
//                 <Text style={styles.quickActionArrow}>→</Text>
//               </TouchableOpacity>
//             )}

//             {/* AI Trading Agent - Show for ALL wallet types */}
//             <TouchableOpacity
//               style={styles.quickActionCard}
//               onPress={() => navigation.navigate('AgentDashboard', { vault })}
//             >
//               <Text style={styles.quickActionEmoji}>🤖</Text>
//               <View style={styles.quickActionInfo}>
//                 <Text style={styles.quickActionTitle}>AI Trading Agent</Text>
//                 <Text style={styles.quickActionDesc}>Auto-trade with Zynapse signals</Text>
//               </View>
//               <Text style={styles.quickActionArrow}>→</Text>
//             </TouchableOpacity>

//             {!isSeedless && (
//               <TouchableOpacity
//                 style={styles.quickActionCard}
//                 onPress={() => navigation.navigate('Backup', { vault })}
//               >
//                 <Text style={styles.quickActionEmoji}>🔐</Text>
//                 <View style={styles.quickActionInfo}>
//                   <Text style={styles.quickActionTitle}>Backup & Recovery</Text>
//                   <Text style={styles.quickActionDesc}>Secure your wallet</Text>
//                 </View>
//                 <Text style={styles.quickActionArrow}>→</Text>
//               </TouchableOpacity>
//             )}
//           </>
//         )}

//         {/* {vault && (
//           <>
           
//             <TouchableOpacity
//               style={styles.quickActionCard}
//               onPress={() => navigation.navigate('DarkPool', { vault_id: vault.vault_id, vault })}
//             >
//               <Text style={styles.quickActionEmoji}>🏊</Text>
//               <View style={styles.quickActionInfo}>
//                 <Text style={styles.quickActionTitle}>Dark Pool Trading</Text>
//                 <Text style={styles.quickActionDesc}>MEV-protected encrypted orders</Text>
//               </View>
//               <Text style={styles.quickActionArrow}>→</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.quickActionCard}
//               onPress={() => navigation.navigate('Lending', { vault_id: vault.vault_id, vault })}
//             >
//               <Text style={styles.quickActionEmoji}>🏦</Text>
//               <View style={styles.quickActionInfo}>
//                 <Text style={styles.quickActionTitle}>Private Lending</Text>
//                 <Text style={styles.quickActionDesc}>Borrow with Arcium privacy</Text>
//               </View>
//               <Text style={styles.quickActionArrow}>→</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.quickActionCard}
//               onPress={() => navigation.navigate('AgentDashboard', { vault })}
//             >
//               <Text style={styles.quickActionEmoji}>🤖</Text>
//               <View style={styles.quickActionInfo}>
//                 <Text style={styles.quickActionTitle}>AI Trading Agent</Text>
//                 <Text style={styles.quickActionDesc}>Auto-trade with Zynapse signals</Text>
//               </View>
//               <Text style={styles.quickActionArrow}>→</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.quickActionCard}
//               onPress={() => navigation.navigate('Backup', { vault })}
//             >
//               <Text style={styles.quickActionEmoji}>🔐</Text>
//               <View style={styles.quickActionInfo}>
//                 <Text style={styles.quickActionTitle}>Backup & Recovery</Text>
//                 <Text style={styles.quickActionDesc}>Secure your wallet</Text>
//               </View>
//               <Text style={styles.quickActionArrow}>→</Text>
//             </TouchableOpacity>
//           </>
//         )} */}


//         {/* Security Footer */}

//         <View style={styles.securityFooter}>
//           <Text style={styles.securityText}>
//             {isSeedless 
//               ? '🔐 Secured by Oasis TEE • TOTP Protected'
//               : '🔐 Secured by Arcium MPC • No seed phrase'
//             }
//           </Text>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0A0A0A',
//   },
//   scrollContent: {
//     paddingHorizontal: 20,
//     paddingBottom: 40,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     color: '#9CA3AF',
//     marginTop: 12,
//     fontSize: 14,
//   },

//   // Header
//   header: {
//     alignItems: 'center',
//     paddingTop: 20,
//     paddingBottom: 10,
//   },
//   walletNameRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   walletName: {
//     fontSize: 18,
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   copyButton: {
//     backgroundColor: '#1E1E1E',
//     borderRadius: 8,
//     padding: 8,
//   },
//   copyIcon: {
//     fontSize: 14,
//   },
//   addressText: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginTop: 4,
//     fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
//   },

//   // Balance Section
//   balanceSection: {
//     alignItems: 'center',
//     paddingVertical: 30,
//   },
//   totalBalance: {
//     fontSize: 48,
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//   },
//   balanceHint: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginTop: 8,
//   },

//   // Action Row - Phantom Style
//   actionRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#1E1E1E',
//   },
//   actionItem: {
//     alignItems: 'center',
//   },
//   actionIconBg: {
//     width: 56,
//     height: 56,
//     backgroundColor: '#1E1E1E',
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   actionIcon: {
//     fontSize: 24,
//   },
//   actionLabel: {
//     fontSize: 12,
//     color: '#9CA3AF',
//     fontWeight: '500',
//   },

//   // Section Header
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: 24,
//     paddingBottom: 12,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },

//   // Token List
//   tokenList: {
//     gap: 8,
//   },
//   tokenRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 16,
//     padding: 16,
//   },
//   tokenIcon: {
//     marginRight: 12,
//   },
//   solIcon: {
//     width: 44,
//     height: 44,
//     backgroundColor: '#9945FF',
//     borderRadius: 22,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   zecIcon: {
//     width: 44,
//     height: 44,
//     backgroundColor: '#F4B728',
//     borderRadius: 22,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   tokenIconText: {
//     fontSize: 24,
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//   },
//   tokenIconTextDark: {
//     fontSize: 20,
//     color: '#000000',
//     fontWeight: 'bold',
//   },
//   tokenInfo: {
//     flex: 1,
//   },
//   tokenName: {
//     fontSize: 16,
//     color: '#FFFFFF',
//     fontWeight: '600',
//     marginBottom: 2,
//   },
//   tokenBalance: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   tokenValue: {
//     alignItems: 'flex-end',
//   },
//   tokenUsd: {
//     fontSize: 16,
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   shieldedTag: {
//     backgroundColor: 'rgba(16, 185, 129, 0.15)',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 4,
//     marginTop: 4,
//   },
//   shieldedTagText: {
//     fontSize: 10,
//     color: '#10B981',
//   },
//   emptyTokens: {
//     padding: 40,
//     alignItems: 'center',
//   },
//   emptyTokensText: {
//     color: '#6B7280',
//     fontSize: 14,
//   },

//   // Quick Actions
//   quickActions: {
//     marginTop: 24,
//     gap: 12,
//   },
//  quickActionCard: {
//   backgroundColor: '#1E293B',
//   marginHorizontal: 16,
//   // marginBottom: 12,
//   marginTop: 12,
//   padding: 16,
//   borderRadius: 12,
//   flexDirection: 'row',
//   alignItems: 'center',
// },
// quickActionEmoji: {
//   fontSize: 28,
//   marginRight: 12,
// },
// quickActionInfo: {
//   flex: 1,
// },
// quickActionTitle: {
//   color: '#FFFFFF',
//   fontSize: 16,
//   fontWeight: '600',
// },
// quickActionDesc: {
//   color: '#6B7280',
//   fontSize: 12,
//   marginTop: 2,
// },
// quickActionArrow: {
//   color: '#4ECDC4',
//   fontSize: 20,
// },

//   // Security Footer
//   securityFooter: {
//     marginTop: 24,
//     paddingVertical: 16,
//     alignItems: 'center',
//   },
//   securityText: {
//     fontSize: 12,
//     color: '#4B5563',
//   },

//   // Empty State
//   emptyCard: {
//     backgroundColor: '#1E1E1E',
//     borderRadius: 24,
//     padding: 40,
//     marginTop: 60,
//     alignItems: 'center',
//   },
//   emptyEmoji: {
//     fontSize: 64,
//     marginBottom: 20,
//   },
//   emptyTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginBottom: 8,
//   },
//   featureButton: {
//   backgroundColor: '#1E293B',
//   padding: 16,
//   borderRadius: 12,
//   alignItems: 'center',
//   flex: 1,
//   marginHorizontal: 4,
// },
// featureIcon: {
//   fontSize: 28,
//   marginBottom: 8,
// },
// featureTitle: {
//   color: '#FFFFFF',
//   fontSize: 12,
//   fontWeight: '600',
// },
//   emptyText: {
//     fontSize: 16,
//     color: '#9CA3AF',
//     marginBottom: 24,
//     textAlign: 'center',
//   },
//   primaryButton: {
//     backgroundColor: '#4ECDC4',
//     paddingHorizontal: 40,
//     paddingVertical: 16,
//     borderRadius: 12,
//     width: '100%',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   primaryButtonText: {
//     color: '#000000',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   secondaryButton: {
//     backgroundColor: '#2A2A2A',
//     paddingHorizontal: 40,
//     paddingVertical: 16,
//     borderRadius: 12,
//     width: '100%',
//     alignItems: 'center',
//   },
//   secondaryButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default HomeScreen;

// import React, { useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   RefreshControl,
//   ActivityIndicator,
//   Platform,
//   Alert,
//   Dimensions,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList, VaultData, isUnifiedVault } from '../types/navigation';
// import { useVaults } from '../context/VaultContext';
// import api from '../services/api';
// import Clipboard from '@react-native-clipboard/clipboard';
// import LinearGradient from 'react-native-linear-gradient';

// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
// type RouteType = RouteProp<RootStackParamList, 'Home'>;

// const { width: SCREEN_WIDTH } = Dimensions.get('window');

// const HomeScreen = () => {
//   // ═══════════════════════════════════════════════════════════════
//   // ALL HOOKS MUST BE AT THE TOP
//   // ═══════════════════════════════════════════════════════════════
  
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<RouteType>();
//   const { activeVault, vaults, isLoading: contextLoading } = useVaults();
  
//   // State hooks
//   const [refreshing, setRefreshing] = useState(false);
//   const [solBalance, setSolBalance] = useState<number>(0);
//   const [solUsd, setSolUsd] = useState<number>(0);
//   const [zecBalance, setZecBalance] = useState<number>(0);
//   const [zecUsd, setZecUsd] = useState<number>(0);
//   const [loadingBalance, setLoadingBalance] = useState(false);
//   const [copied, setCopied] = useState(false);

//   // Get vault from route params or context
//   const routeVault = route.params?.vault;
//   const vault: VaultData | null = routeVault || (activeVault as VaultData | null);

//   const isSeedless = vault?.wallet_type === 'seedless';

//   // Check if unified vault
//   const unified = vault ? isUnifiedVault(vault) : false;
  
//   // Determine wallet type
//   const hasSol = !isSeedless && (vault?.chain === 'SOL' || vault?.sol?.address || vault?.chain === 'unified');
//   const hasZec = isSeedless || vault?.chain === 'ZEC' || vault?.zec?.address || vault?.zec?.unified_address || vault?.zec?.transparent_address || vault?.chain === 'unified';

//   // Load balances callback
//   const loadBalances = useCallback(async () => {
//     if (!vault) return;
    
//     setLoadingBalance(true);
    
//     // Reset balances first to avoid stale data
//     setSolBalance(0);
//     setSolUsd(0);
//     setZecBalance(0);
//     setZecUsd(0);
    
//     try {
//       // Load SOL balance if wallet has SOL
//       if (hasSol) {
//         const address = vault.sol?.address || vault.address;
//         if (address) {
//           try {
//             const response = await api.getSolBalance(address);
//             const bal = response.sol || response.balance || 0;
//             const usd = response.usd || bal * 200;
//             setSolBalance(bal);
//             setSolUsd(usd);
//           } catch (err) {
//             console.log('SOL balance error:', err);
//           }
//         }
//       }
      
//       // Load ZEC balance if wallet has ZEC
//       if (hasZec && (vault.zec?.address || vault.zec?.unified_address)) {
//         const zecAddress = vault.zec?.unified_address || vault.zec?.address;
//         try {
//           const response = await api.getZecBalance(zecAddress!);
//           const bal = response.shielded_balance || response.balance || response.total_zec || 0;
//           const usd = response.usd || bal * 40;
//           setZecBalance(bal);
//           setZecUsd(usd);
//         } catch (err) {
//           console.log('ZEC balance error:', err);
//         }
//       }
//     } catch (error) {
//       console.log('Balance fetch error:', error);
//     } finally {
//       setLoadingBalance(false);
//     }
//   }, [vault, hasSol, hasZec]);

//   // Load on focus
//   useFocusEffect(
//     useCallback(() => {
//       if (vault) {
//         loadBalances();
//       }
//     }, [vault, loadBalances])
//   );

//   // ═══════════════════════════════════════════════════════════════
//   // HELPER FUNCTIONS
//   // ═══════════════════════════════════════════════════════════════

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await loadBalances();
//     setRefreshing(false);
//   };

//   const copyAddress = () => {
//     const address = isSeedless 
//       ? (vault?.zec?.address || vault?.publicKey)
//       : (vault?.sol?.address || vault?.address);
    
//     if (!address) {
//       Alert.alert('No Address', 'No wallet address available to copy');
//       return;
//     }
    
//     Clipboard.setString(address);
//     setCopied(true);
//     Alert.alert('Copied!', `Address copied to clipboard:\n${address.slice(0, 8)}...${address.slice(-8)}`);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const formatAddress = (address: string | undefined) => {
//     if (!address) return 'No address';
//     return `${address.slice(0, 4)}...${address.slice(-4)}`;
//   };

//   const safeToFixed = (value: number | undefined | null, decimals: number = 2): string => {
//     if (value === undefined || value === null || isNaN(value)) {
//       return '0.00';
//     }
//     return value.toFixed(decimals);
//   };

//   // Calculate total - only include balances that actually exist
//   const totalUsd = (hasSol ? solUsd : 0) + (hasZec ? zecUsd : 0);

//   // ═══════════════════════════════════════════════════════════════
//   // RENDER - No vault state
//   // ═══════════════════════════════════════════════════════════════

//   if (!vault && !contextLoading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
//           <View style={styles.emptyCard}>
//             <Text style={styles.emptyEmoji}>🔐</Text>
//             <Text style={styles.emptyTitle}>No Wallet Found</Text>
//             <Text style={styles.emptyText}>Create a wallet to get started</Text>
//             <TouchableOpacity
//               style={styles.primaryButton}
//               onPress={() => navigation.navigate('ChainSelection')}
//             >
//               <Text style={styles.primaryButtonText}>Create Wallet</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.secondaryButton}
//               onPress={() => navigation.navigate('Recovery')}
//             >
//               <Text style={styles.secondaryButtonText}>Recover Wallet</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     );
//   }

//   if (contextLoading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#4ECDC4" />
//           <Text style={styles.loadingText}>Loading wallet...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // MAIN RENDER - VoltWallet Style
//   // ═══════════════════════════════════════════════════════════════
//   return (
//     <View style={styles.container}>
//       {/* Background Glow Effect */}
//       <View style={styles.glowContainer}>
//         <LinearGradient
//           colors={['#1E3A5F', '#0F2744', '#0A1628']}
//           style={styles.glowGradient}
//           start={{ x: 0.5, y: 0 }}
//           end={{ x: 0.5, y: 1 }}
//         />
//         {/* <View style={styles.glowOrb} />
//         <View style={styles.glowOrbSecondary} /> */}
//       </View>

//       <SafeAreaView style={styles.safeArea}>
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.scrollContent}
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4ECDC4" />
//           }
//         >
//           {/* Header - Wallet selector on left, settings on right */}
//           <View style={styles.header}>
//             <TouchableOpacity 
//               style={styles.walletSelector} 
//               onPress={copyAddress}
//               activeOpacity={0.7}
//             >
//               <Text style={styles.walletIcon}>⚡</Text>
//               <Text style={styles.walletName}>{vault?.vault_name || 'My Wallet'}</Text>
//               <Text style={styles.dropdownIcon}>{copied ? '✓' : '▼'}</Text>
//             </TouchableOpacity>
//             {/* <TouchableOpacity style={styles.settingsButton} activeOpacity={0.7}>
//               <Text style={styles.settingsIcon}>⚙</Text>
//             </TouchableOpacity> */}
//           </View>

//           {/* Total Balance - Big centered */}
//           <View style={styles.balanceSection}>
//             {loadingBalance ? (
//               <ActivityIndicator color="#FFFFFF" size="large" />
//             ) : (
//               <>
//                 <Text style={styles.totalBalance}>${safeToFixed(totalUsd, 2)}</Text>
//                 <TouchableOpacity style={styles.balanceHintContainer}>
//                   <Text style={styles.balanceHint}>
//                     {totalUsd === 0 ? 'Fund your wallet to get started' : 'Hide balance'}
//                   </Text>
//                 </TouchableOpacity>
//               </>
//             )}
//           </View>

//           {/* Action Buttons Row */}
//           <View style={styles.actionRow}>
//             <TouchableOpacity
//               style={styles.actionItem}
//               onPress={() => navigation.navigate('Swap', { vault: vault || undefined })}
//               activeOpacity={0.7}
//             >
//               <View style={[styles.actionIconBg, styles.actionIconBgActive]}>
//                 <Text style={[styles.actionIcon, styles.actionIconActive]}>⇄</Text>
//               </View>
//               <Text style={styles.actionLabel}>Swap</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.actionItem}
//               onPress={() => vault && navigation.navigate('Send', { vault, chain: 'SOL' })}
//               activeOpacity={0.7}
//             >
//               <View style={styles.actionIconBg}>
//                 <Text style={styles.actionIcon}>↗</Text>
//               </View>
//               <Text style={styles.actionLabel}>Send</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.actionItem}
//               onPress={() => navigation.navigate('FundWallet', { vault: vault || undefined })}
//               activeOpacity={0.7}
//             >
//               <View style={styles.actionIconBg}>
//                 <Text style={styles.actionIcon}>$</Text>
//               </View>
//               <Text style={styles.actionLabel}>Buy</Text>
//             </TouchableOpacity>

//             {/* <TouchableOpacity
//               style={styles.actionItem}
//               onPress={() => vault && navigation.navigate('Receive', { vault, chain: 'SOL' })}
//               activeOpacity={0.7}
//             >
//               <View style={styles.actionIconBg}>
//                 <Text style={styles.actionIcon}>↓</Text>
//               </View>
//               <Text style={styles.actionLabel}>Receive</Text>
//             </TouchableOpacity> */}
//           </View>

//           {/* Tokens Section Header */}
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Portfolio</Text>
//             <View style={styles.sectionActions}>
//               {/* <TouchableOpacity style={styles.sectionActionBtn}>
//                 <Text style={styles.sectionActionIcon}>🔍</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.sectionActionBtn}>
//                 <Text style={styles.sectionActionIcon}>⊞</Text>
//               </TouchableOpacity> */}
//             </View>
//           </View>

//           {/* Token List */}
//           <View style={styles.tokenList}>
//             {/* SOL Token Row */}
//             {hasSol && (
//               <TouchableOpacity style={styles.tokenRow} activeOpacity={0.7}>
//                 <View style={styles.tokenIcon}>
//                   <View style={styles.solIcon}>
//                     <Text style={styles.tokenIconText}>◎</Text>
//                   </View>
//                 </View>
//                 <View style={styles.tokenInfo}>
//                   <Text style={styles.tokenName}>Solana</Text>
//                   <Text style={styles.tokenBalance}>{safeToFixed(solBalance, 4)} SOL</Text>
//                 </View>
//                 <View style={styles.tokenValue}>
//                   <Text style={styles.tokenUsd}>${safeToFixed(solUsd, 2)}</Text>
//                 </View>
//                 <Text style={styles.chevron}>›</Text>
//               </TouchableOpacity>
//             )}

//             {/* ZEC Token Row */}
//             {hasZec && (vault?.zec?.address || vault?.zec?.unified_address) && (
//               <TouchableOpacity style={styles.tokenRow} activeOpacity={0.7}>
//                 <View style={styles.tokenIcon}>
//                   <View style={styles.zecIcon}>
//                     <Text style={styles.tokenIconTextDark}>Z</Text>
//                   </View>
//                 </View>
//                 <View style={styles.tokenInfo}>
//                   <Text style={styles.tokenName}>Zcash</Text>
//                   <Text style={styles.tokenBalance}>{safeToFixed(zecBalance, 4)} ZEC</Text>
//                 </View>
//                 <View style={styles.tokenValue}>
//                   <Text style={styles.tokenUsd}>${safeToFixed(zecUsd, 2)}</Text>
//                   <View style={styles.shieldedTag}>
//                     <Text style={styles.shieldedTagText}>◈ Shielded</Text>
//                   </View>
//                 </View>
//                 <Text style={styles.chevron}>›</Text>
//               </TouchableOpacity>
//             )}

//             {/* Empty state if no tokens */}
//             {!hasSol && !hasZec && (
//               <View style={styles.emptyTokens}>
//                 <Text style={styles.emptyTokensText}>No tokens yet</Text>
//               </View>
//             )}
//           </View>

//           {/* Quick Actions */}
//           {vault && (
//             <>
//               {!isSeedless && (
//                 <TouchableOpacity
//                   style={styles.quickActionCard}
//                   onPress={() => navigation.navigate('DarkPool', { vault_id: vault.vault_id, vault })}
//                   activeOpacity={0.7}
//                 >
//                   <View style={styles.quickActionIconBg}>
//                     <Text style={styles.quickActionIcon}>◈</Text>
//                   </View>
//                   <View style={styles.quickActionInfo}>
//                     <Text style={styles.quickActionTitle}>Dark Pool Trading</Text>
//                     <Text style={styles.quickActionDesc}>MEV-protected encrypted orders</Text>
//                   </View>
//                   <Text style={styles.quickActionArrow}>→</Text>
//                 </TouchableOpacity>
//               )}

//               {!isSeedless && (
//                 <TouchableOpacity
//                   style={styles.quickActionCard}
//                   onPress={() => navigation.navigate('Lending', { vault_id: vault.vault_id, vault })}
//                   activeOpacity={0.7}
//                 >
//                   <View style={styles.quickActionIconBg}>
//                     <Text style={styles.quickActionIcon}>⬡</Text>
//                   </View>
//                   <View style={styles.quickActionInfo}>
//                     <Text style={styles.quickActionTitle}>Private Lending</Text>
//                     <Text style={styles.quickActionDesc}>Borrow with Arcium privacy</Text>
//                   </View>
//                   <Text style={styles.quickActionArrow}>→</Text>
//                 </TouchableOpacity>
//               )}

//               <TouchableOpacity
//                 style={styles.quickActionCard}
//                 onPress={() => navigation.navigate('AgentDashboard', { vault })}
//                 activeOpacity={0.7}
//               >
//                 <View style={styles.quickActionIconBg}>
//                   <Text style={styles.quickActionIcon}>⬢</Text>
//                 </View>
//                 <View style={styles.quickActionInfo}>
//                   <Text style={styles.quickActionTitle}>AI Trading Agent</Text>
//                   <Text style={styles.quickActionDesc}>Auto-trade with Zynapse signals</Text>
//                 </View>
//                 <Text style={styles.quickActionArrow}>→</Text>
//               </TouchableOpacity>

//               {!isSeedless && (
//                 <TouchableOpacity
//                   style={styles.quickActionCard}
//                   onPress={() => navigation.navigate('Backup', { vault })}
//                   activeOpacity={0.7}
//                 >
//                   <View style={styles.quickActionIconBg}>
//                     <Text style={styles.quickActionIcon}>⏣</Text>
//                   </View>
//                   <View style={styles.quickActionInfo}>
//                     <Text style={styles.quickActionTitle}>Backup & Recovery</Text>
//                     <Text style={styles.quickActionDesc}>Secure your wallet</Text>
//                   </View>
//                   <Text style={styles.quickActionArrow}>→</Text>
//                 </TouchableOpacity>
//               )}
//             </>
//           )}

//           {/* Security Footer */}
//           <View style={styles.securityFooter}>
//             <Text style={styles.securityText}>
//               {isSeedless 
//                 ? '◈ Secured by Oasis TEE • TOTP Protected'
//                 : '◈ Powered by ZkAGI 2025'
//               }
//             </Text>
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </View>
//   );
// };

// // ═══════════════════════════════════════════════════════════════
// // STYLES - VoltWallet Premium Dark Theme with Glow
// // ═══════════════════════════════════════════════════════════════
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0A1628',
//   },
//   safeArea: {
//     flex: 1,
//   },
  
//   // Background Glow Effects
//   glowContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 400,
//     overflow: 'hidden',
//   },
//   glowGradient: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 400,
//   },
//   glowOrb: {
//     position: 'absolute',
//     top: 40,
//     left: SCREEN_WIDTH / 2 - 150,
//     width: 300,
//     height: 300,
//     borderRadius: 150,
//     backgroundColor: '#1E4976',
//     opacity: 0.4,
//     // Blur effect simulation
//     shadowColor: '#3B82F6',
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.8,
//     shadowRadius: 100,
//   },
//   glowOrbSecondary: {
//     position: 'absolute',
//     top: 80,
//     left: SCREEN_WIDTH / 2 - 100,
//     width: 200,
//     height: 200,
//     borderRadius: 100,
//     backgroundColor: '#2563EB',
//     opacity: 0.2,
//   },

//   scrollContent: {
//     paddingHorizontal: 20,
//     paddingBottom: 40,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     color: '#9CA3AF',
//     marginTop: 12,
//     fontSize: 14,
//   },

//   // Header - VoltWallet style
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: 12,
//     paddingBottom: 16,
//   },
//   walletSelector: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(17, 24, 39, 0.8)',
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 24,
//     borderWidth: 1,
//     borderColor: 'rgba(59, 130, 246, 0.3)',
//   },
//   walletIcon: {
//     fontSize: 14,
//     color: '#FBBF24',
//     marginRight: 8,
//   },
//   walletName: {
//     fontSize: 15,
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   dropdownIcon: {
//     fontSize: 10,
//     color: '#6B7280',
//     marginLeft: 8,
//   },
//   settingsButton: {
//     width: 44,
//     height: 44,
//     backgroundColor: 'rgba(17, 24, 39, 0.8)',
//     borderRadius: 22,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(59, 130, 246, 0.3)',
//   },
//   settingsIcon: {
//     fontSize: 20,
//     color: '#9CA3AF',
//   },

//   // Balance Section
//   balanceSection: {
//     alignItems: 'center',
//     paddingVertical: 40,
//   },
//   totalBalance: {
//     fontSize: 56,
//     color: '#FFFFFF',
//     fontWeight: '700',
//     letterSpacing: -2,
//     textShadowColor: 'rgba(59, 130, 246, 0.5)',
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 20,
//   },
//   balanceHintContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(17, 24, 39, 0.6)',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginTop: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(78, 205, 196, 0.3)',
//   },
//   balanceHintIcon: {
//     fontSize: 14,
//     marginRight: 6,
//   },
//   balanceHint: {
//     fontSize: 14,
//     color: '#4ECDC4',
//   },

//   // Action Row
//   actionRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     paddingVertical: 24,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(59, 130, 246, 0.2)',
//   },
//   actionItem: {
//     alignItems: 'center',
//     marginHorizontal: 14,
//   },
//   actionIconBg: {
//     width: 56,
//     height: 56,
//     backgroundColor: 'rgba(17, 24, 39, 0.8)',
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: 'rgba(59, 130, 246, 0.3)',
//   },
//   actionIconBgActive: {
//     backgroundColor: '#4ECDC4',
//     borderColor: '#4ECDC4',
//   },
//   actionIcon: {
//     fontSize: 22,
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   actionIconActive: {
//     color: '#0A1628',
//   },
//   actionLabel: {
//     fontSize: 13,
//     color: '#FFFFFF',
//     fontWeight: '500',
//   },

//   // Section Header
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: 28,
//     paddingBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     color: '#FFFFFF',
//     fontWeight: '600',
//     borderBottomWidth: 2,
//     borderBottomColor: '#4ECDC4',
//     paddingBottom: 8,
//   },
//   sectionActions: {
//     flexDirection: 'row',
//   },
//   sectionActionBtn: {
//     width: 36,
//     height: 36,
//     backgroundColor: 'rgba(17, 24, 39, 0.8)',
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 8,
//     borderWidth: 1,
//     borderColor: 'rgba(59, 130, 246, 0.3)',
//   },
//   sectionActionIcon: {
//     fontSize: 16,
//     color: '#9CA3AF',
//   },

//   // Token List
//   tokenList: {
//     backgroundColor: 'rgba(17, 24, 39, 0.8)',
//     borderRadius: 16,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: 'rgba(59, 130, 246, 0.2)',
//   },
//   tokenRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(59, 130, 246, 0.15)',
//   },
//   tokenIcon: {
//     marginRight: 12,
//   },
//   solIcon: {
//     width: 44,
//     height: 44,
//     backgroundColor: '#9945FF',
//     borderRadius: 22,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   zecIcon: {
//     width: 44,
//     height: 44,
//     backgroundColor: '#F4B728',
//     borderRadius: 22,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   tokenIconText: {
//     fontSize: 22,
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//   },
//   tokenIconTextDark: {
//     fontSize: 18,
//     color: '#000000',
//     fontWeight: 'bold',
//   },
//   tokenInfo: {
//     flex: 1,
//   },
//   tokenName: {
//     fontSize: 16,
//     color: '#FFFFFF',
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   tokenBalance: {
//     fontSize: 13,
//     color: '#6B7280',
//   },
//   tokenValue: {
//     alignItems: 'flex-end',
//     marginRight: 8,
//   },
//   tokenUsd: {
//     fontSize: 16,
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   shieldedTag: {
//     backgroundColor: 'rgba(78, 205, 196, 0.15)',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 6,
//     marginTop: 6,
//   },
//   shieldedTagText: {
//     fontSize: 11,
//     color: '#4ECDC4',
//     fontWeight: '500',
//   },
//   chevron: {
//     fontSize: 20,
//     color: '#4B5563',
//   },
//   emptyTokens: {
//     padding: 40,
//     alignItems: 'center',
//   },
//   emptyTokensText: {
//     color: '#6B7280',
//     fontSize: 14,
//   },

//   // Quick Actions
//   quickActionCard: {
//     backgroundColor: 'rgba(17, 24, 39, 0.8)',
//     marginTop: 12,
//     padding: 16,
//     borderRadius: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(59, 130, 246, 0.2)',
//   },
//   quickActionIconBg: {
//     width: 44,
//     height: 44,
//     backgroundColor: 'rgba(30, 58, 95, 0.8)',
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 14,
//   },
//   quickActionIcon: {
//     fontSize: 20,
//     color: '#4ECDC4',
//   },
//   quickActionInfo: {
//     flex: 1,
//   },
//   quickActionTitle: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   quickActionDesc: {
//     color: '#6B7280',
//     fontSize: 13,
//     marginTop: 4,
//   },
//   quickActionArrow: {
//     color: '#4ECDC4',
//     fontSize: 18,
//   },

//   // Security Footer
//   securityFooter: {
//     marginTop: 28,
//     paddingVertical: 16,
//     alignItems: 'center',
//   },
//   securityText: {
//     fontSize: 12,
//     color: '#4B5563',
//   },

//   // Empty State
//   emptyCard: {
//     backgroundColor: 'rgba(17, 24, 39, 0.8)',
//     borderRadius: 24,
//     padding: 40,
//     marginTop: 60,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(59, 130, 246, 0.2)',
//   },
//   emptyEmoji: {
//     fontSize: 64,
//     marginBottom: 20,
//   },
//   emptyTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginBottom: 8,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#9CA3AF',
//     marginBottom: 24,
//     textAlign: 'center',
//   },
//   primaryButton: {
//     backgroundColor: '#4ECDC4',
//     paddingHorizontal: 40,
//     paddingVertical: 16,
//     borderRadius: 16,
//     width: '100%',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   primaryButtonText: {
//     color: '#000000',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   secondaryButton: {
//     backgroundColor: 'rgba(31, 41, 55, 0.8)',
//     paddingHorizontal: 40,
//     paddingVertical: 16,
//     borderRadius: 16,
//     width: '100%',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(59, 130, 246, 0.3)',
//   },
//   secondaryButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default HomeScreen;

// import React, { useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   RefreshControl,
//   ActivityIndicator,
//   Alert,
//   Dimensions,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList, VaultData, isUnifiedVault } from '../types/navigation';
// import { useVaults } from '../context/VaultContext';
// import api from '../services/api';
// import Clipboard from '@react-native-clipboard/clipboard';
// import LinearGradient from 'react-native-linear-gradient';
// import Svg, { Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';

// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
// type RouteType = RouteProp<RootStackParamList, 'Home'>;

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// // ═══════════════════════════════════════════════════════════════
// // VULTISIG THEME COLORS
// // ═══════════════════════════════════════════════════════════════
// const COLORS = {
//   // Backgrounds
//   bgPrimary: '#02111B',
//   bgSecondary: '#061624',
//   bgCard: '#0D2137',
  
//   // Accents
//   accent: '#33E6BF',
//   accentBlue: '#2A5298',
//   accentGlow: '#1E88E5',
  
//   // Text
//   textPrimary: '#FFFFFF',
//   textSecondary: '#8A9BAE',
//   textMuted: '#5A6B7E',
  
//   // Borders
//   border: 'rgba(42, 82, 152, 0.3)',
//   borderLight: 'rgba(42, 82, 152, 0.15)',
// };

// // Gradient Halo Component
// const GradientHalo = () => (
//   <View style={styles.haloContainer}>
//     <Svg width={SCREEN_WIDTH} height={320} style={styles.haloSvg}>
//       <Defs>
//         <RadialGradient id="haloGrad" cx="50%" cy="40%" rx="60%" ry="50%">
//           <Stop offset="0%" stopColor="#1E4976" stopOpacity="0.6" />
//           <Stop offset="40%" stopColor="#153556" stopOpacity="0.3" />
//           <Stop offset="70%" stopColor="#0A2540" stopOpacity="0.15" />
//           <Stop offset="100%" stopColor="#02111B" stopOpacity="0" />
//         </RadialGradient>
//       </Defs>
//       <Ellipse
//         cx={SCREEN_WIDTH / 2}
//         cy={130}
//         rx={SCREEN_WIDTH * 0.7}
//         ry={160}
//         fill="url(#haloGrad)"
//       />
//     </Svg>
//   </View>
// );

// const HomeScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<RouteType>();
//   const { activeVault, vaults, isLoading: contextLoading } = useVaults();
  
//   const [refreshing, setRefreshing] = useState(false);
//   const [solBalance, setSolBalance] = useState<number>(0);
//   const [solUsd, setSolUsd] = useState<number>(0);
//   const [zecBalance, setZecBalance] = useState<number>(0);
//   const [zecUsd, setZecUsd] = useState<number>(0);
//   const [loadingBalance, setLoadingBalance] = useState(false);
//   const [copied, setCopied] = useState(false);

//   const routeVault = route.params?.vault;
//   const vault: VaultData | null = routeVault || (activeVault as VaultData | null);
//   const isSeedless = vault?.wallet_type === 'seedless';
//   const unified = vault ? isUnifiedVault(vault) : false;
  
//   const hasSol = !isSeedless && (vault?.chain === 'SOL' || vault?.sol?.address || vault?.chain === 'unified');
//   const hasZec = isSeedless || vault?.chain === 'ZEC' || vault?.zec?.address || vault?.zec?.unified_address || vault?.zec?.transparent_address || vault?.chain === 'unified';

//   const loadBalances = useCallback(async () => {
//     if (!vault) return;
//     setLoadingBalance(true);
//     setSolBalance(0);
//     setSolUsd(0);
//     setZecBalance(0);
//     setZecUsd(0);
    
//     try {
//       if (hasSol) {
//         const address = vault.sol?.address || vault.address;
//         if (address) {
//           try {
//             const response = await api.getSolBalance(address);
//             const bal = response.sol || response.balance || 0;
//             const usd = response.usd || bal * 200;
//             setSolBalance(bal);
//             setSolUsd(usd);
//           } catch (err) {
//             console.log('SOL balance error:', err);
//           }
//         }
//       }
      
//       if (hasZec && (vault.zec?.address || vault.zec?.unified_address)) {
//         const zecAddress = vault.zec?.unified_address || vault.zec?.address;
//         try {
//           const response = await api.getZecBalance(zecAddress!);
//           const bal = response.shielded_balance || response.balance || response.total_zec || 0;
//           const usd = response.usd || bal * 40;
//           setZecBalance(bal);
//           setZecUsd(usd);
//         } catch (err) {
//           console.log('ZEC balance error:', err);
//         }
//       }
//     } catch (error) {
//       console.log('Balance fetch error:', error);
//     } finally {
//       setLoadingBalance(false);
//     }
//   }, [vault, hasSol, hasZec]);

//   useFocusEffect(
//     useCallback(() => {
//       if (vault) {
//         loadBalances();
//       }
//     }, [vault, loadBalances])
//   );

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await loadBalances();
//     setRefreshing(false);
//   };

//   const copyAddress = () => {
//     const address = isSeedless 
//       ? (vault?.zec?.address || vault?.publicKey)
//       : (vault?.sol?.address || vault?.address);
    
//     if (!address) {
//       Alert.alert('No Address', 'No wallet address available to copy');
//       return;
//     }
    
//     Clipboard.setString(address);
//     setCopied(true);
//     Alert.alert('Copied!', `Address copied to clipboard:\n${address.slice(0, 8)}...${address.slice(-8)}`);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const formatAddress = (address: string | undefined) => {
//     if (!address) return '';
//     return `${address.slice(0, 6)}...${address.slice(-4)}`;
//   };

//   const safeToFixed = (value: number | undefined | null, decimals: number = 2): string => {
//     if (value === undefined || value === null || isNaN(value)) {
//       return '0.00';
//     }
//     return value.toFixed(decimals);
//   };

//   const totalUsd = (hasSol ? solUsd : 0) + (hasZec ? zecUsd : 0);

//   // Empty State
//   if (!vault && !contextLoading) {
//     return (
//       <View style={styles.container}>
//         <GradientHalo />
//         <SafeAreaView style={styles.safeArea}>
//           <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
//             <View style={styles.emptyCard}>
//               <View style={styles.emptyIconContainer}>
//                 <Text style={styles.emptyEmoji}>🔐</Text>
//               </View>
//               <Text style={styles.emptyTitle}>No Wallet Found</Text>
//               <Text style={styles.emptyText}>Create a wallet to get started</Text>
//               <TouchableOpacity
//                 style={styles.primaryButton}
//                 onPress={() => navigation.navigate('ChainSelection')}
//                 activeOpacity={0.8}
//               >
//                 <Text style={styles.primaryButtonText}>Create Wallet</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.secondaryButton}
//                 onPress={() => navigation.navigate('Recovery')}
//                 activeOpacity={0.8}
//               >
//                 <Text style={styles.secondaryButtonText}>Recover Wallet</Text>
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
//         </SafeAreaView>
//       </View>
//     );
//   }

//   // Loading State
//   if (contextLoading) {
//     return (
//       <View style={styles.container}>
//         <GradientHalo />
//         <SafeAreaView style={styles.safeArea}>
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color={COLORS.accent} />
//             <Text style={styles.loadingText}>Loading wallet...</Text>
//           </View>
//         </SafeAreaView>
//       </View>
//     );
//   }

//   // Main Screen
//   return (
//     <View style={styles.container}>
//       {/* Gradient Halo Background */}
//       <GradientHalo />

//       <SafeAreaView style={styles.safeArea}>
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.scrollContent}
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />
//           }
//         >
//           {/* Header */}
//           <View style={styles.header}>
//             <TouchableOpacity 
//               style={styles.vaultSelector} 
//               onPress={copyAddress}
//               activeOpacity={0.7}
//             >
//               <Text style={styles.vaultIcon}>⚡</Text>
//               <Text style={styles.vaultName}>{vault?.vault_name || 'My Wallet'}</Text>
//               <Text style={styles.dropdownArrow}>{copied ? '✓' : '▾'}</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity style={styles.settingsBtn} activeOpacity={0.7}>
//               <View style={styles.settingsIconContainer}>
//                 <Text style={styles.settingsIcon}>⚙</Text>
//               </View>
//             </TouchableOpacity>
//           </View>

//           {/* Balance Display */}
//           <View style={styles.balanceContainer}>
//             {loadingBalance ? (
//               <ActivityIndicator color={COLORS.textPrimary} size="large" />
//             ) : (
//               <>
//                 <Text style={styles.balanceAmount}>${safeToFixed(totalUsd, 2)}</Text>
//                 <TouchableOpacity style={styles.hideBalanceBtn} activeOpacity={0.7}>
//                   <Text style={styles.hideBalanceIcon}>◉</Text>
//                   <Text style={styles.hideBalanceText}>Hide balance</Text>
//                 </TouchableOpacity>
//               </>
//             )}
//           </View>

//           {/* Action Buttons */}
//           <View style={styles.actionsRow}>
//             <TouchableOpacity
//               style={styles.actionBtn}
//               onPress={() => navigation.navigate('Swap', { vault: vault || undefined })}
//               activeOpacity={0.7}
//             >
//               <View style={[styles.actionIconWrap, styles.actionIconActive]}>
//                 <Text style={styles.actionIconTextActive}>⇄</Text>
//               </View>
//               <Text style={styles.actionText}>Swap</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.actionBtn}
//               onPress={() => vault && navigation.navigate('Send', { vault, chain: 'SOL' })}
//               activeOpacity={0.7}
//             >
//               <View style={styles.actionIconWrap}>
//                 <Text style={styles.actionIconText}>↗</Text>
//               </View>
//               <Text style={styles.actionText}>Send</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.actionBtn}
//               onPress={() => navigation.navigate('FundWallet', { vault: vault || undefined })}
//               activeOpacity={0.7}
//             >
//               <View style={styles.actionIconWrap}>
//                 <Text style={styles.actionIconText}>↓</Text>
//               </View>
//               <Text style={styles.actionText}>Buy</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.actionBtn}
//               onPress={() => navigation.navigate('AgentDashboard', { vault })}
//               activeOpacity={0.7}
//             >
//               <View style={styles.actionIconWrap}>
//                 <Text style={styles.actionIconText}>◎</Text>
//               </View>
//               <Text style={styles.actionText}>Agent</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Portfolio Header */}
//           <View style={styles.portfolioHeader}>
//             <Text style={styles.portfolioTitle}>Portfolio</Text>
//             <View style={styles.portfolioActions}>
//               <TouchableOpacity style={styles.portfolioActionBtn} activeOpacity={0.7}>
//                 <Text style={styles.portfolioActionIcon}>⌕</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.portfolioActionBtn} activeOpacity={0.7}>
//                 <Text style={styles.portfolioActionIcon}>⊞</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Token List */}
//           <View style={styles.tokenList}>
//             {/* SOL Row */}
//             {hasSol && (
//               <TouchableOpacity style={styles.tokenRow} activeOpacity={0.7}>
//                 <View style={styles.tokenIcon}>
//                   <LinearGradient
//                     colors={['#9945FF', '#14F195']}
//                     style={styles.tokenIconGradient}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                   >
//                     <Text style={styles.tokenIconSymbol}>◎</Text>
//                   </LinearGradient>
//                 </View>
//                 <View style={styles.tokenDetails}>
//                   <Text style={styles.tokenName}>Solana</Text>
//                   <View style={styles.tokenAddressWrap}>
//                     <Text style={styles.tokenAddress}>
//                       {formatAddress(vault?.sol?.address || vault?.address)}
//                     </Text>
//                     <Text style={styles.copyBtn}>⧉</Text>
//                   </View>
//                 </View>
//                 <View style={styles.tokenValues}>
//                   <Text style={styles.tokenUsd}>${safeToFixed(solUsd, 2)}</Text>
//                   <Text style={styles.tokenBal}>{safeToFixed(solBalance, 0)} SOL</Text>
//                 </View>
//                 <Text style={styles.rowChevron}>›</Text>
//               </TouchableOpacity>
//             )}

//             {/* ZEC Row */}
//             {hasZec && (vault?.zec?.address || vault?.zec?.unified_address) && (
//               <TouchableOpacity style={[styles.tokenRow, !hasSol && styles.tokenRowFirst]} activeOpacity={0.7}>
//                 <View style={styles.tokenIcon}>
//                   <View style={styles.tokenIconZec}>
//                     <Text style={styles.tokenIconSymbolDark}>Z</Text>
//                   </View>
//                 </View>
//                 <View style={styles.tokenDetails}>
//                   <Text style={styles.tokenName}>Zcash</Text>
//                   <View style={styles.tokenAddressWrap}>
//                     <Text style={styles.tokenAddress}>
//                       {formatAddress(vault?.zec?.unified_address || vault?.zec?.address)}
//                     </Text>
//                     <Text style={styles.copyBtn}>⧉</Text>
//                   </View>
//                 </View>
//                 <View style={styles.tokenValues}>
//                   <Text style={styles.tokenUsd}>${safeToFixed(zecUsd, 2)}</Text>
//                   <Text style={styles.tokenBal}>{safeToFixed(zecBalance, 0)} ZEC</Text>
//                 </View>
//                 <Text style={styles.rowChevron}>›</Text>
//               </TouchableOpacity>
//             )}

//             {!hasSol && !hasZec && (
//               <View style={styles.emptyTokens}>
//                 <Text style={styles.emptyTokensText}>No assets yet</Text>
//               </View>
//             )}
//           </View>

//           {/* Features Section */}
//           {vault && !isSeedless && (
//             <>
//               <View style={styles.featuresHeader}>
//                 <Text style={styles.featuresTitle}>Features</Text>
//               </View>

//               <TouchableOpacity
//                 style={styles.featureRow}
//                 onPress={() => navigation.navigate('DarkPool', { vault_id: vault.vault_id, vault })}
//                 activeOpacity={0.7}
//               >
//                 <View style={styles.featureIcon}>
//                   <Text style={styles.featureIconText}>◈</Text>
//                 </View>
//                 <View style={styles.featureInfo}>
//                   <Text style={styles.featureTitle}>Dark Pool Trading</Text>
//                   <Text style={styles.featureDesc}>MEV-protected encrypted orders</Text>
//                 </View>
//                 <Text style={styles.featureArrow}>→</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.featureRow}
//                 onPress={() => navigation.navigate('Backup', { vault })}
//                 activeOpacity={0.7}
//               >
//                 <View style={styles.featureIcon}>
//                   <Text style={styles.featureIconText}>⬡</Text>
//                 </View>
//                 <View style={styles.featureInfo}>
//                   <Text style={styles.featureTitle}>Backup & Recovery</Text>
//                   <Text style={styles.featureDesc}>Secure your wallet keys</Text>
//                 </View>
//                 <Text style={styles.featureArrow}>→</Text>
//               </TouchableOpacity>
//             </>
//           )}

//           {/* Footer */}
//           <View style={styles.footer}>
//             <Text style={styles.footerText}>
//               {isSeedless ? '◈ Secured by Oasis TEE' : '◈ Powered by ZkAGI'}
//             </Text>
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </View>
//   );
// };

// // ═══════════════════════════════════════════════════════════════
// // STYLES - VULTISIG PRODUCTION DESIGN
// // ═══════════════════════════════════════════════════════════════
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.bgPrimary,
//   },
//   safeArea: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingHorizontal: 16,
//     paddingBottom: 32,
//   },

//   // Gradient Halo
//   haloContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 320,
//     overflow: 'hidden',
//   },
//   haloSvg: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//   },

//   // Loading
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     color: COLORS.textSecondary,
//     marginTop: 12,
//     fontSize: 14,
//   },

//   // Header
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: 8,
//     paddingBottom: 20,
//   },
//   vaultSelector: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.bgCard,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   vaultIcon: {
//     fontSize: 14,
//     color: '#F7931A',
//     marginRight: 8,
//   },
//   vaultName: {
//     fontSize: 14,
//     color: COLORS.textPrimary,
//     fontWeight: '500',
//   },
//   dropdownArrow: {
//     fontSize: 10,
//     color: COLORS.textSecondary,
//     marginLeft: 6,
//   },
//   settingsBtn: {
//     padding: 4,
//   },
//   settingsIconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'transparent',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   settingsIcon: {
//     fontSize: 18,
//     color: COLORS.textSecondary,
//   },

//   // Balance
//   balanceContainer: {
//     alignItems: 'center',
//     paddingTop: 24,
//     paddingBottom: 32,
//   },
//   balanceAmount: {
//     fontSize: 44,
//     color: COLORS.textPrimary,
//     fontWeight: '300',
//     letterSpacing: -1,
//   },
//   hideBalanceBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   hideBalanceIcon: {
//     fontSize: 12,
//     color: COLORS.accent,
//     marginRight: 6,
//   },
//   hideBalanceText: {
//     fontSize: 13,
//     color: COLORS.accent,
//     fontWeight: '500',
//   },

//   // Actions
//   actionsRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     paddingBottom: 24,
//     gap: 20,
//   },
//   actionBtn: {
//     alignItems: 'center',
//     width: 64,
//   },
//   actionIconWrap: {
//     width: 52,
//     height: 52,
//     backgroundColor: COLORS.bgCard,
//     borderRadius: 14,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   actionIconActive: {
//     backgroundColor: COLORS.accent,
//     borderColor: COLORS.accent,
//   },
//   actionIconText: {
//     fontSize: 20,
//     color: COLORS.textPrimary,
//   },
//   actionIconTextActive: {
//     fontSize: 20,
//     color: COLORS.bgPrimary,
//     fontWeight: '600',
//   },
//   actionText: {
//     fontSize: 12,
//     color: COLORS.textSecondary,
//     fontWeight: '500',
//   },

//   // Portfolio
//   portfolioHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: 8,
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.borderLight,
//   },
//   portfolioTitle: {
//     fontSize: 15,
//     color: COLORS.textPrimary,
//     fontWeight: '500',
//   },
//   portfolioActions: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   portfolioActionBtn: {
//     width: 36,
//     height: 36,
//     backgroundColor: COLORS.bgCard,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   portfolioActionIcon: {
//     fontSize: 16,
//     color: COLORS.textSecondary,
//   },

//   // Token List
//   tokenList: {
//     backgroundColor: COLORS.bgCard,
//     borderRadius: 16,
//     marginTop: 12,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     overflow: 'hidden',
//   },
//   tokenRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.borderLight,
//   },
//   tokenRowFirst: {
//     borderBottomWidth: 0,
//   },
//   tokenIcon: {
//     marginRight: 12,
//   },
//   tokenIconGradient: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   tokenIconZec: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#F4B728',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   tokenIconSymbol: {
//     fontSize: 18,
//     color: COLORS.textPrimary,
//     fontWeight: '600',
//   },
//   tokenIconSymbolDark: {
//     fontSize: 16,
//     color: '#1A1A1A',
//     fontWeight: '700',
//   },
//   tokenDetails: {
//     flex: 1,
//   },
//   tokenName: {
//     fontSize: 15,
//     color: COLORS.textPrimary,
//     fontWeight: '500',
//     marginBottom: 2,
//   },
//   tokenAddressWrap: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   tokenAddress: {
//     fontSize: 12,
//     color: COLORS.textMuted,
//   },
//   copyBtn: {
//     fontSize: 12,
//     color: COLORS.textMuted,
//     marginLeft: 4,
//   },
//   tokenValues: {
//     alignItems: 'flex-end',
//     marginRight: 8,
//   },
//   tokenUsd: {
//     fontSize: 15,
//     color: COLORS.textPrimary,
//     fontWeight: '500',
//   },
//   tokenBal: {
//     fontSize: 12,
//     color: COLORS.textMuted,
//     marginTop: 2,
//   },
//   rowChevron: {
//     fontSize: 20,
//     color: COLORS.textMuted,
//   },
//   emptyTokens: {
//     padding: 32,
//     alignItems: 'center',
//   },
//   emptyTokensText: {
//     color: COLORS.textMuted,
//     fontSize: 14,
//   },

//   // Features
//   featuresHeader: {
//     paddingTop: 24,
//     paddingBottom: 12,
//   },
//   featuresTitle: {
//     fontSize: 15,
//     color: COLORS.textPrimary,
//     fontWeight: '500',
//   },
//   featureRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.bgCard,
//     padding: 14,
//     borderRadius: 14,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   featureIcon: {
//     width: 40,
//     height: 40,
//     backgroundColor: 'rgba(42, 82, 152, 0.3)',
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   featureIconText: {
//     fontSize: 18,
//     color: COLORS.accent,
//   },
//   featureInfo: {
//     flex: 1,
//   },
//   featureTitle: {
//     fontSize: 14,
//     color: COLORS.textPrimary,
//     fontWeight: '500',
//     marginBottom: 2,
//   },
//   featureDesc: {
//     fontSize: 12,
//     color: COLORS.textMuted,
//   },
//   featureArrow: {
//     fontSize: 16,
//     color: COLORS.accent,
//   },

//   // Footer
//   footer: {
//     paddingTop: 24,
//     paddingBottom: 8,
//     alignItems: 'center',
//   },
//   footerText: {
//     fontSize: 11,
//     color: COLORS.textMuted,
//   },

//   // Empty State
//   emptyCard: {
//     backgroundColor: COLORS.bgCard,
//     borderRadius: 20,
//     padding: 32,
//     marginTop: 80,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   emptyIconContainer: {
//     width: 72,
//     height: 72,
//     borderRadius: 20,
//     backgroundColor: 'rgba(42, 82, 152, 0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   emptyEmoji: {
//     fontSize: 32,
//   },
//   emptyTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: COLORS.textPrimary,
//     marginBottom: 8,
//   },
//   emptyText: {
//     fontSize: 14,
//     color: COLORS.textSecondary,
//     marginBottom: 24,
//   },
//   primaryButton: {
//     width: '100%',
//     backgroundColor: COLORS.accent,
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   primaryButtonText: {
//     color: COLORS.bgPrimary,
//     fontSize: 15,
//     fontWeight: '600',
//   },
//   secondaryButton: {
//     width: '100%',
//     backgroundColor: 'transparent',
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   secondaryButtonText: {
//     color: COLORS.textPrimary,
//     fontSize: 15,
//     fontWeight: '500',
//   },
// });

// export default HomeScreen;

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, VaultData, isUnifiedVault } from '../types/navigation';
import { useVaults } from '../context/VaultContext';
import api from '../services/api';
import Clipboard from '@react-native-clipboard/clipboard';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type RouteType = RouteProp<RootStackParamList, 'Home'>;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ═══════════════════════════════════════════════════════════════
// VULTISIG THEME COLORS
// ═══════════════════════════════════════════════════════════════
const COLORS = {
  // Backgrounds
  bgPrimary: '#02111B',
  bgSecondary: '#061624',
  bgCard: '#0D2137',
  
  // Accents
  accent: '#33E6BF',
  accentBlue: '#2A5298',
  accentGlow: '#1E88E5',
  
  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#8A9BAE',
  textMuted: '#5A6B7E',
  
  // Borders
  border: 'rgba(42, 82, 152, 0.3)',
  borderLight: 'rgba(42, 82, 152, 0.15)',
};

// Gradient Halo Component
const GradientHalo = () => (
  <View style={styles.haloContainer}>
    <Svg width={SCREEN_WIDTH} height={320} style={styles.haloSvg}>
      <Defs>
        <RadialGradient id="haloGrad" cx="50%" cy="40%" rx="60%" ry="50%">
          <Stop offset="0%" stopColor="#1E4976" stopOpacity="0.6" />
          <Stop offset="40%" stopColor="#153556" stopOpacity="0.3" />
          <Stop offset="70%" stopColor="#0A2540" stopOpacity="0.15" />
          <Stop offset="100%" stopColor="#02111B" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Ellipse
        cx={SCREEN_WIDTH / 2}
        cy={130}
        rx={SCREEN_WIDTH * 0.7}
        ry={160}
        fill="url(#haloGrad)"
      />
    </Svg>
  </View>
);

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { activeVault, vaults, isLoading: contextLoading } = useVaults();
  
  const [refreshing, setRefreshing] = useState(false);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [solUsd, setSolUsd] = useState<number>(0);
  const [zecBalance, setZecBalance] = useState<number>(0);
  const [zecUsd, setZecUsd] = useState<number>(0);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [copied, setCopied] = useState(false);

  const routeVault = route.params?.vault;
  const vault: VaultData | null = routeVault || (activeVault as VaultData | null);
  const isSeedless = vault?.wallet_type === 'seedless';
  const unified = vault ? isUnifiedVault(vault) : false;
  
  const hasSol = !isSeedless && (vault?.chain === 'SOL' || vault?.sol?.address || vault?.chain === 'unified');
  const hasZec = isSeedless || vault?.chain === 'ZEC' || vault?.zec?.address || vault?.zec?.unified_address || vault?.zec?.transparent_address || vault?.chain === 'unified';

  const loadBalances = useCallback(async () => {
    if (!vault) return;
    setLoadingBalance(true);
    setSolBalance(0);
    setSolUsd(0);
    setZecBalance(0);
    setZecUsd(0);
    
    try {
      if (hasSol) {
        const address = vault.sol?.address || vault.address;
        if (address) {
          try {
            const response = await api.getSolBalance(address);
            const bal = response.sol || response.balance || 0;
            const usd = response.usd || bal * 200;
            setSolBalance(bal);
            setSolUsd(usd);
          } catch (err) {
            console.log('SOL balance error:', err);
          }
        }
      }
      
      if (hasZec && (vault.zec?.address || vault.zec?.unified_address)) {
        const zecAddress = vault.zec?.unified_address || vault.zec?.address;
        try {
          const response = await api.getZecBalance(zecAddress!);
          const bal = response.shielded_balance || response.balance || response.total_zec || 0;
          const usd = response.usd || bal * 40;
          setZecBalance(bal);
          setZecUsd(usd);
        } catch (err) {
          console.log('ZEC balance error:', err);
        }
      }
    } catch (error) {
      console.log('Balance fetch error:', error);
    } finally {
      setLoadingBalance(false);
    }
  }, [vault, hasSol, hasZec]);

  useFocusEffect(
    useCallback(() => {
      if (vault) {
        loadBalances();
      }
    }, [vault, loadBalances])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBalances();
    setRefreshing(false);
  };

  const copyAddress = () => {
    const address = isSeedless 
      ? (vault?.zec?.address || vault?.publicKey)
      : (vault?.sol?.address || vault?.address);
    
    if (!address) {
      Alert.alert('No Address', 'No wallet address available to copy');
      return;
    }
    
    Clipboard.setString(address);
    setCopied(true);
    Alert.alert('Copied!', `Address copied to clipboard:\n${address.slice(0, 8)}...${address.slice(-8)}`);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatAddress = (address: string | undefined) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const safeToFixed = (value: number | undefined | null, decimals: number = 2): string => {
    if (value === undefined || value === null || isNaN(value)) {
      return '0.00';
    }
    return value.toFixed(decimals);
  };

  const totalUsd = (hasSol ? solUsd : 0) + (hasZec ? zecUsd : 0);

  // Empty State
  if (!vault && !contextLoading) {
    return (
      <View style={styles.container}>
        <GradientHalo />
        <SafeAreaView style={styles.safeArea}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconContainer}>
                <Text style={styles.emptyEmoji}>🔐</Text>
              </View>
              <Text style={styles.emptyTitle}>No Wallet Found</Text>
              <Text style={styles.emptyText}>Create a wallet to get started</Text>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate('ChainSelection')}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Create Wallet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('Recovery')}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Recover Wallet</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // Loading State
  if (contextLoading) {
    return (
      <View style={styles.container}>
        <GradientHalo />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.accent} />
            <Text style={styles.loadingText}>Loading wallet...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Main Screen
  return (
    <View style={styles.container}>
      {/* Gradient Halo Background */}
      <GradientHalo />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.vaultSelector} 
              onPress={copyAddress}
              activeOpacity={0.7}
            >
              <Text style={styles.vaultIcon}>⚡</Text>
              <Text style={styles.vaultName}>{vault?.vault_name || 'My Wallet'}</Text>
              <Text style={styles.dropdownArrow}>{copied ? '✓' : '▾'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingsBtn} activeOpacity={0.7}>
              <View style={styles.settingsIconContainer}>
                <Text style={styles.settingsIcon}>⚙</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Balance Display */}
          <View style={styles.balanceContainer}>
            {loadingBalance ? (
              <ActivityIndicator color={COLORS.textPrimary} size="large" />
            ) : (
              <>
                <Text style={styles.balanceAmount}>${safeToFixed(totalUsd, 2)}</Text>
                <TouchableOpacity style={styles.hideBalanceBtn} activeOpacity={0.7}>
                  <Text style={styles.hideBalanceIcon}>◉</Text>
                  <Text style={styles.hideBalanceText}>Hide balance</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate('Swap', { vault: vault || undefined })}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconWrap, styles.actionIconActive]}>
                <Text style={styles.actionIconTextActive}>⇄</Text>
              </View>
              <Text style={styles.actionText}>Swap</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => vault && navigation.navigate('Send', { vault, chain: 'SOL' })}
              activeOpacity={0.7}
            >
              <View style={styles.actionIconWrap}>
                <Text style={styles.actionIconText}>↗</Text>
              </View>
              <Text style={styles.actionText}>Send</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate('FundWallet', { vault: vault || undefined })}
              activeOpacity={0.7}
            >
              <View style={styles.actionIconWrap}>
                <Text style={styles.actionIconText}>↓</Text>
              </View>
              <Text style={styles.actionText}>Buy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate('AgentDashboard', { vault })}
              activeOpacity={0.7}
            >
              <View style={styles.actionIconWrap}>
                <Text style={styles.actionIconText}>◎</Text>
              </View>
              <Text style={styles.actionText}>Agent</Text>
            </TouchableOpacity>
          </View>

          {/* Portfolio Header */}
          <View style={styles.portfolioHeader}>
            <Text style={styles.portfolioTitle}>Portfolio</Text>
            <View style={styles.portfolioActions}>
              <TouchableOpacity style={styles.portfolioActionBtn} activeOpacity={0.7}>
                <Text style={styles.portfolioActionIcon}>⌕</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.portfolioActionBtn} activeOpacity={0.7}>
                <Text style={styles.portfolioActionIcon}>⊞</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Token List */}
          <View style={styles.tokenList}>
            {/* SOL Row */}
            {hasSol && (
              <TouchableOpacity style={styles.tokenRow} activeOpacity={0.7}>
                <View style={styles.tokenIcon}>
                  <LinearGradient
                    colors={['#9945FF', '#14F195']}
                    style={styles.tokenIconGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.tokenIconSymbol}>◎</Text>
                  </LinearGradient>
                </View>
                <View style={styles.tokenDetails}>
                  <Text style={styles.tokenName}>Solana</Text>
                  <View style={styles.tokenAddressWrap}>
                    <Text style={styles.tokenAddress}>
                      {formatAddress(vault?.sol?.address || vault?.address)}
                    </Text>
                    <Text style={styles.copyBtn}>⧉</Text>
                  </View>
                </View>
                <View style={styles.tokenValues}>
                  <Text style={styles.tokenUsd}>${safeToFixed(solUsd, 2)}</Text>
                  <Text style={styles.tokenBal}>{safeToFixed(solBalance, 0)} SOL</Text>
                </View>
                <Text style={styles.rowChevron}>›</Text>
              </TouchableOpacity>
            )}

            {/* ZEC Row */}
            {hasZec && (vault?.zec?.address || vault?.zec?.unified_address) && (
              <TouchableOpacity style={[styles.tokenRow, !hasSol && styles.tokenRowFirst]} activeOpacity={0.7}>
                <View style={styles.tokenIcon}>
                  <View style={styles.tokenIconZec}>
                    <Text style={styles.tokenIconSymbolDark}>Z</Text>
                  </View>
                </View>
                <View style={styles.tokenDetails}>
                  <Text style={styles.tokenName}>Zcash</Text>
                  <View style={styles.tokenAddressWrap}>
                    <Text style={styles.tokenAddress}>
                      {formatAddress(vault?.zec?.unified_address || vault?.zec?.address)}
                    </Text>
                    <Text style={styles.copyBtn}>⧉</Text>
                  </View>
                </View>
                <View style={styles.tokenValues}>
                  <Text style={styles.tokenUsd}>${safeToFixed(zecUsd, 2)}</Text>
                  <Text style={styles.tokenBal}>{safeToFixed(zecBalance, 0)} ZEC</Text>
                </View>
                <Text style={styles.rowChevron}>›</Text>
              </TouchableOpacity>
            )}

            {!hasSol && !hasZec && (
              <View style={styles.emptyTokens}>
                <Text style={styles.emptyTokensText}>No assets yet</Text>
              </View>
            )}
          </View>

          {/* Features Section */}
          {vault && !isSeedless && (
            <>
              <View style={styles.featuresHeader}>
                <Text style={styles.featuresTitle}>Features</Text>
              </View>

              <TouchableOpacity
                style={styles.featureRow}
                onPress={() => navigation.navigate('DarkPool', { vault_id: vault.vault_id, vault })}
                activeOpacity={0.7}
              >
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>◈</Text>
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Dark Pool Trading</Text>
                  <Text style={styles.featureDesc}>MEV-protected encrypted orders</Text>
                </View>
                <Text style={styles.featureArrow}>→</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.featureRow}
                onPress={() => navigation.navigate('Backup', { vault })}
                activeOpacity={0.7}
              >
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>⬡</Text>
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Backup & Recovery</Text>
                  <Text style={styles.featureDesc}>Secure your wallet keys</Text>
                </View>
                <Text style={styles.featureArrow}>→</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isSeedless ? '◈ Secured by Oasis TEE' : '◈ Powered by ZkAGI'}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
// STYLES - VULTISIG PRODUCTION DESIGN
// ═══════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  // Gradient Halo
  haloContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 320,
    overflow: 'hidden',
  },
  haloSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    marginTop: 12,
    fontSize: 14,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 20,
  },
  vaultSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  vaultIcon: {
    fontSize: 14,
    color: '#F7931A',
    marginRight: 8,
  },
  vaultName: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  settingsBtn: {
    padding: 4,
  },
  settingsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },

  // Balance
  balanceContainer: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 32,
  },
  balanceAmount: {
    fontSize: 44,
    color: COLORS.textPrimary,
    fontWeight: '300',
    letterSpacing: -1,
  },
  hideBalanceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  hideBalanceIcon: {
    fontSize: 12,
    color: COLORS.accent,
    marginRight: 6,
  },
  hideBalanceText: {
    fontSize: 13,
    color: COLORS.accent,
    fontWeight: '500',
  },

  // Actions
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 24,
    gap: 20,
  },
  actionBtn: {
    alignItems: 'center',
    width: 64,
  },
  actionIconWrap: {
    width: 52,
    height: 52,
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionIconActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  actionIconText: {
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  actionIconTextActive: {
    fontSize: 20,
    color: COLORS.bgPrimary,
    fontWeight: '600',
  },
  actionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },

  // Portfolio
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  portfolioTitle: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  portfolioActions: {
    flexDirection: 'row',
    gap: 8,
  },
  portfolioActionBtn: {
    width: 36,
    height: 36,
    backgroundColor: COLORS.bgCard,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  portfolioActionIcon: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },

  // Token List
  tokenList: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  tokenRowFirst: {
    borderBottomWidth: 0,
  },
  tokenIcon: {
    marginRight: 12,
  },
  tokenIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenIconZec: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4B728',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenIconSymbol: {
    fontSize: 18,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  tokenIconSymbolDark: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '700',
  },
  tokenDetails: {
    flex: 1,
  },
  tokenName: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
    marginBottom: 2,
  },
  tokenAddressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenAddress: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  copyBtn: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginLeft: 4,
  },
  tokenValues: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  tokenUsd: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  tokenBal: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  rowChevron: {
    fontSize: 20,
    color: COLORS.textMuted,
  },
  emptyTokens: {
    padding: 32,
    alignItems: 'center',
  },
  emptyTokensText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },

  // Features
  featuresHeader: {
    paddingTop: 24,
    paddingBottom: 12,
  },
  featuresTitle: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featureIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(42, 82, 152, 0.3)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureIconText: {
    fontSize: 18,
    color: COLORS.accent,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  featureArrow: {
    fontSize: 16,
    color: COLORS.accent,
  },

  // Footer
  footer: {
    paddingTop: 24,
    paddingBottom: 8,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },

  // Empty State
  emptyCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 20,
    padding: 32,
    marginTop: 80,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(42, 82, 152, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyEmoji: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: COLORS.bgPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '500',
  },
});

export default HomeScreen;