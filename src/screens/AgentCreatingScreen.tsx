// /**
//  * AgentCreatingScreen.tsx - FIXED
//  * 
//  * Shows loading animation while creating AI agent
//  * Then navigates to AgentDashboard
//  */

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   ActivityIndicator,
// } from 'react-native';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList, VaultData, AgentPreferences } from '../types/navigation';
// import api from '../services/api';

// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AgentCreating'>;
// type AgentCreatingRouteProp = RouteProp<RootStackParamList, 'AgentCreating'>;

// const AgentCreatingScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<AgentCreatingRouteProp>();
//   const { vault, preferences } = route.params;
  
//   const [status, setStatus] = useState('Initializing AI Agent...');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     createAgent();
//   }, []);

//   const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

//   const createAgent = async () => {
//     try {
//       setStatus('Connecting to NEAR AI Intents...');
//       await sleep(1000);

//       setStatus('Initializing trading strategies...');
//       await sleep(1000);

//       setStatus('Setting up agent with preferences...');
      
//       const vaultId = vault.vault_id || vault.sol?.vault_id;
      
//       // Create agent via API
//       const response = await api.createAgent(vaultId, {
//         risk_level: preferences.risk_level,
//         trading_pairs: preferences.trading_pairs,
//         cross_chain_swaps: preferences.cross_chain_swaps,
//         dark_pool_trading: preferences.dark_pool_trading,
//         max_position_size: preferences.max_position_size,
//         auto_rebalancing: preferences.auto_rebalancing,
//         enable_lending: preferences.enable_lending,
//       });

//       if (response.success || response.agent) {
//         setStatus('Agent created successfully!');
        
//         // Create agent object from response
//         const agent = response.agent || {
//           agent_id: `agent_${Date.now()}`,
//           name: `${vault.vault_name} Agent`,
//           status: 'active' as const,
//           preferences: {
//             riskLevel: preferences.risk_level,
//             investmentStyle: 'balanced',
//             favoriteTokens: preferences.trading_pairs,
//             maxTradeSize: preferences.max_position_size,
//           },
//           performance: {
//             totalTrades: 0,
//             successRate: 0,
//             totalProfit: 0,
//           },
//         };
        
//         await sleep(1500);
//         navigation.replace('AgentDashboard', { vault, agent });
//       } else {
//         throw new Error(response.error || 'Failed to create agent');
//       }
//     } catch (err: any) {
//       console.error('Agent creation error:', err);
//       setError(err.message || 'Failed to create agent');
//       setStatus('Error');
      
//       // Still navigate to dashboard after error (will show empty state)
//       await sleep(2000);
//       navigation.replace('AgentDashboard', { vault });
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         <View style={styles.animationContainer}>
//           {error ? (
//             <Text style={styles.errorEmoji}>❌</Text>
//           ) : (
//             <ActivityIndicator size="large" color="#4ECDC4" />
//           )}
//         </View>

//         <Text style={styles.title}>
//           {error ? 'Creation Failed' : 'Creating Your AI Agent'}
//         </Text>
        
//         <Text style={styles.status}>
//           {error || status}
//         </Text>

//         <View style={styles.infoCard}>
//           <Text style={styles.infoText}>Vault: {vault.vault_name}</Text>
//           <Text style={styles.infoText}>Risk Level: {preferences.risk_level}</Text>
//           <Text style={styles.infoText}>Trading Pairs: {preferences.trading_pairs?.length || 0}</Text>
//           <Text style={styles.infoText}>Cross-Chain: {preferences.cross_chain_swaps ? 'Enabled' : 'Disabled'}</Text>
//           <Text style={styles.infoText}>Dark Pool: {preferences.dark_pool_trading ? 'Enabled' : 'Disabled'}</Text>
//         </View>

