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


/**
 * ============================================
 * CREATING VAULT SCREEN - UPDATED
 * ============================================
 * 
 * Now saves the created vault to VaultContext
 * for automatic use in Fund Me and other screens.
 */

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
import { useVaults } from '../context/VaultContext';  // <-- ADD THIS IMPORT
import api from '../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatingVault'>;
type RoutePropType = RouteProp<RootStackParamList, 'CreatingVault'>;

const CreatingVaultScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { chain, email, vaultName, vaultType, threshold, participants } = route.params;
  
  // === ADD THIS: Get addVault from context ===
  const { addVault } = useVaults();
  
  const [status, setStatus] = useState('Initializing...');
  const [subStatus, setSubStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    createVault();
  }, []);

  const createVault = async () => {
    try {
      const isZEC = chain === 'ZEC';
      
      if (isZEC) {
        // === FROST VAULT CREATION ===
        if (vaultType === 'shared' && threshold && participants && participants.length > 0) {
          // Shared vault (m-of-n)
          setStatus('Starting FROST DKG...');
          setSubStatus('Generating distributed key shares');
          
          const response = await api.createFrostSharedVault(
            vaultName,
            threshold,
            participants
          );
          
          if (response.success) {
            setStatus('DKG Complete!');
            setSubStatus('Key shares distributed to participants');
            
            const vaultData: VaultData = {
              vault_id: response.vault.id,
              vault_name: response.vault.name,
              chain: 'ZEC',
              address: response.vault.address,
              mpc_provider: 'FROST',
              vault_type: 'shared' as const,
              threshold: response.vault.threshold,
              totalParticipants: response.vault.totalParticipants,
              participants: response.vault.participants,
              created_at: response.vault.createdAt,
            };
            
            // === Save vault to context/storage ===
            await addVault(vaultData);
            console.log('✅ Vault saved to storage:', vaultData.vault_id);
            
            setTimeout(() => {
              navigation.replace('VaultSuccess', { vault: vaultData });
            }, 1500);
          } else {
            throw new Error(response.error || 'Failed to create shared vault');
          }
        } else {
          // Personal vault (1-of-1)
          setStatus('Creating FROST vault...');
          setSubStatus('Generating spending key');
          
          const response = await api.createFrostPersonalVault(
            vaultName,
            email,
            vaultName
          );
          
          if (response.success) {
            setStatus('Vault created!');
            setSubStatus('Unified address generated');
            
            const vaultData: VaultData = {
              vault_id: response.vault.id,
              vault_name: response.vault.name,
              chain: 'ZEC',
              address: response.vault.address,
              mpc_provider: 'FROST',
              vault_type: 'personal' as const,
              threshold: 1,
              totalParticipants: 1,
              created_at: response.vault.createdAt,
            };
            
            // === Save vault to context/storage ===
            await addVault(vaultData);
            console.log('✅ Vault saved to storage:', vaultData.vault_id);
            
            setTimeout(() => {
              navigation.replace('VaultSuccess', { vault: vaultData });
            }, 1500);
          } else {
            throw new Error(response.error || 'Failed to create personal vault');
          }
        }
      } else {
        // === EXISTING SOL VAULT CREATION (Arcium) ===
        setStatus('Creating your MPC vault...');
        setSubStatus('Connecting to Arcium network');
        
        const response = await api.createVault(chain, email, vaultName);
        
        if (response.success) {
          setStatus('Vault created successfully!');
          setSubStatus('');
          
          const vaultData: VaultData = {
            vault_id: response.vault_id,
            vault_name: response.metadata?.vault_name || vaultName || `${chain} Wallet`,
            chain: response.chain,
            address: response.address,
            mpc_provider: response.mpc_provider,
            vault_type: 'personal' as const,
            created_at: response.created_at,
          };
          
          // === Save vault to context/storage ===
          await addVault(vaultData);
          console.log('✅ Vault saved to storage:', vaultData.vault_id);
          
          setTimeout(() => {
            navigation.replace('VaultSuccess', { vault: vaultData });
          }, 1500);
        } else {
          throw new Error(response.error || 'Failed to create vault');
        }
      }
    } catch (err: any) {
      console.error('Vault creation error:', err);
      
      const errorMsg = err.response?.data?.error || 
                       err.message || 
                       'Failed to create vault';
      
      setError(errorMsg);
      setStatus('Error');
      setSubStatus('');
    }
  };

  const getMPCProvider = () => {
    if (chain === 'ZEC') return 'FROST Threshold';
    if (chain === 'SOL') return 'Arcium MPC';
    return 'MPC';
  };

  const getVaultTypeDisplay = () => {
    if (chain === 'ZEC' && vaultType === 'shared' && threshold && participants) {
      return `Shared (${threshold}-of-${participants.length})`;
    }
    return 'Personal (1-of-1)';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.animationContainer}>
          {error ? (
            <Text style={styles.errorEmoji}>❌</Text>
          ) : status.includes('Complete') || status.includes('success') ? (
            <Text style={styles.successEmoji}>✅</Text>
          ) : (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#4ECDC4" />
              {chain === 'ZEC' && vaultType === 'shared' && (
                <View style={styles.dkgIndicator}>
                  <Text style={styles.dkgText}>🔐 DKG</Text>
                </View>
              )}
            </View>
          )}
        </View>

        <Text style={styles.title}>
          {error ? 'Creation Failed' : 'Creating Your Vault'}
        </Text>
        
        <Text style={styles.status}>
          {error || status}
        </Text>
        
        {subStatus ? (
          <Text style={styles.subStatus}>{subStatus}</Text>
        ) : null}

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{vaultName}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Chain</Text>
            <View style={styles.chainBadge}>
              <Text style={styles.chainText}>{chain}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Type</Text>
            <Text style={styles.infoValue}>{getVaultTypeDisplay()}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>MPC Provider</Text>
            <Text style={[styles.infoValue, styles.mpcHighlight]}>
              {getMPCProvider()}
            </Text>
          </View>

          {chain === 'ZEC' && vaultType === 'shared' && participants && participants.length > 0 && (
            <View style={styles.participantsSection}>
              <Text style={styles.participantsTitle}>Participants</Text>
              {participants.map((p, i) => (
                <Text key={i} style={styles.participantItem}>
                  • {p.name} ({p.id})
                </Text>
              ))}
            </View>
          )}
        </View>

        {chain === 'ZEC' && !error && (
          <View style={styles.frostBadge}>
            <Text style={styles.frostBadgeText}>
              🔐 Powered by FROST Threshold Signatures
            </Text>
          </View>
        )}
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
  animationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  loaderContainer: {
    alignItems: 'center',
  },
  dkgIndicator: {
    marginTop: 12,
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dkgText: {
    color: '#4ECDC4',
    fontSize: 12,
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
    marginBottom: 32,
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
  chainBadge: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  chainText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  mpcHighlight: {
    color: '#4ECDC4',
  },
  participantsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  participantsTitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  participantItem: {
    fontSize: 13,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  frostBadge: {
    marginTop: 24,
    alignItems: 'center',
  },
  frostBadgeText: {
    color: '#4ECDC4',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default CreatingVaultScreen;