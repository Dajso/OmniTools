/**
 * Car Loan Early Payoff Calculator
 * 
 * Calculates the impact of making extra payments on a car loan,
 * including interest savings and time saved.
 * 
 * @module lib/calculations/auto/car-loan-calculator
 * @see Requirements 28.5
 */

/**
 * Car loan input parameters
 */
export interface CarLoanInput {
  /** Original loan amount */
  loanAmount: number;
  /** Annual interest rate as percentage (e.g., 5.5 for 5.5%) */
  interestRate: number;
  /** Loan term in months */
  loanTermMonths: number;
  /** Extra monthly payment amount */
  extraPayment: number;
  /** One-time lump sum payment (optional) */
  lumpSumPayment?: number;
  /** Number of payments already made (optional) */
  paymentsMade?: number;
}

/**
 * Monthly payment breakdown
 */
export interface PaymentBreakdown {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  extraPayment: number;
  balance: number;
  totalPaid: number;
  totalInterest: number;
}

/**
 * Car loan calculation result
 */
export interface CarLoanResult {
  /** Monthly payment without extra payments */
  originalMonthlyPayment: number;
  /** Total months to pay off with extra payments */
  newPayoffMonths: number;
  /** Months saved by making extra payments */
  monthsSaved: number;
  /** Total interest with original payment schedule */
  originalTotalInterest: number;
  /** Total interest with extra payments */
  newTotalInterest: number;
  /** Interest saved by making extra payments */
  interestSaved: number;
  /** Total amount paid with original schedule */
  originalTotalPaid: number;
  /** Total amount paid with extra payments */
  newTotalPaid: number;
  /** Payoff date with original schedule */
  originalPayoffDate: Date;
  /** Payoff date with extra payments */
  newPayoffDate: Date;
  /** Amortization schedule with extra payments */
  schedule: PaymentBreakdown[];
}

/**
 * Calculate monthly payment using standard amortization formula
 * 
 * Formula: M = P × [r(1+r)^n] / [(1+r)^n - 1]
 * where:
 * - M = monthly payment
 * - P = principal (loan amount)
 * - r = monthly interest rate
 * - n = number of payments
 * 
 * @param principal - Loan amount
 * @param annualRate - Annual interest rate as percentage
 * @param termMonths - Loan term in months
 * @returns Monthly payment amount
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  if (principal <= 0) {
    throw new Error('Loan amount must be positive');
  }
  if (annualRate < 0) {
    throw new Error('Interest rate cannot be negative');
  }
  if (termMonths <= 0) {
    throw new Error('Loan term must be positive');
  }
  
  // Handle 0% interest rate
  if (annualRate === 0) {
    return principal / termMonths;
  }
  
  const monthlyRate = annualRate / 100 / 12;
  const factor = Math.pow(1 + monthlyRate, termMonths);
  
  return principal * (monthlyRate * factor) / (factor - 1);
}

/**
 * Generate amortization schedule
 * 
 * @param principal - Loan amount
 * @param annualRate - Annual interest rate as percentage
 * @param termMonths - Loan term in months
 * @param extraPayment - Extra monthly payment
 * @param lumpSumPayment - One-time lump sum payment
 * @returns Array of payment breakdowns
 */
export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  termMonths: number,
  extraPayment: number = 0,
  lumpSumPayment: number = 0
): PaymentBreakdown[] {
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, termMonths);
  const monthlyRate = annualRate / 100 / 12;
  
  const schedule: PaymentBreakdown[] = [];
  let balance = principal - lumpSumPayment;
  let totalPaid = lumpSumPayment;
  let totalInterest = 0;
  let month = 0;
  
  // Add lump sum as first entry if provided
  if (lumpSumPayment > 0) {
    schedule.push({
      month: 0,
      payment: lumpSumPayment,
      principal: lumpSumPayment,
      interest: 0,
      extraPayment: 0,
      balance,
      totalPaid,
      totalInterest,
    });
  }
  
  while (balance > 0.01 && month < termMonths * 2) { // Safety limit
    month++;
    
    const interestPayment = balance * monthlyRate;
    let principalPayment = monthlyPayment - interestPayment;
    let actualExtra = extraPayment;
    
    // Adjust for final payment
    if (principalPayment + actualExtra >= balance) {
      principalPayment = balance;
      actualExtra = 0;
    } else if (principalPayment + actualExtra > balance) {
      actualExtra = balance - principalPayment;
    }
    
    const totalPayment = principalPayment + interestPayment + actualExtra;
    balance = Math.max(0, balance - principalPayment - actualExtra);
    totalPaid += totalPayment;
    totalInterest += interestPayment;
    
    schedule.push({
      month,
      payment: totalPayment,
      principal: principalPayment + actualExtra,
      interest: interestPayment,
      extraPayment: actualExtra,
      balance,
      totalPaid,
      totalInterest,
    });
    
    if (balance <= 0.01) break;
  }
  
  return schedule;
}

