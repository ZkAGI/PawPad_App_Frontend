// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   StyleSheet,
//   SafeAreaView,
//   ActivityIndicator,
//   ScrollView,
//   Share,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import type { RootStackParamList } from '../types/navigation';
// import api from '../services/api';

// type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// const BackupScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const [exporting, setExporting] = useState(false);

//   const exportBackup = async () => {
//     setExporting(true);
//     try {
//       // Get backup data from API
//       const backupData = await api.exportBackup();

//       // Share as text (works without expo-file-system)
//       const jsonString = JSON.stringify(backupData, null, 2);

//       await Share.share({
//         message: jsonString,
//         title: 'PawPad Wallet Backup',
//       });

//       Alert.alert(
//         'Backup Created! ✅',
//         'Save this backup to a secure location (Notes, Email, Cloud storage).',
//         [{ text: 'OK' }]
//       );
//     } catch (error: any) {
//       console.error('Export error:', error);
//       Alert.alert('Export Failed', error.message || 'Could not create backup');
//     } finally {
//       setExporting(false);
//     }
//   };

//   const showImportInfo = () => {
//     Alert.alert(
//       'Import Backup',
//       'To restore from a backup:\n\n1. Use the Recovery feature with your email\n2. Your wallets will be automatically restored\n\nThe backup file is for extra safety only.',
//       [
//         { text: 'Go to Recovery', onPress: () => navigation.navigate('Recovery') },
//         { text: 'OK', style: 'cancel' },
//       ]
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         <View style={styles.header}>
//           <Text style={styles.emoji}>💾</Text>
//           <Text style={styles.title}>Backup & Recovery</Text>
//           <Text style={styles.subtitle}>Export your wallet metadata for safekeeping</Text>
//         </View>

//         {/* Export Section */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>📤 Export Backup</Text>
//           <Text style={styles.cardDescription}>
//             Create a backup containing your wallet information. This file does NOT contain private
//             keys - it's safe to store in cloud storage.
//           </Text>

//           <View style={styles.infoBox}>
//             <Text style={styles.infoTitle}>What's included:</Text>
//             <Text style={styles.infoItem}>• Your email address</Text>
//             <Text style={styles.infoItem}>• Vault names and addresses</Text>
//             <Text style={styles.infoItem}>• Arcium connection references</Text>
//             <Text style={styles.infoWarning}>⚠️ NO private keys included</Text>
//           </View>

//           <TouchableOpacity
//             style={[styles.exportButton, exporting && styles.buttonDisabled]}
//             onPress={exportBackup}
//             disabled={exporting}
//           >
//             {exporting ? (
//               <ActivityIndicator color="#FFFFFF" />
//             ) : (
//               <Text style={styles.buttonText}>Export Backup</Text>
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* Import Section */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>📥 Restore Wallet</Text>
//           <Text style={styles.cardDescription}>
//             Most users can recover using just their email. The backup file provides extra safety if
//             our database is ever lost.
//           </Text>

//           <TouchableOpacity style={styles.importButton} onPress={showImportInfo}>
//             <Text style={styles.importButtonText}>Learn About Import</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Recovery Info */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>🔑 How Recovery Works</Text>
//           <Text style={styles.cardDescription}>
//             Your wallet keys are stored securely in Arcium's MPC network - not on your device.
//           </Text>
//           <View style={styles.stepList}>
//             <Text style={styles.step}>1. Install PawPad on new device</Text>
//             <Text style={styles.step}>2. Tap "Recover Wallet"</Text>
//             <Text style={styles.step}>3. Verify your email address</Text>
//             <Text style={styles.step}>4. Your wallets are restored!</Text>
//           </View>
//           <Text style={styles.note}>
//             The backup file is an extra safety net - you can recover using just your email in most
//             cases.
//           </Text>
//         </View>

//         {/* Quick Recovery Button */}
//         <TouchableOpacity
//           style={styles.recoveryButton}
//           onPress={() => navigation.navigate('Recovery')}
//         >
//           <Text style={styles.recoveryButtonText}>🔐 Go to Recovery</Text>
//         </TouchableOpacity>

