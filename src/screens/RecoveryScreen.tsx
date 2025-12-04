// // // import React, { useState } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   TextInput,
// // //   TouchableOpacity,
// // //   Alert,
// // //   StyleSheet,
// // //   SafeAreaView,
// // //   ActivityIndicator,
// // //   KeyboardAvoidingView,
// // //   Platform,
// // // } from 'react-native';
// // // import { useNavigation } from '@react-navigation/native';
// // // import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// // // import type { RootStackParamList } from '../types/navigation';
// // // import api from '../services/api';

// // // type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// // // const RecoveryScreen = () => {
// // //   const navigation = useNavigation<NavigationProp>();
// // //   const [step, setStep] = useState<'email' | 'code'>('email');
// // //   const [email, setEmail] = useState('');
// // //   const [code, setCode] = useState('');
// // //   const [loading, setLoading] = useState(false);

// // //   const requestCode = async () => {
// // //     if (!email) {
// // //       Alert.alert('Error', 'Enter your email');
// // //       return;
// // //     }

// // //     setLoading(true);
// // //     try {
// // //       await api.recoverRequest(email);
// // //       setStep('code');
// // //       Alert.alert('Code Sent', 'Check your email for the verification code');
// // //     } catch (error: any) {
// // //       const message = error?.response?.data?.error || 'Failed to send code';
// // //       Alert.alert('Error', message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const verifyCode = async () => {
// // //     if (!code) {
// // //       Alert.alert('Error', 'Enter the code');
// // //       return;
// // //     }

// // //     setLoading(true);
// // //     try {
// // //       const response = await api.recoverVerify(email, code);

// // //       // Navigate to home with first vault
// // //       if (response.vaults && response.vaults.length > 0) {
// // //         navigation.reset({
// // //           index: 0,
// // //           routes: [{ name: 'Home', params: { vault: response.vaults[0] } }],
// // //         });
// // //       } else {
// // //         navigation.reset({
// // //           index: 0,
// // //           routes: [{ name: 'Home' }],
// // //         });
// // //       }
// // //     } catch (error: any) {
// // //       Alert.alert('Error', 'Invalid or expired code');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const resendCode = async () => {
// // //     setLoading(true);
// // //     try {
// // //       await api.recoverRequest(email);
// // //       Alert.alert('Code Resent', 'Check your email for the new code');
// // //     } catch (error: any) {
// // //       Alert.alert('Error', 'Failed to resend code');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <SafeAreaView style={styles.container}>
// // //       <KeyboardAvoidingView
// // //         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// // //         style={styles.content}
// // //       >
// // //         <View style={styles.header}>
// // //           <Text style={styles.emoji}>🔐</Text>
// // //           <Text style={styles.title}>Recover Your Wallet</Text>
// // //         </View>

// // //         {step === 'email' ? (
// // //           <View style={styles.form}>
// // //             <Text style={styles.subtitle}>
// // //               Enter the email you used to create your wallet
// // //             </Text>

// // //             <TextInput
// // //               style={styles.input}
// // //               placeholder="Email address"
// // //               placeholderTextColor="#6B7280"
// // //               value={email}
// // //               onChangeText={setEmail}
// // //               keyboardType="email-address"
// // //               autoCapitalize="none"
// // //               autoCorrect={false}
// // //               editable={!loading}
// // //             />

// // //             <TouchableOpacity
// // //               style={[styles.button, loading && styles.buttonDisabled]}
// // //               onPress={requestCode}
// // //               disabled={loading}
// // //             >
// // //               {loading ? (
// // //                 <ActivityIndicator color="#FFFFFF" />
// // //               ) : (
// // //                 <Text style={styles.buttonText}>Send Recovery Code</Text>
// // //               )}
// // //             </TouchableOpacity>

// // //             <TouchableOpacity
// // //               style={styles.backButton}
// // //               onPress={() => navigation.goBack()}
// // //             >
// // //               <Text style={styles.backButtonText}>← Back</Text>
// // //             </TouchableOpacity>
// // //           </View>
// // //         ) : (
// // //           <View style={styles.form}>
// // //             <Text style={styles.subtitle}>Enter the 6-digit code sent to</Text>
// // //             <Text style={styles.emailHighlight}>{email}</Text>

// // //             <TextInput
// // //               style={styles.codeInput}
// // //               placeholder="000000"
// // //               placeholderTextColor="#6B7280"
// // //               value={code}
// // //               onChangeText={setCode}
// // //               keyboardType="number-pad"
// // //               maxLength={6}
// // //               editable={!loading}
// // //               textAlign="center"
// // //             />

// // //             <TouchableOpacity
// // //               style={[styles.button, loading && styles.buttonDisabled]}
// // //               onPress={verifyCode}
// // //               disabled={loading}
// // //             >
// // //               {loading ? (
// // //                 <ActivityIndicator color="#FFFFFF" />
// // //               ) : (
// // //                 <Text style={styles.buttonText}>Verify & Recover</Text>
// // //               )}
// // //             </TouchableOpacity>

// // //             <View style={styles.linkContainer}>
// // //               <TouchableOpacity onPress={resendCode} disabled={loading}>
// // //                 <Text style={styles.linkText}>Resend code</Text>
// // //               </TouchableOpacity>

// // //               <TouchableOpacity onPress={() => setStep('email')} disabled={loading}>
// // //                 <Text style={styles.linkText}>Use different email</Text>
// // //               </TouchableOpacity>
// // //             </View>
// // //           </View>
// // //         )}

// // //         <View style={styles.infoCard}>
// // //           <Text style={styles.infoTitle}>How recovery works:</Text>
// // //           <Text style={styles.infoText}>• Your keys are stored securely in Arcium's MPC network</Text>
// // //           <Text style={styles.infoText}>• Verifying your email reconnects you to your wallet</Text>
// // //           <Text style={styles.infoText}>• No seed phrase needed!</Text>
// // //         </View>
// // //       </KeyboardAvoidingView>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: '#0A1628',
// // //   },
// // //   content: {
// // //     flex: 1,
// // //     paddingHorizontal: 24,
// // //   },
// // //   header: {
// // //     alignItems: 'center',
// // //     paddingTop: 40,
// // //     paddingBottom: 32,
// // //   },
// // //   emoji: {
// // //     fontSize: 48,
// // //     marginBottom: 16,
// // //   },
// // //   title: {
// // //     fontSize: 28,
// // //     fontWeight: '600',
// // //     color: '#FFFFFF',
// // //   },
// // //   form: {
// // //     marginBottom: 24,
// // //   },
// // //   subtitle: {
// // //     fontSize: 16,
// // //     color: '#9CA3AF',
// // //     textAlign: 'center',
// // //     marginBottom: 8,
// // //   },
// // //   emailHighlight: {
// // //     fontSize: 16,
// // //     color: '#4ECDC4',
// // //     textAlign: 'center',
// // //     fontWeight: '600',
// // //     marginBottom: 24,
// // //   },
// // //   input: {
// // //     backgroundColor: '#1E293B',
// // //     borderRadius: 12,
// // //     padding: 16,
// // //     fontSize: 16,
// // //     color: '#FFFFFF',
// // //     marginBottom: 16,
// // //     borderWidth: 1,
// // //     borderColor: '#374151',
// // //   },
// // //   codeInput: {
// // //     backgroundColor: '#1E293B',
// // //     borderRadius: 12,
// // //     padding: 20,
// // //     fontSize: 32,
// // //     fontWeight: '600',
// // //     color: '#FFFFFF',
// // //     marginBottom: 16,
// // //     borderWidth: 1,
// // //     borderColor: '#374151',
// // //     letterSpacing: 8,
// // //   },
// // //   button: {
// // //     backgroundColor: '#4ECDC4',
// // //     borderRadius: 12,
// // //     padding: 16,
// // //     alignItems: 'center',
// // //     marginBottom: 16,
// // //   },
// // //   buttonDisabled: {
// // //     opacity: 0.6,
// // //   },
// // //   buttonText: {
// // //     color: '#FFFFFF',
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //   },
// // //   backButton: {
// // //     alignItems: 'center',
// // //     padding: 12,
// // //   },
// // //   backButtonText: {
// // //     color: '#9CA3AF',
// // //     fontSize: 14,
// // //   },
// // //   linkContainer: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     paddingHorizontal: 8,
// // //   },
// // //   linkText: {
// // //     color: '#4ECDC4',
// // //     fontSize: 14,
// // //   },
// // //   infoCard: {
// // //     backgroundColor: '#1E293B',
// // //     borderRadius: 12,
// // //     padding: 16,
// // //     marginTop: 'auto',
// // //     marginBottom: 24,
// // //   },
// // //   infoTitle: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     color: '#FFFFFF',
// // //     marginBottom: 8,
// // //   },
// // //   infoText: {
// // //     fontSize: 13,
// // //     color: '#9CA3AF',
// // //     marginBottom: 4,
// // //   },
// // // });

