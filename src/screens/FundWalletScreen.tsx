// /**
//  * ============================================
//  * FUND WALLET SCREEN - NEAR INTENTS POWERED
//  * ============================================
//  * 
//  * Fund your wallet from any token using NEAR Intents 1Click API
//  * Supports: ETH, BTC, USDC, SOL, ZEC, NEAR and 100+ tokens
//  */

// import React, { useState } from 'react';
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
//   SafeAreaView,
// } from 'react-native';
// import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../types/navigation';
// import Clipboard from '@react-native-clipboard/clipboard';

// // ============================================
// // CONFIGURATION
// // ============================================

// const API_BASE ='https://pawpad-arcium-backend.onrender.com';

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

// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'FundWallet'>;
// type RoutePropType = RouteProp<RootStackParamList, 'FundWallet'>;

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

// // ============================================
// // MAIN COMPONENT
// // ============================================

// const FundWalletScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<RoutePropType>();
//   const vault = route.params?.vault;

//   // ============================================
//   // STATE
//   // ============================================
  
//   const [mode, setMode] = useState<'receive' | 'swap'>('swap');
//   const [fromToken, setFromToken] = useState('ETH');
//   const [amount, setAmount] = useState('');
//   const [quote, setQuote] = useState<Quote | null>(null);
//   const [depositAddress, setDepositAddress] = useState<string | null>(null);
//   const [swapId, setSwapId] = useState<string | null>(null);
//   const [status, setStatus] = useState<'idle' | 'quoting' | 'quoted' | 'executing' | 'pending' | 'processing' | 'success' | 'failed'>('idle');
//   const [error, setError] = useState<string | null>(null);
//   const [showTokenPicker, setShowTokenPicker] = useState(false);
//   const [copied, setCopied] = useState(false);

//   const [toToken, setToToken] = useState<'SOL' | 'ZEC'>('SOL');

//   const getDestinationAddress = () => {
//   if (toToken === 'ZEC' && vault?.zec?.address) {
//     return vault.zec.address;
//   }
//   // SOL address - check unified first, then legacy
//   return vault?.sol?.address || vault?.address;
// };

// // Helper to check if this is a unified wallet
// const isUnifiedWallet = vault?.sol?.address && vault?.zec?.address;

//   // ============================================
//   // AVAILABLE TOKENS (exclude destination token)
//   // ============================================
  
//   const availableFromTokens = FUNDING_TOKENS.filter(token => {
//     if (!vault) return true;
//     if (vault.chain === 'SOL' && token.id === 'SOL') return false;
//     if (vault.chain === 'ZEC' && token.id === 'ZEC') return false;
//     return true;
//   });

//   // ============================================
//   // API CALLS
//   // ============================================

//   const getQuote = async () => {
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
//         // body: JSON.stringify({
//         //   from_token: fromToken,
//         //   to_token: vault?.chain || 'SOL',
//         //   amount: parseFloat(amount),
//         //   vault_id: vault?.vault_id,
//         //   destination_address: vault?.address,
//         // }),
//         body: JSON.stringify({
//   from_token: fromToken,
//   to_token: toToken,  // Changed from vault?.chain
//   amount: parseFloat(amount),
//   vault_id: vault?.vault_id,
//   destination_address: getDestinationAddress(),  // Changed from vault?.address
// }),
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
//       setError(err.message || 'Network error - is the server running?');
//       setStatus('idle');
//     }
//   };

//   const executeSwap = async () => {
//     setStatus('executing');
//     setError(null);

//     try {
//       const response = await fetch(`${API_BASE}/api/fund/execute`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         // body: JSON.stringify({
//         //   from_token: fromToken,
//         //   to_token: vault?.chain || 'SOL',
//         //   amount: parseFloat(amount),
//         //   vault_id: vault?.vault_id,
//         //   destination_address: vault?.address,
//         // }),
//          body: JSON.stringify({
//         from_token: fromToken,
//         to_token: toToken,  // ← Change this too
//         amount: parseFloat(amount),
//         vault_id: vault?.vault_id,
//         destination_address: getDestinationAddress(),  // ← And this
//       }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         const addr = data.depositAddress || data.quote?.depositAddress || data.raw?.quote?.depositAddress;
//         console.log('Deposit address:', addr);
//         setDepositAddress(addr);
//         setSwapId(addr);
//         setStatus('pending');
        
//         if (addr) {
//           pollForSuccess(addr);
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

//   const pollForSuccess = async (depositAddr: string) => {
//     let attempts = 0;
//     const maxAttempts = 60;
//     let initialBalance: number | null = null;
    
//     if (vault?.address && vault?.chain === 'SOL') {
//       try {
//         const balResponse = await fetch(`${API_BASE}/api/fund/solana-balance/${vault.address}`);
//         const balData = await balResponse.json();
//         if (balData.success) {
//           initialBalance = balData.sol;
//           console.log('Initial SOL balance:', initialBalance);
//         }
//       } catch (e) {
//         console.log('Could not get initial balance');
//       }
//     }

//     const checkBalance = async (): Promise<boolean> => {
//       try {
//         if (!vault?.address || vault?.chain !== 'SOL') {
//           return false;
//         }
        
//         const response = await fetch(`${API_BASE}/api/fund/solana-balance/${vault.address}`);
//         const data = await response.json();
        
//         console.log('Balance check:', data.sol, 'Initial:', initialBalance);

//         if (data.success && initialBalance !== null) {
//           const expectedIncrease = quote?.outputAmount || 0;
//           const actualIncrease = data.sol - initialBalance;
          
//           if (actualIncrease > expectedIncrease * 0.9) {
//             console.log('✅ Balance increased! Swap successful.');
//             setStatus('success');
//             return true;
//           }
//         }
        
//         return false;
//       } catch (e) {
//         console.log('Balance check error:', e);
//         return false;
//       }
//     };

//     const poll = async () => {
//       if (attempts >= maxAttempts) {
//         console.log('Stopped polling - check explorer manually');
//         return;
//       }
      
//       const done = await checkBalance();
//       if (!done) {
//         attempts++;
//         setTimeout(poll, 5000);
//       }
//     };

//     setTimeout(poll, 15000);
//   };

