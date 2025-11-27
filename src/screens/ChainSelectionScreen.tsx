import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChainSelection'>;

const ChainSelectionScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedChain, setSelectedChain] = useState('');

  const chains = [
    {
      id: 'SOL',
      name: 'Solana',
      emoji: '⚡',
      description: 'Fast & low-cost transactions',
      mpc: 'Arcium MPC',
      color: '#9945FF',
    },
    {
      id: 'ZEC',
      name: 'Zcash',
      emoji: '🔒',
      description: 'Privacy-focused transactions',
      mpc: 'Lit Protocol',
      color: '#F4B728',
    },
  ];

  const handleContinue = () => {
    if (selectedChain) {
      navigation.navigate('EmailInput', { chain: selectedChain });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Choose Your Blockchain</Text>
      <Text style={styles.subtitle}>
        Select which blockchain you want to create your MPC wallet on
      </Text>

      <View style={styles.chainsContainer}>
        {chains.map((chain) => (
          <TouchableOpacity
            key={chain.id}
            style={[
              styles.chainCard,
              selectedChain === chain.id && {
                borderColor: chain.color,
                borderWidth: 2,
              },
            ]}
            onPress={() => setSelectedChain(chain.id)}
          >
            <Text style={styles.chainEmoji}>{chain.emoji}</Text>
            <Text style={styles.chainName}>{chain.name}</Text>
            <Text style={styles.chainDescription}>{chain.description}</Text>
            <View style={styles.mpcBadge}>
              <Text style={styles.mpcText}>{chain.mpc}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.continueButton,
          !selectedChain && styles.continueButtonDisabled,
        ]}
        onPress={handleContinue}
        disabled={!selectedChain}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
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
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 40,
    lineHeight: 24,
  },
  chainsContainer: {
    gap: 16,
    marginBottom: 40,
  },
  chainCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  chainEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  chainName: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  chainDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  mpcBadge: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  mpcText: {
    color: '#4ECDC4',
    fontSize: 12,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#4ECDC4',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#374151',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChainSelectionScreen;