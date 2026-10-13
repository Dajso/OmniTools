/**
 * Fullasttimer for sol (peak sun hours) ut fra breddegrad.
 * Én fullasttime tilsvarer 1 kWh solinnstråling per m² (på optimalt vinklet flate).
 * Verdiene er grove gjennomsnitt: skygge, skydekke og lokale forhold kommer i tillegg.
 * @module lib/calculations/solar/sun-peak-hours
 */

export interface SunPeakHoursInput {
    /** Breddegrad i grader */
    latitude: number;
    /** Panelets effekt (W) for energianslag */
    panelWatts?: number;
}

export interface SunPeakHoursResult {
    annualAvgHours: number;
    summerHours: number;
    winterHours: number;
    zone: string;
    /** Anslått energi per dag over året, Wh (etter tap) */
    dailyEnergyWh?: number;
    /** Anslått energi per måned over året, kWh (etter tap) */
    monthlyEnergyKWh?: number;
    /** Anslått energi per år, kWh (etter tap) */
    annualEnergyKWh?: number;
}

/** Systemtap (kabler, vekselretter, temperatur, smuss) – 20 % er vanlig å regne med */
export const PERFORMANCE_RATIO = 0.8;

export function calculateSunPeakHours(input: SunPeakHoursInput): SunPeakHoursResult {
    const { latitude, panelWatts } = input;
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
        throw new Error('Breddegraden må være mellom −90 og 90 grader');
    }
    const absLat = Math.abs(latitude);

    let annualAvgHours: number;
    let summerHours: number;
    let winterHours: number;
    let zone: string;

    // Tallene for 57,5°–71,5° er tilpasset norske forhold (ca. 800–1 050 kWh/m² per år på optimal flate).
    if (absLat <= 15) {
        zone = 'Tropene (0°–15°)';
        annualAvgHours = 5.5; summerHours = 5.5; winterHours = 5.0;
    } else if (absLat <= 25) {
        zone = 'Subtropene (15°–25°)';
        annualAvgHours = 5.0; summerHours = 6.0; winterHours = 4.0;
    } else if (absLat <= 35) {
        zone = 'Varmt klima (25°–35°)';
        annualAvgHours = 4.5; summerHours = 6.0; winterHours = 3.5;
    } else if (absLat <= 45) {
        zone = 'Middelhavsklima (35°–45°)';
        annualAvgHours = 4.0; summerHours = 5.5; winterHours = 2.5;
    } else if (absLat <= 52) {
        zone = 'Mellom-Europa (45°–52°)';
        annualAvgHours = 3.3; summerHours = 5.3; winterHours = 1.2;
    } else if (absLat <= 57.5) {
        zone = 'Nord-Europa (52°–57,5°)';
        annualAvgHours = 3.0; summerHours = 5.2; winterHours = 0.8;
    } else if (absLat <= 60.5) {
        zone = 'Sørlige Skandinavia (57,5°–60,5°), f.eks. Sør- og Østlandet';
        annualAvgHours = 2.8; summerHours = 5.3; winterHours = 0.4;
    } else if (absLat <= 65) {
        zone = 'Midt-Skandinavia (60,5°–65°), f.eks. Vestlandet og Trøndelag';
        annualAvgHours = 2.6; summerHours = 5.2; winterHours = 0.2;
    } else if (absLat <= 71.5) {
        zone = 'Nord-Skandinavia (65°–71,5°), f.eks. Nord-Norge';
        annualAvgHours = 2.3; summerHours = 5.0; winterHours = 0;
    } else {
        zone = 'Arktis (over 71,5°), f.eks. Svalbard';
        annualAvgHours = 2.0; summerHours = 4.5; winterHours = 0;
    }

    let dailyEnergyWh: number | undefined;
    let monthlyEnergyKWh: number | undefined;
    let annualEnergyKWh: number | undefined;
    if (panelWatts && panelWatts > 0) {
        const daily = panelWatts * annualAvgHours * PERFORMANCE_RATIO;
        dailyEnergyWh = Math.round(daily);
        monthlyEnergyKWh = Math.round(((daily * 365) / 12 / 1000) * 100) / 100;
        annualEnergyKWh = Math.round((daily * 365) / 1000);
    }

    return { annualAvgHours, summerHours, winterHours, zone, dailyEnergyWh, monthlyEnergyKWh, annualEnergyKWh };
}
