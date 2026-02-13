import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, getStoredWallet, loadSession, formatAddress, getWallets, saveWalletData } from '../../services/teeService';

export default function TEELogin() {
  const [totp, setTotp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const wallet = getStoredWallet();

  useEffect(() => {
    // If already has valid session, go straight to home
    if (loadSession()) navigate('/home', { replace: true });
  }, []);

  if (!wallet) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0B1426', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6B7280', marginBottom: 16 }}>No wallet found on this device.</p>
          <button onClick={() => navigate('/onboarding')} style={{ backgroundColor: '#4F7FFF', color: '#FFF', padding: '12px 24px', borderRadius: 12, border: 'none', cursor: 'pointer' }}>Create Wallet</button>
          <button onClick={() => navigate('/recover-tee')} style={{ background: 'none', border: 'none', color: '#4ECDC4', marginTop: 12, display: 'block', width: '100%', cursor: 'pointer' }}>Recover existing wallet</button>
        </div>
      </div>
    );
  }

  const handleLogin = async () => {
    if (totp.length !== 6) return;
    setLoading(true);
    setError('');
    try {
      await login(wallet.uid, totp);
      // Fetch wallet addresses after login and update stored data
      try {
        const walletsData = await getWallets();
        if (walletsData.wallets) {
          saveWalletData({ uid: wallet.uid, wallets: walletsData.wallets });
        }
      } catch (e) { console.log('[TEE] Could not fetch wallets after login:', e); }
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B1426', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🐾</div>
        <h1 style={{ color: '#FFF', fontSize: 28, marginBottom: 8 }}>Welcome Back</h1>
        <p style={{ color: '#6B7280', fontSize: 15 }}>Enter your authenticator code</p>
      </div>

      {/* Show wallet addresses */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
        <span style={{ backgroundColor: '#9945FF20', color: '#9945FF', fontSize: 11, padding: '4px 10px', borderRadius: 6, fontFamily: 'monospace' }}>{formatAddress(wallet.wallets.solana.address, 4)}</span>
        <span style={{ backgroundColor: '#627EEA20', color: '#627EEA', fontSize: 11, padding: '4px 10px', borderRadius: 6, fontFamily: 'monospace' }}>{formatAddress(wallet.wallets.evm.address, 4)}</span>
      </div>

      {error && <div style={{ padding: '12px 16px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, marginBottom: 16, color: '#EF4444', fontSize: 14, textAlign: 'center' }}>{error}</div>}

      <input type="text" inputMode="numeric" maxLength={6} placeholder="000000" value={totp}
        onChange={e => setTotp(e.target.value.replace(/\D/g, '').slice(0, 6))}
        onKeyDown={e => e.key === 'Enter' && handleLogin()}
        style={{ width: '100%', padding: 20, backgroundColor: '#111B2E', border: '2px solid #1E3A5F', borderRadius: 16, color: '#FFF', fontSize: 32, textAlign: 'center', letterSpacing: 12, outline: 'none', fontFamily: 'monospace', marginBottom: 24 }}
      />

      <button onClick={handleLogin} disabled={totp.length !== 6 || loading} style={{
        width: '100%', padding: 16, borderRadius: 12, border: 'none',
        backgroundColor: totp.length === 6 && !loading ? '#33E6BF' : '#1E3A5F',
        color: totp.length === 6 && !loading ? '#0B1426' : '#4A5568',
        fontSize: 16, fontWeight: 600, cursor: totp.length === 6 && !loading ? 'pointer' : 'not-allowed',
      }}>
        {loading ? 'Authenticating...' : 'Login'}
      </button>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <button onClick={() => navigate('/recover-tee')} style={{ background: 'none', border: 'none', color: '#4ECDC4', fontSize: 14, cursor: 'pointer' }}>Lost access? Recover wallet</button>
      </div>
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <button onClick={() => navigate('/onboarding')} style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: 13, cursor: 'pointer' }}>Create a new wallet instead</button>
      </div>
    </div>
  );
}
