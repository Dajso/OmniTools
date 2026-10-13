import { formatFixed } from '../../utils/formatting';
/**
 * Depth of Field Calculator
 * 
 * Calculates depth of field parameters based on camera settings including
 * focal length, aperture, subject distance, and sensor size.
 * 
 * @module lib/calculations/photo/depth-of-field
 * @see Requirements 23.1, 23.11
 */

/**
 * Supported sensor sizes with their circle of confusion values
 */
export type SensorSize = 'full-frame' | 'aps-c' | 'aps-c-canon' | 'micro-four-thirds' | 'medium-format' | '1-inch';

/**
 * Circle of confusion values in mm for different sensor sizes
 * Based on standard industry values
 */
export const CIRCLE_OF_CONFUSION: Record<SensorSize, number> = {
  'full-frame': 0.03,           // 36x24mm sensor
  'aps-c': 0.02,                // ~23.5x15.6mm (Nikon, Sony, Fuji)
  'aps-c-canon': 0.019,         // ~22.3x14.9mm (Canon APS-C)
  'micro-four-thirds': 0.015,   // 17.3x13mm
  'medium-format': 0.05,        // ~44x33mm
  '1-inch': 0.011,              // 13.2x8.8mm
};

/**
 * Crop factors for different sensor sizes relative to full-frame
 */
export const CROP_FACTORS: Record<SensorSize, number> = {
  'full-frame': 1.0,
  'aps-c': 1.5,
  'aps-c-canon': 1.6,
  'micro-four-thirds': 2.0,
  'medium-format': 0.79,
  '1-inch': 2.7,
};

/**
 * Input parameters for depth of field calculation
 */
export interface DoFInput {
  /** Focal length in mm */
  focalLength: number;
  /** Aperture f-number (e.g., 2.8, 5.6, 11) */
  aperture: number;
  /** Subject distance in meters */
  subjectDistance: number;
  /** Sensor size type */
  sensorSize: SensorSize;
}

/**
 * Result of depth of field calculation
 */
export interface DoFResult {
  /** Near focus distance in meters */
  nearFocus: number;
  /** Far focus distance in meters (Infinity if beyond hyperfocal) */
  farFocus: number;
  /** Total depth of field in meters (Infinity if far focus is Infinity) */
  totalDoF: number;
  /** Hyperfocal distance in meters */
  hyperfocalDistance: number;
  /** Circle of confusion used in mm */
  circleOfConfusion: number;
  /** Whether the far focus extends to infinity */
  isInfinityFocus: boolean;
  /** Depth of field in front of subject in meters */
  dofInFront: number;
  /** Depth of field behind subject in meters (Infinity if extends to infinity) */
  dofBehind: number;
}

/**
 * Calculate the hyperfocal distance
 * 
 * The hyperfocal distance is the closest distance at which a lens can be focused
 * while keeping objects at infinity acceptably sharp.
 * 
 * Formula: H = f² / (N × c)
 * where:
 *   H = hyperfocal distance
 *   f = focal length
 *   N = f-number (aperture)
 *   c = circle of confusion
 * 
 * @param focalLength - Focal length in mm
 * @param aperture - Aperture f-number
 * @param circleOfConfusion - Circle of confusion in mm
 * @returns Hyperfocal distance in meters
 */
export function calculateHyperfocalDistance(
  focalLength: number,
  aperture: number,
  circleOfConfusion: number
): number {
  if (focalLength <= 0 || aperture <= 0 || circleOfConfusion <= 0) {
    throw new Error('Alle verdiene må være større enn 0');
  }
  
  // H = f² / (N × c), convert mm to meters
  const hyperfocalMm = (focalLength * focalLength) / (aperture * circleOfConfusion);
  return hyperfocalMm / 1000; // Convert to meters
}

/**
 * Calculate the near focus distance
 * 
 * Formula: Dn = (H × s) / (H + (s - f))
 * where:
 *   Dn = near focus distance
 *   H = hyperfocal distance
 *   s = subject distance
 *   f = focal length
 * 
 * @param hyperfocalDistance - Hyperfocal distance in meters
 * @param subjectDistance - Subject distance in meters
 * @param focalLength - Focal length in mm
 * @returns Near focus distance in meters
 */
export function calculateNearFocus(
  hyperfocalDistance: number,
  subjectDistance: number,
  focalLength: number
): number {
  const focalLengthMeters = focalLength / 1000;
  const numerator = hyperfocalDistance * subjectDistance;
  const denominator = hyperfocalDistance + (subjectDistance - focalLengthMeters);
  
  return numerator / denominator;
}

/**
 * Calculate the far focus distance
 * 
 * Formula: Df = (H × s) / (H - (s - f))
 * where:
 *   Df = far focus distance
 *   H = hyperfocal distance
 *   s = subject distance
 *   f = focal length
 * 
 * Returns Infinity if subject distance >= hyperfocal distance
 * 
 * @param hyperfocalDistance - Hyperfocal distance in meters
 * @param subjectDistance - Subject distance in meters
 * @param focalLength - Focal length in mm
 * @returns Far focus distance in meters (or Infinity)
 */
export function calculateFarFocus(
  hyperfocalDistance: number,
  subjectDistance: number,
  focalLength: number
): number {
  const focalLengthMeters = focalLength / 1000;
  const denominator = hyperfocalDistance - (subjectDistance - focalLengthMeters);
  
  // If denominator is <= 0, far focus extends to infinity
  if (denominator <= 0) {
    return Infinity;
  }
  
  const numerator = hyperfocalDistance * subjectDistance;
  return numerator / denominator;
}

