/**
 * Mengdeberegning til bryllupsmiddag
 * Tommelfingerregel (ferdig tilberedt vekt per gjest): hovedrett med kjøtt/fisk
 * ca. 200 g, tilbehør (poteter, ris, grønnsaker) ca. 150 g, salat ca. 70 g.
 */
export interface CateringInput { guests: number; appetizerCount: number; }
export interface CateringResult {
    mainProteinKg: number; sideDishKg: number; saladKg: number;
    breadRolls: number; dessertServings: number; appetizerPieces: number;
}
export const GRAMS_PER_GUEST = { mainProtein: 200, sideDish: 150, salad: 70 } as const;
/** Runder opp til nærmeste 0,1 kg */
const kg = (guests: number, gramsPerGuest: number) => Math.ceil((guests * gramsPerGuest) / 100) / 10;
export function calculateCatering(input: CateringInput): CateringResult {
    const { guests, appetizerCount } = input;
    if (!(guests > 0)) throw new Error('Antall gjester må være større enn 0');
    return {
        mainProteinKg: kg(guests, GRAMS_PER_GUEST.mainProtein),
        sideDishKg: kg(guests, GRAMS_PER_GUEST.sideDish),
        saladKg: kg(guests, GRAMS_PER_GUEST.salad),
        breadRolls: Math.ceil(guests * 1.5),
        dessertServings: guests, // 1 per gjest
        appetizerPieces: guests * appetizerCount, // f.eks. 6 biter per gjest
    };
}
