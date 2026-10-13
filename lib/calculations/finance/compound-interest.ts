/**
 * Compound Interest Calculator
 * 
 * Calculates compound interest growth over time with:
 * - Initial principal
 * - Regular contributions
 * - Various compounding frequencies
 * 
 * @module lib/calculations/finance/compound-interest
 * @see Requirements 5.10
 */

/**
 * Error class for compound interest calculation errors
 */
export class CompoundInterestError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'overflow',
    public field?: string
  ) {
    super(message);
    this.name = 'CompoundInterestError';
  }
}

/**
 * Compounding frequency options
 */
export type CompoundingFrequency = 
  | 'annually'
  | 'semi-annually'
  | 'quarterly'
  | 'monthly'
  | 'daily';

/**
 * Contribution frequency options
 */
export type ContributionFrequency = 
  | 'monthly'
  | 'annually';

/**
 * Input parameters for compound interest calculation
 */
export interface CompoundInterestInputs {
  /** Initial principal amount in dollars */
  principal: number;
  /** Annual interest rate as a percentage (e.g., 7 for 7%) */
  annualRate: number;
  /** Investment time period in years */
  years: number;
  /** How often interest is compounded */
  compoundingFrequency: CompoundingFrequency;
  /** Regular contribution amount */
  contribution: number;
  /** How often contributions are made */
  contributionFrequency: ContributionFrequency;
  /** Whether contributions are made at start or end of period */
  contributionTiming: 'beginning' | 'end';
}

/**
 * Single data point for growth chart
 */
export interface GrowthDataPoint {
  /** Year number (0 = start) */
  year: number;
  /** Total balance at this point */
  balance: number;
  /** Total contributions made so far */
  totalContributions: number;
  /** Total interest earned so far */
  totalInterest: number;
}

/**
 * Results from compound interest calculation
 */
export interface CompoundInterestResults {
  /** Final balance after all years */
  finalBalance: number;
  /** Total amount contributed (principal + contributions) */
  totalContributions: number;
  /** Total interest earned */
  totalInterest: number;
  /** Effective annual rate considering compounding */
  effectiveAnnualRate: number;
  /** Year-by-year growth data for charting */
  growthData: GrowthDataPoint[];
}


/**
 * Get the number of compounding periods per year
 */
export function getCompoundingPeriodsPerYear(frequency: CompoundingFrequency): number {
  switch (frequency) {
    case 'annually': return 1;
    case 'semi-annually': return 2;
    case 'quarterly': return 4;
    case 'monthly': return 12;
    case 'daily': return 365;
  }
}

/**
 * Get the number of contribution periods per year
 */
export function getContributionPeriodsPerYear(frequency: ContributionFrequency): number {
  switch (frequency) {
    case 'annually': return 1;
    case 'monthly': return 12;
  }
}

/**
 * Calculate the effective annual rate (EAR) given nominal rate and compounding frequency
 * 
 * Formula: EAR = (1 + r/n)^n - 1
 * Where:
 *   r = nominal annual rate (as decimal)
 *   n = number of compounding periods per year
 * 
 * @param nominalRate - Annual interest rate as percentage
 * @param compoundingFrequency - How often interest compounds
 * @returns Effective annual rate as percentage
 */
export function calculateEffectiveAnnualRate(
  nominalRate: number,
  compoundingFrequency: CompoundingFrequency
): number {
  const n = getCompoundingPeriodsPerYear(compoundingFrequency);
  const r = nominalRate / 100;
  const ear = Math.pow(1 + r / n, n) - 1;
  return ear * 100;
}

/**
 * Calculate compound interest with regular contributions
 * 
 * Uses the compound interest formula:
 * A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]
 * 
 * Where:
 *   A = Final amount
 *   P = Principal
 *   r = Annual interest rate (decimal)
 *   n = Compounding periods per year
 *   t = Time in years
 *   PMT = Regular contribution
 * 
 * @param inputs - Compound interest calculation inputs
 * @returns Calculation results with growth data
 */
