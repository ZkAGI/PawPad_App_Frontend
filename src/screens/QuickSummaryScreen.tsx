// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../types/navigation';

// type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// const QuickSummaryScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const [showRecoveryModal, setShowRecoveryModal] = useState(false);

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

//         {/* Go to ChainSelection (handles seed vs seedless choice) */}
//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => navigation.navigate('ChainSelection' as any)}
//         >
//           <Text style={styles.buttonText}>Get Started</Text>
//         </TouchableOpacity>

//         {/* Recover Wallet Section */}
//         <View style={styles.recoverSection}>
//           <Text style={styles.recoverText}>Already have a wallet?</Text>
//           <TouchableOpacity
//             style={styles.recoverButton}
//             onPress={() => setShowRecoveryModal(true)}
//           >
//             <Text style={styles.recoverButtonText}>🔐 Recover Wallet</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* ═══════════════════════════════════════════════════════════════ */}
//       {/* RECOVERY TYPE MODAL */}
//       {/* ═══════════════════════════════════════════════════════════════ */}
//       <Modal
//         visible={showRecoveryModal}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setShowRecoveryModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>How do you want to recover?</Text>
//             <Text style={styles.modalSubtitle}>
//               Choose based on how you created your wallet
//             </Text>

//             {/* Seed Phrase Recovery */}
//             <TouchableOpacity
//               style={styles.recoveryOption}
//               onPress={() => {
//                 setShowRecoveryModal(false);
//                 navigation.navigate('Recovery');
//               }}
//             >
//               <Text style={styles.optionEmoji}>📝</Text>
//               <View style={styles.optionInfo}>
//                 <Text style={styles.optionTitle}>Seed Phrase</Text>
//                 <Text style={styles.optionDesc}>I have a 12-word recovery phrase</Text>
//               </View>
//               <Text style={styles.optionArrow}>→</Text>
//             </TouchableOpacity>

//             {/* Seedless Recovery */}
//             <TouchableOpacity
//               style={[styles.recoveryOption, styles.seedlessOption]}
//               onPress={() => {
//                 setShowRecoveryModal(false);
//                 navigation.navigate('RecoverSeedlessVault');
//               }}
//             >
//               <Text style={styles.optionEmoji}>🔐</Text>
//               <View style={styles.optionInfo}>
//                 <View style={styles.optionTitleRow}>
//                   <Text style={styles.optionTitle}>Seedless (Google Auth)</Text>
//                   <View style={styles.newBadge}>
//                     <Text style={styles.newBadgeText}>NEW</Text>
//                   </View>
//                 </View>
//                 <Text style={styles.optionDesc}>I have backup file + Google Authenticator</Text>
//               </View>
//               <Text style={styles.optionArrow}>→</Text>
//             </TouchableOpacity>

//             {/* Backup File Recovery */}
//             <TouchableOpacity
//               style={styles.recoveryOption}
//               onPress={() => {
//                 setShowRecoveryModal(false);
//                 navigation.navigate('Backup');
//               }}
//             >
//               <Text style={styles.optionEmoji}>📁</Text>
//               <View style={styles.optionInfo}>
//                 <Text style={styles.optionTitle}>Backup File</Text>
//                 <Text style={styles.optionDesc}>I have a PawPad backup JSON file</Text>
//               </View>
//               <Text style={styles.optionArrow}>→</Text>
//             </TouchableOpacity>

//             {/* Cancel */}
//             <TouchableOpacity
//               style={styles.cancelButton}
//               onPress={() => setShowRecoveryModal(false)}
//             >
//               <Text style={styles.cancelButtonText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
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

//   // ═══════════════════════════════════════
//   // MODAL STYLES
//   // ═══════════════════════════════════════
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.85)',
//     justifyContent: 'center',
//     padding: 24,
//   },
//   modalContent: {
//     backgroundColor: '#1E293B',
//     borderRadius: 20,
//     padding: 24,
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   modalSubtitle: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     textAlign: 'center',
//     marginBottom: 24,
//   },
//   recoveryOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#0F172A',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#374151',
//   },
//   seedlessOption: {
//     borderColor: '#A855F7',
//     backgroundColor: 'rgba(168, 85, 247, 0.08)',
//   },
//   optionEmoji: {
//     fontSize: 28,
//     marginRight: 14,
//   },
//   optionInfo: {
//     flex: 1,
//   },
//   optionTitleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 2,
//   },
//   optionTitle: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   optionDesc: {
//     color: '#9CA3AF',
//     fontSize: 12,
//   },
//   optionArrow: {
//     color: '#4ECDC4',
//     fontSize: 20,
//     fontWeight: '600',
//   },
//   newBadge: {
//     backgroundColor: '#A855F7',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 4,
//     marginLeft: 8,
//   },
//   newBadgeText: {
//     color: '#FFFFFF',
//     fontSize: 9,
//     fontWeight: '700',
//   },
//   cancelButton: {
//     marginTop: 8,
//     padding: 14,
//     alignItems: 'center',
//   },
//   cancelButtonText: {
//     color: '#9CA3AF',
//     fontSize: 16,
//   },
// });

