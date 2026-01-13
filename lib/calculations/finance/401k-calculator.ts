/**
 * 401(k) Savings Calculator with Employer Match
 * 
 * @module lib/calculations/finance/401k-calculator
 * @see Requirements 5.2
 */

export interface FourOhOneKInputs {
  currentAge: number;
  retirementAge: number;
  currentBalance: number;
  annualSalary: number;
  contributionPercent: number;
  employerMatchPercent: number;
  employerMatchLimit: number;
  annualReturnRate: number;
  salaryIncreaseRate: number;
}

export interface FourOhOneKResults {
  finalBalance: number;
  totalContributions: number;
  totalEmployerMatch: number;
  totalGrowth: number;
  yearlyBreakdown: Array<{
    age: number;
    salary: number;
    contribution: number;
    employerMatch: number;
    balance: number;
  }>;
}

export function calculate401k(inputs: FourOhOneKInputs): FourOhOneKResults {
  const {
    currentAge,
    retirementAge,
    currentBalance,
    annualSalary,
    contributionPercent,
    employerMatchPercent,
    employerMatchLimit,
    annualReturnRate,
    salaryIncreaseRate,
  } = inputs;

  if (currentAge >= retirementAge) throw new Error('Current age must be less than retirement age');
  if (contributionPercent < 0 || contributionPercent > 100) throw new Error('Contribution must be 0-100%');

  const years = retirementAge - currentAge;
  let balance = currentBalance;
  let salary = annualSalary;
  let totalContributions = 0;
  let totalEmployerMatch = 0;
  const yearlyBreakdown: FourOhOneKResults['yearlyBreakdown'] = [];

  for (let i = 0; i < years; i++) {
    const age = currentAge + i + 1;
    const contribution = salary * (contributionPercent / 100);
    const matchablePercent = Math.min(contributionPercent, employerMatchLimit);
    const employerMatch = salary * (matchablePercent / 100) * (employerMatchPercent / 100);
    
    totalContributions += contribution;
    totalEmployerMatch += employerMatch;
    
    // Add contributions and match, then apply growth
    balance = (balance + contribution + employerMatch) * (1 + annualReturnRate / 100);
    
    yearlyBreakdown.push({
      age,
      salary,
      contribution,
      employerMatch,
      balance,
    });

    // Increase salary for next year
    salary *= (1 + salaryIncreaseRate / 100);
  }

  const totalGrowth = balance - currentBalance - totalContributions - totalEmployerMatch;

  return {
    finalBalance: balance,
    totalContributions,
    totalEmployerMatch,
    totalGrowth,
    yearlyBreakdown,
  };
}
