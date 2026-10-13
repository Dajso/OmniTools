/**
 * Integration Test: Sitemap Generation
 * 
 * Verifies that the sitemap function generates correct URLs for all coffee calculators.
 * 
 * Requirements:
 * - Requirement 14.1: Update sitemap with all coffee calculator routes
 */

import { describe, it, expect } from 'vitest';

describe('Sitemap Generation', () => {
  const expectedCoffeeRoutes = [
    '/calculators/coffee/extraction-yield-calculator',
    '/calculators/coffee/brew-ratio-calculator',
    '/calculators/coffee/iced-coffee-dilution-calculator',
    '/calculators/coffee/espresso-dial-in-log',
    '/calculators/coffee/water-recipe-calculator',
    '/calculators/coffee/grind-size-converter',
    '/calculators/coffee/caffeine-half-life-tracker',
    '/calculators/coffee/pour-over-timer',
    '/calculators/coffee/cost-per-cup-calculator',
    '/calculators/coffee/french-press-timer',
  ];

  it('should generate sitemap with all coffee calculator routes', async () => {
    // Dynamically import the sitemap function
    const sitemapModule = await import('@/app/sitemap');
    const sitemap = sitemapModule.default();

    // Extract all URLs from sitemap
    const urls = sitemap.map(entry => {
      // Remove base URL to get just the path
      const url = entry.url;
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kalkulator.hjemmetavla.no';
      return url.replace(baseUrl, '');
    });

    // Verify all coffee calculator routes are in the sitemap
    expectedCoffeeRoutes.forEach(route => {
      expect(urls).toContain(route);
    });
  });

  it('should include coffee category page in sitemap', async () => {
    const sitemapModule = await import('@/app/sitemap');
    const sitemap = sitemapModule.default();

    const urls = sitemap.map(entry => {
      const url = entry.url;
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kalkulator.hjemmetavla.no';
      return url.replace(baseUrl, '');
    });

    expect(urls).toContain('/calculators/coffee');
  });

  it('should have correct metadata for coffee calculator routes', async () => {
    const sitemapModule = await import('@/app/sitemap');
    const sitemap = sitemapModule.default();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kalkulator.hjemmetavla.no';

    expectedCoffeeRoutes.forEach(route => {
      const entry = sitemap.find(e => e.url === `${baseUrl}${route}`);
      
      expect(entry).toBeDefined();
      expect(entry?.changeFrequency).toBe('monthly');
      expect(entry?.priority).toBeGreaterThanOrEqual(0.8);
      expect(entry?.lastModified).toBeInstanceOf(Date);
    });
  });

  it('should have coffee category with correct metadata', async () => {
    const sitemapModule = await import('@/app/sitemap');
    const sitemap = sitemapModule.default();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kalkulator.hjemmetavla.no';
    const categoryEntry = sitemap.find(e => e.url === `${baseUrl}/calculators/coffee`);

    expect(categoryEntry).toBeDefined();
    expect(categoryEntry?.changeFrequency).toBe('weekly');
    expect(categoryEntry?.priority).toBe(0.8);
    expect(categoryEntry?.lastModified).toBeInstanceOf(Date);
  });

  it('should generate valid sitemap structure', async () => {
    const sitemapModule = await import('@/app/sitemap');
    const sitemap = sitemapModule.default();

    expect(Array.isArray(sitemap)).toBe(true);
    expect(sitemap.length).toBeGreaterThan(0);

    // Verify each entry has required fields
    sitemap.forEach(entry => {
      expect(entry.url).toBeTruthy();
      expect(typeof entry.url).toBe('string');
      expect(entry.url).toMatch(/^https?:\/\//);
      expect(entry.lastModified).toBeInstanceOf(Date);
      expect(entry.changeFrequency).toBeTruthy();
      expect(typeof entry.priority).toBe('number');
      expect(entry.priority).toBeGreaterThanOrEqual(0);
      expect(entry.priority).toBeLessThanOrEqual(1);
    });
  });
});
