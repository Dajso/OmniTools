/**
 * Sun Peak Hours Calculator
 * Lookup average peak sun hours by latitude zone.
 * @module lib/calculations/solar/sun-peak-hours
 */

export interface SunPeakHoursInput {
    /** Latitude in degrees */
    latitude: number;
    /** Panel wattage for energy estimate */
    panelWatts?: number;
}

export interface SunPeakHoursResult {
    annualAvgHours: number;
    summerHours: number;
    winterHours: number;
    zone: string;
    dailyEnergyWh?: number;
    monthlyEnergyKWh?: number;
}

export function calculateSunPeakHours(input: SunPeakHoursInput): SunPeakHoursResult {
    const { latitude, panelWatts } = input;
    const absLat = Math.abs(latitude);

    // Approximate peak sun hours by latitude zone
    let annualAvgHours: number;
    let summerHours: number;
    let winterHours: number;
    let zone: string;

    if (absLat <= 15) {
        zone = 'Tropical (0°-15°)';
        annualAvgHours = 5.5; summerHours = 5.5; winterHours = 5.0;
    } else if (absLat <= 25) {
        zone = 'Subtropical (15°-25°)';
        annualAvgHours = 5.0; summerHours = 6.0; winterHours = 4.0;
    } else if (absLat <= 35) {
        zone = 'Warm Temperate (25°-35°)';
        annualAvgHours = 4.5; summerHours = 6.0; winterHours = 3.5;
    } else if (absLat <= 45) {
        zone = 'Cool Temperate (35°-45°)';
        annualAvgHours = 4.0; summerHours = 5.5; winterHours = 2.5;
    } else if (absLat <= 55) {
        zone = 'Cold (45°-55°)';
        annualAvgHours = 3.5; summerHours = 5.0; winterHours = 1.5;
    } else {
        zone = 'Subarctic/Arctic (55°+)';
        annualAvgHours = 2.5; summerHours = 5.0; winterHours = 0.5;
    }

    let dailyEnergyWh: number | undefined;
    let monthlyEnergyKWh: number | undefined;
    if (panelWatts && panelWatts > 0) {
        dailyEnergyWh = panelWatts * annualAvgHours;
        monthlyEnergyKWh = Math.round((dailyEnergyWh * 30) / 1000 * 100) / 100;
        dailyEnergyWh = Math.round(dailyEnergyWh);
    }

    return { annualAvgHours, summerHours, winterHours, zone, dailyEnergyWh, monthlyEnergyKWh };
}
