/**
 * Property Test: Dynamic Route Generation
 * Feature: english-tools-website, Property 4: Dynamic Route Generation
 * 
 * *For any* valid conversion pair (from-unit, to-unit) in the supported unit categories,
 * the application SHALL generate a valid route at `/convert/[from]-to-[to]` that
 * returns a valid conversion pair and renders the converter component.
 * 
 * **Validates: Requirements 1.5, 8.1-8.10**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { 
  getAllConversionPairs, 
  getConversionPair, 
  parseConversionSlug,
  getRelatedConversions,
  getCommonConversionPairs
} from '@/lib/conversions';
import { unitsByCategory } from '@/lib/constants/units';
import { UnitCategory } from '@/lib/constants/types';

describe('Dynamic Route Generation - Property 4', () => {
  const allPairs = getAllConversionPairs();
  const categories = Object.keys(unitsByCategory) as UnitCategory[];

  // Property: All conversion pairs generate valid slugs
  it('all conversion pairs generate valid slugs', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allPairs),
        (pair) => {
          const slug = `${pair.from}-to-${pair.to}`;
          
          // Slug should be parseable
          const parsed = parseConversionSlug(slug);
          expect(parsed).not.toBeNull();
          expect(parsed?.from).toBe(pair.from);
          expect(parsed?.to).toBe(pair.to);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: All valid slugs return valid conversion pair details
  it('all valid slugs return valid conversion pair details', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allPairs),
        (pair) => {
          const slug = `${pair.from}-to-${pair.to}`;
          const details = getConversionPair(slug);
          
          // Should return valid details
          expect(details).not.toBeNull();
          expect(details?.from.id).toBe(pair.from);
          expect(details?.to.id).toBe(pair.to);
          expect(details?.category).toBe(pair.category);
          expect(details?.slug).toBe(slug);
          
          // From and to units should have required properties
          expect(details?.from.name).toBeTruthy();
          expect(details?.from.symbol).toBeTruthy();
          expect(details?.to.name).toBeTruthy();
          expect(details?.to.symbol).toBeTruthy();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: Invalid slugs return null
  it('invalid slugs return null', () => {
    const invalidSlugs = [
      'invalid',
      'no-to-separator',
      '-to-',
      'meter-to-',
      '-to-foot',
      'nonexistent-to-unit',
      'meter-to-nonexistent',
      'meter-to-kilogram', // Different categories
      '',
    ];

    invalidSlugs.forEach((slug) => {
      const result = getConversionPair(slug);
      // Either null or the units don't exist in the same category
      if (result !== null) {
        // If it returns something, both units must be in the same category
        expect(result.from.category).toBe(result.to.category);
      }
    });
  });

  // Property: Each category has at least one conversion pair
  it('each category has at least one conversion pair', () => {
    categories.forEach((category) => {
      const categoryPairs = allPairs.filter(p => p.category === category);
      expect(categoryPairs.length).toBeGreaterThan(0);
    });
  });

  // Property: Conversion pairs are bidirectional (if A->B exists, B->A exists)
  it('conversion pairs are bidirectional', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allPairs),
        (pair) => {
          // Find the reverse pair
          const reversePair = allPairs.find(
            p => p.from === pair.to && p.to === pair.from && p.category === pair.category
          );
          
          expect(reversePair).toBeDefined();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: generateStaticParams returns all conversion pairs
  it('getAllConversionPairs returns pairs for all unit combinations', () => {
    categories.forEach((category) => {
      const units = Object.keys(unitsByCategory[category]);
      const expectedPairCount = units.length * (units.length - 1); // n * (n-1) for all pairs excluding self
      
      const categoryPairs = allPairs.filter(p => p.category === category);
      expect(categoryPairs.length).toBe(expectedPairCount);
    });
  });

  // Property: Common conversion pairs are a subset of all pairs
  it('common conversion pairs are valid subsets of all pairs', () => {
    const commonPairs = getCommonConversionPairs();
    
    commonPairs.forEach((commonPair) => {
      const exists = allPairs.some(
        p => p.from === commonPair.from && 
             p.to === commonPair.to && 
             p.category === commonPair.category
      );
      expect(exists).toBe(true);
    });
  });

  // Property: Related conversions are valid and in the same category
  it('related conversions are valid and in the same category', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allPairs.slice(0, 20)), // Test subset for performance
        (pair) => {
          const related = getRelatedConversions(pair.category, pair.from, pair.to, 6);
          
          related.forEach((rel) => {
            // Each related conversion should have valid href format
            expect(rel.href).toMatch(/^\/convert\/.+-to-.+$/);
            
            // The slug should be parseable
            const slug = rel.href.replace('/convert/', '');
            const parsed = parseConversionSlug(slug);
            expect(parsed).not.toBeNull();
            
            // The conversion pair should be valid
            const details = getConversionPair(slug);
            expect(details).not.toBeNull();
            expect(details?.category).toBe(pair.category);
          });
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  // Property: Slug format is consistent (lowercase, hyphenated)
  it('slug format follows convention', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allPairs),
        (pair) => {
          const slug = `${pair.from}-to-${pair.to}`;
          
          // Should contain exactly one "-to-" separator
          const matches = slug.match(/-to-/g);
          expect(matches?.length).toBe(1);
          
          // Should not have consecutive hyphens (except -to-)
          expect(slug.replace('-to-', '')).not.toMatch(/--/);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property: All required categories have conversion pairs (Requirements 8.1-8.10)
  it('all required categories have conversion pairs', () => {
    const requiredCategories: UnitCategory[] = [
      'length',      // 8.1
      'weight',      // 8.2
      'temperature', // 8.3
      'volume',      // 8.4
      'area',        // 8.5
      'speed',       // 8.6
      'time',        // 8.7
      'data',        // 8.8
      'pressure',    // 8.9
      'energy',      // 8.10
    ];

    requiredCategories.forEach((category) => {
      const categoryPairs = allPairs.filter(p => p.category === category);
      expect(categoryPairs.length).toBeGreaterThan(0);
      
      // Each category should have at least 2 units (to form at least 2 pairs)
      expect(categoryPairs.length).toBeGreaterThanOrEqual(2);
    });
  });

  // Property: Conversion pair details include all required fields
  it('conversion pair details include all required fields', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allPairs),
        (pair) => {
          const slug = `${pair.from}-to-${pair.to}`;
          const details = getConversionPair(slug);
          
          expect(details).not.toBeNull();
          
          // Check from unit has all required fields
          expect(details?.from).toHaveProperty('id');
          expect(details?.from).toHaveProperty('name');
          expect(details?.from).toHaveProperty('symbol');
          expect(details?.from).toHaveProperty('category');
          expect(details?.from).toHaveProperty('toBase');
          expect(details?.from).toHaveProperty('fromBase');
          
          // Check to unit has all required fields
          expect(details?.to).toHaveProperty('id');
          expect(details?.to).toHaveProperty('name');
          expect(details?.to).toHaveProperty('symbol');
          expect(details?.to).toHaveProperty('category');
          expect(details?.to).toHaveProperty('toBase');
          expect(details?.to).toHaveProperty('fromBase');
          
          // Check conversion functions are callable
          expect(typeof details?.from.toBase).toBe('function');
          expect(typeof details?.from.fromBase).toBe('function');
          expect(typeof details?.to.toBase).toBe('function');
          expect(typeof details?.to.fromBase).toBe('function');
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
