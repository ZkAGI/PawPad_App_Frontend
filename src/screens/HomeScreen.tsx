// // import React, { useState, useCallback, useEffect, useRef } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TouchableOpacity,
// //   ScrollView,
// //   RefreshControl,
// //   ActivityIndicator,
// //   Dimensions,
// //   Animated,
// // } from 'react-native';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
// // import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// // import { RootStackParamList, VaultData, isUnifiedVault, isTEEVault, getTEEAddresses } from '../types/navigation';
// // import { useVaults } from '../context/VaultContext';
// // import api from '../services/api';
// // import { getAllBalances } from '../services/teeSevice';
// // import Clipboard from '@react-native-clipboard/clipboard';
// // import LinearGradient from 'react-native-linear-gradient';
// // import Svg, { Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
// // type RouteType = RouteProp<RootStackParamList, 'Home'>;

// // const { width: SCREEN_WIDTH } = Dimensions.get('window');

// // // ═══════════════════════════════════════════════════════════════
// // // THEME COLORS
// // // ═══════════════════════════════════════════════════════════════
// // const COLORS = {
// //   bgPrimary: '#02111B',
// //   bgSecondary: '#061624',
// //   bgCard: '#0D2137',
// //   accent: '#33E6BF',
// //   accentBlue: '#2A5298',
// //   accentGlow: '#1E88E5',
// //   textPrimary: '#FFFFFF',
// //   textSecondary: '#8A9BAE',
// //   textMuted: '#5A6B7E',
// //   border: 'rgba(42, 82, 152, 0.3)',
// //   borderLight: 'rgba(42, 82, 152, 0.15)',
// //   success: '#10B981',
// //   toastBg: '#1A3A4A',
// // };

// // // Gradient Halo Component
// // const GradientHalo = () => (
// //   <View style={styles.haloContainer}>
// //     <Svg width={SCREEN_WIDTH} height={320} style={styles.haloSvg}>
// //       <Defs>
// //         <RadialGradient id="haloGrad" cx="50%" cy="40%" rx="60%" ry="50%">
// //           <Stop offset="0%" stopColor="#1E4976" stopOpacity="0.6" />
// //           <Stop offset="40%" stopColor="#153556" stopOpacity="0.3" />
// //           <Stop offset="70%" stopColor="#0A2540" stopOpacity="0.15" />
// //           <Stop offset="100%" stopColor="#02111B" stopOpacity="0" />
// //         </RadialGradient>
// //       </Defs>
// //       <Ellipse
// //         cx={SCREEN_WIDTH / 2}
// //         cy={130}
// //         rx={SCREEN_WIDTH * 0.7}
// //         ry={160}
// //         fill="url(#haloGrad)"
// //       />
// //     </Svg>
// //   </View>
// // );

// // // ═══════════════════════════════════════════════════════════════
// // // THEMED TOAST COMPONENT
// // // ═══════════════════════════════════════════════════════════════
// // interface ToastProps {
// //   visible: boolean;
// //   message: string;
// // }

// // const Toast = ({ visible, message }: ToastProps) => {
// //   const opacity = useRef(new Animated.Value(0)).current;

// //   useEffect(() => {
// //     if (visible) {
// //       Animated.sequence([
// //         Animated.timing(opacity, {
// //           toValue: 1,
// //           duration: 200,
// //           useNativeDriver: true,
// //         }),
// //         Animated.delay(1500),
// //         Animated.timing(opacity, {
// //           toValue: 0,
// //           duration: 200,
// //           useNativeDriver: true,
// //         }),
// //       ]).start();
// //     }
// //   }, [visible, message]);

// //   if (!visible) return null;

// //   return (
// //     <Animated.View style={[styles.toast, { opacity }]}>
// //       <Text style={styles.toastIcon}>✓</Text>
// //       <Text style={styles.toastText}>{message}</Text>
// //     </Animated.View>
// //   );
// // };

// // // ═══════════════════════════════════════════════════════════════
// // // HOME SCREEN
// // // ═══════════════════════════════════════════════════════════════
// // const HomeScreen = () => {
// //   const navigation = useNavigation<NavigationProp>();
// //   const route = useRoute<RouteType>();
// //   const { activeVault, vaults, isLoading: contextLoading } = useVaults();

// //   const [refreshing, setRefreshing] = useState(false);
// //   const [solBalance, setSolBalance] = useState<number>(0);
// //   const [solUsd, setSolUsd] = useState<number>(0);
// //   const [zecBalance, setZecBalance] = useState<number>(0);
// //   const [zecUsd, setZecUsd] = useState<number>(0);
// //   const [evmBalance, setEvmBalance] = useState<number>(0);
// //   const [evmUsd, setEvmUsd] = useState<number>(0);
// //   const [loadingBalance, setLoadingBalance] = useState(false);
// //   const [teeWallet, setTeeWallet] = useState<VaultData | null>(null);
  
// //   // Toast state
// //   const [toastVisible, setToastVisible] = useState(false);
// //   const [toastMessage, setToastMessage] = useState('');

// //   // Load TEE wallet from AsyncStorage on mount
// //   useEffect(() => {
// //     const loadTEEWallet = async () => {
// //       try {
// //         const stored = await AsyncStorage.getItem('tee_wallet');
// //         if (stored) {
// //           setTeeWallet(JSON.parse(stored));
// //         }
// //       } catch (error) {
// //         console.log('Error loading TEE wallet:', error);
// //       }
// //     };
// //     loadTEEWallet();
// //   }, []);

// //   const routeVault = route.params?.vault;
// //   const vault: VaultData | null = routeVault || (activeVault as VaultData | null) || teeWallet;
  
// //   const isSeedless = vault?.wallet_type === 'seedless';
// //   const isTEE = vault ? isTEEVault(vault) : false;
// //   const teeAddresses = vault ? getTEEAddresses(vault) : { evm: null, solana: null };
// //   const unified = vault ? isUnifiedVault(vault) : false;

// //   // Chain detection
// //   const hasSol = !isSeedless && (vault?.chain === 'SOL' || vault?.sol?.address || vault?.chain === 'unified' || (isTEE && teeAddresses.solana));
// //   const hasZec = isSeedless || vault?.chain === 'ZEC' || vault?.zec?.address || vault?.zec?.unified_address || vault?.zec?.transparent_address || vault?.chain === 'unified';
// //   const hasEvm = isTEE && teeAddresses.evm;

// //   // ═══════════════════════════════════════════════════════════════
// //   // SHOW TOAST
// //   // ═══════════════════════════════════════════════════════════════
// //   const showToast = useCallback((message: string) => {
// //     setToastMessage(message);
// //     setToastVisible(true);
// //     setTimeout(() => setToastVisible(false), 2000);
// //   }, []);

// //   // ═══════════════════════════════════════════════════════════════
// //   // COPY ADDRESS (with themed toast)
// //   // ═══════════════════════════════════════════════════════════════
// //   const copyAddress = useCallback((address: string | undefined | null) => {
// //     if (!address) return;
    
// //     Clipboard.setString(address);
// //     const shortAddr = `${address.slice(0, 6)}...${address.slice(-4)}`;
// //     showToast(`Copied: ${shortAddr}`);
// //   }, [showToast]);

// //   // ═══════════════════════════════════════════════════════════════
// //   // LOAD BALANCES (with error handling)
// //   // ═══════════════════════════════════════════════════════════════
// //   const loadBalances = useCallback(async () => {
// //     if (!vault) return;
    
// //     setLoadingBalance(true);

// //     try {
// //       // TEE Wallet - use teeService for all balances
// //       if (isTEE && (teeAddresses.solana || teeAddresses.evm)) {
// //         const balances = await getAllBalances(teeAddresses.solana, teeAddresses.evm);
        
// //         // Update SOL balance
// //         if (balances.solana) {
// //           const solPrice = 200; // TODO: fetch real price
// //           setSolBalance(balances.solana.sol);
// //           setSolUsd(balances.solana.sol * solPrice);
// //         }
        
// //         // Update ETH balance
// //         if (balances.evm) {
// //           const ethPrice = 2950; // TODO: fetch real price
// //           setEvmBalance(balances.evm.eth);
// //           setEvmUsd(balances.evm.eth * ethPrice);
// //         }
// //       } else {
// //         // Non-TEE wallet - use existing API
        
// //         // Load SOL balance
// //         if (hasSol) {
// //           const address = vault.sol?.address || vault.address;
// //           if (address) {
// //             try {
// //               const response = await api.getSolBalance(address);
// //               if (response.success !== false) {
// //                 const bal = response.sol || response.balance || 0;
// //                 const usd = response.usd || bal * 200;
// //                 setSolBalance(bal);
// //                 setSolUsd(usd);
// //               }
// //             } catch (err: any) {
// //               console.log('[Balance] SOL fetch failed, keeping previous value');
// //             }
// //           }
// //         }

