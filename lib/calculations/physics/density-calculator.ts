/**
 * Density Calculator
 * 
 * Calculates density, mass, or volume using the density formula.
 * 
 * ρ = m / V (Density = Mass / Volume)
 * 
 * Given any two values, calculates the third.
 * 
 * @module lib/calculations/physics/density-calculator
 * @see Requirements 31.1, 31.7
 */

/**
 * Error class for density calculation errors
 */
export class DensityError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'insufficient_data' | 'division_by_zero',
    public field?: string
  ) {
    super(message);
    this.name = 'DensityError';
  }
}

/**
 * Common material densities in kg/m³
 */
export const MATERIAL_DENSITIES: Record<string, number> = {
  // Metals
  aluminum: 2700,
  brass: 8500,
  bronze: 8800,
  copper: 8960,
  gold: 19300,
  iron: 7870,
  lead: 11340,
  nickel: 8900,
  platinum: 21450,
  silver: 10490,
  steel: 7850,
  titanium: 4500,
  tungsten: 19250,
  zinc: 7130,
  
  // Woods
  balsa: 160,
  bamboo: 350,
  cedar: 380,
  cork: 240,
  mahogany: 545,
  oak: 750,
  pine: 510,
  plywood: 540,
  teak: 630,
  
  // Liquids
  water: 1000,
  seawater: 1025,
  milk: 1030,
  honey: 1420,
  oil_olive: 920,
  oil_motor: 880,
  gasoline: 750,
  diesel: 850,
  ethanol: 789,
  mercury: 13600,
  
  // Gases (at STP)
  air: 1.225,
  helium: 0.1785,
  hydrogen: 0.0899,
  nitrogen: 1.251,
  oxygen: 1.429,
  carbon_dioxide: 1.977,
  
  // Other materials
  concrete: 2400,
  glass: 2500,
  ice: 917,
  rubber: 1100,
  plastic_pvc: 1400,
  plastic_hdpe: 970,
  paper: 700,
  sand: 1600,
  soil: 1500,
};

/**
 * Input for density calculation
 * At least two values must be provided
 */
export interface DensityInput {
  /** Density in kg/m³ */
  density?: number;
  /** Mass in kg */
  mass?: number;
  /** Volume in m³ */
  volume?: number;
}

/**
 * Result of density calculation
 */
export interface DensityResult {
  /** Density in kg/m³ */
  density: number;
  /** Mass in kg */
  mass: number;
  /** Volume in m³ */
  volume: number;
  /** Formatted density string */
  formattedDensity: string;
  /** Formatted mass string */
  formattedMass: string;
  /** Formatted volume string */
  formattedVolume: string;
  /** Which value was calculated */
  calculated: 'density' | 'mass' | 'volume';
  /** Closest matching material (if any) */
  closestMaterial?: string;
}

/**
 * Format density with appropriate unit
 */
export function formatDensity(density: number): string {
  if (density >= 1000) {
    return `${density.toFixed(1)} kg/m³`;
  }
  if (density >= 1) {
    return `${density.toFixed(3)} kg/m³`;
  }
  return `${(density * 1000).toFixed(3)} g/m³`;
}

/**
 * Format mass with appropriate unit
 */
export function formatMass(mass: number): string {
  if (mass >= 1000) {
    return `${(mass / 1000).toFixed(3)} tonnes`;
  }
  if (mass >= 1) {
    return `${mass.toFixed(3)} kg`;
  }
  return `${(mass * 1000).toFixed(3)} g`;
}

/**
 * Format volume with appropriate unit
 */
export function formatVolume(volume: number): string {
  if (volume >= 1) {
    return `${volume.toFixed(4)} m³`;
  }
  if (volume >= 0.001) {
    return `${(volume * 1000).toFixed(3)} L`;
  }
  return `${(volume * 1000000).toFixed(3)} mL`;
}

/**
 * Find the closest matching material by density
 */
export function findClosestMaterial(density: number): string | undefined {
  let closestMaterial: string | undefined;
  let smallestDiff = Infinity;
  
  for (const [material, materialDensity] of Object.entries(MATERIAL_DENSITIES)) {
    const diff = Math.abs(density - materialDensity);
    const percentDiff = diff / materialDensity;
    
    // Only match if within 10% of the material's density
    if (percentDiff < 0.1 && diff < smallestDiff) {
      smallestDiff = diff;
      closestMaterial = material;
    }
  }
  
  return closestMaterial;
}

