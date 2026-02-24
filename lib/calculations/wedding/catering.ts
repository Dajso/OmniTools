/**
 * Catering Quantity Estimator
 * Rule of thumb: main protein 6-8 oz per guest, sides 4 oz, etc.
 */
export interface CateringInput { guests: number; appetizerCount: number; }
export interface CateringResult {
    mainProteinLbs: number; sideDishLbs: number; saladLbs: number;
    breadRolls: number; dessertServings: number; appetizerPieces: number;
}
export function calculateCatering(input: CateringInput): CateringResult {
    const { guests, appetizerCount } = input;
    if (guests <= 0) throw new Error('Guests must be positive');
    return {
        mainProteinLbs: Math.ceil((guests * 7) / 16), // 7 oz per person, 16 oz/lb
        sideDishLbs: Math.ceil((guests * 4) / 16),
        saladLbs: Math.ceil((guests * 2.5) / 16),
        breadRolls: Math.ceil(guests * 1.5),
        dessertServings: guests, // 1 per person
        appetizerPieces: guests * appetizerCount, // e.g. 6 pieces per person
    };
}
