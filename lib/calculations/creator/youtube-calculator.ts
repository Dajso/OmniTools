/**
 * YouTube Money Calculator
 * 
 * Estimates YouTube ad revenue based on view counts and CPM rates.
 * 
 * @module lib/calculations/creator/youtube-calculator
 * @see Requirements 18.6
 */

/**
 * YouTube earnings estimate input
 */
export interface YouTubeEstimateInput {
  views: number;
  cpmLow?: number;
  cpmHigh?: number;
}

/**
 * YouTube earnings estimate result
 */
export interface YouTubeEarnings {
  estimatedLow: number;
  estimatedHigh: number;
  estimatedAverage: number;
  views: number;
  cpmLow: number;
  cpmHigh: number;
}

/**
 * Default CPM ranges by content category
 */
export const CPM_RANGES: Record<string, { low: number; high: number; label: string }> = {
  general: { low: 0.25, high: 4.00, label: 'General Content' },
  gaming: { low: 1.00, high: 5.00, label: 'Gaming' },
  tech: { low: 2.00, high: 8.00, label: 'Technology' },
  finance: { low: 4.00, high: 12.00, label: 'Finance & Business' },
  education: { low: 2.00, high: 6.00, label: 'Education' },
  entertainment: { low: 1.00, high: 4.00, label: 'Entertainment' },
  lifestyle: { low: 1.50, high: 5.00, label: 'Lifestyle & Vlogs' },
  music: { low: 0.50, high: 3.00, label: 'Music' },
  howto: { low: 2.00, high: 7.00, label: 'How-To & DIY' },
  news: { low: 1.00, high: 4.00, label: 'News & Politics' },
};

/**
 * Default CPM values (industry average)
 */
export const DEFAULT_CPM_LOW = 0.25;
export const DEFAULT_CPM_HIGH = 4.00;

/**
 * Estimate YouTube earnings based on views and CPM
 * 
 * CPM (Cost Per Mille) is the amount advertisers pay per 1,000 ad impressions.
 * YouTube typically pays creators 55% of ad revenue.
 * 
 * Formula: Earnings = (Views / 1000) × CPM × 0.55
 * 
 * @param input - Views and optional CPM range
 * @returns Estimated earnings range
 */
export function estimateYouTubeEarnings(input: YouTubeEstimateInput): YouTubeEarnings {
  const { views, cpmLow = DEFAULT_CPM_LOW, cpmHigh = DEFAULT_CPM_HIGH } = input;

  if (views < 0) throw new Error('Views cannot be negative');
  if (cpmLow < 0) throw new Error('CPM cannot be negative');
  if (cpmHigh < 0) throw new Error('CPM cannot be negative');
  if (cpmLow > cpmHigh) throw new Error('Low CPM cannot be greater than high CPM');

  // YouTube creator share is approximately 55%
  const creatorShare = 0.55;
  
  const estimatedLow = (views / 1000) * cpmLow * creatorShare;
  const estimatedHigh = (views / 1000) * cpmHigh * creatorShare;
  const estimatedAverage = (estimatedLow + estimatedHigh) / 2;

  return {
    estimatedLow,
    estimatedHigh,
    estimatedAverage,
    views,
    cpmLow,
    cpmHigh,
  };
}

/**
 * Calculate views needed to reach a target earnings amount
 * 
 * @param targetEarnings - Target earnings in dollars
 * @param cpm - CPM rate to use for calculation
 * @returns Number of views needed
 */
export function calculateViewsForEarnings(targetEarnings: number, cpm: number): number {
  if (targetEarnings < 0) throw new Error('Target earnings cannot be negative');
  if (cpm <= 0) throw new Error('CPM must be positive');

  const creatorShare = 0.55;
  return Math.ceil((targetEarnings * 1000) / (cpm * creatorShare));
}

/**
 * Estimate monthly earnings based on daily views
 * 
 * @param dailyViews - Average daily views
 * @param cpmLow - Low CPM estimate
 * @param cpmHigh - High CPM estimate
 * @returns Monthly earnings estimate
 */
export function estimateMonthlyEarnings(
  dailyViews: number,
  cpmLow: number = DEFAULT_CPM_LOW,
  cpmHigh: number = DEFAULT_CPM_HIGH
): YouTubeEarnings {
  const monthlyViews = dailyViews * 30;
  return estimateYouTubeEarnings({
    views: monthlyViews,
    cpmLow,
    cpmHigh,
  });
}

/**
 * Estimate yearly earnings based on monthly views
 * 
 * @param monthlyViews - Average monthly views
 * @param cpmLow - Low CPM estimate
 * @param cpmHigh - High CPM estimate
 * @returns Yearly earnings estimate
 */
export function estimateYearlyEarnings(
  monthlyViews: number,
  cpmLow: number = DEFAULT_CPM_LOW,
  cpmHigh: number = DEFAULT_CPM_HIGH
): YouTubeEarnings {
  const yearlyViews = monthlyViews * 12;
  return estimateYouTubeEarnings({
    views: yearlyViews,
    cpmLow,
    cpmHigh,
  });
}

/**
 * Get CPM range for a content category
 * 
 * @param category - Content category key
 * @returns CPM range or default if category not found
 */
export function getCPMForCategory(category: string): { low: number; high: number } {
  const range = CPM_RANGES[category.toLowerCase()];
  return range || { low: DEFAULT_CPM_LOW, high: DEFAULT_CPM_HIGH };
}

/**
 * Format earnings for display
 * 
 * @param amount - Dollar amount
 * @returns Formatted string
 */
export function formatEarnings(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(2)}K`;
  }
  return `$${amount.toFixed(2)}`;
}

/**
 * Format view count for display
 * 
 * @param views - Number of views
 * @returns Formatted string
 */
export function formatViews(views: number): string {
  if (views >= 1000000000) {
    return `${(views / 1000000000).toFixed(2)}B`;
  }
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(2)}M`;
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
}
