import type { Metadata } from 'next';
import { HeroDropzone } from '@/components/home/HeroDropzone';
import { HeroPills } from '@/components/home/HeroPills';
import { ToolGrid } from '@/components/home/ToolGrid';
import { PrivacySection } from '@/components/home/PrivacySection';
import { TrustStrip } from '@/components/home/TrustStrip';
import { QuickTools } from '@/components/home/QuickTools';
import { AdUnit } from '@/components/layout/AdUnit';
import { Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'PDF Genius Pro — 31+ Free PDF Tools. 100% Private.',
  alternates: { canonical: 'https://www.pdfgeniuspro.com' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Are these PDF tools really free?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. All 31+ tools are completely free with no hidden costs. We are supported by non-intrusive display advertising.' },
    },
    {
      '@type': 'Question',
      name: 'Do my PDF files get uploaded to a server?',
      acceptedAnswer: { '@type': 'Answer', text: 'Never. Every PDF operation runs entirely in your browser using WebAssembly. You can verify this in DevTools → Network — you will see zero file upload requests.' },
    },
    {
      '@type': 'Question',
      name: 'Is there a PDF file size limit?',
      acceptedAnswer: { '@type': 'Answer', text: "There are no artificial server-side limits. The practical limit is your device's available memory — typically 500MB+ for modern devices." },
    },
    {
      '@type': 'Question',
      name: 'Do I need to create an account to use PDF tools?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. There is no account system. Nothing to sign up for — just use the tools instantly.' },
    },
    {
      '@type': 'Question',
      name: 'Does PDF Genius Pro work on mobile?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. PDF Genius Pro is fully responsive and works on iOS Safari and Android Chrome with native file picker support.' },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {/* ─── HERO (Two-Column) ────────────────────────────────── */}
      <section
        style={{
          paddingTop: '64px',
          paddingBottom: '64px',
          background:
            'radial-gradient(ellipse 70% 55% at 30% 0%, rgba(34,197,94,0.07) 0%, transparent 60%),' +
            'radial-gradient(ellipse 60% 50% at 80% 90%, rgba(139,92,246,0.06) 0%, transparent 60%),' +
            'linear-gradient(180deg, #0F172A 0%, #111827 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle background grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            pointerEvents: 'none',
          }}
        />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative">
          {/* Eyebrow */}
          <div style={{ marginBottom: '32px' }}>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.2)',
              }}
            >
              <Zap size={12} style={{ color: '#22C55E' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#22C55E', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                100% Local · Zero Uploads · Always Free
              </span>
            </div>
          </div>

          {/* Two-column layout */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 380px',
              gap: '48px',
              alignItems: 'start',
            }}
            className="hero-grid"
          >
            {/* LEFT: Headline + sub + quick tool pills (client component) */}
            <div>
              <h1
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                  fontWeight: 800,
                  color: '#F8FAFC',
                  lineHeight: 1.1,
                  letterSpacing: '-0.04em',
                  marginBottom: '20px',
                }}
              >
                Every PDF tool
                <br />
                you need.{' '}
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

              <p
                style={{
                  fontSize: '0.9375rem',
                  color: '#64748B',
                  maxWidth: '460px',
                  lineHeight: 1.75,
                  marginBottom: '36px',
                }}
              >
                Merge, split, compress, convert and sign PDFs right in your browser.
                No sign-up. No uploads. Your files{' '}
                <span style={{ color: '#94A3B8', fontWeight: 500 }}>never leave your device.</span>
              </p>

              {/* Quick-action tool pills — client component with hover handlers */}
              <HeroPills />
            </div>

            {/* RIGHT: Compact Dropzone */}
            <div style={{ paddingTop: '4px' }}>
              <HeroDropzone />
            </div>
          </div>

          {/* Social proof numbers — below both columns */}
          <div
            className="flex flex-wrap items-center gap-8 mt-12"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px' }}
          >
            {[
              { value: '2M+', label: 'Monthly users' },
              { value: '4.9★', label: 'Average rating' },
              { value: '31+', label: 'Free tools' },
              { value: '0', label: 'Files uploaded to servers' },
            ].map(({ value, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontWeight: 800, color: '#F8FAFC', fontSize: '1.125rem', letterSpacing: '-0.03em' }}>
                  {value}
                </span>
                <span style={{ color: '#475569', fontSize: '0.8125rem' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Responsive styles for hero grid */}
        <style>{`
          @media (max-width: 768px) {
            .hero-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>

      {/* ─── TRUST STRIP ──────────────────────────────────────── */}
      <TrustStrip />

      {/* ─── QUICK TOOLS ──────────────────────────────────────── */}
      <QuickTools />

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
            <p style={{ fontSize: '0.9375rem', color: '#64748B', maxWidth: '440px', margin: '0 auto' }}>
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
                  borderRadius: '22px',
                  background: 'rgba(30,41,59,0.5)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color, letterSpacing: '0.1em', marginBottom: '16px', fontFamily: 'monospace' }}>
                  STEP {step}
                </div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '10px', letterSpacing: '-0.02em' }}>{title}</h3>
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
