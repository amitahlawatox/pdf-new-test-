'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { POPULAR_TOOLS } from '@/lib/tools';

const HERO_QUICK_TOOLS = POPULAR_TOOLS.slice(0, 8);

export function HeroPills() {
  const scrollToTools = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('tools-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <p
        style={{
          fontSize: '0.65rem',
          fontWeight: 700,
          color: '#475569',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '12px',
        }}
      >
        Popular tools
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
        }}
        className="hero-pills-grid"
      >
        {HERO_QUICK_TOOLS.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tool/${tool.slug}`}
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 12px',
                borderRadius: '12px',
                background: 'rgba(30,41,59,0.6)',
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
                transition: 'all 180ms ease',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = `${tool.color}10`;
                el.style.border = `1px solid ${tool.color}40`;
                el.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = 'rgba(30,41,59,0.6)';
                el.style.border = '1px solid rgba(255,255,255,0.08)';
                el.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '7px',
                  background: `${tool.color}18`,
                  border: `1px solid ${tool.color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: tool.color }}>
                  {tool.name.slice(0, 2)}
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#CBD5E1',
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

      <div className="mt-5">
        <a
          href="#tools-grid"
          onClick={scrollToTools}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: '#22C55E',
            textDecoration: 'none',
          }}
        >
          Browse all 31+ tools <ArrowRight size={14} />
        </a>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .hero-pills-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
