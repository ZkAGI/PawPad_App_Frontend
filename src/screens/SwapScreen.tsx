import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import api from '../services/api';

export default function SwapScreen() {
  const [fromChain, setFromChain] = useState('ARB');
  const [toChain, setToChain] = useState('SOL');
  const [amount, setAmount] = useState('10');
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState(null);

  const chains = ['SOL', 'ETH', 'ARB', 'NEAR', 'BASE'];

  const getQuote = async () => {
    if (!recipient) {
      Alert.alert('Error', 'Please enter recipient address');
      return;
    }

    setLoading(true);
    try {
      const result = await api.getQuote({
        fromChain,
        toChain,
        fromToken: fromChain,
        toToken: toChain,
        amount,
        recipient,
        dryRun: false,
      });

      if (result.success) {
        setQuote(result);
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>From Chain</Text>
        <View style={styles.chainSelector}>
          {chains.map(chain => (
            <TouchableOpacity
              key={chain}
              style={[styles.chainButton, fromChain === chain && styles.chainButtonActive]}
              onPress={() => setFromChain(chain)}
            >
              <Text style={[styles.chainText, fromChain === chain && styles.chainTextActive]}>
                {chain}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="Enter amount"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>To Chain</Text>
        <View style={styles.chainSelector}>
          {chains.map(chain => (
            <TouchableOpacity
              key={chain}
              style={[styles.chainButton, toChain === chain && styles.chainButtonActive]}
              onPress={() => setToChain(chain)}
            >
              <Text style={[styles.chainText, toChain === chain && styles.chainTextActive]}>
                {chain}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Recipient Address</Text>
        <TextInput
          style={styles.input}
          value={recipient}
          onChangeText={setRecipient}
          placeholder="Enter destination address"
          placeholderTextColor="#666"
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={getQuote}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Get Quote</Text>
        )}
      </TouchableOpacity>

      {quote && quote.success && (
        <View style={styles.quoteBox}>
          <Text style={styles.quoteTitle}>Swap Quote</Text>
          
          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>You Send:</Text>
            <Text style={styles.quoteValue}>
              {quote.quote?.amount_in} {quote.origin_token?.symbol}
            </Text>
          </View>

          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>You Receive:</Text>
            <Text style={styles.quoteValue}>
              {quote.quote?.amount_out} {quote.destination_token?.symbol}
            </Text>
          </View>

          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>Time:</Text>
            <Text style={styles.quoteValue}>~{quote.quote?.time_estimate_seconds}s</Text>
          </View>

          {quote.quote?.deposit_address && (
            <>
              <Text style={styles.instructionTitle}>Instructions:</Text>
              <Text style={styles.instruction}>
                Send to deposit address and wait for completion
              </Text>
              <View style={styles.addressBox}>
                <Text style={styles.address}>{quote.quote?.deposit_address}</Text>
              </View>
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  chainSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chainButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
  },
  chainButtonActive: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  chainText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  chainTextActive: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  button: {
    backgroundColor: '#8b5cf6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  quoteBox: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  quoteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  quoteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quoteLabel: {
    color: '#888',
    fontSize: 14,
  },
  quoteValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  instructionTitle: {
    color: '#8b5cf6',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  instruction: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 8,
  },
  addressBox: {
    backgroundColor: '#0a0a0a',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  address: {
    color: '#8b5cf6',
    fontSize: 11,
    fontFamily: 'monospace',
  },
});
