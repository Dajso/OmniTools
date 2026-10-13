/**
 * Bolig og oppussing: beregninger i metriske enheter (meter, centimeter, liter, kg).
 * Alle lengder oppgis i meter hvis ikke annet er nevnt i navnet (…Cm, …Mm).
 *
 * @module lib/calculations/home/home-calculations
 */

const round = (v: number, d = 2) => {
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
};

function assertPositive(label: string, ...values: number[]) {
  if (values.some((v) => !(v > 0))) throw new Error(`${label} må være større enn null`);
}

// ---------------------------------------------------------------------------
// Maling
// ---------------------------------------------------------------------------

/** Standard dørflate: 0,9 × 2,1 m */
export const DOOR_AREA_M2 = 1.9;
/** Standard vindu: ca. 1,2 × 1,2 m */
export const WINDOW_AREA_M2 = 1.5;
/** Typisk dekkevne for innvendig veggmaling, m² per liter og strøk */
export const DEFAULT_COVERAGE_M2_PER_LITER = 10;

export interface PaintInputs {
  roomLength: number;
  roomWidth: number;
  wallHeight: number;
  numberOfDoors: number;
  numberOfWindows: number;
  numberOfCoats: number;
  coveragePerLiter: number;
  includeCeiling: boolean;
}

export interface PaintResults {
  wallArea: number;
  ceilingArea: number;
  openingsArea: number;
  paintableArea: number;
  litersNeeded: number;
  litersToBuy: number;
  cans2_7: number;
  cans9: number;
}

export function calculatePaint(i: PaintInputs): PaintResults {
  assertPositive('Rommålene', i.roomLength, i.roomWidth, i.wallHeight);
  assertPositive('Dekkevnen', i.coveragePerLiter);
  const wallArea = 2 * (i.roomLength + i.roomWidth) * i.wallHeight;
  const ceilingArea = i.includeCeiling ? i.roomLength * i.roomWidth : 0;
  const openingsArea = i.numberOfDoors * DOOR_AREA_M2 + i.numberOfWindows * WINDOW_AREA_M2;
  const paintableArea = Math.max(0, wallArea - openingsArea) + ceilingArea;
  const litersNeeded = (paintableArea * i.numberOfCoats) / i.coveragePerLiter;
  return {
    wallArea: round(wallArea),
    ceilingArea: round(ceilingArea),
    openingsArea: round(openingsArea),
    paintableArea: round(paintableArea),
    litersNeeded: round(litersNeeded),
    litersToBuy: Math.ceil(litersNeeded * 2) / 2,
    cans2_7: Math.ceil(litersNeeded / 2.7),
    cans9: Math.ceil(litersNeeded / 9),
  };
}

// ---------------------------------------------------------------------------
// Betong
// ---------------------------------------------------------------------------

/** Tetthet for ferdig herdet betong, kg/m³ */
export const CONCRETE_DENSITY = 2300;

export interface ConcreteInputs {
  length: number;
  width: number;
  /** Tykkelse i cm */
  thicknessCm: number;
  /** Tillegg for svinn i prosent */
  wastePercent: number;
}

export interface ConcreteResults {
  area: number;
  volume: number;
  volumeWithWaste: number;
  weightKg: number;
  bags25kg: number;
  bags20kg: number;
}

export function calculateConcrete(i: ConcreteInputs): ConcreteResults {
  assertPositive('Målene', i.length, i.width, i.thicknessCm);
  const area = i.length * i.width;
  const volume = area * (i.thicknessCm / 100);
  const volumeWithWaste = volume * (1 + i.wastePercent / 100);
  const weightKg = volumeWithWaste * CONCRETE_DENSITY;
  return {
    area: round(area),
    volume: round(volume, 3),
    volumeWithWaste: round(volumeWithWaste, 3),
    weightKg: Math.round(weightKg),
    bags25kg: Math.ceil(weightKg / 25),
    bags20kg: Math.ceil(weightKg / 20),
  };
}

// ---------------------------------------------------------------------------
// Fliser
// ---------------------------------------------------------------------------

export interface TileInputs {
  roomLength: number;
  roomWidth: number;
  /** Flisens mål i cm */
  tileLengthCm: number;
  tileWidthCm: number;
  wastePercent: number;
  tilesPerBox: number;
}

