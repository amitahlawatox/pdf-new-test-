import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Extract text from PDF pages using pdfjs-dist
async function extractPDFText(file: File): Promise<{ page: number; text: string }[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const results: { page: number; text: string }[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => item.str || '')
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    results.push({ page: i, text });
  }
  return results;
}

// Render PDF pages to blob images using pdfjs-dist
async function renderPDFPagesToBlobs(
  file: File,
  scale = 1.5
): Promise<Blob[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const blobs: Blob[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;
    await page.render({ canvasContext: ctx as unknown as CanvasRenderingContext2D, canvas, viewport }).promise;
    const blob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), 'image/png'));
    blobs.push(blob);
  }
  return blobs;
}

export async function pdfToWord(file: File): Promise<Blob> {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx');
  const pages = await extractPDFText(file);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children: any[] = [
    new Paragraph({
      text: file.name.replace(/\.pdf$/i, ''),
      heading: HeadingLevel.TITLE,
    }),
  ];
  for (const { page, text } of pages) {
    children.push(
      new Paragraph({
        text: `Page ${page}`,
        heading: HeadingLevel.HEADING_2,
      })
    );
    const sentences = text.split('. ').filter(Boolean);
    for (const sentence of sentences) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: sentence + (sentence.endsWith('.') ? '' : '.'), size: 24 })],
          spacing: { after: 100 },
        })
      );
    }
    children.push(new Paragraph({ text: '' }));
  }
  const doc = new Document({ sections: [{ children }] });
  return Packer.toBlob(doc);
}

