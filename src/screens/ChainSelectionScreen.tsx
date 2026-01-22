// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../types/navigation';

// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChainSelection'>;

// const ChainSelectionScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const [selectedType, setSelectedType] = useState('');

//   const walletTypes = [
//     {
//       id: 'seed',
//       name: 'Seed Phrase',
//       emoji: '🔑',
//       title: 'Traditional Security',
//       description: 'Your keys are split across MPC nodes. You get a recovery seed phrase as backup.',
//       mpc: 'Arcium MPC',
//       color: '#9945FF',
//       features: [
//         '12-word seed phrase backup',
//         'Keys distributed via MPC',
//         'Self-custody with seed recovery',
//       ],
//     },
//     {
//       id: 'seedless',
//       name: 'Seedless',
//       emoji: '✨',
//       title: 'Modern & Simple',
//       description: 'No seed phrase to remember. Recover anytime with just your email.',
//       mpc: 'FROST MPC',
//       color: '#4ECDC4',
//       features: [
//         'No seed phrase needed',
//         'Email-based recovery',
//         'Threshold signatures (2-of-3)',
//       ],
//     },
//   ];

//   const handleContinue = () => {
//     if (selectedType) {
//       // 'seed' maps to Arcium/SOL flow
//       // 'seedless' maps to FROST/ZEC flow
//       const chain = selectedType === 'seed' ? 'SOL' : 'ZEC';
//       navigation.navigate('EmailInput', { chain ,walletType: selectedType as 'seed' | 'seedless'});
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Text style={styles.backButton}>← Back</Text>
//         </TouchableOpacity>
//       </View>

//       <Text style={styles.title}>Choose Wallet Type</Text>
//       <Text style={styles.subtitle}>
//         How do you want to secure your wallet?
//       </Text>

//       <View style={styles.optionsContainer}>
//         {walletTypes.map((type) => (
//           <TouchableOpacity
//             key={type.id}
//             style={[
//               styles.optionCard,
//               selectedType === type.id && {
//                 borderColor: type.color,
//                 borderWidth: 2,
//               },
//             ]}
//             onPress={() => setSelectedType(type.id)}
//           >
//             <View style={styles.cardHeader}>
//               <Text style={styles.optionEmoji}>{type.emoji}</Text>
//               <View style={styles.mpcBadge}>
//                 <Text style={styles.mpcText}>{type.mpc}</Text>
//               </View>
//             </View>
            
//             <Text style={styles.optionName}>{type.name}</Text>
//             <Text style={styles.optionTitle}>{type.title}</Text>
//             <Text style={styles.optionDescription}>{type.description}</Text>
            
//             <View style={styles.featuresContainer}>
//               {type.features.map((feature, index) => (
//                 <View key={index} style={styles.featureRow}>
//                   <Text style={styles.featureCheck}>✓</Text>
//                   <Text style={styles.featureText}>{feature}</Text>
//                 </View>
//               ))}
//             </View>

//             {selectedType === type.id && (
//               <View style={[styles.selectedIndicator, { backgroundColor: type.color }]}>
//                 <Text style={styles.selectedText}>Selected</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         ))}
//       </View>

//       <View style={styles.comparisonNote}>
//         <Text style={styles.noteEmoji}>💡</Text>
//         <Text style={styles.noteText}>
//           Both options use MPC (Multi-Party Computation) for security. 
//           Seedless is easier but requires email access for recovery.
//         </Text>
//       </View>

