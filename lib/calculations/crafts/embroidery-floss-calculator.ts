/**
 * Embroidery Floss Calculator
 * 
 * Calculates the amount of embroidery floss needed for a project
 * based on stitch count, fabric count, and stitch type.
 * 
 * @module lib/calculations/crafts/embroidery-floss-calculator
 * @see Requirements 24.6
 */

/**
 * Types of embroidery stitches
 */
export type StitchType = 
  | 'cross-stitch'
  | 'half-stitch'
  | 'backstitch'
  | 'french-knot'
  | 'satin-stitch'
  | 'long-stitch';

/**
 * Stitch information including thread usage multiplier
 */
export interface StitchInfo {
  name: string;
  description: string;
  /** Thread usage multiplier relative to cross stitch */
  threadMultiplier: number;
  /** Typical number of strands used */
  typicalStrands: number;
}

/**
 * Stitch type data
 */
export const STITCH_TYPES: Record<StitchType, StitchInfo> = {
  'cross-stitch': {
    name: 'Cross Stitch',
    description: 'Standard X-shaped stitch',
    threadMultiplier: 1.0,
    typicalStrands: 2,
  },
  'half-stitch': {
    name: 'Half Stitch',
    description: 'Single diagonal stitch',
    threadMultiplier: 0.5,
    typicalStrands: 2,
  },
  'backstitch': {
    name: 'Backstitch',
    description: 'Outline stitch for details',
    threadMultiplier: 0.75,
    typicalStrands: 1,
  },
  'french-knot': {
    name: 'French Knot',
    description: 'Small decorative knot',
    threadMultiplier: 0.3,
    typicalStrands: 2,
  },
  'satin-stitch': {
    name: 'Satin Stitch',
    description: 'Parallel stitches for filling',
    threadMultiplier: 1.2,
    typicalStrands: 2,
  },
  'long-stitch': {
    name: 'Long Stitch',
    description: 'Extended straight stitch',
    threadMultiplier: 1.5,
    typicalStrands: 2,
  },
};

/**
 * Common fabric counts (stitches per inch)
 */
export const FABRIC_COUNTS = [
  { value: 11, label: '11 count Aida' },
  { value: 14, label: '14 count Aida' },
  { value: 16, label: '16 count Aida' },
  { value: 18, label: '18 count Aida' },
  { value: 22, label: '22 count Hardanger' },
  { value: 25, label: '25 count Evenweave' },
  { value: 28, label: '28 count Evenweave/Linen' },
  { value: 32, label: '32 count Linen' },
  { value: 36, label: '36 count Linen' },
  { value: 40, label: '40 count Linen' },
];

/**
 * Standard DMC floss skein length in inches
 */
export const DMC_SKEIN_LENGTH_INCHES = 8 * 36; // 8 yards = 288 inches

/**
 * Standard DMC floss skein length in meters
 */
export const DMC_SKEIN_LENGTH_METERS = 8; // 8 meters

/**
 * Input for embroidery floss calculation
 */
export interface EmbroideryFlossInput {
  /** Number of stitches of this color */
  stitchCount: number;
  /** Fabric count (stitches per inch) */
  fabricCount: number;
  /** Type of stitch */
  stitchType: StitchType;
  /** Number of strands to use */
  strandsUsed: number;
  /** Whether stitching over 2 threads (for evenweave/linen) */
  overTwo?: boolean;
}

/**
 * Result of embroidery floss calculation
 */
export interface EmbroideryFlossResult {
  /** Total thread length needed in inches */
  threadLengthInches: number;
  /** Total thread length needed in meters */
  threadLengthMeters: number;
  /** Number of skeins needed (rounded up) */
  skeinsNeeded: number;
  /** Percentage of a skein used */
  skeinPercentage: number;
  /** Thread length per stitch in inches */
  threadPerStitch: number;
  /** Recommended cutting length in inches */
  recommendedCutLength: number;
}

/**
 * Calculates the thread length needed per stitch
 * 
 * Formula accounts for:
 * - Fabric count (higher count = smaller stitches = less thread)
 * - Stitch type multiplier
 * - Number of strands
 * - Over-two stitching
 * 
 * @param fabricCount - Stitches per inch
 * @param stitchType - Type of stitch
 * @param strandsUsed - Number of strands
 * @param overTwo - Whether stitching over 2 threads
 * @returns Thread length per stitch in inches
 */
