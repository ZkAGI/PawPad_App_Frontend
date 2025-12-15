// // // screens/RecoverSeedlessVaultScreen.tsx

// // import React, { useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   SafeAreaView,
// //   TouchableOpacity,
// //   TextInput,
// //   Alert,
// //   ActivityIndicator,
// //   ScrollView,
// //   Platform,
// // } from 'react-native';
// // import { useNavigation } from '@react-navigation/native';
// // import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// // import { RootStackParamList, VaultData } from '../types/navigation';
// // import { useVaults } from '../context/VaultContext';
// // import DocumentPicker from 'react-native-document-picker';
// // import RNFS from 'react-native-fs';
// // import * as Keychain from 'react-native-keychain';
// // import api from '../services/api';

// // type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// // type Step = 'upload' | 'enter_secret' | 'recovering' | 'done';

// // const RecoverSeedlessVaultScreen = () => {
// //   const navigation = useNavigation<NavigationProp>();
// //   const { addVault } = useVaults();

// //   const [step, setStep] = useState<Step>('upload');
// //   const [backupFile, setBackupFile] = useState<any>(null);
// //   const [backupFileName, setBackupFileName] = useState('');
// //   const [totpSecret, setTotpSecret] = useState('');
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [recoveredVault, setRecoveredVault] = useState<VaultData | null>(null);
// //   const [error, setError] = useState('');

// //   // ═══════════════════════════════════════════════════════════════
// //   // STEP 1: UPLOAD BACKUP FILE
// //   // ═══════════════════════════════════════════════════════════════
// //   const pickBackupFile = async () => {
// //     try {
// //       const result = await DocumentPicker.pickSingle({
// //         type: [DocumentPicker.types.json, DocumentPicker.types.allFiles],
// //       });

// //       console.log('📁 Picked file:', result.name);

// //       const content = await RNFS.readFile(result.uri, 'utf8');
// //       const parsed = JSON.parse(content);

// //       // Validate it's a seedless backup
// //       if (!parsed.encryptedData) {
// //         Alert.alert(
// //           'Invalid Backup',
// //           'This doesn\'t appear to be a seedless wallet backup. Make sure you selected the correct file.'
// //         );
// //         return;
// //       }

// //       setBackupFile(parsed);
// //       setBackupFileName(result.name || 'backup.json');
// //       setStep('enter_secret');

// //     } catch (err: any) {
// //       if (!DocumentPicker.isCancel(err)) {
// //         console.error('File pick error:', err);
// //         Alert.alert('Error', 'Failed to read backup file');
// //       }
// //     }
// //   };

// //   // ═══════════════════════════════════════════════════════════════
// //   // STEP 2: ENTER TOTP SECRET AND RECOVER
// //   // ═══════════════════════════════════════════════════════════════
// //   const recoverWallet = async () => {
// //     if (!totpSecret.trim()) {
// //       Alert.alert('Error', 'Please enter your TOTP secret');
// //       return;
// //     }

// //     setIsLoading(true);
// //     setError('');
// //     setStep('recovering');

// //     try {
// //       console.log('🔐 Recovering seedless wallet...');

// //       const response = await api.recoverSeedlessVault(
// //         backupFile,
// //         totpSecret.trim(),
// //         true // restore to TEE
// //       );

// //       if (response.ok) {
// //         console.log('✅ Recovery successful:', response.walletId);

// //         // Store device share securely
// //         await Keychain.setGenericPassword(
// //           'deviceShare',
// //           response.deviceShare,
// //           { service: `seedless_share_${response.walletId}` }
// //         );

// //         // Store TOTP secret
// //         await Keychain.setGenericPassword(
// //           'totpSecret',
// //           totpSecret.trim(),
// //           { service: `seedless_totp_${response.walletId}` }
// //         );

// //         // Build vault data
// //         const vaultData: VaultData = {
// //           vault_id: response.walletId,
// //           vault_name: backupFile.walletId || 'Recovered Wallet',
// //           vault_type: 'personal',
// //           wallet_type: 'seedless',
// //           created_at: new Date().toISOString(),
// //           sol: {
// //             address: response.publicKey || backupFile.publicKey,
// //             mpc_provider: 'oasis-tee',
// //           },
// //         };

// //         // Save to storage
// //         await addVault(vaultData);
// //         setRecoveredVault(vaultData);
// //         setStep('done');

// //       } else {
// //         throw new Error(response.error || 'Recovery failed');
// //       }

// //     } catch (err: any) {
// //       console.error('Recovery error:', err);
// //       setError(err.message || 'Recovery failed. Check your TOTP secret.');
// //       setStep('enter_secret');
// //     }

// //     setIsLoading(false);
// //   };

// //   // ═══════════════════════════════════════════════════════════════
// //   // STEP 3: DONE - GO TO HOME
// //   // ═══════════════════════════════════════════════════════════════
// //   const goToHome = () => {
// //     if (recoveredVault) {
// //       navigation.reset({
// //         index: 0,
// //         routes: [{ name: 'Home', params: { vault: recoveredVault } }],
// //       });
// //     }
// //   };

// //   // ═══════════════════════════════════════════════════════════════
// //   // RENDER: UPLOAD STEP
// //   // ═══════════════════════════════════════════════════════════════
// //   if (step === 'upload') {
// //     return (
// //       <SafeAreaView style={styles.container}>
// //         <View style={styles.content}>
// //           <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
// //             <Text style={styles.backButtonText}>← Back</Text>
// //           </TouchableOpacity>

// //           <View style={styles.centerContent}>
// //             <Text style={styles.emoji}>📁</Text>
// //             <Text style={styles.title}>Recover Seedless Wallet</Text>
// //             <Text style={styles.subtitle}>
// //               Upload your backup file to start recovery
// //             </Text>

// //             <View style={styles.infoCard}>
// //               <Text style={styles.infoTitle}>You'll need:</Text>
// //               <Text style={styles.infoItem}>✓ Your backup JSON file</Text>
// //               <Text style={styles.infoItem}>✓ Your TOTP secret from Google Authenticator</Text>
// //             </View>

// //             <TouchableOpacity style={styles.primaryButton} onPress={pickBackupFile}>
// //               <Text style={styles.primaryButtonText}>Select Backup File</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </SafeAreaView>
// //     );
// //   }

