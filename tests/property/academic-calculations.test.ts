/**
 * Property Tests: Academic Calculations
 * Feature: expanded-tools-categories
 *
 * Tests for Fraction Calculator
 * (GPA- og sluttkarakterkalkulatorene er fjernet: amerikansk karaktersystem.)
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

import {
  gcd,
  simplifyFraction,
  addFractions,
  subtractFractions,
  multiplyFractions,
  divideFractions,
  fractionToDecimal,
  fractionsEqual,
  type Fraction,
} from '@/lib/calculations/academic/fraction-calculator';

/**
 * Arbitrary for generating valid fractions (non-zero denominator)
 */
const validFractionArb = fc.record({
  numerator: fc.integer({ min: -1000, max: 1000 }),
  denominator: fc.integer({ min: 1, max: 1000 }),
});

/**
 * Arbitrary for generating non-zero fractions (for division)
 */
const nonZeroFractionArb = fc.record({
  numerator: fc.integer({ min: 1, max: 1000 }).chain((n) =>
    fc.constantFrom(n, -n)
  ),
  denominator: fc.integer({ min: 1, max: 1000 }),
});

describe('Fraction Calculator - Property 3: Fraction Simplification Invariant', () => {
  /**
   * Property 3: Fraction Simplification Invariant
   * Feature: expanded-tools-categories, Property 3: Fraction Simplification Invariant
   * 
   * *For any* fraction operation result, the numerator and denominator SHALL be
   * coprime (GCD = 1), and the denominator SHALL be positive.
   * 
   * **Validates: Requirements 15.11**
   */
  it('simplified fractions should have coprime numerator and denominator', () => {
    fc.assert(
      fc.property(validFractionArb, (f) => {
        const simplified = simplifyFraction(f);
        
        // GCD of |numerator| and denominator should be 1
        const g = gcd(Math.abs(simplified.numerator), simplified.denominator);
        expect(g).toBe(1);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Simplified fractions should have positive denominator
   * **Validates: Requirements 15.11**
   */
  it('simplified fractions should have positive denominator', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -1000, max: 1000 }),
        fc.integer({ min: -1000, max: 1000 }).filter((d) => d !== 0),
        (num, den) => {
          const simplified = simplifyFraction({ numerator: num, denominator: den });
          
          expect(simplified.denominator).toBeGreaterThan(0);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Simplification preserves value
   * **Validates: Requirements 15.11**
   */
  it('simplification should preserve the fraction value', () => {
    fc.assert(
      fc.property(validFractionArb, (f) => {
        const simplified = simplifyFraction(f);
        
        const originalValue = f.numerator / f.denominator;
        const simplifiedValue = simplified.numerator / simplified.denominator;
        
        expect(simplifiedValue).toBeCloseTo(originalValue, 10);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Simplification is idempotent
   * simplify(simplify(f)) === simplify(f)
   * **Validates: Requirements 15.11**
   */
  it('simplification should be idempotent', () => {
    fc.assert(
      fc.property(validFractionArb, (f) => {
        const once = simplifyFraction(f);
        const twice = simplifyFraction(once);
        
        expect(twice.numerator).toBe(once.numerator);
        expect(twice.denominator).toBe(once.denominator);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Addition results are simplified
   * **Validates: Requirements 15.11**
   */
  it('addition results should be simplified', () => {
    fc.assert(
      fc.property(validFractionArb, validFractionArb, (a, b) => {
        const result = addFractions(a, b);
        
        // Result should be in simplified form
        const g = gcd(Math.abs(result.numerator), result.denominator);
        expect(g).toBe(1);
        expect(result.denominator).toBeGreaterThan(0);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Subtraction results are simplified
   * **Validates: Requirements 15.11**
   */
  it('subtraction results should be simplified', () => {
    fc.assert(
      fc.property(validFractionArb, validFractionArb, (a, b) => {
        const result = subtractFractions(a, b);
        
        const g = gcd(Math.abs(result.numerator), result.denominator);
        expect(g).toBe(1);
        expect(result.denominator).toBeGreaterThan(0);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Multiplication results are simplified
   * **Validates: Requirements 15.11**
   */
  it('multiplication results should be simplified', () => {
    fc.assert(
      fc.property(validFractionArb, validFractionArb, (a, b) => {
        const result = multiplyFractions(a, b);
        
        const g = gcd(Math.abs(result.numerator), result.denominator);
        expect(g).toBe(1);
        expect(result.denominator).toBeGreaterThan(0);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Division results are simplified
   * **Validates: Requirements 15.11**
   */
  it('division results should be simplified', () => {
    fc.assert(
      fc.property(validFractionArb, nonZeroFractionArb, (a, b) => {
        const result = divideFractions(a, b);
        
        const g = gcd(Math.abs(result.numerator), result.denominator);
        expect(g).toBe(1);
        expect(result.denominator).toBeGreaterThan(0);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Addition is commutative
   * a + b = b + a
   */
  it('addition should be commutative', () => {
    fc.assert(
      fc.property(validFractionArb, validFractionArb, (a, b) => {
        const ab = addFractions(a, b);
        const ba = addFractions(b, a);
        
        expect(fractionsEqual(ab, ba)).toBe(true);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Multiplication is commutative
   * a * b = b * a
   */
  it('multiplication should be commutative', () => {
    fc.assert(
      fc.property(validFractionArb, validFractionArb, (a, b) => {
        const ab = multiplyFractions(a, b);
        const ba = multiplyFractions(b, a);
        
        expect(fractionsEqual(ab, ba)).toBe(true);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: a - a = 0
   */
  it('subtracting a fraction from itself should give zero', () => {
    fc.assert(
      fc.property(validFractionArb, (a) => {
        const result = subtractFractions(a, a);
        
        expect(result.numerator).toBe(0);
        expect(result.denominator).toBe(1);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: a / a = 1 (for non-zero a)
   */
  it('dividing a non-zero fraction by itself should give one', () => {
    fc.assert(
      fc.property(nonZeroFractionArb, (a) => {
        const result = divideFractions(a, a);
        
        expect(result.numerator).toBe(1);
        expect(result.denominator).toBe(1);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Fraction to decimal and back preserves value
   */
  it('fraction to decimal should preserve value', () => {
    fc.assert(
      fc.property(validFractionArb, (f) => {
        const decimal = fractionToDecimal(f);
        const expected = f.numerator / f.denominator;
        
        expect(decimal).toBeCloseTo(expected, 10);
        return true;
      }),
      { numRuns: 100 }
    );
  });
});