// export default QuickSummaryScreen;

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   Modal,
//   ScrollView,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../types/navigation';

// type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// // Font family constant - update to match your loaded font
// const FONT_FAMILY = 'TTFirsNeue';
// const FONT_FAMILY_MEDIUM = 'TTFirsNeue-Medium';

// // Icon components (replace with your actual icons)
// const CheckIcon = () => (
//   <View style={[styles.iconCircle, { borderColor: '#10B981' }]}>
//     <Text style={[styles.iconText, { color: '#10B981' }]}>✓</Text>
//   </View>
// );

// const LockIcon = () => (
//   <View style={[styles.iconCircle, { borderColor: '#4ECDC4' }]}>
//     <Text style={styles.iconText}>🔒</Text>
//   </View>
// );

// const DeviceIcon = () => (
//   <View style={[styles.iconCircle, { borderColor: '#A855F7' }]}>
//     <Text style={[styles.iconText, { color: '#A855F7' }]}>📱</Text>
//   </View>
// );

// const RecoveryIcon = () => (
//   <View style={[styles.iconCircle, { borderColor: '#3B82F6' }]}>
//     <Text style={[styles.iconText, { color: '#3B82F6' }]}>🔄</Text>
//   </View>
// );

// const QuickSummaryScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const [isChecked, setIsChecked] = useState(false);
//   const [showRecoveryModal, setShowRecoveryModal] = useState(false);

//   const summaryItems = [
//     {
//       icon: <CheckIcon />,
//       title: 'No seed phrases',
//       text: 'Your private keys never exist in one place',
//       color: '#10B981',
//     },
//     {
//       icon: <LockIcon />,
//       title: 'MPC Security',
//       text: 'Your vault is secured with threshold cryptography',
//       color: '#4ECDC4',
//     },
//     {
//       icon: <DeviceIcon />,
//       title: 'Multi-device security',
//       text: 'Each device holds one vault share',
//       color: '#A855F7',
//     },
//     {
//       icon: <RecoveryIcon />,
//       title: 'Secure recovery',
//       text: 'Recover with 2 of 3 devices" → "Restore with backup file + Google Authenticator',
//       color: '#3B82F6',
//     },
//   ];

//   const handleContinue = () => {
//     if (isChecked) {
//       navigation.navigate('ChainSelection' as any);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Header Label */}
//         <View style={styles.labelContainer}>
//           <Text style={styles.label}>MPC Wallet</Text>
//         </View>

//         {/* Title */}
//         <Text style={styles.title}>Quick Summary</Text>
//         <Text style={styles.subtitle}>Your vault is secured with MPC technology</Text>

//         {/* Summary Items */}
//         <View style={styles.summaryContainer}>
//           {summaryItems.map((item, index) => (
//             <View key={index} style={styles.summaryItem}>
//               {/* Timeline connector */}
//               {index < summaryItems.length - 1 && (
//                 <View style={styles.timelineConnector} />
//               )}
              
//               {/* Icon */}
//               <View style={styles.iconContainer}>{item.icon}</View>
              
//               {/* Text */}
//               <View style={styles.textContainer}>
//                 <Text style={styles.summaryTitle}>{item.title}</Text>
//                 <Text style={styles.summaryText}>{item.text}</Text>
//               </View>
//             </View>
//           ))}
//         </View>

//         {/* Checkbox */}
//         <TouchableOpacity
//           style={styles.checkboxContainer}
//           onPress={() => setIsChecked(!isChecked)}
//           activeOpacity={0.7}
//         >
//           <View
//             style={[
//               styles.checkbox,
//               isChecked && styles.checkboxChecked,
//             ]}
//           >
//             {isChecked && <Text style={styles.checkmark}>✓</Text>}
//           </View>
//           <Text style={styles.checkboxLabel}>
//             I understand how MPC wallet security works
//           </Text>
//         </TouchableOpacity>

//         {/* Continue Button */}
//         <TouchableOpacity
//           style={[
//             styles.continueButton,
//             !isChecked && styles.continueButtonDisabled,
//           ]}
//           onPress={handleContinue}
//           disabled={!isChecked}
//           activeOpacity={0.8}
//         >
//           <Text
//             style={[
//               styles.continueButtonText,
//               !isChecked && styles.continueButtonTextDisabled,
//             ]}
//           >
//             Get Started
//           </Text>
//         </TouchableOpacity>

//         {/* Recover Wallet Link */}
//         <View style={styles.recoverSection}>
//           <Text style={styles.recoverText}>Already have a wallet?</Text>
//           <TouchableOpacity
//             onPress={() => setShowRecoveryModal(true)}
//             activeOpacity={0.7}
//           >
//             <Text style={styles.recoverLink}>Recover Wallet</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* Recovery Modal */}
//       <Modal
//         visible={showRecoveryModal}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setShowRecoveryModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>How do you want to recover?</Text>
//             <Text style={styles.modalSubtitle}>
//               Choose based on how you created your wallet
//             </Text>

//             {/* Seed Phrase Recovery */}
//             <TouchableOpacity
//               style={styles.recoveryOption}
//               onPress={() => {
//                 setShowRecoveryModal(false);
//                 navigation.navigate('Recovery');
//               }}
//             >
//               <View style={[styles.optionIcon, { backgroundColor: '#1E3A5F' }]}>
//                 <Text style={styles.optionEmoji}>📝</Text>
//               </View>
//               <View style={styles.optionInfo}>
//                 <Text style={styles.optionTitle}>Seed Phrase</Text>
//                 <Text style={styles.optionDesc}>
//                   I have a 12-word recovery phrase
//                 </Text>
//               </View>
//               <Text style={styles.optionArrow}>→</Text>
//             </TouchableOpacity>

//             {/* Seedless Recovery */}
//             <TouchableOpacity
//               style={[styles.recoveryOption, styles.seedlessOption]}
//               onPress={() => {
//                 setShowRecoveryModal(false);
//                 navigation.navigate('RecoverSeedlessVault');
//               }}
//             >
//               <View style={[styles.optionIcon, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
//                 <Text style={styles.optionEmoji}>🔐</Text>
//               </View>
//               <View style={styles.optionInfo}>
//                 <View style={styles.optionTitleRow}>
//                   <Text style={styles.optionTitle}>Seedless (Google Auth)</Text>
//                   <View style={styles.newBadge}>
//                     <Text style={styles.newBadgeText}>NEW</Text>
//                   </View>
//                 </View>
//                 <Text style={styles.optionDesc}>
//                   I have backup file + Google Authenticator
//                 </Text>
//               </View>
//               <Text style={styles.optionArrow}>→</Text>
//             </TouchableOpacity>

//             {/* Backup File Recovery */}
//             <TouchableOpacity
//               style={styles.recoveryOption}
//               onPress={() => {
//                 setShowRecoveryModal(false);
//                 navigation.navigate('Backup');
//               }}
//             >
//               <View style={[styles.optionIcon, { backgroundColor: '#1E3A5F' }]}>
//                 <Text style={styles.optionEmoji}>📁</Text>
//               </View>
//               <View style={styles.optionInfo}>
//                 <Text style={styles.optionTitle}>Backup File</Text>
//                 <Text style={styles.optionDesc}>
//                   I have a PawPad backup JSON file
//                 </Text>
//               </View>
//               <Text style={styles.optionArrow}>→</Text>
//             </TouchableOpacity>

//             {/* Cancel */}
//             <TouchableOpacity
//               style={styles.cancelButton}
//               onPress={() => setShowRecoveryModal(false)}
//             >
//               <Text style={styles.cancelButtonText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0B1426',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingHorizontal: 24,
//     paddingTop: 80,
//     paddingBottom: 40,
//   },
//   labelContainer: {
//     alignSelf: 'flex-start',
//     backgroundColor: 'rgba(78, 205, 196, 0.12)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 6,
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 13,
//     color: '#4ECDC4',
//     fontFamily: FONT_FAMILY_MEDIUM,
//     letterSpacing: 0.5,
//   },
//   title: {
//     fontSize: 32,
//     color: '#FFFFFF',
//     fontFamily: FONT_FAMILY,
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#9CA3AF',
//     fontFamily: FONT_FAMILY,
//     marginBottom: 32,
//   },
//   summaryContainer: {
//     marginBottom: 32,
//   },
//   summaryItem: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 20,
//     position: 'relative',
//   },
//   timelineConnector: {
//     position: 'absolute',
//     left: 20,
//     top: 44,
//     bottom: -20,
//     width: 1,
//     backgroundColor: '#1E3A5F',
//   },
//   iconContainer: {
//     marginRight: 16,
//     zIndex: 1,
//   },
//   iconCircle: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     borderWidth: 1.5,
//     backgroundColor: 'rgba(30, 58, 95, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   iconText: {
//     fontSize: 18,
//     color: '#4ECDC4',
//   },
//   textContainer: {
//     flex: 1,
//     paddingTop: 4,
//   },
//   summaryTitle: {
//     fontSize: 16,
//     color: '#FFFFFF',
//     fontFamily: FONT_FAMILY_MEDIUM,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   summaryText: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     fontFamily: FONT_FAMILY,
//     lineHeight: 20,
//   },
//   warningText: {
//     color: '#E5E7EB',
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 24,
//     paddingVertical: 8,
//   },
//   checkbox: {
//     width: 22,
//     height: 22,
//     borderRadius: 11,
//     borderWidth: 1.5,
//     borderColor: '#4B5563',
//     marginRight: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'transparent',
//   },
//   checkboxChecked: {
//     backgroundColor: '#4ECDC4',
//     borderColor: '#4ECDC4',
//   },
//   checkmark: {
//     color: '#0B1426',
//     fontSize: 14,
//     fontWeight: '700',
//   },
//   checkboxLabel: {
//     fontSize: 15,
//     color: '#9CA3AF',
//     fontFamily: FONT_FAMILY,
//     flex: 1,
//   },
//   continueButton: {
//     backgroundColor: '#4ECDC4',
//     paddingVertical: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   continueButtonDisabled: {
//     backgroundColor: 'rgba(78, 205, 196, 0.15)',
//   },
//   continueButtonText: {
//     fontSize: 17,
//     color: '#0B1426',
//     fontFamily: FONT_FAMILY_MEDIUM,
//     fontWeight: '600',
//   },
//   continueButtonTextDisabled: {
//     color: 'rgba(78, 205, 196, 0.5)',
//   },
//   recoverSection: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 6,
//   },
//   recoverText: {
//     fontSize: 14,
//     color: '#6B7280',
//     fontFamily: FONT_FAMILY,
//   },
//   recoverLink: {
//     fontSize: 14,
//     color: '#4ECDC4',
//     fontFamily: FONT_FAMILY_MEDIUM,
//   },

//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.85)',
//     justifyContent: 'center',
//     padding: 24,
//   },
//   modalContent: {
//     backgroundColor: '#0F172A',
//     borderRadius: 20,
//     padding: 24,
//     borderWidth: 1,
//     borderColor: '#1E3A5F',
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: '600',
//     color: '#FFFFFF',
//     fontFamily: FONT_FAMILY,
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   modalSubtitle: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     fontFamily: FONT_FAMILY,
//     textAlign: 'center',
//     marginBottom: 24,
//   },
//   recoveryOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#0B1426',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#1E3A5F',
//   },
//   seedlessOption: {
//     borderColor: '#A855F7',
//     backgroundColor: 'rgba(168, 85, 247, 0.06)',
//   },
//   optionIcon: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 14,
//   },
//   optionEmoji: {
//     fontSize: 22,
//   },
//   optionInfo: {
//     flex: 1,
//   },
//   optionTitleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 2,
//   },
//   optionTitle: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//     fontFamily: FONT_FAMILY_MEDIUM,
//   },
//   optionDesc: {
//     color: '#9CA3AF',
//     fontSize: 12,
//     fontFamily: FONT_FAMILY,
//     marginTop: 2,
//   },
//   optionArrow: {
//     color: '#4ECDC4',
//     fontSize: 20,
//     fontWeight: '600',
//   },
//   newBadge: {
//     backgroundColor: '#A855F7',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 4,
//     marginLeft: 8,
//   },
//   newBadgeText: {
//     color: '#FFFFFF',
//     fontSize: 9,
//     fontWeight: '700',
//   },
//   cancelButton: {
//     marginTop: 8,
//     padding: 14,
//     alignItems: 'center',
//   },
//   cancelButtonText: {
//     color: '#9CA3AF',
//     fontSize: 16,
//     fontFamily: FONT_FAMILY,
//   },
// });

