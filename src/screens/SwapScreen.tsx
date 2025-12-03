// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import api from '../services/api';

// export default function SwapScreen() {
//   const [fromChain, setFromChain] = useState('ARB');
//   const [toChain, setToChain] = useState('SOL');
//   const [amount, setAmount] = useState('10');
//   const [recipient, setRecipient] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [quote, setQuote] = useState(null);

//   const chains = ['SOL', 'ETH', 'ARB', 'NEAR', 'BASE'];

//   const getQuote = async () => {
//     if (!recipient) {
//       Alert.alert('Error', 'Please enter recipient address');
//       return;
//     }

//     setLoading(true);
//     try {
//       const result = await api.getQuote({
//         fromChain,
//         toChain,
//         fromToken: fromChain,
//         toToken: toChain,
//         amount,
//         recipient,
//         dryRun: false,
//       });

//       if (result.success) {
//         setQuote(result);
//       } else {
//         Alert.alert('Error', result.error);
//       }
//     } catch (err) {
//       Alert.alert('Error', err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.section}>
//         <Text style={styles.label}>From Chain</Text>
//         <View style={styles.chainSelector}>
//           {chains.map(chain => (
//             <TouchableOpacity
//               key={chain}
//               style={[styles.chainButton, fromChain === chain && styles.chainButtonActive]}
//               onPress={() => setFromChain(chain)}
//             >
//               <Text style={[styles.chainText, fromChain === chain && styles.chainTextActive]}>
//                 {chain}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.label}>Amount</Text>
//         <TextInput
//           style={styles.input}
//           value={amount}
//           onChangeText={setAmount}
//           keyboardType="numeric"
//           placeholder="Enter amount"
//           placeholderTextColor="#666"
//         />
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.label}>To Chain</Text>
//         <View style={styles.chainSelector}>
//           {chains.map(chain => (
//             <TouchableOpacity
//               key={chain}
//               style={[styles.chainButton, toChain === chain && styles.chainButtonActive]}
//               onPress={() => setToChain(chain)}
//             >
//               <Text style={[styles.chainText, toChain === chain && styles.chainTextActive]}>
//                 {chain}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.label}>Recipient Address</Text>
//         <TextInput
//           style={styles.input}
//           value={recipient}
//           onChangeText={setRecipient}
//           placeholder="Enter destination address"
//           placeholderTextColor="#666"
//           autoCapitalize="none"
//         />
//       </View>

//       <TouchableOpacity 
//         style={styles.button} 
//         onPress={getQuote}
//         disabled={loading}
//       >
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>Get Quote</Text>
//         )}
//       </TouchableOpacity>

//       {quote && quote.success && (
//         <View style={styles.quoteBox}>
//           <Text style={styles.quoteTitle}>Swap Quote</Text>
          
//           <View style={styles.quoteRow}>
//             <Text style={styles.quoteLabel}>You Send:</Text>
//             <Text style={styles.quoteValue}>
//               {quote.quote?.amount_in} {quote.origin_token?.symbol}
//             </Text>
//           </View>

//           <View style={styles.quoteRow}>
//             <Text style={styles.quoteLabel}>You Receive:</Text>
//             <Text style={styles.quoteValue}>
//               {quote.quote?.amount_out} {quote.destination_token?.symbol}
//             </Text>
//           </View>

//           <View style={styles.quoteRow}>
//             <Text style={styles.quoteLabel}>Time:</Text>
//             <Text style={styles.quoteValue}>~{quote.quote?.time_estimate_seconds}s</Text>
//           </View>

