// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   Platform,
//   KeyboardAvoidingView,
//   ScrollView,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../types/navigation';
// import api from '../services/api';
// import Clipboard from '@react-native-clipboard/clipboard';

// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Send'>;
// type RouteType = RouteProp<RootStackParamList, 'Send'>;

// interface Token {
//   symbol: string;
//   name: string;
//   balance: number;
//   usd: number;
//   icon: string;
//   chain: string;
// }

// const SendScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<RouteType>();
  
//   const vault = route.params?.vault;
  
//   // State
//   const [step, setStep] = useState<'select' | 'amount'>('select');
//   const [tokens, setTokens] = useState<Token[]>([]);
//   const [selectedToken, setSelectedToken] = useState<Token | null>(null);
//   const [recipient, setRecipient] = useState('');
//   const [amount, setAmount] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [loadingTokens, setLoadingTokens] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');

//   // Load token balances on mount
//   useEffect(() => {
//     loadTokenBalances();
//   }, []);

//   const loadTokenBalances = async () => {
//     setLoadingTokens(true);
    
//     const tokenList: Token[] = [];
    
//     // Get SOL balance
//     if (vault?.sol?.address || vault?.address) {
//       try {
//         const solAddress = vault.sol?.address || vault.address;
//         const solRes = await api.getSolBalance(solAddress);
//         tokenList.push({
//           symbol: 'SOL',
//           name: 'Solana',
//           balance: solRes.sol || 0,
//           usd: solRes.usd || 0,
//           icon: '◎',
//           chain: 'solana',
//         });
//       } catch (e) {
//         console.log('SOL balance error:', e);
//         tokenList.push({
//           symbol: 'SOL',
//           name: 'Solana',
//           balance: 0,
//           usd: 0,
//           icon: '◎',
//           chain: 'solana',
//         });
//       }
//     }
    
//     // Get ZEC balance if available
//     if (vault?.zec?.address) {
//       try {
//         const zecRes = await api.getZecBalance(vault.zec.address);
//         tokenList.push({
//           symbol: 'ZEC',
//           name: 'Zcash',
//           balance: zecRes.balance || zecRes.shielded_balance || 0,
//           usd: zecRes.usd || 0,
//           icon: 'Z',
//           chain: 'zcash',
//         });
//       } catch (e) {
//         console.log('ZEC balance error:', e);
//         tokenList.push({
//           symbol: 'ZEC',
//           name: 'Zcash',
//           balance: 0,
//           usd: 0,
//           icon: 'Z',
//           chain: 'zcash',
//         });
//       }
//     }
    
//     setTokens(tokenList);
//     setLoadingTokens(false);
//   };

//   const handleSelectToken = (token: Token) => {
//     setSelectedToken(token);
//     setStep('amount');
//   };

//   const handlePaste = async () => {
//     const text = await Clipboard.getString();
//     if (text) {
//       setRecipient(text);
//     }
//   };

//   const handleMax = () => {
//     if (selectedToken) {
//       // Leave some for gas if SOL
//       const maxAmount = selectedToken.symbol === 'SOL' 
//         ? Math.max(0, selectedToken.balance - 0.001)
//         : selectedToken.balance;
//       setAmount(maxAmount.toFixed(6));
//     }
//   };

//   const handleSend = async () => {
//     if (!selectedToken) {
//       Alert.alert('Error', 'Please select a token');
//       return;
//     }
    
//     if (!recipient.trim()) {
//       Alert.alert('Error', 'Please enter recipient address');
//       return;
//     }
    
//     const amountNum = parseFloat(amount);
//     if (isNaN(amountNum) || amountNum <= 0) {
//       Alert.alert('Error', 'Please enter a valid amount');
//       return;
//     }
    
//     if (amountNum > selectedToken.balance) {
//       Alert.alert('Error', `Insufficient ${selectedToken.symbol} balance`);
//       return;
//     }

//     try {
//       setLoading(true);

//       // Get the from address based on token type
//       const fromAddress = selectedToken.chain === 'zcash' 
//         ? vault?.zec?.address 
//         : (vault?.sol?.address || vault?.address);