/**
 * Calculate complete depth of field parameters
 * 
 * @param input - DoF calculation input parameters
 * @returns Complete DoF calculation results
 * @throws Error if any input parameter is invalid
 * 
 * @example
 * ```typescript
 * const result = calculateDoF({
 *   focalLength: 50,
 *   aperture: 2.8,
 *   subjectDistance: 3,
 *   sensorSize: 'full-frame'
 * });
 * // result.nearFocus < 3 < result.farFocus
 * ```
 */
export function calculateDoF(input: DoFInput): DoFResult {
  const { focalLength, aperture, subjectDistance, sensorSize } = input;
  
  // Validate inputs
  if (focalLength <= 0) {
    throw new Error('Brennvidden må være større enn 0');
  }
  if (aperture <= 0) {
    throw new Error('Blenderåpningen må være større enn 0');
  }
  if (subjectDistance <= 0) {
    throw new Error('Avstanden til motivet må være større enn 0');
  }
  
  // Minimum focus distance check (focal length in meters)
  const minFocusDistance = focalLength / 1000;
  if (subjectDistance <= minFocusDistance) {
    throw new Error(`Avstanden til motivet må være større enn brennvidden (${minFocusDistance} m)`);
  }
  
  const circleOfConfusion = CIRCLE_OF_CONFUSION[sensorSize];
  
  // Calculate hyperfocal distance
  const hyperfocalDistance = calculateHyperfocalDistance(
    focalLength,
    aperture,
    circleOfConfusion
  );
  
  // Calculate near and far focus distances
  const nearFocus = calculateNearFocus(hyperfocalDistance, subjectDistance, focalLength);
  const farFocus = calculateFarFocus(hyperfocalDistance, subjectDistance, focalLength);
  
  // Calculate total DoF
  const isInfinityFocus = !isFinite(farFocus);
  const totalDoF = isInfinityFocus ? Infinity : farFocus - nearFocus;
  
  // Calculate DoF distribution
  const dofInFront = subjectDistance - nearFocus;
  const dofBehind = isInfinityFocus ? Infinity : farFocus - subjectDistance;
  
  return {
    nearFocus,
    farFocus,
    totalDoF,
    hyperfocalDistance,
    circleOfConfusion,
    isInfinityFocus,
    dofInFront,
    dofBehind,
  };
}


/**
 * Get the equivalent focal length for a given sensor size
 * 
 * @param focalLength - Actual focal length in mm
 * @param sensorSize - Sensor size type
 * @returns Equivalent focal length in 35mm terms
 */
export function getEquivalentFocalLength(
  focalLength: number,
  sensorSize: SensorSize
): number {
  return focalLength * CROP_FACTORS[sensorSize];
}

/**
 * Calculate the aperture needed to achieve a specific depth of field
 * 
 * @param focalLength - Focal length in mm
 * @param subjectDistance - Subject distance in meters
 * @param desiredDoF - Desired total depth of field in meters
 * @param sensorSize - Sensor size type
 * @returns Required aperture f-number
 */
export function calculateApertureForDoF(
  focalLength: number,
  subjectDistance: number,
  desiredDoF: number,
  sensorSize: SensorSize
): number {
  const coc = CIRCLE_OF_CONFUSION[sensorSize];
  const s = subjectDistance * 1000; // Convert to mm
  const f = focalLength;
  const dof = desiredDoF * 1000; // Convert to mm
  
  // Derived from DoF formula
  // DoF ≈ 2 × N × c × s² / f²
  // N = DoF × f² / (2 × c × s²)
  const aperture = (dof * f * f) / (2 * coc * s * s);
  
  return Math.max(1, aperture); // Aperture can't be less than f/1
}

/**
 * Calculate the focus distance needed to achieve a specific depth of field range
 * 
 * @param nearLimit - Desired near focus limit in meters
 * @param farLimit - Desired far focus limit in meters
 * @returns Optimal focus distance in meters
 */
export function calculateOptimalFocusDistance(
  nearLimit: number,
  farLimit: number
): number {
  // The optimal focus distance is the harmonic mean of near and far limits
  // This ensures equal sharpness at both limits
  return (2 * nearLimit * farLimit) / (nearLimit + farLimit);
}

/**
 * Format a distance value for display
 * 
 * @param distance - Distance in meters
 * @param precision - Number of decimal places
 * @returns Formatted distance string
 */
export function formatDistance(distance: number, precision: number = 2): string {
  if (!isFinite(distance)) {
    return '∞';
  }
  
  if (distance < 1) {
    // Display in centimeters for small distances
    return `${formatFixed(distance * 100, precision)} cm`;
  }
  
  if (distance >= 1000) {
    // Display in kilometers for large distances
    return `${formatFixed(distance / 1000, precision)} km`;
  }
  
  return `${formatFixed(distance, precision)} m`;
}

/**
 * Common aperture values (f-stops)
 */
export const COMMON_APERTURES = [
  1.0, 1.2, 1.4, 1.8, 2.0, 2.8, 3.5, 4.0, 4.5, 5.0, 5.6, 6.3, 7.1, 8.0,
  9.0, 10, 11, 13, 14, 16, 18, 20, 22, 25, 29, 32
] as const;

/**
 * Common focal lengths in mm
 */
export const COMMON_FOCAL_LENGTHS = [
  14, 16, 18, 20, 24, 28, 35, 40, 50, 55, 60, 70, 85, 100, 105, 135, 
  150, 180, 200, 300, 400, 500, 600, 800
] as const;

/**
 * Sensor size display names
 */
export const SENSOR_SIZE_NAMES: Record<SensorSize, string> = {
  'full-frame': 'Fullformat (35 mm)',
  'aps-c': 'APS-C (Nikon/Sony/Fuji)',
  'aps-c-canon': 'APS-C (Canon)',
  'micro-four-thirds': 'Micro Four Thirds',
  'medium-format': 'Mellomformat',
  '1-inch': '1-inch',
};
