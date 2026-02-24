/**
 * Solar Panel Tilt Angle Calculator
 * Optimal tilt = latitude ± seasonal adjustment
 * @module lib/calculations/solar/solar-panel-tilt
 */

export type Season = 'annual' | 'summer' | 'winter' | 'spring-fall';

export interface SolarPanelTiltInput {
    /** Latitude in degrees (positive = North) */
    latitude: number;
    /** Season for optimization */
    season: Season;
}

export interface SolarPanelTiltResult {
    /** Optimal tilt angle in degrees */
    tiltAngle: number;
    /** Azimuth direction */
    azimuth: string;
    /** Explanation */
    explanation: string;
}

export function calculateSolarPanelTilt(input: SolarPanelTiltInput): SolarPanelTiltResult {
    const { latitude, season } = input;
    const absLat = Math.abs(latitude);

    if (absLat > 90) throw new Error('Latitude must be between -90 and 90');

    let tiltAngle: number;
    let explanation: string;

    switch (season) {
        case 'summer':
            tiltAngle = absLat * 0.9 - 23.5;
            explanation = 'Reduced tilt for high summer sun. Panel faces more skyward.';
            break;
        case 'winter':
            tiltAngle = absLat * 0.9 + 29;
            explanation = 'Steep tilt to capture low winter sun angle.';
            break;
        case 'spring-fall':
            tiltAngle = absLat * 0.9 - 2.5;
            explanation = 'Near-latitude tilt for equinox sun angle.';
            break;
        case 'annual':
        default:
            tiltAngle = absLat * 0.76 + 3.1;
            explanation = 'Year-round optimized tilt balancing all seasons.';
            break;
    }

    tiltAngle = Math.max(0, Math.min(90, tiltAngle));
    const azimuth = latitude >= 0 ? 'Due South (180°)' : 'Due North (0°)';

    return {
        tiltAngle: Math.round(tiltAngle * 10) / 10,
        azimuth,
        explanation,
    };
}
