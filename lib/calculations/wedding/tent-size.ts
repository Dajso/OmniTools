/**
 * Teltstørrelse til bryllup
 * Veiledende areal per person: stående ca. 0,6 m², sittende middag ca. 1,2 m²,
 * sittende middag med dansegulv ca. 1,5 m².
 */
export type EventLayout = 'standing' | 'seated' | 'seated-dance';
export const M2_PER_PERSON: Record<EventLayout, number> = { 'standing': 0.6, 'seated': 1.2, 'seated-dance': 1.5 };
const LAYOUT_LABELS: Record<EventLayout, string> = { 'standing': 'Stående mottakelse', 'seated': 'Sittende middag', 'seated-dance': 'Sittende middag med dansegulv' };
export interface TentSizeInput { guests: number; layout: EventLayout; }
export interface TentSizeResult { areaM2: number; tentSize: string; layout: string; }
/** Vanlige størrelser på partytelt (bredde × lengde i meter), sortert etter areal */
export const TENT_SIZES: Array<[number, number]> = [
    [5, 8], [5, 10], [6, 10], [6, 12], [6, 15], [8, 15], [8, 20], [10, 15], [10, 20], [12, 20], [12, 25], [15, 25], [15, 30], [20, 30],
].sort((a, b) => a[0] * a[1] - b[0] * b[1]) as Array<[number, number]>;
export function calculateTentSize(input: TentSizeInput): TentSizeResult {
    const { guests, layout } = input;
    if (!(guests > 0)) throw new Error('Antall gjester må være større enn 0');
    const areaM2 = Math.round(guests * M2_PER_PERSON[layout] * 10) / 10;
    const match = TENT_SIZES.find(([w, l]) => w * l >= areaM2) ?? TENT_SIZES[TENT_SIZES.length - 1];
    return { areaM2, tentSize: `${match[0]} × ${match[1]} m`, layout: LAYOUT_LABELS[layout] };
}
