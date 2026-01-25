// screens/TEEWalletCreatedScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Share,
  Clipboard,
  Linking,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, VaultData } from '../types/navigation';
import {
  TEEWalletResponse,
  parseTOTPUri,
  generateBackupFileContent,
  generateBackupFilename,
} from '../services/teeSevice';
import RNFS from 'react-native-fs';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TEEWalletCreated'>;
type RouteProps = RouteProp<RootStackParamList, 'TEEWalletCreated'>;

const TEEWalletCreatedScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { walletData } = route.params;

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [backupSaved, setBackupSaved] = useState(false);

  const totpData = parseTOTPUri(walletData.totp.otpauth_uri);

  const copyToClipboard = (text: string, field: string) => {
    Clipboard.setString(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleSaveBackup = async () => {
    try {
      const backupContent = generateBackupFileContent(walletData.backup_file);
      const filename = generateBackupFilename(walletData.uid);

      // Try to share the backup file
      await Share.share({
        message: backupContent,
        title: filename,
      });

      setBackupSaved(true);
    } catch (error) {
      console.error('Backup save failed:', error);
      Alert.alert('Save Failed', 'Unable to save backup file. Please try again.');
    }
  };

  const handleExportBackupFile = async () => {
    try {
      const backupContent = generateBackupFileContent(walletData.backup_file);
      const filename = generateBackupFilename(walletData.uid);
      const path = `${RNFS.DocumentDirectoryPath}/${filename}`;

      await RNFS.writeFile(path, backupContent, 'utf8');

      Alert.alert(
        'Backup Saved',
        `Backup file saved to:\n${filename}`,
        [
          { text: 'Share', onPress: () => handleSaveBackup() },
          { text: 'OK' },
        ]
      );

      setBackupSaved(true);
    } catch (error) {
      // Fallback to share if RNFS fails
      handleSaveBackup();
    }
  };

  const handleOpenAuthenticator = () => {
    // Try to open authenticator app with TOTP URI
    Linking.openURL(walletData.totp.otpauth_uri).catch(() => {
      Alert.alert(
        'Setup Authenticator',
        `Add this account to your authenticator app:\n\nSecret: ${totpData.secret}\n\nOr scan the QR code in your authenticator app.`,
        [
          {
            text: 'Copy Secret',
            onPress: () => copyToClipboard(totpData.secret, 'totp'),
          },
          { text: 'OK' },
        ]
      );
    });
  };

  const handleViewTransaction = () => {
    const txHash = walletData.sapphire.tx.hash;
    const explorerUrl = `https://explorer.oasis.io/testnet/sapphire/tx/${txHash}`;
    Linking.openURL(explorerUrl);
  };

  const handleContinue = () => {
    if (!backupSaved) {
      Alert.alert(
        'Save Backup First',
        'Please save your backup file before continuing. You will need it to recover your wallet.',
        [
          { text: 'Save Backup', onPress: handleExportBackupFile },
          { text: 'Skip (Not Recommended)', style: 'destructive', onPress: () => navigateToMain() },
        ]
      );
    } else {
      navigateToMain();
    }
  };

  const navigateToMain = () => {
    // Convert TEE wallet data to VaultData format and navigate to Home
    const vault: VaultData = {
      vault_id: walletData.uid,
      vault_name: 'TEE Wallet',
      vault_type: 'tee',
      wallet_type: 'tee',
      created_at: new Date().toISOString(),
      tee: {
        uid: walletData.uid,
        evm: walletData.wallets.evm,
        solana: walletData.wallets.solana,
        backup_hash: walletData.backup_hash,
        sapphire_tx: walletData.sapphire.tx.hash,
      },
    };

    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Home',
          params: {
            vault,
          },
        },
      ],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Header */}
        <View style={styles.successHeader}>
          <View style={styles.successIcon}>
            <Text style={styles.successEmoji}>🛡️</Text>
          </View>
          <Text style={styles.successTitle}>TEE Wallet Created!</Text>
          <Text style={styles.successSubtitle}>
            Your keys are secured in a Trusted Execution Environment
          </Text>
        </View>

        {/* Wallet Addresses Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Wallets</Text>

          {/* EVM Wallet */}
          <View style={styles.walletCard}>
            <View style={styles.walletHeader}>
              <View style={styles.chainIcon}>
                <Text style={styles.chainEmoji}>🔷</Text>
              </View>
              <View style={styles.walletInfo}>
                <Text style={styles.chainName}>Base (EVM)</Text>
                <Text style={styles.chainLabel}>{walletData.wallets.evm.chain}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.addressRow}
              onPress={() => copyToClipboard(walletData.wallets.evm.address, 'evm')}
            >
              <Text style={styles.addressText}>
                {truncateAddress(walletData.wallets.evm.address)}
              </Text>
              <Text style={styles.copyIcon}>
                {copiedField === 'evm' ? '✓' : '📋'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Solana Wallet */}
          <View style={styles.walletCard}>
            <View style={styles.walletHeader}>
              <View style={styles.chainIcon}>
                <Text style={styles.chainEmoji}>◎</Text>
              </View>
              <View style={styles.walletInfo}>
                <Text style={styles.chainName}>Solana</Text>
                <Text style={styles.chainLabel}>Mainnet</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.addressRow}
              onPress={() => copyToClipboard(walletData.wallets.solana.address, 'solana')}
            >
              <Text style={styles.addressText}>
                {truncateAddress(walletData.wallets.solana.address)}
              </Text>
              <Text style={styles.copyIcon}>
                {copiedField === 'solana' ? '✓' : '📋'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Backup Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Backup & Recovery</Text>
          
          {/* Backup File Card */}
          <View style={[styles.backupCard, backupSaved && styles.backupCardSaved]}>
            <View style={styles.backupHeader}>
              <View style={styles.backupIcon}>
                <Text style={styles.backupEmoji}>{backupSaved ? '✅' : '📄'}</Text>
              </View>
              <View style={styles.backupInfo}>
                <Text style={styles.backupTitle}>Encrypted Backup File</Text>
                <Text style={styles.backupSubtitle}>
                  {backupSaved ? 'Backup saved successfully' : 'Required for wallet recovery'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.backupButton, backupSaved && styles.backupButtonSaved]}
              onPress={handleExportBackupFile}
            >
              <Text style={styles.backupButtonText}>
                {backupSaved ? 'Download Again' : 'Save Backup File'}
              </Text>
            </TouchableOpacity>

            {/* Backup Details */}
            <View style={styles.backupDetails}>
              <View style={styles.backupDetailRow}>
                <Text style={styles.backupDetailLabel}>UID</Text>
                <Text style={styles.backupDetailValue}>
                  {walletData.uid.substring(0, 16)}...
                </Text>
              </View>
              <View style={styles.backupDetailRow}>
                <Text style={styles.backupDetailLabel}>Backup Hash</Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard(walletData.backup_hash, 'hash')}
                >
                  <Text style={styles.backupDetailValueLink}>
                    {truncateAddress(walletData.backup_hash)}
                    {copiedField === 'hash' ? ' ✓' : ' 📋'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* TOTP Authenticator Card */}
          <View style={styles.totpCard}>
            <View style={styles.totpHeader}>
              <View style={styles.totpIcon}>
                <Text style={styles.totpEmoji}>🔐</Text>
              </View>
              <View style={styles.totpInfo}>
                <Text style={styles.totpTitle}>Authenticator App</Text>
                <Text style={styles.totpSubtitle}>
                  Required for backup decryption
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.totpButton}
              onPress={handleOpenAuthenticator}
            >
              <Text style={styles.totpButtonText}>Setup Authenticator</Text>
            </TouchableOpacity>

            <View style={styles.totpDetails}>
              <View style={styles.totpDetailRow}>
                <Text style={styles.totpDetailLabel}>Secret</Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard(totpData.secret, 'totp')}
                >
                  <Text style={styles.totpDetailValue}>
                    {totpData.secret}
                    {copiedField === 'totp' ? ' ✓' : ' 📋'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.totpHint}>
                Add this to Google Authenticator, Authy, or similar app
              </Text>
            </View>
          </View>
        </View>

        {/* On-Chain Verification */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>On-Chain Verification</Text>
          <View style={styles.verificationCard}>
            <View style={styles.verificationRow}>
              <Text style={styles.verificationLabel}>Status</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {walletData.sapphire.ok ? '✓ Verified' : '⏳ Pending'}
                </Text>
              </View>
            </View>
            <View style={styles.verificationRow}>
              <Text style={styles.verificationLabel}>Block</Text>
              <Text style={styles.verificationValue}>
                #{walletData.sapphire.tx.blockNumber}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.viewTxButton}
              onPress={handleViewTransaction}
            >
              <Text style={styles.viewTxText}>View on Oasis Explorer →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Warning Note */}
        <View style={styles.warningContainer}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            Store your backup file securely. You'll need both the backup file AND your 
            authenticator app to recover your wallet. Never share these with anyone.
          </Text>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !backupSaved && styles.continueButtonWarning,
          ]}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            {backupSaved ? 'Continue to Wallet' : 'Save Backup & Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1426',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successEmoji: {
    fontSize: 40,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  walletCard: {
    backgroundColor: '#0F1C2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  walletHeader: {
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
    fontSize: 20,
  },
  walletInfo: {
    flex: 1,
  },
  chainName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chainLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#D1D5DB',
  },
  copyIcon: {
    fontSize: 16,
  },
  backupCard: {
    backgroundColor: '#0F1C2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  backupCardSaved: {
    borderColor: '#10B981',
  },
  backupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backupIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backupEmoji: {
    fontSize: 20,
  },
  backupInfo: {
    flex: 1,
  },
  backupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  backupSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  backupButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  backupButtonSaved: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  backupButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  backupDetails: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
  },
  backupDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  backupDetailLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  backupDetailValue: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: '#D1D5DB',
  },
  backupDetailValueLink: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: '#4ECDC4',
  },
  totpCard: {
    backgroundColor: '#0F1C2E',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  totpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  totpIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  totpEmoji: {
    fontSize: 20,
  },
  totpInfo: {
    flex: 1,
  },
  totpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  totpSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  totpButton: {
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  totpButtonText: {
    color: '#4ECDC4',
    fontSize: 15,
    fontWeight: '600',
  },
  totpDetails: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
  },
  totpDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totpDetailLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  totpDetailValue: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#4ECDC4',
  },
  totpHint: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  verificationCard: {
    backgroundColor: '#0F1C2E',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  verificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  verificationLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  verificationValue: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#D1D5DB',
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '600',
  },
  viewTxButton: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  viewTxText: {
    color: '#4ECDC4',
    fontSize: 14,
    fontWeight: '500',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },
  warningIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  warningText: {
    flex: 1,
    color: '#FFC107',
    fontSize: 13,
    lineHeight: 19,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 12,
  },
  continueButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonWarning: {
    backgroundColor: '#FF6B6B',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default TEEWalletCreatedScreen;