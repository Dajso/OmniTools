/**
 * Property Test: SCA Compliance Indicators
 * Feature: coffee-barista-tools, Property 17: SCA Compliance Indicators
 * 
 * *For any* target hardness and alkalinity, the calculator should indicate
 * SCA-compliant when 50 ≤ hardness ≤ 175 ppm AND 40 ≤ alkalinity ≤ 70 ppm.
 * 
 * **Validates: Requirements 5.3, 5.4**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateWaterRecipe,
  isHardnessCompliant,
  isAlkalinityCompliant,
  type WaterRecipeInputs,
} from '@/lib/calculations/coffee/water-recipe';

/**
 * SCA compliance ranges
 */
const SCA_HARDNESS_MIN = 50;
const SCA_HARDNESS_MAX = 175;
const SCA_ALKALINITY_MIN = 40;
const SCA_ALKALINITY_MAX = 70;

/**
 * Arbitrary for generating valid water recipe inputs
 */
const validWaterRecipeInputsArb = fc.record({
  waterVolume: fc.double({ min: 0.5, max: 20, noNaN: true, noDefaultInfinity: true }),
  targetHardness: fc.double({ min: 0, max: 300, noNaN: true, noDefaultInfinity: true }),
  targetAlkalinity: fc.double({ min: 0, max: 150, noNaN: true, noDefaultInfinity: true }),
});

/**
 * Arbitrary for generating SCA-compliant hardness values
 */
const scaCompliantHardnessArb = fc.double({
  min: SCA_HARDNESS_MIN,
  max: SCA_HARDNESS_MAX,
  noNaN: true,
  noDefaultInfinity: true,
});

/**
 * Arbitrary for generating SCA-compliant alkalinity values
 */
const scaCompliantAlkalinityArb = fc.double({
  min: SCA_ALKALINITY_MIN,
  max: SCA_ALKALINITY_MAX,
  noNaN: true,
  noDefaultInfinity: true,
});

/**
 * Arbitrary for generating non-compliant hardness values (below range)
 */
const belowRangeHardnessArb = fc.double({
  min: 0,
  max: SCA_HARDNESS_MIN - 0.01,
  noNaN: true,
  noDefaultInfinity: true,
});

/**
 * Arbitrary for generating non-compliant hardness values (above range)
 */
const aboveRangeHardnessArb = fc.double({
  min: SCA_HARDNESS_MAX + 0.01,
  max: 300,
  noNaN: true,
  noDefaultInfinity: true,
});

/**
 * Arbitrary for generating non-compliant alkalinity values (below range)
 */
const belowRangeAlkalinityArb = fc.double({
  min: 0,
  max: SCA_ALKALINITY_MIN - 0.01,
  noNaN: true,
  noDefaultInfinity: true,
});

/**
 * Arbitrary for generating non-compliant alkalinity values (above range)
 */
const aboveRangeAlkalinityArb = fc.double({
  min: SCA_ALKALINITY_MAX + 0.01,
  max: 150,
  noNaN: true,
  noDefaultInfinity: true,
});

