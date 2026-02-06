// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   ScrollView,
//   Alert,
//   Linking,
//   ActivityIndicator,
//   Platform,
//   Modal,
// } from 'react-native';
// import Clipboard from '@react-native-clipboard/clipboard';

// // ============================================
// // CONFIGURATION
// // ============================================

// // Update this to your backend URL
// const API_BASE = __DEV__ 
//   ? 'http://localhost:3001'  // Development
//   : 'https://pawpad-arcium-backend.onrender.com';  // Production

// // Supported tokens for funding
// const FUNDING_TOKENS = [
//   { id: 'ETH', name: 'Ethereum', symbol: 'ETH', icon: '⟠', chain: 'ethereum' },
//   { id: 'USDC_SOL', name: 'USDC (Solana)', symbol: 'USDC', icon: '💵', chain: 'solana' },
//   { id: 'USDC_ETH', name: 'USDC (Ethereum)', symbol: 'USDC', icon: '💵', chain: 'ethereum' },
//   { id: 'BTC', name: 'Bitcoin', symbol: 'BTC', icon: '₿', chain: 'bitcoin' },
//   { id: 'ZEC', name: 'Zcash', symbol: 'ZEC', icon: '🛡️', chain: 'zcash' },
//   { id: 'NEAR', name: 'NEAR', symbol: 'NEAR', icon: '◉', chain: 'near' },
//   { id: 'SOL', name: 'Solana', symbol: 'SOL', icon: '◎', chain: 'solana' },
// ];

// // ============================================
// // TYPES
// // ============================================

// interface Vault {
//   vault_id: string;
//   address: string;
//   chain: 'SOL' | 'ZEC';
//   mpc_provider: string;
//   metadata?: {
//     vault_name?: string;
//   };
// }

// interface Quote {
//   inputToken: string;
//   inputAmount: number;
//   inputAmountUsd: string;
//   outputToken: string;
//   outputAmount: number;
//   outputAmountUsd: string;
//   exchangeRate: number;
//   estimatedTime: string;
//   fee: string;
//   depositAddress?: string;
// }

// interface FundMeProps {
//   // Option 1: Pass vault directly
//   vault?: Vault;
  
//   // Option 2: Pass vault ID and let component fetch details
//   vaultId?: string;
  
//   // Callbacks
//   onSuccess?: (txHash?: string) => void;
//   onClose?: () => void;
  
//   // Optional: refresh balance after funding
//   onRefreshBalance?: () => void;
// }

// // ============================================
// // MAIN COMPONENT
// // ============================================

// const FundMe: React.FC<FundMeProps> = ({
//   vault: propVault,
//   vaultId: propVaultId,
//   onSuccess,
//   onClose,
//   onRefreshBalance,
// }) => {
//   // ============================================
//   // STATE
//   // ============================================
  
//   const [vault, setVault] = useState<Vault | null>(propVault || null);
//   const [loading, setLoading] = useState(!propVault);
  
//   const [fromToken, setFromToken] = useState('ETH');
//   const [amount, setAmount] = useState('');
//   const [quote, setQuote] = useState<Quote | null>(null);
//   const [depositAddress, setDepositAddress] = useState<string | null>(null);
//   const [swapId, setSwapId] = useState<string | null>(null);
  
//   const [status, setStatus] = useState<
//     'loading' | 'idle' | 'quoting' | 'quoted' | 'executing' | 'pending' | 'processing' | 'success' | 'failed'
//   >(propVault ? 'idle' : 'loading');
  
//   const [error, setError] = useState<string | null>(null);
//   const [showTokenPicker, setShowTokenPicker] = useState(false);

//   // ============================================
//   // FETCH VAULT IF NOT PROVIDED
//   // ============================================
  
//   useEffect(() => {
//     if (propVault) {
//       setVault(propVault);
//       setStatus('idle');
//       return;
//     }
    
//     if (propVaultId) {
//       fetchVaultDetails(propVaultId);
//     }
//   }, [propVault, propVaultId]);

//   const fetchVaultDetails = async (vaultId: string) => {
//     try {
//       setStatus('loading');
//       const response = await fetch(`${API_BASE}/api/vault/${vaultId}`);
//       const data = await response.json();
      
//       if (data.success && data.vault) {
//         setVault(data.vault);
//         setStatus('idle');
//       } else {
//         setError('Failed to load vault details');
//         setStatus('idle');
//       }
//     } catch (err: any) {
//       setError(err.message);
//       setStatus('idle');
//     }
//   };

//   // ============================================
//   // AVAILABLE TOKENS (exclude same chain)
//   // ============================================
  
//   const availableFromTokens = FUNDING_TOKENS.filter(token => {
//     // Can't swap SOL to SOL or ZEC to ZEC
//     if (vault?.chain === 'SOL' && token.id === 'SOL') return false;
//     if (vault?.chain === 'ZEC' && token.id === 'ZEC') return false;
//     return true;
//   });

//   // ============================================
//   // GET QUOTE
//   // ============================================
  
//   const getQuote = async () => {
//     if (!vault) {
//       setError('No vault selected');
//       return;
//     }
    
//     if (!amount || parseFloat(amount) <= 0) {
//       setError('Please enter a valid amount');
//       return;
//     }

//     setStatus('quoting');
//     setError(null);

//     try {
//       const response = await fetch(`${API_BASE}/api/fund/quote`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           from_token: fromToken,
//           to_token: vault.chain,  // SOL or ZEC
//           amount: parseFloat(amount),
//           vault_id: vault.vault_id,
//           destination_address: vault.address,
//         }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         setQuote(data.quote);
//         setStatus('quoted');
//       } else {
//         setError(data.error || 'Failed to get quote');
//         setStatus('idle');
//       }
//     } catch (err: any) {
//       setError(err.message || 'Network error');
//       setStatus('idle');
//     }
//   };

//   // ============================================
//   // EXECUTE SWAP
//   // ============================================
  
