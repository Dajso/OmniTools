/**
 * Brutto leiemultiplikator
 * = kjøpesum ÷ årlig brutto leie
 */
export interface GRMInput { propertyPrice: number; annualGrossRent: number; }
export interface GRMResult { grm: number; rating: string; }
export function calculateGRM(input: GRMInput): GRMResult {
    const { propertyPrice, annualGrossRent } = input;
    if (annualGrossRent <= 0) throw new Error('Årsleien må være større enn null');
    const grm = propertyPrice / annualGrossRent;
    let rating: string;
    if (grm < 15) rating = 'Lav: bolig er billig i forhold til leien';
    else if (grm < 20) rating = 'God: leien står godt i forhold til prisen';
    else if (grm < 28) rating = 'Vanlig i store norske byer';
    else rating = 'Høy: leien er lav i forhold til prisen';
    return { grm: Math.round(grm * 100) / 100, rating };
}
