/**
 * Time Lapse Calculator
 * 
 * Calculates timelapse parameters including interval, total frames,
 * and storage requirements.
 * 
 * @module lib/calculations/photo/timelapse-calculator
 * @see Requirements 23.2, 23.12
 */

/**
 * Input parameters for timelapse calculation
 */
export interface TimelapseInput {
  /** Duration of the event being captured in seconds */
  eventDuration: number;
  /** Desired output video duration in seconds */
  outputDuration: number;
  /** Output video frame rate in fps */
  frameRate: number;
}

/**
 * Result of timelapse calculation
 */
export interface TimelapseResult {
  /** Total number of frames needed */
  totalFrames: number;
  /** Interval between shots in seconds */
  intervalSeconds: number;
  /** Interval between shots in milliseconds */
  intervalMs: number;
  /** Estimated storage requirement in MB (based on image size) */
  storageEstimateMB: number;
  /** Estimated storage requirement in GB */
  storageEstimateGB: number;
  /** Effective speed-up factor */
  speedUpFactor: number;
  /** Shooting duration formatted as HH:MM:SS */
  shootingDurationFormatted: string;
  /** Output duration formatted as MM:SS */
  outputDurationFormatted: string;
}

/**
 * Image quality presets with estimated file sizes in MB
 */
export interface ImageQualityPreset {
  name: string;
  description: string;
  /** Estimated file size per image in MB */
  fileSizeMB: number;
}

/**
 * Common image quality presets
 */
export const IMAGE_QUALITY_PRESETS: Record<string, ImageQualityPreset> = {
  'raw-high': {
    name: 'RAW (høy oppløsning)',
    description: 'RAW-filer på 45+ MP',
    fileSizeMB: 60,
  },
  'raw-medium': {
    name: 'RAW (middels oppløsning)',
    description: 'RAW-filer på 24–30 MP',
    fileSizeMB: 35,
  },
  'raw-low': {
    name: 'RAW (lav oppløsning)',
    description: 'RAW-filer på 12–20 MP',
    fileSizeMB: 20,
  },
  'jpeg-high': {
    name: 'JPEG (høy kvalitet)',
    description: 'Store, fine JPEG-filer',
    fileSizeMB: 12,
  },
  'jpeg-medium': {
    name: 'JPEG (middels kvalitet)',
    description: 'Middels store JPEG-filer',
    fileSizeMB: 6,
  },
  'jpeg-low': {
    name: 'JPEG (lav kvalitet)',
    description: 'Små JPEG-filer',
    fileSizeMB: 2,
  },
};

/**
 * Common frame rates for video output
 */
export const COMMON_FRAME_RATES = [24, 25, 30, 48, 50, 60] as const;

/**
 * Calculate timelapse parameters
 * 
 * @param input - Timelapse calculation input parameters
 * @param imageSizeMB - Estimated size per image in MB (default: 10MB for JPEG)
 * @returns Complete timelapse calculation results
 * @throws Error if any input parameter is invalid
 * 
 * @example
 * ```typescript
 * const result = calculateTimelapse({
 *   eventDuration: 3600,  // 1 hour event
 *   outputDuration: 30,   // 30 second video
 *   frameRate: 24         // 24 fps
 * });
 * // result.totalFrames = 720
 * // result.intervalSeconds = 5
 * ```
 */
export function calculateTimelapse(
  input: TimelapseInput,
  imageSizeMB: number = 10
): TimelapseResult {
  const { eventDuration, outputDuration, frameRate } = input;
  
  // Validate inputs
  if (eventDuration <= 0) {
    throw new Error('Hendelsens varighet må være større enn 0');
  }
  if (outputDuration <= 0) {
    throw new Error('Videolengden må være større enn 0');
  }
  if (frameRate <= 0) {
    throw new Error('Bildefrekvensen må være større enn 0');
  }
  if (imageSizeMB <= 0) {
    throw new Error('Bildestørrelsen må være større enn 0');
  }
  
  // Calculate total frames needed
  // totalFrames = outputDuration × frameRate
  const totalFrames = Math.ceil(outputDuration * frameRate);
  
  // Calculate interval between shots
  // interval = eventDuration / totalFrames
  const intervalSeconds = eventDuration / totalFrames;
  const intervalMs = intervalSeconds * 1000;
  
  // Calculate storage requirements
  const storageEstimateMB = totalFrames * imageSizeMB;
  const storageEstimateGB = storageEstimateMB / 1024;
  
  // Calculate speed-up factor
  const speedUpFactor = eventDuration / outputDuration;
  
  // Format durations
  const shootingDurationFormatted = formatDuration(eventDuration);
  const outputDurationFormatted = formatDuration(outputDuration);
  
  return {
    totalFrames,
    intervalSeconds,
    intervalMs,
    storageEstimateMB,
    storageEstimateGB,
    speedUpFactor,
    shootingDurationFormatted,
    outputDurationFormatted,
  };
}

