// // // import React, { useEffect, useState } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   TouchableOpacity,
// // //   SafeAreaView,
// // //   ScrollView,
// // //   ActivityIndicator,
// // //   Clipboard,
// // //   Alert,
// // // } from 'react-native';
// // // import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
// // // import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// // // import { RootStackParamList } from '../types/navigation';
// // // import api from '../services/api';
// // // import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

// // // type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
// // // type RoutePropType = RouteProp<RootStackParamList, 'Home'>;

// // // const HomeScreen = () => {
// // //   const route = useRoute<RoutePropType>();
// // //   const navigation = useNavigation<NavigationProp>();
// // //   const vault = route.params?.vault;
  
// // //   const [chains, setChains] = useState<string[]>([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [copied, setCopied] = useState(false);
// // //   const [balance, setBalance] = useState<number>(0);

// // //   useEffect(() => {
// // //     if (!vault) {
// // //       loadChains();
// // //     }
// // //   }, [vault]);

// // //   useEffect(() => {
// // //   if (vault?.address && vault.chain === 'SOL') {
// // //     fetchBalance();
// // //   }
// // // }, [vault]);

// // // const fetchBalance = async () => {
// // //   if (!vault?.address) return;
  
// // //   try {
// // //     const connection = new Connection('https://api.mainnet-beta.solana.com');
// // //     const pubkey = new PublicKey(vault.address);
// // //     const lamports = await connection.getBalance(pubkey);
// // //     setBalance(lamports / LAMPORTS_PER_SOL);
// // //   } catch (err) {
// // //     console.error('Balance fetch error:', err);
// // //   }
// // // };

// // //   const loadChains = async () => {
// // //     try {
// // //       setLoading(true);
// // //       const data = await api.getTokens();
// // //       if (data.supported_chains) {
// // //         setChains(data.supported_chains);
// // //       }
// // //     } catch (err) {
// // //       console.error(err);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const formatAddress = (address: string) => {
// // //     return `${address.slice(0, 6)}...${address.slice(-4)}`;
// // //   };

// // //   const copyAddress = () => {
// // //     if (vault?.address) {
// // //       Clipboard.setString(vault.address);
// // //       setCopied(true);
// // //       Alert.alert('Copied!', 'Address copied to clipboard', [
// // //         { text: 'OK', onPress: () => {} }
// // //       ]);
      
// // //       setTimeout(() => {
// // //         setCopied(false);
// // //       }, 2000);
// // //     }
// // //   };

// // //   if (vault) {
// // //     return (
// // //       <SafeAreaView style={styles.container}>
// // //         <ScrollView showsVerticalScrollIndicator={false}>
// // //           <View style={styles.header}>
// // //             <Text style={styles.welcomeText}>Welcome to</Text>
// // //             <Text style={styles.vaultName}>{vault.vault_name}</Text>
// // //           </View>

// // //           <View style={styles.card}>
// // //             <View style={styles.cardHeader}>
// // //               <Text style={styles.cardTitle}>Vault Details</Text>
// // //               <Text style={styles.chain}>{vault.chain}</Text>
// // //             </View>

// // //             <View style={styles.infoRow}>
// // //               <Text style={styles.infoLabel}>Address</Text>
// // //               <Text style={styles.infoValue}>{formatAddress(vault.address)}</Text>
// // //             </View>

// // //             <View style={styles.infoRow}>
// // //               <Text style={styles.infoLabel}>Full Address</Text>
// // //               <Text style={styles.fullAddress}>{vault.address}</Text>
// // //             </View>

// // //             <View style={styles.infoRow}>
// // //               <Text style={styles.infoLabel}>MPC Provider</Text>
// // //               <Text style={styles.infoValue}>{vault.mpc_provider}</Text>
// // //             </View>

// // //             <View style={styles.infoRow}>
// // //               <Text style={styles.infoLabel}>Created</Text>
// // //               <Text style={styles.infoValue}>
// // //                 {new Date(vault.created_at).toLocaleDateString()}
// // //               </Text>
// // //             </View>

// // //             <TouchableOpacity 
// // //               style={[styles.copyButton, copied && styles.copyButtonCopied]}
// // //               onPress={copyAddress}
// // //             >
// // //               <Text style={styles.copyButtonText}>
// // //                 {copied ? '✓ Copied!' : 'Copy Full Address'}
// // //               </Text>
// // //             </TouchableOpacity>
// // //           </View>

// // //           <View style={styles.balanceCard}>
// // //             <Text style={styles.balanceLabel}>Total Balance</Text>
// // //             <Text style={styles.balanceAmount}>{balance.toFixed(4)} SOL</Text>
// // //             <Text style={styles.balanceHint}>
// // //               Send {vault.chain} to your address to get started
// // //             </Text>
// // //           </View>

// // //           <View style={styles.actionsContainer}>
// // //             <TouchableOpacity style={styles.actionButton}>
// // //               <Text style={styles.actionEmoji}>📤</Text>
// // //               <Text style={styles.actionText}>Send</Text>
// // //             </TouchableOpacity>

// // //             <TouchableOpacity style={styles.actionButton}>
// // //               <Text style={styles.actionEmoji}>📥</Text>
// // //               <Text style={styles.actionText}>Receive</Text>
// // //             </TouchableOpacity>

// // //             <TouchableOpacity
// // //               style={styles.actionButton}
// // //               onPress={() => navigation.navigate('Swap')}
// // //             >
// // //               <Text style={styles.actionEmoji}>🔄</Text>
// // //               <Text style={styles.actionText}>Swap</Text>
// // //             </TouchableOpacity>
// // //           </View>

// // //           {/* Agent Setup Card */}
// // //           <View style={styles.card}>
// // //             <Text style={styles.cardTitle}>🤖 AI Trading Agent</Text>
// // //             <Text style={styles.agentDescription}>
// // //               Set up an automated trading agent powered by NEAR AI Intents
// // //             </Text>
// // //             <TouchableOpacity
// // //               style={styles.setupAgentButton}
// // //               onPress={() => navigation.navigate('AgentPreferences', { vault })}
// // //             >
// // //               <Text style={styles.setupAgentButtonText}>Setup AI Agent</Text>
// // //             </TouchableOpacity>
// // //           </View>

// // //           {/* Fund Wallet Card */}
// // //           <View style={styles.card}>
// // //             <Text style={styles.cardTitle}>💰 Fund Your Wallet</Text>
// // //             <Text style={styles.agentDescription}>
// // //               Add {vault.chain} tokens to start trading
// // //             </Text>
// // //             <TouchableOpacity
// // //               style={styles.fundButton}
// // //               onPress={() => navigation.navigate('FundWallet', { vault })}
// // //             >
// // //               <Text style={styles.fundButtonText}>Add Funds</Text>
// // //             </TouchableOpacity>
// // //           </View>
// // //         </ScrollView>
// // //       </SafeAreaView>
// // //     );
// // //   }

