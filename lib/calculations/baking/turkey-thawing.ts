/**
 * Turkey Thawing Time Calculator
 * @module lib/calculations/baking/turkey-thawing
 */

export type ThawMethod = 'refrigerator' | 'cold-water';

export interface TurkeyThawingInput {
    weightLbs: number;
    method: ThawMethod;
}

export interface TurkeyThawingResult {
    hours: number;
    days: number;
    formatted: string;
    startDate: string; // when to start if cooking on date X
    tips: string;
}

export function calculateTurkeyThawing(input: TurkeyThawingInput, cookDate?: Date): TurkeyThawingResult {
    const { weightLbs, method } = input;
    if (weightLbs <= 0) throw new Error('Weight must be positive');

    let hours: number;
    let tips: string;

    if (method === 'refrigerator') {
        // 24 hours per 5 lbs in refrigerator (40°F / 4°C)
        hours = Math.ceil(weightLbs / 5) * 24;
        tips = 'Keep turkey in original wrapping on a tray in the bottom of the fridge at 40°F (4°C). Add 1 extra day as buffer.';
    } else {
        // 30 minutes per pound in cold water, change water every 30 min
        hours = (weightLbs * 30) / 60;
        tips = 'Submerge turkey in cold water. Change water every 30 minutes. Cook immediately after thawing.';
    }

    const days = hours / 24;
    const fullDays = Math.floor(days);
    const remainingHours = Math.round((days - fullDays) * 24);
    const formatted = fullDays > 0
        ? `${fullDays} day${fullDays > 1 ? 's' : ''} ${remainingHours > 0 ? `${remainingHours} hours` : ''}`
        : `${Math.round(hours)} hours`;

    let startDate = '';
    if (cookDate) {
        const start = new Date(cookDate);
        start.setHours(start.getHours() - hours);
        startDate = start.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    }

    return { hours: Math.round(hours * 10) / 10, days: Math.round(days * 10) / 10, formatted: formatted.trim(), startDate, tips };
}
