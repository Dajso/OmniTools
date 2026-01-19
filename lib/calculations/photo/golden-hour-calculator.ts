/**
 * Golden Hour / Blue Hour Calculator
 * 
 * Calculates sunrise, sunset, golden hour, and blue hour times
 * based on geographic location and date.
 * 
 * @module lib/calculations/photo/golden-hour-calculator
 */

export interface GoldenHourInput {
  latitude: number;
  longitude: number;
  date: Date;
  timezoneOffset?: number; // in minutes, defaults to local
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
    name: 'Night',
    description: 'Sun more than 18° below horizon',
    photographyTips: 'Astrophotography, star trails, light painting',
    colorTemperature: 'N/A',
  },
  'astronomical-twilight': {
    name: 'Astronomical Twilight',
    description: 'Sun 12° to 18° below horizon',
    photographyTips: 'Stars visible, good for Milky Way shots',
    colorTemperature: 'N/A',
  },
  'nautical-twilight': {
    name: 'Nautical Twilight',
    description: 'Sun 6° to 12° below horizon',
    photographyTips: 'Horizon visible, silhouettes possible',
    colorTemperature: '~10000K',
  },
  'blue-hour': {
    name: 'Blue Hour',
    description: 'Sun 4° to 6° below horizon',
    photographyTips: 'Deep blue sky, city lights balance with sky',
    colorTemperature: '9000-12000K',
  },
  'golden-hour': {
    name: 'Golden Hour',
    description: 'Sun near horizon (0° to 6° above)',
    photographyTips: 'Warm, soft light ideal for portraits and landscapes',
    colorTemperature: '2500-3500K',
  },
  'daylight': {
    name: 'Daylight',
    description: 'Sun more than 6° above horizon',
    photographyTips: 'Harsh shadows midday, use fill flash or shade',
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
  return `${hours}h ${mins}m`;
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

/**
 * Calculate golden hour and blue hour times
 */
export function calculateGoldenHour(input: GoldenHourInput): GoldenHourResult {
  const { latitude, longitude, date, timezoneOffset = new Date().getTimezoneOffset() } = input;
  
  // Validate inputs
  if (latitude < -90 || latitude > 90) {
    throw new Error('Latitude must be between -90 and 90 degrees');
  }
  if (longitude < -180 || longitude > 180) {
    throw new Error('Longitude must be between -180 and 180 degrees');
  }
  
  // Calculate key sun times
  const sunrise = findSunAltitudeTime(date, latitude, longitude, -0.833, true); // Account for refraction
  const sunset = findSunAltitudeTime(date, latitude, longitude, -0.833, false);
  
  if (!sunrise || !sunset) {
    throw new Error('Sun does not rise or set at this location on this date (polar day/night)');
  }
  
  // Solar noon is midpoint between sunrise and sunset
  const solarNoon = new Date((sunrise.getTime() + sunset.getTime()) / 2);
  const dayLength = (sunset.getTime() - sunrise.getTime()) / (60 * 1000);
  
  // Golden hour times (sun at 6° above to just below horizon)
  const morningGoldenHourStart = sunrise;
  const morningGoldenHourEnd = findSunAltitudeTime(date, latitude, longitude, 6, true) || sunrise;
  const eveningGoldenHourStart = findSunAltitudeTime(date, latitude, longitude, 6, false) || sunset;
  const eveningGoldenHourEnd = sunset;
  
  // Blue hour times (sun 4° to 6° below horizon)
  const morningBlueHourStart = findSunAltitudeTime(date, latitude, longitude, -6, true) || sunrise;
  const morningBlueHourEnd = findSunAltitudeTime(date, latitude, longitude, -4, true) || sunrise;
  const eveningBlueHourStart = findSunAltitudeTime(date, latitude, longitude, -4, false) || sunset;
  const eveningBlueHourEnd = findSunAltitudeTime(date, latitude, longitude, -6, false) || sunset;
  
  // Current phase
  const now = new Date();
  const jdNow = dateToJulianDay(now);
  const { altitude: currentAltitude } = calculateSunPosition(jdNow, latitude, longitude);
  const currentPhase = getLightPhase(currentAltitude);
  
  // Determine next phase and time to it
  const phases: { phase: LightPhase; time: Date }[] = [
    { phase: 'blue-hour', time: morningBlueHourStart },
    { phase: 'golden-hour', time: morningGoldenHourStart },
    { phase: 'daylight', time: morningGoldenHourEnd },
    { phase: 'golden-hour', time: eveningGoldenHourStart },
    { phase: 'blue-hour', time: eveningBlueHourStart },
    { phase: 'night', time: eveningBlueHourEnd },
  ].filter(p => p.time > now);
  
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
    
    currentPhase,
    nextPhase: nextPhaseInfo.phase,
    timeToNextPhase,
    
    formatted: {
      sunrise: formatTime(sunrise, timezoneOffset),
      sunset: formatTime(sunset, timezoneOffset),
      solarNoon: formatTime(solarNoon, timezoneOffset),
      morningGoldenHour: `${formatTime(morningGoldenHourStart, timezoneOffset)} - ${formatTime(morningGoldenHourEnd, timezoneOffset)}`,
      eveningGoldenHour: `${formatTime(eveningGoldenHourStart, timezoneOffset)} - ${formatTime(eveningGoldenHourEnd, timezoneOffset)}`,
      morningBlueHour: `${formatTime(morningBlueHourStart, timezoneOffset)} - ${formatTime(morningBlueHourEnd, timezoneOffset)}`,
      eveningBlueHour: `${formatTime(eveningBlueHourStart, timezoneOffset)} - ${formatTime(eveningBlueHourEnd, timezoneOffset)}`,
    },
  };
}

// Common city presets for quick selection
export const CITY_PRESETS = [
  { name: 'New York', latitude: 40.7128, longitude: -74.0060 },
  { name: 'Los Angeles', latitude: 34.0522, longitude: -118.2437 },
  { name: 'London', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Paris', latitude: 48.8566, longitude: 2.3522 },
  { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503 },
  { name: 'Sydney', latitude: -33.8688, longitude: 151.2093 },
  { name: 'Dubai', latitude: 25.2048, longitude: 55.2708 },
  { name: 'Singapore', latitude: 1.3521, longitude: 103.8198 },
];