// //   // ═══════════════════════════════════════════════════════════════
// //   // RENDER: ENTER SECRET STEP
// //   // ═══════════════════════════════════════════════════════════════
// //   if (step === 'enter_secret') {
// //     return (
// //       <SafeAreaView style={styles.container}>
// //         <ScrollView contentContainerStyle={styles.scrollContent}>
// //           <TouchableOpacity style={styles.backButton} onPress={() => setStep('upload')}>
// //             <Text style={styles.backButtonText}>← Back</Text>
// //           </TouchableOpacity>

// //           <View style={styles.header}>
// //             <Text style={styles.emoji}>🔐</Text>
// //             <Text style={styles.title}>Enter TOTP Secret</Text>
// //             <Text style={styles.subtitle}>
// //               Enter the secret key from Google Authenticator to decrypt your backup
// //             </Text>
// //           </View>

// //           {/* File info */}
// //           <View style={styles.fileCard}>
// //             <Text style={styles.fileLabel}>Backup File</Text>
// //             <Text style={styles.fileName}>{backupFileName}</Text>
// //             <Text style={styles.fileWalletId}>
// //               Wallet: {backupFile?.walletId || 'Unknown'}
// //             </Text>
// //           </View>

// //           {/* TOTP Secret Input */}
// //           <View style={styles.inputSection}>
// //             <Text style={styles.inputLabel}>TOTP Secret</Text>
// //             <TextInput
// //               style={styles.input}
// //               value={totpSecret}
// //               onChangeText={setTotpSecret}
// //               placeholder="Enter your secret key..."
// //               placeholderTextColor="#6B7280"
// //               autoCapitalize="characters"
// //               autoCorrect={false}
// //             />
// //             <Text style={styles.inputHint}>
// //               💡 Find this in Google Authenticator:{'\n'}
// //               Settings → Export accounts → Show as QR or text
// //             </Text>
// //           </View>

// //           {/* Error */}
// //           {error ? (
// //             <View style={styles.errorCard}>
// //               <Text style={styles.errorText}>❌ {error}</Text>
// //             </View>
// //           ) : null}

// //           {/* Recover Button */}
// //           <TouchableOpacity
// //             style={[styles.primaryButton, !totpSecret.trim() && styles.buttonDisabled]}
// //             onPress={recoverWallet}
// //             disabled={!totpSecret.trim() || isLoading}
// //           >
// //             <Text style={styles.primaryButtonText}>Recover Wallet</Text>
// //           </TouchableOpacity>
// //         </ScrollView>
// //       </SafeAreaView>
// //     );
// //   }

// //   // ═══════════════════════════════════════════════════════════════
// //   // RENDER: RECOVERING STEP
// //   // ═══════════════════════════════════════════════════════════════
// //   if (step === 'recovering') {
// //     return (
// //       <SafeAreaView style={styles.container}>
// //         <View style={styles.centerContent}>
// //           <ActivityIndicator size="large" color="#4ECDC4" />
// //           <Text style={styles.title}>Recovering Wallet...</Text>
// //           <Text style={styles.subtitle}>
// //             Decrypting backup and restoring shares
// //           </Text>
// //         </View>
// //       </SafeAreaView>
// //     );
// //   }

// //   // ═══════════════════════════════════════════════════════════════
// //   // RENDER: DONE STEP
// //   // ═══════════════════════════════════════════════════════════════
// //   if (step === 'done' && recoveredVault) {
// //     return (
// //       <SafeAreaView style={styles.container}>
// //         <View style={styles.centerContent}>
// //           <Text style={styles.successEmoji}>✅</Text>
// //           <Text style={styles.title}>Wallet Recovered!</Text>
// //           <Text style={styles.subtitle}>
// //             Your seedless wallet has been restored
// //           </Text>

// //           <View style={styles.walletCard}>
// //             <Text style={styles.walletLabel}>Wallet ID</Text>
// //             <Text style={styles.walletId}>{recoveredVault.vault_id}</Text>
// //             <Text style={styles.walletLabel}>Address</Text>
// //             <Text style={styles.walletAddress} numberOfLines={1}>
// //               {recoveredVault.sol?.address}
// //             </Text>
// //           </View>

// //           <TouchableOpacity style={styles.primaryButton} onPress={goToHome}>
// //             <Text style={styles.primaryButtonText}>Go to Wallet →</Text>
// //           </TouchableOpacity>
// //         </View>
// //       </SafeAreaView>
// //     );
// //   }

// //   return null;
// // };

