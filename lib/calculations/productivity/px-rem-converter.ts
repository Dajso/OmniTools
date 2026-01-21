/**
 * Px to Rem Converter
 * 
 * Convert between pixels and rem units for CSS.
 * 
 * @module lib/calculations/productivity/px-rem-converter
 */

export interface PxRemInputs {
    value: number;
    baseFontSize: number;
    mode: 'px-to-rem' | 'rem-to-px';
}

export interface PxRemResults {
    px: number;
    rem: number;
    em: number;
    pxString: string;
    remString: string;
    emString: string;
}

/**
 * Convert pixels to rem
 */
export function pxToRem(px: number, baseFontSize: number = 16): number {
    if (baseFontSize <= 0) {
        throw new Error('Base font size must be greater than 0');
    }
    return px / baseFontSize;
}

/**
 * Convert rem to pixels
 */
export function remToPx(rem: number, baseFontSize: number = 16): number {
    if (baseFontSize <= 0) {
        throw new Error('Base font size must be greater than 0');
    }
    return rem * baseFontSize;
}

/**
 * Convert between px and rem
 */
export function convertPxRem(inputs: PxRemInputs): PxRemResults {
    const { value, baseFontSize, mode } = inputs;

    if (baseFontSize <= 0) {
        throw new Error('Base font size must be greater than 0');
    }

    let px: number;
    let rem: number;

    if (mode === 'px-to-rem') {
        px = value;
        rem = pxToRem(value, baseFontSize);
    } else {
        rem = value;
        px = remToPx(value, baseFontSize);
    }

    const em = rem; // em is relative to parent, same value as rem in this context

    return {
        px,
        rem,
        em,
        pxString: `${px}px`,
        remString: `${rem.toFixed(4).replace(/\.?0+$/, '')}rem`,
        emString: `${em.toFixed(4).replace(/\.?0+$/, '')}em`,
    };
}

/**
 * Generate a conversion table for common pixel values
 */
export function generateConversionTable(baseFontSize: number = 16): { px: number; rem: string }[] {
    const commonPxValues = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96];

    return commonPxValues.map(px => ({
        px,
        rem: pxToRem(px, baseFontSize).toFixed(4).replace(/\.?0+$/, '') + 'rem',
    }));
}

/**
 * Common base font sizes
 */
export const COMMON_BASE_SIZES = [
    { size: 10, description: '10px (Easy math: 1rem = 10px)' },
    { size: 14, description: '14px (Small screens)' },
    { size: 16, description: '16px (Browser default)' },
    { size: 18, description: '18px (Larger readable text)' },
    { size: 20, description: '20px (Large scale)' },
] as const;
