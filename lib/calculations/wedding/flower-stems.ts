/**
 * Flower Stem Counter
 */
export type ArrangementType = 'bridal-bouquet' | 'bridesmaid-bouquet' | 'boutonniere' | 'centerpiece-small' | 'centerpiece-large';
const STEM_COUNTS: Record<ArrangementType, { label: string; stems: number }> = {
    'bridal-bouquet': { label: 'Bridal Bouquet', stems: 30 },
    'bridesmaid-bouquet': { label: 'Bridesmaid Bouquet', stems: 15 },
    'boutonniere': { label: 'Boutonniere', stems: 2 },
    'centerpiece-small': { label: 'Centerpiece (small)', stems: 12 },
    'centerpiece-large': { label: 'Centerpiece (large)', stems: 25 },
};
export interface FlowerStemInput { items: Array<{ type: ArrangementType; quantity: number }> }
export interface FlowerStemResult { breakdown: Array<{ label: string; quantity: number; stemsEach: number; totalStems: number }>; grandTotal: number; }
export function calculateFlowerStems(input: FlowerStemInput): FlowerStemResult {
    const breakdown = input.items.map(item => {
        const data = STEM_COUNTS[item.type];
        return { label: data.label, quantity: item.quantity, stemsEach: data.stems, totalStems: data.stems * item.quantity };
    });
    return { breakdown, grandTotal: breakdown.reduce((s, b) => s + b.totalStems, 0) };
}
export { STEM_COUNTS };
