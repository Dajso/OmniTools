/**
 * Hex to RGB Color Converter
 * 
 * @module lib/calculations/productivity/hex-to-rgb
 * @see Requirements 9.9
 */

export interface ColorInputs {
  value: string;
  mode: 'hex-to-rgb' | 'rgb-to-hex';
}

export interface ColorResults {
  hex: string;
  rgb: { r: number; g: number; b: number };
  rgbString: string;
  hsl: { h: number; s: number; l: number };
  hslString: string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.replace('#', '');
  
  let fullHex = cleanHex;
  if (cleanHex.length === 3) {
    fullHex = cleanHex.split('').map(c => c + c).join('');
  }
  
  if (!/^[0-9A-Fa-f]{6}$/.test(fullHex)) {
    throw new Error('Ugyldig HEX-farge');
  }
  
  return {
    r: parseInt(fullHex.slice(0, 2), 16),
    g: parseInt(fullHex.slice(2, 4), 16),
    b: parseInt(fullHex.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function parseRgbString(rgbString: string): { r: number; g: number; b: number } {
  const match = rgbString.match(/(\d+)\s*,?\s*(\d+)\s*,?\s*(\d+)/);
  if (!match) {
    throw new Error('Ugyldig RGB-format. Bruk «r, g, b» eller «r g b»');
  }
  
  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
  };
}

export function convertColor(inputs: ColorInputs): ColorResults {
  const { value, mode } = inputs;
  
  if (!value.trim()) {
    throw new Error('Skriv inn en fargeverdi');
  }

  let rgb: { r: number; g: number; b: number };
  
  if (mode === 'hex-to-rgb') {
    rgb = hexToRgb(value);
  } else {
    rgb = parseRgbString(value);
  }
  
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  return {
    hex,
    rgb,
    rgbString: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    hsl,
    hslString: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
  };
}
