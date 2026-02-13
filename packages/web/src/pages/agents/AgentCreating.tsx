import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AgentCreating() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate('/agents', { state: { justCreated: true } }), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B1426', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid #1E3A5F', borderTopColor: '#4ECDC4', animation: 'spin 1s linear infinite', marginBottom: 24 }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <h2 style={{ color: '#FFF', fontSize: 22, marginBottom: 8 }}>Creating Agent</h2>
      <p style={{ color: '#6B7280' }}>Configuring your trading agent...</p>
    </div>
  );
}
