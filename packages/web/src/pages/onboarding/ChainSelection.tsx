import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createWallet, saveWalletData } from '../../services/teeService';

type WalletType = 'tee' | 'seedless' | 'seed';

const walletTypes: { id: WalletType; name: string; desc: string; features: string[]; badge?: string; color: string }[] = [
  { id: 'tee', name: 'TEE Wallet', desc: 'Keys generated inside Oasis TEE hardware enclave', badge: 'OASIS TEE', color: '#F59E0B', features: ['Hardware-level isolation', 'Multi-chain (EVM + Solana)', 'TOTP authentication', 'Encrypted backup file'] },
  { id: 'seedless', name: 'Seedless Wallet', desc: 'FROST threshold signatures — no seed phrase needed', color: '#A855F7', features: ['No seed phrase needed', 'MPC key sharding', 'Recovery via Google Authenticator'] },
  { id: 'seed', name: 'Traditional Wallet', desc: 'Classic wallet with 12-word seed phrase', color: '#3B82F6', features: ['12-word seed phrase backup', 'Full self-custody', 'Import existing wallets'] },
];

export default function ChainSelection() {
  const [selected, setSelected] = useState<WalletType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!selected) return;
    setError('');
    if (selected === 'tee') {
      setLoading(true);
      try {
        const result = await createWallet();
        saveWalletData({ uid: result.uid, wallets: result.wallets });
        navigate('/tee-setup', { state: { uid: result.uid, wallets: result.wallets, totp: result.totp, backup_file: result.backup_file, backup_hash: result.backup_hash } });
      } catch (err: any) {
        setError(err.message || 'Failed to create TEE wallet.');
      } finally { setLoading(false); }
    } else {
      navigate('/email-input', { state: { walletType: selected } });
    }
  };

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#0B1426',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Scrollable content */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '48px 24px 24px',
        WebkitOverflowScrolling: 'touch',
      }}>
        <h1 style={{ fontSize: 28, color: '#FFF', marginBottom: 8 }}>Choose Wallet Type</h1>
        <p style={{ color: '#6B7280', fontSize: 15, marginBottom: 24 }}>Select how you want to secure your wallet</p>

        {error && <div style={{ padding: '12px 16px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, marginBottom: 16, color: '#EF4444', fontSize: 14 }}>{error}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {walletTypes.map((t) => (
            <button key={t.id} onClick={() => !loading && setSelected(t.id)} style={{
              padding: 20, borderRadius: 16, textAlign: 'left', width: '100%',
              backgroundColor: selected === t.id ? `${t.color}10` : '#111B2E',
              border: selected === t.id ? `2px solid ${t.color}` : '2px solid #1E3A5F',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ color: '#FFF', fontSize: 17, fontWeight: 600 }}>{t.name}</span>
                {t.badge && <span style={{ backgroundColor: `${t.color}25`, color: t.color, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>{t.badge}</span>}
              </div>
              <p style={{ color: '#8B95A5', fontSize: 14, marginBottom: 12 }}>{t.desc}</p>
              {t.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ color: t.color, fontSize: 12 }}>✓</span>
                  <span style={{ color: '#6B7280', fontSize: 13 }}>{f}</span>
                </div>
              ))}
              {t.id === 'tee' && (
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <span style={{ backgroundColor: '#9945FF20', color: '#9945FF', fontSize: 11, padding: '4px 8px', borderRadius: 6, fontWeight: 600 }}>Solana</span>
                  <span style={{ backgroundColor: '#627EEA20', color: '#627EEA', fontSize: 11, padding: '4px 8px', borderRadius: 6, fontWeight: 600 }}>EVM</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Fixed bottom buttons */}
      <div style={{
        padding: '16px 24px', paddingBottom: 'calc(16px + env(safe-area-inset-bottom))',
        backgroundColor: '#0B1426', borderTop: '1px solid #1E3A5F',
        flexShrink: 0,
      }}>
        <button onClick={handleContinue} disabled={!selected || loading} style={{
          width: '100%', padding: 16, borderRadius: 12, border: 'none',
          backgroundColor: selected && !loading ? '#4F7FFF' : '#1E3A5F',
          color: selected && !loading ? '#FFF' : '#4A5568',
          fontSize: 16, fontWeight: 600,
          cursor: selected && !loading ? 'pointer' : 'not-allowed',
        }}>
          {loading ? 'Creating TEE wallet...' : selected === 'tee' ? 'Create TEE Wallet' : 'Continue'}
        </button>
        <button onClick={() => navigate(-1)} style={{
          width: '100%', background: 'none', border: 'none',
          color: '#6B7280', marginTop: 12, fontSize: 14, cursor: 'pointer',
        }}>
          ← Back
        </button>
      </div>
    </div>
  );
}
