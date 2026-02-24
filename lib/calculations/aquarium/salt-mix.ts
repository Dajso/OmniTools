/**
 * Salt Mix Calculator
 * Calculate salt mix needed for target salinity in marine aquariums.
 * @module lib/calculations/aquarium/salt-mix
 */

export const SALT_BRANDS: Record<string, { name: string; gramsPerGallon: number }> = {
    'instant-ocean': { name: 'Instant Ocean', gramsPerGallon: 36 },
    'red-sea-coral-pro': { name: 'Red Sea Coral Pro', gramsPerGallon: 39 },
    'fritz-rpm': { name: 'Fritz RPM', gramsPerGallon: 37 },
    'tropic-marin': { name: 'Tropic Marin Pro Reef', gramsPerGallon: 38 },
    'hw-reefer': { name: 'HW Reefer', gramsPerGallon: 40 },
    'custom': { name: 'Custom', gramsPerGallon: 37 },
};

export interface SaltMixInput {
    /** Volume of water in liters */
    volumeLiters: number;
    /** Target specific gravity (e.g. 1.025) */
    targetSG: number;
    /** Salt brand key */
    brand: string;
    /** Custom grams per gallon (if brand='custom') */
    customGramsPerGallon?: number;
}

export interface SaltMixResult {
    saltGrams: number;
    saltKg: number;
    saltOz: number;
    saltCups: number;
    targetSalinityPPT: number;
}

export function calculateSaltMix(input: SaltMixInput): SaltMixResult {
    const { volumeLiters, targetSG, brand, customGramsPerGallon } = input;

    if (volumeLiters <= 0) throw new Error('Volume must be positive');
    if (targetSG < 1.0 || targetSG > 1.04) throw new Error('Specific gravity should be between 1.000 and 1.040');

    const gramsPerGallon = brand === 'custom' && customGramsPerGallon
        ? customGramsPerGallon
        : (SALT_BRANDS[brand]?.gramsPerGallon ?? 37);

    // Convert liters to US gallons
    const gallons = volumeLiters / 3.78541;

    // Scale based on target SG (1.025 = full strength natural seawater = 35 ppt)
    const salinityFactor = (targetSG - 1.0) / 0.025;
    const saltGrams = gallons * gramsPerGallon * salinityFactor;

    // 35 ppt at SG 1.025
    const targetSalinityPPT = salinityFactor * 35;

    return {
        saltGrams: Math.round(saltGrams),
        saltKg: Math.round(saltGrams / 10) / 100,
        saltOz: Math.round(saltGrams / 28.3495 * 10) / 10,
        saltCups: Math.round(saltGrams / 280 * 10) / 10, // ~280g per cup for salt mix
        targetSalinityPPT: Math.round(targetSalinityPPT * 10) / 10,
    };
}
