// /**
//  * LendingScreen.tsx - FIXED FOR TYPESCRIPT
//  * 
//  * Private lending with Arcium encrypted positions
//  * Uses useRoute/useNavigation instead of Props interface
//  * 
//  * Location: ~/Developer/ZkAGI/zypherpunk/PawPad/src/screens/LendingScreen.tsx
//  */

// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   RefreshControl,
//   ActivityIndicator,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../types/navigation';
// import api from '../services/api';

// type LendingRouteProp = RouteProp<RootStackParamList, 'Lending'>;
// type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// interface LendingPosition {
//   loan_id: string;
//   health_factor: number;
//   ltv: string;
//   status: 'HEALTHY' | 'AT_RISK' | 'LIQUIDATABLE';
//   collateral: Record<string, { amount: number; valueUsd?: number }>;
//   borrowed: Record<string, { amount: number; valueUsd?: number }>;
// }

// interface PoolInfo {
//   maxLTV: number;
//   liquidationLTV: number;
//   currentInterestRate: number;
//   utilizationRate: string;
//   totalValueLocked: number;
//   totalBorrowed: number;
//   activeLoans: number;
// }

// const LendingScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<LendingRouteProp>();
//   const { vault_id, vault } = route.params;

//   const [poolInfo, setPoolInfo] = useState<PoolInfo | null>(null);
//   const [position, setPosition] = useState<LendingPosition | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [activeTab, setActiveTab] = useState<'deposit' | 'borrow' | 'position'>('position');

//   // Form states
//   const [depositAsset, setDepositAsset] = useState('SOL');
//   const [depositAmount, setDepositAmount] = useState('');
//   const [borrowAsset, setBorrowAsset] = useState('USDC');
//   const [borrowAmount, setBorrowAmount] = useState('');
//   const [actionLoading, setActionLoading] = useState(false);

//   // Fetch data
//   const fetchData = useCallback(async () => {
//     try {
//       // Get pool info
//       const poolRes = await api.getLendingPool();
//       if (poolRes.success) {
//         setPoolInfo(poolRes.pool);
//       }

//       // Get user position
//       const posRes = await api.getLendingPosition(vault_id);
//       if (posRes.success && posRes.position) {
//         setPosition(posRes.position);
//       } else {
//         setPosition(null);
//       }
//     } catch (error: any) {
//       console.error('Lending fetch error:', error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [vault_id]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchData();
//   };

//   // Actions
//   const handleDeposit = async () => {
//     if (!depositAmount || parseFloat(depositAmount) <= 0) {
//       Alert.alert('Error', 'Enter a valid amount');
//       return;
//     }

//     setActionLoading(true);
//     try {
//       const res = await api.depositCollateral(vault_id, depositAsset, depositAmount);

//       if (res.success) {
//         Alert.alert(
//           '✅ Collateral Deposited!',
//           `Deposited ${depositAmount} ${depositAsset}\n\nYour collateral is now encrypted in Arcium MXE. No one can see your position!`,
//           [{ text: 'OK', onPress: fetchData }]
//         );
//         setDepositAmount('');
//       } else {
//         Alert.alert('Error', res.error || 'Deposit failed');
//       }
//     } catch (error: any) {
//       Alert.alert('Error', error.message || 'Deposit failed');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleBorrow = async () => {
//     if (!borrowAmount || parseFloat(borrowAmount) <= 0) {
//       Alert.alert('Error', 'Enter a valid amount');
//       return;
//     }

//     setActionLoading(true);
//     try {
//       const res = await api.borrow(vault_id, borrowAsset, borrowAmount);

//       if (res.success) {
//         Alert.alert(
//           '✅ Borrow Successful!',
//           `Borrowed ${borrowAmount} ${borrowAsset}\n\nHealth Factor: ${res.health_factor?.toFixed(2) || 'N/A'}\nInterest: ${res.interest_rate || 5.2}% APY`,
//           [{ text: 'OK', onPress: fetchData }]
//         );
//         setBorrowAmount('');
//       } else {
//         Alert.alert('Borrow Denied', res.message || 'Insufficient collateral');
//       }
//     } catch (error: any) {
//       Alert.alert('Error', error.message || 'Borrow failed');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleRepay = async (asset: string, amount: number) => {
//     Alert.alert(
//       'Confirm Repayment',
//       `Repay ${amount} ${asset}?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Repay',
//           onPress: async () => {
//             setActionLoading(true);
//             try {
//               const res = await api.repayLoan(vault_id, asset, amount);

//               if (res.success) {
//                 Alert.alert('✅ Repaid!', `Remaining debt: ${res.remaining_debt || 0} ${asset}`);
//                 fetchData();
//               } else {
//                 Alert.alert('Error', res.error || 'Repay failed');
//               }
//             } catch (error: any) {
//               Alert.alert('Error', error.message || 'Repay failed');
//             } finally {
//               setActionLoading(false);
//             }
//           },
//         },
//       ]
//     );
//   };

//   const handleWithdraw = async (asset: string, amount: number) => {
//     Alert.alert(
//       'Confirm Withdrawal',
//       `Withdraw ${amount} ${asset}?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Withdraw',
//           onPress: async () => {
//             setActionLoading(true);
//             try {
//               const res = await api.withdrawCollateral(vault_id, asset, amount);

