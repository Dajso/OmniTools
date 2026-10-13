import { MetadataRoute } from 'next';
import { toolRegistry } from '@/lib/constants/tool-registry';
import { categoryConfig } from '@/lib/constants/category-config';
import { getAllConversionPairs } from '@/lib/conversions';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://kalkulator.hjemmetavla.no';

// Kreves for statisk eksport
export const dynamic = 'error';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // Faste sider
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/personvern`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Kategorisider, hentet fra kategorikonfigurasjonen
  const categoryPages: MetadataRoute.Sitemap = Object.values(categoryConfig).map((category) => ({
    url: `${BASE_URL}${category.href}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Verktøysider fra registeret
  const toolPages: MetadataRoute.Sitemap = Object.values(toolRegistry).map((tool) => ({
    url: `${BASE_URL}${tool.path}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: tool.featured ? 0.9 : 0.8,
  }));

  // Omregningssider
  const conversionPairs = getAllConversionPairs();
  const conversionPages: MetadataRoute.Sitemap = conversionPairs.map(({ from, to }) => ({
    url: `${BASE_URL}/convert/${from}-to-${to}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...toolPages, ...conversionPages];
}
