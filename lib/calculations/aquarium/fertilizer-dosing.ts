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

    if (volumeLiters <= 0) throw new Error('Volumet må være positivt');

    // EI standard is based on ~40 gallon (150L) reference
    const factor = volumeLiters / 150;

    const macroDoses: EIDose[] = [
        {
            compound: 'Kaliumnitrat',
            formula: 'KNO3',
            gramsPerDose: Math.round(factor * 2.5 * 100) / 100,
            dosesPerWeek: 3,
            totalGramsPerWeek: Math.round(factor * 7.5 * 100) / 100,
            targetPPM: 'ca. 7,5 ppm NO3 per dose',
        },
        {
            compound: 'Monokaliumfosfat',
            formula: 'KH2PO4',
            gramsPerDose: Math.round(factor * 0.5 * 100) / 100,
            dosesPerWeek: 3,
            totalGramsPerWeek: Math.round(factor * 1.5 * 100) / 100,
            targetPPM: 'ca. 1,3 ppm PO4 per dose',
        },
        {
            compound: 'Kaliumsulfat',
            formula: 'K2SO4',
            gramsPerDose: Math.round(factor * 3.7 * 100) / 100,
            dosesPerWeek: 3,
            totalGramsPerWeek: Math.round(factor * 11.1 * 100) / 100,
            targetPPM: 'ca. 10 ppm K per dose',
        },
    ];

    const microDose: EIDose = {
        compound: 'Sporstoffmiks (CSM+B)',
        formula: 'CSM+B',
        gramsPerDose: Math.round(factor * 1.25 * 100) / 100,
        dosesPerWeek: 3,
        totalGramsPerWeek: Math.round(factor * 3.75 * 100) / 100,
        targetPPM: 'ca. 0,5 ppm Fe per dose',
    };

    const weeklySchedule = 'Dag 1: makro | Dag 2: mikro | Dag 3: makro | Dag 4: mikro | Dag 5: makro | Dag 6: mikro | Dag 7: 50 % vannskifte';

    return { macroDoses, microDose, weeklySchedule };
}