// // // export default RecoveryScreen;

// // import React, { useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TouchableOpacity,
// //   SafeAreaView,
// //   Alert,
// //   ActivityIndicator,
// //   ScrollView,
// //   Platform,
// //   TextInput,
// // } from 'react-native';
// // import { useNavigation } from '@react-navigation/native';
// // import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// // import { RootStackParamList, VaultData } from '../types/navigation';
// // import { useVaults } from '../context/VaultContext';
// // import Clipboard from '@react-native-clipboard/clipboard';

// // type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Recovery'>;

// // interface BackupData {
// //   version: string;
// //   wallet_type: string;
// //   vault: {
// //     vault_id: string;
// //     vault_name: string;
// //     chain: string;
// //     public_address: string;
// //     mpc_provider: string;
// //     created_at: string;
// //     email?: string;
// //   };
// // }

// // const RecoveryScreen = () => {
// //   const navigation = useNavigation<NavigationProp>();
// //   const { addVault, vaults } = useVaults();
  
// //   const [loading, setLoading] = useState(false);
// //   const [backupData, setBackupData] = useState<BackupData | null>(null);
// //   const [jsonInput, setJsonInput] = useState('');
// //   const [error, setError] = useState('');

// //   const pasteFromClipboard = async () => {
// //     try {
// //       const text = await Clipboard.getString();
// //       if (text) {
// //         setJsonInput(text);
// //         parseBackupJson(text);
// //       } else {
// //         setError('Clipboard is empty');
// //       }
// //     } catch (err) {
// //       setError('Failed to read clipboard');
// //     }
// //   };

// //   const parseBackupJson = (text: string) => {
// //     try {
// //       setError('');
      
// //       // Try to parse JSON
// //       const parsed = JSON.parse(text) as BackupData;

// //       // Validate backup structure
// //       if (!parsed.vault || !parsed.vault.vault_id || !parsed.vault.public_address) {
// //         throw new Error('Invalid backup file format. Missing vault data.');
// //       }

// //       if (parsed.wallet_type !== 'pawpad_mpc') {
// //         throw new Error('This is not a PawPad backup file');
// //       }

// //       setBackupData(parsed);
// //       console.log('✅ Parsed backup:', parsed.vault);

// //     } catch (err: any) {
// //       console.error('Parse error:', err);
// //       if (err.message.includes('JSON')) {
// //         setError('Invalid JSON format. Please paste the complete backup file content.');
// //       } else {
// //         setError(err.message || 'Failed to parse backup data');
// //       }
// //       setBackupData(null);
// //     }
// //   };

// //   const restoreWallet = async () => {
// //     if (!backupData) return;

// //     try {
// //       setLoading(true);
// //       setError('');

// //       // Check if vault already exists
// //       const existingVault = vaults.find(v => v.vault_id === backupData.vault.vault_id);
// //       if (existingVault) {
// //         Alert.alert(
// //           'Wallet Already Exists',
// //           'This wallet is already on your device.',
// //           [
// //             { text: 'OK', onPress: () => navigation.goBack() }
// //           ]
// //         );
// //         return;
// //       }

// //       // Create vault data for local storage
// //       const vaultData: VaultData = {
// //         vault_id: backupData.vault.vault_id,
// //         vault_name: backupData.vault.vault_name,
// //         chain: backupData.vault.chain,
// //         address: backupData.vault.public_address,
// //         mpc_provider: backupData.vault.mpc_provider,
// //         vault_type: 'personal',
// //         created_at: backupData.vault.created_at,
// //         email: backupData.vault.email,
// //       };

// //       // Save to local storage
// //       await addVault(vaultData);
// //       console.log('✅ Wallet restored:', vaultData.vault_id);

// //       // Success!
// //       Alert.alert(
// //         '✅ Wallet Restored!',
// //         `Your wallet "${vaultData.vault_name}" has been restored successfully.`,
// //         [
// //           {
// //             text: 'Go to Wallet',
// //             onPress: () => {
// //               navigation.reset({
// //                 index: 0,
// //                 routes: [{ name: 'Home', params: { vault: vaultData } }],
// //               });
// //             },
// //           },
// //         ]
// //       );

// //     } catch (err: any) {
// //       console.error('Restore error:', err);
// //       setError(err.message || 'Failed to restore wallet');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const clearInput = () => {
// //     setJsonInput('');
// //     setBackupData(null);
// //     setError('');
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
// //         {/* Header */}
// //         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
// //           <Text style={styles.backButtonText}>← Back</Text>
// //         </TouchableOpacity>

// //         <View style={styles.header}>
// //           <Text style={styles.headerEmoji}>🔐</Text>
// //           <Text style={styles.title}>Recover Wallet</Text>
// //           <Text style={styles.subtitle}>
// //             Restore your wallet using your backup data
// //           </Text>
// //         </View>

// //         {/* Instructions */}
// //         <View style={styles.instructionsCard}>
// //           <Text style={styles.instructionsTitle}>How to recover:</Text>
// //           <Text style={styles.instructionItem}>1. Open your backup JSON file</Text>
// //           <Text style={styles.instructionItem}>2. Copy the entire content</Text>
// //           <Text style={styles.instructionItem}>3. Tap "Paste from Clipboard" below</Text>
// //           <Text style={styles.instructionItem}>4. Verify details and tap "Restore"</Text>
// //         </View>

// //         {!backupData ? (
// //           <>
// //             {/* Paste Button */}
// //             <TouchableOpacity
// //               style={styles.pasteButton}
// //               onPress={pasteFromClipboard}
// //             >
// //               <Text style={styles.pasteButtonIcon}>📋</Text>
// //               <Text style={styles.pasteButtonText}>Paste from Clipboard</Text>
// //             </TouchableOpacity>

// //             {/* Or manual input */}
// //             <Text style={styles.orText}>— or paste manually —</Text>

// //             <TextInput
// //               style={styles.jsonInput}
// //               placeholder='Paste your backup JSON here...'
// //               placeholderTextColor="#6B7280"
// //               multiline
// //               numberOfLines={8}
// //               value={jsonInput}
// //               onChangeText={(text) => {
// //                 setJsonInput(text);
// //                 if (text.length > 50) {
// //                   parseBackupJson(text);
// //                 }
// //               }}
// //               textAlignVertical="top"
// //             />

// //             {jsonInput.length > 0 && (
// //               <TouchableOpacity style={styles.clearButton} onPress={clearInput}>
// //                 <Text style={styles.clearButtonText}>Clear</Text>
// //               </TouchableOpacity>
// //             )}
// //           </>
// //         ) : (
// //           /* Backup Preview */
// //           <View style={styles.previewCard}>
// //             <View style={styles.previewHeader}>
// //               <Text style={styles.previewTitle}>✅ Backup Valid</Text>
// //               <TouchableOpacity onPress={clearInput}>
// //                 <Text style={styles.changeFile}>Clear</Text>
// //               </TouchableOpacity>
// //             </View>

// //             <View style={styles.previewRow}>
// //               <Text style={styles.previewLabel}>Wallet Name</Text>
// //               <Text style={styles.previewValue}>{backupData.vault.vault_name}</Text>
// //             </View>

// //             <View style={styles.previewRow}>
// //               <Text style={styles.previewLabel}>Chain</Text>
// //               <View style={styles.chainBadge}>
// //                 <Text style={styles.chainBadgeText}>{backupData.vault.chain}</Text>
// //               </View>
// //             </View>

// //             <View style={styles.previewRow}>
// //               <Text style={styles.previewLabel}>Address</Text>
// //               <Text style={styles.previewAddress} numberOfLines={1}>
// //                 {backupData.vault.public_address}
// //               </Text>
// //             </View>

// //             <View style={styles.previewRow}>
// //               <Text style={styles.previewLabel}>MPC Provider</Text>
// //               <Text style={styles.previewValue}>{backupData.vault.mpc_provider}</Text>
// //             </View>

// //             {backupData.vault.email && (
// //               <View style={styles.previewRow}>
// //                 <Text style={styles.previewLabel}>Email</Text>
// //                 <Text style={styles.previewValue}>{backupData.vault.email}</Text>
// //               </View>
// //             )}

