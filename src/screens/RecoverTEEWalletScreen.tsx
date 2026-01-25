// // screens/RecoverTEEWalletScreen.tsx
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   TextInput,
//   ActivityIndicator,
//   Platform,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList, VaultData } from '../types/navigation';
// import Clipboard from '@react-native-clipboard/clipboard';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Import your API service - adjust path as needed
// // import api from '../services/api';

// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Recovery'>;
// type Step = 'paste_backup' | 'enter_totp' | 'recovering' | 'success';

// const COLORS = {
//   bgPrimary: '#02111B',
//   bgCard: '#0D2137',
//   accent: '#33E6BF',
//   accentRed: '#FF6B6B',
//   textPrimary: '#FFFFFF',
//   textSecondary: '#8A9BAE',
//   textMuted: '#5A6B7E',
//   border: 'rgba(42, 82, 152, 0.3)',
//   success: '#10B981',
//   warning: '#F59E0B',
// };

// // TEE Backup file structure
// interface TEEBackupFile {
//   v: number;
//   uid: string;
//   nonce_b64: string;
//   ct_b64: string;
//   tag_b64: string;
// }

// const RecoverTEEWalletScreen = () => {
//   const navigation = useNavigation<NavigationProp>();

//   const [step, setStep] = useState<Step>('paste_backup');
//   const [backupJson, setBackupJson] = useState('');
//   const [backupFile, setBackupFile] = useState<TEEBackupFile | null>(null);
//   const [totpCode, setTotpCode] = useState('');
//   const [recovering, setRecovering] = useState(false);
//   const [error, setError] = useState('');
//   const [recoveredVault, setRecoveredVault] = useState<VaultData | null>(null);

//   // ═══════════════════════════════════════════════════════════════
//   // PASTE FROM CLIPBOARD
//   // ═══════════════════════════════════════════════════════════════
//   const pasteFromClipboard = async () => {
//     try {
//       const content = await Clipboard.getString();
//       if (content) {
//         setBackupJson(content);
//         validateBackup(content);
//       } else {
//         Alert.alert('Clipboard Empty', 'No content found in clipboard');
//       }
//     } catch (err) {
//       console.log('Clipboard error:', err);
//       Alert.alert('Error', 'Could not read from clipboard');
//     }
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // VALIDATE TEE BACKUP FORMAT
//   // ═══════════════════════════════════════════════════════════════
//   const validateBackup = (jsonString: string) => {
//     try {
//       setError('');
//       const parsed = JSON.parse(jsonString.trim());

//       // Check for TEE backup required fields
//       if (!parsed.v || !parsed.uid || !parsed.nonce_b64 || !parsed.ct_b64 || !parsed.tag_b64) {
//         setError('Invalid TEE backup format. Missing required fields.');
//         return false;
//       }

//       // Validate version
//       if (parsed.v !== 1) {
//         setError('Unsupported backup version');
//         return false;
//       }

//       console.log('✅ Valid TEE backup:', parsed.uid);
//       setBackupFile(parsed);
//       return true;

//     } catch (err) {
//       console.error('JSON parse error:', err);
//       setError('Invalid JSON format. Make sure you copied the entire backup file.');
//       setBackupFile(null);
//       return false;
//     }
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // CONTINUE TO TOTP STEP
//   // ═══════════════════════════════════════════════════════════════
//   const handleContinueToTOTP = () => {
//     if (!backupFile) {
//       if (!validateBackup(backupJson)) {
//         return;
//       }
//     }
//     setStep('enter_totp');
//     setError('');
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // RECOVER WALLET
//   // ═══════════════════════════════════════════════════════════════
//   const recoverWallet = async () => {
//     if (totpCode.length !== 6) {
//       setError('Please enter a 6-digit code');
//       return;
//     }

//     if (!backupFile) {
//       setError('Backup file not loaded');
//       return;
//     }

//     setRecovering(true);
//     setError('');
//     setStep('recovering');

//     try {
//       // Call TEE recovery API
//       // Replace with your actual API endpoint
//       const response = await fetch('https://p8080.m1363.opf-testnet-rofl-25.rofl.app/v1/recover', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           backup_file: backupFile,
//           totp_code: totpCode,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || data.message || 'Recovery failed');
//       }

//       console.log('✅ TEE Recovery response:', data);