// // // ═══════════════════════════════════════════════════════════════
// // // STYLES
// // // ═══════════════════════════════════════════════════════════════
// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#0A1628',
// //   },
// //   content: {
// //     flex: 1,
// //     padding: 24,
// //   },
// //   scrollContent: {
// //     padding: 24,
// //     paddingBottom: 40,
// //   },
// //   centerContent: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   backButton: {
// //     marginBottom: 24,
// //   },
// //   backButtonText: {
// //     color: '#FFFFFF',
// //     fontSize: 16,
// //   },
// //   header: {
// //     alignItems: 'center',
// //     marginBottom: 32,
// //   },
// //   emoji: {
// //     fontSize: 64,
// //     marginBottom: 16,
// //   },
// //   successEmoji: {
// //     fontSize: 80,
// //     marginBottom: 24,
// //   },
// //   title: {
// //     fontSize: 28,
// //     fontWeight: 'bold',
// //     color: '#FFFFFF',
// //     marginBottom: 8,
// //     textAlign: 'center',
// //   },
// //   subtitle: {
// //     fontSize: 16,
// //     color: '#9CA3AF',
// //     textAlign: 'center',
// //     lineHeight: 22,
// //   },
// //   infoCard: {
// //     backgroundColor: '#1E293B',
// //     borderRadius: 12,
// //     padding: 20,
// //     marginTop: 32,
// //     marginBottom: 32,
// //     width: '100%',
// //   },
// //   infoTitle: {
// //     color: '#FFFFFF',
// //     fontSize: 14,
// //     fontWeight: '600',
// //     marginBottom: 12,
// //   },
// //   infoItem: {
// //     color: '#9CA3AF',
// //     fontSize: 14,
// //     marginBottom: 8,
// //   },
// //   fileCard: {
// //     backgroundColor: '#1E293B',
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 24,
// //   },
// //   fileLabel: {
// //     color: '#9CA3AF',
// //     fontSize: 12,
// //     marginBottom: 4,
// //   },
// //   fileName: {
// //     color: '#4ECDC4',
// //     fontSize: 16,
// //     fontWeight: '600',
// //     marginBottom: 8,
// //   },
// //   fileWalletId: {
// //     color: '#6B7280',
// //     fontSize: 12,
// //   },
// //   inputSection: {
// //     marginBottom: 24,
// //   },
// //   inputLabel: {
// //     color: '#FFFFFF',
// //     fontSize: 14,
// //     fontWeight: '600',
// //     marginBottom: 8,
// //   },
// //   input: {
// //     backgroundColor: '#1E293B',
// //     borderRadius: 12,
// //     padding: 16,
// //     fontSize: 16,
// //     color: '#FFFFFF',
// //     borderWidth: 1,
// //     borderColor: '#374151',
// //     fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
// //   },
// //   inputHint: {
// //     color: '#6B7280',
// //     fontSize: 12,
// //     marginTop: 8,
// //     lineHeight: 18,
// //   },
// //   errorCard: {
// //     backgroundColor: 'rgba(239, 68, 68, 0.1)',
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 24,
// //     borderWidth: 1,
// //     borderColor: 'rgba(239, 68, 68, 0.3)',
// //   },
// //   errorText: {
// //     color: '#EF4444',
// //     fontSize: 14,
// //   },
// //   walletCard: {
// //     backgroundColor: '#1E293B',
// //     borderRadius: 16,
// //     padding: 20,
// //     marginTop: 32,
// //     marginBottom: 32,
// //     width: '100%',
// //   },
// //   walletLabel: {
// //     color: '#9CA3AF',
// //     fontSize: 12,
// //     marginBottom: 4,
// //     marginTop: 12,
// //   },
// //   walletId: {
// //     color: '#FFFFFF',
// //     fontSize: 14,
// //     fontWeight: '600',
// //   },
// //   walletAddress: {
// //     color: '#4ECDC4',
// //     fontSize: 12,
// //     fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
// //   },
// //   primaryButton: {
// //     backgroundColor: '#4ECDC4',
// //     borderRadius: 12,
// //     padding: 18,
// //     alignItems: 'center',
// //     width: '100%',
// //   },
// //   primaryButtonText: {
// //     color: '#000000',
// //     fontSize: 18,
// //     fontWeight: '700',
// //   },
// //   buttonDisabled: {
// //     opacity: 0.5,
// //   },
// // });

// // export default RecoverSeedlessVaultScreen;

// // screens/RecoverSeedlessVaultScreen.tsx

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   ActivityIndicator,
//   ScrollView,
//   Platform,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList, VaultData } from '../types/navigation';
// import { useVaults } from '../context/VaultContext';
// import * as Keychain from 'react-native-keychain';
// import Clipboard from '@react-native-clipboard/clipboard';
// import RNFS from 'react-native-fs';
// import api from '../services/api';

// // Try to import DocumentPicker, but don't crash if it's not available
// let DocumentPicker: any = null;
// try {
//   DocumentPicker = require('react-native-document-picker').default;
// } catch (e) {
//   console.log('DocumentPicker not available - using paste mode only');
// }

// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'RecoverSeedlessVault'>;
// type Step = 'select_method' | 'paste_backup' | 'enter_totp' | 'recovering' | 'success';

// const RecoverSeedlessVaultScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const { addVault, setActiveVault } = useVaults();

//   const [step, setStep] = useState<Step>('select_method');
//   const [backupJson, setBackupJson] = useState('');
//   const [backupFile, setBackupFile] = useState<any>(null);
//   const [backupFileName, setBackupFileName] = useState('');
//   const [totpCode, setTotpCode] = useState('');
//   const [recovering, setRecovering] = useState(false);
//   const [error, setError] = useState('');

//   // Check if file picker is available
//   const isFilePickerAvailable = DocumentPicker !== null;

//   // ═══════════════════════════════════════════════════════════════
//   // FILE PICKER (if native module is available)
//   // ═══════════════════════════════════════════════════════════════
//   const pickBackupFile = async () => {
//     if (!isFilePickerAvailable) {
//       Alert.alert(
//         'File Picker Unavailable',
//         'The file picker is not available. Please use the "Paste Backup" option instead.',
//         [{ text: 'OK', onPress: () => setStep('paste_backup') }]
//       );
//       return;
//     }

//     try {
//       const result = await DocumentPicker.pickSingle({
//         type: [DocumentPicker.types.json, DocumentPicker.types.allFiles],
//       });

//       console.log('Selected file:', result);

//       // Read file content
//       const content = await RNFS.readFile(result.uri, 'utf8');
//       const parsed = JSON.parse(content);

//       // Validate
//       if (!parsed.type || parsed.type !== 'seedless_backup') {
//         Alert.alert('Invalid File', 'This is not a valid PawPad seedless backup file.');
//         return;
//       }

//       setBackupFile(parsed);
//       setBackupFileName(result.name || 'backup.json');
//       setStep('enter_totp');

//     } catch (err: any) {
//       if (DocumentPicker && !DocumentPicker.isCancel(err)) {
//         console.error('File pick error:', err);
//         Alert.alert(
//           'File Picker Error',
//           'Could not read the file. Please try pasting the backup content instead.',
//           [
//             { text: 'Cancel', style: 'cancel' },
//             { text: 'Paste Instead', onPress: () => setStep('paste_backup') }
//           ]
//         );
//       }
//     }
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // PASTE FROM CLIPBOARD
//   // ═══════════════════════════════════════════════════════════════
//   const pasteFromClipboard = async () => {
//     try {
//       const content = await Clipboard.getString();
//       if (content) {
//         setBackupJson(content);
//       } else {
//         Alert.alert('Clipboard Empty', 'No content found in clipboard');
//       }
//     } catch (err) {
//       console.log('Clipboard error:', err);
//       Alert.alert('Error', 'Could not read from clipboard');
//     }
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // VALIDATE PASTED BACKUP
//   // ═══════════════════════════════════════════════════════════════
//   const validatePastedBackup = () => {
//   try {
//     const parsed = JSON.parse(backupJson.trim());
    
//     // Check for required fields (works with both old and new format)
//     if (!parsed.walletId || !parsed.publicKey || !parsed.encryptedData) {
//       Alert.alert(
//         'Invalid Backup', 
//         'Missing required fields.\n\nExpected: walletId, publicKey, encryptedData'
//       );
//       return;
//     }

