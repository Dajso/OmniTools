/**
 * Favicon Generator
 * 
 * Generate favicons from text/emoji with customizable styles.
 * 
 * @module lib/calculations/productivity/favicon-generator
 */

export interface FaviconInputs {
    text: string;
    backgroundColor: string;
    textColor: string;
    fontSize: number;
    fontFamily: string;
    borderRadius: number;
    size: number;
}

export interface FaviconResults {
    dataUrl: string;
    sizes: { size: number; dataUrl: string }[];
}

/**
 * Default favicon settings
 */
export const DEFAULT_FAVICON_INPUTS: FaviconInputs = {
    text: '🚀',
    backgroundColor: '#3b82f6',
    textColor: '#ffffff',
    fontSize: 60,
    fontFamily: 'Arial, sans-serif',
    borderRadius: 20,
    size: 128,
};

/**
 * Common favicon sizes
 */
export const FAVICON_SIZES = [16, 32, 48, 64, 128, 180, 192, 512] as const;

/**
 * Generate favicon as data URL
 */
export function generateFavicon(
    inputs: FaviconInputs,
    canvas?: HTMLCanvasElement
): string {
    const { text, backgroundColor, textColor, fontSize, fontFamily, borderRadius, size } = inputs;

    // Create canvas if not provided (for SSR compatibility)
    if (typeof document === 'undefined' && !canvas) {
        return '';
    }

    const cvs = canvas || document.createElement('canvas');
    cvs.width = size;
    cvs.height = size;

    const ctx = cvs.getContext('2d');
    if (!ctx) return '';

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw rounded rectangle background
    const radius = (borderRadius / 100) * (size / 2);
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();

    ctx.fillStyle = backgroundColor;
    ctx.fill();

    // Draw text/emoji
    const scaledFontSize = (fontSize / 100) * size;
    ctx.font = `${scaledFontSize}px ${fontFamily}`;
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, size / 2, size / 2);

    return cvs.toDataURL('image/png');
}

/**
 * Generate HTML code for favicon
 */
export function generateFaviconHtml(dataUrls: { size: number; dataUrl: string }[]): string {
    const links = dataUrls.map(({ size, dataUrl }) => {
        if (size === 180) {
            return `<link rel="apple-touch-icon" sizes="${size}x${size}" href="${dataUrl}">`;
        }
        return `<link rel="icon" type="image/png" sizes="${size}x${size}" href="${dataUrl}">`;
    });

    return links.join('\n');
}

/**
 * Font family options
 */
export const FONT_FAMILIES = [
    { name: 'System', value: '-apple-system, BlinkMacSystemFont, sans-serif' },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Courier', value: 'Courier New, monospace' },
    { name: 'Impact', value: 'Impact, sans-serif' },
] as const;

/**
 * Preset color schemes
 */
export const FAVICON_COLOR_PRESETS = [
    { name: 'Blå', bg: '#3b82f6', text: '#ffffff' },
    { name: 'Grønn', bg: '#22c55e', text: '#ffffff' },
    { name: 'Rød', bg: '#ef4444', text: '#ffffff' },
    { name: 'Lilla', bg: '#a855f7', text: '#ffffff' },
    { name: 'Oransje', bg: '#f97316', text: '#ffffff' },
    { name: 'Rosa', bg: '#ec4899', text: '#ffffff' },
    { name: 'Mørk', bg: '#1f2937', text: '#ffffff' },
    { name: 'Lys', bg: '#f3f4f6', text: '#1f2937' },
] as const;
