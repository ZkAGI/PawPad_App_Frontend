// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../types/navigation';

// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VaultNameInput'>;
// type RoutePropType = RouteProp<RootStackParamList, 'VaultNameInput'>;

// const VaultNameInputScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<RoutePropType>();
  
//   // Get params with defaults
//   const chain = route.params?.chain || 'SOL';
//   const email = route.params?.email;
  
//   const [vaultName, setVaultName] = useState('');

//   const handleContinue = () => {
//     const finalName = vaultName.trim() || `My ${chain} Wallet`;
    
//     // Navigate with optional email
//     navigation.navigate('CreatingVault', {
//       chain,
//       email,  // Can be undefined, that's ok now
//       vaultName: finalName,
//     });
//   };

//   const isValid = true; // Allow empty (will use default name)

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView 
//         style={styles.keyboardView}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       >
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Text style={styles.backButton}>← Back</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.content}>
//           <Text style={styles.title}>Name Your Wallet</Text>
//           <Text style={styles.subtitle}>
//             Give your wallet a memorable name (optional)
//           </Text>

//           <View style={styles.inputContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder={`My ${chain} Wallet`}
//               placeholderTextColor="#6B7280"
//               value={vaultName}
//               onChangeText={setVaultName}
//               autoFocus
//               returnKeyType="done"
//               onSubmitEditing={handleContinue}
//               maxLength={30}
//             />
//           </View>

//           {/* Info Card */}
//           <View style={styles.infoCard}>
//             <Text style={styles.infoTitle}>Creating Unified Wallet</Text>
//             <View style={styles.infoRow}>
//               <View style={styles.solBadge}>
//                 <Text style={styles.badgeText}>SOL</Text>
//               </View>
//               <Text style={styles.infoText}>Solana via Arcium MPC</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <View style={styles.zecBadge}>
//                 <Text style={styles.badgeTextDark}>ZEC</Text>
//               </View>
//               <Text style={styles.infoText}>Zcash with shielded txs</Text>
//             </View>
//           </View>

