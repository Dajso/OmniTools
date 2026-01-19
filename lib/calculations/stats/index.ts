/**
 * Statistics Calculations Module
 * Exports all statistics-related calculation functions
 * 
 * @module lib/calculations/stats
 */

// Sample Size Calculator
export {
  calculateSampleSize,
  getZScore,
  COMMON_CONFIDENCE_LEVELS,
  COMMON_MARGINS_OF_ERROR,
  type SampleSizeInput,
  type SampleSizeResult,
} from './sample-size-calculator';

// Descriptive Statistics
export {
  calculateDescriptiveStats,
  calculateMean,
  calculateMedian,
  calculateMode,
  calculateVariance,
  calculatePopulationVariance,
  calculateStandardDeviation,
  calculatePopulationStandardDeviation,
  parseNumberList,
  type DescriptiveStats,
} from './statistics';

// A/B Test Calculator
export {
  calculateABTestSignificance,
  calculateMinimumSampleSize,
  normalCDF as abTestNormalCDF,
  zScoreToPValue,
  SIGNIFICANCE_LEVELS,
  type ABTestInput,
  type ABTestResult,
} from './ab-test-calculator';

// P-Value Calculator
export {
  calculateZTestPValue,
  calculateTTestPValue,
  calculateChiSquarePValue,
  normalCDF,
  tDistributionCDF,
  TEST_TYPES,
  TAIL_TYPES,
  type ZTestInput,
  type TTestInput,
  type ChiSquareInput,
  type PValueResult,
  type TestType,
  type TailType,
} from './p-value-calculator';

// Correlation Calculator
export {
  calculateCorrelation,
  parsePairedData,
  type CorrelationInput,
  type CorrelationResult,
} from './correlation-calculator';

// Dice Probability Calculator
export {
  calculateDiceProbability,
  calculateDiceDistribution,
  probabilityOfAtLeastOne,
  probabilityOfAllSame,
  probabilityOfStraight,
  COMMON_DICE,
  COMPARISON_OPTIONS,
  type DiceProbabilityInput,
  type DiceProbabilityResult,
} from './dice-probability-calculator';
