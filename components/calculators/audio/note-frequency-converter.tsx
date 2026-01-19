'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import {
  NOTE_NAMES,
  noteToFrequency,
  frequencyToNote,
  CONCERT_PITCHES,
  formatNote,
  type FrequencyToNoteResult,
} from '@/lib/calculations/audio/note-frequency';

type Mode = 'note-to-freq' | 'freq-to-note';

export function NoteFrequencyConverter() {
  const [mode, setMode] = React.useState<Mode>('note-to-freq');
  const [selectedNote, setSelectedNote] = React.useState<string>('A');
  const [octave, setOctave] = React.useState<number>(4);
  const [referenceFreq, setReferenceFreq] = React.useState<number>(440);
  const [inputFrequency, setInputFrequency] = React.useState<number>(440);
  
  const [calculatedFrequency, setCalculatedFrequency] = React.useState<number | null>(null);
  const [noteResult, setNoteResult] = React.useState<FrequencyToNoteResult | null>(null);

  // Calculate note to frequency
  React.useEffect(() => {
    if (mode === 'note-to-freq') {
      try {
        const freq = noteToFrequency(selectedNote, octave, referenceFreq);
        setCalculatedFrequency(freq);
      } catch {
        setCalculatedFrequency(null);
      }
    }
  }, [mode, selectedNote, octave, referenceFreq]);

  // Calculate frequency to note
  React.useEffect(() => {
    if (mode === 'freq-to-note' && inputFrequency > 0) {
      try {
        const result = frequencyToNote(inputFrequency, referenceFreq);
        setNoteResult(result);
      } catch {
        setNoteResult(null);
      }
    }
  }, [mode, inputFrequency, referenceFreq]);

  const noteOptions = NOTE_NAMES.map(note => ({ value: note, label: note }));
  const octaveOptions = Array.from({ length: 10 }, (_, i) => ({ value: String(i), label: String(i) }));
  const pitchOptions = Object.entries(CONCERT_PITCHES).map(([name, freq]) => ({
    value: String(freq),
    label: `${name} (${freq} Hz)`,
  }));

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Note to Frequency Converter</CardTitle>
        <CardDescription>
          Convert musical notes to frequencies and vice versa using equal temperament tuning.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={mode === 'note-to-freq' ? 'default' : 'outline'}
            onClick={() => setMode('note-to-freq')}
            size="sm"
          >
            Note → Frequency
          </Button>
          <Button
            variant={mode === 'freq-to-note' ? 'default' : 'outline'}
            onClick={() => setMode('freq-to-note')}
            size="sm"
          >
            Frequency → Note
          </Button>
        </div>

        {/* Reference Pitch */}
        <div className="space-y-2">
          <Label htmlFor="reference-pitch">Reference Pitch (A4)</Label>
          <Select
            id="reference-pitch"
            options={pitchOptions}
            value={String(referenceFreq)}
            onChange={(e) => setReferenceFreq(Number(e.target.value))}
          />
        </div>

        {mode === 'note-to-freq' ? (
          <>
            {/* Note Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="note-select">Note</Label>
                <Select
                  id="note-select"
                  options={noteOptions}
                  value={selectedNote}
                  onChange={(e) => setSelectedNote(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="octave-select">Octave</Label>
                <Select
                  id="octave-select"
                  options={octaveOptions}
                  value={String(octave)}
                  onChange={(e) => setOctave(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Quick Note Buttons */}
            <div>
              <p className="text-sm font-medium mb-2">Quick Select</p>
              <div className="flex flex-wrap gap-2">
                {NOTE_NAMES.map(note => (
                  <Button
                    key={note}
                    variant={selectedNote === note ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedNote(note)}
                    className="w-10"
                  >
                    {note}
                  </Button>
                ))}
              </div>
            </div>

            {/* Result */}
            {calculatedFrequency !== null && (
              <div className="border-t pt-4">
                <ResultDisplay
                  label={`${selectedNote}${octave} Frequency`}
                  value={calculatedFrequency.toFixed(2)}
                  unit="Hz"
                  highlight
                  copyable
                />
              </div>
            )}
          </>
        ) : (
          <>
            {/* Frequency Input */}
            <NumberInput
              id="frequency-input"
              label="Frequency"
              value={inputFrequency}
              onChange={setInputFrequency}
              min={16}
              max={20000}
              step={0.01}
              unit="Hz"
            />

            {/* Result */}
            {noteResult && (
              <div className="border-t pt-4 space-y-4">
                <ResultDisplay
                  label="Closest Note"
                  value={formatNote(noteResult.note)}
                  highlight
                />
                <div className="grid grid-cols-2 gap-4">
                  <ResultDisplay
                    label="Exact Frequency"
                    value={noteResult.exactFrequency.toFixed(2)}
                    unit="Hz"
                    copyable
                  />
                  <ResultDisplay
                    label="Cents Deviation"
                    value={`${noteResult.cents > 0 ? '+' : ''}${noteResult.cents.toFixed(1)}`}
                    unit="cents"
                  />
                </div>
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm">
                    {noteResult.deviation === 'exact' ? (
                      <span className="text-green-600 font-medium">Perfectly in tune!</span>
                    ) : noteResult.deviation === 'sharp' ? (
                      <span className="text-orange-600">
                        {Math.abs(noteResult.cents).toFixed(1)} cents sharp of {formatNote(noteResult.note)}
                      </span>
                    ) : (
                      <span className="text-blue-600">
                        {Math.abs(noteResult.cents).toFixed(1)} cents flat of {formatNote(noteResult.note)}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Common Frequencies Reference */}
        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Common Reference Frequencies</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div className="bg-muted/50 p-2 rounded">
              <span className="font-medium">A4:</span> 440 Hz
            </div>
            <div className="bg-muted/50 p-2 rounded">
              <span className="font-medium">C4:</span> 261.63 Hz
            </div>
            <div className="bg-muted/50 p-2 rounded">
              <span className="font-medium">E4:</span> 329.63 Hz
            </div>
            <div className="bg-muted/50 p-2 rounded">
              <span className="font-medium">G4:</span> 392.00 Hz
            </div>
          </div>
        </div>

        {/* Formula */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-1">Formula (Equal Temperament):</p>
          <code className="text-xs">f = 440 × 2^((n - 69) / 12)</code>
          <p className="mt-1 text-xs">where n is the MIDI note number (A4 = 69)</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default NoteFrequencyConverter;
