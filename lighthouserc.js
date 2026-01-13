/**
 * Lighthouse CI Configuration
 * 
 * Configuration for running Lighthouse audits in CI/CD pipelines.
 * Targets 90+ performance score as per Requirements 13.1.
 * 
 * Usage:
 * - Install: npm install -g @lhci/cli
 * - Run: lhci autorun
 * 
 * @see Requirements 13.1 - Lighthouse performance score of 90+
 */

module.exports = {
  ci: {
    collect: {
      // URLs to audit
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/calculators/finance/mortgage-calculator',
        'http://localhost:3000/calculators/health/bmi-calculator',
        'http://localhost:3000/convert/kg-to-lbs',
      ],
      // Number of runs per URL for more accurate results
      numberOfRuns: 3,
      // Start server command
      startServerCommand: 'npm run start',
      // Wait for server to be ready
      startServerReadyPattern: 'ready on',
      startServerReadyTimeout: 30000,
      // Lighthouse settings
      settings: {
        // Use mobile emulation (default)
        preset: 'desktop',
        // Throttling settings for realistic conditions
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      // Assertion configuration
      assertions: {
        // Performance assertions
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],

        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 200 }],
        'speed-index': ['warn', { maxNumericValue: 3400 }],

        // Accessibility assertions
        'color-contrast': 'error',
        'document-title': 'error',
        'html-has-lang': 'error',
        'meta-description': 'error',
        'link-name': 'error',
        'button-name': 'error',
        'image-alt': 'error',
        'label': 'error',

        // Best practices
        'uses-https': 'off', // Disabled for localhost
        'is-on-https': 'off', // Disabled for localhost
        'no-vulnerable-libraries': 'warn',
        'js-libraries': 'off',

        // SEO assertions
        'viewport': 'error',
        'robots-txt': 'off', // May not exist in dev
        'canonical': 'warn',
        'structured-data': 'off', // Custom validation needed
      },
    },
    upload: {
      // Upload results to temporary public storage
      target: 'temporary-public-storage',
    },
  },
};
