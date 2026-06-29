'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Tool } from '@/lib/tools';

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      href={`/tool/${tool.slug}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div
        style={{
          padding: '24px',
          borderRadius: '22px',
          background: 'rgba(30,41,59,0.5)',
          border: '1px solid rgba(255,255,255,0.07)',
          transition: 'all 220ms ease',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.background = 'rgba(30,41,59,0.9)';
          el.style.border = `1px solid ${tool.color}50`;
          el.style.transform = 'translateY(-3px)';
          el.style.boxShadow = `0 12px 36px ${tool.color}20`;
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.background = 'rgba(30,41,59,0.5)';
          el.style.border = '1px solid rgba(255,255,255,0.07)';
          el.style.transform = 'translateY(0)';
          el.style.boxShadow = 'none';
        }}
      >
        {/* Icon square */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '13px',
            background: `${tool.color}1A`,
            border: `1.5px solid ${tool.color}35`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '1rem', fontWeight: 800, color: tool.color }}>
            {tool.name.slice(0, 2)}
          </span>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '7px' }}>
            <h3
              style={{
                fontSize: '0.9375rem',
                fontWeight: 700,
                color: '#F8FAFC',
                lineHeight: 1.3,
                letterSpacing: '-0.02em',
              }}
            >
              {tool.name}
            </h3>
            {tool.popular && (
              <span
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: '#22C55E',
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.22)',
                  padding: '2px 6px',
                  borderRadius: '99px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  flexShrink: 0,
                  marginTop: '1px',
                }}
              >
                Popular
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: '0.8125rem',
              color: '#64748B',
              lineHeight: 1.55,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {tool.shortDesc}
          </p>
        </div>

        {/* Footer: format + arrow */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontSize: '0.7rem',
              color: '#334155',
              fontWeight: 500,
              background: 'rgba(255,255,255,0.04)',
              padding: '3px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {tool.inputFormats.join(', ')} → {tool.outputFormat}
          </span>
          <ArrowRight size={15} style={{ color: tool.color, opacity: 0.8 }} />
        </div>
      </div>
    </Link>
  );
}
