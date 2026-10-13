/**
 * Baker's Percentage Calculator
 * All ingredients expressed as % of total flour weight.
 * @module lib/calculations/baking/bakers-percentage
 */

export interface Ingredient {
    name: string;
    weightG: number;
    isFlour: boolean;
}

export interface BakersPercentageResult {
    totalFlour: number;
    ingredients: Array<{ name: string; weightG: number; percentage: number; isFlour: boolean }>;
    /** Scale all ingredients to a target flour weight */
    scaledIngredients?: Array<{ name: string; weightG: number }>;
}

export function calculateBakersPercentage(
    ingredients: Ingredient[],
    targetFlourG?: number
): BakersPercentageResult {
    const totalFlour = ingredients.filter(i => i.isFlour).reduce((s, i) => s + i.weightG, 0);
    if (totalFlour <= 0) throw new Error('Total melvekt må være større enn null');

    const withPercentage = ingredients.map(i => ({
        ...i,
        percentage: Math.round((i.weightG / totalFlour) * 1000) / 10,
    }));

    let scaledIngredients: Array<{ name: string; weightG: number }> | undefined;
    if (targetFlourG && targetFlourG > 0) {
        const scaleFactor = targetFlourG / totalFlour;
        scaledIngredients = ingredients.map(i => ({
            name: i.name,
            weightG: Math.round(i.weightG * scaleFactor),
        }));
    }

    return { totalFlour, ingredients: withPercentage, scaledIngredients };
}
