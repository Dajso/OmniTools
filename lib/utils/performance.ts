/**
 * Performance Monitoring Utilities
 * 
 * Utilities for monitoring and reporting web performance metrics.
 * Helps track Core Web Vitals and other performance indicators.
 * 
 * @see Requirements 13.1 - Lighthouse performance score of 90+
 * @module lib/utils/performance
 */

/**
 * Web Vitals metric types
 */
export type MetricName = 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB';

/**
 * Performance metric data
 */
export interface PerformanceMetric {
  name: MetricName;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

/**
 * Thresholds for Core Web Vitals (in milliseconds or unitless for CLS)
 */
export const WEB_VITALS_THRESHOLDS: Record<MetricName, { good: number; poor: number }> = {
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  FID: { good: 100, poor: 300 },
  INP: { good: 200, poor: 500 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
};

/**
 * Get rating for a metric value
 */
export function getMetricRating(
  name: MetricName,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = WEB_VITALS_THRESHOLDS[name];
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Report Web Vitals to analytics
 * 
 * @param metric - The performance metric to report
 * @param analyticsId - Optional analytics ID for tracking
 */
export function reportWebVitals(
  metric: PerformanceMetric,
  analyticsId?: string
): void {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    const color = metric.rating === 'good' 
      ? '\x1b[32m' // green
      : metric.rating === 'needs-improvement'
      ? '\x1b[33m' // yellow
      : '\x1b[31m'; // red
    
    console.log(
      `${color}[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})\x1b[0m`
    );
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production' && analyticsId) {
    // Example: Send to Google Analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      });
    }
  }
}

/**
 * Initialize Web Vitals monitoring
 * 
 * Call this in your app's entry point to start monitoring performance.
 * 
 * @example
 * // In app/layout.tsx or a client component
 * useEffect(() => {
 *   initWebVitals();
 * }, []);
 */
export async function initWebVitals(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    // Dynamically import web-vitals to avoid bundling if not used
    const { onCLS, onFCP, onFID, onINP, onLCP, onTTFB } = await import('web-vitals');

    const handleMetric = (metric: any) => {
      const performanceMetric: PerformanceMetric = {
        name: metric.name as MetricName,
        value: metric.value,
        rating: getMetricRating(metric.name as MetricName, metric.value),
        delta: metric.delta,
        id: metric.id,
      };
      reportWebVitals(performanceMetric);
    };

    onCLS(handleMetric);
    onFCP(handleMetric);
    onFID(handleMetric);
    onINP(handleMetric);
    onLCP(handleMetric);
    onTTFB(handleMetric);
  } catch (error) {
    // web-vitals not available, skip monitoring
    console.warn('Web Vitals monitoring not available');
  }
}

/**
 * Measure component render time
 * 
 * @param componentName - Name of the component being measured
 * @returns Object with start and end functions
 * 
 * @example
 * const measure = measureRender('MortgageCalculator');
 * measure.start();
 * // ... render component
 * measure.end();
 */
export function measureRender(componentName: string) {
  let startTime: number;

  return {
    start: () => {
      if (typeof performance !== 'undefined') {
        startTime = performance.now();
      }
    },
    end: () => {
      if (typeof performance !== 'undefined' && startTime) {
        const duration = performance.now() - startTime;
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Render] ${componentName}: ${duration.toFixed(2)}ms`);
        }
        return duration;
      }
      return 0;
    },
  };
}

/**
 * Check if the page is being prerendered
 */
export function isPrerendering(): boolean {
  if (typeof document === 'undefined') return true;
  // 'prerender' is deprecated, check for hidden state instead
  return document.visibilityState === 'hidden';
}

/**
 * Defer non-critical work until the browser is idle
 * 
 * @param callback - Function to execute when idle
 * @param timeout - Maximum time to wait before executing (default: 2000ms)
 */
export function whenIdle(callback: () => void, timeout = 2000): void {
  if (typeof window === 'undefined') return;

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback, { timeout });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(callback, 1);
  }
}

/**
 * Prefetch a page for faster navigation
 * 
 * @param href - URL to prefetch
 */
export function prefetchPage(href: string): void {
  if (typeof document === 'undefined') return;

  // Check if already prefetched
  const existing = document.querySelector(`link[rel="prefetch"][href="${href}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}
