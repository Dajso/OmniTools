/**
 * Størrelseskonvertere: BH, ring og sko
 *
 * Norge bruker europeiske størrelser (EU). Konverteringene mot UK og USA er
 * veiledende, og størrelsene varierer mellom produsenter.
 *
 * @module lib/calculations/health/size-converters
 */

// ============ BH-STØRRELSE ============

export interface BraSizeInputs {
  /** Mål rett under brystet, i cm */
  bandMeasurement: number;
  /** Mål rundt brystets fyldigste punkt, i cm */
  bustMeasurement: number;
}

export interface BraSizeResults {
  /** Europeisk størrelse, f.eks. 75C */
  eu: string;
  uk: string;
  us: string;
  /** Underbrystmål i europeisk størrelse (cm) */
  bandSize: number;
  /** Skålstørrelse (EU) */
  cupSize: string;
}

const EU_CUPS = ['AA', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const UK_CUPS = ['AA', 'A', 'B', 'C', 'D', 'DD', 'E', 'F', 'FF'];
const US_CUPS = ['AA', 'A', 'B', 'C', 'D', 'DD', 'DDD', 'G', 'H'];

export function calculateBraSize(inputs: BraSizeInputs): BraSizeResults {
  const { bandMeasurement, bustMeasurement } = inputs;
  if (!(bandMeasurement > 0) || !(bustMeasurement > 0)) {
    throw new Error('Målene må være større enn null');
  }
  if (bustMeasurement < bandMeasurement) {
    throw new Error('Brystmålet må være minst like stort som underbrystmålet');
  }

  // Underbrystmål rundes til nærmeste 5 cm
  const bandSize = Math.max(60, Math.round(bandMeasurement / 5) * 5);

  // Forskjellen mellom bryst og underbryst gir skål: 12 cm = A, 14 cm = B, 16 cm = C …
  const difference = bustMeasurement - bandMeasurement;
  const cupIndex = Math.max(0, Math.min(EU_CUPS.length - 1, Math.round((difference - 10) / 2)));

  // UK/US-bånd i tommer: 65 → 30, 70 → 32, 75 → 34 …
  const inchBand = 30 + ((bandSize - 65) / 5) * 2;

  return {
    eu: `${bandSize}${EU_CUPS[cupIndex]}`,
    uk: `${inchBand}${UK_CUPS[cupIndex]}`,
    us: `${inchBand}${US_CUPS[cupIndex]}`,
    bandSize,
    cupSize: EU_CUPS[cupIndex],
  };
}

// ============ RINGSTØRRELSE ============

export type RingSizeSystem = 'eu' | 'us' | 'uk';

export interface RingSizeInputs {
  size: number | string;
  fromSystem: RingSizeSystem;
}

export interface RingSizeResults {
  /** Europeisk ringstørrelse = innvendig omkrets i mm */
  eu: number;
  us: number;
  uk: string;
  /** Innvendig diameter i mm */
  diameter: number;
  /** Innvendig omkrets i mm */
  circumference: number;
}

/** Innvendig diameter (mm) for amerikansk størrelse */
const usToDiameter = (us: number) => 11.63 + 0.8128 * us;
const diameterToUs = (d: number) => (d - 11.63) / 0.8128;

/** Gjør om britisk bokstavstørrelse (f.eks. «N½») til en tallverdi der A = 1 */
function ukToIndex(size: number | string): number {
  if (typeof size === 'number') return size;
  const s = size.trim().toUpperCase();
  const letter = s.charCodeAt(0) - 64;
  if (letter < 1 || letter > 26) throw new Error('Ugyldig britisk ringstørrelse');
  return letter + (s.includes('½') || s.includes('.5') || s.includes('1/2') ? 0.5 : 0);
}

export function convertRingSize(inputs: RingSizeInputs): RingSizeResults {
  const { size, fromSystem } = inputs;
  let diameter: number;

  if (fromSystem === 'eu') {
    const circumference = typeof size === 'string' ? parseFloat(size.replace(',', '.')) : size;
    if (!(circumference > 0)) throw new Error('Størrelsen må være større enn null');
    diameter = circumference / Math.PI;
  } else if (fromSystem === 'us') {
    const us = typeof size === 'string' ? parseFloat(size.replace(',', '.')) : size;
    if (!(us > 0)) throw new Error('Størrelsen må være større enn null');
    diameter = usToDiameter(us);
  } else {
    const idx = ukToIndex(size);
    diameter = usToDiameter((idx - 0.5) / 2);
  }

  const circumference = diameter * Math.PI;
  const us = Math.round(diameterToUs(diameter) * 2) / 2;
  const ukIdx = Math.round((us * 2 + 0.5) * 2) / 2;
  const letter = String.fromCharCode(64 + Math.max(1, Math.min(26, Math.floor(ukIdx))));
  const uk = `${letter}${ukIdx % 1 ? '½' : ''}`;

  return {
    eu: Math.round(circumference),
    us,
    uk,
    diameter: Math.round(diameter * 10) / 10,
    circumference: Math.round(circumference * 10) / 10,
  };
}

// ============ SKOSTØRRELSE ============

export type ShoeSizeSystem = 'eu' | 'us_men' | 'us_women' | 'uk' | 'cm';

export interface ShoeSizeInputs {
  size: number;
  fromSystem: ShoeSizeSystem;
}

export interface ShoeSizeResults {
  eu: number;
  us_men: number;
  us_women: number;
  uk: number;
  /** Fotlengde i cm */
  cm: number;
}

/** Fotlengde i cm ut fra europeisk størrelse (1 størrelse = 2/3 cm, 1,5 cm plass foran tåen) */
const euToFootCm = (eu: number) => (eu * 2) / 3 - 1.5;
const footCmToEu = (cm: number) => (cm + 1.5) * 1.5;
const halfStep = (v: number) => Math.round(v * 2) / 2;

export function convertShoeSize(inputs: ShoeSizeInputs): ShoeSizeResults {
  const { size, fromSystem } = inputs;
  if (!(size > 0)) throw new Error('Størrelsen må være større enn null');

  let eu: number;
  switch (fromSystem) {
    case 'eu': eu = size; break;
    case 'us_men': eu = size + 33; break;
    case 'us_women': eu = size + 31.5; break;
    case 'uk': eu = size + 34; break;
    case 'cm': eu = footCmToEu(size); break;
    default: eu = size;
  }

  return {
    eu: halfStep(eu),
    us_men: Math.max(0, halfStep(eu - 33)),
    us_women: Math.max(0, halfStep(eu - 31.5)),
    uk: Math.max(0, halfStep(eu - 34)),
    cm: Math.round(euToFootCm(eu) * 10) / 10,
  };
}
