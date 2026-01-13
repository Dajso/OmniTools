/**
 * Property Test: Calculator Computation Correctness (Mortgage)
 * Feature: english-tools-website, Property 2: Calculator Computation Correctness
 * 
 * *For any* calculator and any set of valid inputs, the calculator SHALL produce
 * a numeric result that matches the expected output computed by the documented formula.
 * *For any* set of invalid inputs, the calculator SHALL return an error object
 * with a non-empty message.
 * 
 * **Validates: Requirements 3.1, 3.2, 3.6**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateMortgage,
  calculateMonthlyPrincipalAndInterest,
  generateAmortizationSchedule,
  calculateDownPaymentPercent,
  calculateDownPaymentFromPercent,
  isPMIRequired,
  estimatePMI,
  MortgageCalculationError,
  type MortgageInputs,
} from '@/lib/calculations/finance/mortgage';

/**
 * Arbitrary for generating valid mortgage inputs
 */
const validMortgageInputsArb = fc.record({
  homePrice: fc.double({ min: 10000, max: 10000000, noNaN: true, noDefaultInfinity: true }),
  downPayment: fc.double({ min: 0, max: 1, noNaN: true, noDefaultInfinity: true }), // Will be scaled
  loanTerm: fc.constantFrom(10, 15, 20, 25, 30),
  interestRate: fc.double({ min: 0.1, max: 15, noNaN: true, noDefaultInfinity: true }),
  propertyTax: fc.double({ min: 0, max: 50000, noNaN: true, noDefaultInfinity: true }),
  homeInsurance: fc.double({ min: 0, max: 10000, noNaN: true, noDefaultInfinity: true }),
  pmi: fc.double({ min: 0, max: 500, noNaN: true, noDefaultInfinity: true }),
  hoaFees: fc.double({ min: 0, max: 1000, noNaN: true, noDefaultInfinity: true }),
}).map((inputs) => ({
  ...inputs,
  // Scale down payment to be less than home price (0-95% of home price)
  downPayment: inputs.homePrice * inputs.downPayment * 0.95,
}));

