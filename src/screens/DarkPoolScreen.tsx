/**
 * DarkPoolScreen.tsx - FIXED FOR TYPESCRIPT
 * 
 * MEV-protected trading via Arcium encrypted order matching
 * Uses useRoute/useNavigation instead of Props interface
 * 
 * Location: ~/Developer/ZkAGI/zypherpunk/PawPad/src/screens/DarkPoolScreen.tsx
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import api from '../services/api';

type DarkPoolRouteProp = RouteProp<RootStackParamList, 'DarkPool'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface DarkPoolStats {
  totalVolumeUsd: number;
  ordersFilled: number;
  mevSaved: number;
  activeOrders: number;
}

interface Order {
  order_id: string;
  type: 'BUY' | 'SELL';
  asset: string;
  amount: number;
  price: number;
  status: 'PENDING' | 'FILLED' | 'CANCELLED';
  created_at: string;
  vault_id?: string;
}

const DarkPoolScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DarkPoolRouteProp>();
  const { vault_id, vault } = route.params;

  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [asset, setAsset] = useState('SOL');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DarkPoolStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Get dark pool stats
      const statsRes = await api.getDarkPoolStats();
      if (statsRes.success) {
        setStats(statsRes.stats);
      }

      // Get user's orders
      const bookRes = await api.getDarkPoolBook(asset);
      if (bookRes.success && bookRes.orders) {
        const userOrders = bookRes.orders.filter((o: Order) => o.vault_id === vault_id);
        setOrders(userOrders);
      }
    } catch (e) {
      console.error('Failed to load dark pool data:', e);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const submitOrder = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Enter a valid amount');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      Alert.alert('Error', 'Enter a valid price');
      return;
    }

    setLoading(true);
    try {
      const res = await api.submitDarkPoolOrder(
        vault_id,
        orderType,
        asset,
        parseFloat(amount),
        parseFloat(price)
      );

      if (res.success) {
        Alert.alert(
          '✅ Order Submitted!',
          `${orderType} ${amount} ${asset} @ $${price}\n\n🔒 Your order is ENCRYPTED in Arcium MXE.\nNo one can see it until matched!`,
          [{ text: 'OK', onPress: loadData }]
        );
        setAmount('');
        setPrice('');
      } else {
        Alert.alert('Order Failed', res.error || 'Please try again');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit order');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FILLED': return '#22c55e';
      case 'PENDING': return '#eab308';
      case 'CANCELLED': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🏊 Dark Pool</Text>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoTitle}>🔒 MEV-Protected Trading</Text>
          <Text style={styles.infoText}>
            • Orders are encrypted in Arcium MXE{'\n'}
            • No front-running or sandwich attacks{'\n'}
            • Fair execution for everyone{'\n'}
            • Better prices than public DEXs
          </Text>
        </View>

        {/* Stats */}
        {stats && (
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>${(stats.totalVolumeUsd / 1000).toFixed(1)}K</Text>
              <Text style={styles.statLabel}>Volume</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.ordersFilled}</Text>
              <Text style={styles.statLabel}>Filled</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: '#22c55e' }]}>
                ${stats.mevSaved?.toLocaleString() || '0'}
              </Text>
              <Text style={styles.statLabel}>MEV Saved</Text>
            </View>
          </View>
        )}

        {/* Order Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Place Order</Text>

          {/* Buy/Sell Toggle */}
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                orderType === 'BUY' && styles.toggleBuyActive,
              ]}
              onPress={() => setOrderType('BUY')}
            >
              <Text
                style={[
                  styles.toggleText,
                  orderType === 'BUY' && styles.toggleTextActive,
                ]}
              >
                📈 BUY
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                orderType === 'SELL' && styles.toggleSellActive,
              ]}
              onPress={() => setOrderType('SELL')}
            >
              <Text
                style={[
                  styles.toggleText,
                  orderType === 'SELL' && styles.toggleTextActive,
                ]}
              >
                📉 SELL
              </Text>
            </TouchableOpacity>
          </View>

          {/* Asset Selection */}
          <Text style={styles.label}>Asset</Text>
          <View style={styles.assetRow}>
            {['SOL', 'ZEC', 'ETH'].map((a) => (
              <TouchableOpacity
                key={a}
                style={[styles.assetButton, asset === a && styles.assetActive]}
                onPress={() => setAsset(a)}
              >
                <Text
                  style={[
                    styles.assetText,
                    asset === a && styles.assetTextActive,
                  ]}
                >
                  {a}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Amount */}
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor="#6b7280"
            keyboardType="decimal-pad"
          />

          {/* Price */}
          <Text style={styles.label}>Price (USD)</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="0.00"
            placeholderTextColor="#6b7280"
            keyboardType="decimal-pad"
          />

          {/* Order Summary */}
          {amount && price && (
            <View style={styles.summary}>
              <Text style={styles.summaryText}>
                {orderType} {amount} {asset} @ ${price}
              </Text>
              <Text style={styles.summaryTotal}>
                Total: ${(parseFloat(amount || '0') * parseFloat(price || '0')).toFixed(2)}
              </Text>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              orderType === 'SELL' && styles.submitSellButton,
              loading && styles.submitDisabled,
            ]}
            onPress={submitOrder}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>
                🔒 {orderType} {asset} (Encrypted)
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Recent Orders */}
        <View style={styles.ordersSection}>
          <Text style={styles.sectionTitle}>Your Orders</Text>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <View key={index} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text
                    style={[
                      styles.orderType,
                      { color: order.type === 'BUY' ? '#22c55e' : '#ef4444' },
                    ]}
                  >
                    {order.type} {order.asset}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(order.status) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(order.status) },
                      ]}
                    >
                      {order.status}
                    </Text>
                  </View>
                </View>
                <View style={styles.orderDetails}>
                  <Text style={styles.orderDetail}>
                    {order.amount} @ ${order.price}
                  </Text>
                  <Text style={styles.orderDate}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyOrders}>
              <Text style={styles.emptyIcon}>🏊</Text>
              <Text style={styles.emptyText}>No orders yet</Text>
              <Text style={styles.emptySubtext}>
                Place your first encrypted order above
              </Text>
            </View>
          )}
        </View>

        {/* How It Works */}
        <View style={styles.howItWorks}>
          <Text style={styles.sectionTitle}>How Dark Pool Works</Text>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>1</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Submit Order</Text>
              <Text style={styles.stepText}>
                Your order is encrypted before leaving your device
              </Text>
            </View>
          </View>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>2</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Encrypted Matching</Text>
              <Text style={styles.stepText}>
                Orders are matched inside Arcium MXE - no one can see them
              </Text>
            </View>
          </View>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>3</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Fair Settlement</Text>
              <Text style={styles.stepText}>
                Matched orders settle on-chain at fair prices
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  backButton: {
    color: '#4ECDC4',
    fontSize: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoBanner: {
    backgroundColor: '#1e3a5f',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3b82f6',
    marginBottom: 16,
  },
  infoTitle: {
    color: '#60a5fa',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    color: '#93c5fd',
    fontSize: 13,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 4,
  },
  formCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  formTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#374151',
    alignItems: 'center',
  },
  toggleBuyActive: {
    backgroundColor: '#22c55e',
  },
  toggleSellActive: {
    backgroundColor: '#ef4444',
  },
  toggleText: {
    color: '#9CA3AF',
    fontWeight: '600',
    fontSize: 15,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  label: {
    color: '#9CA3AF',
    marginBottom: 8,
    fontSize: 14,
  },
  assetRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  assetButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#374151',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  assetActive: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  assetText: {
    color: '#9CA3AF',
    fontWeight: '600',
  },
  assetTextActive: {
    color: '#0A1628',
  },
  input: {
    backgroundColor: '#374151',
    borderRadius: 10,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  summary: {
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  summaryText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  summaryTotal: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitSellButton: {
    backgroundColor: '#ef4444',
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ordersSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  orderCard: {
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderDetail: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  orderDate: {
    color: '#6B7280',
    fontSize: 12,
  },
  emptyOrders: {
    backgroundColor: '#1E293B',
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 4,
  },
  howItWorks: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4ECDC4',
    color: '#0A1628',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 28,
    marginRight: 12,
    overflow: 'hidden',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  stepText: {
    color: '#9CA3AF',
    fontSize: 13,
  },
});

export default DarkPoolScreen;