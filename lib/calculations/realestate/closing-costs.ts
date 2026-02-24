/**
 * Closing Cost Estimator
 */
export interface ClosingCostInput {
    purchasePrice: number;
    downPaymentPercent: number;
    state?: string;
}
export interface ClosingCostResult {
    loanAmount: number;
    loanOrigination: number;      // 0.5-1% of loan
    appraisal: number;            // $300-$500
    titleInsurance: number;       // 0.5% of price
    escrowFees: number;           // $750-$1500
    recordingFees: number;        // $50-$250
    inspectionFee: number;        // $200-$500
    prepaidInsurance: number;     // ~$1200/yr
    prepaidTaxes: number;         // 1.1% of price for ~2 months
    totalClosingCosts: number;
    totalCashNeeded: number;
    percentOfPrice: number;
}
export function calculateClosingCosts(input: ClosingCostInput): ClosingCostResult {
    const { purchasePrice, downPaymentPercent } = input;
    if (purchasePrice <= 0) throw new Error('Price must be positive');
    const downPayment = purchasePrice * (downPaymentPercent / 100);
    const loanAmount = purchasePrice - downPayment;
    const loanOrigination = loanAmount * 0.01;
    const appraisal = 450;
    const titleInsurance = purchasePrice * 0.005;
    const escrowFees = 1200;
    const recordingFees = 150;
    const inspectionFee = 400;
    const prepaidInsurance = 1200;
    const prepaidTaxes = purchasePrice * 0.011 / 6;
    const totalClosingCosts = loanOrigination + appraisal + titleInsurance + escrowFees + recordingFees + inspectionFee + prepaidInsurance + prepaidTaxes;
    return {
        loanAmount: Math.round(loanAmount), loanOrigination: Math.round(loanOrigination),
        appraisal, titleInsurance: Math.round(titleInsurance), escrowFees, recordingFees,
        inspectionFee, prepaidInsurance, prepaidTaxes: Math.round(prepaidTaxes),
        totalClosingCosts: Math.round(totalClosingCosts),
        totalCashNeeded: Math.round(downPayment + totalClosingCosts),
        percentOfPrice: Math.round((totalClosingCosts / purchasePrice) * 10000) / 100,
    };
}
