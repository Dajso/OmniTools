/**
 * Note to Frequency Converter
 * 
 * Converts musical notes to frequencies and vice versa using the
 * equal temperament tuning system with A4 = 440Hz as reference.
 * 
 * @module lib/calculations/audio/note-frequency
 * @see Requirements 20.3
 */

/**
 * Musical note names
 */
export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

/**
 * Alternative note names using flats
 */
export const NOTE_NAMES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'] as const;

export type NoteName = typeof NOTE_NAMES[number];
export type NoteNameFlat = typeof NOTE_NAMES_FLAT[number];

/**
 * Note with octave information
 */
export interface Note {
  /** Note name (e.g., 'A', 'C#', 'Bb') */
  name: string;
  /** Octave number (0-9) */
  octave: number;
}

/**
 * Result of frequency to note conversion
 */
export interface FrequencyToNoteResult {
  /** Closest note */
  note: Note;
  /** Exact frequency of the closest note */
  exactFrequency: number;
  /** Cents deviation from the closest note (-50 to +50) */
  cents: number;
  /** Whether the input frequency is sharp (+) or flat (-) relative to the note */
  deviation: 'sharp' | 'flat' | 'exact';
}

/**
 * Reference frequency for A4 (standard concert pitch)
 */
export const A4_FREQUENCY = 440;

/**
 * MIDI note number for A4
 */
export const A4_MIDI = 69;

/**
 * Semitone ratio in equal temperament (12th root of 2)
 */
export const SEMITONE_RATIO = Math.pow(2, 1 / 12);

/**
 * Pre-calculated note frequencies for common octaves (0-9)
 * Using A4 = 440Hz as reference
 */
export const NOTE_FREQUENCIES: Record<string, number> = {};

// Generate all note frequencies
for (let octave = 0; octave <= 9; octave++) {
  for (let i = 0; i < NOTE_NAMES.length; i++) {
    const note = NOTE_NAMES[i];
    const key = `${note}${octave}`;
    NOTE_FREQUENCIES[key] = noteToFrequency(note, octave);
  }
}

/**
 * Convert a musical note to its frequency in Hz
 * 
 * Uses the formula: f = 440 * 2^((n - 69) / 12)
 * where n is the MIDI note number
 * 
 * @param note - Note name (e.g., 'A', 'C#', 'Db')
 * @param octave - Octave number (0-9)
 * @param referenceFrequency - Reference frequency for A4 (default: 440Hz)
 * @returns Frequency in Hz
 * @throws Error if note name is invalid
 * 
 * @example
 * ```typescript
 * noteToFrequency('A', 4);  // 440
 * noteToFrequency('C', 4);  // 261.63
 * noteToFrequency('C#', 4); // 277.18
 * ```
 */
export function noteToFrequency(
  note: string,
  octave: number,
  referenceFrequency: number = A4_FREQUENCY
): number {
  const midiNote = noteToMidi(note, octave);
  return midiToFrequency(midiNote, referenceFrequency);
}

/**
 * Convert a MIDI note number to frequency
 * 
 * @param midiNote - MIDI note number (0-127)
 * @param referenceFrequency - Reference frequency for A4 (default: 440Hz)
 * @returns Frequency in Hz
 */
export function midiToFrequency(
  midiNote: number,
  referenceFrequency: number = A4_FREQUENCY
): number {
  return referenceFrequency * Math.pow(2, (midiNote - A4_MIDI) / 12);
}

/**
 * Convert a frequency to the closest musical note
 * 
 * @param frequency - Frequency in Hz
 * @param referenceFrequency - Reference frequency for A4 (default: 440Hz)
 * @returns Note information with cents deviation
 * @throws Error if frequency is not positive
 * 
 * @example
 * ```typescript
 * frequencyToNote(440);  // { note: { name: 'A', octave: 4 }, cents: 0, ... }
 * frequencyToNote(445);  // { note: { name: 'A', octave: 4 }, cents: 19.56, ... }
 * ```
 */
export function frequencyToNote(
  frequency: number,
  referenceFrequency: number = A4_FREQUENCY
): FrequencyToNoteResult {
  if (frequency <= 0) {
    throw new Error('Frequency must be positive');
  }

  // Calculate the exact MIDI note number (can be fractional)
  const exactMidiNote = frequencyToMidi(frequency, referenceFrequency);
  
  // Round to nearest integer MIDI note
  const roundedMidiNote = Math.round(exactMidiNote);
  
  // Convert MIDI note to note name and octave
  const note = midiToNote(roundedMidiNote);
  
  // Calculate exact frequency of the rounded note
  const exactFrequency = midiToFrequency(roundedMidiNote, referenceFrequency);
  
  // Calculate cents deviation
  const cents = (exactMidiNote - roundedMidiNote) * 100;
  
  // Determine deviation direction
  let deviation: 'sharp' | 'flat' | 'exact';
  if (Math.abs(cents) < 0.5) {
    deviation = 'exact';
  } else if (cents > 0) {
    deviation = 'sharp';
  } else {
    deviation = 'flat';
  }

  return {
    note,
    exactFrequency,
    cents: Math.round(cents * 100) / 100, // Round to 2 decimal places
    deviation,
  };
}

