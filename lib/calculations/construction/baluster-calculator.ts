/**
 * Baluster Spacing Calculator
 * 
 * Calculates the optimal number of balusters and spacing for railings
 * while ensuring compliance with the 4-inch sphere rule (building code
 * requirement that gaps between balusters must not exceed 4 inches).
 * 
 * The 4-inch sphere rule is a safety requirement in most building codes
 * (IRC R312.1.3) designed to prevent children from getting their heads
 * stuck between balusters.
 * 
 * Key formulas:
 * - Maximum gap allowed: 4 inches (101.6mm)
 * - Minimum balusters = ceil((totalSpan - balusterWidth) / (maxGap + balusterWidth))
 * - Actual spacing = (totalSpan - (numBalusters × balusterWidth)) / (numBalusters + 1)
 * 
 * @module lib/calculations/construction/baluster-calculator
 * @see Requirements 32.3, 32.7
 */

/**
 * Maximum allowed gap between balusters (TEK17: 100 mm / 10 cm kule)
 */
export const MAX_BALUSTER_GAP_INCHES = 100 / 25.4; // 100 mm (TEK17)

/**
 * Maximum allowed gap in millimeters
 */
export const MAX_BALUSTER_GAP_MM = 100;

/**
 * Error class for Baluster calculation errors
 */
export class BalusterError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'out_of_range' | 'calculation_error',
    public field?: string
  ) {
    super(message);
    this.name = 'BalusterError';
  }
}

/**
 * Unit of measurement for baluster calculations
 */
export type BalusterUnit = 'inches' | 'mm' | 'cm';

/**
 * Input for baluster spacing calculation
 */
export interface BalusterInput {
  /**
   * Total width/span between posts (the area to fill with balusters)
   * This is the clear opening between the inside edges of the posts
   */
  totalWidth: number;

  /**
   * Width of each baluster (typically 1.5" for 2x2 or 1.25" for standard)
   */
  balusterWidth: number;

  /**
   * Width of each post (optional, for reference only)
   * Posts are not included in the spacing calculation as totalWidth
   * should already represent the clear span between posts
   */
  postWidth?: number;

  /**
   * Unit of measurement (default: inches)
   */
  unit?: BalusterUnit;

  /**
   * Custom maximum gap (default: 4 inches per building code)
   * Some jurisdictions may have stricter requirements
   */
  maxGap?: number;

  /**
   * Whether to optimize for even spacing (default: true)
   * If true, may add extra balusters to achieve more uniform spacing
   */
  optimizeSpacing?: boolean;
}

/**
 * Result of baluster spacing calculation
 */
export interface BalusterResult {
  /**
   * Number of balusters needed
   */
  numberOfBalusters: number;

  /**
   * Spacing between balusters (center-to-center)
   */
  centerToCenter: number;

  /**
   * Actual gap between balusters (edge-to-edge)
   * This is the critical measurement for code compliance
   */
  spacing: number;

  /**
   * Whether the spacing complies with the 4-inch sphere rule
   */
  isCodeCompliant: boolean;

  /**
   * The maximum gap allowed (for reference)
   */
  maxAllowedGap: number;

  /**
   * Total width used in calculation
   */
  totalWidth: number;

  /**
   * Baluster width used in calculation
   */
  balusterWidth: number;

  /**
   * Unit of measurement
   */
  unit: BalusterUnit;

  /**
   * Formatted spacing string with unit
   */
  formattedSpacing: string;

  /**
   * Formatted center-to-center string with unit
   */
  formattedCenterToCenter: string;

  /**
   * Space from post to first/last baluster (edge-to-edge)
   */
  postToBalusterGap: number;

  /**
   * Formatted post-to-baluster gap string
   */
  formattedPostToBalusterGap: string;

  /**
   * Compliance message
   */
  complianceMessage: string;

  /**
   * Layout breakdown for installation
   */
  layout: {
    /** Gap from left post to first baluster */
    firstGap: number;
    /** Gap between each baluster */
    balusterGaps: number;
    /** Gap from last baluster to right post */
    lastGap: number;
    /** Total space occupied by balusters */
    totalBalusterWidth: number;
    /** Total space occupied by gaps */
    totalGapWidth: number;
  };
}

/**
 * Convert value between units
 */
function convertToInches(value: number, fromUnit: BalusterUnit): number {
  switch (fromUnit) {
    case 'mm':
      return value / 25.4;
    case 'cm':
      return value / 2.54;
    case 'inches':
    default:
      return value;
  }
}

/**
 * Convert value from inches to target unit
 */
function convertFromInches(value: number, toUnit: BalusterUnit): number {
  switch (toUnit) {
    case 'mm':
      return value * 25.4;
    case 'cm':
      return value * 2.54;
    case 'inches':
    default:
      return value;
  }
}

