/**
 * Vekselretter: nødvendig størrelse
 * @module lib/calculations/solar/inverter-size
 */

export interface InverterSizeInput {
    appliances: Array<{
        name: string;
        watts: number;
        quantity: number;
        /** Startstrøm-faktor (f.eks. 3× for motorer som kjøleskap og pumper) */
        surgeMultiplier: number;
    }>;
    /** Sikkerhetsmargin (%) */
    safetyMargin: number;
}

export interface InverterSizeResult {
    continuousWatts: number;
    surgeWatts: number;
    recommendedInverterW: number;
    recommendedInverterVA: number;
}

export function calculateInverterSize(input: InverterSizeInput): InverterSizeResult {
    const { appliances, safetyMargin } = input;

    const continuousWatts = appliances.reduce((s, a) => s + a.watts * a.quantity, 0);
    const surgeWatts = appliances.reduce((s, a) => s + a.watts * a.quantity * a.surgeMultiplier, 0);

    if (continuousWatts <= 0) throw new Error('Samlet effekt må være større enn 0');

    const withMargin = continuousWatts * (1 + safetyMargin / 100);
    // Vekselrettere tåler vanligvis ca. 2× merkeeffekt i kort tid ved oppstart
    const requiredW = Math.max(withMargin, surgeWatts / 2);

    // Rund opp til vanlige størrelser
    const sizes = [300, 500, 750, 1000, 1500, 2000, 3000, 4000, 5000, 6000, 8000, 10000, 12000];
    const recommendedW = sizes.find(s => s >= requiredW) ?? Math.ceil(requiredW / 1000) * 1000;

    // VA ≈ watt ÷ 0,8 (effektfaktor)
    const recommendedVA = Math.round(recommendedW / 0.8);

    return {
        continuousWatts: Math.round(continuousWatts),
        surgeWatts: Math.round(surgeWatts),
        recommendedInverterW: recommendedW,
        recommendedInverterVA: recommendedVA,
    };
}
