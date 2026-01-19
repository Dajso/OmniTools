/**
 * Property-Based Tests for Betting Calculations
 * 
 * Feature: expanded-tools-categories
 * @see Requirements 27.1, 27.5, 27.9, 27.10
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  americanToDecimal,
  decimalToAmerican,
  decimalToFractional,
  fractionalToDecimal,
  convertOdds,
} from '@/lib/calculations/betting/odds-converter';
import { calculateParlay, ParlayLeg } from '@/lib/calculations/betting/parlay-calculator';

describe('Betting Calculations Properties', () => {
  /**
   * Property 17: Odds Conversion Round-Trip
   * 
   * For any odds value in American, Decimal, or Fractional format,
   * converting through all three formats and back SHALL produce
   * the original value within 0.01% tolerance.
   * 
   * **Validates: Requirements 27.9**
   */
  describe('Property 17: Odds Conversion Round-Trip', () => {
    // Feature: expanded-tools-categories, Property 17: Odds Conversion Round-Trip
    // Validates: Requirements 27.9
    it('American to Decimal and back should preserve value within tolerance', () => {
      fc.assert(
        fc.property(
          // Generate American odds: positive (101 to 1000) or negative (-1000 to -101)
          // Note: We exclude +100 and -100 because they both map to decimal 2.0 (even money)
          // and the round-trip is mathematically ambiguous at this boundary
          fc.oneof(
            fc.integer({ min: 101, max: 1000 }),
            fc.integer({ min: -1000, max: -101 })
          ),
          (americanOdds) => {
            const decimal = americanToDecimal(americanOdds);
            const backToAmerican = decimalToAmerican(decimal);
            
            // Allow 0.01% tolerance for floating point
            const tolerance = Math.abs(americanOdds) * 0.0001;
            return Math.abs(backToAmerican - americanOdds) <= Math.max(tolerance, 0.01);
          }
        ),
        { numRuns: 100 }
      );
    });

    // Test the edge case: +100 and -100 both represent even money (decimal 2.0)
    it('should handle even money edge case (+100 and -100 both equal decimal 2.0)', () => {
      // Both +100 and -100 American odds represent even money (decimal 2.0)
      expect(americanToDecimal(100)).toBeCloseTo(2.0, 5);
      expect(americanToDecimal(-100)).toBeCloseTo(2.0, 5);
      
      // Converting decimal 2.0 back to American gives +100 (by convention)
      expect(decimalToAmerican(2.0)).toBeCloseTo(100, 1);
    });

    // Feature: expanded-tools-categories, Property 17: Odds Conversion Round-Trip
    // Validates: Requirements 27.9
    it('Decimal odds round-trip through American should preserve value', () => {
      fc.assert(
        fc.property(
          // Generate decimal odds between 1.01 and 100
          fc.double({ min: 1.01, max: 100, noNaN: true }),
          (decimalOdds) => {
            const american = decimalToAmerican(decimalOdds);
            const backToDecimal = americanToDecimal(american);
            
            // Allow 0.01% tolerance
            const tolerance = decimalOdds * 0.0001;
            return Math.abs(backToDecimal - decimalOdds) <= Math.max(tolerance, 0.001);
          }
        ),
        { numRuns: 100 }
      );
    });

    // Test with known values
    it('should correctly convert known American odds values', () => {
      // +150 American = 2.5 Decimal = 3/2 Fractional
      expect(americanToDecimal(150)).toBeCloseTo(2.5, 5);
      
      // -200 American = 1.5 Decimal = 1/2 Fractional
      expect(americanToDecimal(-200)).toBeCloseTo(1.5, 5);
      
      // +100 American = 2.0 Decimal = 1/1 Fractional (Even money)
      expect(americanToDecimal(100)).toBeCloseTo(2.0, 5);
      
      // -100 American = 2.0 Decimal = 1/1 Fractional (Even money)
      expect(americanToDecimal(-100)).toBeCloseTo(2.0, 5);
    });

    it('should correctly convert known Decimal odds values', () => {
      // 2.5 Decimal = +150 American
      expect(decimalToAmerican(2.5)).toBeCloseTo(150, 1);
      
      // 1.5 Decimal = -200 American
      expect(decimalToAmerican(1.5)).toBeCloseTo(-200, 1);
      
      // 2.0 Decimal = +100 American (Even money)
      expect(decimalToAmerican(2.0)).toBeCloseTo(100, 1);
    });
  });

  /**
   * Property 18: Parlay Odds Multiplication
   * 
   * For any set of individual bet odds, the parlay odds SHALL equal
   * the product of all individual decimal odds.
   * 
   * **Validates: Requirements 27.10**
   */
  describe('Property 18: Parlay Odds Multiplication', () => {
    // Feature: expanded-tools-categories, Property 18: Parlay Odds Multiplication
    // Validates: Requirements 27.10
    it('parlay combined odds should equal product of individual decimal odds', () => {
      fc.assert(
        fc.property(
          // Generate 2-6 legs with decimal odds between 1.1 and 10
          fc.array(
            fc.double({ min: 1.1, max: 10, noNaN: true }),
            { minLength: 2, maxLength: 6 }
          ),
          fc.double({ min: 1, max: 1000, noNaN: true }), // stake
          (decimalOddsArray, stake) => {
            const legs: ParlayLeg[] = decimalOddsArray.map((odds, i) => ({
              name: `Leg ${i + 1}`,
              odds,
              format: 'decimal' as const,
            }));
            
            const result = calculateParlay(legs, stake);
            
            // Calculate expected combined odds manually
            const expectedCombinedOdds = decimalOddsArray.reduce((acc, odds) => acc * odds, 1);
            
            // Allow small tolerance for floating point
            const tolerance = expectedCombinedOdds * 0.0001;
            return Math.abs(result.combinedDecimalOdds - expectedCombinedOdds) <= tolerance;
          }
        ),
        { numRuns: 100 }
      );
    });

    // Feature: expanded-tools-categories, Property 18: Parlay Odds Multiplication
    // Validates: Requirements 27.10
    it('parlay payout should equal stake times combined odds', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.double({ min: 1.1, max: 5, noNaN: true }),
            { minLength: 2, maxLength: 4 }
          ),
          fc.double({ min: 1, max: 100, noNaN: true }),
          (decimalOddsArray, stake) => {
            const legs: ParlayLeg[] = decimalOddsArray.map((odds, i) => ({
              name: `Leg ${i + 1}`,
              odds,
              format: 'decimal' as const,
            }));
            
            const result = calculateParlay(legs, stake);
            
            // Payout should equal stake * combined odds
            const expectedPayout = stake * result.combinedDecimalOdds;
            const tolerance = expectedPayout * 0.0001;
            
            return Math.abs(result.potentialPayout - expectedPayout) <= tolerance;
          }
        ),
        { numRuns: 100 }
      );
    });

    // Test with known values
    it('should correctly calculate parlay with known odds', () => {
      // Two legs at 2.0 decimal each = 4.0 combined
      const legs: ParlayLeg[] = [
        { name: 'Leg 1', odds: 2.0, format: 'decimal' },
        { name: 'Leg 2', odds: 2.0, format: 'decimal' },
      ];
      
      const result = calculateParlay(legs, 100);
      
      expect(result.combinedDecimalOdds).toBeCloseTo(4.0, 5);
      expect(result.potentialPayout).toBeCloseTo(400, 2);
      expect(result.potentialProfit).toBeCloseTo(300, 2);
    });

    it('should correctly calculate 3-leg parlay', () => {
      // Three legs: 1.5, 2.0, 2.5 = 7.5 combined
      const legs: ParlayLeg[] = [
        { name: 'Leg 1', odds: 1.5, format: 'decimal' },
        { name: 'Leg 2', odds: 2.0, format: 'decimal' },
        { name: 'Leg 3', odds: 2.5, format: 'decimal' },
      ];
      
      const result = calculateParlay(legs, 10);
      
      expect(result.combinedDecimalOdds).toBeCloseTo(7.5, 5);
      expect(result.potentialPayout).toBeCloseTo(75, 2);
      expect(result.potentialProfit).toBeCloseTo(65, 2);
    });

    it('should handle American odds in parlay', () => {
      // +100 American = 2.0 Decimal
      // -200 American = 1.5 Decimal
      // Combined = 3.0
      const legs: ParlayLeg[] = [
        { name: 'Leg 1', odds: 100, format: 'american' },
        { name: 'Leg 2', odds: -200, format: 'american' },
      ];
      
      const result = calculateParlay(legs, 100);
      
      expect(result.combinedDecimalOdds).toBeCloseTo(3.0, 5);
      expect(result.potentialPayout).toBeCloseTo(300, 2);
    });
  });
});