/**
 * Get unit abbreviation
 */
function getUnitAbbreviation(unit: BalusterUnit): string {
  switch (unit) {
    case 'mm':
      return 'mm';
    case 'cm':
      return 'cm';
    case 'inches':
    default:
      return '"';
  }
}

/**
 * Format a measurement with unit
 */
export function formatMeasurement(value: number, unit: BalusterUnit, decimals: number = 2): string {
  const abbrev = getUnitAbbreviation(unit);
  const num = value.toFixed(decimals).replace('.', ',');
  return abbrev === '"' ? `${num}${abbrev}` : `${num} ${abbrev}`;
}

/**
 * Validate baluster input parameters
 * @param input - The input to validate
 * @throws BalusterError if input is invalid
 */
function validateInput(input: BalusterInput): void {
  // Validate total width
  if (input.totalWidth === undefined || input.totalWidth === null) {
    throw new BalusterError(
      'Total bredde mangler',
      'invalid_input',
      'totalWidth'
    );
  }

  if (isNaN(input.totalWidth)) {
    throw new BalusterError(
      'Total bredde må være et gyldig tall',
      'invalid_input',
      'totalWidth'
    );
  }

  if (input.totalWidth <= 0) {
    throw new BalusterError(
      'Total bredde må være større enn 0',
      'out_of_range',
      'totalWidth'
    );
  }

  // Validate baluster width
  if (input.balusterWidth === undefined || input.balusterWidth === null) {
    throw new BalusterError(
      'Spilebredde mangler',
      'invalid_input',
      'balusterWidth'
    );
  }

  if (isNaN(input.balusterWidth)) {
    throw new BalusterError(
      'Spilebredde må være et gyldig tall',
      'invalid_input',
      'balusterWidth'
    );
  }

  if (input.balusterWidth <= 0) {
    throw new BalusterError(
      'Spilebredde må være større enn 0',
      'out_of_range',
      'balusterWidth'
    );
  }

  // Validate that baluster width is less than total width
  if (input.balusterWidth >= input.totalWidth) {
    throw new BalusterError(
      'Spilebredden må være mindre enn total bredde',
      'out_of_range',
      'balusterWidth'
    );
  }

  // Validate custom max gap if provided
  if (input.maxGap !== undefined) {
    if (isNaN(input.maxGap)) {
      throw new BalusterError(
        'Maksimal åpning må være et gyldig tall',
        'invalid_input',
        'maxGap'
      );
    }

    if (input.maxGap <= 0) {
      throw new BalusterError(
        'Maksimal åpning må være større enn 0',
        'out_of_range',
        'maxGap'
      );
    }
  }

  // Validate post width if provided
  if (input.postWidth !== undefined) {
    if (isNaN(input.postWidth)) {
      throw new BalusterError(
        'Stolpebredde må være et gyldig tall',
        'invalid_input',
        'postWidth'
      );
    }

    if (input.postWidth < 0) {
      throw new BalusterError(
        'Stolpebredden kan ikke være negativ',
        'out_of_range',
        'postWidth'
      );
    }
  }
}

/**
 * Calculate the minimum number of balusters needed to comply with code
 * 
 * Formula: ceil((totalSpan - balusterWidth) / (maxGap + balusterWidth))
 * 
 * This ensures that even with the minimum number of balusters,
 * the gaps will not exceed the maximum allowed.
 * 
 * @param totalWidth - Total span to fill
 * @param balusterWidth - Width of each baluster
 * @param maxGap - Maximum allowed gap
 * @returns Minimum number of balusters needed
 */
export function calculateMinimumBalusters(
  totalWidth: number,
  balusterWidth: number,
  maxGap: number
): number {
  // If the total width is less than or equal to maxGap, no balusters needed
  // (but this would be unusual for a railing)
  if (totalWidth <= maxGap) {
    return 0;
  }

  // Formula: We need enough balusters so that:
  // (totalWidth - numBalusters * balusterWidth) / (numBalusters + 1) <= maxGap
  // 
  // Solving for numBalusters:
  // totalWidth - numBalusters * balusterWidth <= maxGap * (numBalusters + 1)
  // totalWidth - numBalusters * balusterWidth <= maxGap * numBalusters + maxGap
  // totalWidth - maxGap <= numBalusters * balusterWidth + maxGap * numBalusters
  // totalWidth - maxGap <= numBalusters * (balusterWidth + maxGap)
  // numBalusters >= (totalWidth - maxGap) / (balusterWidth + maxGap)

  const minBalusters = Math.ceil((totalWidth - maxGap) / (balusterWidth + maxGap));
  
  return Math.max(0, minBalusters);
}

