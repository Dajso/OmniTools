/**
 * Creator Economy Calculations
 * 
 * Tools for content creators and small business owners.
 * 
 * @module lib/calculations/creator
 */

export * from './invoice-generator';
export * from './wifi-qr-generator';
export * from './youtube-calculator';

// From instagram-calculator - excluding formatNumber to avoid conflicts
export {
    calculateEngagementRate,
    calculatePostEngagementRate,
    getEngagementRating,
    getRatingLabel,
    estimateReach,
    estimateImpressions,
    getBenchmarkForFollowers,
    compareToIndustryBenchmark,
    formatEngagementRate,
    ENGAGEMENT_THRESHOLDS,
    FOLLOWER_BENCHMARKS,
    type InstagramPostMetrics,
    type InstagramAccountMetrics,
    type EngagementRateResult,
    type EngagementRating,
} from './instagram-calculator';

// From cpm-calculator - excluding formatNumber to avoid conflicts
export {
    calculateCPM,
    calculateTotalCost,
    calculateImpressions,
    calculateCPC,
    calculateCTR,
    calculateAllMetrics,
    getPlatformCPM,
    compareToPlatformAverage,
    calculateECPM,
    formatCurrency,
    formatPercentage,
    PLATFORM_CPM_AVERAGES,
    type CPMInput,
    type CPMResult,
    type AdvertisingMetrics,
} from './cpm-calculator';