//     // Verify it's a seedless backup (check type OR walletId contains "seedless")
//     const isSeedless = parsed.type === 'seedless_backup' || 
//                        parsed.walletId?.includes('seedless');
    
//     if (!isSeedless) {
//       Alert.alert(
//         'Wrong Backup Type',
//         'This is not a seedless wallet backup.\n\nUse "Seed Phrase" recovery for regular wallets.'
//       );
//       return;
//     }

//     console.log('✅ Valid seedless backup:', parsed.walletId);
    
//     setBackupFile(parsed);
//     setBackupFileName(parsed.walletId + '.json');
//     setStep('enter_totp');
//     setError('');

//   } catch (err) {
//     console.error('JSON parse error:', err);
//     Alert.alert(
//       'Invalid JSON', 
//       'Could not parse the backup content.\n\nMake sure you copied the entire file.'
//     );
//   }
// };

//   // ═══════════════════════════════════════════════════════════════
//   // RECOVER WALLET
//   // ═══════════════════════════════════════════════════════════════
//   const recoverWallet = async () => {
//     if (totpCode.length !== 6) {
//       Alert.alert('Error', 'Please enter a 6-digit code');
//       return;
//     }

//     setRecovering(true);
//     setError('');
//     setStep('recovering');

//     try {
//       const response = await api.recoverSeedlessVault(backupFile, totpCode);

//       if (response.ok) {
//         // Store device share
//         await Keychain.setGenericPassword(
//           `seedless_share_${response.walletId}`,
//           response.deviceShare,
//           { service: `seedless_share_${response.walletId}` }
//         );

//         // Store TOTP secret if returned
//         if (response.totpSecret) {
//           await Keychain.setGenericPassword(
//             `seedless_totp_${response.walletId}`,
//             response.totpSecret,
//             { service: `seedless_totp_${response.walletId}` }
//           );
//         }

//         // Create vault data
//         const recoveredVault: VaultData = {
//           vault_id: response.walletId,
//           vault_name: backupFile.walletName || backupFile.wallet_name || 'Recovered Wallet',
//           vault_type: 'personal',
//           wallet_type: 'seedless',
//           chain: 'ZEC',
//           publicKey: response.publicKey,
//           created_at: backupFile.created || new Date().toISOString(),
//           zec: {
//             address: response.publicKey,
//             mpc_provider: 'oasis-tee',
//           },
//           oasis: response.oasis,
//         };

//         await addVault(recoveredVault);
//         await setActiveVault(recoveredVault.vault_id);

//         setStep('success');

//         setTimeout(() => {
//           navigation.reset({
//             index: 0,
//             routes: [{ name: 'Home', params: { vault: recoveredVault } }],
//           });
//         }, 2000);

//       } else {
//         throw new Error(response.error || 'Recovery failed');
//       }

//     } catch (err: any) {
//       console.error('Recovery error:', err);
//       setError(err.message || 'Failed to recover wallet. Check your TOTP code.');
//       setStep('enter_totp');
//     }

//     setRecovering(false);
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // RENDER: SELECT METHOD
//   // ═══════════════════════════════════════════════════════════════
//   if (step === 'select_method') {
//     return (
//       <SafeAreaView style={styles.container}>
//         <ScrollView contentContainerStyle={styles.scrollContent}>
//           <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//             <Text style={styles.backButtonText}>← Back</Text>
//           </TouchableOpacity>

//           <View style={styles.header}>
//             <Text style={styles.headerIcon}>🔐</Text>
//             <Text style={styles.title}>Recover Seedless Wallet</Text>
//             <Text style={styles.subtitle}>
//               Choose how to restore your wallet
//             </Text>
//           </View>

//           {/* Option 1: Upload File */}
//           <TouchableOpacity 
//             style={[styles.optionCard, !isFilePickerAvailable && styles.optionCardDisabled]}
//             onPress={pickBackupFile}
//           >
//             <Text style={styles.optionIcon}>📂</Text>
//             <View style={styles.optionInfo}>
//               <Text style={styles.optionTitle}>Upload Backup File</Text>
//               <Text style={styles.optionDesc}>
//                 {isFilePickerAvailable 
//                   ? 'Select your .json backup file'
//                   : 'Requires app rebuild - use paste instead'}
//               </Text>
//             </View>
//             <Text style={styles.optionArrow}>→</Text>
//           </TouchableOpacity>

//           {/* Option 2: Paste */}
//           <TouchableOpacity 
//             style={styles.optionCard}
//             onPress={() => setStep('paste_backup')}
//           >
//             <Text style={styles.optionIcon}>📋</Text>
//             <View style={styles.optionInfo}>
//               <Text style={styles.optionTitle}>Paste Backup Content</Text>
//               <Text style={styles.optionDesc}>Copy & paste the JSON content</Text>
//             </View>
//             <Text style={styles.optionArrow}>→</Text>
//           </TouchableOpacity>

//           {/* Requirements */}
//           <View style={styles.requirementsCard}>
//             <Text style={styles.requirementsTitle}>📱 You'll also need:</Text>
//             <Text style={styles.requirementsItem}>• Google Authenticator app</Text>
//             <Text style={styles.requirementsItem}>• The PawPad entry still set up</Text>
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // RENDER: PASTE BACKUP
//   // ═══════════════════════════════════════════════════════════════
//   if (step === 'paste_backup') {
//     return (
//       <SafeAreaView style={styles.container}>
//         <ScrollView contentContainerStyle={styles.scrollContent}>
//           <TouchableOpacity style={styles.backButton} onPress={() => setStep('select_method')}>
//             <Text style={styles.backButtonText}>← Back</Text>
//           </TouchableOpacity>

//           <View style={styles.header}>
//             <Text style={styles.title}>Paste Backup Content</Text>
//             <Text style={styles.subtitle}>
//               Open your backup .json file and copy all the text
//             </Text>
//           </View>

//           {/* Instructions */}
//           <View style={styles.infoCard}>
//             <Text style={styles.infoTitle}>📝 How to get backup content:</Text>
//             <Text style={styles.infoItem}>1. Find your pawpad_seedless_backup_*.json file</Text>
//             <Text style={styles.infoItem}>2. Open it with any text editor</Text>
//             <Text style={styles.infoItem}>3. Select All (Ctrl+A) and Copy (Ctrl+C)</Text>
//             <Text style={styles.infoItem}>4. Paste it below</Text>
//           </View>

