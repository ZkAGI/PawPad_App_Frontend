// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// const QuickSummaryScreen = () => {
//   const [accepted, setAccepted] = useState(false);
//   const navigation = useNavigation();

//   const summaryPoints = [
//     {
//       icon: '☁️',
//       title: 'Back-up each vault separately',
//       description: 'Keep your shares safe across devices',
//     },
//     {
//       icon: '📍',
//       title: 'Keep vault shares in different locations',
//       description: 'Distribute shares for maximum security',
//     },
//     {
//       icon: '🔐',
//       title: 'All vault shares ensure secure access to your funds',
//       description: 'Need threshold of shares to recover',
//     },
//     {
//       icon: '⚠️',
//       title: 'Do not store your vault share on the device itself for an extended time, in case of loss or damage',
//       warning: true,
//     },
//   ];

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <Text style={styles.header}>Vault Shares</Text>
//         <Text style={styles.title}>Quick summary</Text>

//         <View style={styles.pointsContainer}>
//           {summaryPoints.map((point, index) => (
//             <View
//               key={index}
//               style={[
//                 styles.point,
//                 point.warning && styles.warningPoint,
//               ]}
//             >
//               <Text style={styles.icon}>{point.icon}</Text>
//               <View style={styles.pointContent}>
//                 <Text style={styles.pointTitle}>{point.title}</Text>
//                 {point.description && (
//                   <Text style={styles.pointDescription}>
//                     {point.description}
//                   </Text>
//                 )}
//               </View>
//             </View>
//           ))}
//         </View>

//         <TouchableOpacity
//           style={styles.checkbox}
//           onPress={() => setAccepted(!accepted)}
//         >
//           <View style={[styles.checkboxCircle, accepted && styles.checked]}>
//             {accepted && <Text style={styles.checkmark}>✓</Text>}
//           </View>
//           <Text style={styles.checkboxText}>
//             I have read and understand what to do
//           </Text>
//         </TouchableOpacity>
//       </ScrollView>

//       <TouchableOpacity
//         style={[styles.button, !accepted && styles.buttonDisabled]}
//         disabled={!accepted}
//         onPress={() => navigation.navigate('VaultSetup')}
//       >
//         <Text style={styles.buttonText}>Start using your Vault</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0A1628',
//     paddingHorizontal: 24,
//     paddingTop: 60,
//     paddingBottom: 40,
//   },
//   header: {
//     color: '#6B7280',
//     fontSize: 14,
//     marginBottom: 8,
//   },
//   title: {
//     color: '#FFFFFF',
//     fontSize: 32,
//     fontWeight: '600',
//     marginBottom: 32,
//   },
//   pointsContainer: {
//     gap: 16,
//     marginBottom: 40,
//   },
//   point: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 16,
//     flexDirection: 'row',
//     gap: 12,
//   },
//   warningPoint: {
//     backgroundColor: 'rgba(234, 179, 8, 0.1)',
//     borderWidth: 1,
//     borderColor: '#EAB308',
//   },
//   icon: {
//     fontSize: 24,
//   },
//   pointContent: {
//     flex: 1,
//   },
//   pointTitle: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '500',
//     marginBottom: 4,
//   },
//   pointDescription: {
//     color: '#9CA3AF',
//     fontSize: 12,
//   },
//   checkbox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     marginBottom: 20,
//   },
//   checkboxCircle: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#4F7FFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   checked: {
//     backgroundColor: '#4F7FFF',
//   },
//   checkmark: {
//     color: '#FFFFFF',
//     fontSize: 16,
//   },
//   checkboxText: {
//     color: '#9CA3AF',
//     fontSize: 14,
//   },
//   button: {
//     backgroundColor: '#4F7FFF',
//     borderRadius: 12,
//     paddingVertical: 18,
//     alignItems: 'center',
//   },
//   buttonDisabled: {
//     backgroundColor: '#374151',
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default QuickSummaryScreen;

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const QuickSummaryScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Quick Summary</Text>
        <Text style={styles.subtitle}>Your vault is secured with MPC technology</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>✅ No seed phrases</Text>
          <Text style={styles.cardText}>Your private keys never exist in one place</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔒 Multi-device security</Text>
          <Text style={styles.cardText}>Each device holds one vault share</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔄 Easy recovery</Text>
          <Text style={styles.cardText}>Recover with 2 of 3 devices</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ChainSelection')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        {/* Recover Wallet Section */}
        <View style={styles.recoverSection}>
          <Text style={styles.recoverText}>Already have a wallet?</Text>
          <TouchableOpacity
            style={styles.recoverButton}
            onPress={() => navigation.navigate('Recovery')}
          >
            <Text style={styles.recoverButtonText}>🔐 Recover Wallet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 40,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    color: '#4ECDC4',
    fontWeight: '600',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#4ECDC4',
    padding: 18,
    borderRadius: 12,
    marginTop: 24,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  recoverSection: {
    alignItems: 'center',
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  recoverText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  recoverButton: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  recoverButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuickSummaryScreen;