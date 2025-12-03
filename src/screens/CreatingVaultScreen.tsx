// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   ActivityIndicator,
// } from 'react-native';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../types/navigation';
// import api from '../services/api';

// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatingVault'>;
// type RoutePropType = RouteProp<RootStackParamList, 'CreatingVault'>;

// const CreatingVaultScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<RoutePropType>();
//   const { chain, email, vaultName } = route.params;  // ADD vaultName HERE
//   const [status, setStatus] = useState('Initializing MPC protocol...');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     createVault();
//   }, []);

//   const createVault = async () => {
//     try {
//       setStatus('Creating your MPC vault...');
      
//       const response = await api.createVault(chain, email, vaultName);
      
//       if (response.success) {
//         setStatus('Vault created successfully!');
        
//         const vaultData = {
//           vault_id: response.vault_id,
//           vault_name: response.metadata?.vault_name || vaultName || `${chain} Wallet`,
//           chain: response.chain,
//           address: response.address,
//           mpc_provider: response.mpc_provider,
//           created_at: response.created_at,
//         };
        
//         setTimeout(() => {
//           navigation.replace('VaultSuccess', { vault: vaultData });
//         }, 1500);
//       } else {
//         throw new Error(response.error || 'Failed to create vault');
//       }
//     } catch (err: any) {
//       console.error('Vault creation error:', err);
//       console.error('Error response:', err.response?.data);
      
//       const errorMsg = err.response?.data?.error || 
//                        err.response?.data?.message || 
//                        err.message || 
//                        'Failed to create vault';
      
//       setError(errorMsg);
//       setStatus('Error');
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         <View style={styles.animationContainer}>
//           {error ? (
//             <Text style={styles.errorEmoji}>❌</Text>
//           ) : (
//             <ActivityIndicator size="large" color="#4ECDC4" />
//           )}
//         </View>

//         <Text style={styles.title}>
//           {error ? 'Creation Failed' : 'Creating Your Vault'}
//         </Text>
        
//         <Text style={styles.status}>
//           {error || status}
//         </Text>

//         <View style={styles.infoCard}>
//           <Text style={styles.infoText}>Name: {vaultName}</Text>
//           <Text style={styles.infoText}>Chain: {chain}</Text>
//           <Text style={styles.infoText}>Email: {email}</Text>
//           <Text style={styles.infoText}>
//             MPC: {chain === 'SOL' ? 'Arcium' : 'Lit Protocol'}
//           </Text>
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
//     paddingHorizontal: 24,
//     justifyContent: 'center',
//   },
//   animationContainer: {
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   errorEmoji: {
//     fontSize: 64,
//   },
//   title: {
//     fontSize: 24,
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   status: {
//     fontSize: 16,
//     color: '#9CA3AF',
//     textAlign: 'center',
//     marginBottom: 40,
//   },
//   infoCard: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 20,
//   },
//   infoText: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     marginBottom: 8,
//   },
// });

// export default CreatingVaultScreen;

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   ActivityIndicator,
// } from 'react-native';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList, VaultData } from '../types/navigation';
// import api from '../services/api';

// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatingVault'>;
// type RoutePropType = RouteProp<RootStackParamList, 'CreatingVault'>;

// const CreatingVaultScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<RoutePropType>();
//   const { chain, email, vaultName, vaultType, threshold, participants } = route.params;
  
//   const [status, setStatus] = useState('Initializing...');
//   const [subStatus, setSubStatus] = useState('');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     createVault();
//   }, []);

//   const createVault = async () => {
//     try {
//       const isZEC = chain === 'ZEC';
      
//       if (isZEC) {
//         // === FROST VAULT CREATION ===
//         if (vaultType === 'shared' && threshold && participants && participants.length > 0) {
//           // Shared vault (m-of-n)
//           setStatus('Starting FROST DKG...');
//           setSubStatus('Generating distributed key shares');
          
//           const response = await api.createFrostSharedVault(
//             vaultName,
//             threshold,  // Now guaranteed to be number
//             participants
//           );
          
//           if (response.success) {
//             setStatus('DKG Complete!');
//             setSubStatus('Key shares distributed to participants');
            
//             const vaultData: VaultData = {
//               vault_id: response.vault.id,
//               vault_name: response.vault.name,
//               chain: 'ZEC',
//               address: response.vault.address,
//               mpc_provider: 'FROST',
//               vault_type: 'shared' as const,  // Fix: explicit type
//               threshold: response.vault.threshold,
//               totalParticipants: response.vault.totalParticipants,
//               participants: response.vault.participants,
//               created_at: response.vault.createdAt,
//             };
            
//             setTimeout(() => {
//               navigation.replace('VaultSuccess', { vault: vaultData });
//             }, 1500);
//           } else {
//             throw new Error(response.error || 'Failed to create shared vault');
//           }
//         } else {
//           // Personal vault (1-of-1)
//           setStatus('Creating FROST vault...');
//           setSubStatus('Generating spending key');
          
//           const response = await api.createFrostPersonalVault(
//             vaultName,
//             email,
//             vaultName
//           );
          
//           if (response.success) {
//             setStatus('Vault created!');
//             setSubStatus('Unified address generated');
            
//             const vaultData: VaultData = {
//               vault_id: response.vault.id,
//               vault_name: response.vault.name,
//               chain: 'ZEC',
//               address: response.vault.address,
//               mpc_provider: 'FROST',
//               vault_type: 'personal' as const,  // Fix: explicit type
//               threshold: 1,
//               totalParticipants: 1,
//               created_at: response.vault.createdAt,
//             };
            
//             setTimeout(() => {
//               navigation.replace('VaultSuccess', { vault: vaultData });
//             }, 1500);
//           } else {
//             throw new Error(response.error || 'Failed to create personal vault');
//           }
//         }
//       } else {
//         // === EXISTING SOL VAULT CREATION (Arcium) ===
//         setStatus('Creating your MPC vault...');
//         setSubStatus('Connecting to Arcium network');
        
//         const response = await api.createVault(chain, email, vaultName);
        
//         if (response.success) {
//           setStatus('Vault created successfully!');
//           setSubStatus('');
          
//           const vaultData: VaultData = {
//             vault_id: response.vault_id,
//             vault_name: response.metadata?.vault_name || vaultName || `${chain} Wallet`,
//             chain: response.chain,
//             address: response.address,
//             mpc_provider: response.mpc_provider,
//             vault_type: 'personal' as const,
//             created_at: response.created_at,
//           };
          
//           setTimeout(() => {
//             navigation.replace('VaultSuccess', { vault: vaultData });
//           }, 1500);
//         } else {
//           throw new Error(response.error || 'Failed to create vault');
//         }
//       }
//     } catch (err: any) {
//       console.error('Vault creation error:', err);
      
//       const errorMsg = err.response?.data?.error || 
//                        err.message || 
//                        'Failed to create vault';
      
//       setError(errorMsg);
//       setStatus('Error');
//       setSubStatus('');
//     }
//   };

//   const getMPCProvider = () => {
//     if (chain === 'ZEC') return 'FROST Threshold';
//     if (chain === 'SOL') return 'Arcium MPC';
//     return 'MPC';
//   };

//   const getVaultTypeDisplay = () => {
//     if (chain === 'ZEC' && vaultType === 'shared' && threshold && participants) {
//       return `Shared (${threshold}-of-${participants.length})`;
//     }
//     return 'Personal (1-of-1)';
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         <View style={styles.animationContainer}>
//           {error ? (
//             <Text style={styles.errorEmoji}>❌</Text>
//           ) : status.includes('Complete') || status.includes('success') ? (
//             <Text style={styles.successEmoji}>✅</Text>
//           ) : (
//             <View style={styles.loaderContainer}>
//               <ActivityIndicator size="large" color="#4ECDC4" />
//               {chain === 'ZEC' && vaultType === 'shared' && (
//                 <View style={styles.dkgIndicator}>
//                   <Text style={styles.dkgText}>🔐 DKG</Text>
//                 </View>
//               )}
//             </View>
//           )}
//         </View>

//         <Text style={styles.title}>
//           {error ? 'Creation Failed' : 'Creating Your Vault'}
//         </Text>
        
//         <Text style={styles.status}>
//           {error || status}
//         </Text>
        
//         {subStatus ? (
//           <Text style={styles.subStatus}>{subStatus}</Text>
//         ) : null}

//         <View style={styles.infoCard}>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Name</Text>
//             <Text style={styles.infoValue}>{vaultName}</Text>
//           </View>
          
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Chain</Text>
//             <View style={styles.chainBadge}>
//               <Text style={styles.chainText}>{chain}</Text>
//             </View>
//           </View>
          
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Type</Text>
//             <Text style={styles.infoValue}>{getVaultTypeDisplay()}</Text>
//           </View>
          
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>MPC Provider</Text>
//             <Text style={[styles.infoValue, styles.mpcHighlight]}>
//               {getMPCProvider()}
//             </Text>
//           </View>

//           {chain === 'ZEC' && vaultType === 'shared' && participants && participants.length > 0 && (
//             <View style={styles.participantsSection}>
//               <Text style={styles.participantsTitle}>Participants</Text>
//               {participants.map((p, i) => (
//                 <Text key={i} style={styles.participantItem}>
//                   • {p.name} ({p.id})
//                 </Text>
//               ))}
//             </View>
//           )}
//         </View>

//         {chain === 'ZEC' && !error && (
//           <View style={styles.frostBadge}>
//             <Text style={styles.frostBadgeText}>
//               🔐 Powered by FROST Threshold Signatures
//             </Text>
//           </View>
//         )}
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
//     paddingHorizontal: 24,
//     justifyContent: 'center',
//   },
//   animationContainer: {
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   loaderContainer: {
//     alignItems: 'center',
//   },
//   dkgIndicator: {
//     marginTop: 12,
//     backgroundColor: 'rgba(78, 205, 196, 0.2)',
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   dkgText: {
//     color: '#4ECDC4',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   errorEmoji: {
//     fontSize: 64,
//   },
//   successEmoji: {
//     fontSize: 64,
//   },
//   title: {
//     fontSize: 24,
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 12,
//   },
//   status: {
//     fontSize: 16,
//     color: '#FFFFFF',
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   subStatus: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     textAlign: 'center',
//     marginBottom: 32,
//   },
//   infoCard: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 20,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   infoLabel: {
//     fontSize: 14,
//     color: '#9CA3AF',
//   },
//   infoValue: {
//     fontSize: 14,
//     color: '#FFFFFF',
//     fontWeight: '500',
//   },
//   chainBadge: {
//     backgroundColor: '#4ECDC4',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   chainText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   mpcHighlight: {
//     color: '#4ECDC4',
//   },
//   participantsSection: {
//     marginTop: 12,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#374151',
//   },
//   participantsTitle: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     marginBottom: 8,
//   },
//   participantItem: {
//     fontSize: 13,
//     color: '#FFFFFF',
//     marginBottom: 4,
//   },
//   frostBadge: {
//     marginTop: 24,
//     alignItems: 'center',
//   },
//   frostBadgeText: {
//     color: '#4ECDC4',
//     fontSize: 12,
//     fontWeight: '500',
//   },
// });

// export default CreatingVaultScreen;


// /**
//  * ============================================
//  * CREATING VAULT SCREEN - UPDATED
//  * ============================================
//  * 
//  * Now saves the created vault to VaultContext
//  * for automatic use in Fund Me and other screens.
//  */

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   ActivityIndicator,
// } from 'react-native';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList, VaultData } from '../types/navigation';
// import { useVaults } from '../context/VaultContext';  // <-- ADD THIS IMPORT
// import api from '../services/api';

// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatingVault'>;
// type RoutePropType = RouteProp<RootStackParamList, 'CreatingVault'>;

// const CreatingVaultScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<RoutePropType>();
//   const { chain, email, vaultName, vaultType, threshold, participants } = route.params;
  
//   // === ADD THIS: Get addVault from context ===
//   const { addVault } = useVaults();
  
//   const [status, setStatus] = useState('Initializing...');
//   const [subStatus, setSubStatus] = useState('');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     createVault();
//   }, []);

//   const createVault = async () => {
//     try {
//       const isZEC = chain === 'ZEC';
      
//       if (isZEC) {
//         // === FROST VAULT CREATION ===
//         if (vaultType === 'shared' && threshold && participants && participants.length > 0) {
//           // Shared vault (m-of-n)
//           setStatus('Starting FROST DKG...');
//           setSubStatus('Generating distributed key shares');
          
//           const response = await api.createFrostSharedVault(
//             vaultName,
//             threshold,
//             participants
//           );
          
//           if (response.success) {
//             setStatus('DKG Complete!');
//             setSubStatus('Key shares distributed to participants');
//             console.log('🔍 EMAIL FROM PARAMS:', email);

            
//             const vaultData: VaultData = {
//               vault_id: response.vault.id,
//               vault_name: response.vault.name,
//               chain: 'ZEC',
//               address: response.vault.address,
//               mpc_provider: 'FROST',
//               vault_type: 'shared' as const,
//               threshold: response.vault.threshold,
//               totalParticipants: response.vault.totalParticipants,
//               participants: response.vault.participants,
//               created_at: response.vault.createdAt,
//               email: email, 
//             };
            
//             // === Save vault to context/storage ===
//             await addVault(vaultData);
//             console.log('✅ Vault saved to storage:', vaultData.vault_id);
//             console.log('🔍 VAULT DATA:', JSON.stringify(vaultData, null, 2));
            
//             setTimeout(() => {
//               navigation.replace('VaultSuccess', { vault: vaultData });
//             }, 1500);
//           } else {
//             throw new Error(response.error || 'Failed to create shared vault');
//           }
//         } else {
//           // Personal vault (1-of-1)
//           setStatus('Creating FROST vault...');
//           setSubStatus('Generating spending key');
          
//           const response = await api.createFrostPersonalVault(
//             vaultName,
//             email,
//             vaultName
//           );
          
//           if (response.success) {
//             setStatus('Vault created!');
//             setSubStatus('Unified address generated');
            
//             const vaultData: VaultData = {
//               vault_id: response.vault.id,
//               vault_name: response.vault.name,
//               chain: 'ZEC',
//               address: response.vault.address,
//               mpc_provider: 'FROST',
//               vault_type: 'personal' as const,
//               threshold: 1,
//               totalParticipants: 1,
//               created_at: response.vault.createdAt,
//               email: email,
//             };
            
//             // === Save vault to context/storage ===
//             await addVault(vaultData);
//             console.log('✅ Vault saved to storage:', vaultData.vault_id);
            
//             setTimeout(() => {
//               navigation.replace('VaultSuccess', { vault: vaultData });
//             }, 1500);
//           } else {
//             throw new Error(response.error || 'Failed to create personal vault');
//           }
//         }
//       } else {
//         // === EXISTING SOL VAULT CREATION (Arcium) ===
//         setStatus('Creating your MPC vault...');
//         setSubStatus('Connecting to Arcium network');
        
//         const response = await api.createVault(chain, email, vaultName);
        
//         if (response.success) {
//           setStatus('Vault created successfully!');
//           setSubStatus('');
          
//           const vaultData: VaultData = {
//             vault_id: response.vault_id,
//             vault_name: response.metadata?.vault_name || vaultName || `${chain} Wallet`,
//             chain: response.chain,
//             address: response.address,
//             mpc_provider: response.mpc_provider,
//             vault_type: 'personal' as const,
//             created_at: response.created_at,
//             email: email,
//           };
          
//           // === Save vault to context/storage ===
//           await addVault(vaultData);
//           console.log('✅ Vault saved to storage:', vaultData.vault_id);
          
//           setTimeout(() => {
//             navigation.replace('VaultSuccess', { vault: vaultData });
//           }, 1500);
//         } else {
//           throw new Error(response.error || 'Failed to create vault');
//         }
//       }
//     } catch (err: any) {
//       console.error('Vault creation error:', err);
      
//       const errorMsg = err.response?.data?.error || 
//                        err.message || 
//                        'Failed to create vault';
      
//       setError(errorMsg);
//       setStatus('Error');
//       setSubStatus('');
//     }
//   };

//   const getMPCProvider = () => {
//     if (chain === 'ZEC') return 'FROST Threshold';
//     if (chain === 'SOL') return 'Arcium MPC';
//     return 'MPC';
//   };

//   const getVaultTypeDisplay = () => {
//     if (chain === 'ZEC' && vaultType === 'shared' && threshold && participants) {
//       return `Shared (${threshold}-of-${participants.length})`;
//     }
//     return 'Personal (1-of-1)';
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         <View style={styles.animationContainer}>
//           {error ? (
//             <Text style={styles.errorEmoji}>❌</Text>
//           ) : status.includes('Complete') || status.includes('success') ? (
//             <Text style={styles.successEmoji}>✅</Text>
//           ) : (
//             <View style={styles.loaderContainer}>
//               <ActivityIndicator size="large" color="#4ECDC4" />
//               {chain === 'ZEC' && vaultType === 'shared' && (
//                 <View style={styles.dkgIndicator}>
//                   <Text style={styles.dkgText}>🔐 DKG</Text>
//                 </View>
//               )}
//             </View>
//           )}
//         </View>

//         <Text style={styles.title}>
//           {error ? 'Creation Failed' : 'Creating Your Vault'}
//         </Text>
        
//         <Text style={styles.status}>
//           {error || status}
//         </Text>
        
//         {subStatus ? (
//           <Text style={styles.subStatus}>{subStatus}</Text>
//         ) : null}

//         <View style={styles.infoCard}>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Name</Text>
//             <Text style={styles.infoValue}>{vaultName}</Text>
//           </View>
          
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Chain</Text>
//             <View style={styles.chainBadge}>
//               <Text style={styles.chainText}>{chain}</Text>
//             </View>
//           </View>
          
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Type</Text>
//             <Text style={styles.infoValue}>{getVaultTypeDisplay()}</Text>
//           </View>
          
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>MPC Provider</Text>
//             <Text style={[styles.infoValue, styles.mpcHighlight]}>
//               {getMPCProvider()}
//             </Text>
//           </View>

//           {chain === 'ZEC' && vaultType === 'shared' && participants && participants.length > 0 && (
//             <View style={styles.participantsSection}>
//               <Text style={styles.participantsTitle}>Participants</Text>
//               {participants.map((p, i) => (
//                 <Text key={i} style={styles.participantItem}>
//                   • {p.name} ({p.id})
//                 </Text>
//               ))}
//             </View>
//           )}
//         </View>

//         {chain === 'ZEC' && !error && (
//           <View style={styles.frostBadge}>
//             <Text style={styles.frostBadgeText}>
//               🔐 Powered by FROST Threshold Signatures
//             </Text>
//           </View>
//         )}
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
//     paddingHorizontal: 24,
//     justifyContent: 'center',
//   },
//   animationContainer: {
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   loaderContainer: {
//     alignItems: 'center',
//   },
//   dkgIndicator: {
//     marginTop: 12,
//     backgroundColor: 'rgba(78, 205, 196, 0.2)',
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   dkgText: {
//     color: '#4ECDC4',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   errorEmoji: {
//     fontSize: 64,
//   },
//   successEmoji: {
//     fontSize: 64,
//   },
//   title: {
//     fontSize: 24,
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 12,
//   },
//   status: {
//     fontSize: 16,
//     color: '#FFFFFF',
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   subStatus: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     textAlign: 'center',
//     marginBottom: 32,
//   },
//   infoCard: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 20,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   infoLabel: {
//     fontSize: 14,
//     color: '#9CA3AF',
//   },
//   infoValue: {
//     fontSize: 14,
//     color: '#FFFFFF',
//     fontWeight: '500',
//   },
//   chainBadge: {
//     backgroundColor: '#4ECDC4',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   chainText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   mpcHighlight: {
//     color: '#4ECDC4',
//   },
//   participantsSection: {
//     marginTop: 12,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#374151',
//   },
//   participantsTitle: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     marginBottom: 8,
//   },
//   participantItem: {
//     fontSize: 13,
//     color: '#FFFFFF',
//     marginBottom: 4,
//   },
//   frostBadge: {
//     marginTop: 24,
//     alignItems: 'center',
//   },
//   frostBadgeText: {
//     color: '#4ECDC4',
//     fontSize: 12,
//     fontWeight: '500',
//   },
// });

// export default CreatingVaultScreen;

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   ActivityIndicator,
// } from 'react-native';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList, VaultData } from '../types/navigation';
// import { useVaults } from '../context/VaultContext';
// import api from '../services/api';

// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatingVault'>;
// type RoutePropType = RouteProp<RootStackParamList, 'CreatingVault'>;

// const CreatingVaultScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<RoutePropType>();
  
//   // Handle optional email
//   const chain = route.params?.chain || 'SOL';
//   const email = route.params?.email || '';
//   const vaultName = route.params?.vaultName || 'My Wallet';
  
//   const { addVault } = useVaults();
  
//   const [status, setStatus] = useState('Initializing...');
//   const [subStatus, setSubStatus] = useState('');
//   const [error, setError] = useState('');
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     createVault();
//   }, []);

//   const createVault = async () => {
//     try {
//       // ═══════════════════════════════════════════════════════════════
//       // CREATE UNIFIED VAULT (SOL + ZEC)
//       // ═══════════════════════════════════════════════════════════════
      
//       setStatus('Creating your wallet...');
//       setSubStatus('Setting up Arcium MPC (SOL)');
//       setProgress(25);

//       console.log('🏦 Creating unified vault:', { email, vaultName });

//       // This creates BOTH SOL and ZEC wallets!
//       const response = await api.createUnifiedVault(email, vaultName);

//       if (response.success) {
//         setProgress(50);
//         setSubStatus('Creating Zcash wallet (ZEC)');
//         await new Promise<void>(resolve => setTimeout(resolve, 500));

//         setProgress(75);
//         setSubStatus('Linking wallets...');
//         await new Promise<void>(resolve => setTimeout(resolve, 500));

//         setStatus('Wallet created!');
//         setSubStatus('');
//         setProgress(100);

//         // Build vault data
//         const vaultData: VaultData = {
//           vault_id: response.vault_id,
//           vault_name: response.vault_name,
//           vault_type: 'unified',
//           email: response.email || email,
//           created_at: response.created_at,

//           // SOL component
//           sol: {
//             address: response.sol.address,
//             mpc_provider: response.sol.mpc_provider || 'Arcium',
//           },

//           // ZEC component
//           zec: {
//             address: response.zec.address,
//             viewing_key: response.zec.viewing_key,
//             provider: 'ZcashSDK',
//           },
//         };

//         console.log('✅ Vault data:', JSON.stringify(vaultData, null, 2));

//         // Save to storage
//         await addVault(vaultData);

//         // Navigate to success
//         setTimeout(() => {
//           navigation.replace('VaultSuccess', { vault: vaultData });
//         }, 1000);

//       } else {
//         throw new Error(response.error || 'Failed to create vault');
//       }

//     } catch (err: any) {
//       console.error('Vault creation error:', err);
//       setError(err.response?.data?.error || err.message || 'Failed to create vault');
//       setStatus('Error');
//       setSubStatus('');
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         {/* Status Icon */}
//         <View style={styles.iconContainer}>
//           {error ? (
//             <Text style={styles.errorEmoji}>❌</Text>
//           ) : progress === 100 ? (
//             <Text style={styles.successEmoji}>✅</Text>
//           ) : (
//             <View style={styles.loaderContainer}>
//               <ActivityIndicator size="large" color="#4ECDC4" />
//               <View style={styles.badge}>
//                 <Text style={styles.badgeText}>SOL + ZEC</Text>
//               </View>
//             </View>
//           )}
//         </View>

//         {/* Title */}
//         <Text style={styles.title}>
//           {error ? 'Creation Failed' : 'Creating Your Wallet'}
//         </Text>
        
//         {/* Status */}
//         <Text style={styles.status}>{error || status}</Text>
//         {subStatus ? <Text style={styles.subStatus}>{subStatus}</Text> : null}

//         {/* Progress Bar */}
//         {!error && progress < 100 && (
//           <View style={styles.progressContainer}>
//             <View style={styles.progressBar}>
//               <View style={[styles.progressFill, { width: `${progress}%` }]} />
//             </View>
//             <Text style={styles.progressText}>{progress}%</Text>
//           </View>
//         )}

//         {/* Info Card */}
//         <View style={styles.infoCard}>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Name</Text>
//             <Text style={styles.infoValue}>{vaultName}</Text>
//           </View>
          
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Type</Text>
//             <View style={styles.typeBadge}>
//               <Text style={styles.typeBadgeText}>Unified Wallet</Text>
//             </View>
//           </View>

//           <View style={styles.chainsSection}>
//             <Text style={styles.chainsSectionTitle}>Creating wallets for:</Text>
            
//             <View style={styles.chainRow}>
//               <View style={styles.solBadge}>
//                 <Text style={styles.chainBadgeText}>SOL</Text>
//               </View>
//               <Text style={styles.chainProvider}>Arcium MPC (seedless)</Text>
//             </View>
            
//             <View style={styles.chainRow}>
//               <View style={styles.zecBadge}>
//                 <Text style={styles.chainBadgeText}>ZEC</Text>
//               </View>
//               <Text style={styles.chainProvider}>Zcash SDK (shielded)</Text>
//             </View>
//           </View>
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
//     paddingHorizontal: 24,
//     justifyContent: 'center',
//   },
//   iconContainer: {
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   loaderContainer: {
//     alignItems: 'center',
//   },
//   badge: {
//     marginTop: 12,
//     backgroundColor: 'rgba(78, 205, 196, 0.2)',
//     paddingHorizontal: 16,
//     paddingVertical: 6,
//     borderRadius: 12,
//   },
//   badgeText: {
//     color: '#4ECDC4',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   errorEmoji: {
//     fontSize: 64,
//   },
//   successEmoji: {
//     fontSize: 64,
//   },
//   title: {
//     fontSize: 24,
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 12,
//   },
//   status: {
//     fontSize: 16,
//     color: '#FFFFFF',
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   subStatus: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     textAlign: 'center',
//     marginBottom: 24,
//   },
//   progressContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 24,
//     paddingHorizontal: 20,
//   },
//   progressBar: {
//     flex: 1,
//     height: 8,
//     backgroundColor: '#1E293B',
//     borderRadius: 4,
//     overflow: 'hidden',
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: '#4ECDC4',
//     borderRadius: 4,
//   },
//   progressText: {
//     marginLeft: 12,
//     color: '#4ECDC4',
//     fontSize: 14,
//     fontWeight: '600',
//     width: 40,
//   },
//   infoCard: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 20,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   infoLabel: {
//     fontSize: 14,
//     color: '#9CA3AF',
//   },
//   infoValue: {
//     fontSize: 14,
//     color: '#FFFFFF',
//     fontWeight: '500',
//   },
//   typeBadge: {
//     backgroundColor: 'rgba(78, 205, 196, 0.15)',
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   typeBadgeText: {
//     color: '#4ECDC4',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   chainsSection: {
//     marginTop: 12,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#374151',
//   },
//   chainsSectionTitle: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     marginBottom: 12,
//   },
//   chainRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   solBadge: {
//     backgroundColor: '#9945FF',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 6,
//     marginRight: 10,
//   },
//   zecBadge: {
//     backgroundColor: '#F4B728',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 6,
//     marginRight: 10,
//   },
//   chainBadgeText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   chainProvider: {
//     color: '#9CA3AF',
//     fontSize: 12,
//   },
// });

// export default CreatingVaultScreen;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, VaultData } from '../types/navigation';
import { useVaults } from '../context/VaultContext';
import api from '../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatingVault'>;
type RoutePropType = RouteProp<RootStackParamList, 'CreatingVault'>;

const CreatingVaultScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  
  // Handle optional email
  const chain = route.params?.chain || 'SOL';
  const email = route.params?.email || '';
  const vaultName = route.params?.vaultName || 'My Wallet';
  
  const { addVault } = useVaults();
  
  const [status, setStatus] = useState('Initializing...');
  const [subStatus, setSubStatus] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    createVault();
  }, []);

  const createVault = async () => {
    try {
      // ═══════════════════════════════════════════════════════════════
      // CREATE UNIFIED VAULT (SOL + ZEC)
      // ═══════════════════════════════════════════════════════════════
      
      setStatus('Creating your wallet...');
      setSubStatus('Setting up Arcium MPC (SOL)');
      setProgress(25);

      console.log('🏦 Creating unified vault:', { email, vaultName });

      // This creates BOTH SOL and ZEC wallets!
      const response = await api.createUnifiedVault(email, vaultName);

      if (response.success) {
        setProgress(50);
        setSubStatus('Finalizing wallet...');
        await new Promise<void>(resolve => setTimeout(resolve, 500));

        setProgress(75);
        setSubStatus('Saving wallet data...');
        await new Promise<void>(resolve => setTimeout(resolve, 500));

        setStatus('Wallet created!');
        setSubStatus('');
        setProgress(100);

        // Build vault data - handle BOTH unified and simple vault responses
        let vaultData: VaultData;

        // Check if this is a unified vault response (has sol.address and zec.address)
        if (response.sol?.address && response.zec?.address) {
          // Unified vault format
          vaultData = {
            vault_id: response.vault_id,
            vault_name: response.vault_name,
            vault_type: 'unified',
            email: response.email || email,
            created_at: response.created_at,
            sol: {
              address: response.sol.address,
              mpc_provider: response.sol.mpc_provider || 'Arcium',
            },
            zec: {
              address: response.zec.address,
              viewing_key: response.zec.viewing_key,
              provider: 'ZcashSDK',
            },
          };
        } else {
          // Simple SOL vault format (from /api/vault/create)
          vaultData = {
            vault_id: response.vault_id,
            vault_name: response.vault_name,
            vault_type: 'personal',
            chain: response.chain || 'SOL',
            address: response.address,
            mpc_provider: response.mpc_provider || 'Arcium',
            email: response.email || email,
            created_at: response.created_at,
            // Also add sol object for consistency
            sol: {
              address: response.address,
              mpc_provider: response.mpc_provider || 'Arcium',
            },
          };
        }

        console.log('✅ Vault data:', JSON.stringify(vaultData, null, 2));

        // Save to storage
        await addVault(vaultData);

        // Navigate to success
        setTimeout(() => {
          navigation.replace('VaultSuccess', { vault: vaultData });
        }, 1000);

      } else {
        throw new Error(response.error || 'Failed to create vault');
      }

    } catch (err: any) {
      console.error('Vault creation error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to create vault');
      setStatus('Error');
      setSubStatus('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Status Icon */}
        <View style={styles.iconContainer}>
          {error ? (
            <Text style={styles.errorEmoji}>❌</Text>
          ) : progress === 100 ? (
            <Text style={styles.successEmoji}>✅</Text>
          ) : (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#4ECDC4" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>SOL + ZEC</Text>
              </View>
            </View>
          )}
        </View>

        {/* Title */}
        <Text style={styles.title}>
          {error ? 'Creation Failed' : 'Creating Your Wallet'}
        </Text>
        
        {/* Status */}
        <Text style={styles.status}>{error || status}</Text>
        {subStatus ? <Text style={styles.subStatus}>{subStatus}</Text> : null}

        {/* Progress Bar */}
        {!error && progress < 100 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
        )}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{vaultName}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Type</Text>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>Unified Wallet</Text>
            </View>
          </View>

          <View style={styles.chainsSection}>
            <Text style={styles.chainsSectionTitle}>Creating wallets for:</Text>
            
            <View style={styles.chainRow}>
              <View style={styles.solBadge}>
                <Text style={styles.chainBadgeText}>SOL</Text>
              </View>
              <Text style={styles.chainProvider}>Arcium MPC (seedless)</Text>
            </View>
            
            <View style={styles.chainRow}>
              <View style={styles.zecBadge}>
                <Text style={styles.chainBadgeText}>ZEC</Text>
              </View>
              <Text style={styles.chainProvider}>Zcash SDK (shielded)</Text>
            </View>
          </View>
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
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  loaderContainer: {
    alignItems: 'center',
  },
  badge: {
    marginTop: 12,
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#4ECDC4',
    fontSize: 14,
    fontWeight: '600',
  },
  errorEmoji: {
    fontSize: 64,
  },
  successEmoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  status: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subStatus: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#1E293B',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 4,
  },
  progressText: {
    marginLeft: 12,
    color: '#4ECDC4',
    fontSize: 14,
    fontWeight: '600',
    width: 40,
  },
  infoCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  infoValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  typeBadge: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeBadgeText: {
    color: '#4ECDC4',
    fontSize: 12,
    fontWeight: '600',
  },
  chainsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  chainsSectionTitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  chainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  solBadge: {
    backgroundColor: '#9945FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  zecBadge: {
    backgroundColor: '#F4B728',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  chainBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  chainProvider: {
    color: '#9CA3AF',
    fontSize: 12,
  },
});

export default CreatingVaultScreen;