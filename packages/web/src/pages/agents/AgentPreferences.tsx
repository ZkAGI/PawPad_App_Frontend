import { useNavigate } from 'react-router-dom';

export default function AgentPreferences() {
  const navigate = useNavigate();
  // This screen is mainly for non-TEE wallets; TEE uses AgentSetup directly
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B1426', padding: '60px 24px', textAlign: 'center' }}>
      <h1 style={{ color: '#FFF', fontSize: 24, marginBottom: 16 }}>Agent Preferences</h1>
      <p style={{ color: '#6B7280', marginBottom: 32 }}>Fine-tune your agent's behavior</p>
      <button onClick={() => navigate('/agents/setup')} style={{ backgroundColor: '#4F7FFF', color: '#FFF', padding: '14px 32px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 600 }}>
        Go to Setup →
      </button>
    </div>
  );
}
