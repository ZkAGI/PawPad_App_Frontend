import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Clipboard,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import api from '../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type RoutePropType = RouteProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<NavigationProp>();
  const vault = route.params?.vault;
  
  const [chains, setChains] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!vault) {
      loadChains();
    }
  }, [vault]);

  const loadChains = async () => {
    try {
      setLoading(true);
      const data = await api.getTokens();
      if (data.supported_chains) {
        setChains(data.supported_chains);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddress = () => {
    if (vault?.address) {
      Clipboard.setString(vault.address);
      setCopied(true);
      Alert.alert('Copied!', 'Address copied to clipboard', [
        { text: 'OK', onPress: () => {} }
      ]);
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  if (vault) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.vaultName}>{vault.vault_name}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Vault Details</Text>
              <Text style={styles.chain}>{vault.chain}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{formatAddress(vault.address)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Address</Text>
              <Text style={styles.fullAddress}>{vault.address}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>MPC Provider</Text>
              <Text style={styles.infoValue}>{vault.mpc_provider}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Created</Text>
              <Text style={styles.infoValue}>
                {new Date(vault.created_at).toLocaleDateString()}
              </Text>
            </View>

            <TouchableOpacity 
              style={[styles.copyButton, copied && styles.copyButtonCopied]}
              onPress={copyAddress}
            >
              <Text style={styles.copyButtonText}>
                {copied ? '✓ Copied!' : 'Copy Full Address'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>$0.00</Text>
            <Text style={styles.balanceHint}>
              Send {vault.chain} to your address to get started
            </Text>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionEmoji}>📤</Text>
              <Text style={styles.actionText}>Send</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionEmoji}>📥</Text>
              <Text style={styles.actionText}>Receive</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Swap')}
            >
              <Text style={styles.actionEmoji}>🔄</Text>
              <Text style={styles.actionText}>Swap</Text>
            </TouchableOpacity>
          </View>

          {/* Agent Setup Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🤖 AI Trading Agent</Text>
            <Text style={styles.agentDescription}>
              Set up an automated trading agent powered by NEAR AI Intents
            </Text>
            <TouchableOpacity
              style={styles.setupAgentButton}
              onPress={() => navigation.navigate('AgentPreferences', { vault })}
            >
              <Text style={styles.setupAgentButtonText}>Setup AI Agent</Text>
            </TouchableOpacity>
          </View>

          {/* Fund Wallet Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>💰 Fund Your Wallet</Text>
            <Text style={styles.agentDescription}>
              Add {vault.chain} tokens to start trading
            </Text>
            <TouchableOpacity
              style={styles.fundButton}
              onPress={() => navigation.navigate('FundWallet', { vault })}
            >
              <Text style={styles.fundButtonText}>Add Funds</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.vaultName}>PawPad</Text>
          <Text style={styles.welcomeText}>Multi-Chain MPC Wallet</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={styles.actionButtonLarge}
            onPress={() => navigation.navigate('Swap')}
          >
            <Text style={styles.actionButtonText}>🔄 Cross-Chain Swap</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Supported Chains</Text>
          {loading ? (
            <ActivityIndicator color="#4ECDC4" size="large" />
          ) : (
            <View style={styles.chainsContainer}>
              {chains.map((chain, index) => (
                <View key={index} style={styles.chainBadge}>
                  <Text style={styles.chainText}>{chain}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by NEAR Intents</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 32,
  },
  welcomeText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  vaultName: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 16,
  },
  chain: {
    fontSize: 14,
    color: '#4ECDC4',
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  fullAddress: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
    fontFamily: 'monospace',
    flex: 1,
    textAlign: 'right',
  },
  copyButton: {
    backgroundColor: '#4F7FFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  copyButtonCopied: {
    backgroundColor: '#10B981',
  },
  copyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  balanceCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  balanceHint: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
  },
  actionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  actionButtonLarge: {
    backgroundColor: '#4ECDC4',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  agentDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
    marginBottom: 16,
  },
  setupAgentButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  setupAgentButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  fundButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  fundButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  chainsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chainBadge: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4ECDC4',
  },
  chainText: {
    color: '#4ECDC4',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 12,
  },
});

export default HomeScreen;