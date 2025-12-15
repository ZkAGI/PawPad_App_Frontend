
/**
 * HomeScreen - Fixed with correct hooks order
 * 
 * CRITICAL: All hooks MUST be called before any conditional returns!
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, VaultData, isUnifiedVault } from '../types/navigation';
import { useVaults } from '../context/VaultContext';
import api from '../services/api';
import Clipboard from '@react-native-clipboard/clipboard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type RouteType = RouteProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  // ═══════════════════════════════════════════════════════════════
  // ALL HOOKS MUST BE AT THE TOP
  // ═══════════════════════════════════════════════════════════════
  
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { activeVault, vaults, isLoading: contextLoading } = useVaults();
  
  // State hooks
  const [refreshing, setRefreshing] = useState(false);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [solUsd, setSolUsd] = useState<number>(0);
  const [zecBalance, setZecBalance] = useState<number>(0);
  const [zecUsd, setZecUsd] = useState<number>(0);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [copied, setCopied] = useState(false);

  // Get vault from route params or context
  const routeVault = route.params?.vault;
  const vault: VaultData | null = routeVault || (activeVault as VaultData | null);

  const isSeedless = vault?.wallet_type === 'seedless';

  // Check if unified vault
  const unified = vault ? isUnifiedVault(vault) : false;
  
  // Determine wallet type
 // const hasSol = vault?.chain === 'SOL' || vault?.sol?.address || unified;
 // const hasZec = vault?.chain === 'ZEC' || vault?.zec?.address || vault?.zec?.unified_address || vault?.zec?.transparent_address || unified;

 const hasSol = !isSeedless && (vault?.chain === 'SOL' || vault?.sol?.address || vault?.chain === 'unified');
const hasZec = isSeedless || vault?.chain === 'ZEC' || vault?.zec?.address || vault?.zec?.unified_address || vault?.zec?.transparent_address || vault?.chain === 'unified';
  // Load balances callback
  const loadBalances = useCallback(async () => {
    if (!vault) return;
    
    setLoadingBalance(true);
    
    // Reset balances first to avoid stale data
    setSolBalance(0);
    setSolUsd(0);
    setZecBalance(0);
    setZecUsd(0);
    
    try {
      // Load SOL balance if wallet has SOL
      if (hasSol) {
        const address = vault.sol?.address || vault.address;
        if (address) {
          try {
            const response = await api.getSolBalance(address);
            const bal = response.sol || response.balance || 0;
            const usd = response.usd || bal * 200;
            setSolBalance(bal);
            setSolUsd(usd);
          } catch (err) {
            console.log('SOL balance error:', err);
          }
        }
      }
      
      // Load ZEC balance if wallet has ZEC
      // if (hasZec && vault.zec?.address) {
      if (hasZec && (vault.zec?.address || vault.zec?.unified_address)) {
  const zecAddress = vault.zec?.unified_address || vault.zec?.address;
        try {
          //const response = await api.getZecBalance(vault.zec.address);
          const response = await api.getZecBalance(zecAddress!);
          const bal = response.shielded_balance || response.balance || response.total_zec || 0;
          const usd = response.usd || bal * 40;
          setZecBalance(bal);
          setZecUsd(usd);
        } catch (err) {
          console.log('ZEC balance error:', err);
        }
      }
    } catch (error) {
      console.log('Balance fetch error:', error);
    } finally {
      setLoadingBalance(false);
    }
  }, [vault, hasSol, hasZec]);

  // Load on focus
  useFocusEffect(
    useCallback(() => {
      if (vault) {
        loadBalances();
      }
    }, [vault, loadBalances])
  );

  // ═══════════════════════════════════════════════════════════════
  // HELPER FUNCTIONS
  // ═══════════════════════════════════════════════════════════════

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBalances();
    setRefreshing(false);
  };

  // const copyAddress = () => {
  //   const address = vault?.sol?.address || vault?.address;
  //   if (!address) return;
  //   Clipboard.setString(address);
  //   setCopied(true);
  //   setTimeout(() => setCopied(false), 2000);
  // };
  const copyAddress = () => {
  const address = isSeedless 
    ? (vault?.zec?.address || vault?.publicKey)
    : (vault?.sol?.address || vault?.address);
  if (!address) return;
  Clipboard.setString(address);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};

  const formatAddress = (address: string | undefined) => {
    if (!address) return 'No address';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const safeToFixed = (value: number | undefined | null, decimals: number = 2): string => {
    if (value === undefined || value === null || isNaN(value)) {
      return '0.00';
    }
    return value.toFixed(decimals);
  };

  // Calculate total - only include balances that actually exist
  const totalUsd = (hasSol ? solUsd : 0) + (hasZec ? zecUsd : 0);

  // ═══════════════════════════════════════════════════════════════
  // RENDER - No vault state
  // ═══════════════════════════════════════════════════════════════

  if (!vault && !contextLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🔐</Text>
            <Text style={styles.emptyTitle}>No Wallet Found</Text>
            <Text style={styles.emptyText}>Create a wallet to get started</Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('ChainSelection')}
            >
              <Text style={styles.primaryButtonText}>Create Wallet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Recovery')}
            >
              <Text style={styles.secondaryButtonText}>Recover Wallet</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (contextLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ECDC4" />
          <Text style={styles.loadingText}>Loading wallet...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // MAIN RENDER - Phantom Style
  // ═══════════════════════════════════════════════════════════════
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4ECDC4" />
        }
      >
        {/* Header with wallet name and copy button */}
        {/* <View style={styles.header}>
          <View style={styles.walletNameRow}>
            <Text style={styles.walletName}>{vault?.vault_name || 'My Wallet'}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={copyAddress}>
              <Text style={styles.copyIcon}>{copied ? '✓' : '📋'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.addressText}>
            {formatAddress(vault?.sol?.address || vault?.address)}
          </Text>
        </View> */}
        <View style={styles.header}>
          <View style={styles.walletNameRow}>
            <Text style={styles.walletName}>{vault?.vault_name || 'My Wallet'}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={copyAddress}>
              <Text style={styles.copyIcon}>{copied ? '✓' : '📋'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.addressText}>
            {isSeedless 
              ? formatAddress(vault?.zec?.address || vault?.publicKey)
              : formatAddress(vault?.sol?.address || vault?.address)
            }
          </Text>
        </View>

        {/* Total Balance - Big centered */}
        <View style={styles.balanceSection}>
          {loadingBalance ? (
            <ActivityIndicator color="#FFFFFF" size="large" />
          ) : (
            <>
              <Text style={styles.totalBalance}>${safeToFixed(totalUsd, 2)}</Text>
              <Text style={styles.balanceHint}>
                {totalUsd === 0 ? 'Fund your wallet to get started' : 'Pull down to refresh'}
              </Text>
            </>
          )}
        </View>

        {/* Action Buttons Row - Phantom Style */}
        <View style={styles.actionRow}>
          {/* <TouchableOpacity
            style={styles.actionItem}
            onPress={() => vault && navigation.navigate('Receive', { vault, chain: 'SOL' })}
          >
            <View style={styles.actionIconBg}>
              <Text style={styles.actionIcon}>📥</Text>
            </View>
            <Text style={styles.actionLabel}>Receive</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => vault && navigation.navigate('Send', { vault, chain: 'SOL' })}
          >
            <View style={styles.actionIconBg}>
              <Text style={styles.actionIcon}>📤</Text>
            </View>
            <Text style={styles.actionLabel}>Send</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('Swap', { vault: vault || undefined })}
          >
            <View style={styles.actionIconBg}>
              <Text style={styles.actionIcon}>🔄</Text>
            </View>
            <Text style={styles.actionLabel}>Swap</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('FundWallet', { vault: vault || undefined })}
          >
            <View style={styles.actionIconBg}>
              <Text style={styles.actionIcon}>💵</Text>
            </View>
            <Text style={styles.actionLabel}>Buy</Text>
          </TouchableOpacity>
        </View>

        {/* Tokens Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tokens</Text>
        </View>

        {/* Token List - Phantom Style */}
        <View style={styles.tokenList}>
          {/* SOL Token Row */}
          {hasSol && (
            <TouchableOpacity style={styles.tokenRow}>
              <View style={styles.tokenIcon}>
                <View style={styles.solIcon}>
                  <Text style={styles.tokenIconText}>◎</Text>
                </View>
              </View>
              <View style={styles.tokenInfo}>
                <Text style={styles.tokenName}>Solana</Text>
                <Text style={styles.tokenBalance}>{safeToFixed(solBalance, 4)} SOL</Text>
              </View>
              <View style={styles.tokenValue}>
                <Text style={styles.tokenUsd}>${safeToFixed(solUsd, 2)}</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* ZEC Token Row - Only show if wallet has ZEC */}
          {/* {hasZec && vault?.zec?.address && ( */}
          {hasZec && (vault?.zec?.address || vault?.zec?.unified_address) && (
            <TouchableOpacity style={styles.tokenRow}>
              <View style={styles.tokenIcon}>
                <View style={styles.zecIcon}>
                  <Text style={styles.tokenIconTextDark}>Z</Text>
                </View>
              </View>
              <View style={styles.tokenInfo}>
                <Text style={styles.tokenName}>Zcash</Text>
                <Text style={styles.tokenBalance}>{safeToFixed(zecBalance, 4)} ZEC</Text>
              </View>
              <View style={styles.tokenValue}>
                <Text style={styles.tokenUsd}>${safeToFixed(zecUsd, 2)}</Text>
                <View style={styles.shieldedTag}>
                  <Text style={styles.shieldedTagText}>🔒 Shielded</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}

          {/* Empty state if no tokens */}
          {!hasSol && !hasZec && (
            <View style={styles.emptyTokens}>
              <Text style={styles.emptyTokensText}>No tokens yet</Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}

        {vault && (
          <>
            {/* Feature Cards - Vertical Stack */}
            {!isSeedless && (
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => navigation.navigate('DarkPool', { vault_id: vault.vault_id, vault })}
              >
                <Text style={styles.quickActionEmoji}>🏊</Text>
                <View style={styles.quickActionInfo}>
                  <Text style={styles.quickActionTitle}>Dark Pool Trading</Text>
                  <Text style={styles.quickActionDesc}>MEV-protected encrypted orders</Text>
                </View>
                <Text style={styles.quickActionArrow}>→</Text>
              </TouchableOpacity>
            )}

            {!isSeedless && (
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => navigation.navigate('Lending', { vault_id: vault.vault_id, vault })}
              >
                <Text style={styles.quickActionEmoji}>🏦</Text>
                <View style={styles.quickActionInfo}>
                  <Text style={styles.quickActionTitle}>Private Lending</Text>
                  <Text style={styles.quickActionDesc}>Borrow with Arcium privacy</Text>
                </View>
                <Text style={styles.quickActionArrow}>→</Text>
              </TouchableOpacity>
            )}

            {/* AI Trading Agent - Show for ALL wallet types */}
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('AgentDashboard', { vault })}
            >
              <Text style={styles.quickActionEmoji}>🤖</Text>
              <View style={styles.quickActionInfo}>
                <Text style={styles.quickActionTitle}>AI Trading Agent</Text>
                <Text style={styles.quickActionDesc}>Auto-trade with Zynapse signals</Text>
              </View>
              <Text style={styles.quickActionArrow}>→</Text>
            </TouchableOpacity>

            {!isSeedless && (
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => navigation.navigate('Backup', { vault })}
              >
                <Text style={styles.quickActionEmoji}>🔐</Text>
                <View style={styles.quickActionInfo}>
                  <Text style={styles.quickActionTitle}>Backup & Recovery</Text>
                  <Text style={styles.quickActionDesc}>Secure your wallet</Text>
                </View>
                <Text style={styles.quickActionArrow}>→</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {/* {vault && (
          <>
           
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('DarkPool', { vault_id: vault.vault_id, vault })}
            >
              <Text style={styles.quickActionEmoji}>🏊</Text>
              <View style={styles.quickActionInfo}>
                <Text style={styles.quickActionTitle}>Dark Pool Trading</Text>
                <Text style={styles.quickActionDesc}>MEV-protected encrypted orders</Text>
              </View>
              <Text style={styles.quickActionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('Lending', { vault_id: vault.vault_id, vault })}
            >
              <Text style={styles.quickActionEmoji}>🏦</Text>
              <View style={styles.quickActionInfo}>
                <Text style={styles.quickActionTitle}>Private Lending</Text>
                <Text style={styles.quickActionDesc}>Borrow with Arcium privacy</Text>
              </View>
              <Text style={styles.quickActionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('AgentDashboard', { vault })}
            >
              <Text style={styles.quickActionEmoji}>🤖</Text>
              <View style={styles.quickActionInfo}>
                <Text style={styles.quickActionTitle}>AI Trading Agent</Text>
                <Text style={styles.quickActionDesc}>Auto-trade with Zynapse signals</Text>
              </View>
              <Text style={styles.quickActionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('Backup', { vault })}
            >
              <Text style={styles.quickActionEmoji}>🔐</Text>
              <View style={styles.quickActionInfo}>
                <Text style={styles.quickActionTitle}>Backup & Recovery</Text>
                <Text style={styles.quickActionDesc}>Secure your wallet</Text>
              </View>
              <Text style={styles.quickActionArrow}>→</Text>
            </TouchableOpacity>
          </>
        )} */}


        {/* Security Footer */}

        <View style={styles.securityFooter}>
          <Text style={styles.securityText}>
            {isSeedless 
              ? '🔐 Secured by Oasis TEE • TOTP Protected'
              : '🔐 Secured by Arcium MPC • No seed phrase'
            }
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#9CA3AF',
    marginTop: 12,
    fontSize: 14,
  },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  walletNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  walletName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  copyButton: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 8,
  },
  copyIcon: {
    fontSize: 14,
  },
  addressText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },

  // Balance Section
  balanceSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  totalBalance: {
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  balanceHint: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },

  // Action Row - Phantom Style
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  actionItem: {
    alignItems: 'center',
  },
  actionIconBg: {
    width: 56,
    height: 56,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Token List
  tokenList: {
    gap: 8,
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
  },
  tokenIcon: {
    marginRight: 12,
  },
  solIcon: {
    width: 44,
    height: 44,
    backgroundColor: '#9945FF',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zecIcon: {
    width: 44,
    height: 44,
    backgroundColor: '#F4B728',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenIconText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  tokenIconTextDark: {
    fontSize: 20,
    color: '#000000',
    fontWeight: 'bold',
  },
  tokenInfo: {
    flex: 1,
  },
  tokenName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 2,
  },
  tokenBalance: {
    fontSize: 14,
    color: '#6B7280',
  },
  tokenValue: {
    alignItems: 'flex-end',
  },
  tokenUsd: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  shieldedTag: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  shieldedTagText: {
    fontSize: 10,
    color: '#10B981',
  },
  emptyTokens: {
    padding: 40,
    alignItems: 'center',
  },
  emptyTokensText: {
    color: '#6B7280',
    fontSize: 14,
  },

  // Quick Actions
  quickActions: {
    marginTop: 24,
    gap: 12,
  },
 quickActionCard: {
  backgroundColor: '#1E293B',
  marginHorizontal: 16,
  // marginBottom: 12,
  marginTop: 12,
  padding: 16,
  borderRadius: 12,
  flexDirection: 'row',
  alignItems: 'center',
},
quickActionEmoji: {
  fontSize: 28,
  marginRight: 12,
},
quickActionInfo: {
  flex: 1,
},
quickActionTitle: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: '600',
},
quickActionDesc: {
  color: '#6B7280',
  fontSize: 12,
  marginTop: 2,
},
quickActionArrow: {
  color: '#4ECDC4',
  fontSize: 20,
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

  // Empty State
  emptyCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 24,
    padding: 40,
    marginTop: 60,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  featureButton: {
  backgroundColor: '#1E293B',
  padding: 16,
  borderRadius: 12,
  alignItems: 'center',
  flex: 1,
  marginHorizontal: 4,
},
featureIcon: {
  fontSize: 28,
  marginBottom: 8,
},
featureTitle: {
  color: '#FFFFFF',
  fontSize: 12,
  fontWeight: '600',
},
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 24,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;