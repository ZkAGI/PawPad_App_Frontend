import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import BackendService from '../services/BackendService';

const VaultCreationScreen = () => {
  const [status, setStatus] = useState('Creating vault...');
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { vault_name, chain, email } = route.params;

  useEffect(() => {
    createVault();
  }, []);

  const createVault = async () => {
    try {
      setStatus('Connecting to backend...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStatus('Initializing MPC...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStatus('Creating vault...');
      const vault = await BackendService.createVault({
        vault_name,
        chain,
        email,
      });

      setStatus('Vault created successfully!');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Navigate to home with vault data
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home', params: { vault } }],
      });
    } catch (err) {
      console.error('Vault creation error:', err);
      setError(err.message || 'Failed to create vault');
      setStatus('Error occurred');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Creating Your Vault</Text>

        {!error ? (
          <>
            <ActivityIndicator size="large" color="#4ECDC4" style={styles.loader} />
            <Text style={styles.status}>{status}</Text>
            <Text style={styles.description}>
              This will take a few seconds...
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.error}>❌</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.errorHint}>
              Make sure your backend is running on http://localhost:3000
            </Text>
          </>
        )}
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 40,
    textAlign: 'center',
  },
  loader: {
    marginBottom: 24,
  },
  status: {
    fontSize: 18,
    color: '#4ECDC4',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  error: {
    fontSize: 60,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FF4F4F',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorHint: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

export default VaultCreationScreen;
