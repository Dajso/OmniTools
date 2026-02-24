/**
 * Water Change Calculator
 * Calculate concentration reduction after water changes.
 * C_new = C_old × (1 - changePercent/100)
 * @module lib/calculations/aquarium/water-change
 */

export interface WaterChangeInput {
    /** Current concentration (e.g. nitrate in ppm) */
    currentConcentration: number;
    /** Water change percentage (0-100) */
    changePercent: number;
    /** Number of consecutive water changes */
    numberOfChanges: number;
    /** Target concentration (optional) */
    targetConcentration?: number;
}

export interface WaterChangeResult {
    /** Final concentration after all changes */
    finalConcentration: number;
    /** Reduction percentage */
    reductionPercent: number;
    /** Concentration after each change */
    concentrationHistory: number[];
    /** Number of changes needed to reach target (if target provided) */
    changesToTarget?: number;
}

export function calculateWaterChange(input: WaterChangeInput): WaterChangeResult {
    const { currentConcentration, changePercent, numberOfChanges, targetConcentration } = input;

    if (currentConcentration < 0) throw new Error('Concentration cannot be negative');
    if (changePercent <= 0 || changePercent > 100) throw new Error('Change percent must be between 0 and 100');
    if (numberOfChanges < 1) throw new Error('Must perform at least one water change');

    const retainFactor = 1 - changePercent / 100;
    const concentrationHistory: number[] = [currentConcentration];

    let current = currentConcentration;
    for (let i = 0; i < numberOfChanges; i++) {
        current = current * retainFactor;
        concentrationHistory.push(Math.round(current * 100) / 100);
    }

    const finalConcentration = current;
    const reductionPercent = ((currentConcentration - finalConcentration) / currentConcentration) * 100;

    let changesToTarget: number | undefined;
    if (targetConcentration !== undefined && targetConcentration < currentConcentration) {
        // C_target = C_initial × (1-p)^n
        // n = ln(C_target/C_initial) / ln(1-p)
        changesToTarget = Math.ceil(
            Math.log(targetConcentration / currentConcentration) / Math.log(retainFactor)
        );
    }

    return {
        finalConcentration: Math.round(finalConcentration * 100) / 100,
        reductionPercent: Math.round(reductionPercent * 10) / 10,
        concentrationHistory,
        changesToTarget,
    };
}