//         {/* What's being set up */}
//         <View style={styles.setupList}>
//           <SetupItem 
//             icon="🏊" 
//             title="Dark Pool Trading" 
//             enabled={preferences.dark_pool_trading}
//             status={status.includes('trading') ? 'loading' : 'done'}
//           />
//           <SetupItem 
//             icon="🔄" 
//             title="Cross-Chain Swaps" 
//             enabled={preferences.cross_chain_swaps}
//             status={status.includes('trading') ? 'loading' : 'done'}
//           />
//           <SetupItem 
//             icon="📊" 
//             title="Signal Integration" 
//             enabled={true}
//             status={status.includes('agent') ? 'loading' : 'done'}
//           />
//           <SetupItem 
//             icon="🏦" 
//             title="Lending Protection" 
//             enabled={preferences.enable_lending || false}
//             status={status.includes('success') ? 'done' : 'pending'}
//           />
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// // Setup item component
// const SetupItem = ({ 
//   icon, 
//   title, 
//   enabled, 
//   status 
// }: { 
//   icon: string; 
//   title: string; 
//   enabled: boolean;
//   status: 'pending' | 'loading' | 'done';
// }) => (
//   <View style={styles.setupItem}>
//     <Text style={styles.setupIcon}>{icon}</Text>
//     <Text style={styles.setupTitle}>{title}</Text>
//     <View style={styles.setupStatus}>
//       {!enabled ? (
//         <Text style={styles.setupDisabled}>Off</Text>
//       ) : status === 'loading' ? (
//         <ActivityIndicator size="small" color="#4ECDC4" />
//       ) : status === 'done' ? (
//         <Text style={styles.setupDone}>✓</Text>
//       ) : (
//         <Text style={styles.setupPending}>...</Text>
//       )}
//     </View>
//   </View>
// );

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0A1628',
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 24,
//     justifyContent: 'center',
//   },
//   animationContainer: {
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   errorEmoji: {
//     fontSize: 64,
//   },
//   title: {
//     fontSize: 24,
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   status: {
//     fontSize: 16,
//     color: '#9CA3AF',
//     textAlign: 'center',
//     marginBottom: 40,
//   },
//   infoCard: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 24,
//   },
//   infoText: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     marginBottom: 8,
//   },
//   setupList: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 16,
//   },
//   setupItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#374151',
//   },
//   setupIcon: {
//     fontSize: 20,
//     marginRight: 12,
//   },
//   setupTitle: {
//     flex: 1,
//     color: '#FFFFFF',
//     fontSize: 14,
//   },
//   setupStatus: {
//     width: 30,
//     alignItems: 'center',
//   },
//   setupDisabled: {
//     color: '#6B7280',
//     fontSize: 12,
//   },
//   setupDone: {
//     color: '#22C55E',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   setupPending: {
//     color: '#6B7280',
//     fontSize: 12,
//   },
// });

// export default AgentCreatingScreen;

/**
 * AgentCreatingScreen.tsx
 * 
 * Shows loading animation while creating AI agent
 * Then navigates to AgentDashboard
 * 
 * Styled with VoltWallet Premium Theme
 */

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   Dimensions,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList, VaultData, AgentPreferences } from '../types/navigation';
// import LinearGradient from 'react-native-linear-gradient';
// import api from '../services/api';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');

// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AgentCreating'>;
// type AgentCreatingRouteProp = RouteProp<RootStackParamList, 'AgentCreating'>;

// const AgentCreatingScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<AgentCreatingRouteProp>();
//   const { vault, preferences } = route.params;
  
//   const [status, setStatus] = useState('Initializing AI Agent...');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     createAgent();
//   }, []);

//   const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

//   const createAgent = async () => {
//     try {
//       setStatus('Connecting to NEAR AI Intents...');
//       await sleep(1000);

//       setStatus('Initializing trading strategies...');
//       await sleep(1000);

//       setStatus('Setting up agent with preferences...');
      
//       const vaultId = vault.vault_id || vault.sol?.vault_id;
      
//       const response = await api.createAgent(vaultId, {
//         risk_level: preferences.risk_level,
//         trading_pairs: preferences.trading_pairs,
//         cross_chain_swaps: preferences.cross_chain_swaps,
//         dark_pool_trading: preferences.dark_pool_trading,
//         max_position_size: preferences.max_position_size,
//         auto_rebalancing: preferences.auto_rebalancing,
//         enable_lending: preferences.enable_lending,
//       });

//       if (response.success || response.agent) {
//         setStatus('Agent created successfully!');
        
//         const agent = response.agent || {
//           agent_id: `agent_${Date.now()}`,
//           name: `${vault.vault_name} Agent`,
//           status: 'active' as const,
//           preferences: {
//             riskLevel: preferences.risk_level,
//             investmentStyle: 'balanced',
//             favoriteTokens: preferences.trading_pairs,
//             maxTradeSize: preferences.max_position_size,
//           },
//           performance: {
//             totalTrades: 0,
//             successRate: 0,
//             totalProfit: 0,
//           },
//         };
        
//         await sleep(1500);
//         navigation.replace('AgentDashboard', { vault, agent });
//       } else {
//         throw new Error(response.error || 'Failed to create agent');
//       }
//     } catch (err: any) {
//       console.error('Agent creation error:', err);
//       setError(err.message || 'Failed to create agent');
//       setStatus('Error');
      
//       await sleep(2000);
//       navigation.replace('AgentDashboard', { vault });
//     }
//   };

//   const getRiskColor = (level: string) => {
//     switch (level) {
//       case 'conservative': return '#22C55E';
//       case 'moderate': return '#EAB308';
//       case 'aggressive': return '#EF4444';
//       default: return '#4ECDC4';
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <LinearGradient
//         colors={['#1E3A5F', '#0F2744', '#0A1628']}
//         style={styles.glowGradient}
//         start={{ x: 0.5, y: 0 }}
//         end={{ x: 0.5, y: 1 }}
//       />
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.content}>
//           {/* Animation Container */}
//           <View style={styles.animationContainer}>
//             {error ? (
//               <View style={styles.errorCircle}>
//                 <Text style={styles.errorEmoji}>✕</Text>
//               </View>
//             ) : status.includes('successfully') ? (
//               <View style={styles.successCircle}>
//                 <Text style={styles.successEmoji}>✓</Text>
//               </View>
//             ) : (
//               <View style={styles.loaderCircle}>
//                 <ActivityIndicator size="large" color="#4ECDC4" />
//               </View>
//             )}
//           </View>

