/**
 * Bitrate Calculator
 * 
 * Calculates video bitrate and file size based on resolution, frame rate,
 * and quality settings.
 * 
 * @module lib/calculations/photo/bitrate-calculator
 * @see Requirements 23.4
 */

/**
 * Video resolution preset
 */
export interface VideoResolution {
  name: string;
  width: number;
  height: number;
  /** Common name (e.g., "1080p", "4K") */
  label: string;
}

/**
 * Common video resolutions
 */
export const VIDEO_RESOLUTIONS: VideoResolution[] = [
  { name: 'SD (480p)', width: 854, height: 480, label: '480p' },
  { name: 'HD (720p)', width: 1280, height: 720, label: '720p' },
  { name: 'Full HD (1080p)', width: 1920, height: 1080, label: '1080p' },
  { name: '2K (1440p)', width: 2560, height: 1440, label: '1440p' },
  { name: '4K UHD', width: 3840, height: 2160, label: '4K' },
  { name: '5K', width: 5120, height: 2880, label: '5K' },
  { name: '6K', width: 6144, height: 3456, label: '6K' },
  { name: '8K UHD', width: 7680, height: 4320, label: '8K' },
];

/**
 * Video codec with compression efficiency
 */
export interface VideoCodec {
  name: string;
  /** Compression efficiency factor (lower = better compression) */
  efficiencyFactor: number;
  description: string;
}

/**
 * Common video codecs
 */
export const VIDEO_CODECS: Record<string, VideoCodec> = {
  'h264': {
    name: 'H.264 (AVC)',
    efficiencyFactor: 1.0,
    description: 'Most compatible, good quality',
  },
  'h265': {
    name: 'H.265 (HEVC)',
    efficiencyFactor: 0.5,
    description: '50% smaller files, better quality',
  },
  'vp9': {
    name: 'VP9',
    efficiencyFactor: 0.5,
    description: 'Google codec, YouTube optimized',
  },
  'av1': {
    name: 'AV1',
    efficiencyFactor: 0.4,
    description: 'Newest, best compression',
  },
  'prores': {
    name: 'ProRes',
    efficiencyFactor: 3.0,
    description: 'Professional editing codec',
  },
  'dnxhd': {
    name: 'DNxHD/DNxHR',
    efficiencyFactor: 2.5,
    description: 'Avid professional codec',
  },
};

/**
 * Quality preset with bits per pixel
 */
export interface QualityPreset {
  name: string;
  /** Bits per pixel for H.264 baseline */
  bitsPerPixel: number;
  description: string;
}

/**
 * Quality presets
 */
export const QUALITY_PRESETS: Record<string, QualityPreset> = {
  'low': {
    name: 'Low',
    bitsPerPixel: 0.05,
    description: 'Streaming, mobile',
  },
  'medium': {
    name: 'Medium',
    bitsPerPixel: 0.1,
    description: 'Web video, social media',
  },
  'high': {
    name: 'High',
    bitsPerPixel: 0.15,
    description: 'High quality streaming',
  },
  'very-high': {
    name: 'Very High',
    bitsPerPixel: 0.2,
    description: 'Broadcast quality',
  },
  'master': {
    name: 'Master',
    bitsPerPixel: 0.3,
    description: 'Archive, editing',
  },
};

/**
 * Input parameters for bitrate calculation
 */
export interface BitrateInput {
  /** Video width in pixels */
  width: number;
  /** Video height in pixels */
  height: number;
  /** Frame rate in fps */
  frameRate: number;
  /** Quality preset key */
  quality: keyof typeof QUALITY_PRESETS;
  /** Codec key */
  codec: keyof typeof VIDEO_CODECS;
}

/**
 * Result of bitrate calculation
 */
export interface BitrateResult {
  /** Video bitrate in Mbps */
  videoBitrateMbps: number;
  /** Video bitrate in kbps */
  videoBitrateKbps: number;
  /** Recommended audio bitrate in kbps */
  audioBitrateKbps: number;
  /** Total bitrate in Mbps */
  totalBitrateMbps: number;
  /** File size per minute in MB */
  fileSizePerMinuteMB: number;
  /** File size per hour in GB */
  fileSizePerHourGB: number;
  /** Pixels per frame */
  pixelsPerFrame: number;
  /** Total pixels per second */
  pixelsPerSecond: number;
}

/**
 * Calculate video bitrate and file size
 * 
 * @param input - Bitrate calculation input parameters
 * @returns Complete bitrate calculation results
 * @throws Error if any input parameter is invalid
 * 
 * @example
 * ```typescript
 * const result = calculateBitrate({
 *   width: 1920,
 *   height: 1080,
 *   frameRate: 24,
 *   quality: 'high',
 *   codec: 'h264'
 * });
 * // result.videoBitrateMbps ≈ 7.5
 * ```
 */
export function calculateBitrate(input: BitrateInput): BitrateResult {
  const { width, height, frameRate, quality, codec } = input;
  
  // Validate inputs
  if (width <= 0 || height <= 0) {
    throw new Error('Width and height must be positive');
  }
  if (frameRate <= 0) {
    throw new Error('Frame rate must be positive');
  }
  
  const qualityPreset = QUALITY_PRESETS[quality];
  const codecInfo = VIDEO_CODECS[codec];
  
  if (!qualityPreset) {
    throw new Error(`Invalid quality preset: ${quality}`);
  }
  if (!codecInfo) {
    throw new Error(`Invalid codec: ${codec}`);
  }
  
  // Calculate pixels
  const pixelsPerFrame = width * height;
  const pixelsPerSecond = pixelsPerFrame * frameRate;
  
  // Calculate base bitrate (bits per second)
  // Formula: pixels × frameRate × bitsPerPixel × codecFactor
  const baseBitrate = pixelsPerSecond * qualityPreset.bitsPerPixel * codecInfo.efficiencyFactor;
  
  // Convert to Mbps and kbps
  const videoBitrateMbps = baseBitrate / 1_000_000;
  const videoBitrateKbps = baseBitrate / 1_000;
  
  // Recommended audio bitrate based on video quality
  const audioBitrateKbps = getRecommendedAudioBitrate(quality);
  
  // Total bitrate
  const totalBitrateMbps = videoBitrateMbps + (audioBitrateKbps / 1000);
  
  // File size calculations
  // bits per second × seconds / 8 = bytes
  const bytesPerSecond = (baseBitrate + audioBitrateKbps * 1000) / 8;
  const fileSizePerMinuteMB = (bytesPerSecond * 60) / (1024 * 1024);
  const fileSizePerHourGB = (bytesPerSecond * 3600) / (1024 * 1024 * 1024);
  
  return {
    videoBitrateMbps: Math.round(videoBitrateMbps * 100) / 100,
    videoBitrateKbps: Math.round(videoBitrateKbps),
    audioBitrateKbps,
    totalBitrateMbps: Math.round(totalBitrateMbps * 100) / 100,
    fileSizePerMinuteMB: Math.round(fileSizePerMinuteMB * 10) / 10,
    fileSizePerHourGB: Math.round(fileSizePerHourGB * 100) / 100,
    pixelsPerFrame,
    pixelsPerSecond,
  };
}


/**
 * Get recommended audio bitrate based on video quality
 * 
 * @param quality - Quality preset key
 * @returns Recommended audio bitrate in kbps
 */
export function getRecommendedAudioBitrate(quality: keyof typeof QUALITY_PRESETS): number {
  const audioBitrates: Record<keyof typeof QUALITY_PRESETS, number> = {
    'low': 96,
    'medium': 128,
    'high': 192,
    'very-high': 256,
    'master': 320,
  };
  
  return audioBitrates[quality] || 128;
}

/**
 * Calculate file size for a given duration
 * 
 * @param bitrateMbps - Total bitrate in Mbps
 * @param durationSeconds - Duration in seconds
 * @returns File size in MB
 */
export function calculateFileSize(bitrateMbps: number, durationSeconds: number): number {
  // Mbps × seconds / 8 = MB
  return (bitrateMbps * durationSeconds) / 8;
}

