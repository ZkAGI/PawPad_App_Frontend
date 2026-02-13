import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function EmailInput() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const walletType = (location.state as any)?.walletType || 'seed';

  const handleContinue = () => {
    // Pass email + walletType to next screen
    navigate('/vault-name', { state: { email, walletType } });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B1426', padding: '60px 24px 40px', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ fontSize: 28, color: '#FFFFFF', marginBottom: 8 }}>Your Email</h1>
      <p style={{ color: '#6B7280', fontSize: 15, marginBottom: 32 }}>Used for vault recovery and notifications</p>

      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
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
          onClick={handleContinue}
          disabled={!email.includes('@')}
          style={{
            width: '100%', padding: '16px', borderRadius: 12, border: 'none',
            backgroundColor: email.includes('@') ? '#4F7FFF' : '#1E3A5F',
            color: email.includes('@') ? '#FFFFFF' : '#4A5568',
            fontSize: 16, fontWeight: 600, cursor: email.includes('@') ? 'pointer' : 'not-allowed',
          }}
        >
          Continue
        </button>
        <button onClick={() => navigate(-1)} style={{ width: '100%', background: 'none', border: 'none', color: '#6B7280', marginTop: 16, fontSize: 14, cursor: 'pointer' }}>
          ← Back
        </button>
      </div>
    </div>
  );
}
