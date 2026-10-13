/**
 * Ohm's Law Calculator
 * 
 * Calculates voltage, current, resistance, and power using Ohm's Law
 * and the power equation. Given any two values, calculates the others.
 * 
 * V = I × R (Ohm's Law)
 * P = V × I (Power equation)
 * P = I² × R
 * P = V² / R
 * 
 * @module lib/calculations/electronics/ohms-law
 * @see Requirements 26.2, 26.12
 */

/**
 * Error class for Ohm's Law calculation errors
 */
export class OhmsLawError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'insufficient_data' | 'division_by_zero',
    public field?: string
  ) {
    super(message);
    this.name = 'OhmsLawError';
  }
}

/**
 * Input for Ohm's Law calculation
 * At least two values must be provided
 */
export interface OhmsLawInput {
  /** Voltage in volts (V) */
  voltage?: number;
  /** Current in amperes (A) */
  current?: number;
  /** Resistance in ohms (Ω) */
  resistance?: number;
  /** Power in watts (W) */
  power?: number;
}

/**
 * Result of Ohm's Law calculation
 */
export interface OhmsLawResult {
  /** Voltage in volts (V) */
  voltage: number;
  /** Current in amperes (A) */
  current: number;
  /** Resistance in ohms (Ω) */
  resistance: number;
  /** Power in watts (W) */
  power: number;
  /** Formatted voltage string */
  formattedVoltage: string;
  /** Formatted current string */
  formattedCurrent: string;
  /** Formatted resistance string */
  formattedResistance: string;
  /** Formatted power string */
  formattedPower: string;
  /** Which values were calculated (not provided) */
  calculated: ('voltage' | 'current' | 'resistance' | 'power')[];
}

/**
 * Format a value with appropriate SI prefix
 * 
 * @param value - The value to format
 * @param unit - The base unit symbol
 * @param decimals - Number of decimal places
 * @returns Formatted string with unit
 */
export function formatWithPrefix(
  value: number,
  unit: string,
  decimals: number = 3
): string {
  const prefixes = [
    { threshold: 1e12, prefix: 'T', divisor: 1e12 },
    { threshold: 1e9, prefix: 'G', divisor: 1e9 },
    { threshold: 1e6, prefix: 'M', divisor: 1e6 },
    { threshold: 1e3, prefix: 'k', divisor: 1e3 },
    { threshold: 1, prefix: '', divisor: 1 },
    { threshold: 1e-3, prefix: 'm', divisor: 1e-3 },
    { threshold: 1e-6, prefix: 'μ', divisor: 1e-6 },
    { threshold: 1e-9, prefix: 'n', divisor: 1e-9 },
    { threshold: 1e-12, prefix: 'p', divisor: 1e-12 },
  ];
  
  const absValue = Math.abs(value);
  
  for (const { threshold, prefix, divisor } of prefixes) {
    if (absValue >= threshold || threshold === 1e-12) {
      const scaled = value / divisor;
      const formatted = scaled.toFixed(decimals).replace(/\.?0+$/, '');
      return `${formatted}${prefix}${unit}`;
    }
  }
  
  return `${value.toFixed(decimals)}${unit}`;
}


/**
 * Count how many values are provided (not undefined and not NaN)
 */
function countProvided(input: OhmsLawInput): number {
  let count = 0;
  if (input.voltage !== undefined && !isNaN(input.voltage)) count++;
  if (input.current !== undefined && !isNaN(input.current)) count++;
  if (input.resistance !== undefined && !isNaN(input.resistance)) count++;
  if (input.power !== undefined && !isNaN(input.power)) count++;
  return count;
}

/**
 * Validate input values
 */
function validateInput(input: OhmsLawInput): void {
  if (input.voltage !== undefined && input.voltage < 0) {
    throw new OhmsLawError(
      'Spenningen kan ikke være negativ',
      'invalid_input',
      'voltage'
    );
  }
  if (input.current !== undefined && input.current < 0) {
    throw new OhmsLawError(
      'Strømmen kan ikke være negativ',
      'invalid_input',
      'current'
    );
  }
  if (input.resistance !== undefined && input.resistance <= 0) {
    throw new OhmsLawError(
      'Motstanden må være større enn null',
      'invalid_input',
      'resistance'
    );
  }
  if (input.power !== undefined && input.power < 0) {
    throw new OhmsLawError(
      'Effekten kan ikke være negativ',
      'invalid_input',
      'power'
    );
  }
}

/**
 * Calculate all electrical values using Ohm's Law
 * 
 * Given any two of voltage, current, resistance, or power,
 * calculates the remaining values.
 * 
 * @param input - Object with at least two known values
 * @returns Complete set of electrical values
 */