export interface TileResults {
  roomArea: number;
  tileArea: number;
  tilesNeeded: number;
  wasteTiles: number;
  totalTiles: number;
  boxes: number;
  areaToBuy: number;
}

export function calculateTiles(i: TileInputs): TileResults {
  assertPositive('Målene', i.roomLength, i.roomWidth, i.tileLengthCm, i.tileWidthCm);
  const roomArea = i.roomLength * i.roomWidth;
  const tileArea = (i.tileLengthCm / 100) * (i.tileWidthCm / 100);
  const tilesNeeded = Math.ceil(roomArea / tileArea);
  const totalTiles = Math.ceil(tilesNeeded * (1 + i.wastePercent / 100));
  return {
    roomArea: round(roomArea),
    tileArea: round(tileArea, 4),
    tilesNeeded,
    wasteTiles: totalTiles - tilesNeeded,
    totalTiles,
    boxes: i.tilesPerBox > 0 ? Math.ceil(totalTiles / i.tilesPerBox) : 0,
    areaToBuy: round(totalTiles * tileArea),
  };
}

// ---------------------------------------------------------------------------
// Tapet
// ---------------------------------------------------------------------------

export interface WallpaperInputs {
  roomLength: number;
  roomWidth: number;
  wallHeight: number;
  numberOfDoors: number;
  numberOfWindows: number;
  /** Rullbredde i cm (standard 53 cm) */
  rollWidthCm: number;
  /** Rulllengde i meter (standard 10,05 m) */
  rollLength: number;
  /** Mønsterrapport i cm (0 hvis ingen) */
  patternRepeatCm: number;
}

export interface WallpaperResults {
  perimeter: number;
  stripsNeeded: number;
  stripLength: number;
  stripsPerRoll: number;
  totalRolls: number;
  coveragePerRoll: number;
  totalWallArea: number;
}

export function calculateWallpaper(i: WallpaperInputs): WallpaperResults {
  assertPositive('Målene', i.roomLength, i.roomWidth, i.wallHeight, i.rollWidthCm, i.rollLength);
  const perimeter = 2 * (i.roomLength + i.roomWidth);
  // Dører trekker fra full banebredde. Vinduer trekkes ikke fra, siden det trengs
  // tapet over og under vinduet.
  const effectivePerimeter = Math.max(0, perimeter - i.numberOfDoors * 0.9);
  const rollWidth = i.rollWidthCm / 100;
  const stripsNeeded = Math.ceil(effectivePerimeter / rollWidth);
  // Banelengde: høyde + 10 cm margin, rundet opp til hele mønsterrapporter
  let stripLength = i.wallHeight + 0.1;
  if (i.patternRepeatCm > 0) {
    const repeat = i.patternRepeatCm / 100;
    stripLength = Math.ceil(stripLength / repeat) * repeat;
  }
  const stripsPerRoll = Math.max(1, Math.floor(i.rollLength / stripLength));
  const totalRolls = Math.ceil(stripsNeeded / stripsPerRoll);
  return {
    perimeter: round(perimeter),
    stripsNeeded,
    stripLength: round(stripLength),
    stripsPerRoll,
    totalRolls,
    coveragePerRoll: round(rollWidth * i.rollLength),
    totalWallArea: round(perimeter * i.wallHeight),
  };
}

// ---------------------------------------------------------------------------
// Teppe og gulvbelegg
// ---------------------------------------------------------------------------

export interface CarpetInputs {
  roomLength: number;
  roomWidth: number;
  /** Rullbredde i meter (vanligvis 2, 3, 4 eller 5 m) */
  rollWidth: number;
  /** Pris per m² */
  pricePerM2: number;
}

export interface CarpetResults {
  roomArea: number;
  /** Løpemeter rull som må kjøpes */
  runningMeters: number;
  /** Areal du betaler for */
  purchasedArea: number;
  wastePercent: number;
  estimatedCost: number;
}

