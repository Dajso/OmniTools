/**
 * Sol: soloppgang, solnedgang, solhøyde, gylden time og blå time.
 * Støtter midnattssol og mørketid for steder nord for polarsirkelen.
 *
 * Beregningen følger den vanlige forenklede formelen for soloppgang (NOAA / Almanac for Computers)
 * og er nøyaktig til noen få minutter på de fleste breddegrader.
 *
 * @module lib/calculations/travel/sun-calculator
 */

export type PolarState = 'normal' | 'midnight-sun' | 'polar-night';

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface SunTimes {
  polarState: PolarState;
  /** Null ved midnattssol og mørketid */
  sunrise: Date | null;
  sunset: Date | null;
  solarNoon: Date;
  goldenHourMorning: TimeRange | null;
  goldenHourEvening: TimeRange | null;
  blueHourMorning: TimeRange | null;
  blueHourEvening: TimeRange | null;
  /** Dagens lengde i minutter (1440 ved midnattssol, 0 ved mørketid) */
  dayLengthMinutes: number;
  /** Solhøyde over horisonten ved høyeste punkt (middag), i grader */
  sunAngleAtNoon: number;
}

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const toJulian = (date: Date) => date.getTime() / 86400000 + 2440587.5;
const fromJulian = (jd: number) => new Date((jd - 2440587.5) * 86400000);

/** Soloppgang/solnedgang er definert som solas øvre kant ved horisonten, med refraksjon: −0,833° */
const SUN_HORIZON_DEG = -0.833;
const GOLDEN_HOUR_TOP_DEG = 6;
const GOLDEN_HOUR_BOTTOM_DEG = -4;
const BLUE_HOUR_BOTTOM_DEG = -6;

export class SunCalculatorError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'SunCalculatorError';
  }
}

/**
 * Regner ut soltidene for en dato og et sted.
 *
 * @param latitude Breddegrad, −90 til 90
 * @param longitude Lengdegrad, −180 til 180 (øst positiv)
 * @param dateStr Dato som «ÅÅÅÅ-MM-DD»
 */
export function calculateSunTimes(latitude: number, longitude: number, dateStr: string): SunTimes {
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new SunCalculatorError('Breddegraden må være mellom −90 og 90', 'latitude');
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new SunCalculatorError('Lengdegraden må være mellom −180 og 180', 'longitude');
  }
  const day = new Date(`${dateStr}T12:00:00Z`);
  if (Number.isNaN(day.getTime())) {
    throw new SunCalculatorError('Ugyldig dato', 'date');
  }

  const jd = toJulian(day);
  const n = Math.round(jd - 2451545.0 + 0.0008);
  const jStar = n - longitude / 360;

  const M = (357.5291 + 0.98560028 * jStar) % 360;
  const Mr = rad(M);
  const C = 1.9148 * Math.sin(Mr) + 0.02 * Math.sin(2 * Mr) + 0.0003 * Math.sin(3 * Mr);
  const lambda = (M + C + 180 + 102.9372) % 360;
  const lr = rad(lambda);
  const jTransit = 2451545.0 + jStar + 0.0053 * Math.sin(Mr) - 0.0069 * Math.sin(2 * lr);
  const sinDelta = Math.sin(lr) * Math.sin(rad(23.44));
  const delta = Math.asin(sinDelta);
  const phi = rad(latitude);

  /** Timevinkel (grader) der solas sentrum er i gitt høyde. null = nås ikke denne dagen. */
  const hourAngleFor = (altitudeDeg: number): number | null => {
    const cosW = (Math.sin(rad(altitudeDeg)) - Math.sin(phi) * sinDelta) / (Math.cos(phi) * Math.cos(delta));
    if (cosW > 1 || cosW < -1) return null;
    return deg(Math.acos(cosW));
  };

  const riseSet = (altitudeDeg: number): { rise: Date; set: Date } | null => {
    const w = hourAngleFor(altitudeDeg);
    if (w === null) return null;
    return { rise: fromJulian(jTransit - w / 360), set: fromJulian(jTransit + w / 360) };
  };

  const solarNoon = fromJulian(jTransit);
  const sunAngleAtNoon = 90 - Math.abs(latitude - deg(delta));

  const horizon = riseSet(SUN_HORIZON_DEG);
  let polarState: PolarState = 'normal';
  if (!horizon) {
    // cos(timevinkel) under −1: sola er over horisonten hele døgnet (midnattssol), over 1: under hele døgnet (mørketid)
    const cosW = (Math.sin(rad(SUN_HORIZON_DEG)) - Math.sin(phi) * sinDelta) / (Math.cos(phi) * Math.cos(delta));
    polarState = cosW < -1 ? 'midnight-sun' : 'polar-night';
  }

  const gold = riseSet(GOLDEN_HOUR_TOP_DEG);
  const goldLow = riseSet(GOLDEN_HOUR_BOTTOM_DEG);
  const blueLow = riseSet(BLUE_HOUR_BOTTOM_DEG);

  const range = (a: Date | undefined, b: Date | undefined): TimeRange | null =>
    a && b ? { start: a, end: b } : null;

  // Gylden time: sola mellom −4° og +6°. Blå time: mellom −6° og −4°.
  const goldenHourMorning = range(goldLow?.rise, gold?.rise);
  const goldenHourEvening = range(gold?.set, goldLow?.set);
  const blueHourMorning = range(blueLow?.rise, goldLow?.rise);
  const blueHourEvening = range(goldLow?.set, blueLow?.set);

  const dayLengthMinutes =
    polarState === 'midnight-sun' ? 1440 : polarState === 'polar-night' ? 0 : ((horizon!.set.getTime() - horizon!.rise.getTime()) / 60000);

  return {
    polarState,
    sunrise: horizon ? horizon.rise : null,
    sunset: horizon ? horizon.set : null,
    solarNoon,
    goldenHourMorning,
    goldenHourEvening,
    blueHourMorning,
    blueHourEvening,
    dayLengthMinutes,
    sunAngleAtNoon,
  };
}

/** Klokkeslett (HH:MM, 24 timer) i en gitt tidssone. Uten tidssone brukes nettleserens. */
export function formatClock(date: Date, timeZone?: string): string {
  return date.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone });
}

/** Minutter siden midnatt i en gitt tidssone. */
export function minutesOfDay(date: Date, timeZone?: string): number {
  const parts = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone }).formatToParts(date);
  const h = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
  const m = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
  return h * 60 + m;
}

/** «14 t 25 min» */
export function formatDayLength(minutes: number): string {
  const total = Math.round(minutes);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h} t ${m} min`;
}
