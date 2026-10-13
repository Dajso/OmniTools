/**
 * Light Intensity (PAR) Estimator
 * Estimate PAR attenuation through water depth.
 * PAR at depth = Surface PAR × e^(-k × depth)
 * @module lib/calculations/aquarium/par-estimator
 */

export const WATER_CLARITY: Record<string, { name: string; k: number }> = {
    'crystal-clear': { name: 'Krystallklart', k: 0.02 },
    'clear': { name: 'Klart (vanlig)', k: 0.04 },
    'slightly-tinted': { name: 'Svakt farget', k: 0.06 },
    'tannin-stained': { name: 'Tanninfarget', k: 0.10 },
    'green-water': { name: 'Grønt vann (alger)', k: 0.15 },
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

    if (surfacePAR <= 0) throw new Error('PAR ved overflaten må være positiv');
    if (depthCm <= 0) throw new Error('Dybden må være positiv');

    const k = clarity === 'custom' && customK ? customK : (WATER_CLARITY[clarity]?.k ?? 0.04);

    // Beer-Lambert law: I = I₀ × e^(-k × d)
    const depthM = depthCm / 100;
    const parAtDepth = surfacePAR * Math.exp(-k * depthCm);
    const percentRemaining = (parAtDepth / surfacePAR) * 100;

    let lightLevel: string;
    let suitablePlants: string;

    if (parAtDepth >= 150) {
        lightLevel = 'Svært høyt';
        suitablePlants = 'Krevende teppeplanter (HC Cuba, Monte Carlo, Glossostigma)';
    } else if (parAtDepth >= 80) {
        lightLevel = 'Høyt';
        suitablePlants = 'De fleste stengelplanter og røde planter (Rotala, Ludwigia)';
    } else if (parAtDepth >= 40) {
        lightLevel = 'Middels';
        suitablePlants = 'Cryptocoryne, Echinodorus, Vallisneria, javaving';
    } else if (parAtDepth >= 15) {
        lightLevel = 'Lavt';
        suitablePlants = 'Anubias, javamose, Bucephalandra';
    } else {
        lightLevel = 'Svært lavt';
        suitablePlants = 'De fleste planter vil slite med så lite lys';
    }

    return {
        parAtDepth: Math.round(parAtDepth * 10) / 10,
        percentRemaining: Math.round(percentRemaining * 10) / 10,
        lightLevel,
        suitablePlants,
    };
}
