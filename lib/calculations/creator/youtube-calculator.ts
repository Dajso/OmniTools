/**
 * YouTube Money Calculator
 * 
 * Estimates YouTube ad revenue based on view counts and CPM rates.
 * 
 * @module lib/calculations/creator/youtube-calculator
 * @see Requirements 18.6
 */

import { formatCompact, formatNumber as formatNb, formatFixed } from '@/lib/utils/formatting';

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
  general: { low: 2.5, high: 40, label: 'Generelt innhold' },
  gaming: { low: 10, high: 50, label: 'Gaming' },
  tech: { low: 20, high: 80, label: 'Teknologi' },
  finance: { low: 40, high: 120, label: 'Økonomi og business' },
  education: { low: 20, high: 60, label: 'Utdanning' },
  entertainment: { low: 10, high: 40, label: 'Underholdning' },
  lifestyle: { low: 15, high: 50, label: 'Livsstil og vlogg' },
  music: { low: 5, high: 30, label: 'Musikk' },
  howto: { low: 20, high: 70, label: 'Veiledninger og gjør-det-selv' },
  news: { low: 10, high: 40, label: 'Nyheter og politikk' },
};

/**
 * Default CPM values (industry average)
 */
export const DEFAULT_CPM_LOW = 2.5;
export const DEFAULT_CPM_HIGH = 40;

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

  if (views < 0) throw new Error('Antall visninger kan ikke være negativt');
  if (cpmLow < 0) throw new Error('CPM kan ikke være negativ');
  if (cpmHigh < 0) throw new Error('CPM kan ikke være negativ');
  if (cpmLow > cpmHigh) throw new Error('Laveste CPM kan ikke være høyere enn høyeste CPM');

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
  if (targetEarnings < 0) throw new Error('Ønsket inntekt kan ikke være negativ');
  if (cpm <= 0) throw new Error('CPM må være større enn 0');

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
 * Formaterer inntekt til visning
 *
 * @param amount - Beløp i kroner
 * @returns For eksempel «1 234 kr» eller «1,23 mill. kr»
 */
export function formatEarnings(amount: number): string {
  if (amount >= 1000000) {
    return `${formatFixed(amount / 1000000, 2)}\u00A0mill.\u00A0kr`;
  }
  return `${formatNb(amount, { minimumFractionDigits: amount >= 1000 ? 0 : 2, maximumFractionDigits: amount >= 1000 ? 0 : 2 })}\u00A0kr`;
}

/**
 * Formaterer antall visninger til visning
 *
 * @param views - Antall visninger
 */
export function formatViews(views: number): string {
  return formatCompact(views, views >= 1000000 ? 2 : 1);
}