/**
 * Calculate required bitrate for target file size
 * 
 * @param targetSizeMB - Target file size in MB
 * @param durationSeconds - Duration in seconds
 * @returns Required bitrate in Mbps
 */
export function calculateRequiredBitrate(targetSizeMB: number, durationSeconds: number): number {
  // MB × 8 / seconds = Mbps
  return (targetSizeMB * 8) / durationSeconds;
}

/**
 * Calculate maximum duration for target file size
 * 
 * @param targetSizeMB - Target file size in MB
 * @param bitrateMbps - Bitrate in Mbps
 * @returns Maximum duration in seconds
 */
export function calculateMaxDuration(targetSizeMB: number, bitrateMbps: number): number {
  // MB × 8 / Mbps = seconds
  return (targetSizeMB * 8) / bitrateMbps;
}

/**
 * Format bitrate for display
 * 
 * @param bitrateMbps - Bitrate in Mbps
 * @returns Formatted bitrate string
 */
export function formatBitrate(bitrateMbps: number): string {
  if (bitrateMbps >= 1) {
    return `${bitrateMbps.toFixed(2)} Mbps`;
  }
  return `${(bitrateMbps * 1000).toFixed(0)} kbps`;
}

/**
 * Format file size for display
 * 
 * @param sizeMB - Size in MB
 * @returns Formatted size string
 */
export function formatFileSize(sizeMB: number): string {
  if (sizeMB >= 1024) {
    return `${(sizeMB / 1024).toFixed(2)} GB`;
  }
  return `${sizeMB.toFixed(1)} MB`;
}

/**
 * Get resolution by label
 * 
 * @param label - Resolution label (e.g., "1080p", "4K")
 * @returns Video resolution or undefined
 */
export function getResolutionByLabel(label: string): VideoResolution | undefined {
  return VIDEO_RESOLUTIONS.find(r => r.label === label);
}

/**
 * Streaming platform bitrate recommendations
 */
export interface StreamingRecommendation {
  platform: string;
  resolution: string;
  minBitrateMbps: number;
  maxBitrateMbps: number;
  recommendedBitrateMbps: number;
}

/**
 * Common streaming platform recommendations
 */
export const STREAMING_RECOMMENDATIONS: StreamingRecommendation[] = [
  // YouTube
  { platform: 'YouTube', resolution: '1080p', minBitrateMbps: 8, maxBitrateMbps: 12, recommendedBitrateMbps: 10 },
  { platform: 'YouTube', resolution: '4K', minBitrateMbps: 35, maxBitrateMbps: 68, recommendedBitrateMbps: 45 },
  // Vimeo
  { platform: 'Vimeo', resolution: '1080p', minBitrateMbps: 10, maxBitrateMbps: 20, recommendedBitrateMbps: 15 },
  { platform: 'Vimeo', resolution: '4K', minBitrateMbps: 30, maxBitrateMbps: 60, recommendedBitrateMbps: 45 },
  // Twitch
  { platform: 'Twitch', resolution: '1080p', minBitrateMbps: 4.5, maxBitrateMbps: 6, recommendedBitrateMbps: 6 },
  { platform: 'Twitch', resolution: '720p', minBitrateMbps: 3, maxBitrateMbps: 4.5, recommendedBitrateMbps: 4 },
  // Instagram
  { platform: 'Instagram', resolution: '1080p', minBitrateMbps: 3.5, maxBitrateMbps: 5, recommendedBitrateMbps: 4 },
  // TikTok
  { platform: 'TikTok', resolution: '1080p', minBitrateMbps: 2, maxBitrateMbps: 6, recommendedBitrateMbps: 4 },
];

/**
 * Get streaming recommendations for a platform
 * 
 * @param platform - Platform name
 * @returns Array of recommendations for the platform
 */
export function getStreamingRecommendations(platform: string): StreamingRecommendation[] {
  return STREAMING_RECOMMENDATIONS.filter(
    r => r.platform.toLowerCase() === platform.toLowerCase()
  );
}
