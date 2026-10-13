/**
 * Resistor Color Code Calculator
 * 
 * Calculates resistance values from color bands and vice versa.
 * Supports 4-band and 5-band resistors.
 * 
 * @module lib/calculations/electronics/resistor-calculator
 * @see Requirements 26.1, 26.11
 */

/**
 * Error class for resistor calculation errors
 */
export class ResistorError extends Error {
  constructor(
    message: string,
    public code: 'invalid_color' | 'invalid_value' | 'invalid_bands',
    public field?: string
  ) {
    super(message);
    this.name = 'ResistorError';
  }
}

/**
 * Valid resistor band colors
 */
export type BandColor = 
  | 'black' | 'brown' | 'red' | 'orange' | 'yellow'
  | 'green' | 'blue' | 'violet' | 'gray' | 'white'
  | 'gold' | 'silver' | 'none';

/**
 * Color to digit value mapping (for significant figure bands)
 */
export const COLOR_VALUES: Record<string, number> = {
  black: 0,
  brown: 1,
  red: 2,
  orange: 3,
  yellow: 4,
  green: 5,
  blue: 6,
  violet: 7,
  gray: 8,
  white: 9,
};

/**
 * Color to multiplier mapping
 */
export const COLOR_MULTIPLIERS: Record<string, number> = {
  black: 1,           // 10^0
  brown: 10,          // 10^1
  red: 100,           // 10^2
  orange: 1000,       // 10^3
  yellow: 10000,      // 10^4
  green: 100000,      // 10^5
  blue: 1000000,      // 10^6
  violet: 10000000,   // 10^7
  gray: 100000000,    // 10^8
  white: 1000000000,  // 10^9
  gold: 0.1,          // 10^-1
  silver: 0.01,       // 10^-2
};

/**
 * Color to tolerance percentage mapping
 */
export const COLOR_TOLERANCES: Record<string, number> = {
  brown: 1,
  red: 2,
  green: 0.5,
  blue: 0.25,
  violet: 0.1,
  gray: 0.05,
  gold: 5,
  silver: 10,
  none: 20,
};

/**
 * Color display names and hex values for UI
 */
export const COLOR_DISPLAY: Record<string, { name: string; hex: string }> = {
  black: { name: 'Svart', hex: '#000000' },
  brown: { name: 'Brun', hex: '#8B4513' },
  red: { name: 'Rød', hex: '#FF0000' },
  orange: { name: 'Oransje', hex: '#FFA500' },
  yellow: { name: 'Gul', hex: '#FFFF00' },
  green: { name: 'Grønn', hex: '#008000' },
  blue: { name: 'Blå', hex: '#0000FF' },
  violet: { name: 'Fiolett', hex: '#EE82EE' },
  gray: { name: 'Grå', hex: '#808080' },
  white: { name: 'Hvit', hex: '#FFFFFF' },
  gold: { name: 'Gull', hex: '#FFD700' },
  silver: { name: 'Sølv', hex: '#C0C0C0' },
  none: { name: 'Ingen', hex: 'transparent' },
};


/**
 * Input for 4-band resistor calculation
 */
export interface FourBandResistor {
  band1: BandColor;      // First significant digit
  band2: BandColor;      // Second significant digit
  multiplier: BandColor; // Multiplier
  tolerance: BandColor;  // Tolerance
}

/**
 * Input for 5-band resistor calculation
 */
export interface FiveBandResistor {
  band1: BandColor;      // First significant digit
  band2: BandColor;      // Second significant digit
  band3: BandColor;      // Third significant digit
  multiplier: BandColor; // Multiplier
  tolerance: BandColor;  // Tolerance
}

/**
 * Result of resistor value calculation
 */
