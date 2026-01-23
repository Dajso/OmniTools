/**
 * Property Test: Water Recipe Input Validation
 * Feature: coffee-barista-tools, Property 18: Water Recipe Input Validation
 * 
 * *For any* input where water volume ≤ 0, target hardness < 0, or target alkalinity < 0,
 * the calculator should reject the input and display a validation error.
 * 
 * **Validates: Requirements 5.5, 5.6, 5.7**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateWaterRecipe,
  type WaterRecipeInputs,
} from '@/lib/calculations/coffee/water-recipe';
import { CoffeeCalculationError } from '@/lib/calculations/coffee/extraction-yield';

/**
 * Arbitrary for generating valid water recipe inputs
 */
const validWaterRecipeInputsArb = fc.record({
  waterVolume: fc.double({ min: 0.5, max: 20, noNaN: true, noDefaultInfinity: true }),
  targetHardness: fc.double({ min: 0, max: 300, noNaN: true, noDefaultInfinity: true }),
  targetAlkalinity: fc.double({ min: 0, max: 150, noNaN: true, noDefaultInfinity: true }),
});

describe('Water Recipe Calculator - Property 18: Water Recipe Input Validation', () => {
  /**
   * Property 18: Input validation for water recipe calculator
   * 
   * For any input where water volume ≤ 0, target hardness < 0, or target alkalinity < 0,
   * the calculator should reject the input and display a validation error.
   */
  
  /**
   * Requirement 5.5: Water volume ≤ 0 should be rejected
   */
  describe('Requirement 5.5: Water volume validation', () => {
    it('rejects water volume zero or negative', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -100, max: 0, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0, max: 300, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0, max: 150, noNaN: true, noDefaultInfinity: true }),
          (waterVolume, targetHardness, targetAlkalinity) => {
            expect(() => calculateWaterRecipe({
              waterVolume,
              targetHardness,
              targetAlkalinity,
            })).toThrow(CoffeeCalculationError);
            
            try {
              calculateWaterRecipe({ waterVolume, targetHardness, targetAlkalinity });
            } catch (error) {
              expect(error).toBeInstanceOf(CoffeeCalculationError);
              expect((error as CoffeeCalculationError).code).toBe('invalid_input');
              expect((error as CoffeeCalculationError).field).toBe('waterVolume');
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects exactly zero water volume', () => {
      expect(() => calculateWaterRecipe({
        waterVolume: 0,
        targetHardness: 100,
        targetAlkalinity: 50,
      })).toThrow(CoffeeCalculationError);
    });

    it('rejects negative water volume', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -100, max: -0.01, noNaN: true, noDefaultInfinity: true }),
          (waterVolume) => {
            expect(() => calculateWaterRecipe({
              waterVolume,
              targetHardness: 100,
              targetAlkalinity: 50,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('rejects water volume below minimum (< 0.5L)', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.01, max: 0.49, noNaN: true, noDefaultInfinity: true }),
          (waterVolume) => {
            expect(() => calculateWaterRecipe({
              waterVolume,
              targetHardness: 100,
              targetAlkalinity: 50,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('rejects water volume above maximum (> 20L)', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 20.01, max: 100, noNaN: true, noDefaultInfinity: true }),
          (waterVolume) => {
            expect(() => calculateWaterRecipe({
              waterVolume,
              targetHardness: 100,
              targetAlkalinity: 50,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('accepts water volume at minimum boundary (0.5L)', () => {
      expect(() => calculateWaterRecipe({
        waterVolume: 0.5,
        targetHardness: 100,
        targetAlkalinity: 50,
      })).not.toThrow();
    });

    it('accepts water volume at maximum boundary (20L)', () => {
      expect(() => calculateWaterRecipe({
        waterVolume: 20,
        targetHardness: 100,
        targetAlkalinity: 50,
      })).not.toThrow();
    });
  });

  /**
   * Requirement 5.6: Target hardness < 0 should be rejected
   */
  describe('Requirement 5.6: Target hardness validation', () => {
    it('rejects negative target hardness', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.5, max: 20, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: -300, max: -0.01, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0, max: 150, noNaN: true, noDefaultInfinity: true }),
          (waterVolume, targetHardness, targetAlkalinity) => {
            expect(() => calculateWaterRecipe({
              waterVolume,
              targetHardness,
              targetAlkalinity,
            })).toThrow(CoffeeCalculationError);
            
            try {
              calculateWaterRecipe({ waterVolume, targetHardness, targetAlkalinity });
            } catch (error) {
              expect(error).toBeInstanceOf(CoffeeCalculationError);
              expect((error as CoffeeCalculationError).code).toBe('invalid_input');
              expect((error as CoffeeCalculationError).field).toBe('targetHardness');
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects target hardness above maximum (> 300 ppm)', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 300.01, max: 1000, noNaN: true, noDefaultInfinity: true }),
          (targetHardness) => {
            expect(() => calculateWaterRecipe({
              waterVolume: 1,
              targetHardness,
              targetAlkalinity: 50,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('accepts zero target hardness', () => {
      // Zero is valid (distilled water has zero hardness)
      expect(() => calculateWaterRecipe({
        waterVolume: 1,
        targetHardness: 0,
        targetAlkalinity: 50,
      })).not.toThrow();
    });

    it('accepts target hardness at maximum boundary (300 ppm)', () => {
      expect(() => calculateWaterRecipe({
        waterVolume: 1,
        targetHardness: 300,
        targetAlkalinity: 50,
      })).not.toThrow();
    });
  });

  /**
   * Requirement 5.7: Target alkalinity < 0 should be rejected
   */
  describe('Requirement 5.7: Target alkalinity validation', () => {
    it('rejects negative target alkalinity', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.5, max: 20, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0, max: 300, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: -150, max: -0.01, noNaN: true, noDefaultInfinity: true }),
          (waterVolume, targetHardness, targetAlkalinity) => {
            expect(() => calculateWaterRecipe({
              waterVolume,
              targetHardness,
              targetAlkalinity,
            })).toThrow(CoffeeCalculationError);
            
            try {
              calculateWaterRecipe({ waterVolume, targetHardness, targetAlkalinity });
            } catch (error) {
              expect(error).toBeInstanceOf(CoffeeCalculationError);
              expect((error as CoffeeCalculationError).code).toBe('invalid_input');
              expect((error as CoffeeCalculationError).field).toBe('targetAlkalinity');
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects target alkalinity above maximum (> 150 ppm)', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 150.01, max: 500, noNaN: true, noDefaultInfinity: true }),
          (targetAlkalinity) => {
            expect(() => calculateWaterRecipe({
              waterVolume: 1,
              targetHardness: 100,
              targetAlkalinity,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('accepts zero target alkalinity', () => {
      // Zero is valid (distilled water has zero alkalinity)
      expect(() => calculateWaterRecipe({
        waterVolume: 1,
        targetHardness: 100,
        targetAlkalinity: 0,
      })).not.toThrow();
    });

    it('accepts target alkalinity at maximum boundary (150 ppm)', () => {
      expect(() => calculateWaterRecipe({
        waterVolume: 1,
        targetHardness: 100,
        targetAlkalinity: 150,
      })).not.toThrow();
    });
  });

  /**
   * Combined validation: Multiple invalid inputs
   */
  describe('Combined validation scenarios', () => {
    it('rejects when both water volume and target hardness are invalid', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -100, max: 0, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: -300, max: -0.01, noNaN: true, noDefaultInfinity: true }),
          (waterVolume, targetHardness) => {
            expect(() => calculateWaterRecipe({
              waterVolume,
              targetHardness,
              targetAlkalinity: 50,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('rejects when both water volume and target alkalinity are invalid', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -100, max: 0, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: -150, max: -0.01, noNaN: true, noDefaultInfinity: true }),
          (waterVolume, targetAlkalinity) => {
            expect(() => calculateWaterRecipe({
              waterVolume,
              targetHardness: 100,
              targetAlkalinity,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('rejects when both target hardness and target alkalinity are invalid', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -300, max: -0.01, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: -150, max: -0.01, noNaN: true, noDefaultInfinity: true }),
          (targetHardness, targetAlkalinity) => {
            expect(() => calculateWaterRecipe({
              waterVolume: 1,
              targetHardness,
              targetAlkalinity,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('rejects when all three inputs are invalid', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -100, max: 0, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: -300, max: -0.01, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: -150, max: -0.01, noNaN: true, noDefaultInfinity: true }),
          (waterVolume, targetHardness, targetAlkalinity) => {
            expect(() => calculateWaterRecipe({
              waterVolume,
              targetHardness,
              targetAlkalinity,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * Property: Valid inputs should not throw errors
   */
  describe('Valid input acceptance', () => {
    it('accepts all valid inputs without throwing', () => {
      fc.assert(
        fc.property(
          validWaterRecipeInputsArb,
          (inputs) => {
            expect(() => calculateWaterRecipe(inputs)).not.toThrow();
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('valid inputs produce results with expected structure', () => {
      fc.assert(
        fc.property(
          validWaterRecipeInputsArb,
          (inputs) => {
            const result = calculateWaterRecipe(inputs);
            
            // Verify result structure
            expect(result).toHaveProperty('epsomSalt');
            expect(result).toHaveProperty('bakingSoda');
            expect(result).toHaveProperty('scaCompliant');
            expect(result).toHaveProperty('instructions');
            expect(result).toHaveProperty('complianceDetails');
            
            // Verify result types
            expect(typeof result.epsomSalt).toBe('number');
            expect(typeof result.bakingSoda).toBe('number');
            expect(typeof result.scaCompliant).toBe('boolean');
            expect(Array.isArray(result.instructions)).toBe(true);
            
            // Verify non-negative results
            expect(result.epsomSalt).toBeGreaterThanOrEqual(0);
            expect(result.bakingSoda).toBeGreaterThanOrEqual(0);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property: Error messages should be descriptive
   */
  describe('Error message quality', () => {
    it('error messages contain field information', () => {
      const invalidInputs: Array<[WaterRecipeInputs, string]> = [
        [{ waterVolume: -1, targetHardness: 100, targetAlkalinity: 50 }, 'waterVolume'],
        [{ waterVolume: 1, targetHardness: -10, targetAlkalinity: 50 }, 'targetHardness'],
        [{ waterVolume: 1, targetHardness: 100, targetAlkalinity: -10 }, 'targetAlkalinity'],
      ];

      invalidInputs.forEach(([inputs, expectedField]) => {
        try {
          calculateWaterRecipe(inputs);
          expect.fail(`Should have thrown error for invalid ${expectedField}`);
        } catch (error) {
          expect(error).toBeInstanceOf(CoffeeCalculationError);
          expect((error as CoffeeCalculationError).field).toBe(expectedField);
          expect((error as CoffeeCalculationError).message).toBeTruthy();
          expect((error as CoffeeCalculationError).message.length).toBeGreaterThan(0);
        }
      });
    });

    it('error messages are non-empty strings', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -100, max: 0, noNaN: true, noDefaultInfinity: true }),
          (waterVolume) => {
            try {
              calculateWaterRecipe({
                waterVolume,
                targetHardness: 100,
                targetAlkalinity: 50,
              });
              return false; // Should have thrown
            } catch (error) {
              expect(error).toBeInstanceOf(CoffeeCalculationError);
              const message = (error as CoffeeCalculationError).message;
              expect(typeof message).toBe('string');
              expect(message.length).toBeGreaterThan(0);
              return true;
            }
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * Property: Validation is consistent
   */
  describe('Validation consistency', () => {
    it('same invalid inputs always throw errors', () => {
      const invalidInputs: WaterRecipeInputs[] = [
        { waterVolume: -1, targetHardness: 100, targetAlkalinity: 50 },
        { waterVolume: 1, targetHardness: -10, targetAlkalinity: 50 },
        { waterVolume: 1, targetHardness: 100, targetAlkalinity: -10 },
        { waterVolume: 0, targetHardness: 100, targetAlkalinity: 50 },
        { waterVolume: 25, targetHardness: 100, targetAlkalinity: 50 },
        { waterVolume: 1, targetHardness: 350, targetAlkalinity: 50 },
        { waterVolume: 1, targetHardness: 100, targetAlkalinity: 200 },
      ];

      invalidInputs.forEach((inputs) => {
        // Call multiple times to ensure consistency
        expect(() => calculateWaterRecipe(inputs)).toThrow(CoffeeCalculationError);
        expect(() => calculateWaterRecipe(inputs)).toThrow(CoffeeCalculationError);
        expect(() => calculateWaterRecipe(inputs)).toThrow(CoffeeCalculationError);
      });
    });

    it('same valid inputs never throw errors', () => {
      fc.assert(
        fc.property(
          validWaterRecipeInputsArb,
          (inputs) => {
            // Call multiple times to ensure consistency
            expect(() => calculateWaterRecipe(inputs)).not.toThrow();
            expect(() => calculateWaterRecipe(inputs)).not.toThrow();
            expect(() => calculateWaterRecipe(inputs)).not.toThrow();
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
