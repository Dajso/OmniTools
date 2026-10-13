/**
 * Forholdsmessig husleie
 */
export interface ProratedRentInput {
    monthlyRent: number;
    moveInDay: number; // 1-31
    daysInMonth: number; // 28-31
}
export interface ProratedRentResult {
    dailyRate: number;
    remainingDays: number;
    proratedAmount: number;
}
export function calculateProratedRent(input: ProratedRentInput): ProratedRentResult {
    const { monthlyRent, moveInDay, daysInMonth } = input;
    if (monthlyRent <= 0) throw new Error('Husleia må være større enn null');
    if (moveInDay < 1 || moveInDay > daysInMonth) throw new Error('Ugyldig innflyttingsdag');
    const dailyRate = monthlyRent / daysInMonth;
    const remainingDays = daysInMonth - moveInDay + 1;
    const proratedAmount = dailyRate * remainingDays;
    return { dailyRate: Math.round(dailyRate * 100) / 100, remainingDays, proratedAmount: Math.round(proratedAmount * 100) / 100 };
}
