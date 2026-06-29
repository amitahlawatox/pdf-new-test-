import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AdUnit } from '@/components/layout/AdUnit';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pdfgeniuspro.com'),
  title: {
    default: 'PDF Genius Pro — 31+ Free PDF Tools. 100% Private.',
    template: '%s | PDF Genius Pro',
  },
  description:
    'Merge, split, compress, convert, and sign PDFs — all processed locally in your browser. No uploads, no accounts, GDPR compliant. 31+ free PDF tools.',
  keywords: [
    'pdf tools', 'merge pdf', 'split pdf', 'compress pdf', 'pdf to word',
    'jpg to pdf', 'free pdf editor', 'online pdf tool', 'pdf converter',
    'pdf without upload', 'private pdf tool', 'pdf to excel', 'pdf to jpg',
    'rotate pdf', 'protect pdf', 'sign pdf', 'watermark pdf', 'ocr pdf',
    'compress pdf online', 'merge pdf online free', 'pdf editor online free',
  ],
  authors: [{ name: 'PDF Genius Pro' }],
  creator: 'PDF Genius Pro',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pdfgeniuspro.com',
    siteName: 'PDF Genius Pro',
    title: 'PDF Genius Pro — 31+ Free PDF Tools. 100% Private.',
    description: 'Professional PDF tools that run entirely in your browser. Your files never leave your device.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PDF Genius Pro' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Genius Pro — 31+ Free PDF Tools',
    description: 'Merge, split, compress, convert PDFs — 100% private, local processing.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: 'https://pdfgeniuspro.com' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0F172A',
};

const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://pdfgeniuspro.com/#website',
      url: 'https://pdfgeniuspro.com',
      name: 'PDF Genius Pro',
      description: '31+ free PDF tools — merge, split, compress, convert and more. 100% private, no uploads.',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: 'https://pdfgeniuspro.com/?q={search_term_string}' },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'WebApplication',
      name: 'PDF Genius Pro',
      url: 'https://pdfgeniuspro.com',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web Browser',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '2400' },
    },
    {
      '@type': 'Organization',
      '@id': 'https://pdfgeniuspro.com/#org',
      name: 'PDF Genius Pro',
      url: 'https://pdfgeniuspro.com',
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} h-full antialiased`} style={{ colorScheme: 'dark' }}>
      <body
        style={{
          fontFamily: 'var(--font-jakarta), "Plus Jakarta Sans", system-ui, sans-serif',
          background: '#0F172A',
          color: '#F8FAFC',
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
        <Navbar />

        {/* Top Leaderboard Ad — pre-allocated 90px height prevents CLS */}
        <div className="w-full flex justify-center" style={{ background: '#080E1D' }}>
          <AdUnit variant="leaderboard" id="ad-top-leaderboard" />
        </div>

        <main style={{ flex: 1 }}>
          {children}
        </main>

        {/* Bottom Leaderboard Ad */}
        <div className="w-full flex justify-center" style={{ background: '#080E1D' }}>
          <AdUnit variant="leaderboard" id="ad-bottom-leaderboard" />
        </div>

        <Footer />
      </body>
    </html>
  );
}
