/**
 * Saltlakekalkulator
 * @module lib/calculations/baking/brine
 */

export interface BrineInput {
    /** Vannmengde i liter */
    waterLiters: number;
    /** Saltprosent av vekten (vanlig 3–10 %) */
    saltPercent: number;
}

export interface BrineResult {
    waterMl: number;
    saltG: number;
    saltTbsp: number;
    concentration: string;
}

export function calculateBrine(input: BrineInput): BrineResult {
    const { waterLiters, saltPercent } = input;
    if (!(waterLiters > 0)) throw new Error('Vannmengden må være større enn null');
    if (saltPercent <= 0 || saltPercent > 26) throw new Error('Saltprosenten må være mellom 1 og 26 %');

    const waterMl = waterLiters * 1000;
    const waterG = waterMl; // vann: ca. 1 g per ml

    // salt weight = water weight × (percent / (100 - percent)) for true % by weight
    const saltG = waterG * (saltPercent / (100 - saltPercent));
    // 1 ss bordsalt ≈ 18 g
    const saltTbsp = saltG / 18;

    let concentration: string;
    if (saltPercent <= 3) concentration = 'Lett lake: fjærkre, svinekoteletter';
    else if (saltPercent <= 6) concentration = 'Middels lake: hel kylling, ribbe';
    else if (saltPercent <= 10) concentration = 'Sterk lake: spekemat, pickles, gravlaks';
    else concentration = 'Svært sterk: fermentering og konservering';

    return {
        waterMl: Math.round(waterMl),
        saltG: Math.round(saltG),
        saltTbsp: Math.round(saltTbsp * 10) / 10,
        concentration,
    };
}
