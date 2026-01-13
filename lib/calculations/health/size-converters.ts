/**
 * Size Converters (Bra, Ring, Shoe)
 * 
 * Converts between international sizing systems.
 * 
 * @module lib/calculations/health/size-converters
 * @see Requirements 6.15, 6.16, 6.17
 */

// ============ BRA SIZE CALCULATOR ============

export interface BraSizeInputs {
  bandMeasurement: number; // inches
  bustMeasurement: number; // inches
  unit: 'imperial' | 'metric';
}

export interface BraSizeResults {
  us: string;
  uk: string;
  eu: string;
  bandSize: number;
  cupSize: string;
}

const CUP_SIZES = ['AA', 'A', 'B', 'C', 'D', 'DD', 'DDD', 'G', 'H', 'I', 'J'];

export function calculateBraSize(inputs: BraSizeInputs): BraSizeResults {
  let { bandMeasurement, bustMeasurement, unit } = inputs;

  // Convert to inches if metric
  if (unit === 'metric') {
    bandMeasurement = bandMeasurement / 2.54;
    bustMeasurement = bustMeasurement / 2.54;
  }

  // Calculate band size (round to nearest even number)
  let bandSize = Math.round(bandMeasurement);
  if (bandSize % 2 !== 0) bandSize += 1;

  // Calculate cup size (difference between bust and band)
  const difference = Math.round(bustMeasurement - bandMeasurement);
  const cupIndex = Math.max(0, Math.min(difference, CUP_SIZES.length - 1));
  const cupSize = CUP_SIZES[cupIndex];

  // EU band size conversion
  const euBand = bandSize + 10;

  return {
    us: `${bandSize}${cupSize}`,
    uk: `${bandSize}${cupSize}`,
    eu: `${euBand}${cupSize}`,
    bandSize,
    cupSize,
  };
}

// ============ RING SIZE CONVERTER ============

export type RingSizeSystem = 'us' | 'uk' | 'eu' | 'jp';

export interface RingSizeInputs {
  size: number | string;
  fromSystem: RingSizeSystem;
}

export interface RingSizeResults {
  us: number;
  uk: string;
  eu: number;
  jp: number;
  diameter: number; // mm
  circumference: number; // mm
}

// US size to diameter (mm) mapping
const US_TO_DIAMETER: Record<number, number> = {
  3: 14.1, 3.5: 14.5, 4: 14.9, 4.5: 15.3, 5: 15.7, 5.5: 16.1,
  6: 16.5, 6.5: 16.9, 7: 17.3, 7.5: 17.7, 8: 18.1, 8.5: 18.5,
  9: 18.9, 9.5: 19.4, 10: 19.8, 10.5: 20.2, 11: 20.6, 11.5: 21.0,
  12: 21.4, 12.5: 21.8, 13: 22.2,
};

export function convertRingSize(inputs: RingSizeInputs): RingSizeResults {
  const { size, fromSystem } = inputs;
  let usSize: number;

  // Convert to US size first
  if (fromSystem === 'us') {
    usSize = typeof size === 'string' ? parseFloat(size) : size;
  } else if (fromSystem === 'uk') {
    // UK uses letters A-Z, convert to US
    const ukLetter = typeof size === 'string' ? size.toUpperCase() : String.fromCharCode(64 + size);
    usSize = (ukLetter.charCodeAt(0) - 64) / 2 + 0.5;
  } else if (fromSystem === 'eu') {
    const euSize = typeof size === 'string' ? parseFloat(size) : size;
    usSize = (euSize - 40) / 1.25;
  } else {
    const jpSize = typeof size === 'string' ? parseFloat(size) : size;
    usSize = (jpSize - 1) / 2 + 3;
  }

  // Round to nearest 0.5
  usSize = Math.round(usSize * 2) / 2;
  usSize = Math.max(3, Math.min(13, usSize));

  // Get diameter
  const diameter = US_TO_DIAMETER[usSize] || 17.3;
  const circumference = diameter * Math.PI;

  // Convert to other systems
  const ukIndex = Math.round((usSize - 0.5) * 2);
  const ukLetter = String.fromCharCode(64 + ukIndex);
  const euSize = Math.round(usSize * 1.25 + 40);
  const jpSize = Math.round((usSize - 3) * 2 + 1);

  return {
    us: usSize,
    uk: ukLetter,
    eu: euSize,
    jp: jpSize,
    diameter: Math.round(diameter * 10) / 10,
    circumference: Math.round(circumference * 10) / 10,
  };
}

// ============ SHOE SIZE CONVERTER ============

export type ShoeSizeSystem = 'us_men' | 'us_women' | 'uk' | 'eu' | 'cm';

export interface ShoeSizeInputs {
  size: number;
  fromSystem: ShoeSizeSystem;
}

export interface ShoeSizeResults {
  us_men: number;
  us_women: number;
  uk: number;
  eu: number;
  cm: number;
}

export function convertShoeSize(inputs: ShoeSizeInputs): ShoeSizeResults {
  const { size, fromSystem } = inputs;
  let cm: number;

  // Convert to cm first (foot length)
  switch (fromSystem) {
    case 'us_men':
      cm = (size + 23) * 0.847;
      break;
    case 'us_women':
      cm = (size + 21.5) * 0.847;
      break;
    case 'uk':
      cm = (size + 23) * 0.847;
      break;
    case 'eu':
      cm = (size + 2) * 0.667;
      break;
    case 'cm':
      cm = size;
      break;
    default:
      cm = 25;
  }

  // Convert from cm to all systems
  const usMen = Math.round((cm / 0.847 - 23) * 2) / 2;
  const usWomen = Math.round((cm / 0.847 - 21.5) * 2) / 2;
  const uk = Math.round((cm / 0.847 - 23) * 2) / 2;
  const eu = Math.round(cm / 0.667 - 2);

  return {
    us_men: Math.max(1, usMen),
    us_women: Math.max(1, usWomen),
    uk: Math.max(0, uk),
    eu: Math.max(30, eu),
    cm: Math.round(cm * 10) / 10,
  };
}
