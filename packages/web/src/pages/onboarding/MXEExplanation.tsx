import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const COLORS = {
  bgPrimary: '#0B1426',
  accent: '#4ECDC4',
  textPrimary: '#FFFFFF',
  textMuted: '#6B7280',
  progressInactive: '#1E3A5F',
};

const steps = [
  { title: 'Say hello to vault shares, your new recovery method', highlights: ['vault shares,'], image: '/images/mxe/1.png' },
  { title: "They're split into different parts for increased security, removing single-point of failure", highlights: ['different', 'parts for increased', 'security,'], image: '/images/mxe/2.png' },
  { title: 'Each device in your vault holds one vault share', highlights: ['Each device', 'one vault share'], image: '/images/mxe/3.png' },
  { title: 'Always back up your vault shares individually, each in a different location', highlights: ['Always back up', 'different location'], image: '/images/mxe/4.png' },
  { title: 'These shares collaborate to unlock your vault.', highlights: ['collaborate', 'unlock your vault.'], image: '/images/mxe/5.png' },
];

function HighlightedText({ text, highlights }: { text: string; highlights: string[] }) {
  let parts: { text: string; highlight: boolean }[] = [{ text, highlight: false }];
  highlights.forEach((hl) => {
    const next: typeof parts = [];
    parts.forEach((part) => {
      if (part.highlight) { next.push(part); return; }
      const regex = new RegExp(`(${hl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      part.text.split(regex).forEach((s) => {
        if (s.toLowerCase() === hl.toLowerCase()) next.push({ text: s, highlight: true });
        else if (s) next.push({ text: s, highlight: false });
      });
    });
    parts = next;
  });
  return (
    <span>
      {parts.map((p, i) => (
        <span key={i} style={{ color: p.highlight ? COLORS.accent : COLORS.textPrimary }}>{p.text}</span>
      ))}
    </span>
  );
}

export default function MXEExplanation() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else navigate('/quick-summary');
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else navigate(-1);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      minHeight: '100vh', backgroundColor: COLORS.bgPrimary,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', flexShrink: 0 }}>
        <button onClick={handleBack} style={{ background: 'none', border: 'none', color: COLORS.textPrimary, fontSize: 17, cursor: 'pointer' }}>
          {'<'} Back
        </button>
        <button onClick={() => navigate('/quick-summary')} style={{ background: 'none', border: 'none', color: COLORS.textMuted, fontSize: 17, cursor: 'pointer' }}>
          Skip
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ display: 'flex', padding: '0 24px', gap: 10, marginTop: 4, flexShrink: 0 }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 1.5,
            backgroundColor: i <= step ? COLORS.accent : COLORS.progressInactive,
            transition: 'background-color 0.3s',
          }} />
        ))}
      </div>

      {/* Image - real vault images */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', overflow: 'hidden' }}>
        <img
          src={steps[step].image}
          alt={`Step ${step + 1}`}
          style={{
            maxWidth: '80%', maxHeight: '45vh', objectFit: 'contain',
            borderRadius: 16,
            transition: 'opacity 0.3s',
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: '0 28px 20px', textAlign: 'center', flexShrink: 0 }}>
        <p style={{ fontSize: 22, lineHeight: 1.5 }}>
          <HighlightedText text={steps[step].title} highlights={steps[step].highlights} />
        </p>
      </div>

      {/* Next button */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 40, flexShrink: 0 }}>
        <button onClick={handleNext} style={{
          backgroundColor: COLORS.accent, width: 72, height: 44, borderRadius: 22,
          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 8px rgba(78,205,196,0.3)',
        }}>
          <span style={{ color: COLORS.bgPrimary, fontSize: 26, fontWeight: 600 }}>→</span>
        </button>
      </div>
    </div>
  );
}
