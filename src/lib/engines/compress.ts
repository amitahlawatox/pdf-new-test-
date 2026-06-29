import { PDFDocument } from 'pdf-lib';

export type CompressionLevel = 'low' | 'medium' | 'high';

const LEVEL_CONFIG: Record<CompressionLevel, { scale: number; quality: number }> = {
  low:    { scale: 1.2, quality: 0.85 },
  medium: { scale: 0.9, quality: 0.70 },
  high:   { scale: 0.7, quality: 0.50 },
};

export async function compressPDF(
  file: File,
  level: CompressionLevel = 'medium'
): Promise<Uint8Array> {
  const { scale, quality } = LEVEL_CONFIG[level];
  const arrayBuffer = await file.arrayBuffer();

  // Use pdfjs to render each page to canvas, then re-embed as compressed JPEG
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const outDoc = await PDFDocument.create();

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const ctx = canvas.getContext('2d', { alpha: false })!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx as unknown as CanvasRenderingContext2D,
      canvas,
      viewport,
      background: 'white',
    }).promise;

    // Export as JPEG (much smaller than PNG for mixed content)
    const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
    const base64 = jpegDataUrl.split(',')[1];
    const jpegBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

    const jpegImage = await outDoc.embedJpg(jpegBytes);
    const outPage = outDoc.addPage([viewport.width, viewport.height]);
    outPage.drawImage(jpegImage, { x: 0, y: 0, width: viewport.width, height: viewport.height });
  }

  return outDoc.save({ useObjectStreams: true, addDefaultPage: false });
}
