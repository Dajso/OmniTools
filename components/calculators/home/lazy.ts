/**
 * Lazy-loaded Home & DIY Calculator Components
 * 
 * These exports use dynamic imports to enable code splitting,
 * reducing the initial bundle size for pages that don't use these calculators.
 * 
 * @see Requirements 13.4 - Use dynamic imports to split JavaScript bundles by route
 * @module components/calculators/home/lazy
 */

import { lazyCalculator } from '@/lib/utils/lazy-components';

// Lazy-loaded home calculators
export const LazyPaintCalculator = lazyCalculator(
  () => import('./paint-calculator').then(mod => ({ default: mod.PaintCalculator }))
);

export const LazyMulchCalculator = lazyCalculator(
  () => import('./mulch-calculator').then(mod => ({ default: mod.MulchCalculator }))
);

export const LazyConcreteCalculator = lazyCalculator(
  () => import('./concrete-calculator').then(mod => ({ default: mod.ConcreteCalculator }))
);

export const LazyTileCalculator = lazyCalculator(
  () => import('./tile-calculator').then(mod => ({ default: mod.TileCalculator }))
);

export const LazyWallpaperCalculator = lazyCalculator(
  () => import('./wallpaper-calculator').then(mod => ({ default: mod.WallpaperCalculator }))
);

export const LazyCarpetCalculator = lazyCalculator(
  () => import('./carpet-calculator').then(mod => ({ default: mod.CarpetCalculator }))
);

export const LazyElectricityCostCalculator = lazyCalculator(
  () => import('./electricity-cost-calculator').then(mod => ({ default: mod.ElectricityCostCalculator }))
);

export const LazyBTUCalculator = lazyCalculator(
  () => import('./btu-calculator').then(mod => ({ default: mod.BTUCalculator }))
);

export const LazyGravelCalculator = lazyCalculator(
  () => import('./gravel-calculator').then(mod => ({ default: mod.GravelCalculator }))
);

export const LazyGrassSeedCalculator = lazyCalculator(
  () => import('./grass-seed-calculator').then(mod => ({ default: mod.GrassSeedCalculator }))
);

export const LazyFenceCalculator = lazyCalculator(
  () => import('./fence-calculator').then(mod => ({ default: mod.FenceCalculator }))
);

export const LazyDeckingCalculator = lazyCalculator(
  () => import('./decking-calculator').then(mod => ({ default: mod.DeckingCalculator }))
);

export const LazyRoofPitchCalculator = lazyCalculator(
  () => import('./roof-pitch-calculator').then(mod => ({ default: mod.RoofPitchCalculator }))
);

export const LazyStairCalculator = lazyCalculator(
  () => import('./stair-calculator').then(mod => ({ default: mod.StairCalculator }))
);

export const LazySquareFootageCalculator = lazyCalculator(
  () => import('./square-footage-calculator').then(mod => ({ default: mod.SquareFootageCalculator }))
);

export const LazyPoolVolumeCalculator = lazyCalculator(
  () => import('./pool-volume-calculator').then(mod => ({ default: mod.PoolVolumeCalculator }))
);

export const LazyLumberCalculator = lazyCalculator(
  () => import('./lumber-calculator').then(mod => ({ default: mod.LumberCalculator }))
);

export const LazyDrywallCalculator = lazyCalculator(
  () => import('./drywall-calculator').then(mod => ({ default: mod.DrywallCalculator }))
);

export const LazySolarPanelCalculator = lazyCalculator(
  () => import('./solar-panel-calculator').then(mod => ({ default: mod.SolarPanelCalculator }))
);

