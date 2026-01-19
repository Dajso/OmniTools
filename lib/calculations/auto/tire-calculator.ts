/**
 * Tire Size Calculator
 * 
 * Calculates tire dimensions, circumference, and speedometer error
 * when comparing two tire sizes.
 * 
 * Tire size format: {width}/{aspectRatio}R{rimDiameter}
 * Example: 225/45R17 means:
 * - 225mm section width
 * - 45% aspect ratio (sidewall height = 45% of width)
 * - 17 inch rim diameter
 * 
 * @module lib/calculations/auto/tire-calculator
 * @see Requirements 28.1, 28.9
 */

/**
 * Tire size specification
 */
export interface TireSize {
  /** Section width in millimeters */
  width: number;
  /** Aspect ratio as percentage (e.g., 45 for 45%) */
  aspectRatio: number;
  /** Rim diameter in inches */
  rimDiameter: number;
}

/**
 * Calculated tire dimensions
 */
export interface TireDimensions {
  /** Section width in mm */
  sectionWidth: number;
  /** Sidewall height in mm */
  sidewallHeight: number;
  /** Overall diameter in mm */
  overallDiameter: number;
  /** Overall diameter in inches */
  overallDiameterInches: number;
  /** Circumference in mm */
  circumference: number;
  /** Circumference in inches */
  circumferenceInches: number;
  /** Revolutions per mile */
  revolutionsPerMile: number;
  /** Revolutions per kilometer */
  revolutionsPerKm: number;
  /** Formatted tire size string */
  formattedSize: string;
}

/**
 * Tire comparison result
 */
export interface TireComparison {
  /** Original tire dimensions */
  original: TireDimensions;
  /** New tire dimensions */
  newTire: TireDimensions;
  /** Diameter difference in mm */
  diameterDifference: number;
  /** Diameter difference as percentage */
  diameterDifferencePercent: number;
  /** Circumference difference in mm */
  circumferenceDifference: number;
  /** Circumference difference as percentage */
  circumferenceDifferencePercent: number;
  /** Speedometer error percentage (positive = speedo reads low) */
  speedometerError: number;
  /** Actual speed when speedometer shows 60 mph */
  actualSpeedAt60: number;
  /** Speedometer reading when actually going 60 mph */
  speedoReadingAt60: number;
  /** Ground clearance change in mm */
  groundClearanceChange: number;
  /** Whether the new tire is larger */
  isLarger: boolean;
}

/**
 * Common tire sizes for quick selection
 */
export const COMMON_TIRE_SIZES: TireSize[] = [
  { width: 195, aspectRatio: 65, rimDiameter: 15 },
  { width: 205, aspectRatio: 55, rimDiameter: 16 },
  { width: 215, aspectRatio: 55, rimDiameter: 17 },
  { width: 225, aspectRatio: 45, rimDiameter: 17 },
  { width: 225, aspectRatio: 50, rimDiameter: 17 },
  { width: 235, aspectRatio: 45, rimDiameter: 18 },
  { width: 235, aspectRatio: 55, rimDiameter: 18 },
  { width: 245, aspectRatio: 40, rimDiameter: 18 },
  { width: 245, aspectRatio: 45, rimDiameter: 19 },
  { width: 255, aspectRatio: 35, rimDiameter: 19 },
  { width: 265, aspectRatio: 35, rimDiameter: 20 },
  { width: 275, aspectRatio: 40, rimDiameter: 20 },
  { width: 285, aspectRatio: 30, rimDiameter: 21 },
  { width: 295, aspectRatio: 35, rimDiameter: 21 },
];

/** Millimeters per inch */
const MM_PER_INCH = 25.4;

/** Millimeters per mile */
const MM_PER_MILE = 1609344;

/** Millimeters per kilometer */
const MM_PER_KM = 1000000;

/**
 * Parse a tire size string into components
 * 
 * @param sizeString - Tire size string (e.g., "225/45R17")
 * @returns Parsed tire size or null if invalid
 */
