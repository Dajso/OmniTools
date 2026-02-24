/**
 * Sourdough Hydration Calculator
 * Hydration % = (Total Water / Total Flour) × 100
 * Starter contributes both flour and water (typically 50/50).
 * @module lib/calculations/baking/sourdough-hydration
 */

export interface SourdoughHydrationInput {
    /** Total flour weight in grams (not including starter flour) */
    flourG: number;
    /** Total water weight in grams (not including starter water) */
    waterG: number;
    /** Starter weight in grams */
    starterG: number;
    /** Starter hydration % (default 100 = equal flour and water) */
    starterHydration: number;
    /** Additional flour additions (whole wheat, rye, etc.) in grams */
    additionalFlourG: number;
}

export interface SourdoughHydrationResult {
    totalFlour: number;
    totalWater: number;
    hydrationPercent: number;
    totalDoughWeight: number;
    starterFlour: number;
    starterWater: number;
}

export function calculateSourdoughHydration(input: SourdoughHydrationInput): SourdoughHydrationResult {
    const { flourG, waterG, starterG, starterHydration, additionalFlourG } = input;

    if (flourG < 0 || waterG < 0 || starterG < 0) throw new Error('Values must be non-negative');

    // Starter breakdown: starter = starterFlour + starterWater
    // starterHydration = starterWater / starterFlour × 100
    // starterFlour = starter / (1 + hydration/100)
    const starterFlour = starterG / (1 + starterHydration / 100);
    const starterWater = starterG - starterFlour;

    const totalFlour = flourG + additionalFlourG + starterFlour;
    const totalWater = waterG + starterWater;

    if (totalFlour <= 0) throw new Error('Total flour must be positive');

    const hydrationPercent = (totalWater / totalFlour) * 100;
    const totalDoughWeight = totalFlour + totalWater;

    return {
        totalFlour: Math.round(totalFlour),
        totalWater: Math.round(totalWater),
        hydrationPercent: Math.round(hydrationPercent * 10) / 10,
        totalDoughWeight: Math.round(totalDoughWeight),
        starterFlour: Math.round(starterFlour),
        starterWater: Math.round(starterWater),
    };
}
