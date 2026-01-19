/**
 * Roof Framing Calculator
 * 
 * Calculates roof framing dimensions including rafter length, ridge height,
 * number of rafters, and common rafter cut angles.
 * 
 * Key concepts:
 * - Pitch: Expressed as rise/run (e.g., 4/12 means 4 inches rise per 12 inches run)
 * - Span: The total width of the building (wall to wall)
 * - Run: Half the span (from wall to ridge)
 * - Rise: The vertical height from the wall plate to the ridge
 * - Rafter Length: The diagonal distance from wall plate to ridge
 * 
 * Formulas:
 * - Rise = Run × (Pitch / 12)
 * - Rafter Length = sqrt(Run² + Rise²) + Overhang
 * - Ridge Height = Rise (from top of wall plate)
 * - Number of Rafters = (Building Length / Spacing) + 1 (per side)
 * - Plumb Cut Angle = arctan(Rise / Run)
 * - Seat Cut Angle = 90° - Plumb Cut Angle
 * 
 * @module lib/calculations/construction/roof-framing-calculator
 * @see Requirements 32.5
 */

/**
 * Error class for Roof Framing calculation errors
 */
export class RoofFramingError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'out_of_range' | 'calculation_error',
    public field?: string
  ) {
    super(message);
    this.name = 'RoofFramingError';
  }
}

/**
 * Common roof pitch presets (rise per 12 inches of run)
 */
export const COMMON_PITCHES: Record<string, number> = {
  'flat': 0.25,      // 1/4:12 - Nearly flat, minimum for drainage
  'low': 2,          // 2:12 - Low slope
  'moderate': 4,     // 4:12 - Common residential
  'standard': 6,     // 6:12 - Standard residential
  'steep': 8,        // 8:12 - Steeper residential
  'very_steep': 10,  // 10:12 - Very steep
  'extreme': 12,     // 12:12 - 45 degree angle
};

/**
 * Common rafter spacing options in inches
 */
export const COMMON_RAFTER_SPACINGS = {
  '12': 12,   // 12 inches on center
  '16': 16,   // 16 inches on center (most common)
  '24': 24,   // 24 inches on center
};

/**
 * Input for roof framing calculation
 */
export interface RoofFramingInput {
  /**
   * Total span of the building in feet (wall to wall)
   * The run will be calculated as span / 2
   */
  span: number;

  /**
   * Roof pitch expressed as rise per 12 inches of run
   * e.g., 4 means 4:12 pitch (4 inches rise per 12 inches run)
   */
  pitch: number;

  /**
   * Rafter spacing in inches (on center)
   * Common values: 12, 16, or 24 inches
   */
  rafterSpacing: number;

  /**
   * Overhang length in inches
   * The horizontal distance the rafter extends past the wall
   */
  overhang: number;

  /**
   * Building length in feet (optional)
   * Used to calculate total number of rafters
   * If not provided, only per-rafter calculations are returned
   */
  buildingLength?: number;

  /**
   * Rafter lumber size for weight estimation (optional)
   * e.g., '2x6', '2x8', '2x10', '2x12'
   */
  rafterSize?: string;
}

/**
 * Rafter cut angles
 */
export interface RafterCuts {
  /**
   * Plumb cut angle in degrees
   * The vertical cut at the ridge and tail
   */
  plumbCutAngle: number;

  /**
   * Seat cut angle in degrees (also called bird's mouth level cut)
   * The horizontal cut where rafter sits on wall plate
   */
  seatCutAngle: number;

  /**
   * Formatted plumb cut angle
   */
  formattedPlumbCut: string;

  /**
   * Formatted seat cut angle
   */
  formattedSeatCut: string;

  /**
   * Pitch description for framing square
   * e.g., "4 and 12" means align 4" on tongue and 12" on blade
   */
  framingSquareSetup: string;
}

/**
 * Result of roof framing calculation
 */
export interface RoofFramingResult {
  /**
   * Rafter length from wall plate to ridge (not including overhang) in inches
   */
  rafterLength: number;

  /**
   * Total rafter length including overhang in inches
   */
  totalRafterLength: number;

  /**
   * Rafter length in feet and inches format
   */
  formattedRafterLength: string;

  /**
   * Total rafter length in feet and inches format
   */
  formattedTotalRafterLength: string;

  /**
   * Ridge height from top of wall plate in inches
   */
  ridgeHeight: number;

