/**
 * AgentDashboardScreen.tsx - FIXED TYPESCRIPT
 * 
 * Shows AI Agent dashboard with:
 * - Empty state (no agent) → Create button
 * - Agent state → Signals, auto-trade toggle, stats
 */

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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, VaultData } from '../types/navigation';
import api from '../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type AgentDashboardRouteProp = RouteProp<RootStackParamList, 'AgentDashboard'>;

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

interface Trade {
  id: string;
  asset: string;
  type: 'BUY' | 'SELL';
  amount: number;
  price: number;
  timestamp: string;
  pnl?: number;
  via: 'DARK_POOL' | 'DEX' | 'CROSS_CHAIN';
}

// Standalone interface - NOT extending anything
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
  trades?: Trade[];
  auto_trade_active?: boolean;
  performance?: {
    totalTrades: number;
    successRate: number;
    totalProfit: number;
  };
}

const AgentDashboardScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AgentDashboardRouteProp>();
  const { vault, agent: passedAgent } = route.params || {};

  const [agent, setAgent] = useState<AgentInfo | null>(passedAgent as AgentInfo || null);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoTradeEnabled, setAutoTradeEnabled] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const vaultId = vault?.vault_id || vault?.sol?.vault_id || '';

  // Add to state (around line 55)
const [liveStatus, setLiveStatus] = useState<any>(null);

