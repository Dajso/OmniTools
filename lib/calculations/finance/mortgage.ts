/**
 * Boliglånskalkulator: annuitetslån og serielån
 *
 * Beregner terminbeløp, renter og gebyrer. Støtter:
 * - Annuitetslån (like terminbeløp) og serielån (like store avdrag)
 * - Etableringsgebyr og termingebyr
 * - Effektiv rente inkludert gebyrer
 *
 * Funksjonene for fast annuitet og nedbetalingsplan er generelle og
 * brukes også av andre kalkulatorer.
 *
 * @module lib/calculations/finance/mortgage
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
  /** Home purchase price i kroner */
  homePrice: number;
  /** Down payment amount i kroner */
  downPayment: number;
  /** Loan term in years (typically 15, 20, or 30) */
  loanTerm: number;
  /** Annual interest rate as a percentage (e.g., 6.5 for 6.5%) */
  interestRate: number;
  /** Annual property tax i kroner */
  propertyTax: number;
  /** Annual homeowner's insurance i kroner */
  homeInsurance: number;
  /** Monthly PMI amount i kroner (0 if down payment >= 20%) */
  pmi: number;
  /** Monthly HOA fees i kroner */
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
 * @param principal - Loan amount i kroner
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
      'Lånebeløpet må være større enn null',
      'invalid_input',
      'principal'
    );
  }
  if (annualRate < 0) {
    throw new MortgageCalculationError(
      'Renten kan ikke være negativ',
      'invalid_input',
      'interestRate'
    );
  }
  if (termYears <= 0) {
    throw new MortgageCalculationError(
      'Nedbetalingstiden må være større enn null',
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
      'Beregningen ga for store tall',
      'overflow'
    );
  }

  return monthlyPayment;
}

/**
 * Generates the full amortization schedule for a mortgage
 * 
 * @param principal - Loan amount i kroner
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
      'Boligprisen må være større enn null',
      'invalid_input',
      'homePrice'
    );
  }
  if (downPayment < 0) {
    throw new MortgageCalculationError(
      'Egenkapitalen kan ikke være negativ',
      'invalid_input',
      'downPayment'
    );
  }
  if (downPayment >= homePrice) {
    throw new MortgageCalculationError(
      'Egenkapitalen må være mindre enn boligprisen',
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
 * @returns Down payment amount i kroner
 */
export function calculateDownPaymentFromPercent(
  homePrice: number,
  percent: number
): number {
  return homePrice * (percent / 100);
}


// ---------------------------------------------------------------------------
// Norsk boliglån: annuitet og serie, med gebyrer og effektiv rente
// ---------------------------------------------------------------------------

export type LoanType = 'annuity' | 'serial';

export interface NorwegianLoanInputs {
  /** Lånebeløp i kroner */
  loanAmount: number;
  /** Nedbetalingstid i år */
  termYears: number;
  /** Nominell rente per år i prosent (f.eks. 5.5) */
  interestRate: number;
  /** Annuitet (like terminbeløp) eller serie (like avdrag) */
  loanType: LoanType;
  /** Etableringsgebyr i kroner (betales ved opptak) */
  establishmentFee: number;
  /** Termingebyr per måned i kroner */
  monthlyFee: number;
}

export interface NorwegianLoanEntry {
  month: number;
  /** Avdrag */
  principal: number;
  /** Renter */
  interest: number;
  /** Termingebyr */
  fee: number;
  /** Terminbeløp totalt (avdrag + renter + gebyr) */
  payment: number;
  /** Restgjeld etter terminen */
  balance: number;
}

export interface NorwegianLoanResults {
  firstPayment: number;
  lastPayment: number;
  averagePayment: number;
  totalInterest: number;
  totalFees: number;
  /** Totalt som betales tilbake, inkludert renter og gebyrer */
  totalPaid: number;
  /** Effektiv rente per år i prosent, inkludert gebyrer */
  effectiveRate: number;
  schedule: NorwegianLoanEntry[];
}

/**
 * Lager nedbetalingsplan for annuitetslån eller serielån, med termingebyr.
 */
export function generateNorwegianSchedule(inputs: NorwegianLoanInputs): NorwegianLoanEntry[] {
  const { loanAmount, termYears, interestRate, loanType, monthlyFee } = inputs;
  const n = Math.round(termYears * 12);
  const r = interestRate / 100 / 12;
  const schedule: NorwegianLoanEntry[] = [];
  let balance = loanAmount;
  const annuityPayment =
    loanType === 'annuity' ? calculateMonthlyPrincipalAndInterest(loanAmount, interestRate, termYears) : 0;
  const serialPrincipal = loanAmount / n;

  for (let month = 1; month <= n; month++) {
    const interest = balance * r;
    let principal = loanType === 'annuity' ? annuityPayment - interest : serialPrincipal;
    if (month === n || principal > balance) principal = balance;
    balance = Math.max(0, balance - principal);
    schedule.push({
      month,
      principal,
      interest,
      fee: monthlyFee,
      payment: principal + interest + monthlyFee,
      balance,
    });
  }
  return schedule;
}

/**
 * Effektiv rente per år (%) når etableringsgebyr og termingebyr tas med.
 * Finner månedlig internrente med halvering og regner om til årlig: (1 + r)^12 - 1.
 */
export function calculateEffectiveRate(
  loanAmount: number,
  establishmentFee: number,
  payments: number[]
): number {
  const netto = loanAmount - establishmentFee;
  if (netto <= 0 || payments.length === 0) return 0;
  const npv = (r: number) => {
    let sum = 0;
    let disc = 1;
    for (const p of payments) {
      disc /= 1 + r;
      sum += p * disc;
    }
    return sum - netto;
  };
  let lo = 0;
  let hi = 1; // 100 % per måned er langt over alt realistisk
  if (npv(lo) < 0) return 0;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (npv(mid) > 0) lo = mid;
    else hi = mid;
  }
  const monthly = (lo + hi) / 2;
  return (Math.pow(1 + monthly, 12) - 1) * 100;
}

/**
 * Regner ut et norsk boliglån (annuitet eller serie) med gebyrer og effektiv rente.
 */
export function calculateNorwegianLoan(inputs: NorwegianLoanInputs): NorwegianLoanResults {
  if (inputs.loanAmount <= 0) {
    throw new MortgageCalculationError('Lånebeløpet må være større enn null', 'invalid_input', 'loanAmount');
  }
  if (inputs.termYears <= 0) {
    throw new MortgageCalculationError('Nedbetalingstiden må være større enn null', 'invalid_input', 'termYears');
  }
  if (inputs.interestRate < 0) {
    throw new MortgageCalculationError('Renten kan ikke være negativ', 'invalid_input', 'interestRate');
  }
  const schedule = generateNorwegianSchedule(inputs);
  const totalInterest = schedule.reduce((sum, e) => sum + e.interest, 0);
  const totalFees = inputs.establishmentFee + schedule.reduce((sum, e) => sum + e.fee, 0);
  const totalPayments = schedule.reduce((sum, e) => sum + e.payment, 0);
  return {
    firstPayment: schedule[0].payment,
    lastPayment: schedule[schedule.length - 1].payment,
    averagePayment: totalPayments / schedule.length,
    totalInterest,
    totalFees,
    totalPaid: totalPayments + inputs.establishmentFee,
    effectiveRate: calculateEffectiveRate(
      inputs.loanAmount,
      inputs.establishmentFee,
      schedule.map((e) => e.payment)
    ),
    schedule,
  };
}
