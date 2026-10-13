/**
 * Golden Hour / Blue Hour Calculator
 * 
 * Calculates sunrise, sunset, golden hour, and blue hour times
 * based on geographic location and date.
 * 
 * @module lib/calculations/photo/golden-hour-calculator
 */

import { norwayUtcOffsetHours } from '../wedding/sunset-time';

export interface GoldenHourInput {
  latitude: number;
  longitude: number;
  date: Date;
  timezoneOffset?: number; // minutter (som Date.getTimezoneOffset), standard er norsk tid for steder i Norge ellers nettleserens tid
}

export interface SunTimes {
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
  dayLength: number; // in minutes
}

export interface GoldenHourResult {
  // Sun times
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
  dayLength: number; // minutes
  dayLengthFormatted: string;

  // Golden hour (sun 6° below to 6° above horizon)
  morningGoldenHourStart: Date;
  morningGoldenHourEnd: Date;
  eveningGoldenHourStart: Date;
  eveningGoldenHourEnd: Date;

  // Blue hour (sun 4° to 6° below horizon)
  morningBlueHourStart: Date;
  morningBlueHourEnd: Date;
  eveningBlueHourStart: Date;
  eveningBlueHourEnd: Date;

  // Fasene som ikke inntreffer denne dagen (for eksempel blå time midt på sommeren i nord)
  morningGoldenHourAllDay: boolean;
  eveningGoldenHourAllDay: boolean;
  blueHourMorningAvailable: boolean;
  blueHourEveningAvailable: boolean;

  // Current status
  currentPhase: LightPhase;
  nextPhase: LightPhase;
  timeToNextPhase: number; // minutes

  // Formatted times
  formatted: {
    sunrise: string;
    sunset: string;
    solarNoon: string;
    morningGoldenHour: string;
    eveningGoldenHour: string;
    morningBlueHour: string;
    eveningBlueHour: string;
  };
}

export type LightPhase =
  | 'night'
  | 'astronomical-twilight'
  | 'nautical-twilight'
  | 'blue-hour'
  | 'golden-hour'
  | 'daylight';

export interface PhaseInfo {
  name: string;
  description: string;
  photographyTips: string;
  colorTemperature: string;
}

export const LIGHT_PHASES: Record<LightPhase, PhaseInfo> = {
  'night': {
    name: 'Natt',
    description: 'Sola er mer enn 18° under horisonten',
    photographyTips: 'Astrofoto, stjernespor og lysmaling',
    colorTemperature: 'N/A',
  },
  'astronomical-twilight': {
    name: 'Astronomisk tussmørke',
    description: 'Sola er 12° til 18° under horisonten',
    photographyTips: 'Stjerner synlige, bra for bilder av Melkeveien',
    colorTemperature: 'N/A',
  },
  'nautical-twilight': {
    name: 'Nautisk tussmørke',
    description: 'Sola er 6° til 12° under horisonten',
    photographyTips: 'Horisonten er synlig, silhuetter er mulig',
    colorTemperature: '~10000K',
  },
  'blue-hour': {
    name: 'Blå time',
    description: 'Sola er 4° til 6° under horisonten',
    photographyTips: 'Dyp blå himmel, og byens lys balanserer mot himmelen',
    colorTemperature: '9000-12000K',
  },
  'golden-hour': {
    name: 'Gyllen time',
    description: 'Sola er nær horisonten (0° til 6° over)',
    photographyTips: 'Varmt, mykt lys som passer til portretter og landskap',
    colorTemperature: '2500-3500K',
  },
  'daylight': {
    name: 'Dagslys',
    description: 'Sola er mer enn 6° over horisonten',
    photographyTips: 'Harde skygger midt på dagen. Bruk fyllblits eller skygge',
    colorTemperature: '5000-6500K',
  },
};

// Constants for solar calculations
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

/**
 * Calculate Julian Day from a Date
 */
function dateToJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;

  let y = year;
  let m = month;

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);

  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + hour / 24 + b - 1524.5;
}

/**
 * Calculate sun position for a given Julian Day and location
 */
