/**
 * Alcohol Dilution Calculator
 * Dilute high-proof spirits to target ABV.
 * @module lib/calculations/baking/alcohol-dilution
 */

export interface AlcoholDilutionInput {
    /** Volume of spirit in mL */
    volumeMl: number;
    /** Current ABV % */
    currentABV: number;
    /** Target ABV % */
    targetABV: number;
}

export interface AlcoholDilutionResult {
    waterToAddMl: number;
    waterToAddOz: number;
    finalVolumeMl: number;
    finalVolumeOz: number;
}

export function calculateAlcoholDilution(input: AlcoholDilutionInput): AlcoholDilutionResult {
    const { volumeMl, currentABV, targetABV } = input;

    if (volumeMl <= 0) throw new Error('Volume must be positive');
    if (currentABV <= 0 || currentABV > 100) throw new Error('Current ABV must be 1-100%');
    if (targetABV <= 0 || targetABV >= currentABV) throw new Error('Target ABV must be less than current ABV');

    // Pure alcohol volume stays constant
    // V1 × ABV1 = V2 × ABV2
    // V2 = V1 × ABV1 / ABV2
    const finalVolumeMl = (volumeMl * currentABV) / targetABV;
    const waterToAddMl = finalVolumeMl - volumeMl;

    return {
        waterToAddMl: Math.round(waterToAddMl * 10) / 10,
        waterToAddOz: Math.round((waterToAddMl / 29.5735) * 10) / 10,
        finalVolumeMl: Math.round(finalVolumeMl * 10) / 10,
        finalVolumeOz: Math.round((finalVolumeMl / 29.5735) * 10) / 10,
    };
}
