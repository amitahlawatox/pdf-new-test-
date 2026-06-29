'use client';

import { useState } from 'react';
import { Tool } from '@/lib/tools';
import { CompressionLevel } from '@/lib/engines/compress';
import { Rotation } from '@/lib/engines/rotate';

export interface ToolOptions {
  compressionLevel?: CompressionLevel;
  rotation?: Rotation;
  splitMode?: 'every' | 'range' | 'extract';
  splitEveryN?: number;
  splitRange?: string;
  watermarkText?: string;
  watermarkOpacity?: number;
  password?: string;
  pageNumberPosition?: 'bottom-center' | 'bottom-right' | 'top-center';
  pageNumberStart?: number;
}

interface ToolConfigProps {
  tool: Tool;
  onChange: (opts: ToolOptions) => void;
}

const label = (text: string) => (
  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
    {text}
  </label>
);

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '12px',
  background: 'rgba(15,23,42,0.8)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#F8FAFC',
  fontSize: '0.875rem',
  outline: 'none',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none',
  WebkitAppearance: 'none',
  cursor: 'pointer',
};

export function ToolConfig({ tool, onChange }: ToolConfigProps) {
  const [opts, setOpts] = useState<ToolOptions>({
    compressionLevel: 'medium',
    rotation: 90,
    splitMode: 'every',
    splitEveryN: 1,
    watermarkText: 'CONFIDENTIAL',
    watermarkOpacity: 0.15,
    password: '',
    pageNumberPosition: 'bottom-center',
    pageNumberStart: 1,
  });

  const update = (patch: Partial<ToolOptions>) => {
    const next = { ...opts, ...patch };
    setOpts(next);
    onChange(next);
  };

  const field = (children: React.ReactNode) => (
    <div style={{ marginBottom: '16px' }}>{children}</div>
  );

  const panelStyle: React.CSSProperties = {
    padding: '20px',
    borderRadius: '16px',
    background: 'rgba(30,41,59,0.6)',
    border: '1px solid rgba(255,255,255,0.07)',
    marginBottom: '16px',
  };

  // Compress
  if (tool.slug === 'compress-pdf') {
    return (
      <div style={panelStyle}>
        <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#94A3B8', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Compression Settings</p>
        {field(<>
          {label('Compression Level')}
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['low', 'medium', 'high'] as CompressionLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => update({ compressionLevel: lvl })}
                style={{
                  flex: 1, padding: '10px', borderRadius: '10px', fontWeight: 600, fontSize: '0.875rem',
                  border: `1.5px solid ${opts.compressionLevel === lvl ? '#22C55E' : 'rgba(255,255,255,0.1)'}`,
                  background: opts.compressionLevel === lvl ? 'rgba(34,197,94,0.12)' : 'transparent',
                  color: opts.compressionLevel === lvl ? '#22C55E' : '#64748B',
                  cursor: 'pointer', textTransform: 'capitalize',
                }}
              >{lvl}</button>
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: '8px' }}>
            {opts.compressionLevel === 'low' && 'Minimal compression — best quality preserved'}
            {opts.compressionLevel === 'medium' && 'Balanced — good quality, smaller size'}
            {opts.compressionLevel === 'high' && 'Maximum compression — smallest file size'}
          </p>
        </>)}
      </div>
    );
  }

  // Rotate
  if (tool.slug === 'rotate-pdf') {
    return (
      <div style={panelStyle}>
        <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#94A3B8', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Rotation</p>
        {field(<>
          {label('Rotate By')}
          <div style={{ display: 'flex', gap: '8px' }}>
            {([90, 180, 270] as Rotation[]).map((deg) => (
              <button
                key={deg}
                onClick={() => update({ rotation: deg })}
                style={{
                  flex: 1, padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '1rem',
                  border: `1.5px solid ${opts.rotation === deg ? '#3B82F6' : 'rgba(255,255,255,0.1)'}`,
                  background: opts.rotation === deg ? 'rgba(59,130,246,0.12)' : 'transparent',
                  color: opts.rotation === deg ? '#3B82F6' : '#64748B',
                  cursor: 'pointer',
                }}
              >{deg}°</button>
            ))}
          </div>
        </>)}
      </div>
    );
  }

  // Split
  if (tool.slug === 'split-pdf') {
    return (
      <div style={panelStyle}>
        <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#94A3B8', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Split Options</p>
        {field(<>
          {label('Mode')}
          <select style={selectStyle} value={opts.splitMode} onChange={(e) => update({ splitMode: e.target.value as 'every' | 'range' | 'extract' })}>
            <option value="every">Split every N pages</option>
            <option value="range">Custom page range (e.g. 1-3, 5-7)</option>
            <option value="extract">Extract specific pages (e.g. 1,3,5)</option>
          </select>
        </>)}
        {opts.splitMode === 'every' && field(<>
          {label('Pages per file')}
          <input type="number" min={1} style={inputStyle} value={opts.splitEveryN}
            onChange={(e) => update({ splitEveryN: parseInt(e.target.value) || 1 })} />
        </>)}
        {(opts.splitMode === 'range' || opts.splitMode === 'extract') && field(<>
          {label(opts.splitMode === 'range' ? 'Ranges (e.g. 1-3, 5-7)' : 'Pages (e.g. 1,3,5)')}
          <input type="text" style={inputStyle} placeholder={opts.splitMode === 'range' ? '1-3, 5-7' : '1, 3, 5'}
            value={opts.splitRange || ''} onChange={(e) => update({ splitRange: e.target.value })} />
        </>)}
      </div>
    );
  }

  // Watermark
  if (tool.slug === 'watermark-pdf') {
    return (
      <div style={panelStyle}>
        <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#94A3B8', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Watermark Settings</p>
        {field(<>
          {label('Watermark Text')}
          <input type="text" style={inputStyle} value={opts.watermarkText} onChange={(e) => update({ watermarkText: e.target.value })} placeholder="CONFIDENTIAL" />
        </>)}
        {field(<>
          {label(`Opacity: ${Math.round((opts.watermarkOpacity ?? 0.15) * 100)}%`)}
          <input type="range" min={5} max={60} value={Math.round((opts.watermarkOpacity ?? 0.15) * 100)}
            onChange={(e) => update({ watermarkOpacity: parseInt(e.target.value) / 100 })}
            style={{ width: '100%', accentColor: '#8B5CF6' }} />
        </>)}
      </div>
    );
  }

  // Protect
  if (tool.slug === 'protect-pdf') {
    return (
      <div style={panelStyle}>
        <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#94A3B8', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Password Protection</p>
        {field(<>
          {label('Password')}
          <input type="password" style={inputStyle} value={opts.password} onChange={(e) => update({ password: e.target.value })} placeholder="Enter a strong password" />
          <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: '6px' }}>Password is applied locally — never sent to any server.</p>
        </>)}
      </div>
    );
  }

  // Number pages
  if (tool.slug === 'number-pages') {
    return (
      <div style={panelStyle}>
        <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#94A3B8', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Page Number Settings</p>
        {field(<>
          {label('Position')}
          <select style={selectStyle} value={opts.pageNumberPosition} onChange={(e) => update({ pageNumberPosition: e.target.value as 'bottom-center' | 'bottom-right' | 'top-center' })}>
            <option value="bottom-center">Bottom Center</option>
            <option value="bottom-right">Bottom Right</option>
            <option value="top-center">Top Center</option>
          </select>
        </>)}
        {field(<>
          {label('Start From')}
          <input type="number" min={1} style={inputStyle} value={opts.pageNumberStart}
            onChange={(e) => update({ pageNumberStart: parseInt(e.target.value) || 1 })} />
        </>)}
      </div>
    );
  }

  return null;
}