//   const executeSwap = async () => {
//     if (!vault) return;
    
//     setStatus('executing');
//     setError(null);

//     try {
//       const response = await fetch(`${API_BASE}/api/fund/execute`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           from_token: fromToken,
//           to_token: vault.chain,
//           amount: parseFloat(amount),
//           vault_id: vault.vault_id,
//           destination_address: vault.address,
//         }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         // Extract deposit address from response
//         const addr = data.quote?.depositAddress || data.raw?.quote?.depositAddress;
//         setDepositAddress(addr);
//         setSwapId(data.swapId);
//         setStatus('pending');
        
//         // Start polling for status
//         if (data.swapId) {
//           pollStatus(data.swapId);
//         }
//       } else {
//         setError(data.error || 'Failed to execute swap');
//         setStatus('quoted');
//       }
//     } catch (err: any) {
//       setError(err.message || 'Network error');
//       setStatus('quoted');
//     }
//   };

//   // ============================================
//   // POLL STATUS
//   // ============================================
  
//   const pollStatus = async (id: string) => {
//     let attempts = 0;
//     const maxAttempts = 120; // 10 minutes at 5 second intervals
    
//     const checkStatus = async (): Promise<boolean> => {
//       try {
//         const response = await fetch(
//           `${API_BASE}/api/fund/status/${encodeURIComponent(id)}`
//         );
//         const data = await response.json();

//         if (data.success) {
//           switch (data.status) {
//             case 'SUCCESS':
//               setStatus('success');
//               onRefreshBalance?.();
//               onSuccess?.(data.txHash);
//               return true;
//             case 'FAILED':
//             case 'REFUNDED':
//               setStatus('failed');
//               setError(`Swap ${data.status.toLowerCase()}`);
//               return true;
//             case 'PROCESSING':
//               setStatus('processing');
//               break;
//           }
//         }
//         return false;
//       } catch {
//         return false;
//       }
//     };

//     const poll = async () => {
//       if (attempts >= maxAttempts) {
//         setError('Swap timeout - please check manually');
//         return;
//       }
      
//       const done = await checkStatus();
//       if (!done) {
//         attempts++;
//         setTimeout(poll, 5000);
//       }
//     };

//     poll();
//   };

//   // ============================================
//   // COPY & WALLET LINKS
//   // ============================================
  
//   const copyAddress = () => {
//     if (depositAddress) {
//       Clipboard.setString(depositAddress);
//       Alert.alert('Copied!', 'Deposit address copied to clipboard');
//     }
//   };

//   const openWallet = () => {
//     if (!depositAddress) return;
    
//     const token = FUNDING_TOKENS.find(t => t.id === fromToken);
    
//     if (token?.chain === 'solana') {
//       // Phantom deep link
//       if (fromToken === 'USDC_SOL') {
//         Linking.openURL(
//           `https://phantom.app/ul/send?token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&destination=${depositAddress}&amount=${amount}`
//         );
//       } else {
//         Linking.openURL(
//           `https://phantom.app/ul/send?destination=${depositAddress}&amount=${amount}`
//         );
//       }
//     } else if (token?.chain === 'ethereum') {
//       // MetaMask deep link
//       Linking.openURL(`https://metamask.app.link/send/${depositAddress}`);
//     } else if (token?.chain === 'bitcoin') {
//       // Bitcoin URI
//       Linking.openURL(`bitcoin:${depositAddress}?amount=${amount}`);
//     } else {
//       // Generic - just copy
//       copyAddress();
//     }
//   };

//   // ============================================
//   // RENDER: LOADING
//   // ============================================
  
//   if (status === 'loading') {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#00FF88" />
//         <Text style={styles.loadingText}>Loading wallet...</Text>
//       </View>
//     );
//   }

//   // ============================================
//   // RENDER: TOKEN PICKER MODAL
//   // ============================================
  
//   const renderTokenPicker = () => (
//     <Modal
//       visible={showTokenPicker}
//       transparent
//       animationType="slide"
//       onRequestClose={() => setShowTokenPicker(false)}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           <Text style={styles.modalTitle}>Select Token</Text>
//           <ScrollView>
//             {availableFromTokens.map((token) => (
//               <TouchableOpacity
//                 key={token.id}
//                 style={[
//                   styles.tokenOption,
//                   fromToken === token.id && styles.tokenOptionSelected,
//                 ]}
//                 onPress={() => {
//                   setFromToken(token.id);
//                   setQuote(null);
//                   setStatus('idle');
//                   setShowTokenPicker(false);
//                 }}
//               >
//                 <Text style={styles.tokenIcon}>{token.icon}</Text>
//                 <View style={styles.tokenInfo}>
//                   <Text style={styles.tokenName}>{token.name}</Text>
//                   <Text style={styles.tokenSymbol}>{token.symbol}</Text>
//                 </View>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//           <TouchableOpacity
//             style={styles.modalClose}
//             onPress={() => setShowTokenPicker(false)}
//           >
//             <Text style={styles.modalCloseText}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );

//   // ============================================
//   // RENDER: DEPOSIT SCREEN
//   // ============================================
  
//   if (status === 'pending' || status === 'processing' || status === 'success' || status === 'failed') {
//     const token = FUNDING_TOKENS.find(t => t.id === fromToken);
    
//     return (
//       <View style={styles.container}>
//         <View style={styles.depositScreen}>
//           {/* Status Header */}
//           <Text style={styles.statusTitle}>
//             {status === 'pending' && '⏳ Waiting for Deposit'}
//             {status === 'processing' && '⚙️ Processing...'}
//             {status === 'success' && '✅ Success!'}
//             {status === 'failed' && '❌ Failed'}
//           </Text>

//           {/* Pending: Show deposit address */}
//           {status === 'pending' && depositAddress && (
//             <>
//               <Text style={styles.depositInstruction}>
//                 Send exactly{' '}
//                 <Text style={styles.highlight}>
//                   {amount} {token?.symbol}
//                 </Text>{' '}
//                 to this address:
//               </Text>

