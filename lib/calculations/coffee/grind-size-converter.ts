/**
 * Grind Size Converter
 * 
 * Converts grind settings between different grinder models.
 * Uses conversion tables and normalization to map settings across grinders.
 * 
 * @module lib/calculations/coffee/grind-size-converter
 * @see Requirements 6.1, 6.2, 6.3, 6.4, 6.5
 */

import { CoffeeCalculationError } from './extraction-yield';
import {
  type GrindSize,
  type GrinderConfig,
  getGrinderList,
  getGrinderConfig,
  isValidSetting,
  getGrindSizeForSetting,
  getGrindSizeDescription,
} from './grinder-database';

/**
 * Confidence level for grind conversion
 */
export type ConfidenceLevel = 'high' | 'medium' | 'low';

/**
 * Input parameters for grind size conversion
 */
export interface GrindSizeInputs {
  /** Source grinder ID (e.g., 'comandante') */
  sourceGrinder: string;
  /** Source setting value */
  sourceSetting: number;
  /** Target grinder ID (e.g., 'baratza-encore') */
  targetGrinder: string;
}

/**
 * Results from grind size conversion
 */
export interface GrindSizeResults {
  /** Converted target setting */
  targetSetting: number;
  /** Grind size description (e.g., "Medium-fine") */
  grindDescription: string;
  /** Confidence level of the conversion */
  confidence: ConfidenceLevel;
  /** Source grind size category */
  sourceGrindSize: GrindSize;
  /** Target grind size category */
  targetGrindSize: GrindSize;
  /** Additional notes about the conversion */
  notes: string[];
}

// Re-export for convenience
export { getGrinderConfig, getGrinderList, isValidSetting, getGrindSizeForSetting, getGrindSizeDescription };
export type { GrinderConfig };

/**
 * Normalizes a grinder setting to a 0-1 scale
 * 
 * @param setting - Setting value
 * @param config - Grinder configuration
 * @returns Normalized value between 0 (finest) and 1 (coarsest)
 */
function normalizeSetting(setting: number, config: GrinderConfig): number {
  const [min, max] = config.range;
  return (setting - min) / (max - min);
}

/**
 * Denormalizes a 0-1 scale value to a grinder setting
 * 
 * @param normalized - Normalized value (0-1)
 * @param config - Grinder configuration
 * @returns Setting value for the grinder
 */
function denormalizeSetting(normalized: number, config: GrinderConfig): number {
  const [min, max] = config.range;
  return min + normalized * (max - min);
}

/**
 * Determines confidence level based on grinder characteristics
 * 
 * Confidence is higher when:
 * - Both grinders have similar range sizes
 * - Both grinders are well-known models with established settings
 * - The conversion is within common brew method ranges
 * 
 * @param sourceConfig - Source grinder configuration
 * @param targetConfig - Target grinder configuration
 * @param sourceNormalized - Normalized source setting
 * @returns Confidence level
 */
function determineConfidence(
  sourceConfig: GrinderConfig,
  targetConfig: GrinderConfig,
  sourceNormalized: number
): ConfidenceLevel {
  const sourceRange = sourceConfig.range[1] - sourceConfig.range[0];
  const targetRange = targetConfig.range[1] - targetConfig.range[0];
  
  // Calculate range similarity (closer to 1 is better)
  const rangeSimilarity = Math.min(sourceRange, targetRange) / Math.max(sourceRange, targetRange);
  
  // Settings in the middle range (0.3-0.7) are more reliable
  const isMiddleRange = sourceNormalized >= 0.3 && sourceNormalized <= 0.7;
  
  // High confidence: similar ranges and middle settings
  if (rangeSimilarity > 0.7 && isMiddleRange) {
    return 'high';
  }
  
  // Low confidence: very different ranges or extreme settings
  if (rangeSimilarity < 0.4 || sourceNormalized < 0.1 || sourceNormalized > 0.9) {
    return 'low';
  }
  
  // Medium confidence: everything else
  return 'medium';
}

/**
 * Generates helpful notes about the conversion
 * 
 * @param sourceConfig - Source grinder configuration
 * @param targetConfig - Target grinder configuration
 * @param confidence - Confidence level
 * @param grindSize - Grind size category
 * @returns Array of note strings
 */
function generateNotes(
  sourceConfig: GrinderConfig,
  targetConfig: GrinderConfig,
  confidence: ConfidenceLevel,
  grindSize: GrindSize
): string[] {
  const notes: string[] = [];
  
  // Add confidence explanation
  if (confidence === 'low') {
    notes.push(
      'This conversion has lower confidence due to significant differences between grinders. ' +
      'Use as a starting point and adjust to taste.'
    );
  } else if (confidence === 'medium') {
    notes.push(
      'This conversion is a good starting point. Fine-tune based on your taste preferences.'
    );
  } else {
    notes.push(
      'This conversion has high confidence. The result should be very close to your source setting.'
    );
  }
  
  // Add grind size specific advice
  if (grindSize === 'extra-fine' || grindSize === 'fine') {
    notes.push(
      'For espresso and fine grinds, small adjustments make a big difference. ' +
      'Adjust in small increments (0.5-1 click at a time).'
    );
  } else if (grindSize === 'coarse' || grindSize === 'extra-coarse') {
    notes.push(
      'For coarse grinds, you may need to adjust by several clicks to notice a difference.'
    );
  }
  
  // Add grinder-specific notes
  const sourceRange = sourceConfig.range[1] - sourceConfig.range[0];
  const targetRange = targetConfig.range[1] - targetConfig.range[0];
  
  if (targetRange > sourceRange * 2) {
    notes.push(
      `${targetConfig.name} has a wider adjustment range, giving you more fine-tuning options.`
    );
  } else if (targetRange < sourceRange / 2) {
    notes.push(
      `${targetConfig.name} has a narrower adjustment range, so each click has more impact.`
    );
  }
  
  return notes;
}

