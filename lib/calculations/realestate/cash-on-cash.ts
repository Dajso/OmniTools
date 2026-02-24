/**
 * Cash on Cash Return Calculator
 * CoC = Annual Pre-Tax Cash Flow / Total Cash Invested × 100
 */
export interface CashOnCashInput {
    annualCashFlow: number; // rental income - expenses - mortgage
    totalCashInvested: number; // down payment + closing + repairs
}
export interface CashOnCashResult {
    cocReturn: number;
    rating: string;
}
export function calculateCashOnCash(input: CashOnCashInput): CashOnCashResult {
    const { annualCashFlow, totalCashInvested } = input;
    if (totalCashInvested <= 0) throw new Error('Total cash invested must be positive');
    const cocReturn = (annualCashFlow / totalCashInvested) * 100;
    let rating: string;
    if (cocReturn < 4) rating = 'Below average — consider other investments';
    else if (cocReturn < 8) rating = 'Decent return for stable markets';
    else if (cocReturn < 12) rating = 'Good return — solid investment';
    else rating = 'Excellent return';
    return { cocReturn: Math.round(cocReturn * 100) / 100, rating };
}
