/**
 * eDPI (Effective DPI) Calculator
 * 
 * eDPI is a standardized metric for comparing mouse sensitivity across
 * different DPI settings. It's calculated as DPI × in-game sensitivity.
 * 
 * @module lib/calculations/gaming/edpi-calculator
 * @see Requirements 17.2
 */

export interface EDPIInput {
  dpi: number;
  sensitivity: number;
}

export interface EDPIResult {
  edpi: number;
  dpi: number;
  sensitivity: number;
  /** Classification based on common pro player ranges */
  classification: 'very-low' | 'low' | 'medium' | 'high' | 'very-high';
  /** Recommendation based on eDPI */
  recommendation: string;
}

export interface EDPIComparisonResult {
  edpi1: number;
  edpi2: number;
  difference: number;
  percentDifference: number;
  /** Which setup is faster (higher eDPI) */
  fasterSetup: 1 | 2 | 'equal';
}

/**
 * Common eDPI ranges for FPS games (based on pro player data)
 * These are approximate ranges and vary by game
 */
export const EDPI_RANGES = {
  veryLow: { min: 0, max: 200 },
  low: { min: 200, max: 400 },
  medium: { min: 400, max: 800 },
  high: { min: 800, max: 1600 },
  veryHigh: { min: 1600, max: Infinity },
} as const;

/**
 * Calculate eDPI (effective DPI)
 * 
 * eDPI = DPI × in-game sensitivity
 * 
 * @param input - DPI and sensitivity values
 * @returns eDPI calculation result with classification
 */
export function calculateEDPI(input: EDPIInput): EDPIResult {
  const { dpi, sensitivity } = input;

  if (dpi <= 0) throw new Error('DPI must be positive');
  if (sensitivity < 0) throw new Error('Sensitivity cannot be negative');

  const edpi = dpi * sensitivity;
  const classification = classifyEDPI(edpi);
  const recommendation = getEDPIRecommendation(classification);

  return {
    edpi,
    dpi,
    sensitivity,
    classification,
    recommendation,
  };
}

/**
 * Classify eDPI into a category
 * 
 * @param edpi - eDPI value
 * @returns Classification string
 */
export function classifyEDPI(edpi: number): EDPIResult['classification'] {
  if (edpi < EDPI_RANGES.veryLow.max) return 'very-low';
  if (edpi < EDPI_RANGES.low.max) return 'low';
  if (edpi < EDPI_RANGES.medium.max) return 'medium';
  if (edpi < EDPI_RANGES.high.max) return 'high';
  return 'very-high';
}

/**
 * Get recommendation based on eDPI classification
 * 
 * @param classification - eDPI classification
 * @returns Recommendation string
 */
export function getEDPIRecommendation(classification: EDPIResult['classification']): string {
  switch (classification) {
    case 'very-low':
      return 'Very low sensitivity. Great for precision aiming but requires large mouse movements. Common among CS2 pros.';
    case 'low':
      return 'Low sensitivity. Good balance of precision and mobility. Popular among tactical FPS players.';
    case 'medium':
      return 'Medium sensitivity. Versatile for most game types. Good starting point for new players.';
    case 'high':
      return 'High sensitivity. Allows quick turns with small movements. Common in fast-paced games like Apex Legends.';
    case 'very-high':
      return 'Very high sensitivity. Extremely fast but may sacrifice precision. Consider lowering for better accuracy.';
  }
}

/**
 * Calculate sensitivity needed to achieve target eDPI
 * 
 * @param targetEDPI - Desired eDPI value
 * @param dpi - Mouse DPI setting
 * @returns Required sensitivity value
 */
export function sensitivityForTargetEDPI(targetEDPI: number, dpi: number): number {
  if (dpi <= 0) throw new Error('DPI must be positive');
  if (targetEDPI < 0) throw new Error('Target eDPI cannot be negative');

  return targetEDPI / dpi;
}

/**
 * Calculate DPI needed to achieve target eDPI
 * 
 * @param targetEDPI - Desired eDPI value
 * @param sensitivity - In-game sensitivity
 * @returns Required DPI value
 */
export function dpiForTargetEDPI(targetEDPI: number, sensitivity: number): number {
  if (sensitivity <= 0) throw new Error('Sensitivity must be positive');
  if (targetEDPI < 0) throw new Error('Target eDPI cannot be negative');

  return targetEDPI / sensitivity;
}

/**
 * Compare two eDPI setups
 * 
 * @param setup1 - First DPI/sensitivity setup
 * @param setup2 - Second DPI/sensitivity setup
 * @returns Comparison result
 */
export function compareEDPI(setup1: EDPIInput, setup2: EDPIInput): EDPIComparisonResult {
  const edpi1 = setup1.dpi * setup1.sensitivity;
  const edpi2 = setup2.dpi * setup2.sensitivity;

  const difference = Math.abs(edpi1 - edpi2);
  const percentDifference = edpi1 !== 0 ? (difference / edpi1) * 100 : 0;

  let fasterSetup: 1 | 2 | 'equal';
  if (edpi1 > edpi2) {
    fasterSetup = 1;
  } else if (edpi2 > edpi1) {
    fasterSetup = 2;
  } else {
    fasterSetup = 'equal';
  }

  return {
    edpi1,
    edpi2,
    difference,
    percentDifference,
    fasterSetup,
  };
}

/**
 * Get common pro player eDPI values for reference
 * 
 * @returns Array of pro player eDPI examples
 */
export function getProPlayerEDPIExamples(): Array<{
  player: string;
  game: string;
  edpi: number;
  dpi: number;
  sensitivity: number;
}> {
  return [
    { player: 'TenZ', game: 'Valorant', edpi: 204, dpi: 800, sensitivity: 0.255 },
    { player: 's1mple', game: 'CS2', edpi: 1236, dpi: 400, sensitivity: 3.09 },
    { player: 'Shroud', game: 'Various', edpi: 400, dpi: 400, sensitivity: 1.0 },
    { player: 'aceu', game: 'Apex Legends', edpi: 800, dpi: 800, sensitivity: 1.0 },
    { player: 'NiKo', game: 'CS2', edpi: 528, dpi: 400, sensitivity: 1.32 },
  ];
}
