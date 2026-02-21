import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recoverAndRotate, saveWalletData, type TEEBackupFile } from '../../services/teeService';
import { copyToClipboard } from '../../utils/clipboard';

export default function RecoverTEEWallet() {
  const [backupFile, setBackupFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'upload' | 'step1_totp' | 'step2_backup' | 'step3_confirm'>('upload');
  const [recoveryResult, setRecoveryResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [backupDownloaded, setBackupDownloaded] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
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
      let backup: TEEBackupFile;
      try {
        backup = JSON.parse(content);
      } catch {
        throw new Error('Invalid backup file format. Must be a valid JSON file.');
      }
      if (!backup.uid || !backup.ct_b64) {
        throw new Error('This doesn\'t look like a PawPad backup file. Missing required fields.');
      }

      const result = await recoverAndRotate(backup);
      setRecoveryResult(result);
      setStep('step1_totp');
    } catch (err: any) {
      const msg = err.message || 'Recovery failed';
      if (msg.includes('internal_error') || msg.includes('Internal')) {
        setError('Server error — the TEE backend may be temporarily down. Please try again in a few minutes.');
      } else if (msg.includes('CORS') || msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        setError('Network error — unable to reach the recovery server. Check your connection and try again.');
      } else if (msg.includes('not found') || msg.includes('unknown')) {
        setError('This backup file is not recognized. It may belong to a different wallet or be outdated.');
      } else {
        setError(msg);
      }
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
    setBackupDownloaded(true);
  };

  const handleLoginAfterRecovery = () => {
    if (recoveryResult) {
      saveWalletData({
        uid: recoveryResult.uid,
        wallets: {
          solana: { address: '' },
          evm: { chain: '', address: '' },
        },
      });
      navigate('/tee-login');
    }
  };

  // ── Step 1: Scan new TOTP QR ──
  if (step === 'step1_totp' && recoveryResult) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0B1426', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 24px 40px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, width: '100%', maxWidth: 340 }}>
          {[1, 2, 3].map(n => (
            <div key={n} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: n === 1 ? '#4ECDC4' : '#1E3A5F' }} />
          ))}
        </div>
        <p style={{ color: '#4ECDC4', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>STEP 1 OF 3</p>
        <h2 style={{ color: '#FFF', fontSize: 24, marginBottom: 8 }}>Scan New TOTP</h2>
        <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 24, textAlign: 'center' }}>Open Google Authenticator and scan this QR code to add your new login credential.</p>

        <div style={{ width: '100%', maxWidth: 340, padding: 20, backgroundColor: '#111B2E', borderRadius: 16, border: '1px solid #1E3A5F', marginBottom: 24 }}>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(recoveryResult.new_totp.otpauth_uri)}`}
            alt="TOTP QR Code"
            style={{ width: 200, height: 200, borderRadius: 8, margin: '0 auto 16px', display: 'block', backgroundColor: '#FFF', padding: 8 }}
          />
          <p style={{ color: '#6B7280', fontSize: 12, textAlign: 'center', marginBottom: 12 }}>Or enter this secret manually:</p>
          <div
            style={{ padding: '10px 14px', backgroundColor: '#0B1426', borderRadius: 8, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            onClick={() => copyToClipboard(recoveryResult.new_totp.secret).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })}
          >
            <span style={{ color: '#4ECDC4', fontSize: 14, fontFamily: 'monospace', fontWeight: 600 }}>{recoveryResult.new_totp.secret}</span>
            <span style={{ color: copied ? '#33E6BF' : '#6B7280', fontSize: 12, flexShrink: 0, marginLeft: 8 }}>{copied ? '✓ Copied' : 'Copy'}</span>
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: 340, padding: '12px 16px', backgroundColor: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 12, marginBottom: 24 }}>
          <p style={{ color: '#FF6B6B', fontSize: 13, textAlign: 'center' }}>⚠️ Your old TOTP code will no longer work after this recovery.</p>
        </div>

        <button
          onClick={() => setStep('step2_backup')}
          style={{ width: '100%', maxWidth: 340, padding: 16, borderRadius: 12, border: 'none', backgroundColor: '#4ECDC4', color: '#0B1426', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}
        >
          I've Scanned the QR → Next
        </button>
      </div>
    );
  }

  // ── Step 2: Download new backup (mandatory) ──
  if (step === 'step2_backup' && recoveryResult) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0B1426', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 24px 40px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, width: '100%', maxWidth: 340 }}>
          {[1, 2, 3].map(n => (
            <div key={n} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: n <= 2 ? '#4ECDC4' : '#1E3A5F' }} />
          ))}
        </div>
        <p style={{ color: '#4ECDC4', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>STEP 2 OF 3</p>
        <h2 style={{ color: '#FFF', fontSize: 24, marginBottom: 8 }}>Save New Backup</h2>
        <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 24, textAlign: 'center' }}>Download your new backup file. This is the ONLY way to recover your wallet if you lose your phone.</p>

        <div style={{ width: '100%', maxWidth: 340, padding: 24, backgroundColor: '#111B2E', borderRadius: 16, border: '1px solid #1E3A5F', marginBottom: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔐</div>
          <p style={{ color: '#FFF', fontWeight: 600, marginBottom: 4 }}>New Backup File</p>
          <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 20 }}>pawpad-backup-{recoveryResult.uid.slice(0, 8)}-new.json</p>

          <button
            onClick={downloadNewBackup}
            style={{
              width: '100%',
              padding: 14,
              borderRadius: 12,
              backgroundColor: backupDownloaded ? '#111B2E' : '#4ECDC4',
              color: backupDownloaded ? '#33E6BF' : '#0B1426',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              border: backupDownloaded ? '1px solid #33E6BF' : 'none',
            }}
          >
            {backupDownloaded ? '✓ Backup Downloaded' : '📥 Download Backup File'}
          </button>
        </div>

        <div style={{ width: '100%', maxWidth: 340, padding: '12px 16px', backgroundColor: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 12, marginBottom: 24 }}>
          <p style={{ color: '#FF6B6B', fontSize: 13, textAlign: 'center' }}>⚠️ Your old backup file is now INVALID. You must save this new one.</p>
        </div>

        {!backupDownloaded && (
          <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 16 }}>You must download the backup to continue.</p>
        )}

        <button
          onClick={() => setStep('step3_confirm')}
          disabled={!backupDownloaded}
          style={{
            width: '100%',
            maxWidth: 340,
            padding: 16,
            borderRadius: 12,
            border: 'none',
            backgroundColor: backupDownloaded ? '#4ECDC4' : '#1E3A5F',
            color: backupDownloaded ? '#0B1426' : '#4A5568',
            fontSize: 16,
            fontWeight: 700,
            cursor: backupDownloaded ? 'pointer' : 'not-allowed',
          }}
        >
          {backupDownloaded ? 'Next →' : 'Download Backup First'}
        </button>
      </div>
    );
  }

  // ── Step 3: Confirm and login ──
  if (step === 'step3_confirm' && recoveryResult) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0B1426', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 24px 40px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, width: '100%', maxWidth: 340 }}>
          {[1, 2, 3].map((n) => (
            <div key={n} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: '#4ECDC4' }} />
          ))}
        </div>
        <p style={{ color: '#4ECDC4', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>STEP 3 OF 3</p>

        <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 16 }}>✓</div>
        <h2 style={{ color: '#FFF', fontSize: 24, marginBottom: 8 }}>Recovery Complete!</h2>
        <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 32, textAlign: 'center' }}>Confirm you've completed both steps before logging in.</p>

        <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          <div style={{ padding: '14px 16px', backgroundColor: '#111B2E', borderRadius: 12, border: '1px solid #1E3A5F', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#FFF', flexShrink: 0 }}>✓</div>
            <p style={{ color: '#FFF', fontSize: 14 }}>New TOTP added to authenticator app</p>
          </div>
          <div style={{ padding: '14px 16px', backgroundColor: '#111B2E', borderRadius: 12, border: '1px solid #1E3A5F', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#FFF', flexShrink: 0 }}>✓</div>
            <p style={{ color: '#FFF', fontSize: 14 }}>New backup file downloaded and saved</p>
          </div>

          <div
            onClick={() => setConfirmed(!confirmed)}
            style={{ padding: '14px 16px', backgroundColor: confirmed ? 'rgba(78,205,196,0.08)' : '#111B2E', borderRadius: 12, border: `1px solid ${confirmed ? '#4ECDC4' : '#1E3A5F'}`, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
          >
            <div style={{
              width: 24, height: 24, borderRadius: 6, flexShrink: 0,
              backgroundColor: confirmed ? '#4ECDC4' : 'transparent',
              border: confirmed ? 'none' : '2px solid #4A5568',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, color: '#0B1426', fontWeight: 700,
            }}>
              {confirmed && '✓'}
            </div>
            <p style={{ color: confirmed ? '#FFF' : '#6B7280', fontSize: 14 }}>
              I confirm I have saved my new TOTP and backup file securely
            </p>
          </div>
        </div>

        <button
          onClick={handleLoginAfterRecovery}
          disabled={!confirmed}
          style={{
            width: '100%',
            maxWidth: 340,
            padding: 16,
            borderRadius: 12,
            border: 'none',
            backgroundColor: confirmed ? '#A855F7' : '#1E3A5F',
            color: confirmed ? '#FFF' : '#4A5568',
            fontSize: 16,
            fontWeight: 700,
            cursor: confirmed ? 'pointer' : 'not-allowed',
          }}
        >
          Login with New TOTP →
        </button>
      </div>
    );
  }

  // ── Upload step ──
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B1426', padding: '60px 24px 40px' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#FFF', fontSize: 17, cursor: 'pointer', marginBottom: 24 }}>{'< Back'}</button>
      <h1 style={{ color: '#FFF', fontSize: 28, marginBottom: 8 }}>Recover TEE Wallet</h1>
      <p style={{ color: '#6B7280', fontSize: 15, marginBottom: 32 }}>Upload your backup file to rotate credentials</p>

      {error && <div style={{ padding: '12px 16px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, marginBottom: 16, color: '#EF4444', fontSize: 14 }}>{error}</div>}

      <div onClick={() => document.getElementById('file-input')?.click()} style={{ padding: '32px 20px', backgroundColor: '#111B2E', border: `2px dashed ${backupFile ? '#33E6BF' : '#1E3A5F'}`, borderRadius: 16, textAlign: 'center', cursor: 'pointer', marginBottom: 24 }}>
        <input id="file-input" type="file" accept=".json,.txt" hidden onChange={handleFileUpload} />
        {backupFile ? (
          <><span style={{ fontSize: 32 }}>📄</span><p style={{ color: '#33E6BF', fontWeight: 600, marginTop: 8 }}>{backupFile.name}</p><p style={{ color: '#6B7280', fontSize: 13, marginTop: 4 }}>Tap to change</p></>
        ) : (
          <><span style={{ fontSize: 32 }}>📁</span><p style={{ color: '#FFF', fontWeight: 500, marginTop: 8 }}>Upload backup file</p><p style={{ color: '#6B7280', fontSize: 13, marginTop: 4 }}>pawpad-backup-*.json or .txt</p></>
        )}
      </div>

      <button onClick={handleRecover} disabled={!backupFile || loading} style={{ width: '100%', padding: 16, borderRadius: 12, border: 'none', backgroundColor: backupFile && !loading ? '#33E6BF' : '#1E3A5F', color: backupFile && !loading ? '#0B1426' : '#4A5568', fontSize: 16, fontWeight: 600, cursor: backupFile && !loading ? 'pointer' : 'not-allowed' }}>
        {loading ? '⏳ Recovering...' : 'Recover Wallet'}
      </button>
    </div>
  );
}