/**
 * Mortgage Calculator with PMI, Taxes, and Insurance
 * 
 * Calculates monthly mortgage payments including:
 * - Principal and Interest (P&I)
 * - Property Tax
 * - Homeowner's Insurance
 * - Private Mortgage Insurance (PMI)
 * - HOA Fees
 * 
 * @module lib/calculations/finance/mortgage
 * @see Requirements 5.1
 */

/**
 * Error class for mortgage calculation errors
 */
export class MortgageCalculationError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'division_by_zero' | 'overflow',
    public field?: string
  ) {
    super(message);
    this.name = 'MortgageCalculationError';
  }
}

/**
 * Input parameters for mortgage calculation
 */
export interface MortgageInputs {
  /** Home purchase price in dollars */
  homePrice: number;
  /** Down payment amount in dollars */
  downPayment: number;
  /** Loan term in years (typically 15, 20, or 30) */
  loanTerm: number;
  /** Annual interest rate as a percentage (e.g., 6.5 for 6.5%) */
  interestRate: number;
  /** Annual property tax in dollars */
  propertyTax: number;
  /** Annual homeowner's insurance in dollars */
  homeInsurance: number;
  /** Monthly PMI amount in dollars (0 if down payment >= 20%) */
  pmi: number;
  /** Monthly HOA fees in dollars */
  hoaFees: number;
}

/**
 * Single entry in the amortization schedule
 */
export interface AmortizationEntry {
  /** Payment number (1-indexed) */
  month: number;
  /** Total payment amount */
  payment: number;
  /** Principal portion of payment */
  principal: number;
  /** Interest portion of payment */
  interest: number;
  /** Remaining loan balance after payment */
  balance: number;
}

/**
 * Results from mortgage calculation
 */
export interface MortgageResults {
  /** Total monthly payment (P&I + taxes + insurance + PMI + HOA) */
  monthlyPayment: number;
  /** Monthly principal and interest payment */
  principalAndInterest: number;
  /** Monthly property tax */
  monthlyTax: number;
  /** Monthly homeowner's insurance */
  monthlyInsurance: number;
  /** Monthly PMI */
  monthlyPMI: number;
  /** Monthly HOA fees */
  monthlyHOA: number;
  /** Total amount paid over loan term */
  totalPayment: number;
  /** Total interest paid over loan term */
  totalInterest: number;
  /** Loan principal amount */
  loanAmount: number;
  /** Estimated payoff date */
  payoffDate: Date;
  /** Full amortization schedule */
  amortizationSchedule: AmortizationEntry[];
}


/**
 * Calculates the monthly principal and interest payment using the standard mortgage formula
 * 
 * Formula: M = P × [r(1+r)^n] / [(1+r)^n - 1]
 * Where:
 *   M = Monthly payment
 *   P = Principal (loan amount)
 *   r = Monthly interest rate (annual rate / 12)
 *   n = Total number of payments (years × 12)
 * 
 * @param principal - Loan amount in dollars
 * @param annualRate - Annual interest rate as percentage (e.g., 6.5)
 * @param termYears - Loan term in years
 * @returns Monthly principal and interest payment
 */
export function calculateMonthlyPrincipalAndInterest(
  principal: number,
  annualRate: number,
  termYears: number
): number {
  // Validate inputs
  if (principal <= 0) {
    throw new MortgageCalculationError(
      'Loan amount must be positive',
      'invalid_input',
      'principal'
    );
  }
  if (annualRate < 0) {
    throw new MortgageCalculationError(
      'Interest rate cannot be negative',
      'invalid_input',
      'interestRate'
    );
  }
  if (termYears <= 0) {
    throw new MortgageCalculationError(
      'Loan term must be positive',
      'invalid_input',
      'loanTerm'
    );
  }

  // Handle zero interest rate (simple division)
  if (annualRate === 0) {
    return principal / (termYears * 12);
  }

  // Convert annual rate to monthly decimal rate
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;

  // Calculate using standard mortgage formula
  const factor = Math.pow(1 + monthlyRate, numPayments);
  const monthlyPayment = principal * (monthlyRate * factor) / (factor - 1);

  // Check for overflow
  if (!Number.isFinite(monthlyPayment)) {
    throw new MortgageCalculationError(
      'Calculation resulted in overflow',
      'overflow'
    );
  }

  return monthlyPayment;
}

/**
 * Generates the full amortization schedule for a mortgage
 * 
 * @param principal - Loan amount in dollars
 * @param annualRate - Annual interest rate as percentage
 * @param termYears - Loan term in years
 * @returns Array of amortization entries for each month
 */
