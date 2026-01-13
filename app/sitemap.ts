import { MetadataRoute } from 'next';
import { toolRegistry } from '@/lib/constants/tool-registry';
import { getAllConversionPairs } from '@/lib/conversions';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy/clear-data`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.2,
    },
  ];

  // Tool pages from registry
  const toolPages: MetadataRoute.Sitemap = Object.values(toolRegistry).map((tool) => ({
    url: `${BASE_URL}${tool.path}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: tool.featured ? 0.9 : 0.8,
  }));

  // Conversion pages
  const conversionPairs = getAllConversionPairs();
  const conversionPages: MetadataRoute.Sitemap = conversionPairs.map(({ from, to }) => ({
    url: `${BASE_URL}/convert/${from}-to-${to}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...toolPages, ...conversionPages];
}
