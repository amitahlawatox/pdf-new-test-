import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Cpu, Lock, Download, Upload, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How It Works — PDF Genius Pro',
  description: 'Learn how PDF Genius Pro processes your files locally in your browser using WebAssembly. Zero uploads, zero data exposure.',
};

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h1 className="text-headline" style={{ color: '#F8FAFC', marginBottom: '16px' }}>
          How PDF Genius Pro Works
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#64748B', maxWidth: '540px', margin: '0 auto', lineHeight: 1.7 }}>
          Every tool on this site runs entirely in your browser. Here is exactly what happens when you process a file.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '64px' }}>
        {[
          { step: '01', icon: Upload, color: '#22C55E', title: 'You drop or select a file', body: 'When you select a file, your browser reads it using the FileReader API. The file data is loaded into your browser\'s memory (RAM). At no point does any network request leave your device.' },
          { step: '02', icon: Cpu, color: '#3B82F6', title: 'The local WASM engine activates', body: 'PDF Genius Pro uses pdf-lib — a JavaScript/WebAssembly PDF engine — that is compiled and runs directly in your browser tab. This is the same approach used by modern browsers for PDF rendering.' },
          { step: '03', icon: Zap, color: '#8B5CF6', title: 'Processing happens in your RAM', body: 'The PDF operation (merge, split, compress, etc.) is executed using your device\'s CPU and memory. No data is encoded, transmitted, or queued. Processing speed depends on your device, not network speed.' },
          { step: '04', icon: Download, color: '#F59E0B', title: 'Your processed file is offered for download', body: 'Once processing is complete, the output is converted to a Blob URL in your browser\'s memory and offered as a direct download. The original and output files are cleared from memory when you close the tab.' },
          { step: '05', icon: Lock, color: '#EF4444', title: 'Nothing is retained', body: 'We do not log file names, file sizes, operation types, or any metadata. There is no server receiving data. This is verifiable by opening DevTools → Network → processing a file → confirming zero upload requests.' },
        ].map(({ step, icon: Icon, color, title, body }) => (
          <div key={step} style={{ display: 'flex', gap: '20px', padding: '28px', borderRadius: '20px', background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ width: 48, height: 48, borderRadius: '14px', background: `${color}15`, border: `1.5px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={22} style={{ color }} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color, letterSpacing: '0.1em', marginBottom: '6px', fontFamily: 'monospace' }}>STEP {step}</div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '8px' }}>{title}</h2>
              <p style={{ fontSize: '0.9375rem', color: '#64748B', lineHeight: 1.7 }}>{body}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', padding: '40px', borderRadius: '24px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
        <Shield size={32} style={{ color: '#22C55E', marginBottom: '16px' }} />
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '12px' }}>Ready to try it yourself?</h2>
        <p style={{ color: '#64748B', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
          All 31+ tools are free, private, and require zero sign-up.
        </p>
        <Link href="/" style={{ padding: '14px 32px', borderRadius: '16px', background: '#22C55E', color: '#0F172A', fontWeight: 700, textDecoration: 'none', fontSize: '1rem' }}>
          Open PDF Tools
        </Link>
      </div>
    </div>
  );
}
