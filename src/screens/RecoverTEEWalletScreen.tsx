/**
 * RecoverTEEWalletScreen.tsx
 * 
 * TEE Wallet Recovery Flow:
 * 1. Paste backup JSON
 * 2. Call /v1/recovery/rotate → Gets NEW TOTP (old one becomes INVALID)
 * 3. User MUST delete old authenticator entry and add NEW one
 * 4. Save NEW backup file
 * 5. Login with NEW TOTP code
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, VaultData } from '../types/navigation';
import Clipboard from '@react-native-clipboard/clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import { 
  recoverAndRotate, 
  parseTOTPUri, 
  login,
  getWallets,
  clearSession,
  RecoveryRotateResponse, 
  TEEBackupFile 
} from '../services/teeSevice';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ════════════════════════════════════════════════════════════════════════════
// COLORS
// ════════════════════════════════════════════════════════════════════════════

const COLORS = {
  bgPrimary: '#02111B',
  bgCard: '#0D2137',
  accent: '#33E6BF',
  textPrimary: '#FFFFFF',
  textSecondary: '#8A9BAE',
  textMuted: '#5A6B7E',
  border: 'rgba(42, 82, 152, 0.3)',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
};

// ════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════

type Step = 'paste_backup' | 'new_totp' | 'save_backup' | 'login';

interface RecoveryState {
  uid: string;
  new_totp: {
    otpauth_uri: string;
    secret: string;
  };
  new_backup_file: TEEBackupFile;
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════

const RecoverTEEWalletScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  // State
  const [step, setStep] = useState<Step>('paste_backup');
  const [backupJson, setBackupJson] = useState('');
  const [loading, setLoading] = useState(false);
  const [recoveryData, setRecoveryData] = useState<RecoveryState | null>(null);
  const [totpCopied, setTotpCopied] = useState(false);
  const [backupSaved, setBackupSaved] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // ══════════════════════════════════════════════════════════════════════════
  // STEP 1: PASTE BACKUP & ROTATE
  // ══════════════════════════════════════════════════════════════════════════
  const handlePasteBackup = async () => {
    const text = await Clipboard.getString();
    setBackupJson(text);
  };

  const handleRecovery = async () => {
    if (!backupJson.trim()) {
      Alert.alert('Error', 'Please paste your backup JSON');
      return;
    }

    setLoading(true);
    try {
      // Parse backup JSON
      let backupFile: TEEBackupFile;
      try {
        backupFile = JSON.parse(backupJson.trim());
        console.log('[Recovery] Parsed backup file:', backupFile);
      } catch (e) {
        throw new Error('Invalid backup JSON format');
      }

      // Validate backup structure
      if (!backupFile.uid || !backupFile.ct_b64 || !backupFile.nonce_b64) {
        throw new Error('Invalid backup file structure');
      }

      console.log('[Recovery] Starting rotation for UID:', backupFile.uid);

      // Call recovery/rotate - this invalidates OLD TOTP and generates NEW one
      const result = await recoverAndRotate(backupFile);

      console.log('[Recovery] Rotation successful!');
      console.log('[Recovery] Full result:', JSON.stringify(result, null, 2));
      console.log('[Recovery] result.uid:', result.uid);
      console.log('[Recovery] result.new_totp:', result.new_totp);
      console.log('[Recovery] result.new_backup_file:', result.new_backup_file);
      
      // IMPORTANT: Clear old session immediately after rotation
      // Old tokens are now invalid since credentials were rotated
      await clearSession();
      console.log('[Recovery] Cleared old session after credential rotation');

      const recoveryState = {
        uid: result.uid,
        new_totp: result.new_totp,
        new_backup_file: result.new_backup_file,
      };
      console.log('[Recovery] Setting recoveryData to:', recoveryState);
      
      setRecoveryData(recoveryState);

      // Move to new_totp step
      setStep('new_totp');

    } catch (error: any) {
      console.error('[Recovery] Error:', error);
      console.error('[Recovery] Error message:', error?.message);
      Alert.alert('Recovery Failed', error.message || 'Failed to recover wallet');
    } finally {
      setLoading(false);
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // STEP 2: NEW TOTP SETUP
  // ══════════════════════════════════════════════════════════════════════════
  const copyTotpSecret = () => {
    if (recoveryData?.new_totp?.secret) {
      Clipboard.setString(recoveryData.new_totp.secret);
      setTotpCopied(true);
      setTimeout(() => setTotpCopied(false), 2000);
    }
  };

  const openAuthenticator = async () => {
    const uri = recoveryData?.new_totp?.otpauth_uri;
    if (uri) {
      try {
        await Linking.openURL(uri);
      } catch (e) {
        Alert.alert(
          'Open Manually',
          'Please open your authenticator app and add the secret manually.'
        );
      }
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // STEP 3: SAVE NEW BACKUP
  // ══════════════════════════════════════════════════════════════════════════
  const handleSaveBackup = async () => {
    console.log('[Backup] handleSaveBackup called');
    
    if (!recoveryData?.new_backup_file) {
      console.log('[Backup] ERROR: No backup data available');
      Alert.alert('Error', 'No backup data available');
      return;
    }

    const backupContent = JSON.stringify(recoveryData.new_backup_file, null, 2);
    console.log('[Backup] backupContent length:', backupContent.length);

    // On Android, Share.open with file:// URLs can fail
    // Use clipboard as primary method - more reliable
    Alert.alert(
      '💾 Save Backup',
      'Choose how to save your backup file:',
      [
        {
          text: 'Copy to Clipboard',
          onPress: () => {
            Clipboard.setString(backupContent);
            console.log('[Backup] Copied to clipboard');
            setBackupSaved(true);
            Alert.alert(
              '✅ Copied!',
              'Backup JSON copied to clipboard.\n\nPaste it into a secure note app (like Google Keep, Notes, or a password manager) and save it somewhere safe!'
            );
          },
        },
        {
          text: 'Share as Text',
          onPress: async () => {
            try {
              // Use Share.open with message (text) instead of file
              await Share.open({
                message: backupContent,
                title: `pawpad-backup-${recoveryData.uid.substring(0, 8)}-NEW`,
              });
              setBackupSaved(true);
              Alert.alert('✅ Shared!', 'Save the backup securely!');
            } catch (err: any) {
              console.log('[Backup] Share error:', err);
              if (err?.message !== 'User did not share') {
                // Fallback to clipboard
                Clipboard.setString(backupContent);
                setBackupSaved(true);
                Alert.alert('✅ Copied to Clipboard', 'Backup copied. Save it securely!');
              }
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const proceedToLogin = () => {
    if (!backupSaved) {
      Alert.alert(
        '⚠️ Save Backup First',
        'Your OLD backup is now INVALID. You MUST save the NEW backup file to recover your wallet in the future.',
        [
          { text: 'Save Backup', onPress: handleSaveBackup },
          { text: 'Skip (Dangerous!)', style: 'destructive', onPress: () => setStep('login') },
        ]
      );
      return;
    }
    setStep('login');
  };

  // ══════════════════════════════════════════════════════════════════════════
  // STEP 4: LOGIN WITH NEW TOTP
  // ══════════════════════════════════════════════════════════════════════════
  const handleLogin = async () => {
    if (!totpCode || totpCode.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit code');
      return;
    }

    if (!recoveryData?.uid) {
      Alert.alert('Error', 'Recovery data missing');
      return;
    }

    setLoginLoading(true);
    try {
      // IMPORTANT: Clear old session/token before login with new credentials
      // This ensures we don't use stale tokens from before recovery
      await clearSession();
      console.log('[Recovery] Cleared old session before login');
      
      // Login with NEW TOTP code
      await login(recoveryData.uid, totpCode);
      console.log('[Recovery] Login successful with new credentials');

      // Fetch wallets
      const walletsResponse = await getWallets();

      // Create vault object
      const vault: VaultData = {
        vault_id: recoveryData.uid,
        vault_name: 'TEE Wallet (Recovered)',
        wallet_type: 'tee',
        created_at: new Date().toISOString(),
        tee: {
          uid: recoveryData.uid,
          evm: walletsResponse.wallets.evm,
          solana: walletsResponse.wallets.solana,
        },
      };

      // Save to AsyncStorage
      await AsyncStorage.setItem('tee_wallet', JSON.stringify(vault));
      await AsyncStorage.setItem('active_wallet_type', 'tee');
      
      // Also clear old trade config cache since it's a fresh start
      await AsyncStorage.removeItem('tee_trade_config');

      // Navigate to Home
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home', params: { vault } }],
      });

    } catch (error: any) {
      console.error('[Login] Error:', error);
      
      // Check if using old code
      if (error.message?.toLowerCase().includes('invalid')) {
        Alert.alert(
          '❌ Invalid Code',
          'Make sure you are using the NEW authenticator entry, not the old one!\n\nYour OLD codes no longer work after recovery.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Login Failed', error.message || 'Failed to login');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER: STEP 1 - PASTE BACKUP
  // ══════════════════════════════════════════════════════════════════════════
  if (step === 'paste_backup') {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.backBtnText}>← Back</Text>
            </TouchableOpacity>

            <View style={styles.iconContainer}>
              <Text style={styles.iconEmoji}>🔐</Text>
            </View>

            <Text style={styles.title}>Recover TEE Wallet</Text>
            <Text style={styles.subtitle}>
              Paste your backup JSON file to recover your wallet.
              {'\n\n'}
              ⚠️ This will generate NEW authenticator credentials.
              Your old codes will stop working.
            </Text>

            {/* Input */}
            <View style={styles.inputCard}>
              <TextInput
                style={styles.textInput}
                placeholder='Paste backup JSON here...'
                placeholderTextColor={COLORS.textMuted}
                multiline
                numberOfLines={8}
                value={backupJson}
                onChangeText={setBackupJson}
                textAlignVertical="top"
              />
              <TouchableOpacity style={styles.pasteBtn} onPress={handlePasteBackup}>
                <Text style={styles.pasteBtnText}>📋 Paste from Clipboard</Text>
              </TouchableOpacity>
            </View>

            {/* Recover Button */}
            <TouchableOpacity
              style={[styles.primaryBtn, (!backupJson.trim() || loading) && styles.primaryBtnDisabled]}
              onPress={handleRecovery}
              disabled={!backupJson.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.bgPrimary} />
              ) : (
                <Text style={styles.primaryBtnText}>🔄 Rotate & Recover</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.warningText}>
              ⚠️ After recovery, you MUST add the NEW QR code to your authenticator app.
              The old codes will be invalid.
            </Text>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER: STEP 2 - NEW TOTP
  // ══════════════════════════════════════════════════════════════════════════
  if (step === 'new_totp') {
    const otpauthUri = recoveryData?.new_totp?.otpauth_uri || '';
    const totpSecret = recoveryData?.new_totp?.secret || '';

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.stepIndicator}>Step 1 of 3</Text>

            <View style={styles.iconContainer}>
              <Text style={styles.iconEmoji}>🔐</Text>
            </View>

            <Text style={styles.title}>⚠️ NEW Authenticator Required</Text>
            <Text style={[styles.subtitle, { color: COLORS.warning }]}>
              Your OLD authenticator code is now INVALID!
              {'\n\n'}
              You MUST delete the old entry and add this NEW one.
            </Text>

            {/* Warning Box */}
            <View style={styles.warningBox}>
              <Text style={styles.warningBoxTitle}>🚨 IMPORTANT</Text>
              <Text style={styles.warningBoxText}>
                1. Open your Authenticator app{'\n'}
                2. DELETE the old PawPad entry{'\n'}
                3. Add this NEW QR code below
              </Text>
            </View>

            {/* QR Code */}
            {otpauthUri ? (
              <View style={styles.qrContainer}>
                <View style={styles.qrWrapper}>
                  <QRCode
                    value={otpauthUri}
                    size={180}
                    backgroundColor="white"
                    color="black"
                  />
                </View>
                <Text style={styles.qrLabel}>Scan with Authenticator App</Text>
              </View>
            ) : null}

            {/* Secret Key */}
            <View style={styles.secretCard}>
              <Text style={styles.secretLabel}>Or enter manually:</Text>
              <View style={styles.secretRow}>
                <Text style={styles.secretText} selectable>{totpSecret}</Text>
                <TouchableOpacity onPress={copyTotpSecret} style={styles.copyBtn}>
                  <Text style={styles.copyBtnText}>{totpCopied ? '✓' : '📋'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Open Authenticator */}
            <TouchableOpacity style={styles.secondaryBtn} onPress={openAuthenticator}>
              <Text style={styles.secondaryBtnText}>📱 Open Authenticator App</Text>
            </TouchableOpacity>

            {/* Continue */}
            <TouchableOpacity style={styles.primaryBtn} onPress={() => setStep('save_backup')}>
              <Text style={styles.primaryBtnText}>I've Added the NEW Code ✓</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER: STEP 3 - SAVE NEW BACKUP
  // ══════════════════════════════════════════════════════════════════════════
  if (step === 'save_backup') {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.stepIndicator}>Step 2 of 3</Text>

            <View style={styles.iconContainer}>
              <Text style={styles.iconEmoji}>💾</Text>
            </View>

            <Text style={styles.title}>Save NEW Backup</Text>
            <Text style={[styles.subtitle, { color: COLORS.error }]}>
              ⚠️ Your OLD backup file is now INVALID!
              {'\n\n'}
              You MUST save this NEW backup to recover your wallet in the future.
            </Text>

            {/* Warning */}
            <View style={[styles.warningBox, { borderColor: COLORS.error }]}>
              <Text style={[styles.warningBoxTitle, { color: COLORS.error }]}>🚨 CRITICAL</Text>
              <Text style={styles.warningBoxText}>
                Without this new backup, you will LOSE ACCESS to your wallet if you lose your phone.
              </Text>
            </View>

            {/* UID Info */}
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Wallet UID</Text>
              <Text style={styles.infoValue}>{recoveryData?.uid}</Text>
            </View>

            {/* Save Button */}
            <TouchableOpacity 
              style={[styles.primaryBtn, backupSaved && styles.successBtn]} 
              onPress={handleSaveBackup}
            >
              <Text style={styles.primaryBtnText}>
                {backupSaved ? '✓ Backup Saved' : '💾 Save NEW Backup File'}
              </Text>
            </TouchableOpacity>

            {/* Continue */}
            <TouchableOpacity 
              style={[styles.secondaryBtn, !backupSaved && styles.secondaryBtnDanger]} 
              onPress={proceedToLogin}
            >
              <Text style={[styles.secondaryBtnText, !backupSaved && { color: COLORS.error }]}>
                {backupSaved ? 'Continue to Login →' : 'Skip (Not Recommended)'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER: STEP 4 - LOGIN
  // ══════════════════════════════════════════════════════════════════════════
  if (step === 'login') {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.stepIndicator}>Step 3 of 3</Text>

            <View style={styles.iconContainer}>
              <Text style={styles.iconEmoji}>🔑</Text>
            </View>

            <Text style={styles.title}>Login with NEW Code</Text>
            <Text style={[styles.subtitle, { color: COLORS.warning }]}>
              Enter the 6-digit code from your NEW authenticator entry.
              {'\n\n'}
              ⚠️ Make sure you're using the NEW code, not the old one!
            </Text>

            {/* TOTP Input */}
            <View style={styles.totpInputContainer}>
              <TextInput
                style={styles.totpInput}
                placeholder="000000"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="number-pad"
                maxLength={6}
                value={totpCode}
                onChangeText={setTotpCode}
                textAlign="center"
              />
            </View>

            {/* Reminder */}
            <View style={styles.reminderBox}>
              <Text style={styles.reminderText}>
                💡 Using old code? Go back and add the NEW QR code to your authenticator first.
              </Text>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.primaryBtn, (totpCode.length !== 6 || loginLoading) && styles.primaryBtnDisabled]}
              onPress={handleLogin}
              disabled={totpCode.length !== 6 || loginLoading}
            >
              {loginLoading ? (
                <ActivityIndicator color={COLORS.bgPrimary} />
              ) : (
                <Text style={styles.primaryBtnText}>🔓 Login & Complete Recovery</Text>
              )}
            </TouchableOpacity>

            {/* Back Button */}
            <TouchableOpacity style={styles.linkBtn} onPress={() => setStep('new_totp')}>
              <Text style={styles.linkBtnText}>← Back to QR Code</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  return null;
};

