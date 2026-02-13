import { useState } from 'react';
import { copyToClipboard } from '../../utils/clipboard';
import { IoIosCopy } from 'react-icons/io';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatAddress, parseTOTPUri, type TEEWallets, type TOTPConfig, type TEEBackupFile } from '../../services/teeService';

interface SetupState {
  uid: string;
  wallets: TEEWallets;
  totp: TOTPConfig;
  backup_file: TEEBackupFile;
  backup_hash: string;
}

export default function TEESetup() {
  const [step, setStep] = useState<'totp' | 'backup'>('totp');
  const [downloaded, setDownloaded] = useState(false);
  const [copied, setCopied] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as SetupState | null;

  if (!state?.uid) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0B1426', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#EF4444', marginBottom: 16 }}>No wallet data found. Please create a wallet first.</p>
          <button onClick={() => navigate('/chain-selection')} style={{ backgroundColor: '#4F7FFF', color: '#FFF', padding: '12px 24px', borderRadius: 12, border: 'none', cursor: 'pointer' }}>Go Back</button>
        </div>
      </div>
    );
  }

  const { uid, wallets, totp, backup_file, backup_hash } = state;
  const totpInfo = parseTOTPUri(totp.otpauth_uri);

  const downloadBackup = () => {
    setDownloaded(true);
    const blob = new Blob([JSON.stringify(backup_file, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pawpad-backup-${uid.slice(0, 8)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B1426', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>

      {step === 'totp' && (
        <>
          <h2 style={{ color: '#FFF', fontSize: 24, marginBottom: 8 }}>Save Your TOTP</h2>
          <p style={{ color: '#6B7280', marginBottom: 24 }}>Scan this with your authenticator app</p>

          {/* Wallet addresses created */}
          <div style={{ width: '100%', maxWidth: 340, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#111B2E', borderRadius: 8, border: '1px solid #1E3A5F' }}>
              <span style={{ color: '#9945FF', fontSize: 13, fontWeight: 600 }}>Solana</span>
              <span style={{ color: '#8B95A5', fontSize: 13, fontFamily: 'monospace' }}>{formatAddress(wallets.solana.address)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#111B2E', borderRadius: 8, border: '1px solid #1E3A5F' }}>
              <span style={{ color: '#627EEA', fontSize: 13, fontWeight: 600 }}>EVM</span>
              <span style={{ color: '#8B95A5', fontSize: 13, fontFamily: 'monospace' }}>{formatAddress(wallets.evm.address)}</span>
            </div>
          </div>

          {/* QR Code card */}
          <div style={{ width: '100%', maxWidth: 340, padding: 24, backgroundColor: '#111B2E', borderRadius: 16, border: '1px solid #1E3A5F', marginBottom: 16 }}>
            {/* Actual QR — use a library like qrcode.react in production */}
            <div style={{ width: 180, height: 180, backgroundColor: '#FFFFFF', borderRadius: 12, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(totp.otpauth_uri)}`}
                alt="TOTP QR Code"
                style={{ width: 170, height: 170, borderRadius: 8 }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <p style={{ color: '#6B7280', fontSize: 12, marginBottom: 12 }}>Or enter manually:</p>
            <div onClick={async () => { await copyToClipboard(totpInfo.secret); setCopied('secret'); setTimeout(() => setCopied(''), 2000); }} style={{ padding: '10px 12px', backgroundColor: '#0B1426', borderRadius: 8, wordBreak: 'break-all', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#4ECDC4', fontSize: 14, fontFamily: 'monospace', fontWeight: 600 }}>{totpInfo.secret}</span>
              <span style={{ color: copied === 'secret' ? '#33E6BF' : '#6B7280', fontSize: 12, flexShrink: 0, marginLeft: 8 }}>{copied === 'secret' ? 'Copied' : 'Copy'}</span>
            </div>
          </div>

          <p style={{ color: '#FF6B6B', fontSize: 13, marginBottom: 24 }}>⚠️ Save this — you'll need it to login and recover</p>

          <button onClick={() => setStep('backup')} style={{ width: '100%', maxWidth: 340, padding: 16, borderRadius: 12, border: 'none', backgroundColor: '#A855F7', color: '#FFF', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
            I've saved it
          </button>
        </>
      )}

      {step === 'backup' && (
        <>
          <h2 style={{ color: '#FFF', fontSize: 24, marginBottom: 8 }}>Download Backup</h2>
          <p style={{ color: '#6B7280', marginBottom: 16 }}>Your encrypted backup file is ready</p>
          <div style={{ padding: '12px 16px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, marginBottom: 24, maxWidth: 340, width: '100%' }}>
            <p style={{ color: '#FF6B6B', fontSize: 13, fontWeight: 600 }}>⚠️ Download now — this backup won't be available again.</p>
            <p style={{ color: '#FF6B6B', fontSize: 12, marginTop: 4 }}>Recovery is impossible without your backup file.</p>
          </div>
          <div style={{ padding: '12px 16px', backgroundColor: 'rgba(78,205,196,0.08)', border: '1px solid rgba(78,205,196,0.2)', borderRadius: 12, marginBottom: 24, maxWidth: 340, width: '100%' }}>
            <p style={{ color: '#4ECDC4', fontSize: 13 }}>💡 Tip: Store a copy on Google Drive, iCloud, or another cloud service. If your device is lost, you'll need this file to recover your wallet on a new device.</p>
          </div>

          <div style={{ width: '100%', maxWidth: 340, marginBottom: 24 }}>
            <div style={{ padding: '16px', backgroundColor: '#111B2E', borderRadius: 12, border: '1px solid #1E3A5F', marginBottom: 8, textAlign: 'left' }}>
              <p style={{ color: '#33E6BF', fontWeight: 600, fontSize: 14 }}>📄 pawpad-backup-{uid.slice(0, 8)}.json</p>
              <p style={{ color: '#6B7280', fontSize: 12, marginTop: 4 }}>UID: {uid}</p>
              <p style={{ color: '#6B7280', fontSize: 12 }}>Hash: {backup_hash?.slice(0, 16)}...</p>
            </div>
          </div>

          <button onClick={downloadBackup} style={{ width: '100%', maxWidth: 340, padding: 16, borderRadius: 12, border: '1px solid #2A3A5F', backgroundColor: '#111B2E', color: '#FFF', fontSize: 16, fontWeight: 600, cursor: 'pointer', marginBottom: 12 }}>
            📥 Download Backup File
          </button>

          <button onClick={() => downloaded && navigate('/home')} disabled={!downloaded} style={{ width: '100%', maxWidth: 340, padding: 16, borderRadius: 12, border: 'none', backgroundColor: downloaded ? '#A855F7' : '#1E3A5F', color: downloaded ? '#FFF' : '#4A5568', fontSize: 16, fontWeight: 600, cursor: downloaded ? 'pointer' : 'not-allowed' }}>
            {downloaded ? 'Go to Wallet' : 'Download backup first'}
          </button>
        </>
      )}
    </div>
  );
}
