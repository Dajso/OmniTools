/**
 * Alkohol til bryllup
 * Tommelfingerregel: ca. 1 drikke per drikkende gjest per time.
 * Vin: 0,75 l-flaske = 5 glass. Øl: kasse à 24 flasker (0,33 l). Brennevin: 0,7 l-flaske = ca. 17 drinker à 4 cl.
 */
export interface WeddingAlcoholInput {
    guests: number;
    durationHours: number;
    drinkerPercent: number; // % av gjestene som drikker alkohol
    winePercent: number;  // % av drikkene som er vin
    beerPercent: number;  // % som er øl
    spiritPercent: number; // % som er brennevin
}
export interface WeddingAlcoholResult {
    totalDrinkers: number;
    totalDrinks: number;
    wineBottles: number;
    beerCases: number;  // 24 flasker per kasse
    spiritBottles: number; // 0,7 l
    wineGlasses: number;
    beerBottles: number;
    spiritDrinks: number;
}
export function calculateWeddingAlcohol(input: WeddingAlcoholInput): WeddingAlcoholResult {
    const { guests, durationHours, drinkerPercent, winePercent, beerPercent, spiritPercent } = input;
    if (!(guests > 0)) throw new Error('Antall gjester må være større enn 0');
    const totalDrinkers = Math.round(guests * (drinkerPercent / 100));
    const drinksPerPerson = durationHours; // ca. 1 drikke per time
    const totalDrinks = totalDrinkers * drinksPerPerson;
    const wineGlasses = Math.round(totalDrinks * (winePercent / 100));
    const beerBottles = Math.round(totalDrinks * (beerPercent / 100));
    const spiritDrinks = Math.round(totalDrinks * (spiritPercent / 100));
    return {
        totalDrinkers, totalDrinks,
        wineBottles: Math.ceil(wineGlasses / 5), // 5 glass per flaske
        beerCases: Math.ceil(beerBottles / 24),
        spiritBottles: Math.ceil(spiritDrinks / 17), // 17 drinker à 4 cl per 0,7 l
        wineGlasses, beerBottles, spiritDrinks,
    };
}
