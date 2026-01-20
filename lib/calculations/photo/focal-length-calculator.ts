/**
 * Focal Length Calculator
 * 
 * Calculates equivalent focal lengths across different sensor sizes
 * using crop factors.
 * 
 * @module lib/calculations/photo/focal-length-calculator
 * @see Requirements 23.6
 */

/**
 * Sensor format with dimensions and crop factor
 */
export interface SensorFormat {
  name: string;
  /** Sensor width in mm */
  width: number;
  /** Sensor height in mm */
  height: number;
  /** Crop factor relative to full frame (35mm) */
  cropFactor: number;
  /** Diagonal in mm */
  diagonal: number;
}

/**
 * Common sensor formats
 */
export const SENSOR_FORMATS: Record<string, SensorFormat> = {
  'medium-format-gfx': {
    name: 'Medium Format (Fuji GFX)',
    width: 43.8,
    height: 32.9,
    cropFactor: 0.79,
    diagonal: 54.78,
  },
  'medium-format-hasselblad': {
    name: 'Medium Format (Hasselblad)',
    width: 43.8,
    height: 32.9,
    cropFactor: 0.79,
    diagonal: 54.78,
  },
  'full-frame': {
    name: 'Full Frame (35mm)',
    width: 36,
    height: 24,
    cropFactor: 1.0,
    diagonal: 43.27,
  },
  'aps-h': {
    name: 'APS-H (Canon 1D)',
    width: 28.7,
    height: 19,
    cropFactor: 1.3,
    diagonal: 34.42,
  },
  'aps-c-nikon': {
    name: 'APS-C (Nikon DX)',
    width: 23.5,
    height: 15.6,
    cropFactor: 1.5,
    diagonal: 28.21,
  },
  'aps-c-canon': {
    name: 'APS-C (Canon)',
    width: 22.3,
    height: 14.9,
    cropFactor: 1.6,
    diagonal: 26.82,
  },
  'aps-c-sony': {
    name: 'APS-C (Sony/Fuji)',
    width: 23.5,
    height: 15.6,
    cropFactor: 1.5,
    diagonal: 28.21,
  },
  'micro-four-thirds': {
    name: 'Micro Four Thirds',
    width: 17.3,
    height: 13,
    cropFactor: 2.0,
    diagonal: 21.64,
  },
  '1-inch': {
    name: '1-inch',
    width: 13.2,
    height: 8.8,
    cropFactor: 2.7,
    diagonal: 15.86,
  },
  '1/1.7-inch': {
    name: '1/1.7-inch',
    width: 7.6,
    height: 5.7,
    cropFactor: 4.7,
    diagonal: 9.5,
  },
  '1/2.3-inch': {
    name: '1/2.3-inch (Compact)',
    width: 6.17,
    height: 4.55,
    cropFactor: 5.6,
    diagonal: 7.66,
  },
  'smartphone': {
    name: 'Smartphone (typical)',
    width: 4.8,
    height: 3.6,
    cropFactor: 7.5,
    diagonal: 6.0,
  },
};

/**
 * Result of focal length conversion
 */
export interface FocalLengthResult {
  /** Original focal length in mm */
  originalFocalLength: number;
  /** Source sensor format */
  sourceFormat: SensorFormat;
  /** Equivalent focal length in 35mm terms */
  equivalentFocalLength: number;
  /** Target sensor format */
  targetFormat: SensorFormat;
  /** Converted focal length for target sensor */
  convertedFocalLength: number;
  /** Field of view in degrees (horizontal) */
  horizontalFoV: number;
  /** Field of view in degrees (vertical) */
  verticalFoV: number;
  /** Field of view in degrees (diagonal) */
  diagonalFoV: number;
}