//               <View style={styles.addressBox}>
//                 <Text style={styles.addressText} selectable>
//                   {depositAddress}
//                 </Text>
//               </View>

//               <TouchableOpacity style={styles.copyButton} onPress={copyAddress}>
//                 <Text style={styles.buttonText}>📋 Copy Address</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.walletButton} onPress={openWallet}>
//                 <Text style={styles.buttonText}>
//                   {token?.chain === 'solana' && '👻 Open in Phantom'}
//                   {token?.chain === 'ethereum' && '🦊 Open in MetaMask'}
//                   {token?.chain === 'bitcoin' && '₿ Open Bitcoin Wallet'}
//                   {!['solana', 'ethereum', 'bitcoin'].includes(token?.chain || '') && '📱 Open Wallet'}
//                 </Text>
//               </TouchableOpacity>

//               <Text style={styles.warningText}>
//                 ⚠️ Only send {token?.symbol} on {token?.name}!
//               </Text>
//             </>
//           )}

//           {/* Processing: Show spinner */}
//           {status === 'processing' && (
//             <View style={styles.processingBox}>
//               <ActivityIndicator size="large" color="#00FF88" />
//               <Text style={styles.processingText}>
//                 Processing your swap...{'\n'}
//                 This usually takes 15-60 seconds
//               </Text>
//             </View>
//           )}

//           {/* Success */}
//           {status === 'success' && (
//             <View style={styles.successBox}>
//               <Text style={styles.successEmoji}>🎉</Text>
//               <Text style={styles.successText}>
//                 {quote?.outputAmount.toFixed(6)} {vault?.chain} sent to your wallet!
//               </Text>
//               <TouchableOpacity style={styles.doneButton} onPress={onClose}>
//                 <Text style={styles.doneButtonText}>Done</Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           {/* Failed */}
//           {status === 'failed' && (
//             <View style={styles.failedBox}>
//               <Text style={styles.failedText}>{error}</Text>
//               <TouchableOpacity style={styles.retryButton} onPress={() => setStatus('idle')}>
//                 <Text style={styles.buttonText}>Try Again</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>
//       </View>
//     );
//   }

//   // ============================================
//   // RENDER: MAIN FUND SCREEN
//   // ============================================
  
//   const selectedToken = FUNDING_TOKENS.find(t => t.id === fromToken);

//   return (
//     <ScrollView style={styles.container}>
//       {renderTokenPicker()}

//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.title}>Fund Wallet</Text>
//         <Text style={styles.subtitle}>
//           Add {vault?.chain} using any supported token
//         </Text>
//       </View>

//       {/* Wallet Info */}
//       {vault && (
//         <View style={styles.walletInfo}>
//           <Text style={styles.walletLabel}>Destination Wallet</Text>
//           <Text style={styles.walletName}>
//             {vault.metadata?.vault_name || `${vault.chain} Wallet`}
//           </Text>
//           <Text style={styles.walletAddress}>{vault.address}</Text>
//           <Text style={styles.walletProvider}>
//             {vault.mpc_provider} • {vault.chain}
//           </Text>
//         </View>
//       )}

//       {/* From Token */}
//       <View style={styles.section}>
//         <Text style={styles.sectionLabel}>Pay With</Text>
//         <TouchableOpacity
//           style={styles.tokenSelector}
//           onPress={() => setShowTokenPicker(true)}
//         >
//           <Text style={styles.tokenSelectorIcon}>{selectedToken?.icon}</Text>
//           <Text style={styles.tokenSelectorText}>{selectedToken?.name}</Text>
//           <Text style={styles.tokenSelectorArrow}>▼</Text>
//         </TouchableOpacity>

//         <View style={styles.amountInput}>
//           <TextInput
//             style={styles.input}
//             placeholder="0.00"
//             placeholderTextColor="#666"
//             keyboardType="decimal-pad"
//             value={amount}
//             onChangeText={(text) => {
//               setAmount(text);
//               setQuote(null);
//               setStatus('idle');
//             }}
//           />
//           <Text style={styles.inputSuffix}>{selectedToken?.symbol}</Text>
//         </View>
//       </View>

//       {/* Arrow */}
//       <View style={styles.arrowBox}>
//         <Text style={styles.arrow}>↓</Text>
//       </View>

//       {/* To Token */}
//       <View style={styles.section}>
//         <Text style={styles.sectionLabel}>You Receive</Text>
//         <View style={styles.receiveBox}>
//           <Text style={styles.receiveIcon}>
//             {vault?.chain === 'SOL' ? '◎' : '🛡️'}
//           </Text>
//           <Text style={styles.receiveText}>
//             {quote ? `${quote.outputAmount.toFixed(6)} ${vault?.chain}` : `— ${vault?.chain}`}
//           </Text>
//         </View>
//       </View>

//       {/* Quote Details */}
//       {quote && (
//         <View style={styles.quoteDetails}>
//           <View style={styles.quoteRow}>
//             <Text style={styles.quoteLabel}>Rate</Text>
//             <Text style={styles.quoteValue}>
//               1 {fromToken} = {quote.exchangeRate.toFixed(6)} {vault?.chain}
//             </Text>
//           </View>
//           <View style={styles.quoteRow}>
//             <Text style={styles.quoteLabel}>Fee</Text>
//             <Text style={styles.quoteValue}>{quote.fee}</Text>
//           </View>
//           <View style={styles.quoteRow}>
//             <Text style={styles.quoteLabel}>Time</Text>
//             <Text style={styles.quoteValue}>{quote.estimatedTime}</Text>
//           </View>
//         </View>
//       )}

//       {/* Error */}
//       {error && (
//         <View style={styles.errorBox}>
//           <Text style={styles.errorText}>❌ {error}</Text>
//         </View>
//       )}