export function calculateCompoundInterest(
  inputs: CompoundInterestInputs
): CompoundInterestResults {
  const {
    principal,
    annualRate,
    years,
    compoundingFrequency,
    contribution,
    contributionFrequency,
    contributionTiming,
  } = inputs;

  // Validate inputs
  if (principal < 0) {
    throw new CompoundInterestError(
      'Startbeløpet kan ikke være negativt',
      'invalid_input',
      'principal'
    );
  }
  if (annualRate < 0) {
    throw new CompoundInterestError(
      'Renten kan ikke være negativ',
      'invalid_input',
      'annualRate'
    );
  }
  if (years <= 0) {
    throw new CompoundInterestError(
      'Investeringsperioden må være større enn null',
      'invalid_input',
      'years'
    );
  }
  if (contribution < 0) {
    throw new CompoundInterestError(
      'Innskuddet kan ikke være negativt',
      'invalid_input',
      'contribution'
    );
  }

  const n = getCompoundingPeriodsPerYear(compoundingFrequency);
  const contributionsPerYear = getContributionPeriodsPerYear(contributionFrequency);
  const r = annualRate / 100;
  const periodicRate = r / n;

  // Generate year-by-year growth data
  const growthData: GrowthDataPoint[] = [];
  let balance = principal;
  let totalContributions = principal;

  // Add starting point
  growthData.push({
    year: 0,
    balance: principal,
    totalContributions: principal,
    totalInterest: 0,
  });

  // Calculate for each year
  for (let year = 1; year <= years; year++) {
    // Calculate contributions for this year
    const yearlyContribution = contribution * contributionsPerYear;
    
    // Compound interest calculation for this year
    // We need to handle contributions throughout the year
    const periodsPerContribution = n / contributionsPerYear;
    
    for (let contrib = 0; contrib < contributionsPerYear; contrib++) {
      // Add contribution at beginning of period if specified
      if (contributionTiming === 'beginning') {
        balance += contribution;
        totalContributions += contribution;
      }
      
      // Compound for the periods until next contribution
      for (let period = 0; period < periodsPerContribution; period++) {
        balance *= (1 + periodicRate);
      }
      
      // Add contribution at end of period if specified
      if (contributionTiming === 'end') {
        balance += contribution;
        totalContributions += contribution;
      }
    }

    const totalInterest = balance - totalContributions;

    growthData.push({
      year,
      balance,
      totalContributions,
      totalInterest,
    });
  }

  // Check for overflow
  if (!Number.isFinite(balance)) {
    throw new CompoundInterestError(
      'Beregningen ga for store tall',
      'overflow'
    );
  }

  const effectiveAnnualRate = calculateEffectiveAnnualRate(annualRate, compoundingFrequency);
  const totalInterest = balance - totalContributions;

  return {
    finalBalance: balance,
    totalContributions,
    totalInterest,
    effectiveAnnualRate,
    growthData,
  };
}

/**
 * Calculate simple compound interest without contributions
 * 
 * Formula: A = P(1 + r/n)^(nt)
 * 
 * @param principal - Initial amount
 * @param annualRate - Annual interest rate as percentage
 * @param years - Time period in years
 * @param compoundingFrequency - How often interest compounds
 * @returns Final balance
 */
export function calculateSimpleCompoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  compoundingFrequency: CompoundingFrequency = 'annually'
): number {
  if (principal < 0) {
    throw new CompoundInterestError('Startbeløpet kan ikke være negativt', 'invalid_input', 'principal');
  }
  if (annualRate < 0) {
    throw new CompoundInterestError('Renten kan ikke være negativ', 'invalid_input', 'annualRate');
  }
  if (years <= 0) {
    throw new CompoundInterestError('Antall år må være større enn null', 'invalid_input', 'years');
  }

  const n = getCompoundingPeriodsPerYear(compoundingFrequency);
  const r = annualRate / 100;
  
  return principal * Math.pow(1 + r / n, n * years);
}

/**
 * Calculate how long it takes to reach a target amount
 * 
 * @param principal - Initial amount
 * @param targetAmount - Target balance to reach
 * @param annualRate - Annual interest rate as percentage
 * @param compoundingFrequency - How often interest compounds
 * @returns Years to reach target
 */
export function calculateTimeToTarget(
  principal: number,
  targetAmount: number,
  annualRate: number,
  compoundingFrequency: CompoundingFrequency = 'annually'
): number {
  if (principal <= 0 || targetAmount <= principal || annualRate <= 0) {
    return Infinity;
  }

  const n = getCompoundingPeriodsPerYear(compoundingFrequency);
  const r = annualRate / 100;
  
  // Solve for t: targetAmount = principal * (1 + r/n)^(nt)
  // t = ln(targetAmount/principal) / (n * ln(1 + r/n))
  const years = Math.log(targetAmount / principal) / (n * Math.log(1 + r / n));
  
  return years;
}

/**
 * Calculate the rule of 72 approximation for doubling time
 * 
 * @param annualRate - Annual interest rate as percentage
 * @returns Approximate years to double
 */
export function calculateRuleOf72(annualRate: number): number {
  if (annualRate <= 0) return Infinity;
  return 72 / annualRate;
}