//               if (res.success) {
//                 Alert.alert('✅ Withdrawn!', `${amount} ${asset} returned to your wallet`);
//                 fetchData();
//               } else {
//                 Alert.alert('Error', res.error || 'Withdrawal not allowed - check your LTV');
//               }
//             } catch (error: any) {
//               Alert.alert('Error', error.message || 'Withdraw failed');
//             } finally {
//               setActionLoading(false);
//             }
//           },
//         },
//       ]
//     );
//   };

//   // Health factor helpers
//   const getHealthColor = (health: number) => {
//     if (health >= 2) return '#22c55e';
//     if (health >= 1.5) return '#84cc16';
//     if (health >= 1.2) return '#eab308';
//     if (health >= 1) return '#f97316';
//     return '#ef4444';
//   };

//   const getHealthEmoji = (health: number) => {
//     if (health >= 2) return '♥♥♥♥♥';
//     if (health >= 1.5) return '♥♥♥♥';
//     if (health >= 1.2) return '♥♥♥';
//     if (health >= 1) return '♥♥';
//     return '♥';
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#8b5cf6" />
//           <Text style={styles.loadingText}>Loading lending data...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

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
//           <Text style={styles.title}>🏦 Private Lending</Text>
//         </View>

//         {/* Privacy Notice */}
//         <View style={styles.privacyBanner}>
//           <Text style={styles.privacyIcon}>🔒</Text>
//           <Text style={styles.privacyText}>
//             Your position is encrypted in Arcium MXE.{'\n'}
//             Only YOU can see your collateral and health!
//           </Text>
//         </View>

//         {/* Pool Info */}
//         {poolInfo && (
//           <View style={styles.poolCard}>
//             <Text style={styles.poolTitle}>Pool Info (Public)</Text>
//             <View style={styles.poolRow}>
//               <Text style={styles.poolLabel}>Interest Rate:</Text>
//               <Text style={styles.poolValue}>{poolInfo.currentInterestRate}% APY</Text>
//             </View>
//             <View style={styles.poolRow}>
//               <Text style={styles.poolLabel}>Max LTV:</Text>
//               <Text style={styles.poolValue}>{poolInfo.maxLTV}%</Text>
//             </View>
//             <View style={styles.poolRow}>
//               <Text style={styles.poolLabel}>Liquidation LTV:</Text>
//               <Text style={styles.poolValue}>{poolInfo.liquidationLTV}%</Text>
//             </View>
//             <View style={styles.poolRow}>
//               <Text style={styles.poolLabel}>Active Loans:</Text>
//               <Text style={styles.poolValue}>{poolInfo.activeLoans}</Text>
//             </View>
//           </View>
//         )}

//         {/* Tabs */}
//         <View style={styles.tabs}>
//           {(['position', 'deposit', 'borrow'] as const).map((tab) => (
//             <TouchableOpacity
//               key={tab}
//               style={[styles.tab, activeTab === tab && styles.activeTab]}
//               onPress={() => setActiveTab(tab)}
//             >
//               <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
//                 {tab === 'position' ? '📊 Position' : tab === 'deposit' ? '💰 Deposit' : '💳 Borrow'}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Position Tab */}
//         {activeTab === 'position' && (
//           <View style={styles.content}>
//             {position ? (
//               <>
//                 {/* Health Factor */}
//                 <View style={[styles.healthCard, { borderColor: getHealthColor(position.health_factor) }]}>
//                   <Text style={styles.healthTitle}>Health Factor</Text>
//                   <Text style={[styles.healthValue, { color: getHealthColor(position.health_factor) }]}>
//                     {position.health_factor.toFixed(2)}
//                   </Text>
//                   <Text style={styles.healthEmoji}>{getHealthEmoji(position.health_factor)}</Text>
//                   <Text style={styles.healthStatus}>{position.status}</Text>
//                   <Text style={styles.ltvText}>LTV: {position.ltv}%</Text>
//                 </View>

//                 {/* Collateral */}
//                 <View style={styles.section}>
//                   <Text style={styles.sectionTitle}>🔐 Collateral (Private)</Text>
//                   {Object.entries(position.collateral).map(([asset, data]) => (
//                     <View key={asset} style={styles.assetRow}>
//                       <Text style={styles.assetName}>{asset}</Text>
//                       <View style={styles.assetActions}>
//                         <Text style={styles.assetAmount}>{data.amount}</Text>
//                         <TouchableOpacity
//                           style={styles.withdrawButton}
//                           onPress={() => handleWithdraw(asset, data.amount)}
//                         >
//                           <Text style={styles.withdrawButtonText}>Withdraw</Text>
//                         </TouchableOpacity>
//                       </View>
//                     </View>
//                   ))}
//                   {Object.keys(position.collateral).length === 0 && (
//                     <Text style={styles.emptyText}>No collateral deposited</Text>
//                   )}
//                 </View>

