// /**
//  * CROSS-CHAIN SWAP SCREEN
//  * 
//  * SOL ↔ ZEC swaps with proper status tracking
//  * Uses /api/fund/bridge endpoints
//  */

// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
//   ScrollView,
//   Alert,
//   Platform,
// } from 'react-native';
// import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
// import api from '../services/api';

// // ============================================
// // TYPES
// // ============================================

// interface VaultData {
//   vault_id: string;
//   vault_name: string;
//   vault_type?: string;
//   sol?: { address: string };
//   zec?: { address: string };
//   address?: string;
// }

// type SwapRouteParams = {
//   Swap: {
//     vault?: VaultData;
//   };
// };

// type SwapStatus = 'idle' | 'quoting' | 'confirming' | 'executing' | 'pending' | 'success' | 'error';

// // ============================================
// // MAIN COMPONENT
// // ============================================

// export default function SwapScreen() {
//   const navigation = useNavigation();
//   const route = useRoute<RouteProp<SwapRouteParams, 'Swap'>>();
//   const vault = route.params?.vault as VaultData | undefined;

//   // State
//   const [direction, setDirection] = useState<'SOL_TO_ZEC' | 'ZEC_TO_SOL'>('SOL_TO_ZEC');
//   const [amount, setAmount] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState<SwapStatus>('idle');
//   const [statusMessage, setStatusMessage] = useState('');
//   const [quote, setQuote] = useState<any>(null);
//   const [result, setResult] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [swapId, setSwapId] = useState<string | null>(null);
  
//   // Polling ref
// const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   // Derived values
//   const fromAsset = direction === 'SOL_TO_ZEC' ? 'SOL' : 'ZEC';
//   const toAsset = direction === 'SOL_TO_ZEC' ? 'ZEC' : 'SOL';
//   const fromAddress = direction === 'SOL_TO_ZEC' 
//     ? (vault?.sol?.address || vault?.address || '') 
//     : (vault?.zec?.address || '');
//   const toAddress = direction === 'SOL_TO_ZEC' 
//     ? (vault?.zec?.address || '') 
//     : (vault?.sol?.address || vault?.address || '');

//   // Cleanup polling on unmount
//   useEffect(() => {
//     return () => {
//       if (pollIntervalRef.current) {
//         clearInterval(pollIntervalRef.current);
//       }
//     };
//   }, []);

//   // ============================================
//   // TOGGLE DIRECTION
//   // ============================================

//   const toggleDirection = () => {
//     setDirection(prev => prev === 'SOL_TO_ZEC' ? 'ZEC_TO_SOL' : 'SOL_TO_ZEC');
//     setQuote(null);
//     setError(null);
//   };

//   // ============================================
//   // GET QUOTE
//   // ============================================

//   const getQuote = async () => {
//     if (!amount || parseFloat(amount) <= 0) {
//       Alert.alert('Error', 'Please enter a valid amount');
//       return;
//     }

//     if (!vault?.vault_id) {
//       Alert.alert('Error', 'No wallet selected');
//       return;
//     }

//     if (!fromAddress || !toAddress) {
//       Alert.alert('Error', 'Wallet missing SOL or ZEC address');
//       return;
//     }

//     setLoading(true);
//     setStatus('quoting');
//     setStatusMessage('Getting best rate...');
//     setError(null);

//     try {
//       const response = await api.getSwapQuote(vault, direction, parseFloat(amount));

//       if (response.success) {
//         setQuote(response.quote);
//         setStatus('confirming');
//         setStatusMessage('');
//       } else {
//         setError(response.error || 'Failed to get quote');
//         setStatus('error');
//       }
//     } catch (err: any) {
//       setError(err.message || 'Network error');
//       setStatus('error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ============================================
//   // EXECUTE SWAP
//   // ============================================

//   const executeSwap = async () => {
//     if (!quote || !vault?.vault_id) return;

//     setLoading(true);
//     setStatus('executing');
//     setStatusMessage('Initiating swap...');
//     setError(null);

//     try {
//       const response = await api.executeSwap(vault, direction, parseFloat(amount));

//       if (response.success) {
//         // Check if swap is pending or completed
//         if (response.status === 'pending' || response.status === 'awaiting_deposit' || response.swap_id) {
//           setSwapId(response.swap_id || response.intent_id);
//           setStatus('pending');
//           setStatusMessage('Swap in progress...');
          
//           // Start polling for status
//           startStatusPolling(response.swap_id || response.intent_id);
//         } else if (response.status === 'completed' || response.tx_hash) {
//           // Swap completed immediately
//           setResult(response);
//           setStatus('success');
//           setStatusMessage('');
//         } else {
//           // Generic success
//           setResult(response);
//           setStatus('success');
//           setStatusMessage('');
//         }
//       } else {
//         setError(response.error || 'Swap failed');
//         setStatus('error');
//       }
//     } catch (err: any) {
//       setError(err.message || 'Network error');
//       setStatus('error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ============================================
//   // POLL FOR STATUS
//   // ============================================

