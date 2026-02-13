import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, VaultData, isTEEVault, getTEEAddresses } from '../types/navigation';
import LinearGradient from 'react-native-linear-gradient';
import api from '../services/api';
import { 
  setTradeConfig, 
  getTradeConfig,
  getTradeHistory, 
  getAllBalances,
  getSessionToken,
  ensureSessionLoaded,
} from '../services/teeSevice';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Custom PNG icons
const ICONS = {
  solana: require('../assets/icons/solana.png'),
  ethereum: require('../assets/icons/ethereum.png'),
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type AgentDashboardRouteProp = RouteProp<RootStackParamList, 'AgentDashboard'>;

// ════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════

interface Signal {
  asset: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  price?: number;
  indicators: {
    rsi: number;
    macd: string;
    ema_trend: string;
  };
}

interface TEETradeConfig {
  tradingEnabled: boolean;
  maxTradeAmountUsdc: number;
  allowedAssets: string[];
}

// ════════════════════════════════════════════════════════════════════════════
// COLORS
// ════════════════════════════════════════════════════════════════════════════

const COLORS = {
  bgPrimary: '#02111B',
  bgSecondary: '#061624',
  bgCard: '#0D2137',
  accent: '#33E6BF',
  accentBlue: '#2A5298',
  textPrimary: '#FFFFFF',
  textSecondary: '#8A9BAE',
  textMuted: '#5A6B7E',
  border: 'rgba(42, 82, 152, 0.3)',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  solana: '#9945FF',
  ethereum: '#627EEA',
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════

const AgentDashboardScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AgentDashboardRouteProp>();
  const { vault, agent: passedAgent } = route.params;

  // Detect TEE wallet
  const isTEE = vault ? isTEEVault(vault) : false;
  const teeAddresses = vault ? getTEEAddresses(vault) : { evm: null, solana: null };

  // State
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [agent, setAgent] = useState<any>(passedAgent || null);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [autoTradeEnabled, setAutoTradeEnabled] = useState(false);
  
  // TEE-specific state - FETCHED FROM BACKEND
  const [teeConfig, setTeeConfig] = useState<TEETradeConfig | null>(null);
  const [teeConfigLoading, setTeeConfigLoading] = useState(false);
  
  // Balances
  const [solBalance, setSolBalance] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);

  // Stats
  const [stats, setStats] = useState({
    trades: 0,
    pnl: 0,
    winRate: 0,
    secured: 0,
  });

  const [tradeHistory, setTradeHistory] = useState<any[]>([]);

  // ══════════════════════════════════════════════════════════════════════════
  // FETCH TEE TRADE CONFIG FROM BACKEND
  // Only fetch once, with proper guards to prevent infinite loops
  // ══════════════════════════════════════════════════════════════════════════
  const [configFetched, setConfigFetched] = useState(false);
  
  const fetchTEEConfig = async () => {
    // Guard: Only fetch for TEE wallets
    if (!isTEE) return;
    
    // Guard: Don't fetch if already fetched
    if (configFetched) return;
    
    // Guard: Don't fetch if already loading
    if (teeConfigLoading) return;
    
    setTeeConfigLoading(true);
    try {
      // FIRST: Check if we have agent data with preferences (most reliable)
      // This comes from MongoDB and was set during agent creation
      if (passedAgent) {
        const agentAny = passedAgent as any;
        const prefs = agentAny.preferences || passedAgent.preferences;
        
        if (prefs) {
          console.log('[TEE Config] Using agent preferences:', prefs);
          setTeeConfig({
            tradingEnabled: true, // Agent exists = trading enabled
            maxTradeAmountUsdc: prefs.max_position_size || prefs.maxPositionSize || 100,
            allowedAssets: prefs.trading_pairs || prefs.tradingPairs || ['SOL', 'ETH'],
          });
          setAutoTradeEnabled(true);
          setConfigFetched(true);
          setTeeConfigLoading(false);
          return;
        }
      }
      
      // FALLBACK: Try to fetch from TEE backend
      await ensureSessionLoaded();
      
      const token = getSessionToken();
      if (!token) {
        console.log('[TEE Config] No session, using defaults');
        setTeeConfig({
          tradingEnabled: false,
          maxTradeAmountUsdc: 100,
          allowedAssets: ['SOL', 'ETH'],
        });
        setConfigFetched(true);
        setTeeConfigLoading(false);
        return;
      }

      // Fetch current config from TEE backend
      const response = await getTradeConfig();
      
      // Only use backend response if it has real data (not defaults)
      if (response.ok && response.config && response.config.uid) {
        console.log('[TEE Config] Fetched from backend:', response.config);
        setTeeConfig({
          tradingEnabled: response.config.tradingEnabled,
          maxTradeAmountUsdc: response.config.maxTradeAmountUsdc,
          allowedAssets: response.config.allowedAssets || ['SOL', 'ETH'],
        });
        setAutoTradeEnabled(response.config.tradingEnabled);
      } else {
        // Backend returned defaults (404), check if we have agent in DB
        console.log('[TEE Config] Backend returned defaults, checking agent...');
        
        // Try to load agent from DB
        const vaultId = vault?.tee?.uid || vault?.vault_id;
        if (vaultId) {
          try {
            const agentResponse = await api.getAgentForVault(vaultId);
            if (agentResponse.success && agentResponse.agent?.preferences) {
              const prefs = agentResponse.agent.preferences;
              console.log('[TEE Config] Using agent DB preferences:', prefs);
              setTeeConfig({
                tradingEnabled: true,
                maxTradeAmountUsdc: prefs.max_position_size || 100,
                allowedAssets: prefs.trading_pairs || ['SOL', 'ETH'],
              });
              setAutoTradeEnabled(true);
              setConfigFetched(true);
              setTeeConfigLoading(false);
              return;
            }
          } catch (err) {
            console.log('[TEE Config] Agent fetch failed:', err);
          }
        }
        
        // Final fallback
        setTeeConfig({
          tradingEnabled: false,
          maxTradeAmountUsdc: 100,
          allowedAssets: ['SOL', 'ETH'],
        });
      }
      setConfigFetched(true);
    } catch (error) {
      console.error('[TEE Config] Fetch error:', error);
      // Use defaults on error - don't keep retrying
      setTeeConfig({
        tradingEnabled: false,
        maxTradeAmountUsdc: 100,
        allowedAssets: ['SOL', 'ETH'],
      });
      setConfigFetched(true);
    } finally {
      setTeeConfigLoading(false);
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // LOAD DATA - Called once on mount
  // ══════════════════════════════════════════════════════════════════════════
  const [dataLoaded, setDataLoaded] = useState(false);
  
  const loadData = async () => {
    // Guard: Don't load if already loaded (except for refresh)
    if (loading && dataLoaded) return;
    
    setLoading(true);
    
    try {
      // Fetch TEE config (has internal guards)
      if (isTEE) {
        await fetchTEEConfig();
      }

      // Load balances for TEE wallet - only once
      if (isTEE && (teeAddresses.solana || teeAddresses.evm) && !dataLoaded) {
        try {
          const balances = await getAllBalances(teeAddresses.solana, teeAddresses.evm);
          if (balances.solana) {
            setSolBalance(balances.solana.sol);
          }
          if (balances.evm) {
            setEthBalance(balances.evm.eth);
          }
        } catch (err) {
          console.log('[Balance] Error:', err);
        }
      }

      // Fetch trade history from TEE API
      if (isTEE && !dataLoaded) {
        try {
          await ensureSessionLoaded();
          const token = getSessionToken();
          if (token) {
            const historyResponse = await getTradeHistory();
            if (historyResponse.ok && historyResponse.history) {
              const trades = historyResponse.history;
              setTradeHistory(trades);
              
              const successTrades = trades.filter((t: any) => t.status === 'success');
              
              // Calculate P&L from successful BUY/SELL pairs
              let totalPnl = 0;
              const buyTrades = trades.filter((t: any) => t.action === 'BUY' && t.status === 'success');
              const sellTrades = trades.filter((t: any) => t.action === 'SELL' && t.status === 'success');
              
              // Match buy/sell pairs by asset chronologically
              const buysByAsset: { [key: string]: any[] } = {};
              buyTrades.forEach((t: any) => {
                if (!buysByAsset[t.asset]) buysByAsset[t.asset] = [];
                buysByAsset[t.asset].push({ ...t });
              });
              
              sellTrades.forEach((sell: any) => {
                const buys = buysByAsset[sell.asset];
                if (buys && buys.length > 0) {
                  const buy = buys.shift(); // FIFO matching
                  const buyAmount = parseFloat(buy.amountIn) || 0;
                  const sellAmount = parseFloat(sell.amountIn) || 0;
                  const amount = Math.min(buyAmount, sellAmount);
                  
                  if (buy.signalPrice && sell.signalPrice) {
                    // P&L = (sell price - buy price) * (USDC amount / buy price)
                    const tokens = amount / buy.signalPrice;
                    const pnl = tokens * (sell.signalPrice - buy.signalPrice);
                    totalPnl += pnl;
                  }
                }
              });
              
              // Only count BUY/SELL trades for win rate (exclude WITHDRAW)
              const tradingTrades = trades.filter((t: any) => t.action === 'BUY' || t.action === 'SELL');
              const successTradingTrades = tradingTrades.filter((t: any) => t.status === 'success');
              
              setStats({
                trades: successTrades.length,  
                pnl: Math.round(totalPnl * 100) / 100,
                winRate: tradingTrades.length > 0 
                  ? Math.round((successTradingTrades.length / tradingTrades.length) * 100) 
                  : 0,
                secured: trades.length, 
              });
              console.log('[TradeHistory] Loaded', trades.length, 'trades,', successTrades.length, 'successful');
            }
          }
        } catch (err) {
          console.log('[TradeHistory] Fetch error:', err);
        }
      }

      // Fetch signals from Zynapse API directly
      if (!dataLoaded) {
        try {
          console.log('[Signals] Fetching from Zynapse API...');
          const response = await fetch('https://zynapse.zkagi.ai/v1/signals', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'api-key': 'zk-123321',
            },
          });
          
          const data = await response.json();
          console.log('[Signals] Zynapse API Response:', data);
          
          // Response format: { BTC: {...}, ETH: {...}, SOL: {...}, ZEC: {...} }
          // Convert object to array
          let signalsArray: any[] = [];
          
          if (data && typeof data === 'object' && !Array.isArray(data)) {
            // It's an object with asset keys like { SOL: {...}, ETH: {...} }
            signalsArray = Object.values(data);
          } else if (Array.isArray(data)) {
            signalsArray = data;
          } else if (data?.signals) {
            signalsArray = Array.isArray(data.signals) ? data.signals : Object.values(data.signals);
          }
          
          if (signalsArray.length > 0) {
            let formattedSignals: Signal[] = signalsArray
              .filter((s: any) => {
                // TEE wallets only support SOL and ETH
                if (isTEE) {
                  return s.asset === 'SOL' || s.asset === 'ETH';
                }
                return true;
              })
              .map((s: any) => ({
                asset: s.asset,
                signal: (s.signal || 'HOLD') as 'BUY' | 'SELL' | 'HOLD',
                confidence: s.confidence || Math.round(100 - Math.abs(50 - (s.rsi || 50))), // Derive confidence from RSI if not provided
                price: s.price || 0,
                indicators: s.indicators || { 
                  rsi: Math.round(s.rsi || 50), 
                  macd: s.macd_hist > 0 ? 'bullish' : s.macd_hist < 0 ? 'bearish' : 'neutral', 
                  ema_trend: s.price > s.ema20 ? 'up' : s.price < s.ema20 ? 'down' : 'neutral' 
                },
              }));
            
            console.log('[Signals] Formatted signals:', formattedSignals);
            setSignals(formattedSignals);
          } else {
            console.log('[Signals] Empty response from Zynapse');
            setSignals([]);
          }
        } catch (err) {
          console.log('[Signals] Zynapse API error:', err);
          setSignals([]);
        }
      }

      // Load agent from DB if not passed (for non-TEE only)
      if (!isTEE) {
        if (!passedAgent && vault?.vault_id && !dataLoaded) {
          try {
            const agentResponse = await api.getAgentForVault(vault.vault_id);
            if (agentResponse.success && agentResponse.agent) {
              setAgent(agentResponse.agent);
              const agentAny = agentResponse.agent as any;
              setStats({
                trades: agentAny.stats?.trades_executed || 0,
                pnl: agentAny.stats?.total_pnl || 0,
                winRate: agentAny.stats?.win_rate || 0,
                secured: agentAny.stats?.dark_pool_trades || 0,
              });
            }
          } catch (err) {
            console.log('[Agent] Fetch error:', err);
          }
        } else if (passedAgent && !dataLoaded) {
          const agentAny = passedAgent as any;
          setStats({
            trades: agentAny.stats?.trades_executed || passedAgent.performance?.totalTrades || 0,
            pnl: agentAny.stats?.total_pnl || passedAgent.performance?.totalProfit || 0,
            winRate: agentAny.stats?.win_rate || passedAgent.performance?.successRate || 0,
            secured: agentAny.stats?.dark_pool_trades || 0,
          });
        }
      }
      
      setDataLoaded(true);
    } catch (error) {
      console.error('[Dashboard] Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount + auto-refresh signals every 30s
  useEffect(() => {
    if (!dataLoaded) {
      loadData();
    }

    const interval = setInterval(async () => {
      try {
        console.log('[Signals] Auto-refreshing...');
        const response = await fetch('https://zynapse.zkagi.ai/v1/signals', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'api-key': 'zk-123321',
          },
        });
        
        const data = await response.json();
        let signalsArray: any[] = [];
        
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          signalsArray = Object.values(data);
        } else if (Array.isArray(data)) {
          signalsArray = data;
        } else if (data?.signals) {
          signalsArray = Array.isArray(data.signals) ? data.signals : Object.values(data.signals);
        }
        
        if (signalsArray.length > 0) {
          const formattedSignals: Signal[] = signalsArray
            .filter((s: any) => {
              if (isTEE) {
                return s.asset === 'SOL' || s.asset === 'ETH';
              }
              return true;
            })
            .map((s: any) => ({
              asset: s.asset,
              signal: (s.signal || 'HOLD') as 'BUY' | 'SELL' | 'HOLD',
              confidence: s.confidence || Math.round(100 - Math.abs(50 - (s.rsi || 50))),
              price: s.price || 0,
              indicators: s.indicators || {
                rsi: Math.round(s.rsi || 50),
                macd: s.macd_hist > 0 ? 'bullish' : s.macd_hist < 0 ? 'bearish' : 'neutral',
                ema_trend: s.price > s.ema20 ? 'up' : s.price < s.ema20 ? 'down' : 'neutral',
              },
            }));
          
          setSignals(formattedSignals);
          console.log('[Signals] Auto-refreshed:', formattedSignals.length, 'signals');
        }
      } catch (err) {
        console.log('[Signals] Auto-refresh error:', err);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Reset flags to allow fresh fetch
    setConfigFetched(false);
    setDataLoaded(false);
    await loadData();
    setRefreshing(false);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // TOGGLE TRADING (TEE)
  // ══════════════════════════════════════════════════════════════════════════
  const handleToggleTrading = async (enabled: boolean) => {
    if (!isTEE) return;

    try {
      const hasSession = await getSessionToken();
      if (!hasSession) {
        Alert.alert('Session Expired', 'Please login again to change trading settings.');
        return;
      }

      // Update config on TEE backend
      const response = await setTradeConfig({
        tradingEnabled: enabled,
        maxTradeAmountUsdc: teeConfig?.maxTradeAmountUsdc || 100,
        allowedAssets: teeConfig?.allowedAssets || ['SOL', 'ETH'],
      });

      if (response.ok) {
        setAutoTradeEnabled(enabled);
        setTeeConfig(prev => prev ? { ...prev, tradingEnabled: enabled } : null);
        Alert.alert(
          enabled ? '✅ Trading Enabled' : '⏸️ Trading Paused',
          enabled 
            ? 'Your TEE agent will now execute trades automatically.'
            : 'Auto-trading has been paused.'
        );
      } else {
        Alert.alert('Error', 'Failed to update trading settings');
      }
    } catch (error: any) {
      console.error('[Toggle Trading] Error:', error);
      Alert.alert('Error', error.message || 'Failed to update settings');
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // FORMAT HELPERS
  // ══════════════════════════════════════════════════════════════════════════
  const formatAddress = (address: string | null | undefined) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY': return COLORS.success;
      case 'SELL': return COLORS.error;
      default: return COLORS.textMuted;
    }
  };

  const getSignalBg = (signal: string) => {
    switch (signal) {
      case 'BUY': return 'rgba(34, 197, 94, 0.2)';
      case 'SELL': return 'rgba(239, 68, 68, 0.2)';
      default: return 'rgba(107, 114, 128, 0.2)';
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // LOADING STATE
  // ══════════════════════════════════════════════════════════════════════════
  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#1E3A5F', '#0F2744', '#02111B']} style={styles.gradient} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.accent} />
            <Text style={styles.loadingText}>Loading Agent Dashboard...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // EMPTY STATE - No agent
  // ══════════════════════════════════════════════════════════════════════════
  if (!agent && !isTEE) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#1E3A5F', '#0F2744', '#02111B']} style={styles.gradient} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>AI Agent</Text>
            <View style={styles.headerSpacer} />
          </View>
          
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🤖</Text>
            <Text style={styles.emptyTitle}>No AI Agent Yet</Text>
            <Text style={styles.emptyText}>Create an AI agent to automate your trading with MEV-protected execution.</Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => vault && navigation.navigate('AgentSetup', { vault })}
            >
              <Text style={styles.createButtonText}>Create AI Agent</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // MAIN DASHBOARD
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1E3A5F', '#0F2744', '#02111B']} style={styles.gradient} />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.title}>{isTEE ? '🛡️ TEE Agent' : '🤖 AI Agent'}</Text>
              <Text style={styles.subtitle}>
                {isTEE ? 'Oasis TEE Protected' : 'Powered by Zynapse'}
              </Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>

          {/* How It Works - Funding Info */}
          {isTEE && (
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Text style={styles.infoIcon}>💡</Text>
                <Text style={styles.infoTitle}>How Trading Works</Text>
              </View>
              
              <View style={styles.infoSection}>
                <Text style={styles.infoSubtitle}>📥 Fund Your Wallet</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoBullet}>•</Text>
                  <Text style={styles.infoText}>
                    <Text style={styles.infoHighlight}>USDC</Text> - Used to buy SOL/ETH on signals
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoBullet}>•</Text>
                  <Text style={styles.infoText}>
                    <Text style={styles.infoHighlight}>Small SOL</Text> - Gas fees on Solana (~0.01 SOL)
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoBullet}>•</Text>
                  <Text style={styles.infoText}>
                    <Text style={styles.infoHighlight}>Small ETH</Text> - Gas fees on Ethereum (~0.005 ETH)
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoBullet}>•</Text>
                  <Text style={styles.infoText}>
                    <Text style={styles.infoHighlight}>Small ETH</Text> - Gas fees on Ethereum (~0.005 ETH)
                  </Text>
                </View>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoSubtitle}>🔄 Auto Trading Flow</Text>
                <View style={styles.flowRow}>
                  <View style={styles.flowItem}>
                    <Text style={styles.flowLabel}>BUY Signal</Text>
                    <Text style={styles.flowArrow}>USDC → SOL/ETH</Text>
                  </View>
                  <View style={styles.flowItem}>
                    <Text style={styles.flowLabel}>SELL Signal</Text>
                    <Text style={styles.flowArrow}>SOL/ETH → USDC</Text>
                  </View>
                </View>
              </View>

              <View style={styles.infoDex}>
                <Text style={styles.infoDexText}>
                  🔗 SOL trades via <Text style={styles.infoHighlight}>Jupiter</Text> • ETH trades via <Text style={styles.infoHighlight}>Uniswap</Text>
                </Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoSubtitle}>🔄 Auto Trading Flow</Text>
                <View style={styles.flowRow}>
                  <View style={styles.flowItem}>
                    <Text style={styles.flowLabel}>BUY Signal</Text>
                    <Text style={styles.flowArrow}>USDC → SOL/ETH</Text>
                  </View>
                  <View style={styles.flowItem}>
                    <Text style={styles.flowLabel}>SELL Signal</Text>
                    <Text style={styles.flowArrow}>SOL/ETH → USDC</Text>
                  </View>
                </View>
              </View>

              <View style={styles.infoDex}>
                <Text style={styles.infoDexText}>
                  🔗 SOL trades via <Text style={styles.infoHighlight}>Jupiter</Text> • ETH trades via <Text style={styles.infoHighlight}>Uniswap</Text>
                </Text>
              </View>
            </View>
          )}

          {/* Auto Trading Toggle */}
          <View style={styles.toggleCard}>
            <View style={styles.toggleInfo}>
              <View style={[styles.toggleDot, { backgroundColor: autoTradeEnabled ? COLORS.success : COLORS.textMuted }]} />
              <View>
                <Text style={styles.toggleTitle}>Auto Trading</Text>
                <Text style={styles.toggleDesc}>
                  {autoTradeEnabled ? 'Agent will execute trades on signals' : 'Trading is paused'}
                </Text>
              </View>
            </View>
            <Switch
              value={autoTradeEnabled}
              onValueChange={handleToggleTrading}
              trackColor={{ false: '#374151', true: COLORS.accent }}
              thumbColor={autoTradeEnabled ? '#fff' : '#9CA3AF'}
            />
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.trades}</Text>
              <Text style={styles.statLabel}>SUCCESS</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { 
                color: stats.pnl > 0 ? COLORS.success : stats.pnl < 0 ? COLORS.error : COLORS.accent 
              }]}>
                {stats.pnl >= 0 ? '+' : ''}${stats.pnl.toFixed(2)}
              </Text>
              <Text style={styles.statLabel}>P&L</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.winRate}%</Text>
              <Text style={styles.statLabel}>WIN RATE</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.secured}</Text>
              <Text style={styles.statLabel}>EXECUTIONS</Text>
            </View>
          </View>

          {/* Trading Signals */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trading Signals</Text>
            <TouchableOpacity onPress={onRefresh}>
              <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>
          </View>

          {signals.map((signal, index) => (
            <View key={index} style={styles.signalCard}>
              <View style={styles.signalLeft}>
                {signal.asset === 'ETH' ? (
                  <View style={[styles.signalIcon, { backgroundColor: COLORS.ethereum }]}>
                    <Image 
                      source={ICONS.ethereum} 
                      style={styles.signalIconImage}
                      resizeMode="contain"
                    />
                  </View>
                ) : (
                  <LinearGradient
                    colors={['#9945FF', '#14F195']}
                    style={styles.signalIcon}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Image 
                      source={ICONS.solana} 
                      style={styles.signalIconImage}
                      resizeMode="contain"
                    />
                  </LinearGradient>
                )}
                <View>
                  <Text style={styles.signalAsset}>{signal.asset}</Text>
                  <Text style={styles.signalPrice}>${signal.price?.toFixed(2)}</Text>
                </View>
              </View>
              
              <View style={styles.signalMiddle}>
                <Text style={styles.indicatorLabel}>RSI</Text>
                <Text style={styles.indicatorValue}>{signal.indicators.rsi}</Text>
                <Text style={styles.indicatorLabel}>MACD</Text>
                <Text style={styles.indicatorValue}>{signal.indicators.macd}</Text>
              </View>
              
              <View style={styles.signalRight}>
                <View style={[styles.signalBadge, { backgroundColor: getSignalBg(signal.signal) }]}>
                  <Text style={[styles.signalBadgeText, { color: getSignalColor(signal.signal) }]}>
                    {signal.signal}
                  </Text>
                </View>
                <Text style={styles.confidenceText}>{signal.confidence}% conf</Text>
              </View>
            </View>
          ))}

          {/* Recent Trades */}
          {tradeHistory.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Recent Trades ({tradeHistory.length})</Text>
              {tradeHistory.slice(0, 10).map((trade: any, index: number) => (
                <TouchableOpacity
                  key={trade._id || index}
                  style={[
                    styles.tradeCard,
                    { borderLeftColor: trade.status === 'success' ? COLORS.success : trade.status === 'failed' ? COLORS.error : COLORS.warning, borderLeftWidth: 3 }
                  ]}
                  onPress={() => {
                    if (trade.txHash && trade.txHash !== 'failed') {
                      const explorerUrl = trade.chain === 'solana'
                        ? `https://solscan.io/tx/${trade.txHash}`
                        : `https://etherscan.io/tx/${trade.txHash}`;
                      Linking.openURL(explorerUrl);
                    } else {
                      Alert.alert(
                        `${trade.action} ${trade.asset} — Failed`,
                        `Signal Price: $${trade.signalPrice || '—'}\n` +
                        `Amount: ${trade.amountIn || trade.amount || '—'} ${trade.tokenIn || trade.asset}\n` +
                        `Time: ${new Date(trade.timestamp).toLocaleString()}`
                      );
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.tradeLeft}>
                    <View style={[styles.tradeActionBadge, {
                      backgroundColor: trade.action === 'BUY' ? 'rgba(34, 197, 94, 0.2)' :
                        trade.action === 'SELL' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)'
                    }]}>
                      <Text style={[styles.tradeActionText, {
                        color: trade.action === 'BUY' ? COLORS.success :
                          trade.action === 'SELL' ? COLORS.error : '#3B82F6'
                      }]}>
                        {trade.action}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.tradeAsset}>{trade.asset}</Text>
                      <Text style={styles.tradeTime}>
                        {new Date(trade.timestamp).toLocaleDateString()} {new Date(trade.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tradeRight}>
                    <Text style={styles.tradeAmount}>
                      {trade.amountIn} {trade.tokenIn || trade.asset}
                    </Text>
                    <View style={[styles.tradeStatusBadge, {
                      backgroundColor: trade.status === 'success' ? 'rgba(34, 197, 94, 0.15)' :
                        trade.status === 'failed' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)'
                    }]}>
                      <Text style={[styles.tradeStatusText, {
                        color: trade.status === 'success' ? COLORS.success :
                          trade.status === 'failed' ? COLORS.error : COLORS.warning
                      }]}>
                        {trade.status === 'success' ? '✓' : trade.status === 'failed' ? '✗' : '⏳'} {trade.status}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}

          {/* Trade Config - FETCHED FROM TEE BACKEND */}
          <Text style={styles.sectionTitle}>Trade Config</Text>
          <View style={styles.settingsCard}>
            {teeConfigLoading ? (
              <View style={styles.configLoading}>
                <ActivityIndicator size="small" color={COLORS.accent} />
                <Text style={styles.configLoadingText}>Loading config...</Text>
              </View>
            ) : isTEE ? (
              <>
                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Trading</Text>
                  <View style={[
                    styles.settingBadge, 
                    teeConfig?.tradingEnabled ? styles.settingBadgeActive : styles.settingBadgeInactive
                  ]}>
                    <Text style={[
                      styles.settingBadgeText, 
                      { color: teeConfig?.tradingEnabled ? COLORS.success : COLORS.error }
                    ]}>
                      {teeConfig?.tradingEnabled ? 'Enabled' : 'Disabled'}
                    </Text>
                  </View>
                </View>
                <View style={styles.settingDivider} />
                
                {/* MAX TRADE - NOW FROM teeConfig, NOT HARDCODED */}
                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Max Trade (USDC)</Text>
                  <Text style={styles.settingValue}>
                    ${teeConfig?.maxTradeAmountUsdc || 100}
                  </Text>
                </View>
                <View style={styles.settingDivider} />
                
                {/* ALLOWED ASSETS - NOW FROM teeConfig, NOT HARDCODED */}
                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Allowed Assets</Text>
                  <Text style={styles.settingValue}>
                    {teeConfig?.allowedAssets?.join(', ') || 'SOL, ETH'}
                  </Text>
                </View>
                <View style={styles.settingDivider} />
                
                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Security</Text>
                  <Text style={[styles.settingValue, { color: COLORS.accent }]}>🛡️ Oasis TEE</Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Risk Level</Text>
                  <Text style={styles.settingValue}>
                    {agent?.preferences?.risk_level || agent?.preferences?.riskLevel || 'moderate'}
                  </Text>
                </View>
                <View style={styles.settingDivider} />
                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Trading Pairs</Text>
                  <Text style={styles.settingValue}>
                    {agent?.preferences?.trading_pairs?.join(', ') || 
                     agent?.preferences?.favoriteTokens?.join(', ') || 'SOL/USDC'}
                  </Text>
                </View>
                <View style={styles.settingDivider} />
                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Max Trade</Text>
                  <Text style={styles.settingValue}>
                    ${agent?.preferences?.max_position_size || agent?.preferences?.maxTradeSize || 100}
                  </Text>
                </View>
                <View style={styles.settingDivider} />
                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Dark Pool</Text>
                  <View style={[styles.settingBadge, styles.settingBadgeActive]}>
                    <Text style={[styles.settingBadgeText, { color: COLORS.success }]}>Enabled</Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Edit Button */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => vault && navigation.navigate('AgentSetup', { vault, agent })}
          >
            <Text style={styles.editButtonText}>
              {isTEE ? '⚙️ Reconfigure Agent' : '✏️ Edit Agent Settings'}
            </Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isTEE ? '🛡️ Secured by Oasis TEE' : '◈ Powered by Zynapse • ZkAGI'}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  safeArea: {
    flex: 1,
  },
  gradient: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    marginTop: 12,
    fontSize: 14,
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
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backIcon: {
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: COLORS.accent,
    fontSize: 13,
    marginTop: 4,
  },

  // Wallet Card (TEE)
  walletCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(51, 230, 191, 0.3)',
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  walletIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  walletTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  securedBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  securedText: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  chainDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  addressLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginRight: 6,
    marginTop: 1,
  },
  addressValue: {
    color: COLORS.textSecondary,
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },

  // Info Card - How Trading Works
  infoCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(51, 230, 191, 0.3)',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  infoTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: 12,
  },
  infoSubtitle: {
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    paddingLeft: 4,
  },
  infoBullet: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginRight: 6,
    marginTop: 1,
  },
  infoText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },
  infoHighlight: {
    color: COLORS.accent,
    fontWeight: '600',
  },
  flowRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 4,
  },
  flowItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(51, 230, 191, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  flowLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginBottom: 2,
  },
  flowArrow: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '500',
  },
  infoDex: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
    marginTop: 4,
  },
  infoDexText: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: 'center',
  },

  // Toggle Card
  toggleCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.textMuted,
    marginRight: 12,
  },
  toggleTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  toggleDesc: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: 4,
    minHeight: 80,
  },
  statValue: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    marginTop: 6,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  // Section
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  refreshText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '500',
  },

  // Signal Card
  signalCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  signalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  signalIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  signalIconImage: {
    width: 24,
    height: 24,
    tintColor: COLORS.textPrimary,
  },
  signalIconText: {
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  signalAsset: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  signalPrice: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  signalMiddle: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  indicatorLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  indicatorValue: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  signalRight: {
    alignItems: 'flex-end',
  },
  signalBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  signalBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  confidenceText: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 4,
  },

  // Settings Card
  settingsCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  configLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  configLoadingText: {
    color: COLORS.textMuted,
    marginLeft: 10,
    fontSize: 14,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  settingLabel: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  settingValue: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  settingBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  settingBadgeActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  settingBadgeInactive: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  settingBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Edit Button
  editButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  editButtonText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  createButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  createButtonText: {
    color: COLORS.bgPrimary,
    fontSize: 16,
    fontWeight: '700',
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  //trade
  // Trade History Cards
  tradeCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tradeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tradeActionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 12,
    minWidth: 56,
    alignItems: 'center',
  },
  tradeActionText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tradeAsset: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  tradeTime: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  tradeRight: {
    alignItems: 'flex-end',
  },
  tradeAmount: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '500',
  },
  tradeStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },
  tradeStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },
});

export default AgentDashboardScreen;