/**
 * Calculate the actual gap between balusters given a number of balusters
 * 
 * Formula: (totalWidth - (numBalusters × balusterWidth)) / (numBalusters + 1)
 * 
 * @param totalWidth - Total span
 * @param balusterWidth - Width of each baluster
 * @param numBalusters - Number of balusters
 * @returns Gap between balusters (edge-to-edge)
 */
export function calculateGap(
  totalWidth: number,
  balusterWidth: number,
  numBalusters: number
): number {
  if (numBalusters < 0) {
    return totalWidth; // No balusters means one big gap
  }

  const totalBalusterWidth = numBalusters * balusterWidth;
  const totalGapSpace = totalWidth - totalBalusterWidth;
  const numberOfGaps = numBalusters + 1; // Gaps on each end plus between balusters

  return totalGapSpace / numberOfGaps;
}

/**
 * Calculate baluster spacing for code compliance
 * 
 * This function calculates the optimal number of balusters and their
 * spacing to ensure compliance with the 4-inch sphere rule while
 * providing even, aesthetically pleasing spacing.
 * 
 * @param input - Baluster calculation input parameters
 * @returns Calculated spacing and compliance information
 * @throws BalusterError if input is invalid
 * 
 * @example
 * // Calculate balusters for a 36" span with 1.5" balusters
 * const result = calculateBalusterSpacing({
 *   totalWidth: 36,
 *   balusterWidth: 1.5,
 *   unit: 'inches'
 * });
 * // result.numberOfBalusters = 8
 * // result.spacing ≈ 3.33" (compliant with 4" rule)
 * // result.isCodeCompliant = true
 */
export function calculateBalusterSpacing(input: BalusterInput): BalusterResult {
  validateInput(input);

  const unit = input.unit || 'inches';
  const optimizeSpacing = input.optimizeSpacing !== false;

  // Convert to inches for calculation (code is based on 4" rule)
  const totalWidthInches = convertToInches(input.totalWidth, unit);
  const balusterWidthInches = convertToInches(input.balusterWidth, unit);
  const maxGapInches = input.maxGap 
    ? convertToInches(input.maxGap, unit) 
    : MAX_BALUSTER_GAP_INCHES;

  // Calculate minimum balusters needed for code compliance
  let numberOfBalusters = calculateMinimumBalusters(
    totalWidthInches,
    balusterWidthInches,
    maxGapInches
  );

  // Calculate the gap with minimum balusters
  let gapInches = calculateGap(totalWidthInches, balusterWidthInches, numberOfBalusters);

  // If optimizing, consider adding one more baluster for more even spacing
  if (optimizeSpacing && numberOfBalusters > 0) {
    const gapWithOneMore = calculateGap(
      totalWidthInches,
      balusterWidthInches,
      numberOfBalusters + 1
    );
    
    // Add another baluster if it results in spacing closer to a "nice" number
    // (e.g., 3.5" is nicer than 3.9")
    const currentNiceness = Math.abs(gapInches - Math.round(gapInches * 2) / 2);
    const newNiceness = Math.abs(gapWithOneMore - Math.round(gapWithOneMore * 2) / 2);
    
    if (newNiceness < currentNiceness && gapWithOneMore >= 2) {
      numberOfBalusters += 1;
      gapInches = gapWithOneMore;
    }
  }

  // Check code compliance
  const isCodeCompliant = gapInches <= maxGapInches;

  // Calculate center-to-center spacing
  const centerToCenterInches = gapInches + balusterWidthInches;

  // Convert results back to original unit
  const spacing = convertFromInches(gapInches, unit);
  const centerToCenter = convertFromInches(centerToCenterInches, unit);
  const maxAllowedGap = convertFromInches(maxGapInches, unit);
  const postToBalusterGap = spacing; // Same as spacing for even distribution

  // Calculate layout breakdown
  const totalBalusterWidth = numberOfBalusters * input.balusterWidth;
  const totalGapWidth = input.totalWidth - totalBalusterWidth;

  // Generate compliance message
  let complianceMessage: string;
  if (isCodeCompliant) {
    complianceMessage = `✓ Godkjent: åpningen på ${formatMeasurement(spacing, unit)} er innenfor maksimum ${formatMeasurement(maxAllowedGap, unit)}.`;
  } else {
    complianceMessage = `✗ Ikke godkjent: åpningen på ${formatMeasurement(spacing, unit)} er større enn maksimum ${formatMeasurement(maxAllowedGap, unit)}. Legg til flere spiler.`;
  }

  return {
    numberOfBalusters,
    centerToCenter,
    spacing,
    isCodeCompliant,
    maxAllowedGap,
    totalWidth: input.totalWidth,
    balusterWidth: input.balusterWidth,
    unit,
    formattedSpacing: formatMeasurement(spacing, unit),
    formattedCenterToCenter: formatMeasurement(centerToCenter, unit),
    postToBalusterGap,
    formattedPostToBalusterGap: formatMeasurement(postToBalusterGap, unit),
    complianceMessage,
    layout: {
      firstGap: spacing,
      balusterGaps: spacing,
      lastGap: spacing,
      totalBalusterWidth,
      totalGapWidth,
    },
  };
}

