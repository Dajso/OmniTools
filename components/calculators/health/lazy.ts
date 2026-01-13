/**
 * Lazy-loaded Health Calculator Components
 * 
 * These exports use dynamic imports to enable code splitting,
 * reducing the initial bundle size for pages that don't use these calculators.
 * 
 * @see Requirements 13.4 - Use dynamic imports to split JavaScript bundles by route
 * @module components/calculators/health/lazy
 */

import { lazyCalculator } from '@/lib/utils/lazy-components';

// Lazy-loaded health calculators
export const LazyBMICalculator = lazyCalculator(
  () => import('./bmi-calculator').then(mod => ({ default: mod.BMICalculator }))
);

export const LazyTDEECalculator = lazyCalculator(
  () => import('./tdee-calculator').then(mod => ({ default: mod.TDEECalculator }))
);

export const LazyMacroCalculator = lazyCalculator(
  () => import('./macro-calculator').then(mod => ({ default: mod.MacroCalculator }))
);

export const LazyIntermittentFastingCalculator = lazyCalculator(
  () => import('./intermittent-fasting-calculator').then(mod => ({ default: mod.IntermittentFastingCalculator }))
);

export const LazyOneRepMaxCalculator = lazyCalculator(
  () => import('./one-rep-max-calculator').then(mod => ({ default: mod.OneRepMaxCalculator }))
);

export const LazyWaterIntakeCalculator = lazyCalculator(
  () => import('./water-intake-calculator').then(mod => ({ default: mod.WaterIntakeCalculator }))
);

export const LazyDueDateCalculator = lazyCalculator(
  () => import('./due-date-calculator').then(mod => ({ default: mod.DueDateCalculator }))
);

export const LazyOvulationCalculator = lazyCalculator(
  () => import('./ovulation-calculator').then(mod => ({ default: mod.OvulationCalculator }))
);

export const LazyBACCalculator = lazyCalculator(
  () => import('./bac-calculator').then(mod => ({ default: mod.BACCalculator }))
);

export const LazyPaceCalculator = lazyCalculator(
  () => import('./pace-calculator').then(mod => ({ default: mod.PaceCalculator }))
);

export const LazyBodyFatCalculator = lazyCalculator(
  () => import('./body-fat-calculator').then(mod => ({ default: mod.BodyFatCalculator }))
);

export const LazySleepCycleCalculator = lazyCalculator(
  () => import('./sleep-cycle-calculator').then(mod => ({ default: mod.SleepCycleCalculator }))
);

export const LazyDogAgeCalculator = lazyCalculator(
  () => import('./dog-age-calculator').then(mod => ({ default: mod.DogAgeCalculator }))
);

export const LazyCatAgeCalculator = lazyCalculator(
  () => import('./cat-age-calculator').then(mod => ({ default: mod.CatAgeCalculator }))
);

export const LazyBraSizeCalculator = lazyCalculator(
  () => import('./bra-size-calculator').then(mod => ({ default: mod.BraSizeCalculator }))
);

export const LazyRingSizeConverter = lazyCalculator(
  () => import('./ring-size-converter').then(mod => ({ default: mod.RingSizeConverter }))
);

export const LazyShoeSizeConverter = lazyCalculator(
  () => import('./shoe-size-converter').then(mod => ({ default: mod.ShoeSizeConverter }))
);

export const LazyCookingConverter = lazyCalculator(
  () => import('./cooking-converter').then(mod => ({ default: mod.CookingConverter }))
);

export const LazyOvenTemperatureConverter = lazyCalculator(
  () => import('./oven-temperature-converter').then(mod => ({ default: mod.OvenTemperatureConverter }))
);

export const LazySmokingCostCalculator = lazyCalculator(
  () => import('./smoking-cost-calculator').then(mod => ({ default: mod.SmokingCostCalculator }))
);
