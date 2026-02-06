// screens/CreatingSeedlessVaultScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  TextInput,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, VaultData } from '../types/navigation';
import { useVaults } from '../context/VaultContext';
import Clipboard from '@react-native-clipboard/clipboard';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import * as Keychain from 'react-native-keychain';
import api from '../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatingSeedlessVault'>;
type RoutePropType = RouteProp<RootStackParamList, 'CreatingSeedlessVault'>;

type Step = 'creating' | 'scan_qr' | 'verify_totp' | 'download_backup' | 'done';

const CreatingSeedlessVaultScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  
  const email = route.params?.email || '';
  const vaultName = route.params?.vaultName || 'My Seedless Wallet';
  
  const { addVault } = useVaults();
  
  // ═══════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════
  const [step, setStep] = useState<Step>('creating');
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  
  // Wallet data from backend
  const [walletData, setWalletData] = useState<any>(null);
  const [vaultData, setVaultData] = useState<VaultData | null>(null);
  
  // TOTP
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  
  // Backup
  const [backupDownloaded, setBackupDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  
  // UI
  const [copiedSecret, setCopiedSecret] = useState(false);

  // ═══════════════════════════════════════════════════════════════
  // STEP 1: CREATE WALLET
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    createSeedlessWallet();
  }, []);

  const createSeedlessWallet = async () => {
    try {
      setStatus('Creating seedless wallet...');
      setProgress(20);

      // Generate a user ID (use actual user ID from auth in production)
      const userId = `user_${Date.now()}`;

      console.log('🔐 Creating seedless vault:', { userId, vaultName });

      // Call backend
      const response = await api.createSeedlessVault(userId);

      if (response.ok) {
        setProgress(50);
        setStatus('Wallet created!');

        // Store wallet data
        setWalletData(response);
        setQrCode(response.totp.qrCode);
        setTotpSecret(response.totp.secret);

        // Build vault data for storage
        // const newVaultData: VaultData = {
        //   vault_id: response.walletId,
        //   vault_name: vaultName,
        //   vault_type: 'personal',
        //   wallet_type: 'seedless',
        //   email: email,
        //   created_at: new Date().toISOString(),
        //   sol: {
        //     address: response.publicKey, // Public key as address
        //     mpc_provider: 'oasis-tee',
        //   },
        // };
        // In createSeedlessWallet function, update the vault data creation:

        const newVaultData: VaultData = {
        vault_id: response.walletId,
        vault_name: vaultName,
        vault_type: 'personal',
        wallet_type: 'seedless',
        chain: 'ZEC',  // Seedless = ZEC
        email: email,
        publicKey: response.publicKey,  // Store public key
        created_at: new Date().toISOString(),
        zec: {  // Use zec, not sol
            address: response.publicKey,
            provider: 'oasis-tee',
        },
        oasis: response.oasis,
        };

        setVaultData(newVaultData);

        // Store device share securely
        await Keychain.setGenericPassword(
        `seedless_share_${response.walletId}`,
        response.deviceShare,
        { service: `seedless_share_${response.walletId}` }
        );


        // Move to QR scan step
        setStep('scan_qr');
        setProgress(60);

      } else {
        throw new Error(response.error || 'Failed to create wallet');
      }

    } catch (err: any) {
      console.error('Seedless wallet creation error:', err);
      setError(err.message || 'Failed to create wallet');
      setStatus('Error');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // STEP 2: SCAN QR CODE (User action)
  // ═══════════════════════════════════════════════════════════════
  const proceedToVerify = () => {
    setStep('verify_totp');
    setProgress(70);
  };

  const copyTotpSecret = () => {
    if (totpSecret) {
      Clipboard.setString(totpSecret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // STEP 3: VERIFY TOTP CODE
  // ═══════════════════════════════════════════════════════════════
  const verifyTotpCode = async () => {
    if (totpCode.length !== 6) {
      Alert.alert('Error', 'Please enter a 6-digit code');
      return;
    }

    setVerifying(true);

    try {
      const response = await api.verifySeedlessTOTP(totpSecret!, totpCode);

      if (response.valid) {
        // Store TOTP secret securely (needed for recovery)
       await Keychain.setGenericPassword(
        `seedless_totp_${walletData.walletId}`,
        totpSecret!,
        { service: `seedless_totp_${walletData.walletId}` }
        );

        setStep('download_backup');
        setProgress(85);
      } else {
        Alert.alert('Invalid Code', 'The code you entered is incorrect. Please try again.');
        setTotpCode('');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Verification failed');
    }

    setVerifying(false);
  };

  // ═══════════════════════════════════════════════════════════════
  // STEP 4: DOWNLOAD BACKUP
  // ═══════════════════════════════════════════════════════════════
  const downloadBackup = async () => {
    if (!walletData?.backupFile) {
      Alert.alert('Error', 'No backup file available');
      return;
    }

    setDownloading(true);

    try {
      const filename = walletData.backupFile.filename;
      const content = walletData.backupFile.content;

      const tempPath = `${RNFS.CachesDirectoryPath}/${filename}`;
      await RNFS.writeFile(tempPath, content, 'utf8');

      // Android: Also save to Downloads
      if (Platform.OS === 'android') {
        try {
          const downloadPath = `${RNFS.DownloadDirectoryPath}/${filename}`;
          await RNFS.copyFile(tempPath, downloadPath);
        } catch (e) {
          console.log('Download folder save failed:', e);
        }
      }

      // Share/Save dialog
      await Share.open({
        title: 'Save PawPad Seedless Backup',
        url: `file://${tempPath}`,
        type: 'application/json',
        filename,
        saveToFiles: true,
      });

      setBackupDownloaded(true);
      setProgress(100);

    } catch (error: any) {
      if (!error.message?.includes('cancel')) {
        Alert.alert('Error', 'Failed to save backup. Copy to clipboard?', [
          { text: 'No', style: 'cancel' },
          {
            text: 'Copy',
            onPress: () => {
              Clipboard.setString(walletData.backupFile.content);
              setBackupDownloaded(true);
              Alert.alert('Copied!', 'Backup copied to clipboard. Save it securely!');
            },
          },
        ]);
      }
    }

    setDownloading(false);
  };

  // ═══════════════════════════════════════════════════════════════
  // STEP 5: COMPLETE - GO TO SUCCESS
  // ═══════════════════════════════════════════════════════════════
  const completeSetup = async () => {
    if (!backupDownloaded) {
      Alert.alert(
        '⚠️ Backup Not Saved',
        'You need BOTH the backup file AND Google Authenticator to recover your wallet. Are you sure you want to skip?',
        [
          { text: 'Save Backup', onPress: downloadBackup },
          {
            text: 'Skip (Risky!)',
            style: 'destructive',
            onPress: () => finishSetup(),
          },
        ]
      );
    } else {
      finishSetup();
    }
  };

//   const finishSetup = async () => {
//     if (vaultData) {
//       await addVault(vaultData);
//       navigation.replace('VaultSuccess', { 
//         vault: vaultData,
//         walletType: 'seedless'
//       });
//     }
//   };
    const finishSetup = async () => {
        if (vaultData) {
            await addVault(vaultData);
            
            // Go directly to Home, skip VaultSuccess (backup already done)
            navigation.reset({
            index: 0,
            routes: [{ 
                name: 'Home', 
                params: { vault: vaultData }
            }],
            });
        }
    };

  // ═══════════════════════════════════════════════════════════════
  // RENDER: CREATING STEP
  // ═══════════════════════════════════════════════════════════════
  if (step === 'creating') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          {error ? (
            <>
              <Text style={styles.errorEmoji}>❌</Text>
              <Text style={styles.title}>Creation Failed</Text>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
                <Text style={styles.retryButtonText}>← Go Back</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <ActivityIndicator size="large" color="#4ECDC4" />
              <View style={styles.seedlessBadge}>
                <Text style={styles.seedlessBadgeText}>🔐 SEEDLESS</Text>
              </View>
              <Text style={styles.title}>Creating Seedless Wallet</Text>
              <Text style={styles.status}>{status}</Text>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{progress}%</Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>What's happening:</Text>
                <Text style={styles.infoItem}>🔑 Generating secure key shares</Text>
                <Text style={styles.infoItem}>🛡️ Storing Share 2 in Oasis TEE</Text>
                <Text style={styles.infoItem}>📱 Setting up Google Authenticator</Text>
              </View>
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: SCAN QR STEP
  // ═══════════════════════════════════════════════════════════════
  if (step === 'scan_qr') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.stepBadge}>Step 1 of 3</Text>
            <Text style={styles.title}>Setup Google Authenticator</Text>
            <Text style={styles.subtitle}>
              Scan this QR code with Google Authenticator app
            </Text>
          </View>

          {/* QR Code */}
          {qrCode && (
            <View style={styles.qrContainer}>
              <Image source={{ uri: qrCode }} style={styles.qrCode} />
            </View>
          )}

          {/* Manual entry option */}
          <View style={styles.manualEntry}>
            <Text style={styles.manualLabel}>Or enter manually:</Text>
            <TouchableOpacity style={styles.secretBox} onPress={copyTotpSecret}>
              <Text style={styles.secretText} numberOfLines={1}>
                {totpSecret}
              </Text>
              <Text style={styles.copyIcon}>{copiedSecret ? '✓' : '📋'}</Text>
            </TouchableOpacity>
          </View>

          {/* Instructions */}
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>📱 How to setup:</Text>
            <Text style={styles.instructionItem}>1. Open Google Authenticator</Text>
            <Text style={styles.instructionItem}>2. Tap the + button</Text>
            <Text style={styles.instructionItem}>3. Select "Scan QR code"</Text>
            <Text style={styles.instructionItem}>4. Point camera at the QR code above</Text>
          </View>

          {/* Continue */}
          <TouchableOpacity style={styles.primaryButton} onPress={proceedToVerify}>
            <Text style={styles.primaryButtonText}>I've Scanned It →</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: VERIFY TOTP STEP
  // ═══════════════════════════════════════════════════════════════
  if (step === 'verify_totp') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.stepBadge}>Step 2 of 3</Text>
          <Text style={styles.title}>Verify Setup</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code from Google Authenticator
          </Text>

          <TextInput
            style={styles.codeInput}
            value={totpCode}
            onChangeText={(text) => setTotpCode(text.replace(/[^0-9]/g, ''))}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="000000"
            placeholderTextColor="#4B5563"
            autoFocus
          />

          <TouchableOpacity
            style={[styles.primaryButton, totpCode.length !== 6 && styles.buttonDisabled]}
            onPress={verifyTotpCode}
            disabled={totpCode.length !== 6 || verifying}
          >
            {verifying ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.primaryButtonText}>Verify Code</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.backLink} onPress={() => setStep('scan_qr')}>
            <Text style={styles.backLinkText}>← Back to QR Code</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: DOWNLOAD BACKUP STEP
  // ═══════════════════════════════════════════════════════════════
  if (step === 'download_backup') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.stepBadge}>Step 3 of 3</Text>
            <Text style={styles.title}>Save Backup File</Text>
            <Text style={styles.subtitle}>
              Download and store this backup file securely
            </Text>
          </View>

          {/* Warning */}
          <View style={styles.warningCard}>
            <Text style={styles.warningEmoji}>⚠️</Text>
            <Text style={styles.warningTitle}>IMPORTANT</Text>
            <Text style={styles.warningText}>
              To recover your wallet, you need BOTH:
            </Text>
            <View style={styles.warningList}>
              <Text style={styles.warningItem}>✓ This backup file</Text>
              <Text style={styles.warningItem}>✓ Google Authenticator</Text>
            </View>
            <Text style={styles.warningText}>
              If you lose either one, your funds are LOST FOREVER!
            </Text>
          </View>

          {/* Wallet Preview */}
          {vaultData && (
            <View style={styles.walletPreview}>
              <Text style={styles.walletPreviewTitle}>Your Wallet</Text>
              <Text style={styles.walletPreviewName}>{vaultData.vault_name}</Text>
              <Text style={styles.walletPreviewAddress} numberOfLines={1}>
                {vaultData.sol?.address}
              </Text>
            </View>
          )}

          {/* Download Button */}
          {!backupDownloaded ? (
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={downloadBackup}
              disabled={downloading}
            >
              {downloading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.downloadButtonText}>📥 Download Backup File</Text>
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.successBanner}>
              <Text style={styles.successText}>✅ Backup Saved!</Text>
            </View>
          )}

          {/* Continue */}
          <TouchableOpacity
            style={[
              styles.primaryButton,
              !backupDownloaded && styles.secondaryButton
            ]}
            onPress={completeSetup}
          >
            <Text style={[
              styles.primaryButtonText,
              !backupDownloaded && styles.secondaryButtonText
            ]}>
              {backupDownloaded ? 'Complete Setup →' : 'Skip (Not Recommended)'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
};

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  
  // Header
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  stepBadge: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    color: '#4ECDC4',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 16,
    overflow: 'hidden',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
  },
  status: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 24,
  },
  
  // Seedless badge
  seedlessBadge: {
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  seedlessBadgeText: {
    color: '#A855F7',
    fontSize: 14,
    fontWeight: '700',
  },
  
  // Progress
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#1E293B',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 4,
  },
  progressText: {
    marginLeft: 12,
    color: '#4ECDC4',
    fontSize: 14,
    fontWeight: '600',
    width: 40,
  },
  
  // Info card
  infoCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    width: '100%',
  },
  infoTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoItem: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 8,
  },
  
  // QR Code
  qrContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  qrCode: {
    width: 200,
    height: 200,
  },
  
  // Manual entry
  manualEntry: {
    width: '100%',
    marginBottom: 24,
  },
  manualLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 8,
  },
  secretBox: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  secretText: {
    flex: 1,
    color: '#4ECDC4',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  copyIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  
  // Instructions
  instructionsCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    width: '100%',
  },
  instructionsTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  instructionItem: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 6,
  },
  
  // Code input
  codeInput: {
    width: 200,
    height: 70,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    fontSize: 32,
    textAlign: 'center',
    color: '#FFFFFF',
    letterSpacing: 8,
    marginVertical: 32,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  
  // Warning card
  warningCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  warningEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  warningTitle: {
    color: '#F59E0B',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  warningText: {
    color: '#FCD34D',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  warningList: {
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  warningItem: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  
  // Wallet preview
  walletPreview: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  walletPreviewTitle: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 4,
  },
  walletPreviewName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  walletPreviewAddress: {
    color: '#4ECDC4',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  
  // Buttons
  primaryButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    width: '100%',
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#374151',
  },
  secondaryButtonText: {
    color: '#9CA3AF',
  },
  downloadButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  downloadButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
  successBanner: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  successText: {
    color: '#10B981',
    fontSize: 18,
    fontWeight: '700',
  },
  
  // Back link
  backLink: {
    marginTop: 24,
    padding: 12,
  },
  backLinkText: {
    color: '#4ECDC4',
    fontSize: 14,
  },
  
  // Error
  errorEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    padding: 12,
  },
  retryButtonText: {
    color: '#4ECDC4',
    fontSize: 16,
  },
});

export default CreatingSeedlessVaultScreen;