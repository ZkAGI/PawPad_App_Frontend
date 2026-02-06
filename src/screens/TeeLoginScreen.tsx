// // screens/TEELoginScreen.tsx
// // Login screen - asks for Google Authenticator code to get session

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   Keyboard,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList, VaultData } from '../types/navigation';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { login, formatAddress, isLoggedIn, getWallets } from '../services/teeSevice';

// type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
// type RouteType = RouteProp<RootStackParamList, 'TEELogin'> | any;

// const COLORS = {
//   bgPrimary: '#02111B',
//   bgCard: '#0D2137',
//   accent: '#33E6BF',
//   accentDim: 'rgba(51, 230, 191, 0.15)',
//   textPrimary: '#FFFFFF',
//   textSecondary: '#8A9BAE',
//   textMuted: '#5A6B7E',
//   border: 'rgba(42, 82, 152, 0.3)',
//   error: '#FF6B6B',
// };

// const TEELoginScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<RouteType>();
  
//   const [vault, setVault] = useState<VaultData | null>(null);
//   const [totpCode, setTotpCode] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [loadingVault, setLoadingVault] = useState(true);

//   // Load saved vault on mount
//   useEffect(() => {
//     loadSavedVault();
//   }, []);

//   // Check if already logged in
//   useEffect(() => {
//     if (isLoggedIn() && vault) {
//       // Already have valid session, go to Home
//       navigation.replace('Home', { vault });
//     }
//   }, [vault]);

//   const loadSavedVault = async () => {
//     try {
//       const savedVault = await AsyncStorage.getItem('tee_wallet');
//       if (savedVault) {
//         setVault(JSON.parse(savedVault));
//       } else {
//         // No wallet found, go to onboarding
//         setError('No wallet found. Please create or recover a wallet first.');
//       }
//     } catch (err) {
//       console.error('Failed to load vault:', err);
//       setError('Failed to load wallet data');
//     } finally {
//       setLoadingVault(false);
//     }
//   };

//   const handleLogin = async () => {
//     if (totpCode.length !== 6) {
//       setError('Please enter a 6-digit code');
//       return;
//     }

//     const uid = vault?.tee?.uid || vault?.vault_id;
//     if (!uid) {
//       setError('No wallet UID found. Please recover your wallet.');
//       return;
//     }

//     Keyboard.dismiss();
//     setLoading(true);
//     setError('');

//     try {
//       // 1. Login to get session token
//       const token = await login(uid, totpCode);
//       console.log('[Login] Success, session token received');

//       // 2. Fetch wallet addresses from API
//       const walletsResponse = await getWallets();
//       console.log('[Login] Wallets fetched:', walletsResponse);

//       // 3. Update vault with real wallet addresses
//       const updatedVault: VaultData = {
//         ...vault!,
//         tee: {
//           uid: walletsResponse.uid,
//           evm: walletsResponse.wallets.evm,
//           solana: walletsResponse.wallets.solana,
//           backup_hash: vault?.tee?.backup_hash || '',
//         },
//       };

//       // 4. Save updated vault to AsyncStorage
//       await AsyncStorage.setItem('tee_wallet', JSON.stringify(updatedVault));
//       console.log('[Login] Vault updated with wallet addresses');

//       // 5. Navigate to home with updated vault
//       navigation.reset({
//         index: 0,
//         routes: [{ name: 'Home', params: { vault: updatedVault } }],
//       });

//     } catch (err: any) {
//       console.error('[Login] Error:', err);
//       setError(err.message || 'Login failed. Please try again.');
//       setTotpCode('');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRecovery = () => {
//     navigation.navigate('RecoverTEEWallet');
//   };

//   const handleCreateNew = () => {
//     navigation.navigate('ChainSelection' as any);
//   };

//   if (loadingVault) {
//     return (
//       <View style={[styles.container, styles.centerContent]}>
//         <ActivityIndicator size="large" color={COLORS.accent} />
//         <Text style={styles.loadingText}>Loading wallet...</Text>
//       </View>
//     );
//   }

