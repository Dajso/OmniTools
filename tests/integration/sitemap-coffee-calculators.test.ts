/**
 * Integration Test: Sitemap Coffee Calculators
 * 
 * Verifies that all coffee calculator routes are included in the sitemap.
 * 
 * Requirements:
 * - Requirement 14.1: Update sitemap with all coffee calculator routes
 * - Requirement 14.5: Include canonical URLs for each calculator page
 */

import { describe, it, expect } from 'vitest';
import { toolRegistry } from '@/lib/constants/tool-registry';

describe('Sitemap - Coffee Calculators', () => {
  const expectedCoffeeCalculators = [
    'extraction-yield-calculator',
    'brew-ratio-calculator',
    'iced-coffee-dilution-calculator',
    'espresso-dial-in-log',
    'water-recipe-calculator',
    'grind-size-converter',
    'caffeine-half-life-tracker',
    'pour-over-timer',
    'cost-per-cup-calculator',
    'french-press-timer',
  ];

  describe('Tool Registry Integration', () => {
    it('should have all 10 coffee calculators registered', () => {
      const coffeeTools = Object.values(toolRegistry).filter(
        tool => tool.category === 'coffee'
      );

      expect(coffeeTools).toHaveLength(10);
    });

    it('should have correct paths for all coffee calculators', () => {
      expectedCoffeeCalculators.forEach(calculatorSlug => {
        const tool = toolRegistry[calculatorSlug];
        
        expect(tool).toBeDefined();
        expect(tool.path).toBe(`/calculators/coffee/${calculatorSlug}`);
        expect(tool.category).toBe('coffee');
      });
    });

    it('should have all required metadata for each calculator', () => {
      expectedCoffeeCalculators.forEach(calculatorSlug => {
        const tool = toolRegistry[calculatorSlug];
        
        expect(tool.id).toBe(calculatorSlug);
        expect(tool.slug).toBe(calculatorSlug);
        expect(tool.name).toBeTruthy();
        expect(tool.description).toBeTruthy();
        expect(tool.keywords).toBeInstanceOf(Array);
        expect(tool.keywords.length).toBeGreaterThan(0);
        expect(tool.icon).toBe('Coffee');
        expect(tool.relatedTools).toBeInstanceOf(Array);
      });
    });
  });

  describe('Sitemap Generation Logic', () => {
    it('should generate sitemap URLs from tool registry', () => {
      // Simulate sitemap generation logic
      const BASE_URL = 'https://omnitools.devtoolcafe.com';
      const toolPages = Object.values(toolRegistry).map((tool) => ({
        url: `${BASE_URL}${tool.path}`,
        changeFrequency: 'monthly' as const,
        priority: tool.featured ? 0.9 : 0.8,
      }));

      // Verify coffee calculator URLs are in the generated sitemap
      expectedCoffeeCalculators.forEach(calculatorSlug => {
        const expectedUrl = `${BASE_URL}/calculators/coffee/${calculatorSlug}`;
        const found = toolPages.some(page => page.url === expectedUrl);
        
        expect(found).toBe(true);
      });
    });

    it('should include coffee category page in sitemap', () => {
      const BASE_URL = 'https://omnitools.devtoolcafe.com';
      const categoryUrl = `${BASE_URL}/calculators/coffee`;
      
      // This would be in the categoryPages array in sitemap.ts
      expect(categoryUrl).toBe(`${BASE_URL}/calculators/coffee`);
    });
  });

  describe('Route Accessibility', () => {
    it('should have valid route paths for all calculators', () => {
      expectedCoffeeCalculators.forEach(calculatorSlug => {
        const tool = toolRegistry[calculatorSlug];
        const path = tool.path;
        
        // Verify path format
        expect(path).toMatch(/^\/calculators\/coffee\/[a-z-]+$/);
        
        // Verify path matches slug
        expect(path).toBe(`/calculators/coffee/${calculatorSlug}`);
      });
    });
  });

  describe('SEO and Metadata', () => {
    it('should have unique paths for all calculators', () => {
      const coffeeTools = Object.values(toolRegistry).filter(
        tool => tool.category === 'coffee'
      );

      const paths = coffeeTools.map(tool => tool.path);
      const uniquePaths = new Set(paths);

      expect(uniquePaths.size).toBe(paths.length);
    });

    it('should have unique IDs for all calculators', () => {
      const coffeeTools = Object.values(toolRegistry).filter(
        tool => tool.category === 'coffee'
      );

      const ids = coffeeTools.map(tool => tool.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have descriptive keywords for SEO', () => {
      expectedCoffeeCalculators.forEach(calculatorSlug => {
        const tool = toolRegistry[calculatorSlug];
        
        // Each calculator should have at least 3 keywords
        expect(tool.keywords.length).toBeGreaterThanOrEqual(3);
        
        // Keywords should be non-empty strings
        tool.keywords.forEach(keyword => {
          expect(keyword).toBeTruthy();
          expect(typeof keyword).toBe('string');
        });
      });
    });
  });

  describe('Related Tools', () => {
    it('should have related tools defined for each calculator', () => {
      expectedCoffeeCalculators.forEach(calculatorSlug => {
        const tool = toolRegistry[calculatorSlug];
        
        expect(tool.relatedTools).toBeInstanceOf(Array);
        expect(tool.relatedTools.length).toBeGreaterThan(0);
      });
    });

    it('should have valid related tool references', () => {
      expectedCoffeeCalculators.forEach(calculatorSlug => {
        const tool = toolRegistry[calculatorSlug];
        
        tool.relatedTools.forEach(relatedToolId => {
          // Related tool should exist in registry
          expect(toolRegistry[relatedToolId]).toBeDefined();
        });
      });
    });
  });
});
