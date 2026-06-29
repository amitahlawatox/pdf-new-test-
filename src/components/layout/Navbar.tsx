'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronDown, FileText, Zap } from 'lucide-react';
import { CATEGORY_META, ToolCategory } from '@/lib/tools';

const categories = Object.entries(CATEGORY_META) as [ToolCategory, typeof CATEGORY_META[ToolCategory]][];

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
                  className="absolute left-0 top-full mt-2 w-80 rounded-2xl p-2 glass-bright shadow-2xl"
                  style={{ zIndex: 100 }}
                >
                  {categories.map(([key, meta]) => (
                    <Link
                      key={key}
                      href={`/#${key}`}
                      onClick={() => setToolsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group"
                      style={{ textDecoration: 'none' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-lg flex-shrink-0"
                        style={{ background: `${meta.color}20` }}
                      >
                        <Zap size={13} style={{ color: meta.color }} />
                      </span>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F8FAFC' }}>{meta.label}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{meta.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/blog"
              className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              style={{ color: '#94A3B8', textDecoration: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#F8FAFC'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'transparent'; }}
            >
              Blog
            </Link>
            <Link
              href="/how-it-works"
              className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
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
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#22C55E',
                  display: 'inline-block',
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
          <div className="px-4 py-4 space-y-1">
            {categories.map(([key, meta]) => (
              <Link
                key={key}
                href={`/#${key}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl"
                style={{ textDecoration: 'none', color: '#94A3B8' }}
              >
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: meta.color }}>{meta.label}</span>
              </Link>
            ))}
            <Link href="/blog" onClick={() => setMobileOpen(false)} className="block px-3 py-3 text-sm font-medium" style={{ color: '#94A3B8', textDecoration: 'none' }}>Blog</Link>
            <Link href="/how-it-works" onClick={() => setMobileOpen(false)} className="block px-3 py-3 text-sm font-medium" style={{ color: '#94A3B8', textDecoration: 'none' }}>How it Works</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
