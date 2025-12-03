// // import React from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TouchableOpacity,
// //   SafeAreaView,
// // } from 'react-native';
// // import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// // import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// // import { RootStackParamList } from '../types/navigation';

// // type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VaultSuccess'>;
// // type RoutePropType = RouteProp<RootStackParamList, 'VaultSuccess'>;

// // const VaultSuccessScreen = () => {
// //   const navigation = useNavigation<NavigationProp>();
// //   const route = useRoute<RoutePropType>();
// //   const { vault } = route.params;

// //   const formatAddress = (address: string) => {
// //     return `${address.slice(0, 6)}...${address.slice(-4)}`;
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <View style={styles.content}>
// //         <Text style={styles.successEmoji}>✅</Text>
        
// //         <Text style={styles.title}>Vault Created!</Text>
// //         <Text style={styles.subtitle}>
// //           Your MPC wallet is ready to use
// //         </Text>

// //         <View style={styles.vaultCard}>
// //           <View style={styles.row}>
// //             <Text style={styles.label}>Vault Name</Text>
// //             <Text style={styles.value}>{vault.vault_name}</Text>
// //           </View>

// //           <View style={styles.row}>
// //             <Text style={styles.label}>Chain</Text>
// //             <Text style={styles.chainBadge}>{vault.chain}</Text>
// //           </View>

// //           <View style={styles.row}>
// //             <Text style={styles.label}>Address</Text>
// //             <Text style={styles.value}>{formatAddress(vault.address)}</Text>
// //           </View>

// //           <View style={styles.row}>
// //             <Text style={styles.label}>MPC Provider</Text>
// //             <Text style={styles.value}>{vault.mpc_provider}</Text>
// //           </View>
// //         </View>

// //         <TouchableOpacity
// //           style={styles.button}
// //           onPress={() => navigation.replace('Home', { vault })}
// //         >
// //           <Text style={styles.buttonText}>Go to Wallet</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#0A1628',
// //   },
// //   content: {
// //     flex: 1,
// //     paddingHorizontal: 24,
// //     justifyContent: 'center',
// //   },
// //   successEmoji: {
// //     fontSize: 64,
// //     textAlign: 'center',
// //     marginBottom: 24,
// //   },
// //   title: {
// //     fontSize: 28,
// //     color: '#FFFFFF',
// //     fontWeight: 'bold',
// //     textAlign: 'center',
// //     marginBottom: 8,
// //   },
// //   subtitle: {
// //     fontSize: 16,
// //     color: '#9CA3AF',
// //     textAlign: 'center',
// //     marginBottom: 40,
// //   },
// //   vaultCard: {
// //     backgroundColor: '#1E293B',
// //     borderRadius: 16,
// //     padding: 20,
// //     marginBottom: 40,
// //   },
// //   row: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 16,
// //   },
// //   label: {
// //     fontSize: 14,
// //     color: '#9CA3AF',
// //   },
// //   value: {
// //     fontSize: 14,
// //     color: '#FFFFFF',
// //     fontWeight: '500',
// //   },
// //   chainBadge: {
// //     fontSize: 14,
// //     color: '#4ECDC4',
// //     backgroundColor: 'rgba(78, 205, 196, 0.1)',
// //     paddingHorizontal: 12,
// //     paddingVertical: 6,
// //     borderRadius: 8,
// //     fontWeight: '600',
// //   },
// //   button: {
// //     backgroundColor: '#4ECDC4',
// //     padding: 18,
// //     borderRadius: 12,
// //     alignItems: 'center',
// //   },
// //   buttonText: {
// //     color: '#FFFFFF',
// //     fontSize: 16,
// //     fontWeight: '600',
// //   },
// // });

// // export default VaultSuccessScreen;
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
//   PermissionsAndroid,
// } from 'react-native';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../types/navigation';
// import Clipboard from '@react-native-clipboard/clipboard';
// import RNFS from 'react-native-fs';
// import Share from 'react-native-share';

// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VaultSuccess'>;
// type RouteType = RouteProp<RootStackParamList, 'VaultSuccess'>;

// const VaultSuccessScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<RouteType>();
//   const vault = route.params?.vault;
//   console.log('🔍 VaultSuccessScreen received vault:', JSON.stringify(vault, null, 2));


//   const [backupDownloaded, setBackupDownloaded] = useState(false);
//   const [downloading, setDownloading] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [savedPath, setSavedPath] = useState<string | null>(null);

//   const copyAddress = () => {
//     if (vault?.address) {
//       Clipboard.setString(vault.address);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     }
//   };

//   const createBackupData = () => {
//     return {
//       version: '1.0',
//       export_date: new Date().toISOString(),
//       wallet_type: 'pawpad_mpc',
//       vault: {
//         vault_id: vault?.vault_id,
//         vault_name: vault?.vault_name,
//         chain: vault?.chain,
//         public_address: vault?.address,
//         mpc_provider: vault?.mpc_provider,
//         created_at: vault?.created_at,
//         email: vault?.email,
//       },
//       recovery_instructions: [
//         '1. Install PawPad on your new device',
//         '2. Tap "Recover Wallet" on the welcome screen',
//         '3. Enter the email you used to create this wallet',
//         '4. Verify with the code sent to your email',
//         '5. Your wallet will be restored automatically',
//       ],
//       important_notes: [
//         'This file does NOT contain your private keys',
//         'Your keys are secured by MPC and never exist in one place',
//         'Keep this file safe as an extra recovery option',
//         'You can also recover using just your email',
//       ],
//     };
//   };

//   const getFilename = () => {
//     const safeName = (vault?.vault_name || 'wallet').replace(/[^a-zA-Z0-9]/g, '_');
//     const date = new Date().toISOString().split('T')[0];
//     return `pawpad_backup_${safeName}_${date}.json`;
//   };

//   const downloadBackup = async () => {
//     setDownloading(true);

//     try {
//       const backupData = createBackupData();
//       const jsonString = JSON.stringify(backupData, null, 2);
//       const filename = getFilename();

//       // First, save the file to a temporary location
//       const tempPath = `${RNFS.CachesDirectoryPath}/${filename}`;
//       await RNFS.writeFile(tempPath, jsonString, 'utf8');
//       console.log('Temp file created at:', tempPath);

//       if (Platform.OS === 'android') {
//         // Try to save to Downloads folder first
//         try {
//           if (Platform.Version < 29) {
//             await PermissionsAndroid.request(
//               PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
//             );
//           }

//           const downloadPath = `${RNFS.DownloadDirectoryPath}/${filename}`;
//           await RNFS.copyFile(tempPath, downloadPath);
//           console.log('✅ File saved to Downloads:', downloadPath);
//           setSavedPath(downloadPath);
//         } catch (downloadError) {
//           console.log('Could not save to Downloads, will share instead:', downloadError);
//         }
//       }

//       // Share the FILE (not text) using react-native-share
//       await Share.open({
//         title: 'Save PawPad Backup',
//         url: `file://${tempPath}`,
//         type: 'application/json',
//         filename: filename,
//         saveToFiles: true, // iOS: shows "Save to Files" option
//       });

//       setBackupDownloaded(true);

//       // Show success message
//       if (savedPath) {
//         Alert.alert(
//           '✅ Backup Saved!',
//           `Your backup file has been saved to:\n\n📁 Downloads/${filename}`,
//         );
//       }

//     } catch (error: any) {
//       console.error('Backup error:', error);
      
//       // If user cancelled the share, still mark as done if we saved to Downloads
//       if (error.message?.includes('cancel') || error.message?.includes('dismiss')) {
//         if (savedPath) {
//           setBackupDownloaded(true);
//           Alert.alert(
//             '✅ Backup Saved!',
//             `Your backup file has been saved to Downloads.`,
//           );
//           return;
//         }
//       }

