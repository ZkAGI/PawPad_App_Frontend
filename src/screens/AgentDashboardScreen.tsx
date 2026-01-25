// /**
//  * AgentDashboardScreen.tsx - FIXED TYPESCRIPT
//  * 
//  * Shows AI Agent dashboard with:
//  * - Empty state (no agent) → Create button
//  * - Agent state → Signals, auto-trade toggle, stats
//  */

// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Switch,
//   RefreshControl,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList, VaultData } from '../types/navigation';
// import api from '../services/api';

// type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
// type AgentDashboardRouteProp = RouteProp<RootStackParamList, 'AgentDashboard'>;

// interface Signal {
//   asset: string;
//   signal: 'BUY' | 'SELL' | 'HOLD';
//   confidence: number;
//   price?: number;
//   indicators: {
//     rsi: number;
//     macd: string;
//     ema_trend: string;
//   };
// }

// interface Trade {
//   id: string;
//   asset: string;
//   type: 'BUY' | 'SELL';
//   amount: number;
//   price: number;
//   timestamp: string;
//   pnl?: number;
//   via: 'DARK_POOL' | 'DEX' | 'CROSS_CHAIN';
// }

// // Standalone interface - NOT extending anything
// interface AgentInfo {
//   agent_id: string;
//   vault_id?: string;
//   name?: string;
//   status?: 'active' | 'paused' | 'stopped';
//   preferences?: {
//     risk_level?: string;
//     riskLevel?: string;
//     trading_pairs?: string[];
//     favoriteTokens?: string[];
//     cross_chain_swaps?: boolean;
//     dark_pool_trading?: boolean;
//     enable_lending?: boolean;
//     maxTradeSize?: number;
//     investmentStyle?: string;
//   };
//   stats?: {
//     trades_executed: number;
//     dark_pool_trades: number;
//     cross_chain_trades?: number;
//     total_pnl: number;
//     win_rate: number;
//   };
//   trades?: Trade[];
//   auto_trade_active?: boolean;
//   performance?: {
//     totalTrades: number;
//     successRate: number;
//     totalProfit: number;
//   };
// }

// const AgentDashboardScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<AgentDashboardRouteProp>();
//   const { vault, agent: passedAgent } = route.params || {};

//   const [agent, setAgent] = useState<AgentInfo | null>(passedAgent as AgentInfo || null);
//   const [signals, setSignals] = useState<Signal[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [autoTradeEnabled, setAutoTradeEnabled] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false);

//   const vaultId = vault?.vault_id || vault?.sol?.vault_id || '';

//   // Add to state (around line 55)
// const [liveStatus, setLiveStatus] = useState<any>(null);

// // Add polling effect (after fetchData useEffect)
// useEffect(() => {
//   if (!agent?.agent_id) return;
  
//   // Poll status every 30 seconds
//   const pollStatus = async () => {
//     const status = await api.getAgentStatus(agent.agent_id);
//     if (status.success !== false) {
//       setLiveStatus(status);
//       setAutoTradeEnabled(status.running);
//     }
//   };
  
//   pollStatus();
//   const interval = setInterval(pollStatus, 30000);
//   return () => clearInterval(interval);
// }, [agent?.agent_id]);

//   // Fetch agent and signals
//   const fetchData = useCallback(async () => {
//     try {
//       // If no agent passed, try to fetch from API
//       if (!agent && vaultId) {
//         const agentRes = await api.getAgentForVault(vaultId);
//         if (agentRes.success && agentRes.agent) {
//           setAgent(agentRes.agent);
//           setAutoTradeEnabled(agentRes.agent.auto_trade_active || false);
//         }
//       }

//       // Fetch signals
//       const signalsRes = await api.getSignals();
//       if (signalsRes.success && signalsRes.signals) {
//         setSignals(signalsRes.signals);
//       }
//     } catch (error) {
//       console.error('Failed to fetch agent data:', error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [agent, vaultId]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchData();
//   };

//   // Toggle auto-trade
//   const toggleAutoTrade = async (enabled: boolean) => {
//     if (!agent?.agent_id) return;

//     setActionLoading(true);
//     try {
//       let res;
//       if (enabled) {
//         res = await api.startAutoTrading(agent.agent_id, 240);
//       } else {
//         res = await api.stopAutoTrading(agent.agent_id);
//       }

//       if (res.success) {
//         setAutoTradeEnabled(enabled);
//         Alert.alert(
//           enabled ? '🤖 Auto-Trading Started!' : '⏸️ Auto-Trading Paused',
//           enabled
//             ? 'Your agent will check Zynapse signals every 15 minutes and execute trades via Dark Pool.'
//             : 'Auto-trading has been paused. You can still execute trades manually.'
//         );
//       } else {
//         Alert.alert('Error', res.error || 'Failed to toggle auto-trade');
//       }
//     } catch (error: any) {
//       Alert.alert('Error', error.message || 'Failed to toggle auto-trade');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // Execute signal manually
//   const executeSignal = async (signal: Signal) => {
//     if (!vaultId) return;

//     Alert.alert(
//       `${signal.signal} ${signal.asset}?`,
//       `Confidence: ${signal.confidence}%\nRSI: ${signal.indicators.rsi}\n\nExecute via Dark Pool?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: `${signal.signal} Now`,
//           onPress: async () => {
//             setActionLoading(true);
//             try {
//               const price = signal.price || (signal.asset === 'SOL' ? 150 : 40);
//               const res = await api.submitDarkPoolOrder(
//                 vaultId,
//                 signal.signal === 'BUY' ? 'BUY' : 'SELL',
//                 signal.asset,
//                 0.1,
//                 price
//               );

//               if (res.success) {
//                 Alert.alert('✅ Order Submitted!', `${signal.signal} order sent to Dark Pool`);
//                 fetchData();
//               } else {
//                 Alert.alert('Error', res.error || 'Order failed');
//               }
//             } catch (error: any) {
//               Alert.alert('Error', error.message);
//             } finally {
//               setActionLoading(false);
//             }
//           },
//         },
//       ]
//     );
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#4ECDC4" />
//           <Text style={styles.loadingText}>Loading agent...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // Empty state - no agent
//   if (!agent) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <ScrollView showsVerticalScrollIndicator={false}>
//           {/* Header */}
//           <View style={styles.header}>
//             <TouchableOpacity onPress={() => navigation.goBack()}>
//               <Text style={styles.backButton}>← Back</Text>
//             </TouchableOpacity>
//             <Text style={styles.title}>🤖 AI Agent</Text>
//           </View>

//           {/* Empty State */}
//           <View style={styles.emptyState}>
//             <Text style={styles.emptyEmoji}>🤖</Text>
//             <Text style={styles.emptyTitle}>No AI Agent Yet</Text>
//             <Text style={styles.emptyDesc}>
//               Create an AI trading agent to automatically execute trades based on Zynapse signals using MEV-protected Dark Pool.
//             </Text>

//             <TouchableOpacity
//               style={styles.createButton}
//               onPress={() => vault && navigation.navigate('AgentSetup', { vault })}
//             >
//               <Text style={styles.createButtonText}>Create AI Agent</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Features */}
//           <View style={styles.featuresSection}>
//             <Text style={styles.featuresTitle}>What Your Agent Can Do</Text>

//             <View style={styles.featureCard}>
//               <Text style={styles.featureIcon}>🏊</Text>
//               <View style={styles.featureInfo}>
//                 <Text style={styles.featureTitle}>Dark Pool Trading</Text>
//                 <Text style={styles.featureDesc}>Execute trades with MEV protection via Arcium</Text>
//               </View>
//             </View>

//             <View style={styles.featureCard}>
//               <Text style={styles.featureIcon}>📊</Text>
//               <View style={styles.featureInfo}>
//                 <Text style={styles.featureTitle}>Zynapse Signals</Text>
//                 <Text style={styles.featureDesc}>Auto-trade based on AI market analysis</Text>
//               </View>
//             </View>

//             <View style={styles.featureCard}>
//               <Text style={styles.featureIcon}>🔄</Text>
//               <View style={styles.featureInfo}>
//                 <Text style={styles.featureTitle}>Cross-Chain Swaps</Text>
//                 <Text style={styles.featureDesc}>Trade SOL ↔ ZEC via NEAR Intents</Text>
//               </View>
//             </View>

//             <View style={styles.featureCard}>
//               <Text style={styles.featureIcon}>🏦</Text>
//               <View style={styles.featureInfo}>
//                 <Text style={styles.featureTitle}>Lending Protection</Text>
//                 <Text style={styles.featureDesc}>Auto-repay loans to prevent liquidation</Text>
//               </View>
//             </View>
//           </View>

//           {/* Manual Actions */}
//           <View style={styles.manualSection}>
//             <Text style={styles.sectionTitle}>Manual Actions</Text>
//             <Text style={styles.sectionSubtitle}>Use these features without an agent</Text>

//             <View style={styles.actionGrid}>
//               <TouchableOpacity
//                 style={styles.actionCard}
//                 onPress={() => navigation.navigate('DarkPool', { vault_id: vaultId, vault })}
//               >
//                 <Text style={styles.actionIcon}>🏊</Text>
//                 <Text style={styles.actionTitle}>Dark Pool</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.actionCard}
//                 onPress={() => navigation.navigate('Lending', { vault_id: vaultId, vault })}
//               >
//                 <Text style={styles.actionIcon}>🏦</Text>
//                 <Text style={styles.actionTitle}>Lending</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.actionCard}
//                 onPress={() => vault && navigation.navigate('Swap', { vault })}
//               >
//                 <Text style={styles.actionIcon}>🔄</Text>
//                 <Text style={styles.actionTitle}>Swap</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     );
//   }

//   // Agent exists - show dashboard
//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//         showsVerticalScrollIndicator={false}
//       >

        
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Text style={styles.backButton}>← Back</Text>
//           </TouchableOpacity>
//           <Text style={styles.title}>🤖 AI Agent</Text>
//         </View>

//         {liveStatus?.insufficientFunds && (
//   <View style={styles.warningBanner}>
//     <Text style={styles.warningIcon}>⚠️</Text>
//     <View style={styles.warningText}>
//       <Text style={styles.warningTitle}>Low Balance</Text>
//       <Text style={styles.warningDesc}>
//         {liveStatus.insufficientFunds.message || 'Add funds to continue trading'}
//       </Text>
//     </View>
//     <TouchableOpacity 
//       style={styles.addFundsButton}
//       onPress={() => vault && navigation.navigate('Receive', { vault })}
//     >
//       <Text style={styles.addFundsText}>Add Funds</Text>
//     </TouchableOpacity>
//   </View>
// )}

//         {/* Status Card */}
//         <View style={styles.statusCard}>
//           <View style={styles.statusHeader}>
//             <View style={styles.statusInfo}>
//               <View style={[styles.statusDot, autoTradeEnabled ? styles.statusActive : styles.statusInactive]} />
//               <Text style={styles.statusText}>
//                 {autoTradeEnabled ? 'Auto-Trading Active' : 'Manual Mode'}
//               </Text>
//             </View>
//             {actionLoading ? (
//               <ActivityIndicator size="small" color="#4ECDC4" />
//             ) : (
//               <Switch
//                 value={autoTradeEnabled}
//                 onValueChange={toggleAutoTrade}
//                 trackColor={{ false: '#374151', true: '#4ECDC4' }}
//                 thumbColor={autoTradeEnabled ? '#fff' : '#9CA3AF'}
//               />
//             )}
//           </View>
//           <Text style={styles.statusSubtext}>
//   {liveStatus?.status === 'INSUFFICIENT_FUNDS'
//     ? '⚠️ Paused - Add funds to continue'
//     : autoTradeEnabled
//     ? `Next check: ${liveStatus?.nextCheck ? new Date(liveStatus.nextCheck).toLocaleTimeString() : '~15 min'}`
//     : 'Toggle on to start auto-trading'}
// </Text>
//         </View>

//         {/* Stats */}
//         <View style={styles.statsGrid}>
//           <View style={styles.statCard}>
//             <Text style={styles.statValue}>{agent.stats?.trades_executed || 0}</Text>
//             <Text style={styles.statLabel}>Trades</Text>
//           </View>
//           <View style={styles.statCard}>
//             <Text style={[
//               styles.statValue,
//               { color: (agent.stats?.total_pnl || 0) >= 0 ? '#22C55E' : '#EF4444' }
//             ]}>
//               ${(agent.stats?.total_pnl || 0).toFixed(2)}
//             </Text>
//             <Text style={styles.statLabel}>P&L</Text>
//           </View>
//           <View style={styles.statCard}>
//             <Text style={styles.statValue}>{(agent.stats?.win_rate || 0).toFixed(0)}%</Text>
//             <Text style={styles.statLabel}>Win Rate</Text>
//           </View>
//           <View style={styles.statCard}>
//             <Text style={styles.statValue}>{agent.stats?.dark_pool_trades || 0}</Text>
//             <Text style={styles.statLabel}>Dark Pool</Text>
//           </View>
//         </View>

