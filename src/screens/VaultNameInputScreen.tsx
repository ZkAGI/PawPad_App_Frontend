// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   TextInput,
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
//   const { chain, email } = route.params;
  
//   const defaultName = `${chain} Wallet - ${email.split('@')[0]}`;
//   const [vaultName, setVaultName] = useState(defaultName);

//   const handleContinue = () => {
//     if (vaultName.trim()) {
//       navigation.navigate('CreatingVault', { chain, email, vaultName: vaultName.trim() });
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.content}
//       >
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Text style={styles.backButton}>← Back</Text>
//           </TouchableOpacity>
//         </View>

//         <Text style={styles.title}>Name Your Vault</Text>
//         <Text style={styles.subtitle}>
//           Give your wallet a memorable name (you can change this later)
//         </Text>

//         <View style={styles.inputContainer}>
//           <Text style={styles.inputLabel}>Vault Name</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="My Crypto Wallet"
//             placeholderTextColor="#6B7280"
//             value={vaultName}
//             onChangeText={setVaultName}
//             autoCapitalize="words"
//             maxLength={50}
//           />
//           <Text style={styles.inputHint}>
//             Chain: <Text style={styles.chainText}>{chain}</Text> • Email: {email}
//           </Text>
//         </View>

//         <View style={styles.examplesCard}>
//           <Text style={styles.examplesTitle}>💡 Examples:</Text>
//           <TouchableOpacity onPress={() => setVaultName('My Savings Vault')}>
//             <Text style={styles.exampleText}>• My Savings Vault</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => setVaultName(`${chain} Trading Wallet`)}>
//             <Text style={styles.exampleText}>• {chain} Trading Wallet</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => setVaultName('Cold Storage')}>
//             <Text style={styles.exampleText}>• Cold Storage</Text>
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity
//           style={[
//             styles.continueButton,
//             !vaultName.trim() && styles.continueButtonDisabled,
//           ]}
//           onPress={handleContinue}
//           disabled={!vaultName.trim()}
//         >
//           <Text style={styles.continueButtonText}>Create Vault</Text>
//         </TouchableOpacity>
//       </KeyboardAvoidingView>
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
//     paddingTop: 20,
//     marginBottom: 20,
//   },
//   backButton: {
//     color: '#FFFFFF',
//     fontSize: 16,
//   },
//   title: {
//     fontSize: 28,
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#9CA3AF',
//     marginBottom: 40,
//     lineHeight: 24,
//   },
//   inputContainer: {
//     marginBottom: 24,
//   },
//   inputLabel: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     marginBottom: 8,
//   },
//   input: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 16,
//     fontSize: 16,
//     color: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#374151',
//   },
//   inputHint: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 8,
//   },
//   chainText: {
//     color: '#4ECDC4',
//     fontWeight: '600',
//   },
//   examplesCard: {
//     backgroundColor: 'rgba(78, 205, 196, 0.1)',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 40,
//   },
//   examplesTitle: {
//     fontSize: 14,
//     color: '#4ECDC4',
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   exampleText: {
//     fontSize: 13,
//     color: '#9CA3AF',
//     marginBottom: 8,
//   },
//   continueButton: {
//     backgroundColor: '#4ECDC4',
//     padding: 18,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginTop: 'auto',
//     marginBottom: 20,
//   },
//   continueButtonDisabled: {
//     backgroundColor: '#374151',
//   },
//   continueButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
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
  
  // Get params with defaults
  const chain = route.params?.chain || 'SOL';
  const email = route.params?.email;
  
  const [vaultName, setVaultName] = useState('');

  const handleContinue = () => {
    const finalName = vaultName.trim() || `My ${chain} Wallet`;
    
    // Navigate with optional email
    navigation.navigate('CreatingVault', {
      chain,
      email,  // Can be undefined, that's ok now
      vaultName: finalName,
    });
  };

  const isValid = true; // Allow empty (will use default name)

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
              placeholder={`My ${chain} Wallet`}
              placeholderTextColor="#6B7280"
              value={vaultName}
              onChangeText={setVaultName}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleContinue}
              maxLength={30}
            />
          </View>

          {/* Info Card */}
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

          <TouchableOpacity
            style={[styles.continueButton, !isValid && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={!isValid}
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
  infoCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    color: '#4ECDC4',
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
  buttonDisabled: {
    backgroundColor: '#374151',
  },
  continueButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default VaultNameInputScreen;