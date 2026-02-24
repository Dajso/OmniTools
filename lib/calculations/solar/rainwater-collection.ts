/**
 * Rainwater Collection Calculator
 * Volume = Roof Area × Rainfall × Collection Efficiency
 * @module lib/calculations/solar/rainwater-collection
 */

export interface RainwaterCollectionInput {
    /** Roof catchment area in sq ft */
    roofAreaSqFt: number;
    /** Annual rainfall in inches */
    annualRainfallInches: number;
    /** Collection efficiency (%), accounts for losses */
    efficiencyPercent: number;
}

export interface RainwaterCollectionResult {
    annualGallons: number;
    monthlyGallons: number;
    annualLiters: number;
    monthlyLiters: number;
    explanation: string;
}

export function calculateRainwaterCollection(input: RainwaterCollectionInput): RainwaterCollectionResult {
    const { roofAreaSqFt, annualRainfallInches, efficiencyPercent } = input;

    if (roofAreaSqFt <= 0) throw new Error('Roof area must be positive');
    if (annualRainfallInches <= 0) throw new Error('Rainfall must be positive');

    const efficiency = efficiencyPercent / 100;

    // 1 inch of rain on 1 sq ft = 0.623 gallons
    const annualGallons = roofAreaSqFt * annualRainfallInches * 0.623 * efficiency;
    const monthlyGallons = annualGallons / 12;
    const annualLiters = annualGallons * 3.78541;
    const monthlyLiters = annualLiters / 12;

    const avgPersonDaily = 80; // gallons per day
    const daysSupplied = annualGallons / avgPersonDaily;
    const explanation = `This is enough water to supply one person for approximately ${Math.round(daysSupplied)} days (at 80 gal/day average).`;

    return {
        annualGallons: Math.round(annualGallons),
        monthlyGallons: Math.round(monthlyGallons),
        annualLiters: Math.round(annualLiters),
        monthlyLiters: Math.round(monthlyLiters),
        explanation,
    };
}