function calculateSunPosition(jd: number, latitude: number, longitude: number): { altitude: number; azimuth: number } {
  const n = jd - 2451545.0;
  const L = (280.460 + 0.9856474 * n) % 360;
  const g = (357.528 + 0.9856003 * n) % 360;
  const lambda = L + 1.915 * Math.sin(g * DEG_TO_RAD) + 0.020 * Math.sin(2 * g * DEG_TO_RAD);
  const epsilon = 23.439 - 0.0000004 * n;

  const sinLambda = Math.sin(lambda * DEG_TO_RAD);
  const cosLambda = Math.cos(lambda * DEG_TO_RAD);
  const sinEpsilon = Math.sin(epsilon * DEG_TO_RAD);
  const cosEpsilon = Math.cos(epsilon * DEG_TO_RAD);

  const ra = Math.atan2(cosEpsilon * sinLambda, cosLambda) * RAD_TO_DEG;
  const dec = Math.asin(sinEpsilon * sinLambda) * RAD_TO_DEG;

  const gmst = (18.697374558 + 24.06570982441908 * n) % 24;
  const lst = gmst + longitude / 15;
  const ha = (lst * 15 - ra) % 360;

  const sinLat = Math.sin(latitude * DEG_TO_RAD);
  const cosLat = Math.cos(latitude * DEG_TO_RAD);
  const sinDec = Math.sin(dec * DEG_TO_RAD);
  const cosDec = Math.cos(dec * DEG_TO_RAD);
  const cosHa = Math.cos(ha * DEG_TO_RAD);

  const altitude = Math.asin(sinLat * sinDec + cosLat * cosDec * cosHa) * RAD_TO_DEG;
  const azimuth = Math.atan2(
    Math.sin(ha * DEG_TO_RAD),
    cosHa * sinLat - Math.tan(dec * DEG_TO_RAD) * cosLat
  ) * RAD_TO_DEG + 180;

  return { altitude, azimuth };
}

/**
 * Find time when sun reaches a specific altitude
 */
function findSunAltitudeTime(
  date: Date,
  latitude: number,
  longitude: number,
  targetAltitude: number,
  rising: boolean
): Date | null {
  const startOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const msPerDay = 24 * 60 * 60 * 1000;

  // Binary search for the time
  let low = rising ? 0 : 0.5;
  let high = rising ? 0.5 : 1;

  for (let i = 0; i < 20; i++) {
    const mid = (low + high) / 2;
    const testTime = new Date(startOfDay.getTime() + mid * msPerDay);
    const jd = dateToJulianDay(testTime);
    const { altitude } = calculateSunPosition(jd, latitude, longitude);

    if (rising) {
      if (altitude < targetAltitude) {
        low = mid;
      } else {
        high = mid;
      }
    } else {
      if (altitude > targetAltitude) {
        low = mid;
      } else {
        high = mid;
      }
    }
  }

  const resultTime = new Date(startOfDay.getTime() + ((low + high) / 2) * msPerDay);

  // Verify the result is valid
  const jd = dateToJulianDay(resultTime);
  const { altitude } = calculateSunPosition(jd, latitude, longitude);
  if (Math.abs(altitude - targetAltitude) > 1) {
    return null; // Sun doesn't reach this altitude on this day
  }

  return resultTime;
}

/**
 * Format time as HH:MM
 */
