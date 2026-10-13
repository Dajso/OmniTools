/**
 * Voltage Divider Calculator
 * 
 * Calculates output voltage for a resistive voltage divider circuit.
 * Vout = Vin × (R2 / (R1 + R2))
 * 
 * @module lib/calculations/electronics/voltage-divider
 * @see Requirements 26.3
 */

/**
 * Error class for voltage divider calculation errors
 */
export class VoltageDividerError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'division_by_zero',
    public field?: string
  ) {
    super(message);
    this.name = 'VoltageDividerError';
  }
}

/**
 * Input for voltage divider calculation
 */
export interface VoltageDividerInput {
  /** Input voltage in volts */
  inputVoltage: number;
  /** Top resistor (R1) in ohms */
  r1: number;
  /** Bottom resistor (R2) in ohms */
  r2: number;
}

/**
 * Result of voltage divider calculation
 */
export interface VoltageDividerResult {
  /** Output voltage in volts */
  outputVoltage: number;
  /** Voltage drop across R1 */
  voltageDropR1: number;
  /** Voltage drop across R2 (same as output) */
  voltageDropR2: number;
  /** Division ratio (R2 / (R1 + R2)) */
  divisionRatio: number;
  /** Total resistance */
  totalResistance: number;
  /** Current through the divider (assuming no load) */
  current: number;
  /** Power dissipated by R1 */
  powerR1: number;
  /** Power dissipated by R2 */
  powerR2: number;
  /** Total power dissipated */
  totalPower: number;
  /** Formatted output voltage */
  formattedOutput: string;
}

/**
 * Calculate voltage divider output
 * 
 * @param input - Voltage divider parameters
 * @returns Calculated output and related values
 */
export function calculateVoltageDivider(input: VoltageDividerInput): VoltageDividerResult {
  const { inputVoltage, r1, r2 } = input;
  
  // Validate inputs
  if (inputVoltage < 0) {
    throw new VoltageDividerError(
      'Inngangsspenningen kan ikke være negativ',
      'invalid_input',
      'inputVoltage'
    );
  }
  
  if (r1 < 0) {
    throw new VoltageDividerError(
      'R1 kan ikke være negativ',
      'invalid_input',
      'r1'
    );
  }
  
  if (r2 < 0) {
    throw new VoltageDividerError(
      'R2 kan ikke være negativ',
      'invalid_input',
      'r2'
    );
  }
  
  const totalResistance = r1 + r2;
  
  if (totalResistance === 0) {
    throw new VoltageDividerError(
      'Samlet motstand kan ikke være null',
      'division_by_zero'
    );
  }
  
  const divisionRatio = r2 / totalResistance;
  const outputVoltage = inputVoltage * divisionRatio;
  const voltageDropR1 = inputVoltage - outputVoltage;
  const current = inputVoltage / totalResistance;
  const powerR1 = current * current * r1;
  const powerR2 = current * current * r2;
  
  return {
    outputVoltage,
    voltageDropR1,
    voltageDropR2: outputVoltage,
    divisionRatio,
    totalResistance,
    current,
    powerR1,
    powerR2,
    totalPower: powerR1 + powerR2,
    formattedOutput: `${outputVoltage.toFixed(3)}V`,
  };
}

/**
 * Calculate required R2 for a desired output voltage
 * 
 * @param inputVoltage - Input voltage in volts
 * @param outputVoltage - Desired output voltage in volts
 * @param r1 - Known R1 value in ohms
 * @returns Required R2 value in ohms
 */
export function calculateR2ForOutput(
  inputVoltage: number,
  outputVoltage: number,
  r1: number
): number {
  if (outputVoltage >= inputVoltage) {
    throw new VoltageDividerError(
      'Utgangsspenningen må være lavere enn inngangsspenningen',
      'invalid_input',
      'outputVoltage'
    );
  }
  
  if (outputVoltage <= 0) {
    throw new VoltageDividerError(
      'Utgangsspenningen må være større enn null',
      'invalid_input',
      'outputVoltage'
    );
  }
  
  // Vout = Vin × R2 / (R1 + R2)
  // Vout × (R1 + R2) = Vin × R2
  // Vout × R1 + Vout × R2 = Vin × R2
  // Vout × R1 = Vin × R2 - Vout × R2
  // Vout × R1 = R2 × (Vin - Vout)
  // R2 = (Vout × R1) / (Vin - Vout)
  
  return (outputVoltage * r1) / (inputVoltage - outputVoltage);
}

/**
 * Calculate required R1 for a desired output voltage
 * 
 * @param inputVoltage - Input voltage in volts
 * @param outputVoltage - Desired output voltage in volts
 * @param r2 - Known R2 value in ohms
 * @returns Required R1 value in ohms
 */
export function calculateR1ForOutput(
  inputVoltage: number,
  outputVoltage: number,
  r2: number
): number {
  if (outputVoltage >= inputVoltage) {
    throw new VoltageDividerError(
      'Utgangsspenningen må være lavere enn inngangsspenningen',
      'invalid_input',
      'outputVoltage'
    );
  }
  
  if (outputVoltage <= 0) {
    throw new VoltageDividerError(
      'Utgangsspenningen må være større enn null',
      'invalid_input',
      'outputVoltage'
    );
  }
  
  // R1 = R2 × (Vin - Vout) / Vout
  return (r2 * (inputVoltage - outputVoltage)) / outputVoltage;
}
