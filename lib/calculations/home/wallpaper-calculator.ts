/**
 * Wallpaper Calculator
 * 
 * Calculates the number of wallpaper rolls needed.
 * 
 * @module lib/calculations/home/wallpaper-calculator
 * @see Requirements 7.5
 */

export interface WallpaperInputs {
  /** Room length in feet */
  roomLength: number;
  /** Room width in feet */
  roomWidth: number;
  /** Wall height in feet */
  wallHeight: number;
  /** Number of doors */
  numberOfDoors: number;
  /** Number of windows */
  numberOfWindows: number;
  /** Roll width in inches */
  rollWidth: number;
  /** Roll length in feet */
  rollLength: number;
  /** Pattern repeat in inches (0 for no pattern) */
  patternRepeat: number;
}

export interface WallpaperResults {
  /** Total wall area in square feet */
  totalWallArea: number;
  /** Usable area after subtracting doors/windows */
  usableArea: number;
  /** Coverage per roll in square feet */
  coveragePerRoll: number;
  /** Rolls needed */
  rollsNeeded: number;
  /** Extra rolls for pattern matching */
  extraRolls: number;
  /** Total rolls to purchase */
  totalRolls: number;
}

const DOOR_AREA = 20; // sq ft
const WINDOW_AREA = 15; // sq ft

/**
 * Calculates wallpaper requirements
 */
export function calculateWallpaper(inputs: WallpaperInputs): WallpaperResults {
  const {
    roomLength,
    roomWidth,
    wallHeight,
    numberOfDoors,
    numberOfWindows,
    rollWidth,
    rollLength,
    patternRepeat,
  } = inputs;

  if (roomLength <= 0 || roomWidth <= 0 || wallHeight <= 0) {
    throw new Error('Room dimensions must be positive');
  }

  const perimeter = 2 * (roomLength + roomWidth);
  const totalWallArea = perimeter * wallHeight;
  const usableArea = totalWallArea - (numberOfDoors * DOOR_AREA) - (numberOfWindows * WINDOW_AREA);
  
  // Roll coverage in square feet
  const rollWidthFt = rollWidth / 12;
  const coveragePerRoll = rollWidthFt * rollLength;
  
  // Account for pattern repeat waste (approximately 15% extra for patterns)
  const patternWaste = patternRepeat > 0 ? 0.15 : 0;
  const adjustedCoverage = coveragePerRoll * (1 - patternWaste);
  
  const rollsNeeded = Math.ceil(usableArea / adjustedCoverage);
  const extraRolls = patternRepeat > 0 ? Math.ceil(rollsNeeded * 0.1) : 1;
  const totalRolls = rollsNeeded + extraRolls;

  return {
    totalWallArea,
    usableArea: Math.max(0, usableArea),
    coveragePerRoll,
    rollsNeeded,
    extraRolls,
    totalRolls,
  };
}