export function calculateCarpet(i: CarpetInputs): CarpetResults {
  assertPositive('Målene', i.roomLength, i.roomWidth, i.rollWidth);
  const roomArea = i.roomLength * i.roomWidth;
  // Prøv begge retninger og velg den som gir minst forbruk
  const option = (along: number, across: number) => {
    const strips = Math.ceil(across / i.rollWidth);
    return strips * (along + 0.1); // 10 cm tilpasning per bane
  };
  const runningMeters = Math.min(option(i.roomLength, i.roomWidth), option(i.roomWidth, i.roomLength));
  const purchasedArea = runningMeters * i.rollWidth;
  return {
    roomArea: round(roomArea),
    runningMeters: round(runningMeters),
    purchasedArea: round(purchasedArea),
    wastePercent: round(((purchasedArea - roomArea) / roomArea) * 100, 1),
    estimatedCost: Math.round(purchasedArea * i.pricePerM2),
  };
}

// ---------------------------------------------------------------------------
// Strømkostnad
// ---------------------------------------------------------------------------

export interface ElectricityCostInputs {
  watts: number;
  hoursPerDay: number;
  daysPerMonth: number;
  /** Strømpris i øre per kWh (inkl. MVA) */
  powerPriceOre: number;
  /** Nettleie (energiledd) i øre per kWh */
  gridPriceOre: number;
}

export interface ElectricityCostResults {
  dailyKwh: number;
  monthlyKwh: number;
  yearlyKwh: number;
  dailyCost: number;
  monthlyCost: number;
  yearlyCost: number;
  totalPriceOre: number;
}

export function calculateElectricityCost(i: ElectricityCostInputs): ElectricityCostResults {
  if (i.watts < 0 || i.hoursPerDay < 0 || i.daysPerMonth < 0) throw new Error('Verdiene kan ikke være negative');
  const totalPriceOre = i.powerPriceOre + i.gridPriceOre;
  const dailyKwh = (i.watts * i.hoursPerDay) / 1000;
  const monthlyKwh = dailyKwh * i.daysPerMonth;
  const yearlyKwh = monthlyKwh * 12;
  const krPerKwh = totalPriceOre / 100;
  return {
    dailyKwh: round(dailyKwh, 2),
    monthlyKwh: round(monthlyKwh, 1),
    yearlyKwh: Math.round(yearlyKwh),
    dailyCost: dailyKwh * krPerKwh,
    monthlyCost: monthlyKwh * krPerKwh,
    yearlyCost: yearlyKwh * krPerKwh,
    totalPriceOre,
  };
}

// ---------------------------------------------------------------------------
// Effektbehov for varmepumpe (oppvarming og kjøling)
// ---------------------------------------------------------------------------

export type InsulationLevel = 'passive' | 'modern' | 'average' | 'poor';
export type ClimateZone = 'coast' | 'inland' | 'cold';

/** Veiledende varmetap i W per m² ved dimensjonerende utetemperatur */
export const INSULATION_WATTS_PER_M2: Record<InsulationLevel, number> = {
  passive: 25,
  modern: 45,
  average: 75,
  poor: 110,
};

export const CLIMATE_FACTOR: Record<ClimateZone, number> = {
  coast: 1,
  inland: 1.2,
  cold: 1.4,
};

export interface HeatPumpInputs {
  roomLength: number;
  roomWidth: number;
  ceilingHeight: number;
  insulation: InsulationLevel;
  climate: ClimateZone;
  occupants: number;
  /** Mye sol / store vinduer mot sør og vest */
  sunnyRoom: boolean;
  isKitchen: boolean;
}

export interface HeatPumpResults {
  area: number;
  heatingKw: number;
  coolingKw: number;
  recommendedKw: number;
}

const HEAT_PUMP_SIZES = [2.5, 3.5, 5, 7, 9, 12, 16];

export function calculateHeatPumpNeed(i: HeatPumpInputs): HeatPumpResults {
  assertPositive('Romålene', i.roomLength, i.roomWidth, i.ceilingHeight);
  const area = i.roomLength * i.roomWidth;
  const heightFactor = i.ceilingHeight / 2.4;
  const heatingW = area * INSULATION_WATTS_PER_M2[i.insulation] * CLIMATE_FACTOR[i.climate] * heightFactor;
  // Kjøling: ca. 50 W/m² grunnlast + 100 W per person, tillegg for sol og kjøkken
  let coolingW = area * 50 * heightFactor + i.occupants * 100;
  if (i.sunnyRoom) coolingW += area * 20;
  if (i.isKitchen) coolingW += 1000;
  const need = Math.max(heatingW, coolingW) / 1000;
  const recommended = HEAT_PUMP_SIZES.find((s) => s >= need) ?? Math.ceil(need);
  return {
    area: round(area),
    heatingKw: round(heatingW / 1000, 1),
    coolingKw: round(coolingW / 1000, 1),
    recommendedKw: recommended,
  };
}

