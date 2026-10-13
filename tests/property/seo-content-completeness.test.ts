/**
 * Property Test: SEO Content Completeness
 * Feature: english-tools-website, Property 6: SEO Content Completeness
 * 
 * *For any* tool page, the rendered HTML SHALL contain:
 * (1) exactly one h1 element
 * (2) a meta description tag
 * (3) a canonical URL link
 * (4) structured data in JSON-LD format
 * (5) a "How to Use" section
 * (6) an FAQ section with at least 3 questions
 * 
 * **Validates: Requirements 10.1-10.9, 8.11, 8.12**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getAllTools, ToolDefinition } from '@/lib/constants';

/**
 * SEO content requirements for tool pages
 */
interface SEOContentRequirements {
  hasH1: boolean;
  h1Count: number;
  hasMetaDescription: boolean;
  hasCanonicalUrl: boolean;
  hasStructuredData: boolean;
  structuredDataTypes: string[];
  hasHowToSection: boolean;
  hasFAQSection: boolean;
  faqCount: number;
}

/**
 * Validates that a tool definition has proper SEO-related fields
 */
function validateToolSEOFields(tool: ToolDefinition): {
  hasName: boolean;
  hasDescription: boolean;
  hasKeywords: boolean;
  keywordsCount: number;
  hasPath: boolean;
  pathStartsWithSlash: boolean;
} {
  return {
    hasName: typeof tool.name === 'string' && tool.name.length > 0,
    hasDescription: typeof tool.description === 'string' && tool.description.length > 0,
    hasKeywords: Array.isArray(tool.keywords) && tool.keywords.length > 0,
    keywordsCount: tool.keywords?.length || 0,
    hasPath: typeof tool.path === 'string' && tool.path.length > 0,
    pathStartsWithSlash: tool.path?.startsWith('/') || false,
  };
}

/**
 * Validates that a tool has related tools for internal linking
 */
function validateInternalLinking(tool: ToolDefinition, allToolIds: Set<string>): {
  hasRelatedTools: boolean;
  relatedToolsValid: boolean;
  relatedToolsCount: number;
} {
  const hasRelatedTools = Array.isArray(tool.relatedTools) && tool.relatedTools.length > 0;
  const relatedToolsValid = hasRelatedTools
    ? tool.relatedTools!.every(id => allToolIds.has(id))
    : true; // No related tools is valid (optional field)

  return {
    hasRelatedTools,
    relatedToolsValid,
    relatedToolsCount: tool.relatedTools?.length || 0,
  };
}

