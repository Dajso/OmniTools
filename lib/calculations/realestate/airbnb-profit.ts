/**
 * Airbnb Profit Estimator
 */
export interface AirbnbInput {
    nightlyRate: number;
    cleaningFee: number;
    occupancyRate: number; // 0-100
    daysPerMonth: number;
    monthlyExpenses: number; // mortgage, util, insurance, maintenance
    platformFeePercent: number; // Airbnb ~3%
}
export interface AirbnbResult {
    grossRevenue: number;
    cleaningIncome: number;
    platformFees: number;
    netRevenue: number;
    monthlyProfit: number;
    annualProfit: number;
}
export function calculateAirbnbProfit(input: AirbnbInput): AirbnbResult {
    const { nightlyRate, cleaningFee, occupancyRate, daysPerMonth, monthlyExpenses, platformFeePercent } = input;
    const bookedNights = Math.round(daysPerMonth * (occupancyRate / 100));
    const staysPerMonth = Math.ceil(bookedNights / 3); // assume avg 3-night stay
    const grossRevenue = bookedNights * nightlyRate;
    const cleaningIncome = staysPerMonth * cleaningFee;
    const totalRevenue = grossRevenue + cleaningIncome;
    const platformFees = totalRevenue * (platformFeePercent / 100);
    const netRevenue = totalRevenue - platformFees;
    const monthlyProfit = netRevenue - monthlyExpenses;
    return {
        grossRevenue: Math.round(grossRevenue), cleaningIncome: Math.round(cleaningIncome),
        platformFees: Math.round(platformFees), netRevenue: Math.round(netRevenue),
        monthlyProfit: Math.round(monthlyProfit), annualProfit: Math.round(monthlyProfit * 12),
    };
}