//                 {/* Borrowed */}
//                 <View style={styles.section}>
//                   <Text style={styles.sectionTitle}>💳 Borrowed (Private)</Text>
//                   {Object.entries(position.borrowed).map(([asset, data]) => (
//                     <View key={asset} style={styles.assetRow}>
//                       <Text style={styles.assetName}>{asset}</Text>
//                       <View style={styles.assetActions}>
//                         <Text style={styles.assetAmount}>{data.amount}</Text>
//                         <TouchableOpacity
//                           style={styles.repayButton}
//                           onPress={() => handleRepay(asset, data.amount)}
//                         >
//                           <Text style={styles.repayButtonText}>Repay</Text>
//                         </TouchableOpacity>
//                       </View>
//                     </View>
//                   ))}
//                   {Object.keys(position.borrowed).length === 0 && (
//                     <Text style={styles.emptyText}>No active loans</Text>
//                   )}
//                 </View>

//                 {/* Warning */}
//                 {position.health_factor < 1.2 && (
//                   <View style={styles.warningCard}>
//                     <Text style={styles.warningTitle}>⚠️ Position at Risk!</Text>
//                     <Text style={styles.warningText}>
//                       Consider adding collateral or repaying debt to avoid liquidation.
//                     </Text>
//                   </View>
//                 )}
//               </>
//             ) : (
//               <View style={styles.noPosition}>
//                 <Text style={styles.noPositionEmoji}>🏦</Text>
//                 <Text style={styles.noPositionTitle}>No Lending Position</Text>
//                 <Text style={styles.noPositionText}>
//                   Deposit collateral to start borrowing privately
//                 </Text>
//                 <TouchableOpacity
//                   style={styles.startButton}
//                   onPress={() => setActiveTab('deposit')}
//                 >
//                   <Text style={styles.startButtonText}>Deposit Collateral →</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>
//         )}

//         {/* Deposit Tab */}
//         {activeTab === 'deposit' && (
//           <View style={styles.content}>
//             <View style={styles.formCard}>
//               <Text style={styles.formTitle}>Deposit Collateral</Text>

//               <Text style={styles.inputLabel}>Asset</Text>
//               <View style={styles.assetSelector}>
//                 {['SOL', 'ZEC', 'ETH'].map((asset) => (
//                   <TouchableOpacity
//                     key={asset}
//                     style={[styles.assetOption, depositAsset === asset && styles.assetOptionActive]}
//                     onPress={() => setDepositAsset(asset)}
//                   >
//                     <Text style={[styles.assetOptionText, depositAsset === asset && styles.assetOptionTextActive]}>
//                       {asset}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>

//               <Text style={styles.inputLabel}>Amount</Text>
//               <TextInput
//                 style={styles.input}
//                 value={depositAmount}
//                 onChangeText={setDepositAmount}
//                 placeholder="0.00"
//                 placeholderTextColor="#6b7280"
//                 keyboardType="decimal-pad"
//               />

//               <TouchableOpacity
//                 style={[styles.actionButton, actionLoading && styles.actionButtonDisabled]}
//                 onPress={handleDeposit}
//                 disabled={actionLoading}
//               >
//                 {actionLoading ? (
//                   <ActivityIndicator color="#fff" />
//                 ) : (
//                   <Text style={styles.actionButtonText}>🔒 Deposit (Encrypted)</Text>
//                 )}
//               </TouchableOpacity>

//               <Text style={styles.formNote}>
//                 Your collateral amount will be encrypted in Arcium MXE.{'\n'}
//                 No one can see how much you deposited!
//               </Text>
//             </View>
//           </View>
//         )}

//         {/* Borrow Tab */}
//         {activeTab === 'borrow' && (
//           <View style={styles.content}>
//             <View style={styles.formCard}>
//               <Text style={styles.formTitle}>Borrow Against Collateral</Text>

//               <Text style={styles.inputLabel}>Asset to Borrow</Text>
//               <View style={styles.assetSelector}>
//                 {['USDC', 'SOL'].map((asset) => (
//                   <TouchableOpacity
//                     key={asset}
//                     style={[styles.assetOption, borrowAsset === asset && styles.assetOptionActive]}
//                     onPress={() => setBorrowAsset(asset)}
//                   >
//                     <Text style={[styles.assetOptionText, borrowAsset === asset && styles.assetOptionTextActive]}>
//                       {asset}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>

//               <Text style={styles.inputLabel}>Amount</Text>
//               <TextInput
//                 style={styles.input}
//                 value={borrowAmount}
//                 onChangeText={setBorrowAmount}
//                 placeholder="0.00"
//                 placeholderTextColor="#6b7280"
//                 keyboardType="decimal-pad"
//               />

//               {position && (
//                 <View style={styles.borrowInfo}>
//                   <Text style={styles.borrowInfoText}>
//                     Current Health: {position.health_factor.toFixed(2)}
//                   </Text>
//                   <Text style={styles.borrowInfoText}>
//                     Max LTV: {poolInfo?.maxLTV || 75}%
//                   </Text>
//                 </View>
//               )}

//               <TouchableOpacity
//                 style={[styles.actionButton, (actionLoading || !position) && styles.actionButtonDisabled]}
//                 onPress={handleBorrow}
//                 disabled={actionLoading || !position}
//               >
//                 {actionLoading ? (
//                   <ActivityIndicator color="#fff" />
//                 ) : (
//                   <Text style={styles.actionButtonText}>💳 Borrow</Text>
//                 )}
//               </TouchableOpacity>

//               {!position && (
//                 <Text style={styles.formWarning}>
//                   ⚠️ Deposit collateral first before borrowing
//                 </Text>
//               )}

