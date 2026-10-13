/**
 * Salt Mix Calculator
 * Calculate salt mix needed for target salinity in marine aquariums.
 * @module lib/calculations/aquarium/salt-mix
 */

export const SALT_BRANDS: Record<string, { name: string; gramsPerLiter: number }> = {
    'instant-ocean': { name: 'Instant Ocean', gramsPerLiter: 9.5 },
    'red-sea-coral-pro': { name: 'Red Sea Coral Pro', gramsPerLiter: 10.3 },
    'fritz-rpm': { name: 'Fritz RPM', gramsPerLiter: 9.8 },
    'tropic-marin': { name: 'Tropic Marin Pro Reef', gramsPerLiter: 10.0 },
    'hw-reefer': { name: 'HW Reefer', gramsPerLiter: 10.6 },
    'custom': { name: 'Egendefinert', gramsPerLiter: 9.8 },
};

export interface SaltMixInput {
    /** Volume of water in liters */
    volumeLiters: number;
    /** Target specific gravity (e.g. 1.025) */
    targetSG: number;
    /** Salt brand key */
    brand: string;
    /** Egendefinert gram salt per liter (hvis brand='custom') */
    customGramsPerLiter?: number;
}

export interface SaltMixResult {
    saltGrams: number;
    saltKg: number;
    gramsPerLiter: number;
    targetSalinityPPT: number;
}

export function calculateSaltMix(input: SaltMixInput): SaltMixResult {
    const { volumeLiters, targetSG, brand, customGramsPerLiter } = input;

    if (volumeLiters <= 0) throw new Error('Volumet må være positivt');
    if (targetSG < 1.0 || targetSG > 1.04) throw new Error('Egenvekten bør være mellom 1,000 og 1,040');

    const gramsPerLiter = brand === 'custom' && customGramsPerLiter
        ? customGramsPerLiter
        : (SALT_BRANDS[brand]?.gramsPerLiter ?? 9.8);

    // Scale based on target SG (1.025 = full strength natural seawater = 35 ppt)
    const salinityFactor = (targetSG - 1.0) / 0.025;
    const saltGrams = volumeLiters * gramsPerLiter * salinityFactor;

    // 35 ppt at SG 1.025
    const targetSalinityPPT = salinityFactor * 35;

    return {
        saltGrams: Math.round(saltGrams),
        saltKg: Math.round(saltGrams / 10) / 100,
        gramsPerLiter: Math.round(volumeLiters > 0 ? (saltGrams / volumeLiters) * 10 : 0) / 10,
        targetSalinityPPT: Math.round(targetSalinityPPT * 10) / 10,
    };
}
