/**
 * Metriske tilpasninger for håndarbeidsverktøyene.
 *
 * De opprinnelige beregningene er skrevet med tommer og yards. Her ligger
 * omregning og norske standardverdier (cm, meter, 50 g-nøster, maskefasthet
 * per 10 cm, nålestørrelse i mm og EU-skostørrelser). Beregningene i de andre
 * filene gjenbrukes, slik at formlene er de samme.
 *
 * @module lib/calculations/crafts/metric
 */

import {
  calculateCircleSkirt,
  type SkirtType,
} from './circle-skirt-calculator';
import {
  calculateCrochetHat,
  STANDARD_HEAD_SIZES,
  YARN_REQUIREMENTS,
  type AgeGroup,
  type HatStyle,
} from './crochet-hat-calculator';
import {
  calculateEmbroideryFloss,
  type StitchType,
} from './embroidery-floss-calculator';
import {
  calculateFabricYardage,
  calculateInterfacingYardage,
  calculateLiningYardage,
  type FabricWidth,
  type GarmentType,
  type SizeCategory,
} from './fabric-yardage-calculator';
import {
  calculateQuiltBinding,
  calculateBiasBindingFabric,
  type BindingType,
} from './quilt-binding-calculator';
import { calculateSockDimensions, estimateYarnRequirements } from './socks-size-calculator';
import { YARN_WEIGHTS, type YarnWeight } from './yarn-substitution';

// ---------------------------------------------------------------------------
// Omregning
// ---------------------------------------------------------------------------

export const CM_PER_INCH = 2.54;
export const METERS_PER_YARD = 0.9144;

export function cmToIn(cm: number): number {
  return cm / CM_PER_INCH;
}

export function inToCm(inches: number): number {
  return inches * CM_PER_INCH;
}

export function ydToM(yards: number): number {
  return yards * METERS_PER_YARD;
}

/** Rund av til gitt antall desimaler. */
export function round(value: number, decimals: number = 1): number {
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}

/** Rund opp til nærmeste multiplum av `step` (f.eks. 0,1 m). */
export function ceilToStep(value: number, step: number): number {
  return Math.round(Math.ceil(value / step - 1e-9) * step * 1e6) / 1e6;
}

// ---------------------------------------------------------------------------
// Sirkelskjørt
// ---------------------------------------------------------------------------

/** Vanlige stoffbredder i Norge, i cm. */
export const CIRCLE_SKIRT_FABRIC_WIDTHS_CM = [110, 150] as const;

export interface CircleSkirtMetricInput {
  waistCm: number;
  lengthCm: number;
  skirtType: SkirtType;
  /** Sømmonn i cm (brukes i midjen). */
  seamAllowanceCm: number;
  /** Fald i cm. */
  hemAllowanceCm: number;
}

export interface FabricByWidth {
  widthCm: number;
  /** Meter stoff, rundet opp til nærmeste 10 cm. Null hvis stoffet er for smalt. */
  meters: number | null;
  /** Stykkene må skjøtes for å få plass. */
  needsSeams: boolean;
}

export interface CircleSkirtMetricResult {
  /** Radius for midjehullet slik det klippes (med sømmonn). */
  innerCutRadiusCm: number;
  /** Radius for ferdig midjelinje (uten sømmonn). */
  waistRadiusCm: number;
  /** Radius til nedre kant slik den klippes (med fald). */
  outerCutRadiusCm: number;
  /** Lengde på nedre kant i ferdig skjørt (uten fald), i cm. */
  hemWidthCm: number;
  /** Minste stoffbredde og -lengde for ett enkelt stykke, i cm. */
  minWidthCm: number;
  minLengthCm: number;
  fabric: FabricByWidth[];
}

const SKIRT_ANGLE_FRACTION: Record<SkirtType, number> = {
  full: 1,
  'three-quarter': 0.75,
  half: 0.5,
  quarter: 0.25,
};

/** Antall rader stykker av en gitt størrelse som får plass på stoff med bredde W. */
function rowsLayout(
  pieceW: number,
  pieceH: number,
  count: number,
  fabricW: number
): number | null {
  const perRow = Math.floor(fabricW / pieceW + 1e-9);
  if (perRow < 1) return null;
  return Math.ceil(count / perRow) * pieceH;
}

/** Minste ramme (bredde × lengde) rundt ett stykke, når R er radius i nedre kant. */
function pieceBox(skirtType: SkirtType, R: number): { width: number; length: number } {
  switch (skirtType) {
    case 'quarter':
      return { width: R, length: R };
    case 'half':
      return { width: 2 * R, length: R };
    default:
      // Hel sirkel og 3/4-sirkel
      return { width: 2 * R, length: 2 * R };
  }
}

