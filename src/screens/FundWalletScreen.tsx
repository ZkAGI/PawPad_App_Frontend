/**
 * ============================================
 * FUND WALLET SCREEN - NEAR INTENTS POWERED
 * ============================================
 * 
 * Fund your wallet from any token using NEAR Intents 1Click API
 * Supports: ETH, BTC, USDC, SOL, ZEC, NEAR and 100+ tokens
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
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Clipboard from '@react-native-clipboard/clipboard';

// ============================================
// CONFIGURATION
// ============================================

const API_BASE ='https://pawpad-arcium-backend.onrender.com';

const FUNDING_TOKENS = [
  { id: 'ETH', name: 'Ethereum', symbol: 'ETH', icon: '⟠', chain: 'ethereum' },
  { id: 'USDC_SOL', name: 'USDC (Solana)', symbol: 'USDC', icon: '💵', chain: 'solana' },
  { id: 'USDC_ETH', name: 'USDC (Ethereum)', symbol: 'USDC', icon: '💵', chain: 'ethereum' },
  { id: 'BTC', name: 'Bitcoin', symbol: 'BTC', icon: '₿', chain: 'bitcoin' },
  { id: 'ZEC', name: 'Zcash', symbol: 'ZEC', icon: '🛡️', chain: 'zcash' },
  { id: 'NEAR', name: 'NEAR', symbol: 'NEAR', icon: '◉', chain: 'near' },
  { id: 'SOL', name: 'Solana', symbol: 'SOL', icon: '◎', chain: 'solana' },
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
  // SOL address - check unified first, then legacy
  return vault?.sol?.address || vault?.address;
};

// Helper to check if this is a unified wallet
const isUnifiedWallet = vault?.sol?.address && vault?.zec?.address;

  // ============================================
  // AVAILABLE TOKENS (exclude destination token)
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
        // body: JSON.stringify({
        //   from_token: fromToken,
        //   to_token: vault?.chain || 'SOL',
        //   amount: parseFloat(amount),
        //   vault_id: vault?.vault_id,
        //   destination_address: vault?.address,
        // }),
        body: JSON.stringify({
  from_token: fromToken,
  to_token: toToken,  // Changed from vault?.chain
  amount: parseFloat(amount),
  vault_id: vault?.vault_id,
  destination_address: getDestinationAddress(),  // Changed from vault?.address
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
        // body: JSON.stringify({
        //   from_token: fromToken,
        //   to_token: vault?.chain || 'SOL',
        //   amount: parseFloat(amount),
        //   vault_id: vault?.vault_id,
        //   destination_address: vault?.address,
        // }),
         body: JSON.stringify({
        from_token: fromToken,
        to_token: toToken,  // ← Change this too
        amount: parseFloat(amount),
        vault_id: vault?.vault_id,
        destination_address: getDestinationAddress(),  // ← And this
      }),
      });

      const data = await response.json();

      if (data.success) {
        const addr = data.depositAddress || data.quote?.depositAddress || data.raw?.quote?.depositAddress;
        console.log('Deposit address:', addr);
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
          console.log('Initial SOL balance:', initialBalance);
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
        
        console.log('Balance check:', data.sol, 'Initial:', initialBalance);

        if (data.success && initialBalance !== null) {
          const expectedIncrease = quote?.outputAmount || 0;
          const actualIncrease = data.sol - initialBalance;
          
          if (actualIncrease > expectedIncrease * 0.9) {
            console.log('✅ Balance increased! Swap successful.');
            setStatus('success');
            return true;
          }
        }
        
        return false;
      } catch (e) {
        console.log('Balance check error:', e);
        return false;
      }
    };

    const poll = async () => {
      if (attempts >= maxAttempts) {
        console.log('Stopped polling - check explorer manually');
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
          <Text style={styles.modalTitle}>Select Token</Text>
          <ScrollView>
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
              >
                <Text style={styles.tokenIcon}>{token.icon}</Text>
                <View style={styles.tokenInfo}>
                  <Text style={styles.tokenName}>{token.name}</Text>
                  <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                </View>
                {fromToken === token.id && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => setShowTokenPicker(false)}
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
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.depositScreen}>
          <Text style={styles.statusTitle}>
            {status === 'pending' && '⏳ Waiting for Deposit'}
            {status === 'processing' && '⚙️ Processing Swap...'}
            {status === 'success' && '✅ Success!'}
            {status === 'failed' && '❌ Failed'}
          </Text>

          {status === 'pending' && depositAddress && (
            <>
              <Text style={styles.depositInstruction}>
                Send exactly{' '}
                <Text style={styles.highlight}>{amount} {token?.symbol}</Text>
                {' '}to this address:
              </Text>

              <View style={styles.addressBox}>
                <Text style={styles.addressText} selectable>
                  {depositAddress}
                </Text>
              </View>

              <TouchableOpacity 
                style={styles.copyButton} 
                onPress={() => copyAddress(depositAddress)}
              >
                <Text style={styles.buttonText}>📋 Copy Address</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.walletButton} onPress={openWallet}>
                <Text style={styles.buttonText}>
                  {token?.chain === 'solana' && '👻 Open Phantom'}
                  {token?.chain === 'ethereum' && '🦊 Open MetaMask'}
                  {token?.chain === 'bitcoin' && '₿ Open Bitcoin Wallet'}
                  {!['solana', 'ethereum', 'bitcoin'].includes(token?.chain || '') && '📱 Open Wallet'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.warningText}>
                ⚠️ Only send {token?.symbol} on {token?.name} network!
              </Text>

              <View style={styles.quoteReminder}>
                <Text style={styles.quoteReminderText}>
                  You will receive: ~{quote?.outputAmount.toFixed(6)} {vault?.chain}
                </Text>
              </View>

              <TouchableOpacity 
                style={styles.sentItButton} 
                onPress={() => setStatus('processing')}
              >
                <Text style={styles.sentItButtonText}>✅ I've Sent the Payment</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.explorerLink} 
                onPress={openExplorer}
              >
                <Text style={styles.explorerLinkText}>🔍 View on NEAR Intents Explorer</Text>
              </TouchableOpacity>
            </>
          )}

          {status === 'processing' && (
            <View style={styles.processingBox}>
              <ActivityIndicator size="large" color="#4ECDC4" />
              <Text style={styles.processingText}>
                Processing your swap...{'\n'}
                This usually takes 15-60 seconds
              </Text>
              
              <TouchableOpacity 
                style={styles.explorerLinkSmall} 
                onPress={openExplorer}
              >
                <Text style={styles.explorerLinkText}>🔍 Check Status on Explorer</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.manualSuccessButton} 
                onPress={() => setStatus('success')}
              >
                <Text style={styles.manualSuccessText}>Transaction confirmed? Tap here</Text>
              </TouchableOpacity>
            </View>
          )}

          {status === 'success' && (
            <View style={styles.successBox}>
              <Text style={styles.successEmoji}>🎉</Text>
              <Text style={styles.successText}>
                {quote?.outputAmount.toFixed(6)} {vault?.chain} added to your wallet!
              </Text>
              <TouchableOpacity 
                style={styles.doneButton} 
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          )}

          {status === 'failed' && (
            <View style={styles.failedBox}>
              <Text style={styles.failedText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton} 
                onPress={() => setStatus('idle')}
              >
                <Text style={styles.buttonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // ============================================
  // RENDER: MAIN SCREEN
  // ============================================
  
  const selectedToken = FUNDING_TOKENS.find(t => t.id === fromToken);

  return (
    <SafeAreaView style={styles.container}>
      {renderTokenPicker()}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Fund Your Wallet</Text>
          <Text style={styles.subtitle}>
            Add {vault?.chain} using any supported token
          </Text>
        </View>

        {/* Mode Toggle */}
        <View style={styles.modeToggle}>
          <TouchableOpacity 
            style={[styles.modeButton, mode === 'swap' && styles.modeButtonActive]}
            onPress={() => setMode('swap')}
          >
            <Text style={[styles.modeButtonText, mode === 'swap' && styles.modeButtonTextActive]}>
              🔄 Swap Any Token
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modeButton, mode === 'receive' && styles.modeButtonActive]}
            onPress={() => setMode('receive')}
          >
            <Text style={[styles.modeButtonText, mode === 'receive' && styles.modeButtonTextActive]}>
              📥 Direct Receive
            </Text>
          </TouchableOpacity>
        </View>

        {mode === 'receive' ? (
          /* RECEIVE MODE - Just show address */
          <View style={styles.receiveMode}>
            <View style={styles.qrPlaceholder}>
              <Text style={styles.qrIcon}>📱</Text>
              <Text style={styles.qrText}>QR Code</Text>
            </View>

            <Text style={styles.sectionTitle}>Wallet Address</Text>
            <View style={styles.addressContainer}>
              <Text style={styles.walletAddress}>{vault?.address}</Text>
              <TouchableOpacity 
                style={styles.copyAddressButton}
                onPress={() => vault?.address && copyAddress(vault.address)}
              >
                <Text style={styles.copyAddressButtonText}>
                  {copied ? '✓ Copied' : 'Copy'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.networkInfo}>
              <Text style={styles.sectionTitle}>Network Information</Text>
              <View style={styles.networkRow}>
                <Text style={styles.networkLabel}>Chain</Text>
                <Text style={styles.networkValue}>{vault?.chain}</Text>
              </View>
              <View style={styles.networkRow}>
                <Text style={styles.networkLabel}>Network</Text>
                <Text style={styles.networkValue}>Mainnet</Text>
              </View>
              <View style={styles.networkRow}>
                <Text style={styles.networkLabel}>MPC Provider</Text>
                <Text style={styles.networkValue}>{vault?.mpc_provider}</Text>
              </View>
            </View>

            <View style={styles.warningBox}>
              <Text style={styles.warningBoxText}>
                ⚠️ Only send {vault?.chain} tokens on the {vault?.chain} network. 
                Sending other tokens may result in permanent loss.
              </Text>
            </View>
          </View>
        ) : (
          /* SWAP MODE - Cross-chain funding */
          <>
            {/* From Token */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Pay With</Text>
              <TouchableOpacity
                style={styles.tokenSelector}
                onPress={() => setShowTokenPicker(true)}
              >
                <Text style={styles.tokenSelectorIcon}>{selectedToken?.icon}</Text>
                <Text style={styles.tokenSelectorText}>{selectedToken?.name}</Text>
                <Text style={styles.tokenSelectorArrow}>▼</Text>
              </TouchableOpacity>

              <View style={styles.amountInput}>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor="#666"
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
            <View style={styles.arrowBox}>
              <Text style={styles.arrow}>↓</Text>
            </View>

            {/* To Token */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionLabel}>You Receive</Text>
              <View style={styles.receiveBox}>
                <Text style={styles.receiveIcon}>
                  {vault?.chain === 'SOL' ? '◎' : '🛡️'}
                </Text>
                <Text style={styles.receiveText}>
                  {quote ? `${quote.outputAmount.toFixed(6)} ${vault?.chain}` : `— ${vault?.chain}`}
                </Text>
              </View>
            </View> */}
            {/* To Token */}
<View style={styles.section}>
  <Text style={styles.sectionLabel}>You Receive</Text>
  
  {/* Token toggle for unified wallets */}
  {isUnifiedWallet && (
    <View style={styles.receiveTokenToggle}>
      <TouchableOpacity
        style={[styles.receiveTokenBtn, toToken === 'SOL' && styles.receiveTokenBtnActive]}
        onPress={() => { setToToken('SOL'); setQuote(null); }}
      >
        <Text style={[styles.receiveTokenText, toToken === 'SOL' && styles.receiveTokenTextActive]}>◎ SOL</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.receiveTokenBtn, toToken === 'ZEC' && styles.receiveTokenBtnActive]}
        onPress={() => { setToToken('ZEC'); setQuote(null); }}
      >
        <Text style={[styles.receiveTokenText, toToken === 'ZEC' && styles.receiveTokenTextActive]}>🛡️ ZEC</Text>
      </TouchableOpacity>
    </View>
  )}

  <View style={styles.receiveBox}>
    <Text style={styles.receiveIcon}>
      {toToken === 'SOL' ? '◎' : '🛡️'}
    </Text>
    <Text style={styles.receiveText}>
      {quote ? `${quote.outputAmount.toFixed(6)} ${toToken}` : `— ${toToken}`}
    </Text>
  </View>
