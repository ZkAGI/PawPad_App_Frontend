import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function VaultNameInput() {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { email, walletType } = (location.state as any) || {};

  const handleCreate = () => {
    // Route based on wallet type
    if (walletType === 'seedless') {
      navigate('/creating-seedless', { state: { email, vaultName: name, walletType } });
    } else {
      navigate('/creating-vault', { state: { email, vaultName: name, walletType } });
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B1426', padding: '60px 24px 40px', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ fontSize: 28, color: '#FFFFFF', marginBottom: 8 }}>Name Your Vault</h1>
      <p style={{ color: '#6B7280', fontSize: 15, marginBottom: 32 }}>Give your vault a memorable name</p>

      <input
        type="text"
        placeholder="e.g. My Privacy Vault"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{
          width: '100%', padding: '16px', backgroundColor: '#111B2E', border: '1px solid #1E3A5F',
          borderRadius: 12, color: '#FFFFFF', fontSize: 16, outline: 'none', marginBottom: 'auto',
          fontFamily: 'inherit',
        }}
        onFocus={e => e.target.style.borderColor = '#4F7FFF'}
        onBlur={e => e.target.style.borderColor = '#1E3A5F'}
      />

      <div style={{ paddingTop: 24 }}>
        <button
          onClick={handleCreate}
          disabled={!name.trim()}
          style={{
            width: '100%', padding: '16px', borderRadius: 12, border: 'none',
            backgroundColor: name.trim() ? '#4F7FFF' : '#1E3A5F',
            color: name.trim() ? '#FFFFFF' : '#4A5568',
            fontSize: 16, fontWeight: 600, cursor: name.trim() ? 'pointer' : 'not-allowed',
          }}
        >
          Create Vault
        </button>
        <button onClick={() => navigate(-1)} style={{ width: '100%', background: 'none', border: 'none', color: '#6B7280', marginTop: 16, fontSize: 14, cursor: 'pointer' }}>
          ← Back
        </button>
      </div>
    </div>
  );
}
