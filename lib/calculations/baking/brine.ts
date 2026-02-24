/**
 * Brine Calculator
 * @module lib/calculations/baking/brine
 */

export interface BrineInput {
    /** Water volume in cups */
    waterCups: number;
    /** Salt percentage by weight (typical 3-10%) */
    saltPercent: number;
}

export interface BrineResult {
    waterOz: number;
    waterMl: number;
    saltOz: number;
    saltG: number;
    saltTbsp: number;
    concentration: string;
}

export function calculateBrine(input: BrineInput): BrineResult {
    const { waterCups, saltPercent } = input;
    if (waterCups <= 0) throw new Error('Water volume must be positive');
    if (saltPercent <= 0 || saltPercent > 26) throw new Error('Salt percent must be 1–26%');

    // 1 cup water = 8 oz = ~236.6 mL = ~236.6 g
    const waterMl = waterCups * 236.6;
    const waterOz = waterCups * 8;
    const waterG = waterMl; // water density ≈ 1 g/mL

    // salt weight = water weight × (percent / (100 - percent)) for true % by weight
    const saltG = waterG * (saltPercent / (100 - saltPercent));
    const saltOz = saltG / 28.35;
    // 1 Tbsp table salt ≈ 18g
    const saltTbsp = saltG / 18;

    let concentration: string;
    if (saltPercent <= 3) concentration = 'Light brine — poultry, pork chops';
    else if (saltPercent <= 6) concentration = 'Medium brine — whole chickens, ribs';
    else if (saltPercent <= 10) concentration = 'Heavy brine — corned beef, pickles';
    else concentration = 'Very heavy — fermentation, preservation';

    return {
        waterOz: Math.round(waterOz * 10) / 10,
        waterMl: Math.round(waterMl),
        saltOz: Math.round(saltOz * 10) / 10,
        saltG: Math.round(saltG),
        saltTbsp: Math.round(saltTbsp * 10) / 10,
        concentration,
    };
}