//         {/* Signals */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>📊 Trading Signals</Text>
//           {signals.length > 0 ? (
//             signals.map((signal, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={styles.signalCard}
//                 onPress={() => signal.signal !== 'HOLD' && executeSignal(signal)}
//                 disabled={signal.signal === 'HOLD'}
//               >
//                 <View style={styles.signalLeft}>
//                   <Text style={styles.signalAsset}>{signal.asset}</Text>
//                   <Text style={styles.signalPrice}>
//                     ${signal.price?.toFixed(2) || (signal.asset === 'SOL' ? '150.00' : '40.00')}
//                   </Text>
//                 </View>
//                 <View style={styles.signalCenter}>
//                   <Text style={styles.signalIndicator}>RSI: {signal.indicators.rsi}</Text>
//                   <Text style={styles.signalIndicator}>MACD: {signal.indicators.macd}</Text>
//                 </View>
//                 <View style={styles.signalRight}>
//                   <View style={[
//                     styles.signalBadge,
//                     signal.signal === 'BUY' && styles.signalBuy,
//                     signal.signal === 'SELL' && styles.signalSell,
//                     signal.signal === 'HOLD' && styles.signalHold,
//                   ]}>
//                     <Text style={styles.signalBadgeText}>{signal.signal}</Text>
//                   </View>
//                   <Text style={styles.signalConfidence}>{signal.confidence}%</Text>
//                 </View>
//               </TouchableOpacity>
//             ))
//           ) : (
//             <View style={styles.emptySignals}>
//               <Text style={styles.emptySignalsText}>Loading signals from Zynapse...</Text>
//               <TouchableOpacity onPress={fetchData}>
//                 <Text style={styles.refreshLink}>Refresh</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* Agent Settings */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>⚙️ Agent Settings</Text>
//           <View style={styles.settingsCard}>
//             <View style={styles.settingRow}>
//               <Text style={styles.settingLabel}>Risk Level</Text>
//               <Text style={styles.settingValue}>
//                 {agent.preferences?.risk_level || agent.preferences?.riskLevel || 'moderate'}
//               </Text>
//             </View>
//             <View style={styles.settingRow}>
//               <Text style={styles.settingLabel}>Trading Pairs</Text>
//               <Text style={styles.settingValue}>
//                 {agent.preferences?.trading_pairs?.join(', ') ||
//                   agent.preferences?.favoriteTokens?.join(', ') ||
//                   'SOL/USDC'}
//               </Text>
//             </View>
//             <View style={styles.settingRow}>
//               <Text style={styles.settingLabel}>Dark Pool</Text>
//               <Text style={styles.settingValue}>
//                 {agent.preferences?.dark_pool_trading !== false ? '✅' : '❌'}
//               </Text>
//             </View>
//             <View style={styles.settingRow}>
//               <Text style={styles.settingLabel}>Cross-Chain</Text>
//               <Text style={styles.settingValue}>
//                 {agent.preferences?.cross_chain_swaps !== false ? '✅' : '❌'}
//               </Text>
//             </View>
//           </View>
//           <TouchableOpacity
//             style={styles.editButton}
//             onPress={() => vault && navigation.navigate('AgentSetup', { vault })}
//           >
//             <Text style={styles.editButtonText}>Edit Settings</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Quick Actions */}
//         <View style={styles.quickActions}>
//           <TouchableOpacity
//             style={styles.quickAction}
//             onPress={() => navigation.navigate('DarkPool', { vault_id: vaultId, vault })}
//           >
//             <Text style={styles.quickActionIcon}>🏊</Text>
//             <Text style={styles.quickActionText}>Dark Pool</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.quickAction}
//             onPress={() => navigation.navigate('Lending', { vault_id: vaultId, vault })}
//           >
//             <Text style={styles.quickActionIcon}>🏦</Text>
//             <Text style={styles.quickActionText}>Lending</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.quickAction}
//             onPress={() => vault && navigation.navigate('Swap', { vault })}
//           >
//             <Text style={styles.quickActionIcon}>🔄</Text>
//             <Text style={styles.quickActionText}>Swap</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={{ height: 40 }} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0A1628',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     color: '#9CA3AF',
//     marginTop: 12,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     gap: 12,
//   },
//   backButton: {
//     color: '#4ECDC4',
//     fontSize: 16,
//   },
//   title: {
//     color: '#FFFFFF',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   // Empty state
//   emptyState: {
//     alignItems: 'center',
//     padding: 32,
//   },
//   emptyEmoji: {
//     fontSize: 80,
//     marginBottom: 16,
//   },
//   emptyTitle: {
//     color: '#FFFFFF',
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 12,
//   },
//   emptyDesc: {
//     color: '#9CA3AF',
//     fontSize: 15,
//     textAlign: 'center',
//     lineHeight: 22,
//     marginBottom: 24,
//     paddingHorizontal: 20,
//   },
//   createButton: {
//     backgroundColor: '#4ECDC4',
//     paddingHorizontal: 32,
//     paddingVertical: 16,
//     borderRadius: 14,
//   },
//   createButtonText: {
//     color: '#0A1628',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   // Features
//   featuresSection: {
//     padding: 16,
//   },
//   featuresTitle: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 16,
//   },
//   featureCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1E293B',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 12,
//   },
//   featureIcon: {
//     fontSize: 28,
//     marginRight: 14,
//   },
//   featureInfo: {
//     flex: 1,
//   },
//   featureTitle: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '600',
//   },
//   featureDesc: {
//     color: '#6B7280',
//     fontSize: 13,
//     marginTop: 2,
//   },
//   // Manual section
//   manualSection: {
//     padding: 16,
//   },
//   sectionTitle: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   sectionSubtitle: {
//     color: '#6B7280',
//     fontSize: 13,
//     marginBottom: 16,
//   },
//   actionGrid: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   actionCard: {
//     flex: 1,
//     backgroundColor: '#1E293B',
//     padding: 20,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   actionIcon: {
//     fontSize: 28,
//     marginBottom: 8,
//   },
//   actionTitle: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   // Status card
//   statusCard: {
//     backgroundColor: '#1E293B',
//     marginHorizontal: 16,
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 16,
//   },
//   statusHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   statusInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   statusDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     marginRight: 8,
//   },
//   statusActive: {
//     backgroundColor: '#22C55E',
//   },
//   statusInactive: {
//     backgroundColor: '#6B7280',
//   },
//   statusText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   statusSubtext: {
//     color: '#6B7280',
//     fontSize: 13,
//   },
//   // Stats
//   statsGrid: {
//     flexDirection: 'row',
//     marginHorizontal: 16,
//     gap: 8,
//     marginBottom: 16,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: '#1E293B',
//     padding: 12,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   statValue: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   statLabel: {
//     color: '#6B7280',
//     fontSize: 11,
//     marginTop: 4,
//   },
//   // Section
//   section: {
//     marginHorizontal: 16,
//     marginBottom: 16,
//   },
//   // Signals
//   signalCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1E293B',
//     padding: 14,
//     borderRadius: 10,
//     marginBottom: 8,
//   },
//   signalLeft: {
//     flex: 1,
//   },
//   signalAsset: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   signalPrice: {
//     color: '#6B7280',
//     fontSize: 13,
//   },
//   signalCenter: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   signalIndicator: {
//     color: '#9CA3AF',
//     fontSize: 11,
//   },
//   signalRight: {
//     alignItems: 'flex-end',
//   },
//   signalBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginBottom: 4,
//   },
//   signalBuy: {
//     backgroundColor: '#22C55E20',
//   },
//   signalSell: {
//     backgroundColor: '#EF444420',
//   },
//   signalHold: {
//     backgroundColor: '#6B728020',
//   },
//   signalBadgeText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
//   signalConfidence: {
//     color: '#6B7280',
//     fontSize: 11,
//   },
//   emptySignals: {
//     backgroundColor: '#1E293B',
//     padding: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   emptySignalsText: {
//     color: '#6B7280',
//   },
//   refreshLink: {
//     color: '#4ECDC4',
//     marginTop: 8,
//   },
//   // Settings
//   settingsCard: {
//     backgroundColor: '#1E293B',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 12,
//   },
//   settingRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#374151',
//   },
//   settingLabel: {
//     color: '#6B7280',
//     fontSize: 14,
//   },
//   settingValue: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   editButton: {
//     backgroundColor: '#374151',
//     padding: 12,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   editButtonText: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   // Quick actions
//   quickActions: {
//     flexDirection: 'row',
//     marginHorizontal: 16,
//     gap: 12,
//   },
//   quickAction: {
//     flex: 1,
//     backgroundColor: '#1E293B',
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   quickActionIcon: {
//     fontSize: 24,
//     marginBottom: 6,
//   },
//   quickActionText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   // Add to styles
// warningBanner: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   backgroundColor: '#78350F',
//   marginHorizontal: 16,
//   padding: 12,
//   borderRadius: 12,
//   marginBottom: 16,
// },
// warningIcon: {
//   fontSize: 24,
//   marginRight: 12,
// },
// warningText: {
//   flex: 1,
// },
// warningTitle: {
//   color: '#FCD34D',
//   fontSize: 14,
//   fontWeight: '600',
// },
// warningDesc: {
//   color: '#FDE68A',
//   fontSize: 12,
// },
// addFundsButton: {
//   backgroundColor: '#F59E0B',
//   paddingHorizontal: 12,
//   paddingVertical: 8,
//   borderRadius: 8,
// },
// addFundsText: {
//   color: '#000',
//   fontWeight: '600',
//   fontSize: 12,
// },
// });

// export default AgentDashboardScreen;

/**
 * AgentDashboardScreen.tsx
 * 
 * AI Agent dashboard with:
 * - Empty state (no agent) → Create button
 * - Agent state → Signals, auto-trade toggle, stats
 * 
 * Styled with VoltWallet Premium Theme
 */

// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Switch,
//   RefreshControl,
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   Platform,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList, VaultData } from '../types/navigation';
// import LinearGradient from 'react-native-linear-gradient';
// import api from '../services/api';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');

// type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
// type AgentDashboardRouteProp = RouteProp<RootStackParamList, 'AgentDashboard'>;

// interface Signal {
//   asset: string;
//   signal: 'BUY' | 'SELL' | 'HOLD';
//   confidence: number;
//   price?: number;
//   indicators: {
//     rsi: number;
//     macd: string;
//     ema_trend: string;
//   };
// }

// interface Trade {
//   id: string;
//   asset: string;
//   type: 'BUY' | 'SELL';
//   amount: number;
//   price: number;
//   timestamp: string;
//   pnl?: number;
//   via: 'DARK_POOL' | 'DEX' | 'CROSS_CHAIN';
// }

// interface AgentInfo {
//   agent_id: string;
//   vault_id?: string;
//   name?: string;
//   status?: 'active' | 'paused' | 'stopped';
//   preferences?: {
//     risk_level?: string;
//     riskLevel?: string;
//     trading_pairs?: string[];
//     favoriteTokens?: string[];
//     cross_chain_swaps?: boolean;
//     dark_pool_trading?: boolean;
//     enable_lending?: boolean;
//     maxTradeSize?: number;
//     investmentStyle?: string;
//   };
//   stats?: {
//     trades_executed: number;
//     dark_pool_trades: number;
//     cross_chain_trades?: number;
//     total_pnl: number;
//     win_rate: number;
//   };
//   trades?: Trade[];
//   auto_trade_active?: boolean;
//   performance?: {
//     totalTrades: number;
//     successRate: number;
//     totalProfit: number;
//   };
// }

// const AgentDashboardScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<AgentDashboardRouteProp>();
//   const { vault, agent: passedAgent } = route.params || {};

//   const [agent, setAgent] = useState<AgentInfo | null>(passedAgent as AgentInfo || null);
//   const [signals, setSignals] = useState<Signal[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [autoTradeEnabled, setAutoTradeEnabled] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [liveStatus, setLiveStatus] = useState<any>(null);

//   const vaultId = vault?.vault_id || vault?.sol?.vault_id || '';

//   // Poll status
//   useEffect(() => {
//     if (!agent?.agent_id) return;
    
//     const pollStatus = async () => {
//       const status = await api.getAgentStatus(agent.agent_id);
//       if (status.success !== false) {
//         setLiveStatus(status);
//         setAutoTradeEnabled(status.running);
//       }
//     };
    
//     pollStatus();
//     const interval = setInterval(pollStatus, 30000);
//     return () => clearInterval(interval);
//   }, [agent?.agent_id]);

//   // Fetch agent and signals
//   const fetchData = useCallback(async () => {
//     try {
//       if (!agent && vaultId) {
//         const agentRes = await api.getAgentForVault(vaultId);
//         if (agentRes.success && agentRes.agent) {
//           setAgent(agentRes.agent);
//           setAutoTradeEnabled(agentRes.agent.auto_trade_active || false);
//         }
//       }

//       const signalsRes = await api.getSignals();
//       if (signalsRes.success && signalsRes.signals) {
//         setSignals(signalsRes.signals);
//       }
//     } catch (error) {
//       console.error('Failed to fetch agent data:', error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [agent, vaultId]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchData();
//   };

//   // Toggle auto-trade
//   const toggleAutoTrade = async (enabled: boolean) => {
//     if (!agent?.agent_id) return;

//     setActionLoading(true);
//     try {
//       let res;
//       if (enabled) {
//         res = await api.startAutoTrading(agent.agent_id, 240);
//       } else {
//         res = await api.stopAutoTrading(agent.agent_id);
//       }

//       if (res.success) {
//         setAutoTradeEnabled(enabled);
//         Alert.alert(
//           enabled ? '🤖 Auto-Trading Started!' : '⏸️ Auto-Trading Paused',
//           enabled
//             ? 'Your agent will check Zynapse signals every 15 minutes and execute trades via Dark Pool.'
//             : 'Auto-trading has been paused. You can still execute trades manually.'
//         );
//       } else {
//         Alert.alert('Error', res.error || 'Failed to toggle auto-trade');
//       }
//     } catch (error: any) {
//       Alert.alert('Error', error.message || 'Failed to toggle auto-trade');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // Execute signal manually
//   const executeSignal = async (signal: Signal) => {
//     if (!vaultId) return;

//     Alert.alert(
//       `${signal.signal} ${signal.asset}?`,
//       `Confidence: ${signal.confidence}%\nRSI: ${signal.indicators.rsi}\n\nExecute via Dark Pool?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: `${signal.signal} Now`,
//           onPress: async () => {
//             setActionLoading(true);
//             try {
//               const price = signal.price || (signal.asset === 'SOL' ? 150 : 40);
//               const res = await api.submitDarkPoolOrder(
//                 vaultId,
//                 signal.signal === 'BUY' ? 'BUY' : 'SELL',
//                 signal.asset,
//                 0.1,
//                 price
//               );

//               if (res.success) {
//                 Alert.alert('✅ Order Submitted!', `${signal.signal} order sent to Dark Pool`);
//                 fetchData();
//               } else {
//                 Alert.alert('Error', res.error || 'Order failed');
//               }
//             } catch (error: any) {
//               Alert.alert('Error', error.message);
//             } finally {
//               setActionLoading(false);
//             }
//           },
//         },
//       ]
//     );
//   };

//   const getSignalColor = (signal: string) => {
//     switch (signal) {
//       case 'BUY': return '#22C55E';
//       case 'SELL': return '#EF4444';
//       default: return '#6B7280';
//     }
//   };

//   const getAssetIcon = (asset: string) => {
//     switch (asset) {
//       case 'SOL': return '◎';
//       case 'ZEC': return 'Z';
//       case 'ETH': return '⟠';
//       default: return '●';
//     }
//   };

//   const getAssetColor = (asset: string) => {
//     switch (asset) {
//       case 'SOL': return '#9945FF';
//       case 'ZEC': return '#F4B728';
//       case 'ETH': return '#627EEA';
//       default: return '#4ECDC4';
//     }
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <LinearGradient
//           colors={['#1E3A5F', '#0F2744', '#0A1628']}
//           style={styles.glowGradient}
//           start={{ x: 0.5, y: 0 }}
//           end={{ x: 0.5, y: 1 }}
//         />
//         <SafeAreaView style={styles.safeArea}>
//           <View style={styles.loadingContainer}>
//             <View style={styles.loaderCircle}>
//               <ActivityIndicator size="large" color="#4ECDC4" />
//             </View>
//             <Text style={styles.loadingText}>Loading agent...</Text>
//           </View>
//         </SafeAreaView>
//       </View>
//     );
//   }