//   const startStatusPolling = (id: string) => {
//     let attempts = 0;
//     const maxAttempts = 60; // 5 minutes max (5s intervals)

//     pollIntervalRef.current = setInterval(async () => {
//       attempts++;
      
//       try {
//         const statusResponse = await api.getSwapStatus(id);
        
//         console.log('[Swap] Status poll:', statusResponse);

//         if (statusResponse.status === 'completed' || statusResponse.status === 'success') {
//           clearInterval(pollIntervalRef.current!);
//           setResult(statusResponse);
//           setStatus('success');
//           setStatusMessage('');
//         } else if (statusResponse.status === 'failed' || statusResponse.status === 'error') {
//           clearInterval(pollIntervalRef.current!);
//           setError(statusResponse.error || 'Swap failed');
//           setStatus('error');
//         } else {
//           // Still pending
//           setStatusMessage(`Swap in progress... (${attempts * 5}s)`);
//         }
//       } catch (err) {
//         console.error('[Swap] Status poll error:', err);
//       }

//       if (attempts >= maxAttempts) {
//         clearInterval(pollIntervalRef.current!);
//         setStatus('success'); // Assume success after timeout
//         setStatusMessage('Swap submitted. Check your balance shortly.');
//       }
//     }, 5000); // Poll every 5 seconds
//   };

//   // ============================================
//   // RESET
//   // ============================================

//   const reset = () => {
//     if (pollIntervalRef.current) {
//       clearInterval(pollIntervalRef.current);
//     }
//     setStatus('idle');
//     setStatusMessage('');
//     setQuote(null);
//     setResult(null);
//     setError(null);
//     setAmount('');
//     setSwapId(null);
//   };

//   // ============================================
//   // RENDER: PENDING STATE
//   // ============================================

//   if (status === 'pending' || status === 'executing') {
//     return (
//       <View style={styles.container}>
//         <View style={styles.pendingContainer}>
//           <ActivityIndicator size="large" color="#8b5cf6" />
//           <Text style={styles.pendingTitle}>
//             {status === 'executing' ? 'Initiating Swap...' : 'Swap In Progress'}
//           </Text>
//           <Text style={styles.pendingMessage}>{statusMessage}</Text>
          
//           <View style={styles.pendingCard}>
//             <Text style={styles.pendingDetail}>
//               {amount} {fromAsset} → {quote?.output_amount?.toFixed(6) || '...'} {toAsset}
//             </Text>
//             {swapId && (
//               <Text style={styles.swapId}>ID: {swapId.slice(0, 16)}...</Text>
//             )}
//           </View>

//           <Text style={styles.pendingNote}>
//             Please wait. This may take 30-120 seconds.{'\n'}
//             Do not close the app.
//           </Text>
//         </View>
//       </View>
//     );
//   }

//   // ============================================
//   // RENDER: SUCCESS
//   // ============================================

//   if (status === 'success') {
//     return (
//       <View style={styles.container}>
//         <View style={styles.successContainer}>
//           <Text style={styles.successEmoji}>✅</Text>
//           <Text style={styles.successTitle}>Swap Complete!</Text>

//           <View style={styles.resultCard}>
//             <View style={styles.resultRow}>
//               <Text style={styles.resultLabel}>Sent</Text>
//               <Text style={styles.resultValue}>
//                 {result?.input?.amount || amount} {fromAsset}
//               </Text>
//             </View>
            
//             <Text style={styles.arrow}>↓</Text>
            
//             <View style={styles.resultRow}>
//               <Text style={styles.resultLabel}>Received</Text>
//               <Text style={[styles.resultValue, styles.highlight]}>
//                 ~{result?.output?.estimated_amount?.toFixed(6) || 
//                   result?.estimated_output?.toFixed(6) || 
//                   quote?.output_amount?.toFixed(6)} {toAsset}
//               </Text>
//             </View>

//             {(result?.tx_hash || result?.swap_id) && (
//               <Text style={styles.txHash}>
//                 TX: {(result.tx_hash || result.swap_id).slice(0, 20)}...
//               </Text>
//             )}

//             {result?.message && (
//               <Text style={styles.statusMessage}>{result.message}</Text>
//             )}
//           </View>

//           <TouchableOpacity style={styles.primaryButton} onPress={reset}>
//             <Text style={styles.primaryButtonText}>New Swap</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
//             <Text style={styles.secondaryButtonText}>← Back to Wallet</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   // ============================================
//   // RENDER: MAIN
//   // ============================================

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.content}>
//       {/* Header */}
//       <Text style={styles.title}>Swap</Text>
//       {vault && (
//         <Text style={styles.walletName}>{vault.vault_name}</Text>
//       )}

