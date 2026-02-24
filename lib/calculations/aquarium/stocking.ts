/**
 * Stocking Calculator (Fish per Gallon)
 * Uses the inch-per-gallon rule with adjustments.
 * @module lib/calculations/aquarium/stocking
 */

export interface StockingInput {
    /** Tank volume in US gallons */
    volumeGallons: number;
    /** List of fish with size and quantity */
    fish: Array<{
        name: string;
        /** Adult size in inches */
        sizeInches: number;
        quantity: number;
    }>;
}

export interface StockingResult {
    totalInches: number;
    maxInches: number;
    stockingPercent: number;
    status: string;
    recommendation: string;
}

export function calculateStocking(input: StockingInput): StockingResult {
    const { volumeGallons, fish } = input;

    if (volumeGallons <= 0) throw new Error('Volume must be positive');

    const totalInches = fish.reduce((sum, f) => sum + f.sizeInches * f.quantity, 0);
    // Classic rule: 1 inch of fish per gallon
    const maxInches = volumeGallons;
    const stockingPercent = (totalInches / maxInches) * 100;

    let status: string;
    let recommendation: string;

    if (stockingPercent <= 50) {
        status = 'Lightly Stocked';
        recommendation = 'You have plenty of room for more fish. Great for beginners.';
    } else if (stockingPercent <= 80) {
        status = 'Moderately Stocked';
        recommendation = 'Good stocking level. Maintain regular water changes.';
    } else if (stockingPercent <= 100) {
        status = 'Fully Stocked';
        recommendation = 'At capacity. Ensure excellent filtration and frequent water changes.';
    } else {
        status = 'Overstocked';
        recommendation = 'Tank is overstocked! Consider upgrading your tank or rehoming some fish.';
    }

    return {
        totalInches: Math.round(totalInches * 10) / 10,
        maxInches: Math.round(maxInches * 10) / 10,
        stockingPercent: Math.round(stockingPercent),
        status,
        recommendation,
    };
}