/**
 * Calculate car loan early payoff details
 * 
 * @param input - Loan parameters
 * @returns Detailed calculation results
 */
export function calculateCarLoanPayoff(input: CarLoanInput): CarLoanResult {
  const {
    loanAmount,
    interestRate,
    loanTermMonths,
    extraPayment,
    lumpSumPayment = 0,
    paymentsMade = 0,
  } = input;
  
  // Validate inputs
  if (loanAmount <= 0) {
    throw new Error('Loan amount must be positive');
  }
  if (interestRate < 0) {
    throw new Error('Interest rate cannot be negative');
  }
  if (loanTermMonths <= 0) {
    throw new Error('Loan term must be positive');
  }
  if (extraPayment < 0) {
    throw new Error('Extra payment cannot be negative');
  }
  
  const originalMonthlyPayment = calculateMonthlyPayment(
    loanAmount,
    interestRate,
    loanTermMonths
  );
  
  // Calculate remaining balance if payments have been made
  let remainingBalance = loanAmount;
  let interestPaidSoFar = 0;
  
  if (paymentsMade > 0) {
    const monthlyRate = interestRate / 100 / 12;
    for (let i = 0; i < paymentsMade; i++) {
      const interest = remainingBalance * monthlyRate;
      const principal = originalMonthlyPayment - interest;
      remainingBalance -= principal;
      interestPaidSoFar += interest;
    }
  }
  
  // Generate original schedule (no extra payments)
  const originalSchedule = generateAmortizationSchedule(
    remainingBalance,
    interestRate,
    loanTermMonths - paymentsMade,
    0,
    0
  );
  
  // Generate new schedule (with extra payments)
  const newSchedule = generateAmortizationSchedule(
    remainingBalance,
    interestRate,
    loanTermMonths - paymentsMade,
    extraPayment,
    lumpSumPayment
  );
  
  const originalTotalInterest = interestPaidSoFar + 
    (originalSchedule.length > 0 ? originalSchedule[originalSchedule.length - 1].totalInterest : 0);
  const newTotalInterest = interestPaidSoFar + 
    (newSchedule.length > 0 ? newSchedule[newSchedule.length - 1].totalInterest : 0);
  
  const originalTotalPaid = paymentsMade * originalMonthlyPayment + 
    (originalSchedule.length > 0 ? originalSchedule[originalSchedule.length - 1].totalPaid : 0);
  const newTotalPaid = paymentsMade * originalMonthlyPayment + 
    (newSchedule.length > 0 ? newSchedule[newSchedule.length - 1].totalPaid : 0);
  
  const originalPayoffMonths = loanTermMonths;
  const newPayoffMonths = paymentsMade + newSchedule.filter(p => p.month > 0).length;
  
  const now = new Date();
  const originalPayoffDate = new Date(now);
  originalPayoffDate.setMonth(originalPayoffDate.getMonth() + (loanTermMonths - paymentsMade));
  
  const newPayoffDate = new Date(now);
  newPayoffDate.setMonth(newPayoffDate.getMonth() + newSchedule.filter(p => p.month > 0).length);
  
  return {
    originalMonthlyPayment,
    newPayoffMonths,
    monthsSaved: originalPayoffMonths - newPayoffMonths,
    originalTotalInterest,
    newTotalInterest,
    interestSaved: originalTotalInterest - newTotalInterest,
    originalTotalPaid,
    newTotalPaid,
    originalPayoffDate,
    newPayoffDate,
    schedule: newSchedule,
  };
}

/**
 * Format currency value
 * 
 * @param value - Number to format
 * @returns Formatted currency string
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format months as years and months
 * 
 * @param months - Number of months
 * @returns Formatted string
 */
export function formatMonths(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 0) {
    return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  }
  if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
  return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
}
