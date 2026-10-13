import { formatFixed } from '../../utils/formatting';
/**
 * Shutter Angle Converter
 * 
 * Converts between shutter angle (used in cinema) and shutter speed
 * (used in photography).
 * 
 * @module lib/calculations/photo/shutter-angle-converter
 * @see Requirements 23.9
 */

/**
 * Common shutter angles used in cinema
 */
export const COMMON_SHUTTER_ANGLES = [
  { angle: 360, description: 'Maksimalt lys, svært myk bevegelsesuskarphet' },
  { angle: 270, description: 'Mer bevegelsesuskarphet, drømmende uttrykk' },
  { angle: 180, description: 'Vanlig filmuttrykk (180°-regelen)' },
  { angle: 172.8, description: 'Vanlig standard for digitale filmkameraer' },
  { angle: 144, description: 'Litt mindre bevegelsesuskarphet' },
  { angle: 90, description: 'Mindre bevegelsesuskarphet, skarpere action' },
  { angle: 45, description: 'Minimal bevegelsesuskarphet, staccato-effekt' },
  { angle: 22.5, description: 'Svært skarpt, stroboskop-lignende effekt' },
  { angle: 11.25, description: 'Ekstrem skarphet, «Redd menig Ryan»-effekt' },
] as const;

/**
 * Common frame rates
 */
export const CINEMA_FRAME_RATES = [
  { fps: 23.976, description: 'Film (NTSC)' },
  { fps: 24, description: 'Kinostandard' },
  { fps: 25, description: 'PAL-video (Europa)' },
  { fps: 29.97, description: 'NTSC-video' },
  { fps: 30, description: 'Nettvideo' },
  { fps: 48, description: 'Kino med høy bildefrekvens' },
  { fps: 50, description: 'PAL med høy bildefrekvens' },
  { fps: 59.94, description: 'NTSC med høy bildefrekvens' },
  { fps: 60, description: 'Nett med høy bildefrekvens' },
  { fps: 120, description: 'Sakte film' },
  { fps: 240, description: 'Høyhastighets sakte film' },
] as const;

/**
 * Input for shutter angle to speed conversion
 */
export interface ShutterAngleInput {
  /** Shutter angle in degrees (1-360) */
  shutterAngle: number;
  /** Frame rate in fps */
  frameRate: number;
}

/**
 * Input for shutter speed to angle conversion
 */
export interface ShutterSpeedInput {
  /** Shutter speed in seconds */
  shutterSpeed: number;
  /** Frame rate in fps */
  frameRate: number;
}

/**
 * Result of shutter conversion
 */
export interface ShutterConversionResult {
  /** Shutter angle in degrees */
  shutterAngle: number;
  /** Shutter speed in seconds */
  shutterSpeed: number;
  /** Shutter speed formatted (e.g., "1/48") */
  shutterSpeedFormatted: string;
  /** Frame rate used */
  frameRate: number;
  /** Frame duration in seconds */
  frameDuration: number;
  /** Exposure time as percentage of frame */
  exposurePercent: number;
  /** Motion blur description */
  motionBlurDescription: string;
}

/**
 * Convert shutter angle to shutter speed
 * 
 * Formula: Shutter Speed = (Shutter Angle / 360) × (1 / Frame Rate)
 * 
 * @param input - Shutter angle and frame rate
 * @returns Conversion result
 * @throws Error if input is invalid
 * 
 * @example
 * ```typescript
 * const result = shutterAngleToSpeed({ shutterAngle: 180, frameRate: 24 });
 * // result.shutterSpeed = 1/48 (0.0208333...)
 * ```
 */
export function shutterAngleToSpeed(input: ShutterAngleInput): ShutterConversionResult {
  const { shutterAngle, frameRate } = input;

  if (shutterAngle <= 0 || shutterAngle > 360) {
    throw new Error('Lukkervinkelen må være mellom 0 og 360 grader');
  }
  if (frameRate <= 0) {
    throw new Error('Bildefrekvensen må være større enn 0');
  }

  // Calculate frame duration
  const frameDuration = 1 / frameRate;

  // Calculate shutter speed
  // Shutter Speed = (Angle / 360) × Frame Duration
  const shutterSpeed = (shutterAngle / 360) * frameDuration;

  // Calculate exposure percentage
  const exposurePercent = (shutterAngle / 360) * 100;

  return {
    shutterAngle,
    shutterSpeed,
    shutterSpeedFormatted: formatCinemaShutterSpeed(shutterSpeed),
    frameRate,
    frameDuration,
    exposurePercent: Math.round(exposurePercent * 100) / 100,
    motionBlurDescription: getMotionBlurDescription(shutterAngle),
  };
}

