import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getTradeConfig, getTradeHistory, isLoggedIn, type TradeConfig } from '../../services/teeService';

interface TradeHistoryItem {
  asset: string; signal: 'BUY' | 'SELL'; signalPrice: number;
  chain: string; txHash: string; amountIn: string; tokenIn: string;
  status: string; timestamp: string;
}

export default function AgentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const justCreated = (location.state as any)?.justCreated;

  const [config, setConfig] = useState<TradeConfig | null>(null);
  const [history, setHistory] = useState<TradeHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');

  useEffect(() => {
    if (!isLoggedIn()) { navigate('/tee-login'); return; }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [configRes, historyRes] = await Promise.allSettled([
        getTradeConfig(),
        getTradeHistory(),
      ]);
      if (configRes.status === 'fulfilled') setConfig(configRes.value.config);
      if (historyRes.status === 'fulfilled') setHistory(historyRes.value.history || []);
    } catch (err) { console.error('Dashboard load error:', err); }
    setLoading(false);
  };

  const stats = {
    trades: history.length,
    winRate: history.length ? Math.round(history.filter(t => t.status === 'success').length / history.length * 100) : 0,
    pnl: 0, // Would need price data to calculate
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B1426', padding: '0 0 100px' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(180deg, #1E3A5F 0%, #0B1426 100%)', padding: '48px 24px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h1 style={{ color: '#FFF', fontSize: 22, fontWeight: 700 }}>🛡️ Agent Dashboard</h1>
            <p style={{ color: config?.tradingEnabled ? '#33E6BF' : '#EF4444', fontSize: 13, marginTop: 4 }}>
              {config?.tradingEnabled ? '● Trading Active' : '○ Trading Inactive'}
            </p>
          </div>
          <button onClick={() => navigate('/agents/setup')} style={{ backgroundColor: '#111B2E', border: '1px solid #1E3A5F', borderRadius: 10, padding: '8px 16px', color: '#4ECDC4', fontSize: 13, cursor: 'pointer' }}>
            ⚙️ Configure
          </button>
        </div>

        {justCreated && (
          <div style={{ padding: '12px 16px', backgroundColor: 'rgba(51,230,191,0.1)', border: '1px solid rgba(51,230,191,0.2)', borderRadius: 12, marginBottom: 16, color: '#33E6BF', fontSize: 14 }}>
            ✅ Agent activated! Trading is now enabled.
          </div>
        )}

        {/* Stats cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div style={{ backgroundColor: '#111B2E', borderRadius: 12, padding: '16px 12px', textAlign: 'center', border: '1px solid #1E3A5F' }}>
            <p style={{ color: '#6B7280', fontSize: 11, marginBottom: 4 }}>Trades</p>
            <p style={{ color: '#FFF', fontSize: 20, fontWeight: 700 }}>{loading ? '...' : stats.trades}</p>
          </div>
          <div style={{ backgroundColor: '#111B2E', borderRadius: 12, padding: '16px 12px', textAlign: 'center', border: '1px solid #1E3A5F' }}>
            <p style={{ color: '#6B7280', fontSize: 11, marginBottom: 4 }}>Win Rate</p>
            <p style={{ color: '#4ECDC4', fontSize: 20, fontWeight: 700 }}>{loading ? '...' : `${stats.winRate}%`}</p>
          </div>
          <div style={{ backgroundColor: '#111B2E', borderRadius: 12, padding: '16px 12px', textAlign: 'center', border: '1px solid #1E3A5F' }}>
            <p style={{ color: '#6B7280', fontSize: 11, marginBottom: 4 }}>Status</p>
            <p style={{ color: config?.tradingEnabled ? '#33E6BF' : '#EF4444', fontSize: 14, fontWeight: 600 }}>{config?.tradingEnabled ? 'Active' : 'Off'}</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 24px' }}>
        {/* Current Config */}
        {config && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ color: '#FFF', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Current Settings</h3>
            <div style={{ backgroundColor: '#111B2E', borderRadius: 16, border: '1px solid #1E3A5F', padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#6B7280', fontSize: 14 }}>Max Trade</span>
                <span style={{ color: '#FFF', fontWeight: 600 }}>${config.maxTradeAmountUsdc} USDC</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#6B7280', fontSize: 14 }}>Assets</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {config.allowedAssets.map(a => (
                    <span key={a} style={{ backgroundColor: a === 'SOL' ? '#9945FF20' : '#627EEA20', color: a === 'SOL' ? '#9945FF' : '#627EEA', padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>{a}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6B7280', fontSize: 14 }}>Trading</span>
                <span style={{ color: config.tradingEnabled ? '#33E6BF' : '#EF4444', fontWeight: 600 }}>{config.tradingEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderBottom: '1px solid #1E3A5F' }}>
          {(['overview', 'history'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, padding: '12px', background: 'none', border: 'none', cursor: 'pointer',
              color: activeTab === tab ? '#4ECDC4' : '#6B7280', fontWeight: 600, textTransform: 'capitalize',
              borderBottom: activeTab === tab ? '2px solid #4ECDC4' : '2px solid transparent',
            }}>{tab}</button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div style={{ backgroundColor: '#111B2E', borderRadius: 16, border: '1px solid #1E3A5F', padding: 20 }}>
            <div style={{ fontSize: 32, textAlign: 'center', marginBottom: 12 }}>🛡️</div>
            <p style={{ color: '#FFF', textAlign: 'center', fontWeight: 600, marginBottom: 8 }}>TEE Protected Trading</p>
            <p style={{ color: '#6B7280', textAlign: 'center', fontSize: 13 }}>Your agent executes trades inside an Oasis TEE enclave. Private keys never leave the secure environment.</p>
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            {history.length === 0 ? (
              <div style={{ padding: 32, backgroundColor: '#111B2E', borderRadius: 16, border: '1px solid #1E3A5F', textAlign: 'center' }}>
                <p style={{ color: '#6B7280' }}>No trades yet. Agent is waiting for signals.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {history.map((trade, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', backgroundColor: '#111B2E', borderRadius: 12, border: '1px solid #1E3A5F' }}>
                    <div>
                      <p style={{ color: '#FFF', fontWeight: 600 }}>{trade.signal} {trade.asset}</p>
                      <p style={{ color: '#6B7280', fontSize: 12 }}>{new Date(trade.timestamp).toLocaleDateString()}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: trade.signal === 'BUY' ? '#10B981' : '#EF4444', fontWeight: 600 }}>{trade.amountIn} {trade.tokenIn}</p>
                      <p style={{ color: trade.status === 'success' ? '#33E6BF' : '#F59E0B', fontSize: 12 }}>{trade.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
