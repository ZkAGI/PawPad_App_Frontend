import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredWallet, clearSession, clearWalletData, formatAddress, getSessionToken } from '../services/teeService';
import { copyToClipboard } from '../utils/clipboard';

export default function Settings() {
  const navigate = useNavigate();
  const wallet = getStoredWallet();
  const [showWalletInfo, setShowWalletInfo] = useState(false);
  const [copied, setCopied] = useState('');

  const handleBackup = () => {
    const backupData = localStorage.getItem('tee_wallet');
    if (backupData) {
      const blob = new Blob([backupData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pawpad-wallet-info-${wallet?.uid?.slice(0, 8) || 'backup'}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      alert('No wallet data found to backup.');
    }
  };

  const handleLogout = () => {
    if (confirm('Log out? You will need your TOTP code to log back in.')) {
      clearSession();
      navigate('/tee-login');
    }
  };

  const handleDeleteWallet = () => {
    if (confirm('Remove wallet from this device?\n\nYou will need your backup file + TOTP to recover.\n\nThis cannot be undone.')) {
      clearSession();
      clearWalletData();
      localStorage.removeItem('tee_trade_config');
      navigate('/onboarding');
    }
  };

  const copyAddress = async (addr: string, label: string) => {
    await copyToClipboard(addr);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="page fade-in">
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Settings</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button onClick={handleBackup} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, textAlign: 'left', width: '100%', cursor: 'pointer' }}>
          <div>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Backup Wallet Data</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Download wallet info as JSON</p>
          </div>
          <span style={{ color: 'var(--text-muted)' }}>→</span>
        </button>

        <button onClick={() => setShowWalletInfo(!showWalletInfo)} className="card" style={{ display: 'flex', flexDirection: 'column', padding: 16, textAlign: 'left', width: '100%', cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Wallet Addresses</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>View and copy your addresses</p>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>{showWalletInfo ? '▼' : '→'}</span>
          </div>
          {showWalletInfo && wallet && (
            <div style={{ marginTop: 12, width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }} onClick={e => e.stopPropagation()}>
              <div onClick={() => copyAddress(wallet.wallets.solana.address, 'sol')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: 'var(--bg-primary)', borderRadius: 8, cursor: 'pointer' }}>
                <div>
                  <span style={{ color: '#9945FF', fontSize: 12, fontWeight: 600 }}>Solana</span>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'monospace', marginTop: 2 }}>{formatAddress(wallet.wallets.solana.address)}</p>
                </div>
                <span style={{ color: copied === 'sol' ? '#33E6BF' : 'var(--text-muted)', fontSize: 12 }}>{copied === 'sol' ? 'Copied!' : 'Copy'}</span>
              </div>
              <div onClick={() => copyAddress(wallet.wallets.evm.address, 'evm')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: 'var(--bg-primary)', borderRadius: 8, cursor: 'pointer' }}>
                <div>
                  <span style={{ color: '#627EEA', fontSize: 12, fontWeight: 600 }}>EVM (Ethereum)</span>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'monospace', marginTop: 2 }}>{formatAddress(wallet.wallets.evm.address)}</p>
                </div>
                <span style={{ color: copied === 'evm' ? '#33E6BF' : 'var(--text-muted)', fontSize: 12 }}>{copied === 'evm' ? 'Copied!' : 'Copy'}</span>
              </div>
              <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-primary)', borderRadius: 8 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>UID: {wallet.uid?.slice(0, 16)}...</span>
              </div>
            </div>
          )}
        </button>

        <div className="card" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Session</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{getSessionToken() ? 'Active (JWT)' : 'Not logged in'}</p>
          </div>
          <span style={{ color: getSessionToken() ? '#33E6BF' : 'var(--accent-red)', fontSize: 12, fontWeight: 600 }}>{getSessionToken() ? 'Active' : 'Expired'}</span>
        </div>

        <button onClick={() => navigate('/recover-tee')} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, textAlign: 'left', width: '100%', cursor: 'pointer' }}>
          <div>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Recover Wallet</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Restore from backup file</p>
          </div>
          <span style={{ color: 'var(--text-muted)' }}>→</span>
        </button>

        <div className="card" style={{ padding: 16 }}>
          <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>About PawPad</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>v2.0.0 • Privacy-first multi-chain wallet</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>Powered by Oasis TEE + FROST MPC</p>
        </div>
      </div>

      <button onClick={handleLogout} style={{ marginTop: 24, width: '100%', padding: 14, background: 'transparent', border: '1px solid var(--accent-red)', borderRadius: 'var(--radius)', color: 'var(--accent-red)', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
        Log Out
      </button>

      <button onClick={handleDeleteWallet} style={{ marginTop: 12, width: '100%', padding: 14, background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: 14, cursor: 'pointer' }}>
        Remove wallet from this device
      </button>
    </div>
  );
}
