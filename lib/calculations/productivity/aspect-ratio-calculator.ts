/**
 * Aspect Ratio Calculator
 * 
 * @module lib/calculations/productivity/aspect-ratio-calculator
 * @see Requirements 9.17
 */

export interface AspectRatioInputs {
  width: number;
  height: number;
  mode: 'calculate' | 'resize-width' | 'resize-height';
  targetWidth?: number;
  targetHeight?: number;
}

export interface AspectRatioResults {
  ratio: string;
  decimal: number;
  width: number;
  height: number;
  orientation: 'landscape' | 'portrait' | 'square';
  commonName: string | null;
}

const COMMON_RATIOS: Array<{ ratio: string; decimal: number; name: string }> = [
  { ratio: '1:1', decimal: 1, name: 'Kvadrat' },
  { ratio: '4:3', decimal: 4/3, name: 'Standard (4:3)' },
  { ratio: '3:2', decimal: 3/2, name: 'Klassisk film (3:2)' },
  { ratio: '16:9', decimal: 16/9, name: 'Widescreen (16:9)' },
  { ratio: '16:10', decimal: 16/10, name: 'Widescreen (16:10)' },
  { ratio: '21:9', decimal: 21/9, name: 'Ultrawide (21:9)' },
  { ratio: '9:16', decimal: 9/16, name: 'Stående video (9:16)' },
  { ratio: '2:3', decimal: 2/3, name: 'Portrett (2:3)' },
  { ratio: '1.85:1', decimal: 1.85, name: 'Kino (1,85:1)' },
  { ratio: '2.35:1', decimal: 2.35, name: 'Anamorfisk (2,35:1)' },
  { ratio: '2.39:1', decimal: 2.39, name: 'Panavision (2,39:1)' },
];

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function findCommonRatio(decimal: number): string | null {
  const tolerance = 0.01;
  for (const common of COMMON_RATIOS) {
    if (Math.abs(decimal - common.decimal) < tolerance) {
      return common.name;
    }
  }
  return null;
}

export function calculateAspectRatio(inputs: AspectRatioInputs): AspectRatioResults {
  const { width, height, mode, targetWidth, targetHeight } = inputs;
  
  if (width <= 0 || height <= 0) {
    throw new Error('Bredde og høyde må være større enn 0');
  }

  let finalWidth = width;
  let finalHeight = height;
  
  if (mode === 'resize-width' && targetWidth) {
    finalWidth = targetWidth;
    finalHeight = Math.round((targetWidth / width) * height);
  } else if (mode === 'resize-height' && targetHeight) {
    finalHeight = targetHeight;
    finalWidth = Math.round((targetHeight / height) * width);
  }
  
  const divisor = gcd(finalWidth, finalHeight);
  const ratioWidth = finalWidth / divisor;
  const ratioHeight = finalHeight / divisor;
  
  const decimal = finalWidth / finalHeight;
  
  let orientation: 'landscape' | 'portrait' | 'square';
  if (finalWidth > finalHeight) {
    orientation = 'landscape';
  } else if (finalWidth < finalHeight) {
    orientation = 'portrait';
  } else {
    orientation = 'square';
  }

  return {
    ratio: `${ratioWidth}:${ratioHeight}`,
    decimal: Math.round(decimal * 1000) / 1000,
    width: finalWidth,
    height: finalHeight,
    orientation,
    commonName: findCommonRatio(decimal),
  };
}

export { COMMON_RATIOS };
