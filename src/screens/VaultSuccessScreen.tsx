import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VaultSuccess'>;
type RoutePropType = RouteProp<RootStackParamList, 'VaultSuccess'>;

const VaultSuccessScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { vault } = route.params;

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.successEmoji}>✅</Text>
        
        <Text style={styles.title}>Vault Created!</Text>
        <Text style={styles.subtitle}>
          Your MPC wallet is ready to use
        </Text>

        <View style={styles.vaultCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Vault Name</Text>
            <Text style={styles.value}>{vault.vault_name}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Chain</Text>
            <Text style={styles.chainBadge}>{vault.chain}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>{formatAddress(vault.address)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>MPC Provider</Text>
            <Text style={styles.value}>{vault.mpc_provider}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace('Home', { vault })}
        >
          <Text style={styles.buttonText}>Go to Wallet</Text>
        </TouchableOpacity>
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
  successEmoji: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 40,
  },
  vaultCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  value: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  chainBadge: {
    fontSize: 14,
    color: '#4ECDC4',
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#4ECDC4',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VaultSuccessScreen;