// //             <View style={styles.previewRow}>
// //               <Text style={styles.previewLabel}>Created</Text>
// //               <Text style={styles.previewValue}>
// //                 {new Date(backupData.vault.created_at).toLocaleDateString()}
// //               </Text>
// //             </View>

// //             {/* Restore Button */}
// //             <TouchableOpacity
// //               style={styles.restoreButton}
// //               onPress={restoreWallet}
// //               disabled={loading}
// //             >
// //               {loading ? (
// //                 <ActivityIndicator color="#000" />
// //               ) : (
// //                 <Text style={styles.restoreButtonText}>🔓 Restore Wallet</Text>
// //               )}
// //             </TouchableOpacity>
// //           </View>
// //         )}

// //         {/* Error */}
// //         {error ? (
// //           <View style={styles.errorCard}>
// //             <Text style={styles.errorText}>❌ {error}</Text>
// //           </View>
// //         ) : null}

// //         {/* Security Note */}
// //         <View style={styles.securityNote}>
// //           <Text style={styles.securityNoteText}>
// //             🔒 Your private keys remain secured by MPC. This backup only contains 
// //             wallet metadata needed to reconnect to your existing MPC vault.
// //           </Text>
// //         </View>
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#0A1628',
// //   },
// //   scrollView: {
// //     flex: 1,
// //   },
// //   scrollContent: {
// //     padding: 24,
// //     paddingBottom: 40,
// //   },
// //   backButton: {
// //     marginBottom: 20,
// //   },
// //   backButtonText: {
// //     color: '#4ECDC4',
// //     fontSize: 16,
// //   },
// //   header: {
// //     alignItems: 'center',
// //     marginBottom: 24,
// //   },
// //   headerEmoji: {
// //     fontSize: 48,
// //     marginBottom: 16,
// //   },
// //   title: {
// //     fontSize: 28,
// //     fontWeight: 'bold',
// //     color: '#FFFFFF',
// //     marginBottom: 8,
// //   },
// //   subtitle: {
// //     fontSize: 16,
// //     color: '#9CA3AF',
// //     textAlign: 'center',
// //   },
// //   instructionsCard: {
// //     backgroundColor: '#1E293B',
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 24,
// //   },
// //   instructionsTitle: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: '#FFFFFF',
// //     marginBottom: 12,
// //   },
// //   instructionItem: {
// //     fontSize: 13,
// //     color: '#9CA3AF',
// //     marginBottom: 6,
// //   },
// //   pasteButton: {
// //     backgroundColor: '#4ECDC4',
// //     borderRadius: 12,
// //     padding: 16,
// //     alignItems: 'center',
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //     marginBottom: 16,
// //   },
// //   pasteButtonIcon: {
// //     fontSize: 20,
// //     marginRight: 10,
// //   },
// //   pasteButtonText: {
// //     color: '#000000',
// //     fontSize: 16,
// //     fontWeight: '700',
// //   },
// //   orText: {
// //     color: '#6B7280',
// //     fontSize: 12,
// //     textAlign: 'center',
// //     marginBottom: 16,
// //   },
// //   jsonInput: {
// //     backgroundColor: '#1E293B',
// //     borderRadius: 12,
// //     padding: 16,
// //     color: '#FFFFFF',
// //     fontSize: 12,
// //     fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
// //     minHeight: 150,
// //     borderWidth: 1,
// //     borderColor: '#374151',
// //     marginBottom: 12,
// //   },
// //   clearButton: {
// //     alignSelf: 'flex-end',
// //     marginBottom: 16,
// //   },
// //   clearButtonText: {
// //     color: '#EF4444',
// //     fontSize: 14,
// //   },
// //   previewCard: {
// //     backgroundColor: '#1E293B',
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 24,
// //     borderWidth: 1,
// //     borderColor: '#10B981',
// //   },
// //   previewHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 16,
// //     paddingBottom: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#374151',
// //   },
// //   previewTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#10B981',
// //   },
// //   changeFile: {
// //     fontSize: 13,
// //     color: '#EF4444',
// //   },
// //   previewRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 12,
// //   },
// //   previewLabel: {
// //     fontSize: 13,
// //     color: '#9CA3AF',
// //   },
// //   previewValue: {
// //     fontSize: 13,
// //     color: '#FFFFFF',
// //     fontWeight: '500',
// //   },
// //   previewAddress: {
// //     fontSize: 11,
// //     color: '#4ECDC4',
// //     fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
// //     maxWidth: 180,
// //   },
// //   chainBadge: {
// //     backgroundColor: 'rgba(78, 205, 196, 0.15)',
// //     paddingHorizontal: 10,
// //     paddingVertical: 4,
// //     borderRadius: 6,
// //   },
// //   chainBadgeText: {
// //     color: '#4ECDC4',
// //     fontSize: 12,
// //     fontWeight: '600',
// //   },
// //   restoreButton: {
// //     backgroundColor: '#10B981',
// //     borderRadius: 12,
// //     padding: 16,
// //     alignItems: 'center',
// //     marginTop: 16,
// //   },
// //   restoreButtonText: {
// //     color: '#000000',
// //     fontSize: 16,
// //     fontWeight: '700',
// //   },
// //   errorCard: {
// //     backgroundColor: 'rgba(239, 68, 68, 0.1)',
// //     borderRadius: 8,
// //     padding: 12,
// //     marginBottom: 16,
// //   },
// //   errorText: {
// //     color: '#EF4444',
// //     fontSize: 14,
// //   },
// //   securityNote: {
// //     backgroundColor: 'rgba(78, 205, 196, 0.1)',
// //     borderRadius: 8,
// //     padding: 12,
// //   },
// //   securityNoteText: {
// //     color: '#9CA3AF',
// //     fontSize: 12,
// //     lineHeight: 18,
// //   },
// // });

// // export default RecoveryScreen;

// // import React, { useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TouchableOpacity,
// //   SafeAreaView,
// //   Alert,
// //   ActivityIndicator,
// //   ScrollView,
// //   Platform,
// //   TextInput,
// // } from 'react-native';
// // import { useNavigation } from '@react-navigation/native';
// // import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// // import { RootStackParamList, VaultData } from '../types/navigation';
// // import { useVaults } from '../context/VaultContext';
// // import Clipboard from '@react-native-clipboard/clipboard';
// // import api from '../services/api';

// // type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Recovery'>;

// // interface BackupData {
// //   version: string;
// //   wallet_type: string;
// //   vault: {
// //     vault_id: string;
// //     vault_name: string;
// //     chain: string;
// //     public_address: string;
// //     mpc_provider: string;
// //     created_at: string;
// //     email?: string;
// //   };
// // }

// // const RecoveryScreen = () => {
// //   const navigation = useNavigation<NavigationProp>();
// //   const { addVault, vaults } = useVaults();
  
// //   const [loading, setLoading] = useState(false);
// //   const [backupData, setBackupData] = useState<BackupData | null>(null);
// //   const [jsonInput, setJsonInput] = useState('');
// //   const [error, setError] = useState('');

// //   const pasteFromClipboard = async () => {
// //     try {
// //       const text = await Clipboard.getString();
// //       if (text) {
// //         setJsonInput(text);
// //         parseBackupJson(text);
// //       } else {
// //         setError('Clipboard is empty');
// //       }
// //     } catch (err) {
// //       setError('Failed to read clipboard');
// //     }
// //   };

// //   const parseBackupJson = (text: string) => {
// //     try {
// //       setError('');
      
// //       // Try to parse JSON
// //       const parsed = JSON.parse(text) as BackupData;

// //       // Validate backup structure
// //       if (!parsed.vault || !parsed.vault.vault_id || !parsed.vault.public_address) {
// //         throw new Error('Invalid backup file format. Missing vault data.');
// //       }

// //       if (parsed.wallet_type !== 'pawpad_mpc') {
// //         throw new Error('This is not a PawPad backup file');
// //       }

// //       setBackupData(parsed);
// //       console.log('✅ Parsed backup:', parsed.vault);

// //     } catch (err: any) {
// //       console.error('Parse error:', err);
// //       if (err.message.includes('JSON')) {
// //         setError('Invalid JSON format. Please paste the complete backup file content.');
// //       } else {
// //         setError(err.message || 'Failed to parse backup data');
// //       }
// //       setBackupData(null);
// //     }
// //   };

// //   const restoreWallet = async () => {
// //     if (!backupData) return;

// //     try {
// //       setLoading(true);
// //       setError('');

// //       try {
// //       await api.restoreBackup(backupData);
// //       console.log('✅ Keys restored on backend');
// //     } catch (apiErr) {
// //       console.log('⚠️ Backend restore skipped:', apiErr);
// //     }

