'use client';

import { useState, useCallback, useRef } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Shield, Cpu, CheckCircle, Zap, FileDown } from 'lucide-react';
import { getToolBySlug, TOOLS, CATEGORY_META } from '@/lib/tools';
import { DropZone } from '@/components/tool/DropZone';
import { StateDisplay, ProcessingState } from '@/components/tool/StateDisplay';
import { ToolConfig, ToolOptions } from '@/components/tool/ToolConfig';
import { AdUnit } from '@/components/layout/AdUnit';
import { ToolCard } from '@/components/home/ToolCard';

interface DownloadItem {
  name: string;
  url: string;
}

export function ToolPageClient({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const tool = getToolBySlug(slug);
  if (!tool) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F8FAFC' }}>Tool not found</p>
        <Link href="/" style={{ color: '#22C55E', textDecoration: 'none', fontWeight: 600 }}>← Back to all tools</Link>
      </div>
    );
  }

  const [files, setFiles] = useState<File[]>([]);
  const [processState, setProcessState] = useState<ProcessingState>('idle');
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [toolOpts, setToolOpts] = useState<ToolOptions>({});
  const revokeUrls = useRef<string[]>([]);

  const catMeta = CATEGORY_META[tool.category];
  const relatedTools = TOOLS.filter((t) => t.category === tool.category && t.slug !== slug).slice(0, 4);

  const handleFilesSelected = useCallback((selected: File[]) => {
    setFiles(selected);
    setProcessState(selected.length > 0 ? 'file-loaded' : 'idle');
    revokeUrls.current.forEach((u) => URL.revokeObjectURL(u));
    revokeUrls.current = [];
    setDownloads([]);
    setErrorMsg('');
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addDownload = (name: string, bytes: any) => {
    const blob = bytes instanceof Blob ? bytes : new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    revokeUrls.current.push(url);
    return { name, url };
  };

  const handleProcess = useCallback(async () => {
    if (!files.length) return;
    setErrorMsg('');
    setProcessState('engine-warming');
    setProgress(0);

    try {
      await new Promise((r) => setTimeout(r, 400));
      setProcessState('processing');
      setProgress(20);

      const results: DownloadItem[] = [];
      const baseName = files[0].name.replace(/\.pdf$/i, '');

      switch (slug) {
        case 'merge-pdf': {
          const { mergePDFs } = await import('@/lib/engines/merge');
          setProgress(60);
          const bytes = await mergePDFs(files);
          setProgress(90);
          results.push(addDownload('merged.pdf', bytes));
          break;
        }

        case 'split-pdf': {
          const { splitPDF } = await import('@/lib/engines/split');
          setProgress(40);
          let splitOpts;
          if (toolOpts.splitMode === 'extract' && toolOpts.splitRange) {
            const pages = toolOpts.splitRange.split(',').map((s) => parseInt(s.trim())).filter(Boolean);
            splitOpts = { mode: 'extract' as const, pages };
          } else if (toolOpts.splitMode === 'range' && toolOpts.splitRange) {
            const ranges = toolOpts.splitRange.split(',').map((s) => {
              const [a, b] = s.trim().split('-').map(Number);
              return { start: a || 1, end: b || a || 1 };
            });
            splitOpts = { mode: 'range' as const, ranges };
          } else {
            splitOpts = { mode: 'every' as const, everyN: toolOpts.splitEveryN || 1 };
          }
          const parts = await splitPDF(files[0], splitOpts);
          setProgress(85);
          parts.forEach((p) => results.push(addDownload(p.name, p.bytes)));
          break;
        }

        case 'compress-pdf': {
          const { compressPDF } = await import('@/lib/engines/compress');
          setProgress(50);
          const bytes = await compressPDF(files[0], toolOpts.compressionLevel || 'medium');
          setProgress(90);
          results.push(addDownload(`${baseName}_compressed.pdf`, bytes));
          break;
        }

        case 'rotate-pdf': {
          const { rotatePDF } = await import('@/lib/engines/rotate');
          setProgress(50);
          const bytes = await rotatePDF(files[0], toolOpts.rotation || 90);
          setProgress(90);
          results.push(addDownload(`${baseName}_rotated.pdf`, bytes));
          break;
        }

        case 'delete-pages': {
          const { deletePages } = await import('@/lib/engines/pages');
          const pages = (toolOpts.splitRange || '').split(',').map((s) => parseInt(s.trim())).filter(Boolean);
          if (!pages.length) throw new Error('Enter page numbers to delete (e.g. 2, 4, 6)');
          setProgress(60);
          const bytes = await deletePages(files[0], pages);
          setProgress(90);
          results.push(addDownload(`${baseName}_deleted.pdf`, bytes));
          break;
        }

        case 'extract-pages': {
          const { extractPages } = await import('@/lib/engines/pages');
          const pages = (toolOpts.splitRange || '').split(',').map((s) => parseInt(s.trim())).filter(Boolean);
          if (!pages.length) throw new Error('Enter page numbers to extract (e.g. 1, 3, 5)');
          setProgress(60);
          const bytes = await extractPages(files[0], pages);
          setProgress(90);
          results.push(addDownload(`${baseName}_extracted.pdf`, bytes));
          break;
        }

        case 'number-pages': {
          const { numberPages } = await import('@/lib/engines/pages');
          setProgress(50);
          const bytes = await numberPages(files[0], {
            position: toolOpts.pageNumberPosition || 'bottom-center',
            startFrom: toolOpts.pageNumberStart || 1,
          });
          setProgress(90);
          results.push(addDownload(`${baseName}_numbered.pdf`, bytes));
          break;
        }

        case 'flatten-pdf': {
          const { flattenPDF } = await import('@/lib/engines/pages');
          setProgress(60);
          const bytes = await flattenPDF(files[0]);
          setProgress(90);
          results.push(addDownload(`${baseName}_flattened.pdf`, bytes));
          break;
        }

        case 'watermark-pdf': {
          const { watermarkPDF } = await import('@/lib/engines/security');
          setProgress(50);
          const bytes = await watermarkPDF(files[0], toolOpts.watermarkText || 'CONFIDENTIAL', {
            opacity: toolOpts.watermarkOpacity || 0.15,
          });
          setProgress(90);
          results.push(addDownload(`${baseName}_watermarked.pdf`, bytes));
          break;
        }

        case 'unlock-pdf': {
          const { unlockPDF } = await import('@/lib/engines/security');
          setProgress(60);
          const bytes = await unlockPDF(files[0]);
          setProgress(90);
          results.push(addDownload(`${baseName}_unlocked.pdf`, bytes));
          break;
        }

        case 'protect-pdf': {
          const { protectPDF } = await import('@/lib/engines/security');
          if (!toolOpts.password) throw new Error('Enter a password to protect the PDF');
          setProgress(60);
          const bytes = await protectPDF(files[0], toolOpts.password);
          setProgress(90);
          results.push(addDownload(`${baseName}_protected.pdf`, bytes));
          break;
        }

        case 'jpg-to-pdf':
        case 'png-to-pdf': {
          const { imagesToPDF } = await import('@/lib/engines/images');
          setProgress(60);
          const bytes = await imagesToPDF(files);
          setProgress(90);
          results.push(addDownload('images_converted.pdf', bytes));
          break;
        }

        case 'pdf-to-jpg':
        case 'pdf-to-png': {
          const { pdfToImages } = await import('@/lib/engines/images');
          const fmt = slug === 'pdf-to-png' ? 'png' : 'jpeg';
          setProgress(30);
          const imgs = await pdfToImages(files[0], fmt);
          setProgress(85);
          imgs.forEach((img) => {
            const url = URL.createObjectURL(img.blob);
            revokeUrls.current.push(url);
            results.push({ name: img.name, url });
          });
          break;
        }

        case 'pdf-to-tiff': {
          const { pdfToTiff } = await import('@/lib/engines/convert');
          setProgress(30);
          const blobs = await pdfToTiff(files[0]);
          setProgress(85);
          blobs.forEach((blob, i) => {
            const url = URL.createObjectURL(blob);
            revokeUrls.current.push(url);
            results.push({ name: `${baseName}_page${i + 1}.png`, url });
          });
          break;
        }

        case 'pdf-to-word': {
          const { pdfToWord } = await import('@/lib/engines/convert');
          setProgress(40);
          const blob = await pdfToWord(files[0]);
          setProgress(90);
          const url = URL.createObjectURL(blob);
          revokeUrls.current.push(url);
          results.push({ name: `${baseName}.docx`, url });
          break;
        }

        case 'pdf-to-excel': {
          const { pdfToExcel } = await import('@/lib/engines/convert');
          setProgress(40);
          const blob = await pdfToExcel(files[0]);
          setProgress(90);
          const url = URL.createObjectURL(blob);
          revokeUrls.current.push(url);
          results.push({ name: `${baseName}.xlsx`, url });
          break;
        }

        case 'pdf-to-ppt': {
          const { pdfToPowerPoint } = await import('@/lib/engines/convert');
          setProgress(30);
          const blob = await pdfToPowerPoint(files[0]);
          setProgress(90);
          const url = URL.createObjectURL(blob);
          revokeUrls.current.push(url);
          results.push({ name: `${baseName}.pptx`, url });
          break;
        }

        case 'word-to-pdf': {
          const { wordToPDF } = await import('@/lib/engines/convert');
          setProgress(40);
          const bytes = await wordToPDF(files[0]);
          setProgress(90);
          results.push(addDownload(`${baseName}.pdf`, bytes));
          break;
        }

        case 'excel-to-pdf': {
          const { excelToPDF } = await import('@/lib/engines/convert');
          setProgress(40);
          const bytes = await excelToPDF(files[0]);
          setProgress(90);
          results.push(addDownload(`${baseName}.pdf`, bytes));
          break;
        }

        case 'ppt-to-pdf': {
          const { pptToPDF } = await import('@/lib/engines/convert');
          setProgress(40);
          const bytes = await pptToPDF(files[0]);
          setProgress(90);
          results.push(addDownload(`${baseName}.pdf`, bytes));
          break;
        }

        case 'html-to-pdf': {
          const { htmlToPDF } = await import('@/lib/engines/convert');
          setProgress(30);
          let htmlContent = toolOpts.htmlContent || '';
          if (!htmlContent && files[0]) {
            htmlContent = await files[0].text();
          }
          if (!htmlContent) throw new Error('Paste HTML content or drop an .html file');
          const bytes = await htmlToPDF(htmlContent);
          setProgress(90);
          results.push(addDownload(`${baseName}.pdf`, bytes));
          break;
        }

        case 'sign-pdf': {
          if (!toolOpts.signatureDataUrl) throw new Error('Please draw your signature before processing');
          const { signPDF } = await import('@/lib/engines/sign');
          setProgress(60);
          const bytes = await signPDF(files[0], toolOpts.signatureDataUrl, {
            pageIndex: 0,
            x: 50,
            y: 100,
            width: 180,
            height: 54,
          });
          setProgress(90);
          results.push(addDownload(`${baseName}_signed.pdf`, bytes));
          break;
        }

        case 'ocr-pdf': {
          const { ocrPDF } = await import('@/lib/engines/ocr');
          setProgress(10);
          const bytes = await ocrPDF(files[0], (pct) => setProgress(10 + Math.round(pct * 0.8)));
          setProgress(95);
          results.push(addDownload(`${baseName}_ocr.pdf`, bytes));
          break;
        }

        case 'repair-pdf': {
          const { PDFDocument } = await import('pdf-lib');
          setProgress(50);
          const ab = await files[0].arrayBuffer();
          const doc = await PDFDocument.load(ab, { ignoreEncryption: true, throwOnInvalidObject: false });
          const bytes = await doc.save({ useObjectStreams: false });
          setProgress(90);
          results.push(addDownload(`${baseName}_repaired.pdf`, bytes));
          break;
        }

        case 'pdf-to-pdfa': {
          const { PDFDocument } = await import('pdf-lib');
          setProgress(40);
          const ab = await files[0].arrayBuffer();
          const doc = await PDFDocument.load(ab, { ignoreEncryption: true });
          doc.setTitle(files[0].name);
          doc.setCreator('PDF Genius Pro — PDF/A Converter');
          doc.setProducer('pdf-lib');
          const bytes = await doc.save({ useObjectStreams: false, addDefaultPage: false });
          setProgress(90);
          results.push(addDownload(`${baseName}_pdfa.pdf`, bytes));
          break;
        }

        case 'reorder-pdf': {
          const { reorderPages } = await import('@/lib/engines/pages');
          const order = (toolOpts.pageOrder || '')
            .split(',')
            .map((s) => parseInt(s.trim()))
            .filter((n) => !isNaN(n) && n > 0);
          if (!order.length) throw new Error('Enter the new page order (e.g. 3, 1, 2)');
          setProgress(60);
          const bytes = await reorderPages(files[0], order);
          setProgress(90);
          results.push(addDownload(`${baseName}_reordered.pdf`, bytes));
          break;
        }

        case 'crop-pdf': {
          const { cropPDF } = await import('@/lib/engines/pages');
          setProgress(60);
          const bytes = await cropPDF(files[0], {
            top: toolOpts.cropTop ?? 20,
            right: toolOpts.cropRight ?? 20,
            bottom: toolOpts.cropBottom ?? 20,
            left: toolOpts.cropLeft ?? 20,
          });
          setProgress(90);
          results.push(addDownload(`${baseName}_cropped.pdf`, bytes));
          break;
        }

        case 'fill-pdf': {
          const { PDFDocument } = await import('pdf-lib');
          setProgress(40);
          const ab = await files[0].arrayBuffer();
          const doc = await PDFDocument.load(ab, { ignoreEncryption: true });
          const form = doc.getForm();
          const fields = form.getFields();
          for (const field of fields) {
            const name = field.getName();
            try {
              const tf = form.getTextField(name);
              if (!tf.getText()) tf.setText(`[${name}]`);
            } catch { /* field is not a text field */ }
          }
          const bytes = await doc.save();
          setProgress(90);
          results.push(addDownload(`${baseName}_filled.pdf`, bytes));
          break;
        }

        case 'redact-pdf': {
          const { redactPDF } = await import('@/lib/engines/security');
          const pageNum = toolOpts.redactPage ?? 1;
          setProgress(60);
          const ab = await files[0].arrayBuffer();
          const { PDFDocument } = await import('pdf-lib');
          const doc = await PDFDocument.load(ab, { ignoreEncryption: true });
          const page = doc.getPage(pageNum - 1);
          const { width, height } = page.getSize();
          const bytes = await redactPDF(files[0], [{ page: pageNum, x: 0, y: 0, width, height }]);
          setProgress(90);
          results.push(addDownload(`${baseName}_redacted.pdf`, bytes));
          break;
        }

        default: {
          await new Promise((r) => setTimeout(r, 800));
          setProgress(90);
          const url = URL.createObjectURL(files[0]);
          revokeUrls.current.push(url);
          results.push({ name: `${baseName}_processed${tool.outputFormat}`, url });
          break;
        }
      }

      setProgress(100);
      setDownloads(results);
      setProcessState('done');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Processing failed. Please try again.');
      setProcessState('error');
      setProgress(0);
    }
  }, [files, slug, tool, toolOpts]);

  const canProcess = files.length > 0 && processState !== 'processing' && processState !== 'engine-warming';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="flex items-center gap-1.5 text-sm font-medium" style={{ color: '#64748B', textDecoration: 'none' }}>
          <ArrowLeft size={15} /> All Tools
        </Link>
        <span style={{ color: '#334155' }}>/</span>
        <Link href={`/#${tool.category}`} style={{ fontSize: '0.875rem', color: catMeta.color, textDecoration: 'none', fontWeight: 500 }}>{catMeta.label}</Link>
        <span style={{ color: '#334155' }}>/</span>
        <span style={{ fontSize: '0.875rem', color: '#94A3B8' }}>{tool.name}</span>
      </nav>

      <div className="flex gap-8 lg:gap-10" style={{ alignItems: 'flex-start' }}>
        {/* Left rail ad */}
        <div className="hidden xl:block" style={{ flexShrink: 0 }}>
          <div style={{ position: 'sticky', top: '88px' }}>
            <AdUnit variant="tall" id="ad-left-rail" />
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width: 52, height: 52, borderRadius: '16px', background: `${tool.color}18`, border: `1.5px solid ${tool.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 800, color: tool.color }}>{tool.name.slice(0, 2)}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: catMeta.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{catMeta.label}</span>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.03em', lineHeight: 1.15 }}>{tool.name}</h1>
              </div>
            </div>
            <p style={{ fontSize: '1rem', color: '#64748B', lineHeight: 1.65, maxWidth: '560px' }}>{tool.description}</p>
          </div>

          {/* State badge */}
          <div style={{ marginBottom: '12px' }}>
            <StateDisplay state={processState} errorMessage={errorMsg} progress={processState === 'processing' ? progress : undefined} />
          </div>

          {/* Drop zone */}
          <div style={{ padding: '24px', borderRadius: '24px', background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', marginBottom: '12px' }}>
            <DropZone
              accept={slug === 'html-to-pdf' ? '.html,.htm' : tool.inputFormats.join(',')}
              multiple={['merge-pdf', 'jpg-to-pdf', 'png-to-pdf'].includes(slug)}
              onFilesSelected={handleFilesSelected}
              label={`Drop ${tool.inputFormats.join(' or ')} file${['merge-pdf', 'jpg-to-pdf', 'png-to-pdf'].includes(slug) ? 's' : ''} here`}
            />
          </div>

          {/* Tool-specific config */}
          {files.length > 0 && (
            <ToolConfig tool={tool} onChange={setToolOpts} />
          )}

          {/* Process button */}
          {files.length > 0 && processState !== 'done' && (
            <button
              onClick={handleProcess}
              disabled={!canProcess}
              style={{
                width: '100%', padding: '16px 24px', borderRadius: '16px',
                background: canProcess ? '#22C55E' : 'rgba(34,197,94,0.35)',
                color: '#0F172A', fontWeight: 800, fontSize: '1rem',
                border: 'none', cursor: canProcess ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: 'all 200ms ease', marginBottom: '12px',
                boxShadow: canProcess ? '0 4px 20px rgba(34,197,94,0.3)' : 'none',
              }}
            >
              <Cpu size={18} />
              {processState === 'engine-warming' ? 'Starting local engine...' :
               processState === 'processing' ? `Processing... ${progress}%` :
               `Run ${tool.name}`}
            </button>
          )}

          {/* Downloads */}
          {downloads.length > 0 && processState === 'done' && (
            <div style={{ padding: '20px 24px', borderRadius: '16px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', marginBottom: '12px' }}>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle size={20} style={{ color: '#22C55E', flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 700, color: '#F8FAFC', fontSize: '1rem' }}>
                    {downloads.length === 1 ? 'Your file is ready' : `${downloads.length} files ready`}
                  </p>
                  <p style={{ fontSize: '0.8125rem', color: '#64748B' }}>Processed 100% locally — never sent to any server</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {downloads.map((dl) => (
                  <a
                    key={dl.url}
                    href={dl.url}
                    download={dl.name}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px',
                      borderRadius: '12px', background: '#22C55E', color: '#0F172A',
                      fontWeight: 700, fontSize: '0.9375rem', textDecoration: 'none',
                    }}
                  >
                    <FileDown size={18} />
                    {dl.name}
                  </a>
                ))}
              </div>
              <button
                onClick={() => { setFiles([]); setProcessState('idle'); setDownloads([]); }}
                style={{ marginTop: '12px', background: 'none', border: 'none', color: '#64748B', fontSize: '0.8125rem', cursor: 'pointer', padding: '4px 0' }}
              >
                Process another file →
              </button>
            </div>
          )}

          {/* Privacy guarantee */}
          <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '24px' }}>
            <Shield size={16} style={{ color: '#22C55E', flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.6 }}>
              <strong style={{ color: '#64748B' }}>Privacy guarantee:</strong> All processing runs in your browser using WebAssembly and pdf-lib.
              Your file is never transmitted to any server. Verify this in DevTools → Network — zero upload requests.
            </p>
          </div>

          {/* How to use */}
          <div style={{ padding: '24px', borderRadius: '20px', background: 'rgba(30,41,59,0.4)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '16px' }}>
              How to use {tool.name}
            </h2>
            <ol style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '0', listStyle: 'none' }}>
              {[
                `Drop your ${tool.inputFormats.join(' or ')} file into the upload area above`,
                tool.slug === 'merge-pdf' ? 'Add multiple files and arrange them in order' : 'Configure options if needed',
                `Click "Run ${tool.name}" — processing happens instantly in your browser`,
                `Download your ${tool.outputFormat} file`,
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: `${tool.color}20`, border: `1px solid ${tool.color}30`, color: tool.color, fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{i + 1}</span>
                  <span style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6 }}>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Mid ad */}
          <div className="flex justify-center my-6">
            <AdUnit variant="rectangle" id={`ad-tool-${slug}-mid`} />
          </div>

          {/* Related tools */}
          {relatedTools.length > 0 && (
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '16px', letterSpacing: '-0.01em' }}>
                Related {catMeta.label} tools
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                {relatedTools.map((t) => <ToolCard key={t.slug} tool={t} />)}
              </div>
            </div>
          )}
        </div>

        {/* Right rail ads */}
        <div className="hidden lg:flex flex-col gap-4" style={{ flexShrink: 0 }}>
          <div style={{ position: 'sticky', top: '88px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <AdUnit variant="rectangle" id="ad-right-rail-top" />
            <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.07)', width: '300px' }}>
              <div className="flex items-center gap-2 mb-3">
                <Zap size={14} style={{ color: '#22C55E' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22C55E', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Privacy Proof</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#64748B', lineHeight: 1.6 }}>
                Open DevTools (F12) → Network tab → Drop a file and process it. You will see <strong style={{ color: '#94A3B8' }}>zero outbound requests</strong> for your file data.
              </p>
            </div>
            <AdUnit variant="rectangle" id="ad-right-rail-mid" />
          </div>
        </div>
      </div>
    </div>
  );
}