//       // Call the unified send endpoint
//       const result = await api.send(
//         fromAddress,
//         recipient.trim(),
//         amountNum,
//         selectedToken.symbol
//       );

//       if (result.success) {
//         Alert.alert(
//           '✅ Sent!',
//           `Successfully sent ${amount} ${selectedToken.symbol}`,
//           [
//             {
//               text: 'Done',
//               onPress: () => navigation.navigate('Home', { vault }),
//             },
//           ]
//         );
//       } else {
//         throw new Error(result.error || 'Transaction failed');
//       }
//     } catch (error: any) {
//       console.error('Send error:', error);
//       Alert.alert('Error', error.message || 'Failed to send');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredTokens = tokens.filter(t => 
//     t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     t.symbol.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // ═══════════════════════════════════════════════════════════════
//   // STEP 1: Token Selection
//   // ═══════════════════════════════════════════════════════════════
//   if (step === 'select') {
//     return (
//       <SafeAreaView style={styles.container}>
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Text style={styles.closeButton}>✕</Text>
//           </TouchableOpacity>
//           <Text style={styles.title}>Send</Text>
//           <View style={{ width: 40 }} />
//         </View>

//         {/* Search */}
//         <View style={styles.searchContainer}>
//           <Text style={styles.searchIcon}>🔍</Text>
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search..."
//             placeholderTextColor="#6B7280"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//         </View>

//         {/* Token List */}
//         {loadingTokens ? (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator color="#4ECDC4" size="large" />
//             <Text style={styles.loadingText}>Loading balances...</Text>
//           </View>
//         ) : (
//           <FlatList
//             data={filteredTokens}
//             keyExtractor={(item) => item.symbol}
//             contentContainerStyle={styles.tokenList}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 style={styles.tokenRow}
//                 onPress={() => handleSelectToken(item)}
//               >
//                 {/* Token Icon */}
//                 <View style={[
//                   styles.tokenIcon,
//                   item.symbol === 'SOL' && styles.solIcon,
//                   item.symbol === 'ZEC' && styles.zecIcon,
//                 ]}>
//                   <Text style={[
//                     styles.tokenIconText,
//                     item.symbol === 'ZEC' && styles.tokenIconTextDark
//                   ]}>
//                     {item.icon}
//                   </Text>
//                 </View>

//                 {/* Token Info */}
//                 <View style={styles.tokenInfo}>
//                   <Text style={styles.tokenName}>{item.name}</Text>
//                   <Text style={styles.tokenBalance}>
//                     {item.balance.toFixed(5)} {item.symbol}
//                   </Text>
//                 </View>

//                 {/* USD Value */}
//                 <Text style={styles.tokenUsd}>
//                   ${item.usd.toFixed(2)}
//                 </Text>
//               </TouchableOpacity>
//             )}
//             ListEmptyComponent={
//               <View style={styles.emptyContainer}>
//                 <Text style={styles.emptyText}>No tokens found</Text>
//               </View>
//             }
//           />
//         )}

//         {/* Close Button */}
//         <TouchableOpacity 
//           style={styles.closeButtonBottom}
//           onPress={() => navigation.goBack()}
//         >
//           <Text style={styles.closeButtonText}>Close</Text>
//         </TouchableOpacity>
//       </SafeAreaView>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // STEP 2: Enter Amount & Recipient
//   // ═══════════════════════════════════════════════════════════════
//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView 
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.keyboardView}
//       >
//         <ScrollView contentContainerStyle={styles.scrollContent}>
//           {/* Header */}
//           <View style={styles.header}>
//             <TouchableOpacity onPress={() => setStep('select')}>
//               <Text style={styles.backButton}>← Back</Text>
//             </TouchableOpacity>
//             <Text style={styles.title}>Send {selectedToken?.symbol}</Text>
//             <View style={{ width: 50 }} />
//           </View>

