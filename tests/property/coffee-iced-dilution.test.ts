/**
 * Property Test: Hot Coffee Amount Calculation
 * Feature: coffee-barista-tools, Property 7: Hot Coffee Amount Calculation
 * 
 * *For any* valid target volume, target TDS, and ice percentage, the hot coffee
 * amount should account for dilution such that (hot coffee TDS × hot coffee amount)
 * / target volume = target TDS.
 * 
 * **Validates: Requirements 3.1**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateIcedCoffeeDilution,
  type IcedCoffeeDilutionInputs,
} from '@/lib/calculations/coffee/iced-coffee-dilution';
import { CoffeeCalculationError } from '@/lib/calculations/coffee/extraction-yield';

/**
 * Arbitrary for generating valid iced coffee dilution inputs
 */
const validIcedCoffeeDilutionInputsArb = fc.record({
  targetVolume: fc.double({ min: 100, max: 2000, noNaN: true, noDefaultInfinity: true }),
  targetTDS: fc.double({ min: 0.5, max: 3, noNaN: true, noDefaultInfinity: true }),
  icePercentage: fc.double({ min: 10, max: 70, noNaN: true, noDefaultInfinity: true }),
});

describe('Iced Coffee Dilution Calculator - Property 7: Hot Coffee Amount Calculation', () => {
  /**
   * Property 7: Hot coffee amount accounts for dilution correctly
   * 
   * For any valid target volume, target TDS, and ice percentage, the hot coffee
   * amount should be calculated such that when diluted with ice, the final TDS
   * matches the target TDS.
   * 
   * Formula verification: (brewingTDS × hotCoffeeAmount) / targetVolume = targetTDS
   */
  it('hot coffee amount accounts for dilution correctly', () => {
    fc.assert(
      fc.property(
        validIcedCoffeeDilutionInputsArb,
        (inputs) => {
          const result = calculateIcedCoffeeDilution(inputs);
          
          // Verify the dilution formula:
          // (brewingTDS × hotCoffeeAmount) / targetVolume = targetTDS
          const calculatedFinalTDS = (result.brewingTDS * result.hotCoffeeAmount) / inputs.targetVolume;
          
          // Allow small floating-point tolerance (0.01% TDS)
          expect(Math.abs(calculatedFinalTDS - inputs.targetTDS)).toBeLessThan(0.01);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Hot coffee amount equals target volume minus ice amount
   */
  it('hot coffee amount equals target volume minus ice amount', () => {
    fc.assert(
      fc.property(
        validIcedCoffeeDilutionInputsArb,
        (inputs) => {
          const result = calculateIcedCoffeeDilution(inputs);
          
          // Hot coffee + ice should equal target volume
          const calculatedTargetVolume = result.hotCoffeeAmount + result.iceAmount;
          
          // Allow rounding tolerance (0.2ml due to rounding to 1 decimal)
          expect(Math.abs(calculatedTargetVolume - inputs.targetVolume)).toBeLessThanOrEqual(0.2);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Hot coffee amount is always positive for valid inputs
   */
  it('hot coffee amount is always positive for valid inputs', () => {
    fc.assert(
      fc.property(
        validIcedCoffeeDilutionInputsArb,
        (inputs) => {
          const result = calculateIcedCoffeeDilution(inputs);
          
          expect(result.hotCoffeeAmount).toBeGreaterThan(0);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Hot coffee amount decreases as ice percentage increases
   */
  it('hot coffee amount decreases as ice percentage increases', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 100, max: 2000, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0.5, max: 3, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 10, max: 60, noNaN: true, noDefaultInfinity: true }),
        (targetVolume, targetTDS, icePercentage) => {
          const result1 = calculateIcedCoffeeDilution({
            targetVolume,
            targetTDS,
            icePercentage,
          });
          
          const result2 = calculateIcedCoffeeDilution({
            targetVolume,
            targetTDS,
            icePercentage: icePercentage + 5, // Increase ice by 5%
          });
          
          // Hot coffee amount should decrease when ice percentage increases
          expect(result2.hotCoffeeAmount).toBeLessThan(result1.hotCoffeeAmount);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Brewing TDS increases as ice percentage increases
   */
  it('brewing TDS increases as ice percentage increases', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 100, max: 2000, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0.5, max: 3, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 10, max: 60, noNaN: true, noDefaultInfinity: true }),
        (targetVolume, targetTDS, icePercentage) => {
          const result1 = calculateIcedCoffeeDilution({
            targetVolume,
            targetTDS,
            icePercentage,
          });
          
          const result2 = calculateIcedCoffeeDilution({
            targetVolume,
            targetTDS,
            icePercentage: icePercentage + 5, // Increase ice by 5%
          });
          
          // Brewing TDS should increase to compensate for more dilution
          expect(result2.brewingTDS).toBeGreaterThan(result1.brewingTDS);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Ice amount equals target volume × ice percentage
   */
  it('ice amount equals target volume × ice percentage', () => {
    fc.assert(
      fc.property(
        validIcedCoffeeDilutionInputsArb,
        (inputs) => {
          const result = calculateIcedCoffeeDilution(inputs);
          const expectedIceAmount = inputs.targetVolume * (inputs.icePercentage / 100);
          
          // Allow rounding tolerance (0.1g due to rounding to 1 decimal)
          expect(Math.abs(result.iceAmount - expectedIceAmount)).toBeLessThanOrEqual(0.1);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Warning appears when ice percentage exceeds 50%
   */
  it('warning appears when ice percentage exceeds 50%', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 100, max: 2000, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0.5, max: 3, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 50.01, max: 70, noNaN: true, noDefaultInfinity: true }),
        (targetVolume, targetTDS, icePercentage) => {
          const result = calculateIcedCoffeeDilution({
            targetVolume,
            targetTDS,
            icePercentage,
          });
          
          expect(result.warning).toBeDefined();
          expect(result.warning).toContain('50 %');
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: No warning when ice percentage is 50% or below
   */
  it('no warning when ice percentage is 50% or below', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 100, max: 2000, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0.5, max: 3, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 10, max: 50, noNaN: true, noDefaultInfinity: true }),
        (targetVolume, targetTDS, icePercentage) => {
          const result = calculateIcedCoffeeDilution({
            targetVolume,
            targetTDS,
            icePercentage,
          });
          
          expect(result.warning).toBeUndefined();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 10: Iced Coffee Input Validation
   * 
   * *For any* input where target volume ≤ 0, ice percentage < 0, ice percentage > 100,
   * or target TDS ≤ 0, the calculator should reject the input and display a validation error.
   * 
   * **Validates: Requirements 3.4, 3.5, 3.6**
   */
  describe('Property 10: Iced Coffee Input Validation', () => {
    it('rejects target volume ≤ 0', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant(0),
            fc.double({ min: -1000, max: -0.01, noNaN: true, noDefaultInfinity: true })
          ),
          fc.double({ min: 0.5, max: 3, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 10, max: 70, noNaN: true, noDefaultInfinity: true }),
          (targetVolume, targetTDS, icePercentage) => {
            expect(() => calculateIcedCoffeeDilution({
              targetVolume,
              targetTDS,
              icePercentage,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects ice percentage < 0', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 100, max: 2000, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0.5, max: 3, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: -100, max: -0.01, noNaN: true, noDefaultInfinity: true }),
          (targetVolume, targetTDS, icePercentage) => {
            expect(() => calculateIcedCoffeeDilution({
              targetVolume,
              targetTDS,
              icePercentage,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects ice percentage > 100', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 100, max: 2000, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0.5, max: 3, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 100.01, max: 200, noNaN: true, noDefaultInfinity: true }),
          (targetVolume, targetTDS, icePercentage) => {
            expect(() => calculateIcedCoffeeDilution({
              targetVolume,
              targetTDS,
              icePercentage,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects target TDS ≤ 0', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 100, max: 2000, noNaN: true, noDefaultInfinity: true }),
          fc.oneof(
            fc.constant(0),
            fc.double({ min: -5, max: -0.01, noNaN: true, noDefaultInfinity: true })
          ),
          fc.double({ min: 10, max: 70, noNaN: true, noDefaultInfinity: true }),
          (targetVolume, targetTDS, icePercentage) => {
            expect(() => calculateIcedCoffeeDilution({
              targetVolume,
              targetTDS,
              icePercentage,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('accepts all valid inputs without throwing', () => {
      fc.assert(
        fc.property(
          validIcedCoffeeDilutionInputsArb,
          (inputs) => {
            expect(() => calculateIcedCoffeeDilution(inputs)).not.toThrow();
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Additional validation tests for edge cases
   */
  describe('invalid inputs throw errors', () => {
    it('zero target volume throws error', () => {
      expect(() => calculateIcedCoffeeDilution({
        targetVolume: 0,
        targetTDS: 1.2,
        icePercentage: 40,
      })).toThrow(CoffeeCalculationError);
    });

    it('negative target volume throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -1000, max: -0.01, noNaN: true, noDefaultInfinity: true }),
          (targetVolume) => {
            expect(() => calculateIcedCoffeeDilution({
              targetVolume,
              targetTDS: 1.2,
              icePercentage: 40,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('target volume below minimum throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.01, max: 99.99, noNaN: true, noDefaultInfinity: true }),
          (targetVolume) => {
            expect(() => calculateIcedCoffeeDilution({
              targetVolume,
              targetTDS: 1.2,
              icePercentage: 40,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('target volume above maximum throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 2000.01, max: 5000, noNaN: true, noDefaultInfinity: true }),
          (targetVolume) => {
            expect(() => calculateIcedCoffeeDilution({
              targetVolume,
              targetTDS: 1.2,
              icePercentage: 40,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('zero target TDS throws error', () => {
      expect(() => calculateIcedCoffeeDilution({
        targetVolume: 400,
        targetTDS: 0,
        icePercentage: 40,
      })).toThrow(CoffeeCalculationError);
    });

    it('negative target TDS throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -5, max: -0.01, noNaN: true, noDefaultInfinity: true }),
          (targetTDS) => {
            expect(() => calculateIcedCoffeeDilution({
              targetVolume: 400,
              targetTDS,
              icePercentage: 40,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('target TDS below minimum throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.01, max: 0.49, noNaN: true, noDefaultInfinity: true }),
          (targetTDS) => {
            expect(() => calculateIcedCoffeeDilution({
              targetVolume: 400,
              targetTDS,
              icePercentage: 40,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('target TDS above maximum throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 3.01, max: 10, noNaN: true, noDefaultInfinity: true }),
          (targetTDS) => {
            expect(() => calculateIcedCoffeeDilution({
              targetVolume: 400,
              targetTDS,
              icePercentage: 40,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('negative ice percentage throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -50, max: -0.01, noNaN: true, noDefaultInfinity: true }),
          (icePercentage) => {
            expect(() => calculateIcedCoffeeDilution({
              targetVolume: 400,
              targetTDS: 1.2,
              icePercentage,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('ice percentage above 100 throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 100.01, max: 200, noNaN: true, noDefaultInfinity: true }),
          (icePercentage) => {
            expect(() => calculateIcedCoffeeDilution({
              targetVolume: 400,
              targetTDS: 1.2,
              icePercentage,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('ice percentage below minimum throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0, max: 9.99, noNaN: true, noDefaultInfinity: true }),
          (icePercentage) => {
            expect(() => calculateIcedCoffeeDilution({
              targetVolume: 400,
              targetTDS: 1.2,
              icePercentage,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('ice percentage above maximum throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 70.01, max: 100, noNaN: true, noDefaultInfinity: true }),
          (icePercentage) => {
            expect(() => calculateIcedCoffeeDilution({
              targetVolume: 400,
              targetTDS: 1.2,
              icePercentage,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * Property: Calculation is deterministic
   */
  it('same inputs produce same outputs', () => {
    fc.assert(
      fc.property(
        validIcedCoffeeDilutionInputsArb,
        (inputs) => {
          const result1 = calculateIcedCoffeeDilution(inputs);
          const result2 = calculateIcedCoffeeDilution(inputs);
          
          expect(result1.hotCoffeeAmount).toBe(result2.hotCoffeeAmount);
          expect(result1.iceAmount).toBe(result2.iceAmount);
          expect(result1.brewingTDS).toBe(result2.brewingTDS);
          expect(result1.warning).toBe(result2.warning);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
