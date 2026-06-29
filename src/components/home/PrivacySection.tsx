import { Shield, Cpu, Wifi, Lock, Globe, Zap } from 'lucide-react';

const pillars = [
  {
    icon: Shield,
    title: 'Zero Upload Policy',
    description: 'Your files are processed using WebAssembly directly in your browser tab. They are never transmitted to any server.',
    color: '#22C55E',
    stat: '0 bytes',
    statLabel: 'transferred to servers',
  },
  {
    icon: Cpu,
    title: 'Local Processing Engine',
    description: 'We use PDF.js and pdf-lib compiled to WebAssembly. The same technology used by Firefox and Chrome internally.',
    color: '#3B82F6',
    stat: 'WASM',
    statLabel: 'powered locally',
  },
  {
    icon: Lock,
    title: 'No Account Required',
    description: 'We do not collect your email, name, or any personal data. No cookies beyond essential functionality.',
    color: '#8B5CF6',
    stat: '0',
    statLabel: 'data points collected',
  },
  {
    icon: Globe,
    title: 'GDPR Compliant',
    description: 'Since no data ever leaves your browser, we are inherently compliant with GDPR, CCPA, and HIPAA requirements.',
    color: '#F59E0B',
    stat: '100%',
    statLabel: 'regulation compliant',
  },
  {
    icon: Wifi,
    title: 'Works Offline',
    description: 'Once the page loads, the processing engines work without internet. Process files even on a plane.',
    color: '#EF4444',
    stat: 'Offline',
    statLabel: 'capable after first load',
  },
  {
    icon: Zap,
    title: 'Instant Processing',
    description: 'No upload/download roundtrip. Files are processed at the full speed of your device\'s CPU and memory.',
    color: '#06B6D4',
    stat: '<2s',
    statLabel: 'average processing time',
  },
];

export function PrivacySection() {
  return (
    <section
      style={{
        paddingTop: '80px',
        paddingBottom: '80px',
        background: 'rgba(15,23,42,0.8)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
            style={{
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
            }}
          >
            <Shield size={14} style={{ color: '#22C55E' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#22C55E', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Privacy Architecture
            </span>
          </div>
          <h2 className="text-headline" style={{ color: '#F8FAFC', marginBottom: '16px' }}>
            Your files never leave<br />
            <span style={{ color: '#22C55E' }}>your device. Ever.</span>
          </h2>
          <p style={{ fontSize: '1rem', color: '#64748B', maxWidth: '540px', margin: '0 auto', lineHeight: 1.7 }}>
            Unlike cloud-based PDF tools that upload your documents to remote servers,
            PDF Genius Pro runs the entire processing pipeline in your browser tab.
          </p>
        </div>

        {/* Pillars grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
          }}
        >
          {pillars.map(({ icon: Icon, title, description, color, stat, statLabel }) => (
            <div
              key={title}
              style={{
                padding: '24px',
                borderRadius: '20px',
                background: 'rgba(30,41,59,0.6)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: '12px',
                    background: `${color}15`,
                    border: `1px solid ${color}25`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color, lineHeight: 1 }}>{stat}</div>
                  <div style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 500 }}>{statLabel}</div>
                </div>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '8px' }}>
                {title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.65 }}>
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <p style={{ fontSize: '0.875rem', color: '#475569' }}>
            Open your browser DevTools → Network tab → drop a file and see for yourself:{' '}
            <strong style={{ color: '#64748B' }}>zero outbound requests</strong>
          </p>
        </div>
      </div>
    </section>
  );
}
