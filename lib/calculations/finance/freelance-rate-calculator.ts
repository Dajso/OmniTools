/**
 * Freelance Rate Calculator
 * 
 * @module lib/calculations/finance/freelance-rate-calculator
 * @see Requirements 5.19
 */

export interface FreelanceRateInputs {
  desiredAnnualIncome: number;
  annualBusinessExpenses: number;
  selfEmploymentTaxRate: number;
  billableHoursPerWeek: number;
  weeksWorkedPerYear: number;
  profitMargin: number;
}

export interface FreelanceRateResults {
  hourlyRate: number;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  totalAnnualRevenue: number;
  effectiveHourlyAfterExpenses: number;
}

export function calculateFreelanceRate(inputs: FreelanceRateInputs): FreelanceRateResults {
  const {
    desiredAnnualIncome,
    annualBusinessExpenses,
    selfEmploymentTaxRate,
    billableHoursPerWeek,
    weeksWorkedPerYear,
    profitMargin,
  } = inputs;

  if (desiredAnnualIncome <= 0) throw new Error('Ønsket inntekt må være større enn null');
  if (billableHoursPerWeek <= 0) throw new Error('Fakturerbare timer må være større enn null');
  if (weeksWorkedPerYear <= 0) throw new Error('Antall arbeidsuker må være større enn null');

  // Account for self-employment tax
  const incomeAfterTax = desiredAnnualIncome / (1 - selfEmploymentTaxRate / 100);
  
  // Add business expenses
  const totalNeeded = incomeAfterTax + annualBusinessExpenses;
  
  // Add profit margin
  const totalAnnualRevenue = totalNeeded / (1 - profitMargin / 100);
  
  // Calculate rates
  const totalBillableHours = billableHoursPerWeek * weeksWorkedPerYear;
  const hourlyRate = totalAnnualRevenue / totalBillableHours;
  const dailyRate = hourlyRate * 8;
  const weeklyRate = hourlyRate * billableHoursPerWeek;
  const monthlyRate = totalAnnualRevenue / 12;
  
  const effectiveHourlyAfterExpenses = desiredAnnualIncome / totalBillableHours;

  return {
    hourlyRate,
    dailyRate,
    weeklyRate,
    monthlyRate,
    totalAnnualRevenue,
    effectiveHourlyAfterExpenses,
  };
}