/**
 * Calculate density, mass, or volume
 * 
 * Given any two of density, mass, or volume, calculates the third.
 * 
 * @param input - Object with at least two known values
 * @returns Complete set of density values
 * 
 * @example
 * ```typescript
 * // Calculate density from mass and volume
 * const result = calculateDensity({ mass: 10, volume: 0.001 });
 * console.log(result.density); // 10000 kg/m³
 * 
 * // Calculate mass from density and volume
 * const result2 = calculateDensity({ density: 1000, volume: 0.5 });
 * console.log(result2.mass); // 500 kg
 * ```
 */
export function calculateDensity(input: DensityInput): DensityResult {
  const { density, mass, volume } = input;
  
  // Count provided values
  const providedCount = [density, mass, volume].filter(v => v !== undefined && !isNaN(v)).length;
  
  if (providedCount < 2) {
    throw new DensityError(
      'At least two values must be provided',
      'insufficient_data'
    );
  }
  
  // Validate inputs
  if (density !== undefined && density <= 0) {
    throw new DensityError('Density must be positive', 'invalid_input', 'density');
  }
  if (mass !== undefined && mass < 0) {
    throw new DensityError('Mass cannot be negative', 'invalid_input', 'mass');
  }
  if (volume !== undefined && volume <= 0) {
    throw new DensityError('Volume must be positive', 'invalid_input', 'volume');
  }
  
  let resultDensity: number;
  let resultMass: number;
  let resultVolume: number;
  let calculated: 'density' | 'mass' | 'volume';
  
  if (density !== undefined && mass !== undefined) {
    // Calculate volume: V = m / ρ
    resultDensity = density;
    resultMass = mass;
    resultVolume = mass / density;
    calculated = 'volume';
  } else if (density !== undefined && volume !== undefined) {
    // Calculate mass: m = ρ × V
    resultDensity = density;
    resultVolume = volume;
    resultMass = density * volume;
    calculated = 'mass';
  } else if (mass !== undefined && volume !== undefined) {
    // Calculate density: ρ = m / V
    resultMass = mass;
    resultVolume = volume;
    resultDensity = mass / volume;
    calculated = 'density';
  } else {
    throw new DensityError(
      'Unable to calculate from provided inputs',
      'insufficient_data'
    );
  }
  
  const closestMaterial = findClosestMaterial(resultDensity);
  
  return {
    density: resultDensity,
    mass: resultMass,
    volume: resultVolume,
    formattedDensity: formatDensity(resultDensity),
    formattedMass: formatMass(resultMass),
    formattedVolume: formatVolume(resultVolume),
    calculated,
    closestMaterial,
  };
}

/**
 * Calculate density from mass and volume
 * ρ = m / V
 */
export function densityFromMassVolume(mass: number, volume: number): number {
  if (volume === 0) {
    throw new DensityError('Volume cannot be zero', 'division_by_zero', 'volume');
  }
  return mass / volume;
}

/**
 * Calculate mass from density and volume
 * m = ρ × V
 */
export function massFromDensityVolume(density: number, volume: number): number {
  return density * volume;
}

/**
 * Calculate volume from mass and density
 * V = m / ρ
 */
export function volumeFromMassDensity(mass: number, density: number): number {
  if (density === 0) {
    throw new DensityError('Density cannot be zero', 'division_by_zero', 'density');
  }
  return mass / density;
}

/**
 * Check if an object will float in a fluid
 * 
 * @param objectDensity - Density of the object in kg/m³
 * @param fluidDensity - Density of the fluid in kg/m³ (default: water)
 * @returns true if the object will float
 */
export function willFloat(objectDensity: number, fluidDensity: number = 1000): boolean {
  return objectDensity < fluidDensity;
}

/**
 * Calculate the percentage of an object submerged when floating
 * 
 * @param objectDensity - Density of the object in kg/m³
 * @param fluidDensity - Density of the fluid in kg/m³ (default: water)
 * @returns Percentage submerged (0-100), or 100 if object sinks
 */
export function percentSubmerged(objectDensity: number, fluidDensity: number = 1000): number {
  if (objectDensity >= fluidDensity) {
    return 100; // Object sinks
  }
  return (objectDensity / fluidDensity) * 100;
}
