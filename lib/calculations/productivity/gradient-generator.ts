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
    { name: 'Sunset', angle: 135, colors: ['#f093fb', '#f5576c'] },
    { name: 'Ocean', angle: 90, colors: ['#667eea', '#764ba2'] },
    { name: 'Forest', angle: 180, colors: ['#11998e', '#38ef7d'] },
    { name: 'Fire', angle: 45, colors: ['#f12711', '#f5af19'] },
    { name: 'Sky', angle: 180, colors: ['#a1c4fd', '#c2e9fb'] },
    { name: 'Night', angle: 135, colors: ['#0f0c29', '#302b63', '#24243e'] },
    { name: 'Aurora', angle: 90, colors: ['#00c6ff', '#0072ff'] },
    { name: 'Peach', angle: 135, colors: ['#ffecd2', '#fcb69f'] },
] as const;

/**
 * Direction presets for linear gradients
 */
export const DIRECTION_PRESETS = [
    { name: 'To Right', angle: 90, icon: '→' },
    { name: 'To Left', angle: 270, icon: '←' },
    { name: 'To Bottom', angle: 180, icon: '↓' },
    { name: 'To Top', angle: 0, icon: '↑' },
    { name: 'To Bottom Right', angle: 135, icon: '↘' },
    { name: 'To Bottom Left', angle: 225, icon: '↙' },
    { name: 'To Top Right', angle: 45, icon: '↗' },
    { name: 'To Top Left', angle: 315, icon: '↖' },
] as const;
