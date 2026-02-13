import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function CreatingVault() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, vaultName, walletType } = (location.state as any) || {};

  useEffect(() => {
    createVault();
  }, []);

  const createVault = async () => {
    try {
      // TODO: Wire to api.createUnifiedVault(email, vaultName)
      // const result = await api.createUnifiedVault(email, vaultName);
      // Store vault data
      await new Promise(r => setTimeout(r, 3000));
      navigate('/vault-success', { state: { vaultName, walletType } });
    } catch (err) {
      console.error('Vault creation failed:', err);
      alert('Failed to create vault. Please try again.');
      navigate(-1);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#0B1426',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 24, textAlign: 'center',
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        border: '3px solid #1E3A5F', borderTopColor: '#4ECDC4',
        animation: 'spin 1s linear infinite', marginBottom: 24,
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <h2 style={{ color: '#FFFFFF', fontSize: 22, marginBottom: 8 }}>Creating Vault</h2>
      <p style={{ color: '#6B7280' }}>Setting up "{vaultName || 'your vault'}"...</p>
      <p style={{ color: '#4ECDC4', fontSize: 13, marginTop: 16 }}>Generating keys & configuring MPC</p>
    </div>
  );
}
