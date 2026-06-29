'use client';

import { useEffect, useRef, useState } from 'react';
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
  pageOrder?: string;
  cropTop?: number;
  cropRight?: number;
  cropBottom?: number;
  cropLeft?: number;
  signatureDataUrl?: string;
  htmlContent?: string;
  redactPage?: number;
}

interface ToolConfigProps {
  tool: Tool;
  onChange: (opts: ToolOptions) => void;
}

const lbl = (text: string) => (
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
  boxSizing: 'border-box',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none',
  WebkitAppearance: 'none',
  cursor: 'pointer',
};

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: '16px' }}>
      <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#94A3B8', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</p>
      {children}
    </div>
  );
}

function Field({ children }: { children: React.ReactNode }) {
  return <div style={{ marginBottom: '16px' }}>{children}</div>;
}

function SignaturePad({ onChange }: { onChange: (dataUrl: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasSig, setHasSig] = useState(false);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    setDrawing(true);
    const ctx = canvas.getContext('2d')!;
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    const ctx = canvas.getContext('2d')!;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1E293B';
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const end = () => {
    setDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    setHasSig(true);
    onChange(canvas.toDataURL('image/png'));
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSig(false);
    onChange('');
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={400}
        height={120}
        style={{ width: '100%', height: 120, borderRadius: '12px', background: '#F8FAFC', border: '2px dashed rgba(255,255,255,0.15)', cursor: 'crosshair', touchAction: 'none' }}
        onMouseDown={start}
        onMouseMove={draw}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={draw}
        onTouchEnd={end}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <span style={{ fontSize: '0.75rem', color: '#475569' }}>Draw your signature above</span>
        {hasSig && (
          <button onClick={clear} style={{ fontSize: '0.75rem', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

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
    pageOrder: '',
    cropTop: 20,
    cropRight: 20,
    cropBottom: 20,
    cropLeft: 20,
    signatureDataUrl: '',
    htmlContent: '',
    redactPage: 1,
  });

  const update = (patch: Partial<ToolOptions>) => {
    const next = { ...opts, ...patch };
    setOpts(next);
    onChange(next);
  };

  useEffect(() => { onChange(opts); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (tool.slug === 'compress-pdf') {
    return (
      <Panel title="Compression Settings">
        <Field>
          {lbl('Compression Level')}
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['low', 'medium', 'high'] as CompressionLevel[]).map((lvl) => (
              <button key={lvl} onClick={() => update({ compressionLevel: lvl })}
                style={{ flex: 1, padding: '10px', borderRadius: '10px', fontWeight: 600, fontSize: '0.875rem', border: `1.5px solid ${opts.compressionLevel === lvl ? '#22C55E' : 'rgba(255,255,255,0.1)'}`, background: opts.compressionLevel === lvl ? 'rgba(34,197,94,0.12)' : 'transparent', color: opts.compressionLevel === lvl ? '#22C55E' : '#64748B', cursor: 'pointer', textTransform: 'capitalize' }}>
                {lvl}
              </button>
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: '8px' }}>
            {opts.compressionLevel === 'low' && 'Minimal compression — best quality preserved'}
            {opts.compressionLevel === 'medium' && 'Balanced — good quality, smaller size'}
            {opts.compressionLevel === 'high' && 'Maximum compression — smallest file size'}
          </p>
        </Field>
      </Panel>
    );
  }

  if (tool.slug === 'rotate-pdf') {
    return (
      <Panel title="Rotation">
        <Field>
          {lbl('Rotate By')}
          <div style={{ display: 'flex', gap: '8px' }}>
            {([90, 180, 270] as Rotation[]).map((deg) => (
              <button key={deg} onClick={() => update({ rotation: deg })}
                style={{ flex: 1, padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '1rem', border: `1.5px solid ${opts.rotation === deg ? '#3B82F6' : 'rgba(255,255,255,0.1)'}`, background: opts.rotation === deg ? 'rgba(59,130,246,0.12)' : 'transparent', color: opts.rotation === deg ? '#3B82F6' : '#64748B', cursor: 'pointer' }}>
                {deg}°
              </button>
            ))}
          </div>
        </Field>
      </Panel>
    );
  }

  if (tool.slug === 'split-pdf') {
    return (
      <Panel title="Split Options">
        <Field>
          {lbl('Mode')}
          <select style={selectStyle} value={opts.splitMode} onChange={(e) => update({ splitMode: e.target.value as 'every' | 'range' | 'extract' })}>
            <option value="every">Split every N pages</option>
            <option value="range">Custom page range (e.g. 1-3, 5-7)</option>
            <option value="extract">Extract specific pages (e.g. 1,3,5)</option>
          </select>
        </Field>
        {opts.splitMode === 'every' && (
          <Field>
            {lbl('Pages per file')}
            <input type="number" min={1} style={inputStyle} value={opts.splitEveryN}
              onChange={(e) => update({ splitEveryN: parseInt(e.target.value) || 1 })} />
          </Field>
        )}
        {(opts.splitMode === 'range' || opts.splitMode === 'extract') && (
          <Field>
            {lbl(opts.splitMode === 'range' ? 'Ranges (e.g. 1-3, 5-7)' : 'Pages (e.g. 1,3,5)')}
            <input type="text" style={inputStyle} placeholder={opts.splitMode === 'range' ? '1-3, 5-7' : '1, 3, 5'}
              value={opts.splitRange || ''} onChange={(e) => update({ splitRange: e.target.value })} />
          </Field>
        )}
      </Panel>
    );
  }

  if (tool.slug === 'watermark-pdf') {
    return (
      <Panel title="Watermark Settings">
        <Field>
          {lbl('Watermark Text')}
          <input type="text" style={inputStyle} value={opts.watermarkText} onChange={(e) => update({ watermarkText: e.target.value })} placeholder="CONFIDENTIAL" />
        </Field>
        <Field>
          {lbl(`Opacity: ${Math.round((opts.watermarkOpacity ?? 0.15) * 100)}%`)}
          <input type="range" min={5} max={60} value={Math.round((opts.watermarkOpacity ?? 0.15) * 100)}
            onChange={(e) => update({ watermarkOpacity: parseInt(e.target.value) / 100 })}
            style={{ width: '100%', accentColor: '#8B5CF6' }} />
        </Field>
      </Panel>
    );
  }

  if (tool.slug === 'protect-pdf') {
    return (
      <Panel title="Password Protection">
        <Field>
          {lbl('Password')}
          <input type="password" style={inputStyle} value={opts.password} onChange={(e) => update({ password: e.target.value })} placeholder="Enter a strong password" />
          <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: '6px' }}>Password is applied locally — never sent to any server.</p>
        </Field>
      </Panel>
    );
  }

  if (tool.slug === 'number-pages') {
    return (
      <Panel title="Page Number Settings">
        <Field>
          {lbl('Position')}
          <select style={selectStyle} value={opts.pageNumberPosition} onChange={(e) => update({ pageNumberPosition: e.target.value as 'bottom-center' | 'bottom-right' | 'top-center' })}>
            <option value="bottom-center">Bottom Center</option>
            <option value="bottom-right">Bottom Right</option>
            <option value="top-center">Top Center</option>
          </select>
        </Field>
        <Field>
          {lbl('Start From')}
          <input type="number" min={1} style={inputStyle} value={opts.pageNumberStart}
            onChange={(e) => update({ pageNumberStart: parseInt(e.target.value) || 1 })} />
        </Field>
      </Panel>
    );
  }

  if (tool.slug === 'delete-pages' || tool.slug === 'extract-pages') {
    return (
      <Panel title={tool.slug === 'delete-pages' ? 'Pages to Delete' : 'Pages to Extract'}>
        <Field>
          {lbl('Page numbers (comma separated, e.g. 1, 3, 5)')}
          <input type="text" style={inputStyle} placeholder="1, 3, 5"
            value={opts.splitRange || ''} onChange={(e) => update({ splitRange: e.target.value })} />
          <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: '6px' }}>
            Enter page numbers separated by commas. First page = 1.
          </p>
        </Field>
      </Panel>
    );
  }

  if (tool.slug === 'reorder-pdf') {
    return (
      <Panel title="Page Order">
        <Field>
          {lbl('New page order (e.g. 3, 1, 2 to put page 3 first)')}
          <input type="text" style={inputStyle} placeholder="e.g. 3, 1, 2"
            value={opts.pageOrder || ''} onChange={(e) => update({ pageOrder: e.target.value })} />
          <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: '6px' }}>
            Enter all page numbers in the desired order, separated by commas.
          </p>
        </Field>
      </Panel>
    );
  }

  if (tool.slug === 'crop-pdf') {
    return (
      <Panel title="Crop Margins (points to remove from each edge)">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {([['Top', 'cropTop'], ['Right', 'cropRight'], ['Bottom', 'cropBottom'], ['Left', 'cropLeft']] as const).map(([side, key]) => (
            <Field key={key}>
              {lbl(`${side} (pt)`)}
              <input type="number" min={0} max={200} style={inputStyle} value={opts[key] ?? 20}
                onChange={(e) => update({ [key]: parseInt(e.target.value) || 0 })} />
            </Field>
          ))}
        </div>
        <p style={{ fontSize: '0.75rem', color: '#475569' }}>1 pt ≈ 0.35mm. Default margins: 20pt on each side.</p>
      </Panel>
    );
  }

  if (tool.slug === 'sign-pdf') {
    return (
      <Panel title="Draw Your Signature">
        <SignaturePad onChange={(dataUrl) => update({ signatureDataUrl: dataUrl })} />
        <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: '8px' }}>
          Your signature will be placed on the last page. All processing is 100% local.
        </p>
      </Panel>
    );
  }

  if (tool.slug === 'html-to-pdf') {
    return (
      <Panel title="HTML Content">
        <Field>
          {lbl('Paste HTML or plain text')}
          <textarea
            rows={8}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.8125rem' }}
            placeholder="<h1>My Document</h1><p>Content goes here...</p>"
            value={opts.htmlContent || ''}
            onChange={(e) => update({ htmlContent: e.target.value })}
          />
          <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: '6px' }}>
            You can also drop an .html file using the dropzone above.
          </p>
        </Field>
      </Panel>
    );
  }

  if (tool.slug === 'redact-pdf') {
    return (
      <Panel title="Redaction Settings">
        <Field>
          {lbl('Page to redact (full-page black overlay)')}
          <input type="number" min={1} style={inputStyle} value={opts.redactPage ?? 1}
            onChange={(e) => update({ redactPage: parseInt(e.target.value) || 1 })} />
          <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: '6px' }}>
            Applies a full-page black redaction. For partial redaction, split the page first.
          </p>
        </Field>
      </Panel>
    );
  }

  return null;
}