describe('Water Recipe Calculator - Property 17: SCA Compliance Indicators', () => {
  /**
   * Property 17: SCA Compliance Indicators
   * 
   * For any target hardness and alkalinity, the calculator should indicate
   * SCA-compliant when BOTH conditions are met:
   * - 50 ≤ hardness ≤ 175 ppm (Requirement 5.3)
   * - 40 ≤ alkalinity ≤ 70 ppm (Requirement 5.4)
   */
  describe('Overall SCA Compliance', () => {
    it('indicates SCA-compliant when both hardness and alkalinity are within range', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.5, max: 20, noNaN: true, noDefaultInfinity: true }),
          scaCompliantHardnessArb,
          scaCompliantAlkalinityArb,
          (waterVolume, hardness, alkalinity) => {
            const result = calculateWaterRecipe({
              waterVolume,
              targetHardness: hardness,
              targetAlkalinity: alkalinity,
            });

            // Both should be compliant
            expect(result.complianceDetails.hardness.compliant).toBe(true);
            expect(result.complianceDetails.alkalinity.compliant).toBe(true);
            expect(result.scaCompliant).toBe(true);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('indicates non-compliant when hardness is below range', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.5, max: 20, noNaN: true, noDefaultInfinity: true }),
          belowRangeHardnessArb,
          scaCompliantAlkalinityArb,
          (waterVolume, hardness, alkalinity) => {
            const result = calculateWaterRecipe({
              waterVolume,
              targetHardness: hardness,
              targetAlkalinity: alkalinity,
            });

            // Hardness should be non-compliant
            expect(result.complianceDetails.hardness.compliant).toBe(false);
            // Alkalinity should be compliant
            expect(result.complianceDetails.alkalinity.compliant).toBe(true);
            // Overall should be non-compliant
            expect(result.scaCompliant).toBe(false);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('indicates non-compliant when hardness is above range', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.5, max: 20, noNaN: true, noDefaultInfinity: true }),
          aboveRangeHardnessArb,
          scaCompliantAlkalinityArb,
          (waterVolume, hardness, alkalinity) => {
            const result = calculateWaterRecipe({
              waterVolume,
              targetHardness: hardness,
              targetAlkalinity: alkalinity,
            });

            // Hardness should be non-compliant
            expect(result.complianceDetails.hardness.compliant).toBe(false);
            // Alkalinity should be compliant
            expect(result.complianceDetails.alkalinity.compliant).toBe(true);
            // Overall should be non-compliant
            expect(result.scaCompliant).toBe(false);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('indicates non-compliant when alkalinity is below range', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.5, max: 20, noNaN: true, noDefaultInfinity: true }),
          scaCompliantHardnessArb,
          belowRangeAlkalinityArb,
          (waterVolume, hardness, alkalinity) => {
            const result = calculateWaterRecipe({
              waterVolume,
              targetHardness: hardness,
              targetAlkalinity: alkalinity,
            });

            // Hardness should be compliant
            expect(result.complianceDetails.hardness.compliant).toBe(true);
            // Alkalinity should be non-compliant
            expect(result.complianceDetails.alkalinity.compliant).toBe(false);
            // Overall should be non-compliant
            expect(result.scaCompliant).toBe(false);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('indicates non-compliant when alkalinity is above range', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.5, max: 20, noNaN: true, noDefaultInfinity: true }),
          scaCompliantHardnessArb,
          aboveRangeAlkalinityArb,
          (waterVolume, hardness, alkalinity) => {
            const result = calculateWaterRecipe({
              waterVolume,
              targetHardness: hardness,
              targetAlkalinity: alkalinity,
            });

            // Hardness should be compliant
            expect(result.complianceDetails.hardness.compliant).toBe(true);
            // Alkalinity should be non-compliant
            expect(result.complianceDetails.alkalinity.compliant).toBe(false);
            // Overall should be non-compliant
            expect(result.scaCompliant).toBe(false);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('indicates non-compliant when both hardness and alkalinity are out of range', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.5, max: 20, noNaN: true, noDefaultInfinity: true }),
          fc.oneof(belowRangeHardnessArb, aboveRangeHardnessArb),
          fc.oneof(belowRangeAlkalinityArb, aboveRangeAlkalinityArb),
          (waterVolume, hardness, alkalinity) => {
            const result = calculateWaterRecipe({
              waterVolume,
              targetHardness: hardness,
              targetAlkalinity: alkalinity,
            });

            // Both should be non-compliant
            expect(result.complianceDetails.hardness.compliant).toBe(false);
            expect(result.complianceDetails.alkalinity.compliant).toBe(false);
            // Overall should be non-compliant
            expect(result.scaCompliant).toBe(false);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Requirement 5.3: Hardness compliance indicator
   * 
   * When target hardness is between 50 and 175 ppm, THE Calculator SHALL
   * indicate SCA-compliant hardness.
   */
  describe('Requirement 5.3: Hardness Compliance', () => {
    it('indicates compliant hardness for values within 50-175 ppm range', () => {
      fc.assert(
        fc.property(
          scaCompliantHardnessArb,
          (hardness) => {
            const compliant = isHardnessCompliant(hardness);
            expect(compliant).toBe(true);
            
            // Verify the value is actually in range
            expect(hardness).toBeGreaterThanOrEqual(SCA_HARDNESS_MIN);
            expect(hardness).toBeLessThanOrEqual(SCA_HARDNESS_MAX);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('indicates non-compliant hardness for values below 50 ppm', () => {
      fc.assert(
        fc.property(
          belowRangeHardnessArb,
          (hardness) => {
            const compliant = isHardnessCompliant(hardness);
            expect(compliant).toBe(false);
            expect(hardness).toBeLessThan(SCA_HARDNESS_MIN);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('indicates non-compliant hardness for values above 175 ppm', () => {
      fc.assert(
        fc.property(
          aboveRangeHardnessArb,
          (hardness) => {
            const compliant = isHardnessCompliant(hardness);
            expect(compliant).toBe(false);
            expect(hardness).toBeGreaterThan(SCA_HARDNESS_MAX);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('correctly handles hardness boundary values', () => {
      // Exactly at minimum (50 ppm) - should be compliant
      expect(isHardnessCompliant(50)).toBe(true);
      expect(isHardnessCompliant(50.0)).toBe(true);
      
      // Just below minimum - should be non-compliant
      expect(isHardnessCompliant(49.99)).toBe(false);
      
      // Exactly at maximum (175 ppm) - should be compliant
      expect(isHardnessCompliant(175)).toBe(true);
      expect(isHardnessCompliant(175.0)).toBe(true);
      
      // Just above maximum - should be non-compliant
      expect(isHardnessCompliant(175.01)).toBe(false);
    });

    it('hardness compliance is independent of water volume', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.5, max: 20, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0.5, max: 20, noNaN: true, noDefaultInfinity: true }),
          scaCompliantHardnessArb,
          scaCompliantAlkalinityArb,
          (volume1, volume2, hardness, alkalinity) => {
            const result1 = calculateWaterRecipe({
              waterVolume: volume1,
              targetHardness: hardness,
              targetAlkalinity: alkalinity,
            });
            
            const result2 = calculateWaterRecipe({
              waterVolume: volume2,
              targetHardness: hardness,
              targetAlkalinity: alkalinity,
            });

            // Compliance should be the same regardless of volume
            expect(result1.complianceDetails.hardness.compliant).toBe(
              result2.complianceDetails.hardness.compliant
            );
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Requirement 5.4: Alkalinity compliance indicator
   * 
   * When target alkalinity is between 40 and 70 ppm, THE Calculator SHALL
   * indicate SCA-compliant alkalinity.
   */
  describe('Requirement 5.4: Alkalinity Compliance', () => {
    it('indicates compliant alkalinity for values within 40-70 ppm range', () => {
      fc.assert(
        fc.property(
          scaCompliantAlkalinityArb,
          (alkalinity) => {
            const compliant = isAlkalinityCompliant(alkalinity);
            expect(compliant).toBe(true);
            
            // Verify the value is actually in range
            expect(alkalinity).toBeGreaterThanOrEqual(SCA_ALKALINITY_MIN);
            expect(alkalinity).toBeLessThanOrEqual(SCA_ALKALINITY_MAX);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('indicates non-compliant alkalinity for values below 40 ppm', () => {
      fc.assert(
        fc.property(
          belowRangeAlkalinityArb,
          (alkalinity) => {
            const compliant = isAlkalinityCompliant(alkalinity);
            expect(compliant).toBe(false);
            expect(alkalinity).toBeLessThan(SCA_ALKALINITY_MIN);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('indicates non-compliant alkalinity for values above 70 ppm', () => {
      fc.assert(
        fc.property(
          aboveRangeAlkalinityArb,
          (alkalinity) => {
            const compliant = isAlkalinityCompliant(alkalinity);
            expect(compliant).toBe(false);
            expect(alkalinity).toBeGreaterThan(SCA_ALKALINITY_MAX);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('correctly handles alkalinity boundary values', () => {
      // Exactly at minimum (40 ppm) - should be compliant
      expect(isAlkalinityCompliant(40)).toBe(true);
      expect(isAlkalinityCompliant(40.0)).toBe(true);
      
      // Just below minimum - should be non-compliant
      expect(isAlkalinityCompliant(39.99)).toBe(false);
      
      // Exactly at maximum (70 ppm) - should be compliant
      expect(isAlkalinityCompliant(70)).toBe(true);
      expect(isAlkalinityCompliant(70.0)).toBe(true);
      
      // Just above maximum - should be non-compliant
      expect(isAlkalinityCompliant(70.01)).toBe(false);
    });

    it('alkalinity compliance is independent of water volume', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.5, max: 20, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0.5, max: 20, noNaN: true, noDefaultInfinity: true }),
          scaCompliantHardnessArb,
          scaCompliantAlkalinityArb,
          (volume1, volume2, hardness, alkalinity) => {
            const result1 = calculateWaterRecipe({
              waterVolume: volume1,
              targetHardness: hardness,
              targetAlkalinity: alkalinity,
            });
            
            const result2 = calculateWaterRecipe({
              waterVolume: volume2,
              targetHardness: hardness,
              targetAlkalinity: alkalinity,
            });

            // Compliance should be the same regardless of volume
            expect(result1.complianceDetails.alkalinity.compliant).toBe(
              result2.complianceDetails.alkalinity.compliant
            );
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Additional properties: Compliance details structure
   */
  describe('Compliance Details Structure', () => {
    it('always includes compliance details in results', () => {
      fc.assert(
        fc.property(
          validWaterRecipeInputsArb,
          (inputs) => {
            const result = calculateWaterRecipe(inputs);
            
            // Verify structure exists
            expect(result.complianceDetails).toBeDefined();
            expect(result.complianceDetails.hardness).toBeDefined();
            expect(result.complianceDetails.alkalinity).toBeDefined();
            
            // Verify hardness details
            expect(result.complianceDetails.hardness.value).toBe(inputs.targetHardness);
            expect(typeof result.complianceDetails.hardness.compliant).toBe('boolean');
            expect(result.complianceDetails.hardness.range).toBe('50-175 ppm');
            
            // Verify alkalinity details
            expect(result.complianceDetails.alkalinity.value).toBe(inputs.targetAlkalinity);
            expect(typeof result.complianceDetails.alkalinity.compliant).toBe('boolean');
            expect(result.complianceDetails.alkalinity.range).toBe('40-70 ppm');
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('scaCompliant matches the AND of individual compliance flags', () => {
      fc.assert(
        fc.property(
          validWaterRecipeInputsArb,
          (inputs) => {
            const result = calculateWaterRecipe(inputs);
            
            const expectedCompliance = 
              result.complianceDetails.hardness.compliant &&
              result.complianceDetails.alkalinity.compliant;
            
            expect(result.scaCompliant).toBe(expectedCompliance);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property: Compliance is deterministic
   */
  describe('Determinism', () => {
    it('same inputs produce same compliance results', () => {
      fc.assert(
        fc.property(
          validWaterRecipeInputsArb,
          (inputs) => {
            const result1 = calculateWaterRecipe(inputs);
            const result2 = calculateWaterRecipe(inputs);
            
            expect(result1.scaCompliant).toBe(result2.scaCompliant);
            expect(result1.complianceDetails.hardness.compliant).toBe(
              result2.complianceDetails.hardness.compliant
            );
            expect(result1.complianceDetails.alkalinity.compliant).toBe(
              result2.complianceDetails.alkalinity.compliant
            );
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