//   // Empty state - no agent
//   if (!agent) {
//     return (
//       <View style={styles.container}>
//         <LinearGradient
//           colors={['#1E3A5F', '#0F2744', '#0A1628']}
//           style={styles.glowGradient}
//           start={{ x: 0.5, y: 0 }}
//           end={{ x: 0.5, y: 1 }}
//         />
//         <SafeAreaView style={styles.safeArea}>
//           <ScrollView 
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.scrollContent}
//           >
//             {/* Header */}
//             <View style={styles.header}>
//               <TouchableOpacity 
//                 style={styles.backButton}
//                 onPress={() => navigation.goBack()}
//                 activeOpacity={0.7}
//               >
//                 <Text style={styles.backIcon}>←</Text>
//               </TouchableOpacity>
//               <View style={styles.headerCenter}>
//                 <Text style={styles.title}>AI Agent</Text>
//                 <Text style={styles.subtitle}>Automated Trading</Text>
//               </View>
//               <View style={styles.headerSpacer} />
//             </View>

//             {/* Empty State */}
//             <View style={styles.emptyState}>
//               <View style={styles.emptyIconContainer}>
//                 <Text style={styles.emptyEmoji}>🤖</Text>
//               </View>
//               <Text style={styles.emptyTitle}>No AI Agent Yet</Text>
//               <Text style={styles.emptyDesc}>
//                 Create an AI trading agent to automatically execute trades based on Zynapse signals using MEV-protected Dark Pool.
//               </Text>

//               <TouchableOpacity
//                 style={styles.createButton}
//                 onPress={() => vault && navigation.navigate('AgentSetup', { vault })}
//                 activeOpacity={0.8}
//               >
//                 <Text style={styles.createButtonText}>Create AI Agent</Text>
//               </TouchableOpacity>
//             </View>

//             {/* Features */}
//             <View style={styles.featuresSection}>
//               <Text style={styles.sectionTitle}>What Your Agent Can Do</Text>

//               <TouchableOpacity style={styles.featureCard} activeOpacity={0.7}>
//                 <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(78, 205, 196, 0.15)' }]}>
//                   <Text style={styles.featureIcon}>🏊</Text>
//                 </View>
//                 <View style={styles.featureInfo}>
//                   <Text style={styles.featureTitle}>Dark Pool Trading</Text>
//                   <Text style={styles.featureDesc}>Execute trades with MEV protection via Arcium</Text>
//                 </View>
//                 <Text style={styles.featureArrow}>→</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.featureCard} activeOpacity={0.7}>
//                 <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(153, 69, 255, 0.15)' }]}>
//                   <Text style={styles.featureIcon}>📊</Text>
//                 </View>
//                 <View style={styles.featureInfo}>
//                   <Text style={styles.featureTitle}>Zynapse Signals</Text>
//                   <Text style={styles.featureDesc}>Auto-trade based on AI market analysis</Text>
//                 </View>
//                 <Text style={styles.featureArrow}>→</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.featureCard} activeOpacity={0.7}>
//                 <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(244, 183, 40, 0.15)' }]}>
//                   <Text style={styles.featureIcon}>🔄</Text>
//                 </View>
//                 <View style={styles.featureInfo}>
//                   <Text style={styles.featureTitle}>Cross-Chain Swaps</Text>
//                   <Text style={styles.featureDesc}>Trade SOL ↔ ZEC via NEAR Intents</Text>
//                 </View>
//                 <Text style={styles.featureArrow}>→</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.featureCard} activeOpacity={0.7}>
//                 <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
//                   <Text style={styles.featureIcon}>🏦</Text>
//                 </View>
//                 <View style={styles.featureInfo}>
//                   <Text style={styles.featureTitle}>Lending Protection</Text>
//                   <Text style={styles.featureDesc}>Auto-repay loans to prevent liquidation</Text>
//                 </View>
//                 <Text style={styles.featureArrow}>→</Text>
//               </TouchableOpacity>
//             </View>

//             {/* Manual Actions */}
//             <View style={styles.manualSection}>
//               <Text style={styles.sectionTitle}>Manual Actions</Text>
//               <Text style={styles.sectionSubtitle}>Use these features without an agent</Text>

//               <View style={styles.actionGrid}>
//                 <TouchableOpacity
//                   style={styles.actionCard}
//                   onPress={() => navigation.navigate('DarkPool', { vault_id: vaultId, vault })}
//                   activeOpacity={0.7}
//                 >
//                   <View style={[styles.actionIconBg, { backgroundColor: 'rgba(78, 205, 196, 0.15)' }]}>
//                     <Text style={styles.actionIcon}>🏊</Text>
//                   </View>
//                   <Text style={styles.actionTitle}>Dark Pool</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={styles.actionCard}
//                   onPress={() => navigation.navigate('Lending', { vault_id: vaultId, vault })}
//                   activeOpacity={0.7}
//                 >
//                   <View style={[styles.actionIconBg, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
//                     <Text style={styles.actionIcon}>🏦</Text>
//                   </View>
//                   <Text style={styles.actionTitle}>Lending</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={styles.actionCard}
//                   onPress={() => vault && navigation.navigate('Swap', { vault })}
//                   activeOpacity={0.7}
//                 >
//                   <View style={[styles.actionIconBg, { backgroundColor: 'rgba(244, 183, 40, 0.15)' }]}>
//                     <Text style={styles.actionIcon}>🔄</Text>
//                   </View>
//                   <Text style={styles.actionTitle}>Swap</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Footer */}
//             <View style={styles.securityFooter}>
//               <Text style={styles.securityText}>◈ Powered by Zynapse • ZkAGI 2025</Text>
//             </View>
//           </ScrollView>
//         </SafeAreaView>
//       </View>
//     );
//   }

//   // Agent exists - show dashboard
//   return (
//     <View style={styles.container}>
//       <LinearGradient
//         colors={['#1E3A5F', '#0F2744', '#0A1628']}
//         style={styles.glowGradient}
//         start={{ x: 0.5, y: 0 }}
//         end={{ x: 0.5, y: 1 }}
//       />
//       <SafeAreaView style={styles.safeArea}>
//         <ScrollView
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4ECDC4" />
//           }
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.scrollContent}
//         >
//           {/* Header */}
//           <View style={styles.header}>
//             <TouchableOpacity 
//               style={styles.backButton}
//               onPress={() => navigation.goBack()}
//               activeOpacity={0.7}
//             >
//               <Text style={styles.backIcon}>←</Text>
//             </TouchableOpacity>
//             <View style={styles.headerCenter}>
//               <Text style={styles.title}>AI Agent</Text>
//               <Text style={styles.subtitle}>Automated Trading</Text>
//             </View>
//             <View style={styles.headerSpacer} />
//           </View>

//           {/* Warning Banner */}
//           {liveStatus?.insufficientFunds && (
//             <View style={styles.warningBanner}>
//               <View style={styles.warningIconContainer}>
//                 <Text style={styles.warningIconText}>⚠</Text>
//               </View>
//               <View style={styles.warningContent}>
//                 <Text style={styles.warningTitle}>Low Balance</Text>
//                 <Text style={styles.warningDesc}>
//                   {liveStatus.insufficientFunds.message || 'Add funds to continue trading'}
//                 </Text>
//               </View>
//               <TouchableOpacity 
//                 style={styles.addFundsButton}
//                 onPress={() => vault && navigation.navigate('Receive', { vault })}
//                 activeOpacity={0.7}
//               >
//                 <Text style={styles.addFundsText}>Add Funds</Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           {/* Status Card */}
//           <View style={styles.statusCard}>
//             <View style={styles.statusHeader}>
//               <View style={styles.statusInfo}>
//                 <View style={[
//                   styles.statusDot, 
//                   autoTradeEnabled ? styles.statusActive : styles.statusInactive
//                 ]} />
//                 <Text style={styles.statusText}>
//                   {autoTradeEnabled ? 'Auto-Trading Active' : 'Manual Mode'}
//                 </Text>
//               </View>
//               {actionLoading ? (
//                 <ActivityIndicator size="small" color="#4ECDC4" />
//               ) : (
//                 <Switch
//                   value={autoTradeEnabled}
//                   onValueChange={toggleAutoTrade}
//                   trackColor={{ false: 'rgba(30, 58, 95, 0.8)', true: 'rgba(78, 205, 196, 0.4)' }}
//                   thumbColor={autoTradeEnabled ? '#4ECDC4' : '#6B7280'}
//                 />
//               )}
//             </View>
//             <Text style={styles.statusSubtext}>
//               {liveStatus?.status === 'INSUFFICIENT_FUNDS'
//                 ? '⚠️ Paused - Add funds to continue'
//                 : autoTradeEnabled
//                 ? `Next check: ${liveStatus?.nextCheck ? new Date(liveStatus.nextCheck).toLocaleTimeString() : '~15 min'}`
//                 : 'Toggle on to start auto-trading'}
//             </Text>
//           </View>

//           {/* Stats */}
//           <View style={styles.statsGrid}>
//             <View style={styles.statCard}>
//               <Text style={styles.statValue}>{agent.stats?.trades_executed || 0}</Text>
//               <Text style={styles.statLabel}>Trades</Text>
//             </View>
//             <View style={styles.statCard}>
//               <Text style={[
//                 styles.statValue,
//                 { color: (agent.stats?.total_pnl || 0) >= 0 ? '#22C55E' : '#EF4444' }
//               ]}>
//                 ${(agent.stats?.total_pnl || 0).toFixed(2)}
//               </Text>
//               <Text style={styles.statLabel}>P&L</Text>
//             </View>
//             <View style={styles.statCard}>
//               <Text style={[styles.statValue, { color: '#4ECDC4' }]}>
//                 {(agent.stats?.win_rate || 0).toFixed(0)}%
//               </Text>
//               <Text style={styles.statLabel}>Win Rate</Text>
//             </View>
//             <View style={styles.statCard}>
//               <Text style={styles.statValue}>{agent.stats?.dark_pool_trades || 0}</Text>
//               <Text style={styles.statLabel}>Dark Pool</Text>
//             </View>
//           </View>

//           {/* Signals */}
//           <View style={styles.section}>
//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionTitle}>Trading Signals</Text>
//               <TouchableOpacity onPress={fetchData} activeOpacity={0.7}>
//                 <Text style={styles.refreshLink}>Refresh</Text>
//               </TouchableOpacity>
//             </View>
            
//             {signals.length > 0 ? (
//               signals.map((signal, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={styles.signalCard}
//                   onPress={() => signal.signal !== 'HOLD' && executeSignal(signal)}
//                   disabled={signal.signal === 'HOLD'}
//                   activeOpacity={0.7}
//                 >
//                   <View style={styles.signalLeft}>
//                     <View style={[styles.signalAssetIcon, { backgroundColor: getAssetColor(signal.asset) }]}>
//                       <Text style={styles.signalAssetIconText}>{getAssetIcon(signal.asset)}</Text>
//                     </View>
//                     <View style={styles.signalAssetInfo}>
//                       <Text style={styles.signalAsset}>{signal.asset}</Text>
//                       <Text style={styles.signalPrice}>
//                         ${signal.price?.toFixed(2) || (signal.asset === 'SOL' ? '150.00' : '40.00')}
//                       </Text>
//                     </View>
//                   </View>
                  
//                   <View style={styles.signalCenter}>
//                     <View style={styles.indicatorRow}>
//                       <Text style={styles.indicatorLabel}>RSI</Text>
//                       <Text style={styles.indicatorValue}>{signal.indicators.rsi}</Text>
//                     </View>
//                     <View style={styles.indicatorRow}>
//                       <Text style={styles.indicatorLabel}>MACD</Text>
//                       <Text style={styles.indicatorValue}>{signal.indicators.macd}</Text>
//                     </View>
//                   </View>
                  
//                   <View style={styles.signalRight}>
//                     <View style={[
//                       styles.signalBadge,
//                       { backgroundColor: getSignalColor(signal.signal) + '20' }
//                     ]}>
//                       <Text style={[styles.signalBadgeText, { color: getSignalColor(signal.signal) }]}>
//                         {signal.signal}
//                       </Text>
//                     </View>
//                     <Text style={styles.signalConfidence}>{signal.confidence}% conf</Text>
//                   </View>
//                 </TouchableOpacity>
//               ))
//             ) : (
//               <View style={styles.emptySignals}>
//                 <View style={styles.emptySignalsIcon}>
//                   <Text style={styles.emptySignalsEmoji}>📊</Text>
//                 </View>
//                 <Text style={styles.emptySignalsText}>Loading signals from Zynapse...</Text>
//                 <TouchableOpacity onPress={fetchData} activeOpacity={0.7}>
//                   <Text style={styles.refreshLinkAlt}>Tap to refresh</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>

//           {/* Agent Settings */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Agent Settings</Text>
//             <View style={styles.settingsCard}>
//               <View style={styles.settingRow}>
//                 <Text style={styles.settingLabel}>Risk Level</Text>
//                 <View style={styles.settingValueContainer}>
//                   <Text style={styles.settingValue}>
//                     {agent.preferences?.risk_level || agent.preferences?.riskLevel || 'moderate'}
//                   </Text>
//                 </View>
//               </View>
//               <View style={styles.settingDivider} />
//               <View style={styles.settingRow}>
//                 <Text style={styles.settingLabel}>Trading Pairs</Text>
//                 <Text style={styles.settingValue}>
//                   {agent.preferences?.trading_pairs?.join(', ') ||
//                     agent.preferences?.favoriteTokens?.join(', ') ||
//                     'SOL/USDC'}
//                 </Text>
//               </View>
//               <View style={styles.settingDivider} />
//               <View style={styles.settingRow}>
//                 <Text style={styles.settingLabel}>Dark Pool</Text>
//                 <View style={[
//                   styles.settingBadge,
//                   agent.preferences?.dark_pool_trading !== false 
//                     ? styles.settingBadgeActive 
//                     : styles.settingBadgeInactive
//                 ]}>
//                   <Text style={[
//                     styles.settingBadgeText,
//                     { color: agent.preferences?.dark_pool_trading !== false ? '#22C55E' : '#EF4444' }
//                   ]}>
//                     {agent.preferences?.dark_pool_trading !== false ? 'Enabled' : 'Disabled'}
//                   </Text>
//                 </View>
//               </View>
//               <View style={styles.settingDivider} />
//               <View style={styles.settingRow}>
//                 <Text style={styles.settingLabel}>Cross-Chain</Text>
//                 <View style={[
//                   styles.settingBadge,
//                   agent.preferences?.cross_chain_swaps !== false 
//                     ? styles.settingBadgeActive 
//                     : styles.settingBadgeInactive
//                 ]}>
//                   <Text style={[
//                     styles.settingBadgeText,
//                     { color: agent.preferences?.cross_chain_swaps !== false ? '#22C55E' : '#EF4444' }
//                   ]}>
//                     {agent.preferences?.cross_chain_swaps !== false ? 'Enabled' : 'Disabled'}
//                   </Text>
//                 </View>
//               </View>
//             </View>
            
