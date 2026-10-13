/**
 * Yield-kalkulator
 * Nettoyield = (leie − kostnader) ÷ kjøpesum × 100
 * @module lib/calculations/realestate/cap-rate
 */
export interface CapRateInput {
    purchasePrice: number;
    annualGrossRent: number;
    annualExpenses: number; // felleskostnader, eiendomsskatt, forsikring, vedlikehold, ledighet
}
export interface CapRateResult {
    noi: number;
    capRate: number; // nettoyield
    grossYield: number;
    rating: string;
}
export function calculateCapRate(input: CapRateInput): CapRateResult {
    const { purchasePrice, annualGrossRent, annualExpenses } = input;
    if (purchasePrice <= 0) throw new Error('Kjøpesummen må være større enn null');
    const noi = annualGrossRent - annualExpenses;
    const capRate = (noi / purchasePrice) * 100;
    const grossYield = (annualGrossRent / purchasePrice) * 100;
    let rating: string;
    if (capRate < 2) rating = 'Lav yield: leien dekker lite av kjøpesummen';
    else if (capRate < 4) rating = 'Vanlig for utleiebolig i store byer';
    else if (capRate < 6) rating = 'God yield for bolig';
    else rating = 'Høy yield: sjekk risiko, ledighet og vedlikeholdsbehov';
    return { noi: Math.round(noi), capRate: Math.round(capRate * 100) / 100, grossYield: Math.round(grossYield * 100) / 100, rating };
}
