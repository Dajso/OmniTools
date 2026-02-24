/**
 * House Affordability Calculator (reverse mortgage)
 */
export interface HouseAffordabilityInput {
    monthlyIncome: number;
    monthlyDebts: number;
    downPaymentPercent: number;
    interestRate: number;
    loanTermYears: number;
    dtiLimit: number; // max DTI ratio %, default 36
}
export interface HouseAffordabilityResult {
    maxMonthlyPayment: number;
    maxLoanAmount: number;
    maxHomePrice: number;
    downPayment: number;
    dtiRatio: number;
}
export function calculateHouseAffordability(input: HouseAffordabilityInput): HouseAffordabilityResult {
    const { monthlyIncome, monthlyDebts, downPaymentPercent, interestRate, loanTermYears, dtiLimit } = input;
    if (monthlyIncome <= 0) throw new Error('Income must be positive');
    const maxTotalDebt = monthlyIncome * (dtiLimit / 100);
    const maxMonthlyPayment = maxTotalDebt - monthlyDebts;
    if (maxMonthlyPayment <= 0) throw new Error('Debt too high for this income');
    // Reverse mortgage formula: P = M × [(1+r)^n - 1] / [r × (1+r)^n]
    const r = interestRate / 100 / 12;
    const n = loanTermYears * 12;
    let maxLoanAmount: number;
    if (r === 0) { maxLoanAmount = maxMonthlyPayment * n; }
    else { maxLoanAmount = maxMonthlyPayment * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n))); }
    const maxHomePrice = maxLoanAmount / (1 - downPaymentPercent / 100);
    const downPayment = maxHomePrice * (downPaymentPercent / 100);
    return {
        maxMonthlyPayment: Math.round(maxMonthlyPayment), maxLoanAmount: Math.round(maxLoanAmount),
        maxHomePrice: Math.round(maxHomePrice), downPayment: Math.round(downPayment),
        dtiRatio: Math.round((maxTotalDebt / monthlyIncome) * 100),
    };
}