//       // Create vault from recovered data
//       const vault: VaultData = {
//         vault_id: data.uid || backupFile.uid,
//         vault_name: 'Recovered TEE Wallet',
//         vault_type: 'tee',
//         wallet_type: 'tee',
//         created_at: new Date().toISOString(),
//         tee: {
//           uid: data.uid || backupFile.uid,
//           evm: data.wallets?.evm || { chain: 'base', address: data.evm_address },
//           solana: data.wallets?.solana || { address: data.solana_address },
//           backup_hash: data.backup_hash || '',
//           sapphire_tx: data.sapphire?.tx?.hash,
//         },
//       };

//       // Save to AsyncStorage
//       await AsyncStorage.setItem('tee_wallet', JSON.stringify(vault));
//       await AsyncStorage.setItem('active_wallet_type', 'tee');

//       setRecoveredVault(vault);
//       setStep('success');

//       // Navigate to Home after delay
//       setTimeout(() => {
//         navigation.reset({
//           index: 0,
//           routes: [{ name: 'Home', params: { vault } }],
//         });
//       }, 2000);

//     } catch (err: any) {
//       console.error('Recovery error:', err);
      
//       let errorMessage = err.message || 'Failed to recover wallet';
      
//       // Handle specific error cases
//       if (errorMessage.includes('invalid totp') || errorMessage.includes('TOTP')) {
//         errorMessage = 'Invalid authenticator code. Please check and try again.';
//       } else if (errorMessage.includes('not found')) {
//         errorMessage = 'Wallet not found. The backup file may be corrupted.';
//       } else if (errorMessage.includes('expired')) {
//         errorMessage = 'Authenticator code expired. Please enter a new code.';
//       }
      
//       setError(errorMessage);
//       setStep('enter_totp');
//     } finally {
//       setRecovering(false);
//     }
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // RENDER: PASTE BACKUP
//   // ═══════════════════════════════════════════════════════════════
//   if (step === 'paste_backup') {
//     return (
//       <View style={styles.container}>
//         <SafeAreaView style={styles.safeArea}>
//           <ScrollView contentContainerStyle={styles.scrollContent}>
//             {/* Back Button */}
//             <TouchableOpacity 
//               style={styles.backButton} 
//               onPress={() => navigation.goBack()}
//             >
//               <Text style={styles.backButtonText}>← Back</Text>
//             </TouchableOpacity>

//             {/* Header */}
//             <View style={styles.header}>
//               <View style={styles.iconContainer}>
//                 <Text style={styles.iconEmoji}>🔐</Text>
//               </View>
//               <Text style={styles.title}>Recover TEE Wallet</Text>
//               <Text style={styles.subtitle}>
//                 Paste your backup file content to restore your wallet
//               </Text>
//             </View>

//             {/* Instructions */}
//             <View style={styles.infoCard}>
//               <Text style={styles.infoTitle}>📝 How to recover:</Text>
//               <Text style={styles.infoItem}>1. Find your TEE backup file (JSON)</Text>
//               <Text style={styles.infoItem}>2. Open it and copy all content</Text>
//               <Text style={styles.infoItem}>3. Paste it below</Text>
//               <Text style={styles.infoItem}>4. Enter your authenticator code</Text>
//             </View>

//             {/* Paste Button */}
//             <TouchableOpacity style={styles.pasteButton} onPress={pasteFromClipboard}>
//               <Text style={styles.pasteButtonIcon}>📋</Text>
//               <Text style={styles.pasteButtonText}>Paste from Clipboard</Text>
//             </TouchableOpacity>

//             {/* Or Divider */}
//             <View style={styles.divider}>
//               <View style={styles.dividerLine} />
//               <Text style={styles.dividerText}>or paste manually</Text>
//               <View style={styles.dividerLine} />
//             </View>

//             {/* Text Input */}
//             <TextInput
//               style={styles.backupInput}
//               value={backupJson}
//               onChangeText={(text) => {
//                 setBackupJson(text);
//                 setError('');
//                 if (text.length > 20) {
//                   validateBackup(text);
//                 } else {
//                   setBackupFile(null);
//                 }
//               }}
//               placeholder='{"v":1,"uid":"...","nonce_b64":"...","ct_b64":"...","tag_b64":"..."}'
//               placeholderTextColor={COLORS.textMuted}
//               multiline
//               numberOfLines={8}
//               textAlignVertical="top"
//             />

