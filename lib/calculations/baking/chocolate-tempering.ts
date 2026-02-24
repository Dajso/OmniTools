/**
 * Chocolate Tempering Temperatures
 * Quick reference for tempering curves by chocolate type.
 * @module lib/calculations/baking/chocolate-tempering
 */

export type ChocolateType = 'dark' | 'milk' | 'white';

export interface TemperingCurve {
    type: ChocolateType;
    label: string;
    /** Melt to (°C / °F) */
    meltC: number; meltF: number;
    /** Cool to (°C / °F) */
    coolC: number; coolF: number;
    /** Reheat to working temp (°C / °F) */
    workC: number; workF: number;
    tips: string;
}

const CURVES: Record<ChocolateType, TemperingCurve> = {
    dark: {
        type: 'dark', label: 'Dark Chocolate (55-70%)',
        meltC: 50, meltF: 122, coolC: 27, coolF: 81, workC: 32, workF: 90,
        tips: 'Form V crystals give a glossy finish and clean snap. Avoid exceeding 55°C.',
    },
    milk: {
        type: 'milk', label: 'Milk Chocolate',
        meltC: 45, meltF: 113, coolC: 26, coolF: 79, workC: 30, workF: 86,
        tips: 'Milk solids make this more sensitive to heat. Stir continuously while cooling.',
    },
    white: {
        type: 'white', label: 'White Chocolate',
        meltC: 40, meltF: 104, coolC: 25, coolF: 77, workC: 28, workF: 82,
        tips: 'Most heat-sensitive. Use a double boiler and never let water touch the chocolate.',
    },
};

export function getTemperingCurve(type: ChocolateType): TemperingCurve {
    return CURVES[type];
}

export function getAllTemperingCurves(): TemperingCurve[] {
    return Object.values(CURVES);
}