//           <TouchableOpacity
//             style={[styles.continueButton, !isValid && styles.buttonDisabled]}
//             onPress={handleContinue}
//             disabled={!isValid}
//           >
//             <Text style={styles.continueButtonText}>Create Wallet</Text>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0A1628',
//   },
//   keyboardView: {
//     flex: 1,
//   },
//   header: {
//     paddingHorizontal: 24,
//     paddingTop: 20,
//     marginBottom: 20,
//   },
//   backButton: {
//     color: '#FFFFFF',
//     fontSize: 16,
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 24,
//   },
//   title: {
//     fontSize: 32,
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#9CA3AF',
//     marginBottom: 32,
//   },
//   inputContainer: {
//     marginBottom: 24,
//   },
//   input: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 16,
//     fontSize: 18,
//     color: '#FFFFFF',
//     borderWidth: 2,
//     borderColor: '#374151',
//   },
//   infoCard: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 24,
//   },
//   infoTitle: {
//     color: '#4ECDC4',
//     fontSize: 14,
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   solBadge: {
//     backgroundColor: '#9945FF',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 4,
//     marginRight: 10,
//   },
//   zecBadge: {
//     backgroundColor: '#F4B728',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 4,
//     marginRight: 10,
//   },
//   badgeText: {
//     color: '#FFFFFF',
//     fontSize: 10,
//     fontWeight: '700',
//   },
//   badgeTextDark: {
//     color: '#000000',
//     fontSize: 10,
//     fontWeight: '700',
//   },
//   infoText: {
//     color: '#9CA3AF',
//     fontSize: 13,
//   },
//   continueButton: {
//     backgroundColor: '#4ECDC4',
//     padding: 18,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   buttonDisabled: {
//     backgroundColor: '#374151',
//   },
//   continueButtonText: {
//     color: '#000000',
//     fontSize: 18,
//     fontWeight: '700',
//   },
// });

// export default VaultNameInputScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VaultNameInput'>;
type RoutePropType = RouteProp<RootStackParamList, 'VaultNameInput'>;

const VaultNameInputScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  
  const chain = route.params?.chain || 'SOL';
  const email = route.params?.email;
  const walletType = route.params?.walletType || 'seed';
  
  const [vaultName, setVaultName] = useState('');

  const handleContinue = () => {
    const finalName = vaultName.trim() || (walletType === 'seedless' ? 'My Seedless Wallet' : `My ${chain} Wallet`);
    
    if (walletType === 'seedless') {
      navigation.navigate('CreatingSeedlessVault', { email, vaultName: finalName });
    } else {
      navigation.navigate('CreatingVault', { chain, email, vaultName: finalName });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Name Your Wallet</Text>
          <Text style={styles.subtitle}>
            Give your wallet a memorable name (optional)
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={walletType === 'seedless' ? 'My Seedless Wallet' : `My ${chain} Wallet`}
              placeholderTextColor="#6B7280"
              value={vaultName}
              onChangeText={setVaultName}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleContinue}
              maxLength={30}
            />
          </View>

          {/* Wallet Type Badge */}
          <View style={[
            styles.walletTypeBadge,
            walletType === 'seedless' && styles.walletTypeBadgeSeedless
          ]}>
            <Text style={styles.walletTypeEmoji}>
              {walletType === 'seedless' ? '🔐' : '📝'}
            </Text>
            <Text style={[
              styles.walletTypeText,
              walletType === 'seedless' && styles.walletTypeTextSeedless
            ]}>
              {walletType === 'seedless' ? 'Seedless Wallet' : 'Seed Phrase Wallet'}
            </Text>
          </View>

          {/* Info Card - Different for seed vs seedless */}
          {walletType === 'seedless' ? (
            // SEEDLESS: ZEC only
            <View style={[styles.infoCard, styles.infoCardSeedless]}>
              <Text style={styles.infoTitleSeedless}>Creating ZEC Wallet</Text>
              <View style={styles.infoRow}>
                <View style={styles.zecBadge}>
                  <Text style={styles.badgeTextDark}>ZEC</Text>
                </View>
                <Text style={styles.infoText}>Zcash with FROST MPC</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.oasisBadge}>
                  <Text style={styles.badgeText}>TEE</Text>
                </View>
                <Text style={styles.infoText}>Oasis TEE secure storage</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.totpBadge}>
                  <Text style={styles.badgeText}>2FA</Text>
                </View>
                <Text style={styles.infoText}>Google Authenticator recovery</Text>
              </View>
            </View>
          ) : (
            // SEED: Unified SOL + ZEC
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Creating Unified Wallet</Text>
              <View style={styles.infoRow}>
                <View style={styles.solBadge}>
                  <Text style={styles.badgeText}>SOL</Text>
                </View>
                <Text style={styles.infoText}>Solana via Arcium MPC</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.zecBadge}>
                  <Text style={styles.badgeTextDark}>ZEC</Text>
                </View>
                <Text style={styles.infoText}>Zcash with shielded txs</Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.continueButton,
              walletType === 'seedless' && styles.continueButtonSeedless
            ]}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Create Wallet</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 20,
  },
  backButton: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#374151',
  },
  walletTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  walletTypeBadgeSeedless: {
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
  },
  walletTypeEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  walletTypeText: {
    color: '#4ECDC4',
    fontSize: 14,
    fontWeight: '600',
  },
  walletTypeTextSeedless: {
    color: '#A855F7',
  },
  infoCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoCardSeedless: {
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  infoTitle: {
    color: '#4ECDC4',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoTitleSeedless: {
    color: '#A855F7',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  solBadge: {
    backgroundColor: '#9945FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 10,
  },
  zecBadge: {
    backgroundColor: '#F4B728',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 10,
  },
  oasisBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 10,
  },
  totpBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  badgeTextDark: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '700',
  },
  infoText: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  continueButton: {
    backgroundColor: '#4ECDC4',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonSeedless: {
    backgroundColor: '#A855F7',
  },
  continueButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default VaultNameInputScreen;