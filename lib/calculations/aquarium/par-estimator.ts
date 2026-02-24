/**
 * Light Intensity (PAR) Estimator
 * Estimate PAR attenuation through water depth.
 * PAR at depth = Surface PAR × e^(-k × depth)
 * @module lib/calculations/aquarium/par-estimator
 */

export const WATER_CLARITY: Record<string, { name: string; k: number }> = {
    'crystal-clear': { name: 'Crystal Clear', k: 0.02 },
    'clear': { name: 'Clear (typical)', k: 0.04 },
    'slightly-tinted': { name: 'Slightly Tinted', k: 0.06 },
    'tannin-stained': { name: 'Tannin Stained', k: 0.10 },
    'green-water': { name: 'Green Water (algae)', k: 0.15 },
};

export interface PAREstimatorInput {
    /** Surface PAR in µmol/m²/s */
    surfacePAR: number;
    /** Water depth in cm */
    depthCm: number;
    /** Water clarity key */
    clarity: string;
    /** Custom attenuation coefficient (if clarity='custom') */
    customK?: number;
}

export interface PAREstimatorResult {
    /** PAR at substrate level */
    parAtDepth: number;
    /** Percentage of light remaining */
    percentRemaining: number;
    /** Light level category */
    lightLevel: string;
    /** Suitable plants */
    suitablePlants: string;
}

export function calculatePAR(input: PAREstimatorInput): PAREstimatorResult {
    const { surfacePAR, depthCm, clarity, customK } = input;

    if (surfacePAR <= 0) throw new Error('Surface PAR must be positive');
    if (depthCm <= 0) throw new Error('Depth must be positive');

    const k = clarity === 'custom' && customK ? customK : (WATER_CLARITY[clarity]?.k ?? 0.04);

    // Beer-Lambert law: I = I₀ × e^(-k × d)
    const depthM = depthCm / 100;
    const parAtDepth = surfacePAR * Math.exp(-k * depthCm);
    const percentRemaining = (parAtDepth / surfacePAR) * 100;

    let lightLevel: string;
    let suitablePlants: string;

    if (parAtDepth >= 150) {
        lightLevel = 'Very High';
        suitablePlants = 'Demanding carpeting plants (HC Cuba, Monte Carlo, Glossostigma)';
    } else if (parAtDepth >= 80) {
        lightLevel = 'High';
        suitablePlants = 'Most stem plants, red plants (Rotala, Ludwigia)';
    } else if (parAtDepth >= 40) {
        lightLevel = 'Medium';
        suitablePlants = 'Cryptocoryne, Echinodorus, Vallisneria, Java Fern';
    } else if (parAtDepth >= 15) {
        lightLevel = 'Low';
        suitablePlants = 'Anubias, Java Moss, Bucephalandra';
    } else {
        lightLevel = 'Very Low';
        suitablePlants = 'Most plants will struggle at this light level';
    }

    return {
        parAtDepth: Math.round(parAtDepth * 10) / 10,
        percentRemaining: Math.round(percentRemaining * 10) / 10,
        lightLevel,
        suitablePlants,
    };
}
