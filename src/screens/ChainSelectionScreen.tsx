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
//   const [selectedChain, setSelectedChain] = useState('');

//   const chains = [
//     {
//       id: 'SOL',
//       name: 'Solana',
//       emoji: '⚡',
//       description: 'Fast & low-cost transactions',
//       mpc: 'Arcium MPC',
//       color: '#9945FF',
//     },
//     {
//       id: 'ZEC',
//       name: 'Zcash',
//       emoji: '🔒',
//       description: 'Privacy-focused transactions',
//       mpc: 'Lit Protocol',
//       color: '#F4B728',
//     },
//   ];

//   const handleContinue = () => {
//     if (selectedChain) {
//       navigation.navigate('EmailInput', { chain: selectedChain });
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Text style={styles.backButton}>← Back</Text>
//         </TouchableOpacity>
//       </View>

//       <Text style={styles.title}>Choose Your Blockchain</Text>
//       <Text style={styles.subtitle}>
//         Select which blockchain you want to create your MPC wallet on
//       </Text>

//       <View style={styles.chainsContainer}>
//         {chains.map((chain) => (
//           <TouchableOpacity
//             key={chain.id}
//             style={[
//               styles.chainCard,
//               selectedChain === chain.id && {
//                 borderColor: chain.color,
//                 borderWidth: 2,
//               },
//             ]}
//             onPress={() => setSelectedChain(chain.id)}
//           >
//             <Text style={styles.chainEmoji}>{chain.emoji}</Text>
//             <Text style={styles.chainName}>{chain.name}</Text>
//             <Text style={styles.chainDescription}>{chain.description}</Text>
//             <View style={styles.mpcBadge}>
//               <Text style={styles.mpcText}>{chain.mpc}</Text>
//             </View>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <TouchableOpacity
//         style={[
//           styles.continueButton,
//           !selectedChain && styles.continueButtonDisabled,
//         ]}
//         onPress={handleContinue}
//         disabled={!selectedChain}
//       >
//         <Text style={styles.continueButtonText}>Continue</Text>
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
//     marginBottom: 40,
//     lineHeight: 24,
//   },
//   chainsContainer: {
//     gap: 16,
//     marginBottom: 40,
//   },
//   chainCard: {
//     backgroundColor: '#1E293B',
//     borderRadius: 16,
//     padding: 24,
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },
//   chainEmoji: {
//     fontSize: 48,
//     marginBottom: 12,
//   },
//   chainName: {
//     fontSize: 24,
//     color: '#FFFFFF',
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   chainDescription: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     marginBottom: 16,
//   },
//   mpcBadge: {
//     backgroundColor: 'rgba(78, 205, 196, 0.1)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 8,
//     alignSelf: 'flex-start',
//   },
//   mpcText: {
//     color: '#4ECDC4',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   continueButton: {
//     backgroundColor: '#4ECDC4',
//     padding: 18,
//     borderRadius: 12,
//     alignItems: 'center',
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
//       navigation.navigate('EmailInput', { chain });
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChainSelection'>;

const ChainSelectionScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedType, setSelectedType] = useState('');

  const walletTypes = [
    {
      id: 'seed',
      name: 'Seed Phrase',
      emoji: '🔑',
      title: 'Traditional Security',
      description: 'Your keys are split across MPC nodes. You get a recovery seed phrase as backup.',
      mpc: 'Arcium MPC',
      color: '#9945FF',
      features: [
        '12-word seed phrase backup',
        'Keys distributed via MPC',
        'Self-custody with seed recovery',
      ],
    },
    {
      id: 'seedless',
      name: 'Seedless',
      emoji: '✨',
      title: 'Modern & Simple',
      description: 'No seed phrase to remember. Recover anytime with just your email.',
      mpc: 'FROST MPC',
      color: '#4ECDC4',
      features: [
        'No seed phrase needed',
        'Email-based recovery',
        'Threshold signatures (2-of-3)',
      ],
    },
  ];

  const handleContinue = () => {
    if (selectedType) {
      // 'seed' maps to Arcium/SOL flow
      // 'seedless' maps to FROST/ZEC flow
      const chain = selectedType === 'seed' ? 'SOL' : 'ZEC';
      navigation.navigate('EmailInput', { chain });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Choose Wallet Type</Text>
      <Text style={styles.subtitle}>
        How do you want to secure your wallet?
      </Text>

      <View style={styles.optionsContainer}>
        {walletTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.optionCard,
              selectedType === type.id && {
                borderColor: type.color,
                borderWidth: 2,
              },
            ]}
            onPress={() => setSelectedType(type.id)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.optionEmoji}>{type.emoji}</Text>
              <View style={styles.mpcBadge}>
                <Text style={styles.mpcText}>{type.mpc}</Text>
              </View>
            </View>
            
            <Text style={styles.optionName}>{type.name}</Text>
            <Text style={styles.optionTitle}>{type.title}</Text>
            <Text style={styles.optionDescription}>{type.description}</Text>
            
            <View style={styles.featuresContainer}>
              {type.features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Text style={styles.featureCheck}>✓</Text>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            {selectedType === type.id && (
              <View style={[styles.selectedIndicator, { backgroundColor: type.color }]}>
                <Text style={styles.selectedText}>Selected</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.comparisonNote}>
        <Text style={styles.noteEmoji}>💡</Text>
        <Text style={styles.noteText}>
          Both options use MPC (Multi-Party Computation) for security. 
          Seedless is easier but requires email access for recovery.
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.continueButton,
          !selectedType && styles.continueButtonDisabled,
          selectedType && { backgroundColor: walletTypes.find(t => t.id === selectedType)?.color },
        ]}
        onPress={handleContinue}
        disabled={!selectedType}
      >
        <Text style={styles.continueButtonText}>
          {selectedType 
            ? `Continue with ${selectedType === 'seed' ? 'Seed Phrase' : 'Seedless'}`
            : 'Select an option'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 20,
    marginBottom: 20,
  },
  backButton: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 24,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 20,
  },
  optionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionEmoji: {
    fontSize: 40,
  },
  mpcBadge: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  mpcText: {
    color: '#4ECDC4',
    fontSize: 11,
    fontWeight: '600',
  },
  optionName: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 4,
  },
  optionTitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 18,
  },
  featuresContainer: {
    gap: 6,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureCheck: {
    color: '#10B981',
    fontSize: 12,
    marginRight: 8,
    fontWeight: '600',
  },
  featureText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  comparisonNote: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  noteEmoji: {
    fontSize: 16,
    marginRight: 10,
  },
  noteText: {
    flex: 1,
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 18,
  },
  continueButton: {
    backgroundColor: '#374151',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButtonDisabled: {
    backgroundColor: '#374151',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChainSelectionScreen;