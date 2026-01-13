/**
 * Fence Calculator
 * 
 * Calculates materials needed for fence construction.
 * 
 * @module lib/calculations/home/fence-calculator
 * @see Requirements 7.11
 */

export interface FenceInputs {
  /** Total fence length in feet */
  totalLength: number;
  /** Fence height in feet */
  fenceHeight: number;
  /** Post spacing in feet (typically 6-8) */
  postSpacing: number;
  /** Number of gates */
  numberOfGates: number;
  /** Picket width in inches */
  picketWidth: number;
  /** Gap between pickets in inches */
  picketGap: number;
}

export interface FenceResults {
  /** Number of posts needed */
  posts: number;
  /** Number of rails needed (2 or 3 per section) */
  rails: number;
  /** Number of pickets needed */
  pickets: number;
  /** Concrete bags for posts (1 bag per post) */
  concreteBags: number;
  /** Linear feet of rail material */
  railLinearFeet: number;
}

/**
 * Calculates fence material requirements
 */
export function calculateFence(inputs: FenceInputs): FenceResults {
  const { totalLength, fenceHeight, postSpacing, numberOfGates, picketWidth, picketGap } = inputs;

  if (totalLength <= 0 || fenceHeight <= 0 || postSpacing <= 0) {
    throw new Error('Dimensions must be positive');
  }

  // Calculate posts (one at each end plus intermediate posts)
  const sections = Math.ceil(totalLength / postSpacing);
  const posts = sections + 1 + (numberOfGates * 2); // Extra posts for gates

  // Rails: 2 for fences under 5 feet, 3 for taller
  const railsPerSection = fenceHeight >= 5 ? 3 : 2;
  const rails = sections * railsPerSection;
  const railLinearFeet = rails * postSpacing;

  // Calculate pickets
  const picketWidthFt = picketWidth / 12;
  const picketGapFt = picketGap / 12;
  const picketsPerFoot = 1 / (picketWidthFt + picketGapFt);
  const pickets = Math.ceil(totalLength * picketsPerFoot);

  // One 50lb bag of concrete per post
  const concreteBags = posts;

  return {
    posts,
    rails,
    pickets,
    concreteBags,
    railLinearFeet,
  };
}
