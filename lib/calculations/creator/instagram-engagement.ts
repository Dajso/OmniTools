/**
 * Instagram Engagement Rate Calculator
 * Calculates engagement rate based on followers, likes, comments, and other metrics
 */

export interface InstagramEngagementInput {
  followers: number;
  likes: number;
  comments: number;
  shares?: number;
  saves?: number;
  posts?: number; // Number of posts to average over
}

export interface InstagramEngagementResult {
  engagementRate: number;
  totalEngagements: number;
  averageEngagementsPerPost: number;
  rating: EngagementRating;
  benchmarkComparison: string;
}

export type EngagementRating = 'excellent' | 'good' | 'average' | 'below_average' | 'low';

// Industry benchmarks for Instagram engagement rates
export const ENGAGEMENT_BENCHMARKS = {
  excellent: { min: 6, label: 'Excellent', description: 'Top-tier engagement, highly engaged audience' },
  good: { min: 3, label: 'Good', description: 'Above average engagement' },
  average: { min: 1, label: 'Average', description: 'Typical engagement rate' },
  below_average: { min: 0.5, label: 'Below Average', description: 'Room for improvement' },
  low: { min: 0, label: 'Low', description: 'Consider strategies to boost engagement' },
} as const;

// Follower tier benchmarks (engagement typically decreases with more followers)
export const FOLLOWER_TIER_BENCHMARKS: Record<string, { min: number; max: number; avgEngagement: number; label: string }> = {
  nano: { min: 0, max: 10000, avgEngagement: 4.0, label: 'Nano (0-10K)' },
  micro: { min: 10000, max: 100000, avgEngagement: 2.4, label: 'Micro (10K-100K)' },
  mid: { min: 100000, max: 500000, avgEngagement: 1.8, label: 'Mid-tier (100K-500K)' },
  macro: { min: 500000, max: 1000000, avgEngagement: 1.5, label: 'Macro (500K-1M)' },
  mega: { min: 1000000, max: Infinity, avgEngagement: 1.2, label: 'Mega (1M+)' },
};

/**
 * Calculate Instagram engagement rate
 * Formula: ((likes + comments + shares + saves) / followers) * 100
 */
export function calculateEngagementRate(input: InstagramEngagementInput): InstagramEngagementResult {
  const { followers, likes, comments, shares = 0, saves = 0, posts = 1 } = input;

  if (followers <= 0) {
    throw new Error('Followers must be greater than 0');
  }

  if (posts <= 0) {
    throw new Error('Posts must be greater than 0');
  }

  const totalEngagements = likes + comments + shares + saves;
  const averageEngagementsPerPost = totalEngagements / posts;
  const engagementRate = (averageEngagementsPerPost / followers) * 100;

  const rating = getEngagementRating(engagementRate);
  const benchmarkComparison = getBenchmarkComparison(engagementRate, followers);

  return {
    engagementRate,
    totalEngagements,
    averageEngagementsPerPost,
    rating,
    benchmarkComparison,
  };
}

/**
 * Get engagement rating based on percentage
 */
export function getEngagementRating(rate: number): EngagementRating {
  if (rate >= ENGAGEMENT_BENCHMARKS.excellent.min) return 'excellent';
  if (rate >= ENGAGEMENT_BENCHMARKS.good.min) return 'good';
  if (rate >= ENGAGEMENT_BENCHMARKS.average.min) return 'average';
  if (rate >= ENGAGEMENT_BENCHMARKS.below_average.min) return 'below_average';
  return 'low';
}

/**
 * Get follower tier based on count
 */
export function getFollowerTier(followers: number): string {
  for (const [tier, data] of Object.entries(FOLLOWER_TIER_BENCHMARKS)) {
    if (followers >= data.min && followers < data.max) {
      return tier;
    }
  }
  return 'mega';
}

/**
 * Compare engagement rate to industry benchmarks for follower tier
 */
export function getBenchmarkComparison(rate: number, followers: number): string {
  const tier = getFollowerTier(followers);
  const tierData = FOLLOWER_TIER_BENCHMARKS[tier];
  const avgForTier = tierData.avgEngagement;

  const percentDiff = ((rate - avgForTier) / avgForTier) * 100;

  if (percentDiff > 50) {
    return `${Math.abs(percentDiff).toFixed(0)}% above average for ${tierData.label} accounts`;
  } else if (percentDiff > 0) {
    return `${Math.abs(percentDiff).toFixed(0)}% above average for ${tierData.label} accounts`;
  } else if (percentDiff > -20) {
    return `Close to average for ${tierData.label} accounts`;
  } else {
    return `${Math.abs(percentDiff).toFixed(0)}% below average for ${tierData.label} accounts`;
  }
}

/**
 * Calculate estimated reach based on engagement
 */
export function estimateReach(followers: number, engagementRate: number): number {
  // Instagram typically shows posts to 10-30% of followers initially
  // Higher engagement leads to more reach
  const baseReachPercent = 0.15;
  const engagementBonus = Math.min(engagementRate / 100, 0.15);
  return Math.round(followers * (baseReachPercent + engagementBonus));
}

/**
 * Format engagement rate for display
 */
export function formatEngagementRate(rate: number): string {
  return `${rate.toFixed(2)}%`;
}

/**
 * Format large numbers with K/M suffixes
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
