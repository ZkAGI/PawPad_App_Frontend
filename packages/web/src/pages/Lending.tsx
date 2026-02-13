import { useNavigate } from 'react-router-dom';
export default function Lending() {
  const navigate = useNavigate();
  return (
    <div className="page fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', color: 'var(--text-primary)', fontSize: 20 }}>←</button>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Lending</h1>
      </div>
      <div className="card" style={{ textAlign: 'center', padding: 40 }}>
        <p style={{ color: 'var(--text-muted)' }}>TODO: Port from React Native screen</p>
      </div>
    </div>
  );
}