/**
 * Calculate timelapse from interval and event duration
 * 
 * @param eventDuration - Duration of event in seconds
 * @param intervalSeconds - Interval between shots in seconds
 * @param frameRate - Output video frame rate
 * @param imageSizeMB - Estimated size per image in MB
 * @returns Timelapse calculation results
 */
export function calculateTimelapseFromInterval(
  eventDuration: number,
  intervalSeconds: number,
  frameRate: number,
  imageSizeMB: number = 10
): TimelapseResult {
  if (eventDuration <= 0) {
    throw new Error('Hendelsens varighet må være større enn 0');
  }
  if (intervalSeconds <= 0) {
    throw new Error('Intervallet må være større enn 0');
  }
  if (frameRate <= 0) {
    throw new Error('Bildefrekvensen må være større enn 0');
  }
  
  // Calculate total frames from interval (floor to not exceed event duration)
  const totalFrames = Math.floor(eventDuration / intervalSeconds) + 1;
  
  // Calculate output duration
  const outputDuration = totalFrames / frameRate;
  
  // Calculate storage requirements
  const storageEstimateMB = totalFrames * imageSizeMB;
  const storageEstimateGB = storageEstimateMB / 1024;
  
  // Calculate speed-up factor
  const speedUpFactor = eventDuration / outputDuration;
  
  return {
    totalFrames,
    intervalSeconds,
    intervalMs: intervalSeconds * 1000,
    storageEstimateMB,
    storageEstimateGB,
    speedUpFactor,
    shootingDurationFormatted: formatDuration(eventDuration),
    outputDurationFormatted: formatDuration(outputDuration),
  };
}

/**
 * Calculate timelapse from total frames
 * 
 * @param eventDuration - Duration of event in seconds
 * @param totalFrames - Total number of frames to capture
 * @param frameRate - Output video frame rate
 * @param imageSizeMB - Estimated size per image in MB
 * @returns Timelapse calculation results
 */
export function calculateTimelapseFromFrames(
  eventDuration: number,
  totalFrames: number,
  frameRate: number,
  imageSizeMB: number = 10
): TimelapseResult {
  if (eventDuration <= 0) {
    throw new Error('Hendelsens varighet må være større enn 0');
  }
  if (totalFrames <= 0) {
    throw new Error('Antall bilder må være større enn 0');
  }
  if (frameRate <= 0) {
    throw new Error('Bildefrekvensen må være større enn 0');
  }
  
  // Calculate interval from frames
  const intervalSeconds = eventDuration / totalFrames;
  
  // Calculate output duration from frames
  const outputDuration = totalFrames / frameRate;
  
  // Calculate storage requirements
  const storageEstimateMB = totalFrames * imageSizeMB;
  const storageEstimateGB = storageEstimateMB / 1024;
  
  // Calculate speed-up factor
  const speedUpFactor = eventDuration / outputDuration;
  
  return {
    totalFrames,
    intervalSeconds,
    intervalMs: intervalSeconds * 1000,
    storageEstimateMB,
    storageEstimateGB,
    speedUpFactor,
    shootingDurationFormatted: formatDuration(eventDuration),
    outputDurationFormatted: formatDuration(outputDuration),
  };
}


/**
 * Format duration in seconds to HH:MM:SS or MM:SS format
 * 
 * @param seconds - Duration in seconds
 * @returns Formatted duration string
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Parse duration string (HH:MM:SS or MM:SS) to seconds
 * 
 * @param duration - Duration string
 * @returns Duration in seconds
 */