export function parseTireSize(sizeString: string): TireSize | null {
  // Match patterns like "225/45R17" or "225/45-17" or "225 45 17"
  const pattern = /^(\d{3})\s*[\/\-]?\s*(\d{2})\s*[Rr\-]?\s*(\d{2})$/;
  const match = sizeString.trim().match(pattern);
  
  if (!match) {
    return null;
  }
  
  return {
    width: parseInt(match[1], 10),
    aspectRatio: parseInt(match[2], 10),
    rimDiameter: parseInt(match[3], 10),
  };
}

/**
 * Format a tire size as a standard string
 * 
 * @param size - Tire size specification
 * @returns Formatted string (e.g., "225/45R17")
 */
export function formatTireSize(size: TireSize): string {
  return `${size.width}/${size.aspectRatio}R${size.rimDiameter}`;
}

/**
 * Validate tire size values
 * 
 * @param size - Tire size to validate
 * @throws Error if values are invalid
 */
export function validateTireSize(size: TireSize): void {
  if (size.width < 100 || size.width > 400) {
    throw new Error(`Invalid tire width: ${size.width}mm. Expected 100-400mm.`);
  }
  if (size.aspectRatio < 20 || size.aspectRatio > 90) {
    throw new Error(`Invalid aspect ratio: ${size.aspectRatio}%. Expected 20-90%.`);
  }
  if (size.rimDiameter < 10 || size.rimDiameter > 30) {
    throw new Error(`Invalid rim diameter: ${size.rimDiameter}". Expected 10-30".`);
  }
}

/**
 * Calculate tire circumference from tire size
 * 
 * Formula: circumference = π × (2 × sidewallHeight + rimDiameter × 25.4)
 * where sidewallHeight = width × (aspectRatio / 100)
 * 
 * @param size - Tire size specification
 * @returns Circumference in millimeters
 */
export function calculateCircumference(size: TireSize): number {
  const sidewallHeight = size.width * (size.aspectRatio / 100);
  const overallDiameter = 2 * sidewallHeight + size.rimDiameter * MM_PER_INCH;
  return Math.PI * overallDiameter;
}

/**
 * Calculate overall tire diameter
 * 
 * Formula: diameter = 2 × sidewallHeight + rimDiameter × 25.4
 * 
 * @param size - Tire size specification
 * @returns Overall diameter in millimeters
 */
export function calculateDiameter(size: TireSize): number {
  const sidewallHeight = size.width * (size.aspectRatio / 100);
  return 2 * sidewallHeight + size.rimDiameter * MM_PER_INCH;
}

/**
 * Calculate all tire dimensions from size specification
 * 
 * @param size - Tire size specification
 * @returns Complete tire dimensions
 */
export function calculateTireDimensions(size: TireSize): TireDimensions {
  validateTireSize(size);
  
  const sidewallHeight = size.width * (size.aspectRatio / 100);
  const overallDiameter = 2 * sidewallHeight + size.rimDiameter * MM_PER_INCH;
  const circumference = Math.PI * overallDiameter;
  
  return {
    sectionWidth: size.width,
    sidewallHeight,
    overallDiameter,
    overallDiameterInches: overallDiameter / MM_PER_INCH,
    circumference,
    circumferenceInches: circumference / MM_PER_INCH,
    revolutionsPerMile: MM_PER_MILE / circumference,
    revolutionsPerKm: MM_PER_KM / circumference,
    formattedSize: formatTireSize(size),
  };
}

/**
 * Calculate speedometer error when changing tire sizes
 * 
 * The speedometer error is based on the ratio of circumferences:
 * error = (newCircumference / oldCircumference - 1) × 100
 * 
 * Positive error means the speedometer reads LOW (actual speed is higher)
 * Negative error means the speedometer reads HIGH (actual speed is lower)
 * 
 * @param originalSize - Original tire size
 * @param newSize - New tire size
 * @returns Speedometer error as percentage
 */