//               <Text style={styles.formNote}>
//                 Your borrow amount and health factor are private.{'\n'}
//                 Only you can see your position!
//               </Text>
//             </View>
//           </View>
//         )}
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
//     color: '#9ca3af',
//     marginTop: 12,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     gap: 12,
//   },
//   backButton: {
//     color: '#8b5cf6',
//     fontSize: 16,
//   },
//   title: {
//     color: '#fff',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   privacyBanner: {
//     backgroundColor: '#1e1b4b',
//     marginHorizontal: 16,
//     padding: 12,
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     borderWidth: 1,
//     borderColor: '#4c1d95',
//   },
//   privacyIcon: {
//     fontSize: 24,
//   },
//   privacyText: {
//     color: '#c4b5fd',
//     fontSize: 12,
//     flex: 1,
//   },
//   poolCard: {
//     backgroundColor: '#1E293B',
//     margin: 16,
//     padding: 16,
//     borderRadius: 12,
//   },
//   poolTitle: {
//     color: '#9ca3af',
//     fontSize: 14,
//     marginBottom: 12,
//   },
//   poolRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   poolLabel: {
//     color: '#6b7280',
//   },
//   poolValue: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   tabs: {
//     flexDirection: 'row',
//     marginHorizontal: 16,
//     gap: 8,
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 8,
//     backgroundColor: '#1E293B',
//     alignItems: 'center',
//   },
//   activeTab: {
//     backgroundColor: '#8b5cf6',
//   },
//   tabText: {
//     color: '#9ca3af',
//     fontSize: 12,
//   },
//   activeTabText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   content: {
//     padding: 16,
//   },
//   healthCard: {
//     backgroundColor: '#1E293B',
//     padding: 20,
//     borderRadius: 16,
//     alignItems: 'center',
//     borderWidth: 2,
//     marginBottom: 16,
//   },
//   healthTitle: {
//     color: '#9ca3af',
//     fontSize: 14,
//     marginBottom: 8,
//   },
//   healthValue: {
//     fontSize: 48,
//     fontWeight: 'bold',
//   },
//   healthEmoji: {
//     fontSize: 24,
//     marginVertical: 8,
//   },
//   healthStatus: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   ltvText: {
//     color: '#6b7280',
//     marginTop: 4,
//   },
//   section: {
//     backgroundColor: '#1E293B',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   assetRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#374151',
//   },
//   assetName: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   assetAmount: {
//     color: '#22c55e',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   assetActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   repayButton: {
//     backgroundColor: '#7c3aed',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//   },
//   repayButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   withdrawButton: {
//     backgroundColor: '#374151',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//   },
//   withdrawButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   emptyText: {
//     color: '#6b7280',
//     textAlign: 'center',
//     paddingVertical: 16,
//   },
//   warningCard: {
//     backgroundColor: '#451a03',
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#f97316',
//   },
//   warningTitle: {
//     color: '#f97316',
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   warningText: {
//     color: '#fed7aa',
//   },
//   noPosition: {
//     alignItems: 'center',
//     padding: 32,
//   },
//   noPositionEmoji: {
//     fontSize: 64,
//     marginBottom: 16,
//   },
//   noPositionTitle: {
//     color: '#fff',
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   noPositionText: {
//     color: '#9ca3af',
//     textAlign: 'center',
//     marginBottom: 24,
//   },
//   startButton: {
//     backgroundColor: '#8b5cf6',
//     paddingHorizontal: 24,
//     paddingVertical: 14,
//     borderRadius: 12,
//   },
//   startButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   formCard: {
//     backgroundColor: '#1E293B',
//     padding: 20,
//     borderRadius: 16,
//   },
//   formTitle: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   inputLabel: {
//     color: '#9ca3af',
//     marginBottom: 8,
//   },
//   assetSelector: {
//     flexDirection: 'row',
//     gap: 8,
//     marginBottom: 16,
//   },
//   assetOption: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 8,
//     backgroundColor: '#374151',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#4B5563',
//   },
//   assetOptionActive: {
//     backgroundColor: '#7c3aed',
//     borderColor: '#8b5cf6',
//   },
//   assetOptionText: {
//     color: '#9ca3af',
//     fontWeight: '600',
//   },
//   assetOptionTextActive: {
//     color: '#fff',
//   },
//   input: {
//     backgroundColor: '#374151',
//     borderRadius: 8,
//     padding: 16,
//     color: '#fff',
//     fontSize: 18,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#4B5563',
//   },
//   borrowInfo: {
//     backgroundColor: '#374151',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   borrowInfoText: {
//     color: '#9ca3af',
//     marginBottom: 4,
//   },
//   actionButton: {
//     backgroundColor: '#8b5cf6',
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   actionButtonDisabled: {
//     opacity: 0.5,
//   },
//   actionButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   formNote: {
//     color: '#6b7280',
//     fontSize: 12,
//     textAlign: 'center',
//     lineHeight: 18,
//   },
//   formWarning: {
//     color: '#f97316',
//     fontSize: 12,
//     textAlign: 'center',
//     marginBottom: 12,
//   },
// });

// export default LendingScreen;

/**
 * LendingScreen.tsx
 * 
 * Private lending with Arcium encrypted positions
 * 
 * Styled with VoltWallet Premium Theme
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import LinearGradient from 'react-native-linear-gradient';
import api from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type LendingRouteProp = RouteProp<RootStackParamList, 'Lending'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface LendingPosition {
  loan_id: string;
  health_factor: number;
  ltv: string;
  status: 'HEALTHY' | 'AT_RISK' | 'LIQUIDATABLE';
  collateral: Record<string, { amount: number; valueUsd?: number }>;
  borrowed: Record<string, { amount: number; valueUsd?: number }>;
}

interface PoolInfo {
  maxLTV: number;
  liquidationLTV: number;
  currentInterestRate: number;
  utilizationRate: string;
  totalValueLocked: number;
  totalBorrowed: number;
  activeLoans: number;
}

const LendingScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<LendingRouteProp>();
  const { vault_id, vault } = route.params;

  const [poolInfo, setPoolInfo] = useState<PoolInfo | null>(null);
  const [position, setPosition] = useState<LendingPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'deposit' | 'borrow' | 'position'>('position');

  // Form states
  const [depositAsset, setDepositAsset] = useState('SOL');
  const [depositAmount, setDepositAmount] = useState('');
  const [borrowAsset, setBorrowAsset] = useState('USDC');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const poolRes = await api.getLendingPool();
      if (poolRes.success) {
        setPoolInfo(poolRes.pool);
      }

      const posRes = await api.getLendingPosition(vault_id);
      if (posRes.success && posRes.position) {
        setPosition(posRes.position);
      } else {
        setPosition(null);
      }
    } catch (error: any) {
      console.error('Lending fetch error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [vault_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Actions
  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      Alert.alert('Error', 'Enter a valid amount');
      return;
    }

    setActionLoading(true);
    try {
      const res = await api.depositCollateral(vault_id, depositAsset, depositAmount);

      if (res.success) {
        Alert.alert(
          '✅ Collateral Deposited!',
          `Deposited ${depositAmount} ${depositAsset}\n\nYour collateral is now encrypted in Arcium MXE. No one can see your position!`,
          [{ text: 'OK', onPress: fetchData }]
        );
        setDepositAmount('');
      } else {
        Alert.alert('Error', res.error || 'Deposit failed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Deposit failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!borrowAmount || parseFloat(borrowAmount) <= 0) {
      Alert.alert('Error', 'Enter a valid amount');
      return;
    }

    setActionLoading(true);
    try {
      const res = await api.borrow(vault_id, borrowAsset, borrowAmount);

      if (res.success) {
        Alert.alert(
          '✅ Borrow Successful!',
          `Borrowed ${borrowAmount} ${borrowAsset}\n\nHealth Factor: ${res.health_factor?.toFixed(2) || 'N/A'}\nInterest: ${res.interest_rate || 5.2}% APY`,
          [{ text: 'OK', onPress: fetchData }]
        );
        setBorrowAmount('');
      } else {
        Alert.alert('Borrow Denied', res.message || 'Insufficient collateral');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Borrow failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRepay = async (asset: string, amount: number) => {
    Alert.alert(
      'Confirm Repayment',
      `Repay ${amount} ${asset}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Repay',
          onPress: async () => {
            setActionLoading(true);
            try {
              const res = await api.repayLoan(vault_id, asset, amount);

              if (res.success) {
                Alert.alert('✅ Repaid!', `Remaining debt: ${res.remaining_debt || 0} ${asset}`);
                fetchData();
              } else {
                Alert.alert('Error', res.error || 'Repay failed');
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Repay failed');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleWithdraw = async (asset: string, amount: number) => {
    Alert.alert(
      'Confirm Withdrawal',
      `Withdraw ${amount} ${asset}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw',
          onPress: async () => {
            setActionLoading(true);
            try {
              const res = await api.withdrawCollateral(vault_id, asset, amount);

              if (res.success) {
                Alert.alert('✅ Withdrawn!', `${amount} ${asset} returned to your wallet`);
                fetchData();
              } else {
                Alert.alert('Error', res.error || 'Withdrawal not allowed - check your LTV');
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Withdraw failed');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  // Health factor helpers
  const getHealthColor = (health: number) => {
    if (health >= 2) return '#22c55e';
    if (health >= 1.5) return '#84cc16';
    if (health >= 1.2) return '#eab308';
    if (health >= 1) return '#f97316';
    return '#ef4444';
  };

  const getHealthHearts = (health: number) => {
    if (health >= 2) return 5;
    if (health >= 1.5) return 4;
    if (health >= 1.2) return 3;
    if (health >= 1) return 2;
    return 1;
  };

  const getAssetIcon = (asset: string) => {
    switch (asset) {
      case 'SOL': return '◎';
      case 'ZEC': return 'Z';
      case 'ETH': return '⟠';
      case 'USDC': return '$';
      default: return '●';
    }
  };

  const getAssetColor = (asset: string) => {
    switch (asset) {
      case 'SOL': return '#9945FF';
      case 'ZEC': return '#F4B728';
      case 'ETH': return '#627EEA';
      case 'USDC': return '#2775CA';
      default: return '#4ECDC4';
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#1E3A5F', '#0F2744', '#0A1628']}
          style={styles.glowGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <View style={styles.loaderCircle}>
              <ActivityIndicator size="large" color="#4ECDC4" />
            </View>
            <Text style={styles.loadingText}>Loading lending data...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1E3A5F', '#0F2744', '#0A1628']}
        style={styles.glowGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4ECDC4" />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.title}>Private Lending</Text>
              <Text style={styles.subtitle}>Encrypted Positions</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>

          {/* Privacy Notice */}
          <View style={styles.privacyBanner}>
            <View style={styles.privacyIconContainer}>
              <Text style={styles.privacyIcon}>🔒</Text>
            </View>
            <View style={styles.privacyContent}>
              <Text style={styles.privacyTitle}>Encrypted in Arcium MXE</Text>
              <Text style={styles.privacyText}>
                Only YOU can see your collateral and health factor!
              </Text>
            </View>
          </View>

          {/* Pool Info */}
          {poolInfo && (
            <View style={styles.poolCard}>
              <View style={styles.poolHeader}>
                <Text style={styles.poolTitle}>Pool Info</Text>
                <View style={styles.poolBadge}>
                  <Text style={styles.poolBadgeText}>Public</Text>
                </View>
              </View>
              
              <View style={styles.poolRow}>
                <Text style={styles.poolLabel}>Interest Rate</Text>
                <Text style={[styles.poolValue, { color: '#4ECDC4' }]}>{poolInfo.currentInterestRate}% APY</Text>
              </View>
              <View style={styles.poolDivider} />
              <View style={styles.poolRow}>
                <Text style={styles.poolLabel}>Max LTV</Text>
                <Text style={styles.poolValue}>{poolInfo.maxLTV}%</Text>
              </View>
              <View style={styles.poolDivider} />
              <View style={styles.poolRow}>
                <Text style={styles.poolLabel}>Liquidation LTV</Text>
                <Text style={[styles.poolValue, { color: '#EF4444' }]}>{poolInfo.liquidationLTV}%</Text>
              </View>
              <View style={styles.poolDivider} />
              <View style={styles.poolRow}>
                <Text style={styles.poolLabel}>Active Loans</Text>
                <Text style={styles.poolValue}>{poolInfo.activeLoans}</Text>
              </View>
            </View>
          )}

          {/* Tabs */}
          <View style={styles.tabs}>
            {(['position', 'deposit', 'borrow'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.7}
              >
                <Text style={styles.tabIcon}>
                  {tab === 'position' ? '📊' : tab === 'deposit' ? '💰' : '💳'}
                </Text>
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Position Tab */}
          {activeTab === 'position' && (
            <View style={styles.content}>
              {position ? (
                <>
                  {/* Health Factor */}
                  <View style={[styles.healthCard, { borderColor: getHealthColor(position.health_factor) }]}>
                    <Text style={styles.healthTitle}>Health Factor</Text>
                    <Text style={[styles.healthValue, { color: getHealthColor(position.health_factor) }]}>
                      {position.health_factor.toFixed(2)}
                    </Text>
                    <View style={styles.healthHearts}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Text 
                          key={i} 
                          style={[
                            styles.healthHeart,
                            { color: i <= getHealthHearts(position.health_factor) 
                              ? getHealthColor(position.health_factor) 
                              : 'rgba(107, 114, 128, 0.3)' 
                            }
                          ]}
                        >
                          ♥
                        </Text>
                      ))}
                    </View>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getHealthColor(position.health_factor) + '20' }
                    ]}>
                      <Text style={[styles.statusBadgeText, { color: getHealthColor(position.health_factor) }]}>
                        {position.status}
                      </Text>
                    </View>
                    <Text style={styles.ltvText}>LTV: {position.ltv}%</Text>
                  </View>

                  {/* Collateral */}
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>Collateral</Text>
                      <View style={styles.privateBadge}>
                        <Text style={styles.privateBadgeText}>🔐 Private</Text>
                      </View>
                    </View>
                    {Object.entries(position.collateral).map(([asset, data]) => (
                      <View key={asset} style={styles.assetRow}>
                        <View style={styles.assetLeft}>
                          <View style={[styles.assetIcon, { backgroundColor: getAssetColor(asset) }]}>
                            <Text style={[
                              styles.assetIconText,
                              asset === 'ZEC' && styles.assetIconTextDark
                            ]}>{getAssetIcon(asset)}</Text>
                          </View>
                          <Text style={styles.assetName}>{asset}</Text>
                        </View>
                        <View style={styles.assetRight}>
                          <Text style={styles.assetAmount}>{data.amount}</Text>
                          <TouchableOpacity
                            style={styles.withdrawButton}
                            onPress={() => handleWithdraw(asset, data.amount)}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.withdrawButtonText}>Withdraw</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                    {Object.keys(position.collateral).length === 0 && (
                      <Text style={styles.emptyText}>No collateral deposited</Text>
                    )}
                  </View>

                  {/* Borrowed */}
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>Borrowed</Text>
                      <View style={styles.privateBadge}>
                        <Text style={styles.privateBadgeText}>🔐 Private</Text>
                      </View>
                    </View>
                    {Object.entries(position.borrowed).map(([asset, data]) => (
                      <View key={asset} style={styles.assetRow}>
                        <View style={styles.assetLeft}>
                          <View style={[styles.assetIcon, { backgroundColor: getAssetColor(asset) }]}>
                            <Text style={styles.assetIconText}>{getAssetIcon(asset)}</Text>
                          </View>
                          <Text style={styles.assetName}>{asset}</Text>
                        </View>
                        <View style={styles.assetRight}>
                          <Text style={[styles.assetAmount, { color: '#EF4444' }]}>-{data.amount}</Text>
                          <TouchableOpacity
                            style={styles.repayButton}
                            onPress={() => handleRepay(asset, data.amount)}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.repayButtonText}>Repay</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                    {Object.keys(position.borrowed).length === 0 && (
                      <Text style={styles.emptyText}>No active loans</Text>
                    )}
                  </View>

                  {/* Warning */}
                  {position.health_factor < 1.2 && (
                    <View style={styles.warningCard}>
                      <View style={styles.warningIconContainer}>
                        <Text style={styles.warningIconText}>⚠</Text>
                      </View>
                      <View style={styles.warningContent}>
                        <Text style={styles.warningTitle}>Position at Risk!</Text>
                        <Text style={styles.warningText}>
                          Consider adding collateral or repaying debt to avoid liquidation.
                        </Text>
                      </View>
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.noPosition}>
                  <View style={styles.noPositionIconContainer}>
                    <Text style={styles.noPositionEmoji}>🏦</Text>
                  </View>
                  <Text style={styles.noPositionTitle}>No Lending Position</Text>
                  <Text style={styles.noPositionText}>
                    Deposit collateral to start borrowing privately
                  </Text>
                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => setActiveTab('deposit')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.startButtonText}>Deposit Collateral →</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Deposit Tab */}
          {activeTab === 'deposit' && (
            <View style={styles.content}>
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>Deposit Collateral</Text>

                <Text style={styles.inputLabel}>ASSET</Text>
                <View style={styles.assetSelector}>
                  {['SOL', 'ZEC', 'ETH'].map((asset) => (
                    <TouchableOpacity
                      key={asset}
                      style={[styles.assetOption, depositAsset === asset && styles.assetOptionActive]}
                      onPress={() => setDepositAsset(asset)}
                      activeOpacity={0.7}
                    >
                      <View style={[
                        styles.assetOptionIcon,
                        depositAsset === asset && { backgroundColor: getAssetColor(asset) }
                      ]}>
                        <Text style={[
                          styles.assetOptionIconText,
                          asset === 'ZEC' && depositAsset === asset && styles.assetIconTextDark
                        ]}>{getAssetIcon(asset)}</Text>
                      </View>
                      <Text style={[styles.assetOptionText, depositAsset === asset && styles.assetOptionTextActive]}>
                        {asset}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.inputLabel}>AMOUNT</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={depositAmount}
                    onChangeText={setDepositAmount}
                    placeholder="0.00"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    keyboardType="decimal-pad"
                  />
                  <View style={styles.inputSuffix}>
                    <Text style={styles.inputSuffixText}>{depositAsset}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.actionButton, actionLoading && styles.actionButtonDisabled]}
                  onPress={handleDeposit}
                  disabled={actionLoading}
                  activeOpacity={0.8}
                >
                  {actionLoading ? (
                    <ActivityIndicator color="#0A1628" />
                  ) : (
                    <Text style={styles.actionButtonText}>🔒 Deposit (Encrypted)</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.formNoteCard}>
                  <Text style={styles.formNote}>
                    Your collateral amount will be encrypted in Arcium MXE.
                    No one can see how much you deposited!
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Borrow Tab */}
          {activeTab === 'borrow' && (
            <View style={styles.content}>
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>Borrow Against Collateral</Text>

                <Text style={styles.inputLabel}>ASSET TO BORROW</Text>
                <View style={styles.assetSelector}>
                  {['USDC', 'SOL'].map((asset) => (
                    <TouchableOpacity
                      key={asset}
                      style={[styles.assetOption, borrowAsset === asset && styles.assetOptionActive]}
                      onPress={() => setBorrowAsset(asset)}
                      activeOpacity={0.7}
                    >
                      <View style={[
                        styles.assetOptionIcon,
                        borrowAsset === asset && { backgroundColor: getAssetColor(asset) }
                      ]}>
                        <Text style={styles.assetOptionIconText}>{getAssetIcon(asset)}</Text>
                      </View>
                      <Text style={[styles.assetOptionText, borrowAsset === asset && styles.assetOptionTextActive]}>
                        {asset}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.inputLabel}>AMOUNT</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={borrowAmount}
                    onChangeText={setBorrowAmount}
                    placeholder="0.00"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    keyboardType="decimal-pad"
                  />
                  <View style={styles.inputSuffix}>
                    <Text style={styles.inputSuffixText}>{borrowAsset}</Text>
                  </View>
                </View>

                {position && (
                  <View style={styles.borrowInfo}>
                    <View style={styles.borrowInfoRow}>
                      <Text style={styles.borrowInfoLabel}>Current Health</Text>
                      <Text style={[styles.borrowInfoValue, { color: getHealthColor(position.health_factor) }]}>
                        {position.health_factor.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.borrowInfoDivider} />
                    <View style={styles.borrowInfoRow}>
                      <Text style={styles.borrowInfoLabel}>Max LTV</Text>
                      <Text style={styles.borrowInfoValue}>{poolInfo?.maxLTV || 75}%</Text>
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.actionButton, (actionLoading || !position) && styles.actionButtonDisabled]}
                  onPress={handleBorrow}
                  disabled={actionLoading || !position}
                  activeOpacity={0.8}
                >
                  {actionLoading ? (
                    <ActivityIndicator color="#0A1628" />
                  ) : (
                    <Text style={styles.actionButtonText}>💳 Borrow</Text>
                  )}
                </TouchableOpacity>

                {!position && (
                  <View style={styles.formWarningCard}>
                    <Text style={styles.formWarningIcon}>⚠</Text>
                    <Text style={styles.formWarning}>Deposit collateral first before borrowing</Text>
                  </View>
                )}

                <View style={styles.formNoteCard}>
                  <Text style={styles.formNote}>
                    Your borrow amount and health factor are private.
                    Only you can see your position!
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>◈ Powered by Arcium MXE • ZkAGI 2025</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
// STYLES - VoltWallet Premium Theme
// ═══════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  safeArea: {
    flex: 1,
  },
  glowGradient: {
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
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(78, 205, 196, 0.3)',
  },
  loadingText: {
    color: '#6B7280',
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
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  backIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: '#4ECDC4',
    fontSize: 13,
    marginTop: 4,
  },

  // Privacy Banner
  privacyBanner: {
    backgroundColor: 'rgba(30, 58, 95, 0.8)',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.4)',
  },
  privacyIconContainer: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  privacyIcon: {
    fontSize: 22,
  },
  privacyContent: {
    flex: 1,
  },
  privacyTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  privacyText: {
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 18,
  },

  // Pool Card
  poolCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  poolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  poolTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  poolBadge: {
    backgroundColor: 'rgba(107, 114, 128, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  poolBadgeText: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '500',
  },
  poolRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  poolDivider: {
    height: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  poolLabel: {
    color: '#6B7280',
    fontSize: 14,
  },
  poolValue: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },

  // Tabs
  tabs: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  activeTab: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    borderColor: '#4ECDC4',
  },
  tabIcon: {
    fontSize: 14,
  },
  tabText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4ECDC4',
    fontWeight: '600',
  },

  // Content
  content: {},

  // Health Card
  healthCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 3,
    marginBottom: 20,
  },
  healthTitle: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 8,
  },
  healthValue: {
    fontSize: 56,
    fontWeight: '700',
  },
  healthHearts: {
    flexDirection: 'row',
    marginVertical: 12,
    gap: 4,
  },
  healthHeart: {
    fontSize: 22,
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ltvText: {
    color: '#6B7280',
    fontSize: 13,
  },

  // Section
  section: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  privateBadge: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  privateBadgeText: {
    color: '#4ECDC4',
    fontSize: 11,
    fontWeight: '500',
  },
  assetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.15)',
  },
  assetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  assetIconText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  assetIconTextDark: {
    color: '#000000',
  },
  assetName: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  assetRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  assetAmount: {
    color: '#22c55e',
    fontWeight: '600',
    fontSize: 16,
  },
  repayButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  repayButtonText: {
    color: '#0A1628',
    fontSize: 14,
    fontWeight: '600',
  },
  withdrawButton: {
    backgroundColor: 'rgba(30, 58, 95, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  withdrawButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 20,
  },

  // Warning Card
  warningCard: {
    backgroundColor: 'rgba(120, 53, 15, 0.8)',
    padding: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  warningIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  warningIconText: {
    fontSize: 20,
    color: '#FCD34D',
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    color: '#FCD34D',
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 4,
  },
  warningText: {
    color: '#FDE68A',
    fontSize: 13,
    lineHeight: 18,
  },

  // No Position
  noPosition: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  noPositionIconContainer: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(78, 205, 196, 0.3)',
  },
  noPositionEmoji: {
    fontSize: 48,
  },
  noPositionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  noPositionText: {
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 28,
    fontSize: 15,
  },
  startButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 14,
  },
  startButtonText: {
    color: '#0A1628',
    fontWeight: '700',
    fontSize: 16,
  },

  // Form Card
  formCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  formTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 24,
  },
  inputLabel: {
    color: '#6B7280',
    marginBottom: 10,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  assetSelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  assetOption: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(30, 58, 95, 0.5)',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  assetOptionActive: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    borderColor: '#4ECDC4',
  },
  assetOptionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  assetOptionIconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  assetOptionText: {
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 13,
  },
  assetOptionTextActive: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 58, 95, 0.5)',
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  input: {
    flex: 1,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
  },
  inputSuffix: {
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  inputSuffixText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  borrowInfo: {
    backgroundColor: 'rgba(30, 58, 95, 0.5)',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  borrowInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  borrowInfoDivider: {
    height: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  borrowInfoLabel: {
    color: '#6B7280',
    fontSize: 14,
  },
  borrowInfoValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#4ECDC4',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: '#0A1628',
    fontSize: 16,
    fontWeight: '700',
  },
  formWarningCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  formWarningIcon: {
    fontSize: 16,
    color: '#F59E0B',
    marginRight: 10,
  },
  formWarning: {
    color: '#F59E0B',
    fontSize: 13,
  },
  formNoteCard: {
    backgroundColor: 'rgba(30, 58, 95, 0.4)',
    padding: 14,
    borderRadius: 10,
  },
  formNote: {
    color: '#6B7280',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#4B5563',
  },
});

export default LendingScreen;