//       {/* FROM */}
//       <View style={styles.swapBox}>
//         <Text style={styles.label}>From</Text>
//         <View style={styles.assetRow}>
//           <Text style={styles.assetIcon}>
//             {fromAsset === 'SOL' ? '◎' : '🛡️'}
//           </Text>
//           <Text style={styles.assetName}>{fromAsset}</Text>
//         </View>
//         <TextInput
//           style={styles.amountInput}
//           value={amount}
//           onChangeText={(text) => {
//             setAmount(text);
//             setQuote(null);
//             setStatus('idle');
//           }}
//           placeholder="0.00"
//           placeholderTextColor="#666"
//           keyboardType="decimal-pad"
//           editable={status === 'idle' || status === 'confirming' || status === 'error'}
//         />
//         <Text style={styles.addressText}>
//           {fromAddress ? `${fromAddress.slice(0, 20)}...` : 'No address'}
//         </Text>
//       </View>

//       {/* SWAP DIRECTION */}
//       <TouchableOpacity 
//         style={styles.swapDirectionBtn} 
//         onPress={toggleDirection}
//         disabled={loading}
//       >
//         <Text style={styles.swapDirectionIcon}>⇅</Text>
//       </TouchableOpacity>

//       {/* TO */}
//       <View style={styles.swapBox}>
//         <Text style={styles.label}>To</Text>
//         <View style={styles.assetRow}>
//           <Text style={styles.assetIcon}>
//             {toAsset === 'SOL' ? '◎' : '🛡️'}
//           </Text>
//           <Text style={styles.assetName}>{toAsset}</Text>
//         </View>
//         <View style={styles.receiveBox}>
//           <Text style={styles.receiveAmount}>
//             {quote ? quote.output_amount?.toFixed(6) : '—'}
//           </Text>
//         </View>
//         <Text style={styles.addressText}>
//           {toAddress ? `${toAddress.slice(0, 20)}...` : 'No address'}
//         </Text>
//       </View>

//       {/* QUOTE DETAILS */}
//       {quote && (
//         <View style={styles.quoteCard}>
//           <View style={styles.quoteRow}>
//             <Text style={styles.quoteLabel}>Rate</Text>
//             <Text style={styles.quoteValue}>
//               1 {fromAsset} ≈ {quote.exchange_rate?.toFixed(4)} {toAsset}
//             </Text>
//           </View>
//           <View style={styles.quoteRow}>
//             <Text style={styles.quoteLabel}>Fee</Text>
//             <Text style={styles.quoteValue}>{quote.fee || '~0.5%'}</Text>
//           </View>
//           <View style={styles.quoteRow}>
//             <Text style={styles.quoteLabel}>Time</Text>
//             <Text style={styles.quoteValue}>~{quote.time_estimate || 60}s</Text>
//           </View>
//           <View style={styles.quoteRow}>
//             <Text style={styles.quoteLabel}>Provider</Text>
//             <Text style={[styles.quoteValue, { color: '#8b5cf6' }]}>
//               {quote.provider || 'NEAR Intents'}
//             </Text>
//           </View>
//         </View>
//       )}

//       {/* ERROR */}
//       {error && (
//         <View style={styles.errorBox}>
//           <Text style={styles.errorText}>❌ {error}</Text>
//         </View>
//       )}

//       {/* STATUS MESSAGE */}
//       {statusMessage && status === 'quoting' && (
//         <View style={styles.statusBox}>
//           <ActivityIndicator size="small" color="#8b5cf6" />
//           <Text style={styles.statusText}>{statusMessage}</Text>
//         </View>
//       )}

//       {/* ACTION BUTTON */}
//       <TouchableOpacity
//         style={[
//           styles.primaryButton, 
//           (loading || !amount || !fromAddress || !toAddress) && styles.buttonDisabled
//         ]}
//         onPress={quote && status === 'confirming' ? executeSwap : getQuote}
//         disabled={loading || !amount || !fromAddress || !toAddress}
//       >
//         {loading ? (
//           <View style={styles.loadingRow}>
//             <ActivityIndicator color="#000" size="small" />
//             <Text style={styles.loadingText}>
//               {status === 'quoting' ? 'Getting quote...' : 'Processing...'}
//             </Text>
//           </View>
//         ) : (
//           <Text style={styles.primaryButtonText}>
//             {quote && status === 'confirming' 
//               ? `Swap ${amount} ${fromAsset} → ${toAsset}` 
//               : 'Get Quote'}
//           </Text>
//         )}
//       </TouchableOpacity>

//       {/* Warning for missing addresses */}
//       {(!fromAddress || !toAddress) && (
//         <View style={styles.warningBox}>
//           <Text style={styles.warningText}>
//             ⚠️ Wallet missing {!fromAddress && !toAddress ? 'both' : !fromAddress ? fromAsset : toAsset} address
//           </Text>
//         </View>
//       )}

//       {/* INFO */}
//       <View style={styles.infoBox}>
//         <Text style={styles.infoText}>
//           🔐 Cross-chain swap via NEAR Intents{'\n'}
//           ⏱️ ~30-120 seconds to complete{'\n'}
//           💰 ~0.5% total fee
//         </Text>
//       </View>
//     </ScrollView>
//   );
// }

