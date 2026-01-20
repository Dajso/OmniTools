/**
 * Kinetic Energy Calculator
 * 
 * Calculates kinetic energy, mass, or velocity using the kinetic energy formula.
 * 
 * KE = ½mv² (Kinetic Energy = ½ × Mass × Velocity²)
 * 
 * Given any two values, calculates the third.
 * 
 * @module lib/calculations/physics/kinetic-energy-calculator
 * @see Requirements 31.2, 31.7
 */

/**
 * Error class for kinetic energy calculation errors
 */
export class KineticEnergyError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'insufficient_data' | 'division_by_zero',
    public field?: string
  ) {
    super(message);
    this.name = 'KineticEnergyError';
  }
}

/**
 * Input for kinetic energy calculation
 * At least two values must be provided
 */
export interface KineticEnergyInput {
  /** Kinetic energy in Joules (J) */
  kineticEnergy?: number;
  /** Mass in kilograms (kg) */
  mass?: number;
  /** Velocity in meters per second (m/s) */
  velocity?: number;
}

/**
 * Result of kinetic energy calculation
 */
export interface KineticEnergyResult {
  /** Kinetic energy in Joules (J) */
  kineticEnergy: number;
  /** Mass in kilograms (kg) */
  mass: number;
  /** Velocity in meters per second (m/s) */
  velocity: number;
  /** Formatted kinetic energy string */
  formattedEnergy: string;
  /** Formatted mass string */
  formattedMass: string;
  /** Formatted velocity string */
  formattedVelocity: string;
  /** Which value was calculated */
  calculated: 'kineticEnergy' | 'mass' | 'velocity';
  /** Energy in other units */
  energyInKWh: number;
  energyInCalories: number;
  energyInBTU: number;
}

/**
 * Format energy with appropriate SI prefix
 */
export function formatEnergy(joules: number): string {
  if (joules >= 1e9) {
    return `${(joules / 1e9).toFixed(3)} GJ`;
  }
  if (joules >= 1e6) {
    return `${(joules / 1e6).toFixed(3)} MJ`;
  }
  if (joules >= 1e3) {
    return `${(joules / 1e3).toFixed(3)} kJ`;
  }
  if (joules >= 1) {
    return `${joules.toFixed(3)} J`;
  }
  return `${(joules * 1000).toFixed(3)} mJ`;
}

/**
 * Format mass with appropriate unit
 */
export function formatKineticMass(mass: number): string {
  if (mass >= 1000) {
    return `${(mass / 1000).toFixed(3)} tonnes`;
  }
  if (mass >= 1) {
    return `${mass.toFixed(3)} kg`;
  }
  return `${(mass * 1000).toFixed(3)} g`;
}

/**
 * Format velocity with appropriate unit
 */
export function formatVelocity(velocity: number): string {
  if (velocity >= 1000) {
    return `${(velocity / 1000).toFixed(3)} km/s`;
  }
  return `${velocity.toFixed(3)} m/s`;
}

/**
 * Convert Joules to kilowatt-hours
 */
export function joulesToKWh(joules: number): number {
  return joules / 3600000;
}

/**
 * Convert Joules to calories
 */
export function joulesToCalories(joules: number): number {
  return joules / 4.184;
}

/**
 * Convert Joules to BTU
 */
export function joulesToBTU(joules: number): number {
  return joules / 1055.06;
}

/**
 * Calculate kinetic energy, mass, or velocity
 * 
 * Given any two of kinetic energy, mass, or velocity, calculates the third.
 * 
 * @param input - Object with at least two known values
 * @returns Complete set of kinetic energy values
 * 
 * @example
 * ```typescript
 * // Calculate kinetic energy from mass and velocity
 * const result = calculateKineticEnergy({ mass: 10, velocity: 5 });
 * console.log(result.kineticEnergy); // 125 J
 * 
 * // Calculate velocity from kinetic energy and mass
 * const result2 = calculateKineticEnergy({ kineticEnergy: 100, mass: 2 });
 * console.log(result2.velocity); // 10 m/s
 * ```
 */