// //         // Load ZEC balance
// //         if (hasZec && (vault.zec?.address || vault.zec?.unified_address)) {
// //           const zecAddress = vault.zec?.unified_address || vault.zec?.address;
// //           try {
// //             const response = await api.getZecBalance(zecAddress!);
// //             if (response.success !== false) {
// //               const bal = response.shielded_balance || response.balance || response.total_zec || 0;
// //               const usd = response.usd || bal * 40;
// //               setZecBalance(bal);
// //               setZecUsd(usd);
// //             }
// //           } catch (err) {
// //             console.log('[Balance] ZEC fetch failed, keeping previous value');
// //           }
// //         }
// //       }
// //     } catch (error) {
// //       console.log('[Balance] General error:', error);
// //     } finally {
// //       setLoadingBalance(false);
// //     }
// //   }, [vault, hasSol, hasZec, hasEvm, isTEE, teeAddresses]);

// //   // Load balances on focus (but not too frequently)
// //   const lastLoadRef = useRef<number>(0);
  
// //   useFocusEffect(
// //     useCallback(() => {
// //       if (vault) {
// //         const now = Date.now();
// //         // Only load if more than 10 seconds since last load
// //         if (now - lastLoadRef.current > 10000) {
// //           lastLoadRef.current = now;
// //           loadBalances();
// //         }
// //       }
// //     }, [vault, loadBalances])
// //   );

// //   const onRefresh = async () => {
// //     setRefreshing(true);
// //     lastLoadRef.current = Date.now();
// //     await loadBalances();
// //     setRefreshing(false);
// //   };

// //   const formatAddress = (address: string | undefined | null) => {
// //     if (!address) return '';
// //     return `${address.slice(0, 6)}...${address.slice(-4)}`;
// //   };

// //   const safeToFixed = (value: number | undefined | null, decimals: number = 2): string => {
// //     if (value === undefined || value === null || isNaN(value)) {
// //       return '0.00';
// //     }
// //     return value.toFixed(decimals);
// //   };

// //   const totalUsd = (hasSol ? solUsd : 0) + (hasZec ? zecUsd : 0) + (hasEvm ? evmUsd : 0);

// //   // ═══════════════════════════════════════════════════════════════
// //   // EMPTY STATE
// //   // ═══════════════════════════════════════════════════════════════
// //   if (!vault && !contextLoading) {
// //     return (
// //       <View style={styles.container}>
// //         <GradientHalo />
// //         <SafeAreaView style={styles.safeArea}>
// //           <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
// //             <View style={styles.emptyCard}>
// //               <View style={styles.emptyIconContainer}>
// //                 <Text style={styles.emptyEmoji}>🔐</Text>
// //               </View>
// //               <Text style={styles.emptyTitle}>No Wallet Found</Text>
// //               <Text style={styles.emptyText}>Create a wallet to get started</Text>
// //               <TouchableOpacity
// //                 style={styles.primaryButton}
// //                 onPress={() => navigation.navigate('ChainSelection', {})}
// //                 activeOpacity={0.8}
// //               >
// //                 <Text style={styles.primaryButtonText}>Create Wallet</Text>
// //               </TouchableOpacity>
// //               <TouchableOpacity
// //                 style={styles.secondaryButton}
// //                 onPress={() => navigation.navigate('Recovery')}
// //                 activeOpacity={0.8}
// //               >
// //                 <Text style={styles.secondaryButtonText}>Recover Wallet</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </ScrollView>
// //         </SafeAreaView>
// //       </View>
// //     );
// //   }

// //   // ═══════════════════════════════════════════════════════════════
// //   // LOADING STATE
// //   // ═══════════════════════════════════════════════════════════════
// //   if (contextLoading) {
// //     return (
// //       <View style={styles.container}>
// //         <GradientHalo />
// //         <SafeAreaView style={styles.safeArea}>
// //           <View style={styles.loadingContainer}>
// //             <ActivityIndicator size="large" color={COLORS.accent} />
// //             <Text style={styles.loadingText}>Loading wallet...</Text>
// //           </View>
// //         </SafeAreaView>
// //       </View>
// //     );
// //   }

// //   // ═══════════════════════════════════════════════════════════════
// //   // MAIN SCREEN
// //   // ═══════════════════════════════════════════════════════════════
// //   return (
// //     <View style={styles.container}>
// //       <GradientHalo />

// //       {/* Themed Toast */}
// //       <Toast visible={toastVisible} message={toastMessage} />

// //       <SafeAreaView style={styles.safeArea}>
// //         <ScrollView
// //           showsVerticalScrollIndicator={false}
// //           contentContainerStyle={styles.scrollContent}
// //           refreshControl={
// //             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />
// //           }
// //         >
// //           {/* Header - NO ACTION on TEE Wallet click */}
// //           <View style={styles.header}>
// //             <View style={styles.vaultSelector}>
// //               <Text style={styles.vaultIcon}>{isTEE ? '🛡️' : '⚡'}</Text>
// //               <Text style={styles.vaultName}>{vault?.vault_name || 'My Wallet'}</Text>
// //               {/* Removed dropdown arrow since no action */}
// //             </View>

// //             <TouchableOpacity style={styles.settingsBtn} activeOpacity={0.7}>
// //               <View style={styles.settingsIconContainer}>
// //                 <Text style={styles.settingsIcon}>⚙</Text>
// //               </View>
// //             </TouchableOpacity>
// //           </View>

// //           {/* Balance Display */}
// //           <View style={styles.balanceContainer}>
// //             {loadingBalance && totalUsd === 0 ? (
// //               <ActivityIndicator color={COLORS.textPrimary} size="large" />
// //             ) : (
// //               <>
// //                 <Text style={styles.balanceAmount}>${safeToFixed(totalUsd, 2)}</Text>
// //                 <TouchableOpacity style={styles.hideBalanceBtn} activeOpacity={0.7}>
// //                   <Text style={styles.hideBalanceIcon}>◉</Text>
// //                   <Text style={styles.hideBalanceText}>Hide balance</Text>
// //                 </TouchableOpacity>
// //               </>
// //             )}
// //           </View>

// //           {/* Action Buttons */}
// //           <View style={styles.actionsRow}>
// //             <TouchableOpacity
// //               style={styles.actionBtn}
// //               onPress={() => navigation.navigate('Swap', { vault: vault || undefined })}
// //               activeOpacity={0.7}
// //             >
// //               <View style={[styles.actionIconWrap, styles.actionIconActive]}>
// //                 <Text style={styles.actionIconTextActive}>⇄</Text>
// //               </View>
// //               <Text style={styles.actionText}>Swap</Text>
// //             </TouchableOpacity>

// //             <TouchableOpacity
// //               style={styles.actionBtn}
// //               onPress={() => vault && navigation.navigate('Send', { vault, chain: isTEE ? 'EVM' : 'SOL' })}
// //               activeOpacity={0.7}
// //             >
// //               <View style={styles.actionIconWrap}>
// //                 <Text style={styles.actionIconText}>↗</Text>
// //               </View>
// //               <Text style={styles.actionText}>Send</Text>
// //             </TouchableOpacity>

// //             <TouchableOpacity
// //               style={styles.actionBtn}
// //               onPress={() => navigation.navigate('FundWallet', { vault: vault || undefined })}
// //               activeOpacity={0.7}
// //             >
// //               <View style={styles.actionIconWrap}>
// //                 <Text style={styles.actionIconText}>↓</Text>
// //               </View>
// //               <Text style={styles.actionText}>Buy</Text>
// //             </TouchableOpacity>

// //             <TouchableOpacity
// //               style={styles.actionBtn}
// //               onPress={() => vault && navigation.navigate('AgentDashboard', { vault })}
// //               activeOpacity={0.7}
// //               disabled={!vault}
// //             >
// //               <View style={styles.actionIconWrap}>
// //                 <Text style={styles.actionIconText}>◎</Text>
// //               </View>
// //               <Text style={styles.actionText}>Agent</Text>
// //             </TouchableOpacity>
// //           </View>

// //           {/* Portfolio Header */}
// //           <View style={styles.portfolioHeader}>
// //             <Text style={styles.portfolioTitle}>Portfolio</Text>
// //             <View style={styles.portfolioActions}>
// //               <TouchableOpacity style={styles.portfolioActionBtn} activeOpacity={0.7}>
// //                 <Text style={styles.portfolioActionIcon}>⌕</Text>
// //               </TouchableOpacity>
// //               <TouchableOpacity style={styles.portfolioActionBtn} activeOpacity={0.7}>
// //                 <Text style={styles.portfolioActionIcon}>⊞</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>

