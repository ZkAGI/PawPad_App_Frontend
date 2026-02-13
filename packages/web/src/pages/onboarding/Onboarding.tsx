import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      minHeight: '100vh', backgroundColor: '#0A1628', padding: '0 32px', position: 'relative',
    }}>
      <img src="/images/icons/logo.png" alt="PawPad" style={{ width: 80, height: 80, marginBottom: 32 }} />

      <h1 style={{ fontSize: 36, color: '#FFFFFF', textAlign: 'center', lineHeight: 1.3 }}>
        Say goodbye to{' '}
        <span style={{ color: '#4ECDC4' }}>seed phrases</span>
      </h1>

      <p style={{ color: '#6B7280', fontSize: 15, textAlign: 'center', marginTop: 16, maxWidth: 300 }}>
        Privacy-first agentic wallet with AI agents — powered by TEE & FROST MPC
      </p>

      <button
        onClick={() => navigate('/mxe-explanation')}
        style={{
          position: 'absolute', bottom: 80, left: 32, right: 32,
          backgroundColor: '#4F7FFF', color: '#FFFFFF',
          padding: '16px 48px', borderRadius: 12,
          fontSize: 16, fontWeight: 600, border: 'none', cursor: 'pointer',
        }}
      >
        Get Started
      </button>
    </div>
  );
}