//       // Fallback: Copy to clipboard
//       Alert.alert(
//         'Share Cancelled',
//         'Would you like to copy the backup data to clipboard instead?',
//         [
//           { text: 'No', style: 'cancel' },
//           {
//             text: 'Copy to Clipboard',
//             onPress: () => {
//               const backupData = createBackupData();
//               Clipboard.setString(JSON.stringify(backupData, null, 2));
//               setBackupDownloaded(true);
//               Alert.alert('Copied!', 'Backup data copied to clipboard.');
//             },
//           },
//         ]
//       );
//     } finally {
//       setDownloading(false);
//     }
//   };

//   const goToHome = () => {
//     if (!backupDownloaded) {
//       Alert.alert(
//         '⚠️ Backup Not Saved',
//         'We strongly recommend saving your backup file before continuing.\n\nAre you sure you want to skip?',
//         [
//           { text: 'Save Backup', onPress: downloadBackup },
//           {
//             text: 'Skip Anyway',
//             style: 'destructive',
//             onPress: () => {
//               navigation.reset({
//                 index: 0,
//                 routes: [{ name: 'Home', params: { vault } }],
//               });
//             },
//           },
//         ]
//       );
//     } else {
//       navigation.reset({
//         index: 0,
//         routes: [{ name: 'Home', params: { vault } }],
//       });
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//         <View style={styles.content}>
//           {/* Success Header */}
//           <View style={styles.successHeader}>
//             <Text style={styles.successEmoji}>🎉</Text>
//             <Text style={styles.title}>Wallet Created!</Text>
//             <Text style={styles.subtitle}>
//               Your {vault?.chain} wallet is ready
//             </Text>
//           </View>

//           {/* Wallet Card */}
//           <View style={styles.walletCard}>
//             <View style={styles.walletHeader}>
//               <Text style={styles.walletName}>{vault?.vault_name}</Text>
//               <View style={styles.chainBadge}>
//                 <Text style={styles.chainBadgeText}>{vault?.chain}</Text>
//               </View>
//             </View>

//             <Text style={styles.addressLabel}>Wallet Address</Text>
//             <TouchableOpacity style={styles.addressBox} onPress={copyAddress}>
//               <Text style={styles.addressText} numberOfLines={1}>
//                 {vault?.address}
//               </Text>
//               <Text style={styles.copyIcon}>{copied ? '✓' : '📋'}</Text>
//             </TouchableOpacity>

//             <View style={styles.mpcRow}>
//               <Text style={styles.mpcLabel}>Secured by</Text>
//               <Text style={styles.mpcValue}>{vault?.mpc_provider} MPC</Text>
//             </View>
//           </View>

//           {/* Backup Section */}
//           <View style={styles.backupSection}>
//             <View style={styles.warningBanner}>
//               <Text style={styles.warningEmoji}>⚠️</Text>
//               <Text style={styles.warningTitle}>Important: Save Your Backup</Text>
//             </View>

//             <Text style={styles.warningText}>
//               Save this backup file to a secure location. While you can recover your wallet using your email, 
//               this file provides an extra layer of security.
//             </Text>

//             <View style={styles.backupInfo}>
//               <Text style={styles.backupInfoTitle}>What's in the backup:</Text>
//               <Text style={styles.backupInfoItem}>✓ Wallet name and address</Text>
//               <Text style={styles.backupInfoItem}>✓ Recovery instructions</Text>
//               <Text style={styles.backupInfoItem}>✓ MPC provider reference</Text>
//               <Text style={styles.backupInfoItemSafe}>🔒 NO private keys (they're secured by MPC)</Text>
//             </View>

//             {!backupDownloaded ? (
//               <TouchableOpacity
//                 style={styles.backupButton}
//                 onPress={downloadBackup}
//                 disabled={downloading}
//               >
//                 {downloading ? (
//                   <ActivityIndicator color="#000" />
//                 ) : (
//                   <Text style={styles.backupButtonText}>📥 Save Backup File</Text>
//                 )}
//               </TouchableOpacity>
//             ) : (
//               <View style={styles.successBanner}>
//                 <Text style={styles.successBannerText}>✅ Backup Saved!</Text>
//                 <Text style={styles.savedPathText}>
//                   {savedPath ? `📁 Downloads/${getFilename()}` : 'File saved successfully'}
//                 </Text>
//               </View>
//             )}
//           </View>

