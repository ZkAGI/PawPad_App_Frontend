/**
 * LendingScreen.tsx - FIXED FOR TYPESCRIPT
 * 
 * Private lending with Arcium encrypted positions
 * Uses useRoute/useNavigation instead of Props interface
 * 
 * Location: ~/Developer/ZkAGI/zypherpunk/PawPad/src/screens/LendingScreen.tsx
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import api from '../services/api';

type LendingRouteProp = RouteProp<RootStackParamList, 'Lending'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface LendingPosition {
  loan_id: string;
  health_factor: number;
  ltv: string;
  status: 'HEALTHY' | 'AT_RISK' | 'LIQUIDATABLE';
  collateral: Record<string, { amount: number; valueUsd?: number }>;
  borrowed: Record<string, { amount: number; valueUsd?: number }>;
}

interface PoolInfo {
  maxLTV: number;
  liquidationLTV: number;
  currentInterestRate: number;
  utilizationRate: string;
  totalValueLocked: number;
  totalBorrowed: number;
  activeLoans: number;
}

const LendingScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<LendingRouteProp>();
  const { vault_id, vault } = route.params;

  const [poolInfo, setPoolInfo] = useState<PoolInfo | null>(null);
  const [position, setPosition] = useState<LendingPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'deposit' | 'borrow' | 'position'>('position');

  // Form states
  const [depositAsset, setDepositAsset] = useState('SOL');
  const [depositAmount, setDepositAmount] = useState('');
  const [borrowAsset, setBorrowAsset] = useState('USDC');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      // Get pool info
      const poolRes = await api.getLendingPool();
      if (poolRes.success) {
        setPoolInfo(poolRes.pool);
      }

      // Get user position
      const posRes = await api.getLendingPosition(vault_id);
      if (posRes.success && posRes.position) {
        setPosition(posRes.position);
      } else {
        setPosition(null);
      }
    } catch (error: any) {
      console.error('Lending fetch error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [vault_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Actions
  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      Alert.alert('Error', 'Enter a valid amount');
      return;
    }

    setActionLoading(true);
    try {
      const res = await api.depositCollateral(vault_id, depositAsset, depositAmount);

      if (res.success) {
        Alert.alert(
          '✅ Collateral Deposited!',
          `Deposited ${depositAmount} ${depositAsset}\n\nYour collateral is now encrypted in Arcium MXE. No one can see your position!`,
          [{ text: 'OK', onPress: fetchData }]
        );
        setDepositAmount('');
      } else {
        Alert.alert('Error', res.error || 'Deposit failed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Deposit failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!borrowAmount || parseFloat(borrowAmount) <= 0) {
      Alert.alert('Error', 'Enter a valid amount');
      return;
    }

    setActionLoading(true);
    try {
      const res = await api.borrow(vault_id, borrowAsset, borrowAmount);

      if (res.success) {
        Alert.alert(
          '✅ Borrow Successful!',
          `Borrowed ${borrowAmount} ${borrowAsset}\n\nHealth Factor: ${res.health_factor?.toFixed(2) || 'N/A'}\nInterest: ${res.interest_rate || 5.2}% APY`,
          [{ text: 'OK', onPress: fetchData }]
        );
        setBorrowAmount('');
      } else {
        Alert.alert('Borrow Denied', res.message || 'Insufficient collateral');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Borrow failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRepay = async (asset: string, amount: number) => {
    Alert.alert(
      'Confirm Repayment',
      `Repay ${amount} ${asset}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Repay',
          onPress: async () => {
            setActionLoading(true);
            try {
              const res = await api.repayLoan(vault_id, asset, amount);

              if (res.success) {
                Alert.alert('✅ Repaid!', `Remaining debt: ${res.remaining_debt || 0} ${asset}`);
                fetchData();
              } else {
                Alert.alert('Error', res.error || 'Repay failed');
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Repay failed');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleWithdraw = async (asset: string, amount: number) => {
    Alert.alert(
      'Confirm Withdrawal',
      `Withdraw ${amount} ${asset}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw',
          onPress: async () => {
            setActionLoading(true);
            try {
              const res = await api.withdrawCollateral(vault_id, asset, amount);

              if (res.success) {
                Alert.alert('✅ Withdrawn!', `${amount} ${asset} returned to your wallet`);
                fetchData();
              } else {
                Alert.alert('Error', res.error || 'Withdrawal not allowed - check your LTV');
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Withdraw failed');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  // Health factor helpers
  const getHealthColor = (health: number) => {
    if (health >= 2) return '#22c55e';
    if (health >= 1.5) return '#84cc16';
    if (health >= 1.2) return '#eab308';
    if (health >= 1) return '#f97316';
    return '#ef4444';
  };

  const getHealthEmoji = (health: number) => {
    if (health >= 2) return '♥♥♥♥♥';
    if (health >= 1.5) return '♥♥♥♥';
    if (health >= 1.2) return '♥♥♥';
    if (health >= 1) return '♥♥';
    return '♥';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8b5cf6" />
          <Text style={styles.loadingText}>Loading lending data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🏦 Private Lending</Text>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyBanner}>
          <Text style={styles.privacyIcon}>🔒</Text>
          <Text style={styles.privacyText}>
            Your position is encrypted in Arcium MXE.{'\n'}
            Only YOU can see your collateral and health!
          </Text>
        </View>

        {/* Pool Info */}
        {poolInfo && (
          <View style={styles.poolCard}>
            <Text style={styles.poolTitle}>Pool Info (Public)</Text>
            <View style={styles.poolRow}>
              <Text style={styles.poolLabel}>Interest Rate:</Text>
              <Text style={styles.poolValue}>{poolInfo.currentInterestRate}% APY</Text>
            </View>
            <View style={styles.poolRow}>
              <Text style={styles.poolLabel}>Max LTV:</Text>
              <Text style={styles.poolValue}>{poolInfo.maxLTV}%</Text>
            </View>
            <View style={styles.poolRow}>
              <Text style={styles.poolLabel}>Liquidation LTV:</Text>
              <Text style={styles.poolValue}>{poolInfo.liquidationLTV}%</Text>
            </View>
            <View style={styles.poolRow}>
              <Text style={styles.poolLabel}>Active Loans:</Text>
              <Text style={styles.poolValue}>{poolInfo.activeLoans}</Text>
            </View>
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['position', 'deposit', 'borrow'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab === 'position' ? '📊 Position' : tab === 'deposit' ? '💰 Deposit' : '💳 Borrow'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Position Tab */}
        {activeTab === 'position' && (
          <View style={styles.content}>
            {position ? (
              <>
                {/* Health Factor */}
                <View style={[styles.healthCard, { borderColor: getHealthColor(position.health_factor) }]}>
                  <Text style={styles.healthTitle}>Health Factor</Text>
                  <Text style={[styles.healthValue, { color: getHealthColor(position.health_factor) }]}>
                    {position.health_factor.toFixed(2)}
                  </Text>
                  <Text style={styles.healthEmoji}>{getHealthEmoji(position.health_factor)}</Text>
                  <Text style={styles.healthStatus}>{position.status}</Text>
                  <Text style={styles.ltvText}>LTV: {position.ltv}%</Text>
                </View>

                {/* Collateral */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>🔐 Collateral (Private)</Text>
                  {Object.entries(position.collateral).map(([asset, data]) => (
                    <View key={asset} style={styles.assetRow}>
                      <Text style={styles.assetName}>{asset}</Text>
                      <View style={styles.assetActions}>
                        <Text style={styles.assetAmount}>{data.amount}</Text>
                        <TouchableOpacity
                          style={styles.withdrawButton}
                          onPress={() => handleWithdraw(asset, data.amount)}
                        >
                          <Text style={styles.withdrawButtonText}>Withdraw</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                  {Object.keys(position.collateral).length === 0 && (
                    <Text style={styles.emptyText}>No collateral deposited</Text>
                  )}
                </View>

                {/* Borrowed */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>💳 Borrowed (Private)</Text>
                  {Object.entries(position.borrowed).map(([asset, data]) => (
                    <View key={asset} style={styles.assetRow}>
                      <Text style={styles.assetName}>{asset}</Text>
                      <View style={styles.assetActions}>
                        <Text style={styles.assetAmount}>{data.amount}</Text>
                        <TouchableOpacity
                          style={styles.repayButton}
                          onPress={() => handleRepay(asset, data.amount)}
                        >
                          <Text style={styles.repayButtonText}>Repay</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                  {Object.keys(position.borrowed).length === 0 && (
                    <Text style={styles.emptyText}>No active loans</Text>
                  )}
                </View>

                {/* Warning */}
                {position.health_factor < 1.2 && (
                  <View style={styles.warningCard}>
                    <Text style={styles.warningTitle}>⚠️ Position at Risk!</Text>
                    <Text style={styles.warningText}>
                      Consider adding collateral or repaying debt to avoid liquidation.
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <View style={styles.noPosition}>
                <Text style={styles.noPositionEmoji}>🏦</Text>
                <Text style={styles.noPositionTitle}>No Lending Position</Text>
                <Text style={styles.noPositionText}>
                  Deposit collateral to start borrowing privately
                </Text>
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() => setActiveTab('deposit')}
                >
                  <Text style={styles.startButtonText}>Deposit Collateral →</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Deposit Tab */}
        {activeTab === 'deposit' && (
          <View style={styles.content}>
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Deposit Collateral</Text>

              <Text style={styles.inputLabel}>Asset</Text>
              <View style={styles.assetSelector}>
                {['SOL', 'ZEC', 'ETH'].map((asset) => (
                  <TouchableOpacity
                    key={asset}
                    style={[styles.assetOption, depositAsset === asset && styles.assetOptionActive]}
                    onPress={() => setDepositAsset(asset)}
                  >
                    <Text style={[styles.assetOptionText, depositAsset === asset && styles.assetOptionTextActive]}>
                      {asset}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Amount</Text>
              <TextInput
                style={styles.input}
                value={depositAmount}
                onChangeText={setDepositAmount}
                placeholder="0.00"
                placeholderTextColor="#6b7280"
                keyboardType="decimal-pad"
              />

              <TouchableOpacity
                style={[styles.actionButton, actionLoading && styles.actionButtonDisabled]}
                onPress={handleDeposit}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.actionButtonText}>🔒 Deposit (Encrypted)</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.formNote}>
                Your collateral amount will be encrypted in Arcium MXE.{'\n'}
                No one can see how much you deposited!
              </Text>
            </View>
          </View>
        )}

        {/* Borrow Tab */}
        {activeTab === 'borrow' && (
          <View style={styles.content}>
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Borrow Against Collateral</Text>

              <Text style={styles.inputLabel}>Asset to Borrow</Text>
              <View style={styles.assetSelector}>
                {['USDC', 'SOL'].map((asset) => (
                  <TouchableOpacity
                    key={asset}
                    style={[styles.assetOption, borrowAsset === asset && styles.assetOptionActive]}
                    onPress={() => setBorrowAsset(asset)}
                  >
                    <Text style={[styles.assetOptionText, borrowAsset === asset && styles.assetOptionTextActive]}>
                      {asset}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Amount</Text>
              <TextInput
                style={styles.input}
                value={borrowAmount}
                onChangeText={setBorrowAmount}
                placeholder="0.00"
                placeholderTextColor="#6b7280"
                keyboardType="decimal-pad"
              />

              {position && (
                <View style={styles.borrowInfo}>
                  <Text style={styles.borrowInfoText}>
                    Current Health: {position.health_factor.toFixed(2)}
                  </Text>
                  <Text style={styles.borrowInfoText}>
                    Max LTV: {poolInfo?.maxLTV || 75}%
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.actionButton, (actionLoading || !position) && styles.actionButtonDisabled]}
                onPress={handleBorrow}
                disabled={actionLoading || !position}
              >
                {actionLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.actionButtonText}>💳 Borrow</Text>
                )}
              </TouchableOpacity>

              {!position && (
                <Text style={styles.formWarning}>
                  ⚠️ Deposit collateral first before borrowing
                </Text>
              )}

              <Text style={styles.formNote}>
                Your borrow amount and health factor are private.{'\n'}
                Only you can see your position!
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#9ca3af',
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  backButton: {
    color: '#8b5cf6',
    fontSize: 16,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  privacyBanner: {
    backgroundColor: '#1e1b4b',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#4c1d95',
  },
  privacyIcon: {
    fontSize: 24,
  },
  privacyText: {
    color: '#c4b5fd',
    fontSize: 12,
    flex: 1,
  },
  poolCard: {
    backgroundColor: '#1E293B',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  poolTitle: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 12,
  },
  poolRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  poolLabel: {
    color: '#6b7280',
  },
  poolValue: {
    color: '#fff',
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#1E293B',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#8b5cf6',
  },
  tabText: {
    color: '#9ca3af',
    fontSize: 12,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  healthCard: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 16,
  },
  healthTitle: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 8,
  },
  healthValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  healthEmoji: {
    fontSize: 24,
    marginVertical: 8,
  },
  healthStatus: {
    color: '#fff',
    fontWeight: '600',
  },
  ltvText: {
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  assetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  assetName: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  assetAmount: {
    color: '#22c55e',
    fontWeight: '600',
    fontSize: 16,
  },
  assetActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  repayButton: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  repayButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  withdrawButton: {
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  withdrawButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    color: '#6b7280',
    textAlign: 'center',
    paddingVertical: 16,
  },
  warningCard: {
    backgroundColor: '#451a03',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f97316',
  },
  warningTitle: {
    color: '#f97316',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  warningText: {
    color: '#fed7aa',
  },
  noPosition: {
    alignItems: 'center',
    padding: 32,
  },
  noPositionEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  noPositionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noPositionText: {
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  formCard: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 16,
  },
  formTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputLabel: {
    color: '#9ca3af',
    marginBottom: 8,
  },
  assetSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  assetOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#374151',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  assetOptionActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#8b5cf6',
  },
  assetOptionText: {
    color: '#9ca3af',
    fontWeight: '600',
  },
  assetOptionTextActive: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 16,
    color: '#fff',
    fontSize: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  borrowInfo: {
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  borrowInfoText: {
    color: '#9ca3af',
    marginBottom: 4,
  },
  actionButton: {
    backgroundColor: '#8b5cf6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formNote: {
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  formWarning: {
    color: '#f97316',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
  },
});

export default LendingScreen;