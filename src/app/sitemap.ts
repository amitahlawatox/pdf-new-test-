import { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://pdfgeniuspro.com';
  const now = new Date();

  const toolUrls = TOOLS.map((tool) => ({
    url: `${base}/tool/${tool.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: tool.popular ? 0.9 : 0.75,
  }));

  return [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/how-it-works`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    ...toolUrls,
  ];
}