// ---------------------------------------------------------------------------
// Grus og pukk
// ---------------------------------------------------------------------------

export interface GravelInputs {
  length: number;
  width: number;
  depthCm: number;
  /** Løs tetthet i kg/m³ */
  density: number;
  /** Tillegg for setning / komprimering i prosent */
  compactionPercent: number;
}

export interface GravelResults {
  area: number;
  volume: number;
  volumeWithCompaction: number;
  tons: number;
  bigBags: number;
}

export function calculateGravel(i: GravelInputs): GravelResults {
  assertPositive('Målene', i.length, i.width, i.depthCm, i.density);
  const area = i.length * i.width;
  const volume = area * (i.depthCm / 100);
  const volumeWithCompaction = volume * (1 + i.compactionPercent / 100);
  const tons = (volumeWithCompaction * i.density) / 1000;
  return {
    area: round(area),
    volume: round(volume, 2),
    volumeWithCompaction: round(volumeWithCompaction, 2),
    tons: round(tons, 2),
    bigBags: Math.ceil(tons),
  };
}

// ---------------------------------------------------------------------------
// Gressfrø
// ---------------------------------------------------------------------------

export type SeedApplication = 'new' | 'overseed' | 'thicken';
export type LawnType = 'general' | 'sport' | 'shade' | 'ornamental';

/** Såmengde for ny plen i gram per m² */
export const SEED_RATE_NEW_G_PER_M2: Record<LawnType, number> = {
  general: 30,
  sport: 40,
  shade: 35,
  ornamental: 30,
};
const APPLICATION_FACTOR: Record<SeedApplication, number> = { new: 1, overseed: 0.5, thicken: 0.65 };

export interface GrassSeedInputs {
  length: number;
  width: number;
  application: SeedApplication;
  lawnType: LawnType;
}

export interface GrassSeedResults {
  area: number;
  rateGramsPerM2: number;
  seedKg: number;
  bags1kg: number;
  bags5kg: number;
  bags10kg: number;
}

export function calculateGrassSeed(i: GrassSeedInputs): GrassSeedResults {
  assertPositive('Målene', i.length, i.width);
  const area = i.length * i.width;
  const rate = SEED_RATE_NEW_G_PER_M2[i.lawnType] * APPLICATION_FACTOR[i.application];
  const seedKg = (area * rate) / 1000;
  return {
    area: round(area),
    rateGramsPerM2: round(rate, 1),
    seedKg: round(seedKg, 2),
    bags1kg: Math.ceil(seedKg / 1),
    bags5kg: Math.ceil(seedKg / 5),
    bags10kg: Math.ceil(seedKg / 10),
  };
}

// ---------------------------------------------------------------------------
// Gjerde
// ---------------------------------------------------------------------------

export interface FenceInputs {
  totalLength: number;
  /** Gjerdehøyde i cm */
  fenceHeightCm: number;
  postSpacing: number;
  numberOfGates: number;
  /** Bordbredde i mm */
  boardWidthMm: number;
  /** Mellomrom mellom bord i mm */
  boardGapMm: number;
}

export interface FenceResults {
  sections: number;
  posts: number;
  rails: number;
  railMeters: number;
  boards: number;
  concreteBags: number;
}

export function calculateFence(i: FenceInputs): FenceResults {
  assertPositive('Målene', i.totalLength, i.fenceHeightCm, i.postSpacing, i.boardWidthMm);
  const sections = Math.ceil(i.totalLength / i.postSpacing);
  const posts = sections + 1 + i.numberOfGates;
  const railsPerSection = i.fenceHeightCm >= 150 ? 3 : 2;
  const rails = sections * railsPerSection;
  const pitch = (i.boardWidthMm + i.boardGapMm) / 1000;
  const boards = Math.ceil(i.totalLength / pitch);
  return {
    sections,
    posts,
    rails,
    railMeters: round(rails * i.postSpacing, 1),
    boards,
    // Ca. 1 sekk (25 kg) hurtigstøp per stolpe
    concreteBags: posts,
  };
}

