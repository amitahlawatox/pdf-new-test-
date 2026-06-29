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
          padding: '20px',
          borderRadius: '20px',
          background: 'rgba(30,41,59,0.5)',
          border: '1px solid rgba(255,255,255,0.07)',
          transition: 'all 200ms ease',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.background = 'rgba(30,41,59,0.85)';
          el.style.border = `1px solid ${tool.color}40`;
          el.style.transform = 'translateY(-2px)';
          el.style.boxShadow = `0 8px 32px ${tool.color}15`;
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.background = 'rgba(30,41,59,0.5)';
          el.style.border = '1px solid rgba(255,255,255,0.07)';
          el.style.transform = 'translateY(0)';
          el.style.boxShadow = 'none';
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            background: `${tool.color}18`,
            border: `1px solid ${tool.color}30`,
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
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#F8FAFC', lineHeight: 1.3 }}>
              {tool.name}
            </h3>
            {tool.popular && (
              <span
                style={{
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  color: '#22C55E',
                  background: 'rgba(34,197,94,0.12)',
                  border: '1px solid rgba(34,197,94,0.25)',
                  padding: '2px 7px',
                  borderRadius: '99px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  flexShrink: 0,
                }}
              >
                Popular
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', lineHeight: 1.5 }}>
            {tool.shortDesc}
          </p>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.7rem', color: '#334155', fontWeight: 500 }}>
            {tool.inputFormats.join(', ')} → {tool.outputFormat}
          </span>
          <ArrowRight size={15} style={{ color: tool.color, opacity: 0.7 }} />
        </div>
      </div>
    </Link>
  );
}
