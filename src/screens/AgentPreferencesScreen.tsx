// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
//   Switch,
// } from 'react-native';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../types/navigation';

// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AgentPreferences'>;
// type RoutePropType = RouteProp<RootStackParamList, 'AgentPreferences'>;

// const AgentPreferencesScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<RoutePropType>();
//   const { vault } = route.params;

//   const [riskLevel, setRiskLevel] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
//   const [autoRebalance, setAutoRebalance] = useState(true);
//   const [crossChainSwaps, setCrossChainSwaps] = useState(true);
//   const [darkPoolTrading, setDarkPoolTrading] = useState(false);
//   const [maxPositionSize, setMaxPositionSize] = useState<number>(25);
//   const [selectedPairs, setSelectedPairs] = useState<string[]>(['SOL/USDC']);

//   const tradingPairs = [
//     { id: 'SOL/USDC', name: 'SOL/USDC', chain: 'Solana' },
//     { id: 'ZEC/USDC', name: 'ZEC/USDC', chain: 'Zcash' },
//     { id: 'ETH/USDC', name: 'ETH/USDC', chain: 'Ethereum' },
//     { id: 'ARB/USDC', name: 'ARB/USDC', chain: 'Arbitrum' },
//   ];

//   const togglePair = (pairId: string) => {
//     if (selectedPairs.includes(pairId)) {
//       setSelectedPairs(selectedPairs.filter(p => p !== pairId));
//     } else {
//       setSelectedPairs([...selectedPairs, pairId]);
//     }
//   };

//   const handleCreateAgent = () => {
//     const preferences = {
//       vault_id: vault.vault_id,
//       risk_level: riskLevel,
//       auto_rebalance: autoRebalance,
//       cross_chain_swaps: crossChainSwaps,
//       dark_pool_trading: darkPoolTrading,
//       max_position_size: maxPositionSize,
//       trading_pairs: selectedPairs,
//     };

//     navigation.navigate('AgentCreating', { vault, preferences });
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Text style={styles.backButton}>← Back</Text>
//           </TouchableOpacity>
//         </View>

//         <Text style={styles.title}>Configure Your AI Agent</Text>
//         <Text style={styles.subtitle}>
//           Set up automated trading preferences powered by NEAR AI Intents
//         </Text>

//         {/* Risk Level */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>🎯 Risk Tolerance</Text>
//           <View style={styles.riskButtons}>
//             {(['conservative', 'moderate', 'aggressive'] as const).map((level) => (
//               <TouchableOpacity
//                 key={level}
//                 style={[
//                   styles.riskButton,
//                   riskLevel === level && styles.riskButtonActive,
//                 ]}
//                 onPress={() => setRiskLevel(level)}
//               >
//                 <Text style={[
//                   styles.riskButtonText,
//                   riskLevel === level && styles.riskButtonTextActive,
//                 ]}>
//                   {level.charAt(0).toUpperCase() + level.slice(1)}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//           <Text style={styles.riskDescription}>
//             {riskLevel === 'conservative' && 'Minimal risk, stable returns (5-15% APY target)'}
//             {riskLevel === 'moderate' && 'Balanced approach, moderate returns (15-30% APY target)'}
//             {riskLevel === 'aggressive' && 'High risk, maximum returns (30-50%+ APY target)'}
//           </Text>
//         </View>

//         {/* Trading Pairs */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>💱 Trading Pairs</Text>
//           {tradingPairs.map((pair) => (
//             <TouchableOpacity
//               key={pair.id}
//               style={[
//                 styles.pairCard,
//                 selectedPairs.includes(pair.id) && styles.pairCardActive,
//               ]}
//               onPress={() => togglePair(pair.id)}
//             >
//               <View>
//                 <Text style={styles.pairName}>{pair.name}</Text>
//                 <Text style={styles.pairChain}>{pair.chain}</Text>
//               </View>
//               <View style={[
//                 styles.checkbox,
//                 selectedPairs.includes(pair.id) && styles.checkboxActive,
//               ]}>
//                 {selectedPairs.includes(pair.id) && (
//                   <Text style={styles.checkmark}>✓</Text>
//                 )}
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Features */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>⚙️ Agent Features</Text>
          
