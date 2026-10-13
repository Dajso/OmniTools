/**
 * CO2 Bubble Count Calculator
 * Calculate CO2 concentration from KH and pH, estimate bubble rate.
 * @module lib/calculations/aquarium/co2-bubble
 */

export interface CO2BubbleInput {
    /** KH (carbonate hardness) in dKH */
    kh: number;
    /** pH value */
    ph: number;
    /** Tank volume in liters */
    volumeLiters: number;
}

export interface CO2BubbleResult {
    /** CO2 concentration in mg/L (ppm) */
    co2ppm: number;
    /** Estimated bubbles per second for target 30 ppm */
    bubblesPerSecond: number;
    /** Status: low / optimal / high / dangerous */
    status: string;
    /** Target CO2 for planted tanks */
    targetCo2: number;
}

/**
 * CO2 (mg/L) = 3.0 × KH × 10^(7.0 - pH)
 * This is the standard aquarium CO2-KH-pH relationship table.
 */
export function calculateCO2Bubble(input: CO2BubbleInput): CO2BubbleResult {
    const { kh, ph, volumeLiters } = input;

    if (kh <= 0) throw new Error('KH må være positiv');
    if (ph <= 0 || ph > 14) throw new Error('pH må være mellom 0 og 14');
    if (volumeLiters <= 0) throw new Error('Volumet må være positivt');

    const co2ppm = 3.0 * kh * Math.pow(10, 7.0 - ph);
    const targetCo2 = 30; // mg/L, optimal for planted tanks

    // Rough estimation: ~1 bubble/sec per 50L for 30 ppm target
    // Adjusted based on current vs target CO2
    const bubblesPerSecond = Math.max(0, (targetCo2 - co2ppm) * volumeLiters / 1500);

    let status: string;
    if (co2ppm < 10) status = 'Lavt – plantene kan slite';
    else if (co2ppm < 20) status = 'Moderat – passer for planter som trives med lite lys';
    else if (co2ppm <= 35) status = 'Optimalt – ideelt for plantekar';
    else if (co2ppm <= 50) status = 'Høyt – følg med på hvordan fiskene oppfører seg';
    else status = 'Farlig – fare for at fiskene kveles';

    return {
        co2ppm: Math.round(co2ppm * 10) / 10,
        bubblesPerSecond: Math.round(bubblesPerSecond * 10) / 10,
        status,
        targetCo2,
    };
}
