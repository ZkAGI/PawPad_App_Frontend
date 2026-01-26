// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Switch,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList, AgentPreferences, isTEEVault } from '../types/navigation';
// import LinearGradient from 'react-native-linear-gradient';
// import { setTradeConfig, getSessionToken, isLoggedIn, ensureSessionLoaded } from '../services/teeSevice';
// import api from '../services/api';

// type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
// type AgentSetupRouteProp = RouteProp<RootStackParamList, 'AgentSetup'>;

// const COLORS = {
//   bgPrimary: '#02111B',
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

// const AgentSetupScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<AgentSetupRouteProp>();
//   const { vault, agent } = route.params;

//   // Detect TEE wallet
//   const isTEE = vault ? isTEEVault(vault) : false;

//   // Preferences state
//   const [riskLevel, setRiskLevel] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
//   const [tradingPairs, setTradingPairs] = useState<string[]>(
//     agent?.preferences?.favoriteTokens || (isTEE ? ['SOL', 'ETH'] : ['SOL/USDC', 'ZEC/USDC'])
//   );
//   const [darkPoolEnabled, setDarkPoolEnabled] = useState(true);
//   const [crossChainEnabled, setCrossChainEnabled] = useState(true);
//   const [autoRebalancing, setAutoRebalancing] = useState(false);
//   const [lendingProtection, setLendingProtection] = useState(false);
//   const [maxPositionSize, setMaxPositionSize] = useState(100); // USD
//   const [loading, setLoading] = useState(false);

//   const toggleTradingPair = (pair: string) => {
//     if (tradingPairs.includes(pair)) {
//       if (tradingPairs.length > 1) {
//         setTradingPairs(tradingPairs.filter(p => p !== pair));
//       }
//     } else {
//       setTradingPairs([...tradingPairs, pair]);
//     }
//   };

//   const handleCreate = async () => {
//     if (tradingPairs.length === 0) {
//       Alert.alert('Error', 'Select at least one trading asset');
//       return;
//     }

//     if (isTEE) {
//       // ═══════════════════════════════════════════════════════════════
//       // TEE WALLET - Configure trade settings AND save agent to MongoDB
//       // ═══════════════════════════════════════════════════════════════
//       setLoading(true);
      
//       try {
//         // Ensure session is loaded from AsyncStorage
//         await ensureSessionLoaded();
        
//         // Check if we have a session
//         const hasSession = getSessionToken();
//         if (!hasSession) {
//           // Session expired - prompt to login
//           Alert.alert(
//             'Login Required',
//             'Your TEE session has expired. Please login with your authenticator code to configure the agent.',
//             [
//               { text: 'Cancel', style: 'cancel', onPress: () => setLoading(false) },
//               { 
//                 text: 'Go to Login', 
//                 onPress: () => {
//                   setLoading(false);
//                   // Navigate to TEE Login screen
//                   navigation.navigate('TEELogin' as any, { vault });
//                 }
//               },
//             ]
//           );
//           return;
//         }

//         // Call TEE trade config API
//         const tradeConfigResponse = await setTradeConfig({
//           tradingEnabled: true,
//           maxTradeAmountUsdc: maxPositionSize,
//           allowedAssets: tradingPairs,
//         });

//         if (!tradeConfigResponse.ok) {
//           Alert.alert('Error', 'Failed to configure trading settings');
//           return;
//         }

//         // ═══════════════════════════════════════════════════════════════
//         // GET VAULT IDENTIFIER FOR TEE
//         // TEE wallets don't have vault_id, use uid or evm address
//         // ═══════════════════════════════════════════════════════════════
//         const vaultId = vault?.tee?.uid 
//                      || vault?.vault_id 
//                      || vault?.tee?.evm?.address 
//                      || vault?.tee?.solana?.address;
        
//         if (!vaultId) {
//           throw new Error('Could not determine wallet identifier');
//         }
        
//         console.log('[TEE Agent] Using identifier:', vaultId);

//         // Call the SAME API endpoint used for seed/seedless agents
//         const agentResponse = await api.createAgent(vaultId, {
//           risk_level: riskLevel,
//           trading_pairs: tradingPairs,
//           cross_chain_swaps: crossChainEnabled,
//           dark_pool_trading: darkPoolEnabled,
//           max_position_size: maxPositionSize,
//           auto_rebalancing: autoRebalancing,
//           enable_lending: lendingProtection,
//           wallet_type: 'tee', // Mark as TEE wallet agent
//         });

//         if (agentResponse.success || agentResponse.agent) {
//           console.log('[TEE Agent] Saved to MongoDB:', agentResponse.agent?.agent_id);
          
//           const teeAgent = agentResponse.agent || {
//             agent_id: `tee_agent_${Date.now()}`,
//             vault_id: vaultId,
//             name: 'TEE Trading Agent',
//             status: 'active' as const,
//             wallet_type: 'tee',
//             preferences: {
//               riskLevel: riskLevel,
//               investmentStyle: 'automated',
//               favoriteTokens: tradingPairs,
//               maxTradeSize: maxPositionSize,
//             },
//             performance: {
//               totalTrades: 0,
//               successRate: 0,
//               totalProfit: 0,
//             },
//           };

