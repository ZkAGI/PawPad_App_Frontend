import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredWallet, isLoggedIn, getAllBalances, getWallets, formatAddress, loadSession } from '../services/teeService';
import { copyToClipboard } from '../utils/clipboard';

interface Balances {
  solana: { sol: number; usdc: number };
  evm: { eth: number; usdc: number };
}

export default function Home() {
  const navigate = useNavigate();
  const [balances, setBalances] = useState<Balances | null>(null);
  const [loading, setLoading] = useState(true);
  const [solAddr, setSolAddr] = useState('');
  const [evmAddr, setEvmAddr] = useState('');

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    // Load session
    loadSession();

    const wallet = getStoredWallet();
    if (!wallet) {
      navigate('/onboarding', { replace: true });
      return;
    }

    setSolAddr(wallet.wallets.solana.address);
    setEvmAddr(wallet.wallets.evm.address);

    // Fetch real balances from public RPCs
    try {
      const b = await getAllBalances(wallet.wallets.solana.address, wallet.wallets.evm.address);
      setBalances(b);
    } catch (err) {
      console.error('Balance fetch failed:', err);
      setBalances({ solana: { sol: 0, usdc: 0 }, evm: { eth: 0, usdc: 0 } });
    }
    setLoading(false);
  };

  const refreshBalances = async () => {
    if (!solAddr && !evmAddr) return;
    setLoading(true);
    const b = await getAllBalances(solAddr || null, evmAddr || null);
    setBalances(b);
    setLoading(false);
  };

  // Price estimates (TODO: fetch from coingecko/jupiter)
  const solPrice = 180;
  const ethPrice = 3200;
  const totalUsd = balances
    ? (balances.solana.sol * solPrice) + (balances.evm.eth * ethPrice) + balances.solana.usdc + balances.evm.usdc
    : 0;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B1426', padding: '40px 24px 100px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ color: '#FFF', fontSize: 20, fontWeight: 700 }}>🐾 PawPad</h1>
        <button onClick={() => navigate('/settings')} style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: 20, cursor: 'pointer' }}>⚙️</button>
      </div>

      {/* Total Balance */}
      <div style={{ backgroundColor: '#111B2E', borderRadius: 20, padding: '28px 24px', border: '1px solid #1E3A5F', marginBottom: 24, textAlign: 'center' }}>
        <p style={{ color: '#8B95A5', fontSize: 14, marginBottom: 8 }}>Total Balance</p>
        <h2 style={{ color: '#FFF', fontSize: 36, fontWeight: 700 }}>
          {loading ? '...' : `$${totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        </h2>
        <button onClick={refreshBalances} style={{ background: 'none', border: 'none', color: '#4ECDC4', fontSize: 12, marginTop: 8, cursor: 'pointer' }}>↻ Refresh</button>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 32 }}>
        {[
          { label: 'Send', icon: '↑', route: '/send', active: true },
          { label: 'Receive', icon: '↓', route: '/fund', active: true },
          { label: 'Swap', icon: '⇄', route: '/swap', active: false },
          { label: 'Agent', icon: '🐾', route: '/agents', active: true },
        ].map(a => (
          <button key={a.label} onClick={() => a.active && navigate(a.route)} style={{ padding: '20px 12px', backgroundColor: '#111B2E', border: '1px solid #1E3A5F', borderRadius: 16, cursor: a.active ? 'pointer' : 'default', textAlign: 'center', opacity: a.active ? 1 : 0.5, position: 'relative' }}>
            <span style={{ fontSize: 24, display: 'block', color: '#FFF', marginBottom: 8 }}>{a.icon}</span>
            <span style={{ color: '#8B95A5', fontSize: 13 }}>{a.label}</span>
            {!a.active && <span style={{ position: 'absolute', top: 6, right: 6, backgroundColor: '#F59E0B', color: '#000', fontSize: 8, fontWeight: 700, padding: '2px 4px', borderRadius: 4 }}>SOON</span>}
          </button>
        ))}
      </div>

      {/* Agent Dashboard Card */}
      <button onClick={() => navigate('/agents')} style={{
        width: '100%', padding: '16px 20px', backgroundColor: 'rgba(78,205,196,0.08)', border: '1px solid rgba(78,205,196,0.2)',
        borderRadius: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, textAlign: 'left',
      }}>
        <span style={{ fontSize: 28 }}>🐾</span>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#FFF', fontWeight: 600, fontSize: 15 }}>Agent Dashboard</p>
          <p style={{ color: '#6B7280', fontSize: 13 }}>View your AI agent's activity</p>
        </div>
        <span style={{ color: '#4ECDC4', fontSize: 18 }}>→</span>
      </button>

      {/* Assets */}
      <h3 style={{ color: '#FFF', fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Assets</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* SOL */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px', backgroundColor: '#111B2E', borderRadius: 16, border: '1px solid #1E3A5F' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #9945FF, #7B3FE4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#FFF', flexShrink: 0 }}>SOL</div>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#FFF', fontWeight: 600 }}>Solana</p>
            <p style={{ color: '#6B7280', fontSize: 13 }}>{loading ? '...' : `${balances?.solana.sol.toFixed(4)} SOL`}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#FFF', fontWeight: 600 }}>${loading ? '...' : ((balances?.solana.sol || 0) * solPrice).toFixed(2)}</p>
          </div>
        </div>

        {/* ETH */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px', backgroundColor: '#111B2E', borderRadius: 16, border: '1px solid #1E3A5F' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #627EEA, #4A6FD6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#FFF', flexShrink: 0 }}>ETH</div>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#FFF', fontWeight: 600 }}>Ethereum</p>
            <p style={{ color: '#6B7280', fontSize: 13 }}>{loading ? '...' : `${balances?.evm.eth.toFixed(6)} ETH`}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#FFF', fontWeight: 600 }}>${loading ? '...' : ((balances?.evm.eth || 0) * ethPrice).toFixed(2)}</p>
          </div>
        </div>

        {/* USDC (Solana) */}
        {(balances?.solana.usdc || 0) > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px', backgroundColor: '#111B2E', borderRadius: 16, border: '1px solid #1E3A5F' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#2775CA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, color: '#FFF', flexShrink: 0 }}>USDC</div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#FFF', fontWeight: 600 }}>USDC <span style={{ color: '#9945FF', fontSize: 11 }}>(Solana)</span></p>
              <p style={{ color: '#6B7280', fontSize: 13 }}>{balances?.solana.usdc.toFixed(2)} USDC</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#FFF', fontWeight: 600 }}>${balances?.solana.usdc.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* USDC (ETH) */}
        {(balances?.evm.usdc || 0) > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px', backgroundColor: '#111B2E', borderRadius: 16, border: '1px solid #1E3A5F' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#2775CA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, color: '#FFF', flexShrink: 0 }}>USDC</div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#FFF', fontWeight: 600 }}>USDC <span style={{ color: '#627EEA', fontSize: 11 }}>(Ethereum)</span></p>
              <p style={{ color: '#6B7280', fontSize: 13 }}>{balances?.evm.usdc.toFixed(2)} USDC</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#FFF', fontWeight: 600 }}>${balances?.evm.usdc.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Wallet Addresses */}
      <h3 style={{ color: '#FFF', fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 16 }}>Wallets</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div onClick={() => { copyToClipboard(solAddr); }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', backgroundColor: '#111B2E', borderRadius: 12, border: '1px solid #1E3A5F', cursor: 'pointer' }}>
          <div>
            <span style={{ color: '#9945FF', fontSize: 13, fontWeight: 600 }}>Solana</span>
            <p style={{ color: '#8B95A5', fontSize: 13, fontFamily: 'monospace', marginTop: 2 }}>{formatAddress(solAddr)}</p>
          </div>
          <span style={{ color: '#6B7280', fontSize: 12 }}>📋 Copy</span>
        </div>
        <div onClick={() => { copyToClipboard(evmAddr); }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', backgroundColor: '#111B2E', borderRadius: 12, border: '1px solid #1E3A5F', cursor: 'pointer' }}>
          <div>
            <span style={{ color: '#627EEA', fontSize: 13, fontWeight: 600 }}>EVM (Ethereum)</span>
            <p style={{ color: '#8B95A5', fontSize: 13, fontFamily: 'monospace', marginTop: 2 }}>{formatAddress(evmAddr)}</p>
          </div>
          <span style={{ color: '#6B7280', fontSize: 12 }}>📋 Copy</span>
        </div>
      </div>

      {/* Recent Activity placeholder */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, marginBottom: 12 }}>
        <h3 style={{ color: '#FFF', fontSize: 18, fontWeight: 600 }}>Recent Activity</h3>
        <button onClick={() => navigate('/history')} style={{ background: 'none', border: 'none', color: '#4ECDC4', fontSize: 13, cursor: 'pointer' }}>See all →</button>
      </div>
      <div style={{ padding: '24px', backgroundColor: '#111B2E', borderRadius: 16, border: '1px solid #1E3A5F', textAlign: 'center' }}>
        <p style={{ color: '#6B7280' }}>No recent transactions</p>
      </div>
    </div>
  );
}
