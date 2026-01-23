/**
 * Property Test: Brew Ratio Water Calculation
 * Feature: coffee-barista-tools, Property 4: Brew Ratio Water Calculation
 * 
 * *For any* valid coffee dose and ratio multiplier, the calculated water amount
 * should equal coffee dose × ratio multiplier.
 * 
 * **Validates: Requirements 2.1**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateBrewRatio,
  getStrengthProfile,
  type BrewRatioInputs,
} from '@/lib/calculations/coffee/brew-ratio';
import { CoffeeCalculationError } from '@/lib/calculations/coffee/extraction-yield';

/**
 * Arbitrary for generating valid brew ratio inputs
 */
const validBrewRatioInputsArb = fc.record({
  coffeeDose: fc.double({ min: 1, max: 100, noNaN: true, noDefaultInfinity: true }),
  ratio: fc.double({ min: 10, max: 25, noNaN: true, noDefaultInfinity: true }),
});

describe('Brew Ratio Calculator - Property 4: Brew Ratio Water Calculation', () => {
  /**
   * Property 4: Water amount equals coffee dose × ratio multiplier
   * 
   * For any valid coffee dose and ratio multiplier, the calculated water amount
   * should equal coffee dose × ratio multiplier (within rounding tolerance).
   */
  it('water amount equals coffee dose × ratio multiplier', () => {
    fc.assert(
      fc.property(
        validBrewRatioInputsArb,
        (inputs) => {
          const result = calculateBrewRatio(inputs);
          const expected = inputs.coffeeDose * inputs.ratio;
          
          // Results should match within rounding tolerance (0.1g due to rounding to 1 decimal)
          expect(Math.abs(result.waterAmount - expected)).toBeLessThanOrEqual(0.1);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Water amount is always positive for valid inputs
   */
  it('water amount is always positive for valid inputs', () => {
    fc.assert(
      fc.property(
        validBrewRatioInputsArb,
        (inputs) => {
          const result = calculateBrewRatio(inputs);
          
          expect(result.waterAmount).toBeGreaterThan(0);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Water amount increases proportionally with coffee dose
   */
  it('water amount increases proportionally with coffee dose', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1, max: 50, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 10, max: 25, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 1.1, max: 2, noNaN: true, noDefaultInfinity: true }),
        (coffeeDose, ratio, multiplier) => {
          const result1 = calculateBrewRatio({ coffeeDose, ratio });
          const result2 = calculateBrewRatio({ coffeeDose: coffeeDose * multiplier, ratio });
          
          // Water amount should increase by approximately the same multiplier
          const actualMultiplier = result2.waterAmount / result1.waterAmount;
          expect(Math.abs(actualMultiplier - multiplier)).toBeLessThan(0.01);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Water amount increases proportionally with ratio
   */
  it('water amount increases proportionally with ratio', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1, max: 100, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 10, max: 20, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 1.1, max: 1.5, noNaN: true, noDefaultInfinity: true }),
        (coffeeDose, ratio, multiplier) => {
          const newRatio = ratio * multiplier;
          if (newRatio > 25) return true; // Skip if out of range
          
          const result1 = calculateBrewRatio({ coffeeDose, ratio });
          const result2 = calculateBrewRatio({ coffeeDose, ratio: newRatio });
          
          // Water amount should increase by approximately the same multiplier
          const actualMultiplier = result2.waterAmount / result1.waterAmount;
          expect(Math.abs(actualMultiplier - multiplier)).toBeLessThan(0.01);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Ratio display format is always "1:X"
   */
  it('ratio display format is always "1:X"', () => {
    fc.assert(
      fc.property(
        validBrewRatioInputsArb,
        (inputs) => {
          const result = calculateBrewRatio(inputs);
          
          expect(result.ratioDisplay).toMatch(/^1:\d+(\.\d+)?$/);
          expect(result.ratioDisplay).toContain(inputs.ratio.toString());
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Strength profile is always one of the valid values
   */
  it('strength profile is always one of the valid values', () => {
    fc.assert(
      fc.property(
        validBrewRatioInputsArb,
        (inputs) => {
          const result = calculateBrewRatio(inputs);
          
          expect(['strong', 'balanced', 'mild']).toContain(result.strengthProfile);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Description is always non-empty
   */
  it('description is always non-empty', () => {
    fc.assert(
      fc.property(
        validBrewRatioInputsArb,
        (inputs) => {
          const result = calculateBrewRatio(inputs);
          
          expect(result.description).toBeTruthy();
          expect(result.description.length).toBeGreaterThan(0);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6: Brew Ratio Input Validation
   * Feature: coffee-barista-tools, Property 6: Brew Ratio Input Validation
   * 
   * *For any* input where coffee dose ≤ 0 or ratio < 1, the calculator should
   * reject the input and display a validation error.
   * 
   * **Validates: Requirements 2.5, 2.6**
   */
  describe('Property 6: Brew Ratio Input Validation', () => {
    /**
     * Requirement 2.5: Coffee dose ≤ 0 should be rejected
     */
    it('rejects coffee dose zero or negative', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -100, max: 0, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 10, max: 25, noNaN: true, noDefaultInfinity: true }),
          (coffeeDose, ratio) => {
            expect(() => calculateBrewRatio({
              coffeeDose,
              ratio,
            })).toThrow(CoffeeCalculationError);
            
            try {
              calculateBrewRatio({ coffeeDose, ratio });
            } catch (error) {
              expect(error).toBeInstanceOf(CoffeeCalculationError);
              expect((error as CoffeeCalculationError).code).toBe('invalid_input');
              expect((error as CoffeeCalculationError).field).toBe('coffeeDose');
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Requirement 2.6: Ratio < 1 should be rejected
     */
    it('rejects ratio less than 1', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 1, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: -10, max: 0.99, noNaN: true, noDefaultInfinity: true }),
          (coffeeDose, ratio) => {
            expect(() => calculateBrewRatio({
              coffeeDose,
              ratio,
            })).toThrow(CoffeeCalculationError);
            
            try {
              calculateBrewRatio({ coffeeDose, ratio });
            } catch (error) {
              expect(error).toBeInstanceOf(CoffeeCalculationError);
              expect((error as CoffeeCalculationError).code).toBe('invalid_input');
              expect((error as CoffeeCalculationError).field).toBe('ratio');
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Combined validation: Both invalid inputs should be rejected
     */
    it('rejects when both coffee dose and ratio are invalid', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -100, max: 0, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: -10, max: 0.99, noNaN: true, noDefaultInfinity: true }),
          (coffeeDose, ratio) => {
            expect(() => calculateBrewRatio({
              coffeeDose,
              ratio,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Edge case: Exactly zero values
     */
    it('rejects exactly zero coffee dose', () => {
      expect(() => calculateBrewRatio({
        coffeeDose: 0,
        ratio: 15,
      })).toThrow(CoffeeCalculationError);
    });

    it('rejects exactly zero ratio', () => {
      expect(() => calculateBrewRatio({
        coffeeDose: 20,
        ratio: 0,
      })).toThrow(CoffeeCalculationError);
    });

    /**
     * Boundary validation: Values just outside valid range
     */
    it('rejects coffee dose below minimum (< 1g)', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.01, max: 0.99, noNaN: true, noDefaultInfinity: true }),
          (coffeeDose) => {
            expect(() => calculateBrewRatio({
              coffeeDose,
              ratio: 15,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('rejects coffee dose above maximum (> 100g)', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 100.01, max: 200, noNaN: true, noDefaultInfinity: true }),
          (coffeeDose) => {
            expect(() => calculateBrewRatio({
              coffeeDose,
              ratio: 15,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('rejects ratio below minimum (< 10)', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 1, max: 9.99, noNaN: true, noDefaultInfinity: true }),
          (ratio) => {
            expect(() => calculateBrewRatio({
              coffeeDose: 20,
              ratio,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('rejects ratio above maximum (> 25)', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 25.01, max: 50, noNaN: true, noDefaultInfinity: true }),
          (ratio) => {
            expect(() => calculateBrewRatio({
              coffeeDose: 20,
              ratio,
            })).toThrow(CoffeeCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * Property 5: Strength Profile Classification
   * Feature: coffee-barista-tools, Property 5: Strength Profile Classification
   * 
   * *For any* brew ratio, the strength profile should be "strong" when ratio ≤ 15,
   * "balanced" when 15 < ratio ≤ 17, and "mild" when ratio > 17.
   * 
   * **Validates: Requirements 2.2, 2.3, 2.4**
   */
  describe('Property 5: Strength Profile Classification', () => {
    it('classifies strength profile correctly across all ratio ranges', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 10, max: 25, noNaN: true, noDefaultInfinity: true }),
          (ratio) => {
            const profile = getStrengthProfile(ratio);
            
            // Requirement 2.2: ratio ≤ 15 should be "strong"
            if (ratio <= 15) {
              expect(profile).toBe('strong');
            }
            // Requirement 2.3: 15 < ratio ≤ 17 should be "balanced"
            else if (ratio > 15 && ratio <= 17) {
              expect(profile).toBe('balanced');
            }
            // Requirement 2.4: ratio > 17 should be "mild"
            else {
              expect(profile).toBe('mild');
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('ratio <= 15 is classified as strong', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 10, max: 15, noNaN: true, noDefaultInfinity: true }),
          (ratio) => {
            const profile = getStrengthProfile(ratio);
            expect(profile).toBe('strong');
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('ratio between 15 and 17 is classified as balanced', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 15.01, max: 17, noNaN: true, noDefaultInfinity: true }),
          (ratio) => {
            const profile = getStrengthProfile(ratio);
            expect(profile).toBe('balanced');
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('ratio > 17 is classified as mild', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 17.01, max: 25, noNaN: true, noDefaultInfinity: true }),
          (ratio) => {
            const profile = getStrengthProfile(ratio);
            expect(profile).toBe('mild');
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property: Calculation is deterministic
   */
  it('same inputs produce same outputs', () => {
    fc.assert(
      fc.property(
        validBrewRatioInputsArb,
        (inputs) => {
          const result1 = calculateBrewRatio(inputs);
          const result2 = calculateBrewRatio(inputs);
          
          expect(result1.waterAmount).toBe(result2.waterAmount);
          expect(result1.strengthProfile).toBe(result2.strengthProfile);
          expect(result1.ratioDisplay).toBe(result2.ratioDisplay);
          expect(result1.description).toBe(result2.description);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
