import { Shield, Zap, Lock, Star, Server } from 'lucide-react';

const TRUST_ITEMS = [
  { icon: Star,   label: '31+ Free Tools',    sub: 'Always free, no limits' },
  { icon: Server, label: 'Zero Uploads, Ever', sub: 'Files stay on your device' },
  { icon: Lock,   label: 'No Sign-up',         sub: 'Use instantly, no account' },
  { icon: Zap,    label: 'WASM Powered',        sub: 'Near-instant processing' },
  { icon: Shield, label: 'GDPR Compliant',      sub: 'Privacy by architecture' },
];

export function TrustStrip() {
  return (
    <div
      style={{
        background: 'rgba(30,41,59,0.6)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '20px 0',
      }}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0',
          }}
        >
          {TRUST_ITEMS.map(({ icon: Icon, label, sub }, i) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 24px',
                borderRight: i < TRUST_ITEMS.length - 1
                  ? '1px solid rgba(255,255,255,0.07)'
                  : 'none',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '9px',
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={15} style={{ color: '#22C55E' }} />
              </div>
              <div>
                <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#F8FAFC', lineHeight: 1.2 }}>
                  {label}
                </p>
                <p style={{ fontSize: '0.7rem', color: '#64748B', lineHeight: 1.2 }}>
                  {sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
