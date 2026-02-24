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

    if (kh <= 0) throw new Error('KH must be positive');
    if (ph <= 0 || ph > 14) throw new Error('pH must be between 0 and 14');
    if (volumeLiters <= 0) throw new Error('Volume must be positive');

    const co2ppm = 3.0 * kh * Math.pow(10, 7.0 - ph);
    const targetCo2 = 30; // mg/L, optimal for planted tanks

    // Rough estimation: ~1 bubble/sec per 50L for 30 ppm target
    // Adjusted based on current vs target CO2
    const bubblesPerSecond = Math.max(0, (targetCo2 - co2ppm) * volumeLiters / 1500);

    let status: string;
    if (co2ppm < 10) status = 'Low — plants may struggle';
    else if (co2ppm < 20) status = 'Moderate — adequate for low-light plants';
    else if (co2ppm <= 35) status = 'Optimal — ideal for planted tanks';
    else if (co2ppm <= 50) status = 'High — monitor fish behavior';
    else status = 'Dangerous — risk of suffocating fish';

    return {
        co2ppm: Math.round(co2ppm * 10) / 10,
        bubblesPerSecond: Math.round(bubblesPerSecond * 10) / 10,
        status,
        targetCo2,
    };
}