//           Alert.alert(
//             '🛡️ Agent Created!',
//             `Your TEE trading agent is now active and saved.\n\nMax Trade: $${maxPositionSize} USDC\nAssets: ${tradingPairs.join(', ')}`,
//             [
//               {
//                 text: 'Go to Dashboard',
//                 onPress: () => navigation.replace('AgentDashboard', { vault, agent: teeAgent }),
//               },
//             ]
//           );
//         } else {
//           throw new Error(agentResponse.error || 'Failed to save agent to database');
//         }
//       } catch (error: any) {
//         console.error('TEE agent creation error:', error);
//         Alert.alert('Error', error.message || 'Failed to configure agent');
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       // ═══════════════════════════════════════════════════════════════
//       // NON-TEE WALLET - Use existing flow (AgentCreating screen)
//       // ═══════════════════════════════════════════════════════════════
//       const preferences: AgentPreferences = {
//         risk_level: riskLevel,
//         trading_pairs: tradingPairs,
//         cross_chain_swaps: crossChainEnabled,
//         dark_pool_trading: darkPoolEnabled,
//         max_position_size: maxPositionSize,
//         auto_rebalancing: autoRebalancing,
//         enable_lending: lendingProtection,
//       };

//       navigation.navigate('AgentCreating', { vault, preferences });
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <LinearGradient
//         colors={['#1E3A5F', '#0F2744', '#02111B']}
//         style={styles.gradient}
//       />
//       <SafeAreaView style={styles.safeArea}>
//         <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
//           {/* Header */}
//           <View style={styles.header}>
//             <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//               <Text style={styles.backIcon}>←</Text>
//             </TouchableOpacity>
//             <View style={styles.headerCenter}>
//               <Text style={styles.title}>{isTEE ? '🛡️ TEE Agent' : '🤖 AI Agent'}</Text>
//               <Text style={styles.subtitle}>Configure Trading</Text>
//             </View>
//             <View style={styles.headerSpacer} />
//           </View>

//           {/* Intro */}
//           <View style={styles.introCard}>
//             <Text style={styles.introTitle}>Configure Your Agent</Text>
//             <Text style={styles.introText}>
//               {isTEE 
//                 ? 'Your TEE agent will securely execute trades using Oasis TEE protection.'
//                 : 'Your AI agent will automatically trade based on Zynapse signals using MEV-protected execution.'
//               }
//             </Text>
//           </View>

//           {/* Trading Assets (TEE) / Trading Pairs (Non-TEE) */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>💱 {isTEE ? 'Trading Assets' : 'Trading Pairs'}</Text>
//             <Text style={styles.sectionDesc}>
//               {isTEE ? 'Which assets should the agent trade?' : 'Which pairs should the agent trade?'}
//             </Text>
            