// //       // Check if vault already exists
// //       const existingVault = vaults.find(v => v.vault_id === backupData.vault.vault_id);
// //       if (existingVault) {
// //         Alert.alert(
// //           'Wallet Already Exists',
// //           'This wallet is already on your device. Taking you to your wallet.',
// //           [
// //             { 
// //               text: 'Go to Wallet', 
// //               onPress: () => {
// //                 // Navigate to Home with the existing vault
// //                 navigation.reset({
// //                   index: 0,
// //                   routes: [{ name: 'Home', params: { vault: existingVault as VaultData } }],
// //                 });
// //               }
// //             }
// //           ]
// //         );
// //         setLoading(false);
// //         return;
// //       }

// //       // Create vault data for local storage
// //       const vaultData: VaultData = {
// //         vault_id: backupData.vault.vault_id,
// //         vault_name: backupData.vault.vault_name,
// //         chain: backupData.vault.chain,
// //         address: backupData.vault.public_address,
// //         mpc_provider: backupData.vault.mpc_provider,
// //         vault_type: 'personal',
// //         created_at: backupData.vault.created_at,
// //         email: backupData.vault.email,
// //       };

// //       // Save to local storage
// //       await addVault(vaultData);
// //       console.log('✅ Wallet restored:', vaultData.vault_id);

// //       // Success!
// //       Alert.alert(
// //         '✅ Wallet Restored!',
// //         `Your wallet "${vaultData.vault_name}" has been restored successfully.`,
// //         [
// //           {
// //             text: 'Go to Wallet',
// //             onPress: () => {
// //               navigation.reset({
// //                 index: 0,
// //                 routes: [{ name: 'Home', params: { vault: vaultData } }],
// //               });
// //             },
// //           },
// //         ]
// //       );

// //     } catch (err: any) {
// //       console.error('Restore error:', err);
// //       setError(err.message || 'Failed to restore wallet');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const clearInput = () => {
// //     setJsonInput('');
// //     setBackupData(null);
// //     setError('');
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
// //         {/* Header */}
// //         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
// //           <Text style={styles.backButtonText}>← Back</Text>
// //         </TouchableOpacity>

// //         <View style={styles.header}>
// //           <Text style={styles.headerEmoji}>🔐</Text>
// //           <Text style={styles.title}>Recover Wallet</Text>
// //           <Text style={styles.subtitle}>
// //             Restore your wallet using your backup data
// //           </Text>
// //         </View>

// //         {/* Instructions */}
// //         <View style={styles.instructionsCard}>
// //           <Text style={styles.instructionsTitle}>How to recover:</Text>
// //           <Text style={styles.instructionItem}>1. Open your backup JSON file</Text>
// //           <Text style={styles.instructionItem}>2. Copy the entire content</Text>
// //           <Text style={styles.instructionItem}>3. Tap "Paste from Clipboard" below</Text>
// //           <Text style={styles.instructionItem}>4. Verify details and tap "Restore"</Text>
// //         </View>

// //         {!backupData ? (
// //           <>
// //             {/* Paste Button */}
// //             <TouchableOpacity
// //               style={styles.pasteButton}
// //               onPress={pasteFromClipboard}
// //             >
// //               <Text style={styles.pasteButtonIcon}>📋</Text>
// //               <Text style={styles.pasteButtonText}>Paste from Clipboard</Text>
// //             </TouchableOpacity>

// //             {/* Or manual input */}
// //             <Text style={styles.orText}>— or paste manually —</Text>

// //             <TextInput
// //               style={styles.jsonInput}
// //               placeholder='Paste your backup JSON here...'
// //               placeholderTextColor="#6B7280"
// //               multiline
// //               numberOfLines={8}
// //               value={jsonInput}
// //               onChangeText={(text) => {
// //                 setJsonInput(text);
// //                 if (text.length > 50) {
// //                   parseBackupJson(text);
// //                 }
// //               }}
// //               textAlignVertical="top"
// //             />

// //             {jsonInput.length > 0 && (
// //               <TouchableOpacity style={styles.clearButton} onPress={clearInput}>
// //                 <Text style={styles.clearButtonText}>Clear</Text>
// //               </TouchableOpacity>
// //             )}
// //           </>
// //         ) : (
// //           /* Backup Preview */
// //           <View style={styles.previewCard}>
// //             <View style={styles.previewHeader}>
// //               <Text style={styles.previewTitle}>✅ Backup Valid</Text>
// //               <TouchableOpacity onPress={clearInput}>
// //                 <Text style={styles.changeFile}>Clear</Text>
// //               </TouchableOpacity>
// //             </View>

// //             <View style={styles.previewRow}>
// //               <Text style={styles.previewLabel}>Wallet Name</Text>
// //               <Text style={styles.previewValue}>{backupData.vault.vault_name}</Text>
// //             </View>

// //             <View style={styles.previewRow}>
// //               <Text style={styles.previewLabel}>Chain</Text>
// //               <View style={styles.chainBadge}>
// //                 <Text style={styles.chainBadgeText}>{backupData.vault.chain}</Text>
// //               </View>
// //             </View>

// //             <View style={styles.previewRow}>
// //               <Text style={styles.previewLabel}>Address</Text>
// //               <Text style={styles.previewAddress} numberOfLines={1}>
// //                 {backupData.vault.public_address}
// //               </Text>
// //             </View>

// //             <View style={styles.previewRow}>
// //               <Text style={styles.previewLabel}>MPC Provider</Text>
// //               <Text style={styles.previewValue}>{backupData.vault.mpc_provider}</Text>
// //             </View>

// //             {backupData.vault.email && (
// //               <View style={styles.previewRow}>
// //                 <Text style={styles.previewLabel}>Email</Text>
// //                 <Text style={styles.previewValue}>{backupData.vault.email}</Text>
// //               </View>
// //             )}

// //             <View style={styles.previewRow}>
// //               <Text style={styles.previewLabel}>Created</Text>
// //               <Text style={styles.previewValue}>
// //                 {new Date(backupData.vault.created_at).toLocaleDateString()}
// //               </Text>
// //             </View>

// //             {/* Restore Button */}
// //             <TouchableOpacity
// //               style={styles.restoreButton}
// //               onPress={restoreWallet}
// //               disabled={loading}
// //             >
// //               {loading ? (
// //                 <ActivityIndicator color="#000" />
// //               ) : (
// //                 <Text style={styles.restoreButtonText}>🔓 Restore Wallet</Text>
// //               )}
// //             </TouchableOpacity>
// //           </View>
// //         )}

// //         {/* Error */}
// //         {error ? (
// //           <View style={styles.errorCard}>
// //             <Text style={styles.errorText}>❌ {error}</Text>
// //           </View>
// //         ) : null}