// ---------------------------------------------------------------------------
// Terrasse
// ---------------------------------------------------------------------------

export interface DeckingInputs {
  deckLength: number;
  deckWidth: number;
  /** Bordbredde i mm */
  boardWidthMm: number;
  /** Bordlengde i meter */
  boardLength: number;
  /** Mellomrom i mm */
  boardGapMm: number;
  /** Senteravstand mellom bjelker i cm */
  joistSpacingCm: number;
}

export interface DeckingResults {
  area: number;
  boardRows: number;
  boardsNeeded: number;
  boardMeters: number;
  joists: number;
  screws: number;
}

export function calculateDecking(i: DeckingInputs): DeckingResults {
  assertPositive('Målene', i.deckLength, i.deckWidth, i.boardWidthMm, i.boardLength, i.joistSpacingCm);
  // Bordene legges på tvers av bjelkene: radene dekker bredden, bordene går langs lengden
  const area = i.deckLength * i.deckWidth;
  const pitch = (i.boardWidthMm + i.boardGapMm) / 1000;
  const boardRows = Math.ceil(i.deckWidth / pitch);
  const boardsPerRow = Math.ceil(i.deckLength / i.boardLength);
  const boardsNeeded = Math.ceil(boardRows * boardsPerRow * 1.1);
  const joistSpacing = i.joistSpacingCm / 100;
  const joists = Math.ceil(i.deckLength / joistSpacing) + 1;
  // Bjelkene går på tvers av bordene, altså langs bredden
  const crossings = boardRows * joists;
  return {
    area: round(area),
    boardRows,
    boardsNeeded,
    boardMeters: round(boardRows * i.deckLength * 1.1, 1),
    joists,
    screws: crossings * 2,
  };
}

// ---------------------------------------------------------------------------
// Takvinkel
// ---------------------------------------------------------------------------

export interface RoofPitchInputs {
  /** Høyde fra raft til møne i meter */
  rise: number;
  /** Horisontal lengde fra raft til møne i meter */
  run: number;
}

export interface RoofPitchResults {
  degrees: number;
  percentage: number;
  ratio: string;
  rafterMultiplier: number;
  rafterLength: number;
  roofType: string;
}

export function calculateRoofPitch(i: RoofPitchInputs): RoofPitchResults {
  if (i.rise < 0) throw new Error('Høyden kan ikke være negativ');
  assertPositive('Den horisontale lengden', i.run);
  const radians = Math.atan(i.rise / i.run);
  const degrees = (radians * 180) / Math.PI;
  const multiplier = 1 / Math.cos(radians);
  let roofType = 'Flatt tak';
  if (degrees >= 45) roofType = 'Svært bratt tak';
  else if (degrees >= 30) roofType = 'Bratt tak';
  else if (degrees >= 15) roofType = 'Middels bratt tak (vanlig saltak)';
  else if (degrees >= 5) roofType = 'Lavt tak';
  return {
    degrees: round(degrees, 1),
    percentage: round((i.rise / i.run) * 100, 1),
    ratio: i.rise > 0 ? `1:${round(i.run / i.rise, 2)}` : 'flatt',
    rafterMultiplier: round(multiplier, 3),
    rafterLength: round(i.run * multiplier, 2),
    roofType,
  };
}

// ---------------------------------------------------------------------------
// Trapp
// ---------------------------------------------------------------------------

export interface StairInputs {
  /** Total høydeforskjell i cm */
  totalRiseCm: number;
  /** Tilgjengelig horisontal lengde i cm */
  availableRunCm: number;
  /** Trappeløpets bredde i cm */
  stairWidthCm: number;
}

export interface StairResults {
  numberOfRisers: number;
  numberOfTreads: number;
  riserHeightCm: number;
  treadDepthCm: number;
  totalRunCm: number;
  stringerLengthCm: number;
  comfortFormula: number;
  meetsCode: boolean;
  codeNotes: string[];
}

/** Ønsket opptrinn i cm som utgangspunkt */
export const IDEAL_RISER_CM = 17.5;
/** Minste inntrinn etter byggteknisk forskrift (TEK17 § 12-14), i cm */
export const MIN_TREAD_CM = 25;

