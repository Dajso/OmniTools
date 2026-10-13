import { formatFixed } from '../../utils/formatting';
/**
 * Sample Rate Calculator
 * 
 * Calculates audio file sizes, sample rates, and related audio specifications.
 * 
 * @module lib/calculations/audio/sample-rate-calculator
 * @see Requirements 20.5
 */

/**
 * Common sample rates in Hz
 */
export const SAMPLE_RATES = {
  '8000': { hz: 8000, name: '8 kHz (telefon)' },
  '11025': { hz: 11025, name: '11,025 kHz (lav kvalitet)' },
  '22050': { hz: 22050, name: '22,05 kHz (FM-radio)' },
  '44100': { hz: 44100, name: '44,1 kHz (CD-kvalitet)' },
  '48000': { hz: 48000, name: '48 kHz (DVD/profesjonell)' },
  '88200': { hz: 88200, name: '88,2 kHz (høyoppløselig)' },
  '96000': { hz: 96000, name: '96 kHz (høyoppløselig)' },
  '176400': { hz: 176400, name: '176,4 kHz (studio)' },
  '192000': { hz: 192000, name: '192 kHz (studio)' },
} as const;

/**
 * Common bit depths
 */
export const BIT_DEPTHS = {
  '8': { bits: 8, name: '8 bit (lav kvalitet)' },
  '16': { bits: 16, name: '16 bit (CD-kvalitet)' },
  '24': { bits: 24, name: '24 bit (profesjonell)' },
  '32': { bits: 32, name: '32 bit (flyttall)' },
} as const;

/**
 * Audio format specifications
 */
export interface AudioFormat {
  /** Sample rate in Hz */
  sampleRate: number;
  /** Bit depth */
  bitDepth: number;
  /** Number of channels (1 = mono, 2 = stereo) */
  channels: number;
}

/**
 * Audio file size calculation result
 */
export interface AudioFileSizeResult {
  /** File size in bytes */
  bytes: number;
  /** File size in kilobytes */
  kilobytes: number;
  /** File size in megabytes */
  megabytes: number;
  /** File size in gigabytes */
  gigabytes: number;
  /** Formatted file size string */
  formatted: string;
  /** Bit rate in bits per second */
  bitRate: number;
  /** Bit rate in kbps */
  bitRateKbps: number;
}

/**
 * Sample count calculation result
 */
export interface SampleCountResult {
  /** Total number of samples */
  totalSamples: number;
  /** Samples per channel */
  samplesPerChannel: number;
  /** Duration in seconds */
  durationSeconds: number;
  /** Duration formatted as MM:SS */
  durationFormatted: string;
}

/**
 * Nyquist frequency result
 */
export interface NyquistResult {
  /** Nyquist frequency (maximum representable frequency) */
  nyquistFrequency: number;
  /** Sample rate */
  sampleRate: number;
  /** Whether a given frequency can be accurately represented */
  canRepresent: (frequency: number) => boolean;
}

/**
 * Calculate uncompressed audio file size
 * 
 * Formula: size = sampleRate × bitDepth × channels × duration / 8
 * 
 * @param format - Audio format specification
 * @param durationSeconds - Duration in seconds
 * @returns File size calculation result
 * @throws Error if any parameter is invalid
 * 
 * @example
 * ```typescript
 * calculateFileSize({ sampleRate: 44100, bitDepth: 16, channels: 2 }, 180);
 * // Returns ~31.5 MB for a 3-minute stereo CD-quality file
 * ```
 */