export function calculateKineticEnergy(input: KineticEnergyInput): KineticEnergyResult {
  const { kineticEnergy, mass, velocity } = input;

  // Count provided values
  const providedCount = [kineticEnergy, mass, velocity].filter(v => v !== undefined && !isNaN(v)).length;

  if (providedCount < 2) {
    throw new KineticEnergyError(
      'At least two values must be provided',
      'insufficient_data'
    );
  }

  // Validate inputs
  if (kineticEnergy !== undefined && kineticEnergy < 0) {
    throw new KineticEnergyError('Kinetic energy cannot be negative', 'invalid_input', 'kineticEnergy');
  }
  if (mass !== undefined && mass <= 0) {
    throw new KineticEnergyError('Mass must be positive', 'invalid_input', 'mass');
  }
  if (velocity !== undefined && velocity < 0) {
    throw new KineticEnergyError('Velocity cannot be negative', 'invalid_input', 'velocity');
  }

  let resultEnergy: number;
  let resultMass: number;
  let resultVelocity: number;
  let calculated: 'kineticEnergy' | 'mass' | 'velocity';

  if (mass !== undefined && velocity !== undefined) {
    // Calculate kinetic energy: KE = ½mv²
    resultMass = mass;
    resultVelocity = velocity;
    resultEnergy = 0.5 * mass * velocity * velocity;
    calculated = 'kineticEnergy';
  } else if (kineticEnergy !== undefined && velocity !== undefined) {
    // Calculate mass: m = 2KE / v²
    if (velocity === 0) {
      throw new KineticEnergyError('Cannot calculate mass when velocity is zero', 'division_by_zero', 'velocity');
    }
    resultEnergy = kineticEnergy;
    resultVelocity = velocity;
    resultMass = (2 * kineticEnergy) / (velocity * velocity);
    calculated = 'mass';
  } else if (kineticEnergy !== undefined && mass !== undefined) {
    // Calculate velocity: v = √(2KE / m)
    resultEnergy = kineticEnergy;
    resultMass = mass;
    resultVelocity = Math.sqrt((2 * kineticEnergy) / mass);
    calculated = 'velocity';
  } else {
    throw new KineticEnergyError(
      'Unable to calculate from provided inputs',
      'insufficient_data'
    );
  }

  return {
    kineticEnergy: resultEnergy,
    mass: resultMass,
    velocity: resultVelocity,
    formattedEnergy: formatEnergy(resultEnergy),
    formattedMass: formatKineticMass(resultMass),
    formattedVelocity: formatVelocity(resultVelocity),
    calculated,
    energyInKWh: joulesToKWh(resultEnergy),
    energyInCalories: joulesToCalories(resultEnergy),
    energyInBTU: joulesToBTU(resultEnergy),
  };
}

/**
 * Calculate kinetic energy from mass and velocity
 * KE = ½mv²
 */
export function kineticEnergyFromMassVelocity(mass: number, velocity: number): number {
  return 0.5 * mass * velocity * velocity;
}

/**
 * Calculate mass from kinetic energy and velocity
 * m = 2KE / v²
 */
export function massFromEnergyVelocity(kineticEnergy: number, velocity: number): number {
  if (velocity === 0) {
    throw new KineticEnergyError('Velocity cannot be zero', 'division_by_zero', 'velocity');
  }
  return (2 * kineticEnergy) / (velocity * velocity);
}

/**
 * Calculate velocity from kinetic energy and mass
 * v = √(2KE / m)
 */
export function velocityFromEnergyMass(kineticEnergy: number, mass: number): number {
  if (mass === 0) {
    throw new KineticEnergyError('Mass cannot be zero', 'division_by_zero', 'mass');
  }
  return Math.sqrt((2 * kineticEnergy) / mass);
}

/**
 * Calculate the velocity needed to achieve a certain kinetic energy
 * 
 * @param targetEnergy - Target kinetic energy in Joules
 * @param mass - Mass in kg
 * @returns Required velocity in m/s
 */
export function velocityForEnergy(targetEnergy: number, mass: number): number {
  return velocityFromEnergyMass(targetEnergy, mass);
}

/**
 * Compare kinetic energies of two objects
 * 
 * @param mass1 - Mass of first object in kg
 * @param velocity1 - Velocity of first object in m/s
 * @param mass2 - Mass of second object in kg
 * @param velocity2 - Velocity of second object in m/s
 * @returns Ratio of KE1 to KE2
 */
export function compareKineticEnergies(
  mass1: number,
  velocity1: number,
  mass2: number,
  velocity2: number
): number {
  const ke1 = kineticEnergyFromMassVelocity(mass1, velocity1);
  const ke2 = kineticEnergyFromMassVelocity(mass2, velocity2);

  if (ke2 === 0) {
    return Infinity;
  }

  return ke1 / ke2;
}