//   // No wallet found state
//   if (!vault) {
//     return (
//       <View style={styles.container}>
//         <SafeAreaView style={styles.safeArea}>
//           <View style={styles.content}>
//             <View style={styles.iconContainer}>
//               <Text style={styles.iconEmoji}>🔐</Text>
//             </View>

//             <Text style={styles.title}>No Wallet Found</Text>
//             <Text style={styles.subtitle}>
//               Create a new wallet or recover an existing one
//             </Text>

//             <TouchableOpacity style={styles.primaryButton} onPress={handleCreateNew}>
//               <Text style={styles.primaryButtonText}>Create New Wallet</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.secondaryButton} onPress={handleRecovery}>
//               <Text style={styles.secondaryButtonText}>Recover Existing Wallet</Text>
//             </TouchableOpacity>
//           </View>
//         </SafeAreaView>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.content}>
//           {/* Logo/Icon */}
//           <View style={styles.iconContainer}>
//             <Text style={styles.iconEmoji}>🔐</Text>
//           </View>

//           {/* Title */}
//           <Text style={styles.title}>Welcome Back</Text>
//           <Text style={styles.subtitle}>
//             Enter your Google Authenticator code to unlock
//           </Text>

//           {/* Wallet Info */}
//           {vault?.tee && (
//             <View style={styles.walletCard}>
//               <View style={styles.walletRow}>
//                 <Text style={styles.walletLabel}>🔷 EVM</Text>
//                 <Text style={styles.walletAddress}>
//                   {formatAddress(vault.tee.evm?.address || '', 8)}
//                 </Text>
//               </View>
//               <View style={styles.walletRow}>
//                 <Text style={styles.walletLabel}>◎ Solana</Text>
//                 <Text style={styles.walletAddress}>
//                   {formatAddress(vault.tee.solana?.address || '', 8)}
//                 </Text>
//               </View>
//             </View>
//           )}

//           {/* TOTP Input */}
//           <View style={styles.inputSection}>
//             <Text style={styles.inputLabel}>Authenticator Code</Text>
//             <TextInput
//               style={[styles.totpInput, error && styles.totpInputError]}
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
//             <Text style={styles.inputHint}>
//               Open Google Authenticator and enter the 6-digit code
//             </Text>
//           </View>

//           {/* Error */}
//           {error ? (
//             <View style={styles.errorCard}>
//               <Text style={styles.errorText}>❌ {error}</Text>
//             </View>
//           ) : null}

//           {/* Login Button */}
//           <TouchableOpacity
//             style={[
//               styles.primaryButton,
//               (totpCode.length !== 6 || loading) && styles.buttonDisabled
//             ]}
//             onPress={handleLogin}
//             disabled={totpCode.length !== 6 || loading}
//           >
//             {loading ? (
//               <ActivityIndicator color={COLORS.bgPrimary} />
//             ) : (
//               <Text style={styles.primaryButtonText}>Unlock Wallet</Text>
//             )}
//           </TouchableOpacity>

