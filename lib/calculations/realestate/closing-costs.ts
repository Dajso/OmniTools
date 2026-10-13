/**
 * Omkostninger ved boligkjøp (dokumentavgift, tinglysing, etableringsgebyr)
 * @module lib/calculations/realestate/closing-costs
 */
export type OwnershipType = 'selveier' | 'andel';

export interface ClosingCostInput {
    purchasePrice: number;
    /** Egenkapital i prosent av kjøpesummen (minst 15 % ved lån) */
    downPaymentPercent: number;
    /** Selveier (dokumentavgift 2,5 %) eller borettslag/aksjeleilighet (ingen dokumentavgift) */
    ownership?: OwnershipType;
    /** Etableringsgebyr til banken i kr */
    establishmentFee?: number;
}

export interface ClosingCostResult {
    loanAmount: number;
    downPayment: number;
    documentFee: number;
    titleRegistration: number;
    mortgageRegistration: number;
    establishmentFee: number;
    totalClosingCosts: number;
    totalCashNeeded: number;
    percentOfPrice: number;
}

export const DOCUMENT_FEE_RATE = 0.025;
export const REGISTRATION_FEE = 585;

export function calculateClosingCosts(input: ClosingCostInput): ClosingCostResult {
    const { purchasePrice, downPaymentPercent, ownership = 'selveier', establishmentFee = 1000 } = input;
    if (!(purchasePrice > 0)) throw new Error('Kjøpesummen må være større enn null');
    if (downPaymentPercent < 0 || downPaymentPercent > 100) throw new Error('Egenkapitalen må være mellom 0 og 100 %');

    const downPayment = purchasePrice * (downPaymentPercent / 100);
    const loanAmount = purchasePrice - downPayment;
    const documentFee = ownership === 'selveier' ? purchasePrice * DOCUMENT_FEE_RATE : 0;
    const titleRegistration = ownership === 'selveier' ? REGISTRATION_FEE : 0;
    const mortgageRegistration = loanAmount > 0 ? REGISTRATION_FEE : 0;
    const fee = loanAmount > 0 ? Math.max(0, establishmentFee) : 0;

    const totalClosingCosts = documentFee + titleRegistration + mortgageRegistration + fee;
    return {
        loanAmount: Math.round(loanAmount),
        downPayment: Math.round(downPayment),
        documentFee: Math.round(documentFee),
        titleRegistration,
        mortgageRegistration,
        establishmentFee: fee,
        totalClosingCosts: Math.round(totalClosingCosts),
        totalCashNeeded: Math.round(downPayment + totalClosingCosts),
        percentOfPrice: Math.round((totalClosingCosts / purchasePrice) * 10000) / 100,
    };
}
