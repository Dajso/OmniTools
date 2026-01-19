/**
 * Socks Size Calculator
 * 
 * Calculates sock dimensions from foot measurements for knitting/crocheting
 */

export interface SockMeasurements {
  footLength: number; // in inches or cm
  footCircumference: number; // around ball of foot
  ankleCircumference: number;
  legLength?: number; // for knee-high or boot socks
  unit: 'inches' | 'cm';
}

export interface SockGauge {
  stitchesPerInch: number;
  rowsPerInch: number;
}

export interface SockResult {
  // Stitch counts
  castOnStitches: number;
  footStitches: number;
  toeDecreaseStitches: number;
  heelStitches: number;
  
  // Measurements
  footLengthToToe: number;
  heelFlapLength: number;
  gussetPickupStitches: number;
  legLength: number;
  
  // Sizing info
  usSize: string;
  euSize: string;
  ukSize: string;
  
  // Negative ease applied
  negativeEase: number;
}

// Standard sock sizes by foot length (inches)
export const SOCK_SIZE_CHART = {
  'XS': { footLength: [7.5, 8], usSize: '4-5', euSize: '35-36', ukSize: '2-3' },
  'S': { footLength: [8, 8.75], usSize: '5-6.5', euSize: '36-38', ukSize: '3-4.5' },
  'M': { footLength: [8.75, 9.5], usSize: '7-8.5', euSize: '38-40', ukSize: '5-6.5' },
  'L': { footLength: [9.5, 10.25], usSize: '9-10.5', euSize: '40-42', ukSize: '7-8.5' },
  'XL': { footLength: [10.25, 11], usSize: '11-12', euSize: '42-44', ukSize: '9-10' },
  'XXL': { footLength: [11, 12], usSize: '12.5-14', euSize: '44-47', ukSize: '10.5-12' },
};

// Standard negative ease for socks (percentage)
const SOCK_NEGATIVE_EASE = 10; // 10% negative ease for snug fit

/**
 * Convert cm to inches
 */
function cmToInches(cm: number): number {
  return cm / 2.54;
}

/**
 * Get sock size from foot length
 */
export function getSockSize(footLengthInches: number): { size: string; usSize: string; euSize: string; ukSize: string } {
  for (const [size, data] of Object.entries(SOCK_SIZE_CHART)) {
    if (footLengthInches >= data.footLength[0] && footLengthInches < data.footLength[1]) {
      return { size, usSize: data.usSize, euSize: data.euSize, ukSize: data.ukSize };
    }
  }
  
  // Default to closest size
  if (footLengthInches < 7.5) {
    return { size: 'XS', ...SOCK_SIZE_CHART['XS'] };
  }
  return { size: 'XXL', ...SOCK_SIZE_CHART['XXL'] };
}

/**
 * Calculate sock dimensions from measurements and gauge
 */
export function calculateSockDimensions(
  measurements: SockMeasurements,
  gauge: SockGauge
): SockResult {
  // Convert to inches if needed
  const footLength = measurements.unit === 'cm' 
    ? cmToInches(measurements.footLength) 
    : measurements.footLength;
  const footCirc = measurements.unit === 'cm'
    ? cmToInches(measurements.footCircumference)
    : measurements.footCircumference;
  const ankleCirc = measurements.unit === 'cm'
    ? cmToInches(measurements.ankleCircumference)
    : measurements.ankleCircumference;
  const legLen = measurements.legLength
    ? (measurements.unit === 'cm' ? cmToInches(measurements.legLength) : measurements.legLength)
    : 6; // Default 6 inch leg

  // Apply negative ease
  const negativeEase = SOCK_NEGATIVE_EASE;
  const targetCircumference = footCirc * (1 - negativeEase / 100);
  
  // Calculate stitch counts
  const castOnStitches = Math.round(targetCircumference * gauge.stitchesPerInch);
  // Round to multiple of 4 for easier pattern work
  const adjustedCastOn = Math.round(castOnStitches / 4) * 4;
  
  // Foot stitches (same as cast on for most patterns)
  const footStitches = adjustedCastOn;
  
  // Heel stitches (half of total)
  const heelStitches = Math.round(adjustedCastOn / 2);
  
  // Toe decrease (typically decrease to 1/4 of original)
  const toeDecreaseStitches = Math.round(adjustedCastOn / 4);
  
  // Heel flap length (same as heel stitches in rows, typically)
  const heelFlapLength = heelStitches / gauge.rowsPerInch;
  
  // Gusset pickup stitches (typically heel flap rows / 2 + 2)
  const gussetPickupStitches = Math.round(heelStitches / 2) + 2;
  
  // Foot length to toe (total length minus toe shaping)
  // Toe shaping typically takes about 2 inches
  const footLengthToToe = footLength - 2;
  
  // Get size info
  const sizeInfo = getSockSize(footLength);
  
  return {
    castOnStitches: adjustedCastOn,
    footStitches,
    toeDecreaseStitches,
    heelStitches,
    footLengthToToe: Math.round(footLengthToToe * 10) / 10,
    heelFlapLength: Math.round(heelFlapLength * 10) / 10,
    gussetPickupStitches,
    legLength: Math.round(legLen * 10) / 10,
    usSize: sizeInfo.usSize,
    euSize: sizeInfo.euSize,
    ukSize: sizeInfo.ukSize,
    negativeEase,
  };
}

/**
 * Get yarn requirements estimate (in yards)
 */
export function estimateYarnRequirements(sockResult: SockResult, yarnWeight: 'fingering' | 'sport' | 'dk'): number {
  const baseYardage = {
    fingering: 400, // yards per pair for average adult sock
    sport: 350,
    dk: 300,
  };
  
  // Adjust based on leg length
  const legMultiplier = sockResult.legLength / 6; // 6 inches is baseline
  
  return Math.round(baseYardage[yarnWeight] * legMultiplier);
}

export default {
  calculateSockDimensions,
  getSockSize,
  estimateYarnRequirements,
  SOCK_SIZE_CHART,
};
