import { PDFDocument } from 'pdf-lib';

export interface SplitOptions {
  mode: 'range' | 'every' | 'extract';
  ranges?: { start: number; end: number }[];
  everyN?: number;
  pages?: number[];
}

export async function splitPDF(file: File, opts: SplitOptions): Promise<{ name: string; bytes: Uint8Array }[]> {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const total = src.getPageCount();
  const results: { name: string; bytes: Uint8Array }[] = [];

  const baseName = file.name.replace(/\.pdf$/i, '');

  if (opts.mode === 'every' && opts.everyN) {
    for (let i = 0; i < total; i += opts.everyN) {
      const doc = await PDFDocument.create();
      const end = Math.min(i + opts.everyN, total);
      const indices = Array.from({ length: end - i }, (_, k) => i + k);
      const copied = await doc.copyPages(src, indices);
      copied.forEach((p) => doc.addPage(p));
      results.push({ name: `${baseName}_part${Math.floor(i / opts.everyN) + 1}.pdf`, bytes: await doc.save() });
    }
    return results;
  }

  if (opts.mode === 'extract' && opts.pages) {
    const doc = await PDFDocument.create();
    const indices = opts.pages.map((p) => Math.min(p - 1, total - 1));
    const copied = await doc.copyPages(src, indices);
    copied.forEach((p) => doc.addPage(p));
    return [{ name: `${baseName}_extracted.pdf`, bytes: await doc.save() }];
  }

  const ranges = opts.ranges ?? [{ start: 1, end: total }];
  for (const r of ranges) {
    const doc = await PDFDocument.create();
    const indices = Array.from({ length: r.end - r.start + 1 }, (_, k) => r.start - 1 + k).filter((i) => i < total);
    const copied = await doc.copyPages(src, indices);
    copied.forEach((p) => doc.addPage(p));
    results.push({ name: `${baseName}_p${r.start}-${r.end}.pdf`, bytes: await doc.save() });
  }
  return results;
}
