/**
 * Electricity Cost Calculator
 * 
 * Calculates electricity costs for appliances.
 * 
 * @module lib/calculations/home/electricity-cost-calculator
 * @see Requirements 7.7
 */

export interface ElectricityCostInputs {
  /** Appliance wattage */
  watts: number;
  /** Hours used per day */
  hoursPerDay: number;
  /** Days used per month */
  daysPerMonth: number;
  /** Cost per kWh in dollars */
  costPerKwh: number;
}

export interface ElectricityCostResults {
  /** Daily kWh usage */
  dailyKwh: number;
  /** Monthly kWh usage */
  monthlyKwh: number;
  /** Yearly kWh usage */
  yearlyKwh: number;
  /** Daily cost */
  dailyCost: number;
  /** Monthly cost */
  monthlyCost: number;
  /** Yearly cost */
  yearlyCost: number;
}

/**
 * Calculates electricity costs
 */
export function calculateElectricityCost(inputs: ElectricityCostInputs): ElectricityCostResults {
  const { watts, hoursPerDay, daysPerMonth, costPerKwh } = inputs;

  if (watts <= 0 || hoursPerDay < 0 || daysPerMonth < 0 || costPerKwh < 0) {
    throw new Error('Invalid input values');
  }

  const dailyKwh = (watts * hoursPerDay) / 1000;
  const monthlyKwh = dailyKwh * daysPerMonth;
  const yearlyKwh = monthlyKwh * 12;

  const dailyCost = dailyKwh * costPerKwh;
  const monthlyCost = monthlyKwh * costPerKwh;
  const yearlyCost = yearlyKwh * costPerKwh;

  return {
    dailyKwh,
    monthlyKwh,
    yearlyKwh,
    dailyCost,
    monthlyCost,
    yearlyCost,
  };
}
