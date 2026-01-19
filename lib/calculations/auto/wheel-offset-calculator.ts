/**
 * Wheel Offset (ET) Calculator
 * 
 * Calculates wheel offset, backspacing, and fitment changes when
 * changing wheel specifications.
 * 
 * Offset (ET) is the distance from the wheel's mounting surface to
 * the centerline of the wheel, measured in millimeters.
 * - Positive offset: mounting surface is toward the outside (street side)
 * - Zero offset: mounting surface is at the centerline
 * - Negative offset: mounting surface is toward the inside (suspension side)
 * 
 * @module lib/calculations/auto/wheel-offset-calculator
 * @see Requirements 28.2
 */

/**
 * Wheel specification
 */
export interface WheelSpec {
  /** Wheel width in inches */
  width: number;
  /** Wheel diameter in inches */
  diameter: number;
  /** Offset (ET) in millimeters */
  offset: number;
}

/**
 * Calculated wheel dimensions
 */
export interface WheelDimensions {
  /** Wheel width in inches */
  width: number;
  /** Wheel width in mm */
  widthMm: number;
  /** Wheel diameter in inches */
  diameter: number;
  /** Offset (ET) in mm */
  offset: number;
  /** Backspacing in inches */
  backspacing: number;
  /** Backspacing in mm */
  backspacingMm: number;
  /** Distance from mounting surface to outer lip in mm */
  outerLipDistance: number;
  /** Distance from mounting surface to inner lip in mm */
  innerLipDistance: number;
  /** Formatted wheel size string */
  formattedSize: string;
}

/**
 * Wheel fitment comparison result
 */
export interface WheelComparison {
  /** Original wheel dimensions */
  original: WheelDimensions;
  /** New wheel dimensions */
  newWheel: WheelDimensions;
  /** Change in inner clearance (positive = more clearance) */
  innerClearanceChange: number;
  /** Change in outer clearance (positive = more clearance, wheel tucked in) */
  outerClearanceChange: number;
  /** Whether the wheel will poke out more */
  willPokeMore: boolean;
  /** Whether the wheel will tuck in more */
  willTuckMore: boolean;
  /** Whether the wheel will be closer to suspension */
  closerToSuspension: boolean;
  /** Net track width change per side in mm */
  trackWidthChangePerSide: number;
  /** Total track width change (both sides) in mm */
  totalTrackWidthChange: number;
  /** Fitment assessment */
  fitmentAssessment: string;
}

/** Millimeters per inch */
const MM_PER_INCH = 25.4;

/**
 * Calculate backspacing from wheel width and offset
 * 
 * Backspacing = (width / 2) + offset
 * (where width is in mm and offset is in mm)
 * 
 * @param widthInches - Wheel width in inches
 * @param offsetMm - Offset in millimeters
 * @returns Backspacing in inches
 */
export function calculateBackspacing(widthInches: number, offsetMm: number): number {
  const widthMm = widthInches * MM_PER_INCH;
  const backspacingMm = (widthMm / 2) + offsetMm;
  return backspacingMm / MM_PER_INCH;
}

/**
 * Calculate offset from wheel width and backspacing
 * 
 * Offset = backspacing - (width / 2)
 * 
 * @param widthInches - Wheel width in inches
 * @param backspacingInches - Backspacing in inches
 * @returns Offset in millimeters
 */
export function calculateOffset(widthInches: number, backspacingInches: number): number {
  const widthMm = widthInches * MM_PER_INCH;
  const backspacingMm = backspacingInches * MM_PER_INCH;
  return backspacingMm - (widthMm / 2);
}

/**
 * Validate wheel specification
 */
function validateWheelSpec(spec: WheelSpec): void {
  if (spec.width < 4 || spec.width > 16) {
    throw new Error(`Invalid wheel width: ${spec.width}". Expected 4-16".`);
  }
  if (spec.diameter < 13 || spec.diameter > 26) {
    throw new Error(`Invalid wheel diameter: ${spec.diameter}". Expected 13-26".`);
  }
  if (spec.offset < -100 || spec.offset > 100) {
    throw new Error(`Invalid offset: ${spec.offset}mm. Expected -100 to +100mm.`);
  }
}

/**
 * Format wheel size as standard string
 * 
 * @param spec - Wheel specification
 * @returns Formatted string (e.g., "18x8 ET45")
 */
export function formatWheelSize(spec: WheelSpec): string {
  const offsetSign = spec.offset >= 0 ? '+' : '';
  return `${spec.diameter}x${spec.width} ET${offsetSign}${spec.offset}`;
}

/**
 * Calculate all wheel dimensions from specification
 * 
 * @param spec - Wheel specification
 * @returns Complete wheel dimensions
 */
export function calculateWheelDimensions(spec: WheelSpec): WheelDimensions {
  validateWheelSpec(spec);
  
  const widthMm = spec.width * MM_PER_INCH;
  const backspacingMm = (widthMm / 2) + spec.offset;
  const backspacing = backspacingMm / MM_PER_INCH;
  
  // Distance from mounting surface to outer lip (street side)
  const outerLipDistance = (widthMm / 2) - spec.offset;
  
  // Distance from mounting surface to inner lip (suspension side)
  const innerLipDistance = (widthMm / 2) + spec.offset;
  
  return {
    width: spec.width,
    widthMm,
    diameter: spec.diameter,
    offset: spec.offset,
    backspacing,
    backspacingMm,
    outerLipDistance,
    innerLipDistance,
    formattedSize: formatWheelSize(spec),
  };
}