describe('Mortgage Calculator - Property 2: Calculator Computation Correctness', () => {
  /**
   * Property: Monthly P&I matches the standard mortgage formula
   * Formula: M = P × [r(1+r)^n] / [(1+r)^n - 1]
   */
  it('monthly P&I matches standard mortgage formula', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 10000, max: 5000000, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0.1, max: 15, noNaN: true, noDefaultInfinity: true }),
        fc.constantFrom(10, 15, 20, 25, 30),
        (principal, annualRate, termYears) => {
          const result = calculateMonthlyPrincipalAndInterest(principal, annualRate, termYears);
          
          // Verify using the formula directly
          const monthlyRate = annualRate / 100 / 12;
          const numPayments = termYears * 12;
          const factor = Math.pow(1 + monthlyRate, numPayments);
          const expected = principal * (monthlyRate * factor) / (factor - 1);
          
          // Results should match within floating-point tolerance
          expect(result).toBeCloseTo(expected, 2);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });


  /**
   * Property: Zero interest rate results in simple division
   */
  it('zero interest rate results in simple division', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 10000, max: 5000000, noNaN: true, noDefaultInfinity: true }),
        fc.constantFrom(10, 15, 20, 25, 30),
        (principal, termYears) => {
          const result = calculateMonthlyPrincipalAndInterest(principal, 0, termYears);
          const expected = principal / (termYears * 12);
          
          expect(result).toBeCloseTo(expected, 2);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Total P&I payments equal principal plus total interest
   */
  it('total P&I payments equal principal plus total interest', () => {
    fc.assert(
      fc.property(
        validMortgageInputsArb,
        (inputs) => {
          const result = calculateMortgage(inputs);
          
          // Total P&I over loan term
          const totalPI = result.principalAndInterest * inputs.loanTerm * 12;
          
          // Should equal loan amount + total interest
          const expected = result.loanAmount + result.totalInterest;
          
          expect(totalPI).toBeCloseTo(expected, 0);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Amortization schedule sums to loan amount
   */
  it('amortization schedule principal sums to loan amount', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 50000, max: 1000000, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 1, max: 10, noNaN: true, noDefaultInfinity: true }),
        fc.constantFrom(10, 15, 20, 25, 30),
        (principal, annualRate, termYears) => {
          const schedule = generateAmortizationSchedule(principal, annualRate, termYears);
          
          // Sum of all principal payments should equal the loan amount
          const totalPrincipal = schedule.reduce((sum, entry) => sum + entry.principal, 0);
          
          expect(totalPrincipal).toBeCloseTo(principal, 0);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Final balance in amortization schedule is zero
   */
  it('amortization schedule ends with zero balance', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 50000, max: 1000000, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 1, max: 10, noNaN: true, noDefaultInfinity: true }),
        fc.constantFrom(10, 15, 20, 25, 30),
        (principal, annualRate, termYears) => {
          const schedule = generateAmortizationSchedule(principal, annualRate, termYears);
          const finalEntry = schedule[schedule.length - 1];
          
          expect(finalEntry.balance).toBeCloseTo(0, 2);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Monthly payment is always positive for valid inputs
   */
  it('monthly payment is always positive for valid inputs', () => {
    fc.assert(
      fc.property(
        validMortgageInputsArb,
        (inputs) => {
          const result = calculateMortgage(inputs);
          
          expect(result.monthlyPayment).toBeGreaterThan(0);
          expect(result.principalAndInterest).toBeGreaterThan(0);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Loan amount equals home price minus down payment
   */
  it('loan amount equals home price minus down payment', () => {
    fc.assert(
      fc.property(
        validMortgageInputsArb,
        (inputs) => {
          const result = calculateMortgage(inputs);
          const expectedLoanAmount = inputs.homePrice - inputs.downPayment;
          
          expect(result.loanAmount).toBeCloseTo(expectedLoanAmount, 2);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Monthly payment components sum to total monthly payment
   */
  it('monthly payment components sum to total', () => {
    fc.assert(
      fc.property(
        validMortgageInputsArb,
        (inputs) => {
          const result = calculateMortgage(inputs);
          
          const componentSum = 
            result.principalAndInterest +
            result.monthlyTax +
            result.monthlyInsurance +
            result.monthlyPMI +
            result.monthlyHOA;
          
          expect(result.monthlyPayment).toBeCloseTo(componentSum, 2);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });


  /**
   * Property: Down payment percentage calculation is correct
   */
  it('down payment percentage calculation is correct', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 100000, max: 5000000, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true }),
        (homePrice, percent) => {
          const downPayment = calculateDownPaymentFromPercent(homePrice, percent);
          const calculatedPercent = calculateDownPaymentPercent(homePrice, downPayment);
          
          expect(calculatedPercent).toBeCloseTo(percent, 4);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: PMI is required when down payment < 20%
   */
  it('PMI is required when down payment is less than 20%', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 19.99, noNaN: true, noDefaultInfinity: true }),
        (percent) => {
          expect(isPMIRequired(percent)).toBe(true);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: PMI is not required when down payment >= 20%
   */
  it('PMI is not required when down payment is 20% or more', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 20, max: 100, noNaN: true, noDefaultInfinity: true }),
        (percent) => {
          expect(isPMIRequired(percent)).toBe(false);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Estimated PMI is proportional to loan amount
   */
  it('estimated PMI is proportional to loan amount', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 50000, max: 1000000, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0.3, max: 1.5, noNaN: true, noDefaultInfinity: true }),
        (loanAmount, pmiRate) => {
          const pmi = estimatePMI(loanAmount, pmiRate);
          const expected = (loanAmount * (pmiRate / 100)) / 12;
          
          expect(pmi).toBeCloseTo(expected, 2);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Invalid inputs throw MortgageCalculationError
   */
  describe('invalid inputs throw errors', () => {
    it('negative home price throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -1000000, max: -1, noNaN: true, noDefaultInfinity: true }),
          (homePrice) => {
            expect(() => calculateMortgage({
              homePrice,
              downPayment: 0,
              loanTerm: 30,
              interestRate: 6,
              propertyTax: 0,
              homeInsurance: 0,
              pmi: 0,
              hoaFees: 0,
            })).toThrow(MortgageCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('down payment >= home price throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 100000, max: 1000000, noNaN: true, noDefaultInfinity: true }),
          (homePrice) => {
            expect(() => calculateMortgage({
              homePrice,
              downPayment: homePrice, // Equal to home price
              loanTerm: 30,
              interestRate: 6,
              propertyTax: 0,
              homeInsurance: 0,
              pmi: 0,
              hoaFees: 0,
            })).toThrow(MortgageCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('negative interest rate throws error', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -100, max: -0.01, noNaN: true, noDefaultInfinity: true }),
          (interestRate) => {
            expect(() => calculateMonthlyPrincipalAndInterest(
              200000,
              interestRate,
              30
            )).toThrow(MortgageCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('zero or negative loan term throws error', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: -100, max: 0 }),
          (termYears) => {
            expect(() => calculateMonthlyPrincipalAndInterest(
              200000,
              6,
              termYears
            )).toThrow(MortgageCalculationError);
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * Property: Higher interest rate results in higher monthly payment
   */
  it('higher interest rate results in higher monthly payment', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 100000, max: 1000000, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 1, max: 10, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 0.5, max: 5, noNaN: true, noDefaultInfinity: true }),
        fc.constantFrom(15, 30),
        (principal, baseRate, rateIncrease, termYears) => {
          const lowerPayment = calculateMonthlyPrincipalAndInterest(principal, baseRate, termYears);
          const higherPayment = calculateMonthlyPrincipalAndInterest(principal, baseRate + rateIncrease, termYears);
          
          expect(higherPayment).toBeGreaterThan(lowerPayment);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Shorter loan term results in higher monthly payment but lower total interest
   */
  it('shorter loan term results in higher monthly payment but lower total interest', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 100000, max: 500000, noNaN: true, noDefaultInfinity: true }),
        fc.double({ min: 3, max: 8, noNaN: true, noDefaultInfinity: true }),
        (principal, rate) => {
          const payment15 = calculateMonthlyPrincipalAndInterest(principal, rate, 15);
          const payment30 = calculateMonthlyPrincipalAndInterest(principal, rate, 30);
          
          // 15-year has higher monthly payment
          expect(payment15).toBeGreaterThan(payment30);
          
          // But lower total interest
          const totalInterest15 = (payment15 * 15 * 12) - principal;
          const totalInterest30 = (payment30 * 30 * 12) - principal;
          
          expect(totalInterest15).toBeLessThan(totalInterest30);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
