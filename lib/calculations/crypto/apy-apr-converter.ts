/**
 * APY to APR Converter
 * 
 * Converts between Annual Percentage Yield (APY) and Annual Percentage Rate (APR)
 * for DeFi yield calculations. APY accounts for compound interest while APR does not.
 * 
 * @module lib/calculations/crypto/apy-apr-converter
 * @see Requirements 22.8
 */

/**
 * Error class for APY/APR conversion errors
 */
export class APYAPRError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'calculation_error',
    public field?: string
  ) {
    super(message);
    this.name = 'APYAPRError';
  }
}

/**
 * Compounding frequency options
 */
export type CompoundingFrequency = 
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'semi-annually'
  | 'annually'
  | 'continuous';

/**
 * Number of compounding periods per year for each frequency
 */
export const COMPOUNDING_PERIODS: Record<Exclude<CompoundingFrequency, 'continuous'>, number> = {
  daily: 365,
  weekly: 52,
  monthly: 12,
  quarterly: 4,
  'semi-annually': 2,
  annually: 1,
};

/**
 * APY/APR conversion input
 */
export interface APYAPRInput {
  /** The rate to convert (as a percentage, e.g., 10 for 10%) */
  rate: number;
  /** Compounding frequency */
  compoundingFrequency: CompoundingFrequency;
}

/**
 * APY/APR conversion result
 */
export interface APYAPRResult {
  /** APY (Annual Percentage Yield) as a percentage */
  apy: number;
  /** APR (Annual Percentage Rate) as a percentage */
  apr: number;
  /** Compounding frequency used */
  compoundingFrequency: CompoundingFrequency;
  /** Number of compounding periods per year */
  periodsPerYear: number | 'continuous';
  /** Daily rate (APR / 365) */
  dailyRate: number;
  /** Monthly rate (APR / 12) */
  monthlyRate: number;
  /** Formatted APY string */
  formattedAPY: string;
  /** Formatted APR string */
  formattedAPR: string;
}


/**
 * Convert APR to APY
 * 
 * Formula: APY = (1 + APR/n)^n - 1
 * For continuous compounding: APY = e^APR - 1
 * 
 * @param input - APR value and compounding frequency
 * @returns APY/APR result with all metrics
 */
export function aprToApy(input: APYAPRInput): APYAPRResult {
  const { rate: apr, compoundingFrequency } = input;

  // Validate input
  if (apr < -100) {
    throw new APYAPRError(
      'APR cannot be less than -100%',
      'invalid_input',
      'rate'
    );
  }

  const aprDecimal = apr / 100;
  let apyDecimal: number;
  let periodsPerYear: number | 'continuous';

  if (compoundingFrequency === 'continuous') {
    // Continuous compounding: APY = e^APR - 1
    apyDecimal = Math.exp(aprDecimal) - 1;
    periodsPerYear = 'continuous';
  } else {
    // Discrete compounding: APY = (1 + APR/n)^n - 1
    const n = COMPOUNDING_PERIODS[compoundingFrequency];
    apyDecimal = Math.pow(1 + aprDecimal / n, n) - 1;
    periodsPerYear = n;
  }

  const apy = apyDecimal * 100;
  const dailyRate = apr / 365;
  const monthlyRate = apr / 12;

  return {
    apy,
    apr,
    compoundingFrequency,
    periodsPerYear,
    dailyRate,
    monthlyRate,
    formattedAPY: `${apy.toFixed(2)}%`,
    formattedAPR: `${apr.toFixed(2)}%`,
  };
}

/**
 * Convert APY to APR
 * 
 * Formula: APR = n * ((1 + APY)^(1/n) - 1)
 * For continuous compounding: APR = ln(1 + APY)
 * 
 * @param input - APY value and compounding frequency
 * @returns APY/APR result with all metrics
 */
export function apyToApr(input: APYAPRInput): APYAPRResult {
  const { rate: apy, compoundingFrequency } = input;

  // Validate input
  if (apy < -100) {
    throw new APYAPRError(
      'APY cannot be less than -100%',
      'invalid_input',
      'rate'
    );
  }

  const apyDecimal = apy / 100;
  let aprDecimal: number;
  let periodsPerYear: number | 'continuous';

  if (compoundingFrequency === 'continuous') {
    // Continuous compounding: APR = ln(1 + APY)
    aprDecimal = Math.log(1 + apyDecimal);
    periodsPerYear = 'continuous';
  } else {
    // Discrete compounding: APR = n * ((1 + APY)^(1/n) - 1)
    const n = COMPOUNDING_PERIODS[compoundingFrequency];
    aprDecimal = n * (Math.pow(1 + apyDecimal, 1 / n) - 1);
    periodsPerYear = n;
  }

  const apr = aprDecimal * 100;
  const dailyRate = apr / 365;
  const monthlyRate = apr / 12;

  return {
    apy,
    apr,
    compoundingFrequency,
    periodsPerYear,
    dailyRate,
    monthlyRate,
    formattedAPY: `${apy.toFixed(2)}%`,
    formattedAPR: `${apr.toFixed(2)}%`,
  };
}