function formatTime(date: Date, timezoneOffset: number): string {
  const localDate = new Date(date.getTime() - timezoneOffset * 60 * 1000);
  const hours = localDate.getUTCHours().toString().padStart(2, '0');
  const minutes = localDate.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Format duration in minutes to hours and minutes
 */
function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours} t ${mins} min`;
}

/**
 * Get current light phase based on sun altitude
 */
function getLightPhase(altitude: number): LightPhase {
  if (altitude > 6) return 'daylight';
  if (altitude > 0) return 'golden-hour';
  if (altitude > -4) return 'golden-hour'; // Civil twilight, still golden
  if (altitude > -6) return 'blue-hour';
  if (altitude > -12) return 'nautical-twilight';
  if (altitude > -18) return 'astronomical-twilight';
  return 'night';
}

/** Grov avgrensing av Norge (inkl. Svalbard) for å velge norsk tid */
function isInNorway(latitude: number, longitude: number): boolean {
  return latitude >= 57.5 && latitude <= 81 && longitude >= 4 && longitude <= 32;
}

/** Standard tidssone: norsk tid (med sommertid på valgt dato) i Norge, ellers nettleserens tid på valgt dato */
function defaultTimezoneOffset(date: Date, latitude: number, longitude: number): number {
  if (isInNorway(latitude, longitude)) {
    return -norwayUtcOffsetHours(date) * 60;
  }
  return date.getTimezoneOffset();
}

/** True hvis sola er over horisonten hele døgnet (midnattssol), false ved mørketid */
function isMidnightSun(date: Date, latitude: number, longitude: number): boolean {
  const startOfDay = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  let minAlt = 90;
  for (let h = 0; h < 24; h++) {
    const { altitude } = calculateSunPosition(dateToJulianDay(new Date(startOfDay + h * 3600 * 1000)), latitude, longitude);
    if (altitude < minAlt) minAlt = altitude;
  }
  return minAlt > -0.833;
}

/**
 * Calculate golden hour and blue hour times
 */
export function calculateGoldenHour(input: GoldenHourInput): GoldenHourResult {
  const { latitude, longitude, date } = input;
  const timezoneOffset = input.timezoneOffset ?? defaultTimezoneOffset(date, latitude, longitude);

  // Validate inputs
  if (latitude < -90 || latitude > 90) {
    throw new Error('Breddegrad må være mellom -90 og 90 grader');
  }
  if (longitude < -180 || longitude > 180) {
    throw new Error('Lengdegrad må være mellom -180 og 180 grader');
  }

  // Calculate key sun times
  const sunrise = findSunAltitudeTime(date, latitude, longitude, -0.833, true); // Account for refraction
  const sunset = findSunAltitudeTime(date, latitude, longitude, -0.833, false);

  if (!sunrise || !sunset) {
    throw new Error(
      isMidnightSun(date, latitude, longitude)
        ? 'Midnattssol: sola går ikke ned på dette stedet denne datoen.'
        : 'Mørketid: sola kommer ikke over horisonten på dette stedet denne datoen.'
    );
  }

  // Solar noon is midpoint between sunrise and sunset
  const solarNoon = new Date((sunrise.getTime() + sunset.getTime()) / 2);
  const dayLength = (sunset.getTime() - sunrise.getTime()) / (60 * 1000);

  // Golden hour times (sun at 6° above to just below horizon)
  const morningGoldenHourStart = sunrise;
  const morningGoldenHourEndRaw = findSunAltitudeTime(date, latitude, longitude, 6, true);
  const eveningGoldenHourStartRaw = findSunAltitudeTime(date, latitude, longitude, 6, false);
  const morningGoldenHourEnd = morningGoldenHourEndRaw || sunrise;
  const eveningGoldenHourStart = eveningGoldenHourStartRaw || sunset;
  const eveningGoldenHourEnd = sunset;

  // Blue hour times (sun 4° to 6° below horizon)
  const morningBlueHourStartRaw = findSunAltitudeTime(date, latitude, longitude, -6, true);
  const morningBlueHourEndRaw = findSunAltitudeTime(date, latitude, longitude, -4, true);
  const eveningBlueHourStartRaw = findSunAltitudeTime(date, latitude, longitude, -4, false);
  const eveningBlueHourEndRaw = findSunAltitudeTime(date, latitude, longitude, -6, false);
  const morningBlueHourStart = morningBlueHourStartRaw || sunrise;
  const morningBlueHourEnd = morningBlueHourEndRaw || sunrise;
  const eveningBlueHourStart = eveningBlueHourStartRaw || sunset;
  const eveningBlueHourEnd = eveningBlueHourEndRaw || sunset;
  const blueHourMorningAvailable = !!(morningBlueHourStartRaw && morningBlueHourEndRaw);
  const blueHourEveningAvailable = !!(eveningBlueHourStartRaw && eveningBlueHourEndRaw);
  const morningGoldenHourAllDay = !morningGoldenHourEndRaw;
  const eveningGoldenHourAllDay = !eveningGoldenHourStartRaw;

  // Current phase
  const now = new Date();
  const jdNow = dateToJulianDay(now);
  const { altitude: currentAltitude } = calculateSunPosition(jdNow, latitude, longitude);
  const currentPhase = getLightPhase(currentAltitude);

  // Determine next phase and time to it
  const phases = ([
    { phase: 'blue-hour', time: morningBlueHourStart },
    { phase: 'golden-hour', time: morningGoldenHourStart },
    { phase: 'daylight', time: morningGoldenHourEnd },
    { phase: 'golden-hour', time: eveningGoldenHourStart },
    { phase: 'blue-hour', time: eveningBlueHourStart },
    { phase: 'night', time: eveningBlueHourEnd },
  ] as { phase: LightPhase; time: Date }[]).filter(p => p.time > now);

  const nextPhaseInfo = phases[0] || { phase: 'night' as LightPhase, time: eveningBlueHourEnd };
  const timeToNextPhase = Math.max(0, (nextPhaseInfo.time.getTime() - now.getTime()) / (60 * 1000));

  return {
    sunrise,
    sunset,
    solarNoon,
    dayLength,
    dayLengthFormatted: formatDuration(dayLength),

    morningGoldenHourStart,
    morningGoldenHourEnd,
    eveningGoldenHourStart,
    eveningGoldenHourEnd,

    morningBlueHourStart,
    morningBlueHourEnd,
    eveningBlueHourStart,
    eveningBlueHourEnd,

    morningGoldenHourAllDay,
    eveningGoldenHourAllDay,
    blueHourMorningAvailable,
    blueHourEveningAvailable,

    currentPhase,
    nextPhase: nextPhaseInfo.phase,
    timeToNextPhase,

    formatted: {
      sunrise: formatTime(sunrise, timezoneOffset),
      sunset: formatTime(sunset, timezoneOffset),
      solarNoon: formatTime(solarNoon, timezoneOffset),
      morningGoldenHour: morningGoldenHourAllDay
        ? 'Hele dagen (sola kommer ikke over 6°)'
        : `${formatTime(morningGoldenHourStart, timezoneOffset)} – ${formatTime(morningGoldenHourEnd, timezoneOffset)}`,
      eveningGoldenHour: eveningGoldenHourAllDay
        ? 'Hele dagen (sola kommer ikke over 6°)'
        : `${formatTime(eveningGoldenHourStart, timezoneOffset)} – ${formatTime(eveningGoldenHourEnd, timezoneOffset)}`,
      morningBlueHour: blueHourMorningAvailable
        ? `${formatTime(morningBlueHourStart, timezoneOffset)} – ${formatTime(morningBlueHourEnd, timezoneOffset)}`
        : 'Ikke i dag (sola kommer ikke langt nok ned)',
      eveningBlueHour: blueHourEveningAvailable
        ? `${formatTime(eveningBlueHourStart, timezoneOffset)} – ${formatTime(eveningBlueHourEnd, timezoneOffset)}`
        : 'Ikke i dag (sola kommer ikke langt nok ned)',
    },
  };
}

// Common city presets for quick selection
export const CITY_PRESETS = [
  { name: 'Oslo', latitude: 59.9139, longitude: 10.7522 },
  { name: 'Kristiansand', latitude: 58.1467, longitude: 7.9956 },
  { name: 'Stavanger', latitude: 58.97, longitude: 5.7331 },
  { name: 'Bergen', latitude: 60.3913, longitude: 5.3221 },
  { name: 'Trondheim', latitude: 63.4305, longitude: 10.3951 },
  { name: 'Bodø', latitude: 67.2804, longitude: 14.4049 },
  { name: 'Tromsø', latitude: 69.6492, longitude: 18.9553 },
  { name: 'Alta', latitude: 69.9689, longitude: 23.2716 },
];
