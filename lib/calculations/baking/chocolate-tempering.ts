/**
 * Temperering av sjokolade
 * Hurtigoversikt over temperaturkurver for ulike sjokoladetyper.
 * @module lib/calculations/baking/chocolate-tempering
 */

export type ChocolateType = 'dark' | 'milk' | 'white';

export interface TemperingCurve {
    type: ChocolateType;
    label: string;
    /** Smelt til (°C) */
    meltC: number;
    /** Avkjøl til (°C) */
    coolC: number;
    /** Varm opp til arbeidstemperatur (°C) */
    workC: number;
    tips: string;
}

const CURVES: Record<ChocolateType, TemperingCurve> = {
    dark: {
        type: 'dark', label: 'Mørk sjokolade (55–70 %)',
        meltC: 50, coolC: 27, workC: 32,
        tips: 'Form V-krystaller gir blank overflate og god knekk. Ikke varm over 55 °C.',
    },
    milk: {
        type: 'milk', label: 'Melkesjokolade',
        meltC: 45, coolC: 26, workC: 30,
        tips: 'Melkesjokolade tåler mindre varme. Rør jevnt mens den kjøles.',
    },
    white: {
        type: 'white', label: 'Hvit sjokolade',
        meltC: 40, coolC: 25, workC: 28,
        tips: 'Mest varmefølsom. Bruk vannbad, og la aldri vann komme i kontakt med sjokoladen.',
    },
};

export function getTemperingCurve(type: ChocolateType): TemperingCurve {
    return CURVES[type];
}

export function getAllTemperingCurves(): TemperingCurve[] {
    return Object.values(CURVES);
}
