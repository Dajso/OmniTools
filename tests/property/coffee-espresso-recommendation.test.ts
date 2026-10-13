/**
 * Property Test: Espresso Recommendation Classification
 * Feature: coffee-barista-tools, Property 13: Espresso Recommendation Classification
 * 
 * *For any* extraction ratio, the recommendation should suggest increasing yield or 
 * decreasing dose when ratio < 1.5, indicate optimal when 1.5 ≤ ratio ≤ 2.5, 
 * and suggest decreasing yield or increasing dose when ratio > 2.5.
 * 
 * **Validates: Requirements 4.3, 4.4, 4.5**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateEspressoMetrics,
  getExtractionRatioRecommendation,
  type EspressoMetricsInputs,
} from '@/lib/calculations/coffee/espresso-dial-in';

/**
 * Arbitrary for generating valid espresso metrics inputs
 */
const validEspressoMetricsInputsArb = fc.record({
  dose: fc.double({ min: 5, max: 30, noNaN: true, noDefaultInfinity: true }),
  yield: fc.double({ min: 10, max: 100, noNaN: true, noDefaultInfinity: true }),
  time: fc.double({ min: 10, max: 60, noNaN: true, noDefaultInfinity: true }),
});

describe('Espresso Dial-in Log - Property 13: Espresso Recommendation Classification', () => {
  /**
   * Property 13: Recommendation classification based on extraction ratio
   * 
   * This property validates that the recommendation system correctly classifies
   * extraction ratios into three categories:
   * - ratio < 1.5: recommend increasing yield or decreasing dose
   * - 1.5 ≤ ratio ≤ 2.5: indicate optimal extraction
   * - ratio > 2.5: recommend decreasing yield or increasing dose
   */
  
  /**
   * Requirement 4.3: When extraction ratio is below 1.5, 
   * THE Calculator SHALL recommend increasing yield or decreasing dose
   */
  it('ratio < 1.5 recommends increasing yield or decreasing dose', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.1, max: 1.49, noNaN: true, noDefaultInfinity: true }),
        (targetRatio) => {
          // Generate inputs that produce the target ratio
          const dose = fc.sample(fc.double({ min: 5, max: 30, noNaN: true, noDefaultInfinity: true }), 1)[0];
          const yieldAmount = dose * targetRatio;
          
          // Skip if yield is out of valid range
          if (yieldAmount < 10 || yieldAmount > 100) {
            return true;
          }
          
          const time = fc.sample(fc.double({ min: 10, max: 60, noNaN: true, noDefaultInfinity: true }), 1)[0];
          
          const result = calculateEspressoMetrics({
            dose,
            yield: yieldAmount,
            time,
          });
          
          // Verify recommendation is 'increase-yield'
          expect(result.recommendation).toBe('increase-yield');
          
          // Verify recommendation text mentions increasing yield or decreasing dose
          const text = result.recommendationText.toLowerCase();
          expect(
            text.includes('øke utbyttet') || 
            text.includes('øke utbyttet') ||
            text.includes('redusere kaffemengden') ||
            text.includes('redusere kaffemengden')
          ).toBe(true);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Requirement 4.4: When extraction ratio is between 1.5 and 2.5,
   * THE Calculator SHALL indicate optimal extraction ratio
   */
  it('ratio between 1.5 and 2.5 indicates optimal extraction', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1.5, max: 2.5, noNaN: true, noDefaultInfinity: true }),
        (targetRatio) => {
          // Generate inputs that produce the target ratio
          const dose = fc.sample(fc.double({ min: 5, max: 30, noNaN: true, noDefaultInfinity: true }), 1)[0];
          const yieldAmount = dose * targetRatio;
          
          // Skip if yield is out of valid range
          if (yieldAmount < 10 || yieldAmount > 100) {
            return true;
          }
          
          const time = fc.sample(fc.double({ min: 10, max: 60, noNaN: true, noDefaultInfinity: true }), 1)[0];
          
          const result = calculateEspressoMetrics({
            dose,
            yield: yieldAmount,
            time,
          });
          
          // Verify recommendation is 'optimal'
          expect(result.recommendation).toBe('optimal');
          
          // Verify recommendation text mentions optimal
          const text = result.recommendationText.toLowerCase();
          expect(text.includes('optimale')).toBe(true);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Requirement 4.5: When extraction ratio is above 2.5,
   * THE Calculator SHALL recommend decreasing yield or increasing dose
   */
  it('ratio > 2.5 recommends decreasing yield or increasing dose', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 2.51, max: 10, noNaN: true, noDefaultInfinity: true }),
        (targetRatio) => {
          // Generate inputs that produce the target ratio
          const dose = fc.sample(fc.double({ min: 10, max: 30, noNaN: true, noDefaultInfinity: true }), 1)[0];
          const yieldAmount = dose * targetRatio;
          
          // Skip if yield is out of valid range
          if (yieldAmount < 10 || yieldAmount > 100) {
            return true;
          }
          
          const time = fc.sample(fc.double({ min: 10, max: 60, noNaN: true, noDefaultInfinity: true }), 1)[0];
          
          const result = calculateEspressoMetrics({
            dose,
            yield: yieldAmount,
            time,
          });
          
          // Verify recommendation is 'decrease-yield'
          expect(result.recommendation).toBe('decrease-yield');
          
          // Verify recommendation text mentions decreasing yield or increasing dose
          const text = result.recommendationText.toLowerCase();
          expect(
            text.includes('redusere utbyttet') || 
            text.includes('redusere utbyttet') ||
            text.includes('øke kaffemengden') ||
            text.includes('øke kaffemengden')
          ).toBe(true);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Recommendation classification is consistent across all valid inputs
   * 
   * This test verifies that for any valid espresso metrics inputs, the recommendation
   * classification is consistent with the extraction ratio thresholds.
   */
  it('recommendation classification is consistent with extraction ratio', () => {
    fc.assert(
      fc.property(
        validEspressoMetricsInputsArb,
        (inputs) => {
          const result = calculateEspressoMetrics(inputs);
          const ratio = result.extractionRatio;
          
          if (ratio < 1.5) {
            expect(result.recommendation).toBe('increase-yield');
          } else if (ratio <= 2.5) {
            expect(result.recommendation).toBe('optimal');
          } else {
            expect(result.recommendation).toBe('decrease-yield');
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Boundary values are correctly classified
   * 
   * This test verifies that the exact boundary values (1.5 and 2.5) are
   * correctly classified as 'optimal'.
   */
  it('boundary values are correctly classified', () => {
    // Test lower boundary (1.5)
    const result1 = calculateEspressoMetrics({
      dose: 20,
      yield: 30, // ratio = 1.5
      time: 25,
    });
    expect(result1.recommendation).toBe('optimal');
    
    // Test upper boundary (2.5)
    const result2 = calculateEspressoMetrics({
      dose: 20,
      yield: 50, // ratio = 2.5
      time: 25,
    });
    expect(result2.recommendation).toBe('optimal');
    
    // Test just below lower boundary (1.49)
    const result3 = calculateEspressoMetrics({
      dose: 20,
      yield: 29.8, // ratio = 1.49
      time: 25,
    });
    expect(result3.recommendation).toBe('increase-yield');
    
    // Test just above upper boundary (2.51)
    const result4 = calculateEspressoMetrics({
      dose: 20,
      yield: 50.2, // ratio = 2.51
      time: 25,
    });
    expect(result4.recommendation).toBe('decrease-yield');
  });

  /**
   * Property: Recommendation text is always non-empty and meaningful
   * 
   * This test verifies that every recommendation includes actionable text.
   */
  it('recommendation text is always non-empty and meaningful', () => {
    fc.assert(
      fc.property(
        validEspressoMetricsInputsArb,
        (inputs) => {
          const result = calculateEspressoMetrics(inputs);
          
          // Text should not be empty
          expect(result.recommendationText).toBeTruthy();
          expect(result.recommendationText.length).toBeGreaterThan(10);
          
          // Text should match the recommendation type
          const text = result.recommendationText.toLowerCase();
          
          if (result.recommendation === 'increase-yield') {
            // Should mention increasing yield or decreasing dose
            expect(
              text.includes('øke') || text.includes('redusere')
            ).toBe(true);
          } else if (result.recommendation === 'optimal') {
            expect(text.includes('optimale')).toBe(true);
          } else if (result.recommendation === 'decrease-yield') {
            // Should mention decreasing yield or increasing dose
            expect(
              text.includes('redusere') || text.includes('øke')
            ).toBe(true);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Recommendation is independent of time
   * 
   * This test verifies that the recommendation classification depends only on
   * the extraction ratio (dose and yield), not on the extraction time.
   */
  it('recommendation is independent of time', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 5, max: 30, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 10, max: 100, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 10, max: 60, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 10, max: 60, noNaN: true, noDefaultInfinity: true }),
        (dose, yieldAmount, time1, time2) => {
          const result1 = calculateEspressoMetrics({ dose, yield: yieldAmount, time: time1 });
          const result2 = calculateEspressoMetrics({ dose, yield: yieldAmount, time: time2 });
          
          // Recommendation should be the same regardless of time
          expect(result1.recommendation).toBe(result2.recommendation);
          expect(result1.recommendationText).toBe(result2.recommendationText);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: getExtractionRatioRecommendation function consistency
   * 
   * This test verifies that the standalone recommendation function produces
   * the same results as the full calculation function.
   */
  it('getExtractionRatioRecommendation is consistent with calculateEspressoMetrics', () => {
    fc.assert(
      fc.property(
        validEspressoMetricsInputsArb,
        (inputs) => {
          const result = calculateEspressoMetrics(inputs);
          const directRecommendation = getExtractionRatioRecommendation(result.extractionRatio);
          
          expect(result.recommendation).toBe(directRecommendation);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Classification thresholds are precise
   * 
   * This test verifies that the classification changes exactly at the threshold values.
   */
  it('classification changes at exact threshold values', () => {
    // Test values just below, at, and above each threshold
    const testCases = [
      { ratio: 1.49, expected: 'increase-yield' },
      { ratio: 1.5, expected: 'optimal' },
      { ratio: 1.51, expected: 'optimal' },
      { ratio: 2.49, expected: 'optimal' },
      { ratio: 2.5, expected: 'optimal' },
      { ratio: 2.51, expected: 'decrease-yield' },
    ];
    
    testCases.forEach(({ ratio, expected }) => {
      const recommendation = getExtractionRatioRecommendation(ratio);
      expect(recommendation).toBe(expected);
    });
  });
});
