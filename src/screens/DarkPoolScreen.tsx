// /**
//  * DarkPoolScreen.tsx - FIXED FOR TYPESCRIPT
//  * 
//  * MEV-protected trading via Arcium encrypted order matching
//  * Uses useRoute/useNavigation instead of Props interface
//  * 
//  * Location: ~/Developer/ZkAGI/zypherpunk/PawPad/src/screens/DarkPoolScreen.tsx
//  */

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   ActivityIndicator,
//   RefreshControl,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../types/navigation';
// import api from '../services/api';

// type DarkPoolRouteProp = RouteProp<RootStackParamList, 'DarkPool'>;
// type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// interface DarkPoolStats {
//   totalVolumeUsd: number;
//   ordersFilled: number;
//   mevSaved: number;
//   activeOrders: number;
// }

// interface Order {
//   order_id: string;
//   type: 'BUY' | 'SELL';
//   asset: string;
//   amount: number;
//   price: number;
//   status: 'PENDING' | 'FILLED' | 'CANCELLED';
//   created_at: string;
//   vault_id?: string;
// }

// const DarkPoolScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<DarkPoolRouteProp>();
//   const { vault_id, vault } = route.params;

//   const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
//   const [asset, setAsset] = useState('SOL');
//   const [amount, setAmount] = useState('');
//   const [price, setPrice] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [stats, setStats] = useState<DarkPoolStats | null>(null);
//   const [orders, setOrders] = useState<Order[]>([]);

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       // Get dark pool stats
//       const statsRes = await api.getDarkPoolStats();
//       if (statsRes.success) {
//         setStats(statsRes.stats);
//       }

//       // Get user's orders
//       const bookRes = await api.getDarkPoolBook(asset);
//       if (bookRes.success && bookRes.orders) {
//         const userOrders = bookRes.orders.filter((o: Order) => o.vault_id === vault_id);
//         setOrders(userOrders);
//       }
//     } catch (e) {
//       console.error('Failed to load dark pool data:', e);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadData();
//   };

