/**
 * Hvor mye bolig har jeg råd til? Basert på utlånsforskriften:
 * gjeld maks 5 × bruttoinntekt, egenkapital minst 15 %, og stresstest med 3 prosentpoeng høyere rente.
 * @module lib/calculations/realestate/house-affordability
 */
export interface HouseAffordabilityInput {
    /** Samlet årlig bruttoinntekt (kr) */
    annualIncome: number;
    /** Eksisterende gjeld (studielån, billån, kredittkort …) i kr */
    existingDebt: number;
    /** Egenkapital i kr */
    equity: number;
    /** Nominell rente i prosent */
    interestRate: number;
    /** Løpetid i år (maks 30) */
    loanTermYears: number;
}

export type LimitingFactor = 'income' | 'equity';

export interface HouseAffordabilityResult {
    maxLoanAmount: number;
    maxHomePrice: number;
    limitingFactor: LimitingFactor;
    monthlyPayment: number;
    monthlyPaymentStress: number;
    debtMultiple: number;
}

export const MAX_DEBT_MULTIPLE = 5;
export const MIN_EQUITY_SHARE = 0.15;
export const STRESS_TEST_PP = 3;

export function annuityPayment(loan: number, ratePercent: number, years: number): number {
    const n = years * 12;
    const r = ratePercent / 100 / 12;
    if (loan <= 0) return 0;
    if (r === 0) return loan / n;
    return (loan * r) / (1 - Math.pow(1 + r, -n));
}

export function calculateHouseAffordability(input: HouseAffordabilityInput): HouseAffordabilityResult {
    const { annualIncome, existingDebt, equity, interestRate, loanTermYears } = input;
    if (!(annualIncome > 0)) throw new Error('Inntekten må være større enn null');
    if (equity < 0) throw new Error('Egenkapitalen kan ikke være negativ');
    if (existingDebt < 0) throw new Error('Gjelden kan ikke være negativ');
    if (loanTermYears < 1 || loanTermYears > 30) throw new Error('Løpetiden må være mellom 1 og 30 år');

    const maxNewLoanByIncome = Math.max(0, MAX_DEBT_MULTIPLE * annualIncome - existingDebt);
    const priceByIncome = maxNewLoanByIncome + equity;
    const priceByEquity = equity / MIN_EQUITY_SHARE;

    const limitingFactor: LimitingFactor = priceByIncome <= priceByEquity ? 'income' : 'equity';
    const maxHomePrice = Math.min(priceByIncome, priceByEquity);
    const maxLoanAmount = Math.max(0, maxHomePrice - equity);

    return {
        maxLoanAmount: Math.round(maxLoanAmount),
        maxHomePrice: Math.round(maxHomePrice),
        limitingFactor,
        monthlyPayment: Math.round(annuityPayment(maxLoanAmount, interestRate, loanTermYears)),
        monthlyPaymentStress: Math.round(annuityPayment(maxLoanAmount, interestRate + STRESS_TEST_PP, loanTermYears)),
        debtMultiple: Math.round(((maxLoanAmount + existingDebt) / annualIncome) * 100) / 100,
    };
}
