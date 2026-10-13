/**
 * Utleie på Airbnb: overskudd
 * @module lib/calculations/realestate/airbnb-profit
 */
export interface AirbnbInput {
    nightlyRate: number;
    cleaningFee: number;
    occupancyRate: number; // 0–100
    daysPerMonth: number;
    monthlyExpenses: number; // lånekostnader, strøm, forsikring, vedlikehold, felleskostnader
    platformFeePercent: number;
    /** Skatt på overskudd i prosent (22 % alminnelig inntekt). Standard 0 for bakoverkompatibilitet. */
    taxPercent?: number;
}

export interface AirbnbResult {
    grossRevenue: number;
    cleaningIncome: number;
    platformFees: number;
    netRevenue: number;
    monthlyProfit: number;
    annualProfit: number;
    annualTax: number;
    annualProfitAfterTax: number;
}

export function calculateAirbnbProfit(input: AirbnbInput): AirbnbResult {
    const { nightlyRate, cleaningFee, occupancyRate, daysPerMonth, monthlyExpenses, platformFeePercent, taxPercent = 0 } = input;
    if (occupancyRate < 0 || occupancyRate > 100) throw new Error('Belegget må være mellom 0 og 100 %');

    const bookedNights = Math.round(daysPerMonth * (occupancyRate / 100));
    const staysPerMonth = Math.ceil(bookedNights / 3); // antar 3 netter per opphold
    const grossRevenue = bookedNights * nightlyRate;
    const cleaningIncome = staysPerMonth * cleaningFee;
    const totalRevenue = grossRevenue + cleaningIncome;
    const platformFees = totalRevenue * (platformFeePercent / 100);
    const netRevenue = totalRevenue - platformFees;
    const monthlyProfit = netRevenue - monthlyExpenses;
    const annualProfit = monthlyProfit * 12;
    const annualTax = Math.max(0, annualProfit) * (taxPercent / 100);

    return {
        grossRevenue: Math.round(grossRevenue),
        cleaningIncome: Math.round(cleaningIncome),
        platformFees: Math.round(platformFees),
        netRevenue: Math.round(netRevenue),
        monthlyProfit: Math.round(monthlyProfit),
        annualProfit: Math.round(annualProfit),
        annualTax: Math.round(annualTax),
        annualProfitAfterTax: Math.round(annualProfit - annualTax),
    };
}
