/**
 * Tent Size Calculator
 * Standing: 6 sq ft/person, Seated dinner: 12 sq ft/person, With dance floor: 15 sq ft/person
 */
export type EventLayout = 'standing' | 'seated' | 'seated-dance';
const SQ_FT_PER_PERSON: Record<EventLayout, number> = { 'standing': 6, 'seated': 12, 'seated-dance': 15 };
const LAYOUT_LABELS: Record<EventLayout, string> = { 'standing': 'Standing Cocktail', 'seated': 'Seated Dinner', 'seated-dance': 'Seated + Dance Floor' };
export interface TentSizeInput { guests: number; layout: EventLayout; }
export interface TentSizeResult { sqFt: number; tentSize: string; layout: string; }
export function calculateTentSize(input: TentSizeInput): TentSizeResult {
    const { guests, layout } = input;
    if (guests <= 0) throw new Error('Guests must be positive');
    const sqFt = guests * SQ_FT_PER_PERSON[layout];
    // Standard tent sizes: 20x20, 20x30, 20x40, 30x30, 30x60, 40x60, 40x80
    const sizes = [[20, 20], [20, 30], [20, 40], [30, 30], [30, 60], [40, 60], [40, 80], [40, 120], [60, 90]];
    const match = sizes.find(([w, l]) => w * l >= sqFt) ?? sizes[sizes.length - 1];
    return { sqFt, tentSize: `${match[0]}' × ${match[1]}'`, layout: LAYOUT_LABELS[layout] };
}