/** Antall kvartsirkler (R × R) som brukes hvis stoffet er for smalt til ett stykke. */
const FALLBACK_QUARTER_PIECES: Record<SkirtType, number> = {
  full: 4,
  'three-quarter': 3,
  half: 2,
  quarter: 1,
};

function fabricForWidth(
  skirtType: SkirtType,
  outerRadius: number,
  fabricWidth: number
): FabricByWidth {
  const R = outerRadius;
  const box = pieceBox(skirtType, R);

  // Først forsøkes ett enkelt stykke. Er stoffet for smalt, deles skjørtet i
  // kvartsirkler som skjøtes (ikke mulig for kvart sirkel, som allerede er en kvartsirkel).
  let length = rowsLayout(box.width, box.length, 1, fabricWidth);
  let needsSeams = false;
  if (length === null && skirtType !== 'quarter') {
    length = rowsLayout(R, R, FALLBACK_QUARTER_PIECES[skirtType], fabricWidth);
    needsSeams = true;
  }

  return {
    widthCm: fabricWidth,
    meters: length === null ? null : ceilToStep(length / 100, 0.1),
    needsSeams,
  };
}

export function calculateCircleSkirtMetric(
  input: CircleSkirtMetricInput
): CircleSkirtMetricResult {
  const { waistCm, lengthCm, skirtType, seamAllowanceCm, hemAllowanceCm } = input;

  // Selve geometrien beregnes av den opprinnelige funksjonen (i tommer).
  const base = calculateCircleSkirt({
    waistMeasurement: cmToIn(waistCm),
    skirtLength: cmToIn(lengthCm),
    skirtType,
    seamAllowance: cmToIn(seamAllowanceCm),
    hemAllowance: cmToIn(hemAllowanceCm),
  });

  const waistRadius = inToCm(base.innerRadius);
  const outerCut = inToCm(base.outerRadius);
  const innerCut = Math.max(waistRadius - seamAllowanceCm, 0);
  const hemRadiusFinished = outerCut - hemAllowanceCm;
  const hemWidth = 2 * Math.PI * hemRadiusFinished * SKIRT_ANGLE_FRACTION[skirtType];

  return {
    innerCutRadiusCm: round(innerCut, 1),
    waistRadiusCm: round(waistRadius, 1),
    outerCutRadiusCm: round(outerCut, 1),
    hemWidthCm: round(hemWidth, 0),
    minWidthCm: round(pieceBox(skirtType, outerCut).width, 0),
    minLengthCm: round(pieceBox(skirtType, outerCut).length, 0),
    fabric: CIRCLE_SKIRT_FABRIC_WIDTHS_CM.map((w) => fabricForWidth(skirtType, outerCut, w)),
  };
}

// ---------------------------------------------------------------------------
// Hekla lue
// ---------------------------------------------------------------------------

/** Hodeomkrets i cm for standardstørrelser (omregnet fra tabellen i tommer). */
export const STANDARD_HEAD_SIZES_CM: Record<AgeGroup, { circumference: number; height: number }> =
  Object.fromEntries(
    (Object.entries(STANDARD_HEAD_SIZES) as [AgeGroup, { circumference: number; height: number }][]).map(
      ([key, v]) => [key, { circumference: Math.round(inToCm(v.circumference)), height: round(inToCm(v.height), 1) }]
    )
  ) as Record<AgeGroup, { circumference: number; height: number }>;

/** Norske navn på størrelsene. */
export const AGE_GROUP_NAMES_NO: Record<AgeGroup, string> = {
  preemie: 'Prematur',
  newborn: 'Nyfødt',
  'baby-3-6m': 'Baby 3–6 mnd',
  'baby-6-12m': 'Baby 6–12 mnd',
  toddler: 'Småbarn',
  child: 'Barn',
  teen: 'Ungdom',
  'adult-small': 'Voksen S',
  'adult-medium': 'Voksen M',
  'adult-large': 'Voksen L',
};

/** Garnbehov i meter (omregnet fra yards og rundet til nærmeste 5 m). */
export function yarnForHatMeters(ageGroup: AgeGroup): { worsted: number; bulky: number } {
  const y = YARN_REQUIREMENTS[ageGroup];
  const r5 = (yd: number) => Math.round(ydToM(yd) / 5) * 5;
  return { worsted: r5(y.worsted), bulky: r5(y.bulky) };
}

