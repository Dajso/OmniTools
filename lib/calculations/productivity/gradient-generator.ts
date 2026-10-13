/**
 * CSS Gradient Generator
 * 
 * Generate linear and radial gradients with CSS output.
 * 
 * @module lib/calculations/productivity/gradient-generator
 */

export type GradientType = 'linear' | 'radial';

export interface ColorStop {
    color: string;
    position: number; // 0-100
}

export interface LinearGradientInputs {
    type: 'linear';
    angle: number; // 0-360
    colorStops: ColorStop[];
}

export interface RadialGradientInputs {
    type: 'radial';
    shape: 'circle' | 'ellipse';
    position: { x: number; y: number }; // 0-100
    colorStops: ColorStop[];
}

export type GradientInputs = LinearGradientInputs | RadialGradientInputs;

export interface GradientResults {
    css: string;
    cssWithPrefixes: string;
    preview: string;
}

/**
 * Generate linear gradient CSS
 */
function generateLinearGradient(inputs: LinearGradientInputs): GradientResults {
    const { angle, colorStops } = inputs;

    const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
    const stopsString = sortedStops
        .map(stop => `${stop.color} ${stop.position}%`)
        .join(', ');

    const css = `linear-gradient(${angle}deg, ${stopsString})`;

    const cssWithPrefixes = `background: ${css};
background: -webkit-${css};
background: -moz-${css};
background: -o-${css};`;

    return {
        css,
        cssWithPrefixes,
        preview: css,
    };
}

/**
 * Generate radial gradient CSS
 */
function generateRadialGradient(inputs: RadialGradientInputs): GradientResults {
    const { shape, position, colorStops } = inputs;

    const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
    const stopsString = sortedStops
        .map(stop => `${stop.color} ${stop.position}%`)
        .join(', ');

    const posString = `${position.x}% ${position.y}%`;
    const css = `radial-gradient(${shape} at ${posString}, ${stopsString})`;

    const cssWithPrefixes = `background: ${css};
background: -webkit-${css};
background: -moz-${css};`;

    return {
        css,
        cssWithPrefixes,
        preview: css,
    };
}

/**
 * Generate gradient CSS
 */
export function generateGradient(inputs: GradientInputs): GradientResults {
    if (inputs.type === 'linear') {
        return generateLinearGradient(inputs);
    } else {
        return generateRadialGradient(inputs);
    }
}

/**
 * Preset gradients for quick selection
 */
export const GRADIENT_PRESETS = [
    { name: 'Solnedgang', angle: 135, colors: ['#f093fb', '#f5576c'] },
    { name: 'Hav', angle: 90, colors: ['#667eea', '#764ba2'] },
    { name: 'Skog', angle: 180, colors: ['#11998e', '#38ef7d'] },
    { name: 'Ild', angle: 45, colors: ['#f12711', '#f5af19'] },
    { name: 'Himmel', angle: 180, colors: ['#a1c4fd', '#c2e9fb'] },
    { name: 'Natt', angle: 135, colors: ['#0f0c29', '#302b63', '#24243e'] },
    { name: 'Nordlys', angle: 90, colors: ['#00c6ff', '#0072ff'] },
    { name: 'Fersken', angle: 135, colors: ['#ffecd2', '#fcb69f'] },
] as const;

/**
 * Direction presets for linear gradients
 */
export const DIRECTION_PRESETS = [
    { name: 'Mot høyre', angle: 90, icon: '→' },
    { name: 'Mot venstre', angle: 270, icon: '←' },
    { name: 'Nedover', angle: 180, icon: '↓' },
    { name: 'Oppover', angle: 0, icon: '↑' },
    { name: 'Mot nedre høyre', angle: 135, icon: '↘' },
    { name: 'Mot nedre venstre', angle: 225, icon: '↙' },
    { name: 'Mot øvre høyre', angle: 45, icon: '↗' },
    { name: 'Mot øvre venstre', angle: 315, icon: '↖' },
] as const;
