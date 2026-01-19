/**
 * Property Tests: Academic Calculations
 * Feature: expanded-tools-categories
 * 
 * Tests for GPA Calculator, Final Grade Calculator, and Fraction Calculator
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateGPA,
  AVAILABLE_GRADES,
  MAX_UNWEIGHTED_GPA,
  MAX_WEIGHTED_GPA,
  type Course,
} from '@/lib/calculations/academic/gpa-calculator';

/**
 * Arbitrary for generating valid course data
 */
const validCourseArb = fc.record({
  name: fc.string({ minLength: 1, maxLength: 50 }),
  credits: fc.integer({ min: 1, max: 6 }),
  grade: fc.constantFrom(...AVAILABLE_GRADES),
  isHonors: fc.boolean(),
  isAP: fc.boolean(),
}).map((course) => ({
  ...course,
  // AP takes precedence over Honors (can't be both)
  isHonors: course.isAP ? false : course.isHonors,
}));

/**
 * Arbitrary for generating a list of valid courses
 */
const validCoursesArb = fc.array(validCourseArb, { minLength: 1, maxLength: 20 });

describe('GPA Calculator - Property 1: GPA Calculation Correctness', () => {
  /**
   * Property 1: GPA Calculation Correctness
   * Feature: expanded-tools-categories, Property 1: GPA Calculation Correctness
   * 
   * *For any* set of courses with valid grades (A-F) and positive credit hours,
   * the GPA calculator SHALL compute the weighted sum of grade points divided by
   * total credits, producing a value between 0.0 and 4.0 (unweighted) or 5.0 (weighted).
   * 
   * **Validates: Requirements 15.9**
   */
  it('should produce unweighted GPA between 0 and 4.0 for valid courses', () => {
    fc.assert(
      fc.property(validCoursesArb, (courses) => {
        const result = calculateGPA(courses);
        
        expect(result.unweightedGPA).toBeGreaterThanOrEqual(0);
        expect(result.unweightedGPA).toBeLessThanOrEqual(MAX_UNWEIGHTED_GPA);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Weighted GPA is between 0 and 5.0
   * **Validates: Requirements 15.9**
   */
  it('should produce weighted GPA between 0 and 5.0 for valid courses', () => {
    fc.assert(
      fc.property(validCoursesArb, (courses) => {
        const result = calculateGPA(courses);
        
        expect(result.weightedGPA).toBeGreaterThanOrEqual(0);
        expect(result.weightedGPA).toBeLessThanOrEqual(MAX_WEIGHTED_GPA);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: GPA equals weighted sum of grade points divided by total credits
   * Formula: GPA = Σ(gradePoints × credits) / Σ(credits)
   * **Validates: Requirements 15.9**
   */
  it('should compute GPA as weighted sum of grade points divided by total credits', () => {
    const GRADE_POINTS: Record<string, number> = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0.0,
    };

    fc.assert(
      fc.property(validCoursesArb, (courses) => {
        const result = calculateGPA(courses);
        
        // Manually compute expected unweighted GPA
        let totalCredits = 0;
        let totalPoints = 0;
        
        for (const course of courses) {
          totalCredits += course.credits;
          totalPoints += GRADE_POINTS[course.grade] * course.credits;
        }
        
        const expectedGPA = Math.round((totalPoints / totalCredits) * 100) / 100;
        
        // Should match exactly since both use the same rounding
        expect(result.unweightedGPA).toBe(expectedGPA);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Weighted GPA >= Unweighted GPA
   * Because honors/AP bonuses only add points, never subtract
   * **Validates: Requirements 15.9**
   */
  it('weighted GPA should be greater than or equal to unweighted GPA', () => {
    fc.assert(
      fc.property(validCoursesArb, (courses) => {
        const result = calculateGPA(courses);
        
        expect(result.weightedGPA).toBeGreaterThanOrEqual(result.unweightedGPA);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Total credits equals sum of all course credits
   * **Validates: Requirements 15.9**
   */
  it('total credits should equal sum of all course credits', () => {
    fc.assert(
      fc.property(validCoursesArb, (courses) => {
        const result = calculateGPA(courses);
        const expectedCredits = courses.reduce((sum, c) => sum + c.credits, 0);
        
        expect(result.totalCredits).toBe(expectedCredits);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Grade distribution counts match actual grades
   * **Validates: Requirements 15.9**
   */
  it('grade distribution should accurately count grades', () => {
    fc.assert(
      fc.property(validCoursesArb, (courses) => {
        const result = calculateGPA(courses);
        
        // Count grades manually
        const expectedDistribution: Record<string, number> = {};
        for (const course of courses) {
          expectedDistribution[course.grade] = (expectedDistribution[course.grade] || 0) + 1;
        }
        
        expect(result.gradeDistribution).toEqual(expectedDistribution);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: All A grades should produce 4.0 unweighted GPA
   * **Validates: Requirements 15.9**
   */
  it('all A grades should produce 4.0 unweighted GPA', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 20 }),
            credits: fc.integer({ min: 1, max: 6 }),
            grade: fc.constantFrom('A+', 'A'),
            isHonors: fc.boolean(),
            isAP: fc.boolean(),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (courses) => {
          const result = calculateGPA(courses);
          
          expect(result.unweightedGPA).toBe(4.0);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: All F grades should produce 0.0 GPA
   * **Validates: Requirements 15.9**
   */
  it('all F grades should produce 0.0 unweighted GPA', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 20 }),
            credits: fc.integer({ min: 1, max: 6 }),
            grade: fc.constant('F'),
            isHonors: fc.boolean(),
            isAP: fc.boolean(),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (courses) => {
          const result = calculateGPA(courses);
          
          expect(result.unweightedGPA).toBe(0.0);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Empty course list returns zero GPA
   */
  it('empty course list should return zero GPA', () => {
    const result = calculateGPA([]);
    
    expect(result.unweightedGPA).toBe(0);
    expect(result.weightedGPA).toBe(0);
    expect(result.totalCredits).toBe(0);
    expect(result.gradeDistribution).toEqual({});
  });
});


import {
  calculateRequiredFinalScore,
  computeFinalGrade,
  type FinalGradeInput,
} from '@/lib/calculations/academic/final-grade-calculator';

describe('Final Grade Calculator - Property 2: Final Grade Calculator Inverse', () => {
  /**
   * Property 2: Final Grade Calculator Inverse
   * Feature: expanded-tools-categories, Property 2: Final Grade Calculator Inverse
   * 
   * *For any* current grade (0-100), target grade (0-100), and final exam weight (0-1),
   * if the required final score is achievable (0-100), then applying that score with
   * the given weight SHALL produce exactly the target grade.
   * 
   * **Validates: Requirements 15.10**
   */
  it('applying required score should produce target grade (inverse property)', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0.01, max: 1, noNaN: true, noDefaultInfinity: true }),
        (currentGrade, targetGrade, finalWeight) => {
          const result = calculateRequiredFinalScore({
            currentGrade,
            targetGrade,
            finalWeight,
          });

          // Only test the inverse property when the score is achievable
          if (result.isAchievable && result.requiredScore >= 0 && result.requiredScore <= 100) {
            const actualFinalGrade = computeFinalGrade(
              currentGrade,
              result.requiredScore,
              finalWeight
            );

            // The computed final grade should equal the target grade
            expect(actualFinalGrade).toBeCloseTo(targetGrade, 1);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Required score formula is correct
   * Formula: required = (target - current * (1 - finalWeight)) / finalWeight
   * **Validates: Requirements 15.10**
   */
  it('required score should match the formula', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0.01, max: 1, noNaN: true, noDefaultInfinity: true }),
        (currentGrade, targetGrade, finalWeight) => {
          const result = calculateRequiredFinalScore({
            currentGrade,
            targetGrade,
            finalWeight,
          });

          // Manually compute expected required score
          const currentWeight = 1 - finalWeight;
          const expectedRequired = (targetGrade - currentGrade * currentWeight) / finalWeight;
          const roundedExpected = Math.round(expectedRequired * 100) / 100;

          expect(result.requiredScore).toBe(roundedExpected);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Current weight + final weight = 1
   * **Validates: Requirements 15.10**
   */
  it('current weight plus final weight should equal 1', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0.01, max: 1, noNaN: true, noDefaultInfinity: true }),
        (currentGrade, targetGrade, finalWeight) => {
          const result = calculateRequiredFinalScore({
            currentGrade,
            targetGrade,
            finalWeight,
          });

          expect(result.currentWeight + finalWeight).toBeCloseTo(1, 10);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: If current grade >= target, required score should be <= target
   * **Validates: Requirements 15.10**
   */
  it('if current grade >= target, required score should be achievable or negative', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 50, max: 100, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0.01, max: 1, noNaN: true, noDefaultInfinity: true }),
        (currentGrade, finalWeight) => {
          // Target is less than or equal to current
          const targetGrade = currentGrade * 0.9; // 90% of current

          const result = calculateRequiredFinalScore({
            currentGrade,
            targetGrade,
            finalWeight,
          });

          // Required score should be achievable (or even negative, meaning already secured)
          expect(result.requiredScore).toBeLessThanOrEqual(currentGrade);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: isAchievable is true iff required score is between 0 and 100
   * **Validates: Requirements 15.10**
   */
  it('isAchievable should be true iff required score is between 0 and 100', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0.01, max: 1, noNaN: true, noDefaultInfinity: true }),
        (currentGrade, targetGrade, finalWeight) => {
          const result = calculateRequiredFinalScore({
            currentGrade,
            targetGrade,
            finalWeight,
          });

          const expectedAchievable = result.requiredScore >= 0 && result.requiredScore <= 100;
          expect(result.isAchievable).toBe(expectedAchievable);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});


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
