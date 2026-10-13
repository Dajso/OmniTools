/**
 * Quilt Binding Calculator
 * 
 * Calculates binding strip length and fabric requirements for quilts.
 * 
 * @module lib/calculations/crafts/quilt-binding-calculator
 * @see Requirements 24.4
 */

/**
 * Error class for quilt binding calculation errors
 */
export class QuiltBindingError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input',
    public field?: string
  ) {
    super(message);
    this.name = 'QuiltBindingError';
  }
}

/**
 * Binding type options
 */
export type BindingType = 'single-fold' | 'double-fold';

/**
 * Input for quilt binding calculation
 */
export interface QuiltBindingInput {
  /** Quilt width in inches */
  quiltWidth: number;
  /** Quilt height in inches */
  quiltHeight: number;
  /** Binding strip width in inches (cut width, default: 2.5 for double-fold) */
  bindingStripWidth?: number;
  /** Type of binding */
  bindingType?: BindingType;
  /** Fabric width in inches (default: 42 usable width from 44/45" fabric) */
  fabricWidth?: number;
  /** Extra inches for joining strips and corners (default: 12) */
  extraAllowance?: number;
}

/**
 * Result of quilt binding calculation
 */
export interface QuiltBindingResult {
  /** Quilt perimeter in inches */
  quiltPerimeter: number;
  /** Total binding length needed in inches */
  totalBindingLength: number;
  /** Number of binding strips needed */
  numberOfStrips: number;
  /** Length of each strip in inches */
  stripLength: number;
  /** Total fabric needed in inches (height) */
  fabricInchesNeeded: number;
  /** Total fabric needed in yards */
  fabricYardsNeeded: number;
  /** Binding strip width used */
  bindingStripWidth: number;
  /** Finished binding width (after folding) */
  finishedBindingWidth: number;
}

/**
 * Default binding strip widths by type
 */
export const DEFAULT_STRIP_WIDTHS: Record<BindingType, number> = {
  'single-fold': 2.0,
  'double-fold': 2.5,
};

/**
 * Default usable fabric width (from 44/45" fabric minus selvages)
 */
export const DEFAULT_FABRIC_WIDTH = 42;

/**
 * Default extra allowance for joining and corners
 */
export const DEFAULT_EXTRA_ALLOWANCE = 12;

/**
 * Calculates quilt perimeter
 * 
 * @param width - Quilt width in inches
 * @param height - Quilt height in inches
 * @returns Perimeter in inches
 */
export function calculateQuiltPerimeter(width: number, height: number): number {
  if (width <= 0) {
    throw new QuiltBindingError(
      'Bredden må være større enn 0',
      'invalid_input',
      'quiltWidth'
    );
  }
  if (height <= 0) {
    throw new QuiltBindingError(
      'Lengden må være større enn 0',
      'invalid_input',
      'quiltHeight'
    );
  }
  return 2 * (width + height);
}

/**
 * Calculates number of binding strips needed
 * 
 * @param totalLength - Total binding length needed in inches
 * @param stripLength - Length of each strip in inches
 * @returns Number of strips (rounded up)
 */
export function calculateNumberOfStrips(
  totalLength: number,
  stripLength: number
): number {
  if (stripLength <= 0) {
    throw new QuiltBindingError(
      'Lengden på strimlene må være større enn 0',
      'invalid_input',
      'stripLength'
    );
  }
  return Math.ceil(totalLength / stripLength);
}

/**
 * Calculates finished binding width after folding
 * 
 * @param cutWidth - Cut width of binding strip
 * @param bindingType - Type of binding
 * @returns Finished width in inches
 */
export function calculateFinishedWidth(
  cutWidth: number,
  bindingType: BindingType
): number {
  if (bindingType === 'double-fold') {
    // Double-fold: cut width ÷ 4 (folded in half, then each half folded to center)
    return cutWidth / 4;
  } else {
    // Single-fold: cut width ÷ 2 (minus seam allowances)
    return (cutWidth - 0.5) / 2;
  }
}

/**
 * Calculates complete quilt binding requirements
 * 
 * @param input - Quilt binding calculation input
 * @returns Quilt binding calculation result
 * 
 * @example
 * ```ts
 * const result = calculateQuiltBinding({
 *   quiltWidth: 60,
 *   quiltHeight: 80,
 * });
 * console.log(result.fabricYardsNeeded); // ~0.5 yards
 * ```
 */