//           {/* Selected Token Display */}
//           <View style={styles.selectedTokenCard}>
//             <View style={[
//               styles.tokenIconLarge,
//               selectedToken?.symbol === 'SOL' && styles.solIcon,
//               selectedToken?.symbol === 'ZEC' && styles.zecIcon,
//             ]}>
//               <Text style={[
//                 styles.tokenIconTextLarge,
//                 selectedToken?.symbol === 'ZEC' && styles.tokenIconTextDark
//               ]}>
//                 {selectedToken?.icon}
//               </Text>
//             </View>
//             <Text style={styles.selectedTokenName}>{selectedToken?.name}</Text>
//             <Text style={styles.selectedTokenBalance}>
//               Balance: {selectedToken?.balance.toFixed(5)} {selectedToken?.symbol}
//             </Text>
//           </View>

//           {/* Recipient Input */}
//           <View style={styles.inputSection}>
//             <Text style={styles.inputLabel}>Recipient Address</Text>
//             <View style={styles.inputRow}>
//               <TextInput
//                 style={styles.input}
//                 placeholder={`Enter ${selectedToken?.symbol} address`}
//                 placeholderTextColor="#6B7280"
//                 value={recipient}
//                 onChangeText={setRecipient}
//                 autoCapitalize="none"
//                 autoCorrect={false}
//               />
//               <TouchableOpacity style={styles.pasteButton} onPress={handlePaste}>
//                 <Text style={styles.pasteButtonText}>Paste</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Amount Input */}
//           <View style={styles.inputSection}>
//             <Text style={styles.inputLabel}>Amount</Text>
//             <View style={styles.inputRow}>
//               <TextInput
//                 style={styles.input}
//                 placeholder="0.00"
//                 placeholderTextColor="#6B7280"
//                 value={amount}
//                 onChangeText={setAmount}
//                 keyboardType="decimal-pad"
//               />
//               <TouchableOpacity style={styles.maxButton} onPress={handleMax}>
//                 <Text style={styles.maxButtonText}>MAX</Text>
//               </TouchableOpacity>
//               <View style={styles.tokenBadge}>
//                 <Text style={styles.tokenBadgeText}>{selectedToken?.symbol}</Text>
//               </View>
//             </View>
//             {amount && selectedToken && selectedToken.balance > 0 && (
//               <Text style={styles.usdEstimate}>
//                 ≈ ${(parseFloat(amount || '0') * (selectedToken.usd / selectedToken.balance)).toFixed(2)} USD
//               </Text>
//             )}
//           </View>

//           {/* Send Button */}
//           <TouchableOpacity
//             style={[styles.sendButton, loading && styles.sendButtonDisabled]}
//             onPress={handleSend}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator color="#000" />
//             ) : (
//               <Text style={styles.sendButtonText}>
//                 Send {selectedToken?.symbol}
//               </Text>
//             )}
//           </TouchableOpacity>

//           {/* Warning */}
//           <View style={styles.warningCard}>
//             <Text style={styles.warningText}>
//               ⚠️ Double-check the address. Transactions cannot be reversed.
//             </Text>
//           </View>

//           {/* NEAR Intents Badge */}
//           <View style={styles.poweredBy}>
//             <Text style={styles.poweredByText}>Powered by NEAR Intents</Text>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0A0A0A',
//   },
//   keyboardView: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 20,
//     paddingBottom: 40,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//   },
//   closeButton: {
//     color: '#FFFFFF',
//     fontSize: 24,
//   },
//   backButton: {
//     color: '#4ECDC4',
//     fontSize: 16,
//   },
//   title: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: '600',
//   },

//   // Search
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 12,
//     marginHorizontal: 20,
//     marginBottom: 16,
//     paddingHorizontal: 16,
//   },
//   searchIcon: {
//     fontSize: 16,
//     marginRight: 10,
//   },
//   searchInput: {
//     flex: 1,
//     color: '#FFFFFF',
//     fontSize: 16,
//     paddingVertical: 14,
//   },

//   // Loading
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     color: '#6B7280',
//     marginTop: 12,
//   },

//   // Token List
//   tokenList: {
//     paddingHorizontal: 20,
//   },
//   tokenRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 10,
//   },
//   tokenIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 14,
//     backgroundColor: '#333',
//   },
//   solIcon: {
//     backgroundColor: '#9945FF',
//   },
//   zecIcon: {
//     backgroundColor: '#F4B728',
//   },
//   tokenIconText: {
//     fontSize: 20,
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//   },
//   tokenIconTextDark: {
//     color: '#000000',
//   },
//   tokenInfo: {
//     flex: 1,
//   },
//   tokenName: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 2,
//   },
//   tokenBalance: {
//     color: '#6B7280',
//     fontSize: 14,
//   },
//   tokenUsd: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '500',
//   },

