/**
 * FIRE (Financial Independence, Retire Early) Calculator
 * 
 * @module lib/calculations/finance/fire-calculator
 * @see Requirements 5.14
 */

export interface FIREInputs {
  currentAge: number;
  annualExpenses: number;
  currentSavings: number;
  annualSavings: number;
  expectedReturn: number;
  withdrawalRate: number;
}

export interface FIREResults {
  fireNumber: number;
  yearsToFIRE: number;
  fireAge: number;
  projectedSavingsAtFIRE: number;
  safeWithdrawalAmount: number;
}

export function calculateFIRE(inputs: FIREInputs): FIREResults {
  const {
    currentAge,
    annualExpenses,
    currentSavings,
    annualSavings,
    expectedReturn,
    withdrawalRate,
  } = inputs;

  if (annualExpenses <= 0) throw new Error('Annual expenses must be positive');
  if (withdrawalRate <= 0) throw new Error('Withdrawal rate must be positive');

  // FIRE number = annual expenses / withdrawal rate
  const fireNumber = annualExpenses / (withdrawalRate / 100);
  
  // Calculate years to reach FIRE number
  let years = 0;
  let balance = currentSavings;
  const returnRate = expectedReturn / 100;

  while (balance < fireNumber && years < 100) {
    balance = (balance + annualSavings) * (1 + returnRate);
    years++;
  }

  const fireAge = currentAge + years;
  const safeWithdrawalAmount = fireNumber * (withdrawalRate / 100);

  return {
    fireNumber,
    yearsToFIRE: years,
    fireAge,
    projectedSavingsAtFIRE: balance,
    safeWithdrawalAmount,
  };
}
