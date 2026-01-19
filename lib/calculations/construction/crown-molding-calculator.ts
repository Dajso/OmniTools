/**
 * Crown Molding Angle Calculator
 * 
 * Calculates the miter and bevel angles needed to cut crown molding
 * for inside and outside corners. Crown molding is installed at an
 * angle (spring angle) from the wall, which requires compound cuts.
 * 
 * Formulas:
 * - Miter angle = arctan(sin(springAngle) / tan(cornerAngle/2))
 * - Bevel angle = arcsin(cos(springAngle) × sin(cornerAngle/2))
 * 
 * Common spring angles:
 * - 38° (38/52 crown) - most common
 * - 45° (45/45 crown)
 * 
 * Common corner angles:
 * - 90° (standard inside/outside corners)
 * - Other angles for non-standard corners
 * 
 * @module lib/calculations/construction/crown-molding-calculator
 * @see Requirements 32.2, 32.6
 */

/**
 * Error class for Crown Molding calculation errors
 */
export class CrownMoldingError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'out_of_range' | 'calculation_error',
    public field?: string
  ) {
    super(message);
    this.name = 'CrownMoldingError';
  }
}

/**
 * Common spring angle presets
 */
export const SPRING_ANGLE_PRESETS = {
  '38/52': 38,
  '45/45': 45,
  '52/38': 52,
} as const;

/**
 * Common corner angle presets
 */
export const CORNER_ANGLE_PRESETS = {
  'standard': 90,
  'obtuse_135': 135,
  'acute_45': 45,
} as const;

/**
 * Input for crown molding angle calculation
 */
export interface CrownMoldingInput {
  /** 
   * Spring angle in degrees - the angle the crown makes with the wall
   * Common values: 38° (38/52 crown) or 45° (45/45 crown)
   */
  springAngle: number;
  
  /**
   * Corner angle in degrees - the angle of the wall corner
   * Standard corners are 90°
   */
  cornerAngle: number;
  
  /**
   * Type of corner: 'inside' or 'outside'
   * Affects the direction of the cuts
   */
  cornerType?: 'inside' | 'outside';
}

/**
 * Result of crown molding angle calculation
 */
export interface CrownMoldingResult {
  /** Miter angle in degrees (saw blade angle) */
  miterAngle: number;
  
  /** Bevel angle in degrees (blade tilt angle) */
  bevelAngle: number;
  
  /** Formatted miter angle string */
  formattedMiterAngle: string;
  
  /** Formatted bevel angle string */
  formattedBevelAngle: string;
  
  /** The spring angle used in calculation */
  springAngle: number;
  
  /** The corner angle used in calculation */
  cornerAngle: number;
  
  /** Type of corner */
  cornerType: 'inside' | 'outside';
  
  /** 
   * Saw setup instructions
   * Describes how to set up the miter saw for the cut
   */
  sawSetup: {
    /** Miter direction: 'left' or 'right' */
    miterDirection: 'left' | 'right';
    /** Bevel direction: 'left' or 'right' */
    bevelDirection: 'left' | 'right';
    /** Instructions for the left piece of the corner */
    leftPieceInstructions: string;
    /** Instructions for the right piece of the corner */
    rightPieceInstructions: string;
  };
  
  /**
   * Alternative flat method angles
   * For cutting crown molding flat on the saw (upside down and backwards)
   */
  flatMethod?: {
    /** Simple miter angle when cutting flat */
    miterAngle: number;
    /** Formatted miter angle for flat method */
    formattedMiterAngle: string;
    /** Instructions for flat cutting method */
    instructions: string;
  };
}

/**
 * Convert degrees to radians
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 */
function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 * @param radians - Angle in radians
 * @returns Angle in degrees
 */
function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Format angle with degrees symbol and decimal places
 * @param angle - Angle in degrees
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted angle string
 */
export function formatAngle(angle: number, decimals: number = 2): string {
  return `${angle.toFixed(decimals)}°`;
}

/**
 * Validate crown molding input parameters
 * @param input - The input to validate
 * @throws CrownMoldingError if input is invalid
 */