//   // Empty
//   emptyContainer: {
//     padding: 40,
//     alignItems: 'center',
//   },
//   emptyText: {
//     color: '#6B7280',
//     fontSize: 14,
//   },

//   // Close Button
//   closeButtonBottom: {
//     backgroundColor: '#1E1E1E',
//     borderRadius: 12,
//     padding: 16,
//     margin: 20,
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },

//   // Selected Token Card
//   selectedTokenCard: {
//     alignItems: 'center',
//     paddingVertical: 24,
//   },
//   tokenIconLarge: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 12,
//     backgroundColor: '#333',
//   },
//   tokenIconTextLarge: {
//     fontSize: 28,
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//   },
//   selectedTokenName: {
//     color: '#FFFFFF',
//     fontSize: 20,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   selectedTokenBalance: {
//     color: '#6B7280',
//     fontSize: 14,
//   },

//   // Input Section
//   inputSection: {
//     marginBottom: 20,
//   },
//   inputLabel: {
//     color: '#9CA3AF',
//     fontSize: 14,
//     marginBottom: 8,
//   },
//   inputRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   input: {
//     flex: 1,
//     backgroundColor: '#1E1E1E',
//     borderRadius: 12,
//     padding: 16,
//     color: '#FFFFFF',
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#2A2A2A',
//   },
//   pasteButton: {
//     backgroundColor: '#333',
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     marginLeft: 10,
//   },
//   pasteButtonText: {
//     color: '#4ECDC4',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   maxButton: {
//     backgroundColor: '#4ECDC4',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//     marginLeft: 10,
//   },
//   maxButtonText: {
//     color: '#000',
//     fontSize: 12,
//     fontWeight: '700',
//   },
//   tokenBadge: {
//     backgroundColor: '#333',
//     borderRadius: 8,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     marginLeft: 10,
//   },
//   tokenBadgeText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   usdEstimate: {
//     color: '#6B7280',
//     fontSize: 13,
//     marginTop: 8,
//     marginLeft: 4,
//   },

//   // Send Button
//   sendButton: {
//     backgroundColor: '#4ECDC4',
//     borderRadius: 12,
//     padding: 18,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   sendButtonDisabled: {
//     opacity: 0.6,
//   },
//   sendButtonText: {
//     color: '#000000',
//     fontSize: 18,
//     fontWeight: '700',
//   },

//   // Warning
//   warningCard: {
//     backgroundColor: 'rgba(239, 68, 68, 0.1)',
//     borderRadius: 12,
//     padding: 14,
//     marginTop: 16,
//   },
//   warningText: {
//     color: '#EF4444',
//     fontSize: 13,
//     lineHeight: 18,
//     textAlign: 'center',
//   },