//           {/* Paste button */}
//           <TouchableOpacity style={styles.pasteButton} onPress={pasteFromClipboard}>
//             <Text style={styles.pasteButtonText}>📋 Paste from Clipboard</Text>
//           </TouchableOpacity>

//           {/* Text input */}
//           <TextInput
//             style={styles.backupInput}
//             value={backupJson}
//             onChangeText={setBackupJson}
//             placeholder='{"type":"seedless_backup","version":"1.0",...}'
//             placeholderTextColor="#4B5563"
//             multiline
//             numberOfLines={10}
//             textAlignVertical="top"
//           />

//           {/* Continue button */}
//           <TouchableOpacity
//             style={[styles.primaryButton, !backupJson.trim() && styles.buttonDisabled]}
//             onPress={validatePastedBackup}
//             disabled={!backupJson.trim()}
//           >
//             <Text style={styles.primaryButtonText}>Validate & Continue →</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       </SafeAreaView>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // RENDER: ENTER TOTP
//   // ═══════════════════════════════════════════════════════════════
//   if (step === 'enter_totp') {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.centerContent}>
//           <Text style={styles.title}>Enter Authenticator Code</Text>
//           <Text style={styles.subtitle}>
//             Open Google Authenticator and enter the 6-digit code for PawPad
//           </Text>

//           {/* File/Wallet info */}
//           <View style={styles.walletInfo}>
//             <Text style={styles.walletInfoIcon}>📄</Text>
//             <View>
//               <Text style={styles.walletInfoLabel}>Backup:</Text>
//               <Text style={styles.walletInfoName}>
//                 {backupFile?.walletName || backupFile?.wallet_name || backupFileName}
//               </Text>
//             </View>
//           </View>

//           {/* Code input */}
//           <TextInput
//             style={styles.codeInput}
//             value={totpCode}
//             onChangeText={(text) => setTotpCode(text.replace(/[^0-9]/g, ''))}
//             keyboardType="number-pad"
//             maxLength={6}
//             placeholder="000000"
//             placeholderTextColor="#4B5563"
//             autoFocus
//           />

//           {error ? <Text style={styles.errorText}>{error}</Text> : null}

//           {/* Recover button */}
//           <TouchableOpacity
//             style={[styles.primaryButton, totpCode.length !== 6 && styles.buttonDisabled]}
//             onPress={recoverWallet}
//             disabled={totpCode.length !== 6 || recovering}
//           >
//             {recovering ? (
//               <ActivityIndicator color="#000" />
//             ) : (
//               <Text style={styles.primaryButtonText}>🔓 Recover Wallet</Text>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.backLink} onPress={() => setStep('select_method')}>
//             <Text style={styles.backLinkText}>← Start Over</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // RENDER: RECOVERING
//   // ═══════════════════════════════════════════════════════════════
//   if (step === 'recovering') {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.centerContent}>
//           <ActivityIndicator size="large" color="#4ECDC4" />
//           <Text style={[styles.title, { marginTop: 24 }]}>Recovering Wallet...</Text>
//           <Text style={styles.subtitle}>Please wait while we restore your wallet</Text>

//           <View style={styles.progressCard}>
//             <Text style={styles.progressItem}>✓ Backup file validated</Text>
//             <Text style={styles.progressItem}>✓ TOTP code verified</Text>
//             <Text style={styles.progressItemActive}>⏳ Retrieving Share2 from Oasis TEE...</Text>
//             <Text style={styles.progressItemPending}>○ Reconstructing wallet keys</Text>
//           </View>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // RENDER: SUCCESS
//   // ═══════════════════════════════════════════════════════════════
//   if (step === 'success') {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.centerContent}>
//           <Text style={styles.successIcon}>✅</Text>
//           <Text style={styles.title}>Wallet Recovered!</Text>
//           <Text style={styles.subtitle}>
//             Your seedless wallet has been restored successfully
//           </Text>
//           <ActivityIndicator color="#4ECDC4" style={{ marginTop: 24 }} />
//           <Text style={styles.redirectText}>Redirecting to wallet...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return null;
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0A1628',
//   },
//   scrollContent: {
//     padding: 24,
//     paddingBottom: 40,
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
//     color: '#4ECDC4',
//     fontSize: 16,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 32,
//   },
//   headerIcon: {
//     fontSize: 48,
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#9CA3AF',
//     textAlign: 'center',
//     lineHeight: 22,
//   },
  
//   // Option cards
//   optionCard: {
//     backgroundColor: '#1E293B',
//     borderRadius: 16,
//     padding: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#334155',
//   },
//   optionCardDisabled: {
//     opacity: 0.5,
//   },
//   optionIcon: {
//     fontSize: 32,
//     marginRight: 16,
//   },
//   optionInfo: {
//     flex: 1,
//   },
//   optionTitle: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   optionDesc: {
//     color: '#9CA3AF',
//     fontSize: 14,
//   },
//   optionArrow: {
//     color: '#4ECDC4',
//     fontSize: 24,
//   },
  