export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  termYears: number
): AmortizationEntry[] {
  const monthlyPayment = calculateMonthlyPrincipalAndInterest(
    principal,
    annualRate,
    termYears
  );
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;
  const schedule: AmortizationEntry[] = [];

  let balance = principal;

  for (let month = 1; month <= numPayments; month++) {
    // Calculate interest for this month
    const interest = balance * monthlyRate;
    
    // Calculate principal for this month
    let principalPayment = monthlyPayment - interest;
    
    // Handle final payment rounding
    if (month === numPayments || principalPayment > balance) {
      principalPayment = balance;
    }
    
    // Update balance
    balance = Math.max(0, balance - principalPayment);

    schedule.push({
      month,
      payment: principalPayment + interest,
      principal: principalPayment,
      interest,
      balance,
    });
  }

  return schedule;
}

/**
 * Calculates complete mortgage payment breakdown including all costs
 * 
 * @param inputs - Mortgage calculation inputs
 * @returns Complete mortgage calculation results
 * 
 * @example
 * ```ts
 * const result = calculateMortgage({
 *   homePrice: 300000,
 *   downPayment: 60000,
 *   loanTerm: 30,
 *   interestRate: 6.5,
 *   propertyTax: 3600,
 *   homeInsurance: 1200,
 *   pmi: 0,
 *   hoaFees: 0,
 * });
 * console.log(result.monthlyPayment); // ~$1,516.26 + taxes/insurance
 * ```
 */
export function calculateMortgage(inputs: MortgageInputs): MortgageResults {
  const {
    homePrice,
    downPayment,
    loanTerm,
    interestRate,
    propertyTax,
    homeInsurance,
    pmi,
    hoaFees,
  } = inputs;

  // Validate inputs
  if (homePrice <= 0) {
    throw new MortgageCalculationError(
      'Home price must be positive',
      'invalid_input',
      'homePrice'
    );
  }
  if (downPayment < 0) {
    throw new MortgageCalculationError(
      'Down payment cannot be negative',
      'invalid_input',
      'downPayment'
    );
  }
  if (downPayment >= homePrice) {
    throw new MortgageCalculationError(
      'Down payment must be less than home price',
      'invalid_input',
      'downPayment'
    );
  }

  // Calculate loan amount
  const loanAmount = homePrice - downPayment;

  // Calculate monthly P&I
  const principalAndInterest = calculateMonthlyPrincipalAndInterest(
    loanAmount,
    interestRate,
    loanTerm
  );

  // Calculate monthly escrow amounts
  const monthlyTax = propertyTax / 12;
  const monthlyInsurance = homeInsurance / 12;
  const monthlyPMI = pmi;
  const monthlyHOA = hoaFees;

  // Calculate total monthly payment
  const monthlyPayment =
    principalAndInterest +
    monthlyTax +
    monthlyInsurance +
    monthlyPMI +
    monthlyHOA;

  // Generate amortization schedule
  const amortizationSchedule = generateAmortizationSchedule(
    loanAmount,
    interestRate,
    loanTerm
  );

  // Calculate totals
  const totalPrincipalAndInterest = principalAndInterest * loanTerm * 12;
  const totalInterest = totalPrincipalAndInterest - loanAmount;
  const totalPayment =
    totalPrincipalAndInterest +
    propertyTax * loanTerm +
    homeInsurance * loanTerm +
    monthlyPMI * loanTerm * 12 +
    monthlyHOA * loanTerm * 12;

  // Calculate payoff date
  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + loanTerm * 12);

  return {
    monthlyPayment,
    principalAndInterest,
    monthlyTax,
    monthlyInsurance,
    monthlyPMI,
    monthlyHOA,
    totalPayment,
    totalInterest,
    loanAmount,
    payoffDate,
    amortizationSchedule,
  };
}

/**
 * Calculates the down payment percentage
 * 
 * @param homePrice - Home purchase price
 * @param downPayment - Down payment amount
 * @returns Down payment as a percentage (0-100)
 */
export function calculateDownPaymentPercent(
  homePrice: number,
  downPayment: number
): number {
  if (homePrice <= 0) return 0;
  return (downPayment / homePrice) * 100;
}

/**
 * Calculates down payment amount from percentage
 * 
 * @param homePrice - Home purchase price
 * @param percent - Down payment percentage (0-100)
 * @returns Down payment amount in dollars
 */
export function calculateDownPaymentFromPercent(
  homePrice: number,
  percent: number
): number {
  return homePrice * (percent / 100);
}

/**
 * Determines if PMI is required based on down payment percentage
 * PMI is typically required when down payment is less than 20%
 * 
 * @param downPaymentPercent - Down payment as percentage (0-100)
 * @returns Whether PMI is required
 */
export function isPMIRequired(downPaymentPercent: number): boolean {
  return downPaymentPercent < 20;
}

/**
 * Estimates monthly PMI based on loan amount
 * Typical PMI ranges from 0.5% to 1% of loan amount annually
 * 
 * @param loanAmount - Loan principal amount
 * @param annualPMIRate - Annual PMI rate as percentage (default: 0.5%)
 * @returns Estimated monthly PMI payment
 */
export function estimatePMI(
  loanAmount: number,
  annualPMIRate: number = 0.5
): number {
  return (loanAmount * (annualPMIRate / 100)) / 12;
}
