import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendSOL, sendETH, sendUSDC_SOL, sendUSDC_ETH, isLoggedIn, getStoredWallet, formatAddress, getSolanaBalance, getEvmBalance } from '../services/teeService';

type Chain = 'solana' | 'ethereum';
type Token = 'native' | 'usdc';

export default function Send() {
  const navigate = useNavigate();
  const wallet = getStoredWallet();

  const [chain, setChain] = useState<Chain>('solana');
  const [token, setToken] = useState<Token>('native');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState<'form' | 'confirm' | 'done'>('form');
  const [txHash, setTxHash] = useState('');

  const chainLabel = chain === 'solana' ? 'SOL' : 'ETH';
  const tokenLabel = token === 'native' ? chainLabel : 'USDC';
  const fromAddress = chain === 'solana' ? wallet?.wallets.solana.address : wallet?.wallets.evm.address;

  const handleSend = async () => {
    if (!isLoggedIn()) { navigate('/tee-login'); return; }
    if (!recipient || !amount) return;

    setLoading(true);
    setError('');
    try {
      let result;
      if (chain === 'solana' && token === 'native') result = await sendSOL(recipient, amount);
      else if (chain === 'solana' && token === 'usdc') result = await sendUSDC_SOL(recipient, amount);
      else if (chain === 'ethereum' && token === 'native') result = await sendETH(recipient, amount);
      else result = await sendUSDC_ETH(recipient, amount);

      if (result.ok) {
        setTxHash(result.txHash || '');
        setStep('done');
      } else {
        setError(result.error || 'Transaction failed');
      }
    } catch (err: any) {
      setError(err.message || 'Send failed');
    } finally { setLoading(false); }
  };

  if (step === 'done') {
    return (
      <div className="page fade-in" style={{ textAlign: 'center', paddingTop: 60 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 16px' }}>✓</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Sent!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>{amount} {tokenLabel} sent to</p>
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: 13, marginBottom: 24 }}>{formatAddress(recipient, 10)}</p>
        {txHash && (
          <a
            href={chain === 'solana' ? `https://solscan.io/tx/${txHash}` : `https://etherscan.io/tx/${txHash}`}
            target="_blank" rel="noopener noreferrer"
            style={{ color: '#4ECDC4', fontSize: 13, display: 'block', marginBottom: 24 }}
          >
            View on {chain === 'solana' ? 'Solscan' : 'Etherscan'} →
          </a>
        )}
        <button className="btn-primary" onClick={() => navigate('/home')}>Back to Wallet</button>
      </div>
    );
  }

  return (
    <div className="page fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => step === 'confirm' ? setStep('form') : navigate(-1)} style={{ background: 'none', color: 'var(--text-primary)', fontSize: 20 }}>←</button>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>{step === 'confirm' ? 'Confirm Send' : 'Send'}</h1>
      </div>

      {error && <div style={{ padding: '12px 16px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, marginBottom: 16, color: '#EF4444', fontSize: 14 }}>{error}</div>}

      {step === 'form' && (
        <>
          {/* Chain Selector */}
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: 13, marginBottom: 6 }}>Chain</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button onClick={() => { setChain('solana'); setToken('native'); }} style={{
              flex: 1, padding: 12, borderRadius: 'var(--radius-sm)',
              background: chain === 'solana' ? '#9945FF' : 'var(--bg-card)',
              color: chain === 'solana' ? '#FFF' : 'var(--text-secondary)',
              fontWeight: 600, fontSize: 14, border: chain === 'solana' ? 'none' : '1px solid var(--border)',
            }}>Solana</button>
            <button onClick={() => { setChain('ethereum'); setToken('native'); }} style={{
              flex: 1, padding: 12, borderRadius: 'var(--radius-sm)',
              background: chain === 'ethereum' ? '#627EEA' : 'var(--bg-card)',
              color: chain === 'ethereum' ? '#FFF' : 'var(--text-secondary)',
              fontWeight: 600, fontSize: 14, border: chain === 'ethereum' ? 'none' : '1px solid var(--border)',
            }}>Ethereum</button>
          </div>

          {/* Token Selector */}
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: 13, marginBottom: 6 }}>Token</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button onClick={() => setToken('native')} style={{
              flex: 1, padding: 10, borderRadius: 'var(--radius-sm)',
              background: token === 'native' ? 'var(--bg-card-hover)' : 'var(--bg-card)',
              color: token === 'native' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: 600, fontSize: 14, border: token === 'native' ? '1px solid var(--accent-sol)' : '1px solid var(--border)',
            }}>{chainLabel}</button>
            <button onClick={() => setToken('usdc')} style={{
              flex: 1, padding: 10, borderRadius: 'var(--radius-sm)',
              background: token === 'usdc' ? 'var(--bg-card-hover)' : 'var(--bg-card)',
              color: token === 'usdc' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: 600, fontSize: 14, border: token === 'usdc' ? '1px solid #2775CA' : '1px solid var(--border)',
            }}>USDC</button>
          </div>

          {/* From address */}
          <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', marginBottom: 16, border: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>From: </span>
            <span style={{ color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'monospace' }}>{fromAddress ? formatAddress(fromAddress) : 'No wallet'}</span>
          </div>

          {/* Recipient */}
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: 13, marginBottom: 6 }}>Recipient Address</label>
          <input type="text" placeholder={chain === 'solana' ? 'Enter Solana address...' : 'Enter 0x address...'} value={recipient} onChange={e => setRecipient(e.target.value)} style={{ marginBottom: 16 }} />

          {/* Amount */}
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: 13, marginBottom: 6 }}>Amount ({tokenLabel})</label>
          <input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} style={{ marginBottom: 24 }} />

          <button className="btn-primary" disabled={!recipient || !amount || loading} onClick={() => setStep('confirm')}>
            Review Send
          </button>
        </>
      )}

      {step === 'confirm' && (
        <>
          <div className="card" style={{ padding: 20, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ color: 'var(--text-muted)' }}>Token</span>
              <span style={{ fontWeight: 600 }}>{tokenLabel} ({chain === 'solana' ? 'Solana' : 'Ethereum'})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ color: 'var(--text-muted)' }}>Amount</span>
              <span style={{ fontWeight: 600 }}>{amount} {tokenLabel}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ color: 'var(--text-muted)' }}>From</span>
              <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{fromAddress ? formatAddress(fromAddress) : ''}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>To</span>
              <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{formatAddress(recipient, 8)}</span>
            </div>
          </div>

          <div style={{ padding: '12px 16px', backgroundColor: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 12, marginBottom: 24 }}>
            <p style={{ color: '#F97316', fontSize: 13 }}>Transaction is executed inside TEE. Double check the address — this cannot be reversed.</p>
          </div>

          <button className="btn-primary" disabled={loading} onClick={handleSend} style={{ backgroundColor: loading ? 'var(--bg-card)' : '#10B981' }}>
            {loading ? 'Sending...' : `Confirm & Send ${amount} ${tokenLabel}`}
          </button>
        </>
      )}
    </div>
  );
}