//   // Requirements
//   requirementsCard: {
//     backgroundColor: 'rgba(78, 205, 196, 0.1)',
//     borderWidth: 1,
//     borderColor: '#4ECDC4',
//     borderRadius: 12,
//     padding: 16,
//     marginTop: 8,
//   },
//   requirementsTitle: {
//     color: '#4ECDC4',
//     fontSize: 14,
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   requirementsItem: {
//     color: '#9CA3AF',
//     fontSize: 14,
//     marginBottom: 4,
//   },
  
//   // Info card
//   infoCard: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//   },
//   infoTitle: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   infoItem: {
//     color: '#9CA3AF',
//     fontSize: 14,
//     marginBottom: 6,
//   },
  
//   // Paste
//   pasteButton: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 16,
//     alignItems: 'center',
//     marginBottom: 12,
//     borderWidth: 2,
//     borderColor: '#4ECDC4',
//     borderStyle: 'dashed',
//   },
//   pasteButtonText: {
//     color: '#4ECDC4',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   backupInput: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 16,
//     color: '#FFFFFF',
//     fontSize: 13,
//     fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
//     minHeight: 180,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#334155',
//   },
  
//   // Wallet info
//   walletInfo: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 24,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   walletInfoIcon: {
//     fontSize: 32,
//     marginRight: 16,
//   },
//   walletInfoLabel: {
//     color: '#9CA3AF',
//     fontSize: 12,
//   },
//   walletInfoName: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
  
//   // Code input
//   codeInput: {
//     width: 220,
//     height: 70,
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     fontSize: 32,
//     textAlign: 'center',
//     color: '#FFFFFF',
//     letterSpacing: 8,
//     marginVertical: 24,
//     fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
//     borderWidth: 2,
//     borderColor: '#334155',
//   },
  
//   // Buttons
//   primaryButton: {
//     backgroundColor: '#4ECDC4',
//     borderRadius: 12,
//     padding: 18,
//     alignItems: 'center',
//     width: '100%',
//   },
//   primaryButtonText: {
//     color: '#000000',
//     fontSize: 18,
//     fontWeight: '700',
//   },
//   buttonDisabled: {
//     opacity: 0.5,
//   },
//   backLink: {
//     marginTop: 24,
//     padding: 12,
//   },
//   backLinkText: {
//     color: '#4ECDC4',
//     fontSize: 14,
//   },
  
//   // Error
//   errorText: {
//     color: '#EF4444',
//     fontSize: 14,
//     marginBottom: 16,
//     textAlign: 'center',
//     paddingHorizontal: 20,
//   },
  
//   // Progress
//   progressCard: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 20,
//     marginTop: 24,
//     width: '100%',
//   },
//   progressItem: {
//     color: '#10B981',
//     fontSize: 14,
//     marginBottom: 8,
//   },
//   progressItemActive: {
//     color: '#F59E0B',
//     fontSize: 14,
//     marginBottom: 8,
//   },
//   progressItemPending: {
//     color: '#6B7280',
//     fontSize: 14,
//   },
  
//   // Success
//   successIcon: {
//     fontSize: 72,
//     marginBottom: 16,
//   },
//   redirectText: {
//     color: '#9CA3AF',
//     fontSize: 14,
//     marginTop: 12,
//   },
// });

// export default RecoverSeedlessVaultScreen;


import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, VaultData } from '../types/navigation';
import { useVaults } from '../context/VaultContext';
import * as Keychain from 'react-native-keychain';
import Clipboard from '@react-native-clipboard/clipboard';
import api from '../services/api';

