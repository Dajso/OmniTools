/**
 * Betongplate: volum, vekt, sekker, armering og betongbil.
 * Alle mål er metriske: meter for lengde og bredde, centimeter for tykkelse og avstander.
 *
 * @module lib/calculations/construction/concrete-slab-calculator
 */

export class ConcreteSlabError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ConcreteSlabError';
  }
}

/** Tetthet for herdet betong, kg/m³ */
export const CONCRETE_DENSITY = 2300;
/** Størrelse på sekk med ferdigbetong, kg */
export const SACK_WEIGHT_KG = 25;
/** Typisk lass i en betongbil, m³ */
export const TRUCK_LOAD_M3 = 8;
/** Tetthet for komprimert pukk, kg/m³ (grovt anslag) */
export const SUBBASE_DENSITY = 1800;

export const SLAB_THICKNESS_PRESETS = {
  '8': 'Gangsti, terrasse (8 cm)',
  '10': 'Garasjegulv, uteplass (10 cm)',
  '12': 'Innkjørsel, tyngre trafikk (12 cm)',
  '15': 'Kjørbar plate, industri (15 cm)',
  '20': 'Fundament, bærende plate (20 cm)',
} as const;

export interface ConcreteSlabInput {
  /** Lengde i meter */
  lengthM: number;
  /** Bredde i meter */
  widthM: number;
  /** Tykkelse i centimeter */
  thicknessCm: number;
  /** Tillegg for svinn i prosent (standard 10) */
  wastePercent?: number;
  /** Avstand mellom armeringsjern i cm. Utelatt = ingen armering */
  rebarSpacingCm?: number;
  /** Tykkelse på pukk under platen i cm. Utelatt = ingen pukk */
  subbaseCm?: number;
}

export interface RebarEstimate {
  barsAlongLength: number;
  barsAlongWidth: number;
  totalBars: number;
  totalMeters: number;
  meshAreaM2: number;
}

export interface ConcreteSlabResult {
  areaM2: number;
  volumeM3: number;
  volumeWithWasteM3: number;
  weightKg: number;
  sacks: number;
  rebar?: RebarEstimate;
  subbaseM3?: number;
  subbaseTonnes?: number;
  trucks: { loads: number; lastLoadM3: number };
  recommendation: string;
}

function requirePositive(value: number, name: string, field: string): void {
  if (value === undefined || value === null || Number.isNaN(value)) {
    throw new ConcreteSlabError(`${name} må være et gyldig tall`, field);
  }
  if (value <= 0) {
    throw new ConcreteSlabError(`${name} må være større enn 0`, field);
  }
}

export function calculateRebar(lengthM: number, widthM: number, spacingCm: number): RebarEstimate {
  const spacing = spacingCm / 100;
  const barsAlongLength = Math.floor(widthM / spacing) + 1; // jern som går langs lengden
  const barsAlongWidth = Math.floor(lengthM / spacing) + 1; // jern som går på tvers
  const totalMeters = barsAlongLength * lengthM + barsAlongWidth * widthM;
  return {
    barsAlongLength,
    barsAlongWidth,
    totalBars: barsAlongLength + barsAlongWidth,
    totalMeters: Math.round(totalMeters * 10) / 10,
    meshAreaM2: Math.round(lengthM * widthM * 1.1 * 10) / 10, // 10 % til overlapp
  };
}

export function estimateConcreteTrucks(volumeM3: number): { loads: number; lastLoadM3: number } {
  const loads = Math.max(1, Math.ceil(volumeM3 / TRUCK_LOAD_M3));
  const lastLoad = volumeM3 - (loads - 1) * TRUCK_LOAD_M3;
  return { loads, lastLoadM3: Math.round(lastLoad * 100) / 100 };
}

export function calculateConcreteSlab(input: ConcreteSlabInput): ConcreteSlabResult {
  const { lengthM, widthM, thicknessCm, wastePercent = 10, rebarSpacingCm, subbaseCm } = input;
  requirePositive(lengthM, 'Lengden', 'lengthM');
  requirePositive(widthM, 'Bredden', 'widthM');
  requirePositive(thicknessCm, 'Tykkelsen', 'thicknessCm');
  if (wastePercent < 0 || wastePercent > 100) {
    throw new ConcreteSlabError('Svinn må være mellom 0 og 100 %', 'wastePercent');
  }
  if (rebarSpacingCm !== undefined) requirePositive(rebarSpacingCm, 'Avstanden mellom armeringsjern', 'rebarSpacingCm');

  const areaM2 = lengthM * widthM;
  const volumeM3 = areaM2 * (thicknessCm / 100);
  const volumeWithWasteM3 = volumeM3 * (1 + wastePercent / 100);
  const weightKg = volumeWithWasteM3 * CONCRETE_DENSITY;

  let recommendation: string;
  if (volumeWithWasteM3 < 0.5) {
    recommendation = 'Under en halv kubikkmeter: sekker med ferdigbetong eller egen blanding fungerer fint.';
  } else if (volumeWithWasteM3 < 2) {
    recommendation = 'Mellom 0,5 og 2 m³: vurder blandebil med liten bil eller leie betongblander. Spør leverandøren om minstemengde.';
  } else {
    recommendation = 'Over 2 m³: bestill levert ferdigbetong. Det er raskere og gir jevnere kvalitet.';
  }

  const result: ConcreteSlabResult = {
    areaM2: Math.round(areaM2 * 100) / 100,
    volumeM3: Math.round(volumeM3 * 1000) / 1000,
    volumeWithWasteM3: Math.round(volumeWithWasteM3 * 1000) / 1000,
    weightKg: Math.round(weightKg),
    sacks: Math.ceil(weightKg / SACK_WEIGHT_KG),
    trucks: estimateConcreteTrucks(volumeWithWasteM3),
    recommendation,
  };

  if (rebarSpacingCm !== undefined && rebarSpacingCm > 0) {
    result.rebar = calculateRebar(lengthM, widthM, rebarSpacingCm);
  }
  if (subbaseCm !== undefined && subbaseCm > 0) {
    const m3 = areaM2 * (subbaseCm / 100);
    result.subbaseM3 = Math.round(m3 * 100) / 100;
    result.subbaseTonnes = Math.round(((m3 * SUBBASE_DENSITY) / 1000) * 10) / 10;
  }
  return result;
}
