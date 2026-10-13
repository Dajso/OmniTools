/**
 * Knitting Stitch Converter
 * 
 * Converts knitting patterns between different gauges and calculates
 * stitch counts for target widths.
 * 
 * @module lib/calculations/crafts/stitch-converter
 * @see Requirements 24.2, 24.12
 */

/**
 * Error class for stitch conversion errors
 */
export class StitchConversionError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'division_by_zero',
    public field?: string
  ) {
    super(message);
    this.name = 'StitchConversionError';
  }
}

/**
 * Gauge measurement (stitches and rows per unit)
 */
export interface Gauge {
  /** Stitches per unit (usually 4 inches or 10 cm) */
  stitchesPerUnit: number;
  /** Rows per unit (usually 4 inches or 10 cm) */
  rowsPerUnit: number;
  /** Unit size in inches (default: 4) */
  unitSize?: number;
}

/**
 * Input for stitch conversion
 */
export interface StitchConversionInput {
  /** Original pattern gauge */
  patternGauge: Gauge;
  /** Your actual gauge */
  yourGauge: Gauge;
  /** Original stitch count from pattern */
  originalStitches: number;
  /** Original row count from pattern (optional) */
  originalRows?: number;
}

/**
 * Result of stitch conversion
 */
export interface StitchConversionResult {
  /** Adjusted stitch count for your gauge */
  adjustedStitches: number;
  /** Adjusted row count for your gauge (if provided) */
  adjustedRows?: number;
  /** Stitch ratio (your gauge / pattern gauge) */
  stitchRatio: number;
  /** Row ratio (your gauge / pattern gauge) */
  rowRatio: number;
  /** Width in inches with original stitches at your gauge */
  widthAtYourGauge: number;
  /** Width in inches with original stitches at pattern gauge */
  widthAtPatternGauge: number;
}

/**
 * Input for calculating stitches for target width
 */
export interface TargetWidthInput {
  /** Your gauge */
  gauge: Gauge;
  /** Target width in inches */
  targetWidth: number;
}

/**
 * Result of target width calculation
 */
export interface TargetWidthResult {
  /** Number of stitches needed */
  stitchesNeeded: number;
  /** Stitches per inch */
  stitchesPerInch: number;
  /** Actual width achieved (may differ slightly due to rounding) */
  actualWidth: number;
}

/**
 * Input for calculating rows for target length
 */
export interface TargetLengthInput {
  /** Your gauge */
  gauge: Gauge;
  /** Target length in inches */
  targetLength: number;
}

/**
 * Result of target length calculation
 */
export interface TargetLengthResult {
  /** Number of rows needed */
  rowsNeeded: number;
  /** Rows per inch */
  rowsPerInch: number;
  /** Actual length achieved (may differ slightly due to rounding) */
  actualLength: number;
}

/**
 * Calculates stitches per inch from gauge
 * 
 * @param gauge - Gauge measurement
 * @returns Stitches per inch
 */
export function calculateStitchesPerInch(gauge: Gauge): number {
  const unitSize = gauge.unitSize ?? 4;
  if (unitSize <= 0) {
    throw new StitchConversionError(
      'Enhetsstørrelsen må være større enn 0',
      'invalid_input',
      'unitSize'
    );
  }
  if (gauge.stitchesPerUnit <= 0) {
    throw new StitchConversionError(
      'Antall masker må være større enn 0',
      'invalid_input',
      'stitchesPerUnit'
    );
  }
  return gauge.stitchesPerUnit / unitSize;
}

/**
 * Calculates rows per inch from gauge
 * 
 * @param gauge - Gauge measurement
 * @returns Rows per inch
 */
export function calculateRowsPerInch(gauge: Gauge): number {
  const unitSize = gauge.unitSize ?? 4;
  if (unitSize <= 0) {
    throw new StitchConversionError(
      'Enhetsstørrelsen må være større enn 0',
      'invalid_input',
      'unitSize'
    );
  }
  if (gauge.rowsPerUnit <= 0) {
    throw new StitchConversionError(
      'Antall pinner må være større enn 0',
      'invalid_input',
      'rowsPerUnit'
    );
  }
  return gauge.rowsPerUnit / unitSize;
}

/**
 * Converts stitch count between different gauges
 * 
 * Formula: newStitches = originalStitches × (patternGauge / yourGauge)
 * 
 * @param input - Stitch conversion input
 * @returns Stitch conversion result
 * 
 * @example
 * ```ts
 * const result = convertStitches({
 *   patternGauge: { stitchesPerUnit: 20, rowsPerUnit: 28 },
 *   yourGauge: { stitchesPerUnit: 18, rowsPerUnit: 24 },
 *   originalStitches: 100,
 *   originalRows: 140,
 * });
 * console.log(result.adjustedStitches); // 111 (rounded)
 * ```
 */