// //         {/* Security Note */}
// //         <View style={styles.securityNote}>
// //           <Text style={styles.securityNoteText}>
// //             🔒 Your private keys remain secured by MPC. This backup only contains 
// //             wallet metadata needed to reconnect to your existing MPC vault.
// //           </Text>
// //         </View>
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#0A1628',
// //   },
// //   scrollView: {
// //     flex: 1,
// //   },
// //   scrollContent: {
// //     padding: 24,
// //     paddingBottom: 40,
// //   },
// //   backButton: {
// //     marginBottom: 20,
// //   },
// //   backButtonText: {
// //     color: '#4ECDC4',
// //     fontSize: 16,
// //   },
// //   header: {
// //     alignItems: 'center',
// //     marginBottom: 24,
// //   },
// //   headerEmoji: {
// //     fontSize: 48,
// //     marginBottom: 16,
// //   },
// //   title: {
// //     fontSize: 28,
// //     fontWeight: 'bold',
// //     color: '#FFFFFF',
// //     marginBottom: 8,
// //   },
// //   subtitle: {
// //     fontSize: 16,
// //     color: '#9CA3AF',
// //     textAlign: 'center',
// //   },
// //   instructionsCard: {
// //     backgroundColor: '#1E293B',
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 24,
// //   },
// //   instructionsTitle: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: '#FFFFFF',
// //     marginBottom: 12,
// //   },
// //   instructionItem: {
// //     fontSize: 13,
// //     color: '#9CA3AF',
// //     marginBottom: 6,
// //   },
// //   pasteButton: {
// //     backgroundColor: '#4ECDC4',
// //     borderRadius: 12,
// //     padding: 16,
// //     alignItems: 'center',
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //     marginBottom: 16,
// //   },
// //   pasteButtonIcon: {
// //     fontSize: 20,
// //     marginRight: 10,
// //   },
// //   pasteButtonText: {
// //     color: '#000000',
// //     fontSize: 16,
// //     fontWeight: '700',
// //   },
// //   orText: {
// //     color: '#6B7280',
// //     fontSize: 12,
// //     textAlign: 'center',
// //     marginBottom: 16,
// //   },
// //   jsonInput: {
// //     backgroundColor: '#1E293B',
// //     borderRadius: 12,
// //     padding: 16,
// //     color: '#FFFFFF',
// //     fontSize: 12,
// //     fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
// //     minHeight: 150,
// //     borderWidth: 1,
// //     borderColor: '#374151',
// //     marginBottom: 12,
// //   },
// //   clearButton: {
// //     alignSelf: 'flex-end',
// //     marginBottom: 16,
// //   },
// //   clearButtonText: {
// //     color: '#EF4444',
// //     fontSize: 14,
// //   },
// //   previewCard: {
// //     backgroundColor: '#1E293B',
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 24,
// //     borderWidth: 1,
// //     borderColor: '#10B981',
// //   },
// //   previewHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 16,
// //     paddingBottom: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#374151',
// //   },
// //   previewTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#10B981',
// //   },
// //   changeFile: {
// //     fontSize: 13,
// //     color: '#EF4444',
// //   },
// //   previewRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 12,
// //   },
// //   previewLabel: {
// //     fontSize: 13,
// //     color: '#9CA3AF',
// //   },
// //   previewValue: {
// //     fontSize: 13,
// //     color: '#FFFFFF',
// //     fontWeight: '500',
// //   },
// //   previewAddress: {
// //     fontSize: 11,
// //     color: '#4ECDC4',
// //     fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
// //     maxWidth: 180,
// //   },
// //   chainBadge: {
// //     backgroundColor: 'rgba(78, 205, 196, 0.15)',
// //     paddingHorizontal: 10,
// //     paddingVertical: 4,
// //     borderRadius: 6,
// //   },
// //   chainBadgeText: {
// //     color: '#4ECDC4',
// //     fontSize: 12,
// //     fontWeight: '600',
// //   },
// //   restoreButton: {
// //     backgroundColor: '#10B981',
// //     borderRadius: 12,
// //     padding: 16,
// //     alignItems: 'center',
// //     marginTop: 16,
// //   },
// //   restoreButtonText: {
// //     color: '#000000',
// //     fontSize: 16,
// //     fontWeight: '700',
// //   },
// //   errorCard: {
// //     backgroundColor: 'rgba(239, 68, 68, 0.1)',
// //     borderRadius: 8,
// //     padding: 12,
// //     marginBottom: 16,
// //   },
// //   errorText: {
// //     color: '#EF4444',
// //     fontSize: 14,
// //   },
// //   securityNote: {
// //     backgroundColor: 'rgba(78, 205, 196, 0.1)',
// //     borderRadius: 8,
// //     padding: 12,
// //   },
// //   securityNoteText: {
// //     color: '#9CA3AF',
// //     fontSize: 12,
// //     lineHeight: 18,
// //   },
// // });

// // export default RecoveryScreen;

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   Alert,
//   ActivityIndicator,
//   ScrollView,
//   Platform,
//   TextInput,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList, VaultData } from '../types/navigation';
// import { useVaults } from '../context/VaultContext';
// import Clipboard from '@react-native-clipboard/clipboard';
// import api from '../services/api';

// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Recovery'>;

// // ============================================
// // BACKUP DATA INTERFACE - Supports v1.0 and v2.0
// // ============================================

// interface BackupData {
//   version: string;
//   wallet_type: string;
//   vault: {
//     vault_id: string;
//     vault_name: string;
//     vault_type?: 'unified' | 'personal' | 'shared';
//     email?: string;
//     created_at?: string;
    
//     // v1.0 format (legacy single-chain)
//     chain?: string;
//     public_address?: string;
//     mpc_provider?: string;
    
//     // v2.0 format (unified SOL + ZEC)
//     sol?: {
//       address: string;
//       mpc_provider?: string;
//     };
//     zec?: {
//       address: string;
//       viewing_key?: string | null;
//     };
//   };
// }

// // ============================================
// // MAIN COMPONENT
// // ============================================

// const RecoveryScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const { addVault, vaults } = useVaults();
  
//   const [loading, setLoading] = useState(false);
//   const [backupData, setBackupData] = useState<BackupData | null>(null);
//   const [jsonInput, setJsonInput] = useState('');
//   const [error, setError] = useState('');

//   // ============================================
//   // HELPERS
//   // ============================================

//   const isUnifiedBackup = (data: BackupData): boolean => {
//     return data.wallet_type === 'pawpad_unified_mpc' || 
//            data.vault.vault_type === 'unified' ||
//            !!(data.vault.sol?.address && data.vault.zec?.address);
//   };

//   const pasteFromClipboard = async () => {
//     try {
//       const text = await Clipboard.getString();
//       if (text) {
//         setJsonInput(text);
//         parseBackupJson(text);
//       } else {
//         setError('Clipboard is empty');
//       }
//     } catch (err) {
//       setError('Failed to read clipboard');
//     }
//   };

//   // ============================================
//   // PARSE BACKUP JSON - Supports both formats
//   // ============================================

//   const parseBackupJson = (text: string) => {
//     try {
//       setError('');
      
//       const parsed = JSON.parse(text) as BackupData;

//       // Check wallet_type - support both old and new formats
//       const validTypes = ['pawpad_mpc', 'pawpad_unified_mpc'];
//       if (!validTypes.includes(parsed.wallet_type)) {
//         throw new Error('This is not a PawPad backup file');
//       }

//       // Validate based on version/format
//       const isUnified = isUnifiedBackup(parsed);
      
//       if (isUnified) {
//         // v2.0 unified format validation
//         if (!parsed.vault?.vault_id) {
//           throw new Error('Invalid unified backup format. Missing vault ID.');
//         }
//         if (!parsed.vault?.sol?.address) {
//           throw new Error('Invalid unified backup format. Missing SOL address.');
//         }
//         // ZEC address is optional but should exist for unified
//         if (!parsed.vault?.zec?.address) {
//           console.warn('⚠️ Unified backup missing ZEC address');
//         }
//       } else {
//         // v1.0 legacy format validation
//         if (!parsed.vault?.vault_id || !parsed.vault?.public_address) {
//           throw new Error('Invalid backup file format. Missing vault data.');
//         }
//       }

//       setBackupData(parsed);
//       console.log('✅ Parsed backup:', {
//         version: parsed.version,
//         type: parsed.wallet_type,
//         isUnified,
//         vaultId: parsed.vault.vault_id,
//       });

//     } catch (err: any) {
//       console.error('Parse error:', err);
//       if (err.message.includes('JSON')) {
//         setError('Invalid JSON format. Please paste the complete backup file content.');
//       } else {
//         setError(err.message || 'Failed to parse backup data');
//       }
//       setBackupData(null);
//     }
//   };

//   // ============================================
//   // RESTORE WALLET - Handles both formats
//   // ============================================

//   const restoreWallet = async () => {
//     if (!backupData) return;

//     try {
//       setLoading(true);
//       setError('');

//       // Try to restore keys on backend first
//       try {
//         await api.restoreBackup(backupData);
//         console.log('✅ Keys restored on backend');
//       } catch (apiErr) {
//         console.log('⚠️ Backend restore skipped:', apiErr);
//         // Continue anyway - we can still restore the vault metadata
//       }

//       // Check if vault already exists
//       const existingVault = vaults.find(v => v.vault_id === backupData.vault.vault_id);
//       if (existingVault) {
//         Alert.alert(
//           'Wallet Already Exists',
//           'This wallet is already on your device. Taking you to your wallet.',
//           [
//             { 
//               text: 'Go to Wallet', 
//               onPress: () => {
//                 navigation.reset({
//                   index: 0,
//                   routes: [{ name: 'Home', params: { vault: existingVault as VaultData } }],
//                 });
//               }
//             }
//           ]
//         );
//         setLoading(false);
//         return;
//       }

//       // Determine if unified or legacy format
//       const isUnified = isUnifiedBackup(backupData);
//       let vaultData: VaultData;

