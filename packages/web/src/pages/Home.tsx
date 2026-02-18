import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredWallet, getAllBalances, formatAddress, loadSession } from '../services/teeService';
import { copyToClipboard } from '../utils/clipboard';

interface Balances {
  solana: { sol: number; usdc: number };
  evm: { eth: number; usdc: number };
}

const CACHE_KEY = 'pawpad_balances';

function getCached(): Balances | null {
  try { const r = localStorage.getItem(CACHE_KEY); if (!r) return null; return JSON.parse(r).data; } catch { return null; }
}
function setCache(b: Balances) { localStorage.setItem(CACHE_KEY, JSON.stringify({ data: b, ts: Date.now() })); }

export default function Home() {
  const navigate = useNavigate();
  const [balances, setBalances] = useState<Balances | null>(getCached());
  const [loading, setLoading] = useState(!getCached());
  const [solAddr, setSolAddr] = useState('');
  const [evmAddr, setEvmAddr] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const handleCopy = async (addr: string, label: string) => {
    const ok = await copyToClipboard(addr);
    showToast(ok ? `${label} address copied` : 'Copy failed');
  };

  useEffect(() => { init(); }, []);

  const init = async () => {
    loadSession();
    const wallet = getStoredWallet();
    if (!wallet) { navigate('/onboarding', { replace: true }); return; }
    setSolAddr(wallet.wallets.solana.address);
    setEvmAddr(wallet.wallets.evm.address);
    try {
      const b = await getAllBalances(wallet.wallets.solana.address, wallet.wallets.evm.address);
      setBalances(b); setCache(b);
    } catch { if (!balances) setBalances({ solana: { sol: 0, usdc: 0 }, evm: { eth: 0, usdc: 0 } }); }
    setLoading(false);
  };

  const refreshBalances = async () => {
    if (!solAddr && !evmAddr) return;
    setLoading(true);
    try { const b = await getAllBalances(solAddr || null, evmAddr || null); setBalances(b); setCache(b); showToast('Balances updated'); }
    catch { showToast('Refresh failed'); }
    setLoading(false);
  };

  const solPrice = 180, ethPrice = 3200;
  const totalUsd = balances ? (balances.solana.sol * solPrice) + (balances.evm.eth * ethPrice) + balances.solana.usdc + balances.evm.usdc : 0;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B1426', padding: '40px 24px 100px' }}>
      {toast && <div style={{ position: 'fixed', top: 48, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#1E3A5F', color: '#4ECDC4', padding: '10px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600, zIndex: 999, border: '1px solid #4ECDC4', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>{toast}</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ color: '#FFF', fontSize: 20, fontWeight: 700 }}>🐾 PawPad</h1>
        <button onClick={() => navigate('/settings')} style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: 20, cursor: 'pointer' }}>⚙️</button>
      </div>

      <div style={{ backgroundColor: '#111B2E', borderRadius: 20, padding: '28px 24px', border: '1px solid #1E3A5F', marginBottom: 24, textAlign: 'center' }}>
        <p style={{ color: '#8B95A5', fontSize: 14, marginBottom: 8 }}>Total Balance</p>
        <h2 style={{ color: '#FFF', fontSize: 36, fontWeight: 700 }}>{balances ? `$${totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00'}</h2>
        <button onClick={refreshBalances} disabled={loading} style={{ background: 'none', border: 'none', color: '#4ECDC4', fontSize: 12, marginTop: 8, cursor: 'pointer', opacity: loading ? 0.5 : 1 }}>{loading ? '↻ Loading...' : '↻ Refresh'}</button>
      </div>

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

      <button onClick={() => navigate('/agents')} style={{ width: '100%', padding: '16px 20px', backgroundColor: 'rgba(78,205,196,0.08)', border: '1px solid rgba(78,205,196,0.2)', borderRadius: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, textAlign: 'left' }}>
        <span style={{ fontSize: 28 }}>🐾</span>
        <div style={{ flex: 1 }}><p style={{ color: '#FFF', fontWeight: 600, fontSize: 15 }}>Agent Dashboard</p><p style={{ color: '#6B7280', fontSize: 13 }}>View your AI agent's activity</p></div>
        <span style={{ color: '#4ECDC4', fontSize: 18 }}>→</span>
      </button>

      <h3 style={{ color: '#FFF', fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Assets</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px', backgroundColor: '#111B2E', borderRadius: 16, border: '1px solid #1E3A5F' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #9945FF, #7B3FE4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#FFF', flexShrink: 0 }}>SOL</div>
          <div style={{ flex: 1 }}><p style={{ color: '#FFF', fontWeight: 600 }}>Solana</p><p style={{ color: '#6B7280', fontSize: 13 }}>{balances ? `${balances.solana.sol.toFixed(4)} SOL` : '0.0000 SOL'}</p></div>
          <p style={{ color: '#FFF', fontWeight: 600 }}>${balances ? ((balances.solana.sol || 0) * solPrice).toFixed(2) : '0.00'}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px', backgroundColor: '#111B2E', borderRadius: 16, border: '1px solid #1E3A5F' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #627EEA, #4A6FD6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#FFF', flexShrink: 0 }}>ETH</div>
          <div style={{ flex: 1 }}><p style={{ color: '#FFF', fontWeight: 600 }}>Ethereum</p><p style={{ color: '#6B7280', fontSize: 13 }}>{balances ? `${balances.evm.eth.toFixed(6)} ETH` : '0.000000 ETH'}</p></div>
          <p style={{ color: '#FFF', fontWeight: 600 }}>${balances ? ((balances.evm.eth || 0) * ethPrice).toFixed(2) : '0.00'}</p>
        </div>
        {(balances?.solana.usdc || 0) > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px', backgroundColor: '#111B2E', borderRadius: 16, border: '1px solid #1E3A5F' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#2775CA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, color: '#FFF', flexShrink: 0 }}>USDC</div>
            <div style={{ flex: 1 }}><p style={{ color: '#FFF', fontWeight: 600 }}>USDC <span style={{ color: '#9945FF', fontSize: 11 }}>(Solana)</span></p><p style={{ color: '#6B7280', fontSize: 13 }}>{balances?.solana.usdc.toFixed(2)} USDC</p></div>
            <p style={{ color: '#FFF', fontWeight: 600 }}>${balances?.solana.usdc.toFixed(2)}</p>
          </div>
        )}
        {(balances?.evm.usdc || 0) > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px', backgroundColor: '#111B2E', borderRadius: 16, border: '1px solid #1E3A5F' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#2775CA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, color: '#FFF', flexShrink: 0 }}>USDC</div>
            <div style={{ flex: 1 }}><p style={{ color: '#FFF', fontWeight: 600 }}>USDC <span style={{ color: '#627EEA', fontSize: 11 }}>(Ethereum)</span></p><p style={{ color: '#6B7280', fontSize: 13 }}>{balances?.evm.usdc.toFixed(2)} USDC</p></div>
            <p style={{ color: '#FFF', fontWeight: 600 }}>${balances?.evm.usdc.toFixed(2)}</p>
          </div>
        )}
      </div>

      <h3 style={{ color: '#FFF', fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 16 }}>Wallets</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div onClick={() => handleCopy(solAddr, 'Solana')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', backgroundColor: '#111B2E', borderRadius: 12, border: '1px solid #1E3A5F', cursor: 'pointer' }}>
          <div><span style={{ color: '#9945FF', fontSize: 13, fontWeight: 600 }}>Solana</span><p style={{ color: '#8B95A5', fontSize: 13, fontFamily: 'monospace', marginTop: 2 }}>{formatAddress(solAddr)}</p></div>
          <span style={{ color: '#6B7280', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>📋 Copy</span>
        </div>
        <div onClick={() => handleCopy(evmAddr, 'EVM')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', backgroundColor: '#111B2E', borderRadius: 12, border: '1px solid #1E3A5F', cursor: 'pointer' }}>
          <div><span style={{ color: '#627EEA', fontSize: 13, fontWeight: 600 }}>EVM (Ethereum)</span><p style={{ color: '#8B95A5', fontSize: 13, fontFamily: 'monospace', marginTop: 2 }}>{formatAddress(evmAddr)}</p></div>
          <span style={{ color: '#6B7280', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>📋 Copy</span>
        </div>
      </div>

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
