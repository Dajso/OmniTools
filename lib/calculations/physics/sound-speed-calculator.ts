/**
 * Sound Speed Calculator
 * 
 * Calculates the speed of sound in various media based on temperature
 * and other physical properties.
 * 
 * In air: v = 331.3 × √(1 + T/273.15) m/s
 * where T is temperature in Celsius
 * 
 * Simplified: v ≈ 331.3 + 0.606 × T m/s
 * 
 * @module lib/calculations/physics/sound-speed-calculator
 * @see Requirements 31.4, 31.7
 */

/**
 * Error class for sound speed calculation errors
 */
export class SoundSpeedError extends Error {
  constructor(
    message: string,
    public code: 'invalid_input' | 'out_of_range',
    public field?: string
  ) {
    super(message);
    this.name = 'SoundSpeedError';
  }
}

/**
 * Speed of sound at 0°C in dry air (m/s)
 */
export const SOUND_SPEED_0C = 331.3;

/**
 * Temperature coefficient for sound speed in air (m/s per °C)
 */
export const SOUND_SPEED_COEFFICIENT = 0.606;

/**
 * Speed of sound in various media at 20°C (m/s)
 */
export const SOUND_SPEEDS: Record<string, number> = {
  // Gases (at 20°C, 1 atm)
  air: 343,
  helium: 1007,
  hydrogen: 1270,
  nitrogen: 349,
  oxygen: 326,
  carbon_dioxide: 267,
  methane: 446,
  
  // Liquids (at 20°C)
  water_fresh: 1481,
  water_sea: 1522,
  ethanol: 1162,
  glycerin: 1904,
  mercury: 1450,
  oil: 1324,
  
  // Solids
  aluminum: 6420,
  brass: 4700,
  copper: 4760,
  glass: 5640,
  gold: 3240,
  iron: 5960,
  lead: 1960,
  nickel: 6040,
  silver: 3650,
  steel: 5960,
  titanium: 6070,
  wood_oak: 3850,
  wood_pine: 3320,
  concrete: 3400,
  rubber: 1600,
  ice: 3980,
  bone: 4080,
};

/**
 * Medium type for sound propagation
 */
export type MediumType = 'gas' | 'liquid' | 'solid';

/**
 * Input for sound speed calculation
 */
export interface SoundSpeedInput {
  /** Temperature in Celsius */
  temperature: number;
  /** Medium for sound propagation (default: 'air') */
  medium?: string;
  /** Relative humidity as percentage (0-100, for air only) */
  humidity?: number;
}

/**
 * Result of sound speed calculation
 */
export interface SoundSpeedResult {
  /** Speed of sound in m/s */
  speedMps: number;
  /** Speed of sound in km/h */
  speedKmh: number;
  /** Speed of sound in mph */
  speedMph: number;
  /** Speed of sound in ft/s */
  speedFps: number;
  /** Speed of sound in knots */
  speedKnots: number;
  /** Formatted speed string */
  formattedSpeed: string;
  /** Medium used for calculation */
  medium: string;
  /** Temperature used for calculation */
  temperature: number;
  /** Mach 1 at this condition */
  mach1: number;
  /** Time for sound to travel 1 km */
  timePerKm: number;
  /** Time for sound to travel 1 mile */
  timePerMile: number;
}

/**
 * Calculate speed of sound in air based on temperature
 * 
 * Uses the formula: v = 331.3 × √(1 + T/273.15)
 * 
 * @param temperatureCelsius - Temperature in Celsius
 * @returns Speed of sound in m/s
 */
export function soundSpeedInAir(temperatureCelsius: number): number {
  // Validate temperature (absolute zero is -273.15°C)
  if (temperatureCelsius < -273.15) {
    throw new SoundSpeedError(
      'Temperature cannot be below absolute zero (-273.15°C)',
      'out_of_range',
      'temperature'
    );
  }
  
  // v = 331.3 × √(1 + T/273.15)
  return SOUND_SPEED_0C * Math.sqrt(1 + temperatureCelsius / 273.15);
}

/**
 * Calculate speed of sound in air with humidity correction
 * 
 * Humidity increases the speed of sound slightly because water vapor
 * is lighter than dry air.
 * 
 * @param temperatureCelsius - Temperature in Celsius
 * @param humidityPercent - Relative humidity (0-100)
 * @returns Speed of sound in m/s
 */
export function soundSpeedInAirWithHumidity(
  temperatureCelsius: number,
  humidityPercent: number
): number {
  if (humidityPercent < 0 || humidityPercent > 100) {
    throw new SoundSpeedError(
      'Humidity must be between 0 and 100 percent',
      'out_of_range',
      'humidity'
    );
  }
  
  const drySpeed = soundSpeedInAir(temperatureCelsius);
  
  // Humidity correction factor (approximate)
  // At 20°C, 100% humidity adds about 0.35% to sound speed
  const humidityFactor = 1 + (humidityPercent / 100) * 0.0035;
  
  return drySpeed * humidityFactor;
}

