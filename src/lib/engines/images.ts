import { PDFDocument } from 'pdf-lib';

export async function imagesToPDF(files: File[]): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const isJpeg = file.type === 'image/jpeg' || file.name.match(/\.(jpg|jpeg)$/i);
    const isPng  = file.type === 'image/png'  || file.name.match(/\.png$/i);
    if (!isJpeg && !isPng) continue;

    const img = isJpeg
      ? await doc.embedJpg(bytes)
      : await doc.embedPng(bytes);

    const page = doc.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }
  return doc.save();
}

export async function pdfToImages(
  file: File,
  format: 'jpeg' | 'png' = 'jpeg',
  scale = 1.5,
): Promise<{ name: string; blob: Blob }[]> {
  const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
  GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const bytes = await file.arrayBuffer();
  const pdf = await getDocument({ data: bytes }).promise;
  const results: { name: string; blob: Blob }[] = [];
  const baseName = file.name.replace(/\.pdf$/i, '');

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await page.render({ canvasContext: ctx as any, canvas, viewport }).promise;

    const blob = await new Promise<Blob>((res) =>
      canvas.toBlob((b) => res(b!), `image/${format}`, 0.92),
    );
    results.push({ name: `${baseName}_page${i}.${format === 'jpeg' ? 'jpg' : 'png'}`, blob });
  }
  return results;
}