// //           {/* Token List */}
// //           <View style={styles.tokenList}>
// //             {/* EVM Row (TEE wallets only) */}
// //             {hasEvm && (
// //               <TouchableOpacity 
// //                 style={styles.tokenRow} 
// //                 activeOpacity={0.7}
// //                 onPress={() => copyAddress(teeAddresses.evm)}
// //               >
// //                 <View style={styles.tokenIcon}>
// //                   <View style={styles.tokenIconEvm}>
// //                     <Text style={styles.tokenIconSymbol}>Ξ</Text>
// //                   </View>
// //                 </View>
// //                 <View style={styles.tokenDetails}>
// //                   <Text style={styles.tokenName}>Ethereum</Text>
// //                   <View style={styles.tokenAddressWrap}>
// //                     <Text style={styles.tokenAddress}>
// //                       {formatAddress(teeAddresses.evm)}
// //                     </Text>
// //                     <Text style={styles.copyBtn}>⧉</Text>
// //                   </View>
// //                 </View>
// //                 <View style={styles.tokenValues}>
// //                   <Text style={styles.tokenUsd}>${safeToFixed(evmUsd, 2)}</Text>
// //                   <Text style={styles.tokenBal}>{safeToFixed(evmBalance, 4)} ETH</Text>
// //                 </View>
// //                 <Text style={styles.rowChevron}>›</Text>
// //               </TouchableOpacity>
// //             )}

// //             {/* SOL Row */}
// //             {hasSol && (
// //               <TouchableOpacity 
// //                 style={[styles.tokenRow, hasEvm && styles.tokenRowBorder]} 
// //                 activeOpacity={0.7}
// //                 onPress={() => copyAddress(isTEE ? teeAddresses.solana : (vault?.sol?.address || vault?.address))}
// //               >
// //                 <View style={styles.tokenIcon}>
// //                   <LinearGradient
// //                     colors={['#9945FF', '#14F195']}
// //                     style={styles.tokenIconGradient}
// //                     start={{ x: 0, y: 0 }}
// //                     end={{ x: 1, y: 1 }}
// //                   >
// //                     <Text style={styles.tokenIconSymbol}>◎</Text>
// //                   </LinearGradient>
// //                 </View>
// //                 <View style={styles.tokenDetails}>
// //                   <Text style={styles.tokenName}>Solana</Text>
// //                   <View style={styles.tokenAddressWrap}>
// //                     <Text style={styles.tokenAddress}>
// //                       {formatAddress(isTEE ? teeAddresses.solana : (vault?.sol?.address || vault?.address))}
// //                     </Text>
// //                     <Text style={styles.copyBtn}>⧉</Text>
// //                   </View>
// //                 </View>
// //                 <View style={styles.tokenValues}>
// //                   <Text style={styles.tokenUsd}>${safeToFixed(solUsd, 2)}</Text>
// //                   <Text style={styles.tokenBal}>{safeToFixed(solBalance, 4)} SOL</Text>
// //                 </View>
// //                 <Text style={styles.rowChevron}>›</Text>
// //               </TouchableOpacity>
// //             )}

// //             {/* ZEC Row */}
// //             {hasZec && (vault?.zec?.address || vault?.zec?.unified_address) && (
// //               <TouchableOpacity 
// //                 style={[styles.tokenRow, (hasSol || hasEvm) && styles.tokenRowBorder]} 
// //                 activeOpacity={0.7}
// //                 onPress={() => copyAddress(vault?.zec?.unified_address || vault?.zec?.address)}
// //               >
// //                 <View style={styles.tokenIcon}>
// //                   <View style={styles.tokenIconZec}>
// //                     <Text style={styles.tokenIconSymbolDark}>Z</Text>
// //                   </View>
// //                 </View>
// //                 <View style={styles.tokenDetails}>
// //                   <Text style={styles.tokenName}>Zcash</Text>
// //                   <View style={styles.tokenAddressWrap}>
// //                     <Text style={styles.tokenAddress}>
// //                       {formatAddress(vault?.zec?.unified_address || vault?.zec?.address)}
// //                     </Text>
// //                     <Text style={styles.copyBtn}>⧉</Text>
// //                   </View>
// //                 </View>
// //                 <View style={styles.tokenValues}>
// //                   <Text style={styles.tokenUsd}>${safeToFixed(zecUsd, 2)}</Text>
// //                   <Text style={styles.tokenBal}>{safeToFixed(zecBalance, 4)} ZEC</Text>
// //                 </View>
// //                 <Text style={styles.rowChevron}>›</Text>
// //               </TouchableOpacity>
// //             )}

// //             {!hasSol && !hasZec && !hasEvm && (
// //               <View style={styles.emptyTokens}>
// //                 <Text style={styles.emptyTokensText}>No assets yet</Text>
// //               </View>
// //             )}
// //           </View>

// //           {/* Features Section */}
// //           {vault && (
// //             <>
// //               <View style={styles.featuresHeader}>
// //                 <Text style={styles.featuresTitle}>Features</Text>
// //               </View>

// //               {!isSeedless && !isTEE && (
// //                 <TouchableOpacity
// //                   style={styles.featureRow}
// //                   onPress={() => navigation.navigate('DarkPool', { vault_id: vault.vault_id, vault })}
// //                   activeOpacity={0.7}
// //                 >
// //                   <View style={styles.featureIcon}>
// //                     <Text style={styles.featureIconText}>◈</Text>
// //                   </View>
// //                   <View style={styles.featureInfo}>
// //                     <Text style={styles.featureTitle}>Dark Pool Trading</Text>
// //                     <Text style={styles.featureDesc}>MEV-protected encrypted orders</Text>
// //                   </View>
// //                   <Text style={styles.featureArrow}>→</Text>
// //                 </TouchableOpacity>
// //               )}

// //               <TouchableOpacity
// //                 style={styles.featureRow}
// //                 onPress={() => navigation.navigate('Backup', { vault })}
// //                 activeOpacity={0.7}
// //               >
// //                 <View style={styles.featureIcon}>
// //                   <Text style={styles.featureIconText}>⬡</Text>
// //                 </View>
// //                 <View style={styles.featureInfo}>
// //                   <Text style={styles.featureTitle}>Backup & Recovery</Text>
// //                   <Text style={styles.featureDesc}>
// //                     {isTEE ? 'Download backup file' : 'Secure your wallet keys'}
// //                   </Text>
// //                 </View>
// //                 <Text style={styles.featureArrow}>→</Text>
// //               </TouchableOpacity>
// //             </>
// //           )}

// //           {/* Footer */}
// //           <View style={styles.footer}>
// //             <Text style={styles.footerText}>
// //               {isTEE ? '🛡️ Secured by Oasis TEE' : isSeedless ? '◈ Secured by Oasis TEE' : '◈ Powered by ZkAGI'}
// //             </Text>
// //           </View>
// //         </ScrollView>
// //       </SafeAreaView>
// //     </View>
// //   );
// // };