export function calculateFileSize(
  format: AudioFormat,
  durationSeconds: number
): AudioFileSizeResult {
  if (format.sampleRate <= 0) {
    throw new Error('Samplingsfrekvensen må være større enn 0');
  }
  if (format.bitDepth <= 0) {
    throw new Error('Bitdybden må være større enn 0');
  }
  if (format.channels <= 0) {
    throw new Error('Antall kanaler må være større enn 0');
  }
  if (durationSeconds < 0) {
    throw new Error('Varigheten kan ikke være negativ');
  }

  // Calculate bit rate (bits per second)
  const bitRate = format.sampleRate * format.bitDepth * format.channels;
  
  // Calculate file size in bytes
  const bytes = (bitRate * durationSeconds) / 8;
  
  const kilobytes = bytes / 1024;
  const megabytes = kilobytes / 1024;
  const gigabytes = megabytes / 1024;

  return {
    bytes: Math.round(bytes),
    kilobytes: Math.round(kilobytes * 100) / 100,
    megabytes: Math.round(megabytes * 100) / 100,
    gigabytes: Math.round(gigabytes * 1000) / 1000,
    formatted: formatFileSize(bytes),
    bitRate,
    bitRateKbps: Math.round(bitRate / 1000),
  };
}

/**
 * Calculate duration from file size
 * 
 * @param format - Audio format specification
 * @param fileSizeBytes - File size in bytes
 * @returns Duration in seconds
 */
export function calculateDuration(
  format: AudioFormat,
  fileSizeBytes: number
): number {
  if (format.sampleRate <= 0) {
    throw new Error('Samplingsfrekvensen må være større enn 0');
  }
  if (format.bitDepth <= 0) {
    throw new Error('Bitdybden må være større enn 0');
  }
  if (format.channels <= 0) {
    throw new Error('Antall kanaler må være større enn 0');
  }
  if (fileSizeBytes < 0) {
    throw new Error('Filstørrelsen kan ikke være negativ');
  }

  const bitRate = format.sampleRate * format.bitDepth * format.channels;
  return (fileSizeBytes * 8) / bitRate;
}

/**
 * Calculate sample count for a given duration
 * 
 * @param sampleRate - Sample rate in Hz
 * @param durationSeconds - Duration in seconds
 * @param channels - Number of channels (default: 1)
 * @returns Sample count result
 */
export function calculateSampleCount(
  sampleRate: number,
  durationSeconds: number,
  channels: number = 1
): SampleCountResult {
  if (sampleRate <= 0) {
    throw new Error('Samplingsfrekvensen må være større enn 0');
  }
  if (durationSeconds < 0) {
    throw new Error('Varigheten kan ikke være negativ');
  }
  if (channels <= 0) {
    throw new Error('Antall kanaler må være større enn 0');
  }

  const samplesPerChannel = Math.round(sampleRate * durationSeconds);
  const totalSamples = samplesPerChannel * channels;

  return {
    totalSamples,
    samplesPerChannel,
    durationSeconds,
    durationFormatted: formatDuration(durationSeconds),
  };
}

/**
 * Calculate duration from sample count
 * 
 * @param sampleRate - Sample rate in Hz
 * @param sampleCount - Number of samples (per channel)
 * @returns Duration in seconds
 */
export function calculateDurationFromSamples(
  sampleRate: number,
  sampleCount: number
): number {
  if (sampleRate <= 0) {
    throw new Error('Samplingsfrekvensen må være større enn 0');
  }
  if (sampleCount < 0) {
    throw new Error('Antall samples kan ikke være negativt');
  }

  return sampleCount / sampleRate;
}

/**
 * Calculate Nyquist frequency (maximum representable frequency)
 * 
 * The Nyquist frequency is half the sample rate. Frequencies above this
 * cannot be accurately represented and will cause aliasing.
 * 
 * @param sampleRate - Sample rate in Hz
 * @returns Nyquist frequency result
 */
export function calculateNyquist(sampleRate: number): NyquistResult {
  if (sampleRate <= 0) {
    throw new Error('Samplingsfrekvensen må være større enn 0');
  }

  const nyquistFrequency = sampleRate / 2;

  return {
    nyquistFrequency,
    sampleRate,
    canRepresent: (frequency: number) => frequency <= nyquistFrequency,
  };
}

/**
 * Calculate required sample rate for a given maximum frequency
 * 
 * @param maxFrequency - Maximum frequency to represent
 * @param oversamplingFactor - Oversampling factor (default: 2.2 for safety margin)
 * @returns Required sample rate
 */