export function calculateQuiltBinding(input: QuiltBindingInput): QuiltBindingResult {
  const {
    quiltWidth,
    quiltHeight,
    bindingType = 'double-fold',
    fabricWidth = DEFAULT_FABRIC_WIDTH,
    extraAllowance = DEFAULT_EXTRA_ALLOWANCE,
  } = input;

  // Use provided strip width or default based on binding type
  const bindingStripWidth = input.bindingStripWidth ?? DEFAULT_STRIP_WIDTHS[bindingType];

  // Validate inputs
  if (quiltWidth <= 0) {
    throw new QuiltBindingError(
      'Bredden må være større enn 0',
      'invalid_input',
      'quiltWidth'
    );
  }
  if (quiltHeight <= 0) {
    throw new QuiltBindingError(
      'Lengden må være større enn 0',
      'invalid_input',
      'quiltHeight'
    );
  }
  if (bindingStripWidth <= 0) {
    throw new QuiltBindingError(
      'Bredden på strimlene må være større enn 0',
      'invalid_input',
      'bindingStripWidth'
    );
  }
  if (fabricWidth <= 0) {
    throw new QuiltBindingError(
      'Stoffbredden må være større enn 0',
      'invalid_input',
      'fabricWidth'
    );
  }

  // Calculate perimeter
  const quiltPerimeter = calculateQuiltPerimeter(quiltWidth, quiltHeight);

  // Total binding length needed (perimeter + extra for joining and corners)
  const totalBindingLength = quiltPerimeter + extraAllowance;

  // Each strip is the usable fabric width
  const stripLength = fabricWidth;

  // Number of strips needed
  const numberOfStrips = calculateNumberOfStrips(totalBindingLength, stripLength);

  // Fabric needed = number of strips × strip width
  const fabricInchesNeeded = numberOfStrips * bindingStripWidth;

  // Convert to yards (36 inches per yard)
  const fabricYardsNeeded = Math.ceil(fabricInchesNeeded / 36 * 8) / 8; // Round to nearest 1/8 yard

  // Calculate finished binding width
  const finishedBindingWidth = calculateFinishedWidth(bindingStripWidth, bindingType);

  return {
    quiltPerimeter,
    totalBindingLength,
    numberOfStrips,
    stripLength,
    fabricInchesNeeded,
    fabricYardsNeeded,
    bindingStripWidth,
    finishedBindingWidth: Math.round(finishedBindingWidth * 100) / 100,
  };
}

/**
 * Standard quilt sizes for reference
 */
export const STANDARD_QUILT_SIZES: Record<string, { width: number; height: number }> = {
  'crib': { width: 36, height: 52 },
  'throw': { width: 50, height: 65 },
  'twin': { width: 68, height: 88 },
  'full': { width: 81, height: 96 },
  'queen': { width: 90, height: 108 },
  'king': { width: 108, height: 108 },
  'california-king': { width: 104, height: 114 },
};

/**
 * Calculates binding for a standard quilt size
 * 
 * @param sizeName - Standard size name
 * @param options - Additional binding options
 * @returns Quilt binding calculation result
 */
export function calculateBindingForStandardSize(
  sizeName: keyof typeof STANDARD_QUILT_SIZES,
  options?: Partial<Omit<QuiltBindingInput, 'quiltWidth' | 'quiltHeight'>>
): QuiltBindingResult {
  const size = STANDARD_QUILT_SIZES[sizeName];
  if (!size) {
    throw new QuiltBindingError(
      `Ukjent størrelse: ${sizeName}`,
      'invalid_input',
      'sizeName'
    );
  }

  return calculateQuiltBinding({
    quiltWidth: size.width,
    quiltHeight: size.height,
    ...options,
  });
}

/**
 * Calculates bias binding length (for curved edges)
 * Bias binding requires more fabric due to diagonal cutting
 * 
 * @param totalLength - Total binding length needed
 * @param fabricWidth - Fabric width in inches
 * @returns Square inches of fabric needed
 */
export function calculateBiasBindingFabric(
  totalLength: number,
  stripWidth: number = 2.5
): number {
  // For bias binding, we need a square of fabric
  // The diagonal of the square determines how much binding we can get
  // Formula: side² = totalLength × stripWidth (approximately)
  const squareInches = totalLength * stripWidth;
  const sideLength = Math.sqrt(squareInches);
  
  // Return the side length needed (in inches)
  return Math.ceil(sideLength);
}