export interface ResistorValue {
  /** Resistance in ohms */
  resistance: number;
  /** Tolerance percentage */
  tolerance: number;
  /** Minimum resistance (resistance - tolerance) */
  minResistance: number;
  /** Maximum resistance (resistance + tolerance) */
  maxResistance: number;
  /** Formatted resistance string (e.g., "4.7kΩ") */
  formatted: string;
  /** Full formatted string with tolerance (e.g., "4.7kΩ ±5%") */
  formattedWithTolerance: string;
  /** Number of bands used */
  bandCount: 4 | 5;
}

/**
 * Result of reverse calculation (resistance to colors)
 */
export interface ResistorColors {
  /** Color bands for 4-band representation */
  fourBand: FourBandResistor;
  /** Color bands for 5-band representation (if applicable) */
  fiveBand?: FiveBandResistor;
  /** Whether the value can be exactly represented */
  isExact: boolean;
  /** Nearest standard value if not exact */
  nearestStandard?: number;
}

/**
 * Format resistance value with appropriate unit prefix
 * 
 * @param ohms - Resistance in ohms
 * @returns Formatted string with unit
 */
export function formatResistance(ohms: number): string {
  if (ohms >= 1e9) {
    return `${(ohms / 1e9).toFixed(ohms % 1e9 === 0 ? 0 : 2)}GΩ`;
  } else if (ohms >= 1e6) {
    return `${(ohms / 1e6).toFixed(ohms % 1e6 === 0 ? 0 : 2)}MΩ`;
  } else if (ohms >= 1e3) {
    return `${(ohms / 1e3).toFixed(ohms % 1e3 === 0 ? 0 : 2)}kΩ`;
  } else if (ohms >= 1) {
    return `${ohms.toFixed(ohms % 1 === 0 ? 0 : 2)}Ω`;
  } else {
    return `${(ohms * 1000).toFixed(2)}mΩ`;
  }
}

/**
 * Validate a color for use as a significant digit band
 * 
 * @param color - The color to validate
 * @param bandName - Name of the band for error messages
 */
function validateDigitColor(color: BandColor, bandName: string): void {
  if (!(color in COLOR_VALUES)) {
    throw new ResistorError(
      `Ugyldig farge for ${bandName}: ${color}. Velg fra svart til hvit.`,
      'invalid_color',
      bandName
    );
  }
}

/**
 * Validate a color for use as a multiplier band
 * 
 * @param color - The color to validate
 */
function validateMultiplierColor(color: BandColor): void {
  if (!(color in COLOR_MULTIPLIERS)) {
    throw new ResistorError(
      `Ugyldig farge for multiplikator: ${color}`,
      'invalid_color',
      'multiplier'
    );
  }
}

/**
 * Validate a color for use as a tolerance band
 * 
 * @param color - The color to validate
 */
function validateToleranceColor(color: BandColor): void {
  if (!(color in COLOR_TOLERANCES)) {
    throw new ResistorError(
      `Ugyldig farge for toleranse: ${color}`,
      'invalid_color',
      'tolerance'
    );
  }
}


/**
 * Calculate resistance from 4-band resistor colors
 * 
 * @param bands - The four color bands
 * @returns Calculated resistance value and metadata
 */
export function calculate4BandResistor(bands: FourBandResistor): ResistorValue {
  validateDigitColor(bands.band1, 'band1');
  validateDigitColor(bands.band2, 'band2');
  validateMultiplierColor(bands.multiplier);
  validateToleranceColor(bands.tolerance);
  
  // First band cannot be black (would be leading zero)
  if (bands.band1 === 'black') {
    throw new ResistorError(
      'Første bånd kan ikke være svart (ledende null)',
      'invalid_color',
      'band1'
    );
  }
  
  const digit1 = COLOR_VALUES[bands.band1];
  const digit2 = COLOR_VALUES[bands.band2];
  const multiplier = COLOR_MULTIPLIERS[bands.multiplier];
  const tolerance = COLOR_TOLERANCES[bands.tolerance];
  
  const significantFigures = digit1 * 10 + digit2;
  const resistance = significantFigures * multiplier;
  
  const toleranceValue = resistance * (tolerance / 100);
  
  return {
    resistance,
    tolerance,
    minResistance: resistance - toleranceValue,
    maxResistance: resistance + toleranceValue,
    formatted: formatResistance(resistance),
    formattedWithTolerance: `${formatResistance(resistance)} ±${tolerance}%`,
    bandCount: 4,
  };
}

