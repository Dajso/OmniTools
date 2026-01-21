/**
 * CSS Box Shadow Generator
 * 
 * Generate CSS box-shadow with multiple layers and live preview.
 * 
 * @module lib/calculations/productivity/box-shadow-generator
 */

export interface BoxShadow {
    id: string;
    offsetX: number;
    offsetY: number;
    blur: number;
    spread: number;
    color: string;
    opacity: number;
    inset: boolean;
}

export interface BoxShadowResults {
    css: string;
    cssProperty: string;
}

/**
 * Convert hex color with opacity to rgba
 */
function hexToRgba(hex: string, opacity: number): string {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Generate single shadow CSS
 */
function generateSingleShadow(shadow: BoxShadow): string {
    const { offsetX, offsetY, blur, spread, color, opacity, inset } = shadow;
    const rgba = hexToRgba(color, opacity);
    const insetStr = inset ? 'inset ' : '';
    return `${insetStr}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${rgba}`;
}

/**
 * Generate box-shadow CSS from multiple shadows
 */
export function generateBoxShadow(shadows: BoxShadow[]): BoxShadowResults {
    if (shadows.length === 0) {
        return {
            css: 'none',
            cssProperty: 'box-shadow: none;',
        };
    }

    const css = shadows.map(generateSingleShadow).join(', ');

    return {
        css,
        cssProperty: `box-shadow: ${css};`,
    };
}

/**
 * Create a default shadow
 */
export function createDefaultShadow(id?: string): BoxShadow {
    return {
        id: id || crypto.randomUUID(),
        offsetX: 0,
        offsetY: 4,
        blur: 6,
        spread: -1,
        color: '#000000',
        opacity: 0.1,
        inset: false,
    };
}

/**
 * Preset shadows for quick selection
 */
export const SHADOW_PRESETS = [
    {
        name: 'Subtle',
        shadows: [{ offsetX: 0, offsetY: 1, blur: 2, spread: 0, color: '#000000', opacity: 0.05 }]
    },
    {
        name: 'Small',
        shadows: [{ offsetX: 0, offsetY: 1, blur: 3, spread: 0, color: '#000000', opacity: 0.1 }]
    },
    {
        name: 'Medium',
        shadows: [{ offsetX: 0, offsetY: 4, blur: 6, spread: -1, color: '#000000', opacity: 0.1 }]
    },
    {
        name: 'Large',
        shadows: [{ offsetX: 0, offsetY: 10, blur: 15, spread: -3, color: '#000000', opacity: 0.1 }]
    },
    {
        name: 'XL',
        shadows: [{ offsetX: 0, offsetY: 20, blur: 25, spread: -5, color: '#000000', opacity: 0.1 }]
    },
    {
        name: 'Elevated',
        shadows: [
            { offsetX: 0, offsetY: 1, blur: 3, spread: 0, color: '#000000', opacity: 0.1 },
            { offsetX: 0, offsetY: 10, blur: 20, spread: 0, color: '#000000', opacity: 0.1 },
        ]
    },
    {
        name: 'Inset',
        shadows: [{ offsetX: 0, offsetY: 2, blur: 4, spread: 0, color: '#000000', opacity: 0.06, inset: true }]
    },
    {
        name: 'Glow',
        shadows: [{ offsetX: 0, offsetY: 0, blur: 15, spread: 0, color: '#3b82f6', opacity: 0.5 }]
    },
] as const;
