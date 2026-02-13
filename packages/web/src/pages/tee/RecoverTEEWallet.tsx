import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recoverAndRotate, saveWalletData, login, type TEEBackupFile } from '../../services/teeService';

export default function RecoverTEEWallet() {
  const [backupFile, setBackupFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'upload' | 'recovered'>('upload');
  const [recoveryResult, setRecoveryResult] = useState<any>(null);
  const navigate = useNavigate();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBackupFile(e.target.files?.[0] || null);
    setError('');
  };

  const handleRecover = async () => {
    if (!backupFile) return;
    setLoading(true);
    setError('');
    try {
      const content = await backupFile.text();
      const backup: TEEBackupFile = JSON.parse(content);

      // REAL API: POST /v1/recovery/rotate
      const result = await recoverAndRotate(backup);

      setRecoveryResult(result);
      setStep('recovered');
    } catch (err: any) {
      setError(err.message || 'Recovery failed. Check your backup file.');
    } finally { setLoading(false); }
  };

  const downloadNewBackup = () => {
    if (!recoveryResult?.new_backup_file) return;
    const blob = new Blob([JSON.stringify(recoveryResult.new_backup_file, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pawpad-backup-${recoveryResult.uid.slice(0, 8)}-new.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoginAfterRecovery = async () => {
    if (recoveryResult) {
      // Save uid so login screen knows which wallet
      saveWalletData({
        uid: recoveryResult.uid,
        wallets: {
          solana: { address: '' },
          evm: { address: '' },
        },
      });
      // Go to login — user enters new TOTP code, login returns full wallet addresses
      navigate('/tee-login');
    }
  };

  if (step === 'recovered' && recoveryResult) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0B1426', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 16 }}>✓</div>
        <h2 style={{ color: '#FFF', fontSize: 24, marginBottom: 8 }}>Wallet Recovered!</h2>
        <p style={{ color: '#6B7280', marginBottom: 24 }}>Your credentials have been rotated. Save your new TOTP and backup.</p>

        {/* New TOTP */}
        <div style={{ width: '100%', maxWidth: 340, padding: 20, backgroundColor: '#111B2E', borderRadius: 16, border: '1px solid #1E3A5F', marginBottom: 16 }}>
          <p style={{ color: '#FFF', fontWeight: 600, marginBottom: 12 }}>New TOTP Secret</p>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(recoveryResult.new_totp.otpauth_uri)}`} alt="QR" style={{ width: 160, height: 160, borderRadius: 8, margin: '0 auto 12px', display: 'block', backgroundColor: '#FFF' }} />
          <div style={{ padding: '8px 12px', backgroundColor: '#0B1426', borderRadius: 8, wordBreak: 'break-all' }}>
            <span style={{ color: '#4ECDC4', fontSize: 13, fontFamily: 'monospace' }}>{recoveryResult.new_totp.secret}</span>
          </div>
        </div>

        <p style={{ color: '#FF6B6B', fontSize: 13, marginBottom: 16 }}>⚠️ Old TOTP and backup are now INVALID</p>

        <button onClick={downloadNewBackup} style={{ width: '100%', maxWidth: 340, padding: 14, borderRadius: 12, border: '1px solid #2A3A5F', backgroundColor: '#111B2E', color: '#FFF', fontSize: 15, cursor: 'pointer', marginBottom: 12 }}>
          📥 Download New Backup
        </button>
        <button onClick={handleLoginAfterRecovery} style={{ width: '100%', maxWidth: 340, padding: 14, borderRadius: 12, border: 'none', backgroundColor: '#A855F7', color: '#FFF', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          Login with New TOTP →
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B1426', padding: '60px 24px 40px' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#FFF', fontSize: 17, cursor: 'pointer', marginBottom: 24 }}>{'< Back'}</button>
      <h1 style={{ color: '#FFF', fontSize: 28, marginBottom: 8 }}>Recover TEE Wallet</h1>
      <p style={{ color: '#6B7280', fontSize: 15, marginBottom: 32 }}>Upload your backup file to rotate credentials</p>

      {error && <div style={{ padding: '12px 16px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, marginBottom: 16, color: '#EF4444', fontSize: 14 }}>{error}</div>}

      <div onClick={() => document.getElementById('file-input')?.click()} style={{ padding: '32px 20px', backgroundColor: '#111B2E', border: `2px dashed ${backupFile ? '#33E6BF' : '#1E3A5F'}`, borderRadius: 16, textAlign: 'center', cursor: 'pointer', marginBottom: 24 }}>
        <input id="file-input" type="file" accept=".json" hidden onChange={handleFileUpload} />
        {backupFile ? (
          <><span style={{ fontSize: 32 }}>📄</span><p style={{ color: '#33E6BF', fontWeight: 600, marginTop: 8 }}>{backupFile.name}</p><p style={{ color: '#6B7280', fontSize: 13, marginTop: 4 }}>Tap to change</p></>
        ) : (
          <><span style={{ fontSize: 32 }}>📁</span><p style={{ color: '#FFF', fontWeight: 500, marginTop: 8 }}>Upload backup file</p><p style={{ color: '#6B7280', fontSize: 13, marginTop: 4 }}>pawpad-backup-*.json</p></>
        )}
      </div>

      <button onClick={handleRecover} disabled={!backupFile || loading} style={{ width: '100%', padding: 16, borderRadius: 12, border: 'none', backgroundColor: backupFile && !loading ? '#33E6BF' : '#1E3A5F', color: backupFile && !loading ? '#0B1426' : '#4A5568', fontSize: 16, fontWeight: 600, cursor: backupFile && !loading ? 'pointer' : 'not-allowed' }}>
        {loading ? '⏳ Recovering...' : 'Recover Wallet'}
      </button>
    </div>
  );
}
