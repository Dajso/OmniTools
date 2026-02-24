/**
 * Cake Pan Converter
 * Area-based scaling between pan shapes and sizes.
 * @module lib/calculations/baking/cake-pan-converter
 */

export type PanShape = 'round' | 'square' | 'rectangle';

export interface PanSpec {
    shape: PanShape;
    /** inches */
    width: number;
    /** inches (only for rectangle) */
    length?: number;
}

export interface CakePanResult {
    originalArea: number;
    targetArea: number;
    scaleFactor: number;
    explanation: string;
}

function panArea(pan: PanSpec): number {
    switch (pan.shape) {
        case 'round': return Math.PI * (pan.width / 2) ** 2;
        case 'square': return pan.width * pan.width;
        case 'rectangle': return pan.width * (pan.length ?? pan.width);
    }
}

export function calculateCakePanConversion(original: PanSpec, target: PanSpec): CakePanResult {
    const originalArea = panArea(original);
    const targetArea = panArea(target);
    if (originalArea <= 0 || targetArea <= 0) throw new Error('Pan dimensions must be positive');

    const scaleFactor = targetArea / originalArea;

    const scaleStr = scaleFactor.toFixed(2);
    const explanation = scaleFactor > 1
        ? `Multiply all ingredients by ${scaleStr} (target pan is ${Math.round((scaleFactor - 1) * 100)}% larger).`
        : `Multiply all ingredients by ${scaleStr} (target pan is ${Math.round((1 - scaleFactor) * 100)}% smaller).`;

    return {
        originalArea: Math.round(originalArea * 100) / 100,
        targetArea: Math.round(targetArea * 100) / 100,
        scaleFactor: Math.round(scaleFactor * 1000) / 1000,
        explanation,
    };
}
