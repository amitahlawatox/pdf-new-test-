import type { Metadata } from 'next';
import { getToolBySlug, TOOLS } from '@/lib/tools';
import { ToolPageClient } from './ToolPageClient';

const BASE = 'https://www.pdfgeniuspro.com';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return { title: 'Tool Not Found — PDF Genius Pro' };
  }

  const title = `${tool.name} — Free Online Tool | PDF Genius Pro`;
  const description = `${tool.description} 100% free, no sign-up required. Files processed locally in your browser — never uploaded to any server.`;
  const url = `${BASE}/tool/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'PDF Genius Pro',
      images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630, alt: tool.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  const url = `${BASE}/tool/${slug}`;

  if (!tool) {
    return <ToolPageClient params={params} />;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: tool.name,
        description: tool.description,
        url,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web Browser',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: [
          '100% private — files never uploaded',
          'No sign-up required',
          'Free to use',
          'Works on all devices',
        ],
      },
      {
        '@type': 'HowTo',
        name: `How to use ${tool.name}`,
        description: `Step-by-step guide to ${tool.name.toLowerCase()} online for free`,
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Upload your file',
            text: `Drop your ${tool.inputFormats.join(' or ')} file into the upload area`,
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Configure options',
            text: 'Adjust any tool-specific settings if needed',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Process locally',
            text: `Click "Run ${tool.name}" — processing happens instantly in your browser using WebAssembly`,
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'Download result',
            text: `Download your ${tool.outputFormat} file. Your original file is never sent to any server.`,
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
          { '@type': 'ListItem', position: 2, name: tool.name, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolPageClient params={params} />
    </>
  );
}