export function calculateThreadPerStitch(
  fabricCount: number,
  stitchType: StitchType,
  strandsUsed: number,
  overTwo: boolean = false
): number {
  // Base thread per stitch for 14 count cross stitch with 2 strands
  // Approximately 1 inch of thread per stitch
  const baseThreadPerStitch = 1.0;
  
  // Adjust for fabric count (14 count is baseline)
  const countAdjustment = 14 / fabricCount;
  
  // Adjust for stitch type
  const stitchInfo = STITCH_TYPES[stitchType];
  const stitchAdjustment = stitchInfo.threadMultiplier;
  
  // Adjust for number of strands (2 strands is baseline)
  const strandAdjustment = strandsUsed / 2;
  
  // Adjust for over-two stitching (doubles the stitch size)
  const overTwoAdjustment = overTwo ? 2 : 1;
  
  return baseThreadPerStitch * countAdjustment * stitchAdjustment * strandAdjustment * overTwoAdjustment;
}

/**
 * Calculates embroidery floss requirements
 * 
 * @param input - Embroidery floss calculation input
 * @returns Embroidery floss calculation result
 */
export function calculateEmbroideryFloss(input: EmbroideryFlossInput): EmbroideryFlossResult {
  const {
    stitchCount,
    fabricCount,
    stitchType,
    strandsUsed,
    overTwo = false,
  } = input;

  // Validate inputs
  if (stitchCount <= 0) {
    throw new Error('Stitch count must be positive');
  }
  if (fabricCount <= 0) {
    throw new Error('Fabric count must be positive');
  }
  if (strandsUsed <= 0 || strandsUsed > 6) {
    throw new Error('Strands must be between 1 and 6');
  }

  // Calculate thread per stitch
  const threadPerStitch = calculateThreadPerStitch(fabricCount, stitchType, strandsUsed, overTwo);
  
  // Calculate total thread needed
  const threadLengthInches = stitchCount * threadPerStitch;
  const threadLengthMeters = threadLengthInches * 0.0254;
  
  // Add 15% buffer for waste, tails, and mistakes
  const threadWithBuffer = threadLengthInches * 1.15;
  
  // Calculate skeins needed
  const skeinsNeeded = Math.ceil(threadWithBuffer / DMC_SKEIN_LENGTH_INCHES);
  const skeinPercentage = (threadWithBuffer / DMC_SKEIN_LENGTH_INCHES) * 100;
  
  // Recommended cutting length (18 inches is standard)
  const recommendedCutLength = 18;

  return {
    threadLengthInches: Math.round(threadLengthInches * 10) / 10,
    threadLengthMeters: Math.round(threadLengthMeters * 100) / 100,
    skeinsNeeded,
    skeinPercentage: Math.round(skeinPercentage * 10) / 10,
    threadPerStitch: Math.round(threadPerStitch * 100) / 100,
    recommendedCutLength,
  };
}

/**
 * Input for multi-color project calculation
 */
export interface MultiColorInput {
  colors: {
    colorCode: string;
    colorName?: string;
    stitchCount: number;
    stitchType: StitchType;
  }[];
  fabricCount: number;
  strandsUsed: number;
  overTwo?: boolean;
}

/**
 * Result for multi-color project
 */
export interface MultiColorResult {
  colors: {
    colorCode: string;
    colorName?: string;
    stitchCount: number;
    threadLengthInches: number;
    skeinsNeeded: number;
  }[];
  totalStitches: number;
  totalSkeins: number;
  totalThreadInches: number;
}

/**
 * Calculates floss requirements for a multi-color project
 * 
 * @param input - Multi-color project input
 * @returns Multi-color calculation result
 */
export function calculateMultiColorProject(input: MultiColorInput): MultiColorResult {
  const { colors, fabricCount, strandsUsed, overTwo } = input;
  
  let totalStitches = 0;
  let totalSkeins = 0;
  let totalThreadInches = 0;
  
  const colorResults = colors.map(color => {
    const result = calculateEmbroideryFloss({
      stitchCount: color.stitchCount,
      fabricCount,
      stitchType: color.stitchType,
      strandsUsed,
      overTwo,
    });
    
    totalStitches += color.stitchCount;
    totalSkeins += result.skeinsNeeded;
    totalThreadInches += result.threadLengthInches;
    
    return {
      colorCode: color.colorCode,
      colorName: color.colorName,
      stitchCount: color.stitchCount,
      threadLengthInches: result.threadLengthInches,
      skeinsNeeded: result.skeinsNeeded,
    };
  });
  
  return {
    colors: colorResults,
    totalStitches,
    totalSkeins,
    totalThreadInches: Math.round(totalThreadInches * 10) / 10,
  };
}
