/**
 * Refinance Calculator
 * 
 * @module lib/calculations/finance/refinance-calculator
 * @see Requirements 5.17
 */

export interface RefinanceInputs {
  currentBalance: number;
  currentRate: number;
  currentMonthlyPayment: number;
  remainingMonths: number;
  newRate: number;
  newTermMonths: number;
  closingCosts: number;
}

export interface RefinanceResults {
  newMonthlyPayment: number;
  monthlySavings: number;
  totalCurrentCost: number;
  totalNewCost: number;
  totalSavings: number;
  breakEvenMonths: number;
  shouldRefinance: boolean;
}

export function calculateRefinance(inputs: RefinanceInputs): RefinanceResults {
  const {
    currentBalance,
    currentRate,
    currentMonthlyPayment,
    remainingMonths,
    newRate,
    newTermMonths,
    closingCosts,
  } = inputs;

  if (currentBalance <= 0) throw new Error('Current balance must be positive');
  if (newTermMonths <= 0) throw new Error('New term must be positive');

  // Calculate new monthly payment
  const newMonthlyRate = newRate / 100 / 12;
  let newMonthlyPayment: number;
  
  if (newMonthlyRate > 0) {
    newMonthlyPayment = currentBalance * 
      (newMonthlyRate * Math.pow(1 + newMonthlyRate, newTermMonths)) /
      (Math.pow(1 + newMonthlyRate, newTermMonths) - 1);
  } else {
    newMonthlyPayment = currentBalance / newTermMonths;
  }

  const monthlySavings = currentMonthlyPayment - newMonthlyPayment;

  // Calculate total costs
  const totalCurrentCost = currentMonthlyPayment * remainingMonths;
  const totalNewCost = (newMonthlyPayment * newTermMonths) + closingCosts;
  const totalSavings = totalCurrentCost - totalNewCost;

  // Calculate break-even point
  let breakEvenMonths = Infinity;
  if (monthlySavings > 0) {
    breakEvenMonths = Math.ceil(closingCosts / monthlySavings);
  }

  // Determine if refinancing makes sense
  const shouldRefinance = totalSavings > 0 && breakEvenMonths < newTermMonths;

  return {
    newMonthlyPayment,
    monthlySavings,
    totalCurrentCost,
    totalNewCost,
    totalSavings,
    breakEvenMonths,
    shouldRefinance,
  };
}