//           {/* Title */}
//           <Text style={styles.title}>
//             {error ? 'Creation Failed' : status.includes('successfully') ? 'Agent Ready!' : 'Creating Your AI Agent'}
//           </Text>
          
//           {/* Status */}
//           <Text style={[styles.status, error && styles.statusError]}>
//             {error || status}
//           </Text>

//           {/* Info Card */}
//           <View style={styles.infoCard}>
//             <Text style={styles.infoCardTitle}>Configuration</Text>
            
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Vault</Text>
//               <Text style={styles.infoValue}>{vault.vault_name}</Text>
//             </View>
            
//             <View style={styles.infoDivider} />
            
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Risk Level</Text>
//               <View style={[styles.infoBadge, { backgroundColor: getRiskColor(preferences.risk_level) + '20' }]}>
//                 <Text style={[styles.infoBadgeText, { color: getRiskColor(preferences.risk_level) }]}>
//                   {preferences.risk_level?.charAt(0).toUpperCase() + preferences.risk_level?.slice(1)}
//                 </Text>
//               </View>
//             </View>
            
//             <View style={styles.infoDivider} />
            
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Trading Pairs</Text>
//               <Text style={styles.infoValue}>{preferences.trading_pairs?.length || 0} pairs</Text>
//             </View>
            
//             <View style={styles.infoDivider} />
            
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Cross-Chain</Text>
//               <View style={[
//                 styles.statusBadge,
//                 preferences.cross_chain_swaps ? styles.statusBadgeActive : styles.statusBadgeInactive
//               ]}>
//                 <Text style={[
//                   styles.statusBadgeText,
//                   { color: preferences.cross_chain_swaps ? '#22C55E' : '#6B7280' }
//                 ]}>
//                   {preferences.cross_chain_swaps ? 'Enabled' : 'Disabled'}
//                 </Text>
//               </View>
//             </View>
            
//             <View style={styles.infoDivider} />
            
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Dark Pool</Text>
//               <View style={[
//                 styles.statusBadge,
//                 preferences.dark_pool_trading ? styles.statusBadgeActive : styles.statusBadgeInactive
//               ]}>
//                 <Text style={[
//                   styles.statusBadgeText,
//                   { color: preferences.dark_pool_trading ? '#22C55E' : '#6B7280' }
//                 ]}>
//                   {preferences.dark_pool_trading ? 'Enabled' : 'Disabled'}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           {/* Setup List */}
//           <View style={styles.setupList}>
//             <Text style={styles.setupListTitle}>Setting Up Features</Text>
            
