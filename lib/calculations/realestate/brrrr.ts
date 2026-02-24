/**
 * BRRRR Calculator: Buy, Rehab, Rent, Refinance, Repeat
 */
export interface BRRRRInput {
    purchasePrice: number;
    rehabCost: number;
    afterRepairValue: number;
    monthlyRent: number;
    monthlyExpenses: number;
    refinanceLTV: number; // loan-to-value e.g. 75
    closingCosts: number;
}
export interface BRRRRResult {
    totalInvestment: number;
    refinanceAmount: number;
    cashLeftInDeal: number;
    monthlyCashFlow: number;
    annualCashFlow: number;
    cashOnCash: number;
    allMoneyOut: boolean;
}
export function calculateBRRRR(input: BRRRRInput): BRRRRResult {
    const { purchasePrice, rehabCost, afterRepairValue, monthlyRent, monthlyExpenses, refinanceLTV, closingCosts } = input;
    const totalInvestment = purchasePrice + rehabCost + closingCosts;
    const refinanceAmount = afterRepairValue * (refinanceLTV / 100);
    const cashLeftInDeal = Math.max(0, totalInvestment - refinanceAmount);
    const monthlyCashFlow = monthlyRent - monthlyExpenses;
    const annualCashFlow = monthlyCashFlow * 12;
    const cashOnCash = cashLeftInDeal > 0 ? (annualCashFlow / cashLeftInDeal) * 100 : Infinity;
    const allMoneyOut = refinanceAmount >= totalInvestment;
    return {
        totalInvestment: Math.round(totalInvestment), refinanceAmount: Math.round(refinanceAmount),
        cashLeftInDeal: Math.round(cashLeftInDeal), monthlyCashFlow: Math.round(monthlyCashFlow),
        annualCashFlow: Math.round(annualCashFlow), cashOnCash: cashOnCash === Infinity ? Infinity : Math.round(cashOnCash * 100) / 100,
        allMoneyOut,
    };
}