// Try to import DocumentPicker, but don't crash if it's not available
let DocumentPicker: any = null;
try {
  DocumentPicker = require('react-native-document-picker').default;
} catch (e) {
  console.log('DocumentPicker not available - using paste mode only');
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'RecoverSeedlessVault'>;
type Step = 'select_method' | 'paste_backup' | 'enter_totp' | 'recovering' | 'success';

const RecoverSeedlessVaultScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { addVault, setActiveVault } = useVaults();

  const [step, setStep] = useState<Step>('select_method');
  const [backupJson, setBackupJson] = useState('');
  const [backupFile, setBackupFile] = useState<any>(null);
  const [backupFileName, setBackupFileName] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [recovering, setRecovering] = useState(false);
  const [error, setError] = useState('');
  const [useFullSecret, setUseFullSecret] = useState(false);  // Toggle for 6-digit vs full secret

  // Check if file picker is available
  const isFilePickerAvailable = DocumentPicker !== null;

  // ═══════════════════════════════════════════════════════════════
  // FILE PICKER (if native module is available)
  // ═══════════════════════════════════════════════════════════════
  const pickBackupFile = async () => {
    if (!isFilePickerAvailable) {
      Alert.alert(
        'File Picker Unavailable',
        'The file picker is not available. Please use the "Paste Backup" option instead.',
        [{ text: 'OK', onPress: () => setStep('paste_backup') }]
      );
      return;
    }

    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.json, DocumentPicker.types.allFiles],
      });

      console.log('Selected file:', result);

      // Read file content
      const RNFS = require('react-native-fs');
      const content = await RNFS.readFile(result.uri, 'utf8');
      const parsed = JSON.parse(content);

      // Validate
      if (!parsed.walletId || !parsed.encryptedData) {
        Alert.alert('Invalid File', 'This is not a valid PawPad seedless backup file.');
        return;
      }

      setBackupFile(parsed);
      setBackupFileName(result.name || 'backup.json');
      setStep('enter_totp');

    } catch (err: any) {
      if (DocumentPicker && !DocumentPicker.isCancel(err)) {
        console.error('File pick error:', err);
        Alert.alert(
          'File Picker Error',
          'Could not read the file. Please try pasting the backup content instead.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Paste Instead', onPress: () => setStep('paste_backup') }
          ]
        );
      }
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // PASTE FROM CLIPBOARD
  // ═══════════════════════════════════════════════════════════════
  const pasteFromClipboard = async () => {
    try {
      const content = await Clipboard.getString();
      if (content) {
        setBackupJson(content);
      } else {
        Alert.alert('Clipboard Empty', 'No content found in clipboard');
      }
    } catch (err) {
      console.log('Clipboard error:', err);
      Alert.alert('Error', 'Could not read from clipboard');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // VALIDATE PASTED BACKUP
  // ═══════════════════════════════════════════════════════════════
  const validatePastedBackup = () => {
    try {
      const parsed = JSON.parse(backupJson.trim());
      
      // Check for required fields
      if (!parsed.walletId || !parsed.publicKey || !parsed.encryptedData) {
        Alert.alert(
          'Invalid Backup', 
          'Missing required fields.\n\nExpected: walletId, publicKey, encryptedData'
        );
        return;
      }

      // Verify it's a seedless backup
      const isSeedless = parsed.type === 'seedless_backup' || 
                         parsed.walletId?.includes('seedless');
      
      if (!isSeedless) {
        Alert.alert(
          'Wrong Backup Type',
          'This is not a seedless wallet backup.\n\nUse "Seed Phrase" recovery for regular wallets.'
        );
        return;
      }

      console.log('✅ Valid seedless backup:', parsed.walletId);
      
      setBackupFile(parsed);
      setBackupFileName(parsed.walletId + '.json');
      setStep('enter_totp');
      setError('');

    } catch (err) {
      console.error('JSON parse error:', err);
      Alert.alert(
        'Invalid JSON', 
        'Could not parse the backup content.\n\nMake sure you copied the entire file.'
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // RECOVER WALLET
  // ═══════════════════════════════════════════════════════════════
  const recoverWallet = async () => {
    // Validate input based on mode
    if (!useFullSecret && totpCode.length !== 6) {
      Alert.alert('Error', 'Please enter a 6-digit code');
      return;
    }
    
    if (useFullSecret && totpCode.length < 10) {
      Alert.alert('Error', 'TOTP secret should be at least 10 characters');
      return;
    }

    setRecovering(true);
    setError('');
    setStep('recovering');

    try {
      // Call API with either 6-digit code OR full secret
      const response = await api.recoverSeedlessVault(
        backupFile, 
        totpCode  // Backend handles both 6-digit and full secret
      );

      if (response.ok) {
        // Store device share
        await Keychain.setGenericPassword(
          `seedless_share_${response.walletId}`,
          response.deviceShare,
          { service: `seedless_share_${response.walletId}` }
        );

        // Store TOTP secret if returned
        if (response.totpSecret) {
          await Keychain.setGenericPassword(
            `seedless_totp_${response.walletId}`,
            response.totpSecret,
            { service: `seedless_totp_${response.walletId}` }
          );
        }

        // Create vault data
        // const recoveredVault: VaultData = {
        //   vault_id: response.walletId,
        //   vault_name: backupFile.walletName || backupFile.wallet_name || 'Recovered Wallet',
        //   vault_type: 'personal',
        //   wallet_type: 'seedless',
        //   chain: 'ZEC',
        //   publicKey: response.publicKey,
        //   created_at: backupFile.created || new Date().toISOString(),
        //   zec: {
        //     address: response.publicKey,
        //     mpc_provider: 'oasis-tee',
        //   },
        //   oasis: response.oasis,
        // };
        // Create vault data
        const recoveredVault: VaultData = {
          vault_id: response.walletId,
          vault_name: backupFile.walletName || backupFile.wallet_name || 'Recovered Wallet',
          vault_type: 'personal',
          wallet_type: 'seedless',
          chain: 'ZEC',
          publicKey: response.publicKey,
          created_at: backupFile.created || new Date().toISOString(),
          zec: {
            address: response.publicKey,
            mpc_provider: 'oasis-tee',
          },
          oasis: response.oasis,
        };

        // Add vault to local state first
        try {
          await addVault(recoveredVault);
        } catch (addErr: any) {
          // Vault might already exist - that's OK for recovery
          console.log('addVault result:', addErr?.message || 'added');
        }

        // Set active vault - pass the vault object directly if possible
        try {
          await setActiveVault(recoveredVault.vault_id);
        } catch (setActiveErr: any) {
          // If setActiveVault fails, try setting it directly
          console.log('setActiveVault error (non-fatal):', setActiveErr?.message);
        }

        setStep('success');

        // Navigate with the vault object we already have
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home', params: { vault: recoveredVault } }],
          });
        }, 2000);

        await addVault(recoveredVault);
        await setActiveVault(recoveredVault.vault_id);

        setStep('success');

        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home', params: { vault: recoveredVault } }],
          });
        }, 2000);

      } else {
        throw new Error(response.error || 'Recovery failed');
      }

    } catch (err: any) {
      console.error('Recovery error:', err);
      
      // Check if error suggests using full secret
      const errorMsg = err.message || 'Failed to recover wallet';
      
      if (errorMsg.includes('not found in TEE') || errorMsg.includes('old wallet')) {
        setError('This wallet was created before the update. Please toggle "Use full TOTP secret" and enter your TOTP secret from the backup.');
        setUseFullSecret(true);
      } else {
        setError(errorMsg);
      }
      
      setStep('enter_totp');
    }

    setRecovering(false);
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER: SELECT METHOD
  // ═══════════════════════════════════════════════════════════════
  if (step === 'select_method') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.headerIcon}>🔐</Text>
            <Text style={styles.title}>Recover Seedless Wallet</Text>
            <Text style={styles.subtitle}>
              Choose how to restore your wallet
            </Text>
          </View>

          {/* Option 1: Upload File */}
          <TouchableOpacity 
            style={[styles.optionCard, !isFilePickerAvailable && styles.optionCardDisabled]}
            onPress={pickBackupFile}
          >
            <Text style={styles.optionIcon}>📂</Text>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Upload Backup File</Text>
              <Text style={styles.optionDesc}>
                {isFilePickerAvailable 
                  ? 'Select your .json backup file'
                  : 'Requires app rebuild - use paste instead'}
              </Text>
            </View>
            <Text style={styles.optionArrow}>→</Text>
          </TouchableOpacity>

          {/* Option 2: Paste */}
          <TouchableOpacity 
            style={styles.optionCard}
            onPress={() => setStep('paste_backup')}
          >
            <Text style={styles.optionIcon}>📋</Text>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Paste Backup Content</Text>
              <Text style={styles.optionDesc}>Copy & paste the JSON content</Text>
            </View>
            <Text style={styles.optionArrow}>→</Text>
          </TouchableOpacity>

          {/* Requirements */}
          <View style={styles.requirementsCard}>
            <Text style={styles.requirementsTitle}>📱 You'll also need:</Text>
            <Text style={styles.requirementsItem}>• Google Authenticator app</Text>
            <Text style={styles.requirementsItem}>• The PawPad entry still set up</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: PASTE BACKUP
  // ═══════════════════════════════════════════════════════════════
  if (step === 'paste_backup') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => setStep('select_method')}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Paste Backup Content</Text>
            <Text style={styles.subtitle}>
              Open your backup .json file and copy all the text
            </Text>
          </View>

          {/* Instructions */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>📝 How to get backup content:</Text>
            <Text style={styles.infoItem}>1. Find your pawpad_seedless_backup_*.json file</Text>
            <Text style={styles.infoItem}>2. Open it with any text editor</Text>
            <Text style={styles.infoItem}>3. Select All (Ctrl+A) and Copy (Ctrl+C)</Text>
            <Text style={styles.infoItem}>4. Paste it below</Text>
          </View>

          {/* Paste button */}
          <TouchableOpacity style={styles.pasteButton} onPress={pasteFromClipboard}>
            <Text style={styles.pasteButtonText}>📋 Paste from Clipboard</Text>
          </TouchableOpacity>

          {/* Text input */}
          <TextInput
            style={styles.backupInput}
            value={backupJson}
            onChangeText={setBackupJson}
            placeholder='{"type":"seedless_backup","version":"1.0",...}'
            placeholderTextColor="#4B5563"
            multiline
            numberOfLines={10}
            textAlignVertical="top"
          />

          {/* Continue button */}
          <TouchableOpacity
            style={[styles.primaryButton, !backupJson.trim() && styles.buttonDisabled]}
            onPress={validatePastedBackup}
            disabled={!backupJson.trim()}
          >
            <Text style={styles.primaryButtonText}>Validate & Continue →</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: ENTER TOTP
  // ═══════════════════════════════════════════════════════════════
  if (step === 'enter_totp') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.centerScrollContent}>
          <Text style={styles.title}>
            {useFullSecret ? 'Enter TOTP Secret' : 'Enter Authenticator Code'}
          </Text>
          <Text style={styles.subtitle}>
            {useFullSecret 
              ? 'Enter your full TOTP secret from your backup notes'
              : 'Open Google Authenticator and enter the 6-digit code for PawPad'
            }
          </Text>

          {/* File/Wallet info */}
          <View style={styles.walletInfo}>
            <Text style={styles.walletInfoIcon}>📄</Text>
            <View>
              <Text style={styles.walletInfoLabel}>Backup:</Text>
              <Text style={styles.walletInfoName}>
                {backupFile?.walletName || backupFile?.wallet_name || backupFileName}
              </Text>
            </View>
          </View>

          {/* Toggle between 6-digit and full secret */}
          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={() => {
              setUseFullSecret(!useFullSecret);
              setTotpCode('');
              setError('');
            }}
          >
            <Text style={styles.toggleButtonText}>
              {useFullSecret 
                ? '← Use 6-digit code instead' 
                : 'Old wallet? Use full TOTP secret →'}
            </Text>
          </TouchableOpacity>

          {/* Code/Secret input */}
          {!useFullSecret ? (
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
          ) : (
            <TextInput
              style={styles.secretInput}
              value={totpCode}
              onChangeText={setTotpCode}
              placeholder="JBSWY3DPEHPK3PXP..."
              placeholderTextColor="#4B5563"
              autoCapitalize="characters"
              autoCorrect={false}
              autoFocus
            />
          )}

          {useFullSecret && (
            <Text style={styles.helpText}>
              This is the secret key shown during wallet creation.{'\n'}
              Check your backup file's note or saved screenshots.
            </Text>
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Recover button */}
          <TouchableOpacity
            style={[
              styles.primaryButton, 
              ((!useFullSecret && totpCode.length !== 6) || (useFullSecret && totpCode.length < 10)) && styles.buttonDisabled
            ]}
            onPress={recoverWallet}
            disabled={(!useFullSecret && totpCode.length !== 6) || (useFullSecret && totpCode.length < 10) || recovering}
          >
            {recovering ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.primaryButtonText}>🔓 Recover Wallet</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.backLink} onPress={() => setStep('select_method')}>
            <Text style={styles.backLinkText}>← Start Over</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: RECOVERING
  // ═══════════════════════════════════════════════════════════════
  if (step === 'recovering') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#4ECDC4" />
          <Text style={[styles.title, { marginTop: 24 }]}>Recovering Wallet...</Text>
          <Text style={styles.subtitle}>Please wait while we restore your wallet</Text>

          <View style={styles.progressCard}>
            <Text style={styles.progressItem}>✓ Backup file validated</Text>
            <Text style={styles.progressItem}>✓ TOTP verified</Text>
            <Text style={styles.progressItemActive}>⏳ Decrypting backup...</Text>
            <Text style={styles.progressItemPending}>○ Restoring to Oasis TEE</Text>
            <Text style={styles.progressItemPending}>○ Reconstructing wallet keys</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: SUCCESS
  // ═══════════════════════════════════════════════════════════════
  if (step === 'success') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.title}>Wallet Recovered!</Text>
          <Text style={styles.subtitle}>
            Your seedless wallet has been restored successfully
          </Text>
          <ActivityIndicator color="#4ECDC4" style={{ marginTop: 24 }} />
          <Text style={styles.redirectText}>Redirecting to wallet...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  centerScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: '#4ECDC4',
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 16,
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
  
  // Option cards
  optionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  optionCardDisabled: {
    opacity: 0.5,
  },
  optionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDesc: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  optionArrow: {
    color: '#4ECDC4',
    fontSize: 24,
  },
  
  // Requirements
  requirementsCard: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderWidth: 1,
    borderColor: '#4ECDC4',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  requirementsTitle: {
    color: '#4ECDC4',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  requirementsItem: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 4,
  },
  
  // Info card
  infoCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoItem: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 6,
  },
  
  // Paste
  pasteButton: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#4ECDC4',
    borderStyle: 'dashed',
  },
  pasteButtonText: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: '600',
  },
  backupInput: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    minHeight: 180,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  
  // Wallet info
  walletInfo: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  walletInfoIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  walletInfoLabel: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  walletInfoName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Toggle button
  toggleButton: {
    padding: 12,
    marginBottom: 16,
  },
  toggleButtonText: {
    color: '#4ECDC4',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  
  // Code input (6-digit)
  codeInput: {
    width: 220,
    height: 70,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    fontSize: 32,
    textAlign: 'center',
    color: '#FFFFFF',
    letterSpacing: 8,
    marginVertical: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    borderWidth: 2,
    borderColor: '#334155',
  },
  
  // Secret input (full TOTP secret)
  secretInput: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    textAlign: 'center',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginVertical: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    borderWidth: 2,
    borderColor: '#334155',
  },
  
  // Help text
  helpText: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  
  // Buttons
  primaryButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  backLink: {
    marginTop: 24,
    padding: 12,
  },
  backLinkText: {
    color: '#4ECDC4',
    fontSize: 14,
  },
  
  // Error
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  
  // Progress
  progressCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    width: '100%',
  },
  progressItem: {
    color: '#10B981',
    fontSize: 14,
    marginBottom: 8,
  },
  progressItemActive: {
    color: '#F59E0B',
    fontSize: 14,
    marginBottom: 8,
  },
  progressItemPending: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 8,
  },
  
  // Success
  successIcon: {
    fontSize: 72,
    marginBottom: 16,
  },
  redirectText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 12,
  },
});

export default RecoverSeedlessVaultScreen;