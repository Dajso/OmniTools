/**
 * Emergency Fund Calculator
 * 
 * @module lib/calculations/finance/emergency-fund-calculator
 * @see Requirements 5.20
 */

export interface EmergencyFundInputs {
  monthlyExpenses: number;
  monthsOfCoverage: number;
  currentSavings: number;
  monthlySavingsRate: number;
}

export interface EmergencyFundResults {
  targetAmount: number;
  amountNeeded: number;
  monthsToGoal: number;
  percentComplete: number;
  isGoalMet: boolean;
}

export function calculateEmergencyFund(inputs: EmergencyFundInputs): EmergencyFundResults {
  const { monthlyExpenses, monthsOfCoverage, currentSavings, monthlySavingsRate } = inputs;
  
  if (monthlyExpenses < 0) throw new Error('Monthly expenses cannot be negative');
  if (monthsOfCoverage < 1) throw new Error('Coverage must be at least 1 month');
  if (currentSavings < 0) throw new Error('Current savings cannot be negative');

  const targetAmount = monthlyExpenses * monthsOfCoverage;
  const amountNeeded = Math.max(0, targetAmount - currentSavings);
  const percentComplete = targetAmount > 0 ? (currentSavings / targetAmount) * 100 : 100;
  const isGoalMet = currentSavings >= targetAmount;
  
  let monthsToGoal = 0;
  if (!isGoalMet && monthlySavingsRate > 0) {
    monthsToGoal = Math.ceil(amountNeeded / monthlySavingsRate);
  } else if (!isGoalMet) {
    monthsToGoal = Infinity;
  }

  return {
    targetAmount,
    amountNeeded,
    monthsToGoal,
    percentComplete: Math.min(100, percentComplete),
    isGoalMet,
  };
}