export interface CrochetHatMetricResult {
  hatCircumferenceCm: number;
  crownDiameterCm: number;
  hatHeightCm: number;
  decreaseRounds: number;
  negativeEasePercent: number;
}

export function calculateCrochetHatMetric(input: {
  headCm: number;
  style: HatStyle;
  negativeEase: number;
}): CrochetHatMetricResult {
  const r = calculateCrochetHat({
    headCircumference: cmToIn(input.headCm),
    style: input.style,
    negativeEase: input.negativeEase,
  });
  return {
    hatCircumferenceCm: round(inToCm(r.hatCircumference), 1),
    crownDiameterCm: round(inToCm(r.crownDiameter), 1),
    hatHeightCm: round(inToCm(r.hatHeight), 1),
    decreaseRounds: r.decreaseRounds,
    negativeEasePercent: r.negativeEasePercent,
  };
}

// ---------------------------------------------------------------------------
// Broderigarn
// ---------------------------------------------------------------------------

/** En vanlig dokke broderigarn (DMC) er 8 meter. */
export const FLOSS_SKEIN_LENGTH_M = 8;
/** Anbefalt trådlengde å klippe, i cm (ca. 18 tommer). */
export const FLOSS_CUT_LENGTH_CM = 45;

export interface EmbroideryFlossMetricResult {
  skeinsNeeded: number;
  threadLengthMeters: number;
  /** Tråd per sting, i cm. */
  threadPerStitchCm: number;
  /** Andel av en dokke som brukes (med buffer), i prosent. */
  skeinPercentage: number;
}

export function calculateEmbroideryFlossMetric(input: {
  stitchCount: number;
  fabricCount: number;
  stitchType: StitchType;
  strandsUsed: number;
  overTwo: boolean;
}): EmbroideryFlossMetricResult {
  const r = calculateEmbroideryFloss(input);
  const withBuffer = r.threadLengthMeters * 1.15;
  return {
    skeinsNeeded: Math.max(1, Math.ceil(withBuffer / FLOSS_SKEIN_LENGTH_M - 1e-9)),
    threadLengthMeters: round(r.threadLengthMeters, 1),
    threadPerStitchCm: round(inToCm(r.threadPerStitch), 2),
    skeinPercentage: round((withBuffer / FLOSS_SKEIN_LENGTH_M) * 100, 0),
  };
}

// ---------------------------------------------------------------------------
// Stoffmengde til plagg
// ---------------------------------------------------------------------------

/**
 * Stoffbredder. Verdiene er de nærmeste bredden i tommer som beregningen bruker
 * (36" ≈ 90 cm, 45" ≈ 110 cm, 54" ≈ 140 cm, 60" ≈ 150 cm).
 */
export const FABRIC_WIDTH_OPTIONS_CM: { value: FabricWidth; cm: number }[] = [
  { value: 36, cm: 90 },
  { value: 45, cm: 110 },
  { value: 54, cm: 140 },
  { value: 60, cm: 150 },
];

export interface FabricYardageMetricResult {
  metersNeeded: number;
  baseMeters: number;
  napMeters: number;
  patternMeters: number;
  liningMeters: number;
  interfacingMeters: number;
}

export function calculateFabricMetersMetric(input: {
  garmentType: GarmentType;
  size: SizeCategory;
  fabricWidth: FabricWidth;
  hasNap: boolean;
  patternRepeatCm: number;
}): FabricYardageMetricResult {
  const r = calculateFabricYardage({
    garmentType: input.garmentType,
    size: input.size,
    fabricWidth: input.fabricWidth,
    hasNap: input.hasNap,
    patternRepeat: cmToIn(input.patternRepeatCm),
  });
  const lining = calculateLiningYardage(r.yardsNeeded, input.garmentType);
  const interfacing = calculateInterfacingYardage(input.garmentType, input.size);
  return {
    metersNeeded: ceilToStep(ydToM(r.yardsNeeded), 0.1),
    baseMeters: round(ydToM(r.baseYardage), 2),
    napMeters: round(ydToM(r.napAllowance), 2),
    patternMeters: round(ydToM(r.patternAllowance), 2),
    liningMeters: ceilToStep(ydToM(lining), 0.1),
    interfacingMeters: ceilToStep(ydToM(interfacing), 0.1),
  };
}

// ---------------------------------------------------------------------------
// Maskefasthet (per 10 cm)
// ---------------------------------------------------------------------------

/** Enheten for fasthet i verktøyet: masker og pinner per 10 cm. */
export const GAUGE_UNIT_CM = 10;

export interface GaugePreset {
  stitches: number;
  rows: number;
}

