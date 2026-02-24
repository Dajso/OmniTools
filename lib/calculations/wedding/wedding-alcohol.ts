/**
 * Wedding Alcohol Calculator
 */
export interface WeddingAlcoholInput {
    guests: number;
    durationHours: number;
    drinkerPercent: number; // % of guests who drink
    winePercent: number;  // % of drinkers choosing wine
    beerPercent: number;  // % choosing beer
    spiritPercent: number; // % choosing spirits
}
export interface WeddingAlcoholResult {
    totalDrinkers: number;
    totalDrinks: number;
    wineBottles: number;
    beerCases: number;  // 24 bottles/case
    spiritBottles: number; // 750ml
    wineGlasses: number;
    beerBottles: number;
    spiritDrinks: number;
}
export function calculateWeddingAlcohol(input: WeddingAlcoholInput): WeddingAlcoholResult {
    const { guests, durationHours, drinkerPercent, winePercent, beerPercent, spiritPercent } = input;
    const totalDrinkers = Math.round(guests * (drinkerPercent / 100));
    const drinksPerPerson = durationHours; // ~1 drink/hr
    const totalDrinks = totalDrinkers * drinksPerPerson;
    const wineGlasses = Math.round(totalDrinks * (winePercent / 100));
    const beerBottles = Math.round(totalDrinks * (beerPercent / 100));
    const spiritDrinks = Math.round(totalDrinks * (spiritPercent / 100));
    return {
        totalDrinkers, totalDrinks,
        wineBottles: Math.ceil(wineGlasses / 5), // 5 glasses per bottle
        beerCases: Math.ceil(beerBottles / 24),
        spiritBottles: Math.ceil(spiritDrinks / 16), // 16 drinks per 750ml
        wineGlasses, beerBottles, spiritDrinks,
    };
}
