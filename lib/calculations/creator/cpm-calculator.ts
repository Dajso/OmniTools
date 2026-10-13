/**
 * CPM Calculator
 * 
 * Calculates Cost Per Mille (cost per thousand impressions) for advertising.
 * 
 * @module lib/calculations/creator/cpm-calculator
 * @see Requirements 18.10
 */

import { formatCompact, formatNumber as formatNb, formatFixed } from '@/lib/utils/formatting';

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

  if (totalCost < 0) throw new Error('Totalkostnaden kan ikke være negativ');
  if (impressions <= 0) throw new Error('Antall visninger må være større enn 0');

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
  if (cpm < 0) throw new Error('CPM kan ikke være negativ');
  if (impressions < 0) throw new Error('Antall visninger kan ikke være negativt');

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
  if (cpm <= 0) throw new Error('CPM må være større enn 0');
  if (budget < 0) throw new Error('Budsjettet kan ikke være negativt');

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
  if (totalCost < 0) throw new Error('Totalkostnaden kan ikke være negativ');
  if (clicks <= 0) throw new Error('Antall klikk må være større enn 0');

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
  if (clicks < 0) throw new Error('Antall klikk kan ikke være negativt');
  if (impressions <= 0) throw new Error('Antall visninger må være større enn 0');

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
  if (totalCost < 0) throw new Error('Totalkostnaden kan ikke være negativ');
  if (impressions <= 0) throw new Error('Antall visninger må være større enn 0');
  if (clicks < 0) throw new Error('Antall klikk kan ikke være negativt');
  if (clicks > impressions) throw new Error('Antall klikk kan ikke være større enn antall visninger');

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
/** Veiledende gjennomsnittlig CPM i kroner (omregnet fra internasjonale tall, varierer mye) */
export const PLATFORM_CPM_AVERAGES: Record<string, { low: number; high: number; label: string }> = {
  facebook: { low: 50, high: 150, label: 'Facebook' },
  instagram: { low: 50, high: 120, label: 'Instagram' },
  youtube: { low: 40, high: 100, label: 'YouTube' },
  tiktok: { low: 10, high: 50, label: 'TikTok' },
  twitter: { low: 60, high: 120, label: 'Twitter/X' },
  linkedin: { low: 80, high: 250, label: 'LinkedIn' },
  google_display: { low: 20, high: 50, label: 'Google Display' },
  google_search: { low: 100, high: 500, label: 'Google Search' },
  programmatic: { low: 5, high: 30, label: 'Programmatic' },
  podcast: { low: 150, high: 300, label: 'Podcast' },
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
  if (revenue < 0) throw new Error('Inntekten kan ikke være negativ');
  if (impressions <= 0) throw new Error('Antall visninger må være større enn 0');

  return (revenue / impressions) * 1000;
}

/**
 * Formaterer beløp i kroner til visning (uten valutategn): «1 234,50»
 *
 * @param amount - Beløp i kroner
 */
export function formatCurrency(amount: number): string {
  return formatNb(amount, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Formaterer store tall til visning («1,2 mill.»)
 */
export function formatNumber(num: number): string {
  return formatCompact(num, num >= 1000000 ? 2 : 1);
}

/**
 * Formaterer prosent til visning («2,35 %»)
 */
export function formatPercentage(percent: number): string {
  return `${formatFixed(percent, 2)}\u00A0%`;
}
