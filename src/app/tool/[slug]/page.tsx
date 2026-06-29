import type { Metadata } from 'next';
import { getToolBySlug, TOOLS } from '@/lib/tools';
import { ToolPageClient } from './ToolPageClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return { title: 'Tool Not Found — PDF Genius Pro' };
  }

  const title = `${tool.name} — Free Online ${tool.name} | PDF Genius Pro`;
  const description = `${tool.description} 100% free, no sign-up required. Files processed locally in your browser — never uploaded to any server.`;
  const url = `https://pdfgeniuspro.com/tool/${slug}`;

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
  const url = `https://pdfgeniuspro.com/tool/${slug}`;

  const jsonLd = tool
    ? {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: tool.name,
        description: tool.description,
        url,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: [
          '100% private — files never uploaded',
          'No sign-up required',
          'Free to use',
          'Works on all devices',
        ],
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ToolPageClient params={params} />
    </>
  );
}