//   // Powered By
//   poweredBy: {
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   poweredByText: {
//     color: '#4B5563',
//     fontSize: 12,
//   },
// });

// export default SendScreen;

/**
 * SEND SCREEN
 * 
 * Send tokens to any address
 * Supports SOL and ZEC
 * 
 * Styled with VoltWallet Premium Theme
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import LinearGradient from 'react-native-linear-gradient';
import api from '../services/api';
import Clipboard from '@react-native-clipboard/clipboard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Send'>;
type RouteType = RouteProp<RootStackParamList, 'Send'>;

interface Token {
  symbol: string;
  name: string;
  balance: number;
  usd: number;
  icon: string;
  chain: string;
}

const SendScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  
  const vault = route.params?.vault;
  
  // State
  const [step, setStep] = useState<'select' | 'amount'>('select');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingTokens, setLoadingTokens] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load token balances on mount
  useEffect(() => {
    loadTokenBalances();
  }, []);

  const loadTokenBalances = async () => {
    setLoadingTokens(true);
    
    const tokenList: Token[] = [];
    
    // Get SOL balance
    if (vault?.sol?.address || vault?.address) {
      try {
        const solAddress = vault.sol?.address || vault.address;
        const solRes = await api.getSolBalance(solAddress);
        tokenList.push({
          symbol: 'SOL',
          name: 'Solana',
          balance: solRes.sol || 0,
          usd: solRes.usd || 0,
          icon: '◎',
          chain: 'solana',
        });
      } catch (e) {
        console.log('SOL balance error:', e);
        tokenList.push({
          symbol: 'SOL',
          name: 'Solana',
          balance: 0,
          usd: 0,
          icon: '◎',
          chain: 'solana',
        });
      }
    }
    
    // Get ZEC balance if available
    if (vault?.zec?.address) {
      try {
        const zecRes = await api.getZecBalance(vault.zec.address);
        tokenList.push({
          symbol: 'ZEC',
          name: 'Zcash',
          balance: zecRes.balance || zecRes.shielded_balance || 0,
          usd: zecRes.usd || 0,
          icon: 'Z',
          chain: 'zcash',
        });
      } catch (e) {
        console.log('ZEC balance error:', e);
        tokenList.push({
          symbol: 'ZEC',
          name: 'Zcash',
          balance: 0,
          usd: 0,
          icon: 'Z',
          chain: 'zcash',
        });
      }
    }
    
    setTokens(tokenList);
    setLoadingTokens(false);
  };

  const handleSelectToken = (token: Token) => {
    setSelectedToken(token);
    setStep('amount');
  };

  const handlePaste = async () => {
    const text = await Clipboard.getString();
    if (text) {
      setRecipient(text);
    }
  };

  const handleMax = () => {
    if (selectedToken) {
      const maxAmount = selectedToken.symbol === 'SOL' 
        ? Math.max(0, selectedToken.balance - 0.001)
        : selectedToken.balance;
      setAmount(maxAmount.toFixed(6));
    }
  };

  const handleSend = async () => {
    if (!selectedToken) {
      Alert.alert('Error', 'Please select a token');
      return;
    }
    
    if (!recipient.trim()) {
      Alert.alert('Error', 'Please enter recipient address');
      return;
    }
    
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    if (amountNum > selectedToken.balance) {
      Alert.alert('Error', `Insufficient ${selectedToken.symbol} balance`);
      return;
    }

    try {
      setLoading(true);

      const fromAddress = selectedToken.chain === 'zcash' 
        ? vault?.zec?.address 
        : (vault?.sol?.address || vault?.address);

      const result = await api.send(
        fromAddress,
        recipient.trim(),
        amountNum,
        selectedToken.symbol
      );

      if (result.success) {
        Alert.alert(
          '✅ Sent!',
          `Successfully sent ${amount} ${selectedToken.symbol}`,
          [
            {
              text: 'Done',
              onPress: () => navigation.navigate('Home', { vault }),
            },
          ]
        );
      } else {
        throw new Error(result.error || 'Transaction failed');
      }
    } catch (error: any) {
      console.error('Send error:', error);
      Alert.alert('Error', error.message || 'Failed to send');
    } finally {
      setLoading(false);
    }
  };

  const filteredTokens = tokens.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ═══════════════════════════════════════════════════════════════
  // STEP 1: Token Selection
  // ═══════════════════════════════════════════════════════════════
  if (step === 'select') {
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
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Send</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search tokens..."
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Token List */}
          {loadingTokens ? (
            <View style={styles.loadingContainer}>
              <View style={styles.loaderCircle}>
                <ActivityIndicator color="#4ECDC4" size="large" />
              </View>
              <Text style={styles.loadingText}>Loading balances...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredTokens}
              keyExtractor={(item) => item.symbol}
              contentContainerStyle={styles.tokenList}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.tokenRow}
                  onPress={() => handleSelectToken(item)}
                  activeOpacity={0.7}
                >
                  {/* Token Icon */}
                  <View style={[
                    styles.tokenIcon,
                    item.symbol === 'SOL' && styles.solIcon,
                    item.symbol === 'ZEC' && styles.zecIcon,
                  ]}>
                    <Text style={[
                      styles.tokenIconText,
                      item.symbol === 'ZEC' && styles.tokenIconTextDark
                    ]}>
                      {item.icon}
                    </Text>
                  </View>

                  {/* Token Info */}
                  <View style={styles.tokenInfo}>
                    <Text style={styles.tokenName}>{item.name}</Text>
                    <Text style={styles.tokenBalance}>
                      {item.balance.toFixed(5)} {item.symbol}
                    </Text>
                  </View>

                  {/* USD Value & Badge */}
                  <View style={styles.tokenValueContainer}>
                    <Text style={styles.tokenUsd}>
                      ${item.usd.toFixed(2)}
                    </Text>
                    {item.symbol === 'ZEC' && (
                      <View style={styles.shieldedBadge}>
                        <Text style={styles.shieldedText}>◈ Shielded</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyEmoji}>🔍</Text>
                  <Text style={styles.emptyText}>No tokens found</Text>
                </View>
              }
            />
          )}

          {/* Close Button */}
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity 
              style={styles.closeButtonBottom}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // STEP 2: Enter Amount & Recipient
  // ═══════════════════════════════════════════════════════════════
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1E3A5F', '#0F2744', '#0A1628']}
        style={styles.glowGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setStep('select')}
                activeOpacity={0.7}
              >
                <Text style={styles.backIcon}>←</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Send {selectedToken?.symbol}</Text>
              <View style={styles.headerSpacer} />
            </View>

            {/* Selected Token Display */}
            <View style={styles.selectedTokenCard}>
              <View style={[
                styles.tokenIconLarge,
                selectedToken?.symbol === 'SOL' && styles.solIcon,
                selectedToken?.symbol === 'ZEC' && styles.zecIcon,
              ]}>
                <Text style={[
                  styles.tokenIconTextLarge,
                  selectedToken?.symbol === 'ZEC' && styles.tokenIconTextDark
                ]}>
                  {selectedToken?.icon}
                </Text>
              </View>
              <Text style={styles.selectedTokenName}>{selectedToken?.name}</Text>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceLabel}>Available:</Text>
                <Text style={styles.selectedTokenBalance}>
                  {selectedToken?.balance.toFixed(5)} {selectedToken?.symbol}
                </Text>
              </View>
              {selectedToken?.symbol === 'ZEC' && (
                <View style={styles.shieldedBadgeLarge}>
                  <Text style={styles.shieldedTextLarge}>◈ Shielded Transfer</Text>
                </View>
              )}
            </View>

            {/* Recipient Input */}
            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Recipient Address</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder={`Enter ${selectedToken?.symbol} address`}
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={recipient}
                  onChangeText={setRecipient}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity 
                  style={styles.pasteButton} 
                  onPress={handlePaste}
                  activeOpacity={0.7}
                >
                  <Text style={styles.pasteButtonText}>Paste</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Amount Input */}
            <View style={styles.inputCard}>
              <View style={styles.inputLabelRow}>
                <Text style={styles.inputLabel}>Amount</Text>
                <TouchableOpacity 
                  style={styles.maxButton} 
                  onPress={handleMax}
                  activeOpacity={0.7}
                >
                  <Text style={styles.maxButtonText}>MAX</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.amountInputContainer}>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                />
                <View style={styles.tokenBadge}>
                  <View style={[
                    styles.tokenBadgeIcon,
                    selectedToken?.symbol === 'SOL' && styles.solIcon,
                    selectedToken?.symbol === 'ZEC' && styles.zecIcon,
                  ]}>
                    <Text style={[
                      styles.tokenBadgeIconText,
                      selectedToken?.symbol === 'ZEC' && styles.tokenIconTextDark
                    ]}>
                      {selectedToken?.icon}
                    </Text>
                  </View>
                  <Text style={styles.tokenBadgeText}>{selectedToken?.symbol}</Text>
                </View>
              </View>
              {amount && selectedToken && selectedToken.balance > 0 && (
                <Text style={styles.usdEstimate}>
                  ≈ ${(parseFloat(amount || '0') * (selectedToken.usd / selectedToken.balance)).toFixed(2)} USD
                </Text>
              )}
            </View>

            {/* Summary Card */}
            {amount && recipient && (
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Transaction Summary</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Sending</Text>
                  <Text style={styles.summaryValue}>{amount} {selectedToken?.symbol}</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>To</Text>
                  <Text style={styles.summaryAddress}>
                    {recipient.slice(0, 8)}...{recipient.slice(-8)}
                  </Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Network Fee</Text>
                  <Text style={styles.summaryValue}>~0.000005 {selectedToken?.symbol}</Text>
                </View>
              </View>
            )}

            {/* Send Button */}
            <TouchableOpacity
              style={[styles.sendButton, loading && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#0A1628" size="small" />
                  <Text style={styles.loadingButtonText}>Sending...</Text>
                </View>
              ) : (
                <Text style={styles.sendButtonText}>
                  Send {selectedToken?.symbol}
                </Text>
              )}
            </TouchableOpacity>

            {/* Warning */}
            <View style={styles.warningCard}>
              <Text style={styles.warningIcon}>⚠</Text>
              <Text style={styles.warningText}>
                Double-check the address. Transactions cannot be reversed.
              </Text>
            </View>

            {/* Footer */}
            <View style={styles.securityFooter}>
              <Text style={styles.securityText}>◈ Powered by ZkAGI 2025</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
