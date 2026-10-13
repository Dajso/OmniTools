/**
 * Egenkapitalavkastning
 * = årlig kontantstrøm før skatt ÷ investert egenkapital × 100
 */
export interface CashOnCashInput {
    annualCashFlow: number; // leieinntekter − kostnader − renter og avdrag
    totalCashInvested: number; // egenkapital + omkostninger + oppussing
}
export interface CashOnCashResult {
    cocReturn: number;
    rating: string;
}
export function calculateCashOnCash(input: CashOnCashInput): CashOnCashResult {
    const { annualCashFlow, totalCashInvested } = input;
    if (totalCashInvested <= 0) throw new Error('Investert egenkapital må være større enn null');
    const cocReturn = (annualCashFlow / totalCashInvested) * 100;
    let rating: string;
    if (cocReturn < 4) rating = 'Lav avkastning: vurder alternativer som sparing og fond';
    else if (cocReturn < 8) rating = 'Grei avkastning';
    else if (cocReturn < 12) rating = 'God avkastning';
    else rating = 'Svært høy avkastning: kontroller forutsetningene';
    return { cocReturn: Math.round(cocReturn * 100) / 100, rating };
}