export async function pdfToExcel(file: File): Promise<Blob> {
  const XLSX = await import('xlsx');
  const pages = await extractPDFText(file);
  const wb = XLSX.utils.book_new();
  for (const { page, text } of pages) {
    const lines = text
      .split(/[.!?]\s+/)
      .filter((l) => l.trim().length > 3)
      .map((l, i) => [i + 1, l.trim()]);
    const ws = XLSX.utils.aoa_to_sheet([['#', 'Content'], ...lines]);
    XLSX.utils.book_append_sheet(wb, ws, `Page ${page}`);
  }
  const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  return new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export async function pdfToPowerPoint(file: File): Promise<Blob> {
  const PptxGenJS = (await import('pptxgenjs')).default;
  const blobs = await renderPDFPagesToBlobs(file, 2.0);
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  for (const blob of blobs) {
    const reader = new FileReader();
    const dataUrl: string = await new Promise((res) => {
      reader.onload = () => res(reader.result as string);
      reader.readAsDataURL(blob);
    });
    const slide = pptx.addSlide();
    slide.addImage({ data: dataUrl, x: 0, y: 0, w: '100%', h: '100%' });
  }
  const blob = await pptx.write({ outputType: 'blob' }) as Blob;
  return blob;
}

export async function pdfToTiff(file: File): Promise<Blob[]> {
  // Convert each page to PNG (TIFF support requires extra lib; PNG is a lossless alternative)
  const blobs = await renderPDFPagesToBlobs(file, 2.0);
  return blobs;
}

export async function wordToPDF(file: File): Promise<Uint8Array> {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

  // Render HTML to canvas then to PDF
  const container = document.createElement('div');
  container.innerHTML = html;
  container.style.cssText = 'position:fixed;top:0;left:0;width:794px;padding:40px;font-family:serif;font-size:12pt;color:#000;background:#fff;z-index:-9999;';
  document.body.appendChild(container);

  const html2canvas = (await import('html2canvas')).default;
  const canvas = await html2canvas(container, { scale: 1.5, useCORS: true, backgroundColor: '#ffffff' });
  document.body.removeChild(container);

  const doc = await PDFDocument.create();
  const imgData = canvas.toDataURL('image/png').split(',')[1];
  const imgBytes = Uint8Array.from(atob(imgData), (c) => c.charCodeAt(0));
  const img = await doc.embedPng(imgBytes);
  const { width: imgW, height: imgH } = img.scale(1);
  const pageH = Math.min(imgH, 1200);
  const chunks = Math.ceil(imgH / pageH);

  for (let i = 0; i < chunks; i++) {
    const page = doc.addPage([imgW, pageH]);
    page.drawImage(img, {
      x: 0,
      y: -(i * pageH),
      width: imgW,
      height: imgH,
    });
  }
  return doc.save();
}

export async function excelToPDF(file: File): Promise<Uint8Array> {
  const XLSX = await import('xlsx');
  const arrayBuffer = await file.arrayBuffer();
  const wb = XLSX.read(arrayBuffer, { type: 'array' });
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Courier);
  const boldFont = await doc.embedFont(StandardFonts.CourierBold);

  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    const data: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1 }) as string[][];
    if (!data.length) continue;

    const pageWidth = 842;
    const pageHeight = 595;
    const margin = 40;
    const cellPad = 6;
    const fontSize = 9;
    const lineH = fontSize + 6;

    // Calculate column widths
    const colCount = Math.max(...data.map((r) => r?.length || 0));
    const colWidth = Math.floor((pageWidth - margin * 2) / Math.max(colCount, 1));

    let page = doc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    // Sheet title
    page.drawText(sheetName, { x: margin, y, size: 12, font: boldFont, color: rgb(0.1, 0.1, 0.4) });
    y -= 20;

    for (let ri = 0; ri < data.length; ri++) {
      if (y < margin + lineH) {
        page = doc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      const row = data[ri] || [];
      const isHeader = ri === 0;
      for (let ci = 0; ci < colCount; ci++) {
        const cellVal = String(row[ci] ?? '').slice(0, 20);
        const x = margin + ci * colWidth;
        if (isHeader) {
          page.drawRectangle({ x, y: y - lineH + 2, width: colWidth - 2, height: lineH, color: rgb(0.2, 0.3, 0.5) });
          page.drawText(cellVal, { x: x + cellPad, y: y - fontSize, size: fontSize, font: boldFont, color: rgb(1, 1, 1) });
        } else {
          if (ri % 2 === 0) {
            page.drawRectangle({ x, y: y - lineH + 2, width: colWidth - 2, height: lineH, color: rgb(0.95, 0.95, 0.95) });
          }
          page.drawText(cellVal, { x: x + cellPad, y: y - fontSize, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
        }
      }
      y -= lineH;
    }
  }
  return doc.save();
}

export async function pptToPDF(file: File): Promise<Uint8Array> {
  // Extract PPTX as ZIP, get slide XML, render text content to PDF
  const JSZip = (await import('jszip')).default;
  const arrayBuffer = await file.arrayBuffer();
  let zip: InstanceType<typeof JSZip>;
  try {
    zip = await JSZip.loadAsync(arrayBuffer);
  } catch {
    throw new Error('Could not parse PowerPoint file. Please ensure it is a valid .pptx file.');
  }

  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  // Find slide files
  const slideFiles = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => {
      const na = parseInt(a.match(/\d+/)?.[0] || '0');
      const nb = parseInt(b.match(/\d+/)?.[0] || '0');
      return na - nb;
    });

  if (!slideFiles.length) {
    throw new Error('No slides found in PowerPoint file.');
  }

  for (let si = 0; si < slideFiles.length; si++) {
    const xml = await zip.files[slideFiles[si]].async('string');
    // Extract text from XML
    const textMatches = xml.match(/<a:t>(.*?)<\/a:t>/g) || [];
    const texts = textMatches.map((m) => m.replace(/<[^>]+>/g, '').trim()).filter(Boolean);

    const page = doc.addPage([960, 540]);
    const { width, height } = page.getSize();

    // Slide background
    page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0.07, 0.09, 0.16) });

    // Slide number
    page.drawText(`Slide ${si + 1} / ${slideFiles.length}`, {
      x: width - 120,
      y: height - 24,
      size: 10,
      font,
      color: rgb(0.4, 0.5, 0.6),
    });

    // Content
    let y = height - 60;
    for (let ti = 0; ti < Math.min(texts.length, 20); ti++) {
      const text = texts[ti].slice(0, 80);
      const isTitle = ti === 0;
      page.drawText(text, {
        x: 48,
        y,
        size: isTitle ? 28 : 16,
        font: isTitle ? boldFont : font,
        color: isTitle ? rgb(0.95, 0.98, 1) : rgb(0.7, 0.75, 0.8),
        maxWidth: width - 96,
      });
      y -= isTitle ? 40 : 24;
      if (y < 40) break;
    }
  }
  return doc.save();
}

export async function htmlToPDF(html: string): Promise<Uint8Array> {
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;top:0;left:0;width:794px;height:1123px;border:none;opacity:0;z-index:-9999;';
  iframe.srcdoc = `<!DOCTYPE html><html><head><style>body{margin:24px;font-family:sans-serif;font-size:13px;color:#000;background:#fff}</style></head><body>${html}</body></html>`;
  document.body.appendChild(iframe);

  await new Promise((r) => { iframe.onload = r; setTimeout(r, 2000); });
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc?.body) {
    document.body.removeChild(iframe);
    throw new Error('Could not render HTML content');
  }

  const html2canvas = (await import('html2canvas')).default;
  const canvas = await html2canvas(iframeDoc.body, { scale: 1.5, useCORS: true, backgroundColor: '#ffffff', windowWidth: 794 });
  document.body.removeChild(iframe);

  const doc = await PDFDocument.create();
  const imgData = canvas.toDataURL('image/png').split(',')[1];
  const imgBytes = Uint8Array.from(atob(imgData), (c) => c.charCodeAt(0));
  const img = await doc.embedPng(imgBytes);
  const { width: imgW, height: imgH } = img.scale(1);
  const pageW = 595;
  const scale = pageW / imgW;
  const pageH = imgH * scale;
  const page = doc.addPage([pageW, Math.min(pageH, 1200)]);
  page.drawImage(img, { x: 0, y: page.getSize().height - pageH, width: pageW, height: pageH });
  return doc.save();
}
