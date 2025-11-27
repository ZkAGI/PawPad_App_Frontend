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
import { RootStackParamList } from '../types/navigation';
import axios from 'axios';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AgentCreating'>;
type RoutePropType = RouteProp<RootStackParamList, 'AgentCreating'>;

const AgentCreatingScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
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
      
      // Use existing AI chat endpoint to create agent
      const message = `Create trading agent for vault ${vault.vault_id} with risk level ${preferences.risk_level}, trading pairs: ${preferences.trading_pairs.join(', ')}, cross-chain: ${preferences.cross_chain_swaps}, dark pool: ${preferences.dark_pool_trading}`;
      
      const response = await axios.post('http://10.0.2.2:3000/api/ai/chat', {
        user_id: vault.vault_id,
        message: message,
      });

      if (response.data.success) {
        setStatus('Agent created successfully!');
        
        // Create agent object from response
        const agent = {
          agent_id: `agent_${Date.now()}`,
          vault_id: vault.vault_id,
          preferences: preferences,
          created_at: new Date().toISOString(),
        };
        
        await sleep(1500);
        navigation.replace('AgentDashboard', { vault, agent });
      } else {
        throw new Error(response.data.error || 'Failed to create agent');
      }
    } catch (err: any) {
      console.error('Agent creation error:', err);
      setError(err.message || 'Failed to create agent');
      setStatus('Error');
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
          <Text style={styles.infoText}>Trading Pairs: {preferences.trading_pairs.length}</Text>
          <Text style={styles.infoText}>Cross-Chain: {preferences.cross_chain_swaps ? 'Enabled' : 'Disabled'}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

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
  },
  infoText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
});

export default AgentCreatingScreen;