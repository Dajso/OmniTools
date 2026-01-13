/**
 * Inflation Calculator
 * 
 * @module lib/calculations/finance/inflation-calculator
 * @see Requirements 5.7
 */

export interface InflationInputs {
  amount: number;
  inflationRate: number;
  years: number;
}

export interface InflationResults {
  futureValue: number;
  purchasingPowerLoss: number;
  purchasingPowerLossPercent: number;
  equivalentPastValue: number;
}

export function calculateInflation(inputs: InflationInputs): InflationResults {
  const { amount, inflationRate, years } = inputs;
  
  if (amount < 0) throw new Error('Amount cannot be negative');
  if (years < 0) throw new Error('Years cannot be negative');

  // Future value needed to maintain purchasing power
  const futureValue = amount * Math.pow(1 + inflationRate / 100, years);
  
  // How much purchasing power is lost
  const purchasingPowerLoss = futureValue - amount;
  const purchasingPowerLossPercent = (purchasingPowerLoss / amount) * 100;
  
  // What today's amount was worth in the past
  const equivalentPastValue = amount / Math.pow(1 + inflationRate / 100, years);

  return {
    futureValue,
    purchasingPowerLoss,
    purchasingPowerLossPercent,
    equivalentPastValue,
  };
}