// // //   return (
// // //     <SafeAreaView style={styles.container}>
// // //       <ScrollView showsVerticalScrollIndicator={false}>
// // //         <View style={styles.header}>
// // //           <Text style={styles.vaultName}>PawPad</Text>
// // //           <Text style={styles.welcomeText}>Multi-Chain MPC Wallet</Text>
// // //         </View>

// // //         <View style={styles.card}>
// // //           <Text style={styles.cardTitle}>Quick Actions</Text>
// // //           <TouchableOpacity
// // //             style={styles.actionButtonLarge}
// // //             onPress={() => navigation.navigate('Swap')}
// // //           >
// // //             <Text style={styles.actionButtonText}>🔄 Cross-Chain Swap</Text>
// // //           </TouchableOpacity>
// // //         </View>

// // //         <View style={styles.card}>
// // //           <Text style={styles.cardTitle}>Supported Chains</Text>
// // //           {loading ? (
// // //             <ActivityIndicator color="#4ECDC4" size="large" />
// // //           ) : (
// // //             <View style={styles.chainsContainer}>
// // //               {chains.map((chain, index) => (
// // //                 <View key={index} style={styles.chainBadge}>
// // //                   <Text style={styles.chainText}>{chain}</Text>
// // //                 </View>
// // //               ))}
// // //             </View>
// // //           )}
// // //         </View>

// // //         <View style={styles.footer}>
// // //           <Text style={styles.footerText}>Powered by NEAR Intents</Text>
// // //         </View>
// // //       </ScrollView>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: '#0A1628',
// // //     paddingHorizontal: 24,
// // //   },
// // //   header: {
// // //     paddingTop: 40,
// // //     paddingBottom: 32,
// // //   },
// // //   welcomeText: {
// // //     fontSize: 16,
// // //     color: '#9CA3AF',
// // //     marginBottom: 8,
// // //   },
// // //   vaultName: {
// // //     fontSize: 32,
// // //     color: '#FFFFFF',
// // //     fontWeight: '600',
// // //   },
// // //   card: {
// // //     backgroundColor: '#1E293B',
// // //     borderRadius: 16,
// // //     padding: 20,
// // //     marginBottom: 20,
// // //   },
// // //   cardHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: 20,
// // //   },
// // //   cardTitle: {
// // //     fontSize: 18,
// // //     color: '#FFFFFF',
// // //     fontWeight: '600',
// // //     marginBottom: 16,
// // //   },
// // //   chain: {
// // //     fontSize: 14,
// // //     color: '#4ECDC4',
// // //     backgroundColor: 'rgba(78, 205, 196, 0.1)',
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 6,
// // //     borderRadius: 8,
// // //   },
// // //   infoRow: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     marginBottom: 16,
// // //     alignItems: 'flex-start',
// // //   },
// // //   infoLabel: {
// // //     fontSize: 14,
// // //     color: '#9CA3AF',
// // //     flex: 1,
// // //   },
// // //   infoValue: {
// // //     fontSize: 14,
// // //     color: '#FFFFFF',
// // //     fontWeight: '500',
// // //     flex: 1,
// // //     textAlign: 'right',
// // //   },
// // //   fullAddress: {
// // //     fontSize: 12,
// // //     color: '#FFFFFF',
// // //     fontWeight: '500',
// // //     fontFamily: 'monospace',
// // //     flex: 1,
// // //     textAlign: 'right',
// // //   },
// // //   copyButton: {
// // //     backgroundColor: '#4F7FFF',
// // //     borderRadius: 8,
// // //     paddingVertical: 12,
// // //     alignItems: 'center',
// // //     marginTop: 8,
// // //   },
// // //   copyButtonCopied: {
// // //     backgroundColor: '#10B981',
// // //   },
// // //   copyButtonText: {
// // //     color: '#FFFFFF',
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //   },
// // //   balanceCard: {
// // //     backgroundColor: '#1E293B',
// // //     borderRadius: 16,
// // //     padding: 24,
// // //     marginBottom: 20,
// // //     alignItems: 'center',
// // //   },
// // //   balanceLabel: {
// // //     fontSize: 14,
// // //     color: '#9CA3AF',
// // //     marginBottom: 8,
// // //   },
// // //   balanceAmount: {
// // //     fontSize: 48,
// // //     color: '#FFFFFF',
// // //     fontWeight: '600',
// // //     marginBottom: 8,
// // //   },
// // //   balanceHint: {
// // //     fontSize: 12,
// // //     color: '#6B7280',
// // //     textAlign: 'center',
// // //   },
// // //   actionsContainer: {
// // //     flexDirection: 'row',
// // //     gap: 12,
// // //     marginBottom: 20,
// // //   },
// // //   actionButton: {
// // //     flex: 1,
// // //     backgroundColor: '#1E293B',
// // //     borderRadius: 12,
// // //     paddingVertical: 20,
// // //     alignItems: 'center',
// // //   },
// // //   actionEmoji: {
// // //     fontSize: 32,
// // //     marginBottom: 8,
// // //   },
// // //   actionText: {
// // //     fontSize: 14,
// // //     color: '#FFFFFF',
// // //   },
// // //   actionButtonLarge: {
// // //     backgroundColor: '#4ECDC4',
// // //     padding: 16,
// // //     borderRadius: 12,
// // //     alignItems: 'center',
// // //   },
// // //   actionButtonText: {
// // //     color: '#FFFFFF',
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //   },
// // //   agentDescription: {
// // //     fontSize: 14,
// // //     color: '#9CA3AF',
// // //     lineHeight: 20,
// // //     marginBottom: 16,
// // //   },
// // //   setupAgentButton: {
// // //     backgroundColor: '#8B5CF6',
// // //     paddingVertical: 12,
// // //     paddingHorizontal: 16,
// // //     borderRadius: 8,
// // //     alignItems: 'center',
// // //   },
// // //   setupAgentButtonText: {
// // //     color: '#FFFFFF',
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //   },
// // //   fundButton: {
// // //     backgroundColor: '#10B981',
// // //     paddingVertical: 12,
// // //     paddingHorizontal: 16,
// // //     borderRadius: 8,
// // //     alignItems: 'center',
// // //   },
// // //   fundButtonText: {
// // //     color: '#FFFFFF',
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //   },
// // //   chainsContainer: {
// // //     flexDirection: 'row',
// // //     flexWrap: 'wrap',
// // //     gap: 8,
// // //   },
// // //   chainBadge: {
// // //     backgroundColor: '#2a2a2a',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 8,
// // //     borderRadius: 20,
// // //     borderWidth: 1,
// // //     borderColor: '#4ECDC4',
// // //   },
// // //   chainText: {
// // //     color: '#4ECDC4',
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //   },
// // //   footer: {
// // //     padding: 24,
// // //     alignItems: 'center',
// // //   },
// // //   footerText: {
// // //     color: '#666',
// // //     fontSize: 12,
// // //   },
// // // });