/** Typisk fasthet i glattstrikk, masker og pinner per 10 cm. */
export const YARN_WEIGHT_GAUGES_10CM: Record<string, GaugePreset> = {
  lace: { stitches: 32, rows: 40 },
  fingering: { stitches: 28, rows: 36 },
  sport: { stitches: 24, rows: 32 },
  dk: { stitches: 22, rows: 28 },
  worsted: { stitches: 18, rows: 24 },
  bulky: { stitches: 14, rows: 18 },
  'super-bulky': { stitches: 10, rows: 14 },
};

// ---------------------------------------------------------------------------
// Kantbånd til pledd/quilt
// ---------------------------------------------------------------------------

/** Typiske mål for pledd og sengetepper, i cm. */
export const QUILT_SIZES_CM: Record<string, { width: number; height: number; label: string }> = {
  baby: { width: 70, height: 100, label: 'Babyteppe' },
  throw: { width: 130, height: 170, label: 'Pledd' },
  single: { width: 140, height: 210, label: 'Enkeltseng (90 cm)' },
  double: { width: 200, height: 230, label: 'Dobbeltseng (140–160 cm)' },
  king: { width: 240, height: 250, label: 'Kingsize (180–200 cm)' },
};

export const BINDING_STRIP_DEFAULT_CM: Record<BindingType, number> = {
  'double-fold': 6.5,
  'single-fold': 5,
};

export const DEFAULT_USABLE_FABRIC_WIDTH_CM = 105;
export const DEFAULT_BINDING_EXTRA_CM = 30;

export interface QuiltBindingMetricResult {
  perimeterCm: number;
  totalBindingLengthCm: number;
  numberOfStrips: number;
  stripLengthCm: number;
  stripWidthCm: number;
  /** Total stofflengde til stripene, i cm. */
  fabricCmNeeded: number;
  fabricMetersNeeded: number;
  finishedBindingWidthCm: number;
  biasSquareCm: number;
}

export function calculateQuiltBindingMetric(input: {
  quiltWidthCm: number;
  quiltHeightCm: number;
  bindingType: BindingType;
  stripWidthCm: number;
  fabricWidthCm: number;
  extraCm: number;
}): QuiltBindingMetricResult {
  // Beregningen i den opprinnelige filen er uavhengig av enhet bortsett fra
  // omregningen til yards og ferdig bredde, som gjøres på nytt her.
  const r = calculateQuiltBinding({
    quiltWidth: input.quiltWidthCm,
    quiltHeight: input.quiltHeightCm,
    bindingType: input.bindingType,
    bindingStripWidth: input.stripWidthCm,
    fabricWidth: input.fabricWidthCm,
    extraAllowance: input.extraCm,
  });
  const finished =
    input.bindingType === 'double-fold'
      ? input.stripWidthCm / 4
      : (input.stripWidthCm - 1.3) / 2;
  const bias = calculateBiasBindingFabric(r.totalBindingLength, input.stripWidthCm);

  return {
    perimeterCm: round(r.quiltPerimeter, 0),
    totalBindingLengthCm: round(r.totalBindingLength, 0),
    numberOfStrips: r.numberOfStrips,
    stripLengthCm: r.stripLength,
    stripWidthCm: input.stripWidthCm,
    fabricCmNeeded: round(r.fabricInchesNeeded, 1),
    fabricMetersNeeded: ceilToStep(r.fabricInchesNeeded / 100, 0.1),
    finishedBindingWidthCm: round(Math.max(finished, 0), 1),
    biasSquareCm: bias,
  };
}

// ---------------------------------------------------------------------------
// Sokker
// ---------------------------------------------------------------------------

/**
 * EU-skostørrelse ut fra fotlengde (cm): størrelse = (fotlengde + 1,5) × 1,5.
 * Dette er den vanlige «parisiske» størrelsen. Kan variere litt mellom merker.
 */
export function euShoeSizeFromFootLength(footLengthCm: number): number {
  return Math.round((footLengthCm + 1.5) * 1.5 * 2) / 2;
}

/** Sokkestørrelse slik de vanligvis selges i Norge. */
export function sockSizeGroupNo(euSize: number): string {
  if (euSize < 35) return 'Barnestørrelse';
  if (euSize < 38) return '35–37';
  if (euSize < 41) return '38–40';
  if (euSize < 44) return '41–43';
  if (euSize < 47) return '44–46';
  return '47–49';
}

export interface SockMetricResult {
  castOnStitches: number;
  heelStitches: number;
  gussetPickupStitches: number;
  toeStitches: number;
  footLengthToToeCm: number;
  heelFlapLengthCm: number;
  legLengthCm: number;
  negativeEase: number;
  euSize: number;
  sizeGroup: string;
  /** Garnforbruk per par, i meter (omregnet fra yards). */
  yarnMeters: number;
}

