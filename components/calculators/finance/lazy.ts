/**
 * Lazy-loaded Finance Calculator Components
 * 
 * These exports use dynamic imports to enable code splitting,
 * reducing the initial bundle size for pages that don't use these calculators.
 * 
 * @see Requirements 13.4 - Use dynamic imports to split JavaScript bundles by route
 * @module components/calculators/finance/lazy
 */

import { lazyCalculator } from '@/lib/utils/lazy-components';

// Lazy-loaded finance calculators
export const LazyMortgageCalculator = lazyCalculator(
  () => import('./mortgage-calculator').then(mod => ({ default: mod.MortgageCalculator }))
);

export const LazyCompoundInterestCalculator = lazyCalculator(
  () => import('./compound-interest-calculator').then(mod => ({ default: mod.CompoundInterestCalculator }))
);

export const LazyTipCalculator = lazyCalculator(
  () => import('./tip-calculator').then(mod => ({ default: mod.TipCalculator }))
);

export const LazyROICalculator = lazyCalculator(
  () => import('./roi-calculator').then(mod => ({ default: mod.ROICalculator }))
);

export const LazySalesTaxCalculator = lazyCalculator(
  () => import('./sales-tax-calculator').then(mod => ({ default: mod.SalesTaxCalculator }))
);

export const LazyDiscountCalculator = lazyCalculator(
  () => import('./discount-calculator').then(mod => ({ default: mod.DiscountCalculator }))
);

export const LazyHourlySalaryCalculator = lazyCalculator(
  () => import('./hourly-salary-calculator').then(mod => ({ default: mod.HourlySalaryCalculator }))
);

export const LazyInflationCalculator = lazyCalculator(
  () => import('./inflation-calculator').then(mod => ({ default: mod.InflationCalculator }))
);