/**
 * Get the speed of sound in a specific medium
 * 
 * @param medium - Name of the medium
 * @returns Speed of sound in m/s, or undefined if medium not found
 */
export function getSoundSpeedInMedium(medium: string): number | undefined {
  const normalizedMedium = medium.toLowerCase().replace(/\s+/g, '_');
  return SOUND_SPEEDS[normalizedMedium];
}

/**
 * Calculate comprehensive sound speed results
 * 
 * @param input - Sound speed input parameters
 * @returns Complete sound speed results
 * 
 * @example
 * ```typescript
 * const result = calculateSoundSpeed({ temperature: 20 });
 * console.log(result.speedMps); // ~343 m/s
 * 
 * const result2 = calculateSoundSpeed({ temperature: 20, medium: 'water_fresh' });
 * console.log(result2.speedMps); // ~1481 m/s
 * ```
 */
export function calculateSoundSpeed(input: SoundSpeedInput): SoundSpeedResult {
  const { temperature, medium = 'air', humidity } = input;
  
  // Validate temperature
  if (temperature < -273.15) {
    throw new SoundSpeedError(
      'Temperature cannot be below absolute zero (-273.15°C)',
      'out_of_range',
      'temperature'
    );
  }
  
  let speedMps: number;
  
  if (medium.toLowerCase() === 'air') {
    // Calculate speed in air with optional humidity
    if (humidity !== undefined) {
      speedMps = soundSpeedInAirWithHumidity(temperature, humidity);
    } else {
      speedMps = soundSpeedInAir(temperature);
    }
  } else {
    // Look up speed in other media
    const mediumSpeed = getSoundSpeedInMedium(medium);
    if (mediumSpeed === undefined) {
      throw new SoundSpeedError(
        `Unknown medium: ${medium}`,
        'invalid_input',
        'medium'
      );
    }
    // For non-air media, we use the reference speed
    // Temperature effects on other media are more complex
    speedMps = mediumSpeed;
  }
  
  // Convert to other units
  const speedKmh = speedMps * 3.6;
  const speedMph = speedMps * 2.23694;
  const speedFps = speedMps * 3.28084;
  const speedKnots = speedMps * 1.94384;
  
  // Calculate time to travel distances
  const timePerKm = 1000 / speedMps;
  const timePerMile = 1609.34 / speedMps;
  
  return {
    speedMps,
    speedKmh,
    speedMph,
    speedFps,
    speedKnots,
    formattedSpeed: `${speedMps.toFixed(2)} m/s`,
    medium,
    temperature,
    mach1: speedMps,
    timePerKm,
    timePerMile,
  };
}

/**
 * Calculate Mach number (ratio of object speed to sound speed)
 * 
 * @param objectSpeed - Speed of the object in m/s
 * @param soundSpeed - Speed of sound in m/s
 * @returns Mach number
 */
export function calculateMachNumber(objectSpeed: number, soundSpeed: number): number {
  if (soundSpeed === 0) {
    throw new SoundSpeedError('Sound speed cannot be zero', 'invalid_input', 'soundSpeed');
  }
  return objectSpeed / soundSpeed;
}

/**
 * Calculate the distance to a lightning strike based on thunder delay
 * 
 * @param delaySeconds - Time between lightning and thunder in seconds
 * @param temperatureCelsius - Air temperature in Celsius (default: 20)
 * @returns Distance in meters
 */
export function lightningDistance(
  delaySeconds: number,
  temperatureCelsius: number = 20
): number {
  const soundSpeed = soundSpeedInAir(temperatureCelsius);
  return soundSpeed * delaySeconds;
}

/**
 * Calculate the time for sound to travel a given distance
 * 
 * @param distanceMeters - Distance in meters
 * @param temperatureCelsius - Air temperature in Celsius (default: 20)
 * @returns Time in seconds
 */
export function soundTravelTime(
  distanceMeters: number,
  temperatureCelsius: number = 20
): number {
  const soundSpeed = soundSpeedInAir(temperatureCelsius);
  return distanceMeters / soundSpeed;
}

/**
 * Get the medium type (gas, liquid, or solid)
 * 
 * @param medium - Name of the medium
 * @returns Medium type
 */
export function getMediumType(medium: string): MediumType {
  const gases = ['air', 'helium', 'hydrogen', 'nitrogen', 'oxygen', 'carbon_dioxide', 'methane'];
  const liquids = ['water_fresh', 'water_sea', 'ethanol', 'glycerin', 'mercury', 'oil'];
  
  const normalizedMedium = medium.toLowerCase().replace(/\s+/g, '_');
  
  if (gases.includes(normalizedMedium)) return 'gas';
  if (liquids.includes(normalizedMedium)) return 'liquid';
  return 'solid';
}