//   // ============================================
//   // HELPERS
//   // ============================================

//   const copyAddress = (address: string) => {
//     Clipboard.setString(address);
//     setCopied(true);
//     Alert.alert('Copied!', 'Address copied to clipboard');
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const openWallet = () => {
//     if (!depositAddress) return;
    
//     const token = FUNDING_TOKENS.find(t => t.id === fromToken);
    
//     if (token?.chain === 'solana') {
//       if (fromToken === 'USDC_SOL') {
//         Linking.openURL(`https://phantom.app/ul/send?token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&destination=${depositAddress}&amount=${amount}`);
//       } else {
//         Linking.openURL(`https://phantom.app/ul/send?destination=${depositAddress}&amount=${amount}`);
//       }
//     } else if (token?.chain === 'ethereum') {
//       Linking.openURL(`https://metamask.app.link/send/${depositAddress}`);
//     } else if (token?.chain === 'bitcoin') {
//       Linking.openURL(`bitcoin:${depositAddress}?amount=${amount}`);
//     } else {
//       copyAddress(depositAddress);
//     }
//   };

//   const openExplorer = () => {
//     if (depositAddress) {
//       Linking.openURL(`https://explorer.near-intents.org/transactions/${depositAddress}`);
//     }
//   };

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
//                 {fromToken === token.id && (
//                   <Text style={styles.checkmark}>✓</Text>
//                 )}
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
//   // RENDER: DEPOSIT SCREEN (after execute)
//   // ============================================
  
//   if (status === 'pending' || status === 'processing' || status === 'success' || status === 'failed') {
//     const token = FUNDING_TOKENS.find(t => t.id === fromToken);
    
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Text style={styles.backButton}>← Back</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.depositScreen}>
//           <Text style={styles.statusTitle}>
//             {status === 'pending' && '⏳ Waiting for Deposit'}
//             {status === 'processing' && '⚙️ Processing Swap...'}
//             {status === 'success' && '✅ Success!'}
//             {status === 'failed' && '❌ Failed'}
//           </Text>

//           {status === 'pending' && depositAddress && (
//             <>
//               <Text style={styles.depositInstruction}>
//                 Send exactly{' '}
//                 <Text style={styles.highlight}>{amount} {token?.symbol}</Text>
//                 {' '}to this address:
//               </Text>

//               <View style={styles.addressBox}>
//                 <Text style={styles.addressText} selectable>
//                   {depositAddress}
//                 </Text>
//               </View>

//               <TouchableOpacity 
//                 style={styles.copyButton} 
//                 onPress={() => copyAddress(depositAddress)}
//               >
//                 <Text style={styles.buttonText}>📋 Copy Address</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.walletButton} onPress={openWallet}>
//                 <Text style={styles.buttonText}>
//                   {token?.chain === 'solana' && '👻 Open Phantom'}
//                   {token?.chain === 'ethereum' && '🦊 Open MetaMask'}
//                   {token?.chain === 'bitcoin' && '₿ Open Bitcoin Wallet'}
//                   {!['solana', 'ethereum', 'bitcoin'].includes(token?.chain || '') && '📱 Open Wallet'}
//                 </Text>
//               </TouchableOpacity>

//               <Text style={styles.warningText}>
//                 ⚠️ Only send {token?.symbol} on {token?.name} network!
//               </Text>

//               <View style={styles.quoteReminder}>
//                 <Text style={styles.quoteReminderText}>
//                   You will receive: ~{quote?.outputAmount.toFixed(6)} {vault?.chain}
//                 </Text>
//               </View>

//               <TouchableOpacity 
//                 style={styles.sentItButton} 
//                 onPress={() => setStatus('processing')}
//               >
//                 <Text style={styles.sentItButtonText}>✅ I've Sent the Payment</Text>
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 style={styles.explorerLink} 
//                 onPress={openExplorer}
//               >
//                 <Text style={styles.explorerLinkText}>🔍 View on NEAR Intents Explorer</Text>
//               </TouchableOpacity>
//             </>
//           )}

//           {status === 'processing' && (
//             <View style={styles.processingBox}>
//               <ActivityIndicator size="large" color="#4ECDC4" />
//               <Text style={styles.processingText}>
//                 Processing your swap...{'\n'}
//                 This usually takes 15-60 seconds
//               </Text>
              
//               <TouchableOpacity 
//                 style={styles.explorerLinkSmall} 
//                 onPress={openExplorer}
//               >
//                 <Text style={styles.explorerLinkText}>🔍 Check Status on Explorer</Text>
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 style={styles.manualSuccessButton} 
//                 onPress={() => setStatus('success')}
//               >
//                 <Text style={styles.manualSuccessText}>Transaction confirmed? Tap here</Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           {status === 'success' && (
//             <View style={styles.successBox}>
//               <Text style={styles.successEmoji}>🎉</Text>
//               <Text style={styles.successText}>
//                 {quote?.outputAmount.toFixed(6)} {vault?.chain} added to your wallet!
//               </Text>
//               <TouchableOpacity 
//                 style={styles.doneButton} 
//                 onPress={() => navigation.goBack()}
//               >
//                 <Text style={styles.doneButtonText}>Done</Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           {status === 'failed' && (
//             <View style={styles.failedBox}>
//               <Text style={styles.failedText}>{error}</Text>
//               <TouchableOpacity 
//                 style={styles.retryButton} 
//                 onPress={() => setStatus('idle')}
//               >
//                 <Text style={styles.buttonText}>Try Again</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // ============================================
//   // RENDER: MAIN SCREEN
//   // ============================================
  
//   const selectedToken = FUNDING_TOKENS.find(t => t.id === fromToken);

//   return (
//     <SafeAreaView style={styles.container}>
//       {renderTokenPicker()}

//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Text style={styles.backButton}>← Back</Text>
//           </TouchableOpacity>
//           <Text style={styles.title}>Fund Your Wallet</Text>
//           <Text style={styles.subtitle}>
//             Add {vault?.chain} using any supported token
//           </Text>
//         </View>

