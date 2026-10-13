/**
 * Instagram Engagement Rate Calculator
 * 
 * Calculates engagement rate and provides insights for Instagram accounts.
 * 
 * @module lib/calculations/creator/instagram-calculator
 * @see Requirements 18.7
 */

/**
 * Instagram post metrics
 */
export interface InstagramPostMetrics {
  likes: number;
  comments: number;
  shares?: number;
  saves?: number;
}

/**
 * Instagram account metrics
 */
export interface InstagramAccountMetrics {
  followers: number;
  posts: InstagramPostMetrics[];
}

/**
 * Engagement rate result
 */
export interface EngagementRateResult {
  engagementRate: number;
  totalEngagements: number;
  averageLikes: number;
  averageComments: number;
  averageShares: number;
  averageSaves: number;
  followers: number;
  postsAnalyzed: number;
  rating: EngagementRating;
}

/**
 * Engagement rating categories
 */
export type EngagementRating = 'excellent' | 'good' | 'average' | 'below_average' | 'low';

/**
 * Engagement rate thresholds
 */
export const ENGAGEMENT_THRESHOLDS: Record<EngagementRating, { min: number; max: number; label: string }> = {
  excellent: { min: 6, max: Infinity, label: 'Excellent' },
  good: { min: 3, max: 6, label: 'Good' },
  average: { min: 1, max: 3, label: 'Average' },
  below_average: { min: 0.5, max: 1, label: 'Below Average' },
  low: { min: 0, max: 0.5, label: 'Low' },
};

/**
 * Calculate engagement rate for Instagram account
 * 
 * Engagement Rate = (Total Engagements / Followers) × 100
 * 
 * Engagements include: likes, comments, shares, and saves
 * 
 * @param metrics - Account metrics including followers and post data
 * @returns Engagement rate result with insights
 */
export function calculateEngagementRate(metrics: InstagramAccountMetrics): EngagementRateResult {
  const { followers, posts } = metrics;

  if (followers <= 0) throw new Error('Followers must be positive');
  if (!posts || posts.length === 0) throw new Error('At least one post is required');

  // Validate post metrics
  posts.forEach((post, index) => {
    if (post.likes < 0) throw new Error(`Post ${index + 1}: Likes cannot be negative`);
    if (post.comments < 0) throw new Error(`Post ${index + 1}: Comments cannot be negative`);
    if (post.shares !== undefined && post.shares < 0) throw new Error(`Post ${index + 1}: Shares cannot be negative`);
    if (post.saves !== undefined && post.saves < 0) throw new Error(`Post ${index + 1}: Saves cannot be negative`);
  });

  // Calculate totals
  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.comments, 0);
  const totalShares = posts.reduce((sum, post) => sum + (post.shares || 0), 0);
  const totalSaves = posts.reduce((sum, post) => sum + (post.saves || 0), 0);
  
  const totalEngagements = totalLikes + totalComments + totalShares + totalSaves;
  const averageEngagements = totalEngagements / posts.length;
  
  // Engagement rate formula
  const engagementRate = (averageEngagements / followers) * 100;

  // Calculate averages
  const averageLikes = totalLikes / posts.length;
  const averageComments = totalComments / posts.length;
  const averageShares = totalShares / posts.length;
  const averageSaves = totalSaves / posts.length;

  // Determine rating
  const rating = getEngagementRating(engagementRate);

  return {
    engagementRate,
    totalEngagements,
    averageLikes,
    averageComments,
    averageShares,
    averageSaves,
    followers,
    postsAnalyzed: posts.length,
    rating,
  };
}

/**
 * Calculate engagement rate from single post
 * 
 * @param post - Post metrics
 * @param followers - Account followers
 * @returns Engagement rate percentage
 */
export function calculatePostEngagementRate(post: InstagramPostMetrics, followers: number): number {
  if (followers <= 0) throw new Error('Followers must be positive');

  const engagements = post.likes + post.comments + (post.shares || 0) + (post.saves || 0);
  return (engagements / followers) * 100;
}