export function parseDuration(duration: string): number {
  const parts = duration.split(':').map(Number);
  
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }
  
  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }
  
  throw new Error('Ugyldig varighetsformat. Bruk TT:MM:SS eller MM:SS');
}

/**
 * Common timelapse scenarios with recommended intervals
 */
export interface TimelapseScenario {
  name: string;
  description: string;
  /** Recommended interval in seconds */
  recommendedInterval: number;
  /** Typical event duration in seconds */
  typicalDuration: number;
}

/**
 * Predefined timelapse scenarios
 */
export const TIMELAPSE_SCENARIOS: TimelapseScenario[] = [
  {
    name: 'Skyer',
    description: 'Skyer som beveger seg over himmelen',
    recommendedInterval: 5,
    typicalDuration: 3600, // 1 hour
  },
  {
    name: 'Solnedgang/soloppgang',
    description: 'Sol som går ned eller opp',
    recommendedInterval: 3,
    typicalDuration: 1800, // 30 minutes
  },
  {
    name: 'Stjerner/nattehimmel',
    description: 'Stjernespor eller Melkeveiens bevegelse',
    recommendedInterval: 30,
    typicalDuration: 14400, // 4 hours
  },
  {
    name: 'Blomster som springer ut',
    description: 'Blomst som åpner seg over tid',
    recommendedInterval: 300, // 5 minutes
    typicalDuration: 86400, // 24 hours
  },
  {
    name: 'Byggeprosjekt',
    description: 'Byggingens framdrift',
    recommendedInterval: 600, // 10 minutes
    typicalDuration: 28800, // 8 hours
  },
  {
    name: 'Trafikk',
    description: 'Trafikk i byen',
    recommendedInterval: 1,
    typicalDuration: 1800, // 30 minutes
  },
  {
    name: 'Menneskemengde',
    description: 'Mennesker som beveger seg gjennom et rom',
    recommendedInterval: 2,
    typicalDuration: 3600, // 1 hour
  },
  {
    name: 'Smeltende is',
    description: 'Is eller snø som smelter',
    recommendedInterval: 60, // 1 minute
    typicalDuration: 7200, // 2 hours
  },
  {
    name: 'Plantevekst',
    description: 'Plante som vokser over dager',
    recommendedInterval: 900, // 15 minutes
    typicalDuration: 604800, // 1 week
  },
  {
    name: 'Matlaging',
    description: 'Tilberedning av mat',
    recommendedInterval: 2,
    typicalDuration: 1800, // 30 minutes
  },
];

/**
 * Calculate battery life for timelapse shooting
 * 
 * @param totalFrames - Total number of frames
 * @param shotsPerBattery - Estimated shots per battery charge
 * @returns Number of batteries needed
 */
export function calculateBatteriesNeeded(
  totalFrames: number,
  shotsPerBattery: number = 500
): number {
  return Math.ceil(totalFrames / shotsPerBattery);
}

/**
 * Calculate memory card capacity needed
 * 
 * @param totalFrames - Total number of frames
 * @param imageSizeMB - Size per image in MB
 * @returns Required card capacity in GB
 */
export function calculateCardCapacity(
  totalFrames: number,
  imageSizeMB: number
): number {
  const totalMB = totalFrames * imageSizeMB;
  // Add 10% buffer
  return Math.ceil((totalMB * 1.1) / 1024);
}

/**
 * Suggest optimal interval based on event duration and desired output
 * 
 * @param eventDuration - Event duration in seconds
 * @param desiredOutputDuration - Desired output duration in seconds
 * @param frameRate - Output frame rate
 * @returns Suggested interval in seconds
 */
export function suggestInterval(
  eventDuration: number,
  desiredOutputDuration: number,
  frameRate: number
): number {
  const totalFrames = desiredOutputDuration * frameRate;
  return eventDuration / totalFrames;
}

/**
 * Calculate the output duration for a given interval
 * 
 * @param eventDuration - Event duration in seconds
 * @param intervalSeconds - Interval between shots in seconds
 * @param frameRate - Output frame rate
 * @returns Output video duration in seconds
 */
export function calculateOutputDuration(
  eventDuration: number,
  intervalSeconds: number,
  frameRate: number
): number {
  const totalFrames = eventDuration / intervalSeconds;
  return totalFrames / frameRate;
}
