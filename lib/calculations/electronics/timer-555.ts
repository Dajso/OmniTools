/**
 * 555 Timer Calculator
 * 
 * Calculates frequency and duty cycle for 555 timer circuits
 * in astable (oscillator) and monostable (one-shot) modes.
 * 
 * @module lib/calculations/electronics/timer-555
 * @see Requirements 26.8
 */

/**
 * 555 Timer operating modes
 */
export type Timer555Mode = 'astable' | 'monostable';

/**
 * Input for astable mode calculation
 * Astable mode produces a continuous square wave
 */
export interface AstableInput {
  /** R1 resistor in ohms */
  r1: number;
  /** R2 resistor in ohms */
  r2: number;
  /** Capacitor in farads */
  capacitor: number;
}

/**
 * Result of astable mode calculation
 */
export interface AstableResult {
  /** Frequency in Hz */
  frequency: number;
  /** Period in seconds */
  period: number;
  /** High time (t1) in seconds */
  highTime: number;
  /** Low time (t2) in seconds */
  lowTime: number;
  /** Duty cycle as percentage */
  dutyCycle: number;
  /** Formatted frequency string */
  formattedFrequency: string;
  /** Formatted period string */
  formattedPeriod: string;
}

/**
 * Input for monostable mode calculation
 * Monostable mode produces a single pulse
 */
export interface MonostableInput {
  /** R resistor in ohms */
  resistance: number;
  /** Capacitor in farads */
  capacitor: number;
}

/**
 * Result of monostable mode calculation
 */
export interface MonostableResult {
  /** Pulse duration in seconds */
  pulseDuration: number;
  /** Formatted duration string */
  formattedDuration: string;
}

/**
 * Calculate 555 timer in astable mode
 * 
 * Formulas:
 * - t1 (high) = 0.693 × (R1 + R2) × C
 * - t2 (low) = 0.693 × R2 × C
 * - Period = t1 + t2 = 0.693 × (R1 + 2×R2) × C
 * - Frequency = 1.44 / ((R1 + 2×R2) × C)
 * - Duty Cycle = (R1 + R2) / (R1 + 2×R2) × 100%
 * 
 * @param input - Astable mode parameters
 * @returns Calculated frequency and timing values
 */
export function calculateAstable(input: AstableInput): AstableResult {
  const { r1, r2, capacitor } = input;
  
  if (r1 <= 0) throw new Error('R1 must be positive');
  if (r2 <= 0) throw new Error('R2 must be positive');
  if (capacitor <= 0) throw new Error('Capacitor must be positive');
  
  const highTime = 0.693 * (r1 + r2) * capacitor;
  const lowTime = 0.693 * r2 * capacitor;
  const period = highTime + lowTime;
  const frequency = 1 / period;
  const dutyCycle = ((r1 + r2) / (r1 + 2 * r2)) * 100;
  
  return {
    frequency,
    period,
    highTime,
    lowTime,
    dutyCycle,
    formattedFrequency: formatFrequency(frequency),
    formattedPeriod: formatTime(period),
  };
}

/**
 * Calculate 555 timer in monostable mode
 * 
 * Formula: t = 1.1 × R × C
 * 
 * @param input - Monostable mode parameters
 * @returns Calculated pulse duration
 */
export function calculateMonostable(input: MonostableInput): MonostableResult {
  const { resistance, capacitor } = input;
  
  if (resistance <= 0) throw new Error('Resistance must be positive');
  if (capacitor <= 0) throw new Error('Capacitor must be positive');
  
  const pulseDuration = 1.1 * resistance * capacitor;
  
  return {
    pulseDuration,
    formattedDuration: formatTime(pulseDuration),
  };
}

/**
 * Calculate required components for desired astable frequency
 * 
 * @param frequency - Desired frequency in Hz
 * @param dutyCycle - Desired duty cycle (50-100%)
 * @param capacitor - Capacitor value in farads
 * @returns Required R1 and R2 values
 */
export function calculateAstableComponents(
  frequency: number,
  dutyCycle: number,
  capacitor: number
): { r1: number; r2: number } {
  if (frequency <= 0) throw new Error('Frequency must be positive');
  if (dutyCycle < 50 || dutyCycle > 100) {
    throw new Error('Duty cycle must be between 50% and 100% for standard 555 astable');
  }
  if (capacitor <= 0) throw new Error('Capacitor must be positive');
  
  // From duty cycle: D = (R1 + R2) / (R1 + 2R2)
  // Let x = R1/R2, then D = (x + 1) / (x + 2)
  // Solving: x = (2D - 1) / (1 - D)
  // But D must be > 50% for standard 555
  
  const d = dutyCycle / 100;
  
  // Total resistance from frequency: R_total = 1.44 / (f × C)
  // where R_total = R1 + 2×R2
  const rTotal = 1.44 / (frequency * capacitor);
  
  // From duty cycle equation:
  // D = (R1 + R2) / (R1 + 2R2)
  // D × (R1 + 2R2) = R1 + R2
  // D × R1 + 2D × R2 = R1 + R2
  // R2 × (2D - 1) = R1 × (1 - D)
  // R2 = R1 × (1 - D) / (2D - 1)
  
  // Also: R1 + 2R2 = rTotal
  // R1 + 2 × R1 × (1-D)/(2D-1) = rTotal
  // R1 × (1 + 2(1-D)/(2D-1)) = rTotal
  // R1 × ((2D-1 + 2-2D)/(2D-1)) = rTotal
  // R1 × (1/(2D-1)) = rTotal
  // R1 = rTotal × (2D - 1)
  
  const r1 = rTotal * (2 * d - 1);
  const r2 = (rTotal - r1) / 2;
  
  return { r1, r2 };
}

/**
 * Calculate required components for desired monostable pulse
 * 
 * @param pulseDuration - Desired pulse duration in seconds
 * @param capacitor - Capacitor value in farads
 * @returns Required resistance value
 */
export function calculateMonostableResistance(
  pulseDuration: number,
  capacitor: number
): number {
  if (pulseDuration <= 0) throw new Error('Pulse duration must be positive');
  if (capacitor <= 0) throw new Error('Capacitor must be positive');
  
  // t = 1.1 × R × C
  // R = t / (1.1 × C)
  return pulseDuration / (1.1 * capacitor);
}

/**
 * Format frequency with appropriate unit
 */
function formatFrequency(hz: number): string {
  if (hz >= 1e6) return `${(hz / 1e6).toFixed(2)} MHz`;
  if (hz >= 1e3) return `${(hz / 1e3).toFixed(2)} kHz`;
  return `${hz.toFixed(2)} Hz`;
}

/**
 * Format time with appropriate unit
 */
function formatTime(seconds: number): string {
  if (seconds >= 1) return `${seconds.toFixed(3)} s`;
  if (seconds >= 1e-3) return `${(seconds * 1e3).toFixed(2)} ms`;
  if (seconds >= 1e-6) return `${(seconds * 1e6).toFixed(2)} μs`;
  return `${(seconds * 1e9).toFixed(2)} ns`;
}
