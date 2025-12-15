// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../types/navigation';

// type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// const QuickSummaryScreen = () => {
//   const navigation = useNavigation<NavigationProp>();

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         <Text style={styles.title}>Quick Summary</Text>
//         <Text style={styles.subtitle}>Your vault is secured with MPC technology</Text>

//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>✅ No seed phrases</Text>
//           <Text style={styles.cardText}>Your private keys never exist in one place</Text>
//         </View>

//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>🔒 Multi-device security</Text>
//           <Text style={styles.cardText}>Each device holds one vault share</Text>
//         </View>

//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>🔄 Easy recovery</Text>
//           <Text style={styles.cardText}>Recover with 2 of 3 devices</Text>
//         </View>

//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => navigation.navigate('ChainSelection')}
//         >
//           <Text style={styles.buttonText}>Get Started</Text>
//         </TouchableOpacity>

//         {/* Recover Wallet Section */}
//         <View style={styles.recoverSection}>
//           <Text style={styles.recoverText}>Already have a wallet?</Text>
//           <TouchableOpacity
//             style={styles.recoverButton}
//             onPress={() => navigation.navigate('Recovery')}
//           >
//             <Text style={styles.recoverButtonText}>🔐 Recover Wallet</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
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
//     padding: 24,
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 32,
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#9CA3AF',
//     marginBottom: 40,
//     textAlign: 'center',
//   },
//   card: {
//     backgroundColor: '#1E293B',
//     padding: 20,
//     borderRadius: 16,
//     marginBottom: 16,
//   },
//   cardTitle: {
//     fontSize: 18,
//     color: '#4ECDC4',
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   cardText: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     lineHeight: 20,
//   },
//   button: {
//     backgroundColor: '#4ECDC4',
//     padding: 18,
//     borderRadius: 12,
//     marginTop: 24,
//   },
//   buttonText: {
//     color: '#000000',
//     fontSize: 18,
//     fontWeight: '700',
//     textAlign: 'center',
//   },
//   recoverSection: {
//     alignItems: 'center',
//     marginTop: 32,
//     paddingTop: 24,
//     borderTopWidth: 1,
//     borderTopColor: '#1E293B',
//   },
//   recoverText: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginBottom: 12,
//   },
//   recoverButton: {
//     backgroundColor: '#1E293B',
//     paddingHorizontal: 24,
//     paddingVertical: 14,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#374151',
//   },
//   recoverButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default QuickSummaryScreen;


import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const QuickSummaryScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

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

        {/* Go to ChainSelection (handles seed vs seedless choice) */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ChainSelection' as any)}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        {/* Recover Wallet Section */}
        <View style={styles.recoverSection}>
          <Text style={styles.recoverText}>Already have a wallet?</Text>
          <TouchableOpacity
            style={styles.recoverButton}
            onPress={() => setShowRecoveryModal(true)}
          >
            <Text style={styles.recoverButtonText}>🔐 Recover Wallet</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* RECOVERY TYPE MODAL */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Modal
        visible={showRecoveryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRecoveryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How do you want to recover?</Text>
            <Text style={styles.modalSubtitle}>
              Choose based on how you created your wallet
            </Text>

            {/* Seed Phrase Recovery */}
            <TouchableOpacity
              style={styles.recoveryOption}
              onPress={() => {
                setShowRecoveryModal(false);
                navigation.navigate('Recovery');
              }}
            >
              <Text style={styles.optionEmoji}>📝</Text>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Seed Phrase</Text>
                <Text style={styles.optionDesc}>I have a 12-word recovery phrase</Text>
              </View>
              <Text style={styles.optionArrow}>→</Text>
            </TouchableOpacity>

            {/* Seedless Recovery */}
            <TouchableOpacity
              style={[styles.recoveryOption, styles.seedlessOption]}
              onPress={() => {
                setShowRecoveryModal(false);
                navigation.navigate('RecoverSeedlessVault');
              }}
            >
              <Text style={styles.optionEmoji}>🔐</Text>
              <View style={styles.optionInfo}>
                <View style={styles.optionTitleRow}>
                  <Text style={styles.optionTitle}>Seedless (Google Auth)</Text>
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                </View>
                <Text style={styles.optionDesc}>I have backup file + Google Authenticator</Text>
              </View>
              <Text style={styles.optionArrow}>→</Text>
            </TouchableOpacity>

            {/* Backup File Recovery */}
            <TouchableOpacity
              style={styles.recoveryOption}
              onPress={() => {
                setShowRecoveryModal(false);
                navigation.navigate('Backup');
              }}
            >
              <Text style={styles.optionEmoji}>📁</Text>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Backup File</Text>
                <Text style={styles.optionDesc}>I have a PawPad backup JSON file</Text>
              </View>
              <Text style={styles.optionArrow}>→</Text>
            </TouchableOpacity>

            {/* Cancel */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowRecoveryModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  // ═══════════════════════════════════════
  // MODAL STYLES
  // ═══════════════════════════════════════
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
  },
  recoveryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  seedlessOption: {
    borderColor: '#A855F7',
    backgroundColor: 'rgba(168, 85, 247, 0.08)',
  },
  optionEmoji: {
    fontSize: 28,
    marginRight: 14,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  optionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  optionDesc: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  optionArrow: {
    color: '#4ECDC4',
    fontSize: 20,
    fontWeight: '600',
  },
  newBadge: {
    backgroundColor: '#A855F7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  cancelButton: {
    marginTop: 8,
    padding: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
});

export default QuickSummaryScreen;