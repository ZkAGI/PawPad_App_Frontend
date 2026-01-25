// screens/TEESetupScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  TextInput,
  ActivityIndicator,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, VaultData } from '../types/navigation';
import Clipboard from '@react-native-clipboard/clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TEESetup'>;
type RouteType = RouteProp<RootStackParamList, 'TEESetup'>;

const COLORS = {
  bgPrimary: '#02111B',
  bgCard: '#0D2137',
  accent: '#33E6BF',
  accentRed: '#FF6B6B',
  textPrimary: '#FFFFFF',
  textSecondary: '#8A9BAE',
  textMuted: '#5A6B7E',
  border: 'rgba(42, 82, 152, 0.3)',
};

const TEESetupScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { vault } = route.params;

  const [step, setStep] = useState<'totp' | 'backup'>('totp');
  const [totpCopied, setTotpCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [backupSaved, setBackupSaved] = useState(false);

  // Parse TOTP URI
  const parseTOTPUri = (uri: string) => {
    const secretMatch = uri.match(/[?&]secret=([^&]+)/);
    const issuerMatch = uri.match(/[?&]issuer=([^&]+)/);
    return {
      secret: secretMatch ? decodeURIComponent(secretMatch[1]) : '',
      issuer: issuerMatch ? decodeURIComponent(issuerMatch[1]) : 'PawPad',
    };
  };

  const totpData = vault.totp ? parseTOTPUri(vault.totp.otpauth_uri) : { secret: '', issuer: '' };
  const otpauthUri = vault.totp?.otpauth_uri || '';

  const copyTOTPSecret = () => {
    if (totpData.secret) {
      Clipboard.setString(totpData.secret);
      setTotpCopied(true);
      setTimeout(() => setTotpCopied(false), 2000);
    }
  };

  const openAuthenticator = () => {
    if (vault.totp?.otpauth_uri) {
      Linking.openURL(vault.totp.otpauth_uri).catch(() => {
        Alert.alert(
          'Open Authenticator',
          'Please open Google Authenticator or Authy and scan the QR code, or manually enter the secret key.',
          [{ text: 'Copy Secret', onPress: copyTOTPSecret }, { text: 'OK' }]
        );
      });
    }
  };

  const handleTOTPContinue = () => {
    setStep('backup');
  };

  const generateBackupContent = () => {
    if (!vault.backup_file) return '';
    return JSON.stringify(vault.backup_file, null, 2);
  };

  const handleDownloadBackup = async () => {
    try {
      const backupContent = generateBackupContent();
      await Share.share({
        message: backupContent,
        title: `pawpad-tee-backup-${vault.vault_id.substring(0, 8)}.json`,
      });
      setBackupSaved(true);
    } catch (error) {
      console.error('Backup share failed:', error);
      Alert.alert('Error', 'Failed to share backup file');
    }
  };

  const handleEmailBackup = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address');
      return;
    }

    setSendingEmail(true);
    try {
      // For now, open email client with backup content
      const backupContent = generateBackupContent();
      const subject = encodeURIComponent('PawPad TEE Wallet Backup');
      const body = encodeURIComponent(
        `Your PawPad TEE Wallet Backup\n\n` +
        `IMPORTANT: Keep this file secure. You will need it along with your authenticator app to recover your wallet.\n\n` +
        `Backup Data:\n${backupContent}\n\n` +
        `Wallet Addresses:\n` +
        `EVM (Base): ${vault.tee?.evm?.address || 'N/A'}\n` +
        `Solana: ${vault.tee?.solana?.address || 'N/A'}\n`
      );
      
      await Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`);
      setBackupSaved(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to open email client');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleComplete = async () => {
    if (!backupSaved) {
      Alert.alert(
        'Save Backup First',
        'Please save or email your backup file before continuing. You need it to recover your wallet.',
        [
          { text: 'Save Backup', onPress: handleDownloadBackup },
          { text: 'Skip (Not Recommended)', style: 'destructive', onPress: goToHome },
        ]
      );
      return;
    }
    goToHome();
  };

  const goToHome = async () => {
    // Save vault to AsyncStorage
    try {
      await AsyncStorage.setItem('tee_wallet', JSON.stringify(vault));
      await AsyncStorage.setItem('active_wallet_type', 'tee');
    } catch (error) {
      console.error('Failed to save wallet:', error);
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'Home', params: { vault } }],
    });
  };

  const formatAddress = (address: string | undefined) => {
    if (!address) return '';
    return `${address.slice(0, 10)}...${address.slice(-8)}`;
  };

  // TOTP Setup Step
  if (step === 'totp') {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.stepIndicator}>
                <View style={[styles.stepDot, styles.stepDotActive]} />
                <View style={styles.stepLine} />
                <View style={styles.stepDot} />
              </View>
              <Text style={styles.stepText}>Step 1 of 2</Text>
            </View>

            {/* Icon */}
            <View style={styles.iconContainer}>
              <Text style={styles.iconEmoji}>🔐</Text>
            </View>

            <Text style={styles.title}>Setup Authenticator</Text>
            <Text style={styles.subtitle}>
              Scan this QR code with Google Authenticator, Authy, or any TOTP app.
              You'll need this to recover your wallet.
            </Text>

            {/* QR Code */}
            {otpauthUri ? (
              <View style={styles.qrContainer}>
                <View style={styles.qrBackground}>
                  <QRCode
                    value={otpauthUri}
                    size={180}
                    backgroundColor="#FFFFFF"
                    color="#000000"
                  />
                </View>
                <Text style={styles.qrHint}>Scan with authenticator app</Text>
              </View>
            ) : null}

            {/* Or Divider */}
            <View style={styles.orDivider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or enter manually</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* TOTP Secret Card */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Secret Key</Text>
              <View style={styles.secretRow}>
                <Text style={styles.secretText}>{totpData.secret}</Text>
                <TouchableOpacity onPress={copyTOTPSecret} style={styles.copyBtn}>
                  <Text style={styles.copyBtnText}>{totpCopied ? '✓' : '📋'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Open Authenticator Button */}
            <TouchableOpacity style={styles.secondaryButton} onPress={openAuthenticator}>
              <Text style={styles.secondaryButtonText}>Open Authenticator App</Text>
            </TouchableOpacity>

            {/* Wallet Preview */}
            <View style={styles.walletPreview}>
              <Text style={styles.previewTitle}>Your Wallets</Text>
              
              <View style={styles.walletRow}>
                <View style={[styles.chainIcon, { backgroundColor: 'rgba(98, 126, 234, 0.2)' }]}>
                  <Text style={styles.chainEmoji}>🔷</Text>
                </View>
                <View style={styles.walletInfo}>
                  <Text style={styles.chainName}>Base (EVM)</Text>
                  <Text style={styles.walletAddress}>
                    {formatAddress(vault.tee?.evm?.address)}
                  </Text>
                </View>
              </View>

              <View style={styles.walletRow}>
                <View style={[styles.chainIcon, { backgroundColor: 'rgba(153, 69, 255, 0.2)' }]}>
                  <Text style={styles.chainEmoji}>◎</Text>
                </View>
                <View style={styles.walletInfo}>
                  <Text style={styles.chainName}>Solana</Text>
                  <Text style={styles.walletAddress}>
                    {formatAddress(vault.tee?.solana?.address)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Continue Button */}
            <TouchableOpacity style={styles.primaryButton} onPress={handleTOTPContinue}>
              <Text style={styles.primaryButtonText}>I've Added to Authenticator</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // Backup Step
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.stepIndicator}>
              <View style={[styles.stepDot, styles.stepDotComplete]} />
              <View style={[styles.stepLine, styles.stepLineComplete]} />
              <View style={[styles.stepDot, styles.stepDotActive]} />
            </View>
            <Text style={styles.stepText}>Step 2 of 2</Text>
          </View>

          {/* Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.iconEmoji}>📄</Text>
          </View>

          <Text style={styles.title}>Save Backup File</Text>
          <Text style={styles.subtitle}>
            Download or email your encrypted backup file. You'll need this AND your
            authenticator app to recover your wallet.
          </Text>

          {/* Download Button */}
          <TouchableOpacity
            style={[styles.primaryButton, backupSaved && styles.buttonSuccess]}
            onPress={handleDownloadBackup}
          >
            <Text style={styles.primaryButtonText}>
              {backupSaved ? '✓ Backup Saved' : 'Download Backup File'}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email Backup */}
          <View style={styles.emailSection}>
            <Text style={styles.emailLabel}>Email backup to yourself</Text>
            <TextInput
              style={styles.emailInput}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleEmailBackup}
              disabled={sendingEmail}
            >
              {sendingEmail ? (
                <ActivityIndicator color={COLORS.accent} />
              ) : (
                <Text style={styles.secondaryButtonText}>Send to Email</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Warning */}
          <View style={styles.warningCard}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>
              Store your backup file securely. Never share it with anyone.
              You need BOTH the backup file AND authenticator to recover.
            </Text>
          </View>

          {/* Complete Button */}
          <TouchableOpacity
            style={[
              styles.completeButton,
              !backupSaved && styles.completeButtonDisabled,
            ]}
            onPress={handleComplete}
          >
            <Text style={styles.completeButtonText}>
              {backupSaved ? 'Go to Wallet' : 'Save Backup to Continue'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.border,
  },
  stepDotActive: {
    backgroundColor: COLORS.accent,
  },
  stepDotComplete: {
    backgroundColor: COLORS.accent,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.border,
    marginHorizontal: 8,
  },
  stepLineComplete: {
    backgroundColor: COLORS.accent,
  },
  stepText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(51, 230, 191, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  iconEmoji: {
    fontSize: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  // QR Code Styles
  qrContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrBackground: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  qrHint: {
    marginTop: 12,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  // Or Divider
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  secretRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  secretText: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: COLORS.accent,
    flex: 1,
  },
  copyBtn: {
    padding: 8,
  },
  copyBtnText: {
    fontSize: 18,
  },
  primaryButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: COLORS.bgPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSuccess: {
    backgroundColor: '#10B981',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.accent,
    marginBottom: 16,
  },
  secondaryButtonText: {
    color: COLORS.accent,
    fontSize: 15,
    fontWeight: '500',
  },
  walletPreview: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 16,
    marginVertical: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  previewTitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 16,
  },
  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  chainIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chainEmoji: {
    fontSize: 18,
  },
  walletInfo: {
    flex: 1,
  },
  chainName: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  walletAddress: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontFamily: 'monospace',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    color: COLORS.textMuted,
    marginHorizontal: 16,
    fontSize: 13,
  },
  emailSection: {
    marginBottom: 24,
  },
  emailLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  emailInput: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 16,
    color: COLORS.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
    marginBottom: 24,
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  warningText: {
    flex: 1,
    color: '#FFC107',
    fontSize: 13,
    lineHeight: 20,
  },
  completeButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  completeButtonDisabled: {
    backgroundColor: 'rgba(51, 230, 191, 0.3)',
  },
  completeButtonText: {
    color: COLORS.bgPrimary,
    fontSize: 17,
    fontWeight: '600',
  },
});

export default TEESetupScreen;