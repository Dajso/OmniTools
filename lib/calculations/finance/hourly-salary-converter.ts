/**
 * Hourly to Salary Converter
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
  
  if (hoursPerWeek <= 0) throw new Error('Hours per week must be positive');
  if (weeksPerYear <= 0 || weeksPerYear > 52) throw new Error('Weeks per year must be 1-52');

  let calculatedHourly: number;
  let calculatedAnnual: number;

  if (hourlyRate !== undefined && hourlyRate > 0) {
    calculatedHourly = hourlyRate;
    calculatedAnnual = hourlyRate * hoursPerWeek * weeksPerYear;
  } else if (annualSalary !== undefined && annualSalary > 0) {
    calculatedAnnual = annualSalary;
    calculatedHourly = annualSalary / (hoursPerWeek * weeksPerYear);
  } else {
    throw new Error('Either hourly rate or annual salary must be provided');
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