  /**
   * Ridge height in feet and inches format
   */
  formattedRidgeHeight: string;

  /**
   * Number of rafters needed per side
   * Only present if buildingLength was provided
   */
  raftersPerSide?: number;

  /**
   * Total number of rafters (both sides)
   * Only present if buildingLength was provided
   */
  totalRafters?: number;

  /**
   * Rafter cut angles
   */
  rafterCuts: RafterCuts;

  /**
   * Run (half the span) in inches
   */
  run: number;

  /**
   * Rise (vertical height) in inches
   */
  rise: number;

  /**
   * Overhang rafter length (diagonal) in inches
   */
  overhangRafterLength: number;

  /**
   * Input parameters used in calculation
   */
  input: {
    span: number;
    pitch: number;
    rafterSpacing: number;
    overhang: number;
    buildingLength?: number;
  };

  /**
   * Pitch ratio as a string (e.g., "4:12")
   */
  pitchRatio: string;

  /**
   * Roof slope in degrees
   */
  slopeAngle: number;

  /**
   * Formatted slope angle
   */
  formattedSlopeAngle: string;

  /**
   * Line length per foot of run (unit rafter length)
   * Useful for calculating rafters of any length
   */
  unitRafterLength: number;
}

/**
 * Convert degrees to radians
 */
function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Format inches to feet and inches string
 * @param inches - Total inches
 * @returns Formatted string like "12' 6""
 */
export function formatFeetInches(inches: number): string {
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  
  if (feet === 0) {
    return `${remainingInches.toFixed(2)}"`;
  }
  
  if (remainingInches === 0) {
    return `${feet}'`;
  }
  
  return `${feet}' ${remainingInches.toFixed(2)}"`;
}

/**
 * Format angle with degrees symbol
 */
function formatAngle(angle: number, decimals: number = 2): string {
  return `${angle.toFixed(decimals)}°`;
}

/**
 * Validate roof framing input parameters
 * @param input - The input to validate
 * @throws RoofFramingError if input is invalid
 */
function validateInput(input: RoofFramingInput): void {
  // Validate span
  if (input.span === undefined || input.span === null) {
    throw new RoofFramingError(
      'Span is required',
      'invalid_input',
      'span'
    );
  }

  if (isNaN(input.span)) {
    throw new RoofFramingError(
      'Span must be a valid number',
      'invalid_input',
      'span'
    );
  }

  if (input.span <= 0) {
    throw new RoofFramingError(
      'Span must be greater than 0',
      'out_of_range',
      'span'
    );
  }

  if (input.span > 100) {
    throw new RoofFramingError(
      'Span exceeds maximum supported value (100 feet). For larger spans, consult a structural engineer.',
      'out_of_range',
      'span'
    );
  }

  // Validate pitch
  if (input.pitch === undefined || input.pitch === null) {
    throw new RoofFramingError(
      'Pitch is required',
      'invalid_input',
      'pitch'
    );
  }

  if (isNaN(input.pitch)) {
    throw new RoofFramingError(
      'Pitch must be a valid number',
      'invalid_input',
      'pitch'
    );
  }

  if (input.pitch < 0) {
    throw new RoofFramingError(
      'Pitch cannot be negative',
      'out_of_range',
      'pitch'
    );
  }

  if (input.pitch > 24) {
    throw new RoofFramingError(
      'Pitch exceeds maximum supported value (24:12)',
      'out_of_range',
      'pitch'
    );
  }

  // Validate rafter spacing
  if (input.rafterSpacing === undefined || input.rafterSpacing === null) {
    throw new RoofFramingError(
      'Rafter spacing is required',
      'invalid_input',
      'rafterSpacing'
    );
  }

  if (isNaN(input.rafterSpacing)) {
    throw new RoofFramingError(
      'Rafter spacing must be a valid number',
      'invalid_input',
      'rafterSpacing'
    );
  }

  if (input.rafterSpacing <= 0) {
    throw new RoofFramingError(
      'Rafter spacing must be greater than 0',
      'out_of_range',
      'rafterSpacing'
    );
  }

  if (input.rafterSpacing > 48) {
    throw new RoofFramingError(
      'Rafter spacing exceeds maximum recommended value (48 inches)',
      'out_of_range',
      'rafterSpacing'
    );
  }

  // Validate overhang
  if (input.overhang === undefined || input.overhang === null) {
    throw new RoofFramingError(
      'Overhang is required',
      'invalid_input',
      'overhang'
    );
  }

  if (isNaN(input.overhang)) {
    throw new RoofFramingError(
      'Overhang must be a valid number',
      'invalid_input',
      'overhang'
    );
  }

  if (input.overhang < 0) {
    throw new RoofFramingError(
      'Overhang cannot be negative',
      'out_of_range',
      'overhang'
    );
  }

  if (input.overhang > 48) {
    throw new RoofFramingError(
      'Overhang exceeds maximum recommended value (48 inches)',
      'out_of_range',
      'overhang'
    );
  }

  // Validate building length if provided
  if (input.buildingLength !== undefined) {
    if (isNaN(input.buildingLength)) {
      throw new RoofFramingError(
        'Building length must be a valid number',
        'invalid_input',
        'buildingLength'
      );
    }

    if (input.buildingLength <= 0) {
      throw new RoofFramingError(
        'Building length must be greater than 0',
        'out_of_range',
        'buildingLength'
      );
    }
  }
}

