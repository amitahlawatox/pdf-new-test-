import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function ocrPDF(
  file: File,
  onProgress?: (pct: number) => void
): Promise<Uint8Array> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;

  const Tesseract = await import('tesseract.js');
  const worker = await Tesseract.createWorker('eng', 1, {
    workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/worker.min.js',
    langPath: 'https://tessdata.projectnaptha.com/4.0.0',
    corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@4/tesseract-core.wasm.js',
  });

  const outDoc = await PDFDocument.create();
  const font = await outDoc.embedFont(StandardFonts.Helvetica);

  for (let i = 1; i <= numPages; i++) {
    onProgress?.(Math.round((i / numPages) * 80));

    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;
    await page.render({ canvasContext: ctx as unknown as CanvasRenderingContext2D, canvas, viewport }).promise;

    const imageData = canvas.toDataURL('image/png');
    const { data: { text } } = await worker.recognize(imageData);

    const outPage = outDoc.addPage([viewport.width / 2, viewport.height / 2]);
    const { width: pageW, height: pageH } = outPage.getSize();

    // Draw original page image as background
    const imgBase64 = imageData.split(',')[1];
    const imgBytes = Uint8Array.from(atob(imgBase64), (c) => c.charCodeAt(0));
    const img = await outDoc.embedPng(imgBytes);
    outPage.drawImage(img, { x: 0, y: 0, width: pageW, height: pageH, opacity: 0.99 });

    // Overlay invisible text layer for searchability
    const lines = text.split('\n').filter((l) => l.trim());
    let ty = pageH - 20;
    for (const line of lines.slice(0, 60)) {
      if (ty < 10) break;
      outPage.drawText(line.slice(0, 100), {
        x: 10,
        y: ty,
        size: 8,
        font,
        color: rgb(0, 0, 0),
        opacity: 0.001,
      });
      ty -= 10;
    }
  }

  await worker.terminate();
  onProgress?.(100);
  return outDoc.save();
}