//       if (isUnified) {
//         // ═══════════════════════════════════════
//         // v2.0 UNIFIED FORMAT
//         // ═══════════════════════════════════════
//         vaultData = {
//           vault_id: backupData.vault.vault_id,
//           vault_name: backupData.vault.vault_name,
//           vault_type: 'unified',
//           email: backupData.vault.email,
//           created_at: backupData.vault.created_at,
//           sol: {
//             address: backupData.vault.sol!.address,
//             mpc_provider: backupData.vault.sol!.mpc_provider,
//           },
//           zec: {
//             address: backupData.vault.zec?.address || '',
//             viewing_key: backupData.vault.zec?.viewing_key || undefined,
//           },
//         };
//         console.log('📦 Restoring UNIFIED vault:', vaultData.vault_name);
//       } else {
//         // ═══════════════════════════════════════
//         // v1.0 LEGACY FORMAT
//         // ═══════════════════════════════════════
//         vaultData = {
//           vault_id: backupData.vault.vault_id,
//           vault_name: backupData.vault.vault_name,
//           chain: backupData.vault.chain,
//           address: backupData.vault.public_address,
//           mpc_provider: backupData.vault.mpc_provider,
//           vault_type: 'personal',
//           created_at: backupData.vault.created_at,
//           email: backupData.vault.email,
//         };
//         console.log('📦 Restoring LEGACY vault:', vaultData.vault_name);
//       }

//       // Save to local storage
//       await addVault(vaultData);
//       console.log('✅ Wallet restored:', vaultData.vault_id);

//       // Success message
//       const successMsg = isUnified 
//         ? `Your unified wallet "${vaultData.vault_name}" with SOL + ZEC has been restored!`
//         : `Your wallet "${vaultData.vault_name}" has been restored successfully.`;

//       Alert.alert(
//         '✅ Wallet Restored!',
//         successMsg,
//         [
//           {
//             text: 'Go to Wallet',
//             onPress: () => {
//               navigation.reset({
//                 index: 0,
//                 routes: [{ name: 'Home', params: { vault: vaultData } }],
//               });
//             },
//           },
//         ]
//       );

//     } catch (err: any) {
//       console.error('Restore error:', err);
//       setError(err.message || 'Failed to restore wallet');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearInput = () => {
//     setJsonInput('');
//     setBackupData(null);
//     setError('');
//   };

//   // ============================================
//   // RENDER: PREVIEW CARD CONTENT
//   // ============================================

//   const renderPreviewContent = () => {
//     if (!backupData) return null;

//     const isUnified = isUnifiedBackup(backupData);

//     return (
//       <View style={styles.previewCard}>
//         <View style={styles.previewHeader}>
//           <Text style={styles.previewTitle}>✅ Backup Valid</Text>
//           <TouchableOpacity onPress={clearInput}>
//             <Text style={styles.changeFile}>Clear</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Wallet Name */}
//         <View style={styles.previewRow}>
//           <Text style={styles.previewLabel}>Wallet Name</Text>
//           <Text style={styles.previewValue}>{backupData.vault.vault_name}</Text>
//         </View>

//         {/* Version Badge */}
//         <View style={styles.previewRow}>
//           <Text style={styles.previewLabel}>Backup Version</Text>
//           <View style={[styles.chainBadge, isUnified && styles.unifiedBadge]}>
//             <Text style={styles.chainBadgeText}>
//               {isUnified ? 'v2.0 Unified' : 'v1.0 Legacy'}
//             </Text>
//           </View>
//         </View>

//         {isUnified ? (
//           // ═══════════════════════════════════════
//           // UNIFIED WALLET PREVIEW
//           // ═══════════════════════════════════════
//           <>
//             <View style={styles.previewRow}>
//               <Text style={styles.previewLabel}>Type</Text>
//               <View style={styles.unifiedBadge}>
//                 <Text style={styles.chainBadgeText}>◎ SOL + 🛡️ ZEC</Text>
//               </View>
//             </View>

//             <View style={styles.addressSection}>
//               <Text style={styles.addressLabel}>◎ SOL Address</Text>
//               <Text style={styles.previewAddressFull} numberOfLines={1}>
//                 {backupData.vault.sol?.address}
//               </Text>
//             </View>

//             <View style={styles.addressSection}>
//               <Text style={styles.addressLabel}>🛡️ ZEC Address</Text>
//               <Text style={styles.previewAddressFull} numberOfLines={2}>
//                 {backupData.vault.zec?.address 
//                   ? `${backupData.vault.zec.address.substring(0, 50)}...`
//                   : 'Not available'}
//               </Text>
//             </View>

//             {backupData.vault.sol?.mpc_provider && (
//               <View style={styles.previewRow}>
//                 <Text style={styles.previewLabel}>SOL Provider</Text>
//                 <Text style={styles.previewValue}>{backupData.vault.sol.mpc_provider}</Text>
//               </View>
//             )}
//           </>
//         ) : (
//           // ═══════════════════════════════════════
//           // LEGACY WALLET PREVIEW
//           // ═══════════════════════════════════════
//           <>
//             <View style={styles.previewRow}>
//               <Text style={styles.previewLabel}>Chain</Text>
//               <View style={styles.chainBadge}>
//                 <Text style={styles.chainBadgeText}>{backupData.vault.chain}</Text>
//               </View>
//             </View>

//             <View style={styles.previewRow}>
//               <Text style={styles.previewLabel}>Address</Text>
//               <Text style={styles.previewAddress} numberOfLines={1}>
//                 {backupData.vault.public_address}
//               </Text>
//             </View>

//             <View style={styles.previewRow}>
//               <Text style={styles.previewLabel}>MPC Provider</Text>
//               <Text style={styles.previewValue}>{backupData.vault.mpc_provider}</Text>
//             </View>
//           </>
//         )}

//         {/* Email (if present) */}
//         {backupData.vault.email && (
//           <View style={styles.previewRow}>
//             <Text style={styles.previewLabel}>Email</Text>
//             <Text style={styles.previewValue}>{backupData.vault.email}</Text>
//           </View>
//         )}

//         {/* Created Date (if present) */}
//         {backupData.vault.created_at && (
//           <View style={styles.previewRow}>
//             <Text style={styles.previewLabel}>Created</Text>
//             <Text style={styles.previewValue}>
//               {new Date(backupData.vault.created_at).toLocaleDateString()}
//             </Text>
//           </View>
//         )}

//         {/* Restore Button */}
//         <TouchableOpacity
//           style={styles.restoreButton}
//           onPress={restoreWallet}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color="#000" />
//           ) : (
//             <Text style={styles.restoreButtonText}>
//               🔓 Restore {isUnified ? 'Unified ' : ''}Wallet
//             </Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   // ============================================
//   // MAIN RENDER
//   // ============================================

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
//         {/* Header */}
//         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//           <Text style={styles.backButtonText}>← Back</Text>
//         </TouchableOpacity>

//         <View style={styles.header}>
//           <Text style={styles.headerEmoji}>🔐</Text>
//           <Text style={styles.title}>Recover Wallet</Text>
//           <Text style={styles.subtitle}>
//             Restore your wallet using your backup data
//           </Text>
//         </View>

//         {/* Instructions */}
//         <View style={styles.instructionsCard}>
//           <Text style={styles.instructionsTitle}>How to recover:</Text>
//           <Text style={styles.instructionItem}>1. Open your backup JSON file</Text>
//           <Text style={styles.instructionItem}>2. Copy the entire content</Text>
//           <Text style={styles.instructionItem}>3. Tap "Paste from Clipboard" below</Text>
//           <Text style={styles.instructionItem}>4. Verify details and tap "Restore"</Text>
//         </View>

//         {/* Supported Formats Info */}
//         <View style={styles.formatInfo}>
//           <Text style={styles.formatInfoText}>
//             ✓ Supports v1.0 (single-chain) and v2.0 (unified SOL+ZEC) backups
//           </Text>
//         </View>

//         {!backupData ? (
//           <>
//             {/* Paste Button */}
//             <TouchableOpacity
//               style={styles.pasteButton}
//               onPress={pasteFromClipboard}
//             >
//               <Text style={styles.pasteButtonIcon}>📋</Text>
//               <Text style={styles.pasteButtonText}>Paste from Clipboard</Text>
//             </TouchableOpacity>

//             {/* Or manual input */}
//             <Text style={styles.orText}>— or paste manually —</Text>

//             <TextInput
//               style={styles.jsonInput}
//               placeholder='Paste your backup JSON here...'
//               placeholderTextColor="#6B7280"
//               multiline
//               numberOfLines={8}
//               value={jsonInput}
//               onChangeText={(text) => {
//                 setJsonInput(text);
//                 if (text.length > 50) {
//                   parseBackupJson(text);
//                 }
//               }}
//               textAlignVertical="top"
//             />

//             {jsonInput.length > 0 && (
//               <TouchableOpacity style={styles.clearButton} onPress={clearInput}>
//                 <Text style={styles.clearButtonText}>Clear</Text>
//               </TouchableOpacity>
//             )}
//           </>
//         ) : (
//           renderPreviewContent()
//         )}

