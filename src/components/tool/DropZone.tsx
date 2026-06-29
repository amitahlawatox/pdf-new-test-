'use client';

import { useCallback, useRef, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { StateDisplay, ProcessingState } from './StateDisplay';

const MAX_FILES = 10;

interface DroppedFile {
  file: File;
  id: string;
}

interface DropZoneProps {
  accept?: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  label?: string;
  hint?: string;
}

export function DropZone({
  accept = '.pdf',
  multiple = false,
  onFilesSelected,
  label = 'Drop your PDF here',
  hint,
}: DropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<DroppedFile[]>([]);
  const [engineState, setEngineState] = useState<ProcessingState>('idle');
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const arr = Array.from(newFiles);
      const wrapped = arr.map((f) => ({ file: f, id: `${f.name}-${f.size}-${Date.now()}` }));
      const updated = multiple ? [...files, ...wrapped] : wrapped;
      if (multiple && updated.length > MAX_FILES) {
        setFileError(`Maximum ${MAX_FILES} files allowed. Please remove some files first.`);
        return;
      }
      setFileError(null);
      setFiles(updated);
      setEngineState('file-loaded');
      onFilesSelected(updated.map((w) => w.file));
    },
    [files, multiple, onFilesSelected],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    if (updated.length === 0) setEngineState('idle');
    onFilesSelected(updated.map((w) => w.file));
  };

  const firstName = files[0]?.file.name;
  const firstSizeMB = files[0] ? (files[0].file.size / 1024 / 1024).toFixed(1) : undefined;
  const fileCountLabel = files.length > 1 ? `${files.length} files loaded` : undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <StateDisplay
        state={engineState}
        fileName={fileCountLabel ?? firstName}
        fileSizeMB={files.length > 1 ? undefined : firstSizeMB}
      />
      {fileError && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '12px',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          <span style={{ fontSize: '0.8125rem', color: '#FCA5A5' }}>{fileError}</span>
        </div>
      )}

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label={label}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        style={{
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          padding: '32px 24px',
          borderRadius: '20px',
          border: `2px dashed ${dragging ? '#3B82F6' : 'rgba(255,255,255,0.1)'}`,
          background: dragging ? 'rgba(59,130,246,0.05)' : 'rgba(30,41,59,0.4)',
          cursor: 'pointer',
          transition: 'all 200ms ease',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
        className={dragging ? 'dropzone-active' : ''}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '16px',
            background: dragging ? 'rgba(59,130,246,0.15)' : 'rgba(34,197,94,0.1)',
            border: `1px solid ${dragging ? 'rgba(59,130,246,0.3)' : 'rgba(34,197,94,0.2)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {dragging
            ? <Upload size={24} style={{ color: '#3B82F6' }} />
            : <FileText size={24} style={{ color: '#22C55E' }} />}
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.9375rem', marginBottom: '4px' }}>
            {label}
          </p>
          <p style={{ fontSize: '0.8125rem', color: '#64748B' }}>
            {hint ?? `or click to browse — ${accept}`}
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => e.target.files && addFiles(e.target.files)}
          style={{ display: 'none' }}
          aria-hidden="true"
        />
      </div>

      {/* File queue */}
      {files.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {files.map(({ file, id }) => (
            <div
              key={id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '12px',
                background: 'rgba(30,41,59,0.7)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <FileText size={16} style={{ color: '#22C55E', flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: '0.875rem', color: '#CBD5E1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {file.name}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#475569', flexShrink: 0 }}>
                {(file.size / 1024 / 1024).toFixed(1)}MB
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(id); }}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '6px',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
                aria-label={`Remove ${file.name}`}
              >
                <X size={12} style={{ color: '#EF4444' }} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
