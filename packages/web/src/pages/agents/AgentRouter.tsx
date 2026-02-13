import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTradeConfig, isLoggedIn } from '../../services/teeService';

export default function AgentRouter() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAgent();
  }, []);

  const checkAgent = async () => {
    if (!isLoggedIn()) {
      // Not logged in — go to setup (which will redirect to login if needed)
      navigate('/agents/setup', { replace: true });
      return;
    }

    try {
      const res = await getTradeConfig();
      if (res.config?.tradingEnabled && res.config?.uid) {
        // Agent exists and is active → dashboard
        navigate('/agents/dashboard', { replace: true });
      } else {
        // No agent configured → setup
        navigate('/agents/setup', { replace: true });
      }
    } catch {
      navigate('/agents/setup', { replace: true });
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B1426', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #1E3A5F', borderTopColor: '#4ECDC4', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
