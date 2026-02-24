/**
 * Cap Rate Calculator  
 * Cap Rate = Net Operating Income / Current Market Value × 100
 * @module lib/calculations/realestate/cap-rate
 */
export interface CapRateInput {
    purchasePrice: number;
    annualGrossRent: number;
    annualExpenses: number; // taxes, insurance, maintenance, vacancy
}
export interface CapRateResult {
    noi: number;
    capRate: number;
    rating: string;
}
export function calculateCapRate(input: CapRateInput): CapRateResult {
    const { purchasePrice, annualGrossRent, annualExpenses } = input;
    if (purchasePrice <= 0) throw new Error('Purchase price must be positive');
    const noi = annualGrossRent - annualExpenses;
    const capRate = (noi / purchasePrice) * 100;
    let rating: string;
    if (capRate < 4) rating = 'Low return — typical of premium locations';
    else if (capRate < 8) rating = 'Average return — most residential properties';
    else if (capRate < 12) rating = 'Good return — value-add opportunities';
    else rating = 'High return — may indicate higher risk';
    return { noi: Math.round(noi), capRate: Math.round(capRate * 100) / 100, rating };
}
