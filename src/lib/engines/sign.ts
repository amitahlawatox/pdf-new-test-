import { PDFDocument, rgb } from 'pdf-lib';

export async function signPDF(
  file: File,
  signatureDataUrl: string,
  opts: { pageIndex?: number; x?: number; y?: number; width?: number; height?: number } = {}
): Promise<Uint8Array> {
  const { pageIndex = 0, x = 50, y = 50, width = 200, height = 60 } = opts;
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });

  // Convert data URL to bytes
  const base64 = signatureDataUrl.split(',')[1];
  const imgBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

  const isPng = signatureDataUrl.startsWith('data:image/png');
  const img = isPng ? await doc.embedPng(imgBytes) : await doc.embedJpg(imgBytes);

  const page = doc.getPage(Math.min(pageIndex, doc.getPageCount() - 1));
  const { height: pageH } = page.getSize();

  page.drawImage(img, {
    x,
    y: pageH - y - height,
    width,
    height,
    opacity: 0.9,
  });

  // Add signature line
  page.drawLine({
    start: { x, y: pageH - y - height - 4 },
    end: { x: x + width, y: pageH - y - height - 4 },
    thickness: 0.5,
    color: rgb(0.3, 0.3, 0.3),
  });

  page.drawText('Digitally signed', {
    x,
    y: pageH - y - height - 16,
    size: 8,
    color: rgb(0.5, 0.5, 0.5),
  });

  return doc.save();
}
