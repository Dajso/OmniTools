/**
 * Solcellevinkel: anbefalt helning ut fra breddegrad og årstid.
 * Beste vinkel over året er omtrent breddegraden × 0,76 + 3,1°.
 * @module lib/calculations/solar/solar-panel-tilt
 */

export type Season = 'annual' | 'summer' | 'winter' | 'spring-fall';

export interface SolarPanelTiltInput {
    /** Breddegrad i grader (positiv = nord) */
    latitude: number;
    /** Årstid det optimaliseres for */
    season: Season;
}

export interface SolarPanelTiltResult {
    /** Optimal helningsvinkel i grader fra vannrett */
    tiltAngle: number;
    /** Retning panelene bør vende */
    azimuth: string;
    /** Forklaring */
    explanation: string;
}

export function calculateSolarPanelTilt(input: SolarPanelTiltInput): SolarPanelTiltResult {
    const { latitude, season } = input;
    const absLat = Math.abs(latitude);

    if (!Number.isFinite(latitude) || absLat > 90) throw new Error('Breddegraden må være mellom −90 og 90 grader');

    let tiltAngle: number;
    let explanation: string;

    switch (season) {
        case 'summer':
            tiltAngle = absLat * 0.9 - 23.5;
            explanation = 'Slakere vinkel som passer høy sommersol. Panelene vender mer opp mot himmelen.';
            break;
        case 'winter':
            tiltAngle = absLat * 0.9 + 29;
            explanation = 'Bratt vinkel som fanger lav vintersol og lar snøen gli av. På høye breddegrader betyr det nesten loddrett.';
            break;
        case 'spring-fall':
            tiltAngle = absLat * 0.9 - 2.5;
            explanation = 'Vinkel nær breddegraden, tilpasset sola ved jevndøgn.';
            break;
        case 'annual':
        default:
            tiltAngle = absLat * 0.76 + 3.1;
            explanation = 'Vinkel som gir best utbytte over hele året.';
            break;
    }

    tiltAngle = Math.max(0, Math.min(90, tiltAngle));
    const azimuth = latitude >= 0 ? 'Rett mot sør (180°)' : 'Rett mot nord (0°)';

    return {
        tiltAngle: Math.round(tiltAngle * 10) / 10,
        azimuth,
        explanation,
    };
}
