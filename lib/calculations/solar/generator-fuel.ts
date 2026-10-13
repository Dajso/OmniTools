/**
 * Aggregat: drivstofforbruk og driftstid.
 * Energiinnhold per liter drivstoff ganget med virkningsgrad gir elektrisk energi.
 * @module lib/calculations/solar/generator-fuel
 */

/** Omtrentlig energiinnhold (kWh per liter) */
export const FUEL_TYPES: Record<string, { name: string; kwhPerLiter: number }> = {
    'gasoline': { name: 'Bensin', kwhPerLiter: 8.9 },
    'diesel': { name: 'Diesel', kwhPerLiter: 10 },
    'propane': { name: 'Propan (flytende)', kwhPerLiter: 6.6 },
};

export interface GeneratorFuelInput {
    /** Merkeeffekt på aggregatet, watt */
    ratedWatts: number;
    /** Belastning (%) */
    loadPercent: number;
    /** Tankstørrelse i liter */
    tankLiters: number;
    /** Drivstofftype */
    fuelType: string;
}

export interface GeneratorFuelResult {
    runtimeHours: number;
    runtimeFormatted: string;
    /** Liter per time */
    fuelPerHour: number;
    /** Faktisk belastning i watt */
    actualLoad: number;
}

export function calculateGeneratorFuel(input: GeneratorFuelInput): GeneratorFuelResult {
    const { ratedWatts, loadPercent, tankLiters, fuelType } = input;

    if (!(ratedWatts > 0)) throw new Error('Merkeeffekten må være større enn 0');
    if (!(loadPercent > 0) || loadPercent > 100) throw new Error('Belastningen må være mellom 1 og 100 %');
    if (!(tankLiters > 0)) throw new Error('Tanken må være større enn 0 liter');

    const fuel = FUEL_TYPES[fuelType] ?? FUEL_TYPES['gasoline'];
    const actualLoad = ratedWatts * (loadPercent / 100);

    // Virkningsgrad: ca. 25 % for små aggregater, ca. 30 % for større
    const efficiency = ratedWatts > 5000 ? 0.30 : 0.25;

    const kWhPerHour = actualLoad / 1000;
    const fuelPerHour = kWhPerHour / (fuel.kwhPerLiter * efficiency);
    const runtimeHours = tankLiters / fuelPerHour;

    let hours = Math.floor(runtimeHours);
    let minutes = Math.round((runtimeHours - hours) * 60);
    if (minutes === 60) { hours += 1; minutes = 0; }

    return {
        runtimeHours: Math.round(runtimeHours * 10) / 10,
        runtimeFormatted: `${hours} t ${minutes} min`,
        fuelPerHour: Math.round(fuelPerHour * 100) / 100,
        actualLoad: Math.round(actualLoad),
    };
}