/**
 * Converts grind setting from one grinder to another
 * 
 * The conversion algorithm:
 * 1. Validates that both grinders exist in the database
 * 2. Validates that the source setting is within valid range
 * 3. Normalizes the source setting to a 0-1 scale
 * 4. Maps to grind size category
 * 5. Denormalizes to target grinder's scale
 * 6. Rounds to nearest practical setting
 * 7. Determines confidence level
 * 
 * Note: Grinder conversions are approximate due to differences in:
 * - Burr geometry and material
 * - Grind distribution and consistency
 * - Manufacturer calibration
 * 
 * Always use converted settings as a starting point and adjust to taste.
 * 
 * @param inputs - Grind size conversion inputs
 * @returns Complete grind size conversion results
 * 
 * @throws {CoffeeCalculationError} When grinders not found or settings invalid
 * 
 * @example
 * ```ts
 * const result = convertGrindSize({
 *   sourceGrinder: 'comandante',
 *   sourceSetting: 20,
 *   targetGrinder: 'baratza-encore'
 * });
 * console.log(result.targetSetting);     // ~17
 * console.log(result.grindDescription);  // "Medium-fine"
 * console.log(result.confidence);        // "high"
 * ```
 */
export function convertGrindSize(inputs: GrindSizeInputs): GrindSizeResults {
  const { sourceGrinder, sourceSetting, targetGrinder } = inputs;

  // Validate source grinder exists
  const sourceConfig = getGrinderConfig(sourceGrinder);
  if (!sourceConfig) {
    throw new CoffeeCalculationError(
      `Source grinder not found in database: ${sourceGrinder}`,
      'conversion_failed',
      'sourceGrinder'
    );
  }

  // Validate target grinder exists
  const targetConfig = getGrinderConfig(targetGrinder);
  if (!targetConfig) {
    throw new CoffeeCalculationError(
      `Target grinder not found in database: ${targetGrinder}`,
      'conversion_failed',
      'targetGrinder'
    );
  }

  // Validate source setting is within valid range
  if (!isValidSetting(sourceGrinder, sourceSetting)) {
    const [min, max] = sourceConfig.range;
    throw new CoffeeCalculationError(
      `Source setting ${sourceSetting} is outside valid range for ${sourceConfig.name} (${min}-${max})`,
      'out_of_range',
      'sourceSetting'
    );
  }

  // Normalize source setting to 0-1 scale
  const normalizedSetting = normalizeSetting(sourceSetting, sourceConfig);

  // Get grind size categories
  const sourceGrindSize = getGrindSizeForSetting(sourceGrinder, sourceSetting);
  
  // Denormalize to target grinder scale
  const rawTargetSetting = denormalizeSetting(normalizedSetting, targetConfig);
  
  // Round to practical setting (0.5 increments for most grinders)
  const targetSetting = Math.round(rawTargetSetting * 2) / 2;
  
  // Ensure target setting is within valid range
  const [targetMin, targetMax] = targetConfig.range;
  const clampedTargetSetting = Math.max(targetMin, Math.min(targetMax, targetSetting));
  
  // Get target grind size (should match source)
  const targetGrindSize = getGrindSizeForSetting(targetGrinder, clampedTargetSetting);
  
  // Get grind description
  const grindDescription = getGrindSizeDescription(sourceGrindSize);
  
  // Determine confidence level
  const confidence = determineConfidence(sourceConfig, targetConfig, normalizedSetting);
  
  // Generate helpful notes
  const notes = generateNotes(sourceConfig, targetConfig, confidence, sourceGrindSize);

  return {
    targetSetting: clampedTargetSetting,
    grindDescription,
    confidence,
    sourceGrindSize,
    targetGrindSize,
    notes,
  };
}

/**
 * Get recommended settings for a brew method on a specific grinder
 * 
 * @param grinderId - Grinder ID
 * @param brewMethod - Brew method ('espresso', 'pourOver', 'frenchPress', etc.)
 * @returns Recommended setting range or undefined if not available
 */
export function getBrewMethodSettings(
  grinderId: string,
  brewMethod: 'espresso' | 'pourOver' | 'frenchPress' | 'coldBrew' | 'aeroPress'
): { min: number; max: number } | undefined {
  const config = getGrinderConfig(grinderId);
  if (!config) return undefined;
  
  return config[brewMethod];
}

