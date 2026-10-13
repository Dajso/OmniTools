/**
 * Color Blindness Simulator
 * 
 * Simulate how colors appear to people with different types of color blindness.
 * 
 * @module lib/calculations/productivity/color-blindness-simulator
 */

export type ColorBlindnessType =
    | 'normal'         // Normal vision
    | 'protanopia'     // Red-blind
    | 'protanomaly'    // Red-weak
    | 'deuteranopia'   // Green-blind  
    | 'deuteranomaly'  // Green-weak
    | 'tritanopia'     // Blue-blind
    | 'tritanomaly'    // Blue-weak
    | 'achromatopsia'  // Complete color blindness
    | 'achromatomaly'; // Partial color blindness

export interface ColorBlindnessInputs {
    hexColor: string;
    type: ColorBlindnessType;
}

export interface SimulatedColor {
    hex: string;
    rgb: { r: number; g: number; b: number };
}

export interface ColorBlindnessResults {
    original: SimulatedColor;
    simulated: SimulatedColor;
    type: ColorBlindnessType;
    description: string;
}

/**
 * Convert hex to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const cleanHex = hex.replace('#', '');
    return {
        r: parseInt(cleanHex.slice(0, 2), 16),
        g: parseInt(cleanHex.slice(2, 4), 16),
        b: parseInt(cleanHex.slice(4, 6), 16),
    };
}

/**
 * Convert RGB to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
    const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
    return `#${clamp(r).toString(16).padStart(2, '0')}${clamp(g).toString(16).padStart(2, '0')}${clamp(b).toString(16).padStart(2, '0')}`;
}

/**
 * Simulate color blindness using color transformation matrices
 * Based on Color Blindness Simulation research
 */
function simulateColorBlindness(
    r: number,
    g: number,
    b: number,
    type: ColorBlindnessType
): { r: number; g: number; b: number } {
    // Normalize to 0-1
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;

    // Transformation matrices for different types
    const matrices: Record<ColorBlindnessType, number[][]> = {
        normal: [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
        ],
        protanopia: [
            [0.567, 0.433, 0],
            [0.558, 0.442, 0],
            [0, 0.242, 0.758],
        ],
        protanomaly: [
            [0.817, 0.183, 0],
            [0.333, 0.667, 0],
            [0, 0.125, 0.875],
        ],
        deuteranopia: [
            [0.625, 0.375, 0],
            [0.7, 0.3, 0],
            [0, 0.3, 0.7],
        ],
        deuteranomaly: [
            [0.8, 0.2, 0],
            [0.258, 0.742, 0],
            [0, 0.142, 0.858],
        ],
        tritanopia: [
            [0.95, 0.05, 0],
            [0, 0.433, 0.567],
            [0, 0.475, 0.525],
        ],
        tritanomaly: [
            [0.967, 0.033, 0],
            [0, 0.733, 0.267],
            [0, 0.183, 0.817],
        ],
        achromatopsia: [
            [0.299, 0.587, 0.114],
            [0.299, 0.587, 0.114],
            [0.299, 0.587, 0.114],
        ],
        achromatomaly: [
            [0.618, 0.320, 0.062],
            [0.163, 0.775, 0.062],
            [0.163, 0.320, 0.516],
        ],
    };

    const matrix = matrices[type];

    const newR = matrix[0][0] * rn + matrix[0][1] * gn + matrix[0][2] * bn;
    const newG = matrix[1][0] * rn + matrix[1][1] * gn + matrix[1][2] * bn;
    const newB = matrix[2][0] * rn + matrix[2][1] * gn + matrix[2][2] * bn;

    return {
        r: Math.round(newR * 255),
        g: Math.round(newG * 255),
        b: Math.round(newB * 255),
    };
}

/**
 * Simulate color blindness for a given color
 */
export function simulateColor(inputs: ColorBlindnessInputs): ColorBlindnessResults {
    const { hexColor, type } = inputs;

    const originalRgb = hexToRgb(hexColor);
    const simulatedRgb = simulateColorBlindness(originalRgb.r, originalRgb.g, originalRgb.b, type);
    const simulatedHex = rgbToHex(simulatedRgb.r, simulatedRgb.g, simulatedRgb.b);

    const descriptions: Record<ColorBlindnessType, string> = {
        normal: 'Normalt fargesyn',
        protanopia: 'Rødblind – ser ikke rødt lys',
        protanomaly: 'Rødsvak – redusert følsomhet for rødt',
        deuteranopia: 'Grønnblind – ser ikke grønt lys',
        deuteranomaly: 'Grønnsvak – redusert følsomhet for grønt',
        tritanopia: 'Blåblind – ser ikke blått lys',
        tritanomaly: 'Blåsvak – redusert følsomhet for blått',
        achromatopsia: 'Total fargeblindhet – ser bare gråtoner',
        achromatomaly: 'Delvis fargeblindhet – redusert fargestyrke',
    };

    return {
        original: {
            hex: hexColor,
            rgb: originalRgb,
        },
        simulated: {
            hex: simulatedHex,
            rgb: simulatedRgb,
        },
        type,
        description: descriptions[type],
    };
}

/**
 * Color blindness types with metadata
 */
export const COLOR_BLINDNESS_TYPES: { type: ColorBlindnessType; name: string; prevalence: string }[] = [
    { type: 'normal', name: 'Normalt syn', prevalence: '92 %' },
    { type: 'deuteranomaly', name: 'Deuteranomali (grønnsvak)', prevalence: '5 % av menn' },
    { type: 'protanomaly', name: 'Protanomali (rødsvak)', prevalence: '1 % av menn' },
    { type: 'deuteranopia', name: 'Deuteranopi (grønnblind)', prevalence: '1 % av menn' },
    { type: 'protanopia', name: 'Protanopi (rødblind)', prevalence: '1 % av menn' },
    { type: 'tritanopia', name: 'Tritanopi (blåblind)', prevalence: '0,01 %' },
    { type: 'tritanomaly', name: 'Tritanomali (blåsvak)', prevalence: '0,01 %' },
    { type: 'achromatopsia', name: 'Akromatopsi (svart-hvitt)', prevalence: '0,003 %' },
    { type: 'achromatomaly', name: 'Akromatomali (delvis)', prevalence: 'Svært sjelden' },
];
