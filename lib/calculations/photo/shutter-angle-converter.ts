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
  { angle: 360, description: 'Maximum light, very smooth motion blur' },
  { angle: 270, description: 'Increased motion blur, dreamy look' },
  { angle: 180, description: 'Standard cinematic look (180° rule)' },
  { angle: 172.8, description: 'Common digital cinema default' },
  { angle: 144, description: 'Slightly reduced motion blur' },
  { angle: 90, description: 'Reduced motion blur, sharper action' },
  { angle: 45, description: 'Minimal motion blur, staccato effect' },
  { angle: 22.5, description: 'Very sharp, strobe-like effect' },
  { angle: 11.25, description: 'Extreme sharpness, Saving Private Ryan effect' },
] as const;

/**
 * Common frame rates
 */
export const COMMON_FRAME_RATES = [
  { fps: 23.976, description: 'Film (NTSC)' },
  { fps: 24, description: 'Cinema standard' },
  { fps: 25, description: 'PAL video' },
  { fps: 29.97, description: 'NTSC video' },
  { fps: 30, description: 'Web video' },
  { fps: 48, description: 'High frame rate cinema' },
  { fps: 50, description: 'PAL high frame rate' },
  { fps: 59.94, description: 'NTSC high frame rate' },
  { fps: 60, description: 'High frame rate web' },
  { fps: 120, description: 'Slow motion' },
  { fps: 240, description: 'High-speed slow motion' },
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
    throw new Error('Shutter angle must be between 0 and 360 degrees');
  }
  if (frameRate <= 0) {
    throw new Error('Frame rate must be positive');
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
    shutterSpeedFormatted: formatShutterSpeed(shutterSpeed),
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
    throw new Error('Shutter speed must be positive');
  }
  if (frameRate <= 0) {
    throw new Error('Frame rate must be positive');
  }
  
  // Calculate frame duration
  const frameDuration = 1 / frameRate;
  
  // Shutter speed cannot exceed frame duration
  if (shutterSpeed > frameDuration) {
    throw new Error(`Shutter speed cannot exceed frame duration (${formatShutterSpeed(frameDuration)})`);
  }
  
  // Calculate shutter angle
  // Angle = (Shutter Speed / Frame Duration) × 360
  const shutterAngle = (shutterSpeed / frameDuration) * 360;
  
  // Calculate exposure percentage
  const exposurePercent = (shutterAngle / 360) * 100;
  
  return {
    shutterAngle: Math.round(shutterAngle * 100) / 100,
    shutterSpeed,
    shutterSpeedFormatted: formatShutterSpeed(shutterSpeed),
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
  if (shutterAngle >= 300) return 'Maximum motion blur, very smooth/dreamy';
  if (shutterAngle >= 200) return 'Increased motion blur, smooth motion';
  if (shutterAngle >= 160 && shutterAngle <= 200) return 'Standard cinematic motion blur';
  if (shutterAngle >= 100) return 'Moderate motion blur';
  if (shutterAngle >= 60) return 'Reduced motion blur, sharper action';
  if (shutterAngle >= 30) return 'Minimal motion blur, staccato effect';
  return 'Very sharp, strobe-like effect';
}

/**
 * Format shutter speed for display
 * 
 * @param seconds - Shutter speed in seconds
 * @returns Formatted shutter speed string
 */
export function formatShutterSpeed(seconds: number): string {
  if (seconds >= 1) {
    return `${seconds.toFixed(2)}s`;
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
      speedFormatted: formatShutterSpeed(speed),
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
    name: 'Standard Cinematic',
    shutterAngle: 180,
    description: 'The classic 180-degree rule for natural motion blur',
    examples: ['Most Hollywood films', 'Standard narrative cinema'],
  },
  {
    name: 'Smooth/Dreamy',
    shutterAngle: 270,
    description: 'Increased motion blur for a dreamy, ethereal look',
    examples: ['Music videos', 'Dream sequences', 'Romantic scenes'],
  },
  {
    name: 'Action/Sharp',
    shutterAngle: 90,
    description: 'Reduced motion blur for sharper action',
    examples: ['Action sequences', 'Sports footage', 'Fast-paced editing'],
  },
  {
    name: 'Saving Private Ryan',
    shutterAngle: 45,
    description: 'Very sharp, staccato effect used in war films',
    examples: ['Saving Private Ryan', 'Gladiator battle scenes'],
  },
  {
    name: 'Documentary',
    shutterAngle: 172.8,
    description: 'Common default for digital cinema cameras',
    examples: ['Documentaries', 'News footage', 'Reality TV'],
  },
  {
    name: 'Blade Runner 2049',
    shutterAngle: 360,
    description: 'Maximum motion blur for smooth, flowing movement',
    examples: ['Blade Runner 2049', 'Slow, contemplative scenes'],
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
      speedFormatted: formatShutterSpeed(speed),
      exposurePercent: Math.round((angle / 360) * 100 * 100) / 100,
    };
  });
}
