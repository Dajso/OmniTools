/**
 * Fertilizer Dosing Calculator (EI Method)
 * Estimative Index dosing for planted aquariums.
 * @module lib/calculations/aquarium/fertilizer-dosing
 */

export interface FertilizerDosingInput {
    /** Tank volume in liters */
    volumeLiters: number;
}

export interface EIDose {
    compound: string;
    formula: string;
    gramsPerDose: number;
    dosesPerWeek: number;
    totalGramsPerWeek: number;
    targetPPM: string;
}

export interface FertilizerDosingResult {
    macroDoses: EIDose[];
    microDose: EIDose;
    weeklySchedule: string;
}

/**
 * Standard EI dosing targets (per dose, 3× per week for macros):
 * KNO3: 7.5 ppm NO3 per dose → ~1/4 tsp per 10 gal
 * KH2PO4: 1.3 ppm PO4 per dose
 * K2SO4: 10 ppm K per dose
 * Trace: follow product dosing
 */
export function calculateFertilizerDosing(input: FertilizerDosingInput): FertilizerDosingResult {
    const { volumeLiters } = input;

    if (volumeLiters <= 0) throw new Error('Volume must be positive');

    // EI standard is based on ~40 gallon (150L) reference
    const factor = volumeLiters / 150;

    const macroDoses: EIDose[] = [
        {
            compound: 'Potassium Nitrate',
            formula: 'KNO3',
            gramsPerDose: Math.round(factor * 2.5 * 100) / 100,
            dosesPerWeek: 3,
            totalGramsPerWeek: Math.round(factor * 7.5 * 100) / 100,
            targetPPM: '~7.5 ppm NO3 per dose',
        },
        {
            compound: 'Monopotassium Phosphate',
            formula: 'KH2PO4',
            gramsPerDose: Math.round(factor * 0.5 * 100) / 100,
            dosesPerWeek: 3,
            totalGramsPerWeek: Math.round(factor * 1.5 * 100) / 100,
            targetPPM: '~1.3 ppm PO4 per dose',
        },
        {
            compound: 'Potassium Sulfate',
            formula: 'K2SO4',
            gramsPerDose: Math.round(factor * 3.7 * 100) / 100,
            dosesPerWeek: 3,
            totalGramsPerWeek: Math.round(factor * 11.1 * 100) / 100,
            targetPPM: '~10 ppm K per dose',
        },
    ];

    const microDose: EIDose = {
        compound: 'Trace Mix (CSM+B)',
        formula: 'CSM+B',
        gramsPerDose: Math.round(factor * 1.25 * 100) / 100,
        dosesPerWeek: 3,
        totalGramsPerWeek: Math.round(factor * 3.75 * 100) / 100,
        targetPPM: '~0.5 ppm Fe per dose',
    };

    const weeklySchedule = 'Day 1: Macros | Day 2: Micros | Day 3: Macros | Day 4: Micros | Day 5: Macros | Day 6: Micros | Day 7: 50% water change';

    return { macroDoses, microDose, weeklySchedule };
}