function validateInput(input: CrownMoldingInput): void {
  // Validate spring angle
  if (input.springAngle === undefined || input.springAngle === null) {
    throw new CrownMoldingError(
      'Spring angle is required',
      'invalid_input',
      'springAngle'
    );
  }
  
  if (isNaN(input.springAngle)) {
    throw new CrownMoldingError(
      'Spring angle must be a valid number',
      'invalid_input',
      'springAngle'
    );
  }
  
  if (input.springAngle <= 0 || input.springAngle >= 90) {
    throw new CrownMoldingError(
      'Spring angle must be between 0° and 90° (exclusive)',
      'out_of_range',
      'springAngle'
    );
  }
  
  // Validate corner angle
  if (input.cornerAngle === undefined || input.cornerAngle === null) {
    throw new CrownMoldingError(
      'Corner angle is required',
      'invalid_input',
      'cornerAngle'
    );
  }
  
  if (isNaN(input.cornerAngle)) {
    throw new CrownMoldingError(
      'Corner angle must be a valid number',
      'invalid_input',
      'cornerAngle'
    );
  }
  
  if (input.cornerAngle <= 0 || input.cornerAngle >= 180) {
    throw new CrownMoldingError(
      'Corner angle must be between 0° and 180° (exclusive)',
      'out_of_range',
      'cornerAngle'
    );
  }
}

/**
 * Calculate crown molding miter and bevel angles
 * 
 * Uses the compound angle formulas:
 * - Miter angle = arctan(sin(springAngle) / tan(cornerAngle/2))
 * - Bevel angle = arcsin(cos(springAngle) × sin(cornerAngle/2))
 * 
 * @param input - Crown molding input parameters
 * @returns Calculated angles and setup instructions
 * @throws CrownMoldingError if input is invalid
 * 
 * @example
 * // Standard 38° crown on 90° corner
 * const result = calculateCrownMoldingAngles({
 *   springAngle: 38,
 *   cornerAngle: 90,
 *   cornerType: 'inside'
 * });
 * // result.miterAngle ≈ 31.62°
 * // result.bevelAngle ≈ 33.86°
 */
export function calculateCrownMoldingAngles(input: CrownMoldingInput): CrownMoldingResult {
  validateInput(input);
  
  const { springAngle, cornerAngle, cornerType = 'inside' } = input;
  
  // Convert to radians for calculation
  const springRad = degreesToRadians(springAngle);
  const halfCornerRad = degreesToRadians(cornerAngle / 2);
  
  // Calculate miter angle: arctan(sin(spring) / tan(corner/2))
  const tanHalfCorner = Math.tan(halfCornerRad);
  
  if (Math.abs(tanHalfCorner) < 1e-10) {
    throw new CrownMoldingError(
      'Cannot calculate angles for this corner angle',
      'calculation_error',
      'cornerAngle'
    );
  }
  
  const miterRad = Math.atan(Math.sin(springRad) / tanHalfCorner);
  const miterAngle = Math.abs(radiansToDegrees(miterRad));
  
  // Calculate bevel angle: arcsin(cos(spring) × sin(corner/2))
  const bevelArg = Math.cos(springRad) * Math.sin(halfCornerRad);
  
  // Clamp to valid arcsin range [-1, 1] to handle floating point errors
  const clampedBevelArg = Math.max(-1, Math.min(1, bevelArg));
  const bevelRad = Math.asin(clampedBevelArg);
  const bevelAngle = Math.abs(radiansToDegrees(bevelRad));
  
  // Calculate flat method miter angle (for cutting crown flat on saw)
  // For 90° corners: flat miter = 45° - adjustment based on spring angle
  // General formula: flat miter = cornerAngle / 2
  const flatMiterAngle = cornerAngle / 2;
  
  // Determine saw setup based on corner type
  const sawSetup = getSawSetup(cornerType, miterAngle, bevelAngle);
  
  return {
    miterAngle,
    bevelAngle,
    formattedMiterAngle: formatAngle(miterAngle),
    formattedBevelAngle: formatAngle(bevelAngle),
    springAngle,
    cornerAngle,
    cornerType,
    sawSetup,
    flatMethod: {
      miterAngle: flatMiterAngle,
      formattedMiterAngle: formatAngle(flatMiterAngle),
      instructions: getFlatMethodInstructions(cornerType, flatMiterAngle),
    },
  };
}

