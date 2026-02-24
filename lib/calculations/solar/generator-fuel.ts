/**
 * Generator Fuel Consumption Calculator
 * @module lib/calculations/solar/generator-fuel
 */

export const FUEL_TYPES: Record<string, { name: string; btuPerGallon: number }> = {
    'gasoline': { name: 'Gasoline', btuPerGallon: 120000 },
    'diesel': { name: 'Diesel', btuPerGallon: 140000 },
    'propane': { name: 'Propane (LPG)', btuPerGallon: 91500 },
    'natural-gas': { name: 'Natural Gas (per 100 cf)', btuPerGallon: 100000 },
};

export interface GeneratorFuelInput {
    /** Generator rated wattage */
    ratedWatts: number;
    /** Current load (%) */
    loadPercent: number;
    /** Fuel tank size in gallons */
    tankGallons: number;
    /** Fuel type */
    fuelType: string;
}

export interface GeneratorFuelResult {
    runtimeHours: number;
    runtimeFormatted: string;
    fuelPerHour: number;
    actualLoad: number;
}

export function calculateGeneratorFuel(input: GeneratorFuelInput): GeneratorFuelResult {
    const { ratedWatts, loadPercent, tankGallons, fuelType } = input;

    if (ratedWatts <= 0) throw new Error('Rated wattage must be positive');
    if (loadPercent <= 0 || loadPercent > 100) throw new Error('Load must be 1-100%');
    if (tankGallons <= 0) throw new Error('Tank size must be positive');

    const fuel = FUEL_TYPES[fuelType] ?? FUEL_TYPES['gasoline'];
    const actualLoad = ratedWatts * (loadPercent / 100);

    // Generator efficiency ~25-30% for small, ~35% for large
    const efficiency = ratedWatts > 5000 ? 0.30 : 0.25;

    // BTU needed per hour = watts × 3.412 BTU/Wh
    const btuPerHour = actualLoad * 3.412;
    // Fuel per hour = BTU/hour / (BTU/gallon × efficiency)
    const fuelPerHour = btuPerHour / (fuel.btuPerGallon * efficiency);
    const runtimeHours = tankGallons / fuelPerHour;

    const hours = Math.floor(runtimeHours);
    const minutes = Math.round((runtimeHours - hours) * 60);

    return {
        runtimeHours: Math.round(runtimeHours * 10) / 10,
        runtimeFormatted: `${hours}h ${minutes}m`,
        fuelPerHour: Math.round(fuelPerHour * 100) / 100,
        actualLoad: Math.round(actualLoad),
    };
}
