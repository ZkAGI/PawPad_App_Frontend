import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'EmailInput'>;
type RoutePropType = RouteProp<RootStackParamList, 'EmailInput'>;

const EmailInputScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { chain } = route.params;
  const [email, setEmail] = useState('');

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleContinue = () => {
  if (isValidEmail(email)) {
    navigation.navigate('VaultNameInput', { chain, email }); 
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Enter Your Email</Text>
        <Text style={styles.subtitle}>
          We'll use this to identify your vault and help with recovery
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="your.email@example.com"
            placeholderTextColor="#6B7280"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <Text style={styles.inputHint}>
            Selected chain: <Text style={styles.chainText}>{chain}</Text>
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🔒 Privacy Notice</Text>
          <Text style={styles.infoText}>
            Your email is only used for vault identification. Your private keys
            are secured by MPC and never stored with your email.
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            !isValidEmail(email) && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!isValidEmail(email)}
        >
          <Text style={styles.continueButtonText}>Create Vault</Text>
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
  content: {
    flex: 1,
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
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#374151',
  },
  inputHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  chainText: {
    color: '#4ECDC4',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
  },
  infoTitle: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: '#4ECDC4',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
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

export default EmailInputScreen;