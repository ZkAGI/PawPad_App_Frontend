import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setTradeConfig, isLoggedIn, getStoredWallet } from '../../services/teeService';

const TRADING_ASSETS = ['SOL', 'ETH'];
const MAX_TRADE_OPTIONS = [50, 100, 250, 500];

export default function AgentSetup() {
  const navigate = useNavigate();
  const wallet = getStoredWallet();

  const [tradingPairs, setTradingPairs] = useState<string[]>(['SOL', 'ETH']);
  const [maxPositionSize, setMaxPositionSize] = useState(100);
  const [riskLevel, setRiskLevel] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const togglePair = (pair: string) => {
    if (tradingPairs.includes(pair)) {
      if (tradingPairs.length > 1) setTradingPairs(tradingPairs.filter(p => p !== pair));
    } else {
      setTradingPairs([...tradingPairs, pair]);
    }
  };

  const handleCreate = async () => {
    if (!tradingPairs.length) { setError('Select at least one trading asset'); return; }
    if (!isLoggedIn()) { navigate('/tee-login'); return; }

    setLoading(true);
    setError('');
    try {
      // REAL API: POST /v1/trade/config
      const res = await setTradeConfig({
        tradingEnabled: true,
        maxTradeAmountUsdc: maxPositionSize,
        allowedAssets: tradingPairs,
      });

      if (!res.ok) throw new Error('Failed to configure trading settings');

      // Navigate to dashboard on success
      navigate('/agents/dashboard', {
        state: {
          justCreated: true,
          config: { tradingPairs, maxPositionSize, riskLevel },
        },
      });
    } catch (err: any) {
      setError(err.message || 'Failed to configure agent');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B1426', padding: '0 0 100px' }}>
      {/* Header gradient */}
      <div style={{ background: 'linear-gradient(180deg, #1E3A5F 0%, #0F2744 50%, #0B1426 100%)', padding: '48px 24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#FFF', fontSize: 20, cursor: 'pointer' }}>←</button>
          <div>
            <h1 style={{ color: '#FFF', fontSize: 22, fontWeight: 700 }}>🛡️ TEE Agent</h1>
            <p style={{ color: '#4ECDC4', fontSize: 14 }}>Configure Trading</p>
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(78,205,196,0.08)', border: '1px solid rgba(78,205,196,0.2)', borderRadius: 16, padding: '16px 20px' }}>
          <p style={{ color: '#FFF', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Configure Your Agent</p>
          <p style={{ color: '#8B95A5', fontSize: 13 }}>Your TEE agent will securely execute trades using Oasis TEE protection.</p>
        </div>
      </div>

      <div style={{ padding: '0 24px' }}>
        {error && <div style={{ padding: '12px 16px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, marginBottom: 16, color: '#EF4444', fontSize: 14 }}>{error}</div>}

        {/* Trading Assets */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ color: '#FFF', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>🔄 Trading Assets</h3>
          <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 12 }}>Which assets should the agent trade?</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {TRADING_ASSETS.map(asset => (
              <button key={asset} onClick={() => togglePair(asset)} style={{
                flex: 1, padding: '14px', borderRadius: 12,
                backgroundColor: tradingPairs.includes(asset) ? 'rgba(78,205,196,0.15)' : '#111B2E',
                border: tradingPairs.includes(asset) ? '2px solid #4ECDC4' : '2px solid #1E3A5F',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <span style={{ color: asset === 'SOL' ? '#9945FF' : '#627EEA', fontWeight: 700, fontSize: 15 }}>{asset}</span>
                {tradingPairs.includes(asset) && <span style={{ color: '#4ECDC4', fontSize: 16 }}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Max Trade Size */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ color: '#FFF', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>💰 Max Trade Size (USDC)</h3>
          <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 12 }}>Maximum amount per trade</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {MAX_TRADE_OPTIONS.map(size => (
              <button key={size} onClick={() => setMaxPositionSize(size)} style={{
                padding: '12px', borderRadius: 12,
                backgroundColor: maxPositionSize === size ? 'rgba(78,205,196,0.15)' : '#111B2E',
                border: maxPositionSize === size ? '2px solid #4ECDC4' : '2px solid #1E3A5F',
                color: maxPositionSize === size ? '#4ECDC4' : '#8B95A5',
                cursor: 'pointer', fontWeight: 600, fontSize: 15,
              }}>
                ${size}
              </button>
            ))}
          </div>
        </div>

        {/* Risk Level */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ color: '#FFF', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>📊 Risk Level</h3>
          <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 12 }}>How aggressive should trading be?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(['conservative', 'moderate', 'aggressive'] as const).map(level => (
              <button key={level} onClick={() => setRiskLevel(level)} style={{
                padding: '14px 16px', borderRadius: 12, textAlign: 'left', width: '100%',
                backgroundColor: riskLevel === level ? 'rgba(78,205,196,0.1)' : '#111B2E',
                border: riskLevel === level ? '2px solid #4ECDC4' : '2px solid #1E3A5F',
                cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ color: riskLevel === level ? '#4ECDC4' : '#8B95A5', fontWeight: 500, textTransform: 'capitalize' }}>{level}</span>
                {riskLevel === level && <span style={{ color: '#4ECDC4' }}>●</span>}
              </button>
            ))}
          </div>
        </div>

        {/* TEE Security info */}
        <div style={{ padding: '16px 20px', backgroundColor: 'rgba(51,230,191,0.06)', border: '1px solid rgba(51,230,191,0.15)', borderRadius: 16, marginBottom: 32 }}>
          <p style={{ color: '#33E6BF', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>🛡️ TEE Security</p>
          <p style={{ color: '#6B7280', fontSize: 13 }}>Your trades are executed inside Oasis TEE (Trusted Execution Environment), ensuring your private keys and trading logic remain secure and private.</p>
        </div>

        {/* Create Button */}
        <button onClick={handleCreate} disabled={loading} style={{
          width: '100%', padding: '16px', borderRadius: 12, border: 'none',
          backgroundColor: loading ? '#1E3A5F' : '#4ECDC4',
          color: loading ? '#4A5568' : '#0B1426',
          fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
        }}>
          {loading ? '⏳ Configuring Agent...' : '🚀 Activate Agent'}
        </button>
      </div>
    </div>
  );
}