/**
 * Convert shutter speed to shutter angle
 * 
 * Formula: Shutter Angle = (Shutter Speed × Frame Rate) × 360
 * 
 * @param input - Shutter speed and frame rate
 * @returns Conversion result
 * @throws Error if input is invalid
 * 
 * @example
 * ```typescript
 * const result = shutterSpeedToAngle({ shutterSpeed: 1/48, frameRate: 24 });
 * // result.shutterAngle = 180
 * ```
 */
export function shutterSpeedToAngle(input: ShutterSpeedInput): ShutterConversionResult {
  const { shutterSpeed, frameRate } = input;

  if (shutterSpeed <= 0) {
    throw new Error('Lukkertiden må være større enn 0');
  }
  if (frameRate <= 0) {
    throw new Error('Bildefrekvensen må være større enn 0');
  }

  // Calculate frame duration
  const frameDuration = 1 / frameRate;

  // Shutter speed cannot exceed frame duration
  if (shutterSpeed > frameDuration) {
    throw new Error(`Lukkertiden kan ikke være lengre enn varigheten til ett bilde (${formatCinemaShutterSpeed(frameDuration)})`);
  }

  // Calculate shutter angle
  // Angle = (Shutter Speed / Frame Duration) × 360
  const shutterAngle = (shutterSpeed / frameDuration) * 360;

  // Calculate exposure percentage
  const exposurePercent = (shutterAngle / 360) * 100;

  return {
    shutterAngle: Math.round(shutterAngle * 100) / 100,
    shutterSpeed,
    shutterSpeedFormatted: formatCinemaShutterSpeed(shutterSpeed),
    frameRate,
    frameDuration,
    exposurePercent: Math.round(exposurePercent * 100) / 100,
    motionBlurDescription: getMotionBlurDescription(shutterAngle),
  };
}

/**
 * Get motion blur description based on shutter angle
 * 
 * @param shutterAngle - Shutter angle in degrees
 * @returns Description of motion blur effect
 */
export function getMotionBlurDescription(shutterAngle: number): string {
  if (shutterAngle >= 300) return 'Maksimal bevegelsesuskarphet, svært myk og drømmende';
  if (shutterAngle >= 200) return 'Mer bevegelsesuskarphet, myk bevegelse';
  if (shutterAngle >= 160 && shutterAngle <= 200) return 'Vanlig bevegelsesuskarphet i film';
  if (shutterAngle >= 100) return 'Moderat bevegelsesuskarphet';
  if (shutterAngle >= 60) return 'Mindre bevegelsesuskarphet, skarpere action';
  if (shutterAngle >= 30) return 'Minimal bevegelsesuskarphet, staccato-effekt';
  return 'Svært skarpt, stroboskop-lignende effekt';
}

/**
 * Format shutter speed for display
 * 
 * @param seconds - Shutter speed in seconds
 * @returns Formatted shutter speed string
 */
export function formatCinemaShutterSpeed(seconds: number): string {
  if (seconds >= 1) {
    return `${formatFixed(seconds, 2)} s`;
  }

  const denominator = Math.round(1 / seconds);
  return `1/${denominator}`;
}


/**
 * Calculate the 180-degree rule shutter speed for a given frame rate
 * 
 * The 180-degree rule states that shutter speed should be approximately
 * double the frame rate for natural-looking motion blur.
 * 
 * @param frameRate - Frame rate in fps
 * @returns Recommended shutter speed in seconds
 */
export function calculate180DegreeShutter(frameRate: number): number {
  return 1 / (frameRate * 2);
}

/**
 * Get all shutter speeds for common angles at a given frame rate
 * 
 * @param frameRate - Frame rate in fps
 * @returns Array of shutter angle/speed pairs
 */
export function getShutterSpeedsForFrameRate(
  frameRate: number
): Array<{ angle: number; speed: number; speedFormatted: string; description: string }> {
  return COMMON_SHUTTER_ANGLES.map(({ angle, description }) => {
    const speed = (angle / 360) * (1 / frameRate);
    return {
      angle,
      speed,
      speedFormatted: formatCinemaShutterSpeed(speed),
      description,
    };
  });
}

