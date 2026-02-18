import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredWallet, formatAddress } from '../services/teeService';
import { copyToClipboard } from '../utils/clipboard';
import { IoIosCopy } from 'react-icons/io';

type Chain = 'solana' | 'ethereum';

export default function FundWallet() {
  const navigate = useNavigate();
  const wallet = getStoredWallet();
  const [chain, setChain] = useState<Chain>('solana');
  const [copied, setCopied] = useState(false);

  const address = chain === 'solana' ? wallet?.wallets.solana.address : wallet?.wallets.evm.address;

  const handleCopy = async () => {
    if (address) {
      await copyToClipboard(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="page fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', color: 'var(--text-primary)', fontSize: 20 }}>←</button>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Receive</h1>
      </div>

      {/* Chain Selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button onClick={() => setChain('solana')} style={{
          flex: 1, padding: 12, borderRadius: 'var(--radius-sm)',
          background: chain === 'solana' ? '#9945FF' : 'var(--bg-card)',
          color: chain === 'solana' ? '#FFF' : 'var(--text-secondary)',
          fontWeight: 600, fontSize: 14, border: chain === 'solana' ? 'none' : '1px solid var(--border)',
        }}>Solana</button>
        <button onClick={() => setChain('ethereum')} style={{
          flex: 1, padding: 12, borderRadius: 'var(--radius-sm)',
          background: chain === 'ethereum' ? '#627EEA' : 'var(--bg-card)',
          color: chain === 'ethereum' ? '#FFF' : 'var(--text-secondary)',
          fontWeight: 600, fontSize: 14, border: chain === 'ethereum' ? 'none' : '1px solid var(--border)',
        }}>Ethereum</button>
      </div>

      {/* QR Code */}
      <div className="card" style={{ textAlign: 'center', padding: 24, marginBottom: 16 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>
          Scan to send {chain === 'solana' ? 'SOL or SPL tokens' : 'ETH or ERC-20 tokens'}
        </p>
        {address && (
          <div style={{ display: 'inline-block', padding: 12, backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 16 }}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(address)}`}
              alt="Wallet QR"
              style={{ width: 180, height: 180, display: 'block' }}
            />
          </div>
        )}
        <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>
          {chain === 'solana' ? 'Solana Network' : 'Ethereum Mainnet'}
        </p>
      </div>

      {/* Address */}
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 8 }}>Your {chain === 'solana' ? 'Solana' : 'Ethereum'} Address</p>
        <p style={{ color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: 13, wordBreak: 'break-all', lineHeight: 1.5 }}>
          {address || 'No address found'}
        </p>
      </div>

      {/* Copy Button */}
      <button className="btn-primary" onClick={handleCopy} style={{ backgroundColor: copied ? '#10B981' : undefined }}>
        {copied ? '✓ Copied!' : <><IoIosCopy style={{ marginRight: 6 }} /> Copy Address</>}
      </button>

      {/* Warning */}
      <div style={{ marginTop: 16, padding: '12px 16px', backgroundColor: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.15)', borderRadius: 12 }}>
        <p style={{ color: '#F97316', fontSize: 12 }}>
          Only send {chain === 'solana' ? 'Solana network' : 'Ethereum mainnet'} assets to this address. Sending other network tokens may result in permanent loss.
        </p>
      </div>
    </div>
  );
}
