'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResultDisplay } from '@/components/ui/result-display';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import {
  frequencyToNote,
  noteToFrequency,
  formatNote,
  CONCERT_PITCHES,
} from '@/lib/calculations/audio/note-frequency';
import { formatFixed } from '@/lib/utils/formatting';

// Standard guitar tuning frequencies
const GUITAR_TUNINGS = {
  standard: {
    name: 'Standard (EADGBE)',
    notes: [
      { string: 6, note: 'E', octave: 2 },
      { string: 5, note: 'A', octave: 2 },
      { string: 4, note: 'D', octave: 3 },
      { string: 3, note: 'G', octave: 3 },
      { string: 2, note: 'B', octave: 3 },
      { string: 1, note: 'E', octave: 4 },
    ],
  },
  dropD: {
    name: 'Drop D (DADGBE)',
    notes: [
      { string: 6, note: 'D', octave: 2 },
      { string: 5, note: 'A', octave: 2 },
      { string: 4, note: 'D', octave: 3 },
      { string: 3, note: 'G', octave: 3 },
      { string: 2, note: 'B', octave: 3 },
      { string: 1, note: 'E', octave: 4 },
    ],
  },
  halfStepDown: {
    name: 'Halvtone ned (Eb)',
    notes: [
      { string: 6, note: 'D#', octave: 2 },
      { string: 5, note: 'G#', octave: 2 },
      { string: 4, note: 'C#', octave: 3 },
      { string: 3, note: 'F#', octave: 3 },
      { string: 2, note: 'A#', octave: 3 },
      { string: 1, note: 'D#', octave: 4 },
    ],
  },
  openG: {
    name: 'Åpen G (DGDGBD)',
    notes: [
      { string: 6, note: 'D', octave: 2 },
      { string: 5, note: 'G', octave: 2 },
      { string: 4, note: 'D', octave: 3 },
      { string: 3, note: 'G', octave: 3 },
      { string: 2, note: 'B', octave: 3 },
      { string: 1, note: 'D', octave: 4 },
    ],
  },
  dadgad: {
    name: 'DADGAD',
    notes: [
      { string: 6, note: 'D', octave: 2 },
      { string: 5, note: 'A', octave: 2 },
      { string: 4, note: 'D', octave: 3 },
      { string: 3, note: 'G', octave: 3 },
      { string: 2, note: 'A', octave: 3 },
      { string: 1, note: 'D', octave: 4 },
    ],
  },
};

type TuningKey = keyof typeof GUITAR_TUNINGS;