export function calculateStairs(i: StairInputs): StairResults {
  assertPositive('Målene', i.totalRiseCm, i.availableRunCm, i.stairWidthCm);
  const numberOfRisers = Math.max(1, Math.round(i.totalRiseCm / IDEAL_RISER_CM));
  const riserHeightCm = i.totalRiseCm / numberOfRisers;
  const numberOfTreads = numberOfRisers - 1;
  const treadDepthCm = numberOfTreads > 0 ? i.availableRunCm / numberOfTreads : 0;
  const totalRunCm = treadDepthCm * numberOfTreads;
  const stringerLengthCm = Math.sqrt(i.totalRiseCm ** 2 + totalRunCm ** 2);
  const comfortFormula = 2 * riserHeightCm + treadDepthCm;

  const notes: string[] = [];
  let meetsCode = true;
  if (treadDepthCm < MIN_TREAD_CM) {
    meetsCode = false;
    notes.push(`Inntrinnet er under ${MIN_TREAD_CM} cm, som er minstekravet i TEK17. Trappen trenger mer plass.`);
  }
  if (riserHeightCm > 20) {
    notes.push('Opptrinnet er over 20 cm. Det er bratt og frarådes for fast trapp i bolig.');
  }
  if (i.stairWidthCm < 80) {
    meetsCode = false;
    notes.push('Trappeløpet bør være minst 80 cm bredt for rette løp internt i en bolig (TEK17).');
  }
  if (comfortFormula < 57 || comfortFormula > 65) {
    notes.push(`Trappeformelen (2 × opptrinn + inntrinn) er ${round(comfortFormula, 1)} cm. Behagelige trapper ligger rundt 60–64 cm.`);
  }
  if (i.totalRiseCm > 330) {
    notes.push('Høydeforskjeller over 3,3 m krever repos (TEK17 § 12-14).');
  }
  if (notes.length === 0) notes.push('Alle målene ser ut til å være innenfor anbefalingene.');

  return {
    numberOfRisers,
    numberOfTreads,
    riserHeightCm: round(riserHeightCm, 1),
    treadDepthCm: round(treadDepthCm, 1),
    totalRunCm: round(totalRunCm, 0),
    stringerLengthCm: round(stringerLengthCm, 0),
    comfortFormula: round(comfortFormula, 1),
    meetsCode,
    codeNotes: notes,
  };
}

// ---------------------------------------------------------------------------
// Areal
// ---------------------------------------------------------------------------

export type ShapeType = 'rectangle' | 'triangle' | 'circle' | 'trapezoid';

export interface AreaInputs {
  shape: ShapeType;
  length?: number;
  width?: number;
  height?: number;
  radius?: number;
  topWidth?: number;
  bottomWidth?: number;
}

export interface AreaResults {
  areaM2: number;
  areaDekar: number;
  areaHektar: number;
  areaSqFt: number;
  perimeter: number;
}

export function calculateArea(i: AreaInputs): AreaResults {
  let area = 0;
  let perimeter = 0;
  switch (i.shape) {
    case 'rectangle': {
      const l = i.length ?? 0, w = i.width ?? 0;
      assertPositive('Målene', l, w);
      area = l * w;
      perimeter = 2 * (l + w);
      break;
    }
    case 'triangle': {
      const b = i.length ?? 0, h = i.height ?? 0;
      assertPositive('Målene', b, h);
      area = 0.5 * b * h;
      // Likebeint trekant som anslag for omkretsen
      perimeter = b + 2 * Math.sqrt(h * h + (b / 2) ** 2);
      break;
    }
    case 'circle': {
      const r = i.radius ?? 0;
      assertPositive('Radius', r);
      area = Math.PI * r * r;
      perimeter = 2 * Math.PI * r;
      break;
    }
    case 'trapezoid': {
      const a = i.topWidth ?? 0, b = i.bottomWidth ?? 0, h = i.height ?? 0;
      assertPositive('Målene', a, b, h);
      area = 0.5 * (a + b) * h;
      perimeter = a + b + 2 * Math.sqrt(h * h + ((b - a) / 2) ** 2);
      break;
    }
  }
  return {
    areaM2: round(area, 2),
    areaDekar: round(area / 1000, 4),
    areaHektar: round(area / 10000, 5),
    areaSqFt: round(area * 10.7639, 1),
    perimeter: round(perimeter, 2),
  };
}