//   const submitOrder = async () => {
//     if (!amount || parseFloat(amount) <= 0) {
//       Alert.alert('Error', 'Enter a valid amount');
//       return;
//     }
//     if (!price || parseFloat(price) <= 0) {
//       Alert.alert('Error', 'Enter a valid price');
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await api.submitDarkPoolOrder(
//         vault_id,
//         orderType,
//         asset,
//         parseFloat(amount),
//         parseFloat(price)
//       );

//       if (res.success) {
//         Alert.alert(
//           '✅ Order Submitted!',
//           `${orderType} ${amount} ${asset} @ $${price}\n\n🔒 Your order is ENCRYPTED in Arcium MXE.\nNo one can see it until matched!`,
//           [{ text: 'OK', onPress: loadData }]
//         );
//         setAmount('');
//         setPrice('');
//       } else {
//         Alert.alert('Order Failed', res.error || 'Please try again');
//       }
//     } catch (error: any) {
//       Alert.alert('Error', error.message || 'Failed to submit order');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'FILLED': return '#22c55e';
//       case 'PENDING': return '#eab308';
//       case 'CANCELLED': return '#ef4444';
//       default: return '#6b7280';
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Text style={styles.backButton}>← Back</Text>
//           </TouchableOpacity>
//           <Text style={styles.title}>🏊 Dark Pool</Text>
//         </View>

//         {/* Info Banner */}
//         <View style={styles.infoBanner}>
//           <Text style={styles.infoTitle}>🔒 MEV-Protected Trading</Text>
//           <Text style={styles.infoText}>
//             • Orders are encrypted in Arcium MXE{'\n'}
//             • No front-running or sandwich attacks{'\n'}
//             • Fair execution for everyone{'\n'}
//             • Better prices than public DEXs
//           </Text>
//         </View>

//         {/* Stats */}
//         {stats && (
//           <View style={styles.statsRow}>
//             <View style={styles.statBox}>
//               <Text style={styles.statValue}>${(stats.totalVolumeUsd / 1000).toFixed(1)}K</Text>
//               <Text style={styles.statLabel}>Volume</Text>
//             </View>
//             <View style={styles.statBox}>
//               <Text style={styles.statValue}>{stats.ordersFilled}</Text>
//               <Text style={styles.statLabel}>Filled</Text>
//             </View>
//             <View style={styles.statBox}>
//               <Text style={[styles.statValue, { color: '#22c55e' }]}>
//                 ${stats.mevSaved?.toLocaleString() || '0'}
//               </Text>
//               <Text style={styles.statLabel}>MEV Saved</Text>
//             </View>
//           </View>
//         )}

//         {/* Order Form */}
//         <View style={styles.formCard}>
//           <Text style={styles.formTitle}>Place Order</Text>

//           {/* Buy/Sell Toggle */}
//           <View style={styles.toggleRow}>
//             <TouchableOpacity
//               style={[
//                 styles.toggleButton,
//                 orderType === 'BUY' && styles.toggleBuyActive,
//               ]}
//               onPress={() => setOrderType('BUY')}
//             >
//               <Text
//                 style={[
//                   styles.toggleText,
//                   orderType === 'BUY' && styles.toggleTextActive,
//                 ]}
//               >
//                 📈 BUY
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[
//                 styles.toggleButton,
//                 orderType === 'SELL' && styles.toggleSellActive,
//               ]}
//               onPress={() => setOrderType('SELL')}
//             >
//               <Text
//                 style={[
//                   styles.toggleText,
//                   orderType === 'SELL' && styles.toggleTextActive,
//                 ]}
//               >
//                 📉 SELL
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* Asset Selection */}
//           <Text style={styles.label}>Asset</Text>
//           <View style={styles.assetRow}>
//             {['SOL', 'ZEC', 'ETH'].map((a) => (
//               <TouchableOpacity
//                 key={a}
//                 style={[styles.assetButton, asset === a && styles.assetActive]}
//                 onPress={() => setAsset(a)}
//               >
//                 <Text
//                   style={[
//                     styles.assetText,
//                     asset === a && styles.assetTextActive,
//                   ]}
//                 >
//                   {a}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* Amount */}
//           <Text style={styles.label}>Amount</Text>
//           <TextInput
//             style={styles.input}
//             value={amount}
//             onChangeText={setAmount}
//             placeholder="0.00"
//             placeholderTextColor="#6b7280"
//             keyboardType="decimal-pad"
//           />

//           {/* Price */}
//           <Text style={styles.label}>Price (USD)</Text>
//           <TextInput
//             style={styles.input}
//             value={price}
//             onChangeText={setPrice}
//             placeholder="0.00"
//             placeholderTextColor="#6b7280"
//             keyboardType="decimal-pad"
//           />

//           {/* Order Summary */}
//           {amount && price && (
//             <View style={styles.summary}>
//               <Text style={styles.summaryText}>
//                 {orderType} {amount} {asset} @ ${price}
//               </Text>
//               <Text style={styles.summaryTotal}>
//                 Total: ${(parseFloat(amount || '0') * parseFloat(price || '0')).toFixed(2)}
//               </Text>
//             </View>
//           )}

//           {/* Submit Button */}
//           <TouchableOpacity
//             style={[
//               styles.submitButton,
//               orderType === 'SELL' && styles.submitSellButton,
//               loading && styles.submitDisabled,
//             ]}
//             onPress={submitOrder}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.submitText}>
//                 🔒 {orderType} {asset} (Encrypted)
//               </Text>
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* Recent Orders */}
//         <View style={styles.ordersSection}>
//           <Text style={styles.sectionTitle}>Your Orders</Text>
//           {orders.length > 0 ? (
//             orders.map((order, index) => (
//               <View key={index} style={styles.orderCard}>
//                 <View style={styles.orderHeader}>
//                   <Text
//                     style={[
//                       styles.orderType,
//                       { color: order.type === 'BUY' ? '#22c55e' : '#ef4444' },
//                     ]}
//                   >
//                     {order.type} {order.asset}
//                   </Text>
//                   <View
//                     style={[
//                       styles.statusBadge,
//                       { backgroundColor: getStatusColor(order.status) + '20' },
//                     ]}
//                   >
//                     <Text
//                       style={[
//                         styles.statusText,
//                         { color: getStatusColor(order.status) },
//                       ]}
//                     >
//                       {order.status}
//                     </Text>
//                   </View>
//                 </View>
//                 <View style={styles.orderDetails}>
//                   <Text style={styles.orderDetail}>
//                     {order.amount} @ ${order.price}
//                   </Text>
//                   <Text style={styles.orderDate}>
//                     {new Date(order.created_at).toLocaleDateString()}
//                   </Text>
//                 </View>
//               </View>
//             ))
//           ) : (
//             <View style={styles.emptyOrders}>
//               <Text style={styles.emptyIcon}>🏊</Text>
//               <Text style={styles.emptyText}>No orders yet</Text>
//               <Text style={styles.emptySubtext}>
//                 Place your first encrypted order above
//               </Text>
//             </View>
//           )}
//         </View>