/**
 * Get engagement rating based on rate percentage
 * 
 * @param rate - Engagement rate percentage
 * @returns Engagement rating
 */
export function getEngagementRating(rate: number): EngagementRating {
  if (rate >= ENGAGEMENT_THRESHOLDS.excellent.min) return 'excellent';
  if (rate >= ENGAGEMENT_THRESHOLDS.good.min) return 'good';
  if (rate >= ENGAGEMENT_THRESHOLDS.average.min) return 'average';
  if (rate >= ENGAGEMENT_THRESHOLDS.below_average.min) return 'below_average';
  return 'low';
}

/**
 * Get rating label
 * 
 * @param rating - Engagement rating
 * @returns Human-readable label
 */
export function getRatingLabel(rating: EngagementRating): string {
  return ENGAGEMENT_THRESHOLDS[rating].label;
}

/**
 * Calculate estimated reach based on engagement
 * 
 * @param followers - Account followers
 * @param engagementRate - Engagement rate percentage
 * @returns Estimated reach
 */
export function estimateReach(followers: number, engagementRate: number): number {
  // Typical reach is 10-30% of followers, adjusted by engagement
  const baseReachRate = 0.2; // 20% base reach
  const engagementMultiplier = 1 + (engagementRate / 100);
  return Math.round(followers * baseReachRate * engagementMultiplier);
}

/**
 * Calculate estimated impressions
 * 
 * @param followers - Account followers
 * @param engagementRate - Engagement rate percentage
 * @returns Estimated impressions
 */
export function estimateImpressions(followers: number, engagementRate: number): number {
  // Impressions typically 1.5-3x reach
  const reach = estimateReach(followers, engagementRate);
  const impressionMultiplier = 1.5 + (engagementRate / 100);
  return Math.round(reach * impressionMultiplier);
}

/**
 * Benchmark engagement rate by follower count
 * 
 * Smaller accounts typically have higher engagement rates
 */
export const FOLLOWER_BENCHMARKS: { min: number; max: number; avgRate: number; label: string }[] = [
  { min: 0, max: 1000, avgRate: 8.0, label: 'Nano (< 1K)' },
  { min: 1000, max: 10000, avgRate: 4.0, label: 'Micro (1K-10K)' },
  { min: 10000, max: 100000, avgRate: 2.4, label: 'Mid-tier (10K-100K)' },
  { min: 100000, max: 1000000, avgRate: 1.8, label: 'Macro (100K-1M)' },
  { min: 1000000, max: Infinity, avgRate: 1.5, label: 'Mega (1M+)' },
];

/**
 * Get benchmark for follower count
 * 
 * @param followers - Account followers
 * @returns Benchmark data
 */
export function getBenchmarkForFollowers(followers: number): typeof FOLLOWER_BENCHMARKS[0] {
  return FOLLOWER_BENCHMARKS.find(b => followers >= b.min && followers < b.max) || FOLLOWER_BENCHMARKS[0];
}

/**
 * Compare engagement rate to benchmark
 * 
 * @param engagementRate - Calculated engagement rate
 * @param followers - Account followers
 * @returns Comparison result
 */
export function compareToIndustryBenchmark(
  engagementRate: number,
  followers: number
): { benchmark: number; difference: number; percentDifference: number; isAboveBenchmark: boolean } {
  const benchmark = getBenchmarkForFollowers(followers);
  const difference = engagementRate - benchmark.avgRate;
  const percentDifference = (difference / benchmark.avgRate) * 100;

  return {
    benchmark: benchmark.avgRate,
    difference,
    percentDifference,
    isAboveBenchmark: difference > 0,
  };
}

/**
 * Format engagement rate for display
 * 
 * @param rate - Engagement rate percentage
 * @returns Formatted string
 */
export function formatEngagementRate(rate: number): string {
  return `${rate.toFixed(2)}%`;
}

/**
 * Format large numbers for display
 * 
 * @param num - Number to format
 * @returns Formatted string
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString('nb-NO');
}