// ---------------------------------------------------------------------------
// Bassengvolum
// ---------------------------------------------------------------------------

export type PoolShape = 'rectangle' | 'round' | 'oval' | 'kidney';

export interface PoolVolumeInputs {
  shape: PoolShape;
  length: number;
  width: number;
  shallowDepth: number;
  deepDepth: number;
}

export interface PoolVolumeResults {
  surfaceArea: number;
  averageDepth: number;
  volumeM3: number;
  volumeLiters: number;
}

export function calculatePoolVolume(i: PoolVolumeInputs): PoolVolumeResults {
  assertPositive('Målene', i.length, i.shallowDepth, i.deepDepth);
  if (i.shape !== 'round') assertPositive('Bredden', i.width);
  let surface: number;
  switch (i.shape) {
    case 'rectangle': surface = i.length * i.width; break;
    case 'round': surface = Math.PI * (i.length / 2) ** 2; break;
    case 'oval': surface = Math.PI * (i.length / 2) * (i.width / 2); break;
    case 'kidney': surface = 0.45 * i.length * i.width; break;
  }
  const averageDepth = (i.shallowDepth + i.deepDepth) / 2;
  const volume = surface * averageDepth;
  return {
    surfaceArea: round(surface, 1),
    averageDepth: round(averageDepth, 2),
    volumeM3: round(volume, 1),
    volumeLiters: Math.round(volume * 1000),
  };
}

// ---------------------------------------------------------------------------
// Trelast
// ---------------------------------------------------------------------------

export interface LumberInputs {
  thicknessMm: number;
  widthMm: number;
  /** Lengde per stykk i meter */
  length: number;
  quantity: number;
  /** Pris per løpemeter */
  pricePerMeter: number;
}

export interface LumberResults {
  totalMeters: number;
  volumeM3: number;
  volumePerPieceM3: number;
  totalCost: number;
}

export function calculateLumber(i: LumberInputs): LumberResults {
  assertPositive('Målene', i.thicknessMm, i.widthMm, i.length, i.quantity);
  const volumePerPiece = (i.thicknessMm / 1000) * (i.widthMm / 1000) * i.length;
  const totalMeters = i.length * i.quantity;
  return {
    totalMeters: round(totalMeters, 1),
    volumeM3: round(volumePerPiece * i.quantity, 3),
    volumePerPieceM3: round(volumePerPiece, 4),
    totalCost: Math.round(totalMeters * i.pricePerMeter),
  };
}

// ---------------------------------------------------------------------------
// Gips
// ---------------------------------------------------------------------------

export type SheetSize = '900x2400' | '900x2700' | '1200x2400' | '1200x2700';

export const SHEET_AREAS: Record<SheetSize, number> = {
  '900x2400': 0.9 * 2.4,
  '900x2700': 0.9 * 2.7,
  '1200x2400': 1.2 * 2.4,
  '1200x2700': 1.2 * 2.7,
};

export interface DrywallInputs {
  roomLength: number;
  roomWidth: number;
  wallHeight: number;
  includeCeiling: boolean;
  numberOfDoors: number;
  numberOfWindows: number;
  sheetSize: SheetSize;
}

export interface DrywallResults {
  wallArea: number;
  ceilingArea: number;
  totalArea: number;
  areaPerSheet: number;
  sheetsNeeded: number;
  fillerKg: number;
  tapeMeters: number;
  screws: number;
}

export function calculateDrywall(i: DrywallInputs): DrywallResults {
  assertPositive('Romålene', i.roomLength, i.roomWidth, i.wallHeight);
  const wallArea = Math.max(
    0,
    2 * (i.roomLength + i.roomWidth) * i.wallHeight - i.numberOfDoors * DOOR_AREA_M2 - i.numberOfWindows * WINDOW_AREA_M2
  );
  const ceilingArea = i.includeCeiling ? i.roomLength * i.roomWidth : 0;
  const totalArea = wallArea + ceilingArea;
  const areaPerSheet = SHEET_AREAS[i.sheetSize];
  return {
    wallArea: round(wallArea),
    ceilingArea: round(ceilingArea),
    totalArea: round(totalArea),
    areaPerSheet: round(areaPerSheet, 2),
    sheetsNeeded: Math.ceil((totalArea * 1.1) / areaPerSheet),
    // Ca. 0,5 kg sparkel, 1,2 m fugeremse og 25 skruer per m²
    fillerKg: Math.ceil(totalArea * 0.5),
    tapeMeters: Math.ceil(totalArea * 1.2),
    screws: Math.ceil(totalArea * 25),
  };
}