//         {/* Mode Toggle */}
//         <View style={styles.modeToggle}>
//           <TouchableOpacity 
//             style={[styles.modeButton, mode === 'swap' && styles.modeButtonActive]}
//             onPress={() => setMode('swap')}
//           >
//             <Text style={[styles.modeButtonText, mode === 'swap' && styles.modeButtonTextActive]}>
//               🔄 Swap Any Token
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity 
//             style={[styles.modeButton, mode === 'receive' && styles.modeButtonActive]}
//             onPress={() => setMode('receive')}
//           >
//             <Text style={[styles.modeButtonText, mode === 'receive' && styles.modeButtonTextActive]}>
//               📥 Direct Receive
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {mode === 'receive' ? (
//           /* RECEIVE MODE - Just show address */
//           <View style={styles.receiveMode}>
//             <View style={styles.qrPlaceholder}>
//               <Text style={styles.qrIcon}>📱</Text>
//               <Text style={styles.qrText}>QR Code</Text>
//             </View>

//             <Text style={styles.sectionTitle}>Wallet Address</Text>
//             <View style={styles.addressContainer}>
//               <Text style={styles.walletAddress}>{vault?.address}</Text>
//               <TouchableOpacity 
//                 style={styles.copyAddressButton}
//                 onPress={() => vault?.address && copyAddress(vault.address)}
//               >
//                 <Text style={styles.copyAddressButtonText}>
//                   {copied ? '✓ Copied' : 'Copy'}
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             <View style={styles.networkInfo}>
//               <Text style={styles.sectionTitle}>Network Information</Text>
//               <View style={styles.networkRow}>
//                 <Text style={styles.networkLabel}>Chain</Text>
//                 <Text style={styles.networkValue}>{vault?.chain}</Text>
//               </View>
//               <View style={styles.networkRow}>
//                 <Text style={styles.networkLabel}>Network</Text>
//                 <Text style={styles.networkValue}>Mainnet</Text>
//               </View>
//               <View style={styles.networkRow}>
//                 <Text style={styles.networkLabel}>MPC Provider</Text>
//                 <Text style={styles.networkValue}>{vault?.mpc_provider}</Text>
//               </View>
//             </View>

//             <View style={styles.warningBox}>
//               <Text style={styles.warningBoxText}>
//                 ⚠️ Only send {vault?.chain} tokens on the {vault?.chain} network. 
//                 Sending other tokens may result in permanent loss.
//               </Text>
//             </View>
//           </View>
//         ) : (
//           /* SWAP MODE - Cross-chain funding */
//           <>
//             {/* From Token */}
//             <View style={styles.section}>
//               <Text style={styles.sectionLabel}>Pay With</Text>
//               <TouchableOpacity
//                 style={styles.tokenSelector}
//                 onPress={() => setShowTokenPicker(true)}
//               >
//                 <Text style={styles.tokenSelectorIcon}>{selectedToken?.icon}</Text>
//                 <Text style={styles.tokenSelectorText}>{selectedToken?.name}</Text>
//                 <Text style={styles.tokenSelectorArrow}>▼</Text>
//               </TouchableOpacity>

//               <View style={styles.amountInput}>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="0.00"
//                   placeholderTextColor="#666"
//                   keyboardType="decimal-pad"
//                   value={amount}
//                   onChangeText={(text) => {
//                     setAmount(text);
//                     setQuote(null);
//                     setStatus('idle');
//                   }}
//                 />
//                 <Text style={styles.inputSuffix}>{selectedToken?.symbol}</Text>
//               </View>
//             </View>

//             {/* Arrow */}
//             <View style={styles.arrowBox}>
//               <Text style={styles.arrow}>↓</Text>
//             </View>

//             {/* To Token */}
//             {/* <View style={styles.section}>
//               <Text style={styles.sectionLabel}>You Receive</Text>
//               <View style={styles.receiveBox}>
//                 <Text style={styles.receiveIcon}>
//                   {vault?.chain === 'SOL' ? '◎' : '🛡️'}
//                 </Text>
//                 <Text style={styles.receiveText}>
//                   {quote ? `${quote.outputAmount.toFixed(6)} ${vault?.chain}` : `— ${vault?.chain}`}
//                 </Text>
//               </View>
//             </View> */}
//             {/* To Token */}
// <View style={styles.section}>
//   <Text style={styles.sectionLabel}>You Receive</Text>
  
//   {/* Token toggle for unified wallets */}
//   {isUnifiedWallet && (
//     <View style={styles.receiveTokenToggle}>
//       <TouchableOpacity
//         style={[styles.receiveTokenBtn, toToken === 'SOL' && styles.receiveTokenBtnActive]}
//         onPress={() => { setToToken('SOL'); setQuote(null); }}
//       >
//         <Text style={[styles.receiveTokenText, toToken === 'SOL' && styles.receiveTokenTextActive]}>◎ SOL</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={[styles.receiveTokenBtn, toToken === 'ZEC' && styles.receiveTokenBtnActive]}
//         onPress={() => { setToToken('ZEC'); setQuote(null); }}
//       >
//         <Text style={[styles.receiveTokenText, toToken === 'ZEC' && styles.receiveTokenTextActive]}>🛡️ ZEC</Text>
//       </TouchableOpacity>
//     </View>
//   )}

//   <View style={styles.receiveBox}>
//     <Text style={styles.receiveIcon}>
//       {toToken === 'SOL' ? '◎' : '🛡️'}
//     </Text>
//     <Text style={styles.receiveText}>
//       {quote ? `${quote.outputAmount.toFixed(6)} ${toToken}` : `— ${toToken}`}
//     </Text>
//   </View>
// </View>

//             {/* Quote Details */}
//             {quote && (
//               <View style={styles.quoteDetails}>
//                 <View style={styles.quoteRow}>
//                   <Text style={styles.quoteLabel}>Rate</Text>
//                   <Text style={styles.quoteValue}>
//                     1 {selectedToken?.symbol} = {quote.exchangeRate.toFixed(6)} {vault?.chain}
//                   </Text>
//                 </View>
//                 <View style={styles.quoteRow}>
//                   <Text style={styles.quoteLabel}>Fee</Text>
//                   <Text style={styles.quoteValue}>{quote.fee}</Text>
//                 </View>
//                 <View style={styles.quoteRow}>
//                   <Text style={styles.quoteLabel}>Est. Time</Text>
//                   <Text style={styles.quoteValue}>{quote.estimatedTime}</Text>
//                 </View>
//                 <View style={styles.quoteRow}>
//                   <Text style={styles.quoteLabel}>Value</Text>
//                   <Text style={styles.quoteValue}>~${quote.outputAmountUsd}</Text>
//                 </View>
//               </View>
//             )}

//             {/* Error */}
//             {error && (
//               <View style={styles.errorBox}>
//                 <Text style={styles.errorText}>❌ {error}</Text>
//               </View>
//             )}

//             {/* Action Button */}
//             <TouchableOpacity
//               style={[
//                 styles.actionButton,
//                 (status === 'quoting' || status === 'executing') && styles.buttonDisabled,
//               ]}
//               onPress={status === 'quoted' ? executeSwap : getQuote}
//               disabled={status === 'quoting' || status === 'executing'}
//             >
//               {(status === 'quoting' || status === 'executing') ? (
//                 <ActivityIndicator color="#000" />
//               ) : (
//                 <Text style={styles.actionButtonText}>
//                   {status === 'quoted' ? 'Confirm & Get Deposit Address' : 'Get Quote'}
//                 </Text>
//               )}
//             </TouchableOpacity>

//             {/* Info */}
//             <View style={styles.infoBox}>
//               <Text style={styles.infoTitle}>How it works</Text>
//               <Text style={styles.infoStep}>1. Select token and enter amount</Text>
//               <Text style={styles.infoStep}>2. Get a quote and confirm</Text>
//               <Text style={styles.infoStep}>3. Send tokens to the deposit address</Text>
//               <Text style={styles.infoStep}>4. Receive {vault?.chain} in your wallet (~15-60s)</Text>
//             </View>

//             {/* Footer */}
//             <Text style={styles.footer}>
//               Powered by NEAR Intents • 0.1% fee
//             </Text>
//           </>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// // ============================================
// // STYLES
// // ============================================

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0A1628',
//   },
//   header: {
//     paddingHorizontal: 24,
//     paddingTop: 16,
//     paddingBottom: 24,
//   },
//   backButton: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#9CA3AF',
//     marginTop: 4,
//   },
//   modeToggle: {
//     flexDirection: 'row',
//     marginHorizontal: 24,
//     marginBottom: 24,
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 4,
//   },
//   modeButton: {
//     flex: 1,
//     paddingVertical: 12,
//     alignItems: 'center',
//     borderRadius: 10,
//   },
//   modeButtonActive: {
//     backgroundColor: '#4ECDC4',
//   },
//   modeButtonText: {
//     color: '#9CA3AF',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   modeButtonTextActive: {
//     color: '#000000',
//   },
//   receiveMode: {
//     paddingHorizontal: 24,
//   },
//   qrPlaceholder: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 40,
//     alignItems: 'center',
//     alignSelf: 'center',
//     marginBottom: 24,
//   },
//   qrIcon: {
//     fontSize: 64,
//   },
//   qrText: {
//     color: '#000',
//     marginTop: 8,
//     fontSize: 14,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#FFFFFF',
//     marginBottom: 12,
//   },
//   addressContainer: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   walletAddress: {
//     flex: 1,
//     color: '#FFFFFF',
//     fontSize: 13,
//     fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
//   },
//   copyAddressButton: {
//     backgroundColor: '#4ECDC4',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//     marginLeft: 12,
//   },
//   copyAddressButtonText: {
//     color: '#000',
//     fontWeight: '600',
//   },
//   networkInfo: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 24,
//   },
//   networkRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   networkLabel: {
//     color: '#9CA3AF',
//     fontSize: 14,
//   },
//   networkValue: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   receiveTokenToggle: {
//   flexDirection: 'row',
//   backgroundColor: '#1E293B',
//   borderRadius: 8,
//   padding: 4,
//   marginBottom: 12,
// },
// receiveTokenBtn: {
//   flex: 1,
//   paddingVertical: 10,
//   alignItems: 'center',
//   borderRadius: 6,
// },
// receiveTokenBtnActive: {
//   backgroundColor: '#4ECDC4',
// },
// receiveTokenText: {
//   color: '#9CA3AF',
//   fontSize: 14,
//   fontWeight: '600',
// },
// receiveTokenTextActive: {
//   color: '#000000',
// },
//   warningBox: {
//     backgroundColor: 'rgba(245, 158, 11, 0.1)',
//     borderRadius: 12,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(245, 158, 11, 0.3)',
//   },
//   warningBoxText: {
//     color: '#F59E0B',
//     fontSize: 14,
//     lineHeight: 20,
//   },
//   section: {
//     paddingHorizontal: 24,
//     marginBottom: 8,
//   },
//   sectionLabel: {
//     fontSize: 12,
//     color: '#9CA3AF',
//     textTransform: 'uppercase',
//     marginBottom: 8,
//   },
//   tokenSelector: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1E293B',
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
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   tokenSelectorArrow: {
//     color: '#9CA3AF',
//   },
//   amountInput: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//   },
//   input: {
//     flex: 1,
//     fontSize: 32,
//     fontWeight: '600',
//     color: '#FFFFFF',
//     paddingVertical: 16,
//   },
//   inputSuffix: {
//     fontSize: 18,
//     color: '#9CA3AF',
//     fontWeight: '600',
//   },
//   arrowBox: {
//     alignItems: 'center',
//     marginVertical: 8,
//   },
//   arrow: {
//     fontSize: 24,
//     color: '#4ECDC4',
//   },
//   receiveBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1E293B',
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
//     color: '#4ECDC4',
//   },
//   quoteDetails: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 16,
//     marginHorizontal: 24,
//     marginTop: 16,
//   },
//   quoteRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   quoteLabel: {
//     color: '#9CA3AF',
//     fontSize: 14,
//   },
//   quoteValue: {
//     color: '#FFFFFF',
//     fontSize: 14,
//   },
//   errorBox: {
//     backgroundColor: 'rgba(239, 68, 68, 0.1)',
//     borderRadius: 12,
//     padding: 16,
//     marginHorizontal: 24,
//     marginTop: 16,
//   },
//   errorText: {
//     color: '#EF4444',
//     textAlign: 'center',
//   },
//   actionButton: {
//     backgroundColor: '#4ECDC4',
//     borderRadius: 12,
//     padding: 18,
//     alignItems: 'center',
//     marginHorizontal: 24,
//     marginTop: 24,
//   },
//   buttonDisabled: {
//     opacity: 0.5,
//   },
//   actionButtonText: {
//     color: '#000000',
//     fontSize: 18,
//     fontWeight: '700',
//   },
//   infoBox: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 16,
//     marginHorizontal: 24,
//     marginTop: 24,
//   },
//   infoTitle: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   infoStep: {
//     color: '#9CA3AF',
//     fontSize: 14,
//     marginBottom: 8,
//   },
//   footer: {
//     textAlign: 'center',
//     color: '#6B7280',
//     fontSize: 12,
//     marginTop: 24,
//     marginBottom: 40,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.8)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: '#1E293B',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     padding: 20,
//     maxHeight: '70%',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#FFFFFF',
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
//     backgroundColor: 'rgba(78, 205, 196, 0.1)',
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
//     color: '#FFFFFF',
//   },
//   tokenSymbol: {
//     fontSize: 14,
//     color: '#9CA3AF',
//   },
//   checkmark: {
//     color: '#4ECDC4',
//     fontSize: 20,
//     fontWeight: '600',
//   },
//   modalClose: {
//     padding: 16,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   modalCloseText: {
//     color: '#9CA3AF',
//     fontSize: 16,
//   },
//   depositScreen: {
//     flex: 1,
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     paddingTop: 40,
//   },
//   statusTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginBottom: 24,
//   },
//   depositInstruction: {
//     fontSize: 16,
//     color: '#9CA3AF',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   highlight: {
//     color: '#4ECDC4',
//     fontWeight: '600',
//   },
//   addressBox: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 16,
//     width: '100%',
//     marginBottom: 16,
//   },
//   addressText: {
//     color: '#4ECDC4',
//     fontSize: 13,
//     fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
//     textAlign: 'center',
//   },
//   copyButton: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 16,
//     width: '100%',
//     alignItems: 'center',
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#4ECDC4',
//   },
//   walletButton: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 16,
//     width: '100%',
//     alignItems: 'center',
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#374151',
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   warningText: {
//     color: '#F59E0B',
//     fontSize: 12,
//     textAlign: 'center',
//     marginBottom: 24,
//   },
//   quoteReminder: {
//     backgroundColor: 'rgba(78, 205, 196, 0.1)',
//     borderRadius: 12,
//     padding: 16,
//     width: '100%',
//   },
//   quoteReminderText: {
//     color: '#4ECDC4',
//     textAlign: 'center',
//     fontWeight: '600',
//   },
//   processingBox: {
//     alignItems: 'center',
//     padding: 32,
//   },
//   processingText: {
//     color: '#9CA3AF',
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
//     color: '#4ECDC4',
//     fontSize: 18,
//     fontWeight: '600',
//     textAlign: 'center',
//     marginBottom: 24,
//   },
//   doneButton: {
//     backgroundColor: '#4ECDC4',
//     borderRadius: 12,
//     paddingHorizontal: 48,
//     paddingVertical: 16,
//   },
//   doneButtonText: {
//     color: '#000000',
//     fontSize: 18,
//     fontWeight: '700',
//   },
//   failedBox: {
//     alignItems: 'center',
//   },
//   failedText: {
//     color: '#EF4444',
//     fontSize: 16,
//     marginBottom: 16,
//   },
//   retryButton: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     paddingHorizontal: 32,
//     paddingVertical: 12,
//   },
//   sentItButton: {
//     backgroundColor: '#4ECDC4',
//     borderRadius: 12,
//     padding: 16,
//     width: '100%',
//     alignItems: 'center',
//     marginTop: 16,
//   },
//   sentItButtonText: {
//     color: '#000000',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   explorerLink: {
//     marginTop: 16,
//     padding: 12,
//   },
//   explorerLinkText: {
//     color: '#60A5FA',
//     fontSize: 14,
//     textDecorationLine: 'underline',
//   },
//   explorerLinkSmall: {
//     marginTop: 24,
//     padding: 8,
//   },
//   manualSuccessButton: {
//     marginTop: 16,
//     padding: 12,
//     backgroundColor: 'rgba(78, 205, 196, 0.1)',
//     borderRadius: 8,
//   },
//   manualSuccessText: {
//     color: '#4ECDC4',
//     fontSize: 13,
//   },
// });

// export default FundWalletScreen;

/**
 * ============================================
 * FUND WALLET SCREEN - NEAR INTENTS POWERED
 * ============================================
 * 
 * Fund your wallet from any token using NEAR Intents 1Click API
 * Supports: ETH, BTC, USDC, SOL, ZEC, NEAR and 100+ tokens
 * 
 * Styled with VoltWallet Premium Theme
 */

import React, { useState } from 'react';
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
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import LinearGradient from 'react-native-linear-gradient';
import Clipboard from '@react-native-clipboard/clipboard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================
// CONFIGURATION
// ============================================

const API_BASE = 'https://pawpad-arcium-backend.onrender.com';

const FUNDING_TOKENS = [
  { id: 'ETH', name: 'Ethereum', symbol: 'ETH', icon: '⟠', chain: 'ethereum', color: '#627EEA' },
  { id: 'USDC_SOL', name: 'USDC (Solana)', symbol: 'USDC', icon: '$', chain: 'solana', color: '#2775CA' },
  { id: 'USDC_ETH', name: 'USDC (Ethereum)', symbol: 'USDC', icon: '$', chain: 'ethereum', color: '#2775CA' },
  { id: 'BTC', name: 'Bitcoin', symbol: 'BTC', icon: '₿', chain: 'bitcoin', color: '#F7931A' },
  { id: 'ZEC', name: 'Zcash', symbol: 'ZEC', icon: 'Z', chain: 'zcash', color: '#F4B728' },
  { id: 'NEAR', name: 'NEAR', symbol: 'NEAR', icon: '◉', chain: 'near', color: '#00C08B' },
  { id: 'SOL', name: 'Solana', symbol: 'SOL', icon: '◎', chain: 'solana', color: '#9945FF' },
];

// ============================================
// TYPES
// ============================================

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'FundWallet'>;
type RoutePropType = RouteProp<RootStackParamList, 'FundWallet'>;

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

// ============================================
// MAIN COMPONENT
// ============================================

const FundWalletScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const vault = route.params?.vault;

  // ============================================
  // STATE
  // ============================================
  
  const [mode, setMode] = useState<'receive' | 'swap'>('swap');
  const [fromToken, setFromToken] = useState('ETH');
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [depositAddress, setDepositAddress] = useState<string | null>(null);
  const [swapId, setSwapId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'quoting' | 'quoted' | 'executing' | 'pending' | 'processing' | 'success' | 'failed'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [showTokenPicker, setShowTokenPicker] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toToken, setToToken] = useState<'SOL' | 'ZEC'>('SOL');

  const getDestinationAddress = () => {
    if (toToken === 'ZEC' && vault?.zec?.address) {
      return vault.zec.address;
    }
    return vault?.sol?.address || vault?.address;
  };

  const isUnifiedWallet = vault?.sol?.address && vault?.zec?.address;

  // ============================================
  // AVAILABLE TOKENS
  // ============================================
  
  const availableFromTokens = FUNDING_TOKENS.filter(token => {
    if (!vault) return true;
    if (vault.chain === 'SOL' && token.id === 'SOL') return false;
    if (vault.chain === 'ZEC' && token.id === 'ZEC') return false;
    return true;
  });

  // ============================================
  // API CALLS
  // ============================================

  const getQuote = async () => {
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
          to_token: toToken,
          amount: parseFloat(amount),
          vault_id: vault?.vault_id,
          destination_address: getDestinationAddress(),
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
      setError(err.message || 'Network error - is the server running?');
      setStatus('idle');
    }
  };

  const executeSwap = async () => {
    setStatus('executing');
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/fund/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_token: fromToken,
          to_token: toToken,
          amount: parseFloat(amount),
          vault_id: vault?.vault_id,
          destination_address: getDestinationAddress(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        const addr = data.depositAddress || data.quote?.depositAddress || data.raw?.quote?.depositAddress;
        setDepositAddress(addr);
        setSwapId(addr);
        setStatus('pending');
        
        if (addr) {
          pollForSuccess(addr);
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

  const pollForSuccess = async (depositAddr: string) => {
    let attempts = 0;
    const maxAttempts = 60;
    let initialBalance: number | null = null;
    
    if (vault?.address && vault?.chain === 'SOL') {
      try {
        const balResponse = await fetch(`${API_BASE}/api/fund/solana-balance/${vault.address}`);
        const balData = await balResponse.json();
        if (balData.success) {
          initialBalance = balData.sol;
        }
      } catch (e) {
        console.log('Could not get initial balance');
      }
    }

    const checkBalance = async (): Promise<boolean> => {
      try {
        if (!vault?.address || vault?.chain !== 'SOL') {
          return false;
        }
        
        const response = await fetch(`${API_BASE}/api/fund/solana-balance/${vault.address}`);
        const data = await response.json();

        if (data.success && initialBalance !== null) {
          const expectedIncrease = quote?.outputAmount || 0;
          const actualIncrease = data.sol - initialBalance;
          
          if (actualIncrease > expectedIncrease * 0.9) {
            setStatus('success');
            return true;
          }
        }
        
        return false;
      } catch (e) {
        return false;
      }
    };

    const poll = async () => {
      if (attempts >= maxAttempts) {
        return;
      }
      
      const done = await checkBalance();
      if (!done) {
        attempts++;
        setTimeout(poll, 5000);
      }
    };

    setTimeout(poll, 15000);
  };

  // ============================================
  // HELPERS
  // ============================================

  const copyAddress = (address: string) => {
    Clipboard.setString(address);
    setCopied(true);
    Alert.alert('Copied!', 'Address copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const openWallet = () => {
    if (!depositAddress) return;
    
    const token = FUNDING_TOKENS.find(t => t.id === fromToken);
    
    if (token?.chain === 'solana') {
      if (fromToken === 'USDC_SOL') {
        Linking.openURL(`https://phantom.app/ul/send?token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&destination=${depositAddress}&amount=${amount}`);
      } else {
        Linking.openURL(`https://phantom.app/ul/send?destination=${depositAddress}&amount=${amount}`);
      }
    } else if (token?.chain === 'ethereum') {
      Linking.openURL(`https://metamask.app.link/send/${depositAddress}`);
    } else if (token?.chain === 'bitcoin') {
      Linking.openURL(`bitcoin:${depositAddress}?amount=${amount}`);
    } else {
      copyAddress(depositAddress);
    }
  };

  const openExplorer = () => {
    if (depositAddress) {
      Linking.openURL(`https://explorer.near-intents.org/transactions/${depositAddress}`);
    }
  };

  const selectedToken = FUNDING_TOKENS.find(t => t.id === fromToken);

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
  // RENDER: DEPOSIT SCREEN (after execute)
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
          {/* Header */}
          <View style={styles.statusHeader}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            contentContainerStyle={styles.depositScreen}
            showsVerticalScrollIndicator={false}
          >
            {/* Status Icon */}
            <View style={[
              styles.statusIconContainer,
              status === 'success' && styles.statusIconSuccess,
              status === 'failed' && styles.statusIconFailed,
            ]}>
              {(status === 'pending' || status === 'processing') && (
                <ActivityIndicator size="large" color="#4ECDC4" />
              )}
              {status === 'success' && <Text style={styles.statusIconText}>✓</Text>}
              {status === 'failed' && <Text style={styles.statusIconTextFailed}>✕</Text>}
            </View>

            <Text style={styles.statusTitle}>
              {status === 'pending' && 'Waiting for Deposit'}
              {status === 'processing' && 'Processing Swap...'}
              {status === 'success' && 'Success!'}
              {status === 'failed' && 'Failed'}
            </Text>

            {/* Pending: Show deposit address */}
            {status === 'pending' && depositAddress && (
              <>
                <Text style={styles.depositInstruction}>
                  Send exactly{' '}
                  <Text style={styles.highlight}>{amount} {token?.symbol}</Text>
                  {' '}to this address:
                </Text>

                <View style={styles.addressCard}>
                  <Text style={styles.addressText} selectable>
                    {depositAddress}
                  </Text>
                </View>

                <View style={styles.depositActions}>
                  <TouchableOpacity 
                    style={styles.copyButton} 
                    onPress={() => copyAddress(depositAddress)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.copyButtonIcon}>📋</Text>
                    <Text style={styles.copyButtonText}>Copy Address</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.walletButton} 
                    onPress={openWallet}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.walletButtonIcon}>
                      {token?.chain === 'solana' && '👻'}
                      {token?.chain === 'ethereum' && '🦊'}
                      {token?.chain === 'bitcoin' && '₿'}
                      {!['solana', 'ethereum', 'bitcoin'].includes(token?.chain || '') && '📱'}
                    </Text>
                    <Text style={styles.walletButtonText}>
                      {token?.chain === 'solana' && 'Open Phantom'}
                      {token?.chain === 'ethereum' && 'Open MetaMask'}
                      {token?.chain === 'bitcoin' && 'Open Bitcoin Wallet'}
                      {!['solana', 'ethereum', 'bitcoin'].includes(token?.chain || '') && 'Open Wallet'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.warningBox}>
                  <Text style={styles.warningIcon}>⚠</Text>
                  <Text style={styles.warningText}>
                    Only send {token?.symbol} on {token?.name} network!
                  </Text>
                </View>

                <View style={styles.quoteReminderCard}>
                  <Text style={styles.quoteReminderLabel}>You will receive</Text>
                  <Text style={styles.quoteReminderAmount}>
                    ~{quote?.outputAmount.toFixed(6)} {toToken}
                  </Text>
                </View>

                <TouchableOpacity 
                  style={styles.primaryButton} 
                  onPress={() => setStatus('processing')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>✓ I've Sent the Payment</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.explorerLink} 
                  onPress={openExplorer}
                  activeOpacity={0.7}
                >
                  <Text style={styles.explorerLinkText}>🔍 View on NEAR Intents Explorer</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Processing */}
            {status === 'processing' && (
              <View style={styles.processingBox}>
                <Text style={styles.processingText}>
                  Processing your swap...{'\n'}
                  This usually takes 15-60 seconds
                </Text>
                
                <TouchableOpacity 
                  style={styles.explorerLink} 
                  onPress={openExplorer}
                  activeOpacity={0.7}
                >
                  <Text style={styles.explorerLinkText}>🔍 Check Status on Explorer</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.manualSuccessButton} 
                  onPress={() => setStatus('success')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.manualSuccessText}>Transaction confirmed? Tap here</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Success */}
            {status === 'success' && (
              <View style={styles.successBox}>
                <View style={styles.successCard}>
                  <Text style={styles.successLabel}>Added to your wallet</Text>
                  <Text style={styles.successAmount}>
                    {quote?.outputAmount.toFixed(6)} {toToken}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.primaryButton} 
                  onPress={() => navigation.goBack()}
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
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // ============================================
  // RENDER: MAIN SCREEN
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
        {renderTokenPicker()}

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
              <Text style={styles.title}>Fund Wallet</Text>
              <Text style={styles.subtitle}>
                Add {vault?.chain || 'crypto'} using any token
              </Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>

          {/* Mode Toggle */}
          <View style={styles.modeToggle}>
            <TouchableOpacity 
              style={[styles.modeButton, mode === 'swap' && styles.modeButtonActive]}
              onPress={() => setMode('swap')}
              activeOpacity={0.7}
            >
              <Text style={[styles.modeButtonText, mode === 'swap' && styles.modeButtonTextActive]}>
                ⇄ Swap Any Token
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modeButton, mode === 'receive' && styles.modeButtonActive]}
              onPress={() => setMode('receive')}
              activeOpacity={0.7}
            >
              <Text style={[styles.modeButtonText, mode === 'receive' && styles.modeButtonTextActive]}>
                ↓ Direct Receive
              </Text>
            </TouchableOpacity>
          </View>

          {mode === 'receive' ? (
            /* RECEIVE MODE */
            <View style={styles.receiveMode}>
              {/* QR Placeholder */}
              <View style={styles.qrCard}>
                <View style={styles.qrPlaceholder}>
                  <Text style={styles.qrIcon}>📱</Text>
                  <Text style={styles.qrText}>QR Code</Text>
                </View>
              </View>

              {/* Address Card */}
              <View style={styles.addressSection}>
                <Text style={styles.sectionTitle}>Wallet Address</Text>
                <View style={styles.addressContainer}>
                  <Text style={styles.walletAddressText}>{vault?.address}</Text>
                  <TouchableOpacity 
                    style={styles.copyAddressBtn}
                    onPress={() => vault?.address && copyAddress(vault.address)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.copyAddressBtnText}>
                      {copied ? '✓' : 'Copy'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Network Info */}
              <View style={styles.networkCard}>
                <Text style={styles.sectionTitle}>Network Information</Text>
                <View style={styles.networkRow}>
                  <Text style={styles.networkLabel}>Chain</Text>
                  <Text style={styles.networkValue}>{vault?.chain}</Text>
                </View>
                <View style={styles.networkDivider} />
                <View style={styles.networkRow}>
                  <Text style={styles.networkLabel}>Network</Text>
                  <Text style={styles.networkValue}>Mainnet</Text>
                </View>
                <View style={styles.networkDivider} />
                <View style={styles.networkRow}>
                  <Text style={styles.networkLabel}>MPC Provider</Text>
                  <Text style={[styles.networkValue, styles.providerText]}>{vault?.mpc_provider}</Text>
                </View>
              </View>

              {/* Warning */}
              <View style={styles.warningBox}>
                <Text style={styles.warningIcon}>⚠</Text>
                <Text style={styles.warningText}>
                  Only send {vault?.chain} tokens on the {vault?.chain} network. 
                  Sending other tokens may result in permanent loss.
                </Text>
              </View>
            </View>
          ) : (
            /* SWAP MODE */
            <>
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
                
                {/* Token toggle for unified wallets */}
                {isUnifiedWallet && (
                  <View style={styles.receiveTokenToggle}>
                    <TouchableOpacity
                      style={[styles.receiveTokenBtn, toToken === 'SOL' && styles.receiveTokenBtnActive]}
                      onPress={() => { setToToken('SOL'); setQuote(null); }}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.toggleTokenIcon, styles.solBg]}>
                        <Text style={styles.toggleTokenIconText}>◎</Text>
                      </View>
                      <Text style={[styles.receiveTokenText, toToken === 'SOL' && styles.receiveTokenTextActive]}>SOL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.receiveTokenBtn, toToken === 'ZEC' && styles.receiveTokenBtnActive]}
                      onPress={() => { setToToken('ZEC'); setQuote(null); }}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.toggleTokenIcon, styles.zecBg]}>
                        <Text style={styles.toggleTokenIconText}>Z</Text>
                      </View>
                      <Text style={[styles.receiveTokenText, toToken === 'ZEC' && styles.receiveTokenTextActive]}>ZEC</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.receiveRow}>
                  <View style={[
                    styles.receiveIcon, 
                    toToken === 'SOL' ? styles.solBg : styles.zecBg
                  ]}>
                    <Text style={styles.receiveIconText}>
                      {toToken === 'SOL' ? '◎' : 'Z'}
                    </Text>
                  </View>
                  <View style={styles.receiveInfo}>
                    <Text style={styles.receiveName}>
                      {toToken === 'SOL' ? 'Solana' : 'Zcash'}
                    </Text>
                    <Text style={styles.receiveSymbol}>{toToken}</Text>
                  </View>
                  {toToken === 'ZEC' && (
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
                      1 {selectedToken?.symbol} = {quote.exchangeRate.toFixed(4)} {toToken}
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
                  <View style={styles.quoteDivider} />
                  <View style={styles.quoteRow}>
                    <Text style={styles.quoteLabel}>Value</Text>
                    <Text style={[styles.quoteValue, styles.valueHighlight]}>~${quote.outputAmountUsd}</Text>
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
                    {status === 'quoted' ? 'Confirm & Get Deposit Address' : 'Get Quote'}
                  </Text>
                )}
              </TouchableOpacity>

              {/* How it works */}
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>How it works</Text>
                <View style={styles.stepRow}>
                  <View style={styles.stepNumber}><Text style={styles.stepNumberText}>1</Text></View>
                  <Text style={styles.stepText}>Select token and enter amount</Text>
                </View>
                <View style={styles.stepRow}>
                  <View style={styles.stepNumber}><Text style={styles.stepNumberText}>2</Text></View>
                  <Text style={styles.stepText}>Get a quote and confirm</Text>
                </View>
                <View style={styles.stepRow}>
                  <View style={styles.stepNumber}><Text style={styles.stepNumberText}>3</Text></View>
                  <Text style={styles.stepText}>Send tokens to the deposit address</Text>
                </View>
                <View style={styles.stepRow}>
                  <View style={styles.stepNumber}><Text style={styles.stepNumberText}>4</Text></View>
                  <Text style={styles.stepText}>Receive {toToken} in your wallet (~15-60s)</Text>
                </View>
              </View>

              {/* Footer */}
              <View style={styles.securityFooter}>
                <Text style={styles.securityText}>◈ Powered by NEAR Intents • 0.1% fee</Text>
              </View>
            </>
          )}
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statusHeader: {
    paddingHorizontal: 20,
    paddingTop: 12,
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

  // Mode Toggle
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  modeButtonActive: {
    backgroundColor: '#4ECDC4',
  },
  modeButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  modeButtonTextActive: {
    color: '#0A1628',
  },

  // Receive Mode
  receiveMode: {
    gap: 16,
  },
  qrCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  qrPlaceholder: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  qrIcon: {
    fontSize: 48,
  },
  qrText: {
    color: '#000',
    marginTop: 8,
    fontSize: 12,
  },
  addressSection: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 58, 95, 0.5)',
    borderRadius: 12,
    padding: 14,
  },
  walletAddressText: {
    flex: 1,
    color: '#4ECDC4',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  copyAddressBtn: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
  copyAddressBtnText: {
    color: '#0A1628',
    fontWeight: '600',
    fontSize: 13,
  },
  networkCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  networkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  networkDivider: {
    height: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  networkLabel: {
    color: '#6B7280',
    fontSize: 14,
  },
  networkValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  providerText: {
    color: '#4ECDC4',
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
    fontWeight: 'bold',
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

  // Receive Token Toggle
  receiveTokenToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(30, 58, 95, 0.5)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  receiveTokenBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  receiveTokenBtnActive: {
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.5)',
  },
  toggleTokenIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleTokenIconText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  receiveTokenText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  receiveTokenTextActive: {
    color: '#4ECDC4',
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
  valueHighlight: {
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.3)',
  },
  warningIcon: {
    fontSize: 16,
    color: '#EAB308',
    marginRight: 10,
    marginTop: 2,
  },
  warningText: {
    color: '#EAB308',
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
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
  infoTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#4ECDC4',
    fontSize: 12,
    fontWeight: '600',
  },
  stepText: {
    color: '#9CA3AF',
    fontSize: 14,
    flex: 1,
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
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
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
    textAlign: 'center',
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
  copyButtonIcon: {
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
  quoteReminderCard: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.3)',
  },
  quoteReminderLabel: {
    color: '#9CA3AF',
    fontSize: 13,
    marginBottom: 4,
  },
  quoteReminderAmount: {
    color: '#4ECDC4',
    fontSize: 24,
    fontWeight: '700',
  },
  processingBox: {
    alignItems: 'center',
    padding: 32,
    width: '100%',
  },
  processingText: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 26,
  },
  explorerLink: {
    marginTop: 20,
    padding: 12,
  },
  explorerLinkText: {
    color: '#60A5FA',
    fontSize: 14,
  },
  manualSuccessButton: {
    marginTop: 16,
    padding: 14,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.3)',
  },
  manualSuccessText: {
    color: '#4ECDC4',
    fontSize: 14,
    fontWeight: '500',
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

export default FundWalletScreen;