// // // export default HomeScreen;

// // import React, { useEffect, useState, useCallback } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TouchableOpacity,
// //   SafeAreaView,
// //   ScrollView,
// //   ActivityIndicator,
// //   Alert,
// //   RefreshControl,
// // } from 'react-native';
// // import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
// // import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// // import { RootStackParamList } from '../types/navigation';
// // import Clipboard from '@react-native-clipboard/clipboard';
// // import api from '../services/api';

// // const API_BASE = 'http://10.0.2.2:3001';

// // type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
// // type RoutePropType = RouteProp<RootStackParamList, 'Home'>;

// // const HomeScreen = () => {
// //   const route = useRoute<RoutePropType>();
// //   const navigation = useNavigation<NavigationProp>();
// //   const vault = route.params?.vault;

// //   const [chains, setChains] = useState<string[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [copied, setCopied] = useState(false);
// //   const [balance, setBalance] = useState<number>(0);
// //   const [balanceUsd, setBalanceUsd] = useState<number>(0);
// //   const [balanceLoading, setBalanceLoading] = useState(false);
// //   const [refreshing, setRefreshing] = useState(false);

// //   useEffect(() => {
// //     if (!vault) {
// //       loadChains();
// //     }
// //   }, [vault]);

// //   useEffect(() => {
// //     if (vault?.address) {
// //       fetchBalance();
// //     }
// //   }, [vault]);

// //   // Fetch balance from BACKEND API (not direct Solana connection)
// //   const fetchBalance = async () => {
// //     if (!vault?.address) return;

// //     setBalanceLoading(true);
// //     try {
// //       let url = '';

// //       if (vault.chain === 'SOL') {
// //         url = `${API_BASE}/api/fund/solana-balance/${vault.address}`;
// //       } else if (vault.chain === 'ZEC') {
// //         url = `${API_BASE}/api/frost/balance/${vault.address}`;
// //       } else {
// //         console.log('Unsupported chain for balance:', vault.chain);
// //         return;
// //       }

// //       const response = await fetch(url);
// //       const data = await response.json();

// //       if (data.success) {
// //         setBalance(data.sol || data.balance || 0);
// //         setBalanceUsd(data.usd || data.balanceUsd || 0);
// //       } else {
// //         console.error('Balance fetch failed:', data.error);
// //       }
// //     } catch (err) {
// //       console.error('Balance fetch error:', err);
// //     } finally {
// //       setBalanceLoading(false);
// //     }
// //   };

// //   const onRefresh = useCallback(async () => {
// //     setRefreshing(true);
// //     await fetchBalance();
// //     setRefreshing(false);
// //   }, [vault]);