//       <TouchableOpacity
//         style={[
//           styles.continueButton,
//           !selectedType && styles.continueButtonDisabled,
//           selectedType && { backgroundColor: walletTypes.find(t => t.id === selectedType)?.color },
//         ]}
//         onPress={handleContinue}
//         disabled={!selectedType}
//       >
//         <Text style={styles.continueButtonText}>
//           {selectedType 
//             ? `Continue with ${selectedType === 'seed' ? 'Seed Phrase' : 'Seedless'}`
//             : 'Select an option'}
//         </Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0A1628',
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
//     marginBottom: 24,
//     lineHeight: 24,
//   },
//   optionsContainer: {
//     gap: 16,
//     marginBottom: 20,
//   },
//   optionCard: {
//     backgroundColor: '#1E293B',
//     borderRadius: 16,
//     padding: 20,
//     borderWidth: 2,
//     borderColor: 'transparent',
//     position: 'relative',
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   optionEmoji: {
//     fontSize: 40,
//   },
//   mpcBadge: {
//     backgroundColor: 'rgba(78, 205, 196, 0.1)',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   mpcText: {
//     color: '#4ECDC4',
//     fontSize: 11,
//     fontWeight: '600',
//   },
//   optionName: {
//     fontSize: 22,
//     color: '#FFFFFF',
//     fontWeight: '700',
//     marginBottom: 4,
//   },
//   optionTitle: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     marginBottom: 8,
//   },
//   optionDescription: {
//     fontSize: 13,
//     color: '#6B7280',
//     marginBottom: 12,
//     lineHeight: 18,
//   },
//   featuresContainer: {
//     gap: 6,
//   },
//   featureRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   featureCheck: {
//     color: '#10B981',
//     fontSize: 12,
//     marginRight: 8,
//     fontWeight: '600',
//   },
//   featureText: {
//     color: '#9CA3AF',
//     fontSize: 12,
//   },
//   selectedIndicator: {
//     position: 'absolute',
//     top: 12,
//     right: 12,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   selectedText: {
//     color: '#FFFFFF',
//     fontSize: 11,
//     fontWeight: '600',
//   },
//   comparisonNote: {
//     flexDirection: 'row',
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 14,
//     marginBottom: 20,
//     alignItems: 'flex-start',
//   },
//   noteEmoji: {
//     fontSize: 16,
//     marginRight: 10,
//   },
//   noteText: {
//     flex: 1,
//     color: '#9CA3AF',
//     fontSize: 12,
//     lineHeight: 18,
//   },
//   continueButton: {
//     backgroundColor: '#374151',
//     padding: 18,
//     borderRadius: 12,
//     alignItems: 'center',
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

// export default ChainSelectionScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChainSelection'>;

const ChainSelectionScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const walletTypes = [
    {
      id: 'seedless',
      emoji: '✨',
      name: 'Seedless',
      tagline: 'Modern & Recommended',
      badge: 'FROST MPC',
      badgeColor: '#4ECDC4',
      color: '#4ECDC4',
      features: [
        'No seed phrase to write down or lose',
        'Recover using backup file + authenticator',
        'Keys split across device + secure enclave',
      ],
    },
    {
      id: 'seed',
      emoji: '🔑',
      name: 'Seed Phrase',
      tagline: 'Traditional Self-Custody',
      badge: 'Solana',
      badgeColor: '#9945FF',
      color: '#9945FF',
      features: [
        '12-word seed phrase for backup',
        'You control your recovery phrase',
        'Standard BIP39 compatible',
      ],
    },
  ];

  const handleContinue = () => {
    if (selectedType) {
      const chain = selectedType === 'seed' ? 'SOL' : 'ZEC';
      navigation.navigate('EmailInput', {
        chain,
        walletType: selectedType as 'seed' | 'seedless',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
          <Text style={styles.label}>Wallet Setup</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Choose security type</Text>
        <Text style={styles.subtitle}>
          Select how you want to secure and recover your wallet
        </Text>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {walletTypes.map((type) => {
            const isSelected = selectedType === type.id;
            return (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.optionCard,
                  isSelected && {
                    borderColor: type.color,
                  },
                ]}
                onPress={() => setSelectedType(type.id)}
                activeOpacity={0.7}
              >
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.emojiContainer}>
                    <Text style={styles.optionEmoji}>{type.emoji}</Text>
                  </View>
                  <View
                    style={[
                      styles.mpcBadge,
                      { backgroundColor: `${type.badgeColor}15` },
                    ]}
                  >
                    <Text style={[styles.mpcText, { color: type.badgeColor }]}>
                      {type.badge}
                    </Text>
                  </View>
                </View>

                {/* Card Title */}
                <View style={styles.titleRow}>
                  <Text style={styles.optionName}>{type.name}</Text>
                  {type.id === 'seedless' && (
                    <View style={styles.recommendedBadge}>
                      <Text style={styles.recommendedText}>Recommended</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.optionTagline}>{type.tagline}</Text>

                {/* Features */}
                <View style={styles.featuresContainer}>
                  {type.features.map((feature, index) => (
                    <View key={index} style={styles.featureRow}>
                      <View
                        style={[
                          styles.featureIcon,
                          { borderColor: type.color },
                        ]}
                      >
                        <Text style={[styles.featureCheck, { color: type.color }]}>
                          ✓
                        </Text>
                      </View>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>

                {/* Selection Radio */}
                <View style={styles.radioContainer}>
                  <View
                    style={[
                      styles.radioOuter,
                      isSelected && { borderColor: type.color },
                    ]}
                  >
                    {isSelected && (
                      <View
                        style={[styles.radioInner, { backgroundColor: type.color }]}
                      />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Info Note */}
        <View style={styles.infoContainer}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoIconText}>i</Text>
          </View>
          <Text style={styles.infoText}>
            Seedless uses threshold cryptography for enhanced security. Seed phrase gives you full control of your recovery words.
          </Text>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedType && styles.continueButtonDisabled,
            selectedType && {
              backgroundColor: walletTypes.find((t) => t.id === selectedType)?.color,
            },
          ]}
          onPress={handleContinue}
          disabled={!selectedType}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.continueButtonText,
              !selectedType && styles.continueButtonTextDisabled,
            ]}
          >
            {selectedType ? 'Continue' : 'Select an option'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1426',
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
    marginBottom: 24,
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 20,
  },
  optionCard: {
    backgroundColor: '#0F1C2E',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#1E3A5F',
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(30, 58, 95, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionEmoji: {
    fontSize: 28,
  },
  mpcBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  mpcText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  optionName: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  recommendedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  recommendedText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '600',
  },
  optionTagline: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  featuresContainer: {
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: 'transparent',
  },
  featureCheck: {
    fontSize: 11,
    fontWeight: '700',
  },
  featureText: {
    flex: 1,
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 20,
  },
  radioContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#0F1C2E',
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  infoIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIconText: {
    color: '#4ECDC4',
    fontSize: 12,
    fontWeight: '600',
  },
  infoText: {
    flex: 1,
    color: '#9CA3AF',
    fontSize: 13,
    lineHeight: 19,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 12,
  },
  continueButton: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: 'rgba(78, 205, 196, 0.5)',
  },
});

export default ChainSelectionScreen;