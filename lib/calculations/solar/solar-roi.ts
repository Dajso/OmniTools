/**
 * Solar ROI Calculator
 * @module lib/calculations/solar/solar-roi
 */

export interface SolarROIInput {
    /** Total system cost ($) */
    systemCost: number;
    /** Annual energy production (kWh) */
    annualProductionKWh: number;
    /** Electricity rate ($/kWh) */
    electricityRate: number;
    /** Annual rate increase (%) */
    rateIncreasePercent: number;
    /** System lifespan (years) */
    lifespanYears: number;
    /** Annual maintenance cost ($) */
    maintenanceCost: number;
    /** Incentive/rebate amount ($) */
    incentive: number;
}

export interface SolarROIResult {
    netCost: number;
    paybackYears: number;
    totalSavings25yr: number;
    roi: number;
    annualSavingsYear1: number;
    yearlySavings: Array<{ year: number; savings: number; cumulative: number }>;
}

export function calculateSolarROI(input: SolarROIInput): SolarROIResult {
    const { systemCost, annualProductionKWh, electricityRate, rateIncreasePercent, lifespanYears, maintenanceCost, incentive } = input;

    if (systemCost <= 0) throw new Error('System cost must be positive');
    if (annualProductionKWh <= 0) throw new Error('Production must be positive');
    if (electricityRate <= 0) throw new Error('Rate must be positive');

    const netCost = systemCost - incentive;
    const annualSavingsYear1 = annualProductionKWh * electricityRate - maintenanceCost;

    let cumulative = 0;
    let paybackYears = lifespanYears;
    let paybackFound = false;
    const yearlySavings: Array<{ year: number; savings: number; cumulative: number }> = [];

    for (let y = 1; y <= lifespanYears; y++) {
        const rate = electricityRate * Math.pow(1 + rateIncreasePercent / 100, y - 1);
        const savings = annualProductionKWh * rate - maintenanceCost;
        cumulative += savings;
        yearlySavings.push({ year: y, savings: Math.round(savings), cumulative: Math.round(cumulative) });

        if (!paybackFound && cumulative >= netCost) {
            // Interpolate
            const prevCum = cumulative - savings;
            const fraction = (netCost - prevCum) / savings;
            paybackYears = y - 1 + fraction;
            paybackFound = true;
        }
    }

    const totalSavings25yr = cumulative;
    const roi = ((totalSavings25yr - netCost) / netCost) * 100;

    return {
        netCost: Math.round(netCost),
        paybackYears: Math.round(paybackYears * 10) / 10,
        totalSavings25yr: Math.round(totalSavings25yr),
        roi: Math.round(roi),
        annualSavingsYear1: Math.round(annualSavingsYear1),
        yearlySavings,
    };
}
