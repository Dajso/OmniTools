/**
 * Contrast Checker (WCAG)
 * 
 * Calculate color contrast ratio and check WCAG 2.1 AA/AAA compliance.
 * 
 * @module lib/calculations/productivity/contrast-checker
 */

export interface ContrastInputs {
    foreground: string;
    background: string;
}

export interface WCAGCompliance {
    level: 'AAA' | 'AA' | 'Fail';
    passes: boolean;
    requiredRatio: number;
}

export interface ContrastResults {
    ratio: number;
    ratioFormatted: string;
    normalText: {
        AA: WCAGCompliance;
        AAA: WCAGCompliance;
    };
    largeText: {
        AA: WCAGCompliance;
        AAA: WCAGCompliance;
    };
    uiComponents: {
        AA: WCAGCompliance;
    };
    foregroundRgb: { r: number; g: number; b: number };
    backgroundRgb: { r: number; g: number; b: number };
    foregroundHex: string;
    backgroundHex: string;
}

/**
 * Parse color string (hex, rgb, or named color) to RGB values
 */
function parseColor(color: string): { r: number; g: number; b: number } {
    const cleanColor = color.trim().toLowerCase();

    // Handle hex colors
    if (cleanColor.startsWith('#')) {
        return hexToRgb(cleanColor);
    }

    // Handle rgb/rgba format
    const rgbMatch = cleanColor.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (rgbMatch) {
        return {
            r: parseInt(rgbMatch[1], 10),
            g: parseInt(rgbMatch[2], 10),
            b: parseInt(rgbMatch[3], 10),
        };
    }

    // Handle 3-digit hex without #
    if (/^[0-9a-f]{3}$/.test(cleanColor)) {
        return hexToRgb('#' + cleanColor);
    }

    // Handle 6-digit hex without #
    if (/^[0-9a-f]{6}$/.test(cleanColor)) {
        return hexToRgb('#' + cleanColor);
    }

    throw new Error(`Invalid color format: ${color}`);
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const cleanHex = hex.replace('#', '');

    let fullHex = cleanHex;
    if (cleanHex.length === 3) {
        fullHex = cleanHex.split('').map(c => c + c).join('');
    }

    if (!/^[0-9A-Fa-f]{6}$/.test(fullHex)) {
        throw new Error('Invalid hex color');
    }

    return {
        r: parseInt(fullHex.slice(0, 2), 16),
        g: parseInt(fullHex.slice(2, 4), 16),
        b: parseInt(fullHex.slice(4, 6), 16),
    };
}

/**
 * Convert RGB to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Calculate relative luminance according to WCAG 2.1
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
        const sRGB = c / 255;
        return sRGB <= 0.03928
            ? sRGB / 12.92
            : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio according to WCAG 2.1
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */
export function calculateContrastRatio(
    fg: { r: number; g: number; b: number },
    bg: { r: number; g: number; b: number }
): number {
    const l1 = getRelativeLuminance(fg.r, fg.g, fg.b);
    const l2 = getRelativeLuminance(bg.r, bg.g, bg.b);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check WCAG compliance for a given contrast ratio
 */
function checkCompliance(ratio: number, requiredRatio: number): WCAGCompliance {
    const passes = ratio >= requiredRatio;
    let level: 'AAA' | 'AA' | 'Fail';

    if (requiredRatio >= 7) {
        level = passes ? 'AAA' : 'Fail';
    } else if (requiredRatio >= 4.5) {
        level = passes ? 'AA' : 'Fail';
    } else {
        level = passes ? 'AA' : 'Fail';
    }

    return { level, passes, requiredRatio };
}

/**
 * Calculate contrast and check WCAG compliance
 */
export function checkContrast(inputs: ContrastInputs): ContrastResults {
    const { foreground, background } = inputs;

    if (!foreground.trim() || !background.trim()) {
        throw new Error('Please enter both foreground and background colors');
    }

    const fgRgb = parseColor(foreground);
    const bgRgb = parseColor(background);

    const ratio = calculateContrastRatio(fgRgb, bgRgb);

    return {
        ratio,
        ratioFormatted: `${ratio.toFixed(2)}:1`,
        normalText: {
            AA: checkCompliance(ratio, 4.5),   // WCAG AA for normal text
            AAA: checkCompliance(ratio, 7),    // WCAG AAA for normal text
        },
        largeText: {
            AA: checkCompliance(ratio, 3),     // WCAG AA for large text
            AAA: checkCompliance(ratio, 4.5),  // WCAG AAA for large text
        },
        uiComponents: {
            AA: checkCompliance(ratio, 3),     // WCAG AA for UI components
        },
        foregroundRgb: fgRgb,
        backgroundRgb: bgRgb,
        foregroundHex: rgbToHex(fgRgb.r, fgRgb.g, fgRgb.b).toUpperCase(),
        backgroundHex: rgbToHex(bgRgb.r, bgRgb.g, bgRgb.b).toUpperCase(),
    };
}

/**
 * Get a rating description based on contrast ratio
 */
export function getContrastRating(ratio: number): string {
    if (ratio >= 7) return 'Excellent';
    if (ratio >= 4.5) return 'Good';
    if (ratio >= 3) return 'Acceptable for large text';
    return 'Poor';
}

/**
 * Common color presets for quick testing
 */
export const COLOR_PRESETS = [
    { name: 'Black on White', fg: '#000000', bg: '#FFFFFF' },
    { name: 'White on Black', fg: '#FFFFFF', bg: '#000000' },
    { name: 'Navy on White', fg: '#1e3a5f', bg: '#FFFFFF' },
    { name: 'Dark Gray on Light', fg: '#333333', bg: '#F5F5F5' },
    { name: 'Blue on White', fg: '#0066CC', bg: '#FFFFFF' },
    { name: 'Red on White', fg: '#CC0000', bg: '#FFFFFF' },
    { name: 'Green on White', fg: '#008800', bg: '#FFFFFF' },
] as const;
