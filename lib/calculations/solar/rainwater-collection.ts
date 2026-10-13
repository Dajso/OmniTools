/**
 * Regnvann: hvor mye vann kan du samle fra taket?
 * Volum (liter) = takflate (m²) × nedbør (mm) × oppsamlingsgrad. 1 mm nedbør på 1 m² er 1 liter.
 * @module lib/calculations/solar/rainwater-collection
 */

export interface RainwaterCollectionInput {
    /** Takflate som samler vann, m² (målt i horisontalplanet, altså grunnflaten under taket) */
    roofAreaM2: number;
    /** Årsnedbør, mm */
    annualRainfallMm: number;
    /** Oppsamlingsgrad (%), tar høyde for tap */
    efficiencyPercent: number;
}

export interface RainwaterCollectionResult {
    annualLiters: number;
    monthlyLiters: number;
    annualCubicMeters: number;
    /** Antall døgn årsmengden dekker for én person ved 150 liter per døgn */
    daysForOnePerson: number;
    explanation: string;
}

/** Vanlig vannforbruk i en norsk husholdning, liter per person per døgn (grovt anslag) */
export const WATER_USE_PER_PERSON_LITERS = 150;

/** Omtrentlig årsnedbør (normalverdier, mm) for noen norske steder */
export const ANNUAL_RAINFALL_PRESETS: Array<{ name: string; mm: number }> = [
    { name: 'Oslo', mm: 800 },
    { name: 'Kristiansand', mm: 1300 },
    { name: 'Stavanger', mm: 1200 },
    { name: 'Bergen', mm: 2250 },
    { name: 'Trondheim', mm: 900 },
    { name: 'Tromsø', mm: 1000 },
];

export function calculateRainwaterCollection(input: RainwaterCollectionInput): RainwaterCollectionResult {
    const { roofAreaM2, annualRainfallMm, efficiencyPercent } = input;

    if (!(roofAreaM2 > 0)) throw new Error('Takflaten må være større enn 0');
    if (!(annualRainfallMm > 0)) throw new Error('Nedbøren må være større enn 0');
    if (efficiencyPercent < 0 || efficiencyPercent > 100) throw new Error('Oppsamlingsgraden må være mellom 0 og 100 %');

    const efficiency = efficiencyPercent / 100;
    const annualLiters = roofAreaM2 * annualRainfallMm * efficiency;
    const monthlyLiters = annualLiters / 12;
    const daysForOnePerson = annualLiters / WATER_USE_PER_PERSON_LITERS;

    const explanation = `Det er nok vann til én person i ca. ${Math.round(daysForOnePerson).toLocaleString('nb-NO')} døgn (ved ${WATER_USE_PER_PERSON_LITERS} liter per døgn). Regnvann egner seg til hagevanning og vask, men ikke som drikkevann uten rensing.`;

    return {
        annualLiters: Math.round(annualLiters),
        monthlyLiters: Math.round(monthlyLiters),
        annualCubicMeters: Math.round(annualLiters / 10) / 100,
        daysForOnePerson: Math.round(daysForOnePerson),
        explanation,
    };
}
