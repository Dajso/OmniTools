/**
 * Eggstørrelse (norske størrelser S, M, L og XL)
 * @module lib/calculations/baking/egg-size-converter
 */

export type EggSize = 'extra-large' | 'large' | 'medium' | 'small';

/** Gjennomsnittlig vekt av spiselig innhold per egg i gram (uten skall) */
const EGG_WEIGHTS: Record<EggSize, number> = {
    'extra-large': 69,
    'large': 60,
    'medium': 51,
    'small': 42,
};

const EGG_LABELS: Record<EggSize, string> = {
    'extra-large': 'XL',
    'large': 'L',
    'medium': 'M',
    'small': 'S',
};

export interface EggSizeConversionInput {
    recipeCount: number;
    recipeSize: EggSize;
    availableSize: EggSize;
}

export interface EggSizeConversionResult {
    eggsNeeded: number;
    eggsRounded: number;
    recipeWeightG: number;
    availableWeightG: number;
    explanation: string;
}

export function calculateEggConversion(input: EggSizeConversionInput): EggSizeConversionResult {
    const { recipeCount, recipeSize, availableSize } = input;
    if (recipeCount <= 0) throw new Error('Antall egg må være større enn null');

    const recipeWeightG = recipeCount * EGG_WEIGHTS[recipeSize];
    const eggsNeeded = recipeWeightG / EGG_WEIGHTS[availableSize];
    const eggsRounded = Math.round(eggsNeeded);

    const explanation = `${recipeCount} egg i størrelse ${EGG_LABELS[recipeSize]} veier ${recipeWeightG} g til sammen. Bruk ${eggsRounded} egg i størrelse ${EGG_LABELS[availableSize]} (${eggsRounded * EGG_WEIGHTS[availableSize]} g).`;

    return {
        eggsNeeded: Math.round(eggsNeeded * 100) / 100,
        eggsRounded,
        recipeWeightG,
        availableWeightG: eggsRounded * EGG_WEIGHTS[availableSize],
        explanation,
    };
}

export { EGG_WEIGHTS, EGG_LABELS };