// ════════════════════════════════════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════════════════════════════════════

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
    paddingBottom: 40,
  },
  backBtn: {
    marginBottom: 16,
  },
  backBtnText: {
    color: COLORS.accent,
    fontSize: 16,
  },
  stepIndicator: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.bgCard,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconEmoji: {
    fontSize: 36,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  inputCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textInput: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontFamily: 'monospace',
    minHeight: 150,
    marginBottom: 12,
  },
  pasteBtn: {
    backgroundColor: 'rgba(51, 230, 191, 0.15)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  pasteBtnText: {
    color: COLORS.accent,
    fontWeight: '600',
  },
  primaryBtn: {
    backgroundColor: COLORS.accent,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryBtnDisabled: {
    opacity: 0.5,
  },
  primaryBtnText: {
    color: COLORS.bgPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  successBtn: {
    backgroundColor: COLORS.success,
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  secondaryBtnDanger: {
    borderColor: COLORS.error,
  },
  secondaryBtnText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '500',
  },
  linkBtn: {
    padding: 12,
    alignItems: 'center',
  },
  linkBtnText: {
    color: COLORS.accent,
    fontSize: 14,
  },
  warningText: {
    color: COLORS.warning,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
  warningBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.warning,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  warningBoxTitle: {
    color: COLORS.warning,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  warningBoxText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
  },
  qrLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 12,
  },
  secretCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secretLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginBottom: 8,
  },
  secretRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  secretText: {
    color: COLORS.accent,
    fontSize: 14,
    fontFamily: 'monospace',
    flex: 1,
    marginRight: 12,
  },
  copyBtn: {
    padding: 8,
    backgroundColor: 'rgba(51, 230, 191, 0.15)',
    borderRadius: 8,
  },
  copyBtnText: {
    fontSize: 18,
  },
  infoCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontFamily: 'monospace',
  },
  totpInputContainer: {
    marginBottom: 20,
  },
  totpInput: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 20,
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reminderBox: {
    backgroundColor: 'rgba(51, 230, 191, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  reminderText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default RecoverTEEWalletScreen;