//       {/* Action Button */}
//       <TouchableOpacity
//         style={[
//           styles.actionButton,
//           (status === 'quoting' || status === 'executing') && styles.buttonDisabled,
//         ]}
//         onPress={status === 'quoted' ? executeSwap : getQuote}
//         disabled={status === 'quoting' || status === 'executing'}
//       >
//         {(status === 'quoting' || status === 'executing') ? (
//           <ActivityIndicator color="#000" />
//         ) : (
//           <Text style={styles.actionButtonText}>
//             {status === 'quoted' ? 'Confirm Swap' : 'Get Quote'}
//           </Text>
//         )}
//       </TouchableOpacity>

//       {/* Footer */}
//       <Text style={styles.footer}>
//         Powered by NEAR Intents • 0.1% fee
//       </Text>
//     </ScrollView>
//   );
// };

// // ============================================
// // STYLES
// // ============================================

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0a0a0f',
//     padding: 20,
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#0a0a0f',
//   },
//   loadingText: {
//     color: '#888',
//     marginTop: 16,
//   },
//   header: {
//     marginBottom: 24,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#888',
//     marginTop: 4,
//   },
//   walletInfo: {
//     backgroundColor: '#1a1a2e',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 24,
//   },
//   walletLabel: {
//     fontSize: 12,
//     color: '#666',
//     textTransform: 'uppercase',
//     marginBottom: 8,
//   },
//   walletName: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   walletAddress: {
//     fontSize: 12,
//     color: '#00FF88',
//     fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
//     marginTop: 4,
//   },
//   walletProvider: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 4,
//   },
//   section: {
//     marginBottom: 8,
//   },
//   sectionLabel: {
//     fontSize: 12,
//     color: '#666',
//     textTransform: 'uppercase',
//     marginBottom: 8,
//   },
//   tokenSelector: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1a1a2e',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//   },
//   tokenSelectorIcon: {
//     fontSize: 24,
//     marginRight: 12,
//   },
//   tokenSelectorText: {
//     flex: 1,
//     fontSize: 16,
//     color: '#fff',
//     fontWeight: '600',
//   },
//   tokenSelectorArrow: {
//     color: '#666',
//   },
//   amountInput: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1a1a2e',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//   },
//   input: {
//     flex: 1,
//     fontSize: 32,
//     fontWeight: '600',
//     color: '#fff',
//     paddingVertical: 16,
//   },
//   inputSuffix: {
//     fontSize: 18,
//     color: '#666',
//     fontWeight: '600',
//   },
//   arrowBox: {
//     alignItems: 'center',
//     marginVertical: 8,
//   },
//   arrow: {
//     fontSize: 24,
//     color: '#00FF88',
//   },
//   receiveBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1a1a2e',
//     borderRadius: 12,
//     padding: 20,
//   },
//   receiveIcon: {
//     fontSize: 32,
//     marginRight: 12,
//   },
//   receiveText: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: '#00FF88',
//   },
//   quoteDetails: {
//     backgroundColor: '#1a1a2e',
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
//   },
//   quoteValue: {
//     color: '#fff',
//   },
//   errorBox: {
//     backgroundColor: 'rgba(255,0,0,0.1)',
//     borderRadius: 12,
//     padding: 16,
//     marginTop: 16,
//   },
//   errorText: {
//     color: '#ff4444',
//     textAlign: 'center',
//   },
//   actionButton: {
//     backgroundColor: '#00FF88',
//     borderRadius: 12,
//     padding: 18,
//     alignItems: 'center',
//     marginTop: 24,
//   },
//   buttonDisabled: {
//     opacity: 0.5,
//   },
//   actionButtonText: {
//     color: '#000',
//     fontSize: 18,
//     fontWeight: '700',
//   },
//   footer: {
//     textAlign: 'center',
//     color: '#444',
//     fontSize: 12,
//     marginTop: 24,
//     marginBottom: 40,
//   },
  
//   // Modal styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.8)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: '#1a1a2e',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     padding: 20,
//     maxHeight: '70%',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#fff',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   tokenOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 8,
//   },
//   tokenOptionSelected: {
//     backgroundColor: 'rgba(0,255,136,0.1)',
//   },
//   tokenIcon: {
//     fontSize: 28,
//     marginRight: 16,
//   },
//   tokenInfo: {
//     flex: 1,
//   },
//   tokenName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   tokenSymbol: {
//     fontSize: 14,
//     color: '#666',
//   },
//   modalClose: {
//     padding: 16,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   modalCloseText: {
//     color: '#888',
//     fontSize: 16,
//   },
  
