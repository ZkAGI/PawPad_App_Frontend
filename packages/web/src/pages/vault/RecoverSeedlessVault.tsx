import { useNavigate } from 'react-router-dom';

export default function RecoverSeedlessVault() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B1426', padding: '60px 24px 40px' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#FFFFFF', fontSize: 17, cursor: 'pointer', marginBottom: 24 }}>{'< Back'}</button>
      <h1 style={{ color: '#FFFFFF', fontSize: 28, marginBottom: 8 }}>Recover Seedless Vault</h1>
      <p style={{ color: '#6B7280', fontSize: 15, marginBottom: 32 }}>Enter your old seedless backup + TOTP secret</p>
      <div style={{ padding: 40, backgroundColor: '#111B2E', borderRadius: 16, textAlign: 'center' }}>
        <p style={{ color: '#6B7280' }}>TODO: Wire to RecoverSeedlessVault flow</p>
      </div>
    </div>
  );
}
