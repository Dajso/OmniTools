/**
 * Yeast Conversion Calculator
 * Fresh ↔ Active Dry ↔ Instant yeast conversions.
 * @module lib/calculations/baking/yeast-conversion
 */

export type YeastType = 'fresh' | 'active-dry' | 'instant';

// Conversion ratios relative to fresh yeast = 1.0
const RATIOS: Record<YeastType, number> = {
    'fresh': 1.0,
    'active-dry': 0.4,    // 1g fresh = 0.4g active dry
    'instant': 0.33,      // 1g fresh = 0.33g instant
};

export interface YeastConversionInput {
    amount: number;
    fromType: YeastType;
    toType: YeastType;
}

export interface YeastConversionResult {
    result: number;
    fromLabel: string;
    toLabel: string;
}

const LABELS: Record<YeastType, string> = {
    'fresh': 'Fresh Yeast',
    'active-dry': 'Active Dry Yeast',
    'instant': 'Instant Yeast',
};

export function calculateYeastConversion(input: YeastConversionInput): YeastConversionResult {
    const { amount, fromType, toType } = input;
    if (amount <= 0) throw new Error('Amount must be positive');

    // Convert to fresh first, then to target
    const freshEquivalent = amount / RATIOS[fromType];
    const result = freshEquivalent * RATIOS[toType];

    return {
        result: Math.round(result * 10) / 10,
        fromLabel: LABELS[fromType],
        toLabel: LABELS[toType],
    };
}