export function calculateSocksMetric(input: {
  footLengthCm: number;
  footCircumferenceCm: number;
  ankleCircumferenceCm: number;
  legLengthCm: number;
  stitchesPer10cm: number;
  rowsPer10cm: number;
  yarnWeight: 'fingering' | 'sport' | 'dk';
}): SockMetricResult {
  const perIn = CM_PER_INCH / GAUGE_UNIT_CM;
  const r = calculateSockDimensions(
    {
      footLength: cmToIn(input.footLengthCm),
      footCircumference: cmToIn(input.footCircumferenceCm),
      ankleCircumference: cmToIn(input.ankleCircumferenceCm),
      legLength: cmToIn(input.legLengthCm),
      unit: 'inches',
    },
    {
      stitchesPerInch: input.stitchesPer10cm * perIn,
      rowsPerInch: input.rowsPer10cm * perIn,
    }
  );
  const yarnYd = estimateYarnRequirements(r, input.yarnWeight);
  const eu = euShoeSizeFromFootLength(input.footLengthCm);

  return {
    castOnStitches: r.castOnStitches,
    heelStitches: r.heelStitches,
    gussetPickupStitches: r.gussetPickupStitches,
    toeStitches: r.toeDecreaseStitches,
    footLengthToToeCm: round(inToCm(r.footLengthToToe), 1),
    heelFlapLengthCm: round(inToCm(r.heelFlapLength), 1),
    legLengthCm: round(inToCm(r.legLength), 1),
    negativeEase: r.negativeEase,
    euSize: eu,
    sizeGroup: sockSizeGroupNo(eu),
    yarnMeters: Math.round(ydToM(yarnYd) / 10) * 10,
  };
}

// ---------------------------------------------------------------------------
// Garnbytte
// ---------------------------------------------------------------------------

export const YARN_WEIGHT_NAMES_NO: Record<YarnWeight, { name: string; alias: string }> = {
  lace: { name: 'Lace (tynt)', alias: 'cobweb' },
  'super-fine': { name: 'Sokkegarn', alias: 'fingering' },
  fine: { name: 'Sportsgarn', alias: 'sport' },
  light: { name: 'Lett garn', alias: 'DK' },
  medium: { name: 'Mellomtykt garn', alias: 'worsted' },
  bulky: { name: 'Tykt garn', alias: 'chunky' },
  'super-bulky': { name: 'Ekstra tykt garn', alias: 'super chunky' },
  jumbo: { name: 'Jumbogarn', alias: 'jumbo' },
};

/** US-nålestørrelse til millimeter. */
const US_NEEDLE_MM: [number, number][] = [
  [0, 2.0],
  [1, 2.25],
  [2, 2.75],
  [3, 3.25],
  [4, 3.5],
  [5, 3.75],
  [6, 4.0],
  [7, 4.5],
  [8, 5.0],
  [9, 5.5],
  [10, 6.0],
  [10.5, 6.5],
  [11, 8.0],
  [13, 9.0],
  [15, 10.0],
  [17, 12.75],
  [19, 15.0],
  [35, 19.0],
  [50, 25.0],
];

export function usNeedleToMm(us: number): number {
  let found = US_NEEDLE_MM[0][1];
  for (const [size, mm] of US_NEEDLE_MM) {
    if (size <= us) found = mm;
  }
  return found;
}

export interface YarnWeightDetailsNo {
  name: string;
  alias: string;
  cycNumber: number;
  /** Masker per 10 cm i glattstrikk. */
  gaugeMin: number;
  gaugeMax: number;
  /** Anbefalt pinnestørrelse i mm. */
  needleMinMm: number;
  needleMaxMm: number;
}

export function yarnWeightDetailsNo(weight: YarnWeight): YarnWeightDetailsNo {
  const info = YARN_WEIGHTS[weight];
  // Fastheten i tabellen gjelder per 4 tommer (10,16 cm)
  const f = GAUGE_UNIT_CM / (4 * CM_PER_INCH);
  return {
    ...YARN_WEIGHT_NAMES_NO[weight],
    cycNumber: info.cycNumber,
    gaugeMin: Math.round(info.gaugeRange.min * f),
    gaugeMax: Math.round(info.gaugeRange.max * f),
    needleMinMm: usNeedleToMm(info.needleRange.min),
    needleMaxMm: usNeedleToMm(info.needleRange.max),
  };
}
