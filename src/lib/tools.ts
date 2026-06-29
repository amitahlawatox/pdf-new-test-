export interface Tool {
  slug: string;
  name: string;
  description: string;
  shortDesc: string;
  category: ToolCategory;
  icon: string;
  color: string;
  inputFormats: string[];
  outputFormat: string;
  popular?: boolean;
}

export type ToolCategory =
  | 'convert'
  | 'organize'
  | 'image'
  | 'security'
  | 'ai';

export const CATEGORY_META: Record<ToolCategory, { label: string; description: string; color: string }> = {
  convert: {
    label: 'Convert PDF',
    description: 'Transform PDFs to and from any format',
    color: '#3B82F6',
  },
  organize: {
    label: 'Organize PDF',
    description: 'Merge, split, rotate, and reorder pages',
    color: '#22C55E',
  },
  image: {
    label: 'Image Tools',
    description: 'Convert between PDF and image formats',
    color: '#F59E0B',
  },
  security: {
    label: 'PDF Security',
    description: 'Protect, unlock, sign, and redact',
    color: '#EF4444',
  },
  ai: {
    label: 'AI & Advanced',
    description: 'OCR, repair, and intelligent processing',
    color: '#8B5CF6',
  },
};

export const TOOLS: Tool[] = [
  // Convert
  { slug: 'pdf-to-word', name: 'PDF to Word', shortDesc: 'Convert PDF to editable DOCX', description: 'Convert any PDF to a fully editable Microsoft Word document in seconds. Preserves formatting, tables, and images.', category: 'convert', icon: 'FileText', color: '#3B82F6', inputFormats: ['.pdf'], outputFormat: '.docx', popular: true },
  { slug: 'pdf-to-excel', name: 'PDF to Excel', shortDesc: 'Extract tables to XLSX', description: 'Extract data tables from PDFs and convert to Excel spreadsheets with columns and rows intact.', category: 'convert', icon: 'Table', color: '#3B82F6', inputFormats: ['.pdf'], outputFormat: '.xlsx', popular: true },
  { slug: 'pdf-to-ppt', name: 'PDF to PowerPoint', shortDesc: 'Convert slides to PPTX', description: 'Turn PDF presentations back into editable PowerPoint files. Each page becomes a slide.', category: 'convert', icon: 'Presentation', color: '#3B82F6', inputFormats: ['.pdf'], outputFormat: '.pptx' },
  { slug: 'word-to-pdf', name: 'Word to PDF', shortDesc: 'Convert DOCX to PDF', description: 'Convert Microsoft Word documents to PDF format with perfect formatting preserved.', category: 'convert', icon: 'FileDown', color: '#3B82F6', inputFormats: ['.docx', '.doc'], outputFormat: '.pdf', popular: true },
  { slug: 'excel-to-pdf', name: 'Excel to PDF', shortDesc: 'Convert XLSX to PDF', description: 'Convert Excel spreadsheets to PDF. Choose page layout and fit settings.', category: 'convert', icon: 'FileDown', color: '#3B82F6', inputFormats: ['.xlsx', '.xls'], outputFormat: '.pdf' },
  { slug: 'ppt-to-pdf', name: 'PowerPoint to PDF', shortDesc: 'Convert PPTX to PDF', description: 'Convert PowerPoint presentations to PDF. All slides preserved as individual pages.', category: 'convert', icon: 'FileDown', color: '#3B82F6', inputFormats: ['.pptx', '.ppt'], outputFormat: '.pdf' },
  { slug: 'html-to-pdf', name: 'HTML to PDF', shortDesc: 'Convert webpage to PDF', description: 'Paste a URL or HTML code and convert it to a PDF document.', category: 'convert', icon: 'Globe', color: '#3B82F6', inputFormats: ['.html'], outputFormat: '.pdf' },

  // Organize
  { slug: 'merge-pdf', name: 'Merge PDF', shortDesc: 'Combine multiple PDFs into one', description: 'Drag multiple PDF files and merge them into a single document. Reorder pages before merging.', category: 'organize', icon: 'Combine', color: '#22C55E', inputFormats: ['.pdf'], outputFormat: '.pdf', popular: true },
  { slug: 'split-pdf', name: 'Split PDF', shortDesc: 'Split PDF into separate files', description: 'Split a PDF by page range, extract individual pages, or divide into equal parts.', category: 'organize', icon: 'Scissors', color: '#22C55E', inputFormats: ['.pdf'], outputFormat: '.pdf', popular: true },
  { slug: 'compress-pdf', name: 'Compress PDF', shortDesc: 'Reduce PDF file size', description: 'Reduce PDF file size without sacrificing quality. Choose compression level: low, medium, or high.', category: 'organize', icon: 'Minimize2', color: '#22C55E', inputFormats: ['.pdf'], outputFormat: '.pdf', popular: true },
  { slug: 'rotate-pdf', name: 'Rotate PDF', shortDesc: 'Rotate pages in your PDF', description: 'Rotate individual pages or all pages in a PDF by 90°, 180°, or 270°.', category: 'organize', icon: 'RotateCw', color: '#22C55E', inputFormats: ['.pdf'], outputFormat: '.pdf' },
  { slug: 'reorder-pdf', name: 'Reorder PDF Pages', shortDesc: 'Drag to reorder pages', description: 'Rearrange PDF pages with a visual drag-and-drop interface. See thumbnails of each page.', category: 'organize', icon: 'GripVertical', color: '#22C55E', inputFormats: ['.pdf'], outputFormat: '.pdf' },
  { slug: 'delete-pages', name: 'Delete PDF Pages', shortDesc: 'Remove unwanted pages', description: 'Select and delete specific pages from a PDF document. Preview before deleting.', category: 'organize', icon: 'Trash2', color: '#22C55E', inputFormats: ['.pdf'], outputFormat: '.pdf' },
  { slug: 'extract-pages', name: 'Extract PDF Pages', shortDesc: 'Extract specific pages', description: 'Extract a range or specific pages from a PDF into a new document.', category: 'organize', icon: 'Copy', color: '#22C55E', inputFormats: ['.pdf'], outputFormat: '.pdf' },

  // Image
  { slug: 'pdf-to-jpg', name: 'PDF to JPG', shortDesc: 'Convert PDF pages to images', description: 'Convert each PDF page to a high-quality JPG image. Set DPI and quality settings.', category: 'image', icon: 'Image', color: '#F59E0B', inputFormats: ['.pdf'], outputFormat: '.jpg', popular: true },
  { slug: 'jpg-to-pdf', name: 'JPG to PDF', shortDesc: 'Convert images to PDF', description: 'Combine JPG, PNG, or other image files into a single PDF document.', category: 'image', icon: 'FileImage', color: '#F59E0B', inputFormats: ['.jpg', '.jpeg', '.png', '.webp'], outputFormat: '.pdf', popular: true },
  { slug: 'pdf-to-png', name: 'PDF to PNG', shortDesc: 'Convert PDF pages to PNG', description: 'Convert PDF pages to transparent-background PNG images at high resolution.', category: 'image', icon: 'Image', color: '#F59E0B', inputFormats: ['.pdf'], outputFormat: '.png' },
  { slug: 'pdf-to-tiff', name: 'PDF to TIFF', shortDesc: 'Convert PDF to TIFF', description: 'Export PDF pages as TIFF images for professional printing and archiving.', category: 'image', icon: 'Image', color: '#F59E0B', inputFormats: ['.pdf'], outputFormat: '.tiff' },
  { slug: 'png-to-pdf', name: 'PNG to PDF', shortDesc: 'Convert PNG images to PDF', description: 'Convert one or multiple PNG images into a PDF document.', category: 'image', icon: 'FileImage', color: '#F59E0B', inputFormats: ['.png'], outputFormat: '.pdf' },

  // Security
  { slug: 'protect-pdf', name: 'Protect PDF', shortDesc: 'Add password to PDF', description: 'Encrypt your PDF with a password. Set open password and permission restrictions.', category: 'security', icon: 'Lock', color: '#EF4444', inputFormats: ['.pdf'], outputFormat: '.pdf' },
  { slug: 'unlock-pdf', name: 'Unlock PDF', shortDesc: 'Remove PDF password', description: 'Remove password protection from a PDF you have the right to access.', category: 'security', icon: 'Unlock', color: '#EF4444', inputFormats: ['.pdf'], outputFormat: '.pdf' },
  { slug: 'sign-pdf', name: 'Sign PDF (eSign)', shortDesc: 'Add digital signature', description: 'Draw, type, or upload your signature and place it anywhere on a PDF document.', category: 'security', icon: 'PenLine', color: '#EF4444', inputFormats: ['.pdf'], outputFormat: '.pdf', popular: true },
  { slug: 'watermark-pdf', name: 'Watermark PDF', shortDesc: 'Add text or image watermark', description: 'Add a custom text or image watermark to every page of your PDF.', category: 'security', icon: 'Stamp', color: '#EF4444', inputFormats: ['.pdf'], outputFormat: '.pdf' },
  { slug: 'redact-pdf', name: 'Redact PDF', shortDesc: 'Permanently remove text', description: 'Permanently black out sensitive information from a PDF. Redactions are irreversible.', category: 'security', icon: 'EyeOff', color: '#EF4444', inputFormats: ['.pdf'], outputFormat: '.pdf' },
  { slug: 'flatten-pdf', name: 'Flatten PDF', shortDesc: 'Flatten form fields', description: 'Flatten fillable form fields so the PDF can no longer be edited.', category: 'security', icon: 'Layers', color: '#EF4444', inputFormats: ['.pdf'], outputFormat: '.pdf' },

  // AI & Advanced
  { slug: 'ocr-pdf', name: 'OCR PDF', shortDesc: 'Make scanned PDFs searchable', description: 'Use optical character recognition to convert scanned PDFs into fully searchable, copyable text.', category: 'ai', icon: 'ScanText', color: '#8B5CF6', inputFormats: ['.pdf'], outputFormat: '.pdf', popular: true },
  { slug: 'repair-pdf', name: 'Repair PDF', shortDesc: 'Fix corrupted PDF files', description: 'Attempt to repair and recover data from corrupted or damaged PDF files.', category: 'ai', icon: 'Wrench', color: '#8B5CF6', inputFormats: ['.pdf'], outputFormat: '.pdf' },
  { slug: 'pdf-to-pdfa', name: 'PDF to PDF/A', shortDesc: 'Convert to archival format', description: 'Convert PDF to PDF/A format for long-term archiving and legal compliance.', category: 'ai', icon: 'Archive', color: '#8B5CF6', inputFormats: ['.pdf'], outputFormat: '.pdf' },
  { slug: 'crop-pdf', name: 'Crop PDF', shortDesc: 'Crop and trim PDF pages', description: 'Remove margins or crop specific areas of PDF pages to your desired dimensions.', category: 'ai', icon: 'Crop', color: '#8B5CF6', inputFormats: ['.pdf'], outputFormat: '.pdf' },
  { slug: 'number-pages', name: 'Number PDF Pages', shortDesc: 'Add page numbers', description: 'Add page numbers to your PDF in customizable positions, fonts, and styles.', category: 'ai', icon: 'Hash', color: '#8B5CF6', inputFormats: ['.pdf'], outputFormat: '.pdf' },
  { slug: 'fill-pdf', name: 'Fill PDF Form', shortDesc: 'Fill and edit PDF forms', description: 'Fill out PDF form fields directly in your browser. Download the completed form.', category: 'ai', icon: 'FormInput', color: '#8B5CF6', inputFormats: ['.pdf'], outputFormat: '.pdf', popular: true },
];

export const POPULAR_TOOLS = TOOLS.filter((t) => t.popular);

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter((t) => t.category === category);
}
