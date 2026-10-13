/**
 * LED Series Resistor Calculator
 * 
 * Calculates the required series resistor for an LED circuit.
 * R = (Vs - Vf) / If
 * 
 * @module lib/calculations/electronics/led-resistor
 * @see Requirements 26.4
 */

/**
 * Error class for LED resistor calculation errors
 */
export class LEDResistorError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'insufficient_voltage',
    public field?: string
  ) {
    super(message);
    this.name = 'LEDResistorError';
  }
}

/**
 * Common LED colors with typical forward voltage and current
 */
export const LED_COLORS: Record<string, { vf: number; ifTypical: number; name: string }> = {
  red: { vf: 2.0, ifTypical: 0.020, name: 'Rød' },
  orange: { vf: 2.1, ifTypical: 0.020, name: 'Oransje' },
  yellow: { vf: 2.1, ifTypical: 0.020, name: 'Gul' },
  green: { vf: 2.2, ifTypical: 0.020, name: 'Grønn' },
  blue: { vf: 3.2, ifTypical: 0.020, name: 'Blå' },
  white: { vf: 3.2, ifTypical: 0.020, name: 'Hvit' },
  uv: { vf: 3.4, ifTypical: 0.020, name: 'UV' },
  infrared: { vf: 1.5, ifTypical: 0.020, name: 'Infrarød' },
};

/**
 * Input for LED resistor calculation
 */
export interface LEDResistorInput {
  /** Supply voltage in volts */
  supplyVoltage: number;
  /** LED forward voltage in volts */
  forwardVoltage: number;
  /** LED forward current in amperes */
  forwardCurrent: number;
  /** Number of LEDs in series (default 1) */
  ledsInSeries?: number;
}

/**
 * Result of LED resistor calculation
 */
export interface LEDResistorResult {
  /** Required resistance in ohms */
  resistance: number;
  /** Nearest standard E24 resistor value */
  nearestStandard: number;
  /** Power dissipated by resistor in watts */
  resistorPower: number;
  /** Recommended resistor power rating */
  recommendedPowerRating: number;
  /** Voltage drop across resistor */
  resistorVoltage: number;
  /** Total LED voltage drop */
  totalLEDVoltage: number;
  /** Actual current with nearest standard resistor */
  actualCurrent: number;
  /** Formatted resistance string */
  formattedResistance: string;
}

/**
 * E24 standard resistor values
 */
const E24_VALUES = [
  1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0,
  3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1
];

/**
 * Find nearest E24 standard resistor value (rounds up for safety)
 */
function findNearestE24(resistance: number): number {
  if (resistance <= 0) return E24_VALUES[0];
  
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
  
  // Find nearest E24 value (prefer rounding up for LED safety)
  for (const value of E24_VALUES) {
    if (value >= normalized) {
      return value * decade;
    }
  }
  
  // If we're above all E24 values in this decade, go to next decade
  return E24_VALUES[0] * decade * 10;
}

/**
 * Calculate required series resistor for LED
 * 
 * @param input - LED circuit parameters
 * @returns Calculated resistor value and related information
 */
export function calculateLEDResistor(input: LEDResistorInput): LEDResistorResult {
  const { supplyVoltage, forwardVoltage, forwardCurrent, ledsInSeries = 1 } = input;
  
  // Validate inputs
  if (supplyVoltage <= 0) {
    throw new LEDResistorError(
      'Forsyningsspenningen må være større enn null',
      'invalid_input',
      'supplyVoltage'
    );
  }
  
  if (forwardVoltage <= 0) {
    throw new LEDResistorError(
      'Framspenningen må være større enn null',
      'invalid_input',
      'forwardVoltage'
    );
  }
  
  if (forwardCurrent <= 0) {
    throw new LEDResistorError(
      'Framstrømmen må være større enn null',
      'invalid_input',
      'forwardCurrent'
    );
  }
  
  if (ledsInSeries < 1) {
    throw new LEDResistorError(
      'Du må ha minst én LED',
      'invalid_input',
      'ledsInSeries'
    );
  }
  
  const totalLEDVoltage = forwardVoltage * ledsInSeries;
  
  if (totalLEDVoltage >= supplyVoltage) {
    throw new LEDResistorError(
      `Forsyningsspenningen (${supplyVoltage} V) må være høyere enn samlet spenning over LED-ene (${totalLEDVoltage} V)`,
      'insufficient_voltage'
    );
  }
  
  // R = (Vs - Vf) / If
  const resistorVoltage = supplyVoltage - totalLEDVoltage;
  const resistance = resistorVoltage / forwardCurrent;
  const nearestStandard = findNearestE24(resistance);
  
  // Power dissipated by resistor: P = I² × R
  const resistorPower = forwardCurrent * forwardCurrent * resistance;
  
  // Recommend power rating with 2x safety margin
  const recommendedPowerRating = getRecommendedPowerRating(resistorPower * 2);
  
  // Actual current with nearest standard resistor
  const actualCurrent = resistorVoltage / nearestStandard;
  
  return {
    resistance,
    nearestStandard,
    resistorPower,
    recommendedPowerRating,
    resistorVoltage,
    totalLEDVoltage,
    actualCurrent,
    formattedResistance: formatResistance(nearestStandard),
  };
}

/**
 * Get recommended standard power rating
 */
function getRecommendedPowerRating(power: number): number {
  const standardRatings = [0.125, 0.25, 0.5, 1, 2, 5, 10];
  for (const rating of standardRatings) {
    if (rating >= power) return rating;
  }
  return Math.ceil(power);
}

/**
 * Format resistance with appropriate unit
 */
function formatResistance(ohms: number): string {
  if (ohms >= 1e6) {
    return `${(ohms / 1e6).toFixed(2)}MΩ`;
  } else if (ohms >= 1e3) {
    return `${(ohms / 1e3).toFixed(2)}kΩ`;
  } else {
    return `${ohms.toFixed(2)}Ω`;
  }
}

/**
 * Calculate for multiple LEDs in parallel (each with own resistor)
 * 
 * @param supplyVoltage - Supply voltage
 * @param forwardVoltage - LED forward voltage
 * @param forwardCurrent - LED forward current
 * @param ledCount - Number of parallel LED+resistor pairs
 * @returns Total current draw and individual resistor value
 */
export function calculateParallelLEDs(
  supplyVoltage: number,
  forwardVoltage: number,
  forwardCurrent: number,
  ledCount: number
): { resistorPerLED: number; totalCurrent: number; totalPower: number } {
  const result = calculateLEDResistor({
    supplyVoltage,
    forwardVoltage,
    forwardCurrent,
  });
  
  return {
    resistorPerLED: result.nearestStandard,
    totalCurrent: forwardCurrent * ledCount,
    totalPower: (result.resistorPower + forwardVoltage * forwardCurrent) * ledCount,
  };
}