/**
 * Calculate future value with compound interest
 * 
 * @param principal - Initial investment amount
 * @param apr - Annual percentage rate
 * @param years - Number of years
 * @param compoundingFrequency - How often interest compounds
 * @returns Future value
 */
export function calculateFutureValue(
  principal: number,
  apr: number,
  years: number,
  compoundingFrequency: CompoundingFrequency
): number {
  if (principal < 0) {
    throw new APYAPRError(
      'Principal cannot be negative',
      'invalid_input',
      'principal'
    );
  }
  if (years < 0) {
    throw new APYAPRError(
      'Years cannot be negative',
      'invalid_input',
      'years'
    );
  }

  const aprDecimal = apr / 100;

  if (compoundingFrequency === 'continuous') {
    // FV = P * e^(r*t)
    return principal * Math.exp(aprDecimal * years);
  } else {
    // FV = P * (1 + r/n)^(n*t)
    const n = COMPOUNDING_PERIODS[compoundingFrequency];
    return principal * Math.pow(1 + aprDecimal / n, n * years);
  }
}

/**
 * Calculate the effective rate for a given period
 * 
 * @param apr - Annual percentage rate
 * @param periodsPerYear - Number of periods in a year
 * @returns Effective rate per period
 */
export function calculatePeriodRate(apr: number, periodsPerYear: number): number {
  if (periodsPerYear <= 0) {
    throw new APYAPRError(
      'Periods per year must be positive',
      'invalid_input',
      'periodsPerYear'
    );
  }
  return apr / periodsPerYear;
}

/**
 * Compare APY across different compounding frequencies
 * 
 * @param apr - Annual percentage rate
 * @returns APY for each compounding frequency
 */
export function compareCompoundingFrequencies(apr: number): Array<{
  frequency: CompoundingFrequency;
  apy: number;
  periodsPerYear: number | 'continuous';
}> {
  const frequencies: CompoundingFrequency[] = [
    'annually',
    'semi-annually',
    'quarterly',
    'monthly',
    'weekly',
    'daily',
    'continuous',
  ];

  return frequencies.map(frequency => {
    const result = aprToApy({ rate: apr, compoundingFrequency: frequency });
    return {
      frequency,
      apy: result.apy,
      periodsPerYear: result.periodsPerYear,
    };
  });
}

/**
 * Calculate the time to double investment (Rule of 72 approximation and exact)
 * 
 * @param apr - Annual percentage rate
 * @param compoundingFrequency - How often interest compounds
 * @returns Time to double in years
 */
export function calculateTimeToDouble(
  apr: number,
  compoundingFrequency: CompoundingFrequency = 'annually'
): { exact: number; ruleOf72: number } {
  if (apr <= 0) {
    return { exact: Infinity, ruleOf72: Infinity };
  }

  // Rule of 72 approximation
  const ruleOf72 = 72 / apr;

  // Exact calculation using APY
  const { apy } = aprToApy({ rate: apr, compoundingFrequency });
  const apyDecimal = apy / 100;
  const exact = Math.log(2) / Math.log(1 + apyDecimal);

  return { exact, ruleOf72 };
}

/**
 * Common DeFi yield scenarios for reference
 */
export const YIELD_SCENARIOS = [
  { name: 'Conservative Staking', apr: 4, frequency: 'daily' as CompoundingFrequency },
  { name: 'Moderate Yield Farm', apr: 15, frequency: 'daily' as CompoundingFrequency },
  { name: 'High Yield Pool', apr: 50, frequency: 'daily' as CompoundingFrequency },
  { name: 'Aggressive DeFi', apr: 100, frequency: 'daily' as CompoundingFrequency },
  { name: 'Degen Farm', apr: 500, frequency: 'daily' as CompoundingFrequency },
].map(scenario => ({
  ...scenario,
  apy: aprToApy({ rate: scenario.apr, compoundingFrequency: scenario.frequency }).apy,
}));
