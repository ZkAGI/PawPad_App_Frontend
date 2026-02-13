import { truncateAddress } from '@pawpad/core';

export default function Receive() {
  // TODO: Pull from VaultContext
  const address = '4Zw3kJ8nFqRx9mPvB7tY2LdQh6sNwXcA8xK2';

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    // TODO: Show toast
  };

  return (
    <div className="page fade-in" style={{ textAlign: 'center', paddingTop: 40 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Receive</h1>

      {/* QR Code placeholder — use qrcode.react */}
      <div style={{
        width: 200, height: 200, margin: '0 auto 24px',
        background: 'white', borderRadius: 'var(--radius)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#333', fontSize: 14
      }}>
        {/* TODO: Replace with <QRCodeSVG value={address} /> */}
        QR Code
      </div>

      <p style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16, wordBreak: 'break-all', padding: '0 20px' }}>
        {address}
      </p>

      <button className="btn-primary" onClick={handleCopy} style={{ maxWidth: 200, margin: '0 auto' }}>
        Copy Address
      </button>
    </div>
  );
}