//             {/* Validation Status */}
//             {backupFile && (
//               <View style={styles.validCard}>
//                 <Text style={styles.validIcon}>✅</Text>
//                 <View style={styles.validInfo}>
//                   <Text style={styles.validTitle}>Valid TEE Backup</Text>
//                   <Text style={styles.validUid}>UID: {backupFile.uid.substring(0, 16)}...</Text>
//                 </View>
//               </View>
//             )}

//             {/* Error */}
//             {error ? (
//               <View style={styles.errorCard}>
//                 <Text style={styles.errorText}>❌ {error}</Text>
//               </View>
//             ) : null}

//             {/* Continue Button */}
//             <TouchableOpacity
//               style={[
//                 styles.primaryButton,
//                 !backupFile && styles.buttonDisabled
//               ]}
//               onPress={handleContinueToTOTP}
//               disabled={!backupFile}
//             >
//               <Text style={styles.primaryButtonText}>Continue →</Text>
//             </TouchableOpacity>

//             {/* Requirements */}
//             <View style={styles.requirementsCard}>
//               <Text style={styles.requirementsTitle}>📱 You'll also need:</Text>
//               <Text style={styles.requirementsItem}>• Google Authenticator (or Authy)</Text>
//               <Text style={styles.requirementsItem}>• The PawPad entry still set up</Text>
//             </View>
//           </ScrollView>
//         </SafeAreaView>
//       </View>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // RENDER: ENTER TOTP
//   // ═══════════════════════════════════════════════════════════════
//   if (step === 'enter_totp') {
//     return (
//       <View style={styles.container}>
//         <SafeAreaView style={styles.safeArea}>
//           <ScrollView contentContainerStyle={styles.centerScrollContent}>
//             {/* Header */}
//             <View style={styles.iconContainer}>
//               <Text style={styles.iconEmoji}>🔑</Text>
//             </View>

//             <Text style={styles.title}>Enter Authenticator Code</Text>
//             <Text style={styles.subtitle}>
//               Open Google Authenticator and enter the 6-digit code for PawPad
//             </Text>

//             {/* Backup Info */}
//             <View style={styles.backupInfoCard}>
//               <Text style={styles.backupInfoIcon}>📄</Text>
//               <View>
//                 <Text style={styles.backupInfoLabel}>Recovering wallet:</Text>
//                 <Text style={styles.backupInfoUid}>
//                   {backupFile?.uid.substring(0, 20)}...
//                 </Text>
//               </View>
//             </View>

//             {/* TOTP Input */}
//             <TextInput
//               style={styles.totpInput}
//               value={totpCode}
//               onChangeText={(text) => {
//                 setTotpCode(text.replace(/[^0-9]/g, ''));
//                 setError('');
//               }}
//               keyboardType="number-pad"
//               maxLength={6}
//               placeholder="000000"
//               placeholderTextColor={COLORS.textMuted}
//               autoFocus
//             />

//             <Text style={styles.totpHint}>
//               Code refreshes every 30 seconds
//             </Text>

//             {/* Error */}
//             {error ? (
//               <View style={styles.errorCard}>
//                 <Text style={styles.errorText}>❌ {error}</Text>
//               </View>
//             ) : null}

//             {/* Recover Button */}
//             <TouchableOpacity
//               style={[
//                 styles.primaryButton,
//                 totpCode.length !== 6 && styles.buttonDisabled
//               ]}
//               onPress={recoverWallet}
//               disabled={totpCode.length !== 6 || recovering}
//             >
//               {recovering ? (
//                 <ActivityIndicator color={COLORS.bgPrimary} />
//               ) : (
//                 <Text style={styles.primaryButtonText}>🔓 Recover Wallet</Text>
//               )}
//             </TouchableOpacity>