//           {/* Continue Button */}
//           <TouchableOpacity
//             style={[
//               styles.continueButton,
//               !backupDownloaded && styles.continueButtonSecondary,
//             ]}
//             onPress={goToHome}
//           >
//             <Text
//               style={[
//                 styles.continueButtonText,
//                 !backupDownloaded && styles.continueButtonTextSecondary,
//               ]}
//             >
//               {backupDownloaded ? 'Go to Wallet →' : 'Skip for now'}
//             </Text>
//           </TouchableOpacity>

//           {!backupDownloaded && (
//             <Text style={styles.skipWarning}>
//               You can always export your backup later from Settings
//             </Text>
//           )}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0A1628',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   content: {
//     paddingHorizontal: 24,
//     paddingTop: 40,
//     paddingBottom: 40,
//   },
//   successHeader: {
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   successEmoji: {
//     fontSize: 64,
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#9CA3AF',
//   },
//   walletCard: {
//     backgroundColor: '#1E293B',
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 24,
//   },
//   walletHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   walletName: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
//   chainBadge: {
//     backgroundColor: 'rgba(78, 205, 196, 0.15)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 8,
//   },
//   chainBadgeText: {
//     color: '#4ECDC4',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   addressLabel: {
//     fontSize: 12,
//     color: '#9CA3AF',
//     marginBottom: 8,
//   },
//   addressBox: {
//     backgroundColor: '#0F172A',
//     borderRadius: 8,
//     padding: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   addressText: {
//     flex: 1,
//     color: '#4ECDC4',
//     fontSize: 12,
//     fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
//   },
//   copyIcon: {
//     fontSize: 16,
//     marginLeft: 8,
//   },
//   mpcRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   mpcLabel: {
//     color: '#9CA3AF',
//     fontSize: 14,
//   },
//   mpcValue: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   backupSection: {
//     backgroundColor: '#1E293B',
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 24,
//     borderWidth: 1,
//     borderColor: '#F59E0B',
//   },
//   warningBanner: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   warningEmoji: {
//     fontSize: 24,
//     marginRight: 10,
//   },
//   warningTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#F59E0B',
//   },
//   warningText: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     lineHeight: 20,
//     marginBottom: 16,
//   },
//   backupInfo: {
//     backgroundColor: '#0F172A',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//   },
//   backupInfoTitle: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#FFFFFF',
//     marginBottom: 8,
//   },
//   backupInfoItem: {
//     fontSize: 12,
//     color: '#9CA3AF',
//     marginBottom: 4,
//   },
//   backupInfoItemSafe: {
//     fontSize: 12,
//     color: '#10B981',
//     marginTop: 4,
//     fontWeight: '500',
//   },
//   backupButton: {
//     backgroundColor: '#F59E0B',
//     borderRadius: 12,
//     padding: 16,
//     alignItems: 'center',
//   },
//   successBanner: {
//     backgroundColor: 'rgba(16, 185, 129, 0.1)',
//     borderRadius: 12,
//     padding: 16,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#10B981',
//   },
//   successBannerText: {
//     color: '#10B981',
//     fontSize: 18,
//     fontWeight: '700',
//     marginBottom: 4,
//   },
//   savedPathText: {
//     color: '#10B981',
//     fontSize: 12,
//     opacity: 0.8,
//   },
//   backupButtonText: {
//     color: '#000000',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   continueButton: {
//     backgroundColor: '#4ECDC4',
//     borderRadius: 12,
//     padding: 18,
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   continueButtonSecondary: {
//     backgroundColor: 'transparent',
//     borderWidth: 1,
//     borderColor: '#374151',
//   },
//   continueButtonText: {
//     color: '#000000',
//     fontSize: 18,
//     fontWeight: '700',
//   },
//   continueButtonTextSecondary: {
//     color: '#9CA3AF',
//   },
//   skipWarning: {
//     color: '#6B7280',
//     fontSize: 12,
//     textAlign: 'center',
//   },
// });

// export default VaultSuccessScreen;

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
  PermissionsAndroid,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, VaultData } from '../types/navigation';
import Clipboard from '@react-native-clipboard/clipboard';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VaultSuccess'>;
type RouteType = RouteProp<RootStackParamList, 'VaultSuccess'>;

const VaultSuccessScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const vault = route.params?.vault;

  console.log('🔍 VaultSuccessScreen vault:', JSON.stringify(vault, null, 2));

  const [backupDownloaded, setBackupDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copiedSol, setCopiedSol] = useState(false);
  const [copiedZec, setCopiedZec] = useState(false);
  const [savedPath, setSavedPath] = useState<string | null>(null);

  // Check if unified vault - use optional chaining
  const isUnified = vault?.vault_type === 'unified' && !!vault?.sol && !!vault?.zec;

  const copyAddress = (address: string | undefined, type: 'sol' | 'zec') => {
    if (!address) return;
    
    Clipboard.setString(address);
    if (type === 'sol') {
      setCopiedSol(true);
      setTimeout(() => setCopiedSol(false), 2000);
    } else {
      setCopiedZec(true);
      setTimeout(() => setCopiedZec(false), 2000);
    }
  };

  const createBackupData = () => {
    if (isUnified) {
      return {
        version: '2.0',
        export_date: new Date().toISOString(),
        wallet_type: 'pawpad_unified_mpc',
        vault: {
          vault_id: vault?.vault_id,
          vault_name: vault?.vault_name,
          vault_type: 'unified',
          email: vault?.email,
          created_at: vault?.created_at,
          sol: {
            address: vault?.sol?.address,
            mpc_provider: vault?.sol?.mpc_provider || 'Arcium',
          },
          zec: {
            address: vault?.zec?.address,
            viewing_key: vault?.zec?.viewing_key,
          },
        },
        recovery_instructions: [
          '1. Install PawPad on your new device',
          '2. Tap "Recover Wallet"',
          '3. Upload this backup file',
          '4. Both SOL and ZEC wallets restored!',
        ],
        important_notes: [
          '❌ NO private keys in this file',
          '🔐 SOL: Arcium MXE (seedless)',
          '🔐 ZEC: Encrypted on server',
        ],
      };
    }
    
    // Legacy format
    return {
      version: '1.0',
      export_date: new Date().toISOString(),
      wallet_type: 'pawpad_mpc',
      vault: {
        vault_id: vault?.vault_id,
        vault_name: vault?.vault_name,
        chain: vault?.chain || 'SOL',
        public_address: vault?.address || vault?.sol?.address,
        mpc_provider: vault?.mpc_provider || 'Arcium',
        created_at: vault?.created_at,
        email: vault?.email,
      },
    };
  };

  const getFilename = () => {
    const safeName = (vault?.vault_name || 'wallet').replace(/[^a-zA-Z0-9]/g, '_');
    const date = new Date().toISOString().split('T')[0];
    return `pawpad_backup_${isUnified ? 'unified' : 'sol'}_${safeName}_${date}.json`;
  };

  const downloadBackup = async () => {
    setDownloading(true);

    try {
      const backupData = createBackupData();
      const jsonString = JSON.stringify(backupData, null, 2);
      const filename = getFilename();

      const tempPath = `${RNFS.CachesDirectoryPath}/${filename}`;
      await RNFS.writeFile(tempPath, jsonString, 'utf8');

      if (Platform.OS === 'android') {
        try {
          if (Platform.Version < 29) {
            await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            );
          }
          const downloadPath = `${RNFS.DownloadDirectoryPath}/${filename}`;
          await RNFS.copyFile(tempPath, downloadPath);
          setSavedPath(downloadPath);
        } catch (e) {
          console.log('Download save error:', e);
        }
      }

      await Share.open({
        title: 'Save PawPad Backup',
        url: `file://${tempPath}`,
        type: 'application/json',
        filename,
        saveToFiles: true,
      });

      setBackupDownloaded(true);

    } catch (error: any) {
      if (error.message?.includes('cancel')) {
        if (savedPath) {
          setBackupDownloaded(true);
          return;
        }
      }

      Alert.alert('Share Cancelled', 'Copy to clipboard instead?', [
        { text: 'No', style: 'cancel' },
        {
          text: 'Copy',
          onPress: () => {
            Clipboard.setString(JSON.stringify(createBackupData(), null, 2));
            setBackupDownloaded(true);
            Alert.alert('Copied!', 'Backup copied to clipboard.');
          },
        },
      ]);
    } finally {
      setDownloading(false);
    }
  };

  const goToHome = () => {
    if (!backupDownloaded) {
      Alert.alert('⚠️ Backup Not Saved', 'Save your backup first?', [
        { text: 'Save Backup', onPress: downloadBackup },
        {
          text: 'Skip',
          style: 'destructive',
          onPress: () => {
            // FIX: Only pass vault if it exists
            if (vault) {
              navigation.reset({ index: 0, routes: [{ name: 'Home', params: { vault } }] });
            } else {
              navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
            }
          },
        },
      ]);
    } else {
      // FIX: Only pass vault if it exists
      if (vault) {
        navigation.reset({ index: 0, routes: [{ name: 'Home', params: { vault } }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.emoji}>🎉</Text>
            <Text style={styles.title}>Wallet Created!</Text>
            <Text style={styles.subtitle}>
              {isUnified ? 'Your unified SOL + ZEC wallet is ready' : 'Your wallet is ready'}
            </Text>
          </View>

          {/* Wallet Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.walletName}>{vault?.vault_name}</Text>
              {isUnified && (
                <View style={styles.unifiedBadge}>
                  <Text style={styles.unifiedBadgeText}>UNIFIED</Text>
                </View>
              )}
            </View>

            {/* SOL Address - FIX: Use optional chaining throughout */}
            {vault?.sol?.address && (
              <View style={styles.addressSection}>
                <View style={styles.addressHeader}>
                  <View style={styles.solBadge}><Text style={styles.badgeText}>SOL</Text></View>
                  <Text style={styles.addressLabel}>Solana Address</Text>
                </View>
                <TouchableOpacity 
                  style={styles.addressBox} 
                  onPress={() => copyAddress(vault.sol?.address, 'sol')}
                >
                  <Text style={styles.addressText} numberOfLines={1}>{vault.sol?.address}</Text>
                  <Text style={styles.copyIcon}>{copiedSol ? '✓' : '📋'}</Text>
                </TouchableOpacity>
                <Text style={styles.provider}>Secured by Arcium MPC</Text>
              </View>
            )}

            {/* ZEC Address - FIX: Use optional chaining throughout */}
            {vault?.zec?.address && (
              <View style={styles.addressSection}>
                <View style={styles.addressHeader}>
                  <View style={styles.zecBadge}><Text style={styles.badgeTextDark}>ZEC</Text></View>
                  <Text style={styles.addressLabel}>Zcash Address</Text>
                  <View style={styles.shieldedBadge}><Text style={styles.shieldedText}>🔒 Shielded</Text></View>
                </View>
                <TouchableOpacity 
                  style={styles.addressBox} 
                  onPress={() => copyAddress(vault.zec?.address, 'zec')}
                >
                  <Text style={styles.addressText} numberOfLines={1}>{vault.zec?.address}</Text>
                  <Text style={styles.copyIcon}>{copiedZec ? '✓' : '📋'}</Text>
                </TouchableOpacity>
                <Text style={styles.provider}>Private transactions enabled</Text>
              </View>
            )}
          </View>

          {/* Features */}
          {isUnified && (
            <View style={styles.featuresCard}>
              <Text style={styles.featuresTitle}>✨ Unified Wallet Features</Text>
              <Text style={styles.featureItem}>💱 Instant SOL ↔ ZEC swaps</Text>
              <Text style={styles.featureItem}>🔒 Shielded ZEC transactions</Text>
              <Text style={styles.featureItem}>🔐 Both wallets are seedless</Text>
            </View>
          )}

          {/* Backup */}
          <View style={styles.backupCard}>
            <Text style={styles.backupTitle}>⚠️ Save Your Backup</Text>
            <Text style={styles.backupText}>
              {isUnified 
                ? 'This backup includes both SOL and ZEC wallet info.'
                : 'Save this backup for wallet recovery.'
              }
            </Text>

            {!backupDownloaded ? (
              <TouchableOpacity style={styles.backupButton} onPress={downloadBackup} disabled={downloading}>
                {downloading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.backupButtonText}>📥 Save Backup File</Text>
                )}
              </TouchableOpacity>
            ) : (
              <View style={styles.savedBanner}>
                <Text style={styles.savedText}>✅ Backup Saved!</Text>
              </View>
            )}
          </View>

          {/* Continue */}
          <TouchableOpacity
            style={[styles.continueButton, !backupDownloaded && styles.continueButtonSecondary]}
            onPress={goToHome}
          >
            <Text style={[styles.continueButtonText, !backupDownloaded && styles.continueButtonTextSecondary]}>
              {backupDownloaded ? 'Go to Wallet →' : 'Skip for now'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  scrollView: { flex: 1 },
  content: { padding: 24, paddingTop: 40 },
  header: { alignItems: 'center', marginBottom: 24 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#9CA3AF', textAlign: 'center' },
  card: { backgroundColor: '#1E293B', borderRadius: 16, padding: 20, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  walletName: { fontSize: 20, fontWeight: '600', color: '#FFFFFF' },
  unifiedBadge: { backgroundColor: 'rgba(147, 51, 234, 0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  unifiedBadgeText: { color: '#A855F7', fontSize: 12, fontWeight: '600' },
  addressSection: { marginBottom: 16 },
  addressHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  solBadge: { backgroundColor: '#9945FF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginRight: 8 },
  zecBadge: { backgroundColor: '#F4B728', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginRight: 8 },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  badgeTextDark: { color: '#000000', fontSize: 10, fontWeight: '700' },
  shieldedBadge: { backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 8 },
  shieldedText: { color: '#10B981', fontSize: 10 },
  addressLabel: { fontSize: 12, color: '#9CA3AF' },
  addressBox: { backgroundColor: '#0F172A', borderRadius: 8, padding: 12, flexDirection: 'row', alignItems: 'center' },
  addressText: { flex: 1, color: '#4ECDC4', fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  copyIcon: { fontSize: 16, marginLeft: 8 },
  provider: { color: '#6B7280', fontSize: 11, marginTop: 6 },
  featuresCard: { backgroundColor: '#1E293B', borderRadius: 12, padding: 16, marginBottom: 16 },
  featuresTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginBottom: 12 },
  featureItem: { color: '#9CA3AF', fontSize: 13, marginBottom: 6 },
  backupCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#F59E0B' },
  backupTitle: { fontSize: 18, fontWeight: '700', color: '#F59E0B', marginBottom: 8 },
  backupText: { fontSize: 14, color: '#9CA3AF', marginBottom: 16 },
  backupButton: { backgroundColor: '#F59E0B', borderRadius: 12, padding: 16, alignItems: 'center' },
  backupButtonText: { color: '#000000', fontSize: 16, fontWeight: '700' },
  savedBanner: { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#10B981' },
  savedText: { color: '#10B981', fontSize: 18, fontWeight: '700' },
  continueButton: { backgroundColor: '#4ECDC4', borderRadius: 12, padding: 18, alignItems: 'center' },
  continueButtonSecondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#374151' },
  continueButtonText: { color: '#000000', fontSize: 18, fontWeight: '700' },
  continueButtonTextSecondary: { color: '#9CA3AF' },
});

export default VaultSuccessScreen;