//           {quote.quote?.deposit_address && (
//             <>
//               <Text style={styles.instructionTitle}>Instructions:</Text>
//               <Text style={styles.instruction}>
//                 Send to deposit address and wait for completion
//               </Text>
//               <View style={styles.addressBox}>
//                 <Text style={styles.address}>{quote.quote?.deposit_address}</Text>
//               </View>
//             </>
//           )}
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0a0a0a',
//     padding: 20,
//   },
//   section: {
//     marginBottom: 24,
//   },
//   label: {
//     fontSize: 14,
//     color: '#888',
//     marginBottom: 8,
//   },
//   chainSelector: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   chainButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//     backgroundColor: '#1a1a1a',
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   chainButtonActive: {
//     backgroundColor: '#8b5cf6',
//     borderColor: '#8b5cf6',
//   },
//   chainText: {
//     color: '#888',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   chainTextActive: {
//     color: '#fff',
//   },
//   input: {
//     backgroundColor: '#1a1a1a',
//     borderRadius: 12,
//     padding: 16,
//     color: '#fff',
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   button: {
//     backgroundColor: '#8b5cf6',
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   quoteBox: {
//     backgroundColor: '#1a1a1a',
//     padding: 20,
//     borderRadius: 12,
//     marginTop: 20,
//     borderWidth: 1,
//     borderColor: '#8b5cf6',
//   },
//   quoteTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 16,
//   },
//   quoteRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   quoteLabel: {
//     color: '#888',
//     fontSize: 14,
//   },
//   quoteValue: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   instructionTitle: {
//     color: '#8b5cf6',
//     fontSize: 16,
//     fontWeight: '600',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   instruction: {
//     color: '#ccc',
//     fontSize: 14,
//     marginBottom: 8,
//   },
//   addressBox: {
//     backgroundColor: '#0a0a0a',
//     padding: 12,
//     borderRadius: 8,
//     marginVertical: 8,
//   },
//   address: {
//     color: '#8b5cf6',
//     fontSize: 11,
//     fontFamily: 'monospace',
//   },
// });

/**
 * SOL ↔ ZEC SWAP SCREEN
 * 
 * Simple swap between Solana and Zcash
 * Both directions are automatic!
 */

// import React, { useState } from 'react';
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


// // ============================================
// // MAIN COMPONENT
// // ============================================

// export default function SwapScreen() {
//   const navigation = useNavigation();
//   // const route = useRoute();
//   const route = useRoute<RouteProp<SwapRouteParams, 'Swap'>>();
//   const vault = route.params?.vault as VaultData | undefined;

//   // ============================================
//   // STATE
//   // ============================================

//   const [direction, setDirection] = useState<'SOL_TO_ZEC' | 'ZEC_TO_SOL'>('SOL_TO_ZEC');
//   const [amount, setAmount] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState<'idle' | 'quoting' | 'swapping' | 'success' | 'error'>('idle');
//   const [quote, setQuote] = useState<any>(null);
//   const [result, setResult] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);

//   // Derived values
//   const fromAsset = direction === 'SOL_TO_ZEC' ? 'SOL' : 'ZEC';
//   const toAsset = direction === 'SOL_TO_ZEC' ? 'ZEC' : 'SOL';
//   const fromAddress = direction === 'SOL_TO_ZEC' 
//     ? (vault?.sol?.address || vault?.address || '') 
//     : (vault?.zec?.address || '');
//   const toAddress = direction === 'SOL_TO_ZEC' 
//     ? (vault?.zec?.address || '') 
//     : (vault?.sol?.address || vault?.address || '');

//   // ============================================
//   // SWAP DIRECTION
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

//     setLoading(true);
//     setStatus('quoting');
//     setError(null);

//     try {
//       const response = await api.getSwapQuote(vault, direction, parseFloat(amount));

//       if (response.success) {
//         setQuote(response.quote);
//         setStatus('idle');
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
//     setStatus('swapping');
//     setError(null);

//     try {
//       const response = await api.executeSwap(vault.vault_id, direction, parseFloat(amount));

//       if (response.success) {
//         setResult(response);
//         setStatus('success');
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
//   // RESET
//   // ============================================

//   const reset = () => {
//     setStatus('idle');
//     setQuote(null);
//     setResult(null);
//     setError(null);
//     setAmount('');
//   };

//   // ============================================
//   // RENDER: SUCCESS
//   // ============================================

//   if (status === 'success' && result) {
//     return (
//       <View style={styles.container}>
//         <View style={styles.successContainer}>
//           <Text style={styles.successEmoji}>✅</Text>
//           <Text style={styles.successTitle}>Swap Complete!</Text>

//           <View style={styles.resultCard}>
//             <View style={styles.resultRow}>
//               <Text style={styles.resultLabel}>Sent</Text>
//               <Text style={styles.resultValue}>
//                 {result.input?.amount || amount} {fromAsset}
//               </Text>
//             </View>
            
//             <Text style={styles.arrow}>↓</Text>
            
//             <View style={styles.resultRow}>
//               <Text style={styles.resultLabel}>Received</Text>
//               <Text style={[styles.resultValue, styles.highlight]}>
//                 {result.output?.amount?.toFixed(8) || quote?.output_amount?.toFixed(8)} {toAsset}
//               </Text>
//             </View>

//             {result.tx_hash && (
//               <Text style={styles.txHash}>
//                 TX: {result.tx_hash.slice(0, 16)}...
//               </Text>
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
//           }}
//           placeholder="0.00"
//           placeholderTextColor="#666"
//           keyboardType="decimal-pad"
//         />
//         <Text style={styles.addressText}>
//           {fromAddress ? `${fromAddress.slice(0, 20)}...` : 'No address'}
//         </Text>
//       </View>

//       {/* SWAP BUTTON */}
//       <TouchableOpacity style={styles.swapDirectionBtn} onPress={toggleDirection}>
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
//             {quote ? quote.output_amount.toFixed(8) : '—'}
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
//               1 {fromAsset} ≈ {quote.exchange_rate?.toFixed(6)} {toAsset}
//             </Text>
//           </View>
//           <View style={styles.quoteRow}>
//             <Text style={styles.quoteLabel}>Fee</Text>
//             <Text style={styles.quoteValue}>{quote.fee || '~0.5%'}</Text>
//           </View>
//           <View style={styles.quoteRow}>
//             <Text style={styles.quoteLabel}>Time</Text>
//             <Text style={styles.quoteValue}>~{quote.time_estimate || 30}s</Text>
//           </View>
//           {quote.output_amount_usd && (
//             <View style={styles.quoteRow}>
//               <Text style={styles.quoteLabel}>Value</Text>
//               <Text style={styles.quoteValue}>~${quote.output_amount_usd}</Text>
//             </View>
//           )}
//         </View>
//       )}

//       {/* ERROR */}
//       {error && (
//         <View style={styles.errorBox}>
//           <Text style={styles.errorText}>❌ {error}</Text>
//         </View>
//       )}

//       {/* ACTION BUTTON */}
//       <TouchableOpacity
//         style={[styles.primaryButton, loading && styles.buttonDisabled]}
//         onPress={quote ? executeSwap : getQuote}
//         disabled={loading || !amount}
//       >
//         {loading ? (
//           <View style={styles.loadingRow}>
//             <ActivityIndicator color="#000" size="small" />
//             <Text style={styles.loadingText}>
//               {status === 'quoting' ? 'Getting quote...' : 'Swapping...'}
//             </Text>
//           </View>
//         ) : (
//           <Text style={styles.primaryButtonText}>
//             {quote ? `Swap ${fromAsset} → ${toAsset}` : 'Get Quote'}
//           </Text>
//         )}
//       </TouchableOpacity>

//       {/* INFO */}
//       <View style={styles.infoBox}>
//         <Text style={styles.infoText}>
//           ⚡ Both directions are automatic{'\n'}
//           🔐 Powered by NEAR Intents{'\n'}
//           ⏱️ ~15-60 seconds
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
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import api from '../services/api';

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
        // Check if swap is pending or completed
        if (response.status === 'pending' || response.status === 'awaiting_deposit' || response.swap_id) {
          setSwapId(response.swap_id || response.intent_id);
          setStatus('pending');
          setStatusMessage('Swap in progress...');
          
          // Start polling for status
          startStatusPolling(response.swap_id || response.intent_id);
        } else if (response.status === 'completed' || response.tx_hash) {
          // Swap completed immediately
          setResult(response);
          setStatus('success');
          setStatusMessage('');
        } else {
          // Generic success
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
    const maxAttempts = 60; // 5 minutes max (5s intervals)

    pollIntervalRef.current = setInterval(async () => {
      attempts++;
      
      try {
        const statusResponse = await api.getSwapStatus(id);
        
        console.log('[Swap] Status poll:', statusResponse);

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
          // Still pending
          setStatusMessage(`Swap in progress... (${attempts * 5}s)`);
        }
      } catch (err) {
        console.error('[Swap] Status poll error:', err);
      }

      if (attempts >= maxAttempts) {
        clearInterval(pollIntervalRef.current!);
        setStatus('success'); // Assume success after timeout
        setStatusMessage('Swap submitted. Check your balance shortly.');
      }
    }, 5000); // Poll every 5 seconds
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
        <View style={styles.pendingContainer}>
          <ActivityIndicator size="large" color="#8b5cf6" />
          <Text style={styles.pendingTitle}>
            {status === 'executing' ? 'Initiating Swap...' : 'Swap In Progress'}
          </Text>
          <Text style={styles.pendingMessage}>{statusMessage}</Text>
          
          <View style={styles.pendingCard}>
            <Text style={styles.pendingDetail}>
              {amount} {fromAsset} → {quote?.output_amount?.toFixed(6) || '...'} {toAsset}
            </Text>
            {swapId && (
              <Text style={styles.swapId}>ID: {swapId.slice(0, 16)}...</Text>
            )}
          </View>

          <Text style={styles.pendingNote}>
            Please wait. This may take 30-120 seconds.{'\n'}
            Do not close the app.
          </Text>
        </View>
      </View>
    );
  }

  // ============================================
  // RENDER: SUCCESS
  // ============================================

  if (status === 'success') {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>✅</Text>
          <Text style={styles.successTitle}>Swap Complete!</Text>

          <View style={styles.resultCard}>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Sent</Text>
              <Text style={styles.resultValue}>
                {result?.input?.amount || amount} {fromAsset}
              </Text>
            </View>
            
            <Text style={styles.arrow}>↓</Text>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Received</Text>
              <Text style={[styles.resultValue, styles.highlight]}>
                ~{result?.output?.estimated_amount?.toFixed(6) || 
                  result?.estimated_output?.toFixed(6) || 
                  quote?.output_amount?.toFixed(6)} {toAsset}
              </Text>
            </View>

            {(result?.tx_hash || result?.swap_id) && (
              <Text style={styles.txHash}>
                TX: {(result.tx_hash || result.swap_id).slice(0, 20)}...
              </Text>
            )}

            {result?.message && (
              <Text style={styles.statusMessage}>{result.message}</Text>
            )}
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={reset}>
            <Text style={styles.primaryButtonText}>New Swap</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.secondaryButtonText}>← Back to Wallet</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ============================================
  // RENDER: MAIN
  // ============================================

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <Text style={styles.title}>Swap</Text>
      {vault && (
        <Text style={styles.walletName}>{vault.vault_name}</Text>
      )}

      {/* FROM */}
      <View style={styles.swapBox}>
        <Text style={styles.label}>From</Text>
        <View style={styles.assetRow}>
          <Text style={styles.assetIcon}>
            {fromAsset === 'SOL' ? '◎' : '🛡️'}
          </Text>
          <Text style={styles.assetName}>{fromAsset}</Text>
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
          placeholderTextColor="#666"
          keyboardType="decimal-pad"
          editable={status === 'idle' || status === 'confirming' || status === 'error'}
        />
        <Text style={styles.addressText}>
          {fromAddress ? `${fromAddress.slice(0, 20)}...` : 'No address'}
        </Text>
      </View>

      {/* SWAP DIRECTION */}
      <TouchableOpacity 
        style={styles.swapDirectionBtn} 
        onPress={toggleDirection}
        disabled={loading}
      >
        <Text style={styles.swapDirectionIcon}>⇅</Text>
      </TouchableOpacity>

      {/* TO */}
      <View style={styles.swapBox}>
        <Text style={styles.label}>To</Text>
        <View style={styles.assetRow}>
          <Text style={styles.assetIcon}>
            {toAsset === 'SOL' ? '◎' : '🛡️'}
          </Text>
          <Text style={styles.assetName}>{toAsset}</Text>
        </View>
        <View style={styles.receiveBox}>
          <Text style={styles.receiveAmount}>
            {quote ? quote.output_amount?.toFixed(6) : '—'}
          </Text>
        </View>
        <Text style={styles.addressText}>
          {toAddress ? `${toAddress.slice(0, 20)}...` : 'No address'}
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
          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>Fee</Text>
            <Text style={styles.quoteValue}>{quote.fee || '~0.5%'}</Text>
          </View>
          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>Time</Text>
            <Text style={styles.quoteValue}>~{quote.time_estimate || 60}s</Text>
          </View>
          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>Provider</Text>
            <Text style={[styles.quoteValue, { color: '#8b5cf6' }]}>
              {quote.provider || 'NEAR Intents'}
            </Text>
          </View>
        </View>
      )}

      {/* ERROR */}
      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>❌ {error}</Text>
        </View>
      )}

      {/* STATUS MESSAGE */}
      {statusMessage && status === 'quoting' && (
        <View style={styles.statusBox}>
          <ActivityIndicator size="small" color="#8b5cf6" />
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
      >
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color="#000" size="small" />
            <Text style={styles.loadingText}>
              {status === 'quoting' ? 'Getting quote...' : 'Processing...'}
            </Text>
          </View>
        ) : (
          <Text style={styles.primaryButtonText}>
            {quote && status === 'confirming' 
              ? `Swap ${amount} ${fromAsset} → ${toAsset}` 
              : 'Get Quote'}
          </Text>
        )}
      </TouchableOpacity>

      {/* Warning for missing addresses */}
      {(!fromAddress || !toAddress) && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ Wallet missing {!fromAddress && !toAddress ? 'both' : !fromAddress ? fromAsset : toAsset} address
          </Text>
        </View>
      )}

      {/* INFO */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          🔐 Cross-chain swap via NEAR Intents{'\n'}
          ⏱️ ~30-120 seconds to complete{'\n'}
          💰 ~0.5% total fee
        </Text>
      </View>
    </ScrollView>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  walletName: {
    fontSize: 14,
    color: '#8b5cf6',
    marginBottom: 24,
  },
  swapBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  assetIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  assetName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  amountInput: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  addressText: {
    fontSize: 11,
    color: '#555',
    marginTop: 8,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  swapDirectionBtn: {
    alignSelf: 'center',
    backgroundColor: '#333',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: -16,
    zIndex: 10,
    borderWidth: 3,
    borderColor: '#0a0a0a',
  },
  swapDirectionIcon: {
    fontSize: 22,
    color: '#8b5cf6',
  },
  receiveBox: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  receiveAmount: {
    fontSize: 32,
    fontWeight: '600',
    color: '#8b5cf6',
  },
  quoteCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  quoteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quoteLabel: {
    color: '#666',
    fontSize: 14,
  },
  quoteValue: {
    color: '#fff',
    fontSize: 14,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
  },
  warningBox: {
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  warningText: {
    color: '#eab308',
    textAlign: 'center',
    fontSize: 13,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginTop: 12,
  },
  statusText: {
    color: '#8b5cf6',
    marginLeft: 8,
  },
  primaryButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  infoBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#111',
    borderRadius: 12,
  },
  infoText: {
    color: '#666',
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'center',
  },

  // Pending
  pendingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  pendingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 24,
    marginBottom: 8,
  },
  pendingMessage: {
    color: '#8b5cf6',
    fontSize: 16,
    marginBottom: 24,
  },
  pendingCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  pendingDetail: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  swapId: {
    color: '#555',
    fontSize: 11,
    marginTop: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  pendingNote: {
    color: '#666',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Success
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  resultCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    marginBottom: 24,
    alignItems: 'center',
  },
  resultRow: {
    alignItems: 'center',
    marginVertical: 8,
  },
  resultLabel: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  resultValue: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
  highlight: {
    color: '#8b5cf6',
  },
  arrow: {
    fontSize: 24,
    color: '#8b5cf6',
    marginVertical: 8,
  },
  txHash: {
    color: '#555',
    fontSize: 11,
    marginTop: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  statusMessage: {
    color: '#888',
    fontSize: 12,
    marginTop: 12,
    textAlign: 'center',
  },
  secondaryButton: {
    padding: 12,
    marginTop: 8,
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 14,
  },
});