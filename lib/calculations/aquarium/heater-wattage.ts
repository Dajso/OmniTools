/**
 * Heater Wattage Calculator
 * Calculate required heater wattage based on volume and temperature differential.
 * @module lib/calculations/aquarium/heater-wattage
 */

export interface HeaterWattageInput {
    /** Tank volume in liters */
    volumeLiters: number;
    /** Room temperature in °C */
    roomTempC: number;
    /** Target water temperature in °C */
    targetTempC: number;
}

export interface HeaterWattageResult {
    wattage: number;
    wattsPerLiter: number;
    deltaTemp: number;
    recommendation: string;
}

/**
 * Rule of thumb: ~1W per liter per °C difference for small tanks,
 * less for larger tanks due to better heat retention.
 * Veiledende: omtrent 0,8–1,3 W per liter ved 5,5 °C forskjell, skalert etter temperaturforskjellen.
 */
export function calculateHeaterWattage(input: HeaterWattageInput): HeaterWattageResult {
    const { volumeLiters, roomTempC, targetTempC } = input;

    if (volumeLiters <= 0) throw new Error('Volumet må være positivt');

    const deltaTemp = targetTempC - roomTempC;

    if (deltaTemp <= 0) {
        return {
            wattage: 0,
            wattsPerLiter: 0,
            deltaTemp,
            recommendation: 'Du trenger ikke varmeelement – romtemperaturen er på eller over ønsket temperatur.',
        };
    }

    // ~0.5-1 W/L per degree for typical aquariums
    // Larger tanks need proportionally less: factor decreases with volume
    const sizeFactor = volumeLiters <= 50 ? 1.0 : volumeLiters <= 200 ? 0.8 : 0.6;
    const rawWattage = volumeLiters * deltaTemp * sizeFactor;

    // Round up to nearest common heater size
    const heaterSizes = [25, 50, 75, 100, 150, 200, 250, 300, 400, 500];
    const wattage = heaterSizes.find(s => s >= rawWattage) ?? Math.ceil(rawWattage / 100) * 100;

    let recommendation: string;
    if (wattage <= 100) recommendation = `Ett varmeelement på ${wattage} W bør holde.`;
    else if (wattage <= 300) recommendation = `Bruk ett varmeelement på ${wattage} W, eller to på ${Math.ceil(wattage / 2)} W hver for ekstra sikkerhet.`;
    else recommendation = `Bruk to varmeelementer på ${Math.ceil(wattage / 2)} W hver for sikkerhet og jevn varmefordeling.`;

    return {
        wattage,
        wattsPerLiter: Math.round((wattage / volumeLiters) * 100) / 100,
        deltaTemp,
        recommendation,
    };
}