export function GuitarTuner() {
  const [isListening, setIsListening] = React.useState(false);
  const [hasPermission, setHasPermission] = React.useState<boolean | null>(null);
  const [detectedFrequency, setDetectedFrequency] = React.useState<number | null>(null);
  const [detectedNote, setDetectedNote] = React.useState<string | null>(null);
  const [cents, setCents] = React.useState<number>(0);
  const [selectedTuning, setSelectedTuning] = React.useState<TuningKey>('standard');
  const [referenceFreq, setReferenceFreq] = React.useState<number>(440);
  const [selectedString, setSelectedString] = React.useState<number | null>(null);

  const audioContextRef = React.useRef<AudioContext | null>(null);
  const analyserRef = React.useRef<AnalyserNode | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const animationRef = React.useRef<number | null>(null);

  const tuning = GUITAR_TUNINGS[selectedTuning];

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setHasPermission(true);

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 4096;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsListening(true);
      detectPitch();
    } catch (err) {
      console.error('Mikrofontilgang nektet:', err);
      setHasPermission(false);
    }
  };

  const stopListening = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsListening(false);
    setDetectedFrequency(null);
    setDetectedNote(null);
    setCents(0);
  };

  const detectPitch = () => {
    if (!analyserRef.current || !audioContextRef.current) return;

    const analyser = analyserRef.current;
    const sampleRate = audioContextRef.current.sampleRate;
    const bufferLength = analyser.fftSize;
    const buffer = new Float32Array(bufferLength);

    const detect = () => {
      analyser.getFloatTimeDomainData(buffer);

      // Autocorrelation pitch detection
      const frequency = autoCorrelate(buffer, sampleRate);

      if (frequency > 0) {
        setDetectedFrequency(Math.round(frequency * 10) / 10);
        
        try {
          const noteResult = frequencyToNote(frequency, referenceFreq);
          setDetectedNote(formatNote(noteResult.note));
          setCents(noteResult.cents);
        } catch {
          setDetectedNote(null);
          setCents(0);
        }
      }

      animationRef.current = requestAnimationFrame(detect);
    };

    detect();
  };

  // Autocorrelation algorithm for pitch detection
  const autoCorrelate = (buffer: Float32Array, sampleRate: number): number => {
    // Find the RMS of the signal
    let rms = 0;
    for (let i = 0; i < buffer.length; i++) {
      rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / buffer.length);

    // Not enough signal
    if (rms < 0.01) return -1;

    // Find the first point where the signal crosses zero
    let r1 = 0;
    let r2 = buffer.length - 1;
    const threshold = 0.2;

    for (let i = 0; i < buffer.length / 2; i++) {
      if (Math.abs(buffer[i]) < threshold) {
        r1 = i;
        break;
      }
    }

    for (let i = 1; i < buffer.length / 2; i++) {
      if (Math.abs(buffer[buffer.length - i]) < threshold) {
        r2 = buffer.length - i;
        break;
      }
    }

    const buf2 = buffer.slice(r1, r2);
    const c = new Array(buf2.length).fill(0);

    for (let i = 0; i < buf2.length; i++) {
      for (let j = 0; j < buf2.length - i; j++) {
        c[i] += buf2[j] * buf2[j + i];
      }
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;

    let maxVal = -1;
    let maxPos = -1;

    for (let i = d; i < buf2.length; i++) {
      if (c[i] > maxVal) {
        maxVal = c[i];
        maxPos = i;
      }
    }

    let t0 = maxPos;

    // Parabolic interpolation
    const x1 = c[t0 - 1];
    const x2 = c[t0];
    const x3 = c[t0 + 1];
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;

    if (a) t0 = t0 - b / (2 * a);

    return sampleRate / t0;
  };

  React.useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  const getTuneIndicator = () => {
    if (cents === 0) return { text: 'Stemt!', color: 'text-green-600' };
    if (Math.abs(cents) <= 5) return { text: 'Nesten der', color: 'text-green-500' };
    if (Math.abs(cents) <= 10) return { text: 'Nær', color: 'text-yellow-500' };
    if (cents > 0) return { text: 'For høy ↑', color: 'text-orange-500' };
    return { text: 'For lav ↓', color: 'text-blue-500' };
  };

  const tuningOptions = Object.entries(GUITAR_TUNINGS).map(([key, value]) => ({
    value: key,
    label: value.name,
  }));

  const pitchOptions = Object.entries(CONCERT_PITCHES).map(([name, freq]) => ({
    value: String(freq),
    label: `${name} (${freq} Hz)`,
  }));

  const indicator = getTuneIndicator();

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Gitarstemmer</CardTitle>
        <CardDescription>
          Bruk mikrofonen til å stemme gitaren. Støtter flere stemminger og referansetoner.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Settings */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tuning">Stemming</Label>
            <Select
              id="tuning"
              options={tuningOptions}
              value={selectedTuning}
              onChange={(e) => setSelectedTuning(e.target.value as TuningKey)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reference">Referansetone</Label>
            <Select
              id="reference"
              options={pitchOptions}
              value={String(referenceFreq)}
              onChange={(e) => setReferenceFreq(Number(e.target.value))}
            />
          </div>
        </div>

        {/* String Selection */}
        <div>
          <p className="text-sm font-medium mb-2">Velg streng å stemme</p>
          <div className="flex gap-2 justify-center">
            {tuning.notes.map((stringNote) => {
              const targetFreq = noteToFrequency(stringNote.note, stringNote.octave, referenceFreq);
              return (
                <Button
                  key={stringNote.string}
                  variant={selectedString === stringNote.string ? 'default' : 'outline'}
                  onClick={() => setSelectedString(stringNote.string)}
                  className="flex flex-col h-auto py-2"
                >
                  <span className="text-xs text-muted-foreground">Streng {stringNote.string}</span>
                  <span className="font-bold">{stringNote.note}{stringNote.octave}</span>
                  <span className="text-xs">{formatFixed(targetFreq, 1)} Hz</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Tuner Display */}
        <div className="border rounded-lg p-6 text-center bg-muted/30">
          {!isListening ? (
            <div className="space-y-4">
              {hasPermission === false && (
                <p className="text-destructive text-sm">
                  Mikrofontilgang nektet. Gi nettleseren tilgang til mikrofonen for å bruke stemmeren.
                </p>
              )}
              <Button onClick={startListening} size="lg">
                Start stemming
              </Button>
              <p className="text-sm text-muted-foreground">
                Trykk for å slå på mikrofonen og begynne å stemme
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Detected Note */}
              <div>
                <p className="text-6xl font-bold">
                  {detectedNote || '—'}
                </p>
                <p className="text-2xl text-muted-foreground">
                  {detectedFrequency ? `${detectedFrequency} Hz` : 'Lytter …'}
                </p>
              </div>

              {/* Cents Indicator */}
              {detectedNote && (
                <div className="space-y-2">
                  {/* Visual meter */}
                  <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                    <div className="absolute inset-y-0 left-1/2 w-1 bg-green-500 -translate-x-1/2" />
                    <div 
                      className="absolute inset-y-0 w-3 bg-primary rounded-full transition-all"
                      style={{ 
                        left: `${50 + (cents / 50) * 40}%`,
                        transform: 'translateX(-50%)'
                      }}
                    />
                  </div>
                  <p className={`text-lg font-medium ${indicator.color}`}>
                    {indicator.text}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {cents > 0 ? '+' : ''}{formatFixed(cents, 1)} cent
                  </p>
                </div>
              )}

              <Button variant="outline" onClick={stopListening}>
                Stopp stemming
              </Button>
            </div>
          )}
        </div>

        {/* Reference Frequencies */}
        {selectedString && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">Måltone for streng {selectedString}</p>
            {(() => {
              const stringNote = tuning.notes.find(n => n.string === selectedString);
              if (!stringNote) return null;
              const targetFreq = noteToFrequency(stringNote.note, stringNote.octave, referenceFreq);
              return (
                <ResultDisplay
                  label={`${stringNote.note}${stringNote.octave}`}
                  value={formatFixed(targetFreq, 2)}
                  unit="Hz"
                  highlight
                />
              );
            })()}
          </div>
        )}

        {/* Instructions */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-1">Tips for presis stemming:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Stem i rolige omgivelser for best resultat</li>
            <li>Slå an strengen tydelig og la den klinge</li>
            <li>Stem opp til tonen i stedet for ned når det er mulig</li>
            <li>Sjekk stemmingen igjen etter at alle strengene er justert</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default GuitarTuner;
