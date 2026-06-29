'use client';

export type ProcessingState =
  | 'idle'
  | 'file-loaded'
  | 'engine-warming'
  | 'processing'
  | 'done'
  | 'error';

interface StateDisplayProps {
  state: ProcessingState;
  fileName?: string;
  fileSizeMB?: string;
  progress?: number;
  errorMessage?: string;
}

const STATE_CONFIG: Record<ProcessingState, { label: string; color: string; bg: string }> = {
  idle:           { label: 'LOCAL ENGINE: READY',              color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
  'file-loaded':  { label: 'FILE LOADED',                      color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
  'engine-warming':{ label: 'WARMING LOCAL ENGINE...',         color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
  processing:     { label: 'PROCESSING LOCALLY ON YOUR DEVICE', color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)' },
  done:           { label: 'COMPLETE — DOWNLOAD READY',        color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
  error:          { label: 'ERROR',                            color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
};

export function StateDisplay({ state, fileName, fileSizeMB, progress, errorMessage }: StateDisplayProps) {
  const config = STATE_CONFIG[state];

  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: '14px',
        background: config.bg,
        border: `1px solid ${config.color}25`,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minHeight: '48px',
      }}
    >
      {/* Status dot */}
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: config.color,
          flexShrink: 0,
          boxShadow: `0 0 8px ${config.color}`,
          animation: (state === 'processing' || state === 'engine-warming')
            ? 'pulse 1.5s ease-in-out infinite'
            : undefined,
        }}
      />

      {/* Labels */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          className="state-badge"
          style={{ color: config.color, display: 'block' }}
        >
          {config.label}
          {state === 'file-loaded' && fileName && ` — ${fileName}`}
          {fileSizeMB && state === 'file-loaded' && ` (${fileSizeMB}MB)`}
          {errorMessage && ` — ${errorMessage}`}
        </span>
        {progress !== undefined && state === 'processing' && (
          <div style={{ marginTop: '6px', height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: config.color,
                borderRadius: '2px',
                transition: 'width 200ms ease',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
