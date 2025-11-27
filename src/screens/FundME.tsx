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
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

// ============================================
// CONFIGURATION
// ============================================

// Update this to your backend URL
const API_BASE = __DEV__ 
  ? 'http://localhost:3001'  // Development
  : 'https://your-api.pawpad.app';  // Production

// Supported tokens for funding
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
  // Option 1: Pass vault directly
  vault?: Vault;
  
  // Option 2: Pass vault ID and let component fetch details
  vaultId?: string;
  
  // Callbacks
  onSuccess?: (txHash?: string) => void;
  onClose?: () => void;
  
  // Optional: refresh balance after funding
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
  // AVAILABLE TOKENS (exclude same chain)
  // ============================================
  
  const availableFromTokens = FUNDING_TOKENS.filter(token => {
    // Can't swap SOL to SOL or ZEC to ZEC
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
          to_token: vault.chain,  // SOL or ZEC
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
        // Extract deposit address from response
        const addr = data.quote?.depositAddress || data.raw?.quote?.depositAddress;
        setDepositAddress(addr);
        setSwapId(data.swapId);
        setStatus('pending');
        
        // Start polling for status
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
    const maxAttempts = 120; // 10 minutes at 5 second intervals
    
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
      // Phantom deep link
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
      // MetaMask deep link
      Linking.openURL(`https://metamask.app.link/send/${depositAddress}`);
    } else if (token?.chain === 'bitcoin') {
      // Bitcoin URI
      Linking.openURL(`bitcoin:${depositAddress}?amount=${amount}`);
    } else {
      // Generic - just copy
      copyAddress();
    }
  };

  // ============================================
  // RENDER: LOADING
  // ============================================
  
  if (status === 'loading') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00FF88" />
        <Text style={styles.loadingText}>Loading wallet...</Text>
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
  // RENDER: DEPOSIT SCREEN
  // ============================================
  
  if (status === 'pending' || status === 'processing' || status === 'success' || status === 'failed') {
    const token = FUNDING_TOKENS.find(t => t.id === fromToken);
    
    return (
      <View style={styles.container}>
        <View style={styles.depositScreen}>
          {/* Status Header */}
          <Text style={styles.statusTitle}>
            {status === 'pending' && '⏳ Waiting for Deposit'}
            {status === 'processing' && '⚙️ Processing...'}
            {status === 'success' && '✅ Success!'}
            {status === 'failed' && '❌ Failed'}
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

              <View style={styles.addressBox}>
                <Text style={styles.addressText} selectable>
                  {depositAddress}
                </Text>
              </View>

              <TouchableOpacity style={styles.copyButton} onPress={copyAddress}>
                <Text style={styles.buttonText}>📋 Copy Address</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.walletButton} onPress={openWallet}>
                <Text style={styles.buttonText}>
                  {token?.chain === 'solana' && '👻 Open in Phantom'}
                  {token?.chain === 'ethereum' && '🦊 Open in MetaMask'}
                  {token?.chain === 'bitcoin' && '₿ Open Bitcoin Wallet'}
                  {!['solana', 'ethereum', 'bitcoin'].includes(token?.chain || '') && '📱 Open Wallet'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.warningText}>
                ⚠️ Only send {token?.symbol} on {token?.name}!
              </Text>
            </>
          )}

          {/* Processing: Show spinner */}
          {status === 'processing' && (
            <View style={styles.processingBox}>
              <ActivityIndicator size="large" color="#00FF88" />
              <Text style={styles.processingText}>
                Processing your swap...{'\n'}
                This usually takes 15-60 seconds
              </Text>
            </View>
          )}

          {/* Success */}
          {status === 'success' && (
            <View style={styles.successBox}>
              <Text style={styles.successEmoji}>🎉</Text>
              <Text style={styles.successText}>
                {quote?.outputAmount.toFixed(6)} {vault?.chain} sent to your wallet!
              </Text>
              <TouchableOpacity style={styles.doneButton} onPress={onClose}>
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Failed */}
          {status === 'failed' && (
            <View style={styles.failedBox}>
              <Text style={styles.failedText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => setStatus('idle')}>
                <Text style={styles.buttonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }

  // ============================================
  // RENDER: MAIN FUND SCREEN
  // ============================================
  
  const selectedToken = FUNDING_TOKENS.find(t => t.id === fromToken);

  return (
    <ScrollView style={styles.container}>
      {renderTokenPicker()}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Fund Wallet</Text>
        <Text style={styles.subtitle}>
          Add {vault?.chain} using any supported token
        </Text>
      </View>

      {/* Wallet Info */}
      {vault && (
        <View style={styles.walletInfo}>
          <Text style={styles.walletLabel}>Destination Wallet</Text>
          <Text style={styles.walletName}>
            {vault.metadata?.vault_name || `${vault.chain} Wallet`}
          </Text>
          <Text style={styles.walletAddress}>{vault.address}</Text>
          <Text style={styles.walletProvider}>
            {vault.mpc_provider} • {vault.chain}
          </Text>
        </View>
      )}

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
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>You Receive</Text>
        <View style={styles.receiveBox}>
          <Text style={styles.receiveIcon}>
            {vault?.chain === 'SOL' ? '◎' : '🛡️'}
          </Text>
          <Text style={styles.receiveText}>
            {quote ? `${quote.outputAmount.toFixed(6)} ${vault?.chain}` : `— ${vault?.chain}`}
          </Text>
        </View>
      </View>

      {/* Quote Details */}
      {quote && (
        <View style={styles.quoteDetails}>
          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>Rate</Text>
            <Text style={styles.quoteValue}>
              1 {fromToken} = {quote.exchangeRate.toFixed(6)} {vault?.chain}
            </Text>
          </View>
          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>Fee</Text>
            <Text style={styles.quoteValue}>{quote.fee}</Text>
          </View>
          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>Time</Text>
            <Text style={styles.quoteValue}>{quote.estimatedTime}</Text>
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
            {status === 'quoted' ? 'Confirm Swap' : 'Get Quote'}
          </Text>
        )}
      </TouchableOpacity>

      {/* Footer */}
      <Text style={styles.footer}>
        Powered by NEAR Intents • 0.1% fee
      </Text>
    </ScrollView>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0f',
  },
  loadingText: {
    color: '#888',
    marginTop: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
  },
  walletInfo: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  walletLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  walletName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  walletAddress: {
    fontSize: 12,
    color: '#00FF88',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: 4,
  },
  walletProvider: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  tokenSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
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
    color: '#fff',
    fontWeight: '600',
  },
  tokenSelectorArrow: {
    color: '#666',
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
    paddingVertical: 16,
  },
  inputSuffix: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  arrowBox: {
    alignItems: 'center',
    marginVertical: 8,
  },
  arrow: {
    fontSize: 24,
    color: '#00FF88',
  },
  receiveBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
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
    color: '#00FF88',
  },
  quoteDetails: {
    backgroundColor: '#1a1a2e',
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
  },
  quoteValue: {
    color: '#fff',
  },
  errorBox: {
    backgroundColor: 'rgba(255,0,0,0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#00FF88',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    textAlign: 'center',
    color: '#444',
    fontSize: 12,
    marginTop: 24,
    marginBottom: 40,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
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
    backgroundColor: 'rgba(0,255,136,0.1)',
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
    color: '#fff',
  },
  tokenSymbol: {
    fontSize: 14,
    color: '#666',
  },
  modalClose: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  modalCloseText: {
    color: '#888',
    fontSize: 16,
  },
  
  // Deposit screen styles
  depositScreen: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  depositInstruction: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 16,
  },
  highlight: {
    color: '#00FF88',
    fontWeight: '600',
  },
  addressBox: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 16,
  },
  addressText: {
    color: '#00FF88',
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'center',
  },
  copyButton: {
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  walletButton: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  warningText: {
    color: '#ff9900',
    fontSize: 12,
    textAlign: 'center',
  },
  processingBox: {
    alignItems: 'center',
    padding: 32,
  },
  processingText: {
    color: '#888',
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
    color: '#00FF88',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  doneButton: {
    backgroundColor: '#00FF88',
    borderRadius: 12,
    paddingHorizontal: 48,
    paddingVertical: 16,
  },
  doneButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
  },
  failedBox: {
    alignItems: 'center',
  },
  failedText: {
    color: '#ff4444',
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
});

export default FundMe;