/**
 * Calculate roof framing dimensions
 * 
 * @param input - Roof framing input parameters
 * @returns Calculated roof framing dimensions
 * @throws RoofFramingError if input is invalid
 * 
 * @example
 * // Calculate framing for a 24' span with 6:12 pitch
 * const result = calculateRoofFraming({
 *   span: 24,           // 24 feet
 *   pitch: 6,           // 6:12 pitch
 *   rafterSpacing: 16,  // 16" on center
 *   overhang: 12,       // 12" overhang
 *   buildingLength: 40  // 40 feet long
 * });
 */
export function calculateRoofFraming(input: RoofFramingInput): RoofFramingResult {
  validateInput(input);

  const { span, pitch, rafterSpacing, overhang, buildingLength } = input;

  // Convert span to inches and calculate run (half the span)
  const spanInches = span * 12;
  const run = spanInches / 2;

  // Calculate rise based on pitch
  // Pitch is rise per 12 inches of run
  // Rise = Run × (Pitch / 12)
  const rise = run * (pitch / 12);

  // Calculate ridge height (same as rise, measured from top of wall plate)
  const ridgeHeight = rise;

  // Calculate rafter length using Pythagorean theorem
  // Rafter Length = sqrt(Run² + Rise²)
  const rafterLength = Math.sqrt(run * run + rise * rise);

  // Calculate overhang rafter length (diagonal length of overhang)
  // Overhang rise = Overhang × (Pitch / 12)
  const overhangRise = overhang * (pitch / 12);
  const overhangRafterLength = Math.sqrt(overhang * overhang + overhangRise * overhangRise);

  // Total rafter length including overhang
  const totalRafterLength = rafterLength + overhangRafterLength;

  // Calculate unit rafter length (line length per foot of run)
  // This is the hypotenuse of a right triangle with base 12" and height = pitch
  const unitRafterLength = Math.sqrt(144 + pitch * pitch);

  // Calculate slope angle
  const slopeAngle = radiansToDegrees(Math.atan(pitch / 12));

  // Calculate rafter cuts
  const plumbCutAngle = slopeAngle;
  const seatCutAngle = 90 - plumbCutAngle;

  const rafterCuts: RafterCuts = {
    plumbCutAngle,
    seatCutAngle,
    formattedPlumbCut: formatAngle(plumbCutAngle),
    formattedSeatCut: formatAngle(seatCutAngle),
    framingSquareSetup: `${pitch}" on tongue, 12" on blade`,
  };

  // Build result object
  const result: RoofFramingResult = {
    rafterLength,
    totalRafterLength,
    formattedRafterLength: formatFeetInches(rafterLength),
    formattedTotalRafterLength: formatFeetInches(totalRafterLength),
    ridgeHeight,
    formattedRidgeHeight: formatFeetInches(ridgeHeight),
    rafterCuts,
    run,
    rise,
    overhangRafterLength,
    input: {
      span,
      pitch,
      rafterSpacing,
      overhang,
      buildingLength,
    },
    pitchRatio: `${pitch}:12`,
    slopeAngle,
    formattedSlopeAngle: formatAngle(slopeAngle),
    unitRafterLength,
  };

  // Calculate number of rafters if building length is provided
  if (buildingLength !== undefined) {
    const buildingLengthInches = buildingLength * 12;
    // Number of rafters per side = (building length / spacing) + 1
    // We add 1 because we need a rafter at both ends
    const raftersPerSide = Math.ceil(buildingLengthInches / rafterSpacing) + 1;
    const totalRafters = raftersPerSide * 2;

    result.raftersPerSide = raftersPerSide;
    result.totalRafters = totalRafters;
  }

  return result;
}

