/**
 * Substrate Calculator
 * Calculate substrate weight needed for desired depth.
 * @module lib/calculations/aquarium/substrate
 */

export const SUBSTRATE_TYPES: Record<string, { name: string; density: number }> = {
    'gravel': { name: 'Gravel', density: 1.6 },
    'sand': { name: 'Sand', density: 1.5 },
    'aquasoil': { name: 'Aqua Soil (ADA etc.)', density: 1.0 },
    'fluorite': { name: 'Seachem Fluorite', density: 1.3 },
    'eco-complete': { name: 'Eco-Complete', density: 1.2 },
    'crushed-coral': { name: 'Crushed Coral', density: 1.4 },
    'custom': { name: 'Custom', density: 1.5 },
};

export interface SubstrateInput {
    /** Tank length in cm */
    length: number;
    /** Tank width in cm */
    width: number;
    /** Desired substrate depth in cm */
    depth: number;
    /** Substrate type key */
    substrateType: string;
    /** Custom density in kg/L (only if substrateType is 'custom') */
    customDensity?: number;
}

export interface SubstrateResult {
    volumeLiters: number;
    weightKg: number;
    weightLbs: number;
}

export function calculateSubstrate(input: SubstrateInput): SubstrateResult {
    const { length, width, depth, substrateType, customDensity } = input;

    if (length <= 0 || width <= 0 || depth <= 0) {
        throw new Error('All dimensions must be positive');
    }

    const density = substrateType === 'custom' && customDensity
        ? customDensity
        : (SUBSTRATE_TYPES[substrateType]?.density ?? 1.5);

    const volumeCm3 = length * width * depth;
    const volumeLiters = volumeCm3 / 1000;
    const weightKg = volumeLiters * density;

    return {
        volumeLiters,
        weightKg,
        weightLbs: weightKg * 2.20462,
    };
}
