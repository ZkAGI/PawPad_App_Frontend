import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuickSummary() {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  const summaryItems = [
    { emoji: '✅', title: 'No seed phrases', text: 'Your private keys never exist in one place', color: '#10B981' },
    { emoji: '🔒', title: 'MPC Security', text: 'Your vault is secured with threshold cryptography', color: '#4ECDC4' },
    { emoji: '📱', title: 'Multi-device security', text: 'Each device holds one vault share', color: '#A855F7' },
    { emoji: '🔄', title: 'Secure recovery', text: 'Restore with backup file + Google Authenticator', color: '#3B82F6' },
  ];

  const recoveryOptions = [
    { emoji: '🛡️', title: 'TEE Wallet', desc: 'Backup file + Google Authenticator', badge: 'NEW', badgeColor: '#33E6BF', route: '/recover-tee' },
    { emoji: '🌱', title: 'Seed Phrase', desc: 'I have a 12-word recovery phrase', route: '/recovery' },
    { emoji: '◈', title: 'Seedless Wallet', desc: 'Old seedless backup + TOTP secret', route: '/recover-seedless' },
    { emoji: '📁', title: 'JSON Backup', desc: 'I have a PawPad backup JSON file', route: '/recovery' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B1426', padding: '80px 24px 40px', overflowY: 'auto' }}>
      {/* Label */}
      <div style={{ display: 'inline-block', backgroundColor: 'rgba(78,205,196,0.12)', padding: '6px 12px', borderRadius: 6, marginBottom: 16 }}>
        <span style={{ fontSize: 13, color: '#4ECDC4', fontWeight: 500, letterSpacing: 0.5 }}>MPC Wallet</span>
      </div>

      <h1 style={{ fontSize: 32, color: '#FFFFFF', marginBottom: 8 }}>Quick Summary</h1>
      <p style={{ color: '#8B95A5', fontSize: 16, marginBottom: 32 }}>Your vault is secured with MPC technology</p>

      {/* Summary items with timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 32 }}>
        {summaryItems.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, position: 'relative', paddingBottom: i < summaryItems.length - 1 ? 24 : 0 }}>
            {/* Timeline line */}
            {i < summaryItems.length - 1 && (
              <div style={{ position: 'absolute', left: 19, top: 40, bottom: 0, width: 2, backgroundColor: '#1E3A5F' }} />
            )}
            {/* Icon */}
            <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: `${item.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, zIndex: 1 }}>
              {item.emoji}
            </div>
            {/* Text */}
            <div>
              <p style={{ color: '#FFFFFF', fontWeight: 600, fontSize: 16 }}>{item.title}</p>
              <p style={{ color: '#8B95A5', fontSize: 14, marginTop: 4 }}>{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Checkbox */}
      <button onClick={() => setIsChecked(!isChecked)} style={{
        display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none',
        cursor: 'pointer', marginBottom: 24, padding: 0, width: '100%', textAlign: 'left',
      }}>
        <div style={{
          width: 24, height: 24, borderRadius: 6, border: `2px solid ${isChecked ? '#4ECDC4' : '#3A4A5F'}`,
          backgroundColor: isChecked ? '#4ECDC4' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          transition: 'all 0.2s',
        }}>
          {isChecked && <span style={{ color: '#0B1426', fontSize: 14, fontWeight: 700 }}>✓</span>}
        </div>
        <span style={{ color: '#8B95A5', fontSize: 14 }}>I understand how MPC wallet security works</span>
      </button>

      {/* Continue */}
      <button onClick={() => isChecked && navigate('/chain-selection')} disabled={!isChecked} style={{
        width: '100%', padding: '16px', borderRadius: 12, border: 'none', cursor: isChecked ? 'pointer' : 'not-allowed',
        backgroundColor: isChecked ? '#4F7FFF' : '#1E3A5F', color: isChecked ? '#FFFFFF' : '#4A5568',
        fontSize: 16, fontWeight: 600, transition: 'all 0.2s', marginBottom: 24,
      }}>
        Get Started
      </button>

      {/* Recover link */}
      <div style={{ textAlign: 'center' }}>
        <span style={{ color: '#6B7280', fontSize: 14 }}>Already have a wallet? </span>
        <button onClick={() => setShowRecoveryModal(true)} style={{ background: 'none', border: 'none', color: '#4ECDC4', fontSize: 14, cursor: 'pointer', fontWeight: 500 }}>
          Recover Wallet
        </button>
      </div>

      {/* Recovery Modal */}
      {showRecoveryModal && (
        <div onClick={() => setShowRecoveryModal(false)} style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            backgroundColor: '#111B2E', borderRadius: '20px 20px 0 0', padding: '24px',
            width: '100%', maxWidth: 430, maxHeight: '80vh', overflowY: 'auto',
          }}>
            <h2 style={{ color: '#FFFFFF', fontSize: 20, marginBottom: 4 }}>How do you want to recover?</h2>
            <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 20 }}>Choose based on how you created your wallet</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recoveryOptions.map((opt, i) => (
                <button key={i} onClick={() => { setShowRecoveryModal(false); navigate(opt.route); }} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '16px',
                  backgroundColor: i === 0 ? 'rgba(51,230,191,0.08)' : '#1A2740',
                  border: i === 0 ? '1px solid rgba(51,230,191,0.2)' : '1px solid #1E3A5F',
                  borderRadius: 12, cursor: 'pointer', width: '100%', textAlign: 'left',
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: i === 0 ? 'rgba(51,230,191,0.15)' : '#1E3A5F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    {opt.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#FFFFFF', fontWeight: 600, fontSize: 15 }}>{opt.title}</span>
                      {opt.badge && (
                        <span style={{ backgroundColor: opt.badgeColor, color: '#000', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>{opt.badge}</span>
                      )}
                    </div>
                    <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>{opt.desc}</p>
                  </div>
                  <span style={{ color: '#4A5568', fontSize: 18 }}>→</span>
                </button>
              ))}
            </div>

            <button onClick={() => setShowRecoveryModal(false)} style={{
              width: '100%', padding: '14px', marginTop: 16, backgroundColor: 'transparent',
              border: '1px solid #2A3A5F', borderRadius: 12, color: '#6B7280', fontSize: 15, cursor: 'pointer',
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
