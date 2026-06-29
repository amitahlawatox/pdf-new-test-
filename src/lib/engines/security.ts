import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

export async function protectPDF(file: File, password: string): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const saved = await doc.save({
    useObjectStreams: false,
  });
  return saved;
}

export async function unlockPDF(file: File): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return doc.save();
}

export async function watermarkPDF(
  file: File,
  text: string,
  opts: { opacity?: number; fontSize?: number; color?: string } = {}
): Promise<Uint8Array> {
  const { opacity = 0.15, fontSize = 48 } = opts;
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.HelveticaBold);

  for (let i = 0; i < doc.getPageCount(); i++) {
    const page = doc.getPage(i);
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    page.drawText(text, {
      x: width / 2 - textWidth / 2,
      y: height / 2 - fontSize / 2,
      size: fontSize,
      font,
      color: rgb(0.5, 0.5, 0.5),
      opacity,
      rotate: degrees(-45),
    });
  }
  return doc.save();
}

export async function redactPDF(
  file: File,
  areas: { page: number; x: number; y: number; width: number; height: number }[]
): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  for (const area of areas) {
    const page = doc.getPage(area.page - 1);
    page.drawRectangle({
      x: area.x,
      y: area.y,
      width: area.width,
      height: area.height,
      color: rgb(0, 0, 0),
    });
  }
  return doc.save();
}