export function calculateRequiredSampleRate(
  maxFrequency: number,
  oversamplingFactor: number = 2.2
): number {
  if (maxFrequency <= 0) {
    throw new Error('Høyeste frekvens må være større enn 0');
  }
  if (oversamplingFactor < 2) {
    throw new Error('Oversamplingsfaktoren må være minst 2 (Nyquist-teoremet)');
  }

  return Math.ceil(maxFrequency * oversamplingFactor);
}

/**
 * Convert sample rate (resample calculation)
 * 
 * @param originalSampleRate - Original sample rate
 * @param targetSampleRate - Target sample rate
 * @param originalSampleCount - Original sample count
 * @returns New sample count after resampling
 */
export function calculateResampledCount(
  originalSampleRate: number,
  targetSampleRate: number,
  originalSampleCount: number
): number {
  if (originalSampleRate <= 0 || targetSampleRate <= 0) {
    throw new Error('Samplingsfrekvensene må være større enn 0');
  }
  if (originalSampleCount < 0) {
    throw new Error('Antall samples kan ikke være negativt');
  }

  const ratio = targetSampleRate / originalSampleRate;
  return Math.round(originalSampleCount * ratio);
}

/**
 * Calculate dynamic range for a given bit depth
 * 
 * @param bitDepth - Bit depth
 * @returns Dynamic range in dB
 */
export function calculateDynamicRange(bitDepth: number): number {
  if (bitDepth <= 0) {
    throw new Error('Bitdybden må være større enn 0');
  }

  // Dynamic range ≈ 6.02 × bit depth (for linear PCM)
  return 6.02 * bitDepth;
}

/**
 * Calculate signal-to-noise ratio for a given bit depth
 * 
 * @param bitDepth - Bit depth
 * @returns SNR in dB
 */
export function calculateSNR(bitDepth: number): number {
  if (bitDepth <= 0) {
    throw new Error('Bitdybden må være større enn 0');
  }

  // SNR ≈ 6.02 × bit depth + 1.76 dB (for dithered audio)
  return 6.02 * bitDepth + 1.76;
}

/**
 * Format file size for display
 * 
 * @param bytes - File size in bytes
 * @returns Formatted string
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${formatFixed(bytes / 1024, 2)} KB`;
  }
  if (bytes < 1024 * 1024 * 1024) {
    return `${formatFixed(bytes / (1024 * 1024), 2)} MB`;
  }
  return `${formatFixed(bytes / (1024 * 1024 * 1024), 2)} GB`;
}

/**
 * Format duration for display
 * 
 * @param seconds - Duration in seconds
 * @returns Formatted string (HH:MM:SS or MM:SS)
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Parse duration string to seconds
 * 
 * @param durationString - Duration string (MM:SS or HH:MM:SS)
 * @returns Duration in seconds
 */
export function parseDuration(durationString: string): number {
  const parts = durationString.split(':').map(Number);
  
  if (parts.some(isNaN)) {
    throw new Error('Ugyldig varighetsformat');
  }

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }
  
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }

  throw new Error('Ugyldig varighetsformat. Bruk MM:SS eller TT:MM:SS');
}

/**
 * Common audio format presets
 */
export const AUDIO_PRESETS = {
  'cd-quality': { sampleRate: 44100, bitDepth: 16, channels: 2 },
  'dvd-quality': { sampleRate: 48000, bitDepth: 24, channels: 2 },
  'high-res': { sampleRate: 96000, bitDepth: 24, channels: 2 },
  'studio': { sampleRate: 192000, bitDepth: 32, channels: 2 },
  'voice-mono': { sampleRate: 22050, bitDepth: 16, channels: 1 },
  'telephone': { sampleRate: 8000, bitDepth: 8, channels: 1 },
  'podcast': { sampleRate: 44100, bitDepth: 16, channels: 1 },
} as const;

export type AudioPreset = keyof typeof AUDIO_PRESETS;

/**
 * Get audio format from preset name
 * 
 * @param preset - Preset name
 * @returns Audio format
 */
export function getPresetFormat(preset: AudioPreset): AudioFormat {
  return { ...AUDIO_PRESETS[preset] };
}