//             <TouchableOpacity
//               style={styles.editButton}
//               onPress={() => vault && navigation.navigate('AgentSetup', { vault })}
//               activeOpacity={0.7}
//             >
//               <Text style={styles.editButtonIcon}>⚙</Text>
//               <Text style={styles.editButtonText}>Edit Settings</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Quick Actions */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Quick Actions</Text>
//             <View style={styles.quickActionsGrid}>
//               <TouchableOpacity
//                 style={styles.quickActionCard}
//                 onPress={() => navigation.navigate('DarkPool', { vault_id: vaultId, vault })}
//                 activeOpacity={0.7}
//               >
//                 <View style={[styles.quickActionIconBg, { backgroundColor: 'rgba(78, 205, 196, 0.15)' }]}>
//                   <Text style={styles.quickActionIcon}>🏊</Text>
//                 </View>
//                 <Text style={styles.quickActionText}>Dark Pool</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity
//                 style={styles.quickActionCard}
//                 onPress={() => navigation.navigate('Lending', { vault_id: vaultId, vault })}
//                 activeOpacity={0.7}
//               >
//                 <View style={[styles.quickActionIconBg, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
//                   <Text style={styles.quickActionIcon}>🏦</Text>
//                 </View>
//                 <Text style={styles.quickActionText}>Lending</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity
//                 style={styles.quickActionCard}
//                 onPress={() => vault && navigation.navigate('Swap', { vault })}
//                 activeOpacity={0.7}
//               >
//                 <View style={[styles.quickActionIconBg, { backgroundColor: 'rgba(244, 183, 40, 0.15)' }]}>
//                   <Text style={styles.quickActionIcon}>🔄</Text>
//                 </View>
//                 <Text style={styles.quickActionText}>Swap</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Footer */}
//           <View style={styles.securityFooter}>
//             <Text style={styles.securityText}>◈ Powered by Zynapse • ZkAGI 2025</Text>
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </View>
//   );
// };

// // ═══════════════════════════════════════════════════════════════
// // STYLES - VoltWallet Premium Theme
// // ═══════════════════════════════════════════════════════════════

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0A1628',
//   },
//   safeArea: {
//     flex: 1,
//   },
//   glowGradient: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 400,
//   },
//   scrollContent: {
//     padding: 20,
//     paddingBottom: 40,
//   },

