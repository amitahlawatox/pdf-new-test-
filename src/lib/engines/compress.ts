import { PDFDocument } from 'pdf-lib';

export type CompressionLevel = 'low' | 'medium' | 'high';

export async function compressPDF(file: File, level: CompressionLevel = 'medium'): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });

  const objectsToCompress = level === 'high' ? 9 : level === 'medium' ? 6 : 3;

  const saved = await doc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    objectsPerTick: objectsToCompress,
  });

  return saved;
}