//             <View style={styles.pairsGrid}>
//               {isTEE ? (
//                 // TEE assets
//                 <>
//                   <TouchableOpacity
//                     style={[
//                       styles.pairOption,
//                       tradingPairs.includes('SOL') && { ...styles.pairOptionActive, borderColor: COLORS.solana },
//                     ]}
//                     onPress={() => toggleTradingPair('SOL')}
//                   >
//                     <Text style={[styles.pairIcon, { color: COLORS.solana }]}>◎</Text>
//                     <Text style={[styles.pairLabel, tradingPairs.includes('SOL') && styles.pairLabelActive]}>
//                       SOL
//                     </Text>
//                     {tradingPairs.includes('SOL') && (
//                       <Text style={[styles.pairCheck, { color: COLORS.solana }]}>✓</Text>
//                     )}
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[
//                       styles.pairOption,
//                       tradingPairs.includes('ETH') && { ...styles.pairOptionActive, borderColor: COLORS.ethereum },
//                     ]}
//                     onPress={() => toggleTradingPair('ETH')}
//                   >
//                     <Text style={[styles.pairIcon, { color: COLORS.ethereum }]}>Ξ</Text>
//                     <Text style={[styles.pairLabel, tradingPairs.includes('ETH') && styles.pairLabelActive]}>
//                       ETH
//                     </Text>
//                     {tradingPairs.includes('ETH') && (
//                       <Text style={[styles.pairCheck, { color: COLORS.ethereum }]}>✓</Text>
//                     )}
//                   </TouchableOpacity>
//                 </>
//               ) : (
//                 // Non-TEE pairs
//                 <>
//                   <TouchableOpacity
//                     style={[
//                       styles.pairOption,
//                       tradingPairs.includes('SOL/USDC') && { ...styles.pairOptionActive, borderColor: COLORS.solana },
//                     ]}
//                     onPress={() => toggleTradingPair('SOL/USDC')}
//                   >
//                     <Text style={[styles.pairIcon, { color: COLORS.solana }]}>◎</Text>
//                     <Text style={[styles.pairLabel, tradingPairs.includes('SOL/USDC') && styles.pairLabelActive]}>
//                       SOL/USDC
//                     </Text>
//                     {tradingPairs.includes('SOL/USDC') && (
//                       <Text style={[styles.pairCheck, { color: COLORS.solana }]}>✓</Text>
//                     )}
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[
//                       styles.pairOption,
//                       tradingPairs.includes('ZEC/USDC') && { ...styles.pairOptionActive, borderColor: '#F4B728' },
//                     ]}
//                     onPress={() => toggleTradingPair('ZEC/USDC')}
//                   >
//                     <Text style={[styles.pairIcon, { color: '#F4B728' }]}>Z</Text>
//                     <Text style={[styles.pairLabel, tradingPairs.includes('ZEC/USDC') && styles.pairLabelActive]}>
//                       ZEC/USDC
//                     </Text>
//                     {tradingPairs.includes('ZEC/USDC') && (
//                       <Text style={[styles.pairCheck, { color: '#F4B728' }]}>✓</Text>
//                     )}
//                   </TouchableOpacity>
//                 </>
//               )}
//             </View>
//           </View>

//           {/* Risk Level (non-TEE only) */}
//           {!isTEE && (
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>📊 Risk Level</Text>
//               <Text style={styles.sectionDesc}>How aggressive should your agent trade?</Text>
              
//               <View style={styles.riskOptions}>
//                 {(['conservative', 'moderate', 'aggressive'] as const).map((level) => (
//                   <TouchableOpacity
//                     key={level}
//                     style={[
//                       styles.riskOption,
//                       riskLevel === level && styles.riskOptionActive,
//                       riskLevel === level && level === 'conservative' && styles.riskConservative,
//                       riskLevel === level && level === 'moderate' && styles.riskModerate,
//                       riskLevel === level && level === 'aggressive' && styles.riskAggressive,
//                     ]}
//                     onPress={() => setRiskLevel(level)}
//                   >
//                     <Text style={styles.riskIcon}>
//                       {level === 'conservative' ? '🐢' : level === 'moderate' ? '⚖️' : '🚀'}
//                     </Text>
//                     <Text style={[styles.riskLabel, riskLevel === level && styles.riskLabelActive]}>
//                       {level.charAt(0).toUpperCase() + level.slice(1)}
//                     </Text>
//                     <Text style={styles.riskDesc}>
//                       {level === 'conservative' 
//                         ? 'Small positions, high confidence'
//                         : level === 'moderate'
//                         ? 'Balanced risk/reward'
//                         : 'Larger positions, more trades'}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
//           )}

//           {/* Max Trade Size */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>💰 Max Trade Size (USDC)</Text>
//             <Text style={styles.sectionDesc}>Maximum amount per trade</Text>
            
//             <View style={styles.sizeOptions}>
//               {[50, 100, 250, 500].map((size) => (
//                 <TouchableOpacity
//                   key={size}
//                   style={[
//                     styles.sizeOption,
//                     maxPositionSize === size && styles.sizeOptionActive,
//                   ]}
//                   onPress={() => setMaxPositionSize(size)}
//                 >
//                   <Text style={[styles.sizeLabel, maxPositionSize === size && styles.sizeLabelActive]}>
//                     ${size}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>

//           {/* Features (non-TEE only) */}
//           {!isTEE && (
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>⚡ Features</Text>
              
//               <View style={styles.featureRow}>
//                 <View style={styles.featureInfo}>
//                   <Text style={styles.featureIcon}>🏊</Text>
//                   <View style={styles.featureText}>
//                     <Text style={styles.featureTitle}>Dark Pool Trading</Text>
//                     <Text style={styles.featureDesc}>MEV-protected execution</Text>
//                   </View>
//                 </View>
//                 <Switch
//                   value={darkPoolEnabled}
//                   onValueChange={setDarkPoolEnabled}
//                   trackColor={{ false: '#374151', true: COLORS.accent }}
//                   thumbColor={darkPoolEnabled ? '#fff' : '#9CA3AF'}
//                 />
//               </View>

//               <View style={styles.featureRow}>
//                 <View style={styles.featureInfo}>
//                   <Text style={styles.featureIcon}>🔄</Text>
//                   <View style={styles.featureText}>
//                     <Text style={styles.featureTitle}>Cross-Chain Swaps</Text>
//                     <Text style={styles.featureDesc}>Trade between SOL ↔ ZEC</Text>
//                   </View>
//                 </View>
//                 <Switch
//                   value={crossChainEnabled}
//                   onValueChange={setCrossChainEnabled}
//                   trackColor={{ false: '#374151', true: COLORS.accent }}
//                   thumbColor={crossChainEnabled ? '#fff' : '#9CA3AF'}
//                 />
//               </View>

//               <View style={styles.featureRow}>
//                 <View style={styles.featureInfo}>
//                   <Text style={styles.featureIcon}>⚖️</Text>
//                   <View style={styles.featureText}>
//                     <Text style={styles.featureTitle}>Auto Rebalancing</Text>
//                     <Text style={styles.featureDesc}>Maintain target allocation</Text>
//                   </View>
//                 </View>
//                 <Switch
//                   value={autoRebalancing}
//                   onValueChange={setAutoRebalancing}
//                   trackColor={{ false: '#374151', true: COLORS.accent }}
//                   thumbColor={autoRebalancing ? '#fff' : '#9CA3AF'}
//                 />
//               </View>
//             </View>
//           )}

//           {/* TEE Security Info */}
//           {isTEE && (
//             <View style={styles.teeInfoCard}>
//               <Text style={styles.teeInfoTitle}>🛡️ TEE Security</Text>
//               <Text style={styles.teeInfoText}>
//                 Your trades are executed inside Oasis TEE (Trusted Execution Environment), 
//                 ensuring your private keys and trading logic remain secure and private.
//               </Text>
//             </View>
//           )}

//           {/* Summary */}
//           <View style={styles.summaryCard}>
//             <Text style={styles.summaryTitle}>Summary</Text>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Trading:</Text>
//               <Text style={styles.summaryValue}>{tradingPairs.join(', ')}</Text>
//             </View>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Max Trade:</Text>
//               <Text style={styles.summaryValue}>${maxPositionSize} USDC</Text>
//             </View>
//             {!isTEE && (
//               <>
//                 <View style={styles.summaryRow}>
//                   <Text style={styles.summaryLabel}>Risk Level:</Text>
//                   <Text style={styles.summaryValue}>{riskLevel}</Text>
//                 </View>
//                 <View style={styles.summaryRow}>
//                   <Text style={styles.summaryLabel}>Dark Pool:</Text>
//                   <Text style={styles.summaryValue}>{darkPoolEnabled ? '✅ Enabled' : '❌ Off'}</Text>
//                 </View>
//               </>
//             )}
//             {isTEE && (
//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>Security:</Text>
//                 <Text style={[styles.summaryValue, { color: COLORS.accent }]}>🛡️ Oasis TEE</Text>
//               </View>
//             )}
//           </View>

//           {/* Create Button */}
//           <TouchableOpacity 
//             style={[styles.createButton, loading && styles.createButtonDisabled]} 
//             onPress={handleCreate}
//             disabled={loading}
//           >
//             {loading ? (
//               <View style={styles.loadingRow}>
//                 <ActivityIndicator color={COLORS.bgPrimary} size="small" />
//                 <Text style={styles.createButtonText}>  Creating Agent...</Text>
//               </View>
//             ) : (
//               <Text style={styles.createButtonText}>
//                 {isTEE ? '🛡️ Create TEE Agent' : agent ? '💾 Update Agent' : '🚀 Create AI Agent'}
//               </Text>
//             )}
//           </TouchableOpacity>

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

//   // Intro Card
//   introCard: {
//     backgroundColor: COLORS.bgCard,
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 24,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   introTitle: {
//     color: COLORS.textPrimary,
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   introText: {
//     color: COLORS.textSecondary,
//     fontSize: 14,
//     lineHeight: 22,
//   },

//   // Section
//   section: {
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     color: COLORS.textPrimary,
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   sectionDesc: {
//     color: COLORS.textMuted,
//     fontSize: 13,
//     marginBottom: 16,
//   },

//   // Risk Options
//   riskOptions: {
//     gap: 12,
//   },
//   riskOption: {
//     backgroundColor: COLORS.bgCard,
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },
//   riskOptionActive: {
//     borderColor: COLORS.accent,
//   },
//   riskConservative: {
//     borderColor: COLORS.success,
//   },
//   riskModerate: {
//     borderColor: COLORS.warning,
//   },
//   riskAggressive: {
//     borderColor: COLORS.error,
//   },
//   riskIcon: {
//     fontSize: 24,
//     marginBottom: 8,
//   },
//   riskLabel: {
//     color: COLORS.textSecondary,
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   riskLabelActive: {
//     color: COLORS.textPrimary,
//   },
//   riskDesc: {
//     color: COLORS.textMuted,
//     fontSize: 12,
//   },

//   // Pairs Grid
//   pairsGrid: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   pairOption: {
//     flex: 1,
//     backgroundColor: COLORS.bgCard,
//     padding: 20,
//     borderRadius: 12,
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },
//   pairOptionActive: {
//     backgroundColor: 'rgba(51, 230, 191, 0.1)',
//   },
//   pairIcon: {
//     fontSize: 32,
//     marginBottom: 8,
//   },
//   pairLabel: {
//     color: COLORS.textSecondary,
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   pairLabelActive: {
//     color: COLORS.textPrimary,
//   },
//   pairCheck: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },

//   // Size Options
//   sizeOptions: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   sizeOption: {
//     flex: 1,
//     backgroundColor: COLORS.bgCard,
//     paddingVertical: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },
//   sizeOptionActive: {
//     borderColor: COLORS.accent,
//     backgroundColor: 'rgba(51, 230, 191, 0.1)',
//   },
//   sizeLabel: {
//     color: COLORS.textSecondary,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   sizeLabelActive: {
//     color: COLORS.accent,
//   },

//   // Feature Row
//   featureRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: COLORS.bgCard,
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   featureInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   featureIcon: {
//     fontSize: 24,
//     marginRight: 12,
//   },
//   featureText: {
//     flex: 1,
//   },
//   featureTitle: {
//     color: COLORS.textPrimary,
//     fontSize: 15,
//     fontWeight: '600',
//   },
//   featureDesc: {
//     color: COLORS.textMuted,
//     fontSize: 12,
//     marginTop: 2,
//   },

//   // TEE Info Card
//   teeInfoCard: {
//     backgroundColor: 'rgba(51, 230, 191, 0.1)',
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 24,
//     borderWidth: 1,
//     borderColor: COLORS.accent,
//   },
//   teeInfoTitle: {
//     color: COLORS.accent,
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   teeInfoText: {
//     color: COLORS.textSecondary,
//     fontSize: 14,
//     lineHeight: 22,
//   },

//   // Summary Card
//   summaryCard: {
//     backgroundColor: COLORS.bgCard,
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 24,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   summaryTitle: {
//     color: COLORS.textPrimary,
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 16,
//   },
//   summaryRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   summaryLabel: {
//     color: COLORS.textMuted,
//     fontSize: 14,
//   },
//   summaryValue: {
//     color: COLORS.textPrimary,
//     fontSize: 14,
//     fontWeight: '500',
//   },

//   // Create Button
//   createButton: {
//     backgroundColor: COLORS.accent,
//     padding: 18,
//     borderRadius: 14,
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   createButtonDisabled: {
//     opacity: 0.7,
//   },
//   createButtonText: {
//     color: COLORS.bgPrimary,
//     fontSize: 18,
//     fontWeight: '700',
//   },
//   loadingRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   // Footer
//   footer: {
//     alignItems: 'center',
//     paddingVertical: 16,
//   },
//   footerText: {
//     fontSize: 12,
//     color: COLORS.textMuted,
//   },
// });

// export default AgentSetupScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, AgentPreferences, isTEEVault } from '../types/navigation';
import LinearGradient from 'react-native-linear-gradient';
import { setTradeConfig, getSessionToken, isLoggedIn, ensureSessionLoaded } from '../services/teeSevice';
import api from '../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type AgentSetupRouteProp = RouteProp<RootStackParamList, 'AgentSetup'>;

const COLORS = {
  bgPrimary: '#02111B',
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

const AgentSetupScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AgentSetupRouteProp>();
  const { vault, agent } = route.params;

  // Detect TEE wallet
  const isTEE = vault ? isTEEVault(vault) : false;

  // Preferences state
  const [riskLevel, setRiskLevel] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [tradingPairs, setTradingPairs] = useState<string[]>(
    agent?.preferences?.favoriteTokens || (isTEE ? ['SOL', 'ETH'] : ['SOL/USDC', 'ZEC/USDC'])
  );
  const [darkPoolEnabled, setDarkPoolEnabled] = useState(true);
  const [crossChainEnabled, setCrossChainEnabled] = useState(true);
  const [autoRebalancing, setAutoRebalancing] = useState(false);
  const [lendingProtection, setLendingProtection] = useState(false);
  const [maxPositionSize, setMaxPositionSize] = useState(100); // USD
  const [loading, setLoading] = useState(false);
  
  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdAgent, setCreatedAgent] = useState<any>(null);

  const toggleTradingPair = (pair: string) => {
    if (tradingPairs.includes(pair)) {
      if (tradingPairs.length > 1) {
        setTradingPairs(tradingPairs.filter(p => p !== pair));
      }
    } else {
      setTradingPairs([...tradingPairs, pair]);
    }
  };

  const handleCreate = async () => {
    if (tradingPairs.length === 0) {
      Alert.alert('Error', 'Select at least one trading asset');
      return;
    }

    if (isTEE) {
      // ═══════════════════════════════════════════════════════════════
      // TEE WALLET - Configure trade settings AND save agent to MongoDB
      // ═══════════════════════════════════════════════════════════════
      setLoading(true);
      
      try {
        // Ensure session is loaded from AsyncStorage
        await ensureSessionLoaded();
        
        // Check if we have a session
        const hasSession = getSessionToken();
        if (!hasSession) {
          // Session expired - prompt to login
          Alert.alert(
            'Login Required',
            'Your TEE session has expired. Please login with your authenticator code to configure the agent.',
            [
              { text: 'Cancel', style: 'cancel', onPress: () => setLoading(false) },
              { 
                text: 'Go to Login', 
                onPress: () => {
                  setLoading(false);
                  // Navigate to TEE Login screen
                  navigation.navigate('TEELogin' as any, { vault });
                }
              },
            ]
          );
          return;
        }

        // Call TEE trade config API
        const tradeConfigResponse = await setTradeConfig({
          tradingEnabled: true,
          maxTradeAmountUsdc: maxPositionSize,
          allowedAssets: tradingPairs,
        });

        if (!tradeConfigResponse.ok) {
          Alert.alert('Error', 'Failed to configure trading settings');
          return;
        }

        // ═══════════════════════════════════════════════════════════════
        // GET VAULT IDENTIFIER FOR TEE
        // TEE wallets don't have vault_id, use uid or evm address
        // ═══════════════════════════════════════════════════════════════
        const vaultId = vault?.tee?.uid 
                     || vault?.vault_id 
                     || vault?.tee?.evm?.address 
                     || vault?.tee?.solana?.address;
        
        if (!vaultId) {
          throw new Error('Could not determine wallet identifier');
        }
        
        console.log('[TEE Agent] Using identifier:', vaultId);

        // Call the SAME API endpoint used for seed/seedless agents
        const agentResponse = await api.createAgent(vaultId, {
          risk_level: riskLevel,
          trading_pairs: tradingPairs,
          cross_chain_swaps: crossChainEnabled,
          dark_pool_trading: darkPoolEnabled,
          max_position_size: maxPositionSize,
          auto_rebalancing: autoRebalancing,
          enable_lending: lendingProtection,
          wallet_type: 'tee', // Mark as TEE wallet agent
        });

        if (agentResponse.success || agentResponse.agent) {
          console.log('[TEE Agent] Saved to MongoDB:', agentResponse.agent?.agent_id);
          
          const teeAgent = agentResponse.agent || {
            agent_id: `tee_agent_${Date.now()}`,
            vault_id: vaultId,
            name: 'TEE Trading Agent',
            status: 'active' as const,
            wallet_type: 'tee',
            preferences: {
              riskLevel: riskLevel,
              investmentStyle: 'automated',
              favoriteTokens: tradingPairs,
              maxTradeSize: maxPositionSize,
            },
            performance: {
              totalTrades: 0,
              successRate: 0,
              totalProfit: 0,
            },
          };

          // Show themed success modal
          setCreatedAgent(teeAgent);
          setShowSuccessModal(true);
        } else {
          throw new Error(agentResponse.error || 'Failed to save agent to database');
        }
      } catch (error: any) {
        console.error('TEE agent creation error:', error);
        Alert.alert('Error', error.message || 'Failed to configure agent');
      } finally {
        setLoading(false);
      }
    } else {
      // ═══════════════════════════════════════════════════════════════
      // NON-TEE WALLET - Use existing flow (AgentCreating screen)
      // ═══════════════════════════════════════════════════════════════
      const preferences: AgentPreferences = {
        risk_level: riskLevel,
        trading_pairs: tradingPairs,
        cross_chain_swaps: crossChainEnabled,
        dark_pool_trading: darkPoolEnabled,
        max_position_size: maxPositionSize,
        auto_rebalancing: autoRebalancing,
        enable_lending: lendingProtection,
      };

      navigation.navigate('AgentCreating', { vault, preferences });
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1E3A5F', '#0F2744', '#02111B']}
        style={styles.gradient}
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.title}>{isTEE ? '🛡️ TEE Agent' : '🤖 AI Agent'}</Text>
              <Text style={styles.subtitle}>Configure Trading</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>

          {/* Intro */}
          <View style={styles.introCard}>
            <Text style={styles.introTitle}>Configure Your Agent</Text>
            <Text style={styles.introText}>
              {isTEE 
                ? 'Your TEE agent will securely execute trades using Oasis TEE protection.'
                : 'Your AI agent will automatically trade based on Zynapse signals using MEV-protected execution.'
              }
            </Text>
          </View>

          {/* Trading Assets (TEE) / Trading Pairs (Non-TEE) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💱 {isTEE ? 'Trading Assets' : 'Trading Pairs'}</Text>
            <Text style={styles.sectionDesc}>
              {isTEE ? 'Which assets should the agent trade?' : 'Which pairs should the agent trade?'}
            </Text>
            
            <View style={styles.pairsGrid}>
              {isTEE ? (
                // TEE assets
                <>
                  <TouchableOpacity
                    style={[
                      styles.pairOption,
                      tradingPairs.includes('SOL') && { ...styles.pairOptionActive, borderColor: COLORS.solana },
                    ]}
                    onPress={() => toggleTradingPair('SOL')}
                  >
                    <Text style={[styles.pairIcon, { color: COLORS.solana }]}>◎</Text>
                    <Text style={[styles.pairLabel, tradingPairs.includes('SOL') && styles.pairLabelActive]}>
                      SOL
                    </Text>
                    {tradingPairs.includes('SOL') && (
                      <Text style={[styles.pairCheck, { color: COLORS.solana }]}>✓</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.pairOption,
                      tradingPairs.includes('ETH') && { ...styles.pairOptionActive, borderColor: COLORS.ethereum },
                    ]}
                    onPress={() => toggleTradingPair('ETH')}
                  >
                    <Text style={[styles.pairIcon, { color: COLORS.ethereum }]}>Ξ</Text>
                    <Text style={[styles.pairLabel, tradingPairs.includes('ETH') && styles.pairLabelActive]}>
                      ETH
                    </Text>
                    {tradingPairs.includes('ETH') && (
                      <Text style={[styles.pairCheck, { color: COLORS.ethereum }]}>✓</Text>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                // Non-TEE pairs
                <>
                  <TouchableOpacity
                    style={[
                      styles.pairOption,
                      tradingPairs.includes('SOL/USDC') && { ...styles.pairOptionActive, borderColor: COLORS.solana },
                    ]}
                    onPress={() => toggleTradingPair('SOL/USDC')}
                  >
                    <Text style={[styles.pairIcon, { color: COLORS.solana }]}>◎</Text>
                    <Text style={[styles.pairLabel, tradingPairs.includes('SOL/USDC') && styles.pairLabelActive]}>
                      SOL/USDC
                    </Text>
                    {tradingPairs.includes('SOL/USDC') && (
                      <Text style={[styles.pairCheck, { color: COLORS.solana }]}>✓</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.pairOption,
                      tradingPairs.includes('ZEC/USDC') && { ...styles.pairOptionActive, borderColor: '#F4B728' },
                    ]}
                    onPress={() => toggleTradingPair('ZEC/USDC')}
                  >
                    <Text style={[styles.pairIcon, { color: '#F4B728' }]}>Z</Text>
                    <Text style={[styles.pairLabel, tradingPairs.includes('ZEC/USDC') && styles.pairLabelActive]}>
                      ZEC/USDC
                    </Text>
                    {tradingPairs.includes('ZEC/USDC') && (
                      <Text style={[styles.pairCheck, { color: '#F4B728' }]}>✓</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          {/* Risk Level (non-TEE only) */}
          {!isTEE && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📊 Risk Level</Text>
              <Text style={styles.sectionDesc}>How aggressive should your agent trade?</Text>
              
              <View style={styles.riskOptions}>
                {(['conservative', 'moderate', 'aggressive'] as const).map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.riskOption,
                      riskLevel === level && styles.riskOptionActive,
                      riskLevel === level && level === 'conservative' && styles.riskConservative,
                      riskLevel === level && level === 'moderate' && styles.riskModerate,
                      riskLevel === level && level === 'aggressive' && styles.riskAggressive,
                    ]}
                    onPress={() => setRiskLevel(level)}
                  >
                    <Text style={styles.riskIcon}>
                      {level === 'conservative' ? '🐢' : level === 'moderate' ? '⚖️' : '🚀'}
                    </Text>
                    <Text style={[styles.riskLabel, riskLevel === level && styles.riskLabelActive]}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Text>
                    <Text style={styles.riskDesc}>
                      {level === 'conservative' 
                        ? 'Small positions, high confidence'
                        : level === 'moderate'
                        ? 'Balanced risk/reward'
                        : 'Larger positions, more trades'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Max Trade Size */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💰 Max Trade Size (USDC)</Text>
            <Text style={styles.sectionDesc}>Maximum amount per trade</Text>
            
            <View style={styles.sizeOptions}>
              {[50, 100, 250, 500].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeOption,
                    maxPositionSize === size && styles.sizeOptionActive,
                  ]}
                  onPress={() => setMaxPositionSize(size)}
                >
                  <Text style={[styles.sizeLabel, maxPositionSize === size && styles.sizeLabelActive]}>
                    ${size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Features (non-TEE only) */}
          {!isTEE && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⚡ Features</Text>
              
              <View style={styles.featureRow}>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureIcon}>🏊</Text>
                  <View style={styles.featureText}>
                    <Text style={styles.featureTitle}>Dark Pool Trading</Text>
                    <Text style={styles.featureDesc}>MEV-protected execution</Text>
                  </View>
                </View>
                <Switch
                  value={darkPoolEnabled}
                  onValueChange={setDarkPoolEnabled}
                  trackColor={{ false: '#374151', true: COLORS.accent }}
                  thumbColor={darkPoolEnabled ? '#fff' : '#9CA3AF'}
                />
              </View>

              <View style={styles.featureRow}>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureIcon}>🔄</Text>
                  <View style={styles.featureText}>
                    <Text style={styles.featureTitle}>Cross-Chain Swaps</Text>
                    <Text style={styles.featureDesc}>Trade between SOL ↔ ZEC</Text>
                  </View>
                </View>
                <Switch
                  value={crossChainEnabled}
                  onValueChange={setCrossChainEnabled}
                  trackColor={{ false: '#374151', true: COLORS.accent }}
                  thumbColor={crossChainEnabled ? '#fff' : '#9CA3AF'}
                />
              </View>

              <View style={styles.featureRow}>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureIcon}>⚖️</Text>
                  <View style={styles.featureText}>
                    <Text style={styles.featureTitle}>Auto Rebalancing</Text>
                    <Text style={styles.featureDesc}>Maintain target allocation</Text>
                  </View>
                </View>
                <Switch
                  value={autoRebalancing}
                  onValueChange={setAutoRebalancing}
                  trackColor={{ false: '#374151', true: COLORS.accent }}
                  thumbColor={autoRebalancing ? '#fff' : '#9CA3AF'}
                />
              </View>
            </View>
          )}

          {/* TEE Security Info */}
          {isTEE && (
            <View style={styles.teeInfoCard}>
              <Text style={styles.teeInfoTitle}>🛡️ TEE Security</Text>
              <Text style={styles.teeInfoText}>
                Your trades are executed inside Oasis TEE (Trusted Execution Environment), 
                ensuring your private keys and trading logic remain secure and private.
              </Text>
            </View>
          )}

          {/* Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Trading:</Text>
              <Text style={styles.summaryValue}>{tradingPairs.join(', ')}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Max Trade:</Text>
              <Text style={styles.summaryValue}>${maxPositionSize} USDC</Text>
            </View>
            {!isTEE && (
              <>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Risk Level:</Text>
                  <Text style={styles.summaryValue}>{riskLevel}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Dark Pool:</Text>
                  <Text style={styles.summaryValue}>{darkPoolEnabled ? '✅ Enabled' : '❌ Off'}</Text>
                </View>
              </>
            )}
            {isTEE && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Security:</Text>
                <Text style={[styles.summaryValue, { color: COLORS.accent }]}>🛡️ Oasis TEE</Text>
              </View>
            )}
          </View>

          {/* Create Button */}
          <TouchableOpacity 
            style={[styles.createButton, loading && styles.createButtonDisabled]} 
            onPress={handleCreate}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={COLORS.bgPrimary} size="small" />
                <Text style={styles.createButtonText}>  Creating Agent...</Text>
              </View>
            ) : (
              <Text style={styles.createButtonText}>
                {isTEE ? '🛡️ Create TEE Agent' : agent ? '💾 Update Agent' : '🚀 Create AI Agent'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isTEE ? '🛡️ Secured by Oasis TEE' : '◈ Powered by Zynapse • ZkAGI'}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Themed Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalIcon}>🛡️</Text>
            <Text style={styles.modalTitle}>Agent Created!</Text>
            
            <View style={styles.modalInfo}>
              <View style={styles.modalInfoRow}>
                <Text style={styles.modalInfoLabel}>Max Trade</Text>
                <Text style={styles.modalInfoValue}>${maxPositionSize} USDC</Text>
              </View>
              <View style={styles.modalInfoRow}>
                <Text style={styles.modalInfoLabel}>Assets</Text>
                <Text style={styles.modalInfoValue}>{tradingPairs.join(', ')}</Text>
              </View>
            </View>

            <View style={styles.modalWarning}>
              <Text style={styles.modalWarningIcon}>⚡</Text>
              <Text style={styles.modalWarningText}>
                Turn on <Text style={styles.modalHighlight}>Auto Trading</Text> toggle in the dashboard to start automated trading
              </Text>
            </View>

            <View style={styles.modalReminder}>
              <Text style={styles.modalReminderTitle}>💰 Fund Your Wallet</Text>
              <Text style={styles.modalReminderText}>
                • USDC for trading{'\n'}
                • Small SOL for gas (~0.01){'\n'}
                • Small ETH for gas (~0.005)
              </Text>
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.replace('AgentDashboard', { vault, agent: createdAgent });
              }}
            >
              <Text style={styles.modalButtonText}>Go to Dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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

  // Intro Card
  introCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  introTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  introText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionDesc: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginBottom: 16,
  },

  // Risk Options
  riskOptions: {
    gap: 12,
  },
  riskOption: {
    backgroundColor: COLORS.bgCard,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  riskOptionActive: {
    borderColor: COLORS.accent,
  },
  riskConservative: {
    borderColor: COLORS.success,
  },
  riskModerate: {
    borderColor: COLORS.warning,
  },
  riskAggressive: {
    borderColor: COLORS.error,
  },
  riskIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  riskLabel: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  riskLabelActive: {
    color: COLORS.textPrimary,
  },
  riskDesc: {
    color: COLORS.textMuted,
    fontSize: 12,
  },

  // Pairs Grid
  pairsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  pairOption: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  pairOptionActive: {
    backgroundColor: 'rgba(51, 230, 191, 0.1)',
  },
  pairIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  pairLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  pairLabelActive: {
    color: COLORS.textPrimary,
  },
  pairCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Size Options
  sizeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  sizeOption: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sizeOptionActive: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(51, 230, 191, 0.1)',
  },
  sizeLabel: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  sizeLabelActive: {
    color: COLORS.accent,
  },

  // Feature Row
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bgCard,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featureInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  featureDesc: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },

  // TEE Info Card
  teeInfoCard: {
    backgroundColor: 'rgba(51, 230, 191, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  teeInfoTitle: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  teeInfoText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  summaryValue: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },

  // Create Button
  createButton: {
    backgroundColor: COLORS.accent,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    color: COLORS.bgPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  // Themed Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  modalIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalInfo: {
    backgroundColor: 'rgba(51, 230, 191, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  modalInfoLabel: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  modalInfoValue: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  modalWarning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  modalWarningIcon: {
    fontSize: 18,
    marginRight: 10,
    marginTop: 2,
  },
  modalWarningText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  modalHighlight: {
    color: COLORS.accent,
    fontWeight: '700',
  },
  modalReminder: {
    backgroundColor: 'rgba(51, 230, 191, 0.08)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  modalReminderTitle: {
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  modalReminderText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  modalButtonText: {
    color: COLORS.bgPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AgentSetupScreen;