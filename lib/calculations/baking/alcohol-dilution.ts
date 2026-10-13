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
    finalVolumeMl: number;
}

export function calculateAlcoholDilution(input: AlcoholDilutionInput): AlcoholDilutionResult {
    const { volumeMl, currentABV, targetABV } = input;

    if (volumeMl <= 0) throw new Error('Volumet må være større enn null');
    if (currentABV <= 0 || currentABV > 100) throw new Error('Nåværende alkoholstyrke må være mellom 1 og 100 %');
    if (targetABV <= 0 || targetABV >= currentABV) throw new Error('Ønsket styrke må være lavere enn nåværende styrke');

    // Pure alcohol volume stays constant
    // V1 × ABV1 = V2 × ABV2
    // V2 = V1 × ABV1 / ABV2
    const finalVolumeMl = (volumeMl * currentABV) / targetABV;
    const waterToAddMl = finalVolumeMl - volumeMl;

    return {
        waterToAddMl: Math.round(waterToAddMl * 10) / 10,
        finalVolumeMl: Math.round(finalVolumeMl * 10) / 10,
    };
}
