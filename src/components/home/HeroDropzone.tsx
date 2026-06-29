'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, Shield, Cpu, ArrowRight, FileText, X } from 'lucide-react';

const MAX_FILES = 10;

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
  'drag-over':'DROP TO LOAD',
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

interface LoadedFile {
  name: string;
  sizeMB: string;
}

export function HeroDropzone() {
  const [state, setState] = useState<EngineState>('idle');
  const [files, setFiles] = useState<LoadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((incoming: File[]) => {
    const valid = incoming.filter(
      (f) => f.type.includes('pdf') || f.name.toLowerCase().endsWith('.pdf'),
    );
    if (incoming.length > 0 && valid.length === 0) {
      setState('error');
      setError('Only PDF files are supported here.');
      return;
    }
    const combined = [...files, ...valid.map((f) => ({ name: f.name, sizeMB: (f.size / 1024 / 1024).toFixed(1) }))];
    if (combined.length > MAX_FILES) {
      setState('error');
      setError(`Maximum ${MAX_FILES} files allowed.`);
      return;
    }
    setError(null);
    setState('loading');
    setFiles(combined);
    setTimeout(() => setState('ready'), 500);
  }, [files]);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setState('idle');
      handleFiles(Array.from(e.dataTransfer.files));
    },
    [handleFiles],
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setState('drag-over');
  };

  const onDragLeave = () => {
    if (state === 'drag-over') setState('idle');
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(Array.from(e.target.files));
  };

  const removeFile = (idx: number) => {
    const updated = files.filter((_, i) => i !== idx);
    setFiles(updated);
    if (updated.length === 0) setState('idle');
  };

  const scrollToTools = () => {
    document.getElementById('tools-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  const isDragOver = state === 'drag-over';
  const stateColor = STATE_COLORS[state];
  const hasFiles = files.length > 0;

  return (
    <div className="w-full">
      {/* State Machine Badge */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            background: `${stateColor}15`,
            border: `1px solid ${stateColor}30`,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: stateColor,
              display: 'inline-block',
              boxShadow: `0 0 6px ${stateColor}`,
            }}
          />
          <span style={{ color: stateColor, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em' }}>
            {STATE_LABELS[state]}
            {state === 'ready' && files.length > 0 && ` — ${files.length} file${files.length > 1 ? 's' : ''} loaded`}
          </span>
        </div>
      </div>

      {/* Main Dropzone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Drop a PDF here or click to select files"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={isDragOver ? 'dropzone-active' : ''}
        style={{
          minHeight: '240px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '18px',
          padding: '36px 28px',
          borderRadius: '22px',
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
            width: 64,
            height: 64,
            borderRadius: '20px',
            background: isDragOver
              ? 'rgba(59,130,246,0.2)'
              : 'rgba(34,197,94,0.12)',
            border: `1.5px solid ${isDragOver ? 'rgba(59,130,246,0.4)' : 'rgba(34,197,94,0.25)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 200ms ease',
            flexShrink: 0,
          }}
        >
          {isDragOver
            ? <Upload size={28} style={{ color: '#3B82F6' }} />
            : <FileText size={28} style={{ color: '#22C55E' }} />}
        </div>

        {/* Text */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '6px' }}>
            {isDragOver ? 'Release to load files' : 'Drop your PDF here'}
          </p>
          <p style={{ fontSize: '0.8125rem', color: '#64748B' }}>
            or{' '}
            <span style={{ color: '#22C55E', fontWeight: 600 }}>click to browse</span>
            {' '}· up to {MAX_FILES} files
          </p>
        </div>

        {/* Privacy notice */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            background: 'rgba(34,197,94,0.06)',
            border: '1px solid rgba(34,197,94,0.15)',
          }}
        >
          <Shield size={12} style={{ color: '#22C55E', flexShrink: 0 }} />
          <span style={{ fontSize: '0.7rem', color: '#4ADE80', fontWeight: 500 }}>
            Files never leave your device — 100% local processing
          </span>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
          multiple
          onChange={onInputChange}
          style={{ display: 'none' }}
          aria-hidden="true"
        />
      </div>

      {/* Error message */}
      {error && (
        <div
          className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <span style={{ fontSize: '0.8125rem', color: '#FCA5A5' }}>{error}</span>
        </div>
      )}

      {/* File list after loading */}
      {hasFiles && (
        <div
          className="mt-4 rounded-[18px] overflow-hidden"
          style={{ border: '1px solid rgba(34,197,94,0.2)', background: 'rgba(34,197,94,0.05)' }}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: '1px solid rgba(34,197,94,0.12)' }}
          >
            <div className="flex items-center gap-2">
              <Cpu size={14} style={{ color: '#22C55E' }} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#F8FAFC' }}>
                {files.length} file{files.length > 1 ? 's' : ''} ready
              </span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); scrollToTools(); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 16px',
                borderRadius: '10px',
                background: '#22C55E',
                color: '#0F172A',
                fontWeight: 700,
                fontSize: '0.8125rem',
                border: 'none',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              Choose Tool <ArrowRight size={13} />
            </button>
          </div>
          <div style={{ maxHeight: '140px', overflowY: 'auto', padding: '8px' }}>
            {files.map((f, idx) => (
              <div
                key={`${f.name}-${idx}`}
                className="flex items-center gap-2"
                style={{ padding: '6px 8px', borderRadius: '10px' }}
              >
                <FileText size={13} style={{ color: '#22C55E', flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: '0.8125rem', color: '#CBD5E1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {f.name}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#475569', flexShrink: 0 }}>{f.sizeMB}MB</span>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '5px',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                  aria-label={`Remove ${f.name}`}
                >
                  <X size={10} style={{ color: '#EF4444' }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