/**
 * Calculate equivalent focal length between sensor formats
 * 
 * @param focalLength - Actual focal length in mm
 * @param sourceFormat - Source sensor format key
 * @param targetFormat - Target sensor format key (default: full-frame)
 * @returns Focal length conversion results
 * @throws Error if formats are invalid
 * 
 * @example
 * ```typescript
 * const result = calculateEquivalentFocalLength(50, 'aps-c-nikon', 'full-frame');
 * // result.equivalentFocalLength = 75 (50 × 1.5)
 * ```
 */
export function calculateEquivalentFocalLength(
  focalLength: number,
  sourceFormat: keyof typeof SENSOR_FORMATS,
  targetFormat: keyof typeof SENSOR_FORMATS = 'full-frame'
): FocalLengthResult {
  if (focalLength <= 0) {
    throw new Error('Focal length must be positive');
  }

  const source = SENSOR_FORMATS[sourceFormat];
  const target = SENSOR_FORMATS[targetFormat];

  if (!source) {
    throw new Error(`Invalid source format: ${sourceFormat}`);
  }
  if (!target) {
    throw new Error(`Invalid target format: ${targetFormat}`);
  }

  // Calculate 35mm equivalent
  const equivalentFocalLength = focalLength * source.cropFactor;

  // Calculate converted focal length for target sensor
  const convertedFocalLength = equivalentFocalLength / target.cropFactor;

  // Calculate field of view using the source sensor
  const horizontalFoV = calculateFieldOfView(focalLength, source.width);
  const verticalFoV = calculateFieldOfView(focalLength, source.height);
  const diagonalFoV = calculateFieldOfView(focalLength, source.diagonal);

  return {
    originalFocalLength: focalLength,
    sourceFormat: source,
    equivalentFocalLength: Math.round(equivalentFocalLength * 10) / 10,
    targetFormat: target,
    convertedFocalLength: Math.round(convertedFocalLength * 10) / 10,
    horizontalFoV: Math.round(horizontalFoV * 10) / 10,
    verticalFoV: Math.round(verticalFoV * 10) / 10,
    diagonalFoV: Math.round(diagonalFoV * 10) / 10,
  };
}

/**
 * Calculate field of view in degrees
 * 
 * @param focalLength - Focal length in mm
 * @param sensorDimension - Sensor dimension in mm
 * @returns Field of view in degrees
 */
export function calculateFieldOfView(focalLength: number, sensorDimension: number): number {
  // FoV = 2 × arctan(d / (2 × f))
  return 2 * Math.atan(sensorDimension / (2 * focalLength)) * (180 / Math.PI);
}

/**
 * Calculate focal length needed for a specific field of view
 * 
 * @param fieldOfView - Desired field of view in degrees
 * @param sensorDimension - Sensor dimension in mm
 * @returns Required focal length in mm
 */
export function calculateFocalLengthForFoV(fieldOfView: number, sensorDimension: number): number {
  // f = d / (2 × tan(FoV / 2))
  const fovRadians = (fieldOfView / 2) * (Math.PI / 180);
  return sensorDimension / (2 * Math.tan(fovRadians));
}


/**
 * Get all equivalent focal lengths across all sensor formats
 * 
 * @param focalLength - Focal length in mm
 * @param sourceFormat - Source sensor format key
 * @returns Map of format keys to equivalent focal lengths
 */
export function getAllEquivalentFocalLengths(
  focalLength: number,
  sourceFormat: keyof typeof SENSOR_FORMATS
): Record<string, number> {
  const source = SENSOR_FORMATS[sourceFormat];
  if (!source) {
    throw new Error(`Invalid source format: ${sourceFormat}`);
  }

  const equivalentIn35mm = focalLength * source.cropFactor;

  const result: Record<string, number> = {};

  for (const [key, format] of Object.entries(SENSOR_FORMATS)) {
    result[key] = Math.round((equivalentIn35mm / format.cropFactor) * 10) / 10;
  }

  return result;
}

/**
 * Lens category based on 35mm equivalent focal length
 */