//             {/* Back Link */}
//             <TouchableOpacity 
//               style={styles.backLink} 
//               onPress={() => {
//                 setStep('paste_backup');
//                 setTotpCode('');
//                 setError('');
//               }}
//             >
//               <Text style={styles.backLinkText}>← Back to backup</Text>
//             </TouchableOpacity>
//           </ScrollView>
//         </SafeAreaView>
//       </View>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // RENDER: RECOVERING
//   // ═══════════════════════════════════════════════════════════════
//   if (step === 'recovering') {
//     return (
//       <View style={styles.container}>
//         <SafeAreaView style={styles.safeArea}>
//           <View style={styles.centerContent}>
//             <ActivityIndicator size="large" color={COLORS.accent} />
//             <Text style={[styles.title, { marginTop: 24 }]}>Recovering Wallet...</Text>
//             <Text style={styles.subtitle}>Please wait while we restore your wallet</Text>

//             <View style={styles.progressCard}>
//               <Text style={styles.progressItem}>✓ Backup file validated</Text>
//               <Text style={styles.progressItem}>✓ TOTP code verified</Text>
//               <Text style={styles.progressItemActive}>⏳ Decrypting backup...</Text>
//               <Text style={styles.progressItemPending}>○ Restoring wallet keys</Text>
//               <Text style={styles.progressItemPending}>○ Fetching wallet addresses</Text>
//             </View>
//           </View>
//         </SafeAreaView>
//       </View>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // RENDER: SUCCESS
//   // ═══════════════════════════════════════════════════════════════
//   if (step === 'success') {
//     return (
//       <View style={styles.container}>
//         <SafeAreaView style={styles.safeArea}>
//           <View style={styles.centerContent}>
//             <Text style={styles.successIcon}>✅</Text>
//             <Text style={styles.title}>Wallet Recovered!</Text>
//             <Text style={styles.subtitle}>
//               Your TEE wallet has been restored successfully
//             </Text>

//             {/* Recovered Addresses */}
//             {recoveredVault?.tee && (
//               <View style={styles.addressesCard}>
//                 <View style={styles.addressRow}>
//                   <Text style={styles.addressLabel}>🔷 Base (EVM)</Text>
//                   <Text style={styles.addressValue}>
//                     {recoveredVault.tee.evm.address.substring(0, 10)}...
//                     {recoveredVault.tee.evm.address.substring(recoveredVault.tee.evm.address.length - 8)}
//                   </Text>
//                 </View>
//                 <View style={styles.addressRow}>
//                   <Text style={styles.addressLabel}>◎ Solana</Text>
//                   <Text style={styles.addressValue}>
//                     {recoveredVault.tee.solana.address.substring(0, 10)}...
//                     {recoveredVault.tee.solana.address.substring(recoveredVault.tee.solana.address.length - 8)}
//                   </Text>
//                 </View>
//               </View>
//             )}

//             <ActivityIndicator color={COLORS.accent} style={{ marginTop: 24 }} />
//             <Text style={styles.redirectText}>Redirecting to wallet...</Text>
//           </View>
//         </SafeAreaView>
//       </View>
//     );
//   }

