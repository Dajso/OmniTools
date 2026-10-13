/**
 * Property Test: Grind Description Presence
 * Feature: coffee-barista-tools, Property 20: Grind Description Presence
 * 
 * *For any* valid grinder model and setting within range, the calculator should
 * provide a grind size description (extra fine, fine, medium-fine, medium,
 * medium-coarse, coarse, or extra coarse).
 * 
 * **Validates: Requirements 6.2**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { convertGrindSize } from '@/lib/calculations/coffee/grind-size-converter';
import {
  getGrinderConfig,
  getGrinderList,
  getGrindSizeDescription,
} from '@/lib/calculations/coffee/grinder-database';

type GrindSize = 
  | 'extra-fine'
  | 'fine'
  | 'medium-fine'
  | 'medium'
  | 'medium-coarse'
  | 'coarse'
  | 'extra-coarse';

/**
 * Valid grind size descriptions as per Requirement 6.2
 */
const VALID_GRIND_SIZES: GrindSize[] = [
  'extra-fine',
  'fine',
  'medium-fine',
  'medium',
  'medium-coarse',
  'coarse',
  'extra-coarse',
];

describe('Grind Size Converter - Property 20: Grind Description Presence', () => {
  /**
   * Helper function to create arbitrary generator for valid grinder settings
   * Generates a grinder ID and a valid setting within that grinder's range
   */
  function createValidGrinderSettingArb() {
    return fc
      .constantFrom(...getGrinderList().map(g => g.id))
      .chain(grinderId => {
        const config = getGrinderConfig(grinderId);
        if (!config) {
          return fc.constant({ grinderId, setting: 0 });
        }
        const [min, max] = config.range;
        return fc.record({
          grinderId: fc.constant(grinderId),
          setting: fc.double({ min, max, noNaN: true, noDefaultInfinity: true }),
        });
      });
  }

  /**
   * Property 20: Grind Description Presence
   * 
   * For any valid grinder model and setting within range, the calculator should
   * provide a grind size description (extra fine, fine, medium-fine, medium,
   * medium-coarse, coarse, or extra coarse).
   * 
   * **Validates: Requirement 6.2**
   */
  it('provides grind description for any valid grinder and setting', () => {
    const validGrinderSettingArb = createValidGrinderSettingArb();
    
    fc.assert(
      fc.property(
        validGrinderSettingArb,
        validGrinderSettingArb,
        (source, target) => {
          const result = convertGrindSize({
            sourceGrinder: source.grinderId,
            sourceSetting: source.setting,
            targetGrinder: target.grinderId,
          });
          
          // Requirement 6.2: Description should be provided
          expect(result.grindDescription).toBeDefined();
          expect(typeof result.grindDescription).toBe('string');
          expect(result.grindDescription.length).toBeGreaterThan(0);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Grind description contains valid grind size terminology
   * 
   * The description should mention one of the valid grind sizes from Requirement 6.2
   */
  it('grind description contains valid grind size terminology', () => {
    const validGrinderSettingArb = createValidGrinderSettingArb();
    
    fc.assert(
      fc.property(
        validGrinderSettingArb,
        validGrinderSettingArb,
        (source, target) => {
          const result = convertGrindSize({
            sourceGrinder: source.grinderId,
            sourceSetting: source.setting,
            targetGrinder: target.grinderId,
          });
          
          // Description should contain terminology related to grind sizes
          const descriptionLower = result.grindDescription.toLowerCase();
          const hasValidTerminology = 
            ['fin', 'grov', 'sand', 'salt', 'pulver', 'pepperkorn'].some(t => descriptionLower.includes(t));
          
          expect(hasValidTerminology).toBe(true);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Grind description is consistent for the same input
   * 
   * Calling convertGrindSize with the same inputs should always return
   * the same grind description (deterministic behavior).
   */
  it('grind description is consistent for same input', () => {
    const validGrinderSettingArb = createValidGrinderSettingArb();
    
    fc.assert(
      fc.property(
        validGrinderSettingArb,
        validGrinderSettingArb,
        (source, target) => {
          const inputs = {
            sourceGrinder: source.grinderId,
            sourceSetting: source.setting,
            targetGrinder: target.grinderId,
          };
          
          const result1 = convertGrindSize(inputs);
          const result2 = convertGrindSize(inputs);
          
          expect(result1.grindDescription).toBe(result2.grindDescription);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: All grind size categories have descriptions
   * 
   * Every valid grind size category defined in Requirement 6.2 should
   * have a non-empty description.
   */
  it('all grind size categories have descriptions', () => {
    VALID_GRIND_SIZES.forEach(grindSize => {
      const description = getGrindSizeDescription(grindSize);
      
      expect(description).toBeDefined();
      expect(typeof description).toBe('string');
      expect(description.length).toBeGreaterThan(0);
      
      // Description should be meaningful (not just whitespace)
      expect(description.trim().length).toBeGreaterThan(0);
    });
  });

  /**
   * Property: Grind description varies across the grinder's range
   * 
   * Different settings on the same grinder should produce different
   * grind descriptions (at least for settings far apart).
   */
  it('grind description varies across grinder range', () => {
    const grinderList = getGrinderList();
    
    grinderList.forEach(grinder => {
      const config = getGrinderConfig(grinder.id);
      if (!config) return;
      
      const [min, max] = config.range;
      const targetGrinder = grinder.id;
      
      // Test at minimum, middle, and maximum settings
      const minResult = convertGrindSize({
        sourceGrinder: grinder.id,
        sourceSetting: min,
        targetGrinder,
      });
      
      const midResult = convertGrindSize({
        sourceGrinder: grinder.id,
        sourceSetting: min + (max - min) / 2,
        targetGrinder,
      });
      
      const maxResult = convertGrindSize({
        sourceGrinder: grinder.id,
        sourceSetting: max,
        targetGrinder,
      });
      
      // At least one of these should be different (unless range is very small)
      const allSame = 
        minResult.grindDescription === midResult.grindDescription &&
        midResult.grindDescription === maxResult.grindDescription;
      
      // For grinders with reasonable ranges, descriptions should vary
      if (max - min > 5) {
        expect(allSame).toBe(false);
      }
    });
  });

  /**
   * Property: Grind description matches the source grind size category
   * 
   * The description returned should correspond to the source grind size
   * category determined by the setting.
   */
  it('grind description matches source grind size category', () => {
    const validGrinderSettingArb = createValidGrinderSettingArb();
    
    fc.assert(
      fc.property(
        validGrinderSettingArb,
        validGrinderSettingArb,
        (source, target) => {
          const result = convertGrindSize({
            sourceGrinder: source.grinderId,
            sourceSetting: source.setting,
            targetGrinder: target.grinderId,
          });
          
          // The grind description should match the description for the source grind size
          const expectedDescription = getGrindSizeDescription(result.sourceGrindSize);
          expect(result.grindDescription).toBe(expectedDescription);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Finer settings produce finer grind descriptions
   * 
   * Lower settings (finer grinds) should produce descriptions that indicate
   * finer grind sizes compared to higher settings (coarser grinds).
   */
  it('finer settings produce finer grind descriptions', () => {
    const grinderList = getGrinderList();
    
    grinderList.forEach(grinder => {
      const config = getGrinderConfig(grinder.id);
      if (!config) return;
      
      const [min, max] = config.range;
      const targetGrinder = grinder.id;
      
      // Test at 25% and 75% of range
      const fineResult = convertGrindSize({
        sourceGrinder: grinder.id,
        sourceSetting: min + (max - min) * 0.25,
        targetGrinder,
      });
      
      const coarseResult = convertGrindSize({
        sourceGrinder: grinder.id,
        sourceSetting: min + (max - min) * 0.75,
        targetGrinder,
      });
      
      // The grind size category should be finer for the lower setting
      const grindSizeOrder: GrindSize[] = [
        'extra-fine',
        'fine',
        'medium-fine',
        'medium',
        'medium-coarse',
        'coarse',
        'extra-coarse',
      ];
      
      const fineIndex = grindSizeOrder.indexOf(fineResult.sourceGrindSize);
      const coarseIndex = grindSizeOrder.indexOf(coarseResult.sourceGrindSize);
      
      // Fine setting should have a lower or equal index (finer or same)
      expect(fineIndex).toBeLessThanOrEqual(coarseIndex);
    });
  });
});
