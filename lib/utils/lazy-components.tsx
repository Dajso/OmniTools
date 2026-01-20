'use client';

/**
 * Lazy Loading Utilities for Code Splitting
 * 
 * Provides utilities for dynamically importing calculator components
 * to reduce initial bundle size and improve performance.
 * 
 * @see Requirements 13.4 - Use dynamic imports to split JavaScript bundles by route
 * @module lib/utils/lazy-components
 */

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

/**
 * Skeleton loader component for calculators
 * Displays a loading placeholder while the calculator chunk loads
 */
export function CalculatorSkeleton() {
  return (
    <div
      className="animate-pulse space-y-4 p-6 border rounded-lg"
      role="status"
      aria-label="Loading calculator"
    >
      {/* Title skeleton */}
      <div className="h-6 bg-gray-200 rounded w-1/3" />

      {/* Input fields skeleton */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>

      {/* Button skeleton */}
      <div className="flex gap-2 pt-2">
        <div className="h-10 bg-gray-200 rounded w-24" />
        <div className="h-10 bg-gray-200 rounded w-20" />
      </div>

      {/* Results skeleton */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-6 bg-gray-200 rounded w-1/2" />
      </div>

      <span className="sr-only">Loading calculator, please wait...</span>
    </div>
  );
}

/**
 * Skeleton loader for content sections (FAQ, How-To)
 */
export function ContentSkeleton() {
  return (
    <div
      className="animate-pulse space-y-4"
      role="status"
      aria-label="Loading content"
    >
      <div className="h-6 bg-gray-200 rounded w-1/4" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
      <span className="sr-only">Loading content, please wait...</span>
    </div>
  );
}

/**
 * Creates a lazy-loaded calculator component with consistent loading behavior
 * 
 * @param importFn - Dynamic import function for the calculator component
 * @returns Lazy-loaded component with skeleton loader
 * 
 * @example
 * const LazyMortgageCalculator = lazyCalculator(
 *   () => import('@/components/calculators/finance/mortgage-calculator')
 * );
 */
export function lazyCalculator(
  importFn: () => Promise<{ default: ComponentType<any> }>
) {
  return dynamic(importFn, {
    loading: () => <CalculatorSkeleton />,
    ssr: true, // Enable SSR for SEO
  });
}

/**
 * Creates a lazy-loaded content component (for below-the-fold content)
 * 
 * @param importFn - Dynamic import function for the content component
 * @returns Lazy-loaded component with content skeleton
 */
export function lazyContent(
  importFn: () => Promise<{ default: ComponentType<any> }>
) {
  return dynamic(importFn, {
    loading: () => <ContentSkeleton />,
    ssr: true,
  });
}

/**
 * Creates a lazy-loaded component that only loads on client side
 * Use for components that don't need SSR (e.g., interactive charts)
 * 
 * @param importFn - Dynamic import function for the component
 * @returns Client-only lazy-loaded component
 */
export function lazyClientOnly(
  importFn: () => Promise<{ default: ComponentType<any> }>
) {
  return dynamic(importFn, {
    loading: () => <CalculatorSkeleton />,
    ssr: false, // Disable SSR for client-only components
  });
}
