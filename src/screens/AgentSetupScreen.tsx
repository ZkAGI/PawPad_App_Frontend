/**
 * AgentSetupScreen.tsx - COMPLETE
 * 
 * Configure AI Trading Agent preferences:
 * - Risk level
 * - Trading pairs (SOL, ZEC)
 * - Enable Dark Pool trading
 * - Enable Cross-chain swaps
 * - Buy & Hold strategy settings
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, AgentPreferences } from './src/types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type AgentSetupRouteProp = RouteProp<RootStackParamList, 'AgentSetup'>;

const AgentSetupScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AgentSetupRouteProp>();
  const { vault, agent } = route.params;

  // Preferences state
  const [riskLevel, setRiskLevel] = useState<'Conservative' | 'Moderate' | 'Aggressive'>(
    (agent?.preferences?.riskLevel as any) || 'Moderate'
  );
  const [tradingPairs, setTradingPairs] = useState<string[]>(
    agent?.preferences?.favoriteTokens || ['SOL/USDC', 'ZEC/USDC']
  );
  const [darkPoolEnabled, setDarkPoolEnabled] = useState(true);
  const [crossChainEnabled, setCrossChainEnabled] = useState(true);
  const [autoRebalancing, setAutoRebalancing] = useState(false);
  const [lendingProtection, setLendingProtection] = useState(false);
  const [maxPositionSize, setMaxPositionSize] = useState(100); // USD

  const toggleTradingPair = (pair: string) => {
    if (tradingPairs.includes(pair)) {
      if (tradingPairs.length > 1) {
        setTradingPairs(tradingPairs.filter(p => p !== pair));
      }
    } else {
      setTradingPairs([...tradingPairs, pair]);
    }
  };

  const handleCreate = () => {
    if (tradingPairs.length === 0) {
      Alert.alert('Error', 'Select at least one trading pair');
      return;
    }

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
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🤖 AI Trading Agent</Text>
        </View>

        {/* Intro */}
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>Configure Your Agent</Text>
          <Text style={styles.introText}>
            Your AI agent will automatically trade based on Zynapse signals 
            using MEV-protected Dark Pool execution.
          </Text>
        </View>

        {/* Risk Level */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Risk Level</Text>
          <Text style={styles.sectionDesc}>How aggressive should your agent trade?</Text>
          
          <View style={styles.riskOptions}>
            {(['Conservative', 'Moderate', 'Aggressive'] as const).map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.riskOption,
                  riskLevel === level && styles.riskOptionActive,
                  riskLevel === level && level === 'Conservative' && styles.riskConservative,
                  riskLevel === level && level === 'Moderate' && styles.riskModerate,
                  riskLevel === level && level === 'Aggressive' && styles.riskAggressive,
                ]}
                onPress={() => setRiskLevel(level)}
              >
                <Text style={styles.riskIcon}>
                  {level === 'Conservative' ? '🐢' : level === 'Moderate' ? '⚖️' : '🚀'}
                </Text>
                <Text style={[
                  styles.riskLabel,
                  riskLevel === level && styles.riskLabelActive
                ]}>
                  {level}
                </Text>
                <Text style={styles.riskDesc}>
                  {level === 'Conservative' 
                    ? 'Small positions, high confidence only'
                    : level === 'Moderate'
                    ? 'Balanced risk/reward'
                    : 'Larger positions, more trades'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trading Pairs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💱 Trading Pairs</Text>
          <Text style={styles.sectionDesc}>Which assets should the agent trade?</Text>
          
          <View style={styles.pairsGrid}>
            {[
              { pair: 'SOL/USDC', icon: '◎', color: '#9945FF' },
              { pair: 'ZEC/USDC', icon: 'Ⓩ', color: '#F4B728' },
            ].map(({ pair, icon, color }) => (
              <TouchableOpacity
                key={pair}
                style={[
                  styles.pairOption,
                  tradingPairs.includes(pair) && { ...styles.pairOptionActive, borderColor: color },
                ]}
                onPress={() => toggleTradingPair(pair)}
              >
                <Text style={[styles.pairIcon, { color }]}>{icon}</Text>
                <Text style={[
                  styles.pairLabel,
                  tradingPairs.includes(pair) && styles.pairLabelActive
                ]}>
                  {pair}
                </Text>
                {tradingPairs.includes(pair) && (
                  <Text style={[styles.pairCheck, { color }]}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Features</Text>
          
          {/* Dark Pool */}
          <View style={styles.featureRow}>
            <View style={styles.featureInfo}>
              <Text style={styles.featureIcon}>🏊</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Dark Pool Trading</Text>
                <Text style={styles.featureDesc}>MEV-protected execution via Arcium</Text>
              </View>
            </View>
            <Switch
              value={darkPoolEnabled}
              onValueChange={setDarkPoolEnabled}
              trackColor={{ false: '#374151', true: '#4ECDC4' }}
              thumbColor={darkPoolEnabled ? '#fff' : '#9CA3AF'}
            />
          </View>

          {/* Cross-Chain */}
          <View style={styles.featureRow}>
            <View style={styles.featureInfo}>
              <Text style={styles.featureIcon}>🔄</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Cross-Chain Swaps</Text>
                <Text style={styles.featureDesc}>Trade between SOL ↔ ZEC via NEAR</Text>
              </View>
            </View>
            <Switch
              value={crossChainEnabled}
              onValueChange={setCrossChainEnabled}
              trackColor={{ false: '#374151', true: '#4ECDC4' }}
              thumbColor={crossChainEnabled ? '#fff' : '#9CA3AF'}
            />
          </View>

          {/* Auto Rebalancing */}
          <View style={styles.featureRow}>
            <View style={styles.featureInfo}>
              <Text style={styles.featureIcon}>⚖️</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Auto Rebalancing</Text>
                <Text style={styles.featureDesc}>Maintain target allocation ratios</Text>
              </View>
            </View>
            <Switch
              value={autoRebalancing}
              onValueChange={setAutoRebalancing}
              trackColor={{ false: '#374151', true: '#4ECDC4' }}
              thumbColor={autoRebalancing ? '#fff' : '#9CA3AF'}
            />
          </View>

          {/* Lending Protection */}
          <View style={styles.featureRow}>
            <View style={styles.featureInfo}>
              <Text style={styles.featureIcon}>🏦</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Lending Auto-Protect</Text>
                <Text style={styles.featureDesc}>Auto-repay to prevent liquidation</Text>
              </View>
            </View>
            <Switch
              value={lendingProtection}
              onValueChange={setLendingProtection}
              trackColor={{ false: '#374151', true: '#4ECDC4' }}
              thumbColor={lendingProtection ? '#fff' : '#9CA3AF'}
            />
          </View>
        </View>

        {/* Position Size */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Max Position Size</Text>
          <Text style={styles.sectionDesc}>Maximum USD per trade</Text>
          
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
                <Text style={[
                  styles.sizeLabel,
                  maxPositionSize === size && styles.sizeLabelActive
                ]}>
                  ${size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Agent Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Risk Level:</Text>
            <Text style={styles.summaryValue}>{riskLevel}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Trading:</Text>
            <Text style={styles.summaryValue}>{tradingPairs.join(', ')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Dark Pool:</Text>
            <Text style={styles.summaryValue}>{darkPoolEnabled ? '✅ Enabled' : '❌ Off'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Max Trade:</Text>
            <Text style={styles.summaryValue}>${maxPositionSize}</Text>
          </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.createButtonText}>
            {agent ? '💾 Update Agent' : '🚀 Create AI Agent'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  backButton: {
    color: '#4ECDC4',
    fontSize: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  introCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  introTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  introText: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionDesc: {
    color: '#6B7280',
    fontSize: 13,
    marginBottom: 16,
  },
  riskOptions: {
    gap: 12,
  },
  riskOption: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  riskOptionActive: {
    borderColor: '#4ECDC4',
  },
  riskConservative: {
    borderColor: '#22C55E',
  },
  riskModerate: {
    borderColor: '#EAB308',
  },
  riskAggressive: {
    borderColor: '#EF4444',
  },
  riskIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  riskLabel: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  riskLabelActive: {
    color: '#FFFFFF',
  },
  riskDesc: {
    color: '#6B7280',
    fontSize: 12,
  },
  pairsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  pairOption: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  pairOptionActive: {
    backgroundColor: '#1E293B',
  },
  pairIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  pairLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
  },
  pairLabelActive: {
    color: '#FFFFFF',
  },
  pairCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
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
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  featureDesc: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },
  sizeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  sizeOption: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sizeOptionActive: {
    borderColor: '#4ECDC4',
    backgroundColor: '#0D3D56',
  },
  sizeLabel: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
  },
  sizeLabelActive: {
    color: '#4ECDC4',
  },
  summaryCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
  createButton: {
    backgroundColor: '#4ECDC4',
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#0A1628',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AgentSetupScreen;