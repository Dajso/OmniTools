/**
 * Antall kakelag og porsjoner til bryllupskake
 * Størrelse er diameter i cm.
 */
export interface WeddingCakeInput { guests: number; }
export interface CakeTier { size: number; servings: number; }
export interface WeddingCakeResult {
    tiers: CakeTier[];
    totalServings: number;
    tierCount: number;
}
const TIER_CONFIGS: Array<{ maxGuests: number; tiers: CakeTier[] }> = [
    { maxGuests: 30, tiers: [{ size: 25, servings: 38 }] },
    { maxGuests: 60, tiers: [{ size: 20, servings: 24 }, { size: 30, servings: 40 }] },
    { maxGuests: 100, tiers: [{ size: 15, servings: 12 }, { size: 25, servings: 38 }, { size: 35, servings: 63 }] },
    { maxGuests: 150, tiers: [{ size: 15, servings: 12 }, { size: 20, servings: 24 }, { size: 25, servings: 38 }, { size: 35, servings: 63 }] },
    { maxGuests: 200, tiers: [{ size: 15, servings: 12 }, { size: 20, servings: 24 }, { size: 25, servings: 38 }, { size: 30, servings: 56 }, { size: 40, servings: 100 }] },
    { maxGuests: 9999, tiers: [{ size: 15, servings: 12 }, { size: 20, servings: 24 }, { size: 25, servings: 38 }, { size: 30, servings: 56 }, { size: 35, servings: 63 }, { size: 40, servings: 100 }] },
];
export function calculateWeddingCake(input: WeddingCakeInput): WeddingCakeResult {
    const { guests } = input;
    if (guests <= 0) throw new Error('Antall gjester må være større enn 0');
    const config = TIER_CONFIGS.find(c => guests <= c.maxGuests) ?? TIER_CONFIGS[TIER_CONFIGS.length - 1];
    const totalServings = config.tiers.reduce((s, t) => s + t.servings, 0);
    return { tiers: config.tiers, totalServings, tierCount: config.tiers.length };
}
