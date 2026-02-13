import { useNavigate } from 'react-router-dom';

export default function Swap() {
  const navigate = useNavigate();

  return (
    <div className="page fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', color: 'var(--text-primary)', fontSize: 20 }}>←</button>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Swap</h1>
      </div>

      <div style={{ textAlign: 'center', paddingTop: 60 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 20px', border: '1px solid var(--border)' }}>
          ⇄
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Coming Soon</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32, lineHeight: 1.5 }}>
          Cross-chain swaps powered by NEAR Intents are under development.
        </p>

        <div className="card" style={{ padding: 20, textAlign: 'left' }}>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 12 }}>Planned Features</p>
          {['SOL ↔ ETH swaps', 'USDC bridging across chains', 'Privacy-preserving via dark pool', 'MEV-protected execution'].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>○</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{f}</span>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/home')} style={{ marginTop: 32, background: 'none', border: 'none', color: '#4ECDC4', fontSize: 14, cursor: 'pointer' }}>
          ← Back to Wallet
        </button>
      </div>
    </div>
  );
}