// // // ═══════════════════════════════════════════════════════════════
// // // STYLES
// // // ═══════════════════════════════════════════════════════════════
// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: COLORS.bgPrimary,
// //   },
// //   safeArea: {
// //     flex: 1,
// //   },
// //   scrollContent: {
// //     paddingHorizontal: 16,
// //     paddingBottom: 32,
// //   },
// //   haloContainer: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     height: 320,
// //     overflow: 'hidden',
// //   },
// //   haloSvg: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //   },
// //   // Toast styles
// //   toast: {
// //     position: 'absolute',
// //     bottom: 100,
// //     left: 20,
// //     right: 20,
// //     backgroundColor: COLORS.toastBg,
// //     borderRadius: 12,
// //     paddingVertical: 14,
// //     paddingHorizontal: 20,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     zIndex: 1000,
// //     borderWidth: 1,
// //     borderColor: COLORS.accent,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 8,
// //     elevation: 8,
// //   },
// //   toastIcon: {
// //     fontSize: 16,
// //     color: COLORS.accent,
// //     marginRight: 10,
// //   },
// //   toastText: {
// //     color: COLORS.textPrimary,
// //     fontSize: 14,
// //     fontWeight: '500',
// //   },
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   loadingText: {
// //     color: COLORS.textSecondary,
// //     marginTop: 12,
// //     fontSize: 14,
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingTop: 8,
// //     paddingBottom: 20,
// //   },
// //   vaultSelector: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: COLORS.bgCard,
// //     paddingHorizontal: 12,
// //     paddingVertical: 8,
// //     borderRadius: 20,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //   },
// //   vaultIcon: {
// //     fontSize: 14,
// //     marginRight: 8,
// //   },
// //   vaultName: {
// //     fontSize: 14,
// //     color: COLORS.textPrimary,
// //     fontWeight: '500',
// //   },
// //   settingsBtn: {
// //     padding: 4,
// //   },
// //   settingsIconContainer: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: 'transparent',
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   settingsIcon: {
// //     fontSize: 18,
// //     color: COLORS.textSecondary,
// //   },
// //   balanceContainer: {
// //     alignItems: 'center',
// //     paddingTop: 24,
// //     paddingBottom: 32,
// //   },
// //   balanceAmount: {
// //     fontSize: 44,
// //     color: COLORS.textPrimary,
// //     fontWeight: '300',
// //     letterSpacing: -1,
// //   },
// //   hideBalanceBtn: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginTop: 12,
// //     paddingHorizontal: 12,
// //     paddingVertical: 6,
// //     borderRadius: 16,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //   },
// //   hideBalanceIcon: {
// //     fontSize: 12,
// //     color: COLORS.accent,
// //     marginRight: 6,
// //   },
// //   hideBalanceText: {
// //     fontSize: 13,
// //     color: COLORS.accent,
// //     fontWeight: '500',
// //   },
// //   actionsRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //     paddingBottom: 24,
// //     gap: 20,
// //   },
// //   actionBtn: {
// //     alignItems: 'center',
// //     width: 64,
// //   },
// //   actionIconWrap: {
// //     width: 52,
// //     height: 52,
// //     backgroundColor: COLORS.bgCard,
// //     borderRadius: 14,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //   },
// //   actionIconActive: {
// //     backgroundColor: COLORS.accent,
// //     borderColor: COLORS.accent,
// //   },
// //   actionIconText: {
// //     fontSize: 20,
// //     color: COLORS.textPrimary,
// //   },
// //   actionIconTextActive: {
// //     fontSize: 20,
// //     color: COLORS.bgPrimary,
// //     fontWeight: '600',
// //   },
// //   actionText: {
// //     fontSize: 12,
// //     color: COLORS.textSecondary,
// //     fontWeight: '500',
// //   },
// //   portfolioHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingTop: 8,
// //     paddingBottom: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: COLORS.borderLight,
// //   },
// //   portfolioTitle: {
// //     fontSize: 15,
// //     color: COLORS.textPrimary,
// //     fontWeight: '500',
// //   },
// //   portfolioActions: {
// //     flexDirection: 'row',
// //     gap: 8,
// //   },
// //   portfolioActionBtn: {
// //     width: 36,
// //     height: 36,
// //     backgroundColor: COLORS.bgCard,
// //     borderRadius: 10,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //   },
// //   portfolioActionIcon: {
// //     fontSize: 16,
// //     color: COLORS.textSecondary,
// //   },
// //   tokenList: {
// //     backgroundColor: COLORS.bgCard,
// //     borderRadius: 16,
// //     marginTop: 12,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     overflow: 'hidden',
// //   },
// //   tokenRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: 14,
// //   },
// //   tokenRowBorder: {
// //     borderTopWidth: 1,
// //     borderTopColor: COLORS.borderLight,
// //   },
// //   tokenIcon: {
// //     marginRight: 12,
// //   },
// //   tokenIconGradient: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   tokenIconZec: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: '#F4B728',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   tokenIconEvm: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: '#627EEA',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   tokenIconSymbol: {
// //     fontSize: 18,
// //     color: COLORS.textPrimary,
// //     fontWeight: '600',
// //   },
// //   tokenIconSymbolDark: {
// //     fontSize: 16,
// //     color: '#1A1A1A',
// //     fontWeight: '700',
// //   },
// //   tokenDetails: {
// //     flex: 1,
// //   },
// //   tokenName: {
// //     fontSize: 15,
// //     color: COLORS.textPrimary,
// //     fontWeight: '500',
// //     marginBottom: 2,
// //   },
// //   tokenAddressWrap: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   tokenAddress: {
// //     fontSize: 12,
// //     color: COLORS.textMuted,
// //   },
// //   copyBtn: {
// //     fontSize: 12,
// //     color: COLORS.textMuted,
// //     marginLeft: 4,
// //   },
// //   tokenValues: {
// //     alignItems: 'flex-end',
// //     marginRight: 8,
// //   },
// //   tokenUsd: {
// //     fontSize: 15,
// //     color: COLORS.textPrimary,
// //     fontWeight: '500',
// //   },
// //   tokenBal: {
// //     fontSize: 12,
// //     color: COLORS.textMuted,
// //     marginTop: 2,
// //   },
// //   rowChevron: {
// //     fontSize: 20,
// //     color: COLORS.textMuted,
// //   },
// //   emptyTokens: {
// //     padding: 32,
// //     alignItems: 'center',
// //   },
// //   emptyTokensText: {
// //     color: COLORS.textMuted,
// //     fontSize: 14,
// //   },
// //   featuresHeader: {
// //     paddingTop: 24,
// //     paddingBottom: 12,
// //   },
// //   featuresTitle: {
// //     fontSize: 15,
// //     color: COLORS.textPrimary,
// //     fontWeight: '500',
// //   },
// //   featureRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: COLORS.bgCard,
// //     padding: 14,
// //     borderRadius: 14,
// //     marginBottom: 10,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //   },
// //   featureIcon: {
// //     width: 40,
// //     height: 40,
// //     backgroundColor: 'rgba(42, 82, 152, 0.3)',
// //     borderRadius: 10,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 12,
// //   },
// //   featureIconText: {
// //     fontSize: 18,
// //     color: COLORS.accent,
// //   },
// //   featureInfo: {
// //     flex: 1,
// //   },
// //   featureTitle: {
// //     fontSize: 14,
// //     color: COLORS.textPrimary,
// //     fontWeight: '500',
// //     marginBottom: 2,
// //   },
// //   featureDesc: {
// //     fontSize: 12,
// //     color: COLORS.textMuted,
// //   },
// //   featureArrow: {
// //     fontSize: 16,
// //     color: COLORS.accent,
// //   },
// //   footer: {
// //     paddingTop: 24,
// //     paddingBottom: 8,
// //     alignItems: 'center',
// //   },
// //   footerText: {
// //     fontSize: 11,
// //     color: COLORS.textMuted,
// //   },
// //   emptyCard: {
// //     backgroundColor: COLORS.bgCard,
// //     borderRadius: 20,
// //     padding: 32,
// //     marginTop: 80,
// //     alignItems: 'center',
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //   },
// //   emptyIconContainer: {
// //     width: 72,
// //     height: 72,
// //     borderRadius: 20,
// //     backgroundColor: 'rgba(42, 82, 152, 0.2)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 20,
// //   },
// //   emptyEmoji: {
// //     fontSize: 32,
// //   },
// //   emptyTitle: {
// //     fontSize: 20,
// //     fontWeight: '600',
// //     color: COLORS.textPrimary,
// //     marginBottom: 8,
// //   },
// //   emptyText: {
// //     fontSize: 14,
// //     color: COLORS.textSecondary,
// //     marginBottom: 24,
// //   },
// //   primaryButton: {
// //     width: '100%',
// //     backgroundColor: COLORS.accent,
// //     paddingVertical: 14,
// //     borderRadius: 12,
// //     alignItems: 'center',
// //     marginBottom: 10,
// //   },
// //   primaryButtonText: {
// //     color: COLORS.bgPrimary,
// //     fontSize: 15,
// //     fontWeight: '600',
// //   },
// //   secondaryButton: {
// //     width: '100%',
// //     backgroundColor: 'transparent',
// //     paddingVertical: 14,
// //     borderRadius: 12,
// //     alignItems: 'center',
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //   },
// //   secondaryButtonText: {
// //     color: COLORS.textPrimary,
// //     fontSize: 15,
// //     fontWeight: '500',
// //   },
// // });

// // export default HomeScreen;

// import React, { useState, useCallback, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   RefreshControl,
//   ActivityIndicator,
//   Dimensions,
//   Animated,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList, VaultData, isUnifiedVault, isTEEVault, getTEEAddresses } from '../types/navigation';
// import { useVaults } from '../context/VaultContext';
// import api from '../services/api';
// import { getAllBalances } from '../services/teeSevice';
// import Clipboard from '@react-native-clipboard/clipboard';
// import LinearGradient from 'react-native-linear-gradient';
// import Svg, { Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
// type RouteType = RouteProp<RootStackParamList, 'Home'>;

// const { width: SCREEN_WIDTH } = Dimensions.get('window');

// // ═══════════════════════════════════════════════════════════════
// // THEME COLORS
// // ═══════════════════════════════════════════════════════════════
// const COLORS = {
//   bgPrimary: '#02111B',
//   bgSecondary: '#061624',
//   bgCard: '#0D2137',
//   accent: '#33E6BF',
//   accentBlue: '#2A5298',
//   accentGlow: '#1E88E5',
//   textPrimary: '#FFFFFF',
//   textSecondary: '#8A9BAE',
//   textMuted: '#5A6B7E',
//   border: 'rgba(42, 82, 152, 0.3)',
//   borderLight: 'rgba(42, 82, 152, 0.15)',
//   success: '#10B981',
//   toastBg: '#1A3A4A',
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

// // ═══════════════════════════════════════════════════════════════
// // THEMED TOAST COMPONENT
// // ═══════════════════════════════════════════════════════════════
// interface ToastProps {
//   visible: boolean;
//   message: string;
// }

// const Toast = ({ visible, message }: ToastProps) => {
//   const opacity = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     if (visible) {
//       Animated.sequence([
//         Animated.timing(opacity, {
//           toValue: 1,
//           duration: 200,
//           useNativeDriver: true,
//         }),
//         Animated.delay(1500),
//         Animated.timing(opacity, {
//           toValue: 0,
//           duration: 200,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     }
//   }, [visible, message]);

//   if (!visible) return null;

//   return (
//     <Animated.View style={[styles.toast, { opacity }]}>
//       <Text style={styles.toastIcon}>✓</Text>
//       <Text style={styles.toastText}>{message}</Text>
//     </Animated.View>
//   );
// };

// // ═══════════════════════════════════════════════════════════════
// // HOME SCREEN
// // ═══════════════════════════════════════════════════════════════
// const HomeScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<RouteType>();
//   const { activeVault, vaults, isLoading: contextLoading } = useVaults();

//   const [refreshing, setRefreshing] = useState(false);
//   const [solBalance, setSolBalance] = useState<number>(0);
//   const [solUsd, setSolUsd] = useState<number>(0);
//   const [zecBalance, setZecBalance] = useState<number>(0);
//   const [zecUsd, setZecUsd] = useState<number>(0);
//   const [evmBalance, setEvmBalance] = useState<number>(0);
//   const [evmUsd, setEvmUsd] = useState<number>(0);
//   const [loadingBalance, setLoadingBalance] = useState(false);
//   const [teeWallet, setTeeWallet] = useState<VaultData | null>(null);
  
//   // Toast state
//   const [toastVisible, setToastVisible] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');

//   // Load TEE wallet from AsyncStorage on mount
//   useEffect(() => {
//     const loadTEEWallet = async () => {
//       try {
//         const stored = await AsyncStorage.getItem('tee_wallet');
//         if (stored) {
//           setTeeWallet(JSON.parse(stored));
//         }
//       } catch (error) {
//         console.log('Error loading TEE wallet:', error);
//       }
//     };
//     loadTEEWallet();
//   }, []);

//   const routeVault = route.params?.vault;
//   const vault: VaultData | null = routeVault || (activeVault as VaultData | null) || teeWallet;
  
//   const isSeedless = vault?.wallet_type === 'seedless';
//   const isTEE = vault ? isTEEVault(vault) : false;
//   const teeAddresses = vault ? getTEEAddresses(vault) : { evm: null, solana: null };
//   const unified = vault ? isUnifiedVault(vault) : false;

//   // Chain detection
//   const hasSol = !isSeedless && (vault?.chain === 'SOL' || vault?.sol?.address || vault?.chain === 'unified' || (isTEE && teeAddresses.solana));
//   const hasZec = isSeedless || vault?.chain === 'ZEC' || vault?.zec?.address || vault?.zec?.unified_address || vault?.zec?.transparent_address || vault?.chain === 'unified';
//   const hasEvm = isTEE && teeAddresses.evm;

//   // ═══════════════════════════════════════════════════════════════
//   // SHOW TOAST
//   // ═══════════════════════════════════════════════════════════════
//   const showToast = useCallback((message: string) => {
//     setToastMessage(message);
//     setToastVisible(true);
//     setTimeout(() => setToastVisible(false), 2000);
//   }, []);

//   // ═══════════════════════════════════════════════════════════════
//   // COPY ADDRESS (with themed toast)
//   // ═══════════════════════════════════════════════════════════════
//   const copyAddress = useCallback((address: string | undefined | null) => {
//     if (!address) return;
    
//     Clipboard.setString(address);
//     const shortAddr = `${address.slice(0, 6)}...${address.slice(-4)}`;
//     showToast(`Copied: ${shortAddr}`);
//   }, [showToast]);

//   // ═══════════════════════════════════════════════════════════════
//   // LOAD BALANCES (with error handling)
//   // ═══════════════════════════════════════════════════════════════
//   const loadBalances = useCallback(async () => {
//     if (!vault) return;
    
//     setLoadingBalance(true);

//     try {
//       // TEE Wallet - use teeService for all balances
//       if (isTEE && (teeAddresses.solana || teeAddresses.evm)) {
//         const balances = await getAllBalances(teeAddresses.solana, teeAddresses.evm);
        
//         // Update SOL balance
//         if (balances.solana) {
//           const solPrice = 200; // TODO: fetch real price
//           setSolBalance(balances.solana.sol);
//           setSolUsd(balances.solana.sol * solPrice);
//         }
        
//         // Update ETH balance
//         if (balances.evm) {
//           const ethPrice = 2950; // TODO: fetch real price
//           setEvmBalance(balances.evm.eth);
//           setEvmUsd(balances.evm.eth * ethPrice);
//         }
//       } else {
//         // Non-TEE wallet - use existing API
        
//         // Load SOL balance
//         if (hasSol) {
//           const address = vault.sol?.address || vault.address;
//           if (address) {
//             try {
//               const response = await api.getSolBalance(address);
//               if (response.success !== false) {
//                 const bal = response.sol || response.balance || 0;
//                 const usd = response.usd || bal * 200;
//                 setSolBalance(bal);
//                 setSolUsd(usd);
//               }
//             } catch (err: any) {
//               console.log('[Balance] SOL fetch failed, keeping previous value');
//             }
//           }
//         }

//         // Load ZEC balance
//         if (hasZec && (vault.zec?.address || vault.zec?.unified_address)) {
//           const zecAddress = vault.zec?.unified_address || vault.zec?.address;
//           try {
//             const response = await api.getZecBalance(zecAddress!);
//             if (response.success !== false) {
//               const bal = response.shielded_balance || response.balance || response.total_zec || 0;
//               const usd = response.usd || bal * 40;
//               setZecBalance(bal);
//               setZecUsd(usd);
//             }
//           } catch (err) {
//             console.log('[Balance] ZEC fetch failed, keeping previous value');
//           }
//         }
//       }
//     } catch (error) {
//       console.log('[Balance] General error:', error);
//     } finally {
//       setLoadingBalance(false);
//     }
//   }, [vault, hasSol, hasZec, hasEvm, isTEE, teeAddresses]);

//   // Load balances on focus (but not too frequently)
//   const lastLoadRef = useRef<number>(0);
  
//   useFocusEffect(
//     useCallback(() => {
//       if (vault) {
//         const now = Date.now();
//         // Only load if more than 10 seconds since last load
//         if (now - lastLoadRef.current > 10000) {
//           lastLoadRef.current = now;
//           loadBalances();
//         }
//       }
//     }, [vault, loadBalances])
//   );

//   const onRefresh = async () => {
//     setRefreshing(true);
//     lastLoadRef.current = Date.now();
//     await loadBalances();
//     setRefreshing(false);
//   };

//   const formatAddress = (address: string | undefined | null) => {
//     if (!address) return '';
//     return `${address.slice(0, 6)}...${address.slice(-4)}`;
//   };

//   const safeToFixed = (value: number | undefined | null, decimals: number = 2): string => {
//     if (value === undefined || value === null || isNaN(value)) {
//       return '0.00';
//     }
//     return value.toFixed(decimals);
//   };

//   const totalUsd = (hasSol ? solUsd : 0) + (hasZec ? zecUsd : 0) + (hasEvm ? evmUsd : 0);

//   // ═══════════════════════════════════════════════════════════════
//   // EMPTY STATE
//   // ═══════════════════════════════════════════════════════════════
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
//                 onPress={() => navigation.navigate('ChainSelection', {})}
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

//   // ═══════════════════════════════════════════════════════════════
//   // LOADING STATE
//   // ═══════════════════════════════════════════════════════════════
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

//   // ═══════════════════════════════════════════════════════════════
//   // MAIN SCREEN
//   // ═══════════════════════════════════════════════════════════════
//   return (
//     <View style={styles.container}>
//       <GradientHalo />

//       {/* Themed Toast */}
//       <Toast visible={toastVisible} message={toastMessage} />

//       <SafeAreaView style={styles.safeArea}>
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.scrollContent}
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />
//           }
//         >
//           {/* Header - NO ACTION on TEE Wallet click */}
//           <View style={styles.header}>
//             <View style={styles.vaultSelector}>
//               <Text style={styles.vaultIcon}>{isTEE ? '🛡️' : '⚡'}</Text>
//               <Text style={styles.vaultName}>{vault?.vault_name || 'My Wallet'}</Text>
//               {/* Removed dropdown arrow since no action */}
//             </View>

//             <TouchableOpacity style={styles.settingsBtn} activeOpacity={0.7}>
//               <View style={styles.settingsIconContainer}>
//                 <Text style={styles.settingsIcon}>⚙</Text>
//               </View>
//             </TouchableOpacity>
//           </View>

//           {/* Balance Display */}
//           <View style={styles.balanceContainer}>
//             {loadingBalance && totalUsd === 0 ? (
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
//               style={[styles.actionBtn, isTEE && styles.actionBtnDisabled]}
//               onPress={() => !isTEE && navigation.navigate('Swap', { vault: vault || undefined })}
//               activeOpacity={isTEE ? 1 : 0.7}
//               disabled={isTEE}
//             >
//               <View style={[styles.actionIconWrap, !isTEE && styles.actionIconActive, isTEE && styles.actionIconDisabled]}>
//                 <Text style={[!isTEE ? styles.actionIconTextActive : styles.actionIconText, isTEE && styles.actionIconTextDisabled]}>⇄</Text>
//               </View>
//               <Text style={[styles.actionText, isTEE && styles.actionTextDisabled]}>
//                 {isTEE ? 'Coming Soon' : 'Swap'}
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.actionBtn}
//               onPress={() => vault && navigation.navigate('Send', { vault, chain: isTEE ? 'EVM' : 'SOL' })}
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
//               onPress={() => vault && navigation.navigate('AgentDashboard', { vault })}
//               activeOpacity={0.7}
//               disabled={!vault}
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
//             {/* EVM Row (TEE wallets only) */}
//             {hasEvm && (
//               <TouchableOpacity 
//                 style={styles.tokenRow} 
//                 activeOpacity={0.7}
//                 onPress={() => copyAddress(teeAddresses.evm)}
//               >
//                 <View style={styles.tokenIcon}>
//                   <View style={styles.tokenIconEvm}>
//                     <Text style={styles.tokenIconSymbol}>Ξ</Text>
//                   </View>
//                 </View>
//                 <View style={styles.tokenDetails}>
//                   <Text style={styles.tokenName}>Ethereum</Text>
//                   <View style={styles.tokenAddressWrap}>
//                     <Text style={styles.tokenAddress}>
//                       {formatAddress(teeAddresses.evm)}
//                     </Text>
//                     <Text style={styles.copyBtn}>⧉</Text>
//                   </View>
//                 </View>
//                 <View style={styles.tokenValues}>
//                   <Text style={styles.tokenUsd}>${safeToFixed(evmUsd, 2)}</Text>
//                   <Text style={styles.tokenBal}>{safeToFixed(evmBalance, 4)} ETH</Text>
//                 </View>
//                 <Text style={styles.rowChevron}>›</Text>
//               </TouchableOpacity>
//             )}

