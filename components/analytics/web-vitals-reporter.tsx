'use client';

/**
 * Web Vitals Reporter Component
 * 
 * Client component that initializes Web Vitals monitoring.
 * Should be included in the root layout for performance tracking.
 * 
 * @see Requirements 13.1 - Lighthouse performance score of 90+
 * @module components/analytics/web-vitals-reporter
 */

import { useEffect } from 'react';
import { initWebVitals } from '@/lib/utils/performance';

/**
 * WebVitalsReporter Component
 * 
 * Initializes Web Vitals monitoring when the component mounts.
 * Reports metrics to console in development and analytics in production.
 * 
 * @example
 * // In app/layout.tsx
 * <WebVitalsReporter />
 */
export function WebVitalsReporter() {
  useEffect(() => {
    // Initialize Web Vitals monitoring
    initWebVitals();
  }, []);

  // This component doesn't render anything
  return null;
}

export default WebVitalsReporter;