export function convertStitches(input: StitchConversionInput): StitchConversionResult {
  const { patternGauge, yourGauge, originalStitches, originalRows } = input;

  // Validate inputs
  if (originalStitches < 0) {
    throw new StitchConversionError(
      'Antall masker kan ikke være negativt',
      'invalid_input',
      'originalStitches'
    );
  }
  if (originalRows !== undefined && originalRows < 0) {
    throw new StitchConversionError(
      'Antall pinner kan ikke være negativt',
      'invalid_input',
      'originalRows'
    );
  }

  const patternStitchesPerInch = calculateStitchesPerInch(patternGauge);
  const yourStitchesPerInch = calculateStitchesPerInch(yourGauge);
  const patternRowsPerInch = calculateRowsPerInch(patternGauge);
  const yourRowsPerInch = calculateRowsPerInch(yourGauge);

  // Calculate ratios
  // To get the same width, we need: newStitches / yourStitchesPerInch = originalStitches / patternStitchesPerInch
  // So: newStitches = originalStitches × (yourStitchesPerInch / patternStitchesPerInch)
  // Wait, that's wrong. Let me think again...
  // If pattern says 100 stitches at 5 st/inch = 20 inches
  // If your gauge is 4 st/inch, you need 80 stitches for 20 inches
  // So: newStitches = targetWidth × yourStitchesPerInch
  // targetWidth = originalStitches / patternStitchesPerInch
  // newStitches = (originalStitches / patternStitchesPerInch) × yourStitchesPerInch
  // newStitches = originalStitches × (yourStitchesPerInch / patternStitchesPerInch)
  
  const stitchRatio = yourStitchesPerInch / patternStitchesPerInch;
  const rowRatio = yourRowsPerInch / patternRowsPerInch;

  // Calculate adjusted counts
  const adjustedStitches = Math.round(originalStitches * stitchRatio);
  const adjustedRows = originalRows !== undefined 
    ? Math.round(originalRows * rowRatio) 
    : undefined;

  // Calculate widths
  const widthAtPatternGauge = originalStitches / patternStitchesPerInch;
  const widthAtYourGauge = originalStitches / yourStitchesPerInch;

  return {
    adjustedStitches,
    adjustedRows,
    stitchRatio: Math.round(stitchRatio * 1000) / 1000,
    rowRatio: Math.round(rowRatio * 1000) / 1000,
    widthAtYourGauge: Math.round(widthAtYourGauge * 100) / 100,
    widthAtPatternGauge: Math.round(widthAtPatternGauge * 100) / 100,
  };
}

/**
 * Calculates stitches needed for a target width
 * 
 * @param input - Target width input
 * @returns Target width result
 * 
 * @example
 * ```ts
 * const result = calculateStitchesForWidth({
 *   gauge: { stitchesPerUnit: 20, rowsPerUnit: 28 },
 *   targetWidth: 20,
 * });
 * console.log(result.stitchesNeeded); // 100
 * ```
 */
export function calculateStitchesForWidth(input: TargetWidthInput): TargetWidthResult {
  const { gauge, targetWidth } = input;

  if (targetWidth <= 0) {
    throw new StitchConversionError(
      'Ønsket bredde må være større enn 0',
      'invalid_input',
      'targetWidth'
    );
  }

  const stitchesPerInch = calculateStitchesPerInch(gauge);
  const exactStitches = targetWidth * stitchesPerInch;
  const stitchesNeeded = Math.round(exactStitches);
  const actualWidth = stitchesNeeded / stitchesPerInch;

  return {
    stitchesNeeded,
    stitchesPerInch: Math.round(stitchesPerInch * 100) / 100,
    actualWidth: Math.round(actualWidth * 100) / 100,
  };
}

/**
 * Calculates rows needed for a target length
 * 
 * @param input - Target length input
 * @returns Target length result
 */
export function calculateRowsForLength(input: TargetLengthInput): TargetLengthResult {
  const { gauge, targetLength } = input;

  if (targetLength <= 0) {
    throw new StitchConversionError(
      'Ønsket lengde må være større enn 0',
      'invalid_input',
      'targetLength'
    );
  }

  const rowsPerInch = calculateRowsPerInch(gauge);
  const exactRows = targetLength * rowsPerInch;
  const rowsNeeded = Math.round(exactRows);
  const actualLength = rowsNeeded / rowsPerInch;

  return {
    rowsNeeded,
    rowsPerInch: Math.round(rowsPerInch * 100) / 100,
    actualLength: Math.round(actualLength * 100) / 100,
  };
}

/**
 * Calculates yarn requirements based on stitch count and yarn weight
 * 
 * @param stitches - Total number of stitches
 * @param rows - Total number of rows
 * @param yardsPerStitch - Approximate yards of yarn per stitch (varies by weight)
 * @returns Estimated yards of yarn needed
 */
export function estimateYarnYardage(
  stitches: number,
  rows: number,
  yardsPerStitch: number = 0.02
): number {
  if (stitches < 0 || rows < 0) {
    throw new StitchConversionError(
      'Antall masker og pinner kan ikke være negativt',
      'invalid_input'
    );
  }
  if (yardsPerStitch <= 0) {
    throw new StitchConversionError(
      'Garnforbruk per maske må være større enn 0',
      'invalid_input',
      'yardsPerStitch'
    );
  }
  
  const totalStitches = stitches * rows;
  return Math.ceil(totalStitches * yardsPerStitch);
}

/**
 * Standard yarn weights and their typical gauges
 */
export const YARN_WEIGHT_GAUGES: Record<string, { stitchesPerUnit: number; rowsPerUnit: number; unitSize: number }> = {
  'lace': { stitchesPerUnit: 32, rowsPerUnit: 40, unitSize: 4 },
  'fingering': { stitchesPerUnit: 28, rowsPerUnit: 36, unitSize: 4 },
  'sport': { stitchesPerUnit: 24, rowsPerUnit: 32, unitSize: 4 },
  'dk': { stitchesPerUnit: 22, rowsPerUnit: 28, unitSize: 4 },
  'worsted': { stitchesPerUnit: 18, rowsPerUnit: 24, unitSize: 4 },
  'bulky': { stitchesPerUnit: 14, rowsPerUnit: 18, unitSize: 4 },
  'super-bulky': { stitchesPerUnit: 10, rowsPerUnit: 14, unitSize: 4 },
};
