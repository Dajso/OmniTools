/**
 * Inverter Size Calculator
 * @module lib/calculations/solar/inverter-size
 */

export interface InverterSizeInput {
    appliances: Array<{
        name: string;
        watts: number;
        quantity: number;
        /** Surge multiplier (e.g. 3× for motors) */
        surgeMultiplier: number;
    }>;
    /** Safety margin (%) */
    safetyMargin: number;
}

export interface InverterSizeResult {
    continuousWatts: number;
    surgeWatts: number;
    recommendedInverterW: number;
    recommendedInverterVA: number;
}

export function calculateInverterSize(input: InverterSizeInput): InverterSizeResult {
    const { appliances, safetyMargin } = input;

    const continuousWatts = appliances.reduce((s, a) => s + a.watts * a.quantity, 0);
    const surgeWatts = appliances.reduce((s, a) => s + a.watts * a.quantity * a.surgeMultiplier, 0);

    if (continuousWatts <= 0) throw new Error('Total wattage must be positive');

    const withMargin = continuousWatts * (1 + safetyMargin / 100);

    // Round up to common inverter sizes
    const sizes = [300, 500, 750, 1000, 1500, 2000, 3000, 4000, 5000, 6000, 8000, 10000, 12000];
    const recommendedW = sizes.find(s => s >= withMargin) ?? Math.ceil(withMargin / 1000) * 1000;

    // VA ≈ Watts / 0.8 power factor
    const recommendedVA = Math.round(recommendedW / 0.8);

    return {
        continuousWatts: Math.round(continuousWatts),
        surgeWatts: Math.round(surgeWatts),
        recommendedInverterW: recommendedW,
        recommendedInverterVA: recommendedVA,
    };
}