// ---------------------------------------------------------------------------
// Solceller
// ---------------------------------------------------------------------------

export type SolarRegion = 'south' | 'west' | 'mid' | 'north';

/** Veiledende årsproduksjon i kWh per kWp for en godt orientert, uskygget takflate */
export const SOLAR_YIELD_KWH_PER_KWP: Record<SolarRegion, number> = {
  south: 900,
  west: 820,
  mid: 780,
  north: 700,
};

export interface SolarPanelInputs {
  /** Årsforbruk i kWh */
  annualUsageKwh: number;
  region: SolarRegion;
  /** Effekt per panel i W */
  panelWattage: number;
  /** Antall paneler du har plass til (0 = dimensjoner etter forbruk) */
  maxPanels: number;
  /** Installert pris per kWp i kroner */
  costPerKwp: number;
  /** Strømpris du sparer, kr/kWh (inkl. nettleie og MVA) */
  electricityPrice: number;
  /** Pris du får for overskuddsstrøm, kr/kWh */
  sellPrice: number;
  /** Andel av produksjonen du bruker selv, i prosent */
  selfUsePercent: number;
}

export interface SolarPanelResults {
  numberOfPanels: number;
  systemSizeKwp: number;
  annualProductionKwh: number;
  selfUseKwh: number;
  exportKwh: number;
  annualSavings: number;
  systemCost: number;
  paybackYears: number | null;
  netSavings25Years: number;
}

export function calculateSolarPanels(i: SolarPanelInputs): SolarPanelResults {
  assertPositive('Årsforbruket', i.annualUsageKwh);
  assertPositive('Paneleffekten', i.panelWattage);
  const yieldPerKwp = SOLAR_YIELD_KWH_PER_KWP[i.region];
  const neededKwp = i.annualUsageKwh / yieldPerKwp;
  let panels = Math.max(1, Math.ceil((neededKwp * 1000) / i.panelWattage));
  if (i.maxPanels > 0) panels = Math.min(panels, i.maxPanels);
  const kwp = (panels * i.panelWattage) / 1000;
  const production = kwp * yieldPerKwp;
  const selfUseKwh = Math.min(production * (i.selfUsePercent / 100), i.annualUsageKwh);
  const exportKwh = production - selfUseKwh;
  const savings = selfUseKwh * i.electricityPrice + exportKwh * i.sellPrice;
  const cost = kwp * i.costPerKwp;
  // 0,5 % årlig degradering
  let total25 = 0;
  for (let y = 0; y < 25; y++) total25 += savings * Math.pow(0.995, y);
  return {
    numberOfPanels: panels,
    systemSizeKwp: round(kwp, 2),
    annualProductionKwh: Math.round(production),
    selfUseKwh: Math.round(selfUseKwh),
    exportKwh: Math.round(exportKwh),
    annualSavings: Math.round(savings),
    systemCost: Math.round(cost),
    paybackYears: savings > 0 ? round(cost / savings, 1) : null,
    netSavings25Years: Math.round(total25 - cost),
  };
}

// ---------------------------------------------------------------------------
// Barkflis og jord
// ---------------------------------------------------------------------------

export interface MulchInputs {
  length: number;
  width: number;
  depthCm: number;
}

export interface MulchResults {
  area: number;
  volumeM3: number;
  liters: number;
  bags50l: number;
  bags80l: number;
}

export function calculateMulch(i: MulchInputs): MulchResults {
  assertPositive('Målene', i.length, i.width, i.depthCm);
  const area = i.length * i.width;
  const volume = area * (i.depthCm / 100);
  const liters = volume * 1000;
  return {
    area: round(area),
    volumeM3: round(volume, 2),
    liters: Math.round(liters),
    bags50l: Math.ceil(liters / 50),
    bags80l: Math.ceil(liters / 80),
  };
}
