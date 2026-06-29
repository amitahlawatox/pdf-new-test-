'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, Shield, Cpu, ArrowRight, FileText } from 'lucide-react';

type EngineState =
  | 'idle'
  | 'drag-over'
  | 'loading'
  | 'ready'
  | 'processing'
  | 'done'
  | 'error';

const STATE_LABELS: Record<EngineState, string> = {
  idle:       'LOCAL ENGINE: READY',
  'drag-over':'DROP TO UPLOAD',
  loading:    'LOADING FILE...',
  ready:      'FILE LOADED',
  processing: 'PROCESSING LOCALLY...',
  done:       'COMPLETE — DOWNLOAD READY',
  error:      'ERROR — TRY AGAIN',
};

const STATE_COLORS: Record<EngineState, string> = {
  idle:       '#22C55E',
  'drag-over':'#3B82F6',
  loading:    '#F59E0B',
  ready:      '#22C55E',
  processing: '#8B5CF6',
  done:       '#22C55E',
  error:      '#EF4444',
};

export function HeroDropzone() {
  const [state, setState] = useState<EngineState>('idle');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.includes('pdf') && !file.name.endsWith('.pdf')) {
      setState('error');
      return;
    }
    setState('loading');
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    setFileName(file.name);
    setFileSize(sizeMB);
    setTimeout(() => setState('ready'), 600);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setState('idle');
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setState('drag-over');
  };

  const onDragLeave = () => {
    if (state === 'drag-over') setState('idle');
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const isDragOver = state === 'drag-over';
  const stateColor = STATE_COLORS[state];

  return (
    <div className="w-full" style={{ maxWidth: '720px', margin: '0 auto' }}>
      {/* State Machine Badge */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full state-badge"
          style={{
            background: `${stateColor}15`,
            border: `1px solid ${stateColor}30`,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: stateColor,
              display: 'inline-block',
              boxShadow: `0 0 8px ${stateColor}`,
              animation: state === 'processing' ? 'none' : undefined,
            }}
          />
          <span style={{ color: stateColor, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em' }}>
            {STATE_LABELS[state]}
            {state === 'ready' && fileName && ` — ${fileName} (${fileSize}MB)`}
          </span>
        </div>
      </div>

      {/* Main Dropzone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Drop a PDF here or click to select a file"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={isDragOver ? 'dropzone-active' : ''}
        style={{
          minHeight: '320px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          padding: '48px 32px',
          borderRadius: '28px',
          border: `2px dashed ${isDragOver ? '#3B82F6' : 'rgba(255,255,255,0.12)'}`,
          background: isDragOver
            ? 'rgba(59,130,246,0.06)'
            : 'rgba(30,41,59,0.5)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          cursor: 'pointer',
          transition: 'all 200ms ease',
          userSelect: 'none',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '24px',
            background: isDragOver
              ? 'rgba(59,130,246,0.2)'
              : 'rgba(34,197,94,0.12)',
            border: `1.5px solid ${isDragOver ? 'rgba(59,130,246,0.4)' : 'rgba(34,197,94,0.25)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 200ms ease',
          }}
        >
          {isDragOver
            ? <Upload size={36} style={{ color: '#3B82F6' }} />
            : <FileText size={36} style={{ color: '#22C55E' }} />}
        </div>

        {/* Text */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '8px' }}>
            {isDragOver ? 'Release to upload' : 'Drop your PDF here'}
          </p>
          <p style={{ fontSize: '0.875rem', color: '#64748B' }}>
            or{' '}
            <span style={{ color: '#22C55E', fontWeight: 600 }}>click to browse</span>
            {' '}— supports PDF, images, Word, Excel
          </p>
        </div>

        {/* Privacy inline notice */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: 'rgba(34,197,94,0.06)',
            border: '1px solid rgba(34,197,94,0.15)',
          }}
        >
          <Shield size={13} style={{ color: '#22C55E', flexShrink: 0 }} />
          <span style={{ fontSize: '0.75rem', color: '#4ADE80', fontWeight: 500 }}>
            Files never leave your device — processed 100% locally
          </span>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
          onChange={onInputChange}
          style={{ display: 'none' }}
          aria-hidden="true"
        />
      </div>

      {/* After file loaded: tool selection prompt */}
      {(state === 'ready' || state === 'processing' || state === 'done') && (
        <div
          className="mt-5 p-4 rounded-2xl"
          style={{
            background: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.2)',
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Cpu size={18} style={{ color: '#22C55E', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F8FAFC' }}>
                  {fileName}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  {fileSize}MB — Select a tool below to process this file
                </p>
              </div>
            </div>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                borderRadius: '12px',
                background: '#22C55E',
                color: '#0F172A',
                fontWeight: 700,
                fontSize: '0.8125rem',
                border: 'none',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              Choose Tool <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Sub-labels */}
      <div className="flex items-center justify-center gap-6 mt-5">
        {[
          { icon: Shield, label: 'GDPR Compliant' },
          { icon: Cpu,    label: 'WebAssembly Powered' },
          { icon: Upload, label: 'No Sign-up Required' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <Icon size={12} style={{ color: '#475569' }} />
            <span style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
