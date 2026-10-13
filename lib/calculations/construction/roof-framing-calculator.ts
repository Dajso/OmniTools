/**
 * Taksperrer: sperrelengde, møneshøyde, vinkler og antall sperrer.
 * Takvinkel oppgis i grader, mål i meter og millimeter.
 *
 * @module lib/calculations/construction/roof-framing-calculator
 */

export class RoofFramingError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'RoofFramingError';
  }
}

/** Vanlige takvinkler i Norge (grader) */
export const COMMON_PITCHES: Record<string, number> = {
  '15': 15,
  '22': 22,
  '27': 27,
  '30': 30,
  '35': 35,
  '40': 40,
  '45': 45,
};

/** Vanlige senteravstander mellom sperrer (mm) */
export const COMMON_RAFTER_SPACINGS = {
  '400': 400,
  '600': 600,
  '900': 900,
} as const;

export interface RoofFramingInput {
  /** Husbredde (ytterkant vegg til ytterkant vegg) i meter */
  spanM: number;
  /** Takvinkel i grader */
  pitchDeg: number;
  /** Senteravstand mellom sperrer i mm */
  rafterSpacingMm: number;
  /** Takutstikk (horisontalt) i cm */
  overhangCm: number;
  /** Byggets lengde i meter (valgfritt, for antall sperrer og takflate) */
  buildingLengthM?: number;
}

export interface RoofFramingResult {
  runM: number;
  riseM: number;
  ridgeHeightM: number;
  rafterLengthM: number;
  overhangRafterM: number;
  totalRafterLengthM: number;
  slopeDeg: number;
  slopePercent: number;
  plumbCutDeg: number;
  seatCutDeg: number;
  raftersPerSide?: number;
  totalRafters?: number;
  roofAreaM2?: number;
}

const round = (v: number, d = 3) => Math.round(v * 10 ** d) / 10 ** d;

function validate(input: RoofFramingInput): void {
  const { spanM, pitchDeg, rafterSpacingMm, overhangCm, buildingLengthM } = input;
  for (const [v, name, field] of [
    [spanM, 'Husbredden', 'spanM'],
    [pitchDeg, 'Takvinkelen', 'pitchDeg'],
    [rafterSpacingMm, 'Avstanden mellom sperrene', 'rafterSpacingMm'],
  ] as const) {
    if (v === undefined || v === null || Number.isNaN(v)) throw new RoofFramingError(`${name} må være et gyldig tall`, field);
    if (v <= 0) throw new RoofFramingError(`${name} må være større enn 0`, field);
  }
  if (spanM > 30) throw new RoofFramingError('Husbredden er over 30 m. Kontakt en rådgivende ingeniør for så store spenn.', 'spanM');
  if (pitchDeg >= 80) throw new RoofFramingError('Takvinkelen må være under 80°', 'pitchDeg');
  if (rafterSpacingMm > 1200) throw new RoofFramingError('Avstanden mellom sperrene er over 1 200 mm', 'rafterSpacingMm');
  if (Number.isNaN(overhangCm) || overhangCm < 0) throw new RoofFramingError('Takutstikket kan ikke være negativt', 'overhangCm');
  if (overhangCm > 120) throw new RoofFramingError('Takutstikket er over 120 cm', 'overhangCm');
  if (buildingLengthM !== undefined && (Number.isNaN(buildingLengthM) || buildingLengthM <= 0)) {
    throw new RoofFramingError('Byggets lengde må være større enn 0', 'buildingLengthM');
  }
}

export function calculateRoofFraming(input: RoofFramingInput): RoofFramingResult {
  validate(input);
  const { spanM, pitchDeg, rafterSpacingMm, overhangCm, buildingLengthM } = input;

  const slope = (pitchDeg * Math.PI) / 180;
  const runM = spanM / 2;
  const riseM = runM * Math.tan(slope);
  const rafterLengthM = runM / Math.cos(slope);
  const overhangRafterM = overhangCm / 100 / Math.cos(slope);
  const totalRafterLengthM = rafterLengthM + overhangRafterM;

  const result: RoofFramingResult = {
    runM: round(runM),
    riseM: round(riseM),
    ridgeHeightM: round(riseM),
    rafterLengthM: round(rafterLengthM),
    overhangRafterM: round(overhangRafterM),
    totalRafterLengthM: round(totalRafterLengthM),
    slopeDeg: pitchDeg,
    slopePercent: round(Math.tan(slope) * 100, 1),
    plumbCutDeg: pitchDeg,
    seatCutDeg: round(90 - pitchDeg, 2),
  };

  if (buildingLengthM !== undefined) {
    const perSide = Math.ceil((buildingLengthM * 1000) / rafterSpacingMm) + 1;
    result.raftersPerSide = perSide;
    result.totalRafters = perSide * 2;
    result.roofAreaM2 = round(2 * totalRafterLengthM * buildingLengthM, 1);
  }
  return result;
}

export function calculateRafterLength(runM: number, pitchDeg: number, overhangCm = 0): number {
  const slope = (pitchDeg * Math.PI) / 180;
  return (runM + overhangCm / 100) / Math.cos(slope);
}

export function calculateNumberOfRafters(buildingLengthM: number, spacingMm: number): number {
  return Math.ceil((buildingLengthM * 1000) / spacingMm) + 1;
}
