/**
 * Property Tests: Water Recipe Calculator
 * Feature: coffee-barista-tools
 * 
 * Tests for Property 15 (Epsom salt calculation) and Property 16 (Baking soda calculation).
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateWaterRecipe,
  type WaterRecipeInputs,
} from '@/lib/calculations/coffee/water-recipe';

/**
 * Arbitrary for generating valid water recipe inputs
 */
const validWaterRecipeInputsArb = fc.record({
  waterVolume: fc.double({ min: 0.5, max: 20, noNaN: true, noDefaultInfinity: true }),
  targetHardness: fc.double({ min: 0, max: 300, noNaN: true, noDefaultInfinity: true }),
  targetAlkalinity: fc.double({ min: 0, max: 150, noNaN: true, noDefaultInfinity: true }),
});

describe('Water Recipe Calculator - Property 15', () => {
  /**
   * Property 15: Epsom Salt Calculation
   * 
   * For any valid water volume and target hardness, the Epsom salt amount
   * should equal (target hardness / 100) × water volume
   * 
   * **Validates: Requirements 5.1**
   */
  describe('Property 15: Epsom Salt Calculation', () => {
    it('Epsom salt equals (target hardness / 100) × water volume', () => {
      fc.assert(
        fc.property(
          validWaterRecipeInputsArb,
          (inputs) => {
            const result = calculateWaterRecipe(inputs);
            const expected = (inputs.targetHardness / 100) * inputs.waterVolume;
            
            // Results should match within rounding tolerance (0.01 due to 2 decimal rounding)
            expect(Math.abs(result.epsomSalt - expected)).toBeLessThanOrEqual(0.01);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Epsom salt is always non-negative for valid inputs', () => {
      fc.assert(
        fc.property(
          validWaterRecipeInputsArb,
          (inputs) => {
            const result = calculateWaterRecipe(inputs);
            expect(result.epsomSalt).toBeGreaterThanOrEqual(0);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Epsom salt is zero when target hardness is zero', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.5, max: 20, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0, max: 150, noNaN: true, noDefaultInfinity: true }),
          (waterVolume, targetAlkalinity) => {
            const result = calculateWaterRecipe({
              waterVolume,
              targetHardness: 0,
              targetAlkalinity,
            });
            
            expect(result.epsomSalt).toBe(0);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Epsom salt increases proportionally with water volume', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.5, max: 10, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 50, max: 200, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 40, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 1.5, max: 3, noNaN: true, noDefaultInfinity: true }),
          (waterVolume, targetHardness, targetAlkalinity, multiplier) => {
            const result1 = calculateWaterRecipe({
              waterVolume,
              targetHardness,
              targetAlkalinity,
            });
            
            const newWaterVolume = waterVolume * multiplier;
            if (newWaterVolume <= 20) {
              const result2 = calculateWaterRecipe({
                waterVolume: newWaterVolume,
                targetHardness,
                targetAlkalinity,
              });
              
              const actualMultiplier = result2.epsomSalt / result1.epsomSalt;
              // Tolerance increased to 0.05 to account for rounding errors with small values
              expect(Math.abs(actualMultiplier - multiplier)).toBeLessThanOrEqual(0.05);
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Epsom salt increases proportionally with target hardness', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.5, max: 20, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 50, max: 150, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 40, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 1.2, max: 2, noNaN: true, noDefaultInfinity: true }),
          (waterVolume, targetHardness, targetAlkalinity, multiplier) => {
            const result1 = calculateWaterRecipe({
              waterVolume,
              targetHardness,
              targetAlkalinity,
            });
            
            const newTargetHardness = targetHardness * multiplier;
            if (newTargetHardness <= 300) {
              const result2 = calculateWaterRecipe({
                waterVolume,
                targetHardness: newTargetHardness,
                targetAlkalinity,
              });
              
              const actualMultiplier = result2.epsomSalt / result1.epsomSalt;
              // Tolerance increased to 0.05 to account for rounding errors with small values
              expect(Math.abs(actualMultiplier - multiplier)).toBeLessThanOrEqual(0.05);
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Epsom salt is independent of target alkalinity', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.5, max: 20, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 50, max: 200, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 40, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 40, max: 100, noNaN: true, noDefaultInfinity: true }),
          (waterVolume, targetHardness, alkalinity1, alkalinity2) => {
            const result1 = calculateWaterRecipe({
              waterVolume,
              targetHardness,
              targetAlkalinity: alkalinity1,
            });
            
            const result2 = calculateWaterRecipe({
              waterVolume,
              targetHardness,
              targetAlkalinity: alkalinity2,
            });
            
            // Epsom salt should be the same regardless of alkalinity
            expect(result1.epsomSalt).toBe(result2.epsomSalt);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('calculation is deterministic', () => {
      fc.assert(
        fc.property(
          validWaterRecipeInputsArb,
          (inputs) => {
            const result1 = calculateWaterRecipe(inputs);
            const result2 = calculateWaterRecipe(inputs);
            
            expect(result1.epsomSalt).toBe(result2.epsomSalt);
            expect(result1.bakingSoda).toBe(result2.bakingSoda);
            expect(result1.scaCompliant).toBe(result2.scaCompliant);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Epsom salt has at most 2 decimal places', () => {
      fc.assert(
        fc.property(
          validWaterRecipeInputsArb,
          (inputs) => {
            const result = calculateWaterRecipe(inputs);
            const decimalPlaces = result.epsomSalt.toString().split('.')[1]?.length || 0;
            expect(decimalPlaces).toBeLessThanOrEqual(2);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Epsom salt for 1L at 100ppm equals 1.0g', () => {
      // This is a known reference point from the formula
      const result = calculateWaterRecipe({
        waterVolume: 1,
        targetHardness: 100,
        targetAlkalinity: 50,
      });
      
      expect(result.epsomSalt).toBe(1.0);
    });

    it('Epsom salt scales linearly with both volume and hardness', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.5, max: 10, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 50, max: 150, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 40, max: 100, noNaN: true, noDefaultInfinity: true }),
          (waterVolume, targetHardness, targetAlkalinity) => {
            const result1 = calculateWaterRecipe({
              waterVolume,
              targetHardness,
              targetAlkalinity,
            });
            
            // Double both volume and hardness
            const result2 = calculateWaterRecipe({
              waterVolume: waterVolume * 2,
              targetHardness: targetHardness * 2,
              targetAlkalinity,
            });
            
            // Epsom salt should be 4x (2 × 2)
            const ratio = result2.epsomSalt / result1.epsomSalt;
            // Tolerance increased to 0.1 to account for rounding errors with small values
            expect(Math.abs(ratio - 4)).toBeLessThanOrEqual(0.1);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});


describe('Water Recipe Calculator - Property 16', () => {
  /**
   * Property 16: Baking Soda Calculation
   * 
   * For any valid water volume and target alkalinity, the baking soda amount
   * should equal (target alkalinity / 120) × water volume
   * 
   * **Validates: Requirements 5.2**
   */
  describe('Property 16: Baking Soda Calculation', () => {
    it('Baking soda equals (target alkalinity / 120) × water volume', () => {
      fc.assert(
        fc.property(
          validWaterRecipeInputsArb,
          (inputs) => {
            const result = calculateWaterRecipe(inputs);
            const expected = (inputs.targetAlkalinity / 120) * inputs.waterVolume;
            
            // Results should match within rounding tolerance (0.01 due to 2 decimal rounding)
            expect(Math.abs(result.bakingSoda - expected)).toBeLessThanOrEqual(0.01);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Baking soda is always non-negative for valid inputs', () => {
      fc.assert(
        fc.property(
          validWaterRecipeInputsArb,
          (inputs) => {
            const result = calculateWaterRecipe(inputs);
            expect(result.bakingSoda).toBeGreaterThanOrEqual(0);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Baking soda is zero when target alkalinity is zero', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.5, max: 20, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0, max: 300, noNaN: true, noDefaultInfinity: true }),
          (waterVolume, targetHardness) => {
            const result = calculateWaterRecipe({
              waterVolume,
              targetHardness,
              targetAlkalinity: 0,
            });
            
            expect(result.bakingSoda).toBe(0);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Baking soda increases proportionally with water volume', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.5, max: 10, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 50, max: 200, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 40, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 1.5, max: 3, noNaN: true, noDefaultInfinity: true }),
          (waterVolume, targetHardness, targetAlkalinity, multiplier) => {
            const result1 = calculateWaterRecipe({
              waterVolume,
              targetHardness,
              targetAlkalinity,
            });
            
            const newWaterVolume = waterVolume * multiplier;
            if (newWaterVolume <= 20 && result1.bakingSoda > 0) {
              const result2 = calculateWaterRecipe({
                waterVolume: newWaterVolume,
                targetHardness,
                targetAlkalinity,
              });
              
              const actualMultiplier = result2.bakingSoda / result1.bakingSoda;
              // Tolerance increased to 0.1 to account for rounding errors with small values
              expect(Math.abs(actualMultiplier - multiplier)).toBeLessThanOrEqual(0.1);
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Baking soda increases proportionally with target alkalinity', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.5, max: 20, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 50, max: 200, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 40, max: 75, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 1.2, max: 1.8, noNaN: true, noDefaultInfinity: true }),
          (waterVolume, targetHardness, targetAlkalinity, multiplier) => {
            const result1 = calculateWaterRecipe({
              waterVolume,
              targetHardness,
              targetAlkalinity,
            });
            
            const newTargetAlkalinity = targetAlkalinity * multiplier;
            if (newTargetAlkalinity <= 150 && result1.bakingSoda > 0) {
              const result2 = calculateWaterRecipe({
                waterVolume,
                targetHardness,
                targetAlkalinity: newTargetAlkalinity,
              });
              
              const actualMultiplier = result2.bakingSoda / result1.bakingSoda;
              // Tolerance increased to 0.1 to account for rounding errors with small values
              expect(Math.abs(actualMultiplier - multiplier)).toBeLessThanOrEqual(0.1);
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Baking soda is independent of target hardness', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.5, max: 20, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 50, max: 200, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 50, max: 200, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 40, max: 100, noNaN: true, noDefaultInfinity: true }),
          (waterVolume, hardness1, hardness2, targetAlkalinity) => {
            const result1 = calculateWaterRecipe({
              waterVolume,
              targetHardness: hardness1,
              targetAlkalinity,
            });
            
            const result2 = calculateWaterRecipe({
              waterVolume,
              targetHardness: hardness2,
              targetAlkalinity,
            });
            
            // Baking soda should be the same regardless of hardness
            expect(result1.bakingSoda).toBe(result2.bakingSoda);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Baking soda has at most 2 decimal places', () => {
      fc.assert(
        fc.property(
          validWaterRecipeInputsArb,
          (inputs) => {
            const result = calculateWaterRecipe(inputs);
            const decimalPlaces = result.bakingSoda.toString().split('.')[1]?.length || 0;
            expect(decimalPlaces).toBeLessThanOrEqual(2);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Baking soda for 1L at 120ppm equals 1.0g', () => {
      // This is a known reference point from the formula
      const result = calculateWaterRecipe({
        waterVolume: 1,
        targetHardness: 100,
        targetAlkalinity: 120,
      });
      
      expect(result.bakingSoda).toBe(1.0);
    });

    it('Baking soda scales linearly with both volume and alkalinity', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.5, max: 7.5, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 50, max: 200, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 40, max: 75, noNaN: true, noDefaultInfinity: true }),
          (waterVolume, targetHardness, targetAlkalinity) => {
            const result1 = calculateWaterRecipe({
              waterVolume,
              targetHardness,
              targetAlkalinity,
            });
            
            // Double both volume and alkalinity
            const newWaterVolume = waterVolume * 2;
            const newTargetAlkalinity = targetAlkalinity * 2;
            
            if (newWaterVolume <= 20 && newTargetAlkalinity <= 150 && result1.bakingSoda > 0) {
              const result2 = calculateWaterRecipe({
                waterVolume: newWaterVolume,
                targetHardness,
                targetAlkalinity: newTargetAlkalinity,
              });
              
              // Baking soda should be 4x (2 × 2)
              const ratio = result2.bakingSoda / result1.bakingSoda;
              // Tolerance increased to 0.15 to account for rounding errors with small values
              expect(Math.abs(ratio - 4)).toBeLessThanOrEqual(0.15);
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
