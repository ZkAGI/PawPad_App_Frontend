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

// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'EmailInput'>;
// type RoutePropType = RouteProp<RootStackParamList, 'EmailInput'>;

// const EmailInputScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<RoutePropType>();
//   const { chain } = route.params;
//   const [email, setEmail] = useState('');

//   const isValidEmail = (email: string) => {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   };

//   const handleContinue = () => {
//   if (isValidEmail(email)) {
//     navigation.navigate('VaultNameInput', { chain, email }); 
//   }
// };

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

//         <Text style={styles.title}>Enter Your Email</Text>
//         <Text style={styles.subtitle}>
//           We'll use this to identify your vault and help with recovery
//         </Text>

//         <View style={styles.inputContainer}>
//           <Text style={styles.inputLabel}>Email Address</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="your.email@example.com"
//             placeholderTextColor="#6B7280"
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//             autoCapitalize="none"
//             autoComplete="email"
//           />
//           <Text style={styles.inputHint}>
//             Selected chain: <Text style={styles.chainText}>{chain}</Text>
//           </Text>
//         </View>

//         <View style={styles.infoCard}>
//           <Text style={styles.infoTitle}>🔒 Privacy Notice</Text>
//           <Text style={styles.infoText}>
//             Your email is only used for vault identification. Your private keys
//             are secured by MPC and never stored with your email.
//           </Text>
//         </View>

