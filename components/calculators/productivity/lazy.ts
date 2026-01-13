/**
 * Lazy-loaded Productivity Calculator Components
 * 
 * These exports use dynamic imports to enable code splitting,
 * reducing the initial bundle size for pages that don't use these calculators.
 * 
 * @see Requirements 13.4 - Use dynamic imports to split JavaScript bundles by route
 * @module components/calculators/productivity/lazy
 */

import { lazyCalculator } from '@/lib/utils/lazy-components';

// Lazy-loaded productivity calculators
export const LazyWordCounter = lazyCalculator(
  () => import('./word-counter').then(mod => ({ default: mod.WordCounter }))
);

export const LazyPasswordGenerator = lazyCalculator(
  () => import('./password-generator').then(mod => ({ default: mod.PasswordGenerator }))
);

export const LazyCharacterCounter = lazyCalculator(
  () => import('./character-counter').then(mod => ({ default: mod.CharacterCounter }))
);

export const LazyRandomNumberGenerator = lazyCalculator(
  () => import('./random-number-generator').then(mod => ({ default: mod.RandomNumberGenerator }))
);

export const LazyUUIDGenerator = lazyCalculator(
  () => import('./uuid-generator').then(mod => ({ default: mod.UUIDGenerator }))
);

export const LazyLoremIpsumGenerator = lazyCalculator(
  () => import('./lorem-ipsum-generator').then(mod => ({ default: mod.LoremIpsumGenerator }))
);

export const LazyCaseConverter = lazyCalculator(
  () => import('./case-converter').then(mod => ({ default: mod.CaseConverter }))
);

export const LazyTextToBinaryConverter = lazyCalculator(
  () => import('./text-to-binary').then(mod => ({ default: mod.TextToBinaryConverter }))
);

export const LazyHexToRgbConverter = lazyCalculator(
  () => import('./hex-to-rgb').then(mod => ({ default: mod.HexToRgbConverter }))
);

export const LazyTimestampConverter = lazyCalculator(
  () => import('./timestamp-converter').then(mod => ({ default: mod.TimestampConverter }))
);

export const LazyPercentageCalculator = lazyCalculator(
  () => import('./percentage-calculator').then(mod => ({ default: mod.PercentageCalculator }))
);

export const LazyAgeCalculator = lazyCalculator(
  () => import('./age-calculator').then(mod => ({ default: mod.AgeCalculator }))
);

export const LazyDateDifferenceCalculator = lazyCalculator(
  () => import('./date-difference').then(mod => ({ default: mod.DateDifferenceCalculator }))
);

export const LazyTimezoneConverter = lazyCalculator(
  () => import('./timezone-converter').then(mod => ({ default: mod.TimezoneConverter }))
);

export const LazyGPACalculator = lazyCalculator(
  () => import('./gpa-calculator').then(mod => ({ default: mod.GPACalculator }))
);

export const LazyGradeCalculator = lazyCalculator(
  () => import('./grade-calculator').then(mod => ({ default: mod.GradeCalculator }))
);

export const LazyAspectRatioCalculator = lazyCalculator(
  () => import('./aspect-ratio-calculator').then(mod => ({ default: mod.AspectRatioCalculator }))
);

export const LazyImageResolutionCalculator = lazyCalculator(
  () => import('./image-resolution-calculator').then(mod => ({ default: mod.ImageResolutionCalculator }))
);

export const LazyJSONFormatter = lazyCalculator(
  () => import('./json-formatter').then(mod => ({ default: mod.JSONFormatter }))
);

export const LazyBase64Converter = lazyCalculator(
  () => import('./base64-converter').then(mod => ({ default: mod.Base64Converter }))
);
