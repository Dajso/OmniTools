/**
 * Capacitor Code Converter
 * 
 * Converts between capacitor codes (e.g., 104) and actual values (e.g., 100nF).
 * Also handles EIA marking codes and tolerance codes.
 * 
 * @module lib/calculations/electronics/capacitor-code
 * @see Requirements 26.7
 */

/**
 * Capacitor tolerance codes
 */
export const TOLERANCE_CODES: Record<string, number> = {
  'B': 0.1,   // ±0.1pF
  'C': 0.25,  // ±0.25pF
  'D': 0.5,   // ±0.5pF
  'F': 1,     // ±1%
  'G': 2,     // ±2%
  'J': 5,     // ±5%
  'K': 10,    // ±10%
  'M': 20,    // ±20%
  'Z': -20,   // +80%/-20%
};

/**
 * Voltage rating codes (EIA)
 */
export const VOLTAGE_CODES: Record<string, number> = {
  '0G': 4,
  '0J': 6.3,
  '1A': 10,
  '1C': 16,
  '1E': 25,
  '1H': 50,
  '1J': 63,
  '2A': 100,
  '2D': 200,
  '2E': 250,
  '2G': 400,
  '2J': 630,
  '3A': 1000,
};

/**
 * Result of capacitor code conversion
 */
export interface CapacitorValue {
  /** Value in picofarads */
  picofarads: number;
  /** Value in nanofarads */
  nanofarads: number;
  /** Value in microfarads */
  microfarads: number;
  /** Value in farads */
  farads: number;
  /** Best formatted string (auto-selects unit) */
  formatted: string;
  /** Original code if converted from code */
  code?: string;
  /** Tolerance percentage if available */
  tolerance?: number;
}

/**
 * Convert 3-digit capacitor code to value
 * 
 * Format: XYZ where:
 * - XY = significant figures
 * - Z = multiplier (power of 10 in pF)
 * 
 * Examples:
 * - 104 = 10 × 10^4 pF = 100,000 pF = 100 nF = 0.1 µF
 * - 473 = 47 × 10^3 pF = 47,000 pF = 47 nF
 * - 220 = 22 × 10^0 pF = 22 pF
 * 
 * @param code - 3-digit capacitor code
 * @returns Capacitor value in various units
 */
export function decodeCapacitorCode(code: string): CapacitorValue {
  // Remove any spaces or tolerance letters
  const cleanCode = code.trim().toUpperCase();
  
  // Extract numeric part (first 3 digits)
  const numericMatch = cleanCode.match(/^(\d{3})/);
  if (!numericMatch) {
    throw new Error(`Invalid capacitor code: ${code}. Expected 3-digit format like 104.`);
  }
  
  const numericCode = numericMatch[1];
  const digit1 = parseInt(numericCode[0], 10);
  const digit2 = parseInt(numericCode[1], 10);
  const multiplier = parseInt(numericCode[2], 10);
  
  // Handle special cases for small values
  // Codes like 1R0 = 1.0 pF, 2R2 = 2.2 pF
  if (cleanCode.includes('R')) {
    const rMatch = cleanCode.match(/^(\d)R(\d)/);
    if (rMatch) {
      const picofarads = parseFloat(`${rMatch[1]}.${rMatch[2]}`);
      return createCapacitorValue(picofarads, code);
    }
  }
  
  // Standard 3-digit code
  const significantFigures = digit1 * 10 + digit2;
  const picofarads = significantFigures * Math.pow(10, multiplier);
  
  // Check for tolerance code
  const toleranceMatch = cleanCode.match(/[A-Z]$/);
  const tolerance = toleranceMatch ? TOLERANCE_CODES[toleranceMatch[0]] : undefined;
  
  return createCapacitorValue(picofarads, code, tolerance);
}

/**
 * Create a CapacitorValue object from picofarads
 */
function createCapacitorValue(
  picofarads: number,
  code?: string,
  tolerance?: number
): CapacitorValue {
  const nanofarads = picofarads / 1000;
  const microfarads = picofarads / 1000000;
  const farads = picofarads / 1e12;
  
  return {
    picofarads,
    nanofarads,
    microfarads,
    farads,
    formatted: formatCapacitance(picofarads),
    code,
    tolerance,
  };
}

/**
 * Format capacitance with appropriate unit
 */
export function formatCapacitance(picofarads: number): string {
  if (picofarads >= 1e6) {
    const uf = picofarads / 1e6;
    return `${formatNumber(uf)}µF`;
  } else if (picofarads >= 1000) {
    const nf = picofarads / 1000;
    return `${formatNumber(nf)}nF`;
  } else {
    return `${formatNumber(picofarads)}pF`;
  }
}

/**
 * Format number, removing unnecessary decimals
 */
function formatNumber(value: number): string {
  if (value >= 100) return Math.round(value).toString();
  if (value >= 10) return value.toFixed(1).replace(/\.0$/, '');
  return value.toFixed(2).replace(/\.?0+$/, '');
}

/**
 * Convert capacitance value to 3-digit code
 * 
 * @param picofarads - Capacitance in picofarads
 * @returns 3-digit capacitor code
 */
export function encodeCapacitorCode(picofarads: number): string {
  if (picofarads <= 0) {
    throw new Error('Capacitance must be positive');
  }
  
  // Handle very small values (< 10 pF) with R notation
  if (picofarads < 10) {
    const str = picofarads.toFixed(1);
    return str.replace('.', 'R');
  }
  
  // Find the multiplier
  let value = picofarads;
  let multiplier = 0;
  
  while (value >= 100) {
    value /= 10;
    multiplier++;
  }
  
  // Round to 2 significant figures
  const significantFigures = Math.round(value);
  
  // Handle edge case where rounding pushes us to 100
  if (significantFigures >= 100) {
    return encodeCapacitorCode(picofarads); // Recurse with adjusted value
  }
  
  const digit1 = Math.floor(significantFigures / 10);
  const digit2 = significantFigures % 10;
  
  return `${digit1}${digit2}${multiplier}`;
}

/**
 * Convert between capacitance units
 * 
 * @param value - Input value
 * @param fromUnit - Source unit
 * @param toUnit - Target unit
 * @returns Converted value
 */
export function convertCapacitance(
  value: number,
  fromUnit: 'pF' | 'nF' | 'µF' | 'uF' | 'mF' | 'F',
  toUnit: 'pF' | 'nF' | 'µF' | 'uF' | 'mF' | 'F'
): number {
  // Convert to picofarads first
  const toPicofarads: Record<string, number> = {
    'pF': 1,
    'nF': 1e3,
    'µF': 1e6,
    'uF': 1e6,
    'mF': 1e9,
    'F': 1e12,
  };
  
  const picofarads = value * toPicofarads[fromUnit];
  return picofarads / toPicofarads[toUnit];
}

/**
 * Parse a capacitance string with unit
 * 
 * @param input - String like "100nF", "0.1uF", "104"
 * @returns Capacitor value
 */
export function parseCapacitance(input: string): CapacitorValue {
  const cleaned = input.trim().toUpperCase();
  
  // Check for unit suffix
  const unitMatch = cleaned.match(/^([\d.]+)\s*(PF|NF|UF|µF|MF|F)?$/i);
  
  if (unitMatch) {
    const value = parseFloat(unitMatch[1]);
    const unit = (unitMatch[2] || 'PF').toUpperCase();
    
    const picofarads = convertCapacitance(value, unit as 'pF', 'pF');
    return createCapacitorValue(picofarads);
  }
  
  // Try as capacitor code
  return decodeCapacitorCode(cleaned);
}