// STYLES - VoltWallet Premium Theme
// ═══════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  safeArea: {
    flex: 1,
  },
  glowGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 400,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 44,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 14,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 14,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderCircle: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(78, 205, 196, 0.3)',
  },
  loadingText: {
    color: '#6B7280',
    marginTop: 16,
    fontSize: 15,
  },

  // Token List
  tokenList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  tokenIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    backgroundColor: 'rgba(30, 58, 95, 0.8)',
  },
  solIcon: {
    backgroundColor: '#9945FF',
  },
  zecIcon: {
    backgroundColor: '#F4B728',
  },
  tokenIconText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  tokenIconTextDark: {
    color: '#000000',
  },
  tokenInfo: {
    flex: 1,
  },
  tokenName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  tokenBalance: {
    color: '#6B7280',
    fontSize: 13,
  },
  tokenValueContainer: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  tokenUsd: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  shieldedBadge: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
  },
  shieldedText: {
    fontSize: 10,
    color: '#4ECDC4',
    fontWeight: '500',
  },
  chevron: {
    fontSize: 20,
    color: '#4B5563',
  },

  // Empty
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
  },

  // Bottom Button
  bottomButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButtonBottom: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Selected Token Card
  selectedTokenCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  tokenIconLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(30, 58, 95, 0.8)',
  },
  tokenIconTextLarge: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  selectedTokenName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#6B7280',
    fontSize: 14,
    marginRight: 6,
  },
  selectedTokenBalance: {
    color: '#4ECDC4',
    fontSize: 14,
    fontWeight: '600',
  },
  shieldedBadgeLarge: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  shieldedTextLarge: {
    fontSize: 12,
    color: '#4ECDC4',
    fontWeight: '500',
  },

  // Input Card
  inputCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  inputLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputLabel: {
    color: '#6B7280',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(30, 58, 95, 0.5)',
    borderRadius: 12,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  pasteButton: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.3)',
  },
  pasteButtonText: {
    color: '#4ECDC4',
    fontSize: 14,
    fontWeight: '600',
  },
  maxButton: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  maxButtonText: {
    color: '#4ECDC4',
    fontSize: 12,
    fontWeight: '600',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 58, 95, 0.5)',
    borderRadius: 12,
    paddingRight: 12,
  },
  amountInput: {
    flex: 1,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },
  tokenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tokenBadgeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  tokenBadgeIconText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  tokenBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  usdEstimate: {
    color: '#6B7280',
    fontSize: 13,
    marginTop: 12,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.3)',
  },
  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  summaryLabel: {
    color: '#6B7280',
    fontSize: 14,
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  summaryAddress: {
    color: '#4ECDC4',
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },

  // Send Button
  sendButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#0A1628',
    fontSize: 18,
    fontWeight: '700',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingButtonText: {
    color: '#0A1628',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },

  // Warning
  warningCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  warningIcon: {
    fontSize: 16,
    color: '#EF4444',
    marginRight: 10,
  },
  warningText: {
    color: '#EF4444',
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },

  // Footer
  securityFooter: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 16,
  },
  securityText: {
    fontSize: 12,
    color: '#4B5563',
  },
});

export default SendScreen;