// //   const loadChains = async () => {
// //     try {
// //       setLoading(true);
// //       const data = await api.getTokens();
// //       if (data.supported_chains) {
// //         setChains(data.supported_chains);
// //       }
// //     } catch (err) {
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const formatAddress = (address: string) => {
// //     return `${address.slice(0, 6)}...${address.slice(-4)}`;
// //   };

// //   const copyAddress = () => {
// //     if (vault?.address) {
// //       Clipboard.setString(vault.address);
// //       setCopied(true);
// //       Alert.alert('Copied!', 'Address copied to clipboard', [{ text: 'OK' }]);
// //       setTimeout(() => setCopied(false), 2000);
// //     }
// //   };

// //   if (vault) {
// //     return (
// //       <SafeAreaView style={styles.container}>
// //         <ScrollView
// //           showsVerticalScrollIndicator={false}
// //           refreshControl={
// //             <RefreshControl
// //               refreshing={refreshing}
// //               onRefresh={onRefresh}
// //               tintColor="#4ECDC4"
// //               colors={['#4ECDC4']}
// //             />
// //           }
// //         >
// //           <View style={styles.header}>
// //             <Text style={styles.welcomeText}>Welcome to</Text>
// //             <Text style={styles.vaultName}>{vault.vault_name}</Text>
// //           </View>

// //           <View style={styles.card}>
// //             <View style={styles.cardHeader}>
// //               <Text style={styles.cardTitle}>Vault Details</Text>
// //               <Text style={styles.chain}>{vault.chain}</Text>
// //             </View>

// //             <View style={styles.infoRow}>
// //               <Text style={styles.infoLabel}>Address</Text>
// //               <Text style={styles.infoValue}>{formatAddress(vault.address)}</Text>
// //             </View>

// //             <View style={styles.infoRow}>
// //               <Text style={styles.infoLabel}>Full Address</Text>
// //               <Text style={styles.fullAddress}>{vault.address}</Text>
// //             </View>

// //             <View style={styles.infoRow}>
// //               <Text style={styles.infoLabel}>MPC Provider</Text>
// //               <Text style={styles.infoValue}>{vault.mpc_provider}</Text>
// //             </View>

// //             <View style={styles.infoRow}>
// //               <Text style={styles.infoLabel}>Created</Text>
// //               <Text style={styles.infoValue}>
// //                 {new Date(vault.created_at).toLocaleDateString()}
// //               </Text>
// //             </View>

// //             <TouchableOpacity
// //               style={[styles.copyButton, copied && styles.copyButtonCopied]}
// //               onPress={copyAddress}
// //             >
// //               <Text style={styles.copyButtonText}>
// //                 {copied ? '✓ Copied!' : 'Copy Full Address'}
// //               </Text>
// //             </TouchableOpacity>
// //           </View>

// //           <View style={styles.balanceCard}>
// //             <Text style={styles.balanceLabel}>Total Balance</Text>
// //             {balanceLoading ? (
// //               <ActivityIndicator color="#4ECDC4" size="large" style={{ marginVertical: 16 }} />
// //             ) : (
// //               <>
// //                 <Text style={styles.balanceAmount}>
// //                   {balance.toFixed(4)} {vault.chain}
// //                 </Text>
// //                 {balanceUsd > 0 && (
// //                   <Text style={styles.balanceUsd}>${balanceUsd.toFixed(2)} USD</Text>
// //                 )}
// //               </>
// //             )}
// //             <Text style={styles.balanceHint}>
// //               {balance === 0
// //                 ? `Send ${vault.chain} to your address to get started`
// //                 : 'Pull down to refresh'}
// //             </Text>
// //           </View>

// //           <View style={styles.actionsContainer}>
// //             <TouchableOpacity style={styles.actionButton}>
// //               <Text style={styles.actionEmoji}>📤</Text>
// //               <Text style={styles.actionText}>Send</Text>
// //             </TouchableOpacity>

// //             <TouchableOpacity style={styles.actionButton}>
// //               <Text style={styles.actionEmoji}>📥</Text>
// //               <Text style={styles.actionText}>Receive</Text>
// //             </TouchableOpacity>

// //             <TouchableOpacity
// //               style={styles.actionButton}
// //               onPress={() => navigation.navigate('Swap')}
// //             >
// //               <Text style={styles.actionEmoji}>🔄</Text>
// //               <Text style={styles.actionText}>Swap</Text>
// //             </TouchableOpacity>
// //           </View>

// //           {/* Agent Setup Card */}
// //           <View style={styles.card}>
// //             <Text style={styles.cardTitle}>🤖 AI Trading Agent</Text>
// //             <Text style={styles.agentDescription}>
// //               Set up an automated trading agent powered by NEAR AI Intents
// //             </Text>
// //             <TouchableOpacity
// //               style={styles.setupAgentButton}
// //               onPress={() => navigation.navigate('AgentPreferences', { vault })}
// //             >
// //               <Text style={styles.setupAgentButtonText}>Setup AI Agent</Text>
// //             </TouchableOpacity>
// //           </View>

// //           {/* Fund Wallet Card */}
// //           <View style={styles.card}>
// //             <Text style={styles.cardTitle}>💰 Fund Your Wallet</Text>
// //             <Text style={styles.agentDescription}>
// //               Add {vault.chain} tokens to start trading
// //             </Text>
// //             <TouchableOpacity
// //               style={styles.fundButton}
// //               onPress={() => navigation.navigate('FundWallet', { vault })}
// //             >
// //               <Text style={styles.fundButtonText}>Add Funds</Text>
// //             </TouchableOpacity>
// //           </View>

// //           {/* Backup & Recovery Card */}
// //           <View style={styles.card}>
// //             <Text style={styles.cardTitle}>🔐 Backup & Recovery</Text>
// //             <Text style={styles.agentDescription}>
// //               Export your wallet backup or recover an existing wallet
// //             </Text>
// //             <TouchableOpacity
// //               style={styles.backupButton}
// //               onPress={() => navigation.navigate('Backup')}
// //             >
// //               <Text style={styles.backupButtonText}>Manage Backup</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </ScrollView>
// //       </SafeAreaView>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <ScrollView showsVerticalScrollIndicator={false}>
// //         <View style={styles.header}>
// //           <Text style={styles.vaultName}>PawPad</Text>
// //           <Text style={styles.welcomeText}>Multi-Chain MPC Wallet</Text>
// //         </View>

// //         <View style={styles.card}>
// //           <Text style={styles.cardTitle}>Quick Actions</Text>
// //           <TouchableOpacity
// //             style={styles.actionButtonLarge}
// //             onPress={() => navigation.navigate('Swap')}
// //           >
// //             <Text style={styles.actionButtonText}>🔄 Cross-Chain Swap</Text>
// //           </TouchableOpacity>
// //         </View>

// //         <View style={styles.card}>
// //           <Text style={styles.cardTitle}>Supported Chains</Text>
// //           {loading ? (
// //             <ActivityIndicator color="#4ECDC4" size="large" />
// //           ) : (
// //             <View style={styles.chainsContainer}>
// //               {chains.map((chain, index) => (
// //                 <View key={index} style={styles.chainBadge}>
// //                   <Text style={styles.chainText}>{chain}</Text>
// //                 </View>
// //               ))}
// //             </View>
// //           )}
// //         </View>

// //         <View style={styles.footer}>
// //           <Text style={styles.footerText}>Powered by NEAR Intents</Text>
// //         </View>
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#0A1628',
// //     paddingHorizontal: 24,
// //   },
// //   header: {
// //     paddingTop: 40,
// //     paddingBottom: 32,
// //   },
// //   welcomeText: {
// //     fontSize: 16,
// //     color: '#9CA3AF',
// //     marginBottom: 8,
// //   },
// //   vaultName: {
// //     fontSize: 32,
// //     color: '#FFFFFF',
// //     fontWeight: '600',
// //   },
// //   card: {
// //     backgroundColor: '#1E293B',
// //     borderRadius: 16,
// //     padding: 20,
// //     marginBottom: 20,
// //   },
// //   cardHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 20,
// //   },
// //   cardTitle: {
// //     fontSize: 18,
// //     color: '#FFFFFF',
// //     fontWeight: '600',
// //     marginBottom: 16,
// //   },
// //   chain: {
// //     fontSize: 14,
// //     color: '#4ECDC4',
// //     backgroundColor: 'rgba(78, 205, 196, 0.1)',
// //     paddingHorizontal: 12,
// //     paddingVertical: 6,
// //     borderRadius: 8,
// //   },
// //   infoRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginBottom: 16,
// //     alignItems: 'flex-start',
// //   },
// //   infoLabel: {
// //     fontSize: 14,
// //     color: '#9CA3AF',
// //     flex: 1,
// //   },
// //   infoValue: {
// //     fontSize: 14,
// //     color: '#FFFFFF',
// //     fontWeight: '500',
// //     flex: 1,
// //     textAlign: 'right',
// //   },
// //   fullAddress: {
// //     fontSize: 12,
// //     color: '#FFFFFF',
// //     fontWeight: '500',
// //     fontFamily: 'monospace',
// //     flex: 1,
// //     textAlign: 'right',
// //   },
// //   copyButton: {
// //     backgroundColor: '#4F7FFF',
// //     borderRadius: 8,
// //     paddingVertical: 12,
// //     alignItems: 'center',
// //     marginTop: 8,
// //   },
// //   copyButtonCopied: {
// //     backgroundColor: '#10B981',
// //   },
// //   copyButtonText: {
// //     color: '#FFFFFF',
// //     fontSize: 14,
// //     fontWeight: '600',
// //   },
// //   balanceCard: {
// //     backgroundColor: '#1E293B',
// //     borderRadius: 16,
// //     padding: 24,
// //     marginBottom: 20,
// //     alignItems: 'center',
// //   },
// //   balanceLabel: {
// //     fontSize: 14,
// //     color: '#9CA3AF',
// //     marginBottom: 8,
// //   },
// //   balanceAmount: {
// //     fontSize: 48,
// //     color: '#FFFFFF',
// //     fontWeight: '600',
// //     marginBottom: 4,
// //   },
// //   balanceUsd: {
// //     fontSize: 18,
// //     color: '#4ECDC4',
// //     marginBottom: 8,
// //   },
// //   balanceHint: {
// //     fontSize: 12,
// //     color: '#6B7280',
// //     textAlign: 'center',
// //   },
// //   actionsContainer: {
// //     flexDirection: 'row',
// //     gap: 12,
// //     marginBottom: 20,
// //   },
// //   actionButton: {
// //     flex: 1,
// //     backgroundColor: '#1E293B',
// //     borderRadius: 12,
// //     paddingVertical: 20,
// //     alignItems: 'center',
// //   },
// //   actionEmoji: {
// //     fontSize: 32,
// //     marginBottom: 8,
// //   },
// //   actionText: {
// //     fontSize: 14,
// //     color: '#FFFFFF',
// //   },
// //   actionButtonLarge: {
// //     backgroundColor: '#4ECDC4',
// //     padding: 16,
// //     borderRadius: 12,
// //     alignItems: 'center',
// //   },
// //   actionButtonText: {
// //     color: '#FFFFFF',
// //     fontSize: 16,
// //     fontWeight: '600',
// //   },
// //   agentDescription: {
// //     fontSize: 14,
// //     color: '#9CA3AF',
// //     lineHeight: 20,
// //     marginBottom: 16,
// //   },
// //   setupAgentButton: {
// //     backgroundColor: '#8B5CF6',
// //     paddingVertical: 12,
// //     paddingHorizontal: 16,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //   },
// //   setupAgentButtonText: {
// //     color: '#FFFFFF',
// //     fontSize: 14,
// //     fontWeight: '600',
// //   },
// //   fundButton: {
// //     backgroundColor: '#10B981',
// //     paddingVertical: 12,
// //     paddingHorizontal: 16,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //   },
// //   fundButtonText: {
// //     color: '#FFFFFF',
// //     fontSize: 14,
// //     fontWeight: '600',
// //   },
// //   backupButton: {
// //     backgroundColor: '#F59E0B',
// //     paddingVertical: 12,
// //     paddingHorizontal: 16,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //   },
// //   backupButtonText: {
// //     color: '#000000',
// //     fontSize: 14,
// //     fontWeight: '600',
// //   },
// //   chainsContainer: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     gap: 8,
// //   },
// //   chainBadge: {
// //     backgroundColor: '#2a2a2a',
// //     paddingHorizontal: 16,
// //     paddingVertical: 8,
// //     borderRadius: 20,
// //     borderWidth: 1,
// //     borderColor: '#4ECDC4',
// //   },
// //   chainText: {
// //     color: '#4ECDC4',
// //     fontSize: 14,
// //     fontWeight: '600',
// //   },
// //   footer: {
// //     padding: 24,
// //     alignItems: 'center',
// //   },
// //   footerText: {
// //     color: '#666',
// //     fontSize: 12,
// //   },
// // });

// // export default HomeScreen;

// /**
//  * HomeScreen - COMPLETE VERSION
//  * 
//  * FILE: PAWPAD/src/screens/HomeScreen.tsx
//  * ACTION: REPLACE your entire HomeScreen.tsx with this file
//  * 
//  * Shows BOTH SOL and ZEC balances!
//  */

// import React, { useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
//   RefreshControl,
//   Platform,
// } from 'react-native';
// import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList, VaultData } from '../types/navigation';
// import Clipboard from '@react-native-clipboard/clipboard';
// import api from '../services/api';

// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
// type RouteType = RouteProp<RootStackParamList, 'Home'>;

// const HomeScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<RouteType>();
//   const vault = route.params?.vault;

//   const [refreshing, setRefreshing] = useState(false);
//   const [copiedSol, setCopiedSol] = useState(false);
//   const [copiedZec, setCopiedZec] = useState(false);
  
//   const [solBalance, setSolBalance] = useState({ sol: 0, usd: 0, loading: true });
//   const [zecBalance, setZecBalance] = useState({ zec: 0, usd: 0, loading: true });

//   const isUnified = vault?.vault_type === 'unified' && vault?.sol && vault?.zec;

//   const fetchBalances = useCallback(async () => {
//     try {
//       // SOL balance
//       const solAddr = vault?.sol?.address || vault?.address;
//       if (solAddr) {
//         const data = await api.getSolBalance(solAddr);
//         setSolBalance({
//           sol: data.sol || 0,
//           usd: (data.sol || 0) * 200,
//           loading: false,
//         });
//       }

//       // ZEC balance
//       if (isUnified && vault?.zec?.address) {
//         const data = await api.getZecBalance(vault.zec.address);
//         setZecBalance({
//           zec: data.total_zec || 0,
//           usd: (data.total_zec || 0) * 40,
//           loading: false,
//         });
//       }
//     } catch (error) {
//       console.error('Balance error:', error);
//       setSolBalance(prev => ({ ...prev, loading: false }));
//       setZecBalance(prev => ({ ...prev, loading: false }));
//     }
//   }, [vault, isUnified]);

//   useFocusEffect(
//     useCallback(() => {
//       fetchBalances();
//     }, [fetchBalances])
//   );

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchBalances();
//     setRefreshing(false);
//   };

//   const copyAddress = (address: string, type: 'sol' | 'zec') => {
//     Clipboard.setString(address);
//     if (type === 'sol') {
//       setCopiedSol(true);
//       setTimeout(() => setCopiedSol(false), 2000);
//     } else {
//       setCopiedZec(true);
//       setTimeout(() => setCopiedZec(false), 2000);
//     }
//   };

//   const totalUsd = solBalance.usd + zecBalance.usd;

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4ECDC4" />}
//       >
//         <View style={styles.content}>
//           {/* Header */}
//           <View style={styles.header}>
//             <View>
//               <Text style={styles.walletName}>{vault?.vault_name}</Text>
//               {isUnified && (
//                 <View style={styles.unifiedBadge}>
//                   <Text style={styles.unifiedBadgeText}>UNIFIED WALLET</Text>
//                 </View>
//               )}
//             </View>
//             <TouchableOpacity onPress={() => navigation.navigate('Settings', { vault })}>
//               <Text style={styles.settingsIcon}>⚙️</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Total Balance */}
//           <View style={styles.totalCard}>
//             <Text style={styles.totalLabel}>Total Balance</Text>
//             <Text style={styles.totalValue}>${totalUsd.toFixed(2)}</Text>
//           </View>

//           {/* SOL Card */}
//           <View style={styles.balanceCard}>
//             <View style={styles.balanceHeader}>
//               <View style={styles.chainInfo}>
//                 <View style={styles.solBadge}><Text style={styles.badgeText}>SOL</Text></View>
//                 <Text style={styles.chainName}>Solana</Text>
//               </View>
//               <Text style={styles.balanceAmount}>
//                 {solBalance.loading ? '...' : `${solBalance.sol.toFixed(4)} SOL`}
//               </Text>
//             </View>
            
//             <TouchableOpacity
//               style={styles.addressRow}
//               onPress={() => copyAddress(vault?.sol?.address || vault?.address || '', 'sol')}
//             >
//               <Text style={styles.addressText} numberOfLines={1}>
//                 {vault?.sol?.address || vault?.address}
//               </Text>
//               <Text>{copiedSol ? '✓' : '📋'}</Text>
//             </TouchableOpacity>

//             <View style={styles.actions}>
//               <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('FundWallet', { vault: vault! })}>
//                 <Text style={styles.actionBtnText}>+ Receive</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={[styles.actionBtn, styles.actionBtnOutline]}>
//                 <Text style={styles.actionBtnTextOutline}>↑ Send</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* ZEC Card */}
//           {isUnified && vault?.zec?.address && (
//             <View style={styles.balanceCard}>
//               <View style={styles.balanceHeader}>
//                 <View style={styles.chainInfo}>
//                   <View style={styles.zecBadge}><Text style={styles.badgeTextDark}>ZEC</Text></View>
//                   <Text style={styles.chainName}>Zcash</Text>
//                   <View style={styles.shieldedBadge}><Text style={styles.shieldedText}>🔒 Shielded</Text></View>
//                 </View>
//                 <Text style={styles.balanceAmount}>
//                   {zecBalance.loading ? '...' : `${zecBalance.zec.toFixed(4)} ZEC`}
//                 </Text>
//               </View>
              
//               <TouchableOpacity
//                 style={styles.addressRow}
//                 onPress={() => copyAddress(vault.zec.address, 'zec')}
//               >
//                 <Text style={styles.addressText} numberOfLines={1}>{vault.zec.address}</Text>
//                 <Text>{copiedZec ? '✓' : '📋'}</Text>
//               </TouchableOpacity>

//               <View style={styles.actions}>
//                 <TouchableOpacity style={[styles.actionBtn, styles.zecBtn]}>
//                   <Text style={styles.actionBtnTextDark}>💱 Swap from SOL</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={[styles.actionBtn, styles.actionBtnOutline]}>
//                   <Text style={styles.actionBtnTextOutline}>↑ Send</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}

//           {/* Quick Actions */}
//           <View style={styles.quickCard}>
//             <Text style={styles.quickTitle}>Quick Actions</Text>
            
//             {isUnified && (
//               <TouchableOpacity style={styles.quickItem}>
//                 <Text style={styles.quickIcon}>💱</Text>
//                 <View style={styles.quickInfo}>
//                   <Text style={styles.quickItemTitle}>Swap SOL ↔ ZEC</Text>
//                   <Text style={styles.quickItemDesc}>Exchange between chains</Text>
//                 </View>
//                 <Text style={styles.quickArrow}>→</Text>
//               </TouchableOpacity>
//             )}

//             <TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('FundWallet', { vault: vault! })}>
//               <Text style={styles.quickIcon}>💳</Text>
//               <View style={styles.quickInfo}>
//                 <Text style={styles.quickItemTitle}>Fund Wallet</Text>
//                 <Text style={styles.quickItemDesc}>Add funds</Text>
//               </View>
//               <Text style={styles.quickArrow}>→</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.quickItem}>
//               <Text style={styles.quickIcon}>💾</Text>
//               <View style={styles.quickInfo}>
//                 <Text style={styles.quickItemTitle}>Export Backup</Text>
//                 <Text style={styles.quickItemDesc}>Save backup file</Text>
//               </View>
//               <Text style={styles.quickArrow}>→</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Security */}
//           <View style={styles.securityBanner}>
//             <Text style={styles.securityText}>
//               🔐 {isUnified ? 'Both wallets secured by MPC' : 'Secured by Arcium MPC'} - no seed phrase
//             </Text>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#0A1628' },
//   content: { padding: 20 },
//   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
//   walletName: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
//   unifiedBadge: { backgroundColor: 'rgba(147, 51, 234, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginTop: 6, alignSelf: 'flex-start' },
//   unifiedBadgeText: { color: '#A855F7', fontSize: 10, fontWeight: '700' },
//   settingsIcon: { fontSize: 24 },
//   totalCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 24, marginBottom: 16, alignItems: 'center' },
//   totalLabel: { color: '#9CA3AF', fontSize: 14, marginBottom: 8 },
//   totalValue: { color: '#FFFFFF', fontSize: 36, fontWeight: 'bold' },
//   balanceCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 16, marginBottom: 16 },
//   balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
//   chainInfo: { flexDirection: 'row', alignItems: 'center' },
//   solBadge: { backgroundColor: '#9945FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginRight: 8 },
//   zecBadge: { backgroundColor: '#F4B728', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginRight: 8 },
//   badgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
//   badgeTextDark: { color: '#000000', fontSize: 12, fontWeight: '700' },
//   chainName: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
//   shieldedBadge: { backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 8 },
//   shieldedText: { color: '#10B981', fontSize: 10 },
//   balanceAmount: { color: '#4ECDC4', fontSize: 18, fontWeight: '600' },
//   addressRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F172A', borderRadius: 8, padding: 10, marginBottom: 12 },
//   addressText: { flex: 1, color: '#6B7280', fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
//   actions: { flexDirection: 'row', gap: 10 },
//   actionBtn: { flex: 1, backgroundColor: '#4ECDC4', borderRadius: 8, padding: 12, alignItems: 'center' },
//   actionBtnOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#4ECDC4' },
//   zecBtn: { backgroundColor: '#F4B728' },
//   actionBtnText: { color: '#000000', fontWeight: '600' },
//   actionBtnTextOutline: { color: '#4ECDC4', fontWeight: '600' },
//   actionBtnTextDark: { color: '#000000', fontWeight: '600' },
//   quickCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 16, marginBottom: 16 },
//   quickTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginBottom: 12 },
//   quickItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#374151' },
//   quickIcon: { fontSize: 24, marginRight: 12 },
//   quickInfo: { flex: 1 },
//   quickItemTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' },
//   quickItemDesc: { color: '#6B7280', fontSize: 12, marginTop: 2 },
//   quickArrow: { color: '#4ECDC4', fontSize: 18 },
//   securityBanner: { backgroundColor: 'rgba(78, 205, 196, 0.1)', borderRadius: 8, padding: 12 },
//   securityText: { color: '#9CA3AF', fontSize: 12, textAlign: 'center' },
// });

// export default HomeScreen;
/**
 * HomeScreen - Fixed with correct hooks order
 * 
 * CRITICAL: All hooks MUST be called before any conditional returns!
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, VaultData, isUnifiedVault } from '../types/navigation';
import { useVaults } from '../context/VaultContext';
import api from '../services/api';
import Clipboard from '@react-native-clipboard/clipboard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type RouteType = RouteProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  // ═══════════════════════════════════════════════════════════════
  // ALL HOOKS MUST BE AT THE TOP
  // ═══════════════════════════════════════════════════════════════
  
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { activeVault, vaults, isLoading: contextLoading } = useVaults();
  
  // State hooks
  const [refreshing, setRefreshing] = useState(false);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [solUsd, setSolUsd] = useState<number>(0);
  const [zecBalance, setZecBalance] = useState<number>(0);
  const [zecUsd, setZecUsd] = useState<number>(0);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [copied, setCopied] = useState(false);

  // Get vault from route params or context
  const routeVault = route.params?.vault;
  const vault: VaultData | null = routeVault || (activeVault as VaultData | null);
  
  // Check if unified vault
  const unified = vault ? isUnifiedVault(vault) : false;
  
  // Determine wallet type
  const hasSol = vault?.chain === 'SOL' || vault?.sol?.address || unified;
  // const hasZec = vault?.chain === 'ZEC' || vault?.zec?.address || unified;
  const hasZec = vault?.chain === 'ZEC' || vault?.zec?.address || vault?.zec?.unified_address || vault?.zec?.transparent_address || unified;

  // Load balances callback
  const loadBalances = useCallback(async () => {
    if (!vault) return;
    
    setLoadingBalance(true);
    
    // Reset balances first to avoid stale data
    setSolBalance(0);
    setSolUsd(0);
    setZecBalance(0);
    setZecUsd(0);
    
    try {
      // Load SOL balance if wallet has SOL
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
      
      // Load ZEC balance if wallet has ZEC
      // if (hasZec && vault.zec?.address) {
      if (hasZec && (vault.zec?.address || vault.zec?.unified_address)) {
  const zecAddress = vault.zec?.unified_address || vault.zec?.address;
        try {
          //const response = await api.getZecBalance(vault.zec.address);
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

  // Load on focus
  useFocusEffect(
    useCallback(() => {
      if (vault) {
        loadBalances();
      }
    }, [vault, loadBalances])
  );

  // ═══════════════════════════════════════════════════════════════
  // HELPER FUNCTIONS
  // ═══════════════════════════════════════════════════════════════

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBalances();
    setRefreshing(false);
  };

  const copyAddress = () => {
    const address = vault?.sol?.address || vault?.address;
    if (!address) return;
    Clipboard.setString(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatAddress = (address: string | undefined) => {
    if (!address) return 'No address';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const safeToFixed = (value: number | undefined | null, decimals: number = 2): string => {
    if (value === undefined || value === null || isNaN(value)) {
      return '0.00';
    }
    return value.toFixed(decimals);
  };

  // Calculate total - only include balances that actually exist
  const totalUsd = (hasSol ? solUsd : 0) + (hasZec ? zecUsd : 0);

  // ═══════════════════════════════════════════════════════════════
  // RENDER - No vault state
  // ═══════════════════════════════════════════════════════════════

  if (!vault && !contextLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🔐</Text>
            <Text style={styles.emptyTitle}>No Wallet Found</Text>
            <Text style={styles.emptyText}>Create a wallet to get started</Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('ChainSelection')}
            >
              <Text style={styles.primaryButtonText}>Create Wallet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Recovery')}
            >
              <Text style={styles.secondaryButtonText}>Recover Wallet</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (contextLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ECDC4" />
          <Text style={styles.loadingText}>Loading wallet...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // MAIN RENDER - Phantom Style
  // ═══════════════════════════════════════════════════════════════
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4ECDC4" />
        }
      >
        {/* Header with wallet name and copy button */}
        <View style={styles.header}>
          <View style={styles.walletNameRow}>
            <Text style={styles.walletName}>{vault?.vault_name || 'My Wallet'}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={copyAddress}>
              <Text style={styles.copyIcon}>{copied ? '✓' : '📋'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.addressText}>
            {formatAddress(vault?.sol?.address || vault?.address)}
          </Text>
        </View>

        {/* Total Balance - Big centered */}
        <View style={styles.balanceSection}>
          {loadingBalance ? (
            <ActivityIndicator color="#FFFFFF" size="large" />
          ) : (
            <>
              <Text style={styles.totalBalance}>${safeToFixed(totalUsd, 2)}</Text>
              <Text style={styles.balanceHint}>
                {totalUsd === 0 ? 'Fund your wallet to get started' : 'Pull down to refresh'}
              </Text>
            </>
          )}
        </View>

        {/* Action Buttons Row - Phantom Style */}
        <View style={styles.actionRow}>
          {/* <TouchableOpacity
            style={styles.actionItem}
            onPress={() => vault && navigation.navigate('Receive', { vault, chain: 'SOL' })}
          >
            <View style={styles.actionIconBg}>
              <Text style={styles.actionIcon}>📥</Text>
            </View>
            <Text style={styles.actionLabel}>Receive</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => vault && navigation.navigate('Send', { vault, chain: 'SOL' })}
          >
            <View style={styles.actionIconBg}>
              <Text style={styles.actionIcon}>📤</Text>
            </View>
            <Text style={styles.actionLabel}>Send</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('Swap', { vault: vault || undefined })}
          >
            <View style={styles.actionIconBg}>
              <Text style={styles.actionIcon}>🔄</Text>
            </View>
            <Text style={styles.actionLabel}>Swap</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('FundWallet', { vault: vault || undefined })}
          >
            <View style={styles.actionIconBg}>
              <Text style={styles.actionIcon}>💵</Text>
            </View>
            <Text style={styles.actionLabel}>Buy</Text>
          </TouchableOpacity>
        </View>

        {/* Tokens Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tokens</Text>
        </View>

        {/* Token List - Phantom Style */}
        <View style={styles.tokenList}>
          {/* SOL Token Row */}
          {hasSol && (
            <TouchableOpacity style={styles.tokenRow}>
              <View style={styles.tokenIcon}>
                <View style={styles.solIcon}>
                  <Text style={styles.tokenIconText}>◎</Text>
                </View>
              </View>
              <View style={styles.tokenInfo}>
                <Text style={styles.tokenName}>Solana</Text>
                <Text style={styles.tokenBalance}>{safeToFixed(solBalance, 4)} SOL</Text>
              </View>
              <View style={styles.tokenValue}>
                <Text style={styles.tokenUsd}>${safeToFixed(solUsd, 2)}</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* ZEC Token Row - Only show if wallet has ZEC */}
          {/* {hasZec && vault?.zec?.address && ( */}
          {hasZec && (vault?.zec?.address || vault?.zec?.unified_address) && (
            <TouchableOpacity style={styles.tokenRow}>
              <View style={styles.tokenIcon}>
                <View style={styles.zecIcon}>
                  <Text style={styles.tokenIconTextDark}>Z</Text>
                </View>
              </View>
              <View style={styles.tokenInfo}>
                <Text style={styles.tokenName}>Zcash</Text>
                <Text style={styles.tokenBalance}>{safeToFixed(zecBalance, 4)} ZEC</Text>
              </View>
              <View style={styles.tokenValue}>
                <Text style={styles.tokenUsd}>${safeToFixed(zecUsd, 2)}</Text>
                <View style={styles.shieldedTag}>
                  <Text style={styles.shieldedTagText}>🔒 Shielded</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}

          {/* Empty state if no tokens */}
          {!hasSol && !hasZec && (
            <View style={styles.emptyTokens}>
              <Text style={styles.emptyTokensText}>No tokens yet</Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        {vault && (
  <>
    {/* Feature Cards - Vertical Stack */}
    <TouchableOpacity
      style={styles.quickActionCard}
      onPress={() => navigation.navigate('DarkPool', { vault_id: vault.vault_id, vault })}
    >
      <Text style={styles.quickActionEmoji}>🏊</Text>
      <View style={styles.quickActionInfo}>
        <Text style={styles.quickActionTitle}>Dark Pool Trading</Text>
        <Text style={styles.quickActionDesc}>MEV-protected encrypted orders</Text>
      </View>
      <Text style={styles.quickActionArrow}>→</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.quickActionCard}
      onPress={() => navigation.navigate('Lending', { vault_id: vault.vault_id, vault })}
    >
      <Text style={styles.quickActionEmoji}>🏦</Text>
      <View style={styles.quickActionInfo}>
        <Text style={styles.quickActionTitle}>Private Lending</Text>
        <Text style={styles.quickActionDesc}>Borrow with Arcium privacy</Text>
      </View>
      <Text style={styles.quickActionArrow}>→</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.quickActionCard}
      onPress={() => navigation.navigate('AgentDashboard', { vault })}
    >
      <Text style={styles.quickActionEmoji}>🤖</Text>
      <View style={styles.quickActionInfo}>
        <Text style={styles.quickActionTitle}>AI Trading Agent</Text>
        <Text style={styles.quickActionDesc}>Auto-trade with Zynapse signals</Text>
      </View>
      <Text style={styles.quickActionArrow}>→</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.quickActionCard}
      onPress={() => navigation.navigate('Backup', { vault })}
    >
      <Text style={styles.quickActionEmoji}>🔐</Text>
      <View style={styles.quickActionInfo}>
        <Text style={styles.quickActionTitle}>Backup & Recovery</Text>
        <Text style={styles.quickActionDesc}>Secure your wallet</Text>
      </View>
      <Text style={styles.quickActionArrow}>→</Text>
    </TouchableOpacity>
  </>
)}


        {/* Security Footer */}
        <View style={styles.securityFooter}>
          <Text style={styles.securityText}>
            🔐 Secured by Arcium MPC • No seed phrase
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#9CA3AF',
    marginTop: 12,
    fontSize: 14,
  },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  walletNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  walletName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  copyButton: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 8,
  },
  copyIcon: {
    fontSize: 14,
  },
  addressText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },

  // Balance Section
  balanceSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  totalBalance: {
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  balanceHint: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },

  // Action Row - Phantom Style
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  actionItem: {
    alignItems: 'center',
  },
  actionIconBg: {
    width: 56,
    height: 56,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Token List
  tokenList: {
    gap: 8,
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
  },
  tokenIcon: {
    marginRight: 12,
  },
  solIcon: {
    width: 44,
    height: 44,
    backgroundColor: '#9945FF',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zecIcon: {
    width: 44,
    height: 44,
    backgroundColor: '#F4B728',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenIconText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  tokenIconTextDark: {
    fontSize: 20,
    color: '#000000',
    fontWeight: 'bold',
  },
  tokenInfo: {
    flex: 1,
  },
  tokenName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 2,
  },
  tokenBalance: {
    fontSize: 14,
    color: '#6B7280',
  },
  tokenValue: {
    alignItems: 'flex-end',
  },
  tokenUsd: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  shieldedTag: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  shieldedTagText: {
    fontSize: 10,
    color: '#10B981',
  },
  emptyTokens: {
    padding: 40,
    alignItems: 'center',
  },
  emptyTokensText: {
    color: '#6B7280',
    fontSize: 14,
  },

  // Quick Actions
  quickActions: {
    marginTop: 24,
    gap: 12,
  },
 quickActionCard: {
  backgroundColor: '#1E293B',
  marginHorizontal: 16,
  // marginBottom: 12,
  marginTop: 12,
  padding: 16,
  borderRadius: 12,
  flexDirection: 'row',
  alignItems: 'center',
},
quickActionEmoji: {
  fontSize: 28,
  marginRight: 12,
},
quickActionInfo: {
  flex: 1,
},
quickActionTitle: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: '600',
},
quickActionDesc: {
  color: '#6B7280',
  fontSize: 12,
  marginTop: 2,
},
quickActionArrow: {
  color: '#4ECDC4',
  fontSize: 20,
},

  // Security Footer
  securityFooter: {
    marginTop: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  securityText: {
    fontSize: 12,
    color: '#4B5563',
  },

  // Empty State
  emptyCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 24,
    padding: 40,
    marginTop: 60,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  featureButton: {
  backgroundColor: '#1E293B',
  padding: 16,
  borderRadius: 12,
  alignItems: 'center',
  flex: 1,
  marginHorizontal: 4,
},
featureIcon: {
  fontSize: 28,
  marginBottom: 8,
},
featureTitle: {
  color: '#FFFFFF',
  fontSize: 12,
  fontWeight: '600',
},
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 24,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;