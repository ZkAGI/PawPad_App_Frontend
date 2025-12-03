/**
 * AgentCreatingScreen.tsx - FIXED
 * 
 * Shows loading animation while creating AI agent
 * Then navigates to AgentDashboard
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, VaultData, AgentPreferences } from '../types/navigation';
import api from '../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AgentCreating'>;
type AgentCreatingRouteProp = RouteProp<RootStackParamList, 'AgentCreating'>;

const AgentCreatingScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AgentCreatingRouteProp>();
  const { vault, preferences } = route.params;
  
  const [status, setStatus] = useState('Initializing AI Agent...');
  const [error, setError] = useState('');

  useEffect(() => {
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
      
      // Create agent via API
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
        
        // Create agent object from response
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
      
      // Still navigate to dashboard after error (will show empty state)
      await sleep(2000);
      navigation.replace('AgentDashboard', { vault });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.animationContainer}>
          {error ? (
            <Text style={styles.errorEmoji}>❌</Text>
          ) : (
            <ActivityIndicator size="large" color="#4ECDC4" />
          )}
        </View>

        <Text style={styles.title}>
          {error ? 'Creation Failed' : 'Creating Your AI Agent'}
        </Text>
        
        <Text style={styles.status}>
          {error || status}
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>Vault: {vault.vault_name}</Text>
          <Text style={styles.infoText}>Risk Level: {preferences.risk_level}</Text>
          <Text style={styles.infoText}>Trading Pairs: {preferences.trading_pairs?.length || 0}</Text>
          <Text style={styles.infoText}>Cross-Chain: {preferences.cross_chain_swaps ? 'Enabled' : 'Disabled'}</Text>
          <Text style={styles.infoText}>Dark Pool: {preferences.dark_pool_trading ? 'Enabled' : 'Disabled'}</Text>
        </View>

        {/* What's being set up */}
        <View style={styles.setupList}>
          <SetupItem 
            icon="🏊" 
            title="Dark Pool Trading" 
            enabled={preferences.dark_pool_trading}
            status={status.includes('trading') ? 'loading' : 'done'}
          />
          <SetupItem 
            icon="🔄" 
            title="Cross-Chain Swaps" 
            enabled={preferences.cross_chain_swaps}
            status={status.includes('trading') ? 'loading' : 'done'}
          />
          <SetupItem 
            icon="📊" 
            title="Signal Integration" 
            enabled={true}
            status={status.includes('agent') ? 'loading' : 'done'}
          />
          <SetupItem 
            icon="🏦" 
            title="Lending Protection" 
            enabled={preferences.enable_lending || false}
            status={status.includes('success') ? 'done' : 'pending'}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

// Setup item component
const SetupItem = ({ 
  icon, 
  title, 
  enabled, 
  status 
}: { 
  icon: string; 
  title: string; 
  enabled: boolean;
  status: 'pending' | 'loading' | 'done';
}) => (
  <View style={styles.setupItem}>
    <Text style={styles.setupIcon}>{icon}</Text>
    <Text style={styles.setupTitle}>{title}</Text>
    <View style={styles.setupStatus}>
      {!enabled ? (
        <Text style={styles.setupDisabled}>Off</Text>
      ) : status === 'loading' ? (
        <ActivityIndicator size="small" color="#4ECDC4" />
      ) : status === 'done' ? (
        <Text style={styles.setupDone}>✓</Text>
      ) : (
        <Text style={styles.setupPending}>...</Text>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  animationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  errorEmoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  status: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 40,
  },
  infoCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  setupList: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
  },
  setupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  setupIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  setupTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },
  setupStatus: {
    width: 30,
    alignItems: 'center',
  },
  setupDisabled: {
    color: '#6B7280',
    fontSize: 12,
  },
  setupDone: {
    color: '#22C55E',
    fontSize: 18,
    fontWeight: 'bold',
  },
  setupPending: {
    color: '#6B7280',
    fontSize: 12,
  },
});

export default AgentCreatingScreen;