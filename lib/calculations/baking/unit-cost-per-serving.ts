/**
 * Unit Cost Per Serving Calculator
 * @module lib/calculations/baking/unit-cost-per-serving
 */

export interface CostIngredient {
    name: string;
    cost: number;
}

export interface UnitCostInput {
    ingredients: CostIngredient[];
    servings: number;
    targetMarginPercent?: number; // for restaurant pricing
}

export interface UnitCostResult {
    totalCost: number;
    costPerServing: number;
    suggestedPrice?: number;
    margin?: number;
}

export function calculateUnitCost(input: UnitCostInput): UnitCostResult {
    const { ingredients, servings, targetMarginPercent } = input;

    if (servings <= 0) throw new Error('Antall porsjoner må være større enn null');

    const totalCost = ingredients.reduce((s, i) => s + i.cost, 0);
    const costPerServing = totalCost / servings;

    let suggestedPrice: number | undefined;
    let margin: number | undefined;
    if (targetMarginPercent !== undefined && targetMarginPercent > 0) {
        // Price = Cost / (1 - margin%)
        suggestedPrice = costPerServing / (1 - targetMarginPercent / 100);
        suggestedPrice = Math.round(suggestedPrice * 100) / 100;
        margin = suggestedPrice - costPerServing;
        margin = Math.round(margin * 100) / 100;
    }

    return {
        totalCost: Math.round(totalCost * 100) / 100,
        costPerServing: Math.round(costPerServing * 100) / 100,
        suggestedPrice,
        margin,
    };
}
