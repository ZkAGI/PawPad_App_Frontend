
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Dimensions,
//   SafeAreaView,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// // import VaultShareAnimation from '../components/VaultShareAnimation';

// const { width } = Dimensions.get('window');

// // Helper component for text with highlighted words
// const HighlightedText = ({
//   text,
//   highlights,
//   style,
// }: {
//   text: string;
//   highlights: string[];
//   style?: any;
// }) => {
//   let parts = [{ text, highlight: false }];

//   highlights.forEach((highlight) => {
//     const newParts: { text: string; highlight: boolean }[] = [];
//     parts.forEach((part) => {
//       if (part.highlight) {
//         newParts.push(part);
//       } else {
//         const splitParts = part.text.split(new RegExp(`(${highlight})`, 'gi'));
//         splitParts.forEach((splitPart) => {
//           if (splitPart.toLowerCase() === highlight.toLowerCase()) {
//             newParts.push({ text: splitPart, highlight: true });
//           } else if (splitPart) {
//             newParts.push({ text: splitPart, highlight: false });
//           }
//         });
//       }
//     });
//     parts = newParts;
//   });

//   return (
//     <Text style={style}>
//       {parts.map((part, index) => (
//         <Text
//           key={index}
//           style={part.highlight ? styles.highlightedText : styles.normalText}
//         >
//           {part.text}
//         </Text>
//       ))}
//     </Text>
//   );
// };

// const MXEExplanationScreen = () => {
//   const [step, setStep] = useState(0);
//   const navigation = useNavigation();

//   const steps = [
//     {
//       title: 'Say hello to vault shares,\nyour new recovery method',
//       highlights: ['vault shares,'],
//       animation: 'vault-shares-intro',
//     },
//     {
//       title: "They're split into different\nparts for increased\nsecurity, removing single-\npoint of failure",
//       highlights: ['different', 'parts for increased', 'security,'],
//       animation: 'vault-shares-split',
//     },
//     {
//       title: 'Each device in your vault\nholds one vault share',
//       highlights: ['Each device', 'one vault share'],
//       animation: 'device-shares',
//     },
//     {
//       title: 'Always back up your vault\nshares individually, each in\na different location',
//       highlights: ['Always back up', 'different location'],
//       animation: 'backup',
//     },
//     {
//       title: 'These shares collaborate\nto unlock your vault.',
//       highlights: ['unlock', 'your vault.'],
//       animation: 'unlock',
//     },
//   ];

//   const currentStep = steps[step];

//   const handleNext = () => {
//     if (step < steps.length - 1) {
//       setStep(step + 1);
//     } else {
//       // @ts-ignore
//       navigation.navigate('QuickSummary');
//     }
//   };

//   const handleBack = () => {
//     if (step > 0) {
//       setStep(step - 1);
//     } else {
//       navigation.goBack();
//     }
//   };

//   const handleSkip = () => {
//     // @ts-ignore
//     navigation.navigate('QuickSummary');
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={handleBack} style={styles.backButton}>
//           <Text style={styles.backButtonText}>{'<'}</Text>
//           <Text style={styles.backButtonLabel}>Back</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={handleSkip}>
//           <Text style={styles.skipButton}>Skip</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Progress bar */}
//       <View style={styles.progressContainer}>
//         {steps.map((_, index) => (
//           <View
//             key={index}
//             style={[
//               styles.progressBar,
//               {
//                 backgroundColor: index <= step ? '#4ECDC4' : '#1E3A5F',
//               },
//             ]}
//           />
//         ))}
//       </View>

//       {/* Animation Container */}
//       <View style={styles.animationContainer}>
//         {/* Placeholder for animation - replace with your VaultShareAnimation component */}
//         {/* <VaultShareAnimation type={currentStep.animation} /> */}
//         <View style={styles.animationPlaceholder}>
//           {/* Animation will go here */}
//         </View>
//       </View>

//       {/* Content */}
//       <View style={styles.contentContainer}>
//         <HighlightedText
//           text={currentStep.title}
//           highlights={currentStep.highlights}
//           style={styles.title}
//         />
//       </View>

//       {/* Next button */}
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
//           <View style={styles.arrowContainer}>
//             <Text style={styles.arrowText}>→</Text>
//           </View>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// // Font family constant - replace with your loaded font
// const FONT_FAMILY = 'TTFirsNeue'; // or 'TT Firs Neue', 'Inter', 'System'
// const FONT_FAMILY_MEDIUM = 'TTFirsNeue-Medium'; // or use fontWeight

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0B1426',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     paddingTop: 56,
//     paddingBottom: 16,
//   },
//   backButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   backButtonText: {
//     color: '#FFFFFF',
//     fontSize: 20,
//     fontFamily: FONT_FAMILY,
//     fontWeight: '300',
//   },
//   backButtonLabel: {
//     color: '#FFFFFF',
//     fontSize: 17,
//     fontFamily: FONT_FAMILY_MEDIUM,
//   },
//   skipButton: {
//     color: '#6B7280',
//     fontSize: 17,
//     fontFamily: FONT_FAMILY_MEDIUM,
//   },
//   progressContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 24,
//     gap: 10,
//     marginTop: 4,
//   },
//   progressBar: {
//     flex: 1,
//     height: 3,
//     borderRadius: 1.5,
//   },
//   animationContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 40,
//   },
//   animationPlaceholder: {
//     width: width * 0.7,
//     height: width * 0.7,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   contentContainer: {
//     paddingHorizontal: 28,
//     paddingBottom: 20,
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 24,
//     lineHeight: 36,
//     textAlign: 'center',
//     fontFamily: FONT_FAMILY,
//   },
//   normalText: {
//     color: '#FFFFFF',
//     fontFamily: FONT_FAMILY,
//     fontWeight: '400',
//   },
//   highlightedText: {
//     color: '#4ECDC4',
//     fontFamily: FONT_FAMILY,
//     fontWeight: '400',
//   },
//   buttonContainer: {
//     alignItems: 'center',
//     paddingBottom: 60,
//   },
//   nextButton: {
//     backgroundColor: '#4ECDC4',
//     width: 72,
//     height: 44,
//     borderRadius: 22,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#4ECDC4',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   arrowContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   arrowText: {
//     color: '#0B1426',
//     fontSize: 26,
//     fontWeight: '600',
//   },
// });

