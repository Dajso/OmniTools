/**
 * Gross Rent Multiplier
 * GRM = Property Price / Annual Gross Rent
 */
export interface GRMInput { propertyPrice: number; annualGrossRent: number; }
export interface GRMResult { grm: number; rating: string; }
export function calculateGRM(input: GRMInput): GRMResult {
    const { propertyPrice, annualGrossRent } = input;
    if (annualGrossRent <= 0) throw new Error('Annual rent must be positive');
    const grm = propertyPrice / annualGrossRent;
    let rating: string;
    if (grm < 6) rating = 'Excellent — strong rental market';
    else if (grm < 10) rating = 'Good — typical investment property';
    else if (grm < 15) rating = 'Average — consider other factors';
    else rating = 'High — may not cash flow well';
    return { grm: Math.round(grm * 100) / 100, rating };
}
