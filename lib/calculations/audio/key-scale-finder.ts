/**
 * Key/Scale Finder
 * 
 * Identifies musical keys and scales from a set of notes.
 * Supports major, minor, and modal scales.
 * 
 * @module lib/calculations/audio/key-scale-finder
 * @see Requirements 20.4
 */

import { NOTE_NAMES, normalizeNoteName, type NoteName } from './note-frequency';

/**
 * Scale types with their interval patterns (in semitones from root)
 */
export const SCALE_PATTERNS: Record<string, number[]> = {
  // Major and minor scales
  'major': [0, 2, 4, 5, 7, 9, 11],
  'natural-minor': [0, 2, 3, 5, 7, 8, 10],
  'harmonic-minor': [0, 2, 3, 5, 7, 8, 11],
  'melodic-minor': [0, 2, 3, 5, 7, 9, 11],
  
  // Modes
  'ionian': [0, 2, 4, 5, 7, 9, 11],      // Same as major
  'dorian': [0, 2, 3, 5, 7, 9, 10],
  'phrygian': [0, 1, 3, 5, 7, 8, 10],
  'lydian': [0, 2, 4, 6, 7, 9, 11],
  'mixolydian': [0, 2, 4, 5, 7, 9, 10],
  'aeolian': [0, 2, 3, 5, 7, 8, 10],     // Same as natural minor
  'locrian': [0, 1, 3, 5, 6, 8, 10],
  
  // Pentatonic scales
  'major-pentatonic': [0, 2, 4, 7, 9],
  'minor-pentatonic': [0, 3, 5, 7, 10],
  
  // Blues scales
  'blues': [0, 3, 5, 6, 7, 10],
  'major-blues': [0, 2, 3, 4, 7, 9],
  
  // Other common scales
  'whole-tone': [0, 2, 4, 6, 8, 10],
  'diminished': [0, 2, 3, 5, 6, 8, 9, 11],
  'chromatic': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

export type ScaleType = keyof typeof SCALE_PATTERNS;

/**
 * Scale match result
 */
export interface ScaleMatch {
  /** Root note of the scale */
  root: string;
  /** Scale type */
  scaleType: ScaleType;
  /** Display name (e.g., "C Major", "A Minor") */
  displayName: string;
  /** Notes in the scale */
  scaleNotes: string[];
  /** How many input notes match the scale */
  matchingNotes: number;
  /** Total notes in the input */
  totalInputNotes: number;
  /** Match percentage (0-100) */
  matchPercentage: number;
  /** Notes from input that are in the scale */
  notesInScale: string[];
  /** Notes from input that are NOT in the scale */
  notesOutOfScale: string[];
}

/**
 * Get the notes in a scale
 * 
 * @param root - Root note of the scale
 * @param scaleType - Type of scale
 * @returns Array of note names in the scale
 */
export function getScaleNotes(root: string, scaleType: ScaleType): string[] {
  const pattern = SCALE_PATTERNS[scaleType];
  if (!pattern) {
    throw new Error(`Ukjent skalatype: ${scaleType}`);
  }

  const normalizedRoot = normalizeNoteName(root);
  const rootIndex = NOTE_NAMES.indexOf(normalizedRoot as NoteName);
  
  if (rootIndex === -1) {
    throw new Error(`Ugyldig grunntone: ${root}`);
  }

  return pattern.map((interval) => {
    const noteIndex = (rootIndex + interval) % 12;
    return NOTE_NAMES[noteIndex];
  });
}

/**
 * Convert note name to semitone index (0-11)
 */
function noteToSemitone(note: string): number {
  const normalized = normalizeNoteName(note);
  const index = NOTE_NAMES.indexOf(normalized as NoteName);
  if (index === -1) {
    throw new Error(`Ugyldig note: ${note}`);
  }
  return index;
}

/**
 * Find scales that match a set of input notes
 * 
 * @param inputNotes - Array of note names (e.g., ['C', 'E', 'G'])
 * @param scaleTypes - Scale types to check (default: all)
 * @param minMatchPercentage - Minimum match percentage to include (default: 70)
 * @returns Array of matching scales, sorted by match percentage
 * 
 * @example
 * ```typescript
 * findScales(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
 * // Returns C Major as top match
 * 
 * findScales(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
 * // Returns A Natural Minor as top match
 * ```
 */
export function findScales(
  inputNotes: string[],
  scaleTypes: ScaleType[] = Object.keys(SCALE_PATTERNS) as ScaleType[],
  minMatchPercentage: number = 70
): ScaleMatch[] {
  if (inputNotes.length === 0) {
    return [];
  }

  // Normalize and deduplicate input notes
  const normalizedNotes = [...new Set(inputNotes.map(normalizeNoteName))];
  const inputSemitones = new Set(normalizedNotes.map(noteToSemitone));

  const matches: ScaleMatch[] = [];

  // Check each root note and scale type combination
  for (const root of NOTE_NAMES) {
    for (const scaleType of scaleTypes) {
      const scaleNotes = getScaleNotes(root, scaleType);
      const scaleSemitones = new Set(scaleNotes.map(noteToSemitone));

      // Count matching notes
      const notesInScale: string[] = [];
      const notesOutOfScale: string[] = [];

      for (const note of normalizedNotes) {
        const semitone = noteToSemitone(note);
        if (scaleSemitones.has(semitone)) {
          notesInScale.push(note);
        } else {
          notesOutOfScale.push(note);
        }
      }

      const matchingNotes = notesInScale.length;
      const matchPercentage = (matchingNotes / normalizedNotes.length) * 100;

      if (matchPercentage >= minMatchPercentage) {
        matches.push({
          root,
          scaleType,
          displayName: formatScaleName(root, scaleType),
          scaleNotes,
          matchingNotes,
          totalInputNotes: normalizedNotes.length,
          matchPercentage: Math.round(matchPercentage * 10) / 10,
          notesInScale,
          notesOutOfScale,
        });
      }
    }
  }

  // Sort by match percentage (descending), then by scale type priority
  return matches.sort((a, b) => {
    if (b.matchPercentage !== a.matchPercentage) {
      return b.matchPercentage - a.matchPercentage;
    }
    // Prefer major/minor over modes
    const priority = ['major', 'natural-minor', 'harmonic-minor', 'melodic-minor'];
    const aPriority = priority.indexOf(a.scaleType);
    const bPriority = priority.indexOf(b.scaleType);
    if (aPriority !== -1 && bPriority !== -1) {
      return aPriority - bPriority;
    }
    if (aPriority !== -1) return -1;
    if (bPriority !== -1) return 1;
    return 0;
  });
}

/**
 * Find the best matching key for a set of notes
 * 
 * @param inputNotes - Array of note names
 * @returns Best matching scale, or null if no good match
 */
export function findKey(inputNotes: string[]): ScaleMatch | null {
  // Only check major and minor scales for key detection
  const keyScales: ScaleType[] = ['major', 'natural-minor', 'harmonic-minor', 'melodic-minor'];
  const matches = findScales(inputNotes, keyScales, 80);
  return matches.length > 0 ? matches[0] : null;
}

/**
 * Format a scale name for display
 * 
 * @param root - Root note
 * @param scaleType - Scale type
 * @returns Formatted scale name
 */
export function formatScaleName(root: string, scaleType: ScaleType): string {
  const scaleNames: Record<ScaleType, string> = {
    'major': 'Major',
    'natural-minor': 'Naturlig moll',
    'harmonic-minor': 'Harmonisk moll',
    'melodic-minor': 'Melodisk moll',
    'ionian': 'Ionian',
    'dorian': 'Dorian',
    'phrygian': 'Phrygian',
    'lydian': 'Lydian',
    'mixolydian': 'Mixolydian',
    'aeolian': 'Aeolian',
    'locrian': 'Locrian',
    'major-pentatonic': 'Durpentatonisk',
    'minor-pentatonic': 'Mollpentatonisk',
    'blues': 'Blues',
    'major-blues': 'Durblues',
    'whole-tone': 'Heltone',
    'diminished': 'Diminished',
    'chromatic': 'Chromatic',
  };

  return `${root} ${scaleNames[scaleType] || scaleType}`;
}

/**
 * Get the relative minor of a major key
 * 
 * @param majorRoot - Root of the major key
 * @returns Root of the relative minor
 */
export function getRelativeMinor(majorRoot: string): string {
  const rootIndex = noteToSemitone(majorRoot);
  // Relative minor is 3 semitones down (or 9 up)
  const minorIndex = (rootIndex + 9) % 12;
  return NOTE_NAMES[minorIndex];
}

/**
 * Get the relative major of a minor key
 * 
 * @param minorRoot - Root of the minor key
 * @returns Root of the relative major
 */
export function getRelativeMajor(minorRoot: string): string {
  const rootIndex = noteToSemitone(minorRoot);
  // Relative major is 3 semitones up
  const majorIndex = (rootIndex + 3) % 12;
  return NOTE_NAMES[majorIndex];
}

/**
 * Get the parallel minor of a major key (same root)
 * 
 * @param root - Root note
 * @returns Scale notes for parallel minor
 */
export function getParallelMinor(root: string): string[] {
  return getScaleNotes(root, 'natural-minor');
}

/**
 * Get the parallel major of a minor key (same root)
 * 
 * @param root - Root note
 * @returns Scale notes for parallel major
 */
export function getParallelMajor(root: string): string[] {
  return getScaleNotes(root, 'major');
}

/**
 * Get chord tones for a scale degree
 * 
 * @param root - Root note of the scale
 * @param scaleType - Type of scale
 * @param degree - Scale degree (1-7)
 * @returns Array of chord tones (root, third, fifth)
 */
export function getChordTones(
  root: string,
  scaleType: ScaleType,
  degree: number
): string[] {
  const scaleNotes = getScaleNotes(root, scaleType);
  
  if (degree < 1 || degree > scaleNotes.length) {
    throw new Error(`Ugyldig skalatrinn: ${degree}`);
  }

  const index = degree - 1;
  const chordRoot = scaleNotes[index];
  const third = scaleNotes[(index + 2) % scaleNotes.length];
  const fifth = scaleNotes[(index + 4) % scaleNotes.length];

  return [chordRoot, third, fifth];
}

/**
 * Common chord progressions by key
 */
export const COMMON_PROGRESSIONS = {
  'I-IV-V-I': [1, 4, 5, 1],
  'I-V-vi-IV': [1, 5, 6, 4],
  'ii-V-I': [2, 5, 1],
  'I-vi-IV-V': [1, 6, 4, 5],
  'I-IV-vi-V': [1, 4, 6, 5],
  'vi-IV-I-V': [6, 4, 1, 5],
  'I-V-IV-I': [1, 5, 4, 1],
  'I-ii-V-I': [1, 2, 5, 1],
} as const;

export type ProgressionName = keyof typeof COMMON_PROGRESSIONS;

/**
 * Get the chords for a common progression in a given key
 * 
 * @param root - Root note of the key
 * @param scaleType - Type of scale (usually 'major' or 'natural-minor')
 * @param progressionName - Name of the progression
 * @returns Array of chord roots for the progression
 */
export function getProgressionChords(
  root: string,
  scaleType: ScaleType,
  progressionName: ProgressionName
): string[] {
  const progression = COMMON_PROGRESSIONS[progressionName];
  const scaleNotes = getScaleNotes(root, scaleType);

  return progression.map((degree) => scaleNotes[degree - 1]);
}