//         {/* Error */}
//         {error ? (
//           <View style={styles.errorCard}>
//             <Text style={styles.errorText}>❌ {error}</Text>
//           </View>
//         ) : null}

//         {/* Security Note */}
//         <View style={styles.securityNote}>
//           <Text style={styles.securityNoteText}>
//             🔒 Your private keys remain secured by MPC. This backup contains 
//             wallet metadata needed to reconnect to your existing MPC vault.
//           </Text>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// // ============================================
// // STYLES
// // ============================================

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0A1628',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 24,
//     paddingBottom: 40,
//   },
//   backButton: {
//     marginBottom: 20,
//   },
//   backButtonText: {
//     color: '#4ECDC4',
//     fontSize: 16,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   headerEmoji: {
//     fontSize: 48,
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#9CA3AF',
//     textAlign: 'center',
//   },
//   instructionsCard: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//   },
//   instructionsTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#FFFFFF',
//     marginBottom: 12,
//   },
//   instructionItem: {
//     fontSize: 13,
//     color: '#9CA3AF',
//     marginBottom: 6,
//   },
//   formatInfo: {
//     backgroundColor: 'rgba(78, 205, 196, 0.1)',
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 16,
//   },
//   formatInfoText: {
//     color: '#4ECDC4',
//     fontSize: 12,
//     textAlign: 'center',
//   },
//   pasteButton: {
//     backgroundColor: '#4ECDC4',
//     borderRadius: 12,
//     padding: 16,
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 16,
//   },
//   pasteButtonIcon: {
//     fontSize: 20,
//     marginRight: 10,
//   },
//   pasteButtonText: {
//     color: '#000000',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   orText: {
//     color: '#6B7280',
//     fontSize: 12,
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   jsonInput: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 16,
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
//     minHeight: 150,
//     borderWidth: 1,
//     borderColor: '#374151',
//     marginBottom: 12,
//   },
//   clearButton: {
//     alignSelf: 'flex-end',
//     marginBottom: 16,
//   },
//   clearButtonText: {
//     color: '#EF4444',
//     fontSize: 14,
//   },
//   previewCard: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 24,
//     borderWidth: 1,
//     borderColor: '#10B981',
//   },
//   previewHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#374151',
//   },
//   previewTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#10B981',
//   },
//   changeFile: {
//     fontSize: 13,
//     color: '#EF4444',
//   },
//   previewRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   previewLabel: {
//     fontSize: 13,
//     color: '#9CA3AF',
//   },
//   previewValue: {
//     fontSize: 13,
//     color: '#FFFFFF',
//     fontWeight: '500',
//   },
//   previewAddress: {
//     fontSize: 11,
//     color: '#4ECDC4',
//     fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
//     maxWidth: 180,
//   },
//   previewAddressFull: {
//     fontSize: 11,
//     color: '#4ECDC4',
//     fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
//     marginTop: 4,
//   },
//   addressSection: {
//     marginBottom: 12,
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#374151',
//   },
//   addressLabel: {
//     fontSize: 12,
//     color: '#9CA3AF',
//     marginBottom: 4,
//   },
//   chainBadge: {
//     backgroundColor: 'rgba(78, 205, 196, 0.15)',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   unifiedBadge: {
//     backgroundColor: 'rgba(139, 92, 246, 0.15)',
//   },
//   chainBadgeText: {
//     color: '#4ECDC4',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   restoreButton: {
//     backgroundColor: '#10B981',
//     borderRadius: 12,
//     padding: 16,
//     alignItems: 'center',
//     marginTop: 16,
//   },
//   restoreButtonText: {
//     color: '#000000',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   errorCard: {
//     backgroundColor: 'rgba(239, 68, 68, 0.1)',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//   },
//   errorText: {
//     color: '#EF4444',
//     fontSize: 14,
//   },
//   securityNote: {
//     backgroundColor: 'rgba(78, 205, 196, 0.1)',
//     borderRadius: 8,
//     padding: 12,
//   },
//   securityNoteText: {
//     color: '#9CA3AF',
//     fontSize: 12,
//     lineHeight: 18,
//   },
// });

// export default RecoveryScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, VaultData } from '../types/navigation';
import { useVaults } from '../context/VaultContext';
import Clipboard from '@react-native-clipboard/clipboard';
import api from '../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Recovery'>;

// ============================================
// BACKUP DATA INTERFACE
// ============================================

interface BackupData {
  version: string;
  wallet_type: string;
  vault: {
    vault_id: string;
    vault_name: string;
    vault_type?: 'unified' | 'personal' | 'shared';
    email?: string;
    created_at?: string;
    chain?: string;
    public_address?: string;
    mpc_provider?: string;
    sol?: {
      address: string;
      mpc_provider?: string;
    };
    zec?: {
      address: string;
      viewing_key?: string | null;
    };
  };
}

// ============================================
// MAIN COMPONENT
// ============================================

const RecoveryScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { addVault, vaults } = useVaults();
  
  // ═══════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════
  const [recoveryMethod, setRecoveryMethod] = useState<'select' | 'seed' | 'json'>('select');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Seed phrase state
  const [seedPhrase, setSeedPhrase] = useState('');
  const [walletName, setWalletName] = useState('Restored Wallet');
  const [email, setEmail] = useState('');
  
  // JSON backup state
  const [backupData, setBackupData] = useState<BackupData | null>(null);
  const [jsonInput, setJsonInput] = useState('');

  // ═══════════════════════════════════════
  // SEED PHRASE RECOVERY - NEW!
  // ═══════════════════════════════════════

  const restoreFromSeed = async () => {
    const words = seedPhrase.trim().split(/\s+/);
    
    if (words.length !== 12) {
      setError('Please enter all 12 words of your seed phrase');
      return;
    }

    try {
      setLoading(true);
      setError('');

      console.log('[Recovery] Restoring from seed phrase...');
      
      // Call backend to restore
      const response = await api.restoreFromSeedPhrase(seedPhrase, walletName, email);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to restore wallet');
      }

      console.log('[Recovery] Backend restored:', response);

      // Check if already exists locally
      const existingVault = vaults.find(v => 
        v.sol?.address === response.sol_address || 
        v.address === response.sol_address
      );

      if (existingVault) {
        Alert.alert(
          'Wallet Already Exists',
          'This wallet is already on your device.',
          [{ 
            text: 'Go to Wallet', 
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home', params: { vault: existingVault as VaultData } }],
              });
            }
          }]
        );
        return;
      }

      // Create local vault data
      const vaultData: VaultData = {
        vault_id: response.vault_id,
        vault_name: walletName,
        vault_type: 'unified',
        email: email || undefined,
        sol: {
          address: response.sol_address,
        },
        created_at: new Date().toISOString(),
      };

      // Save locally
      await addVault(vaultData);

      // Success!
      Alert.alert(
        '✅ Wallet Restored!',
        `Your wallet has been restored successfully!\n\nBalance: ${response.balance_sol?.toFixed(4) || '0'} SOL`,
        [{
          text: 'Go to Wallet',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home', params: { vault: vaultData } }],
            });
          },
        }]
      );

    } catch (err: any) {
      console.error('[Recovery] Seed restore error:', err);
      setError(err.message || 'Failed to restore wallet');
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════
  // JSON BACKUP RECOVERY (Existing)
  // ═══════════════════════════════════════

  const isUnifiedBackup = (data: BackupData): boolean => {
    return data.wallet_type === 'pawpad_unified_mpc' || 
           data.vault.vault_type === 'unified' ||
           !!(data.vault.sol?.address && data.vault.zec?.address);
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await Clipboard.getString();
      if (text) {
        setJsonInput(text);
        parseBackupJson(text);
      } else {
        setError('Clipboard is empty');
      }
    } catch (err) {
      setError('Failed to read clipboard');
    }
  };

  const parseBackupJson = (text: string) => {
    try {
      setError('');
      const parsed = JSON.parse(text) as BackupData;

      const validTypes = ['pawpad_mpc', 'pawpad_unified_mpc'];
      if (!validTypes.includes(parsed.wallet_type)) {
        throw new Error('This is not a PawPad backup file');
      }

      const isUnified = isUnifiedBackup(parsed);
      
      if (isUnified) {
        if (!parsed.vault?.vault_id || !parsed.vault?.sol?.address) {
          throw new Error('Invalid unified backup format');
        }
      } else {
        if (!parsed.vault?.vault_id || !parsed.vault?.public_address) {
          throw new Error('Invalid backup format');
        }
      }

      setBackupData(parsed);
    } catch (err: any) {
      if (err.message.includes('JSON')) {
        setError('Invalid JSON format');
      } else {
        setError(err.message || 'Failed to parse backup');
      }
      setBackupData(null);
    }
  };

  const restoreFromJson = async () => {
    if (!backupData) return;

    try {
      setLoading(true);
      setError('');

      // Try backend restore
      try {
        await api.restoreBackup(backupData);
      } catch (apiErr) {
        console.log('Backend restore skipped:', apiErr);
      }

      // Check if exists
      const existingVault = vaults.find(v => v.vault_id === backupData.vault.vault_id);
      if (existingVault) {
        Alert.alert(
          'Wallet Already Exists',
          'This wallet is already on your device.',
          [{ 
            text: 'Go to Wallet', 
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home', params: { vault: existingVault as VaultData } }],
              });
            }
          }]
        );
        return;
      }

      const isUnified = isUnifiedBackup(backupData);
      let vaultData: VaultData;

      if (isUnified) {
        vaultData = {
          vault_id: backupData.vault.vault_id,
          vault_name: backupData.vault.vault_name,
          vault_type: 'unified',
          email: backupData.vault.email,
          created_at: backupData.vault.created_at,
          sol: {
            address: backupData.vault.sol!.address,
            mpc_provider: backupData.vault.sol!.mpc_provider,
          },
          zec: {
            address: backupData.vault.zec?.address || '',
            viewing_key: backupData.vault.zec?.viewing_key || undefined,
          },
        };
      } else {
        vaultData = {
          vault_id: backupData.vault.vault_id,
          vault_name: backupData.vault.vault_name,
          chain: backupData.vault.chain,
          address: backupData.vault.public_address,
          mpc_provider: backupData.vault.mpc_provider,
          vault_type: 'personal',
          created_at: backupData.vault.created_at,
          email: backupData.vault.email,
        };
      }

      await addVault(vaultData);

      Alert.alert(
        '✅ Wallet Restored!',
        `Your wallet "${vaultData.vault_name}" has been restored!`,
        [{
          text: 'Go to Wallet',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home', params: { vault: vaultData } }],
            });
          },
        }]
      );

    } catch (err: any) {
      setError(err.message || 'Failed to restore wallet');
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setJsonInput('');
    setBackupData(null);
    setSeedPhrase('');
    setError('');
  };

  // ═══════════════════════════════════════
  // RENDER: METHOD SELECTION
  // ═══════════════════════════════════════

  if (recoveryMethod === 'select') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.headerEmoji}>🔐</Text>
            <Text style={styles.title}>Recover Wallet</Text>
            <Text style={styles.subtitle}>Choose your recovery method</Text>
          </View>

          {/* Option 1: Seed Phrase */}
          <TouchableOpacity
            style={styles.methodCard}
            onPress={() => setRecoveryMethod('seed')}
          >
            <View style={styles.methodIcon}>
              <Text style={styles.methodEmoji}>🌱</Text>
            </View>
            <View style={styles.methodContent}>
              <Text style={styles.methodTitle}>Seed Phrase</Text>
              <Text style={styles.methodDescription}>
                Enter your 12-word recovery phrase
              </Text>
            </View>
            <Text style={styles.methodArrow}>→</Text>
          </TouchableOpacity>

          {/* Option 2: JSON Backup */}
          <TouchableOpacity
            style={styles.methodCard}
            onPress={() => setRecoveryMethod('json')}
          >
            <View style={styles.methodIcon}>
              <Text style={styles.methodEmoji}>📄</Text>
            </View>
            <View style={styles.methodContent}>
              <Text style={styles.methodTitle}>JSON Backup</Text>
              <Text style={styles.methodDescription}>
                Paste your backup file content
              </Text>
            </View>
            <Text style={styles.methodArrow}>→</Text>
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              💡 New wallets created after the update use seed phrases.
              Older wallets use JSON backup files.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ═══════════════════════════════════════
  // RENDER: SEED PHRASE RECOVERY
  // ═══════════════════════════════════════

  if (recoveryMethod === 'seed') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => setRecoveryMethod('select')}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.headerEmoji}>🌱</Text>
            <Text style={styles.title}>Seed Phrase Recovery</Text>
            <Text style={styles.subtitle}>Enter your 12-word recovery phrase</Text>
          </View>

          {/* Seed Phrase Input */}
          <Text style={styles.inputLabel}>Recovery Phrase</Text>
          <TextInput
            style={styles.seedInput}
            placeholder="word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12"
            placeholderTextColor="#6B7280"
            multiline
            numberOfLines={4}
            value={seedPhrase}
            onChangeText={setSeedPhrase}
            autoCapitalize="none"
            autoCorrect={false}
            textAlignVertical="top"
          />
          <Text style={styles.wordCount}>
            {seedPhrase.trim().split(/\s+/).filter(w => w).length} / 12 words
          </Text>

          {/* Wallet Name */}
          <Text style={styles.inputLabel}>Wallet Name (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Restored Wallet"
            placeholderTextColor="#6B7280"
            value={walletName}
            onChangeText={setWalletName}
          />

          {/* Email */}
          <Text style={styles.inputLabel}>Email (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="your@email.com"
            placeholderTextColor="#6B7280"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Error */}
          {error ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>❌ {error}</Text>
            </View>
          ) : null}

          {/* Restore Button */}
          <TouchableOpacity
            style={[styles.restoreButton, loading && styles.buttonDisabled]}
            onPress={restoreFromSeed}
            disabled={loading || seedPhrase.trim().split(/\s+/).length !== 12}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.restoreButtonText}>🔓 Restore Wallet</Text>
            )}
          </TouchableOpacity>

          <View style={styles.securityNote}>
            <Text style={styles.securityNoteText}>
              🔒 Your seed phrase is sent securely to our server to restore your wallet.
              It is re-encrypted and never stored in plain text.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ═══════════════════════════════════════
  // RENDER: JSON BACKUP RECOVERY
  // ═══════════════════════════════════════

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => setRecoveryMethod('select')}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.headerEmoji}>📄</Text>
          <Text style={styles.title}>JSON Backup Recovery</Text>
          <Text style={styles.subtitle}>Paste your backup file content</Text>
        </View>

        {!backupData ? (
          <>
            <TouchableOpacity style={styles.pasteButton} onPress={pasteFromClipboard}>
              <Text style={styles.pasteButtonIcon}>📋</Text>
              <Text style={styles.pasteButtonText}>Paste from Clipboard</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>— or paste manually —</Text>

            <TextInput
              style={styles.jsonInput}
              placeholder='Paste your backup JSON here...'
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={8}
              value={jsonInput}
              onChangeText={(text) => {
                setJsonInput(text);
                if (text.length > 50) parseBackupJson(text);
              }}
              textAlignVertical="top"
            />

            {jsonInput.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>✅ Backup Valid</Text>
              <TouchableOpacity onPress={clearAll}>
                <Text style={styles.changeFile}>Clear</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Wallet Name</Text>
              <Text style={styles.previewValue}>{backupData.vault.vault_name}</Text>
            </View>

            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Address</Text>
              <Text style={styles.previewAddress} numberOfLines={1}>
                {backupData.vault.sol?.address || backupData.vault.public_address}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.restoreButton, loading && styles.buttonDisabled]}
              onPress={restoreFromJson}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.restoreButtonText}>🔓 Restore Wallet</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>❌ {error}</Text>
          </View>
        ) : null}

        <View style={styles.securityNote}>
          <Text style={styles.securityNoteText}>
            🔒 This backup contains wallet metadata to reconnect to your vault.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: '#4ECDC4',
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  methodCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodEmoji: {
    fontSize: 24,
  },
  methodContent: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  methodArrow: {
    fontSize: 20,
    color: '#4ECDC4',
  },
  infoBox: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  infoText: {
    color: '#9CA3AF',
    fontSize: 13,
    lineHeight: 18,
  },
  inputLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
    marginTop: 16,
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
  seedInput: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#374151',
    minHeight: 100,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  wordCount: {
    color: '#6B7280',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  pasteButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  pasteButtonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  pasteButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  orText: {
    color: '#6B7280',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
  },
  jsonInput: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    minHeight: 150,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 12,
  },
  clearButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  clearButtonText: {
    color: '#EF4444',
    fontSize: 14,
  },
  previewCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  changeFile: {
    fontSize: 13,
    color: '#EF4444',
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewLabel: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  previewValue: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  previewAddress: {
    fontSize: 11,
    color: '#4ECDC4',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    maxWidth: 180,
  },
  restoreButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  restoreButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  errorCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
  },
  securityNote: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  securityNoteText: {
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 18,
  },
});

export default RecoveryScreen;