//         <TouchableOpacity
//           style={[
//             styles.continueButton,
//             !isValidEmail(email) && styles.continueButtonDisabled,
//           ]}
//           onPress={handleContinue}
//           disabled={!isValidEmail(email)}
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
//   infoCard: {
//     backgroundColor: 'rgba(78, 205, 196, 0.1)',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 40,
//   },
//   infoTitle: {
//     fontSize: 14,
//     color: '#4ECDC4',
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   infoText: {
//     fontSize: 13,
//     color: '#9CA3AF',
//     lineHeight: 20,
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

// export default EmailInputScreen;

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

// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'EmailInput'>;
// type RoutePropType = RouteProp<RootStackParamList, 'EmailInput'>;

// const EmailInputScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<RoutePropType>();
  
//   const chain = route.params?.chain || 'SOL';
//   const walletType = route.params?.walletType || 'seed';
  
//   const [email, setEmail] = useState('');

//   const isValidEmail = (email: string) => {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   };

//   const handleContinue = () => {
//     if (isValidEmail(email)) {
//       navigation.navigate('VaultNameInput', { 
//         chain, 
//         email,
//         walletType
//       }); 
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

//         <Text style={styles.title}>Enter Your Email</Text>
//         <Text style={styles.subtitle}>
//           We'll use this to identify your vault and help with recovery
//         </Text>

//         <View style={styles.inputContainer}>
//           <Text style={styles.inputLabel}>Email Address</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="your.email@example.com"
//             placeholderTextColor="#6B7280"
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//             autoCapitalize="none"
//             autoComplete="email"
//           />
//           <Text style={styles.inputHint}>
//             Creating:{' '}
//             <Text style={styles.chainText}>
//               {walletType === 'seedless' ? '🔐 Seedless ZEC Wallet' : `📝 ${chain} Wallet with Seed Phrase`}
//             </Text>
//           </Text>
//         </View>

//         <View style={[
//           styles.infoCard,
//           walletType === 'seedless' && styles.infoCardSeedless
//         ]}>
//           <Text style={styles.infoTitle}>
//             {walletType === 'seedless' ? '✨ Seedless Security' : '🔒 Privacy Notice'}
//           </Text>
//           <Text style={styles.infoText}>
//             {walletType === 'seedless' 
//               ? 'Your wallet is secured by FROST MPC + Oasis TEE. No seed phrase needed - use Google Authenticator + backup file for recovery.'
//               : 'Your email is only used for vault identification. Your private keys are secured by MPC and never stored with your email.'
//             }
//           </Text>
//         </View>

//         <TouchableOpacity
//           style={[
//             styles.continueButton,
//             !isValidEmail(email) && styles.continueButtonDisabled,
//             walletType === 'seedless' && styles.continueButtonSeedless,
//           ]}
//           onPress={handleContinue}
//           disabled={!isValidEmail(email)}
//         >
//           <Text style={styles.continueButtonText}>Continue</Text>
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
//   infoCard: {
//     backgroundColor: 'rgba(78, 205, 196, 0.1)',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 40,
//   },
//   infoCardSeedless: {
//     backgroundColor: 'rgba(168, 85, 247, 0.1)',
//     borderWidth: 1,
//     borderColor: 'rgba(168, 85, 247, 0.3)',
//   },
//   infoTitle: {
//     fontSize: 14,
//     color: '#4ECDC4',
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   infoText: {
//     fontSize: 13,
//     color: '#9CA3AF',
//     lineHeight: 20,
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
//   continueButtonSeedless: {
//     backgroundColor: '#A855F7',
//   },
//   continueButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default EmailInputScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'EmailInput'>;
type RoutePropType = RouteProp<RootStackParamList, 'EmailInput'>;

const EmailInputScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();

  const chain = route.params?.chain || 'SOL';
  const walletType = route.params?.walletType || 'seed';

  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isSeedless = walletType === 'seedless';

  const handleContinue = () => {
    if (isValidEmail(email)) {
      navigation.navigate('VaultNameInput', {
        chain,
        email,
        walletType,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>{'<'} Back</Text>
          </TouchableOpacity>

          {/* Label */}
          <View style={styles.labelContainer}>
            <Text style={styles.label}>
              {isSeedless ? 'Seedless Setup' : 'Wallet Setup'}
            </Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Enter your email</Text>
          <Text style={styles.subtitle}>
            We'll use this to identify your wallet and help with recovery
          </Text>

          {/* Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View
              style={[
                styles.inputContainer,
                isFocused && styles.inputContainerFocused,
                email && isValidEmail(email) && styles.inputContainerValid,
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="your.email@example.com"
                placeholderTextColor="#4B5563"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              {email && isValidEmail(email) && (
                <Text style={styles.validIcon}>✓</Text>
              )}
            </View>

            {/* Creating hint */}
            <View style={styles.creatingHint}>
              <Text style={styles.creatingLabel}>Creating:</Text>
              <View
                style={[
                  styles.walletTypeBadge,
                  isSeedless && styles.walletTypeBadgeSeedless,
                ]}
              >
                <Text
                  style={[
                    styles.walletTypeBadgeText,
                    isSeedless && styles.walletTypeBadgeTextSeedless,
                  ]}
                >
                  {isSeedless ? '✨ Seedless Wallet' : '🔑 Seed Phrase Wallet'}
                </Text>
              </View>
            </View>
          </View>

          {/* Info Card */}
          <View
            style={[styles.infoCard, isSeedless && styles.infoCardSeedless]}
          >
            <View style={styles.infoHeader}>
              <Text style={styles.infoIcon}>{isSeedless ? '✨' : '🔒'}</Text>
              <Text
                style={[
                  styles.infoTitle,
                  isSeedless && styles.infoTitleSeedless,
                ]}
              >
                {isSeedless ? 'Seedless Security' : 'Privacy Notice'}
              </Text>
            </View>
            <Text style={styles.infoText}>
              {isSeedless
                ? 'Your wallet is secured by FROST threshold signatures. Recover anytime with your backup file + Google Authenticator.'
                : 'Your email is only used for wallet identification. Your 12-word seed phrase is your backup - never share it.'}
            </Text>
          </View>
        </ScrollView>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !isValidEmail(email) && styles.continueButtonDisabled,
              isValidEmail(email) && isSeedless && styles.continueButtonSeedless,
            ]}
            onPress={handleContinue}
            disabled={!isValidEmail(email)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.continueButtonText,
                !isValidEmail(email) && styles.continueButtonTextDisabled,
              ]}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1426',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    marginBottom: 24,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  labelContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(78, 205, 196, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: '#4ECDC4',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#9CA3AF',
    marginBottom: 32,
    lineHeight: 22,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 10,
    fontWeight: '500',
  },
  inputContainer: {
    backgroundColor: '#0F1C2E',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#1E3A5F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  inputContainerFocused: {
    borderColor: '#4ECDC4',
  },
  inputContainerValid: {
    borderColor: '#10B981',
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
  },
  validIcon: {
    color: '#10B981',
    fontSize: 18,
    fontWeight: '700',
  },
  creatingHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  creatingLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  walletTypeBadge: {
    backgroundColor: 'rgba(153, 69, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  walletTypeBadgeSeedless: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
  },
  walletTypeBadgeText: {
    color: '#9945FF',
    fontSize: 12,
    fontWeight: '600',
  },
  walletTypeBadgeTextSeedless: {
    color: '#4ECDC4',
  },
  infoCard: {
    backgroundColor: '#0F1C2E',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  infoCardSeedless: {
    borderColor: 'rgba(78, 205, 196, 0.3)',
    backgroundColor: 'rgba(78, 205, 196, 0.05)',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  infoIcon: {
    fontSize: 16,
  },
  infoTitle: {
    fontSize: 15,
    color: '#9945FF',
    fontWeight: '600',
  },
  infoTitleSeedless: {
    color: '#4ECDC4',
  },
  infoText: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 12,
  },
  continueButton: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
  },
  continueButtonSeedless: {
    backgroundColor: '#4ECDC4',
  },
  continueButtonText: {
    color: '#0B1426',
    fontSize: 17,
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: 'rgba(78, 205, 196, 0.5)',
  },
});

export default EmailInputScreen;