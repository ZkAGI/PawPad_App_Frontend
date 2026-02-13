import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function CreatingSeedlessVault() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, vaultName } = (location.state as any) || {};

  useEffect(() => {
    createSeedlessVault();
  }, []);

  const createSeedlessVault = async () => {
    try {
      // TODO: Wire to api.createUnifiedVault(email, vaultName) with seedless config
      await new Promise(r => setTimeout(r, 3000));
      navigate('/vault-success', { state: { vaultName, walletType: 'seedless' } });
    } catch (err) {
      console.error('Seedless vault creation failed:', err);
      alert('Failed to create seedless vault.');
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
        border: '3px solid #1E3A5F', borderTopColor: '#A855F7',
        animation: 'spin 1s linear infinite', marginBottom: 24,
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <h2 style={{ color: '#FFFFFF', fontSize: 22, marginBottom: 8 }}>Creating Seedless Vault</h2>
      <p style={{ color: '#6B7280' }}>Setting up FROST threshold signatures...</p>
    </div>
  );
}
