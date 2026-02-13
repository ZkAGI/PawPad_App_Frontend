import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      minHeight: '100vh', backgroundColor: '#0A1628', padding: '0 32px', position: 'relative',
    }}>
      <h1 style={{ fontSize: 36, color: '#FFFFFF', textAlign: 'center', lineHeight: 1.3 }}>
        Say goodbye to{' '}
        <span style={{ color: '#4ECDC4' }}>seed phrases</span>
      </h1>

      <button
        onClick={() => navigate('/mxe-explanation')}
        style={{
          position: 'absolute', bottom: 60,
          backgroundColor: '#4F7FFF', color: '#FFFFFF',
          padding: '16px 48px', borderRadius: 12,
          fontSize: 16, fontWeight: 600, border: 'none', cursor: 'pointer',
        }}
      >
        Continue
      </button>
    </div>
  );
}