// export default QuickSummaryScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Font family constant - update to match your loaded font
const FONT_FAMILY = 'TTFirsNeue';
const FONT_FAMILY_MEDIUM = 'TTFirsNeue-Medium';

// Icon components (replace with your actual icons)
const CheckIcon = () => (
  <View style={[styles.iconCircle, { borderColor: '#10B981' }]}>
    <Text style={[styles.iconText, { color: '#10B981' }]}>✓</Text>
  </View>
);

const LockIcon = () => (
  <View style={[styles.iconCircle, { borderColor: '#4ECDC4' }]}>
    <Text style={styles.iconText}>🔒</Text>
  </View>
);

const DeviceIcon = () => (
  <View style={[styles.iconCircle, { borderColor: '#A855F7' }]}>
    <Text style={[styles.iconText, { color: '#A855F7' }]}>📱</Text>
  </View>
);

const RecoveryIcon = () => (
  <View style={[styles.iconCircle, { borderColor: '#3B82F6' }]}>
    <Text style={[styles.iconText, { color: '#3B82F6' }]}>🔄</Text>
  </View>
);

const QuickSummaryScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isChecked, setIsChecked] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  const summaryItems = [
    {
      icon: <CheckIcon />,
      title: 'No seed phrases',
      text: 'Your private keys never exist in one place',
      color: '#10B981',
    },
    {
      icon: <LockIcon />,
      title: 'MPC Security',
      text: 'Your vault is secured with threshold cryptography',
      color: '#4ECDC4',
    },
    {
      icon: <DeviceIcon />,
      title: 'Multi-device security',
      text: 'Each device holds one vault share',
      color: '#A855F7',
    },
    {
      icon: <RecoveryIcon />,
      title: 'Secure recovery',
      text: 'Restore with backup file + Google Authenticator',
      color: '#3B82F6',
    },
  ];

  const handleContinue = () => {
    if (isChecked) {
      navigation.navigate('ChainSelection' as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Label */}
        <View style={styles.labelContainer}>
          <Text style={styles.label}>MPC Wallet</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Quick Summary</Text>
        <Text style={styles.subtitle}>Your vault is secured with MPC technology</Text>

        {/* Summary Items */}
        <View style={styles.summaryContainer}>
          {summaryItems.map((item, index) => (
            <View key={index} style={styles.summaryItem}>
              {/* Timeline connector */}
              {index < summaryItems.length - 1 && (
                <View style={styles.timelineConnector} />
              )}
              
              {/* Icon */}
              <View style={styles.iconContainer}>{item.icon}</View>
              
              {/* Text */}
              <View style={styles.textContainer}>
                <Text style={styles.summaryTitle}>{item.title}</Text>
                <Text style={styles.summaryText}>{item.text}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Checkbox */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setIsChecked(!isChecked)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              isChecked && styles.checkboxChecked,
            ]}
          >
            {isChecked && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>
            I understand how MPC wallet security works
          </Text>
        </TouchableOpacity>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            !isChecked && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!isChecked}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.continueButtonText,
              !isChecked && styles.continueButtonTextDisabled,
            ]}
          >
            Get Started
          </Text>
        </TouchableOpacity>

        {/* Recover Wallet Link */}
        <View style={styles.recoverSection}>
          <Text style={styles.recoverText}>Already have a wallet?</Text>
          <TouchableOpacity
            onPress={() => setShowRecoveryModal(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.recoverLink}>Recover Wallet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Recovery Modal */}
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

            {/* TEE Wallet Recovery - PRIMARY OPTION */}
            <TouchableOpacity
              style={[styles.recoveryOption, styles.teeOption]}
              onPress={() => {
                setShowRecoveryModal(false);
                navigation.navigate('RecoverTEEWallet' as any);
              }}
            >
              <View style={[styles.optionIcon, { backgroundColor: 'rgba(51, 230, 191, 0.15)' }]}>
                <Text style={styles.optionEmoji}>🛡️</Text>
              </View>
              <View style={styles.optionInfo}>
                <View style={styles.optionTitleRow}>
                  <Text style={styles.optionTitle}>TEE Wallet</Text>
                  <View style={[styles.newBadge, { backgroundColor: '#33E6BF' }]}>
                    <Text style={[styles.newBadgeText, { color: '#000' }]}>NEW</Text>
                  </View>
                </View>
                <Text style={styles.optionDesc}>
                  Backup file + Google Authenticator
                </Text>
              </View>
              <Text style={styles.optionArrow}>→</Text>
            </TouchableOpacity>

            {/* Seed Phrase Recovery */}
            <TouchableOpacity
              style={styles.recoveryOption}
              onPress={() => {
                setShowRecoveryModal(false);
                navigation.navigate('Recovery');
              }}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#1E3A5F' }]}>
                <Text style={styles.optionEmoji}>🌱</Text>
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Seed Phrase</Text>
                <Text style={styles.optionDesc}>
                  I have a 12-word recovery phrase
                </Text>
              </View>
              <Text style={styles.optionArrow}>→</Text>
            </TouchableOpacity>

            {/* Seedless Recovery (OLD) */}
            <TouchableOpacity
              style={styles.recoveryOption}
              onPress={() => {
                setShowRecoveryModal(false);
                navigation.navigate('RecoverSeedlessVault');
              }}
            >
              <View style={[styles.optionIcon, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                <Text style={styles.optionEmoji}>◈</Text>
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Seedless Wallet</Text>
                <Text style={styles.optionDesc}>
                  Old seedless backup + TOTP secret
                </Text>
              </View>
              <Text style={styles.optionArrow}>→</Text>
            </TouchableOpacity>

            {/* Backup File Recovery */}
            <TouchableOpacity
              style={styles.recoveryOption}
              onPress={() => {
                setShowRecoveryModal(false);
                navigation.navigate('Recovery');
              }}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#1E3A5F' }]}>
                <Text style={styles.optionEmoji}>📁</Text>
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>JSON Backup</Text>
                <Text style={styles.optionDesc}>
                  I have a PawPad backup JSON file
                </Text>
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
    backgroundColor: '#0B1426',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
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
    fontFamily: FONT_FAMILY_MEDIUM,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    fontFamily: FONT_FAMILY,
    marginBottom: 32,
  },
  summaryContainer: {
    marginBottom: 32,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    position: 'relative',
  },
  timelineConnector: {
    position: 'absolute',
    left: 20,
    top: 44,
    bottom: -20,
    width: 1,
    backgroundColor: '#1E3A5F',
  },
  iconContainer: {
    marginRight: 16,
    zIndex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    backgroundColor: 'rgba(30, 58, 95, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
    color: '#4ECDC4',
  },
  textContainer: {
    flex: 1,
    paddingTop: 4,
  },
  summaryTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY_MEDIUM,
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: FONT_FAMILY,
    lineHeight: 20,
  },
  warningText: {
    color: '#E5E7EB',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#4B5563',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  checkmark: {
    color: '#0B1426',
    fontSize: 14,
    fontWeight: '700',
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#9CA3AF',
    fontFamily: FONT_FAMILY,
    flex: 1,
  },
  continueButton: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
  },
  continueButtonText: {
    fontSize: 17,
    color: '#0B1426',
    fontFamily: FONT_FAMILY_MEDIUM,
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: 'rgba(78, 205, 196, 0.5)',
  },
  recoverSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  recoverText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: FONT_FAMILY,
  },
  recoverLink: {
    fontSize: 14,
    color: '#4ECDC4',
    fontFamily: FONT_FAMILY_MEDIUM,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: FONT_FAMILY,
    textAlign: 'center',
    marginBottom: 24,
  },
  recoveryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B1426',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  teeOption: {
    borderColor: '#33E6BF',
    borderWidth: 2,
    backgroundColor: 'rgba(51, 230, 191, 0.06)',
  },
  seedlessOption: {
    borderColor: '#A855F7',
    backgroundColor: 'rgba(168, 85, 247, 0.06)',
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  optionEmoji: {
    fontSize: 22,
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
    fontFamily: FONT_FAMILY_MEDIUM,
  },
  optionDesc: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: FONT_FAMILY,
    marginTop: 2,
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
    fontFamily: FONT_FAMILY,
  },
});

export default QuickSummaryScreen;