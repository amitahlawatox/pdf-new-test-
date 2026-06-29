import { PDFDocument } from 'pdf-lib';

export async function deletePages(file: File, pagesToDelete: number[]): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const sorted = [...pagesToDelete].sort((a, b) => b - a);
  for (const p of sorted) {
    const idx = p - 1;
    if (idx >= 0 && idx < doc.getPageCount()) doc.removePage(idx);
  }
  return doc.save();
}

export async function extractPages(file: File, pageNumbers: number[]): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const out = await PDFDocument.create();
  const indices = pageNumbers.map((p) => p - 1).filter((i) => i >= 0 && i < src.getPageCount());
  const copied = await out.copyPages(src, indices);
  copied.forEach((p) => out.addPage(p));
  return out.save();
}

export async function reorderPages(file: File, newOrder: number[]): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const out = await PDFDocument.create();
  const indices = newOrder.map((p) => p - 1).filter((i) => i >= 0 && i < src.getPageCount());
  const copied = await out.copyPages(src, indices);
  copied.forEach((p) => out.addPage(p));
  return out.save();
}

export async function numberPages(
  file: File,
  opts: { position?: 'bottom-center' | 'bottom-right' | 'top-center'; startFrom?: number } = {}
): Promise<Uint8Array> {
  const { position = 'bottom-center', startFrom = 1 } = opts;
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const { StandardFonts } = await import('pdf-lib');
  const font = await doc.embedFont(StandardFonts.Helvetica);

  for (let i = 0; i < doc.getPageCount(); i++) {
    const page = doc.getPage(i);
    const { width, height } = page.getSize();
    const num = `${startFrom + i}`;
    const fontSize = 10;
    const textWidth = font.widthOfTextAtSize(num, fontSize);

    let x = width / 2 - textWidth / 2;
    let y = 20;
    if (position === 'bottom-right') { x = width - textWidth - 20; y = 20; }
    if (position === 'top-center')   { x = width / 2 - textWidth / 2; y = height - 30; }

    page.drawText(num, { x, y, size: fontSize, font, color: (await import('pdf-lib')).rgb(0.3, 0.3, 0.3) });
  }
  return doc.save();
}

export async function cropPDF(
  file: File,
  margins: { top: number; right: number; bottom: number; left: number }
): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  for (let i = 0; i < doc.getPageCount(); i++) {
    const page = doc.getPage(i);
    const { width, height } = page.getSize();
    page.setCropBox(
      margins.left,
      margins.bottom,
      width - margins.left - margins.right,
      height - margins.top - margins.bottom,
    );
  }
  return doc.save();
}

export async function flattenPDF(file: File): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const form = doc.getForm();
  form.flatten();
  return doc.save();
}