//             <SetupItem 
//               icon="🏊" 
//               title="Dark Pool Trading" 
//               enabled={preferences.dark_pool_trading}
//               status={status.includes('trading') ? 'loading' : status.includes('successfully') ? 'done' : 'pending'}
//             />
//             <SetupItem 
//               icon="🔄" 
//               title="Cross-Chain Swaps" 
//               enabled={preferences.cross_chain_swaps}
//               status={status.includes('trading') ? 'loading' : status.includes('successfully') ? 'done' : 'pending'}
//             />
//             <SetupItem 
//               icon="📊" 
//               title="Signal Integration" 
//               enabled={true}
//               status={status.includes('agent') || status.includes('successfully') ? 'done' : status.includes('strategies') ? 'loading' : 'pending'}
//             />
//             <SetupItem 
//               icon="🏦" 
//               title="Lending Protection" 
//               enabled={preferences.enable_lending || false}
//               status={status.includes('successfully') ? 'done' : 'pending'}
//               isLast
//             />
//           </View>

//           {/* Footer */}
//           <View style={styles.footer}>
//             <Text style={styles.footerText}>◈ Powered by NEAR AI Intents • ZkAGI 2025</Text>
//           </View>
//         </View>
//       </SafeAreaView>
//     </View>
//   );
// };

// // Setup item component
// const SetupItem = ({ 
//   icon, 
//   title, 
//   enabled, 
//   status,
//   isLast = false,
// }: { 
//   icon: string; 
//   title: string; 
//   enabled: boolean;
//   status: 'pending' | 'loading' | 'done';
//   isLast?: boolean;
// }) => (
//   <View style={[styles.setupItem, isLast && styles.setupItemLast]}>
//     <View style={[
//       styles.setupIconContainer,
//       enabled ? styles.setupIconEnabled : styles.setupIconDisabled
//     ]}>
//       <Text style={styles.setupIcon}>{icon}</Text>
//     </View>
//     <Text style={[styles.setupTitle, !enabled && styles.setupTitleDisabled]}>{title}</Text>
//     <View style={styles.setupStatus}>
//       {!enabled ? (
//         <View style={styles.setupOffBadge}>
//           <Text style={styles.setupDisabled}>Off</Text>
//         </View>
//       ) : status === 'loading' ? (
//         <ActivityIndicator size="small" color="#4ECDC4" />
//       ) : status === 'done' ? (
//         <View style={styles.setupDoneBadge}>
//           <Text style={styles.setupDone}>✓</Text>
//         </View>
//       ) : (
//         <View style={styles.setupPendingBadge}>
//           <Text style={styles.setupPending}>•••</Text>
//         </View>
//       )}
//     </View>
//   </View>
// );

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
//   content: {
//     flex: 1,
//     paddingHorizontal: 24,
//     justifyContent: 'center',
//   },

//   // Animation Container
//   animationContainer: {
//     alignItems: 'center',
//     marginBottom: 32,
//   },
//   loaderCircle: {
//     width: 100,
//     height: 100,
//     backgroundColor: 'rgba(17, 24, 39, 0.8)',
//     borderRadius: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 3,
//     borderColor: 'rgba(78, 205, 196, 0.3)',
//   },
//   successCircle: {
//     width: 100,
//     height: 100,
//     backgroundColor: 'rgba(34, 197, 94, 0.15)',
//     borderRadius: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 3,
//     borderColor: '#22C55E',
//   },
//   successEmoji: {
//     fontSize: 48,
//     color: '#22C55E',
//   },
//   errorCircle: {
//     width: 100,
//     height: 100,
//     backgroundColor: 'rgba(239, 68, 68, 0.15)',
//     borderRadius: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 3,
//     borderColor: '#EF4444',
//   },
//   errorEmoji: {
//     fontSize: 48,
//     color: '#EF4444',
//   },

