import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const VaultSetupScreen = () => {
  const [vaultName, setVaultName] = useState('');
  const [chain, setChain] = useState<'SOL' | 'ZEC' | null>(null);
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const canProceed = vaultName && chain && email;

  const handleCreate = () => {
    if (canProceed) {
      navigation.navigate('VaultCreation', {
        vault_name: vaultName,
        chain,
        email,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Create Vault</Text>

          {/* Vault Name */}
          <View style={styles.section}>
            <Text style={styles.label}>Vault Name</Text>
            <TextInput
              style={styles.input}
              placeholder="My Wallet"
              placeholderTextColor="#6B7280"
              value={vaultName}
              onChangeText={setVaultName}
            />
          </View>

          {/* Chain Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Choose Blockchain</Text>

            <TouchableOpacity
              style={[
                styles.chainButton,
                chain === 'SOL' && styles.chainButtonActive,
              ]}
              onPress={() => setChain('SOL')}
            >
              <View style={styles.chainContent}>
                <Text style={styles.chainEmoji}>🟣</Text>
                <View>
                  <Text style={styles.chainName}>Solana</Text>
                  <Text style={styles.chainDescription}>Fast & low fees</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.chainButton,
                chain === 'ZEC' && styles.chainButtonActive,
              ]}
              onPress={() => setChain('ZEC')}
            >
              <View style={styles.chainContent}>
                <Text style={styles.chainEmoji}>🟡</Text>
                <View>
                  <Text style={styles.chainName}>Zcash</Text>
                  <Text style={styles.chainDescription}>Privacy-focused</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Email */}
          <View style={styles.section}>
            <Text style={styles.label}>Email (for recovery)</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor="#6B7280"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </ScrollView>

        <TouchableOpacity
          style={[styles.createButton, !canProceed && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={!canProceed}
        >
          <Text style={styles.createButtonText}>Create Vault</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  keyboardView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    color: '#FFFFFF',
    fontSize: 16,
  },
  chainButton: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  chainButtonActive: {
    borderColor: '#4F7FFF',
  },
  chainContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chainEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  chainName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  chainDescription: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  createButton: {
    backgroundColor: '#4F7FFF',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 16,
  },
  createButtonDisabled: {
    backgroundColor: '#374151',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VaultSetupScreen;
