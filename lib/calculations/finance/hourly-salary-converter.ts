/**
 * Timelønn til årslønn
 * 
 * @module lib/calculations/finance/hourly-salary-converter
 * @see Requirements 5.13
 */

export interface HourlySalaryInputs {
  hourlyRate?: number;
  annualSalary?: number;
  hoursPerWeek: number;
  weeksPerYear: number;
}

export interface HourlySalaryResults {
  hourlyRate: number;
  dailyRate: number;
  weeklyRate: number;
  biweeklyRate: number;
  monthlyRate: number;
  annualSalary: number;
}

export function convertHourlyToSalary(inputs: HourlySalaryInputs): HourlySalaryResults {
  const { hourlyRate, annualSalary, hoursPerWeek, weeksPerYear } = inputs;
  
  if (hoursPerWeek <= 0) throw new Error('Timer per uke må være større enn null');
  if (weeksPerYear <= 0 || weeksPerYear > 52) throw new Error('Uker per år må være mellom 1 og 52');

  let calculatedHourly: number;
  let calculatedAnnual: number;

  if (hourlyRate !== undefined && hourlyRate > 0) {
    calculatedHourly = hourlyRate;
    calculatedAnnual = hourlyRate * hoursPerWeek * weeksPerYear;
  } else if (annualSalary !== undefined && annualSalary > 0) {
    calculatedAnnual = annualSalary;
    calculatedHourly = annualSalary / (hoursPerWeek * weeksPerYear);
  } else {
    throw new Error('Du må oppgi enten timelønn eller årslønn');
  }

  const dailyRate = calculatedHourly * (hoursPerWeek / 5);
  const weeklyRate = calculatedHourly * hoursPerWeek;
  const biweeklyRate = weeklyRate * 2;
  const monthlyRate = calculatedAnnual / 12;

  return {
    hourlyRate: calculatedHourly,
    dailyRate,
    weeklyRate,
    biweeklyRate,
    monthlyRate,
    annualSalary: calculatedAnnual,
  };
}
