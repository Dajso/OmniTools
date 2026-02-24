/**
 * Egg Size Converter
 * @module lib/calculations/baking/egg-size-converter
 */

export type EggSize = 'jumbo' | 'extra-large' | 'large' | 'medium' | 'small';

/** Average weight per egg in grams (without shell) */
const EGG_WEIGHTS: Record<EggSize, number> = {
    'jumbo': 63,
    'extra-large': 56,
    'large': 50,
    'medium': 44,
    'small': 38,
};

const EGG_LABELS: Record<EggSize, string> = {
    'jumbo': 'Jumbo',
    'extra-large': 'Extra Large',
    'large': 'Large',
    'medium': 'Medium',
    'small': 'Small',
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
    if (recipeCount <= 0) throw new Error('Egg count must be positive');

    const recipeWeightG = recipeCount * EGG_WEIGHTS[recipeSize];
    const eggsNeeded = recipeWeightG / EGG_WEIGHTS[availableSize];
    const eggsRounded = Math.round(eggsNeeded);

    const explanation = `${recipeCount} ${EGG_LABELS[recipeSize]} egg(s) = ${recipeWeightG}g total. Use ${eggsRounded} ${EGG_LABELS[availableSize]} egg(s) (${eggsRounded * EGG_WEIGHTS[availableSize]}g).`;

    return {
        eggsNeeded: Math.round(eggsNeeded * 100) / 100,
        eggsRounded,
        recipeWeightG,
        availableWeightG: eggsRounded * EGG_WEIGHTS[availableSize],
        explanation,
    };
}

export { EGG_WEIGHTS, EGG_LABELS };