//   // Deposit screen styles
//   depositScreen: {
//     flex: 1,
//     alignItems: 'center',
//     paddingTop: 40,
//   },
//   statusTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 24,
//   },
//   depositInstruction: {
//     fontSize: 16,
//     color: '#888',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   highlight: {
//     color: '#00FF88',
//     fontWeight: '600',
//   },
//   addressBox: {
//     backgroundColor: '#1a1a2e',
//     borderRadius: 12,
//     padding: 16,
//     width: '100%',
//     marginBottom: 16,
//   },
//   addressText: {
//     color: '#00FF88',
//     fontSize: 13,
//     fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
//     textAlign: 'center',
//   },
//   copyButton: {
//     backgroundColor: '#2a2a3e',
//     borderRadius: 12,
//     padding: 16,
//     width: '100%',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   walletButton: {
//     backgroundColor: '#1a1a2e',
//     borderRadius: 12,
//     padding: 16,
//     width: '100%',
//     alignItems: 'center',
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   warningText: {
//     color: '#ff9900',
//     fontSize: 12,
//     textAlign: 'center',
//   },
//   processingBox: {
//     alignItems: 'center',
//     padding: 32,
//   },
//   processingText: {
//     color: '#888',
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 16,
//     lineHeight: 24,
//   },
//   successBox: {
//     alignItems: 'center',
//   },
//   successEmoji: {
//     fontSize: 64,
//     marginBottom: 16,
//   },
//   successText: {
//     color: '#00FF88',
//     fontSize: 18,
//     fontWeight: '600',
//     textAlign: 'center',
//     marginBottom: 24,
//   },
//   doneButton: {
//     backgroundColor: '#00FF88',
//     borderRadius: 12,
//     paddingHorizontal: 48,
//     paddingVertical: 16,
//   },
//   doneButtonText: {
//     color: '#000',
//     fontSize: 18,
//     fontWeight: '700',
//   },
//   failedBox: {
//     alignItems: 'center',
//   },
//   failedText: {
//     color: '#ff4444',
//     fontSize: 16,
//     marginBottom: 16,
//   },
//   retryButton: {
//     backgroundColor: '#2a2a3e',
//     borderRadius: 12,
//     paddingHorizontal: 32,
//     paddingVertical: 12,
//   },
// });

// export default FundMe;

/**
 * FUND WALLET SCREEN
 * 
 * Add funds using any supported token
 * Uses NEAR Intents for cross-chain swaps
 * 
 * Styled to match VoltWallet premium theme
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Linking,
  ActivityIndicator,
  Platform,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Clipboard from '@react-native-clipboard/clipboard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================
// CONFIGURATION
// ============================================

const API_BASE = __DEV__ 
  ? 'http://localhost:3001'
  : 'https://pawpad-arcium-backend.onrender.com';

const FUNDING_TOKENS = [
  { id: 'ETH', name: 'Ethereum', symbol: 'ETH', icon: '⟠', chain: 'ethereum', color: '#627EEA' },
  { id: 'USDC_SOL', name: 'USDC (Solana)', symbol: 'USDC', icon: '💵', chain: 'solana', color: '#2775CA' },
  { id: 'USDC_ETH', name: 'USDC (Ethereum)', symbol: 'USDC', icon: '💵', chain: 'ethereum', color: '#2775CA' },
  { id: 'BTC', name: 'Bitcoin', symbol: 'BTC', icon: '₿', chain: 'bitcoin', color: '#F7931A' },
  { id: 'ZEC', name: 'Zcash', symbol: 'ZEC', icon: 'Z', chain: 'zcash', color: '#F4B728' },
  { id: 'NEAR', name: 'NEAR', symbol: 'NEAR', icon: '◉', chain: 'near', color: '#00C08B' },
  { id: 'SOL', name: 'Solana', symbol: 'SOL', icon: '◎', chain: 'solana', color: '#9945FF' },
];

// ============================================
// TYPES
// ============================================

interface Vault {
  vault_id: string;
  address: string;
  chain: 'SOL' | 'ZEC';
  mpc_provider: string;
  metadata?: {
    vault_name?: string;
  };
}

interface Quote {
  inputToken: string;
  inputAmount: number;
  inputAmountUsd: string;
  outputToken: string;
  outputAmount: number;
  outputAmountUsd: string;
  exchangeRate: number;
  estimatedTime: string;
  fee: string;
  depositAddress?: string;
}

interface FundMeProps {
  vault?: Vault;
  vaultId?: string;
  onSuccess?: (txHash?: string) => void;
  onClose?: () => void;
  onRefreshBalance?: () => void;
}

// ============================================
// MAIN COMPONENT
// ============================================

const FundMe: React.FC<FundMeProps> = ({
  vault: propVault,
  vaultId: propVaultId,
  onSuccess,
  onClose,
  onRefreshBalance,
}) => {
  const navigation = useNavigation();
  
  // ============================================
  // STATE
  // ============================================
  
  const [vault, setVault] = useState<Vault | null>(propVault || null);
  const [loading, setLoading] = useState(!propVault);
  
  const [fromToken, setFromToken] = useState('ETH');
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [depositAddress, setDepositAddress] = useState<string | null>(null);
  const [swapId, setSwapId] = useState<string | null>(null);
  
  const [status, setStatus] = useState<
    'loading' | 'idle' | 'quoting' | 'quoted' | 'executing' | 'pending' | 'processing' | 'success' | 'failed'
  >(propVault ? 'idle' : 'loading');
  
  const [error, setError] = useState<string | null>(null);
  const [showTokenPicker, setShowTokenPicker] = useState(false);

  // ============================================
  // FETCH VAULT IF NOT PROVIDED
  // ============================================
  
  useEffect(() => {
    if (propVault) {
      setVault(propVault);
      setStatus('idle');
      return;
    }
    
    if (propVaultId) {
      fetchVaultDetails(propVaultId);
    }
  }, [propVault, propVaultId]);

  const fetchVaultDetails = async (vaultId: string) => {
    try {
      setStatus('loading');
      const response = await fetch(`${API_BASE}/api/vault/${vaultId}`);
      const data = await response.json();
      
      if (data.success && data.vault) {
        setVault(data.vault);
        setStatus('idle');
      } else {
        setError('Failed to load vault details');
        setStatus('idle');
      }
    } catch (err: any) {
      setError(err.message);
      setStatus('idle');
    }
  };

  // ============================================
  // AVAILABLE TOKENS
  // ============================================
  
  const availableFromTokens = FUNDING_TOKENS.filter(token => {
    if (vault?.chain === 'SOL' && token.id === 'SOL') return false;
    if (vault?.chain === 'ZEC' && token.id === 'ZEC') return false;
    return true;
  });

  // ============================================
  // GET QUOTE
  // ============================================
  
  const getQuote = async () => {
    if (!vault) {
      setError('No vault selected');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setStatus('quoting');
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/fund/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_token: fromToken,
          to_token: vault.chain,
          amount: parseFloat(amount),
          vault_id: vault.vault_id,
          destination_address: vault.address,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setQuote(data.quote);
        setStatus('quoted');
      } else {
        setError(data.error || 'Failed to get quote');
        setStatus('idle');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
      setStatus('idle');
    }
  };

  // ============================================
  // EXECUTE SWAP
  // ============================================
  
  const executeSwap = async () => {
    if (!vault) return;
    
    setStatus('executing');
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/fund/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_token: fromToken,
          to_token: vault.chain,
          amount: parseFloat(amount),
          vault_id: vault.vault_id,
          destination_address: vault.address,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const addr = data.quote?.depositAddress || data.raw?.quote?.depositAddress;
        setDepositAddress(addr);
        setSwapId(data.swapId);
        setStatus('pending');
        
        if (data.swapId) {
          pollStatus(data.swapId);
        }
      } else {
        setError(data.error || 'Failed to execute swap');
        setStatus('quoted');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
      setStatus('quoted');
    }
  };

  // ============================================
  // POLL STATUS
  // ============================================
  
  const pollStatus = async (id: string) => {
    let attempts = 0;
    const maxAttempts = 120;
    
    const checkStatus = async (): Promise<boolean> => {
      try {
        const response = await fetch(
          `${API_BASE}/api/fund/status/${encodeURIComponent(id)}`
        );
        const data = await response.json();

        if (data.success) {
          switch (data.status) {
            case 'SUCCESS':
              setStatus('success');
              onRefreshBalance?.();
              onSuccess?.(data.txHash);
              return true;
            case 'FAILED':
            case 'REFUNDED':
              setStatus('failed');
              setError(`Swap ${data.status.toLowerCase()}`);
              return true;
            case 'PROCESSING':
              setStatus('processing');
              break;
          }
        }
        return false;
      } catch {
        return false;
      }
    };

    const poll = async () => {
      if (attempts >= maxAttempts) {
        setError('Swap timeout - please check manually');
        return;
      }
      
      const done = await checkStatus();
      if (!done) {
        attempts++;
        setTimeout(poll, 5000);
      }
    };

    poll();
  };

  // ============================================
  // COPY & WALLET LINKS
  // ============================================
  
  const copyAddress = () => {
    if (depositAddress) {
      Clipboard.setString(depositAddress);
      Alert.alert('Copied!', 'Deposit address copied to clipboard');
    }
  };

  const openWallet = () => {
    if (!depositAddress) return;
    
    const token = FUNDING_TOKENS.find(t => t.id === fromToken);
    
    if (token?.chain === 'solana') {
      if (fromToken === 'USDC_SOL') {
        Linking.openURL(
          `https://phantom.app/ul/send?token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&destination=${depositAddress}&amount=${amount}`
        );
      } else {
        Linking.openURL(
          `https://phantom.app/ul/send?destination=${depositAddress}&amount=${amount}`
        );
      }
    } else if (token?.chain === 'ethereum') {
      Linking.openURL(`https://metamask.app.link/send/${depositAddress}`);
    } else if (token?.chain === 'bitcoin') {
      Linking.openURL(`bitcoin:${depositAddress}?amount=${amount}`);
    } else {
      copyAddress();
    }
  };

  const selectedToken = FUNDING_TOKENS.find(t => t.id === fromToken);

  // ============================================
  // RENDER: LOADING
  // ============================================
  
  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#1E3A5F', '#0F2744', '#0A1628']}
          style={styles.glowGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centered}>
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#4ECDC4" />
            </View>
            <Text style={styles.loadingText}>Loading wallet...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // ============================================
  // RENDER: TOKEN PICKER MODAL
  // ============================================
  
  const renderTokenPicker = () => (
    <Modal
      visible={showTokenPicker}
      transparent
      animationType="slide"
      onRequestClose={() => setShowTokenPicker(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Select Token</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {availableFromTokens.map((token) => (
              <TouchableOpacity
                key={token.id}
                style={[
                  styles.tokenOption,
                  fromToken === token.id && styles.tokenOptionSelected,
                ]}
                onPress={() => {
                  setFromToken(token.id);
                  setQuote(null);
                  setStatus('idle');
                  setShowTokenPicker(false);
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.tokenIconCircle, { backgroundColor: token.color }]}>
                  <Text style={styles.tokenIconText}>{token.icon}</Text>
                </View>
                <View style={styles.tokenInfo}>
                  <Text style={styles.tokenName}>{token.name}</Text>
                  <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                </View>
                {fromToken === token.id && (
                  <View style={styles.checkCircle}>
                    <Text style={styles.checkIcon}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => setShowTokenPicker(false)}
            activeOpacity={0.7}
          >
            <Text style={styles.modalCloseText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // ============================================
  // RENDER: DEPOSIT/STATUS SCREEN
  // ============================================
  
  if (status === 'pending' || status === 'processing' || status === 'success' || status === 'failed') {
    const token = FUNDING_TOKENS.find(t => t.id === fromToken);
    
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#1E3A5F', '#0F2744', '#0A1628']}
          style={styles.glowGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.depositScreen}>
            {/* Status Icon */}
            <View style={[
              styles.statusIconContainer,
              status === 'success' && styles.statusIconSuccess,
              status === 'failed' && styles.statusIconFailed,
            ]}>
              {status === 'pending' && <ActivityIndicator size="large" color="#4ECDC4" />}
              {status === 'processing' && <ActivityIndicator size="large" color="#4ECDC4" />}
              {status === 'success' && <Text style={styles.statusIconText}>✓</Text>}
              {status === 'failed' && <Text style={styles.statusIconTextFailed}>✕</Text>}
            </View>

            {/* Status Title */}
            <Text style={styles.statusTitle}>
              {status === 'pending' && 'Waiting for Deposit'}
              {status === 'processing' && 'Processing...'}
              {status === 'success' && 'Success!'}
              {status === 'failed' && 'Failed'}
            </Text>

            {/* Pending: Show deposit address */}
            {status === 'pending' && depositAddress && (
              <>
                <Text style={styles.depositInstruction}>
                  Send exactly{' '}
                  <Text style={styles.highlight}>
                    {amount} {token?.symbol}
                  </Text>{' '}
                  to this address:
                </Text>

                <View style={styles.addressCard}>
                  <Text style={styles.addressText} selectable>
                    {depositAddress}
                  </Text>
                </View>

                <View style={styles.depositActions}>
                  <TouchableOpacity style={styles.copyButton} onPress={copyAddress} activeOpacity={0.7}>
                    <Text style={styles.copyIcon}>📋</Text>
                    <Text style={styles.copyButtonText}>Copy Address</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.walletButton} onPress={openWallet} activeOpacity={0.7}>
                    <Text style={styles.walletButtonIcon}>
                      {token?.chain === 'solana' && '👻'}
                      {token?.chain === 'ethereum' && '🦊'}
                      {token?.chain === 'bitcoin' && '₿'}
                      {!['solana', 'ethereum', 'bitcoin'].includes(token?.chain || '') && '📱'}
                    </Text>
                    <Text style={styles.walletButtonText}>
                      {token?.chain === 'solana' && 'Open Phantom'}
                      {token?.chain === 'ethereum' && 'Open MetaMask'}
                      {token?.chain === 'bitcoin' && 'Open Wallet'}
                      {!['solana', 'ethereum', 'bitcoin'].includes(token?.chain || '') && 'Open Wallet'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.warningBox}>
                  <Text style={styles.warningIcon}>⚠</Text>
                  <Text style={styles.warningText}>
                    Only send {token?.symbol} on {token?.name}!
                  </Text>
                </View>
              </>
            )}

            {/* Processing */}
            {status === 'processing' && (
              <View style={styles.processingBox}>
                <Text style={styles.processingText}>
                  Processing your swap...{'\n'}
                  This usually takes 15-60 seconds
                </Text>
              </View>
            )}

            {/* Success */}
            {status === 'success' && (
              <View style={styles.successBox}>
                <View style={styles.successCard}>
                  <Text style={styles.successLabel}>You received</Text>
                  <Text style={styles.successAmount}>
                    {quote?.outputAmount.toFixed(6)} {vault?.chain}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.primaryButton} 
                  onPress={onClose || (() => navigation.goBack())}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Failed */}
            {status === 'failed' && (
              <View style={styles.failedBox}>
                <Text style={styles.failedText}>{error}</Text>
                <TouchableOpacity 
                  style={styles.retryButton} 
                  onPress={() => setStatus('idle')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // ============================================
  // RENDER: MAIN FUND SCREEN
  // ============================================

  return (
    <View style={styles.container}>
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
          {renderTokenPicker()}

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
              <Text style={styles.title}>Fund Wallet</Text>
              <Text style={styles.subtitle}>
                Add {vault?.chain} using any token
              </Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>

          {/* Wallet Info Card */}
          {vault && (
            <View style={styles.walletCard}>
              <View style={styles.walletCardHeader}>
                <View style={styles.walletIconContainer}>
                  <Text style={styles.walletIconEmoji}>⚡</Text>
                </View>
                <View style={styles.walletCardInfo}>
                  <Text style={styles.walletCardName}>
                    {vault.metadata?.vault_name || `${vault.chain} Wallet`}
                  </Text>
                  <Text style={styles.walletCardAddress}>
                    {vault.address.slice(0, 12)}...{vault.address.slice(-8)}
                  </Text>
                </View>
                <View style={styles.chainBadge}>
                  <Text style={styles.chainBadgeText}>{vault.chain}</Text>
                </View>
              </View>
            </View>
          )}

          {/* From Token Card */}
          <View style={styles.swapCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>Pay With</Text>
            </View>
            
            <TouchableOpacity
              style={styles.tokenSelector}
              onPress={() => setShowTokenPicker(true)}
              activeOpacity={0.7}
            >
              <View style={[styles.tokenSelectorIcon, { backgroundColor: selectedToken?.color }]}>
                <Text style={styles.tokenSelectorIconText}>{selectedToken?.icon}</Text>
              </View>
              <View style={styles.tokenSelectorInfo}>
                <Text style={styles.tokenSelectorName}>{selectedToken?.name}</Text>
                <Text style={styles.tokenSelectorSymbol}>{selectedToken?.symbol}</Text>
              </View>
              <View style={styles.dropdownIndicator}>
                <Text style={styles.dropdownIcon}>▼</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.amountInputContainer}>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor="rgba(255,255,255,0.3)"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={(text) => {
                  setAmount(text);
                  setQuote(null);
                  setStatus('idle');
                }}
              />
              <Text style={styles.inputSuffix}>{selectedToken?.symbol}</Text>
            </View>
          </View>

          {/* Arrow */}
          <View style={styles.arrowContainer}>
            <View style={styles.arrowCircle}>
              <Text style={styles.arrowIcon}>↓</Text>
            </View>
          </View>

          {/* To Token Card */}
          <View style={styles.swapCard}>
            <Text style={styles.cardLabel}>You Receive</Text>
            
            <View style={styles.receiveRow}>
              <View style={[
                styles.receiveIcon, 
                vault?.chain === 'SOL' ? styles.solBg : styles.zecBg
              ]}>
                <Text style={styles.receiveIconText}>
                  {vault?.chain === 'SOL' ? '◎' : 'Z'}
                </Text>
              </View>
              <View style={styles.receiveInfo}>
                <Text style={styles.receiveName}>
                  {vault?.chain === 'SOL' ? 'Solana' : 'Zcash'}
                </Text>
                <Text style={styles.receiveSymbol}>{vault?.chain}</Text>
              </View>
              {vault?.chain === 'ZEC' && (
                <View style={styles.shieldedBadge}>
                  <Text style={styles.shieldedText}>◈ Shielded</Text>
                </View>
              )}
            </View>

            <View style={styles.receiveAmountBox}>
              <Text style={styles.receiveAmount}>
                {quote ? quote.outputAmount.toFixed(6) : '0.00'}
              </Text>
            </View>
          </View>

          {/* Quote Details */}
          {quote && (
            <View style={styles.quoteCard}>
              <View style={styles.quoteRow}>
                <Text style={styles.quoteLabel}>Rate</Text>
                <Text style={styles.quoteValue}>
                  1 {selectedToken?.symbol} = {quote.exchangeRate.toFixed(4)} {vault?.chain}
                </Text>
              </View>
              <View style={styles.quoteDivider} />
              <View style={styles.quoteRow}>
                <Text style={styles.quoteLabel}>Fee</Text>
                <Text style={styles.quoteValue}>{quote.fee}</Text>
              </View>
              <View style={styles.quoteDivider} />
              <View style={styles.quoteRow}>
                <Text style={styles.quoteLabel}>Est. Time</Text>
                <Text style={styles.quoteValue}>{quote.estimatedTime}</Text>
              </View>
            </View>
          )}

          {/* Error */}
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorIcon}>⚠</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Action Button */}
          <TouchableOpacity
            style={[
              styles.primaryButton,
              (status === 'quoting' || status === 'executing' || !amount) && styles.buttonDisabled,
            ]}
            onPress={status === 'quoted' ? executeSwap : getQuote}
            disabled={status === 'quoting' || status === 'executing' || !amount}
            activeOpacity={0.8}
          >
            {(status === 'quoting' || status === 'executing') ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#0A1628" size="small" />
                <Text style={styles.loadingText}>
                  {status === 'quoting' ? 'Getting quote...' : 'Processing...'}
                </Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonText}>
                {status === 'quoted' ? 'Confirm & Fund' : 'Get Quote'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🔐</Text>
              <Text style={styles.infoText}>Powered by NEAR Intents</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>⏱</Text>
              <Text style={styles.infoText}>Usually completes in 1-3 minutes</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>💰</Text>
              <Text style={styles.infoText}>~0.1% fee</Text>
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
};

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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },

  // Wallet Card
  walletCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.3)',
  },
  walletCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletIconContainer: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  walletIconEmoji: {
    fontSize: 20,
    color: '#FBBF24',
  },
  walletCardInfo: {
    flex: 1,
  },
  walletCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  walletCardAddress: {
    fontSize: 12,
    color: '#4ECDC4',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: 2,
  },
  chainBadge: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  chainBadgeText: {
    fontSize: 12,
    color: '#4ECDC4',
    fontWeight: '600',
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
    marginBottom: 16,
  },

  // Token Selector
  tokenSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 58, 95, 0.5)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  tokenSelectorIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tokenSelectorIconText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  tokenSelectorInfo: {
    flex: 1,
  },
  tokenSelectorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tokenSelectorSymbol: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  dropdownIndicator: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownIcon: {
    fontSize: 10,
    color: '#6B7280',
  },

  // Amount Input
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.2)',
  },
  amountInput: {
    flex: 1,
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingVertical: 12,
  },
  inputSuffix: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '600',
  },

  // Arrow
  arrowContainer: {
    alignItems: 'center',
    marginVertical: -16,
    zIndex: 10,
  },
  arrowCircle: {
    width: 48,
    height: 48,
    backgroundColor: '#1E3A5F',
    borderRadius: 14,
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
  arrowIcon: {
    fontSize: 22,
    color: '#4ECDC4',
    fontWeight: 'bold',
  },

  // Receive Section
  receiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  receiveIcon: {
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
  receiveIconText: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  receiveInfo: {
    flex: 1,
  },
  receiveName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  receiveSymbol: {
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
  receiveAmountBox: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(59, 130, 246, 0.2)',
    paddingTop: 16,
  },
  receiveAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#4ECDC4',
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

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0F2744',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderBottomWidth: 0,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  tokenOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tokenOptionSelected: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderColor: 'rgba(78, 205, 196, 0.3)',
  },
  tokenIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  tokenIconText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  tokenInfo: {
    flex: 1,
  },
  tokenName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tokenSymbol: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  checkCircle: {
    width: 24,
    height: 24,
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    fontSize: 14,
    color: '#0A1628',
    fontWeight: 'bold',
  },
  modalClose: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    borderRadius: 12,
  },
  modalCloseText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },

  // Deposit Screen
  depositScreen: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  statusIconContainer: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(78, 205, 196, 0.3)',
    marginBottom: 24,
  },
  statusIconSuccess: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    borderColor: '#4ECDC4',
  },
  statusIconFailed: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444',
  },
  statusIconText: {
    fontSize: 48,
    color: '#4ECDC4',
  },
  statusIconTextFailed: {
    fontSize: 48,
    color: '#EF4444',
  },
  statusTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  depositInstruction: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  highlight: {
    color: '#4ECDC4',
    fontWeight: '600',
  },
  addressCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.3)',
  },
  addressText: {
    color: '#4ECDC4',
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'center',
    lineHeight: 22,
  },
  depositActions: {
    width: '100%',
    marginBottom: 20,
  },
  copyButton: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.3)',
  },
  copyIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  copyButtonText: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: '600',
  },
  walletButton: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  walletButtonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  walletButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  warningBox: {
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.3)',
  },
  warningIcon: {
    fontSize: 16,
    color: '#EAB308',
    marginRight: 8,
  },
  warningText: {
    color: '#EAB308',
    fontSize: 13,
    fontWeight: '500',
  },
  processingBox: {
    padding: 32,
    alignItems: 'center',
  },
  processingText: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 26,
  },
  successBox: {
    width: '100%',
    alignItems: 'center',
  },
  successCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.3)',
  },
  successLabel: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 8,
  },
  successAmount: {
    color: '#4ECDC4',
    fontSize: 32,
    fontWeight: '700',
  },
  failedBox: {
    alignItems: 'center',
    width: '100%',
  },
  failedText: {
    color: '#EF4444',
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FundMe;