//             {/* SOL Row */}
//             {hasSol && (
//               <TouchableOpacity 
//                 style={[styles.tokenRow, hasEvm && styles.tokenRowBorder]} 
//                 activeOpacity={0.7}
//                 onPress={() => copyAddress(isTEE ? teeAddresses.solana : (vault?.sol?.address || vault?.address))}
//               >
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
//                       {formatAddress(isTEE ? teeAddresses.solana : (vault?.sol?.address || vault?.address))}
//                     </Text>
//                     <Text style={styles.copyBtn}>⧉</Text>
//                   </View>
//                 </View>
//                 <View style={styles.tokenValues}>
//                   <Text style={styles.tokenUsd}>${safeToFixed(solUsd, 2)}</Text>
//                   <Text style={styles.tokenBal}>{safeToFixed(solBalance, 4)} SOL</Text>
//                 </View>
//                 <Text style={styles.rowChevron}>›</Text>
//               </TouchableOpacity>
//             )}

//             {/* ZEC Row */}
//             {hasZec && (vault?.zec?.address || vault?.zec?.unified_address) && (
//               <TouchableOpacity 
//                 style={[styles.tokenRow, (hasSol || hasEvm) && styles.tokenRowBorder]} 
//                 activeOpacity={0.7}
//                 onPress={() => copyAddress(vault?.zec?.unified_address || vault?.zec?.address)}
//               >
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
//                   <Text style={styles.tokenBal}>{safeToFixed(zecBalance, 4)} ZEC</Text>
//                 </View>
//                 <Text style={styles.rowChevron}>›</Text>
//               </TouchableOpacity>
//             )}

