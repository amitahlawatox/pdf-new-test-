import { PDFDocument, degrees } from 'pdf-lib';

export type Rotation = 90 | 180 | 270;

export async function rotatePDF(file: File, rotation: Rotation, pages: 'all' | number[] = 'all'): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const total = doc.getPageCount();

  const targetPages = pages === 'all'
    ? Array.from({ length: total }, (_, i) => i)
    : pages.map((p) => p - 1).filter((i) => i >= 0 && i < total);

  for (const i of targetPages) {
    const page = doc.getPage(i);
    const current = page.getRotation().angle;
    page.setRotation(degrees((current + rotation) % 360));
  }

  return doc.save();
}