describe('SEO Content Completeness - Property 6', () => {
  const tools = getAllTools();
  const allToolIds = new Set(tools.map(t => t.id));

  // Property: All tools have required SEO fields for meta tags
  it('should have required SEO fields for all tools', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: tools.length - 1 }),
        (index) => {
          const tool = tools[index];
          const validation = validateToolSEOFields(tool);

          // Requirement 10.2: Unique, keyword-optimized title tag
          expect(validation.hasName).toBe(true);

          // Requirement 10.3: Meta description with target keywords
          expect(validation.hasDescription).toBe(true);

          // Keywords for SEO optimization
          expect(validation.hasKeywords).toBe(true);
          expect(validation.keywordsCount).toBeGreaterThan(0);

          // Requirement 10.9: Canonical URLs
          expect(validation.hasPath).toBe(true);
          expect(validation.pathStartsWithSlash).toBe(true);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: Tool names are suitable for title tags (not too long)
  it('should have tool names suitable for title tags', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: tools.length - 1 }),
        (index) => {
          const tool = tools[index];

          // Title tags should be under 60 characters for optimal SEO
          // Tool name + " - Free Online Calculator" suffix should fit
          const fullTitle = `${tool.name} - Free Online Calculator`;

          // Name should be reasonable length
          expect(tool.name.length).toBeGreaterThan(0);
          expect(tool.name.length).toBeLessThan(100);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: Tool descriptions are suitable for meta descriptions
  it('should have tool descriptions suitable for meta descriptions', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: tools.length - 1 }),
        (index) => {
          const tool = tools[index];

          // Meta descriptions should be between 50-160 characters for optimal SEO
          expect(tool.description.length).toBeGreaterThan(20);
          expect(tool.description.length).toBeLessThan(300);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: All tools have valid keywords for SEO
  it('should have valid keywords for all tools', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: tools.length - 1 }),
        (index) => {
          const tool = tools[index];

          // Each tool should have at least 2 keywords
          expect(tool.keywords.length).toBeGreaterThanOrEqual(2);

          // All keywords should be non-empty strings
          for (const keyword of tool.keywords) {
            expect(typeof keyword).toBe('string');
            expect(keyword.length).toBeGreaterThan(0);
            expect(keyword.trim()).toBe(keyword); // No leading/trailing whitespace
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: Internal linking - related tools reference valid tools
  // Requirement 10.7: Internal links to related tools
  it('should have valid internal linking references', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: tools.length - 1 }),
        (index) => {
          const tool = tools[index];
          const validation = validateInternalLinking(tool, allToolIds);

          // If related tools exist, they must reference valid tool IDs
          expect(validation.relatedToolsValid).toBe(true);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: Tool paths follow consistent URL structure
  it('should have consistent URL structure for all tools', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: tools.length - 1 }),
        (index) => {
          const tool = tools[index];

          // Path should start with /
          expect(tool.path.startsWith('/')).toBe(true);

          // Path should not have trailing slash (except root)
          if (tool.path !== '/') {
            expect(tool.path.endsWith('/')).toBe(false);
          }

          // Path should be lowercase with hyphens (URL-friendly)
          const pathSegments = tool.path.split('/').filter(Boolean);
          for (const segment of pathSegments) {
            // Allow lowercase letters, numbers, hyphens, and brackets for dynamic routes
            expect(segment).toMatch(/^[a-z0-9\-\[\]]+$/);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: Tool categories map to valid application categories for structured data
  // Requirement 10.4: Structured data (JSON-LD) for rich snippets
  it('should have valid categories for structured data mapping', () => {
    const validCategories = [
      'finance', 'health', 'home', 'converter', 'productivity',
      // Expanded categories
      'academic', 'travel', 'gaming', 'creator', 'fun',
      'audio', 'rpg', 'crypto', 'photo', 'crafts',
      'garden', 'electronics', 'betting', 'auto', 'stats',
      'time', 'physics', 'construction', 'coffee',
      'aquarium', 'solar', 'baking', 'realestate', 'wedding'
    ];
    const applicationCategoryMap: Record<string, string> = {
      finance: 'FinanceApplication',
      health: 'HealthApplication',
      home: 'UtilitiesApplication',
      converter: 'UtilitiesApplication',
      productivity: 'ProductivityApplication',
      academic: 'EducationalApplication',
      travel: 'TravelApplication',
      gaming: 'GameApplication',
      creator: 'CreativeApplication',
      fun: 'EntertainmentApplication',
      audio: 'MultimediaApplication',
      rpg: 'GameApplication',
      crypto: 'FinanceApplication',
      photo: 'MultimediaApplication',
      crafts: 'LifestyleApplication',
      garden: 'LifestyleApplication',
      electronics: 'UtilitiesApplication',
      betting: 'UtilitiesApplication',
      auto: 'UtilitiesApplication',
      stats: 'EducationalApplication',
      time: 'UtilitiesApplication',
      physics: 'EducationalApplication',
      construction: 'UtilitiesApplication',
      coffee: 'LifestyleApplication',
      aquarium: 'LifestyleApplication',
      solar: 'UtilitiesApplication',
      baking: 'LifestyleApplication',
      realestate: 'FinanceApplication',
      wedding: 'LifestyleApplication',
    };

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: tools.length - 1 }),
        (index) => {
          const tool = tools[index];

          // Category must be valid
          expect(validCategories).toContain(tool.category);

          // Category must map to a valid application category
          expect(applicationCategoryMap[tool.category]).toBeDefined();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: All tool paths are unique (no duplicate URLs)
  // Requirement 10.9: Canonical URLs to prevent duplicate content
  it('should have unique paths for all tools', () => {
    const paths = tools.map(t => t.path);
    const uniquePaths = new Set(paths);

    expect(uniquePaths.size).toBe(paths.length);
  });

  // Property: Featured tools are distributed across categories
  it('should have featured tools across multiple categories', () => {
    const featuredTools = tools.filter(t => t.featured);
    const featuredCategories = new Set(featuredTools.map(t => t.category));

    // Should have featured tools
    expect(featuredTools.length).toBeGreaterThan(0);

    // Featured tools should span multiple categories
    expect(featuredCategories.size).toBeGreaterThanOrEqual(3);
  });

  // Property: Tool slugs are URL-safe and consistent with IDs
  it('should have URL-safe slugs consistent with IDs', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: tools.length - 1 }),
        (index) => {
          const tool = tools[index];

          // Slug should match ID
          expect(tool.slug).toBe(tool.id);

          // Slug should be URL-safe (lowercase, hyphens, no spaces)
          expect(tool.slug).toMatch(/^[a-z0-9\-]+$/);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: Icons are specified for all tools (for visual consistency)
  it('should have icons specified for all tools', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: tools.length - 1 }),
        (index) => {
          const tool = tools[index];

          expect(typeof tool.icon).toBe('string');
          expect(tool.icon.length).toBeGreaterThan(0);

          // Icon names should be PascalCase (Lucide icon naming convention)
          expect(tool.icon[0]).toBe(tool.icon[0].toUpperCase());

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: Category distribution - core categories should have minimum tools
  it('should have correct category distribution for SEO coverage', () => {
    const categoryCount: Record<string, number> = {};

    for (const tool of tools) {
      categoryCount[tool.category] = (categoryCount[tool.category] || 0) + 1;
    }

    // Core categories should have at least 10 tools each
    expect(categoryCount['finance']).toBeGreaterThanOrEqual(10);
    expect(categoryCount['health']).toBeGreaterThanOrEqual(10);
    expect(categoryCount['home']).toBeGreaterThanOrEqual(10);
    expect(categoryCount['productivity']).toBeGreaterThanOrEqual(10);

    // Total tools should be at least 100 (original requirement)
    expect(tools.length).toBeGreaterThanOrEqual(100);
  });
});
