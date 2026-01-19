/**
 * Scientific Notation Converter
 * Converts numbers to and from scientific notation
 * 
 * @module lib/calculations/academic/scientific-notation-converter
 * @see Requirements 15.4
 */

export interface ScientificNotation {
  coefficient: number;  // The mantissa (1 <= |coefficient| < 10)
  exponent: number;     // The power of 10
  formatted: string;    // Human-readable format (e.g., "3.14 × 10^2")
}

export interface ConversionResult {
  decimal: number;
  scientific: ScientificNotation;
  engineering: string;  // Engineering notation (exponent divisible by 3)
}

/**
 * Converts a decimal number to scientific notation
 * 
 * @param value - The decimal number to convert
 * @returns ScientificNotation object with coefficient and exponent
 */
export function toScientificNotation(value: number): ScientificNotation {
  if (value === 0) {
    return {
      coefficient: 0,
      exponent: 0,
      formatted: '0 × 10^0',
    };
  }

  if (!isFinite(value)) {
    throw new Error('Value must be a finite number');
  }

  const absValue = Math.abs(value);
  const exponent = Math.floor(Math.log10(absValue));
  const coefficient = value / Math.pow(10, exponent);
  
  // Round coefficient to avoid floating point errors
  const roundedCoefficient = Math.round(coefficient * 1e10) / 1e10;

  return {
    coefficient: roundedCoefficient,
    exponent,
    formatted: formatScientificNotation(roundedCoefficient, exponent),
  };
}

/**
 * Converts scientific notation back to a decimal number
 * 
 * @param coefficient - The mantissa
 * @param exponent - The power of 10
 * @returns The decimal number
 */
export function fromScientificNotation(coefficient: number, exponent: number): number {
  return coefficient * Math.pow(10, exponent);
}

/**
 * Formats scientific notation as a human-readable string
 */
export function formatScientificNotation(coefficient: number, exponent: number): string {
  const sign = exponent >= 0 ? '+' : '';
  return `${coefficient.toPrecision(6).replace(/\.?0+$/, '')} × 10^${sign}${exponent}`;
}

/**
 * Converts to engineering notation (exponent divisible by 3)
 */
export function toEngineeringNotation(value: number): string {
  if (value === 0) return '0';
  if (!isFinite(value)) throw new Error('Value must be a finite number');

  const absValue = Math.abs(value);
  let exponent = Math.floor(Math.log10(absValue));
  
  // Adjust exponent to be divisible by 3
  const remainder = ((exponent % 3) + 3) % 3;
  exponent = exponent - remainder;
  
  const coefficient = value / Math.pow(10, exponent);
  const roundedCoefficient = Math.round(coefficient * 1e10) / 1e10;

  if (exponent === 0) {
    return roundedCoefficient.toString();
  }

  return `${roundedCoefficient.toPrecision(6).replace(/\.?0+$/, '')} × 10^${exponent}`;
}

/**
 * Parses a scientific notation string (e.g., "3.14e2" or "3.14 × 10^2")
 */
export function parseScientificNotation(input: string): { coefficient: number; exponent: number } | null {
  // Try standard e notation (3.14e2, 3.14E-2)
  const eMatch = input.match(/^([+-]?\d*\.?\d+)[eE]([+-]?\d+)$/);
  if (eMatch) {
    return {
      coefficient: parseFloat(eMatch[1]),
      exponent: parseInt(eMatch[2], 10),
    };
  }

  // Try formatted notation (3.14 × 10^2)
  const formattedMatch = input.match(/^([+-]?\d*\.?\d+)\s*[×x*]\s*10\^([+-]?\d+)$/);
  if (formattedMatch) {
    return {
      coefficient: parseFloat(formattedMatch[1]),
      exponent: parseInt(formattedMatch[2], 10),
    };
  }

  return null;
}

/**
 * Full conversion with all formats
 */
export function convertNumber(value: number): ConversionResult {
  const scientific = toScientificNotation(value);
  const engineering = toEngineeringNotation(value);

  return {
    decimal: value,
    scientific,
    engineering,
  };
}

/**
 * SI prefixes for engineering notation
 */
export const SI_PREFIXES: Record<number, { name: string; symbol: string }> = {
  24: { name: 'yotta', symbol: 'Y' },
  21: { name: 'zetta', symbol: 'Z' },
  18: { name: 'exa', symbol: 'E' },
  15: { name: 'peta', symbol: 'P' },
  12: { name: 'tera', symbol: 'T' },
  9: { name: 'giga', symbol: 'G' },
  6: { name: 'mega', symbol: 'M' },
  3: { name: 'kilo', symbol: 'k' },
  0: { name: '', symbol: '' },
  [-3]: { name: 'milli', symbol: 'm' },
  [-6]: { name: 'micro', symbol: 'μ' },
  [-9]: { name: 'nano', symbol: 'n' },
  [-12]: { name: 'pico', symbol: 'p' },
  [-15]: { name: 'femto', symbol: 'f' },
  [-18]: { name: 'atto', symbol: 'a' },
  [-21]: { name: 'zepto', symbol: 'z' },
  [-24]: { name: 'yocto', symbol: 'y' },
};