/**
 * Calculate rafter length for a given run
 * 
 * Convenience function to calculate just the rafter length
 * without all the other framing details.
 * 
 * @param runFeet - Run in feet (half the span)
 * @param pitch - Pitch as rise per 12" of run
 * @param overhangInches - Overhang in inches (default: 0)
 * @returns Total rafter length in inches
 */
export function calculateRafterLength(
  runFeet: number,
  pitch: number,
  overhangInches: number = 0
): number {
  const runInches = runFeet * 12;
  const rise = runInches * (pitch / 12);
  const rafterLength = Math.sqrt(runInches * runInches + rise * rise);
  
  // Add overhang diagonal length
  const overhangRise = overhangInches * (pitch / 12);
  const overhangLength = Math.sqrt(overhangInches * overhangInches + overhangRise * overhangRise);
  
  return rafterLength + overhangLength;
}

/**
 * Calculate the number of rafters needed
 * 
 * @param buildingLengthFeet - Building length in feet
 * @param spacingInches - Rafter spacing in inches
 * @param includeBothSides - Whether to include both sides (default: true)
 * @returns Number of rafters needed
 */
export function calculateNumberOfRafters(
  buildingLengthFeet: number,
  spacingInches: number,
  includeBothSides: boolean = true
): number {
  const buildingLengthInches = buildingLengthFeet * 12;
  const raftersPerSide = Math.ceil(buildingLengthInches / spacingInches) + 1;
  
  return includeBothSides ? raftersPerSide * 2 : raftersPerSide;
}

/**
 * Get pitch angle in degrees from pitch ratio
 * 
 * @param pitch - Pitch as rise per 12" of run
 * @returns Angle in degrees
 */
export function getPitchAngle(pitch: number): number {
  return radiansToDegrees(Math.atan(pitch / 12));
}

/**
 * Convert pitch angle to pitch ratio
 * 
 * @param angleDegrees - Angle in degrees
 * @returns Pitch as rise per 12" of run
 */
export function angleToPitch(angleDegrees: number): number {
  const angleRadians = degreesToRadians(angleDegrees);
  return Math.tan(angleRadians) * 12;
}

/**
 * Get a quick reference table for common roof pitches
 * 
 * @param spanFeet - Span in feet (default: 24)
 * @returns Array of pre-calculated results for common pitches
 */
export function getRoofPitchReferenceTable(
  spanFeet: number = 24
): Array<{
  pitch: number;
  pitchRatio: string;
  slopeAngle: number;
  formattedSlopeAngle: string;
  rise: number;
  formattedRise: string;
  rafterLength: number;
  formattedRafterLength: string;
  description: string;
}> {
  const pitches = [
    { pitch: 2, desc: 'Low slope - minimum for shingles' },
    { pitch: 4, desc: 'Moderate - common residential' },
    { pitch: 6, desc: 'Standard - most common residential' },
    { pitch: 8, desc: 'Steep - good for snow shedding' },
    { pitch: 10, desc: 'Very steep - dramatic appearance' },
    { pitch: 12, desc: '45° angle - maximum common pitch' },
  ];

  return pitches.map(({ pitch, desc }) => {
    const result = calculateRoofFraming({
      span: spanFeet,
      pitch,
      rafterSpacing: 16,
      overhang: 0,
    });

    return {
      pitch,
      pitchRatio: result.pitchRatio,
      slopeAngle: result.slopeAngle,
      formattedSlopeAngle: result.formattedSlopeAngle,
      rise: result.rise,
      formattedRise: result.formattedRidgeHeight,
      rafterLength: result.rafterLength,
      formattedRafterLength: result.formattedRafterLength,
      description: desc,
    };
  });
}

/**
 * Estimate ridge board length
 * 
 * @param buildingLengthFeet - Building length in feet
 * @param overhangInches - Overhang at each end in inches (optional)
 * @returns Ridge board length in inches
 */
export function calculateRidgeBoardLength(
  buildingLengthFeet: number,
  overhangInches: number = 0
): number {
  // Ridge board typically extends the full length of the building
  // plus any gable overhang (rake overhang)
  return buildingLengthFeet * 12 + overhangInches * 2;
}