/**
 * Calculate resistance from 5-band resistor colors
 * 
 * @param bands - The five color bands
 * @returns Calculated resistance value and metadata
 */
export function calculate5BandResistor(bands: FiveBandResistor): ResistorValue {
  validateDigitColor(bands.band1, 'band1');
  validateDigitColor(bands.band2, 'band2');
  validateDigitColor(bands.band3, 'band3');
  validateMultiplierColor(bands.multiplier);
  validateToleranceColor(bands.tolerance);
  
  // First band cannot be black (would be leading zero)
  if (bands.band1 === 'black') {
    throw new ResistorError(
      'Første bånd kan ikke være svart (ledende null)',
      'invalid_color',
      'band1'
    );
  }
  
  const digit1 = COLOR_VALUES[bands.band1];
  const digit2 = COLOR_VALUES[bands.band2];
  const digit3 = COLOR_VALUES[bands.band3];
  const multiplier = COLOR_MULTIPLIERS[bands.multiplier];
  const tolerance = COLOR_TOLERANCES[bands.tolerance];
  
  const significantFigures = digit1 * 100 + digit2 * 10 + digit3;
  const resistance = significantFigures * multiplier;
  
  const toleranceValue = resistance * (tolerance / 100);
  
  return {
    resistance,
    tolerance,
    minResistance: resistance - toleranceValue,
    maxResistance: resistance + toleranceValue,
    formatted: formatResistance(resistance),
    formattedWithTolerance: `${formatResistance(resistance)} ±${tolerance}%`,
    bandCount: 5,
  };
}

/**
 * Get the digit value for a color
 * 
 * @param digit - The digit (0-9)
 * @returns The corresponding color
 */
function digitToColor(digit: number): BandColor {
  const colors: BandColor[] = [
    'black', 'brown', 'red', 'orange', 'yellow',
    'green', 'blue', 'violet', 'gray', 'white'
  ];
  return colors[digit];
}

/**
 * Get the multiplier color for a given power of 10
 * 
 * @param power - The power of 10 (-2 to 9)
 * @returns The corresponding color
 */
function multiplierToColor(power: number): BandColor {
  const multiplierColors: Record<number, BandColor> = {
    [-2]: 'silver',
    [-1]: 'gold',
    0: 'black',
    1: 'brown',
    2: 'red',
    3: 'orange',
    4: 'yellow',
    5: 'green',
    6: 'blue',
    7: 'violet',
    8: 'gray',
    9: 'white',
  };
  return multiplierColors[power] || 'black';
}

/**
 * Get the tolerance color for a given percentage
 * 
 * @param tolerance - The tolerance percentage
 * @returns The corresponding color
 */
function toleranceToColor(tolerance: number): BandColor {
  if (tolerance <= 0.05) return 'gray';
  if (tolerance <= 0.1) return 'violet';
  if (tolerance <= 0.25) return 'blue';
  if (tolerance <= 0.5) return 'green';
  if (tolerance <= 1) return 'brown';
  if (tolerance <= 2) return 'red';
  if (tolerance <= 5) return 'gold';
  if (tolerance <= 10) return 'silver';
  return 'none';
}


/**
 * Convert a resistance value to color bands
 * 
 * @param resistance - Resistance in ohms
 * @param tolerance - Tolerance percentage (default 5%)
 * @returns Color band representation
 */