//   // Title & Status
//   title: {
//     fontSize: 24,
//     color: '#FFFFFF',
//     fontWeight: '700',
//     textAlign: 'center',
//     marginBottom: 12,
//   },
//   status: {
//     fontSize: 15,
//     color: '#4ECDC4',
//     textAlign: 'center',
//     marginBottom: 32,
//   },
//   statusError: {
//     color: '#EF4444',
//   },

//   // Info Card
//   infoCard: {
//     backgroundColor: 'rgba(17, 24, 39, 0.8)',
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: 'rgba(59, 130, 246, 0.2)',
//   },
//   infoCardTitle: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '600',
//     marginBottom: 16,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   infoDivider: {
//     height: 1,
//     backgroundColor: 'rgba(59, 130, 246, 0.15)',
//   },
//   infoLabel: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   infoValue: {
//     fontSize: 14,
//     color: '#FFFFFF',
//     fontWeight: '500',
//   },
//   infoBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 8,
//   },
//   infoBadgeText: {
//     fontSize: 13,
//     fontWeight: '600',
//   },
//   statusBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 6,
//   },
//   statusBadgeActive: {
//     backgroundColor: 'rgba(34, 197, 94, 0.15)',
//   },
//   statusBadgeInactive: {
//     backgroundColor: 'rgba(107, 114, 128, 0.15)',
//   },
//   statusBadgeText: {
//     fontSize: 12,
//     fontWeight: '600',
//   },

