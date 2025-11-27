import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import axios from 'axios';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AgentDashboard'>;
type RoutePropType = RouteProp<RootStackParamList, 'AgentDashboard'>;

interface AgentStats {
  total_trades: number;
  successful_trades: number;
  total_pnl: number;
  total_volume: number;
  active_positions: number;
  win_rate: number;
}

const AgentDashboardScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { vault, agent } = route.params;

  const [stats, setStats] = useState<AgentStats>({
    total_trades: 0,
    successful_trades: 0,
    total_pnl: 0,
    total_volume: 0,
    active_positions: 0,
    win_rate: 0,
  });
  const [isActive, setIsActive] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgentStats();
  }, []);

  const loadAgentStats = async () => {
  try {
    setLoading(true);
    
    // Use existing dark pool stats endpoint
    const response = await axios.get('http://10.0.2.2:3000/api/darkpool/stats');
    
    if (response.data.success) {
      // Map dark pool stats to agent stats
      const darkPoolStats = response.data.stats;
      setStats({
        total_trades: darkPoolStats.total_orders || 0,
        successful_trades: darkPoolStats.filled_orders || 0,
        total_pnl: 0, // Calculate from trades
        total_volume: darkPoolStats.total_volume || 0,
        active_positions: darkPoolStats.pending_orders || 0,
        win_rate: darkPoolStats.filled_orders > 0 
          ? (darkPoolStats.filled_orders / darkPoolStats.total_orders * 100) 
          : 0,
      });
    }
  } catch (err) {
    console.error('Failed to load agent stats:', err);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  const onRefresh = () => {
    setRefreshing(true);
    loadAgentStats();
  };

  const toggleAgent = async () => {
    try {
      const newStatus = !isActive;
      await axios.post(`http://10.0.2.2:3000/api/agent/${agent.agent_id}/toggle`, {
        active: newStatus,
      });
      setIsActive(newStatus);
    } catch (err) {
      console.error('Failed to toggle agent:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4ECDC4" />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          <View>
            <Text style={styles.title}>AI Agent Dashboard</Text>
            <Text style={styles.subtitle}>{vault.vault_name}</Text>
          </View>
          <TouchableOpacity
            style={[styles.statusBadge, isActive && styles.statusBadgeActive]}
            onPress={toggleAgent}
          >
            <View style={[styles.statusDot, isActive && styles.statusDotActive]} />
            <Text style={[styles.statusText, isActive && styles.statusTextActive]}>
              {isActive ? 'Active' : 'Paused'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Performance Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Performance</Text>
          
          <View style={styles.pnlContainer}>
            <Text style={styles.pnlLabel}>Total P&L</Text>
            <Text style={[
              styles.pnlAmount,
              stats.total_pnl >= 0 ? styles.pnlPositive : styles.pnlNegative
            ]}>
              {stats.total_pnl >= 0 ? '+' : ''}${stats.total_pnl.toFixed(2)}
            </Text>
            <Text style={styles.pnlPercentage}>
              {stats.total_pnl >= 0 ? '↑' : '↓'} {Math.abs(stats.total_pnl / 100 * 100).toFixed(2)}%
            </Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.total_trades}</Text>
              <Text style={styles.statLabel}>Total Trades</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.win_rate.toFixed(1)}%</Text>
              <Text style={styles.statLabel}>Win Rate</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${stats.total_volume.toFixed(0)}</Text>
              <Text style={styles.statLabel}>Volume</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.active_positions}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
          </View>
        </View>

        {/* Strategy Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>⚙️ Strategy</Text>
          
          <View style={styles.strategyRow}>
            <Text style={styles.strategyLabel}>Risk Level</Text>
            <View style={styles.strategyBadge}>
              <Text style={styles.strategyValue}>{agent.preferences.risk_level}</Text>
            </View>
          </View>

          <View style={styles.strategyRow}>
            <Text style={styles.strategyLabel}>Trading Pairs</Text>
            <Text style={styles.strategyValue}>
              {agent.preferences.trading_pairs.length} active
            </Text>
          </View>

          <View style={styles.strategyRow}>
            <Text style={styles.strategyLabel}>Max Position</Text>
            <Text style={styles.strategyValue}>
              {agent.preferences.max_position_size}%
            </Text>
          </View>

          <View style={styles.strategyRow}>
            <Text style={styles.strategyLabel}>Cross-Chain</Text>
            <Text style={styles.strategyValue}>
              {agent.preferences.cross_chain_swaps ? 'Enabled' : 'Disabled'}
            </Text>
          </View>

          <View style={styles.strategyRow}>
            <Text style={styles.strategyLabel}>Dark Pool</Text>
            <Text style={styles.strategyValue}>
              {agent.preferences.dark_pool_trading ? 'Enabled' : 'Disabled'}
            </Text>
          </View>
        </View>

        {/* Trading Pairs */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💱 Active Pairs</Text>
          {agent.preferences.trading_pairs.map((pair: string, index: number) => (
            <View key={index} style={styles.pairRow}>
              <Text style={styles.pairName}>{pair}</Text>
              <View style={styles.pairStatus}>
                <View style={styles.activeDot} />
                <Text style={styles.pairStatusText}>Trading</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actionsCard}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('FundWallet', { vault })}
          >
            <Text style={styles.actionButtonEmoji}>💰</Text>
            <Text style={styles.actionButtonText}>Add Funds</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {/* TODO: Navigate to history */}}
          >
            <Text style={styles.actionButtonEmoji}>📜</Text>
            <Text style={styles.actionButtonText}>Trade History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {/* TODO: Navigate to settings */}}
          >
            <Text style={styles.actionButtonEmoji}>⚙️</Text>
            <Text style={styles.actionButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Agent ID: {agent.agent_id}
          </Text>
          <Text style={styles.footerText}>
            Powered by NEAR AI Intents
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
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#374151',
  },
  statusBadgeActive: {
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6B7280',
    marginRight: 6,
  },
  statusDotActive: {
    backgroundColor: '#4ECDC4',
  },
  statusText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  statusTextActive: {
    color: '#4ECDC4',
  },
  card: {
    backgroundColor: '#1E293B',
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 16,
  },
  pnlContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    marginBottom: 20,
  },
  pnlLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  pnlAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  pnlPositive: {
    color: '#10B981',
  },
  pnlNegative: {
    color: '#EF4444',
  },
  pnlPercentage: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  strategyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  strategyLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  strategyValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  strategyBadge: {
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pairRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  pairName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  pairStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  pairStatusText: {
    fontSize: 12,
    color: '#10B981',
  },
  actionsCard: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
});

export default AgentDashboardScreen;