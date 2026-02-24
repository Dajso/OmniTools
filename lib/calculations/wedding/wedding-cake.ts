/**
 * Wedding Cake Serving Calculator
 */
export interface WeddingCakeInput { guests: number; }
export interface CakeTier { size: number; servings: number; }
export interface WeddingCakeResult {
    tiers: CakeTier[];
    totalServings: number;
    tierCount: number;
}
const TIER_CONFIGS: Array<{ maxGuests: number; tiers: CakeTier[] }> = [
    { maxGuests: 30, tiers: [{ size: 10, servings: 38 }] },
    { maxGuests: 60, tiers: [{ size: 8, servings: 24 }, { size: 12, servings: 40 }] },
    { maxGuests: 100, tiers: [{ size: 6, servings: 12 }, { size: 10, servings: 38 }, { size: 14, servings: 63 }] },
    { maxGuests: 150, tiers: [{ size: 6, servings: 12 }, { size: 8, servings: 24 }, { size: 10, servings: 38 }, { size: 14, servings: 63 }] },
    { maxGuests: 200, tiers: [{ size: 6, servings: 12 }, { size: 8, servings: 24 }, { size: 10, servings: 38 }, { size: 12, servings: 56 }, { size: 16, servings: 100 }] },
    { maxGuests: 9999, tiers: [{ size: 6, servings: 12 }, { size: 8, servings: 24 }, { size: 10, servings: 38 }, { size: 12, servings: 56 }, { size: 14, servings: 63 }, { size: 16, servings: 100 }] },
];
export function calculateWeddingCake(input: WeddingCakeInput): WeddingCakeResult {
    const { guests } = input;
    if (guests <= 0) throw new Error('Guest count must be positive');
    const config = TIER_CONFIGS.find(c => guests <= c.maxGuests) ?? TIER_CONFIGS[TIER_CONFIGS.length - 1];
    const totalServings = config.tiers.reduce((s, t) => s + t.servings, 0);
    return { tiers: config.tiers, totalServings, tierCount: config.tiers.length };
}
