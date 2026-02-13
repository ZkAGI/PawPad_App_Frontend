import { useNavigate, useLocation } from 'react-router-dom';

export default function VaultSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { vaultName } = (location.state as any) || {};

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#0B1426',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', textAlign: 'center',
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%', backgroundColor: '#10B981',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, marginBottom: 24,
      }}>
        ✓
      </div>
      <h2 style={{ color: '#FFFFFF', fontSize: 24, marginBottom: 8 }}>Vault Created!</h2>
      <p style={{ color: '#6B7280', marginBottom: 32 }}>
        {vaultName ? `"${vaultName}" is ready` : 'Your wallet is ready to use'}
      </p>

      <button onClick={() => navigate('/home')} style={{
        width: '100%', maxWidth: 300, padding: '16px', borderRadius: 12, border: 'none',
        backgroundColor: '#4F7FFF', color: '#FFFFFF', fontSize: 16, fontWeight: 600, cursor: 'pointer',
        marginBottom: 12,
      }}>
        Go to Wallet
      </button>
      <button onClick={() => navigate('/backup')} style={{
        width: '100%', maxWidth: 300, padding: '16px', borderRadius: 12,
        border: '1px solid #1E3A5F', backgroundColor: 'transparent',
        color: '#6B7280', fontSize: 16, cursor: 'pointer',
      }}>
        Backup Now
      </button>
    </div>
  );
}
