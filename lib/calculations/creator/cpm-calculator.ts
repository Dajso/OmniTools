/**
 * CPM Calculator
 * 
 * Calculates Cost Per Mille (cost per thousand impressions) for advertising.
 * 
 * @module lib/calculations/creator/cpm-calculator
 * @see Requirements 18.10
 */

/**
 * CPM calculation input
 */
export interface CPMInput {
  totalCost: number;
  impressions: number;
}

/**
 * CPM calculation result
 */
export interface CPMResult {
  cpm: number;
  totalCost: number;
  impressions: number;
  costPerImpression: number;
}

/**
 * Calculate CPM (Cost Per Mille)
 * 
 * CPM = (Total Cost / Impressions) × 1000
 * 
 * @param input - Total cost and impressions
 * @returns CPM calculation result
 */
export function calculateCPM(input: CPMInput): CPMResult {
  const { totalCost, impressions } = input;

  if (totalCost < 0) throw new Error('Total cost cannot be negative');
  if (impressions <= 0) throw new Error('Impressions must be positive');

  const cpm = (totalCost / impressions) * 1000;
  const costPerImpression = totalCost / impressions;

  return {
    cpm,
    totalCost,
    impressions,
    costPerImpression,
  };
}

/**
 * Calculate total cost from CPM and impressions
 * 
 * Total Cost = (CPM × Impressions) / 1000
 * 
 * @param cpm - Cost per thousand impressions
 * @param impressions - Number of impressions
 * @returns Total cost
 */
export function calculateTotalCost(cpm: number, impressions: number): number {
  if (cpm < 0) throw new Error('CPM cannot be negative');
  if (impressions < 0) throw new Error('Impressions cannot be negative');

  return (cpm * impressions) / 1000;
}

/**
 * Calculate impressions from CPM and budget
 * 
 * Impressions = (Budget × 1000) / CPM
 * 
 * @param cpm - Cost per thousand impressions
 * @param budget - Available budget
 * @returns Number of impressions
 */
export function calculateImpressions(cpm: number, budget: number): number {
  if (cpm <= 0) throw new Error('CPM must be positive');
  if (budget < 0) throw new Error('Budget cannot be negative');

  return Math.floor((budget * 1000) / cpm);
}

/**
 * Related advertising metrics
 */
export interface AdvertisingMetrics {
  cpm: number;
  cpc: number;
  ctr: number;
  impressions: number;
  clicks: number;
  totalCost: number;
}

/**
 * Calculate CPC (Cost Per Click)
 * 
 * CPC = Total Cost / Clicks
 * 
 * @param totalCost - Total advertising cost
 * @param clicks - Number of clicks
 * @returns Cost per click
 */
export function calculateCPC(totalCost: number, clicks: number): number {
  if (totalCost < 0) throw new Error('Total cost cannot be negative');
  if (clicks <= 0) throw new Error('Clicks must be positive');

  return totalCost / clicks;
}

/**
 * Calculate CTR (Click-Through Rate)
 * 
 * CTR = (Clicks / Impressions) × 100
 * 
 * @param clicks - Number of clicks
 * @param impressions - Number of impressions
 * @returns Click-through rate percentage
 */
export function calculateCTR(clicks: number, impressions: number): number {
  if (clicks < 0) throw new Error('Clicks cannot be negative');
  if (impressions <= 0) throw new Error('Impressions must be positive');

  return (clicks / impressions) * 100;
}

/**
 * Calculate all advertising metrics
 * 
 * @param totalCost - Total advertising cost
 * @param impressions - Number of impressions
 * @param clicks - Number of clicks
 * @returns Complete advertising metrics
 */
export function calculateAllMetrics(
  totalCost: number,
  impressions: number,
  clicks: number
): AdvertisingMetrics {
  if (totalCost < 0) throw new Error('Total cost cannot be negative');
  if (impressions <= 0) throw new Error('Impressions must be positive');
  if (clicks < 0) throw new Error('Clicks cannot be negative');
  if (clicks > impressions) throw new Error('Clicks cannot exceed impressions');

  const cpm = (totalCost / impressions) * 1000;
  const cpc = clicks > 0 ? totalCost / clicks : 0;
  const ctr = (clicks / impressions) * 100;

  return {
    cpm,
    cpc,
    ctr,
    impressions,
    clicks,
    totalCost,
  };
}

/**
 * Industry average CPM rates by platform
 */
export const PLATFORM_CPM_AVERAGES: Record<string, { low: number; high: number; label: string }> = {
  facebook: { low: 5.00, high: 15.00, label: 'Facebook' },
  instagram: { low: 5.00, high: 12.00, label: 'Instagram' },
  youtube: { low: 4.00, high: 10.00, label: 'YouTube' },
  tiktok: { low: 1.00, high: 5.00, label: 'TikTok' },
  twitter: { low: 6.00, high: 12.00, label: 'Twitter/X' },
  linkedin: { low: 8.00, high: 25.00, label: 'LinkedIn' },
  google_display: { low: 2.00, high: 5.00, label: 'Google Display' },
  google_search: { low: 10.00, high: 50.00, label: 'Google Search' },
  programmatic: { low: 0.50, high: 3.00, label: 'Programmatic' },
  podcast: { low: 15.00, high: 30.00, label: 'Podcast' },
};

/**
 * Get CPM range for a platform
 * 
 * @param platform - Platform key
 * @returns CPM range or null if not found
 */
export function getPlatformCPM(platform: string): { low: number; high: number; label: string } | null {
  return PLATFORM_CPM_AVERAGES[platform.toLowerCase()] || null;
}

/**
 * Compare CPM to industry average
 * 
 * @param cpm - Calculated CPM
 * @param platform - Platform to compare against
 * @returns Comparison result
 */
export function compareToPlatformAverage(
  cpm: number,
  platform: string
): { average: number; difference: number; isAboveAverage: boolean } | null {
  const platformData = getPlatformCPM(platform);
  if (!platformData) return null;

  const average = (platformData.low + platformData.high) / 2;
  const difference = cpm - average;

  return {
    average,
    difference,
    isAboveAverage: difference > 0,
  };
}

/**
 * Calculate effective CPM (eCPM) for revenue
 * 
 * eCPM = (Total Revenue / Impressions) × 1000
 * 
 * @param revenue - Total revenue earned
 * @param impressions - Number of impressions
 * @returns Effective CPM
 */
export function calculateECPM(revenue: number, impressions: number): number {
  if (revenue < 0) throw new Error('Revenue cannot be negative');
  if (impressions <= 0) throw new Error('Impressions must be positive');

  return (revenue / impressions) * 1000;
}

/**
 * Format currency for display
 * 
 * @param amount - Dollar amount
 * @returns Formatted string
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Format large numbers for display
 * 
 * @param num - Number to format
 * @returns Formatted string
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString('nb-NO');
}

/**
 * Format percentage for display
 * 
 * @param percent - Percentage value
 * @returns Formatted string
 */
export function formatPercentage(percent: number): string {
  return `${percent.toFixed(2)}%`;
}