//           {/* Recovery Link */}
//           <View style={styles.recoverySection}>
//             <Text style={styles.recoveryText}>Lost your phone?</Text>
//             <TouchableOpacity onPress={handleRecovery}>
//               <Text style={styles.recoveryLink}>Recover Account</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </SafeAreaView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.bgPrimary,
//   },
//   safeArea: {
//     flex: 1,
//   },
//   content: {
//     flex: 1,
//     padding: 24,
//     justifyContent: 'center',
//   },
//   centerContent: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 16,
//     color: COLORS.textSecondary,
//     fontSize: 14,
//   },
//   iconContainer: {
//     width: 88,
//     height: 88,
//     borderRadius: 44,
//     backgroundColor: COLORS.accentDim,
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignSelf: 'center',
//     marginBottom: 24,
//   },
//   iconEmoji: {
//     fontSize: 40,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: '600',
//     color: COLORS.textPrimary,
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: COLORS.textSecondary,
//     textAlign: 'center',
//     marginBottom: 32,
//   },
//   walletCard: {
//     backgroundColor: COLORS.bgCard,
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 32,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   walletRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 8,
//   },
//   walletLabel: {
//     fontSize: 14,
//     color: COLORS.textSecondary,
//   },
//   walletAddress: {
//     fontSize: 13,
//     color: COLORS.accent,
//     fontFamily: 'monospace',
//   },
//   inputSection: {
//     marginBottom: 24,
//   },
//   inputLabel: {
//     fontSize: 14,
//     color: COLORS.textSecondary,
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   totpInput: {
//     backgroundColor: COLORS.bgCard,
//     borderRadius: 16,
//     padding: 20,
//     fontSize: 32,
//     color: COLORS.textPrimary,
//     textAlign: 'center',
//     letterSpacing: 12,
//     fontFamily: 'monospace',
//     borderWidth: 2,
//     borderColor: COLORS.border,
//   },
//   totpInputError: {
//     borderColor: COLORS.error,
//   },
//   inputHint: {
//     fontSize: 12,
//     color: COLORS.textMuted,
//     textAlign: 'center',
//     marginTop: 12,
//   },
//   errorCard: {
//     backgroundColor: 'rgba(255, 107, 107, 0.1)',
//     borderRadius: 12,
//     padding: 14,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 107, 107, 0.3)',
//   },
//   errorText: {
//     color: COLORS.error,
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   primaryButton: {
//     backgroundColor: COLORS.accent,
//     borderRadius: 14,
//     padding: 18,
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   primaryButtonText: {
//     color: COLORS.bgPrimary,
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   secondaryButton: {
//     backgroundColor: 'transparent',
//     borderRadius: 14,
//     padding: 18,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.accent,
//   },
//   secondaryButtonText: {
//     color: COLORS.accent,
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   buttonDisabled: {
//     opacity: 0.4,
//   },
//   recoverySection: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 6,
//     marginTop: 8,
//   },
//   recoveryText: {
//     fontSize: 14,
//     color: COLORS.textMuted,
//   },
//   recoveryLink: {
//     fontSize: 14,
//     color: COLORS.accent,
//     fontWeight: '500',
//   },
// });

// export default TEELoginScreen;


// screens/TEELoginScreen.tsx
// Login screen - asks for Google Authenticator code to get session

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, VaultData } from '../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, formatAddress, isLoggedIn, getWallets } from '../services/teeSevice';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, 'TEELogin'> | any;

const COLORS = {
  bgPrimary: '#02111B',
  bgCard: '#0D2137',
  accent: '#33E6BF',
  accentDim: 'rgba(51, 230, 191, 0.15)',
  textPrimary: '#FFFFFF',
  textSecondary: '#8A9BAE',
  textMuted: '#5A6B7E',
  border: 'rgba(42, 82, 152, 0.3)',
  error: '#FF6B6B',
};

const TEELoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  
  const [vault, setVault] = useState<VaultData | null>(null);
  const [totpCode, setTotpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingVault, setLoadingVault] = useState(true);

  // Load saved vault on mount
  useEffect(() => {
    loadSavedVault();
  }, []);

  // Check if already logged in
  useEffect(() => {
    if (isLoggedIn() && vault) {
      // Already have valid session, go to Home
      navigation.replace('Home', { vault });
    }
  }, [vault]);

  const loadSavedVault = async () => {
    try {
      const savedVault = await AsyncStorage.getItem('tee_wallet');
      if (savedVault) {
        setVault(JSON.parse(savedVault));
      } else {
        // No wallet found, go to onboarding
        setError('No wallet found. Please create or recover a wallet first.');
      }
    } catch (err) {
      console.error('Failed to load vault:', err);
      setError('Failed to load wallet data');
    } finally {
      setLoadingVault(false);
    }
  };

  const handleLogin = async () => {
    if (totpCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    const uid = vault?.tee?.uid || vault?.vault_id;
    if (!uid) {
      setError('No wallet UID found. Please recover your wallet.');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setError('');

    try {
      // 1. Login to get session token
      const token = await login(uid, totpCode);
      console.log('[Login] Success, session token received');

      // 2. Fetch wallet addresses from API
      const walletsResponse = await getWallets();
      console.log('[Login] Wallets fetched:', walletsResponse);

      // 3. Update vault with real wallet addresses
      const updatedVault: VaultData = {
        ...vault!,
        vault_name: 'TEE Wallet',  // Always use proper name
        tee: {
          uid: walletsResponse.uid,
          evm: walletsResponse.wallets.evm,
          solana: walletsResponse.wallets.solana,
          backup_hash: vault?.tee?.backup_hash || '',
        },
      };

      // 4. Save updated vault to AsyncStorage
      await AsyncStorage.setItem('tee_wallet', JSON.stringify(updatedVault));
      console.log('[Login] Vault updated with wallet addresses');

      // 5. Navigate to home with updated vault
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home', params: { vault: updatedVault } }],
      });

    } catch (err: any) {
      console.error('[Login] Error:', err);
      setError(err.message || 'Login failed. Please try again.');
      setTotpCode('');
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = () => {
    navigation.navigate('RecoverTEEWallet');
  };

  const handleCreateNew = () => {
    navigation.navigate('ChainSelection' as any);
  };

  if (loadingVault) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Loading wallet...</Text>
      </View>
    );
  }

  // No wallet found state
  if (!vault) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconEmoji}>🔐</Text>
            </View>

            <Text style={styles.title}>No Wallet Found</Text>
            <Text style={styles.subtitle}>
              Create a new wallet or recover an existing one
            </Text>

            <TouchableOpacity style={styles.primaryButton} onPress={handleCreateNew}>
              <Text style={styles.primaryButtonText}>Create New Wallet</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleRecovery}>
              <Text style={styles.secondaryButtonText}>Recover Existing Wallet</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Logo/Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.iconEmoji}>🔐</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Enter your Google Authenticator code to unlock
          </Text>

          {/* Wallet Info */}
          {vault?.tee && (
            <View style={styles.walletCard}>
              <View style={styles.walletRow}>
                <Text style={styles.walletLabel}>🔷 EVM</Text>
                <Text style={styles.walletAddress}>
                  {formatAddress(vault.tee.evm?.address || '', 8)}
                </Text>
              </View>
              <View style={styles.walletRow}>
                <Text style={styles.walletLabel}>◎ Solana</Text>
                <Text style={styles.walletAddress}>
                  {formatAddress(vault.tee.solana?.address || '', 8)}
                </Text>
              </View>
            </View>
          )}

          {/* TOTP Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Authenticator Code</Text>
            <TextInput
              style={[styles.totpInput, error && styles.totpInputError]}
              value={totpCode}
              onChangeText={(text) => {
                setTotpCode(text.replace(/[^0-9]/g, ''));
                setError('');
              }}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="000000"
              placeholderTextColor={COLORS.textMuted}
              autoFocus
            />
            <Text style={styles.inputHint}>
              Open Google Authenticator and enter the 6-digit code
            </Text>
          </View>

          {/* Error */}
          {error ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>❌ {error}</Text>
            </View>
          ) : null}

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.primaryButton,
              (totpCode.length !== 6 || loading) && styles.buttonDisabled
            ]}
            onPress={handleLogin}
            disabled={totpCode.length !== 6 || loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.bgPrimary} />
            ) : (
              <Text style={styles.primaryButtonText}>Unlock Wallet</Text>
            )}
          </TouchableOpacity>

          {/* Recovery Link */}
          <View style={styles.recoverySection}>
            <Text style={styles.recoveryText}>Lost your phone?</Text>
            <TouchableOpacity onPress={handleRecovery}>
              <Text style={styles.recoveryLink}>Recover Account</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.accentDim,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  iconEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  walletCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  walletRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  walletLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  walletAddress: {
    fontSize: 13,
    color: COLORS.accent,
    fontFamily: 'monospace',
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  totpInput: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 20,
    fontSize: 32,
    color: COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: 12,
    fontFamily: 'monospace',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  totpInputError: {
    borderColor: COLORS.error,
  },
  inputHint: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 12,
  },
  errorCard: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: COLORS.bgPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  secondaryButtonText: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: '500',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  recoverySection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  recoveryText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  recoveryLink: {
    fontSize: 14,
    color: COLORS.accent,
    fontWeight: '500',
  },
});

export default TEELoginScreen;