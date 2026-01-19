/**
 * Property Tests: Construction Calculations
 * Feature: expanded-tools-categories
 * 
 * Tests universal properties for construction calculation functions.
 * 
 * @module tests/property/construction-calculations
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateBalusterSpacing,
  calculateGap,
  calculateMinimumBalusters,
  MAX_BALUSTER_GAP_INCHES,
  BalusterInput,
  BalusterUnit,
} from '@/lib/calculations/construction/baluster-calculator';

describe('Construction Calculations - Property Tests', () => {
  describe('Property 22: Baluster Spacing Code Compliance', () => {
    /**
     * Property 22: Baluster Spacing Code Compliance
     * 
     * *For any* calculated baluster spacing, the gap between balusters SHALL not
     * exceed 4 inches (building code requirement).
     * 
     * Formula: gap = (totalWidth - numBalusters * balusterWidth) / (numBalusters + 1)
     * Constraint: gap ≤ 4 inches
     * 
     * **Validates: Requirements 32.7**
     */

    // Feature: expanded-tools-categories, Property 22: Baluster Spacing Code Compliance
    // Validates: Requirements 32.7

    it('calculated spacing is always ≤ 4 inches when isCodeCompliant is true', () => {
      fc.assert(
        fc.property(
          // totalWidth: 6-120 inches (realistic railing spans)
          fc.double({ min: 6, max: 120, noNaN: true, noDefaultInfinity: true }),
          // balusterWidth: 0.5-2 inches (common baluster sizes)
          fc.double({ min: 0.5, max: 2, noNaN: true, noDefaultInfinity: true }),
          (totalWidth, balusterWidth) => {
            // Skip invalid cases where baluster width >= total width
            if (balusterWidth >= totalWidth) {
              return true;
            }

            const result = calculateBalusterSpacing({
              totalWidth,
              balusterWidth,
              unit: 'inches',
            });

            // When isCodeCompliant is true, spacing must be ≤ 4 inches
            if (result.isCodeCompliant) {
              expect(result.spacing).toBeLessThanOrEqual(MAX_BALUSTER_GAP_INCHES);
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('gap formula is correctly applied: gap = (totalWidth - numBalusters * balusterWidth) / (numBalusters + 1)', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 6, max: 120, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0.5, max: 2, noNaN: true, noDefaultInfinity: true }),
          (totalWidth, balusterWidth) => {
            // Skip invalid cases
            if (balusterWidth >= totalWidth) {
              return true;
            }

            const result = calculateBalusterSpacing({
              totalWidth,
              balusterWidth,
              unit: 'inches',
            });

            // Verify the gap formula
            const expectedGap = (totalWidth - result.numberOfBalusters * balusterWidth) / (result.numberOfBalusters + 1);
            
            expect(result.spacing).toBeCloseTo(expectedGap, 10);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('calculateGap function matches the formula directly', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 6, max: 120, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0.5, max: 2, noNaN: true, noDefaultInfinity: true }),
          fc.integer({ min: 1, max: 50 }),
          (totalWidth, balusterWidth, numBalusters) => {
            // Skip invalid cases
            if (balusterWidth >= totalWidth) {
              return true;
            }
            if (numBalusters * balusterWidth >= totalWidth) {
              return true;
            }

            const gap = calculateGap(totalWidth, balusterWidth, numBalusters);
            
            // Verify formula: gap = (totalWidth - numBalusters * balusterWidth) / (numBalusters + 1)
            const expectedGap = (totalWidth - numBalusters * balusterWidth) / (numBalusters + 1);
            
            expect(gap).toBeCloseTo(expectedGap, 10);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('minimum balusters calculation ensures code compliance', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 6, max: 120, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0.5, max: 2, noNaN: true, noDefaultInfinity: true }),
          (totalWidth, balusterWidth) => {
            // Skip invalid cases
            if (balusterWidth >= totalWidth) {
              return true;
            }

            const minBalusters = calculateMinimumBalusters(
              totalWidth,
              balusterWidth,
              MAX_BALUSTER_GAP_INCHES
            );

            // With minimum balusters, gap should be ≤ 4 inches
            if (minBalusters > 0) {
              const gap = calculateGap(totalWidth, balusterWidth, minBalusters);
              expect(gap).toBeLessThanOrEqual(MAX_BALUSTER_GAP_INCHES + 0.0001); // Small tolerance for floating point
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('one fewer baluster than minimum would violate code', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 12, max: 120, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0.5, max: 2, noNaN: true, noDefaultInfinity: true }),
          (totalWidth, balusterWidth) => {
            // Skip invalid cases
            if (balusterWidth >= totalWidth) {
              return true;
            }

            const minBalusters = calculateMinimumBalusters(
              totalWidth,
              balusterWidth,
              MAX_BALUSTER_GAP_INCHES
            );

            // With one fewer baluster, gap should exceed 4 inches (or be at boundary)
            if (minBalusters > 1) {
              const gapWithFewer = calculateGap(totalWidth, balusterWidth, minBalusters - 1);
              // Gap should be > 4 inches (or very close to it at boundary)
              expect(gapWithFewer).toBeGreaterThanOrEqual(MAX_BALUSTER_GAP_INCHES - 0.0001);
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('spacing is always positive for valid inputs', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 6, max: 120, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0.5, max: 2, noNaN: true, noDefaultInfinity: true }),
          (totalWidth, balusterWidth) => {
            // Skip invalid cases
            if (balusterWidth >= totalWidth) {
              return true;
            }

            const result = calculateBalusterSpacing({
              totalWidth,
              balusterWidth,
              unit: 'inches',
            });

            // Spacing must be positive
            expect(result.spacing).toBeGreaterThan(0);
            expect(result.numberOfBalusters).toBeGreaterThanOrEqual(0);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('total layout width equals input total width', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 6, max: 120, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0.5, max: 2, noNaN: true, noDefaultInfinity: true }),
          (totalWidth, balusterWidth) => {
            // Skip invalid cases
            if (balusterWidth >= totalWidth) {
              return true;
            }

            const result = calculateBalusterSpacing({
              totalWidth,
              balusterWidth,
              unit: 'inches',
            });

            // Total baluster width + total gap width should equal total width
            const calculatedTotal = result.layout.totalBalusterWidth + result.layout.totalGapWidth;
            
            expect(calculatedTotal).toBeCloseTo(totalWidth, 10);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('unit conversion preserves code compliance', () => {
      const units: BalusterUnit[] = ['inches', 'mm', 'cm'];
      
      fc.assert(
        fc.property(
          fc.double({ min: 6, max: 120, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0.5, max: 2, noNaN: true, noDefaultInfinity: true }),
          fc.constantFrom(...units),
          (totalWidthInches, balusterWidthInches, unit) => {
            // Skip invalid cases
            if (balusterWidthInches >= totalWidthInches) {
              return true;
            }

            // Convert to target unit
            let totalWidth = totalWidthInches;
            let balusterWidth = balusterWidthInches;
            
            if (unit === 'mm') {
              totalWidth = totalWidthInches * 25.4;
              balusterWidth = balusterWidthInches * 25.4;
            } else if (unit === 'cm') {
              totalWidth = totalWidthInches * 2.54;
              balusterWidth = balusterWidthInches * 2.54;
            }

            const result = calculateBalusterSpacing({
              totalWidth,
              balusterWidth,
              unit,
            });

            // Code compliance should be consistent regardless of unit
            // When compliant, spacing in inches should be ≤ 4
            if (result.isCodeCompliant) {
              let spacingInInches = result.spacing;
              if (unit === 'mm') {
                spacingInInches = result.spacing / 25.4;
              } else if (unit === 'cm') {
                spacingInInches = result.spacing / 2.54;
              }
              
              expect(spacingInInches).toBeLessThanOrEqual(MAX_BALUSTER_GAP_INCHES + 0.0001);
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('center-to-center equals spacing plus baluster width', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 6, max: 120, noNaN: true, noDefaultInfinity: true }),
          fc.double({ min: 0.5, max: 2, noNaN: true, noDefaultInfinity: true }),
          (totalWidth, balusterWidth) => {
            // Skip invalid cases
            if (balusterWidth >= totalWidth) {
              return true;
            }

            const result = calculateBalusterSpacing({
              totalWidth,
              balusterWidth,
              unit: 'inches',
            });

            // Center-to-center = spacing (gap) + baluster width
            expect(result.centerToCenter).toBeCloseTo(result.spacing + balusterWidth, 10);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
