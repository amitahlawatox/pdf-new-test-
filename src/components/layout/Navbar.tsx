'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronDown, FileText } from 'lucide-react';
import { CATEGORY_META, ToolCategory } from '@/lib/tools';

const categories = Object.entries(CATEGORY_META) as [ToolCategory, typeof CATEGORY_META[ToolCategory]][];

const POPULAR_NAV_TOOLS = [
  { slug: 'merge-pdf',    name: 'Merge PDF',      color: '#22C55E' },
  { slug: 'compress-pdf', name: 'Compress PDF',   color: '#22C55E' },
  { slug: 'pdf-to-word',  name: 'PDF to Word',    color: '#3B82F6' },
  { slug: 'split-pdf',    name: 'Split PDF',      color: '#22C55E' },
  { slug: 'pdf-to-jpg',   name: 'PDF to JPG',     color: '#F59E0B' },
  { slug: 'sign-pdf',     name: 'Sign PDF',       color: '#EF4444' },
  { slug: 'jpg-to-pdf',   name: 'JPG to PDF',     color: '#F59E0B' },
  { slug: 'ocr-pdf',      name: 'OCR PDF',        color: '#8B5CF6' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <nav
      className="glass-bright sticky top-0 z-50 w-full"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="PDF Genius Pro home">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-[10px]"
              style={{ background: 'linear-gradient(135deg, #22C55E, #16A34A)' }}
            >
              <FileText size={16} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1rem', color: '#F8FAFC', letterSpacing: '-0.02em' }}>
              PDF Genius<span style={{ color: '#22C55E' }}> Pro</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {/* Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                onBlur={() => setTimeout(() => setToolsOpen(false), 150)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                style={{
                  color: toolsOpen ? '#F8FAFC' : '#94A3B8',
                  background: toolsOpen ? 'rgba(255,255,255,0.08)' : 'transparent',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                Tools
                <ChevronDown
                  size={14}
                  style={{
                    transform: toolsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 200ms ease',
                    color: '#94A3B8',
                  }}
                />
              </button>

              {toolsOpen && (
                <div
                  className="absolute left-0 top-full mt-2 rounded-2xl glass-bright shadow-2xl"
                  style={{ zIndex: 100, minWidth: 480, padding: '12px' }}
                >
                  {/* Popular tools — direct links for SEO */}
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 8px 8px', margin: 0 }}>
                    Popular Tools
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', marginBottom: '10px' }}>
                    {POPULAR_NAV_TOOLS.map((t) => (
                      <Link
                        key={t.slug}
                        href={`/tool/${t.slug}`}
                        onClick={() => setToolsOpen(false)}
                        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '10px' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#CBD5E1' }}>{t.name}</span>
                      </Link>
                    ))}
                  </div>
                  {/* Category links */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '8px' }}>
                    <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 8px 6px', margin: 0 }}>
                      Browse by Category
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', padding: '0 4px 4px' }}>
                      {categories.map(([key, meta]) => (
                        <Link
                          key={key}
                          href={`/#${key}`}
                          onClick={() => setToolsOpen(false)}
                          style={{
                            textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600,
                            color: meta.color, background: `${meta.color}14`,
                            border: `1px solid ${meta.color}25`,
                            padding: '4px 10px', borderRadius: '99px',
                          }}
                        >
                          {meta.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/blog"
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{ color: '#94A3B8', textDecoration: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#F8FAFC'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'transparent'; }}
            >
              Blog
            </Link>
            <Link
              href="/how-it-works"
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{ color: '#94A3B8', textDecoration: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#F8FAFC'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'transparent'; }}
            >
              How it Works
            </Link>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(34,197,94,0.12)',
                border: '1px solid rgba(34,197,94,0.25)',
              }}
            >
              <span
                style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#22C55E', display: 'inline-block',
                  boxShadow: '0 0 6px rgba(34,197,94,0.8)',
                }}
              />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#22C55E', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                100% Private
              </span>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl"
            style={{ color: '#94A3B8', background: 'rgba(255,255,255,0.06)', cursor: 'pointer', border: 'none' }}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass-bright border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="px-4 py-4">
            <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 8px 8px', margin: 0 }}>
              Popular Tools
            </p>
            {POPULAR_NAV_TOOLS.map((t) => (
              <Link
                key={t.slug}
                href={`/tool/${t.slug}`}
                onClick={() => setMobileOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 8px', textDecoration: 'none', borderRadius: '10px' }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#CBD5E1' }}>{t.name}</span>
              </Link>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: '8px', paddingTop: '8px' }}>
              <Link href="/blog" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '10px 8px', fontSize: '0.875rem', fontWeight: 500, color: '#94A3B8', textDecoration: 'none' }}>Blog</Link>
              <Link href="/how-it-works" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '10px 8px', fontSize: '0.875rem', fontWeight: 500, color: '#94A3B8', textDecoration: 'none' }}>How it Works</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