//             {!hasSol && !hasZec && !hasEvm && (
//               <View style={styles.emptyTokens}>
//                 <Text style={styles.emptyTokensText}>No assets yet</Text>
//               </View>
//             )}
//           </View>

//           {/* Features Section */}
//           {vault && (
//             <>
//               <View style={styles.featuresHeader}>
//                 <Text style={styles.featuresTitle}>Features</Text>
//               </View>

//               {!isSeedless && !isTEE && (
//                 <TouchableOpacity
//                   style={styles.featureRow}
//                   onPress={() => navigation.navigate('DarkPool', { vault_id: vault.vault_id, vault })}
//                   activeOpacity={0.7}
//                 >
//                   <View style={styles.featureIcon}>
//                     <Text style={styles.featureIconText}>◈</Text>
//                   </View>
//                   <View style={styles.featureInfo}>
//                     <Text style={styles.featureTitle}>Dark Pool Trading</Text>
//                     <Text style={styles.featureDesc}>MEV-protected encrypted orders</Text>
//                   </View>
//                   <Text style={styles.featureArrow}>→</Text>
//                 </TouchableOpacity>
//               )}

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
//                   <Text style={styles.featureDesc}>
//                     {isTEE ? 'Download backup file' : 'Secure your wallet keys'}
//                   </Text>
//                 </View>
//                 <Text style={styles.featureArrow}>→</Text>
//               </TouchableOpacity>
//             </>
//           )}

//           {/* Footer */}
//           <View style={styles.footer}>
//             <Text style={styles.footerText}>
//               {isTEE ? '🛡️ Secured by Oasis TEE' : isSeedless ? '◈ Secured by Oasis TEE' : '◈ Powered by ZkAGI'}
//             </Text>
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </View>
//   );
// };

// // ═══════════════════════════════════════════════════════════════
// // STYLES
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
//   // Toast styles
//   toast: {
//     position: 'absolute',
//     bottom: 100,
//     left: 20,
//     right: 20,
//     backgroundColor: COLORS.toastBg,
//     borderRadius: 12,
//     paddingVertical: 14,
//     paddingHorizontal: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     zIndex: 1000,
//     borderWidth: 1,
//     borderColor: COLORS.accent,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   toastIcon: {
//     fontSize: 16,
//     color: COLORS.accent,
//     marginRight: 10,
//   },
//   toastText: {
//     color: COLORS.textPrimary,
//     fontSize: 14,
//     fontWeight: '500',
//   },
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
//     marginRight: 8,
//   },
//   vaultName: {
//     fontSize: 14,
//     color: COLORS.textPrimary,
//     fontWeight: '500',
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
//   actionIconDisabled: {
//     backgroundColor: COLORS.bgCard,
//     borderColor: COLORS.border,
//     opacity: 0.5,
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
//   actionIconTextDisabled: {
//     color: COLORS.textMuted,
//   },
//   actionText: {
//     fontSize: 12,
//     color: COLORS.textSecondary,
//     fontWeight: '500',
//   },
//   actionTextDisabled: {
//     color: COLORS.textMuted,
//     fontSize: 10,
//   },
//   actionBtnDisabled: {
//     opacity: 0.7,
//   },
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
//   },
//   tokenRowBorder: {
//     borderTopWidth: 1,
//     borderTopColor: COLORS.borderLight,
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
//   tokenIconEvm: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#627EEA',
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
//   footer: {
//     paddingTop: 24,
//     paddingBottom: 8,
//     alignItems: 'center',
//   },
//   footerText: {
//     fontSize: 11,
//     color: COLORS.textMuted,
//   },
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

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, VaultData, isUnifiedVault, isTEEVault, getTEEAddresses } from '../types/navigation';
import { useVaults } from '../context/VaultContext';
import api from '../services/api';
import { getAllBalances, loadSession, ensureSessionLoaded } from '../services/teeSevice';
import Clipboard from '@react-native-clipboard/clipboard';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ═══════════════════════════════════════════════════════════════
// CUSTOM ICONS - Update paths to match your asset folder structure
// ═══════════════════════════════════════════════════════════════
const ICONS = {
  paw: require('../assets/icons/paw.png'),
  solana: require('../assets/icons/solana.png'),
  ethereum: require('../assets/icons/ethereum.png'),
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type RouteType = RouteProp<RootStackParamList, 'Home'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ═══════════════════════════════════════════════════════════════
// THEME COLORS
// ═══════════════════════════════════════════════════════════════
const COLORS = {
  bgPrimary: '#02111B',
  bgSecondary: '#061624',
  bgCard: '#0D2137',
  accent: '#33E6BF',
  accentBlue: '#2A5298',
  accentGlow: '#1E88E5',
  textPrimary: '#FFFFFF',
  textSecondary: '#8A9BAE',
  textMuted: '#5A6B7E',
  border: 'rgba(42, 82, 152, 0.3)',
  borderLight: 'rgba(42, 82, 152, 0.15)',
  success: '#10B981',
  toastBg: '#1A3A4A',
  ethereum: '#627EEA',
  solana: '#9945FF',
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

// ═══════════════════════════════════════════════════════════════
// THEMED TOAST COMPONENT
// ═══════════════════════════════════════════════════════════════
interface ToastProps {
  visible: boolean;
  message: string;
}

const Toast = ({ visible, message }: ToastProps) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(1500),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, message]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toast, { opacity }]}>
      <Text style={styles.toastIcon}>✓</Text>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

