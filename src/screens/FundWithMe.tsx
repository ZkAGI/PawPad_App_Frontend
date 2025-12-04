/**
 * ============================================
 * FUND ME SCREEN - WITH AUTO VAULT SELECTION
 * ============================================
 * 
 * Automatically uses the vault from VaultContext.
 * No need to pass vault props manually!
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
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import { useVaults, useActiveVault } from '../context/VaultContext';

// ============================================
// CONFIGURATION
// ============================================

const API_BASE = __DEV__ 
  ? 'http://localhost:3001'
  : 'https://pawpad-arcium-backend.onrender.com';

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

interface FundMeScreenProps {
  // Optional: Override the auto-selected vault
  vaultId?: string;
  
  // Optional: Specify which chain to fund
  chain?: 'SOL' | 'ZEC';
  
  // Callbacks
  onSuccess?: () => void;
  onClose?: () => void;
}

// ============================================
// MAIN COMPONENT
// ============================================

const FundMeScreen: React.FC<FundMeScreenProps> = ({
  vaultId: overrideVaultId,
  chain: preferredChain,
  onSuccess,
  onClose,
}) => {
  const navigation = useNavigation();
  
  // === AUTO-SELECT VAULT FROM CONTEXT ===
  const { vaults, activeVault, solVault, zecVault, refreshBalance } = useVaults();
  
  // Determine which vault to use
  const getTargetVault = () => {
    // 1. If vaultId override is provided, find that specific vault
    if (overrideVaultId) {
      return vaults.find(v => v.vault_id === overrideVaultId) || null;
    }
    
    // 2. If preferred chain is specified, get vault for that chain
    if (preferredChain === 'SOL') return solVault;
    if (preferredChain === 'ZEC') return zecVault;
    
    // 3. Default to active vault
    return activeVault;
  };
  
  const vault = getTargetVault();

  // ============================================
  // STATE
  // ============================================
  
  const [fromToken, setFromToken] = useState('ETH');
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [depositAddress, setDepositAddress] = useState<string | null>(null);
  const [swapId, setSwapId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'quoting' | 'quoted' | 'executing' | 'pending' | 'processing' | 'success' | 'failed'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [showTokenPicker, setShowTokenPicker] = useState(false);

  // ============================================
  // AVAILABLE TOKENS (exclude same token)
  // ============================================
  
  const availableFromTokens = FUNDING_TOKENS.filter(token => {
    if (!vault) return true;
    if (vault.chain === 'SOL' && token.id === 'SOL') return false;
    if (vault.chain === 'ZEC' && token.id === 'ZEC') return false;
    return true;
  });

  // ============================================
  // NO VAULT ERROR
  // ============================================
  
  if (!vault) {
    return (
      <View style={styles.noVaultContainer}>
        <Text style={styles.noVaultEmoji}>🔐</Text>
        <Text style={styles.noVaultTitle}>No Wallet Found</Text>
        <Text style={styles.noVaultText}>
          Create a wallet first to add funds.
        </Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => {
            onClose?.();
            // Navigate to create wallet
            // navigation.navigate('CreateVault');
          }}
        >
          <Text style={styles.createButtonText}>Create Wallet</Text>
        </TouchableOpacity>
      </View>
    );
  }

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

  const executeSwap = async () => {
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

  const pollStatus = async (id: string) => {
    let attempts = 0;
    const maxAttempts = 120;
    
    const checkStatus = async (): Promise<boolean> => {
      try {
        const response = await fetch(`${API_BASE}/api/fund/status/${encodeURIComponent(id)}`);
        const data = await response.json();

        if (data.success) {
          switch (data.status) {
            case 'SUCCESS':
              setStatus('success');
              refreshBalance(vault.vault_id);
              onSuccess?.();
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
  // HELPERS
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
        Linking.openURL(`https://phantom.app/ul/send?token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&destination=${depositAddress}&amount=${amount}`);
      } else {
        Linking.openURL(`https://phantom.app/ul/send?destination=${depositAddress}&amount=${amount}`);
      }
    } else if (token?.chain === 'ethereum') {
      Linking.openURL(`https://metamask.app.link/send/${depositAddress}`);
    } else if (token?.chain === 'bitcoin') {
      Linking.openURL(`bitcoin:${depositAddress}?amount=${amount}`);
    } else {
      copyAddress();
    }
  };

  const handleClose = () => {
    onClose?.();
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  // ============================================
  // RENDER: TOKEN PICKER
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
  // RENDER: DEPOSIT/SUCCESS/FAILED SCREENS
  // ============================================
  
  if (status === 'pending' || status === 'processing' || status === 'success' || status === 'failed') {
    const token = FUNDING_TOKENS.find(t => t.id === fromToken);
    
    return (
      <View style={styles.container}>
        <View style={styles.depositScreen}>
          <Text style={styles.statusTitle}>
            {status === 'pending' && '⏳ Waiting for Deposit'}
            {status === 'processing' && '⚙️ Processing...'}
            {status === 'success' && '✅ Success!'}
            {status === 'failed' && '❌ Failed'}
          </Text>

          {status === 'pending' && depositAddress && (
            <>
              <Text style={styles.depositInstruction}>
                Send exactly{' '}
                <Text style={styles.highlight}>{amount} {token?.symbol}</Text>
                {' '}to:
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
                  {token?.chain === 'solana' && '👻 Open Phantom'}
                  {token?.chain === 'ethereum' && '🦊 Open MetaMask'}
                  {token?.chain === 'bitcoin' && '₿ Open Bitcoin Wallet'}
                  {!['solana', 'ethereum', 'bitcoin'].includes(token?.chain || '') && '📱 Open Wallet'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.warningText}>
                ⚠️ Only send {token?.symbol} on {token?.name}!
              </Text>
            </>
          )}

          {status === 'processing' && (
            <View style={styles.processingBox}>
              <ActivityIndicator size="large" color="#00FF88" />
              <Text style={styles.processingText}>
                Processing your swap...{'\n'}
                This usually takes 15-60 seconds
              </Text>
            </View>
          )}

          {status === 'success' && (
            <View style={styles.successBox}>
              <Text style={styles.successEmoji}>🎉</Text>
              <Text style={styles.successText}>
                {quote?.outputAmount.toFixed(6)} {vault.chain} sent to your wallet!
              </Text>
              <Text style={styles.walletAddressSmall}>{vault.address}</Text>
              <TouchableOpacity style={styles.doneButton} onPress={handleClose}>
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          )}

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
  // RENDER: MAIN SCREEN
  // ============================================
  
  const selectedToken = FUNDING_TOKENS.find(t => t.id === fromToken);

  return (
    <ScrollView style={styles.container}>
      {renderTokenPicker()}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Fund Wallet</Text>
        <Text style={styles.subtitle}>
          Add {vault.chain} using any supported token
        </Text>
      </View>

      {/* === VAULT INFO - AUTO POPULATED === */}
      <View style={styles.vaultCard}>
        <View style={styles.vaultHeader}>
          <Text style={styles.vaultChainIcon}>
            {vault.chain === 'SOL' ? '◎' : '🛡️'}
          </Text>
          <View style={styles.vaultDetails}>
            <Text style={styles.vaultName}>{vault.vault_name}</Text>
            <Text style={styles.vaultProvider}>{vault.mpc_provider}</Text>
          </View>
          <View style={styles.vaultChainBadge}>
            <Text style={styles.vaultChainText}>{vault.chain}</Text>
          </View>
        </View>
        <Text style={styles.vaultAddress}>{vault.address}</Text>
        {vault.balance !== undefined && (
          <Text style={styles.vaultBalance}>
            Balance: {vault.balance.toFixed(6)} {vault.chain}
          </Text>
        )}
      </View>

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
            {vault.chain === 'SOL' ? '◎' : '🛡️'}
          </Text>
          <Text style={styles.receiveText}>
            {quote ? `${quote.outputAmount.toFixed(6)} ${vault.chain}` : `— ${vault.chain}`}
          </Text>
        </View>
      </View>

      {/* Quote Details */}
      {quote && (
        <View style={styles.quoteDetails}>
          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>Rate</Text>
            <Text style={styles.quoteValue}>
              1 {fromToken} = {quote.exchangeRate.toFixed(6)} {vault.chain}
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
  
  // No Vault
  noVaultContainer: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noVaultEmoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  noVaultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  noVaultText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 32,
  },
  createButton: {
    backgroundColor: '#00FF88',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  createButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },

  // Header
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

  // Vault Card
  vaultCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#00FF88',
  },
  vaultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vaultChainIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  vaultDetails: {
    flex: 1,
  },
  vaultName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  vaultProvider: {
    fontSize: 12,
    color: '#888',
  },
  vaultChainBadge: {
    backgroundColor: '#00FF88',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  vaultChainText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  vaultAddress: {
    fontSize: 11,
    color: '#00FF88',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  vaultBalance: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },

  // Sections
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
  
  // Modal
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
  
  // Deposit screen
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
    marginBottom: 8,
  },
  walletAddressSmall: {
    color: '#666',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
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

export default FundMeScreen;