// Add polling effect (after fetchData useEffect)
useEffect(() => {
  if (!agent?.agent_id) return;
  
  // Poll status every 30 seconds
  const pollStatus = async () => {
    const status = await api.getAgentStatus(agent.agent_id);
    if (status.success !== false) {
      setLiveStatus(status);
      setAutoTradeEnabled(status.running);
    }
  };
  
  pollStatus();
  const interval = setInterval(pollStatus, 30000);
  return () => clearInterval(interval);
}, [agent?.agent_id]);

  // Fetch agent and signals
  const fetchData = useCallback(async () => {
    try {
      // If no agent passed, try to fetch from API
      if (!agent && vaultId) {
        const agentRes = await api.getAgentForVault(vaultId);
        if (agentRes.success && agentRes.agent) {
          setAgent(agentRes.agent);
          setAutoTradeEnabled(agentRes.agent.auto_trade_active || false);
        }
      }

      // Fetch signals
      const signalsRes = await api.getSignals();
      if (signalsRes.success && signalsRes.signals) {
        setSignals(signalsRes.signals);
      }
    } catch (error) {
      console.error('Failed to fetch agent data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [agent, vaultId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Toggle auto-trade
  const toggleAutoTrade = async (enabled: boolean) => {
    if (!agent?.agent_id) return;

    setActionLoading(true);
    try {
      let res;
      if (enabled) {
        res = await api.startAutoTrading(agent.agent_id, 240);
      } else {
        res = await api.stopAutoTrading(agent.agent_id);
      }

      if (res.success) {
        setAutoTradeEnabled(enabled);
        Alert.alert(
          enabled ? '🤖 Auto-Trading Started!' : '⏸️ Auto-Trading Paused',
          enabled
            ? 'Your agent will check Zynapse signals every 15 minutes and execute trades via Dark Pool.'
            : 'Auto-trading has been paused. You can still execute trades manually.'
        );
      } else {
        Alert.alert('Error', res.error || 'Failed to toggle auto-trade');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to toggle auto-trade');
    } finally {
      setActionLoading(false);
    }
  };

  // Execute signal manually
  const executeSignal = async (signal: Signal) => {
    if (!vaultId) return;

    Alert.alert(
      `${signal.signal} ${signal.asset}?`,
      `Confidence: ${signal.confidence}%\nRSI: ${signal.indicators.rsi}\n\nExecute via Dark Pool?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: `${signal.signal} Now`,
          onPress: async () => {
            setActionLoading(true);
            try {
              const price = signal.price || (signal.asset === 'SOL' ? 150 : 40);
              const res = await api.submitDarkPoolOrder(
                vaultId,
                signal.signal === 'BUY' ? 'BUY' : 'SELL',
                signal.asset,
                0.1,
                price
              );

              if (res.success) {
                Alert.alert('✅ Order Submitted!', `${signal.signal} order sent to Dark Pool`);
                fetchData();
              } else {
                Alert.alert('Error', res.error || 'Order failed');
              }
            } catch (error: any) {
              Alert.alert('Error', error.message);
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ECDC4" />
          <Text style={styles.loadingText}>Loading agent...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Empty state - no agent
  if (!agent) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>🤖 AI Agent</Text>
          </View>

          {/* Empty State */}
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🤖</Text>
            <Text style={styles.emptyTitle}>No AI Agent Yet</Text>
            <Text style={styles.emptyDesc}>
              Create an AI trading agent to automatically execute trades based on Zynapse signals using MEV-protected Dark Pool.
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
            <Text style={styles.featuresTitle}>What Your Agent Can Do</Text>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🏊</Text>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>Dark Pool Trading</Text>
                <Text style={styles.featureDesc}>Execute trades with MEV protection via Arcium</Text>
              </View>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>📊</Text>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>Zynapse Signals</Text>
                <Text style={styles.featureDesc}>Auto-trade based on AI market analysis</Text>
              </View>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🔄</Text>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>Cross-Chain Swaps</Text>
                <Text style={styles.featureDesc}>Trade SOL ↔ ZEC via NEAR Intents</Text>
              </View>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🏦</Text>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>Lending Protection</Text>
                <Text style={styles.featureDesc}>Auto-repay loans to prevent liquidation</Text>
              </View>
            </View>
          </View>

          {/* Manual Actions */}
          <View style={styles.manualSection}>
            <Text style={styles.sectionTitle}>Manual Actions</Text>
            <Text style={styles.sectionSubtitle}>Use these features without an agent</Text>

            <View style={styles.actionGrid}>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => navigation.navigate('DarkPool', { vault_id: vaultId, vault })}
              >
                <Text style={styles.actionIcon}>🏊</Text>
                <Text style={styles.actionTitle}>Dark Pool</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => navigation.navigate('Lending', { vault_id: vaultId, vault })}
              >
                <Text style={styles.actionIcon}>🏦</Text>
                <Text style={styles.actionTitle}>Lending</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => vault && navigation.navigate('Swap', { vault })}
              >
                <Text style={styles.actionIcon}>🔄</Text>
                <Text style={styles.actionTitle}>Swap</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Agent exists - show dashboard
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >

        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🤖 AI Agent</Text>
        </View>

        {liveStatus?.insufficientFunds && (
  <View style={styles.warningBanner}>
    <Text style={styles.warningIcon}>⚠️</Text>
    <View style={styles.warningText}>
      <Text style={styles.warningTitle}>Low Balance</Text>
      <Text style={styles.warningDesc}>
        {liveStatus.insufficientFunds.message || 'Add funds to continue trading'}
      </Text>
    </View>
    <TouchableOpacity 
      style={styles.addFundsButton}
      onPress={() => vault && navigation.navigate('Receive', { vault })}
    >
      <Text style={styles.addFundsText}>Add Funds</Text>
    </TouchableOpacity>
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
              <ActivityIndicator size="small" color="#4ECDC4" />
            ) : (
              <Switch
                value={autoTradeEnabled}
                onValueChange={toggleAutoTrade}
                trackColor={{ false: '#374151', true: '#4ECDC4' }}
                thumbColor={autoTradeEnabled ? '#fff' : '#9CA3AF'}
              />
            )}
          </View>
          <Text style={styles.statusSubtext}>
  {liveStatus?.status === 'INSUFFICIENT_FUNDS'
    ? '⚠️ Paused - Add funds to continue'
    : autoTradeEnabled
    ? `Next check: ${liveStatus?.nextCheck ? new Date(liveStatus.nextCheck).toLocaleTimeString() : '~15 min'}`
    : 'Toggle on to start auto-trading'}
</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{agent.stats?.trades_executed || 0}</Text>
            <Text style={styles.statLabel}>Trades</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[
              styles.statValue,
              { color: (agent.stats?.total_pnl || 0) >= 0 ? '#22C55E' : '#EF4444' }
            ]}>
              ${(agent.stats?.total_pnl || 0).toFixed(2)}
            </Text>
            <Text style={styles.statLabel}>P&L</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{(agent.stats?.win_rate || 0).toFixed(0)}%</Text>
            <Text style={styles.statLabel}>Win Rate</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{agent.stats?.dark_pool_trades || 0}</Text>
            <Text style={styles.statLabel}>Dark Pool</Text>
          </View>
        </View>

        {/* Signals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Trading Signals</Text>
          {signals.length > 0 ? (
            signals.map((signal, index) => (
              <TouchableOpacity
                key={index}
                style={styles.signalCard}
                onPress={() => signal.signal !== 'HOLD' && executeSignal(signal)}
                disabled={signal.signal === 'HOLD'}
              >
                <View style={styles.signalLeft}>
                  <Text style={styles.signalAsset}>{signal.asset}</Text>
                  <Text style={styles.signalPrice}>
                    ${signal.price?.toFixed(2) || (signal.asset === 'SOL' ? '150.00' : '40.00')}
                  </Text>
                </View>
                <View style={styles.signalCenter}>
                  <Text style={styles.signalIndicator}>RSI: {signal.indicators.rsi}</Text>
                  <Text style={styles.signalIndicator}>MACD: {signal.indicators.macd}</Text>
                </View>
                <View style={styles.signalRight}>
                  <View style={[
                    styles.signalBadge,
                    signal.signal === 'BUY' && styles.signalBuy,
                    signal.signal === 'SELL' && styles.signalSell,
                    signal.signal === 'HOLD' && styles.signalHold,
                  ]}>
                    <Text style={styles.signalBadgeText}>{signal.signal}</Text>
                  </View>
                  <Text style={styles.signalConfidence}>{signal.confidence}%</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptySignals}>
              <Text style={styles.emptySignalsText}>Loading signals from Zynapse...</Text>
              <TouchableOpacity onPress={fetchData}>
                <Text style={styles.refreshLink}>Refresh</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Agent Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Agent Settings</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Risk Level</Text>
              <Text style={styles.settingValue}>
                {agent.preferences?.risk_level || agent.preferences?.riskLevel || 'moderate'}
              </Text>
            </View>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Trading Pairs</Text>
              <Text style={styles.settingValue}>
                {agent.preferences?.trading_pairs?.join(', ') ||
                  agent.preferences?.favoriteTokens?.join(', ') ||
                  'SOL/USDC'}
              </Text>
            </View>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Dark Pool</Text>
              <Text style={styles.settingValue}>
                {agent.preferences?.dark_pool_trading !== false ? '✅' : '❌'}
              </Text>
            </View>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Cross-Chain</Text>
              <Text style={styles.settingValue}>
                {agent.preferences?.cross_chain_swaps !== false ? '✅' : '❌'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => vault && navigation.navigate('AgentSetup', { vault })}
          >
            <Text style={styles.editButtonText}>Edit Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('DarkPool', { vault_id: vaultId, vault })}
          >
            <Text style={styles.quickActionIcon}>🏊</Text>
            <Text style={styles.quickActionText}>Dark Pool</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('Lending', { vault_id: vaultId, vault })}
          >
            <Text style={styles.quickActionIcon}>🏦</Text>
            <Text style={styles.quickActionText}>Lending</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => vault && navigation.navigate('Swap', { vault })}
          >
            <Text style={styles.quickActionIcon}>🔄</Text>
            <Text style={styles.quickActionText}>Swap</Text>
          </TouchableOpacity>
        </View>

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#9CA3AF',
    marginTop: 12,
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
  // Empty state
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyDesc: {
    color: '#9CA3AF',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  createButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 14,
  },
  createButtonText: {
    color: '#0A1628',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Features
  featuresSection: {
    padding: 16,
  },
  featuresTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  featureDesc: {
    color: '#6B7280',
    fontSize: 13,
    marginTop: 2,
  },
  // Manual section
  manualSection: {
    padding: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: '#6B7280',
    fontSize: 13,
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // Status card
  statusCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusActive: {
    backgroundColor: '#22C55E',
  },
  statusInactive: {
    backgroundColor: '#6B7280',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statusSubtext: {
    color: '#6B7280',
    fontSize: 13,
  },
  // Stats
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 4,
  },
  // Section
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  // Signals
  signalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  signalLeft: {
    flex: 1,
  },
  signalAsset: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signalPrice: {
    color: '#6B7280',
    fontSize: 13,
  },
  signalCenter: {
    flex: 1,
    alignItems: 'center',
  },
  signalIndicator: {
    color: '#9CA3AF',
    fontSize: 11,
  },
  signalRight: {
    alignItems: 'flex-end',
  },
  signalBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  signalBuy: {
    backgroundColor: '#22C55E20',
  },
  signalSell: {
    backgroundColor: '#EF444420',
  },
  signalHold: {
    backgroundColor: '#6B728020',
  },
  signalBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  signalConfidence: {
    color: '#6B7280',
    fontSize: 11,
  },
  emptySignals: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  emptySignalsText: {
    color: '#6B7280',
  },
  refreshLink: {
    color: '#4ECDC4',
    marginTop: 8,
  },
  // Settings
  settingsCard: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  settingLabel: {
    color: '#6B7280',
    fontSize: 14,
  },
  settingValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Quick actions
  quickActions: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 12,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  // Add to styles
warningBanner: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#78350F',
  marginHorizontal: 16,
  padding: 12,
  borderRadius: 12,
  marginBottom: 16,
},
warningIcon: {
  fontSize: 24,
  marginRight: 12,
},
warningText: {
  flex: 1,
},
warningTitle: {
  color: '#FCD34D',
  fontSize: 14,
  fontWeight: '600',
},
warningDesc: {
  color: '#FDE68A',
  fontSize: 12,
},
addFundsButton: {
  backgroundColor: '#F59E0B',
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 8,
},
addFundsText: {
  color: '#000',
  fontWeight: '600',
  fontSize: 12,
},
});

export default AgentDashboardScreen;