/**
 * Convert a frequency to MIDI note number (can be fractional)
 * 
 * @param frequency - Frequency in Hz
 * @param referenceFrequency - Reference frequency for A4 (default: 440Hz)
 * @returns MIDI note number (can be fractional)
 */
export function frequencyToMidi(
  frequency: number,
  referenceFrequency: number = A4_FREQUENCY
): number {
  if (frequency <= 0) {
    throw new Error('Frequency must be positive');
  }
  return 12 * Math.log2(frequency / referenceFrequency) + A4_MIDI;
}

/**
 * Convert a note name and octave to MIDI note number
 * 
 * @param note - Note name (e.g., 'A', 'C#', 'Db')
 * @param octave - Octave number
 * @returns MIDI note number
 * @throws Error if note name is invalid
 */
export function noteToMidi(note: string, octave: number): number {
  const normalizedNote = normalizeNoteName(note);
  const noteIndex = NOTE_NAMES.indexOf(normalizedNote as NoteName);
  
  if (noteIndex === -1) {
    throw new Error(`Invalid note name: ${note}`);
  }

  // MIDI note 0 is C-1, so C0 is MIDI 12
  return (octave + 1) * 12 + noteIndex;
}

/**
 * Convert a MIDI note number to note name and octave
 * 
 * @param midiNote - MIDI note number
 * @returns Note with name and octave
 */
export function midiToNote(midiNote: number): Note {
  const noteIndex = midiNote % 12;
  const octave = Math.floor(midiNote / 12) - 1;
  
  return {
    name: NOTE_NAMES[noteIndex],
    octave,
  };
}

/**
 * Normalize a note name to use sharps instead of flats
 * 
 * @param note - Note name (e.g., 'Db', 'C#', 'c#')
 * @returns Normalized note name using sharps
 */
export function normalizeNoteName(note: string): string {
  const upperNote = note.toUpperCase();
  
  // Map flats to sharps
  const flatToSharp: Record<string, string> = {
    'DB': 'C#',
    'EB': 'D#',
    'GB': 'F#',
    'AB': 'G#',
    'BB': 'A#',
  };

  return flatToSharp[upperNote] || upperNote;
}

/**
 * Get the note name using flats instead of sharps
 * 
 * @param note - Note name using sharps
 * @returns Note name using flats (or original if not a sharp)
 */
export function noteToFlat(note: string): string {
  const sharpToFlat: Record<string, string> = {
    'C#': 'Db',
    'D#': 'Eb',
    'F#': 'Gb',
    'G#': 'Ab',
    'A#': 'Bb',
  };

  return sharpToFlat[note] || note;
}

/**
 * Calculate the interval in semitones between two notes
 * 
 * @param note1 - First note
 * @param octave1 - First note octave
 * @param note2 - Second note
 * @param octave2 - Second note octave
 * @returns Interval in semitones (positive if note2 is higher)
 */
export function getInterval(
  note1: string,
  octave1: number,
  note2: string,
  octave2: number
): number {
  const midi1 = noteToMidi(note1, octave1);
  const midi2 = noteToMidi(note2, octave2);
  return midi2 - midi1;
}

/**
 * Transpose a note by a number of semitones
 * 
 * @param note - Note name
 * @param octave - Octave number
 * @param semitones - Number of semitones to transpose (positive = up, negative = down)
 * @returns Transposed note
 */
export function transposeNote(
  note: string,
  octave: number,
  semitones: number
): Note {
  const midiNote = noteToMidi(note, octave);
  return midiToNote(midiNote + semitones);
}

/**
 * Get all notes in a given octave with their frequencies
 * 
 * @param octave - Octave number
 * @param referenceFrequency - Reference frequency for A4 (default: 440Hz)
 * @returns Array of notes with frequencies
 */
export function getOctaveNotes(
  octave: number,
  referenceFrequency: number = A4_FREQUENCY
): Array<{ note: Note; frequency: number }> {
  return NOTE_NAMES.map((name) => ({
    note: { name, octave },
    frequency: noteToFrequency(name, octave, referenceFrequency),
  }));
}

/**
 * Common reference frequencies (concert pitches)
 */
export const CONCERT_PITCHES = {
  'A440': 440,      // Modern standard
  'A432': 432,      // "Verdi tuning"
  'A415': 415,      // Baroque pitch
  'A466': 466,      // High Baroque
  'A435': 435,      // French pitch (19th century)
  'A442': 442,      // Common orchestral tuning
  'A443': 443,      // Some European orchestras
} as const;

export type ConcertPitch = keyof typeof CONCERT_PITCHES;

/**
 * Format a note as a string (e.g., "A4", "C#5")
 * 
 * @param note - Note object
 * @returns Formatted note string
 */
export function formatNote(note: Note): string {
  return `${note.name}${note.octave}`;
}

/**
 * Parse a note string into a Note object
 * 
 * @param noteString - Note string (e.g., "A4", "C#5", "Bb3")
 * @returns Note object
 * @throws Error if note string is invalid
 */
export function parseNote(noteString: string): Note {
  const match = noteString.match(/^([A-Ga-g][#b]?)(-?\d+)$/);
  
  if (!match) {
    throw new Error(`Invalid note string: ${noteString}`);
  }

  const [, name, octaveStr] = match;
  const octave = parseInt(octaveStr, 10);

  return {
    name: normalizeNoteName(name),
    octave,
  };
}
