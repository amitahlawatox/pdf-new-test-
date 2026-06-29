'use client';

import Link from 'next/link';
import { POPULAR_TOOLS } from '@/lib/tools';

// Use first 8 popular tools
const QUICK_TOOLS = POPULAR_TOOLS.slice(0, 8);

export function QuickTools() {
  return (
    <section style={{ paddingTop: '48px', paddingBottom: '40px' }}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <p
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              color: '#22C55E',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}
          >
            Most Popular
          </p>
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#F8FAFC',
              letterSpacing: '-0.03em',
            }}
          >
            Jump straight to a tool
          </h2>
        </div>

        {/* Two rows of 4 on desktop, horizontal scroll on mobile */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
          }}
          className="quick-tools-grid"
        >
          {QUICK_TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tool/${tool.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                className="quick-tool-pill"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: 'rgba(30,41,59,0.6)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                  transition: 'all 180ms ease',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = `${tool.color}12`;
                  el.style.border = `1px solid ${tool.color}40`;
                  el.style.transform = 'translateY(-2px)';
                  el.style.boxShadow = `0 6px 20px ${tool.color}18`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = 'rgba(30,41,59,0.6)';
                  el.style.border = '1px solid rgba(255,255,255,0.08)';
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '10px',
                    background: `${tool.color}18`,
                    border: `1px solid ${tool.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: tool.color }}>
                    {tool.name.slice(0, 2)}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#E2E8F0',
                    lineHeight: 1.3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tool.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .quick-tools-grid {
            display: flex !important;
            overflow-x: auto;
            gap: 8px !important;
            padding-bottom: 8px;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
          }
          .quick-tools-grid > * {
            flex: 0 0 auto;
            scroll-snap-align: start;
            min-width: 160px;
          }
        }
        @media (min-width: 641px) and (max-width: 1023px) {
          .quick-tools-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