export function calculateOhmsLaw(input: OhmsLawInput): OhmsLawResult {
  validateInput(input);
  
  const providedCount = countProvided(input);
  
  if (providedCount < 2) {
    throw new OhmsLawError(
      'Du må oppgi minst to verdier',
      'insufficient_data'
    );
  }
  
  let { voltage, current, resistance, power } = input;
  const calculated: ('voltage' | 'current' | 'resistance' | 'power')[] = [];
  
  // Helper to check if a value is provided
  const isProvided = (v: number | undefined): v is number => 
    v !== undefined && !isNaN(v);
  
  // Calculate missing values based on what's provided
  // Priority: V and I -> R and P
  //          V and R -> I and P
  //          V and P -> I and R
  //          I and R -> V and P
  //          I and P -> V and R
  //          R and P -> V and I
  
  if (isProvided(voltage) && isProvided(current)) {
    // V and I known
    if (!isProvided(resistance)) {
      if (current === 0) {
        throw new OhmsLawError(
          'Kan ikke regne ut motstand når strømmen er null',
          'division_by_zero',
          'current'
        );
      }
      resistance = voltage / current;
      calculated.push('resistance');
    }
    if (!isProvided(power)) {
      power = voltage * current;
      calculated.push('power');
    }
  } else if (isProvided(voltage) && isProvided(resistance)) {
    // V and R known
    if (!isProvided(current)) {
      current = voltage / resistance;
      calculated.push('current');
    }
    if (!isProvided(power)) {
      power = (voltage * voltage) / resistance;
      calculated.push('power');
    }
  } else if (isProvided(voltage) && isProvided(power)) {
    // V and P known
    if (!isProvided(current)) {
      if (voltage === 0) {
        throw new OhmsLawError(
          'Kan ikke regne ut strøm når spenningen er null',
          'division_by_zero',
          'voltage'
        );
      }
      current = power / voltage;
      calculated.push('current');
    }
    if (!isProvided(resistance)) {
      if (power === 0) {
        throw new OhmsLawError(
          'Kan ikke regne ut motstand når effekten er null',
          'division_by_zero',
          'power'
        );
      }
      resistance = (voltage * voltage) / power;
      calculated.push('resistance');
    }
  } else if (isProvided(current) && isProvided(resistance)) {
    // I and R known
    if (!isProvided(voltage)) {
      voltage = current * resistance;
      calculated.push('voltage');
    }
    if (!isProvided(power)) {
      power = current * current * resistance;
      calculated.push('power');
    }
  } else if (isProvided(current) && isProvided(power)) {
    // I and P known
    if (!isProvided(voltage)) {
      if (current === 0) {
        throw new OhmsLawError(
          'Kan ikke regne ut spenning når strømmen er null',
          'division_by_zero',
          'current'
        );
      }
      voltage = power / current;
      calculated.push('voltage');
    }
    if (!isProvided(resistance)) {
      if (current === 0) {
        throw new OhmsLawError(
          'Kan ikke regne ut motstand når strømmen er null',
          'division_by_zero',
          'current'
        );
      }
      resistance = power / (current * current);
      calculated.push('resistance');
    }
  } else if (isProvided(resistance) && isProvided(power)) {
    // R and P known
    if (!isProvided(voltage)) {
      voltage = Math.sqrt(power * resistance);
      calculated.push('voltage');
    }
    if (!isProvided(current)) {
      current = Math.sqrt(power / resistance);
      calculated.push('current');
    }
  }
  
  // Ensure all values are defined
  if (!isProvided(voltage) || !isProvided(current) || 
      !isProvided(resistance) || !isProvided(power)) {
    throw new OhmsLawError(
      'Kan ikke regne ut alle verdiene ut fra det du har oppgitt',
      'insufficient_data'
    );
  }
  
  return {
    voltage,
    current,
    resistance,
    power,
    formattedVoltage: formatWithPrefix(voltage, 'V'),
    formattedCurrent: formatWithPrefix(current, 'A'),
    formattedResistance: formatWithPrefix(resistance, 'Ω'),
    formattedPower: formatWithPrefix(power, 'W'),
    calculated,
  };
}


/**
 * Calculate voltage from current and resistance
 * V = I × R
 * 
 * @param current - Current in amperes
 * @param resistance - Resistance in ohms
 * @returns Voltage in volts
 */
export function calculateVoltage(current: number, resistance: number): number {
  return current * resistance;
}

/**
 * Calculate current from voltage and resistance
 * I = V / R
 * 
 * @param voltage - Voltage in volts
 * @param resistance - Resistance in ohms
 * @returns Current in amperes
 */
export function calculateCurrent(voltage: number, resistance: number): number {
  if (resistance === 0) {
    throw new OhmsLawError(
      'Motstanden kan ikke være null',
      'division_by_zero',
      'resistance'
    );
  }
  return voltage / resistance;
}

/**
 * Calculate resistance from voltage and current
 * R = V / I
 * 
 * @param voltage - Voltage in volts
 * @param current - Current in amperes
 * @returns Resistance in ohms
 */
export function calculateResistance(voltage: number, current: number): number {
  if (current === 0) {
    throw new OhmsLawError(
      'Strømmen kan ikke være null',
      'division_by_zero',
      'current'
    );
  }
  return voltage / current;
}

/**
 * Calculate power from voltage and current
 * P = V × I
 * 
 * @param voltage - Voltage in volts
 * @param current - Current in amperes
 * @returns Power in watts
 */
export function calculatePower(voltage: number, current: number): number {
  return voltage * current;
}

/**
 * Calculate power from current and resistance
 * P = I² × R
 * 
 * @param current - Current in amperes
 * @param resistance - Resistance in ohms
 * @returns Power in watts
 */
export function calculatePowerFromIR(current: number, resistance: number): number {
  return current * current * resistance;
}

/**
 * Calculate power from voltage and resistance
 * P = V² / R
 * 
 * @param voltage - Voltage in volts
 * @param resistance - Resistance in ohms
 * @returns Power in watts
 */
export function calculatePowerFromVR(voltage: number, resistance: number): number {
  if (resistance === 0) {
    throw new OhmsLawError(
      'Motstanden kan ikke være null',
      'division_by_zero',
      'resistance'
    );
  }
  return (voltage * voltage) / resistance;
}
