'use client';

import Link from 'next/link';
import { FileText, Shield, Lock, Zap } from 'lucide-react';
import { TOOLS, CATEGORY_META, ToolCategory } from '@/lib/tools';

const categories = Object.keys(CATEGORY_META) as ToolCategory[];

export function Footer() {
  return (
    <footer
      style={{
        background: '#080E1D',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5" style={{ textDecoration: 'none' }}>
              <div
                className="flex h-9 w-9 items-center justify-center rounded-[12px]"
                style={{ background: 'linear-gradient(135deg, #22C55E, #16A34A)' }}
              >
                <FileText size={18} color="#fff" strokeWidth={2.5} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.125rem', color: '#F8FAFC', letterSpacing: '-0.02em' }}>
                PDF Genius<span style={{ color: '#22C55E' }}>Pro</span>
              </span>
            </Link>
            <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.7, maxWidth: '280px' }}>
              31+ free PDF tools. All processing happens in your browser — your files never leave your device.
            </p>
            {/* Trust badges */}
            <div className="flex flex-col gap-2 mt-6">
              {[
                { icon: Shield, text: 'Files never uploaded to servers', color: '#22C55E' },
                { icon: Lock, text: 'No account required, ever', color: '#3B82F6' },
                { icon: Zap, text: 'Powered by WebAssembly locally', color: '#8B5CF6' },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon size={13} style={{ color, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.75rem', color: '#475569' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tool categories */}
          {categories.map((cat) => {
            const tools = TOOLS.filter((t) => t.category === cat).slice(0, 6);
            const meta = CATEGORY_META[cat];
            return (
              <div key={cat}>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: meta.color, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
                  {meta.label}
                </h3>
                <ul className="space-y-2.5">
                  {tools.map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={`/tool/${tool.slug}`}
                        style={{ fontSize: '0.8125rem', color: '#64748B', textDecoration: 'none', transition: 'color 150ms' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#94A3B8')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
                      >
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p style={{ fontSize: '0.75rem', color: '#334155' }}>
            © {new Date().getFullYear()} PDF Genius Pro. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {['Privacy Policy', 'Terms of Service', 'Contact'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                style={{ fontSize: '0.75rem', color: '#334155', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#64748B')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#334155')}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
