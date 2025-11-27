import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

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
    { id: 'SOL/USDC', name: 'SOL/USDC', chain: 'Solana' },
    { id: 'ZEC/USDC', name: 'ZEC/USDC', chain: 'Zcash' },
    { id: 'ETH/USDC', name: 'ETH/USDC', chain: 'Ethereum' },
    { id: 'ARB/USDC', name: 'ARB/USDC', chain: 'Arbitrum' },
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Configure Your AI Agent</Text>
        <Text style={styles.subtitle}>
          Set up automated trading preferences powered by NEAR AI Intents
        </Text>

        {/* Risk Level */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Risk Tolerance</Text>
          <View style={styles.riskButtons}>
            {(['conservative', 'moderate', 'aggressive'] as const).map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.riskButton,
                  riskLevel === level && styles.riskButtonActive,
                ]}
                onPress={() => setRiskLevel(level)}
              >
                <Text style={[
                  styles.riskButtonText,
                  riskLevel === level && styles.riskButtonTextActive,
                ]}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.riskDescription}>
            {riskLevel === 'conservative' && 'Minimal risk, stable returns (5-15% APY target)'}
            {riskLevel === 'moderate' && 'Balanced approach, moderate returns (15-30% APY target)'}
            {riskLevel === 'aggressive' && 'High risk, maximum returns (30-50%+ APY target)'}
          </Text>
        </View>

        {/* Trading Pairs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💱 Trading Pairs</Text>
          {tradingPairs.map((pair) => (
            <TouchableOpacity
              key={pair.id}
              style={[
                styles.pairCard,
                selectedPairs.includes(pair.id) && styles.pairCardActive,
              ]}
              onPress={() => togglePair(pair.id)}
            >
              <View>
                <Text style={styles.pairName}>{pair.name}</Text>
                <Text style={styles.pairChain}>{pair.chain}</Text>
              </View>
              <View style={[
                styles.checkbox,
                selectedPairs.includes(pair.id) && styles.checkboxActive,
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
          <Text style={styles.sectionTitle}>⚙️ Agent Features</Text>
          
          <View style={styles.featureRow}>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Auto-Rebalancing</Text>
              <Text style={styles.featureDescription}>
                Automatically rebalance portfolio to maintain target allocations
              </Text>
            </View>
            <Switch
              value={autoRebalance}
              onValueChange={setAutoRebalance}
              trackColor={{ false: '#374151', true: '#4ECDC4' }}
              thumbColor={autoRebalance ? '#FFFFFF' : '#9CA3AF'}
            />
          </View>

          <View style={styles.featureRow}>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Cross-Chain Swaps</Text>
              <Text style={styles.featureDescription}>
                Execute trades across multiple blockchains via NEAR Intents
              </Text>
            </View>
            <Switch
              value={crossChainSwaps}
              onValueChange={setCrossChainSwaps}
              trackColor={{ false: '#374151', true: '#4ECDC4' }}
              thumbColor={crossChainSwaps ? '#FFFFFF' : '#9CA3AF'}
            />
          </View>

          <View style={styles.featureRow}>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Dark Pool Trading</Text>
              <Text style={styles.featureDescription}>
                Private, encrypted trades with better execution prices
              </Text>
            </View>
            <Switch
              value={darkPoolTrading}
              onValueChange={setDarkPoolTrading}
              trackColor={{ false: '#374151', true: '#4ECDC4' }}
              thumbColor={darkPoolTrading ? '#FFFFFF' : '#9CA3AF'}
            />
          </View>
        </View>

        {/* Position Size */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Max Position Size</Text>
          <View style={styles.positionSizeContainer}>
            {[10, 25, 50, 75, 100].map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeButton,
                  maxPositionSize === size && styles.sizeButtonActive,
                ]}
                onPress={() => setMaxPositionSize(size)}
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
          <Text style={styles.positionDescription}>
            Maximum percentage of portfolio per single trade
          </Text>
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateAgent}
        >
          <Text style={styles.createButtonText}>Create AI Agent</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Powered by NEAR AI Intents • Secure MPC • Dark Pool
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 20,
  },
  backButton: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 24,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 16,
  },
  riskButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  riskButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  riskButtonActive: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderColor: '#4ECDC4',
  },
  riskButtonText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  riskButtonTextActive: {
    color: '#4ECDC4',
  },
  riskDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  pairCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  pairCardActive: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderColor: '#4ECDC4',
  },
  pairName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  pairChain: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  featureInfo: {
    flex: 1,
    marginRight: 16,
  },
  featureTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: '#9CA3AF',
    lineHeight: 18,
  },
  positionSizeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  sizeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  sizeButtonActive: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderColor: '#4ECDC4',
  },
  sizeButtonText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  sizeButtonTextActive: {
    color: '#4ECDC4',
  },
  positionDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  createButton: {
    marginHorizontal: 24,
    backgroundColor: '#4ECDC4',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default AgentPreferencesScreen;