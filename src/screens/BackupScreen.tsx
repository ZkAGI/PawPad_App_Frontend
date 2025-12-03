import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Share,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import api from '../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BackupScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [exporting, setExporting] = useState(false);

  const exportBackup = async () => {
    setExporting(true);
    try {
      // Get backup data from API
      const backupData = await api.exportBackup();

      // Share as text (works without expo-file-system)
      const jsonString = JSON.stringify(backupData, null, 2);

      await Share.share({
        message: jsonString,
        title: 'PawPad Wallet Backup',
      });

      Alert.alert(
        'Backup Created! ✅',
        'Save this backup to a secure location (Notes, Email, Cloud storage).',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      console.error('Export error:', error);
      Alert.alert('Export Failed', error.message || 'Could not create backup');
    } finally {
      setExporting(false);
    }
  };

  const showImportInfo = () => {
    Alert.alert(
      'Import Backup',
      'To restore from a backup:\n\n1. Use the Recovery feature with your email\n2. Your wallets will be automatically restored\n\nThe backup file is for extra safety only.',
      [
        { text: 'Go to Recovery', onPress: () => navigation.navigate('Recovery') },
        { text: 'OK', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.emoji}>💾</Text>
          <Text style={styles.title}>Backup & Recovery</Text>
          <Text style={styles.subtitle}>Export your wallet metadata for safekeeping</Text>
        </View>

        {/* Export Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📤 Export Backup</Text>
          <Text style={styles.cardDescription}>
            Create a backup containing your wallet information. This file does NOT contain private
            keys - it's safe to store in cloud storage.
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>What's included:</Text>
            <Text style={styles.infoItem}>• Your email address</Text>
            <Text style={styles.infoItem}>• Vault names and addresses</Text>
            <Text style={styles.infoItem}>• Arcium connection references</Text>
            <Text style={styles.infoWarning}>⚠️ NO private keys included</Text>
          </View>

          <TouchableOpacity
            style={[styles.exportButton, exporting && styles.buttonDisabled]}
            onPress={exportBackup}
            disabled={exporting}
          >
            {exporting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Export Backup</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Import Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📥 Restore Wallet</Text>
          <Text style={styles.cardDescription}>
            Most users can recover using just their email. The backup file provides extra safety if
            our database is ever lost.
          </Text>

          <TouchableOpacity style={styles.importButton} onPress={showImportInfo}>
            <Text style={styles.importButtonText}>Learn About Import</Text>
          </TouchableOpacity>
        </View>

        {/* Recovery Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔑 How Recovery Works</Text>
          <Text style={styles.cardDescription}>
            Your wallet keys are stored securely in Arcium's MPC network - not on your device.
          </Text>
          <View style={styles.stepList}>
            <Text style={styles.step}>1. Install PawPad on new device</Text>
            <Text style={styles.step}>2. Tap "Recover Wallet"</Text>
            <Text style={styles.step}>3. Verify your email address</Text>
            <Text style={styles.step}>4. Your wallets are restored!</Text>
          </View>
          <Text style={styles.note}>
            The backup file is an extra safety net - you can recover using just your email in most
            cases.
          </Text>
        </View>

        {/* Quick Recovery Button */}
        <TouchableOpacity
          style={styles.recoveryButton}
          onPress={() => navigation.navigate('Recovery')}
        >
          <Text style={styles.recoveryButtonText}>🔐 Go to Recovery</Text>
        </TouchableOpacity>

        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </ScrollView>
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
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  infoItem: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  infoWarning: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '500',
    marginTop: 8,
  },
  exportButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  importButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4ECDC4',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  importButtonText: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: '600',
  },
  stepList: {
    marginBottom: 12,
  },
  step: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
    paddingLeft: 8,
  },
  note: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  recoveryButton: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  recoveryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  backButton: {
    alignItems: 'center',
    padding: 12,
    marginBottom: 32,
  },
  backButtonText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
});

export default BackupScreen;