//           <View style={styles.featureRow}>
//             <View style={styles.featureInfo}>
//               <Text style={styles.featureTitle}>Auto-Rebalancing</Text>
//               <Text style={styles.featureDescription}>
//                 Automatically rebalance portfolio to maintain target allocations
//               </Text>
//             </View>
//             <Switch
//               value={autoRebalance}
//               onValueChange={setAutoRebalance}
//               trackColor={{ false: '#374151', true: '#4ECDC4' }}
//               thumbColor={autoRebalance ? '#FFFFFF' : '#9CA3AF'}
//             />
//           </View>

//           <View style={styles.featureRow}>
//             <View style={styles.featureInfo}>
//               <Text style={styles.featureTitle}>Cross-Chain Swaps</Text>
//               <Text style={styles.featureDescription}>
//                 Execute trades across multiple blockchains via NEAR Intents
//               </Text>
//             </View>
//             <Switch
//               value={crossChainSwaps}
//               onValueChange={setCrossChainSwaps}
//               trackColor={{ false: '#374151', true: '#4ECDC4' }}
//               thumbColor={crossChainSwaps ? '#FFFFFF' : '#9CA3AF'}
//             />
//           </View>

//           <View style={styles.featureRow}>
//             <View style={styles.featureInfo}>
//               <Text style={styles.featureTitle}>Dark Pool Trading</Text>
//               <Text style={styles.featureDescription}>
//                 Private, encrypted trades with better execution prices
//               </Text>
//             </View>
//             <Switch
//               value={darkPoolTrading}
//               onValueChange={setDarkPoolTrading}
//               trackColor={{ false: '#374151', true: '#4ECDC4' }}
//               thumbColor={darkPoolTrading ? '#FFFFFF' : '#9CA3AF'}
//             />
//           </View>
//         </View>

//         {/* Position Size */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>📊 Max Position Size</Text>
//           <View style={styles.positionSizeContainer}>
//             {[10, 25, 50, 75, 100].map((size) => (
//               <TouchableOpacity
//                 key={size}
//                 style={[
//                   styles.sizeButton,
//                   maxPositionSize === size && styles.sizeButtonActive,
//                 ]}
//                 onPress={() => setMaxPositionSize(size)}
//               >
//                 <Text style={[
//                   styles.sizeButtonText,
//                   maxPositionSize === size && styles.sizeButtonTextActive,
//                 ]}>
//                   {size}%
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//           <Text style={styles.positionDescription}>
//             Maximum percentage of portfolio per single trade
//           </Text>
//         </View>

//         <TouchableOpacity
//           style={styles.createButton}
//           onPress={handleCreateAgent}
//         >
//           <Text style={styles.createButtonText}>Create AI Agent</Text>
//         </TouchableOpacity>

