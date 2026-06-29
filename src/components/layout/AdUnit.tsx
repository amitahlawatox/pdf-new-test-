'use client';

interface AdUnitProps {
  variant: 'leaderboard' | 'rectangle' | 'tall';
  id: string;
}

const LABELS: Record<AdUnitProps['variant'], string> = {
  leaderboard: 'AD UNIT — LEADERBOARD 728×90 — ADSENSE RESERVED — NO CLS',
  rectangle:   'AD UNIT — RECTANGLE 300×250 — ADSENSE RESERVED — NO CLS',
  tall:        'AD UNIT — TALL 160×600 — ADSENSE RESERVED — NO CLS',
};

export function AdUnit({ variant, id }: AdUnitProps) {
  return (
    <div className={`ad-${variant}`} id={id} aria-hidden="true" role="presentation">
      <span
        style={{
          color: 'rgba(255,255,255,0.12)',
          fontSize: '0.625rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          textAlign: 'center',
          padding: '8px',
          userSelect: 'none',
        }}
      >
        {LABELS[variant]}
      </span>
    </div>
  );
}