/**
 * Get saw setup instructions based on corner type
 */
function getSawSetup(
  cornerType: 'inside' | 'outside',
  miterAngle: number,
  bevelAngle: number
): CrownMoldingResult['sawSetup'] {
  if (cornerType === 'inside') {
    return {
      miterDirection: 'left',
      bevelDirection: 'left',
      leftPieceInstructions: `Set miter to ${formatAngle(miterAngle)} LEFT, bevel to ${formatAngle(bevelAngle)} LEFT. Cut with crown upside down, ceiling edge against fence.`,
      rightPieceInstructions: `Set miter to ${formatAngle(miterAngle)} RIGHT, bevel to ${formatAngle(bevelAngle)} RIGHT. Cut with crown upside down, ceiling edge against fence.`,
    };
  } else {
    return {
      miterDirection: 'right',
      bevelDirection: 'right',
      leftPieceInstructions: `Set miter to ${formatAngle(miterAngle)} RIGHT, bevel to ${formatAngle(bevelAngle)} RIGHT. Cut with crown upside down, ceiling edge against fence.`,
      rightPieceInstructions: `Set miter to ${formatAngle(miterAngle)} LEFT, bevel to ${formatAngle(bevelAngle)} LEFT. Cut with crown upside down, ceiling edge against fence.`,
    };
  }
}

/**
 * Get instructions for the flat cutting method
 */
function getFlatMethodInstructions(
  cornerType: 'inside' | 'outside',
  flatMiterAngle: number
): string {
  const direction = cornerType === 'inside' ? 'inward' : 'outward';
  return `Position crown upside down and backwards against fence. Set miter to ${formatAngle(flatMiterAngle)} with cuts angling ${direction}. No bevel needed with this method.`;
}

/**
 * Calculate angles for common crown molding scenarios
 * 
 * @param springAnglePreset - Preset spring angle name
 * @param cornerAnglePreset - Preset corner angle name
 * @param cornerType - Type of corner
 * @returns Calculated angles
 */
export function calculateFromPresets(
  springAnglePreset: keyof typeof SPRING_ANGLE_PRESETS,
  cornerAnglePreset: keyof typeof CORNER_ANGLE_PRESETS,
  cornerType: 'inside' | 'outside' = 'inside'
): CrownMoldingResult {
  return calculateCrownMoldingAngles({
    springAngle: SPRING_ANGLE_PRESETS[springAnglePreset],
    cornerAngle: CORNER_ANGLE_PRESETS[cornerAnglePreset],
    cornerType,
  });
}

/**
 * Get a quick reference table for common angle combinations
 * 
 * @returns Array of pre-calculated results for common scenarios
 */
export function getQuickReferenceTable(): Array<{
  springAngle: number;
  cornerAngle: number;
  miterAngle: number;
  bevelAngle: number;
  description: string;
}> {
  const combinations = [
    { spring: 38, corner: 90, desc: '38/52 crown, 90° corner (most common)' },
    { spring: 45, corner: 90, desc: '45/45 crown, 90° corner' },
    { spring: 52, corner: 90, desc: '52/38 crown, 90° corner' },
    { spring: 38, corner: 135, desc: '38/52 crown, 135° corner' },
    { spring: 45, corner: 135, desc: '45/45 crown, 135° corner' },
    { spring: 38, corner: 45, desc: '38/52 crown, 45° corner' },
  ];
  
  return combinations.map(({ spring, corner, desc }) => {
    const result = calculateCrownMoldingAngles({
      springAngle: spring,
      cornerAngle: corner,
    });
    
    return {
      springAngle: spring,
      cornerAngle: corner,
      miterAngle: Math.round(result.miterAngle * 100) / 100,
      bevelAngle: Math.round(result.bevelAngle * 100) / 100,
      description: desc,
    };
  });
}
