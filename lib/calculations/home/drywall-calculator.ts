/**
 * Drywall Calculator
 * 
 * Calculates drywall sheets needed for a room.
 * 
 * @module lib/calculations/home/drywall-calculator
 * @see Requirements 7.18
 */

export interface DrywallInputs {
  /** Room length in feet */
  roomLength: number;
  /** Room width in feet */
  roomWidth: number;
  /** Wall height in feet */
  wallHeight: number;
  /** Include ceiling */
  includeCeiling: boolean;
  /** Number of doors */
  numberOfDoors: number;
  /** Number of windows */
  numberOfWindows: number;
  /** Sheet size: '4x8' | '4x10' | '4x12' */
  sheetSize: '4x8' | '4x10' | '4x12';
}

export interface DrywallResults {
  /** Total wall area in square feet */
  wallAreaSqFt: number;
  /** Ceiling area in square feet */
  ceilingAreaSqFt: number;
  /** Total area to cover */
  totalAreaSqFt: number;
  /** Area per sheet */
  areaPerSheet: number;
  /** Sheets needed */
  sheetsNeeded: number;
  /** Joint compound (gallons) */
  jointCompoundGallons: number;
  /** Joint tape (feet) */
  jointTapeFeet: number;
  /** Screws needed */
  screws: number;
}

const DOOR_AREA = 20;
const WINDOW_AREA = 15;

const SHEET_SIZES: Record<string, { width: number; height: number }> = {
  '4x8': { width: 4, height: 8 },
  '4x10': { width: 4, height: 10 },
  '4x12': { width: 4, height: 12 },
};

/**
 * Calculates drywall requirements
 */
export function calculateDrywall(inputs: DrywallInputs): DrywallResults {
  const {
    roomLength,
    roomWidth,
    wallHeight,
    includeCeiling,
    numberOfDoors,
    numberOfWindows,
    sheetSize,
  } = inputs;

  if (roomLength <= 0 || roomWidth <= 0 || wallHeight <= 0) {
    throw new Error('Room dimensions must be positive');
  }

  const perimeter = 2 * (roomLength + roomWidth);
  const wallAreaSqFt = perimeter * wallHeight - (numberOfDoors * DOOR_AREA) - (numberOfWindows * WINDOW_AREA);
  const ceilingAreaSqFt = includeCeiling ? roomLength * roomWidth : 0;
  const totalAreaSqFt = Math.max(0, wallAreaSqFt) + ceilingAreaSqFt;

  const sheet = SHEET_SIZES[sheetSize];
  const areaPerSheet = sheet.width * sheet.height;
  
  // Add 10% for waste
  const sheetsNeeded = Math.ceil((totalAreaSqFt * 1.1) / areaPerSheet);

  // Joint compound: approximately 0.05 gallons per sq ft
  const jointCompoundGallons = Math.ceil(totalAreaSqFt * 0.05);

  // Joint tape: approximately 1 foot per 4 sq ft
  const jointTapeFeet = Math.ceil(totalAreaSqFt / 4);

  // Screws: approximately 1 per sq ft
  const screws = Math.ceil(totalAreaSqFt);

  return {
    wallAreaSqFt: Math.max(0, wallAreaSqFt),
    ceilingAreaSqFt,
    totalAreaSqFt,
    areaPerSheet,
    sheetsNeeded,
    jointCompoundGallons,
    jointTapeFeet,
    screws,
  };
}