//         {/* Back button */}
//         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//           <Text style={styles.backButtonText}>← Back</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0A1628',
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 24,
//   },
//   header: {
//     alignItems: 'center',
//     paddingTop: 24,
//     paddingBottom: 24,
//   },
//   emoji: {
//     fontSize: 48,
//     marginBottom: 12,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '600',
//     color: '#FFFFFF',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     textAlign: 'center',
//   },
//   card: {
//     backgroundColor: '#1E293B',
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 16,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#FFFFFF',
//     marginBottom: 8,
//   },
//   cardDescription: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     lineHeight: 20,
//     marginBottom: 16,
//   },
//   infoBox: {
//     backgroundColor: '#0F172A',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//   },
//   infoTitle: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#FFFFFF',
//     marginBottom: 8,
//   },
//   infoItem: {
//     fontSize: 13,
//     color: '#9CA3AF',
//     marginBottom: 4,
//   },
//   infoWarning: {
//     fontSize: 13,
//     color: '#10B981',
//     fontWeight: '500',
//     marginTop: 8,
//   },
//   exportButton: {
//     backgroundColor: '#4ECDC4',
//     borderRadius: 12,
//     padding: 16,
//     alignItems: 'center',
//   },
//   importButton: {
//     backgroundColor: 'transparent',
//     borderRadius: 12,
//     padding: 16,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#4ECDC4',
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   importButtonText: {
//     color: '#4ECDC4',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   stepList: {
//     marginBottom: 12,
//   },
//   step: {
//     fontSize: 14,
//     color: '#FFFFFF',
//     marginBottom: 8,
//     paddingLeft: 8,
//   },
//   note: {
//     fontSize: 12,
//     color: '#6B7280',
//     fontStyle: 'italic',
//   },
//   recoveryButton: {
//     backgroundColor: '#374151',
//     borderRadius: 12,
//     padding: 16,
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   recoveryButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   backButton: {
//     alignItems: 'center',
//     padding: 12,
//     marginBottom: 32,
//   },
//   backButtonText: {
//     color: '#9CA3AF',
//     fontSize: 14,
//   },
// });

// export default BackupScreen;


/**
 * BackupScreen.tsx
 * 
 * Backup & Recovery for wallet metadata
 * 
 * Styled with VoltWallet Premium Theme
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Share,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import LinearGradient from 'react-native-linear-gradient';
import api from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BackupScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [exporting, setExporting] = useState(false);

  const exportBackup = async () => {
    setExporting(true);
    try {
      const backupData = await api.exportBackup();
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
    <View style={styles.container}>
      <LinearGradient
        colors={['#1E3A5F', '#0F2744', '#0A1628']}
        style={styles.glowGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.title}>Backup & Recovery</Text>
              <Text style={styles.subtitle}>Secure your wallet</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.heroIconContainer}>
              <Text style={styles.heroEmoji}>💾</Text>
            </View>
            <Text style={styles.heroTitle}>Keep Your Wallet Safe</Text>
            <Text style={styles.heroSubtitle}>
              Export your wallet metadata for safekeeping
            </Text>
          </View>

          {/* Export Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconContainer, { backgroundColor: 'rgba(78, 205, 196, 0.15)' }]}>
                <Text style={styles.cardIcon}>📤</Text>
              </View>
              <Text style={styles.cardTitle}>Export Backup</Text>
            </View>
            
            <Text style={styles.cardDescription}>
              Create a backup containing your wallet information. This file does NOT contain private
              keys - it's safe to store in cloud storage.
            </Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>What's included:</Text>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoCheck}>✓</Text>
                <Text style={styles.infoText}>Your email address</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoCheck}>✓</Text>
                <Text style={styles.infoText}>Vault names and addresses</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoCheck}>✓</Text>
                <Text style={styles.infoText}>Arcium connection references</Text>
              </View>
              
              <View style={styles.infoWarningBox}>
                <Text style={styles.infoWarningIcon}>🔒</Text>
                <Text style={styles.infoWarning}>NO private keys included</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.exportButton, exporting && styles.buttonDisabled]}
              onPress={exportBackup}
              disabled={exporting}
              activeOpacity={0.8}
            >
              {exporting ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#0A1628" size="small" />
                  <Text style={styles.buttonTextLoading}>Creating Backup...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Export Backup</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Import Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconContainer, { backgroundColor: 'rgba(153, 69, 255, 0.15)' }]}>
                <Text style={styles.cardIcon}>📥</Text>
              </View>
              <Text style={styles.cardTitle}>Restore Wallet</Text>
            </View>
            
            <Text style={styles.cardDescription}>
              Most users can recover using just their email. The backup file provides extra safety if
              our database is ever lost.
            </Text>

            <TouchableOpacity 
              style={styles.importButton} 
              onPress={showImportInfo}
              activeOpacity={0.7}
            >
              <Text style={styles.importButtonText}>Learn About Import</Text>
            </TouchableOpacity>
          </View>

          {/* Recovery Info */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconContainer, { backgroundColor: 'rgba(244, 183, 40, 0.15)' }]}>
                <Text style={styles.cardIcon}>🔑</Text>
              </View>
              <Text style={styles.cardTitle}>How Recovery Works</Text>
            </View>
            
            <Text style={styles.cardDescription}>
              Your wallet keys are stored securely in Arcium's MPC network - not on your device.
            </Text>
            
            <View style={styles.stepsContainer}>
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>Install PawPad on new device</Text>
              </View>
              <View style={styles.stepConnector} />
              
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>Tap "Recover Wallet"</Text>
              </View>
              <View style={styles.stepConnector} />
              
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>Verify your email address</Text>
              </View>
              <View style={styles.stepConnector} />
              
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>4</Text>
                </View>
                <Text style={styles.stepText}>Your wallets are restored!</Text>
              </View>
            </View>
            
            <View style={styles.noteBox}>
              <Text style={styles.noteIcon}>💡</Text>
              <Text style={styles.note}>
                The backup file is an extra safety net - you can recover using just your email in most cases.
              </Text>
            </View>
          </View>

          {/* Quick Recovery Button */}
          <TouchableOpacity
            style={styles.recoveryButton}
            onPress={() => navigation.navigate('Recovery')}
            activeOpacity={0.7}
          >
            <View style={styles.recoveryIconContainer}>
              <Text style={styles.recoveryIcon}>🔐</Text>
            </View>
            <View style={styles.recoveryContent}>
              <Text style={styles.recoveryButtonText}>Go to Recovery</Text>
              <Text style={styles.recoverySubtext}>Restore your wallets</Text>
            </View>
            <Text style={styles.recoveryArrow}>→</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>◈ Secured by Arcium MPC • ZkAGI 2025</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