//   // Loading
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loaderCircle: {
//     width: 80,
//     height: 80,
//     backgroundColor: 'rgba(17, 24, 39, 0.8)',
//     borderRadius: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: 'rgba(78, 205, 196, 0.3)',
//   },
//   loadingText: {
//     color: '#6B7280',
//     marginTop: 16,
//     fontSize: 15,
//   },

//   // Header
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 24,
//   },
//   backButton: {
//     width: 44,
//     height: 44,
//     backgroundColor: 'rgba(17, 24, 39, 0.8)',
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(59, 130, 246, 0.3)',
//   },
//   backIcon: {
//     fontSize: 20,
//     color: '#FFFFFF',
//   },
//   headerCenter: {
//     alignItems: 'center',
//   },
//   headerSpacer: {
//     width: 44,
//   },
//   title: {
//     color: '#FFFFFF',
//     fontSize: 24,
//     fontWeight: '700',
//   },
//   subtitle: {
//     color: '#4ECDC4',
//     fontSize: 13,
//     marginTop: 4,
//   },

//   // Empty State
//   emptyState: {
//     alignItems: 'center',
//     paddingVertical: 40,
//   },
//   emptyIconContainer: {
//     width: 120,
//     height: 120,
//     backgroundColor: 'rgba(17, 24, 39, 0.8)',
//     borderRadius: 60,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: 'rgba(78, 205, 196, 0.3)',
//     marginBottom: 24,
//   },
//   emptyEmoji: {
//     fontSize: 56,
//   },
//   emptyTitle: {
//     color: '#FFFFFF',
//     fontSize: 24,
//     fontWeight: '700',
//     marginBottom: 12,
//   },
//   emptyDesc: {
//     color: '#9CA3AF',
//     fontSize: 15,
//     textAlign: 'center',
//     lineHeight: 24,
//     marginBottom: 28,
//     paddingHorizontal: 20,
//   },
//   createButton: {
//     backgroundColor: '#4ECDC4',
//     paddingHorizontal: 40,
//     paddingVertical: 16,
//     borderRadius: 14,
//   },
//   createButtonText: {
//     color: '#0A1628',
//     fontSize: 18,
//     fontWeight: '700',
//   },

//   // Features Section
//   featuresSection: {
//     marginBottom: 24,
//   },
//   featureCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(17, 24, 39, 0.8)',
//     padding: 16,
//     borderRadius: 14,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: 'rgba(59, 130, 246, 0.2)',
//   },
//   featureIconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 14,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 14,
//   },
//   featureIcon: {
//     fontSize: 24,
//   },
//   featureInfo: {
//     flex: 1,
//   },
//   featureTitle: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   featureDesc: {
//     color: '#6B7280',
//     fontSize: 13,
//     marginTop: 4,
//   },
//   featureArrow: {
//     color: '#4ECDC4',
//     fontSize: 18,
//   },

//   // Manual Section
//   manualSection: {
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 6,
//   },
//   sectionSubtitle: {
//     color: '#6B7280',
//     fontSize: 13,
//     marginBottom: 16,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   actionGrid: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   actionCard: {
//     flex: 1,
//     backgroundColor: 'rgba(17, 24, 39, 0.8)',
//     padding: 20,
//     borderRadius: 16,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(59, 130, 246, 0.2)',
//   },
//   actionIconBg: {
//     width: 52,
//     height: 52,
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   actionIcon: {
//     fontSize: 26,
//   },
//   actionTitle: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '600',
//   },

//   // Warning Banner
//   warningBanner: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(120, 53, 15, 0.8)',
//     padding: 14,
//     borderRadius: 14,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(245, 158, 11, 0.4)',
//   },
//   warningIconContainer: {
//     width: 40,
//     height: 40,
//     backgroundColor: 'rgba(245, 158, 11, 0.2)',
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   warningIconText: {
//     fontSize: 20,
//     color: '#FCD34D',
//   },
//   warningContent: {
//     flex: 1,
//   },
//   warningTitle: {
//     color: '#FCD34D',
//     fontSize: 15,
//     fontWeight: '600',
//   },
//   warningDesc: {
//     color: '#FDE68A',
//     fontSize: 12,
//     marginTop: 2,
//   },
//   addFundsButton: {
//     backgroundColor: '#F59E0B',
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   addFundsText: {
//     color: '#000',
//     fontWeight: '700',
//     fontSize: 13,
//   },

//   // Status Card
//   statusCard: {
//     backgroundColor: 'rgba(17, 24, 39, 0.8)',
//     padding: 18,
//     borderRadius: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(59, 130, 246, 0.2)',
//   },
//   statusHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   statusInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   statusDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     marginRight: 10,
//   },
//   statusActive: {
//     backgroundColor: '#22C55E',
//     shadowColor: '#22C55E',
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.5,
//     shadowRadius: 6,
//   },
//   statusInactive: {
//     backgroundColor: '#6B7280',
//   },
//   statusText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   statusSubtext: {
//     color: '#6B7280',
//     fontSize: 13,
//   },

//   // Stats Grid
//   statsGrid: {
//     flexDirection: 'row',
//     gap: 10,
//     marginBottom: 20,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: 'rgba(17, 24, 39, 0.8)',
//     padding: 14,
//     borderRadius: 14,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(59, 130, 246, 0.2)',
//   },
//   statValue: {
//     color: '#FFFFFF',
//     fontSize: 20,
//     fontWeight: '700',
//   },
//   statLabel: {
//     color: '#6B7280',
//     fontSize: 11,
//     marginTop: 6,
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },

//   // Section
//   section: {
//     marginBottom: 24,
//   },

//   // Signals
//   signalCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(17, 24, 39, 0.8)',
//     padding: 14,
//     borderRadius: 14,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: 'rgba(59, 130, 246, 0.2)',
//   },
//   signalLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   signalAssetIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   signalAssetIconText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   signalAssetInfo: {},
//   signalAsset: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   signalPrice: {
//     color: '#6B7280',
//     fontSize: 13,
//     marginTop: 2,
//   },
//   signalCenter: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   indicatorRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 2,
//   },
//   indicatorLabel: {
//     color: '#6B7280',
//     fontSize: 11,
//     width: 40,
//   },
//   indicatorValue: {
//     color: '#9CA3AF',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   signalRight: {
//     alignItems: 'flex-end',
//   },
//   signalBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 10,
//     marginBottom: 6,
//   },
//   signalBadgeText: {
//     fontSize: 12,
//     fontWeight: '700',
//   },
//   signalConfidence: {
//     color: '#6B7280',
//     fontSize: 11,
//   },
//   refreshLink: {
//     color: '#4ECDC4',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   refreshLinkAlt: {
//     color: '#4ECDC4',
//     fontSize: 14,
//     marginTop: 12,
//   },
//   emptySignals: {
//     backgroundColor: 'rgba(17, 24, 39, 0.8)',
//     padding: 32,
//     borderRadius: 16,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(59, 130, 246, 0.2)',
//   },
//   emptySignalsIcon: {
//     width: 56,
//     height: 56,
//     backgroundColor: 'rgba(30, 58, 95, 0.5)',
//     borderRadius: 28,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   emptySignalsEmoji: {
//     fontSize: 28,
//   },
//   emptySignalsText: {
//     color: '#6B7280',
//     fontSize: 14,
//   },

//   // Settings
//   settingsCard: {
//     backgroundColor: 'rgba(17, 24, 39, 0.8)',
//     padding: 16,
//     borderRadius: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: 'rgba(59, 130, 246, 0.2)',
//   },
//   settingRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//   },
//   settingDivider: {
//     height: 1,
//     backgroundColor: 'rgba(59, 130, 246, 0.15)',
//   },
//   settingLabel: {
//     color: '#6B7280',
//     fontSize: 14,
//   },
//   settingValueContainer: {
//     backgroundColor: 'rgba(78, 205, 196, 0.15)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 8,
//   },
//   settingValue: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   settingBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 8,
//   },
//   settingBadgeActive: {
//     backgroundColor: 'rgba(34, 197, 94, 0.15)',
//   },
//   settingBadgeInactive: {
//     backgroundColor: 'rgba(239, 68, 68, 0.15)',
//   },
//   settingBadgeText: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   editButton: {
//     backgroundColor: 'rgba(30, 58, 95, 0.8)',
//     padding: 14,
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(59, 130, 246, 0.3)',
//   },
//   editButtonIcon: {
//     fontSize: 16,
//     marginRight: 8,
//   },
//   editButtonText: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//     fontSize: 15,
//   },

//   // Quick Actions
//   quickActionsGrid: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   quickActionCard: {
//     flex: 1,
//     backgroundColor: 'rgba(17, 24, 39, 0.8)',
//     padding: 18,
//     borderRadius: 14,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(59, 130, 246, 0.2)',
//   },
//   quickActionIconBg: {
//     width: 48,
//     height: 48,
//     borderRadius: 14,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   quickActionIcon: {
//     fontSize: 24,
//   },
//   quickActionText: {
//     color: '#FFFFFF',
//     fontSize: 13,
//     fontWeight: '600',
//   },

//   // Footer
//   securityFooter: {
//     alignItems: 'center',
//     paddingVertical: 16,
//     marginTop: 8,
//   },
//   securityText: {
//     fontSize: 12,
//     color: '#4B5563',
//   },
// });

// export default AgentDashboardScreen;

// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Switch,
//   RefreshControl,
//   ActivityIndicator,
//   Alert,
//   Dimensions,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList, VaultData, isTEEVault, getTEEAddresses } from '../types/navigation';
// import LinearGradient from 'react-native-linear-gradient';
// import api from '../services/api';
// import { 
//   setTradeConfig, 
//   getTradeHistory, 
//   getAllBalances,
//   getSessionToken,
//   TradeHistoryItem,
//   TradeConfig,
// } from '../services/teeSevice';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');

// type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
// type AgentDashboardRouteProp = RouteProp<RootStackParamList, 'AgentDashboard'>;

// // ════════════════════════════════════════════════════════════════════════════
// // TYPES
// // ════════════════════════════════════════════════════════════════════════════

// interface Signal {
//   asset: string;
//   signal: 'BUY' | 'SELL' | 'HOLD';
//   confidence: number;
//   price?: number;
//   indicators: {
//     rsi: number;
//     macd: string;
//     ema_trend: string;
//   };
// }

// interface AgentInfo {
//   agent_id: string;
//   vault_id?: string;
//   name?: string;
//   status?: 'active' | 'paused' | 'stopped';
//   preferences?: {
//     risk_level?: string;
//     riskLevel?: string;
//     trading_pairs?: string[];
//     favoriteTokens?: string[];
//     cross_chain_swaps?: boolean;
//     dark_pool_trading?: boolean;
//     enable_lending?: boolean;
//     maxTradeSize?: number;
//     investmentStyle?: string;
//   };
//   stats?: {
//     trades_executed: number;
//     dark_pool_trades: number;
//     cross_chain_trades?: number;
//     total_pnl: number;
//     win_rate: number;
//   };
//   auto_trade_active?: boolean;
// }

// // ════════════════════════════════════════════════════════════════════════════
// // COLORS
// // ════════════════════════════════════════════════════════════════════════════

// const COLORS = {
//   bgPrimary: '#02111B',
//   bgSecondary: '#061624',
//   bgCard: '#0D2137',
//   accent: '#33E6BF',
//   textPrimary: '#FFFFFF',
//   textSecondary: '#8A9BAE',
//   textMuted: '#5A6B7E',
//   border: 'rgba(42, 82, 152, 0.3)',
//   success: '#22C55E',
//   warning: '#F59E0B',
//   error: '#EF4444',
//   solana: '#9945FF',
//   ethereum: '#627EEA',
// };

// // ════════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ════════════════════════════════════════════════════════════════════════════

// const AgentDashboardScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<AgentDashboardRouteProp>();
//   const { vault, agent: passedAgent } = route.params || {};

//   // ALL HOOKS MUST BE AT THE TOP - before any conditional logic
//   const [agent, setAgent] = useState<AgentInfo | null>(passedAgent as AgentInfo || null);
//   const [signals, setSignals] = useState<Signal[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [autoTradeEnabled, setAutoTradeEnabled] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false);
  
//   // TEE specific state
//   const [teeConfig, setTeeConfig] = useState<TradeConfig | null>(null);
//   const [teeHistory, setTeeHistory] = useState<TradeHistoryItem[]>([]);
//   const [balances, setBalances] = useState({
//     solana: { sol: 0, usdc: 0 },
//     evm: { eth: 0, usdc: 0 },
//   });

//   // Detect TEE wallet - computed values (not hooks)
//   const isTEE = vault ? isTEEVault(vault) : false;
//   const teeAddresses = vault ? getTEEAddresses(vault) : { evm: null, solana: null };
//   const vaultId = vault?.vault_id || vault?.sol?.vault_id || vault?.tee?.uid || '';

//   // ════════════════════════════════════════════════════════════════════════════
//   // FETCH DATA
//   // ════════════════════════════════════════════════════════════════════════════

//   const fetchData = useCallback(async () => {
//     try {
//       if (isTEE) {
//         // TEE Wallet - check if agent was explicitly created (passed from AgentCreating)
//         // Don't auto-create agent - require user to go through setup flow
        
//         if (passedAgent) {
//           // Agent was passed from AgentCreating screen - use it
//           setAgent(passedAgent as AgentInfo);
          
//           // Fetch trade history if we have a session
//           const hasSession = await getSessionToken();
//           if (hasSession) {
//             try {
//               const historyRes = await getTradeHistory();
//               if (historyRes.ok && historyRes.history) {
//                 setTeeHistory(historyRes.history);
//               }
//             } catch (err) {
//               console.log('[TEE] History fetch error:', err);
//             }
//           }
//         }
//         // If no passedAgent, agent stays null → shows empty state

//         // Fetch balances (no auth needed) - always do this
//         if (teeAddresses.solana || teeAddresses.evm) {
//           const bal = await getAllBalances(teeAddresses.solana, teeAddresses.evm);
//           setBalances(bal);
//         }

//       } else {
//         // Non-TEE wallet - use existing API
//         if (!agent && vaultId) {
//           const agentRes = await api.getAgentForVault(vaultId);
//           if (agentRes.success && agentRes.agent) {
//             setAgent(agentRes.agent);
//             setAutoTradeEnabled(agentRes.agent.auto_trade_active || false);
//           }
//         }
//       }

//       // Fetch signals (shared for both) - only if agent exists
//       if (agent || passedAgent) {
//         try {
//           const signalsRes = await api.getSignals();
//           if (signalsRes.success && signalsRes.signals) {
//             setSignals(signalsRes.signals);
//           }
//         } catch (err) {
//           console.log('[Signals] Fetch error:', err);
//         }
//       }
//     } catch (error) {
//       console.error('Failed to fetch agent data:', error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [isTEE, vaultId, teeAddresses.solana, teeAddresses.evm, passedAgent, agent]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchData();
//   };

//   // ════════════════════════════════════════════════════════════════════════════
//   // TOGGLE AUTO-TRADE (TEE)
//   // ════════════════════════════════════════════════════════════════════════════

//   const toggleAutoTrade = async (enabled: boolean) => {
//     setActionLoading(true);
    
//     try {
//       if (isTEE) {
//         // TEE: Use setTradeConfig endpoint
//         const config = await setTradeConfig({
//           tradingEnabled: enabled,
//           maxTradeAmountUsdc: 100, // Default
//           allowedAssets: ['SOL', 'ETH'],
//         });
        
//         if (config.ok) {
//           setAutoTradeEnabled(enabled);
//           setTeeConfig(config.config);
//           Alert.alert(
//             enabled ? '🤖 Trading Enabled!' : '⏸️ Trading Paused',
//             enabled
//               ? 'Your TEE agent will now execute trades based on signals.'
//               : 'Auto-trading has been paused.'
//           );
//         } else {
//           Alert.alert('Error', 'Failed to update trading config');
//         }
//       } else {
//         // Non-TEE: Use existing API
//         let res;
//         if (enabled) {
//           res = await api.startAutoTrading(agent!.agent_id, 240);
//         } else {
//           res = await api.stopAutoTrading(agent!.agent_id);
//         }

//         if (res.success) {
//           setAutoTradeEnabled(enabled);
//           Alert.alert(
//             enabled ? '🤖 Auto-Trading Started!' : '⏸️ Auto-Trading Paused',
//             enabled
//               ? 'Your agent will check signals every 15 minutes.'
//               : 'Auto-trading has been paused.'
//           );
//         } else {
//           Alert.alert('Error', res.error || 'Failed to toggle auto-trade');
//         }
//       }
//     } catch (error: any) {
//       Alert.alert('Error', error.message || 'Failed to toggle auto-trade');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // ════════════════════════════════════════════════════════════════════════════
//   // HELPERS
//   // ════════════════════════════════════════════════════════════════════════════

//   const getSignalColor = (signal: string) => {
//     switch (signal) {
//       case 'BUY': return COLORS.success;
//       case 'SELL': return COLORS.error;
//       default: return COLORS.textMuted;
//     }
//   };

//   const getAssetIcon = (asset: string) => {
//     switch (asset) {
//       case 'SOL': return '◎';
//       case 'ZEC': return 'Z';
//       case 'ETH': return 'Ξ';
//       default: return '●';
//     }
//   };

//   const getAssetColor = (asset: string) => {
//     switch (asset) {
//       case 'SOL': return COLORS.solana;
//       case 'ETH': return COLORS.ethereum;
//       case 'ZEC': return '#F4B728';
//       default: return COLORS.accent;
//     }
//   };

//   const formatAddress = (address: string | null) => {
//     if (!address) return '';
//     return `${address.slice(0, 6)}...${address.slice(-4)}`;
//   };

//   // ════════════════════════════════════════════════════════════════════════════
//   // LOADING STATE
//   // ════════════════════════════════════════════════════════════════════════════

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <LinearGradient colors={['#1E3A5F', '#0F2744', '#02111B']} style={styles.gradient} />
//         <SafeAreaView style={styles.safeArea}>
//           <View style={styles.loadingContainer}>
//             <View style={styles.loaderCircle}>
//               <ActivityIndicator size="large" color={COLORS.accent} />
//             </View>
//             <Text style={styles.loadingText}>Loading agent...</Text>
//           </View>
//         </SafeAreaView>
//       </View>
//     );
//   }

//   // ════════════════════════════════════════════════════════════════════════════
//   // EMPTY STATE - NO AGENT (Both TEE and Non-TEE)
//   // ════════════════════════════════════════════════════════════════════════════

//   if (!agent && !loading) {
//     return (
//       <View style={styles.container}>
//         <LinearGradient colors={['#1E3A5F', '#0F2744', '#02111B']} style={styles.gradient} />
//         <SafeAreaView style={styles.safeArea}>
//           <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
//             {/* Header */}
//             <View style={styles.header}>
//               <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//                 <Text style={styles.backIcon}>←</Text>
//               </TouchableOpacity>
//               <View style={styles.headerCenter}>
//                 <Text style={styles.title}>{isTEE ? '🛡️ TEE Agent' : 'AI Agent'}</Text>
//                 <Text style={styles.subtitle}>{isTEE ? 'Oasis TEE Protected' : 'Automated Trading'}</Text>
//               </View>
//               <View style={styles.headerSpacer} />
//             </View>

//             {/* TEE Wallet Info (show balances even without agent) */}
//             {isTEE && (
//               <View style={styles.teeInfoCard}>
//                 <View style={styles.teeInfoHeader}>
//                   <Text style={styles.teeInfoTitle}>🛡️ TEE Wallet</Text>
//                   <View style={styles.teeBadge}>
//                     <Text style={styles.teeBadgeText}>Secured</Text>
//                   </View>
//                 </View>
                
//                 <View style={styles.teeAddresses}>
//                   <View style={styles.teeAddressRow}>
//                     <View style={[styles.chainDot, { backgroundColor: COLORS.solana }]} />
//                     <Text style={styles.teeAddressLabel}>Solana:</Text>
//                     <Text style={styles.teeAddressValue}>
//                       {formatAddress(teeAddresses.solana)} • {balances.solana.sol.toFixed(4)} SOL
//                     </Text>
//                   </View>
//                   <View style={styles.teeAddressRow}>
//                     <View style={[styles.chainDot, { backgroundColor: COLORS.ethereum }]} />
//                     <Text style={styles.teeAddressLabel}>Base:</Text>
//                     <Text style={styles.teeAddressValue}>
//                       {formatAddress(teeAddresses.evm)} • {balances.evm.eth.toFixed(4)} ETH
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//             )}

//             {/* Empty State */}
//             <View style={styles.emptyState}>
//               <View style={styles.emptyIconContainer}>
//                 <Text style={styles.emptyEmoji}>🤖</Text>
//               </View>
//               <Text style={styles.emptyTitle}>No AI Agent Yet</Text>
//               <Text style={styles.emptyDesc}>
//                 {isTEE 
//                   ? 'Create an AI trading agent to automatically execute secure trades using your TEE wallet.'
//                   : 'Create an AI trading agent to automatically execute trades based on signals.'
//                 }
//               </Text>

//               <TouchableOpacity
//                 style={styles.createButton}
//                 onPress={() => vault && navigation.navigate('AgentSetup', { vault })}
//               >
//                 <Text style={styles.createButtonText}>Create AI Agent</Text>
//               </TouchableOpacity>
//             </View>

//             {/* Features */}
//             <View style={styles.featuresSection}>
//               <Text style={styles.sectionTitle}>What Your Agent Can Do</Text>

//               <View style={styles.featureCard}>
//                 <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(51, 230, 191, 0.15)' }]}>
//                   <Text style={styles.featureIcon}>{isTEE ? '🛡️' : '🏊'}</Text>
//                 </View>
//                 <View style={styles.featureInfo}>
//                   <Text style={styles.featureTitle}>{isTEE ? 'TEE Protected Trading' : 'Dark Pool Trading'}</Text>
//                   <Text style={styles.featureDesc}>
//                     {isTEE ? 'Execute trades securely in Oasis TEE' : 'Execute trades with MEV protection'}
//                   </Text>
//                 </View>
//               </View>

//               <View style={styles.featureCard}>
//                 <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(153, 69, 255, 0.15)' }]}>
//                   <Text style={styles.featureIcon}>📊</Text>
//                 </View>
//                 <View style={styles.featureInfo}>
//                   <Text style={styles.featureTitle}>Trading Signals</Text>
//                   <Text style={styles.featureDesc}>Auto-trade based on AI market analysis</Text>
//                 </View>
//               </View>

//               <View style={styles.featureCard}>
//                 <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(244, 183, 40, 0.15)' }]}>
//                   <Text style={styles.featureIcon}>🔄</Text>
//                 </View>
//                 <View style={styles.featureInfo}>
//                   <Text style={styles.featureTitle}>{isTEE ? 'Multi-Chain' : 'Cross-Chain Swaps'}</Text>
//                   <Text style={styles.featureDesc}>
//                     {isTEE ? 'Trade on Solana & Base networks' : 'Trade SOL ↔ ZEC via NEAR Intents'}
//                   </Text>
//                 </View>
//               </View>
//             </View>

//             {/* Footer */}
//             <View style={styles.footer}>
//               <Text style={styles.footerText}>
//                 {isTEE ? '🛡️ Secured by Oasis TEE' : '◈ Powered by Zynapse • ZkAGI'}
//               </Text>
//             </View>
//           </ScrollView>
//         </SafeAreaView>
//       </View>
//     );
//   }

//   // ════════════════════════════════════════════════════════════════════════════
//   // MAIN DASHBOARD
//   // ════════════════════════════════════════════════════════════════════════════

//   return (
//     <View style={styles.container}>
//       <LinearGradient colors={['#1E3A5F', '#0F2744', '#02111B']} style={styles.gradient} />
//       <SafeAreaView style={styles.safeArea}>
//         <ScrollView
//           refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.scrollContent}
//         >
//           {/* Header */}
//           <View style={styles.header}>
//             <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//               <Text style={styles.backIcon}>←</Text>
//             </TouchableOpacity>
//             <View style={styles.headerCenter}>
//               <Text style={styles.title}>
//                 {isTEE ? '🛡️ TEE Agent' : 'AI Agent'}
//               </Text>
//               <Text style={styles.subtitle}>
//                 {isTEE ? 'Oasis TEE Protected' : 'Automated Trading'}
//               </Text>
//             </View>
//             <View style={styles.headerSpacer} />
//           </View>

//           {/* TEE Wallet Info */}
//           {isTEE && (
//             <View style={styles.teeInfoCard}>
//               <View style={styles.teeInfoHeader}>
//                 <Text style={styles.teeInfoTitle}>🛡️ TEE Wallet</Text>
//                 <View style={styles.teeBadge}>
//                   <Text style={styles.teeBadgeText}>Secured</Text>
//                 </View>
//               </View>
              
//               <View style={styles.teeAddresses}>
//                 <View style={styles.teeAddressRow}>
//                   <View style={[styles.chainDot, { backgroundColor: COLORS.solana }]} />
//                   <Text style={styles.teeAddressLabel}>Solana:</Text>
//                   <Text style={styles.teeAddressValue}>
//                     {formatAddress(teeAddresses.solana)} • {balances.solana.sol.toFixed(4)} SOL
//                   </Text>
//                 </View>
//                 <View style={styles.teeAddressRow}>
//                   <View style={[styles.chainDot, { backgroundColor: COLORS.ethereum }]} />
//                   <Text style={styles.teeAddressLabel}>Base:</Text>
//                   <Text style={styles.teeAddressValue}>
//                     {formatAddress(teeAddresses.evm)} • {balances.evm.eth.toFixed(4)} ETH
//                   </Text>
//                 </View>
//               </View>
//             </View>
//           )}

//           {/* Status Card */}
//           <View style={styles.statusCard}>
//             <View style={styles.statusHeader}>
//               <View style={styles.statusInfo}>
//                 <View style={[styles.statusDot, autoTradeEnabled ? styles.statusActive : styles.statusInactive]} />
//                 <Text style={styles.statusText}>
//                   {autoTradeEnabled ? 'Auto-Trading Active' : 'Manual Mode'}
//                 </Text>
//               </View>
//               {actionLoading ? (
//                 <ActivityIndicator size="small" color={COLORS.accent} />
//               ) : (
//                 <Switch
//                   value={autoTradeEnabled}
//                   onValueChange={toggleAutoTrade}
//                   trackColor={{ false: 'rgba(30, 58, 95, 0.8)', true: 'rgba(51, 230, 191, 0.4)' }}
//                   thumbColor={autoTradeEnabled ? COLORS.accent : COLORS.textMuted}
//                 />
//               )}
//             </View>
//             <Text style={styles.statusSubtext}>
//               {isTEE 
//                 ? (autoTradeEnabled ? 'TEE agent executing trades securely' : 'Enable to start secure trading')
//                 : (autoTradeEnabled ? 'Checking signals every 15 min' : 'Toggle on to start auto-trading')
//               }
//             </Text>
//           </View>

//           {/* Stats */}
//           <View style={styles.statsGrid}>
//             <View style={styles.statCard}>
//               <Text style={styles.statValue}>
//                 {isTEE ? teeHistory.length : (agent?.stats?.trades_executed || 0)}
//               </Text>
//               <Text style={styles.statLabel}>Trades</Text>
//             </View>
//             <View style={styles.statCard}>
//               <Text style={[styles.statValue, { color: (agent?.stats?.total_pnl || 0) >= 0 ? COLORS.success : COLORS.error }]}>
//                 ${(agent?.stats?.total_pnl || 0).toFixed(2)}
//               </Text>
//               <Text style={styles.statLabel}>P&L</Text>
//             </View>
//             <View style={styles.statCard}>
//               <Text style={[styles.statValue, { color: COLORS.accent }]}>
//                 {(agent?.stats?.win_rate || 0).toFixed(0)}%
//               </Text>
//               <Text style={styles.statLabel}>Win Rate</Text>
//             </View>
//             <View style={styles.statCard}>
//               <Text style={styles.statValue}>
//                 {isTEE 
//                   ? teeHistory.filter(t => t.chain === 'solana').length 
//                   : (agent?.stats?.dark_pool_trades || 0)
//                 }
//               </Text>
//               <Text style={styles.statLabel}>Secured</Text>
//             </View>
//           </View>

//           {/* Trade History (TEE) */}
//           {isTEE && teeHistory.length > 0 && (
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>Recent Trades</Text>
//               {teeHistory.slice(0, 5).map((trade, index) => (
//                 <View key={index} style={styles.tradeCard}>
//                   <View style={[styles.tradeIcon, { backgroundColor: getAssetColor(trade.asset) }]}>
//                     <Text style={styles.tradeIconText}>{getAssetIcon(trade.asset)}</Text>
//                   </View>
//                   <View style={styles.tradeInfo}>
//                     <Text style={styles.tradeAsset}>{trade.asset}</Text>
//                     <Text style={styles.tradeTime}>
//                       {new Date(trade.timestamp).toLocaleDateString()}
//                     </Text>
//                   </View>
//                   <View style={styles.tradeRight}>
//                     <View style={[styles.tradeBadge, { backgroundColor: getSignalColor(trade.signal) + '20' }]}>
//                       <Text style={[styles.tradeBadgeText, { color: getSignalColor(trade.signal) }]}>
//                         {trade.signal}
//                       </Text>
//                     </View>
//                     <Text style={styles.tradeAmount}>{trade.amountIn} {trade.tokenIn}</Text>
//                   </View>
//                 </View>
//               ))}
//             </View>
//           )}

//           {/* Signals */}
//           <View style={styles.section}>
//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionTitle}>Trading Signals</Text>
//               <TouchableOpacity onPress={fetchData}>
//                 <Text style={styles.refreshLink}>Refresh</Text>
//               </TouchableOpacity>
//             </View>
            
//             {signals.length > 0 ? (
//               signals.map((signal, index) => (
//                 <View key={index} style={styles.signalCard}>
//                   <View style={styles.signalLeft}>
//                     <View style={[styles.signalAssetIcon, { backgroundColor: getAssetColor(signal.asset) }]}>
//                       <Text style={styles.signalAssetIconText}>{getAssetIcon(signal.asset)}</Text>
//                     </View>
//                     <View style={styles.signalAssetInfo}>
//                       <Text style={styles.signalAsset}>{signal.asset}</Text>
//                       <Text style={styles.signalPrice}>
//                         ${signal.price?.toFixed(2) || '0.00'}
//                       </Text>
//                     </View>
//                   </View>
                  
//                   <View style={styles.signalCenter}>
//                     <View style={styles.indicatorRow}>
//                       <Text style={styles.indicatorLabel}>RSI</Text>
//                       <Text style={styles.indicatorValue}>{signal.indicators.rsi}</Text>
//                     </View>
//                     <View style={styles.indicatorRow}>
//                       <Text style={styles.indicatorLabel}>MACD</Text>
//                       <Text style={styles.indicatorValue}>{signal.indicators.macd}</Text>
//                     </View>
//                   </View>
                  
//                   <View style={styles.signalRight}>
//                     <View style={[styles.signalBadge, { backgroundColor: getSignalColor(signal.signal) + '20' }]}>
//                       <Text style={[styles.signalBadgeText, { color: getSignalColor(signal.signal) }]}>
//                         {signal.signal}
//                       </Text>
//                     </View>
//                     <Text style={styles.signalConfidence}>{signal.confidence}% conf</Text>
//                   </View>
//                 </View>
//               ))
//             ) : (
//               <View style={styles.emptySignals}>
//                 <Text style={styles.emptySignalsEmoji}>📊</Text>
//                 <Text style={styles.emptySignalsText}>Loading signals...</Text>
//               </View>
//             )}
//           </View>

//           {/* Agent Settings */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>
//               {isTEE ? 'Trade Config' : 'Agent Settings'}
//             </Text>
//             <View style={styles.settingsCard}>
//               {isTEE ? (
//                 <>
//                   <View style={styles.settingRow}>
//                     <Text style={styles.settingLabel}>Trading</Text>
//                     <View style={[styles.settingBadge, autoTradeEnabled ? styles.settingBadgeActive : styles.settingBadgeInactive]}>
//                       <Text style={[styles.settingBadgeText, { color: autoTradeEnabled ? COLORS.success : COLORS.error }]}>
//                         {autoTradeEnabled ? 'Enabled' : 'Disabled'}
//                       </Text>
//                     </View>
//                   </View>
//                   <View style={styles.settingDivider} />
//                   <View style={styles.settingRow}>
//                     <Text style={styles.settingLabel}>Max Trade (USDC)</Text>
//                     <Text style={styles.settingValue}>$100</Text>
//                   </View>
//                   <View style={styles.settingDivider} />
//                   <View style={styles.settingRow}>
//                     <Text style={styles.settingLabel}>Allowed Assets</Text>
//                     <Text style={styles.settingValue}>SOL, ETH</Text>
//                   </View>
//                   <View style={styles.settingDivider} />
//                   <View style={styles.settingRow}>
//                     <Text style={styles.settingLabel}>Security</Text>
//                     <Text style={[styles.settingValue, { color: COLORS.accent }]}>🛡️ Oasis TEE</Text>
//                   </View>
//                 </>
//               ) : (
//                 <>
//                   <View style={styles.settingRow}>
//                     <Text style={styles.settingLabel}>Risk Level</Text>
//                     <Text style={styles.settingValue}>
//                       {agent?.preferences?.risk_level || 'moderate'}
//                     </Text>
//                   </View>
//                   <View style={styles.settingDivider} />
//                   <View style={styles.settingRow}>
//                     <Text style={styles.settingLabel}>Trading Pairs</Text>
//                     <Text style={styles.settingValue}>
//                       {agent?.preferences?.trading_pairs?.join(', ') || 'SOL/USDC'}
//                     </Text>
//                   </View>
//                   <View style={styles.settingDivider} />
//                   <View style={styles.settingRow}>
//                     <Text style={styles.settingLabel}>Dark Pool</Text>
//                     <View style={[styles.settingBadge, styles.settingBadgeActive]}>
//                       <Text style={[styles.settingBadgeText, { color: COLORS.success }]}>Enabled</Text>
//                     </View>
//                   </View>
//                 </>
//               )}
//             </View>
            
//             {!isTEE && (
//               <TouchableOpacity
//                 style={styles.editButton}
//                 onPress={() => vault && navigation.navigate('AgentSetup', { vault })}
//               >
//                 <Text style={styles.editButtonIcon}>⚙</Text>
//                 <Text style={styles.editButtonText}>Edit Settings</Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           {/* Quick Actions */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Quick Actions</Text>
//             <View style={styles.quickActionsGrid}>
//               {!isTEE && (
//                 <TouchableOpacity
//                   style={styles.quickActionCard}
//                   onPress={() => navigation.navigate('DarkPool', { vault_id: vaultId, vault })}
//                 >
//                   <View style={[styles.quickActionIconBg, { backgroundColor: 'rgba(51, 230, 191, 0.15)' }]}>
//                     <Text style={styles.quickActionIcon}>🏊</Text>
//                   </View>
//                   <Text style={styles.quickActionText}>Dark Pool</Text>
//                 </TouchableOpacity>
//               )}
              
//               <TouchableOpacity
//                 style={styles.quickActionCard}
//                 onPress={() => vault && navigation.navigate('Send', { vault, chain: isTEE ? 'EVM' : 'SOL' })}
//               >
//                 <View style={[styles.quickActionIconBg, { backgroundColor: 'rgba(153, 69, 255, 0.15)' }]}>
//                   <Text style={styles.quickActionIcon}>↗</Text>
//                 </View>
//                 <Text style={styles.quickActionText}>Send</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity
//                 style={styles.quickActionCard}
//                 onPress={() => vault && navigation.navigate('FundWallet', { vault })}
//               >
//                 <View style={[styles.quickActionIconBg, { backgroundColor: 'rgba(244, 183, 40, 0.15)' }]}>
//                   <Text style={styles.quickActionIcon}>↓</Text>
//                 </View>
//                 <Text style={styles.quickActionText}>Receive</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Footer */}
//           <View style={styles.footer}>
//             <Text style={styles.footerText}>
//               {isTEE ? '🛡️ Secured by Oasis TEE' : '◈ Powered by Zynapse • ZkAGI'}
//             </Text>
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </View>
//   );
// };

// // ════════════════════════════════════════════════════════════════════════════
// // STYLES
// // ════════════════════════════════════════════════════════════════════════════

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.bgPrimary,
//   },
//   safeArea: {
//     flex: 1,
//   },
//   gradient: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 400,
//   },
//   scrollContent: {
//     padding: 20,
//     paddingBottom: 40,
//   },

//   // Loading
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loaderCircle: {
//     width: 80,
//     height: 80,
//     backgroundColor: COLORS.bgCard,
//     borderRadius: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: COLORS.border,
//   },
//   loadingText: {
//     color: COLORS.textMuted,
//     marginTop: 16,
//     fontSize: 15,
//   },

//   // Header
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 24,
//   },
//   backButton: {
//     width: 44,
//     height: 44,
//     backgroundColor: COLORS.bgCard,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   backIcon: {
//     fontSize: 20,
//     color: COLORS.textPrimary,
//   },
//   headerCenter: {
//     alignItems: 'center',
//   },
//   headerSpacer: {
//     width: 44,
//   },
//   title: {
//     color: COLORS.textPrimary,
//     fontSize: 24,
//     fontWeight: '700',
//   },
//   subtitle: {
//     color: COLORS.accent,
//     fontSize: 13,
//     marginTop: 4,
//   },

//   // TEE Info Card
//   teeInfoCard: {
//     backgroundColor: COLORS.bgCard,
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: COLORS.accent,
//   },
//   teeInfoHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   teeInfoTitle: {
//     color: COLORS.textPrimary,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   teeBadge: {
//     backgroundColor: 'rgba(51, 230, 191, 0.15)',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   teeBadgeText: {
//     color: COLORS.accent,
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   teeAddresses: {
//     gap: 8,
//   },
//   teeAddressRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   chainDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginRight: 8,
//   },
//   teeAddressLabel: {
//     color: COLORS.textMuted,
//     fontSize: 13,
//     width: 60,
//   },
//   teeAddressValue: {
//     color: COLORS.textSecondary,
//     fontSize: 13,
//     flex: 1,
//   },

//   // Empty State
//   emptyState: {
//     alignItems: 'center',
//     paddingVertical: 40,
//   },
//   emptyIconContainer: {
//     width: 120,
//     height: 120,
//     backgroundColor: COLORS.bgCard,
//     borderRadius: 60,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: COLORS.border,
//     marginBottom: 24,
//   },
//   emptyEmoji: {
//     fontSize: 56,
//   },
//   emptyTitle: {
//     color: COLORS.textPrimary,
//     fontSize: 24,
//     fontWeight: '700',
//     marginBottom: 12,
//   },
//   emptyDesc: {
//     color: COLORS.textSecondary,
//     fontSize: 15,
//     textAlign: 'center',
//     lineHeight: 24,
//     marginBottom: 28,
//     paddingHorizontal: 20,
//   },
//   createButton: {
//     backgroundColor: COLORS.accent,
//     paddingHorizontal: 40,
//     paddingVertical: 16,
//     borderRadius: 14,
//   },
//   createButtonText: {
//     color: COLORS.bgPrimary,
//     fontSize: 18,
//     fontWeight: '700',
//   },

//   // Status Card
//   statusCard: {
//     backgroundColor: COLORS.bgCard,
//     padding: 18,
//     borderRadius: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   statusHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   statusInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   statusDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     marginRight: 10,
//   },
//   statusActive: {
//     backgroundColor: COLORS.success,
//   },
//   statusInactive: {
//     backgroundColor: COLORS.textMuted,
//   },
//   statusText: {
//     color: COLORS.textPrimary,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   statusSubtext: {
//     color: COLORS.textMuted,
//     fontSize: 13,
//   },

//   // Stats Grid
//   statsGrid: {
//     flexDirection: 'row',
//     gap: 10,
//     marginBottom: 20,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: COLORS.bgCard,
//     padding: 14,
//     borderRadius: 14,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   statValue: {
//     color: COLORS.textPrimary,
//     fontSize: 20,
//     fontWeight: '700',
//   },
//   statLabel: {
//     color: COLORS.textMuted,
//     fontSize: 11,
//     marginTop: 6,
//     textTransform: 'uppercase',
//   },

//   // Section
//   section: {
//     marginBottom: 24,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     color: COLORS.textPrimary,
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   refreshLink: {
//     color: COLORS.accent,
//     fontSize: 14,
//     fontWeight: '500',
//   },

//   // Features Section
//   featuresSection: {
//     marginTop: 24,
//     marginBottom: 24,
//   },
//   featureCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.bgCard,
//     padding: 16,
//     borderRadius: 14,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   featureIconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 14,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 14,
//   },
//   featureIcon: {
//     fontSize: 24,
//   },
//   featureInfo: {
//     flex: 1,
//   },
//   featureTitle: {
//     color: COLORS.textPrimary,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   featureDesc: {
//     color: COLORS.textMuted,
//     fontSize: 13,
//     marginTop: 4,
//   },

//   // Trade Card (TEE History)
//   tradeCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.bgCard,
//     padding: 14,
//     borderRadius: 14,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   tradeIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   tradeIconText: {
//     color: COLORS.textPrimary,
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   tradeInfo: {
//     flex: 1,
//   },
//   tradeAsset: {
//     color: COLORS.textPrimary,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   tradeTime: {
//     color: COLORS.textMuted,
//     fontSize: 12,
//     marginTop: 2,
//   },
//   tradeRight: {
//     alignItems: 'flex-end',
//   },
//   tradeBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 8,
//     marginBottom: 4,
//   },
//   tradeBadgeText: {
//     fontSize: 12,
//     fontWeight: '700',
//   },
//   tradeAmount: {
//     color: COLORS.textMuted,
//     fontSize: 12,
//   },

//   // Signal Card
//   signalCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.bgCard,
//     padding: 14,
//     borderRadius: 14,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   signalLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   signalAssetIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   signalAssetIconText: {
//     color: COLORS.textPrimary,
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   signalAssetInfo: {},
//   signalAsset: {
//     color: COLORS.textPrimary,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   signalPrice: {
//     color: COLORS.textMuted,
//     fontSize: 13,
//     marginTop: 2,
//   },
//   signalCenter: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   indicatorRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 2,
//   },
//   indicatorLabel: {
//     color: COLORS.textMuted,
//     fontSize: 11,
//     width: 40,
//   },
//   indicatorValue: {
//     color: COLORS.textSecondary,
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   signalRight: {
//     alignItems: 'flex-end',
//   },
//   signalBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 10,
//     marginBottom: 6,
//   },
//   signalBadgeText: {
//     fontSize: 12,
//     fontWeight: '700',
//   },
//   signalConfidence: {
//     color: COLORS.textMuted,
//     fontSize: 11,
//   },
//   emptySignals: {
//     backgroundColor: COLORS.bgCard,
//     padding: 32,
//     borderRadius: 16,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   emptySignalsEmoji: {
//     fontSize: 28,
//     marginBottom: 8,
//   },
//   emptySignalsText: {
//     color: COLORS.textMuted,
//     fontSize: 14,
//   },

//   // Settings
//   settingsCard: {
//     backgroundColor: COLORS.bgCard,
//     padding: 16,
//     borderRadius: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   settingRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//   },
//   settingDivider: {
//     height: 1,
//     backgroundColor: COLORS.border,
//   },
//   settingLabel: {
//     color: COLORS.textMuted,
//     fontSize: 14,
//   },
//   settingValue: {
//     color: COLORS.textPrimary,
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   settingBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 8,
//   },
//   settingBadgeActive: {
//     backgroundColor: 'rgba(34, 197, 94, 0.15)',
//   },
//   settingBadgeInactive: {
//     backgroundColor: 'rgba(239, 68, 68, 0.15)',
//   },
//   settingBadgeText: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   editButton: {
//     backgroundColor: COLORS.bgSecondary,
//     padding: 14,
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   editButtonIcon: {
//     fontSize: 16,
//     marginRight: 8,
//   },
//   editButtonText: {
//     color: COLORS.textPrimary,
//     fontWeight: '600',
//     fontSize: 15,
//   },

//   // Quick Actions
//   quickActionsGrid: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   quickActionCard: {
//     flex: 1,
//     backgroundColor: COLORS.bgCard,
//     padding: 18,
//     borderRadius: 14,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   quickActionIconBg: {
//     width: 48,
//     height: 48,
//     borderRadius: 14,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   quickActionIcon: {
//     fontSize: 24,
//   },
//   quickActionText: {
//     color: COLORS.textPrimary,
//     fontSize: 13,
//     fontWeight: '600',
//   },

//   // Footer
//   footer: {
//     alignItems: 'center',
//     paddingVertical: 16,
//     marginTop: 8,
//   },
//   footerText: {
//     fontSize: 12,
//     color: COLORS.textMuted,
//   },
// });

// export default AgentDashboardScreen;

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, VaultData, isTEEVault, getTEEAddresses } from '../types/navigation';
import LinearGradient from 'react-native-linear-gradient';
import api from '../services/api';
import { 
  setTradeConfig, 
  getTradeHistory, 
  getAllBalances,
  getSessionToken,
  TradeHistoryItem,
  TradeConfig,
} from '../services/teeSevice';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type AgentDashboardRouteProp = RouteProp<RootStackParamList, 'AgentDashboard'>;

// ════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════

interface Signal {
  asset: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  price?: number;
  indicators: {
    rsi: number;
    macd: string;
    ema_trend: string;
  };
}

interface AgentInfo {
  agent_id: string;
  vault_id?: string;
  name?: string;
  status?: 'active' | 'paused' | 'stopped';
  preferences?: {
    risk_level?: string;
    riskLevel?: string;
    trading_pairs?: string[];
    favoriteTokens?: string[];
    cross_chain_swaps?: boolean;
    dark_pool_trading?: boolean;
    enable_lending?: boolean;
    maxTradeSize?: number;
    investmentStyle?: string;
  };
  stats?: {
    trades_executed: number;
    dark_pool_trades: number;
    cross_chain_trades?: number;
    total_pnl: number;
    win_rate: number;
  };
  auto_trade_active?: boolean;
}

// ════════════════════════════════════════════════════════════════════════════
// COLORS
// ════════════════════════════════════════════════════════════════════════════

const COLORS = {
  bgPrimary: '#02111B',
  bgSecondary: '#061624',
  bgCard: '#0D2137',
  accent: '#33E6BF',
  textPrimary: '#FFFFFF',
  textSecondary: '#8A9BAE',
  textMuted: '#5A6B7E',
  border: 'rgba(42, 82, 152, 0.3)',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  solana: '#9945FF',
  ethereum: '#627EEA',
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════

const AgentDashboardScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AgentDashboardRouteProp>();
  const { vault, agent: passedAgent } = route.params || {};

  // ALL HOOKS MUST BE AT THE TOP - before any conditional logic
  const [agent, setAgent] = useState<AgentInfo | null>(passedAgent as AgentInfo || null);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoTradeEnabled, setAutoTradeEnabled] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // TEE specific state
  const [teeConfig, setTeeConfig] = useState<TradeConfig | null>(null);
  const [teeHistory, setTeeHistory] = useState<TradeHistoryItem[]>([]);
  const [balances, setBalances] = useState({
    solana: { sol: 0, usdc: 0 },
    evm: { eth: 0, usdc: 0 },
  });

  // Detect TEE wallet - computed values (not hooks)
  const isTEE = vault ? isTEEVault(vault) : false;
  const teeAddresses = vault ? getTEEAddresses(vault) : { evm: null, solana: null };
  const vaultId = vault?.vault_id || vault?.sol?.vault_id || vault?.tee?.uid || '';

  // ════════════════════════════════════════════════════════════════════════════
  // FETCH DATA
  // ════════════════════════════════════════════════════════════════════════════

  const fetchData = useCallback(async () => {
    try {
      if (isTEE) {
        // TEE Wallet - check if agent was explicitly created (passed from AgentCreating)
        // Don't auto-create agent - require user to go through setup flow
        
        if (passedAgent) {
          // Agent was passed from AgentCreating screen - use it
          setAgent(passedAgent as AgentInfo);
          
          // Fetch trade history if we have a session
          const hasSession = await getSessionToken();
          if (hasSession) {
            try {
              const historyRes = await getTradeHistory();
              if (historyRes.ok && historyRes.history) {
                setTeeHistory(historyRes.history);
              }
            } catch (err) {
              console.log('[TEE] History fetch error:', err);
            }
          }
        }
        // If no passedAgent, agent stays null → shows empty state

        // Fetch balances (no auth needed) - always do this
        if (teeAddresses.solana || teeAddresses.evm) {
          const bal = await getAllBalances(teeAddresses.solana, teeAddresses.evm);
          setBalances(bal);
        }

      } else {
        // Non-TEE wallet - use existing API
        if (!agent && vaultId) {
          const agentRes = await api.getAgentForVault(vaultId);
          if (agentRes.success && agentRes.agent) {
            setAgent(agentRes.agent);
            setAutoTradeEnabled(agentRes.agent.auto_trade_active || false);
          }
        }
      }

      // Fetch signals (shared for both) - only if agent exists
      if (agent || passedAgent) {
        try {
          const signalsRes = await api.getSignals();
          if (signalsRes.success && signalsRes.signals && signalsRes.signals.length > 0) {
            if (isTEE) {
              // TEE wallets - filter to show only ETH and SOL (not ZEC)
              const teeAssets = ['ETH', 'SOL'];
              const filteredSignals = signalsRes.signals.filter(
                (s: Signal) => teeAssets.includes(s.asset)
              );
              
              // If API doesn't have ETH/SOL, add them with data from API
              if (!filteredSignals.find((s: Signal) => s.asset === 'ETH')) {
                filteredSignals.unshift({
                  asset: 'ETH',
                  signal: 'HOLD',
                  confidence: 55,
                  price: 2950,
                  indicators: { rsi: 50, macd: 'neutral', ema_trend: 'sideways' },
                });
              }
              if (!filteredSignals.find((s: Signal) => s.asset === 'SOL')) {
                // Use SOL data from API if available
                const solSignal = signalsRes.signals.find((s: Signal) => s.asset === 'SOL');
                if (solSignal) {
                  filteredSignals.push(solSignal);
                }
              }
              
              setSignals(filteredSignals);
            } else {
              // Non-TEE wallets - show all signals (SOL, ZEC, etc.)
              setSignals(signalsRes.signals);
            }
          }
        } catch (err) {
          console.log('[Signals] Fetch error:', err);
        }
      }
    } catch (error) {
      console.error('Failed to fetch agent data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isTEE, vaultId, teeAddresses.solana, teeAddresses.evm, passedAgent, agent]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // ════════════════════════════════════════════════════════════════════════════
  // TOGGLE AUTO-TRADE (TEE)
  // ════════════════════════════════════════════════════════════════════════════

  const toggleAutoTrade = async (enabled: boolean) => {
    setActionLoading(true);
    
    try {
      if (isTEE) {
        // TEE: Use setTradeConfig endpoint
        const config = await setTradeConfig({
          tradingEnabled: enabled,
          maxTradeAmountUsdc: 100, // Default
          allowedAssets: ['SOL', 'ETH'],
        });
        
        if (config.ok) {
          setAutoTradeEnabled(enabled);
          setTeeConfig(config.config);
          Alert.alert(
            enabled ? '🤖 Trading Enabled!' : '⏸️ Trading Paused',
            enabled
              ? 'Your TEE agent will now execute trades based on signals.'
              : 'Auto-trading has been paused.'
          );
        } else {
          Alert.alert('Error', 'Failed to update trading config');
        }
      } else {
        // Non-TEE: Use existing API
        let res;
        if (enabled) {
          res = await api.startAutoTrading(agent!.agent_id, 240);
        } else {
          res = await api.stopAutoTrading(agent!.agent_id);
        }

        if (res.success) {
          setAutoTradeEnabled(enabled);
          Alert.alert(
            enabled ? '🤖 Auto-Trading Started!' : '⏸️ Auto-Trading Paused',
            enabled
              ? 'Your agent will check signals every 15 minutes.'
              : 'Auto-trading has been paused.'
          );
        } else {
          Alert.alert('Error', res.error || 'Failed to toggle auto-trade');
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to toggle auto-trade');
    } finally {
      setActionLoading(false);
    }
  };

  // ════════════════════════════════════════════════════════════════════════════
  // HELPERS
  // ════════════════════════════════════════════════════════════════════════════

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY': return COLORS.success;
      case 'SELL': return COLORS.error;
      default: return COLORS.textMuted;
    }
  };

  const getAssetIcon = (asset: string) => {
    switch (asset) {
      case 'SOL': return '◎';
      case 'ZEC': return 'Z';
      case 'ETH': return 'Ξ';
      default: return '●';
    }
  };

  const getAssetColor = (asset: string) => {
    switch (asset) {
      case 'SOL': return COLORS.solana;
      case 'ETH': return COLORS.ethereum;
      case 'ZEC': return '#F4B728';
      default: return COLORS.accent;
    }
  };

  const formatAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // ════════════════════════════════════════════════════════════════════════════
  // LOADING STATE
  // ════════════════════════════════════════════════════════════════════════════

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#1E3A5F', '#0F2744', '#02111B']} style={styles.gradient} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <View style={styles.loaderCircle}>
              <ActivityIndicator size="large" color={COLORS.accent} />
            </View>
            <Text style={styles.loadingText}>Loading agent...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // EMPTY STATE - NO AGENT (Both TEE and Non-TEE)
  // ════════════════════════════════════════════════════════════════════════════

  if (!agent && !loading) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#1E3A5F', '#0F2744', '#02111B']} style={styles.gradient} />
        <SafeAreaView style={styles.safeArea}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backIcon}>←</Text>
              </TouchableOpacity>
              <View style={styles.headerCenter}>
                <Text style={styles.title}>{isTEE ? '🛡️ TEE Agent' : 'AI Agent'}</Text>
                <Text style={styles.subtitle}>{isTEE ? 'Oasis TEE Protected' : 'Automated Trading'}</Text>
              </View>
              <View style={styles.headerSpacer} />
            </View>

            {/* TEE Wallet Info (show balances even without agent) */}
            {isTEE && (
              <View style={styles.teeInfoCard}>
                <View style={styles.teeInfoHeader}>
                  <Text style={styles.teeInfoTitle}>🛡️ TEE Wallet</Text>
                  <View style={styles.teeBadge}>
                    <Text style={styles.teeBadgeText}>Secured</Text>
                  </View>
                </View>
                
                <View style={styles.teeAddresses}>
                  <View style={styles.teeAddressRow}>
                    <View style={[styles.chainDot, { backgroundColor: COLORS.solana }]} />
                    <Text style={styles.teeAddressLabel}>Solana:</Text>
                    <Text style={styles.teeAddressValue}>
                      {formatAddress(teeAddresses.solana)} • {balances.solana.sol.toFixed(4)} SOL
                    </Text>
                  </View>
                  <View style={styles.teeAddressRow}>
                    <View style={[styles.chainDot, { backgroundColor: COLORS.ethereum }]} />
                    <Text style={styles.teeAddressLabel}>Base:</Text>
                    <Text style={styles.teeAddressValue}>
                      {formatAddress(teeAddresses.evm)} • {balances.evm.eth.toFixed(4)} ETH
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Empty State */}
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Text style={styles.emptyEmoji}>🤖</Text>
              </View>
              <Text style={styles.emptyTitle}>No AI Agent Yet</Text>
              <Text style={styles.emptyDesc}>
                {isTEE 
                  ? 'Create an AI trading agent to automatically execute secure trades using your TEE wallet.'
                  : 'Create an AI trading agent to automatically execute trades based on signals.'
                }
              </Text>

              <TouchableOpacity
                style={styles.createButton}
                onPress={() => vault && navigation.navigate('AgentSetup', { vault })}
              >
                <Text style={styles.createButtonText}>Create AI Agent</Text>
              </TouchableOpacity>
            </View>

            {/* Features */}
            <View style={styles.featuresSection}>
              <Text style={styles.sectionTitle}>What Your Agent Can Do</Text>

              <View style={styles.featureCard}>
                <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(51, 230, 191, 0.15)' }]}>
                  <Text style={styles.featureIcon}>{isTEE ? '🛡️' : '🏊'}</Text>
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>{isTEE ? 'TEE Protected Trading' : 'Dark Pool Trading'}</Text>
                  <Text style={styles.featureDesc}>
                    {isTEE ? 'Execute trades securely in Oasis TEE' : 'Execute trades with MEV protection'}
                  </Text>
                </View>
              </View>

              <View style={styles.featureCard}>
                <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(153, 69, 255, 0.15)' }]}>
                  <Text style={styles.featureIcon}>📊</Text>
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Trading Signals</Text>
                  <Text style={styles.featureDesc}>Auto-trade based on AI market analysis</Text>
                </View>
              </View>

              <View style={styles.featureCard}>
                <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(244, 183, 40, 0.15)' }]}>
                  <Text style={styles.featureIcon}>🔄</Text>
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>{isTEE ? 'Multi-Chain' : 'Cross-Chain Swaps'}</Text>
                  <Text style={styles.featureDesc}>
                    {isTEE ? 'Trade on Solana & Base networks' : 'Trade SOL ↔ ZEC via NEAR Intents'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {isTEE ? '🛡️ Secured by Oasis TEE' : '◈ Powered by Zynapse • ZkAGI'}
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // MAIN DASHBOARD
  // ════════════════════════════════════════════════════════════════════════════

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1E3A5F', '#0F2744', '#02111B']} style={styles.gradient} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.title}>
                {isTEE ? '🛡️ TEE Agent' : 'AI Agent'}
              </Text>
              <Text style={styles.subtitle}>
                {isTEE ? 'Oasis TEE Protected' : 'Automated Trading'}
              </Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>

          {/* TEE Wallet Info */}
          {isTEE && (
            <View style={styles.teeInfoCard}>
              <View style={styles.teeInfoHeader}>
                <Text style={styles.teeInfoTitle}>🛡️ TEE Wallet</Text>
                <View style={styles.teeBadge}>
                  <Text style={styles.teeBadgeText}>Secured</Text>
                </View>
              </View>
              
              <View style={styles.teeAddresses}>
                <View style={styles.teeAddressRow}>
                  <View style={[styles.chainDot, { backgroundColor: COLORS.solana }]} />
                  <Text style={styles.teeAddressLabel}>Solana:</Text>
                  <Text style={styles.teeAddressValue}>
                    {formatAddress(teeAddresses.solana)} • {balances.solana.sol.toFixed(4)} SOL
                  </Text>
                </View>
                <View style={styles.teeAddressRow}>
                  <View style={[styles.chainDot, { backgroundColor: COLORS.ethereum }]} />
                  <Text style={styles.teeAddressLabel}>Base:</Text>
                  <Text style={styles.teeAddressValue}>
                    {formatAddress(teeAddresses.evm)} • {balances.evm.eth.toFixed(4)} ETH
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Status Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <View style={styles.statusInfo}>
                <View style={[styles.statusDot, autoTradeEnabled ? styles.statusActive : styles.statusInactive]} />
                <Text style={styles.statusText}>
                  {autoTradeEnabled ? 'Auto-Trading Active' : 'Manual Mode'}
                </Text>
              </View>
              {actionLoading ? (
                <ActivityIndicator size="small" color={COLORS.accent} />
              ) : (
                <Switch
                  value={autoTradeEnabled}
                  onValueChange={toggleAutoTrade}
                  trackColor={{ false: 'rgba(30, 58, 95, 0.8)', true: 'rgba(51, 230, 191, 0.4)' }}
                  thumbColor={autoTradeEnabled ? COLORS.accent : COLORS.textMuted}
                />
              )}
            </View>
            <Text style={styles.statusSubtext}>
              {isTEE 
                ? (autoTradeEnabled ? 'TEE agent executing trades securely' : 'Enable to start secure trading')
                : (autoTradeEnabled ? 'Checking signals every 15 min' : 'Toggle on to start auto-trading')
              }
            </Text>
          </View>

          {/* Stats */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {isTEE ? teeHistory.length : (agent?.stats?.trades_executed || 0)}
              </Text>
              <Text style={styles.statLabel}>Trades</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: (agent?.stats?.total_pnl || 0) >= 0 ? COLORS.success : COLORS.error }]}>
                ${(agent?.stats?.total_pnl || 0).toFixed(2)}
              </Text>
              <Text style={styles.statLabel}>P&L</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: COLORS.accent }]}>
                {(agent?.stats?.win_rate || 0).toFixed(0)}%
              </Text>
              <Text style={styles.statLabel}>Win Rate</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {isTEE 
                  ? teeHistory.filter(t => t.chain === 'solana').length 
                  : (agent?.stats?.dark_pool_trades || 0)
                }
              </Text>
              <Text style={styles.statLabel}>Secured</Text>
            </View>
          </View>

          {/* Trade History (TEE) */}
          {isTEE && teeHistory.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Trades</Text>
              {teeHistory.slice(0, 5).map((trade, index) => (
                <View key={index} style={styles.tradeCard}>
                  <View style={[styles.tradeIcon, { backgroundColor: getAssetColor(trade.asset) }]}>
                    <Text style={styles.tradeIconText}>{getAssetIcon(trade.asset)}</Text>
                  </View>
                  <View style={styles.tradeInfo}>
                    <Text style={styles.tradeAsset}>{trade.asset}</Text>
                    <Text style={styles.tradeTime}>
                      {new Date(trade.timestamp).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.tradeRight}>
                    <View style={[styles.tradeBadge, { backgroundColor: getSignalColor(trade.signal) + '20' }]}>
                      <Text style={[styles.tradeBadgeText, { color: getSignalColor(trade.signal) }]}>
                        {trade.signal}
                      </Text>
                    </View>
                    <Text style={styles.tradeAmount}>{trade.amountIn} {trade.tokenIn}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Signals */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Trading Signals</Text>
              <TouchableOpacity onPress={fetchData}>
                <Text style={styles.refreshLink}>Refresh</Text>
              </TouchableOpacity>
            </View>
            
            {signals.length > 0 ? (
              signals.map((signal, index) => (
                <View key={index} style={styles.signalCard}>
                  <View style={styles.signalLeft}>
                    <View style={[styles.signalAssetIcon, { backgroundColor: getAssetColor(signal.asset) }]}>
                      <Text style={styles.signalAssetIconText}>{getAssetIcon(signal.asset)}</Text>
                    </View>
                    <View style={styles.signalAssetInfo}>
                      <Text style={styles.signalAsset}>{signal.asset}</Text>
                      <Text style={styles.signalPrice}>
                        ${signal.price?.toFixed(2) || '0.00'}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.signalCenter}>
                    <View style={styles.indicatorRow}>
                      <Text style={styles.indicatorLabel}>RSI</Text>
                      <Text style={styles.indicatorValue}>{signal.indicators.rsi}</Text>
                    </View>
                    <View style={styles.indicatorRow}>
                      <Text style={styles.indicatorLabel}>MACD</Text>
                      <Text style={styles.indicatorValue}>{signal.indicators.macd}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.signalRight}>
                    <View style={[styles.signalBadge, { backgroundColor: getSignalColor(signal.signal) + '20' }]}>
                      <Text style={[styles.signalBadgeText, { color: getSignalColor(signal.signal) }]}>
                        {signal.signal}
                      </Text>
                    </View>
                    <Text style={styles.signalConfidence}>{signal.confidence}% conf</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptySignals}>
                <Text style={styles.emptySignalsEmoji}>📊</Text>
                <Text style={styles.emptySignalsText}>Loading signals...</Text>
              </View>
            )}
          </View>

          {/* Agent Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {isTEE ? 'Trade Config' : 'Agent Settings'}
            </Text>
            <View style={styles.settingsCard}>
              {isTEE ? (
                <>
                  <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Trading</Text>
                    <View style={[styles.settingBadge, autoTradeEnabled ? styles.settingBadgeActive : styles.settingBadgeInactive]}>
                      <Text style={[styles.settingBadgeText, { color: autoTradeEnabled ? COLORS.success : COLORS.error }]}>
                        {autoTradeEnabled ? 'Enabled' : 'Disabled'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.settingDivider} />
                  <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Max Trade (USDC)</Text>
                    <Text style={styles.settingValue}>$100</Text>
                  </View>
                  <View style={styles.settingDivider} />
                  <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Allowed Assets</Text>
                    <Text style={styles.settingValue}>SOL, ETH</Text>
                  </View>
                  <View style={styles.settingDivider} />
                  <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Security</Text>
                    <Text style={[styles.settingValue, { color: COLORS.accent }]}>🛡️ Oasis TEE</Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Risk Level</Text>
                    <Text style={styles.settingValue}>
                      {agent?.preferences?.risk_level || 'moderate'}
                    </Text>
                  </View>
                  <View style={styles.settingDivider} />
                  <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Trading Pairs</Text>
                    <Text style={styles.settingValue}>
                      {agent?.preferences?.trading_pairs?.join(', ') || 'SOL/USDC'}
                    </Text>
                  </View>
                  <View style={styles.settingDivider} />
                  <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Dark Pool</Text>
                    <View style={[styles.settingBadge, styles.settingBadgeActive]}>
                      <Text style={[styles.settingBadgeText, { color: COLORS.success }]}>Enabled</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
            
            {!isTEE && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => vault && navigation.navigate('AgentSetup', { vault })}
              >
                <Text style={styles.editButtonIcon}>⚙</Text>
                <Text style={styles.editButtonText}>Edit Settings</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {!isTEE && (
                <TouchableOpacity
                  style={styles.quickActionCard}
                  onPress={() => navigation.navigate('DarkPool', { vault_id: vaultId, vault })}
                >
                  <View style={[styles.quickActionIconBg, { backgroundColor: 'rgba(51, 230, 191, 0.15)' }]}>
                    <Text style={styles.quickActionIcon}>🏊</Text>
                  </View>
                  <Text style={styles.quickActionText}>Dark Pool</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => vault && navigation.navigate('Send', { vault, chain: isTEE ? 'EVM' : 'SOL' })}
              >
                <View style={[styles.quickActionIconBg, { backgroundColor: 'rgba(153, 69, 255, 0.15)' }]}>
                  <Text style={styles.quickActionIcon}>↗</Text>
                </View>
                <Text style={styles.quickActionText}>Send</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => vault && navigation.navigate('FundWallet', { vault })}
              >
                <View style={[styles.quickActionIconBg, { backgroundColor: 'rgba(244, 183, 40, 0.15)' }]}>
                  <Text style={styles.quickActionIcon}>↓</Text>
                </View>
                <Text style={styles.quickActionText}>Receive</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isTEE ? '🛡️ Secured by Oasis TEE' : '◈ Powered by Zynapse • ZkAGI'}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  safeArea: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 400,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderCircle: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.bgCard,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  loadingText: {
    color: COLORS.textMuted,
    marginTop: 16,
    fontSize: 15,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backIcon: {
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: COLORS.accent,
    fontSize: 13,
    marginTop: 4,
  },

  // TEE Info Card
  teeInfoCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  teeInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  teeInfoTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  teeBadge: {
    backgroundColor: 'rgba(51, 230, 191, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  teeBadgeText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '600',
  },
  teeAddresses: {
    gap: 8,
  },
  teeAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chainDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  teeAddressLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
    width: 60,
  },
  teeAddressValue: {
    color: COLORS.textSecondary,
    fontSize: 13,
    flex: 1,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    backgroundColor: COLORS.bgCard,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    marginBottom: 24,
  },
  emptyEmoji: {
    fontSize: 56,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyDesc: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  createButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 14,
  },
  createButtonText: {
    color: COLORS.bgPrimary,
    fontSize: 18,
    fontWeight: '700',
  },

  // Status Card
  statusCard: {
    backgroundColor: COLORS.bgCard,
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  statusActive: {
    backgroundColor: COLORS.success,
  },
  statusInactive: {
    backgroundColor: COLORS.textMuted,
  },
  statusText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  statusSubtext: {
    color: COLORS.textMuted,
    fontSize: 13,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 6,
    textTransform: 'uppercase',
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  refreshLink: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '500',
  },

  // Features Section
  featuresSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  featureDesc: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 4,
  },

  // Trade Card (TEE History)
  tradeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tradeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tradeIconText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  tradeInfo: {
    flex: 1,
  },
  tradeAsset: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  tradeTime: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  tradeRight: {
    alignItems: 'flex-end',
  },
  tradeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  tradeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  tradeAmount: {
    color: COLORS.textMuted,
    fontSize: 12,
  },

  // Signal Card
  signalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  signalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  signalAssetIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  signalAssetIconText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  signalAssetInfo: {},
  signalAsset: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  signalPrice: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  signalCenter: {
    flex: 1,
    alignItems: 'center',
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  indicatorLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    width: 40,
  },
  indicatorValue: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  signalRight: {
    alignItems: 'flex-end',
  },
  signalBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 6,
  },
  signalBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  signalConfidence: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  emptySignals: {
    backgroundColor: COLORS.bgCard,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptySignalsEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  emptySignalsText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },

  // Settings
  settingsCard: {
    backgroundColor: COLORS.bgCard,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  settingLabel: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  settingValue: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  settingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  settingBadgeActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  settingBadgeInactive: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  settingBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: COLORS.bgSecondary,
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  editButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  editButtonText: {
    color: COLORS.textPrimary,
    fontWeight: '600',
    fontSize: 15,
  },

  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickActionIconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionIcon: {
    fontSize: 24,
  },
  quickActionText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});

export default AgentDashboardScreen;