/**
 * Compare two wheel specifications for fitment
 * 
 * @param originalSpec - Original wheel specification
 * @param newSpec - New wheel specification
 * @returns Comparison results
 */
export function compareWheelFitment(
  originalSpec: WheelSpec,
  newSpec: WheelSpec
): WheelComparison {
  const original = calculateWheelDimensions(originalSpec);
  const newWheel = calculateWheelDimensions(newSpec);
  
  // Inner clearance change: positive means more room near suspension
  // If new inner lip distance is smaller, there's more clearance
  const innerClearanceChange = original.innerLipDistance - newWheel.innerLipDistance;
  
  // Outer clearance change: positive means wheel is tucked in more
  // If new outer lip distance is smaller, wheel is tucked in
  const outerClearanceChange = original.outerLipDistance - newWheel.outerLipDistance;
  
  // Track width change per side (how much the wheel moves outward)
  // Positive = wheel moves outward (pokes more)
  const trackWidthChangePerSide = newWheel.outerLipDistance - original.outerLipDistance;
  
  // Determine fitment characteristics
  const willPokeMore = trackWidthChangePerSide > 0;
  const willTuckMore = trackWidthChangePerSide < 0;
  const closerToSuspension = innerClearanceChange < 0;
  
  // Generate fitment assessment
  let fitmentAssessment = '';
  
  if (Math.abs(trackWidthChangePerSide) < 5 && Math.abs(innerClearanceChange) < 5) {
    fitmentAssessment = 'Very similar fitment to original wheels.';
  } else {
    const changes: string[] = [];
    
    if (willPokeMore) {
      changes.push(`wheel will sit ${Math.abs(trackWidthChangePerSide).toFixed(1)}mm further out`);
    } else if (willTuckMore) {
      changes.push(`wheel will sit ${Math.abs(trackWidthChangePerSide).toFixed(1)}mm further in`);
    }
    
    if (closerToSuspension) {
      changes.push(`${Math.abs(innerClearanceChange).toFixed(1)}mm closer to suspension`);
    } else if (innerClearanceChange > 5) {
      changes.push(`${innerClearanceChange.toFixed(1)}mm more suspension clearance`);
    }
    
    if (newWheel.width > original.width) {
      changes.push(`${(newWheel.width - original.width).toFixed(1)}" wider`);
    } else if (newWheel.width < original.width) {
      changes.push(`${(original.width - newWheel.width).toFixed(1)}" narrower`);
    }
    
    fitmentAssessment = changes.length > 0 
      ? `The new wheel will be ${changes.join(', ')}.`
      : 'Fitment is similar to original.';
  }
  
  return {
    original,
    newWheel,
    innerClearanceChange,
    outerClearanceChange,
    willPokeMore,
    willTuckMore,
    closerToSuspension,
    trackWidthChangePerSide,
    totalTrackWidthChange: trackWidthChangePerSide * 2,
    fitmentAssessment,
  };
}

/**
 * Calculate the offset needed to maintain the same outer lip position
 * when changing wheel width
 * 
 * @param originalSpec - Original wheel specification
 * @param newWidth - New wheel width in inches
 * @returns Required offset in mm
 */
export function calculateMatchingOffset(
  originalSpec: WheelSpec,
  newWidth: number
): number {
  const original = calculateWheelDimensions(originalSpec);
  const newWidthMm = newWidth * MM_PER_INCH;
  
  // To maintain same outer lip position:
  // newOuterLipDistance = originalOuterLipDistance
  // (newWidthMm / 2) - newOffset = originalOuterLipDistance
  // newOffset = (newWidthMm / 2) - originalOuterLipDistance
  
  return (newWidthMm / 2) - original.outerLipDistance;
}

/**
 * Check if a wheel will likely fit without rubbing
 * 
 * @param comparison - Wheel comparison result
 * @param maxPokeAllowed - Maximum poke allowed in mm (default 10)
 * @param minSuspensionClearance - Minimum suspension clearance in mm (default 5)
 * @returns Whether the wheel will likely fit
 */
export function willWheelFit(
  comparison: WheelComparison,
  maxPokeAllowed: number = 10,
  minSuspensionClearance: number = 5
): { fits: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (comparison.trackWidthChangePerSide > maxPokeAllowed) {
    issues.push(`Wheel pokes ${comparison.trackWidthChangePerSide.toFixed(1)}mm beyond allowed ${maxPokeAllowed}mm`);
  }
  
  if (comparison.innerClearanceChange < -minSuspensionClearance) {
    issues.push(`Wheel is ${Math.abs(comparison.innerClearanceChange).toFixed(1)}mm closer to suspension than safe`);
  }
  
  return {
    fits: issues.length === 0,
    issues,
  };
}

/**
 * Common wheel offsets by vehicle type
 */
export const TYPICAL_OFFSETS: Record<string, { min: number; max: number; typical: number }> = {
  'front-wheel-drive': { min: 35, max: 55, typical: 45 },
  'rear-wheel-drive': { min: 15, max: 45, typical: 30 },
  'truck-suv': { min: -25, max: 25, typical: 0 },
  'sports-car': { min: 25, max: 50, typical: 40 },
  'muscle-car': { min: 0, max: 35, typical: 20 },
};
