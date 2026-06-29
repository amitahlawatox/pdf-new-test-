import type { Metadata } from 'next';
import { HeroDropzone } from '@/components/home/HeroDropzone';
import { ToolGrid } from '@/components/home/ToolGrid';
import { PrivacySection } from '@/components/home/PrivacySection';
import { AdUnit } from '@/components/layout/AdUnit';
import { POPULAR_TOOLS } from '@/lib/tools';
import { ToolCard } from '@/components/home/ToolCard';
import { ArrowRight, Star, Users, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'PDF Genius Pro — 31+ Free PDF Tools. 100% Private.',
  alternates: { canonical: 'https://pdfgeniuspro.com' },
};

export default function HomePage() {
  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section
        style={{
          paddingTop: '72px',
          paddingBottom: '72px',
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34,197,94,0.08) 0%, transparent 70%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            pointerEvents: 'none',
          }}
        />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative">
          {/* Eyebrow */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.2)',
              }}
            >
              <Zap size={13} style={{ color: '#22C55E' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22C55E', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                31+ Free Tools · Zero Uploads · GDPR Compliant
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1
            className="text-display"
            style={{
              textAlign: 'center',
              color: '#F8FAFC',
              marginBottom: '20px',
            }}
          >
            Every PDF tool you need.
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              100% private.
            </span>
          </h1>

          {/* Sub-headline */}
          <p
            style={{
              textAlign: 'center',
              fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
              color: '#64748B',
              maxWidth: '580px',
              margin: '0 auto 48px',
              lineHeight: 1.7,
            }}
          >
            Merge, split, compress, convert and sign PDFs directly in your browser.
            No sign-up. No uploads. Your files never leave your device.
          </p>

          {/* THE HERO DROPZONE */}
          <HeroDropzone />

          {/* Social proof */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
            {[
              { icon: Users, value: '2M+', label: 'Monthly users' },
              { icon: Star,  value: '4.9',  label: 'Average rating' },
              { icon: Zap,   value: '31+',  label: 'Free tools' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon size={14} style={{ color: '#334155' }} />
                <span style={{ fontWeight: 700, color: '#F8FAFC', fontSize: '0.9375rem' }}>{value}</span>
                <span style={{ color: '#475569', fontSize: '0.875rem' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── POPULAR TOOLS ────────────────────────────────────── */}
      <section style={{ paddingTop: '64px', paddingBottom: '48px' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#22C55E', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
                Most Used
              </p>
              <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
                Popular tools
              </h2>
            </div>
            <a
              href="#convert"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 600, color: '#22C55E', textDecoration: 'none' }}
            >
              All tools <ArrowRight size={15} />
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {POPULAR_TOOLS.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── MID-PAGE AD (0 CLS) ──────────────────────────────── */}
      <div className="flex justify-center py-6" style={{ background: 'rgba(8,14,29,0.6)' }}>
        <AdUnit variant="rectangle" id="ad-mid-rectangle" />
      </div>

      {/* ─── FULL TOOL GRID ───────────────────────────────────── */}
      <ToolGrid />

      {/* ─── PRIVACY SECTION ──────────────────────────────────── */}
      <PrivacySection />

      {/* ─── HOW IT WORKS ─────────────────────────────────────── */}
      <section style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#3B82F6', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
              How it Works
            </p>
            <h2 className="text-headline" style={{ color: '#F8FAFC', marginBottom: '12px' }}>
              Three steps. Done.
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748B', maxWidth: '440px', margin: '0 auto' }}>
              No complicated settings. No waiting for uploads. Just results.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {[
              { step: '01', title: 'Drop your file', desc: 'Drag a PDF onto the dropzone or click to browse. The file stays in your browser tab.', color: '#22C55E' },
              { step: '02', title: 'Choose your tool', desc: 'Select the operation. Our local WebAssembly engine processes instantly — no waiting.', color: '#3B82F6' },
              { step: '03', title: 'Download result', desc: 'Your file downloads directly. No email, no account. The original is never sent anywhere.', color: '#8B5CF6' },
            ].map(({ step, title, desc, color }) => (
              <div
                key={step}
                style={{
                  padding: '28px 24px',
                  borderRadius: '20px',
                  background: 'rgba(30,41,59,0.5)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color, letterSpacing: '0.1em', marginBottom: '16px', fontFamily: 'monospace' }}>
                  STEP {step}
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '10px' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────── */}
      <section style={{ paddingTop: '64px', paddingBottom: '80px', background: 'rgba(8,14,29,0.5)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-headline" style={{ color: '#F8FAFC', textAlign: 'center', marginBottom: '40px' }}>
            Frequently asked questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { q: 'Are these tools really free?', a: 'Yes. All 31+ tools are free with no hidden costs. We are supported by non-intrusive display advertising.' },
              { q: 'Do my files get uploaded to a server?', a: 'Never. Every operation runs in your browser using WebAssembly. You can verify this in DevTools → Network — you will see zero file upload requests.' },
              { q: 'Is there a file size limit?', a: "There are no artificial server-side limits. The practical limit is your device's available memory — typically 500MB+ for modern devices." },
              { q: 'Does this work on mobile?', a: 'Yes. PDF Genius Pro is fully responsive and works on iOS Safari and Android Chrome with native file picker support.' },
              { q: 'Do I need to create an account?', a: 'No. There is no account system. Nothing to sign up for — just use the tools.' },
            ].map(({ q, a }) => (
              <details
                key={q}
                style={{
                  padding: '20px 24px',
                  borderRadius: '16px',
                  background: 'rgba(30,41,59,0.5)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  cursor: 'pointer',
                }}
              >
                <summary style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#F8FAFC', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                  {q}
                  <span style={{ color: '#22C55E', flexShrink: 0, fontSize: '1.25rem', lineHeight: 1 }}>+</span>
                </summary>
                <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '12px', lineHeight: 1.7 }}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