//   return null;
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.bgPrimary,
//   },
//   safeArea: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 24,
//     paddingBottom: 40,
//   },
//   centerScrollContent: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 24,
//   },
//   centerContent: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 24,
//   },
//   backButton: {
//     marginBottom: 16,
//   },
//   backButtonText: {
//     color: COLORS.accent,
//     fontSize: 16,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   iconContainer: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: 'rgba(51, 230, 191, 0.15)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   iconEmoji: {
//     fontSize: 36,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '600',
//     color: COLORS.textPrimary,
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 15,
//     color: COLORS.textSecondary,
//     textAlign: 'center',
//     lineHeight: 22,
//   },
//   infoCard: {
//     backgroundColor: COLORS.bgCard,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   infoTitle: {
//     color: COLORS.textPrimary,
//     fontSize: 15,
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   infoItem: {
//     color: COLORS.textSecondary,
//     fontSize: 14,
//     marginBottom: 6,
//     paddingLeft: 8,
//   },
//   pasteButton: {
//     backgroundColor: COLORS.accent,
//     borderRadius: 12,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 16,
//   },
//   pasteButtonIcon: {
//     fontSize: 20,
//     marginRight: 10,
//   },
//   pasteButtonText: {
//     color: COLORS.bgPrimary,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   divider: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 16,
//   },
//   dividerLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: COLORS.border,
//   },
//   dividerText: {
//     color: COLORS.textMuted,
//     marginHorizontal: 16,
//     fontSize: 13,
//   },
//   backupInput: {
//     backgroundColor: COLORS.bgCard,
//     borderRadius: 12,
//     padding: 16,
//     color: COLORS.textPrimary,
//     fontSize: 13,
//     fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
//     minHeight: 140,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     marginBottom: 16,
//   },
//   validCard: {
//     backgroundColor: 'rgba(16, 185, 129, 0.1)',
//     borderRadius: 12,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: COLORS.success,
//   },
//   validIcon: {
//     fontSize: 24,
//     marginRight: 12,
//   },
//   validInfo: {
//     flex: 1,
//   },
//   validTitle: {
//     color: COLORS.success,
//     fontSize: 15,
//     fontWeight: '600',
//   },
//   validUid: {
//     color: COLORS.textMuted,
//     fontSize: 12,
//     fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
//     marginTop: 4,
//   },
//   errorCard: {
//     backgroundColor: 'rgba(239, 68, 68, 0.1)',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: COLORS.accentRed,
//   },
//   errorText: {
//     color: COLORS.accentRed,
//     fontSize: 14,
//   },
//   primaryButton: {
//     backgroundColor: COLORS.accent,
//     borderRadius: 12,
//     padding: 18,
//     alignItems: 'center',
//     width: '100%',
//     marginTop: 8,
//   },
//   primaryButtonText: {
//     color: COLORS.bgPrimary,
//     fontSize: 17,
//     fontWeight: '600',
//   },
//   buttonDisabled: {
//     opacity: 0.4,
//   },
//   requirementsCard: {
//     backgroundColor: 'rgba(51, 230, 191, 0.1)',
//     borderRadius: 12,
//     padding: 16,
//     marginTop: 24,
//     borderWidth: 1,
//     borderColor: 'rgba(51, 230, 191, 0.3)',
//   },
//   requirementsTitle: {
//     color: COLORS.accent,
//     fontSize: 14,
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   requirementsItem: {
//     color: COLORS.textSecondary,
//     fontSize: 13,
//     marginBottom: 4,
//   },
//   backupInfoCard: {
//     backgroundColor: COLORS.bgCard,
//     borderRadius: 12,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 20,
//     width: '100%',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   backupInfoIcon: {
//     fontSize: 32,
//     marginRight: 16,
//   },
//   backupInfoLabel: {
//     color: COLORS.textMuted,
//     fontSize: 12,
//   },
//   backupInfoUid: {
//     color: COLORS.textPrimary,
//     fontSize: 14,
//     fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
//     marginTop: 4,
//   },
//   totpInput: {
//     width: 200,
//     height: 70,
//     backgroundColor: COLORS.bgCard,
//     borderRadius: 12,
//     fontSize: 32,
//     textAlign: 'center',
//     color: COLORS.textPrimary,
//     letterSpacing: 8,
//     marginVertical: 20,
//     fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
//     borderWidth: 2,
//     borderColor: COLORS.border,
//   },
//   totpHint: {
//     color: COLORS.textMuted,
//     fontSize: 13,
//     marginBottom: 20,
//   },
//   backLink: {
//     marginTop: 24,
//     padding: 12,
//   },
//   backLinkText: {
//     color: COLORS.accent,
//     fontSize: 14,
//   },
//   progressCard: {
//     backgroundColor: COLORS.bgCard,
//     borderRadius: 12,
//     padding: 20,
//     marginTop: 24,
//     width: '100%',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   progressItem: {
//     color: COLORS.success,
//     fontSize: 14,
//     marginBottom: 10,
//   },
//   progressItemActive: {
//     color: COLORS.warning,
//     fontSize: 14,
//     marginBottom: 10,
//   },
//   progressItemPending: {
//     color: COLORS.textMuted,
//     fontSize: 14,
//     marginBottom: 10,
//   },
//   successIcon: {
//     fontSize: 72,
//     marginBottom: 16,
//   },
//   addressesCard: {
//     backgroundColor: COLORS.bgCard,
//     borderRadius: 12,
//     padding: 16,
//     marginTop: 24,
//     width: '100%',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   addressRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   addressLabel: {
//     color: COLORS.textSecondary,
//     fontSize: 14,
//   },
//   addressValue: {
//     color: COLORS.accent,
//     fontSize: 12,
//     fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
//   },
//   redirectText: {
//     color: COLORS.textMuted,
//     fontSize: 14,
//     marginTop: 12,
//   },
// });

// export default RecoverTEEWalletScreen;

// screens/RecoverTEEWalletScreen.tsx
// Disaster Recovery - Upload backup file to rotate keys

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
  Platform,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, VaultData } from '../types/navigation';
import Clipboard from '@react-native-clipboard/clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import { recoverAndRotate, parseTOTPUri, formatAddress, RecoveryRotateResponse, TEEBackupFile } from '../services/teeSevice';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'RecoverTEEWallet'>;
type Step = 'paste_backup' | 'recovering' | 'new_totp' | 'save_backup' | 'success';

const COLORS = {
  bgPrimary: '#02111B',
  bgCard: '#0D2137',
  accent: '#33E6BF',
  accentRed: '#FF6B6B',
  textPrimary: '#FFFFFF',
  textSecondary: '#8A9BAE',
  textMuted: '#5A6B7E',
  border: 'rgba(42, 82, 152, 0.3)',
  success: '#10B981',
  warning: '#F59E0B',
};

const RecoverTEEWalletScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [step, setStep] = useState<Step>('paste_backup');
  const [backupJson, setBackupJson] = useState('');
  const [backupFile, setBackupFile] = useState<TEEBackupFile | null>(null);
  const [error, setError] = useState('');
  
  // Recovery result
  const [recoveryData, setRecoveryData] = useState<RecoveryRotateResponse | null>(null);
  const [totpCopied, setTotpCopied] = useState(false);
  const [backupSaved, setBackupSaved] = useState(false);

  // ═══════════════════════════════════════════════════════════════
  // PASTE FROM CLIPBOARD
  // ═══════════════════════════════════════════════════════════════
  const pasteFromClipboard = async () => {
    try {
      const content = await Clipboard.getString();
      if (content) {
        setBackupJson(content);
        validateBackup(content);
      } else {
        Alert.alert('Clipboard Empty', 'No content found in clipboard');
      }
    } catch (err) {
      Alert.alert('Error', 'Could not read from clipboard');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // VALIDATE BACKUP FORMAT
  // ═══════════════════════════════════════════════════════════════
  const validateBackup = (jsonString: string): boolean => {
    try {
      setError('');
      const parsed = JSON.parse(jsonString.trim());

      if (!parsed.v || !parsed.uid || !parsed.nonce_b64 || !parsed.ct_b64 || !parsed.tag_b64) {
        setError('Invalid backup format. Missing required fields.');
        return false;
      }

      if (parsed.v !== 1) {
        setError('Unsupported backup version');
        return false;
      }

      setBackupFile(parsed);
      return true;

    } catch (err) {
      setError('Invalid JSON. Make sure you copied the entire file.');
      setBackupFile(null);
      return false;
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // START RECOVERY (calls /v1/recovery/rotate)
  // ═══════════════════════════════════════════════════════════════
  const startRecovery = async () => {
    if (!backupFile) {
      if (!validateBackup(backupJson)) return;
    }

    setStep('recovering');
    setError('');

    try {
      const response = await recoverAndRotate(backupFile!);
      setRecoveryData(response);
      setStep('new_totp');
    } catch (err: any) {
      setError(err.message || 'Recovery failed');
      setStep('paste_backup');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // COPY NEW TOTP SECRET
  // ═══════════════════════════════════════════════════════════════
  const copyTotpSecret = () => {
    if (recoveryData?.new_totp?.secret) {
      Clipboard.setString(recoveryData.new_totp.secret);
      setTotpCopied(true);
      setTimeout(() => setTotpCopied(false), 3000);
    } else if (recoveryData?.new_totp?.otpauth_uri) {
      const parsed = parseTOTPUri(recoveryData.new_totp.otpauth_uri);
      Clipboard.setString(parsed.secret);
      setTotpCopied(true);
      setTimeout(() => setTotpCopied(false), 3000);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // SAVE NEW BACKUP
  // ═══════════════════════════════════════════════════════════════
  const saveNewBackup = async () => {
    if (!recoveryData?.new_backup_file) return;

    try {
      const backupContent = JSON.stringify(recoveryData.new_backup_file, null, 2);
      await Share.share({
        message: backupContent,
        title: `pawpad-backup-${recoveryData.uid.substring(0, 8)}.json`,
      });
      setBackupSaved(true);
    } catch (err) {
      Alert.alert('Error', 'Failed to save backup');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // COMPLETE RECOVERY
  // ═══════════════════════════════════════════════════════════════
  const completeRecovery = async () => {
    if (!backupSaved) {
      Alert.alert(
        'Save Backup First',
        'Your old backup is now VOID. Save the new backup before continuing.',
        [
          { text: 'Save Backup', onPress: saveNewBackup },
          { text: 'Skip (DANGEROUS)', style: 'destructive', onPress: finishRecovery },
        ]
      );
      return;
    }
    finishRecovery();
  };

  const finishRecovery = async () => {
    if (!recoveryData) return;

    // Note: Recovery response doesn't include wallets
    // Wallets remain the same (same UID = same wallets)
    // User will fetch wallets after login with /v1/wallets
    const vault: VaultData = {
      vault_id: recoveryData.uid,
      vault_name: 'Recovered Wallet',
      vault_type: 'tee',
      wallet_type: 'tee',
      created_at: new Date().toISOString(),
      tee: {
        uid: recoveryData.uid,
        evm: { chain: 'base', address: '' },  // Will be fetched after login
        solana: { address: '' },               // Will be fetched after login
        backup_hash: '',                       // New backup, hash not returned
      },
    };

    await AsyncStorage.setItem('tee_wallet', JSON.stringify(vault));
    await AsyncStorage.setItem('active_wallet_type', 'tee');

    setStep('success');

    // Navigate to Login screen (user needs to login with NEW TOTP)
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'TEELogin' as any }],
      });
    }, 2000);
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER: STEP 1 - PASTE BACKUP
  // ═══════════════════════════════════════════════════════════════
  if (step === 'paste_backup') {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            <View style={styles.iconContainer}>
              <Text style={styles.iconEmoji}>🔄</Text>
            </View>

            <Text style={styles.title}>Disaster Recovery</Text>
            <Text style={styles.subtitle}>
              Lost your phone? Upload your backup file to rotate keys and regain access.
            </Text>

            {/* Warning */}
            <View style={styles.warningCard}>
              <Text style={styles.warningIcon}>⚠️</Text>
              <Text style={styles.warningText}>
                This will void your old backup and authenticator. You'll get NEW credentials.
              </Text>
            </View>

            {/* Paste Button */}
            <TouchableOpacity style={styles.pasteButton} onPress={pasteFromClipboard}>
              <Text style={styles.pasteButtonText}>📋 Paste Backup from Clipboard</Text>
            </TouchableOpacity>

            {/* Manual Input */}
            <TextInput
              style={styles.backupInput}
              value={backupJson}
              onChangeText={(text) => {
                setBackupJson(text);
                setError('');
                if (text.length > 20) validateBackup(text);
                else setBackupFile(null);
              }}
              placeholder='{"v":1,"uid":"...","nonce_b64":"..."}'
              placeholderTextColor={COLORS.textMuted}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            {/* Valid indicator */}
            {backupFile && (
              <View style={styles.validCard}>
                <Text style={styles.validText}>✅ Valid backup: {backupFile.uid.substring(0, 12)}...</Text>
              </View>
            )}

            {/* Error */}
            {error ? (
              <View style={styles.errorCard}>
                <Text style={styles.errorText}>❌ {error}</Text>
              </View>
            ) : null}

            {/* Recover Button */}
            <TouchableOpacity
              style={[styles.primaryButton, !backupFile && styles.buttonDisabled]}
              onPress={startRecovery}
              disabled={!backupFile}
            >
              <Text style={styles.primaryButtonText}>🔄 Rotate Keys & Recover</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: RECOVERING
  // ═══════════════════════════════════════════════════════════════
  if (step === 'recovering') {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={[styles.title, { marginTop: 24, fontSize: 22 }]}>Rotating Keys...</Text>
        <Text style={styles.subtitle}>Generating new credentials</Text>
      </View>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: STEP 2 - NEW TOTP
  // ═══════════════════════════════════════════════════════════════
  if (step === 'new_totp') {
    const totpSecret = recoveryData?.new_totp?.secret || 
      (recoveryData?.new_totp?.otpauth_uri ? parseTOTPUri(recoveryData.new_totp.otpauth_uri).secret : '');
    const otpauthUri = recoveryData?.new_totp?.otpauth_uri || '';

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.stepText}>Step 1 of 2</Text>

            <View style={styles.iconContainer}>
              <Text style={styles.iconEmoji}>🔐</Text>
            </View>

            <Text style={styles.title}>Setup NEW Authenticator</Text>
            <Text style={styles.subtitle}>
              Your old code is now VOID. Scan this QR or add the secret manually.
            </Text>

            {/* QR Code */}
            {otpauthUri ? (
              <View style={styles.qrContainer}>
                <QRCode
                  value={otpauthUri}
                  size={180}
                  backgroundColor="white"
                  color="black"
                />
              </View>
            ) : null}

            {/* Manual Entry Option */}
            <Text style={styles.orText}>— or enter manually —</Text>

            {/* New Secret */}
            <View style={styles.secretCard}>
              <Text style={styles.secretLabel}>NEW Secret Key</Text>
              <View style={styles.secretRow}>
                <Text style={styles.secretText}>{totpSecret}</Text>
                <TouchableOpacity onPress={copyTotpSecret}>
                  <Text style={styles.copyBtn}>{totpCopied ? '✓' : '📋'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* UID Info */}
            <View style={styles.walletsCard}>
              <Text style={styles.walletsTitle}>Account Recovered</Text>
              <Text style={styles.walletLine}>
                UID: {recoveryData?.uid?.substring(0, 16)}...
              </Text>
              <Text style={[styles.walletLine, { color: COLORS.textMuted, fontSize: 12 }]}>
                Wallets will be available after login
              </Text>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={() => setStep('save_backup')}>
              <Text style={styles.primaryButtonText}>I've Added to Authenticator</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: STEP 3 - SAVE NEW BACKUP
  // ═══════════════════════════════════════════════════════════════
  if (step === 'save_backup') {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.stepText}>Step 2 of 2</Text>

            <View style={styles.iconContainer}>
              <Text style={styles.iconEmoji}>💾</Text>
            </View>

            <Text style={styles.title}>Save NEW Backup</Text>
            <Text style={styles.subtitle}>
              Your old backup is VOID. Save this new file securely!
            </Text>

            {/* Critical Warning */}
            <View style={[styles.warningCard, { borderColor: COLORS.accentRed }]}>
              <Text style={styles.warningIcon}>🚨</Text>
              <Text style={[styles.warningText, { color: COLORS.accentRed }]}>
                CRITICAL: Without this backup, you cannot recover if you lose your phone again!
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, backupSaved && { backgroundColor: COLORS.success }]}
              onPress={saveNewBackup}
            >
              <Text style={styles.primaryButtonText}>
                {backupSaved ? '✓ Backup Saved' : 'Download NEW Backup'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.completeButton, !backupSaved && styles.buttonDisabled]}
              onPress={completeRecovery}
            >
              <Text style={styles.primaryButtonText}>
                {backupSaved ? 'Complete Recovery' : 'Save Backup First'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: SUCCESS
  // ═══════════════════════════════════════════════════════════════
  if (step === 'success') {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.successIcon}>✅</Text>
        <Text style={styles.title}>Recovery Complete!</Text>
        <Text style={styles.subtitle}>Your wallet is ready with new credentials</Text>
        <ActivityIndicator color={COLORS.accent} style={{ marginTop: 24 }} />
      </View>
    );
  }

  return null;
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: COLORS.accent,
    fontSize: 16,
  },
  stepText: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(51, 230, 191, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  iconEmoji: {
    fontSize: 36,
  },
  qrContainer: {
    alignSelf: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
  },
  orText: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.warning,
  },
  warningIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  warningText: {
    flex: 1,
    color: COLORS.warning,
    fontSize: 13,
    lineHeight: 20,
  },
  pasteButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  pasteButtonText: {
    color: COLORS.bgPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  backupInput: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 14,
    color: COLORS.textPrimary,
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    minHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  validCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  validText: {
    color: COLORS.success,
    fontSize: 14,
  },
  errorCard: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: COLORS.accentRed,
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: COLORS.bgPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  completeButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  secretCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secretLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  secretRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  secretText: {
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: COLORS.accent,
    flex: 1,
  },
  copyBtn: {
    fontSize: 18,
    padding: 4,
  },
  walletsCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  walletsTitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 10,
  },
  walletLine: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
});

export default RecoverTEEWalletScreen;