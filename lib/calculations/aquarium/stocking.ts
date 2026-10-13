/**
 * Fiskebesetning (cm fisk per liter)
 * Bruker en tommelfingerregel i cm fisk per liter vann.
 * @module lib/calculations/aquarium/stocking
 */

/** Tommelfingerregel: cm fisk per liter vann  */
export const CM_FISH_PER_LITER = 2.54 / 3.78541;

export interface StockingInput {
    /** Tank volume in liters */
    volumeLiters: number;
    /** List of fish with size and quantity */
    fish: Array<{
        name: string;
        /** Adult size in cm */
        sizeCm: number;
        quantity: number;
    }>;
}

export interface StockingResult {
    totalCm: number;
    maxCm: number;
    stockingPercent: number;
    status: string;
    recommendation: string;
}

export function calculateStocking(input: StockingInput): StockingResult {
    const { volumeLiters, fish } = input;

    if (volumeLiters <= 0) throw new Error('Volumet må være positivt');

    const totalCm = fish.reduce((sum, f) => sum + f.sizeCm * f.quantity, 0);
    // Tommelfingerregel: ca. 0,67 cm fisk per liter vann
    const maxCm = volumeLiters * CM_FISH_PER_LITER;
    const stockingPercent = (totalCm / maxCm) * 100;

    let status: string;
    let recommendation: string;

    if (stockingPercent <= 50) {
        status = 'Lav besetning';
        recommendation = 'Det er god plass til flere fisk. Bra for nybegynnere.';
    } else if (stockingPercent <= 80) {
        status = 'Middels besetning';
        recommendation = 'Passe besetning. Ta jevnlige vannskifter.';
    } else if (stockingPercent <= 100) {
        status = 'Full besetning';
        recommendation = 'Akvariet er fullt. Sørg for god filtrering og hyppige vannskifter.';
    } else {
        status = 'For mange fisk';
        recommendation = 'Akvariet har for mange fisk! Vurder et større akvarium, eller finn nytt hjem til noen av fiskene.';
    }

    return {
        totalCm: Math.round(totalCm * 10) / 10,
        maxCm: Math.round(maxCm * 10) / 10,
        stockingPercent: Math.round(stockingPercent),
        status,
        recommendation,
    };
}