export function calculateSpeedometerError(
  originalSize: TireSize,
  newSize: TireSize
): number {
  const originalCircumference = calculateCircumference(originalSize);
  const newCircumference = calculateCircumference(newSize);
  
  return (newCircumference / originalCircumference - 1) * 100;
}

/**
 * Compare two tire sizes and calculate all differences
 * 
 * @param originalSize - Original/stock tire size
 * @param newSize - New tire size to compare
 * @returns Complete comparison results
 */
export function compareTireSizes(
  originalSize: TireSize,
  newSize: TireSize
): TireComparison {
  const original = calculateTireDimensions(originalSize);
  const newTire = calculateTireDimensions(newSize);
  
  const diameterDifference = newTire.overallDiameter - original.overallDiameter;
  const circumferenceDifference = newTire.circumference - original.circumference;
  
  // Speedometer error: positive = speedo reads low
  const speedometerError = (newTire.circumference / original.circumference - 1) * 100;
  
  // Calculate actual speed when speedometer shows 60
  // If speedo shows 60 but tires are larger, actual speed is higher
  const actualSpeedAt60 = 60 * (newTire.circumference / original.circumference);
  
  // Calculate speedo reading when actually going 60
  const speedoReadingAt60 = 60 * (original.circumference / newTire.circumference);
  
  // Ground clearance change is half the diameter difference
  const groundClearanceChange = diameterDifference / 2;
  
  return {
    original,
    newTire,
    diameterDifference,
    diameterDifferencePercent: (diameterDifference / original.overallDiameter) * 100,
    circumferenceDifference,
    circumferenceDifferencePercent: (circumferenceDifference / original.circumference) * 100,
    speedometerError,
    actualSpeedAt60,
    speedoReadingAt60,
    groundClearanceChange,
    isLarger: diameterDifference > 0,
  };
}

/**
 * Calculate what speed the speedometer will show for a given actual speed
 * 
 * @param actualSpeed - Actual vehicle speed
 * @param originalSize - Original tire size
 * @param newSize - New tire size
 * @returns Speedometer reading
 */
export function calculateSpeedometerReading(
  actualSpeed: number,
  originalSize: TireSize,
  newSize: TireSize
): number {
  const originalCircumference = calculateCircumference(originalSize);
  const newCircumference = calculateCircumference(newSize);
  
  return actualSpeed * (originalCircumference / newCircumference);
}

/**
 * Calculate actual speed from speedometer reading
 * 
 * @param speedometerReading - Speed shown on speedometer
 * @param originalSize - Original tire size
 * @param newSize - New tire size
 * @returns Actual vehicle speed
 */
export function calculateActualSpeed(
  speedometerReading: number,
  originalSize: TireSize,
  newSize: TireSize
): number {
  const originalCircumference = calculateCircumference(originalSize);
  const newCircumference = calculateCircumference(newSize);
  
  return speedometerReading * (newCircumference / originalCircumference);
}

/**
 * Find tire sizes that are within a tolerance of the original
 * 
 * @param originalSize - Original tire size
 * @param tolerancePercent - Maximum diameter difference percentage
 * @param availableSizes - List of available tire sizes to check
 * @returns Matching tire sizes sorted by closest match
 */
export function findCompatibleTires(
  originalSize: TireSize,
  tolerancePercent: number = 3,
  availableSizes: TireSize[] = COMMON_TIRE_SIZES
): TireSize[] {
  const originalDiameter = calculateDiameter(originalSize);
  
  return availableSizes
    .filter(size => {
      const diameter = calculateDiameter(size);
      const difference = Math.abs((diameter / originalDiameter - 1) * 100);
      return difference <= tolerancePercent;
    })
    .sort((a, b) => {
      const aDiff = Math.abs(calculateDiameter(a) - originalDiameter);
      const bDiff = Math.abs(calculateDiameter(b) - originalDiameter);
      return aDiff - bDiff;
    });
}