//         <View style={styles.footer}>
//           <Text style={styles.footerText}>
//             Powered by NEAR AI Intents • Secure MPC • Dark Pool
//           </Text>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0A1628',
//   },
//   header: {
//     paddingHorizontal: 24,
//     paddingTop: 20,
//     marginBottom: 20,
//   },
//   backButton: {
//     color: '#FFFFFF',
//     fontSize: 16,
//   },
//   title: {
//     fontSize: 28,
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     marginBottom: 8,
//     paddingHorizontal: 24,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#9CA3AF',
//     marginBottom: 32,
//     lineHeight: 24,
//     paddingHorizontal: 24,
//   },
//   section: {
//     paddingHorizontal: 24,
//     marginBottom: 32,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     color: '#FFFFFF',
//     fontWeight: '600',
//     marginBottom: 16,
//   },
//   riskButtons: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 12,
//   },
//   riskButton: {
//     flex: 1,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 12,
//     backgroundColor: '#1E293B',
//     borderWidth: 2,
//     borderColor: 'transparent',
//     alignItems: 'center',
//   },
//   riskButtonActive: {
//     backgroundColor: 'rgba(78, 205, 196, 0.1)',
//     borderColor: '#4ECDC4',
//   },
//   riskButtonText: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     fontWeight: '600',
//   },
//   riskButtonTextActive: {
//     color: '#4ECDC4',
//   },
//   riskDescription: {
//     fontSize: 13,
//     color: '#6B7280',
//     lineHeight: 18,
//   },
//   pairCard: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     borderRadius: 12,
//     backgroundColor: '#1E293B',
//     marginBottom: 12,
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },
//   pairCardActive: {
//     backgroundColor: 'rgba(78, 205, 196, 0.1)',
//     borderColor: '#4ECDC4',
//   },
//   pairName: {
//     fontSize: 16,
//     color: '#FFFFFF',
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   pairChain: {
//     fontSize: 13,
//     color: '#9CA3AF',
//   },
//   checkbox: {
//     width: 24,
//     height: 24,
//     borderRadius: 6,
//     borderWidth: 2,
//     borderColor: '#374151',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   checkboxActive: {
//     backgroundColor: '#4ECDC4',
//     borderColor: '#4ECDC4',
//   },
//   checkmark: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   featureRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#1E293B',
//   },
//   featureInfo: {
//     flex: 1,
//     marginRight: 16,
//   },
//   featureTitle: {
//     fontSize: 16,
//     color: '#FFFFFF',
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   featureDescription: {
//     fontSize: 13,
//     color: '#9CA3AF',
//     lineHeight: 18,
//   },
//   positionSizeContainer: {
//     flexDirection: 'row',
//     gap: 8,
//     marginBottom: 12,
//   },
//   sizeButton: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 8,
//     backgroundColor: '#1E293B',
//     borderWidth: 2,
//     borderColor: 'transparent',
//     alignItems: 'center',
//   },
//   sizeButtonActive: {
//     backgroundColor: 'rgba(78, 205, 196, 0.1)',
//     borderColor: '#4ECDC4',
//   },
//   sizeButtonText: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     fontWeight: '600',
//   },
//   sizeButtonTextActive: {
//     color: '#4ECDC4',
//   },
//   positionDescription: {
//     fontSize: 13,
//     color: '#6B7280',
//     lineHeight: 18,
//   },
//   createButton: {
//     marginHorizontal: 24,
//     backgroundColor: '#4ECDC4',
//     padding: 18,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   createButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   footer: {
//     paddingHorizontal: 24,
//     paddingBottom: 40,
//     alignItems: 'center',
//   },
//   footerText: {
//     fontSize: 12,
//     color: '#6B7280',
//     textAlign: 'center',
//   },
// });

// export default AgentPreferencesScreen;

/**
 * AgentPreferencesScreen.tsx
 * 
 * Configure AI Agent preferences:
 * - Risk tolerance
 * - Trading pairs
 * - Features (rebalancing, cross-chain, dark pool)
 * - Max position size
 * 
 * Styled with VoltWallet Premium Theme
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import LinearGradient from 'react-native-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AgentPreferences'>;
type RoutePropType = RouteProp<RootStackParamList, 'AgentPreferences'>;

const AgentPreferencesScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { vault } = route.params;

  const [riskLevel, setRiskLevel] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [autoRebalance, setAutoRebalance] = useState(true);
  const [crossChainSwaps, setCrossChainSwaps] = useState(true);
  const [darkPoolTrading, setDarkPoolTrading] = useState(false);
  const [maxPositionSize, setMaxPositionSize] = useState<number>(25);
  const [selectedPairs, setSelectedPairs] = useState<string[]>(['SOL/USDC']);

  const tradingPairs = [
    { id: 'SOL/USDC', name: 'SOL/USDC', chain: 'Solana', icon: '◎', color: '#9945FF' },
    { id: 'ZEC/USDC', name: 'ZEC/USDC', chain: 'Zcash', icon: 'Z', color: '#F4B728' },
    { id: 'ETH/USDC', name: 'ETH/USDC', chain: 'Ethereum', icon: '⟠', color: '#627EEA' },
    { id: 'ARB/USDC', name: 'ARB/USDC', chain: 'Arbitrum', icon: '◆', color: '#28A0F0' },
  ];

  const togglePair = (pairId: string) => {
    if (selectedPairs.includes(pairId)) {
      setSelectedPairs(selectedPairs.filter(p => p !== pairId));
    } else {
      setSelectedPairs([...selectedPairs, pairId]);
    }
  };

  const handleCreateAgent = () => {
    const preferences = {
      vault_id: vault.vault_id,
      risk_level: riskLevel,
      auto_rebalance: autoRebalance,
      cross_chain_swaps: crossChainSwaps,
      dark_pool_trading: darkPoolTrading,
      max_position_size: maxPositionSize,
      trading_pairs: selectedPairs,
    };

    navigation.navigate('AgentCreating', { vault, preferences });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'conservative': return '#22C55E';
      case 'moderate': return '#EAB308';
      case 'aggressive': return '#EF4444';
      default: return '#4ECDC4';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'conservative': return '🐢';
      case 'moderate': return '⚖️';
      case 'aggressive': return '🚀';
      default: return '📊';
    }
  };

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
              <Text style={styles.title}>AI Agent</Text>
              <Text style={styles.subtitle}>Configure Preferences</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>

          {/* Intro Card */}
          <View style={styles.introCard}>
            <View style={styles.introIconContainer}>
              <Text style={styles.introIcon}>🤖</Text>
            </View>
            <View style={styles.introContent}>
              <Text style={styles.introTitle}>Configure Your AI Agent</Text>
              <Text style={styles.introText}>
                Set up automated trading preferences powered by NEAR AI Intents
              </Text>
            </View>
          </View>

          {/* Risk Level */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Risk Tolerance</Text>
              <Text style={styles.sectionDesc}>Select your trading risk level</Text>
            </View>
            
            <View style={styles.riskButtons}>
              {(['conservative', 'moderate', 'aggressive'] as const).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.riskButton,
                    riskLevel === level && styles.riskButtonActive,
                    riskLevel === level && { borderColor: getRiskColor(level) },
                  ]}
                  onPress={() => setRiskLevel(level)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.riskIconContainer,
                    { backgroundColor: getRiskColor(level) + '20' }
                  ]}>
                    <Text style={styles.riskIcon}>{getRiskIcon(level)}</Text>
                  </View>
                  <Text style={[
                    styles.riskButtonText,
                    riskLevel === level && { color: getRiskColor(level) },
                  ]}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                  {riskLevel === level && (
                    <View style={[styles.riskCheck, { backgroundColor: getRiskColor(level) }]}>
                      <Text style={styles.riskCheckText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.riskDescriptionCard}>
              <Text style={styles.riskDescriptionText}>
                {riskLevel === 'conservative' && '🐢 Minimal risk, stable returns (5-15% APY target)'}
                {riskLevel === 'moderate' && '⚖️ Balanced approach, moderate returns (15-30% APY target)'}
                {riskLevel === 'aggressive' && '🚀 High risk, maximum returns (30-50%+ APY target)'}
              </Text>
            </View>
          </View>

          {/* Trading Pairs */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Trading Pairs</Text>
              <Text style={styles.sectionDesc}>Select pairs for your agent to trade</Text>
            </View>
            
            {tradingPairs.map((pair) => (
              <TouchableOpacity
                key={pair.id}
                style={[
                  styles.pairCard,
                  selectedPairs.includes(pair.id) && styles.pairCardActive,
                  selectedPairs.includes(pair.id) && { borderColor: pair.color },
                ]}
                onPress={() => togglePair(pair.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.pairIconContainer, { backgroundColor: pair.color }]}>
                  <Text style={[
                    styles.pairIcon,
                    pair.id === 'ZEC/USDC' && styles.pairIconDark
                  ]}>{pair.icon}</Text>
                </View>
                <View style={styles.pairInfo}>
                  <Text style={styles.pairName}>{pair.name}</Text>
                  <Text style={styles.pairChain}>{pair.chain}</Text>
                </View>
                <View style={[
                  styles.checkbox,
                  selectedPairs.includes(pair.id) && { backgroundColor: pair.color, borderColor: pair.color },
                ]}>
                  {selectedPairs.includes(pair.id) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Features */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Agent Features</Text>
            </View>
            
            <View style={styles.featuresCard}>
              <View style={styles.featureRow}>
                <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(153, 69, 255, 0.15)' }]}>
                  <Text style={styles.featureIcon}>⚖️</Text>
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Auto-Rebalancing</Text>
                  <Text style={styles.featureDescription}>
                    Automatically rebalance portfolio to maintain target allocations
                  </Text>
                </View>
                <Switch
                  value={autoRebalance}
                  onValueChange={setAutoRebalance}
                  trackColor={{ false: 'rgba(30, 58, 95, 0.8)', true: 'rgba(78, 205, 196, 0.4)' }}
                  thumbColor={autoRebalance ? '#4ECDC4' : '#6B7280'}
                />
              </View>

              <View style={styles.featureDivider} />

              <View style={styles.featureRow}>
                <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(244, 183, 40, 0.15)' }]}>
                  <Text style={styles.featureIcon}>🔄</Text>
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Cross-Chain Swaps</Text>
                  <Text style={styles.featureDescription}>
                    Execute trades across multiple blockchains via NEAR Intents
                  </Text>
                </View>
                <Switch
                  value={crossChainSwaps}
                  onValueChange={setCrossChainSwaps}
                  trackColor={{ false: 'rgba(30, 58, 95, 0.8)', true: 'rgba(78, 205, 196, 0.4)' }}
                  thumbColor={crossChainSwaps ? '#4ECDC4' : '#6B7280'}
                />
              </View>

              <View style={styles.featureDivider} />

              <View style={styles.featureRow}>
                <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(78, 205, 196, 0.15)' }]}>
                  <Text style={styles.featureIcon}>🏊</Text>
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Dark Pool Trading</Text>
                  <Text style={styles.featureDescription}>
                    Private, encrypted trades with better execution prices
                  </Text>
                </View>
                <Switch
                  value={darkPoolTrading}
                  onValueChange={setDarkPoolTrading}
                  trackColor={{ false: 'rgba(30, 58, 95, 0.8)', true: 'rgba(78, 205, 196, 0.4)' }}
                  thumbColor={darkPoolTrading ? '#4ECDC4' : '#6B7280'}
                />
              </View>
            </View>
          </View>

          {/* Position Size */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Max Position Size</Text>
              <Text style={styles.sectionDesc}>Maximum percentage of portfolio per single trade</Text>
            </View>
            
            <View style={styles.positionSizeContainer}>
              {[10, 25, 50, 75, 100].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeButton,
                    maxPositionSize === size && styles.sizeButtonActive,
                  ]}
                  onPress={() => setMaxPositionSize(size)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.sizeButtonText,
                    maxPositionSize === size && styles.sizeButtonTextActive,
                  ]}>
                    {size}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Configuration Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Risk Level</Text>
              <View style={[styles.summaryBadge, { backgroundColor: getRiskColor(riskLevel) + '20' }]}>
                <Text style={[styles.summaryBadgeText, { color: getRiskColor(riskLevel) }]}>
                  {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
                </Text>
              </View>
            </View>
            
            <View style={styles.summaryDivider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Trading Pairs</Text>
              <Text style={styles.summaryValue}>{selectedPairs.length} selected</Text>
            </View>
            
            <View style={styles.summaryDivider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Max Position</Text>
              <Text style={[styles.summaryValue, { color: '#4ECDC4' }]}>{maxPositionSize}%</Text>
            </View>
          </View>

          {/* Create Button */}
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateAgent}
            activeOpacity={0.8}
          >
            <Text style={styles.createButtonText}>🚀 Create AI Agent</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              ◈ Powered by NEAR AI Intents • Secure MPC • Dark Pool
            </Text>
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

  // Intro Card
  introCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.3)',
  },
  introIconContainer: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  introIcon: {
    fontSize: 28,
  },
  introContent: {
    flex: 1,
  },
  introTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
  },
  introText: {
    color: '#9CA3AF',
    fontSize: 13,
    lineHeight: 20,
  },

  // Section
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    color: '#6B7280',
  },

  // Risk Level
  riskButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  riskButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
    position: 'relative',
  },
  riskButtonActive: {
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
  },
  riskIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  riskIcon: {
    fontSize: 20,
  },
  riskButtonText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  riskCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  riskCheckText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  riskDescriptionCard: {
    backgroundColor: 'rgba(30, 58, 95, 0.5)',
    borderRadius: 12,
    padding: 14,
  },
  riskDescriptionText: {
    fontSize: 13,
    color: '#9CA3AF',
    lineHeight: 20,
    textAlign: 'center',
  },

  // Trading Pairs
  pairCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  pairCardActive: {
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
  },
  pairIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  pairIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  pairIconDark: {
    color: '#000000',
  },
  pairInfo: {
    flex: 1,
  },
  pairName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  pairChain: {
    fontSize: 13,
    color: '#6B7280',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Features
  featuresCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  featureDivider: {
    height: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    marginHorizontal: 14,
  },
  featureIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureInfo: {
    flex: 1,
    marginRight: 12,
  },
  featureTitle: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },

  // Position Size
  positionSizeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  sizeButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
  },
  sizeButtonActive: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderColor: '#4ECDC4',
  },
  sizeButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  sizeButtonTextActive: {
    color: '#4ECDC4',
  },

  // Summary Card
  summaryCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.3)',
  },
  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 18,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  summaryLabel: {
    color: '#6B7280',
    fontSize: 14,
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  summaryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  summaryBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Create Button
  createButton: {
    backgroundColor: '#4ECDC4',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  createButtonText: {
    color: '#0A1628',
    fontSize: 18,
    fontWeight: '700',
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'center',
  },
});

export default AgentPreferencesScreen;