export function resistanceToColors(
  resistance: number,
  tolerance: number = 5
): ResistorColors {
  if (resistance <= 0) {
    throw new ResistorError(
      'Motstanden må være større enn null',
      'invalid_value',
      'resistance'
    );
  }
  
  // Normalize to get significant figures and multiplier
  let normalized = resistance;
  let power = 0;
  
  // Handle values >= 10
  while (normalized >= 100) {
    normalized /= 10;
    power++;
  }
  
  // Handle values < 1
  while (normalized < 10 && power > -2) {
    normalized *= 10;
    power--;
  }
  
  // Round to 2 significant figures for 4-band
  const twoSigFigs = Math.round(normalized);
  const digit1_4band = Math.floor(twoSigFigs / 10);
  const digit2_4band = twoSigFigs % 10;
  
  // Calculate actual 4-band resistance
  const fourBandResistance = twoSigFigs * Math.pow(10, power);
  const isExact4Band = Math.abs(fourBandResistance - resistance) < 0.001;
  
  const fourBand: FourBandResistor = {
    band1: digitToColor(digit1_4band),
    band2: digitToColor(digit2_4band),
    multiplier: multiplierToColor(power),
    tolerance: toleranceToColor(tolerance),
  };
  
  // For 5-band, we need 3 significant figures
  let normalized5 = resistance;
  let power5 = 0;
  
  while (normalized5 >= 1000) {
    normalized5 /= 10;
    power5++;
  }
  
  while (normalized5 < 100 && power5 > -2) {
    normalized5 *= 10;
    power5--;
  }
  
  const threeSigFigs = Math.round(normalized5);
  const digit1_5band = Math.floor(threeSigFigs / 100);
  const digit2_5band = Math.floor((threeSigFigs % 100) / 10);
  const digit3_5band = threeSigFigs % 10;
  
  const fiveBandResistance = threeSigFigs * Math.pow(10, power5);
  const isExact5Band = Math.abs(fiveBandResistance - resistance) < 0.001;
  
  const fiveBand: FiveBandResistor = {
    band1: digitToColor(digit1_5band),
    band2: digitToColor(digit2_5band),
    band3: digitToColor(digit3_5band),
    multiplier: multiplierToColor(power5),
    tolerance: toleranceToColor(tolerance),
  };
  
  return {
    fourBand,
    fiveBand,
    isExact: isExact4Band || isExact5Band,
    nearestStandard: isExact4Band ? undefined : fourBandResistance,
  };
}

/**
 * E-series standard resistor values (E24 series)
 */
export const E24_VALUES = [
  1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0,
  3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1
];

/**
 * Find the nearest standard E24 resistor value
 * 
 * @param resistance - Target resistance in ohms
 * @returns Nearest standard value
 */
export function findNearestE24(resistance: number): number {
  if (resistance <= 0) return E24_VALUES[0];
  
  // Find the decade
  let decade = 1;
  let normalized = resistance;
  
  while (normalized >= 10) {
    normalized /= 10;
    decade *= 10;
  }
  
  while (normalized < 1) {
    normalized *= 10;
    decade /= 10;
  }
  
  // Find nearest E24 value
  let nearest = E24_VALUES[0];
  let minDiff = Math.abs(normalized - E24_VALUES[0]);
  
  for (const value of E24_VALUES) {
    const diff = Math.abs(normalized - value);
    if (diff < minDiff) {
      minDiff = diff;
      nearest = value;
    }
  }
  
  return nearest * decade;
}

/**
 * Get all available colors for a specific band type
 * 
 * @param bandType - Type of band
 * @returns Array of valid colors
 */
export function getAvailableColors(
  bandType: 'digit' | 'multiplier' | 'tolerance'
): BandColor[] {
  switch (bandType) {
    case 'digit':
      return ['black', 'brown', 'red', 'orange', 'yellow', 
              'green', 'blue', 'violet', 'gray', 'white'];
    case 'multiplier':
      return ['black', 'brown', 'red', 'orange', 'yellow',
              'green', 'blue', 'violet', 'gray', 'white', 'gold', 'silver'];
    case 'tolerance':
      return ['brown', 'red', 'green', 'blue', 'violet', 
              'gray', 'gold', 'silver', 'none'];
  }
}