</View>

            {/* Quote Details */}
            {quote && (
              <View style={styles.quoteDetails}>
                <View style={styles.quoteRow}>
                  <Text style={styles.quoteLabel}>Rate</Text>
                  <Text style={styles.quoteValue}>
                    1 {selectedToken?.symbol} = {quote.exchangeRate.toFixed(6)} {vault?.chain}
                  </Text>
                </View>
                <View style={styles.quoteRow}>
                  <Text style={styles.quoteLabel}>Fee</Text>
                  <Text style={styles.quoteValue}>{quote.fee}</Text>
                </View>
                <View style={styles.quoteRow}>
                  <Text style={styles.quoteLabel}>Est. Time</Text>
                  <Text style={styles.quoteValue}>{quote.estimatedTime}</Text>
                </View>
                <View style={styles.quoteRow}>
                  <Text style={styles.quoteLabel}>Value</Text>
                  <Text style={styles.quoteValue}>~${quote.outputAmountUsd}</Text>
                </View>
              </View>
            )}

            {/* Error */}
            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>❌ {error}</Text>
              </View>
            )}

            {/* Action Button */}
            <TouchableOpacity
              style={[
                styles.actionButton,
                (status === 'quoting' || status === 'executing') && styles.buttonDisabled,
              ]}
              onPress={status === 'quoted' ? executeSwap : getQuote}
              disabled={status === 'quoting' || status === 'executing'}
            >
              {(status === 'quoting' || status === 'executing') ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.actionButtonText}>
                  {status === 'quoted' ? 'Confirm & Get Deposit Address' : 'Get Quote'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Info */}
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>How it works</Text>
              <Text style={styles.infoStep}>1. Select token and enter amount</Text>
              <Text style={styles.infoStep}>2. Get a quote and confirm</Text>
              <Text style={styles.infoStep}>3. Send tokens to the deposit address</Text>
              <Text style={styles.infoStep}>4. Receive {vault?.chain} in your wallet (~15-60s)</Text>
            </View>

            {/* Footer */}
            <Text style={styles.footer}>
              Powered by NEAR Intents • 0.1% fee
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 4,
  },
  modeToggle: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 4,
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
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
  },
  modeButtonTextActive: {
    color: '#000000',
  },
  receiveMode: {
    paddingHorizontal: 24,
  },
  qrPlaceholder: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  qrIcon: {
    fontSize: 64,
  },
  qrText: {
    color: '#000',
    marginTop: 8,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  addressContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  walletAddress: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  copyAddressButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
  copyAddressButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  networkInfo: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  networkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  networkLabel: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  networkValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  receiveTokenToggle: {
  flexDirection: 'row',
  backgroundColor: '#1E293B',
  borderRadius: 8,
  padding: 4,
  marginBottom: 12,
},
receiveTokenBtn: {
  flex: 1,
  paddingVertical: 10,
  alignItems: 'center',
  borderRadius: 6,
},
receiveTokenBtnActive: {
  backgroundColor: '#4ECDC4',
},
receiveTokenText: {
  color: '#9CA3AF',
  fontSize: 14,
  fontWeight: '600',
},
receiveTokenTextActive: {
  color: '#000000',
},
  warningBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  warningBoxText: {
    color: '#F59E0B',
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  tokenSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  tokenSelectorIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  tokenSelectorText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tokenSelectorArrow: {
    color: '#9CA3AF',
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingVertical: 16,
  },
  inputSuffix: {
    fontSize: 18,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  arrowBox: {
    alignItems: 'center',
    marginVertical: 8,
  },
  arrow: {
    fontSize: 24,
    color: '#4ECDC4',
  },
  receiveBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
  },
  receiveIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  receiveText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4ECDC4',
  },
  quoteDetails: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginTop: 16,
  },
  quoteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quoteLabel: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  quoteValue: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginTop: 16,
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
  infoBox: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginTop: 24,
  },
  infoTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoStep: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 8,
  },
  footer: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 12,
    marginTop: 24,
    marginBottom: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  tokenOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  tokenOptionSelected: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
  },
  tokenIcon: {
    fontSize: 28,
    marginRight: 16,
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
    color: '#9CA3AF',
  },
  checkmark: {
    color: '#4ECDC4',
    fontSize: 20,
    fontWeight: '600',
  },
  modalClose: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  modalCloseText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  depositScreen: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  depositInstruction: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 16,
  },
  highlight: {
    color: '#4ECDC4',
    fontWeight: '600',
  },
  addressBox: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 16,
  },
  addressText: {
    color: '#4ECDC4',
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'center',
  },
  copyButton: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4ECDC4',
  },
  walletButton: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  warningText: {
    color: '#F59E0B',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 24,
  },
  quoteReminder: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  quoteReminderText: {
    color: '#4ECDC4',
    textAlign: 'center',
    fontWeight: '600',
  },
  processingBox: {
    alignItems: 'center',
    padding: 32,
  },
  processingText: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  successBox: {
    alignItems: 'center',
  },
  successEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  successText: {
    color: '#4ECDC4',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  doneButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    paddingHorizontal: 48,
    paddingVertical: 16,
  },
  doneButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
  failedBox: {
    alignItems: 'center',
  },
  failedText: {
    color: '#EF4444',
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  sentItButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  sentItButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  explorerLink: {
    marginTop: 16,
    padding: 12,
  },
  explorerLinkText: {
    color: '#60A5FA',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  explorerLinkSmall: {
    marginTop: 24,
    padding: 8,
  },
  manualSuccessButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderRadius: 8,
  },
  manualSuccessText: {
    color: '#4ECDC4',
    fontSize: 13,
  },
});

export default FundWalletScreen;