// STYLES - VoltWallet Premium Theme
// ═══════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  safeArea: {
    flex: 1,
  },
  glowGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 400,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  backIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    color: '#4ECDC4',
    fontSize: 13,
    marginTop: 4,
  },

  // Hero Section
  heroSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  heroIconContainer: {
    width: 88,
    height: 88,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(78, 205, 196, 0.3)',
  },
  heroEmoji: {
    fontSize: 40,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },

  // Card
  card: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardIcon: {
    fontSize: 22,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 22,
    marginBottom: 16,
  },

  // Info Box
  infoBox: {
    backgroundColor: 'rgba(30, 58, 95, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoCheck: {
    fontSize: 14,
    color: '#4ECDC4',
    marginRight: 10,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  infoWarningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  infoWarningIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  infoWarning: {
    fontSize: 13,
    color: '#22C55E',
    fontWeight: '600',
  },

  // Buttons
  exportButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#0A1628',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonTextLoading: {
    color: '#0A1628',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  importButton: {
    backgroundColor: 'transparent',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(78, 205, 196, 0.5)',
  },
  importButtonText: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: '600',
  },

  // Steps
  stepsContainer: {
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  stepNumberText: {
    color: '#4ECDC4',
    fontSize: 14,
    fontWeight: '700',
  },
  stepText: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  stepConnector: {
    width: 2,
    height: 16,
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    marginLeft: 15,
    marginVertical: 4,
  },

  // Note Box
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(30, 58, 95, 0.4)',
    padding: 14,
    borderRadius: 10,
  },
  noteIcon: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 1,
  },
  note: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
    lineHeight: 18,
  },

  // Recovery Button
  recoveryButton: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  recoveryIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  recoveryIcon: {
    fontSize: 22,
  },
  recoveryContent: {
    flex: 1,
  },
  recoveryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  recoverySubtext: {
    color: '#6B7280',
    fontSize: 13,
    marginTop: 4,
  },
  recoveryArrow: {
    color: '#4ECDC4',
    fontSize: 20,
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#4B5563',
  },
});

export default BackupScreen;