// // ============================================
// // STYLES
// // ============================================

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0a0a0a',
//   },
//   content: {
//     padding: 20,
//     paddingBottom: 40,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 4,
//   },
//   walletName: {
//     fontSize: 14,
//     color: '#8b5cf6',
//     marginBottom: 24,
//   },
//   swapBox: {
//     backgroundColor: '#1a1a1a',
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 8,
//   },
//   label: {
//     fontSize: 12,
//     color: '#666',
//     textTransform: 'uppercase',
//     marginBottom: 12,
//   },
//   assetRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   assetIcon: {
//     fontSize: 24,
//     marginRight: 10,
//   },
//   assetName: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#fff',
//   },
//   amountInput: {
//     fontSize: 32,
//     fontWeight: '600',
//     color: '#fff',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//   },
//   addressText: {
//     fontSize: 11,
//     color: '#555',
//     marginTop: 8,
//     fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
//   },
//   swapDirectionBtn: {
//     alignSelf: 'center',
//     backgroundColor: '#333',
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: -16,
//     zIndex: 10,
//     borderWidth: 3,
//     borderColor: '#0a0a0a',
//   },
//   swapDirectionIcon: {
//     fontSize: 22,
//     color: '#8b5cf6',
//   },
//   receiveBox: {
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//   },
//   receiveAmount: {
//     fontSize: 32,
//     fontWeight: '600',
//     color: '#8b5cf6',
//   },
//   quoteCard: {
//     backgroundColor: '#1a1a1a',
//     borderRadius: 12,
//     padding: 16,
//     marginTop: 16,
//   },
//   quoteRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   quoteLabel: {
//     color: '#666',
//     fontSize: 14,
//   },
//   quoteValue: {
//     color: '#fff',
//     fontSize: 14,
//   },
//   errorBox: {
//     backgroundColor: 'rgba(239, 68, 68, 0.1)',
//     borderRadius: 12,
//     padding: 16,
//     marginTop: 16,
//   },
//   errorText: {
//     color: '#ef4444',
//     textAlign: 'center',
//   },
//   warningBox: {
//     backgroundColor: 'rgba(234, 179, 8, 0.1)',
//     borderRadius: 12,
//     padding: 16,
//     marginTop: 16,
//   },
//   warningText: {
//     color: '#eab308',
//     textAlign: 'center',
//     fontSize: 13,
//   },
//   statusBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 12,
//     marginTop: 12,
//   },
//   statusText: {
//     color: '#8b5cf6',
//     marginLeft: 8,
//   },
//   primaryButton: {
//     backgroundColor: '#8b5cf6',
//     borderRadius: 12,
//     padding: 18,
//     alignItems: 'center',
//     marginTop: 24,
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   primaryButtonText: {
//     color: '#000',
//     fontSize: 18,
//     fontWeight: '700',
//   },
//   loadingRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   loadingText: {
//     color: '#000',
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 10,
//   },
//   infoBox: {
//     marginTop: 24,
//     padding: 16,
//     backgroundColor: '#111',
//     borderRadius: 12,
//   },
//   infoText: {
//     color: '#666',
//     fontSize: 13,
//     lineHeight: 22,
//     textAlign: 'center',
//   },

//   // Pending
//   pendingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 24,
//   },
//   pendingTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginTop: 24,
//     marginBottom: 8,
//   },
//   pendingMessage: {
//     color: '#8b5cf6',
//     fontSize: 16,
//     marginBottom: 24,
//   },
//   pendingCard: {
//     backgroundColor: '#1a1a1a',
//     borderRadius: 16,
//     padding: 24,
//     width: '100%',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   pendingDetail: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   swapId: {
//     color: '#555',
//     fontSize: 11,
//     marginTop: 12,
//     fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
//   },
//   pendingNote: {
//     color: '#666',
//     fontSize: 13,
//     textAlign: 'center',
//     lineHeight: 20,
//   },

//   // Success
//   successContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 24,
//   },
//   successEmoji: {
//     fontSize: 64,
//     marginBottom: 16,
//   },
//   successTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 24,
//   },
//   resultCard: {
//     backgroundColor: '#1a1a1a',
//     borderRadius: 16,
//     padding: 24,
//     width: '100%',
//     marginBottom: 24,
//     alignItems: 'center',
//   },
//   resultRow: {
//     alignItems: 'center',
//     marginVertical: 8,
//   },
//   resultLabel: {
//     color: '#666',
//     fontSize: 14,
//     marginBottom: 4,
//   },
//   resultValue: {
//     color: '#fff',
//     fontSize: 22,
//     fontWeight: '600',
//   },
//   highlight: {
//     color: '#8b5cf6',
//   },
//   arrow: {
//     fontSize: 24,
//     color: '#8b5cf6',
//     marginVertical: 8,
//   },
//   txHash: {
//     color: '#555',
//     fontSize: 11,
//     marginTop: 16,
//     fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
//   },
//   statusMessage: {
//     color: '#888',
//     fontSize: 12,
//     marginTop: 12,
//     textAlign: 'center',
//   },
//   secondaryButton: {
//     padding: 12,
//     marginTop: 8,
//   },
//   secondaryButtonText: {
//     color: '#666',
//     fontSize: 14,
//   },
// });

/**
 * CROSS-CHAIN SWAP SCREEN
 * 
 * SOL ↔ ZEC swaps with proper status tracking
 * Uses /api/fund/bridge endpoints
 * 
 * Styled to match VoltWallet premium theme
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import api from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================
// TYPES
// ============================================

interface VaultData {
  vault_id: string;
  vault_name: string;
  vault_type?: string;
  sol?: { address: string };
  zec?: { address: string };
  address?: string;
}

type SwapRouteParams = {
  Swap: {
    vault?: VaultData;
  };
};

type SwapStatus = 'idle' | 'quoting' | 'confirming' | 'executing' | 'pending' | 'success' | 'error';

// ============================================
// MAIN COMPONENT
// ============================================

export default function SwapScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<SwapRouteParams, 'Swap'>>();
  const vault = route.params?.vault as VaultData | undefined;

  // State
  const [direction, setDirection] = useState<'SOL_TO_ZEC' | 'ZEC_TO_SOL'>('SOL_TO_ZEC');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<SwapStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [quote, setQuote] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [swapId, setSwapId] = useState<string | null>(null);
  
  // Polling ref
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Derived values
  const fromAsset = direction === 'SOL_TO_ZEC' ? 'SOL' : 'ZEC';
  const toAsset = direction === 'SOL_TO_ZEC' ? 'ZEC' : 'SOL';
  const fromAddress = direction === 'SOL_TO_ZEC' 
    ? (vault?.sol?.address || vault?.address || '') 
    : (vault?.zec?.address || '');
  const toAddress = direction === 'SOL_TO_ZEC' 
    ? (vault?.zec?.address || '') 
    : (vault?.sol?.address || vault?.address || '');

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // ============================================
  // TOGGLE DIRECTION
  // ============================================

  const toggleDirection = () => {
    setDirection(prev => prev === 'SOL_TO_ZEC' ? 'ZEC_TO_SOL' : 'SOL_TO_ZEC');
    setQuote(null);
    setError(null);
  };

  // ============================================
  // GET QUOTE
  // ============================================

  const getQuote = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!vault?.vault_id) {
      Alert.alert('Error', 'No wallet selected');
      return;
    }

    if (!fromAddress || !toAddress) {
      Alert.alert('Error', 'Wallet missing SOL or ZEC address');
      return;
    }

    setLoading(true);
    setStatus('quoting');
    setStatusMessage('Getting best rate...');
    setError(null);

    try {
      const response = await api.getSwapQuote(vault, direction, parseFloat(amount));

      if (response.success) {
        setQuote(response.quote);
        setStatus('confirming');
        setStatusMessage('');
      } else {
        setError(response.error || 'Failed to get quote');
        setStatus('error');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // EXECUTE SWAP
  // ============================================

  const executeSwap = async () => {
    if (!quote || !vault?.vault_id) return;

    setLoading(true);
    setStatus('executing');
    setStatusMessage('Initiating swap...');
    setError(null);

    try {
      const response = await api.executeSwap(vault, direction, parseFloat(amount));

      if (response.success) {
        if (response.status === 'pending' || response.status === 'awaiting_deposit' || response.swap_id) {
          setSwapId(response.swap_id || response.intent_id);
          setStatus('pending');
          setStatusMessage('Swap in progress...');
          startStatusPolling(response.swap_id || response.intent_id);
        } else if (response.status === 'completed' || response.tx_hash) {
          setResult(response);
          setStatus('success');
          setStatusMessage('');
        } else {
          setResult(response);
          setStatus('success');
          setStatusMessage('');
        }
      } else {
        setError(response.error || 'Swap failed');
        setStatus('error');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // POLL FOR STATUS
  // ============================================

  const startStatusPolling = (id: string) => {
    let attempts = 0;
    const maxAttempts = 60;

    pollIntervalRef.current = setInterval(async () => {
      attempts++;
      
      try {
        const statusResponse = await api.getSwapStatus(id);
        
        if (statusResponse.status === 'completed' || statusResponse.status === 'success') {
          clearInterval(pollIntervalRef.current!);
          setResult(statusResponse);
          setStatus('success');
          setStatusMessage('');
        } else if (statusResponse.status === 'failed' || statusResponse.status === 'error') {
          clearInterval(pollIntervalRef.current!);
          setError(statusResponse.error || 'Swap failed');
          setStatus('error');
        } else {
          setStatusMessage(`Swap in progress... (${attempts * 5}s)`);
        }
      } catch (err) {
        console.error('[Swap] Status poll error:', err);
      }

      if (attempts >= maxAttempts) {
        clearInterval(pollIntervalRef.current!);
        setStatus('success');
        setStatusMessage('Swap submitted. Check your balance shortly.');
      }
    }, 5000);
  };

  // ============================================
  // RESET
  // ============================================

  const reset = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    setStatus('idle');
    setStatusMessage('');
    setQuote(null);
    setResult(null);
    setError(null);
    setAmount('');
    setSwapId(null);
  };

  // ============================================
  // RENDER: PENDING STATE
  // ============================================

  if (status === 'pending' || status === 'executing') {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#1E3A5F', '#0F2744', '#0A1628']}
          style={styles.glowGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.pendingContainer}>
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#4ECDC4" />
            </View>
            <Text style={styles.pendingTitle}>
              {status === 'executing' ? 'Initiating Swap...' : 'Swap In Progress'}
            </Text>
            <Text style={styles.pendingMessage}>{statusMessage}</Text>
            
            <View style={styles.pendingCard}>
              <View style={styles.swapPreview}>
                <View style={styles.previewAsset}>
                  <View style={[styles.assetIconCircle, fromAsset === 'SOL' ? styles.solBg : styles.zecBg]}>
                    <Text style={styles.assetIconText}>{fromAsset === 'SOL' ? '◎' : 'Z'}</Text>
                  </View>
                  <Text style={styles.previewAmount}>{amount} {fromAsset}</Text>
                </View>
                <Text style={styles.swapArrow}>→</Text>
                <View style={styles.previewAsset}>
                  <View style={[styles.assetIconCircle, toAsset === 'SOL' ? styles.solBg : styles.zecBg]}>
                    <Text style={styles.assetIconText}>{toAsset === 'SOL' ? '◎' : 'Z'}</Text>
                  </View>
                  <Text style={styles.previewAmount}>{quote?.output_amount?.toFixed(4) || '...'} {toAsset}</Text>
                </View>
              </View>
              {swapId && (
                <Text style={styles.swapId}>ID: {swapId.slice(0, 16)}...</Text>
              )}
            </View>

            <Text style={styles.pendingNote}>
              Please wait. This may take 30-120 seconds.{'\n'}
              Do not close the app.
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // ============================================
  // RENDER: SUCCESS
  // ============================================

  if (status === 'success') {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#1E3A5F', '#0F2744', '#0A1628']}
          style={styles.glowGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.successContainer}>
            <View style={styles.successIconContainer}>
              <Text style={styles.successIcon}>✓</Text>
            </View>
            <Text style={styles.successTitle}>Swap Complete!</Text>

            <View style={styles.resultCard}>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Sent</Text>
                <View style={styles.resultValueRow}>
                  <View style={[styles.assetIconSmall, fromAsset === 'SOL' ? styles.solBg : styles.zecBg]}>
                    <Text style={styles.assetIconTextSmall}>{fromAsset === 'SOL' ? '◎' : 'Z'}</Text>
                  </View>
                  <Text style={styles.resultValue}>
                    {result?.input?.amount || amount} {fromAsset}
                  </Text>
                </View>
              </View>
              
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <View style={styles.arrowCircle}>
                  <Text style={styles.arrowDown}>↓</Text>
                </View>
                <View style={styles.dividerLine} />
              </View>
              
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Received</Text>
                <View style={styles.resultValueRow}>
                  <View style={[styles.assetIconSmall, toAsset === 'SOL' ? styles.solBg : styles.zecBg]}>
                    <Text style={styles.assetIconTextSmall}>{toAsset === 'SOL' ? '◎' : 'Z'}</Text>
                  </View>
                  <Text style={[styles.resultValue, styles.highlight]}>
                    ~{result?.output?.estimated_amount?.toFixed(6) || 
                      result?.estimated_output?.toFixed(6) || 
                      quote?.output_amount?.toFixed(6)} {toAsset}
                  </Text>
                </View>
              </View>

              {(result?.tx_hash || result?.swap_id) && (
                <View style={styles.txContainer}>
                  <Text style={styles.txLabel}>Transaction</Text>
                  <Text style={styles.txHash}>
                    {(result.tx_hash || result.swap_id).slice(0, 24)}...
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={reset}>
              <Text style={styles.primaryButtonText}>New Swap</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
              <Text style={styles.secondaryButtonText}>← Back to Wallet</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // ============================================
  // RENDER: MAIN
  // ============================================

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#1E3A5F', '#0F2744', '#0A1628']}
        style={styles.glowGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.title}>Swap</Text>
              {vault && (
                <View style={styles.walletBadge}>
                  <Text style={styles.walletIcon}>⚡</Text>
                  <Text style={styles.walletName}>{vault.vault_name}</Text>
                </View>
              )}
            </View>
            <View style={styles.headerSpacer} />
          </View>

          {/* FROM Card */}
          <View style={styles.swapCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>From</Text>
              <TouchableOpacity style={styles.maxButton}>
                <Text style={styles.maxButtonText}>MAX</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.assetRow}>
              <View style={[styles.assetIconCircle, fromAsset === 'SOL' ? styles.solBg : styles.zecBg]}>
                <Text style={styles.assetIconText}>{fromAsset === 'SOL' ? '◎' : 'Z'}</Text>
              </View>
              <View style={styles.assetInfo}>
                <Text style={styles.assetName}>{fromAsset === 'SOL' ? 'Solana' : 'Zcash'}</Text>
                <Text style={styles.assetSymbol}>{fromAsset}</Text>
              </View>
            </View>

            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={(text) => {
                setAmount(text);
                setQuote(null);
                setStatus('idle');
              }}
              placeholder="0.00"
              placeholderTextColor="rgba(255,255,255,0.3)"
              keyboardType="decimal-pad"
              editable={status === 'idle' || status === 'confirming' || status === 'error'}
            />
            
            <Text style={styles.addressText}>
              {fromAddress ? `${fromAddress.slice(0, 12)}...${fromAddress.slice(-8)}` : 'No address'}
            </Text>
          </View>

          {/* SWAP DIRECTION BUTTON */}
          <View style={styles.swapButtonContainer}>
            <TouchableOpacity 
              style={styles.swapDirectionBtn} 
              onPress={toggleDirection}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={styles.swapDirectionIcon}>⇅</Text>
            </TouchableOpacity>
          </View>

          {/* TO Card */}
          <View style={styles.swapCard}>
            <Text style={styles.cardLabel}>To</Text>
            
            <View style={styles.assetRow}>
              <View style={[styles.assetIconCircle, toAsset === 'SOL' ? styles.solBg : styles.zecBg]}>
                <Text style={styles.assetIconText}>{toAsset === 'SOL' ? '◎' : 'Z'}</Text>
              </View>
              <View style={styles.assetInfo}>
                <Text style={styles.assetName}>{toAsset === 'SOL' ? 'Solana' : 'Zcash'}</Text>
                <Text style={styles.assetSymbol}>{toAsset}</Text>
              </View>
              {toAsset === 'ZEC' && (
                <View style={styles.shieldedBadge}>
                  <Text style={styles.shieldedText}>◈ Shielded</Text>
                </View>
              )}
            </View>

            <View style={styles.receiveBox}>
              <Text style={styles.receiveAmount}>
                {quote ? quote.output_amount?.toFixed(6) : '0.00'}
              </Text>
            </View>
            
            <Text style={styles.addressText}>
              {toAddress ? `${toAddress.slice(0, 12)}...${toAddress.slice(-8)}` : 'No address'}
            </Text>
          </View>

          {/* QUOTE DETAILS */}
          {quote && (
            <View style={styles.quoteCard}>
              <View style={styles.quoteRow}>
                <Text style={styles.quoteLabel}>Rate</Text>
                <Text style={styles.quoteValue}>
                  1 {fromAsset} ≈ {quote.exchange_rate?.toFixed(4)} {toAsset}
                </Text>
              </View>
              <View style={styles.quoteDivider} />
              <View style={styles.quoteRow}>
                <Text style={styles.quoteLabel}>Fee</Text>
                <Text style={styles.quoteValue}>{quote.fee || '~0.5%'}</Text>
              </View>
              <View style={styles.quoteDivider} />
              <View style={styles.quoteRow}>
                <Text style={styles.quoteLabel}>Est. Time</Text>
                <Text style={styles.quoteValue}>~{quote.time_estimate || 60}s</Text>
              </View>
              <View style={styles.quoteDivider} />
              <View style={styles.quoteRow}>
                <Text style={styles.quoteLabel}>Provider</Text>
                <Text style={[styles.quoteValue, styles.providerText]}>
                  {quote.provider || 'NEAR Intents'}
                </Text>
              </View>
            </View>
          )}

          {/* ERROR */}
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorIcon}>⚠</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* STATUS MESSAGE */}
          {statusMessage && status === 'quoting' && (
            <View style={styles.statusBox}>
              <ActivityIndicator size="small" color="#4ECDC4" />
              <Text style={styles.statusText}>{statusMessage}</Text>
            </View>
          )}

          {/* ACTION BUTTON */}
          <TouchableOpacity
            style={[
              styles.primaryButton, 
              (loading || !amount || !fromAddress || !toAddress) && styles.buttonDisabled
            ]}
            onPress={quote && status === 'confirming' ? executeSwap : getQuote}
            disabled={loading || !amount || !fromAddress || !toAddress}
            activeOpacity={0.8}
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#0A1628" size="small" />
                <Text style={styles.loadingText}>
                  {status === 'quoting' ? 'Getting quote...' : 'Processing...'}
                </Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonText}>
                {quote && status === 'confirming' 
                  ? `Swap ${amount} ${fromAsset}` 
                  : 'Get Quote'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Warning for missing addresses */}
          {(!fromAddress || !toAddress) && (
            <View style={styles.warningBox}>
              <Text style={styles.warningIcon}>⚠</Text>
              <Text style={styles.warningText}>
                Wallet missing {!fromAddress && !toAddress ? 'both' : !fromAddress ? fromAsset : toAsset} address
              </Text>
            </View>
          )}

          {/* INFO */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🔐</Text>
              <Text style={styles.infoText}>Cross-chain swap via NEAR Intents</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>⏱️</Text>
              <Text style={styles.infoText}>~30-120 seconds to complete</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>💰</Text>
              <Text style={styles.infoText}>~0.5% total fee</Text>
            </View>
          </View>

          {/* Security Footer */}
          <View style={styles.securityFooter}>
            <Text style={styles.securityText}>◈ Powered by ZkAGI 2025</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ============================================
// STYLES - VoltWallet Premium Theme
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  glowGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 400,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  backIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  walletBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.3)',
  },
  walletIcon: {
    fontSize: 12,
    color: '#FBBF24',
    marginRight: 6,
  },
  walletName: {
    fontSize: 13,
    color: '#4ECDC4',
    fontWeight: '500',
  },

  // Swap Cards
  swapCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 13,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  maxButton: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  maxButtonText: {
    fontSize: 12,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  assetIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  solBg: {
    backgroundColor: '#9945FF',
  },
  zecBg: {
    backgroundColor: '#F4B728',
  },
  assetIconText: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  assetSymbol: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  shieldedBadge: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  shieldedText: {
    fontSize: 11,
    color: '#4ECDC4',
    fontWeight: '500',
  },
  amountInput: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.2)',
  },
  receiveBox: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.2)',
  },
  receiveAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#4ECDC4',
  },
  addressText: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },

  // Swap Direction Button
  swapButtonContainer: {
    alignItems: 'center',
    marginVertical: -20,
    zIndex: 10,
  },
  swapDirectionBtn: {
    width: 52,
    height: 52,
    backgroundColor: '#1E3A5F',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#0A1628',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  swapDirectionIcon: {
    fontSize: 24,
    color: '#4ECDC4',
    fontWeight: 'bold',
  },

  // Quote Card
  quoteCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  quoteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  quoteDivider: {
    height: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  quoteLabel: {
    color: '#6B7280',
    fontSize: 14,
  },
  quoteValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  providerText: {
    color: '#4ECDC4',
  },

  // Error Box
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorIcon: {
    fontSize: 18,
    color: '#EF4444',
    marginRight: 10,
  },
  errorText: {
    color: '#EF4444',
    flex: 1,
    fontSize: 14,
  },

  // Warning Box
  warningBox: {
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.3)',
  },
  warningIcon: {
    fontSize: 18,
    color: '#EAB308',
    marginRight: 10,
  },
  warningText: {
    color: '#EAB308',
    flex: 1,
    fontSize: 14,
  },

  // Status Box
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 16,
  },
  statusText: {
    color: '#4ECDC4',
    marginLeft: 10,
    fontSize: 15,
  },

  // Primary Button
  primaryButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#0A1628',
    fontSize: 17,
    fontWeight: '700',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: '#0A1628',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },

  // Info Card
  infoCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.15)',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  infoText: {
    color: '#6B7280',
    fontSize: 14,
  },

  // Security Footer
  securityFooter: {
    marginTop: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  securityText: {
    fontSize: 12,
    color: '#4B5563',
  },

  // Pending State
  pendingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loaderContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(78, 205, 196, 0.3)',
    marginBottom: 24,
  },
  pendingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  pendingMessage: {
    color: '#4ECDC4',
    fontSize: 16,
    marginBottom: 32,
  },
  pendingCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  swapPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewAsset: {
    alignItems: 'center',
  },
  previewAmount: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  swapArrow: {
    fontSize: 24,
    color: '#4ECDC4',
    marginHorizontal: 20,
  },
  swapId: {
    color: '#4B5563',
    fontSize: 11,
    marginTop: 20,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  pendingNote: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Success State
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4ECDC4',
    marginBottom: 24,
  },
  successIcon: {
    fontSize: 36,
    color: '#4ECDC4',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 32,
  },
  resultCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  resultRow: {
    marginVertical: 8,
  },
  resultLabel: {
    color: '#6B7280',
    fontSize: 13,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resultValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetIconSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  assetIconTextSmall: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  resultValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
  },
  highlight: {
    color: '#4ECDC4',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  arrowCircle: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  arrowDown: {
    fontSize: 18,
    color: '#4ECDC4',
  },
  txContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(59, 130, 246, 0.15)',
  },
  txLabel: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 4,
  },
  txHash: {
    color: '#4B5563',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  secondaryButton: {
    padding: 16,
    marginTop: 8,
  },
  secondaryButtonText: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '500',
  },
});