// ═══════════════════════════════════════════════════════════════
// HOME SCREEN
// ═══════════════════════════════════════════════════════════════
const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { activeVault, vaults, isLoading: contextLoading } = useVaults();

  const [refreshing, setRefreshing] = useState(false);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [solUsd, setSolUsd] = useState<number>(0);
  const [solUsdcBalance, setSolUsdcBalance] = useState<number>(0); // USDC on Solana
  const [zecBalance, setZecBalance] = useState<number>(0);
  const [zecUsd, setZecUsd] = useState<number>(0);
  const [evmBalance, setEvmBalance] = useState<number>(0);
  const [evmUsd, setEvmUsd] = useState<number>(0);
  const [ethUsdcBalance, setEthUsdcBalance] = useState<number>(0); // USDC on Ethereum
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [teeWallet, setTeeWallet] = useState<VaultData | null>(null);
  
  // Agent state - check if agent exists for this wallet
  const [hasAgent, setHasAgent] = useState<boolean>(false);
  const [agentData, setAgentData] = useState<any>(null);
  const [checkingAgent, setCheckingAgent] = useState<boolean>(false);
  
  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Load TEE wallet from AsyncStorage on mount
  useEffect(() => {
    const loadTEEWallet = async () => {
      try {
        // Load TEE session first (restores token from AsyncStorage)
        await loadSession();
        
        // Then load wallet
        const stored = await AsyncStorage.getItem('tee_wallet');
        if (stored) {
          setTeeWallet(JSON.parse(stored));
        }
      } catch (error) {
        console.log('Error loading TEE wallet:', error);
      }
    };
    loadTEEWallet();
  }, []);

  const routeVault = route.params?.vault;
  const vault: VaultData | null = routeVault || (activeVault as VaultData | null) || teeWallet;
  
  const isSeedless = vault?.wallet_type === 'seedless';
  const isTEE = vault ? isTEEVault(vault) : false;
  const teeAddresses = vault ? getTEEAddresses(vault) : { evm: null, solana: null };
  const unified = vault ? isUnifiedVault(vault) : false;

  // Chain detection
  const hasSol = !isSeedless && (vault?.chain === 'SOL' || vault?.sol?.address || vault?.chain === 'unified' || (isTEE && teeAddresses.solana));
  const hasZec = isSeedless || vault?.chain === 'ZEC' || vault?.zec?.address || vault?.zec?.unified_address || vault?.zec?.transparent_address || vault?.chain === 'unified';
  const hasEvm = isTEE && teeAddresses.evm;

  // ═══════════════════════════════════════════════════════════════
  // GET VAULT IDENTIFIER (handles TEE wallets without vault_id)
  // This is a regular function, not a hook, to avoid hook ordering issues
  // ═══════════════════════════════════════════════════════════════
  const getVaultIdentifier = (v: VaultData | null): string | null => {
    if (!v) return null;
    
    // For TEE wallets - prefer uid, then evm address, then solana address
    if (v.wallet_type === 'tee' || v.tee) {
      return v.tee?.uid 
          || v.vault_id 
          || v.tee?.evm?.address 
          || v.tee?.solana?.address
          || null;
    }
    
    // For seed/seedless wallets
    return v.vault_id || v.sol?.vault_id || null;
  };

  // ═══════════════════════════════════════════════════════════════
  // CHECK IF AGENT EXISTS FOR THIS VAULT
  // Uses: GET /api/ai/agents/vault/:vault_id
  // For TEE: uses uid or evm address as identifier
  // ═══════════════════════════════════════════════════════════════
  const checkAgentExists = useCallback(async () => {
    const vaultId = getVaultIdentifier(vault);
    if (!vaultId) {
      console.log('[Agent] No vault identifier found');
      return;
    }
    
    setCheckingAgent(true);
    try {
      // Use the correct API method: getAgentForVault
      // This calls: GET /api/ai/agents/vault/:vault_id
      const response = await api.getAgentForVault(vaultId);
      
      if (response.success && response.agent) {
        setHasAgent(true);
        setAgentData(response.agent);
        console.log('[Agent] Found existing agent:', response.agent.agent_id);
      } else {
        setHasAgent(false);
        setAgentData(null);
        console.log('[Agent] No agent found for vault:', vaultId);
      }
    } catch (error) {
      console.log('[Agent] Check failed:', error);
      setHasAgent(false);
      setAgentData(null);
    } finally {
      setCheckingAgent(false);
    }
  }, [vault]);

  // Check agent on mount and when vault changes
  useEffect(() => {
    checkAgentExists();
  }, [checkAgentExists]);

  // Re-check agent when screen is focused (in case agent was just created)
  useFocusEffect(
    useCallback(() => {
      checkAgentExists();
    }, [checkAgentExists])
  );

  // ═══════════════════════════════════════════════════════════════
  // HANDLE AGENT BUTTON PRESS
  // If agent exists → go to Dashboard
  // If no agent → go to Setup
  // ═══════════════════════════════════════════════════════════════
  const handleAgentPress = useCallback(() => {
    if (!vault) return;
    
    if (hasAgent && agentData) {
      // Agent exists → Go directly to Dashboard
      console.log('[Agent] Navigating to Dashboard (agent exists)');
      navigation.navigate('AgentDashboard', { vault, agent: agentData });
    } else {
      // No agent → Go to Setup
      console.log('[Agent] Navigating to Setup (no agent)');
      navigation.navigate('AgentSetup', { vault });
    }
  }, [vault, hasAgent, agentData, navigation]);

  // ═══════════════════════════════════════════════════════════════
  // SHOW TOAST
  // ═══════════════════════════════════════════════════════════════
  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // COPY ADDRESS
  // ═══════════════════════════════════════════════════════════════
  const copyAddress = useCallback((address: string | undefined | null) => {
    if (!address) return;
    
    Clipboard.setString(address);
    const shortAddr = `${address.slice(0, 6)}...${address.slice(-4)}`;
    showToast(`Copied: ${shortAddr}`);
  }, [showToast]);

  // ═══════════════════════════════════════════════════════════════
  // LOAD BALANCES
  // ═══════════════════════════════════════════════════════════════
  const loadBalances = useCallback(async () => {
    if (!vault) return;
    
    setLoadingBalance(true);

    try {
      if (isTEE && (teeAddresses.solana || teeAddresses.evm)) {
        const balances = await getAllBalances(teeAddresses.solana, teeAddresses.evm);
        
        if (balances.solana) {
          const solPrice = 200;
          setSolBalance(balances.solana.sol);
          setSolUsd(balances.solana.sol * solPrice);
          setSolUsdcBalance(balances.solana.usdc || 0); // USDC on Solana
        }
        
        if (balances.evm) {
          const ethPrice = 2950;
          setEvmBalance(balances.evm.eth);
          setEvmUsd(balances.evm.eth * ethPrice);
          setEthUsdcBalance(balances.evm.usdc || 0); // USDC on Ethereum
        }
      } else {
        if (hasSol) {
          const address = vault.sol?.address || vault.address;
          if (address) {
            try {
              const response = await api.getSolBalance(address);
              if (response.success !== false) {
                const bal = response.sol || response.balance || 0;
                const usd = response.usd || bal * 200;
                setSolBalance(bal);
                setSolUsd(usd);
              }
            } catch (err: any) {
              console.log('[Balance] SOL fetch failed');
            }
          }
        }

        if (hasZec && (vault.zec?.address || vault.zec?.unified_address)) {
          const zecAddress = vault.zec?.unified_address || vault.zec?.address;
          try {
            const response = await api.getZecBalance(zecAddress!);
            if (response.success !== false) {
              const bal = response.shielded_balance || response.balance || response.total_zec || 0;
              const usd = response.usd || bal * 40;
              setZecBalance(bal);
              setZecUsd(usd);
            }
          } catch (err) {
            console.log('[Balance] ZEC fetch failed');
          }
        }
      }
    } catch (error) {
      console.log('[Balance] General error:', error);
    } finally {
      setLoadingBalance(false);
    }
  }, [vault, hasSol, hasZec, hasEvm, isTEE, teeAddresses]);

  const lastLoadRef = useRef<number>(0);
  
  useFocusEffect(
    useCallback(() => {
      if (vault) {
        const now = Date.now();
        if (now - lastLoadRef.current > 10000) {
          lastLoadRef.current = now;
          loadBalances();
        }
      }
    }, [vault, loadBalances])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    lastLoadRef.current = Date.now();
    await Promise.all([loadBalances(), checkAgentExists()]);
    setRefreshing(false);
  };

  const formatAddress = (address: string | undefined | null) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const safeToFixed = (value: number | undefined | null, decimals: number = 2): string => {
    if (value === undefined || value === null || isNaN(value)) {
      return '0.00';
    }
    return value.toFixed(decimals);
  };

  // Total USD includes native tokens + USDC
  const totalUsd = (hasSol ? solUsd : 0) + (hasZec ? zecUsd : 0) + (hasEvm ? evmUsd : 0) + solUsdcBalance + ethUsdcBalance;

  // ═══════════════════════════════════════════════════════════════
  // EMPTY STATE
  // ═══════════════════════════════════════════════════════════════
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
                onPress={() => navigation.navigate('ChainSelection', {})}
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

  // ═══════════════════════════════════════════════════════════════
  // LOADING STATE
  // ═══════════════════════════════════════════════════════════════
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

  // ═══════════════════════════════════════════════════════════════
  // MAIN SCREEN
  // ═══════════════════════════════════════════════════════════════
  return (
    <View style={styles.container}>
      <GradientHalo />
      <Toast visible={toastVisible} message={toastMessage} />

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
            <View style={styles.vaultSelector}>
              <Text style={styles.vaultIcon}>{isTEE ? '🛡️' : '⚡'}</Text>
              <Text style={styles.vaultName}>{vault?.vault_name || 'My Wallet'}</Text>
            </View>

            <TouchableOpacity style={styles.settingsBtn} activeOpacity={0.7}>
              <View style={styles.settingsIconContainer}>
                <Text style={styles.settingsIcon}>⚙</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Balance Display */}
          <View style={styles.balanceContainer}>
            {loadingBalance && totalUsd === 0 ? (
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
            {/* Swap Button */}
            <TouchableOpacity
              style={[styles.actionBtn, isTEE && styles.actionBtnDisabled]}
              onPress={() => !isTEE && navigation.navigate('Swap', { vault: vault || undefined })}
              activeOpacity={isTEE ? 1 : 0.7}
              disabled={isTEE}
            >
              <View style={[styles.actionIconWrap, !isTEE && styles.actionIconActive, isTEE && styles.actionIconDisabled]}>
                <Text style={[!isTEE ? styles.actionIconTextActive : styles.actionIconText, isTEE && styles.actionIconTextDisabled]}>⇄</Text>
              </View>
              <Text style={[styles.actionText, isTEE && styles.actionTextDisabled]}>
                {isTEE ? 'Coming Soon' : 'Swap'}
              </Text>
            </TouchableOpacity>

            {/* Send Button */}
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => vault && navigation.navigate('Send', { vault, chain: isTEE ? 'EVM' : 'SOL' })}
              activeOpacity={0.7}
            >
              <View style={styles.actionIconWrap}>
                <Text style={styles.actionIconText}>↗</Text>
              </View>
              <Text style={styles.actionText}>Send</Text>
            </TouchableOpacity>

            {/* Buy Button */}
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

            {/* Agent Button - SMART ROUTING */}
            {/* If agent exists → Dashboard, if not → Setup */}
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleAgentPress}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconWrap, hasAgent && styles.actionIconActive]}>
                <Image 
                  source={ICONS.paw} 
                  style={[styles.actionIconImage, hasAgent && { tintColor: COLORS.bgPrimary }]}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.actionText}>Agent</Text>
            </TouchableOpacity>
          </View>

          {/* Agent Dashboard Button - Only show if agent exists */}
          {hasAgent && (
            <TouchableOpacity
              style={styles.agentDashboardBtn}
              onPress={() => vault && navigation.navigate('AgentDashboard', { vault, agent: agentData })}
              activeOpacity={0.8}
            >
              <View style={styles.agentDashboardContent}>
                <View style={styles.agentDashboardIconWrap}>
                  <Image 
                    source={ICONS.paw} 
                    style={styles.agentDashboardIcon}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.agentDashboardInfo}>
                  <Text style={styles.agentDashboardTitle}>Agent Dashboard</Text>
                  <Text style={styles.agentDashboardDesc}>View your AI agent's activity</Text>
                </View>
                <Text style={styles.agentDashboardArrow}>→</Text>
              </View>
            </TouchableOpacity>
          )}

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
            {/* EVM/Ethereum Row */}
            {hasEvm && (
              <TouchableOpacity 
                style={styles.tokenRow} 
                activeOpacity={0.7}
                onPress={() => copyAddress(teeAddresses.evm)}
              >
                <View style={styles.tokenIcon}>
                  <View style={[styles.tokenIconContainer, { backgroundColor: COLORS.ethereum }]}>
                    <Image 
                      source={ICONS.ethereum} 
                      style={styles.tokenIconImage}
                      resizeMode="contain"
                    />
                  </View>
                </View>
                <View style={styles.tokenDetails}>
                  <Text style={styles.tokenName}>Ethereum</Text>
                  <View style={styles.tokenAddressWrap}>
                    <Text style={styles.tokenAddress}>
                      {formatAddress(teeAddresses.evm)}
                    </Text>
                    <Text style={styles.copyBtn}>⧉</Text>
                  </View>
                </View>
                <View style={styles.tokenValues}>
                  <Text style={styles.tokenUsd}>${safeToFixed(evmUsd + ethUsdcBalance, 2)}</Text>
                  <Text style={styles.tokenBal}>{safeToFixed(evmBalance, 4)} ETH</Text>
                  {isTEE && (
                    <Text style={styles.tokenBalUsdc}>{safeToFixed(ethUsdcBalance, 2)} USDC</Text>
                  )}
                </View>
                <Text style={styles.rowChevron}>›</Text>
              </TouchableOpacity>
            )}

            {/* SOL/Solana Row */}
            {hasSol && (
              <TouchableOpacity 
                style={[styles.tokenRow, hasEvm && styles.tokenRowBorder]} 
                activeOpacity={0.7}
                onPress={() => copyAddress(isTEE ? teeAddresses.solana : (vault?.sol?.address || vault?.address))}
              >
                <View style={styles.tokenIcon}>
                  <LinearGradient
                    colors={['#9945FF', '#14F195']}
                    style={styles.tokenIconContainer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Image 
                      source={ICONS.solana} 
                      style={styles.tokenIconImage}
                      resizeMode="contain"
                    />
                  </LinearGradient>
                </View>
                <View style={styles.tokenDetails}>
                  <Text style={styles.tokenName}>Solana</Text>
                  <View style={styles.tokenAddressWrap}>
                    <Text style={styles.tokenAddress}>
                      {formatAddress(isTEE ? teeAddresses.solana : (vault?.sol?.address || vault?.address))}
                    </Text>
                    <Text style={styles.copyBtn}>⧉</Text>
                  </View>
                </View>
                <View style={styles.tokenValues}>
                  <Text style={styles.tokenUsd}>${safeToFixed(solUsd + solUsdcBalance, 2)}</Text>
                  <Text style={styles.tokenBal}>{safeToFixed(solBalance, 4)} SOL</Text>
                  {isTEE && (
                    <Text style={styles.tokenBalUsdc}>{safeToFixed(solUsdcBalance, 2)} USDC</Text>
                  )}
                </View>
                <Text style={styles.rowChevron}>›</Text>
              </TouchableOpacity>
            )}

            {/* ZEC Row */}
            {hasZec && (vault?.zec?.address || vault?.zec?.unified_address) && (
              <TouchableOpacity 
                style={[styles.tokenRow, (hasSol || hasEvm) && styles.tokenRowBorder]} 
                activeOpacity={0.7}
                onPress={() => copyAddress(vault?.zec?.unified_address || vault?.zec?.address)}
              >
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
                  <Text style={styles.tokenBal}>{safeToFixed(zecBalance, 4)} ZEC</Text>
                </View>
                <Text style={styles.rowChevron}>›</Text>
              </TouchableOpacity>
            )}

            {!hasSol && !hasZec && !hasEvm && (
              <View style={styles.emptyTokens}>
                <Text style={styles.emptyTokensText}>No assets yet</Text>
              </View>
            )}
          </View>

          {/* Features Section */}
          {vault && (
            <>
              <View style={styles.featuresHeader}>
                <Text style={styles.featuresTitle}>Features</Text>
              </View>

              {!isSeedless && !isTEE && (
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
              )}

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
                  <Text style={styles.featureDesc}>
                    {isTEE ? 'Download backup file' : 'Secure your wallet keys'}
                  </Text>
                </View>
                <Text style={styles.featureArrow}>→</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isTEE ? '🛡️ Secured by Oasis TEE' : isSeedless ? '◈ Secured by Oasis TEE' : '◈ Powered by ZkAGI'}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
// STYLES
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
  toast: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: COLORS.toastBg,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
    borderWidth: 1,
    borderColor: COLORS.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  toastIcon: {
    fontSize: 16,
    color: COLORS.accent,
    marginRight: 10,
  },
  toastText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
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
    marginRight: 8,
  },
  vaultName: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
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
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 16,
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
  actionIconDisabled: {
    backgroundColor: COLORS.bgCard,
    borderColor: COLORS.border,
    opacity: 0.5,
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
  actionIconTextDisabled: {
    color: COLORS.textMuted,
  },
  actionIconImage: {
    width: 24,
    height: 24,
    tintColor: COLORS.textPrimary,
  },
  actionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  actionTextDisabled: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  actionBtnDisabled: {
    opacity: 0.7,
  },
  agentDashboardBtn: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.accent,
    overflow: 'hidden',
  },
  agentDashboardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  agentDashboardIconWrap: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  agentDashboardIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.bgPrimary,
  },
  agentDashboardInfo: {
    flex: 1,
  },
  agentDashboardTitle: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: 2,
  },
  agentDashboardDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  agentDashboardArrow: {
    fontSize: 18,
    color: COLORS.accent,
    fontWeight: '600',
  },
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
  },
  tokenRowBorder: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  tokenIcon: {
    marginRight: 12,
  },
  tokenIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenIconImage: {
    width: 22,
    height: 22,
    tintColor: COLORS.textPrimary,
  },
  tokenIconZec: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4B728',
    justifyContent: 'center',
    alignItems: 'center',
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
  tokenBalUsdc: {
    fontSize: 11,
    color: COLORS.accent,
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
  footer: {
    paddingTop: 24,
    paddingBottom: 8,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
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