//         {/* How It Works */}
//         <View style={styles.howItWorks}>
//           <Text style={styles.sectionTitle}>How Dark Pool Works</Text>
//           <View style={styles.step}>
//             <Text style={styles.stepNumber}>1</Text>
//             <View style={styles.stepContent}>
//               <Text style={styles.stepTitle}>Submit Order</Text>
//               <Text style={styles.stepText}>
//                 Your order is encrypted before leaving your device
//               </Text>
//             </View>
//           </View>
//           <View style={styles.step}>
//             <Text style={styles.stepNumber}>2</Text>
//             <View style={styles.stepContent}>
//               <Text style={styles.stepTitle}>Encrypted Matching</Text>
//               <Text style={styles.stepText}>
//                 Orders are matched inside Arcium MXE - no one can see them
//               </Text>
//             </View>
//           </View>
//           <View style={styles.step}>
//             <Text style={styles.stepNumber}>3</Text>
//             <View style={styles.stepContent}>
//               <Text style={styles.stepTitle}>Fair Settlement</Text>
//               <Text style={styles.stepText}>
//                 Matched orders settle on-chain at fair prices
//               </Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0A1628',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     gap: 12,
//   },
//   backButton: {
//     color: '#4ECDC4',
//     fontSize: 16,
//   },
//   title: {
//     color: '#FFFFFF',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   infoBanner: {
//     backgroundColor: '#1e3a5f',
//     marginHorizontal: 16,
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#3b82f6',
//     marginBottom: 16,
//   },
//   infoTitle: {
//     color: '#60a5fa',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   infoText: {
//     color: '#93c5fd',
//     fontSize: 13,
//     lineHeight: 20,
//   },
//   statsRow: {
//     flexDirection: 'row',
//     marginHorizontal: 16,
//     gap: 8,
//     marginBottom: 16,
//   },
//   statBox: {
//     flex: 1,
//     backgroundColor: '#1E293B',
//     padding: 12,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   statValue: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   statLabel: {
//     color: '#6B7280',
//     fontSize: 11,
//     marginTop: 4,
//   },
//   formCard: {
//     backgroundColor: '#1E293B',
//     marginHorizontal: 16,
//     padding: 20,
//     borderRadius: 16,
//     marginBottom: 16,
//   },
//   formTitle: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   toggleRow: {
//     flexDirection: 'row',
//     gap: 8,
//     marginBottom: 20,
//   },
//   toggleButton: {
//     flex: 1,
//     padding: 14,
//     borderRadius: 10,
//     backgroundColor: '#374151',
//     alignItems: 'center',
//   },
//   toggleBuyActive: {
//     backgroundColor: '#22c55e',
//   },
//   toggleSellActive: {
//     backgroundColor: '#ef4444',
//   },
//   toggleText: {
//     color: '#9CA3AF',
//     fontWeight: '600',
//     fontSize: 15,
//   },
//   toggleTextActive: {
//     color: '#FFFFFF',
//   },
//   label: {
//     color: '#9CA3AF',
//     marginBottom: 8,
//     fontSize: 14,
//   },
//   assetRow: {
//     flexDirection: 'row',
//     gap: 8,
//     marginBottom: 16,
//   },
//   assetButton: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 8,
//     backgroundColor: '#374151',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#4B5563',
//   },
//   assetActive: {
//     backgroundColor: '#4ECDC4',
//     borderColor: '#4ECDC4',
//   },
//   assetText: {
//     color: '#9CA3AF',
//     fontWeight: '600',
//   },
//   assetTextActive: {
//     color: '#0A1628',
//   },
//   input: {
//     backgroundColor: '#374151',
//     borderRadius: 10,
//     padding: 16,
//     color: '#FFFFFF',
//     fontSize: 18,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#4B5563',
//   },
//   summary: {
//     backgroundColor: '#374151',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   summaryText: {
//     color: '#9CA3AF',
//     fontSize: 14,
//   },
//   summaryTotal: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 4,
//   },
//   submitButton: {
//     backgroundColor: '#22c55e',
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   submitSellButton: {
//     backgroundColor: '#ef4444',
//   },
//   submitDisabled: {
//     opacity: 0.5,
//   },
//   submitText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   ordersSection: {
//     marginHorizontal: 16,
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   orderCard: {
//     backgroundColor: '#1E293B',
//     padding: 14,
//     borderRadius: 10,
//     marginBottom: 8,
//   },
//   orderHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   orderType: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   statusBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   orderDetails: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   orderDetail: {
//     color: '#9CA3AF',
//     fontSize: 14,
//   },
//   orderDate: {
//     color: '#6B7280',
//     fontSize: 12,
//   },
//   emptyOrders: {
//     backgroundColor: '#1E293B',
//     padding: 32,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   emptyIcon: {
//     fontSize: 48,
//     marginBottom: 12,
//   },
//   emptyText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   emptySubtext: {
//     color: '#6B7280',
//     fontSize: 14,
//     marginTop: 4,
//   },
//   howItWorks: {
//     marginHorizontal: 16,
//     marginBottom: 32,
//   },
//   step: {
//     flexDirection: 'row',
//     marginBottom: 16,
//   },
//   stepNumber: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: '#4ECDC4',
//     color: '#0A1628',
//     fontSize: 14,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     lineHeight: 28,
//     marginRight: 12,
//     overflow: 'hidden',
//   },
//   stepContent: {
//     flex: 1,
//   },
//   stepTitle: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '600',
//     marginBottom: 2,
//   },
//   stepText: {
//     color: '#9CA3AF',
//     fontSize: 13,
//   },
// });

// export default DarkPoolScreen;

/**
 * DarkPoolScreen.tsx
 * 
 * MEV-protected trading via Arcium encrypted order matching
 * 
 * Styled with VoltWallet Premium Theme
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
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import LinearGradient from 'react-native-linear-gradient';
import api from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
      const statsRes = await api.getDarkPoolStats();
      if (statsRes.success) {
        setStats(statsRes.stats);
      }

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

  const getAssetIcon = (assetName: string) => {
    switch (assetName) {
      case 'SOL': return '◎';
      case 'ZEC': return 'Z';
      case 'ETH': return '⟠';
      default: return '●';
    }
  };

  const getAssetColor = (assetName: string) => {
    switch (assetName) {
      case 'SOL': return '#9945FF';
      case 'ZEC': return '#F4B728';
      case 'ETH': return '#627EEA';
      default: return '#4ECDC4';
    }
  };

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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4ECDC4" />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
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
              <Text style={styles.title}>Dark Pool</Text>
              <Text style={styles.subtitle}>MEV-Protected Trading</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>

          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <View style={styles.infoBannerHeader}>
              <View style={styles.lockIconContainer}>
                <Text style={styles.lockIcon}>🔒</Text>
              </View>
              <Text style={styles.infoTitle}>Encrypted Order Matching</Text>
            </View>
            <View style={styles.infoList}>
              <View style={styles.infoItem}>
                <Text style={styles.infoCheck}>✓</Text>
                <Text style={styles.infoText}>Orders encrypted in Arcium MXE</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoCheck}>✓</Text>
                <Text style={styles.infoText}>No front-running or sandwich attacks</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoCheck}>✓</Text>
                <Text style={styles.infoText}>Fair execution for everyone</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoCheck}>✓</Text>
                <Text style={styles.infoText}>Better prices than public DEXs</Text>
              </View>
            </View>
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
                <Text style={[styles.statValue, styles.mevValue]}>
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
                activeOpacity={0.7}
              >
                <Text style={styles.toggleIcon}>📈</Text>
                <Text
                  style={[
                    styles.toggleText,
                    orderType === 'BUY' && styles.toggleTextActive,
                  ]}
                >
                  BUY
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  orderType === 'SELL' && styles.toggleSellActive,
                ]}
                onPress={() => setOrderType('SELL')}
                activeOpacity={0.7}
              >
                <Text style={styles.toggleIcon}>📉</Text>
                <Text
                  style={[
                    styles.toggleText,
                    orderType === 'SELL' && styles.toggleTextActive,
                  ]}
                >
                  SELL
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
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.assetIconContainer,
                    asset === a && { backgroundColor: getAssetColor(a) }
                  ]}>
                    <Text style={[
                      styles.assetIcon,
                      a === 'ZEC' && asset === a && styles.assetIconDark
                    ]}>
                      {getAssetIcon(a)}
                    </Text>
                  </View>
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
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor="rgba(255,255,255,0.3)"
                keyboardType="decimal-pad"
              />
              <View style={styles.inputSuffix}>
                <Text style={styles.inputSuffixText}>{asset}</Text>
              </View>
            </View>

            {/* Price */}
            <Text style={styles.label}>Price (USD)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="0.00"
                placeholderTextColor="rgba(255,255,255,0.3)"
                keyboardType="decimal-pad"
              />
              <View style={styles.inputSuffix}>
                <Text style={styles.inputSuffixText}>USD</Text>
              </View>
            </View>

            {/* Order Summary */}
            {amount && price && (
              <View style={styles.summary}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Order</Text>
                  <Text style={styles.summaryValue}>
                    {orderType} {amount} {asset} @ ${price}
                  </Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total</Text>
                  <Text style={styles.summaryTotal}>
                    ${(parseFloat(amount || '0') * parseFloat(price || '0')).toFixed(2)}
                  </Text>
                </View>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                orderType === 'BUY' && styles.submitBuyButton,
                orderType === 'SELL' && styles.submitSellButton,
                loading && styles.submitDisabled,
              ]}
              onPress={submitOrder}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text style={styles.submitText}>Processing...</Text>
                </View>
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
                    <View style={styles.orderTypeContainer}>
                      <View style={[
                        styles.orderTypeIcon,
                        { backgroundColor: order.type === 'BUY' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)' }
                      ]}>
                        <Text style={{ color: order.type === 'BUY' ? '#22c55e' : '#ef4444' }}>
                          {order.type === 'BUY' ? '↑' : '↓'}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.orderType,
                          { color: order.type === 'BUY' ? '#22c55e' : '#ef4444' },
                        ]}
                      >
                        {order.type} {order.asset}
                      </Text>
                    </View>
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
                <View style={styles.emptyIconContainer}>
                  <Text style={styles.emptyIcon}>🏊</Text>
                </View>
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
            <View style={styles.stepsContainer}>
              <View style={styles.step}>
                <View style={styles.stepNumberContainer}>
                  <Text style={styles.stepNumber}>1</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Submit Order</Text>
                  <Text style={styles.stepText}>
                    Your order is encrypted before leaving your device
                  </Text>
                </View>
              </View>
              <View style={styles.stepConnector} />
              <View style={styles.step}>
                <View style={styles.stepNumberContainer}>
                  <Text style={styles.stepNumber}>2</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Encrypted Matching</Text>
                  <Text style={styles.stepText}>
                    Orders are matched inside Arcium MXE - no one can see them
                  </Text>
                </View>
              </View>
              <View style={styles.stepConnector} />
              <View style={styles.step}>
                <View style={styles.stepNumberContainer}>
                  <Text style={styles.stepNumber}>3</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Fair Settlement</Text>
                  <Text style={styles.stepText}>
                    Matched orders settle on-chain at fair prices
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Security Footer */}
          <View style={styles.securityFooter}>
            <Text style={styles.securityText}>◈ Powered by Arcium MXE • ZkAGI 2025</Text>
          </View>
        </ScrollView>
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
  scrollContent: {
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
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: '#4ECDC4',
    fontSize: 13,
    marginTop: 4,
  },

  // Info Banner
  infoBanner: {
    backgroundColor: 'rgba(30, 58, 95, 0.8)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  infoBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  lockIconContainer: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lockIcon: {
    fontSize: 18,
  },
  infoTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoList: {
    gap: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCheck: {
    color: '#4ECDC4',
    fontSize: 14,
    marginRight: 10,
    fontWeight: '600',
  },
  infoText: {
    color: '#9CA3AF',
    fontSize: 14,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  mevValue: {
    color: '#4ECDC4',
  },
  statLabel: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 6,
  },

  // Form Card
  formCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  formTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },

  // Toggle
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(30, 58, 95, 0.5)',
    gap: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  toggleBuyActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderColor: '#22c55e',
  },
  toggleSellActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#ef4444',
  },
  toggleIcon: {
    fontSize: 16,
  },
  toggleText: {
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 15,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },

  // Labels
  label: {
    color: '#6B7280',
    marginBottom: 10,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Asset Row
  assetRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  assetButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(30, 58, 95, 0.5)',
    gap: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  assetActive: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    borderColor: 'rgba(78, 205, 196, 0.5)',
  },
  assetIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  assetIcon: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  assetIconDark: {
    color: '#000000',
  },
  assetText: {
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 14,
  },
  assetTextActive: {
    color: '#FFFFFF',
  },

  // Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 58, 95, 0.5)',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  input: {
    flex: 1,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  inputSuffix: {
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  inputSuffixText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },

  // Summary
  summary: {
    backgroundColor: 'rgba(30, 58, 95, 0.5)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.3)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  summaryLabel: {
    color: '#6B7280',
    fontSize: 14,
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  summaryTotal: {
    color: '#4ECDC4',
    fontSize: 18,
    fontWeight: '700',
  },

  // Submit Button
  submitButton: {
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  submitBuyButton: {
    backgroundColor: '#22c55e',
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
    fontWeight: '700',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  // Orders Section
  ordersSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  orderCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  orderTypeIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderType: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
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
    fontSize: 13,
  },

  // Empty Orders
  emptyOrders: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(30, 58, 95, 0.5)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 6,
  },

  // How It Works
  howItWorks: {
    marginBottom: 20,
  },
  stepsContainer: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  step: {
    flexDirection: 'row',
  },
  stepNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  stepNumber: {
    color: '#4ECDC4',
    fontSize: 14,
    fontWeight: '700',
  },
  stepConnector: {
    width: 2,
    height: 20,
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    marginLeft: 15,
    marginVertical: 4,
  },
  stepContent: {
    flex: 1,
    paddingTop: 4,
  },
  stepTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  stepText: {
    color: '#6B7280',
    fontSize: 13,
    lineHeight: 18,
  },

  // Security Footer
  securityFooter: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  securityText: {
    fontSize: 12,
    color: '#4B5563',
  },
});

export default DarkPoolScreen;