/**
 * Calculate equivalent shutter angle when changing frame rate
 * 
 * @param originalAngle - Original shutter angle
 * @param originalFps - Original frame rate
 * @param newFps - New frame rate
 * @returns Equivalent shutter angle for new frame rate (to maintain same motion blur)
 */
export function calculateEquivalentAngle(
  originalAngle: number,
  originalFps: number,
  newFps: number
): number {
  // To maintain the same motion blur, we need the same exposure time
  const exposureTime = (originalAngle / 360) * (1 / originalFps);

  // Calculate new angle for same exposure time at new fps
  const newAngle = (exposureTime * newFps) * 360;

  // Clamp to valid range
  return Math.min(360, Math.max(0, newAngle));
}

/**
 * Check if shutter speed is valid for frame rate
 * 
 * @param shutterSpeed - Shutter speed in seconds
 * @param frameRate - Frame rate in fps
 * @returns Whether the shutter speed is valid
 */
export function isValidShutterSpeed(shutterSpeed: number, frameRate: number): boolean {
  const frameDuration = 1 / frameRate;
  return shutterSpeed > 0 && shutterSpeed <= frameDuration;
}

/**
 * Get maximum shutter speed for frame rate
 * 
 * @param frameRate - Frame rate in fps
 * @returns Maximum shutter speed in seconds
 */
export function getMaxShutterSpeed(frameRate: number): number {
  return 1 / frameRate;
}

/**
 * Cinema look presets
 */
export interface CinemaPreset {
  name: string;
  shutterAngle: number;
  description: string;
  examples: string[];
}

/**
 * Common cinema look presets
 */
export const CINEMA_PRESETS: CinemaPreset[] = [
  {
    name: 'Vanlig film',
    shutterAngle: 180,
    description: 'Den klassiske 180-graders regelen for naturlig bevegelsesuskarphet',
    examples: ['De fleste spillefilmer', 'Vanlig fortellende film'],
  },
  {
    name: 'Myk/drømmende',
    shutterAngle: 270,
    description: 'Mer bevegelsesuskarphet for et drømmende, eterisk uttrykk',
    examples: ['Musikkvideoer', 'Drømmesekvenser', 'Romantiske scener'],
  },
  {
    name: 'Action/skarp',
    shutterAngle: 90,
    description: 'Mindre bevegelsesuskarphet for skarpere action',
    examples: ['Actionscener', 'Sportsopptak', 'Rask klipping'],
  },
  {
    name: 'Redd menig Ryan',
    shutterAngle: 45,
    description: 'Svært skarp staccato-effekt brukt i krigsfilmer',
    examples: ['Redd menig Ryan', 'Kampscenene i «Gladiator»'],
  },
  {
    name: 'Dokumentar',
    shutterAngle: 172.8,
    description: 'Vanlig standard for digitale filmkameraer',
    examples: ['Documentaries', 'Nyhetsopptak', 'Reality-TV'],
  },
  {
    name: 'Blade Runner 2049',
    shutterAngle: 360,
    description: 'Maksimal bevegelsesuskarphet for myke, flytende bevegelser',
    examples: ['Blade Runner 2049', 'Rolige, ettertenksomme scener'],
  },
];

/**
 * Get cinema preset by name
 * 
 * @param name - Preset name
 * @returns Cinema preset or undefined
 */
export function getCinemaPreset(name: string): CinemaPreset | undefined {
  return CINEMA_PRESETS.find(
    p => p.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Calculate shutter speed table for a frame rate
 * 
 * @param frameRate - Frame rate in fps
 * @returns Table of common shutter angles with speeds
 */
export function generateShutterTable(frameRate: number): Array<{
  angle: number;
  speed: number;
  speedFormatted: string;
  exposurePercent: number;
}> {
  const angles = [360, 270, 180, 172.8, 144, 90, 45, 22.5, 11.25];

  return angles.map(angle => {
    const speed = (angle / 360) * (1 / frameRate);
    return {
      angle,
      speed,
      speedFormatted: formatCinemaShutterSpeed(speed),
      exposurePercent: Math.round((angle / 360) * 100 * 100) / 100,
    };
  });
}