// export default MXEExplanationScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ═══════════════════════════════════════════════════════════════
// COLORS
// ═══════════════════════════════════════════════════════════════
const COLORS = {
  bgPrimary: '#0B1426',
  accent: '#4ECDC4',
  textPrimary: '#FFFFFF',
  textMuted: '#6B7280',
  progressInactive: '#1E3A5F',
};

// ═══════════════════════════════════════════════════════════════
// STEP IMAGES
// ═══════════════════════════════════════════════════════════════
const stepImages: { [key: number]: any } = {
  0: require('../assets/images/mxe/1.png'),
  1: require('../assets/images/mxe/2.png'),
  2: require('../assets/images/mxe/3.png'),
  3: require('../assets/images/mxe/4.png'),
  4: require('../assets/images/mxe/5.png'),
};

// ═══════════════════════════════════════════════════════════════
// HIGHLIGHTED TEXT COMPONENT
// ═══════════════════════════════════════════════════════════════
interface HighlightedTextProps {
  text: string;
  highlights: string[];
  style?: any;
}

const HighlightedText = ({ text, highlights, style }: HighlightedTextProps) => {
  let parts: { text: string; highlight: boolean }[] = [{ text, highlight: false }];

  highlights.forEach((highlight) => {
    const newParts: { text: string; highlight: boolean }[] = [];
    parts.forEach((part) => {
      if (part.highlight) {
        newParts.push(part);
      } else {
        const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const splitParts = part.text.split(regex);
        splitParts.forEach((splitPart) => {
          if (splitPart.toLowerCase() === highlight.toLowerCase()) {
            newParts.push({ text: splitPart, highlight: true });
          } else if (splitPart) {
            newParts.push({ text: splitPart, highlight: false });
          }
        });
      }
    });
    parts = newParts;
  });

  return (
    <Text style={style}>
      {parts.map((part, index) => (
        <Text
          key={index}
          style={part.highlight ? styles.highlightedText : styles.normalText}
        >
          {part.text}
        </Text>
      ))}
    </Text>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
const MXEExplanationScreen = () => {
  const [step, setStep] = useState(0);
  const navigation = useNavigation<NavigationProp>();

  const steps = [
    {
      title: 'Say hello to vault shares,\nyour new recovery method',
      highlights: ['vault shares,'],
    },
    {
      title: "They're split into different\nparts for increased\nsecurity, removing single-\npoint of failure",
      highlights: ['different', 'parts for increased', 'security,'],
    },
    {
      title: 'Each device in your vault\nholds one vault share',
      highlights: ['Each device', 'one vault share'],
    },
    {
      title: 'Always back up your vault\nshares individually, each in\na different location',
      highlights: ['Always back up', 'different location'],
    },
    {
      title: 'These shares collaborate\nto unlock your vault.',
      highlights: ['collaborate', 'unlock your vault.'],
    },
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      navigation.navigate('QuickSummary' as never);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleSkip = () => {
    navigation.navigate('QuickSummary' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'}</Text>
          <Text style={styles.backButtonLabel}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipButton}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        {steps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressBar,
              {
                backgroundColor: index <= step ? COLORS.accent : COLORS.progressInactive,
              },
            ]}
          />
        ))}
      </View>

      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={stepImages[step]}
          style={styles.stepImage}
          resizeMode="contain"
        />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <HighlightedText
          text={currentStep.title}
          highlights={currentStep.highlights}
          style={styles.title}
        />
      </View>

      {/* Next button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.arrowText}>→</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backButtonText: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '300',
  },
  backButtonLabel: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '500',
  },
  skipButton: {
    color: COLORS.textMuted,
    fontSize: 17,
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 10,
    marginTop: 4,
  },
  progressBar: {
    flex: 1,
    height: 3,
    borderRadius: 1.5,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  stepImage: {
    width: width * 0.85,
    height: width * 0.85,
  },
  contentContainer: {
    paddingHorizontal: 28,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    lineHeight: 36,
    textAlign: 'center',
  },
  normalText: {
    color: COLORS.textPrimary,
    fontWeight: '400',
  },
  highlightedText: {
    color: COLORS.accent,
    fontWeight: '400',
  },
  buttonContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: COLORS.accent,
    width: 72,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  arrowText: {
    color: COLORS.bgPrimary,
    fontSize: 26,
    fontWeight: '600',
  },
});

export default MXEExplanationScreen;