//   // Setup List
//   setupList: {
//     backgroundColor: 'rgba(17, 24, 39, 0.8)',
//     borderRadius: 16,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(59, 130, 246, 0.2)',
//   },
//   setupListTitle: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   setupItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(59, 130, 246, 0.15)',
//   },
//   setupItemLast: {
//     borderBottomWidth: 0,
//   },
//   setupIconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 14,
//   },
//   setupIconEnabled: {
//     backgroundColor: 'rgba(78, 205, 196, 0.15)',
//   },
//   setupIconDisabled: {
//     backgroundColor: 'rgba(107, 114, 128, 0.15)',
//   },
//   setupIcon: {
//     fontSize: 18,
//   },
//   setupTitle: {
//     flex: 1,
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   setupTitleDisabled: {
//     color: '#6B7280',
//   },
//   setupStatus: {
//     width: 50,
//     alignItems: 'center',
//   },
//   setupOffBadge: {
//     backgroundColor: 'rgba(107, 114, 128, 0.2)',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   setupDisabled: {
//     color: '#6B7280',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   setupDoneBadge: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: 'rgba(34, 197, 94, 0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   setupDone: {
//     color: '#22C55E',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   setupPendingBadge: {
//     backgroundColor: 'rgba(107, 114, 128, 0.2)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   setupPending: {
//     color: '#6B7280',
//     fontSize: 12,
//     letterSpacing: 2,
//   },

//   // Footer
//   footer: {
//     alignItems: 'center',
//     marginTop: 24,
//   },
//   footerText: {
//     fontSize: 12,
//     color: '#4B5563',
//   },
// });

// export default AgentCreatingScreen;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, isTEEVault } from '../types/navigation';
import LinearGradient from 'react-native-linear-gradient';
import api from '../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AgentCreating'>;
type AgentCreatingRouteProp = RouteProp<RootStackParamList, 'AgentCreating'>;

const COLORS = {
  bgPrimary: '#02111B',
  bgCard: '#0D2137',
  accent: '#33E6BF',
  textPrimary: '#FFFFFF',
  textSecondary: '#8A9BAE',
  textMuted: '#5A6B7E',
  border: 'rgba(42, 82, 152, 0.3)',
  success: '#22C55E',
  error: '#EF4444',
};

const AgentCreatingScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AgentCreatingRouteProp>();
  const { vault, preferences } = route.params;
  
  const [status, setStatus] = useState('Initializing AI Agent...');
  const [error, setError] = useState('');

  // TEE wallets should not reach this screen (they go directly from setup to dashboard)
  const isTEE = vault ? isTEEVault(vault) : false;

  useEffect(() => {
    if (isTEE) {
      // TEE wallets shouldn't be here - redirect to dashboard
      navigation.replace('AgentDashboard', { vault });
      return;
    }
    createAgent();
  }, []);

  const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

  const createAgent = async () => {
    try {
      setStatus('Connecting to NEAR AI Intents...');
      await sleep(1000);

      setStatus('Initializing trading strategies...');
      await sleep(1000);

      setStatus('Setting up agent with preferences...');
      
      const vaultId = vault.vault_id || vault.sol?.vault_id;
      
      const response = await api.createAgent(vaultId, {
        risk_level: preferences.risk_level,
        trading_pairs: preferences.trading_pairs,
        cross_chain_swaps: preferences.cross_chain_swaps,
        dark_pool_trading: preferences.dark_pool_trading,
        max_position_size: preferences.max_position_size,
        auto_rebalancing: preferences.auto_rebalancing,
        enable_lending: preferences.enable_lending,
      });

      if (response.success || response.agent) {
        setStatus('Agent created successfully!');
        
        const agent = response.agent || {
          agent_id: `agent_${Date.now()}`,
          name: `${vault.vault_name} Agent`,
          status: 'active' as const,
          preferences: {
            riskLevel: preferences.risk_level,
            investmentStyle: 'balanced',
            favoriteTokens: preferences.trading_pairs,
            maxTradeSize: preferences.max_position_size,
          },
          performance: {
            totalTrades: 0,
            successRate: 0,
            totalProfit: 0,
          },
        };
        
        await sleep(1500);
        navigation.replace('AgentDashboard', { vault, agent });
      } else {
        throw new Error(response.error || 'Failed to create agent');
      }
    } catch (err: any) {
      console.error('Agent creation error:', err);
      setError(err.message || 'Failed to create agent');
      setStatus('Error');
      
      await sleep(2000);
      navigation.replace('AgentDashboard', { vault });
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'conservative': return COLORS.success;
      case 'moderate': return '#EAB308';
      case 'aggressive': return COLORS.error;
      default: return COLORS.accent;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1E3A5F', '#0F2744', '#02111B']}
        style={styles.gradient}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Animation Container */}
          <View style={styles.animationContainer}>
            {error ? (
              <View style={styles.errorCircle}>
                <Text style={styles.errorEmoji}>✕</Text>
              </View>
            ) : status.includes('successfully') ? (
              <View style={styles.successCircle}>
                <Text style={styles.successEmoji}>✓</Text>
              </View>
            ) : (
              <View style={styles.loaderCircle}>
                <ActivityIndicator size="large" color={COLORS.accent} />
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={styles.title}>
            {error ? 'Creation Failed' : status.includes('successfully') ? 'Agent Ready!' : 'Creating Your AI Agent'}
          </Text>
          
          {/* Status */}
          <Text style={[styles.status, error && styles.statusError]}>
            {error || status}
          </Text>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Configuration</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Vault</Text>
              <Text style={styles.infoValue}>{vault.vault_name}</Text>
            </View>
            
            <View style={styles.infoDivider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Risk Level</Text>
              <View style={[styles.infoBadge, { backgroundColor: getRiskColor(preferences.risk_level) + '20' }]}>
                <Text style={[styles.infoBadgeText, { color: getRiskColor(preferences.risk_level) }]}>
                  {preferences.risk_level?.charAt(0).toUpperCase() + preferences.risk_level?.slice(1)}
                </Text>
              </View>
            </View>
            
            <View style={styles.infoDivider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Trading Pairs</Text>
              <Text style={styles.infoValue}>{preferences.trading_pairs?.length || 0} pairs</Text>
            </View>
            
            <View style={styles.infoDivider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Dark Pool</Text>
              <View style={[
                styles.statusBadge,
                preferences.dark_pool_trading ? styles.statusBadgeActive : styles.statusBadgeInactive
              ]}>
                <Text style={[
                  styles.statusBadgeText,
                  { color: preferences.dark_pool_trading ? COLORS.success : COLORS.textMuted }
                ]}>
                  {preferences.dark_pool_trading ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
            </View>
          </View>

          {/* Setup List */}
          <View style={styles.setupList}>
            <Text style={styles.setupListTitle}>Setting Up Features</Text>
            
            <SetupItem 
              icon="🏊" 
              title="Dark Pool Trading" 
              enabled={preferences.dark_pool_trading}
              status={status.includes('trading') ? 'loading' : status.includes('successfully') ? 'done' : 'pending'}
            />
            <SetupItem 
              icon="🔄" 
              title="Cross-Chain Swaps" 
              enabled={preferences.cross_chain_swaps}
              status={status.includes('trading') ? 'loading' : status.includes('successfully') ? 'done' : 'pending'}
            />
            <SetupItem 
              icon="📊" 
              title="Signal Integration" 
              enabled={true}
              status={status.includes('agent') || status.includes('successfully') ? 'done' : status.includes('strategies') ? 'loading' : 'pending'}
            />
            <SetupItem 
              icon="🏦" 
              title="Lending Protection" 
              enabled={preferences.enable_lending || false}
              status={status.includes('successfully') ? 'done' : 'pending'}
              isLast
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>◈ Powered by NEAR AI Intents • ZkAGI</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

// Setup item component
const SetupItem = ({ 
  icon, 
  title, 
  enabled, 
  status,
  isLast = false,
}: { 
  icon: string; 
  title: string; 
  enabled: boolean;
  status: 'pending' | 'loading' | 'done';
  isLast?: boolean;
}) => (
  <View style={[styles.setupItem, isLast && styles.setupItemLast]}>
    <View style={[
      styles.setupIconContainer,
      enabled ? styles.setupIconEnabled : styles.setupIconDisabled
    ]}>
      <Text style={styles.setupIcon}>{icon}</Text>
    </View>
    <Text style={[styles.setupTitle, !enabled && styles.setupTitleDisabled]}>{title}</Text>
    <View style={styles.setupStatus}>
      {!enabled ? (
        <View style={styles.setupOffBadge}>
          <Text style={styles.setupDisabled}>Off</Text>
        </View>
      ) : status === 'loading' ? (
        <ActivityIndicator size="small" color={COLORS.accent} />
      ) : status === 'done' ? (
        <View style={styles.setupDoneBadge}>
          <Text style={styles.setupDone}>✓</Text>
        </View>
      ) : (
        <View style={styles.setupPendingBadge}>
          <Text style={styles.setupPending}>•••</Text>
        </View>
      )}
    </View>
  </View>
);

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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  // Animation Container
  animationContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  loaderCircle: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.bgCard,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(51, 230, 191, 0.3)',
  },
  successCircle: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.success,
  },
  successEmoji: {
    fontSize: 48,
    color: COLORS.success,
  },
  errorCircle: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.error,
  },
  errorEmoji: {
    fontSize: 48,
    color: COLORS.error,
  },

  // Title & Status
  title: {
    fontSize: 24,
    color: COLORS.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  status: {
    fontSize: 15,
    color: COLORS.accent,
    textAlign: 'center',
    marginBottom: 32,
  },
  statusError: {
    color: COLORS.error,
  },

  // Info Card
  infoCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoCardTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  infoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  infoBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  statusBadgeActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  statusBadgeInactive: {
    backgroundColor: 'rgba(107, 114, 128, 0.15)',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Setup List
  setupList: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  setupListTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  setupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  setupItemLast: {
    borderBottomWidth: 0,
  },
  setupIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  setupIconEnabled: {
    backgroundColor: 'rgba(51, 230, 191, 0.15)',
  },
  setupIconDisabled: {
    backgroundColor: 'rgba(107, 114, 128, 0.15)',
  },
  setupIcon: {
    fontSize: 18,
  },
  setupTitle: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  setupTitleDisabled: {
    color: COLORS.textMuted,
  },
  setupStatus: {
    width: 50,
    alignItems: 'center',
  },
  setupOffBadge: {
    backgroundColor: 'rgba(107, 114, 128, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  setupDisabled: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  setupDoneBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  setupDone: {
    color: COLORS.success,
    fontSize: 16,
    fontWeight: 'bold',
  },
  setupPendingBadge: {
    backgroundColor: 'rgba(107, 114, 128, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  setupPending: {
    color: COLORS.textMuted,
    fontSize: 12,
    letterSpacing: 2,
  },

  // Footer
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});

export default AgentCreatingScreen;