/**
 * Calculate spacing for a specific number of balusters
 * 
 * Use this when you have a fixed number of balusters and want to
 * know if they will be code compliant.
 * 
 * @param input - Input with totalWidth, balusterWidth, and numberOfBalusters
 * @returns Spacing result with compliance check
 */
export function calculateSpacingForBalusterCount(
  input: BalusterInput & { numberOfBalusters: number }
): BalusterResult {
  validateInput(input);

  if (input.numberOfBalusters < 0) {
    throw new BalusterError(
      'Antall spiler kan ikke være negativt',
      'out_of_range',
      'numberOfBalusters'
    );
  }

  const unit = input.unit || 'inches';

  // Convert to inches for calculation
  const totalWidthInches = convertToInches(input.totalWidth, unit);
  const balusterWidthInches = convertToInches(input.balusterWidth, unit);
  const maxGapInches = input.maxGap 
    ? convertToInches(input.maxGap, unit) 
    : MAX_BALUSTER_GAP_INCHES;

  // Calculate gap with specified number of balusters
  const gapInches = calculateGap(
    totalWidthInches,
    balusterWidthInches,
    input.numberOfBalusters
  );

  // Check code compliance
  const isCodeCompliant = gapInches <= maxGapInches;

  // Calculate center-to-center spacing
  const centerToCenterInches = gapInches + balusterWidthInches;

  // Convert results back to original unit
  const spacing = convertFromInches(gapInches, unit);
  const centerToCenter = convertFromInches(centerToCenterInches, unit);
  const maxAllowedGap = convertFromInches(maxGapInches, unit);

  // Calculate layout breakdown
  const totalBalusterWidth = input.numberOfBalusters * input.balusterWidth;
  const totalGapWidth = input.totalWidth - totalBalusterWidth;

  // Generate compliance message
  let complianceMessage: string;
  if (isCodeCompliant) {
    complianceMessage = `✓ Godkjent: åpningen på ${formatMeasurement(spacing, unit)} er innenfor maksimum ${formatMeasurement(maxAllowedGap, unit)}.`;
  } else {
    const minNeeded = calculateMinimumBalusters(totalWidthInches, balusterWidthInches, maxGapInches);
    complianceMessage = `✗ Ikke godkjent: åpningen på ${formatMeasurement(spacing, unit)} er større enn maksimum ${formatMeasurement(maxAllowedGap, unit)}. Du trenger minst ${minNeeded} spiler.`;
  }

  return {
    numberOfBalusters: input.numberOfBalusters,
    centerToCenter,
    spacing,
    isCodeCompliant,
    maxAllowedGap,
    totalWidth: input.totalWidth,
    balusterWidth: input.balusterWidth,
    unit,
    formattedSpacing: formatMeasurement(spacing, unit),
    formattedCenterToCenter: formatMeasurement(centerToCenter, unit),
    postToBalusterGap: spacing,
    formattedPostToBalusterGap: formatMeasurement(spacing, unit),
    complianceMessage,
    layout: {
      firstGap: spacing,
      balusterGaps: spacing,
      lastGap: spacing,
      totalBalusterWidth,
      totalGapWidth,
    },
  };
}

/**
 * Common baluster width presets
 */
export const BALUSTER_WIDTH_PRESETS = {
  /** Firkantspile i tre, 30 mm */
  'tre_30': 30,
  /** Firkantspile i tre, 45 mm */
  'tre_45': 45,
  /** Rund metallspile, 16 mm */
  'metall_rund_16': 16,
  /** Firkantrør i metall, 20 mm */
  'metall_firkant_20': 20,
} as const;

/**
 * Get a quick reference for common railing spans
 * 
 * @param balusterWidth - Width of balusters to use
 * @param unit - Unit of measurement
 * @returns Array of pre-calculated results for common spans
 */
export function getBalusterQuickReferenceTable(
  balusterWidth: number = 40,
  unit: BalusterUnit = 'mm'
): Array<{
  totalWidth: number;
  numberOfBalusters: number;
  spacing: number;
  formattedSpacing: string;
  isCodeCompliant: boolean;
}> {
  const commonSpans = [600, 900, 1200, 1500, 1800, 2400, 3000];

  return commonSpans.map((span) => {
    const result = calculateBalusterSpacing({
      totalWidth: span,
      balusterWidth,
      unit,
    });

    return {
      totalWidth: span,
      numberOfBalusters: result.numberOfBalusters,
      spacing: Math.round(result.spacing * 100) / 100,
      formattedSpacing: result.formattedSpacing,
      isCodeCompliant: result.isCodeCompliant,
    };
  });
}