export type LensCategory =
  | 'ultra-wide'
  | 'wide'
  | 'standard'
  | 'short-telephoto'
  | 'telephoto'
  | 'super-telephoto';

/**
 * Get lens category based on 35mm equivalent focal length
 * 
 * @param equivalentFocalLength - 35mm equivalent focal length
 * @returns Lens category
 */
export function getLensCategory(equivalentFocalLength: number): LensCategory {
  if (equivalentFocalLength < 24) return 'ultra-wide';
  if (equivalentFocalLength < 35) return 'wide';
  if (equivalentFocalLength < 70) return 'standard';
  if (equivalentFocalLength < 135) return 'short-telephoto';
  if (equivalentFocalLength < 300) return 'telephoto';
  return 'super-telephoto';
}

/**
 * Lens category descriptions
 */
export const LENS_CATEGORY_DESCRIPTIONS: Record<LensCategory, string> = {
  'ultra-wide': 'Ultra-wide angle (< 24mm) - Architecture, landscapes, interiors',
  'wide': 'Wide angle (24-35mm) - Landscapes, street photography, environmental portraits',
  'standard': 'Standard (35-70mm) - General purpose, portraits, street photography',
  'short-telephoto': 'Short telephoto (70-135mm) - Portraits, events, sports',
  'telephoto': 'Telephoto (135-300mm) - Sports, wildlife, distant subjects',
  'super-telephoto': 'Super telephoto (> 300mm) - Wildlife, astronomy, extreme distance',
};

/**
 * Common focal lengths with their typical uses
 */
export const COMMON_FOCAL_LENGTH_USES: Array<{ focalLength: number; use: string }> = [
  { focalLength: 14, use: 'Ultra-wide landscapes, architecture' },
  { focalLength: 16, use: 'Wide landscapes, real estate' },
  { focalLength: 20, use: 'Wide landscapes, environmental portraits' },
  { focalLength: 24, use: 'Wide angle, street photography' },
  { focalLength: 28, use: 'Street photography, photojournalism' },
  { focalLength: 35, use: 'Street photography, documentary' },
  { focalLength: 50, use: 'Standard, portraits, general purpose' },
  { focalLength: 85, use: 'Portrait photography' },
  { focalLength: 100, use: 'Macro, portraits' },
  { focalLength: 135, use: 'Portraits, events' },
  { focalLength: 200, use: 'Sports, wildlife' },
  { focalLength: 300, use: 'Sports, wildlife' },
  { focalLength: 400, use: 'Wildlife, sports' },
  { focalLength: 600, use: 'Wildlife, astronomy' },
];

/**
 * Calculate the crop factor between two sensor formats
 * 
 * @param sourceFormat - Source sensor format key
 * @param targetFormat - Target sensor format key
 * @returns Relative crop factor
 */
export function getRelativeCropFactor(
  sourceFormat: keyof typeof SENSOR_FORMATS,
  targetFormat: keyof typeof SENSOR_FORMATS
): number {
  const source = SENSOR_FORMATS[sourceFormat];
  const target = SENSOR_FORMATS[targetFormat];

  if (!source || !target) {
    throw new Error('Invalid sensor format');
  }

  return source.cropFactor / target.cropFactor;
}

/**
 * Format focal length for display
 * 
 * @param focalLength - Focal length in mm
 * @returns Formatted string
 */
export function formatFocalLength(focalLength: number): string {
  if (focalLength < 1) {
    return `${(focalLength * 1000).toFixed(0)}µm`;
  }
  if (focalLength >= 1000) {
    return `${(focalLength / 1000).toFixed(1)}m`;
  }
  return `${focalLength.toFixed(focalLength < 10 ? 1 : 0)}mm`;
}

/**
 * Format field of view for display
 * 
 * @param fov - Field of view in degrees
 * @returns Formatted string
 */
export function formatFieldOfView(fov: number): string {
  return `${fov.toFixed(1)}°`;
}
