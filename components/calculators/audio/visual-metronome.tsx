'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NumberInput } from '@/components/ui/number-input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { BPM_PRESETS } from '@/lib/calculations/audio/bpm-calculator';
import { formatFixed } from '@/lib/utils/formatting';

type TimeSignature = '4/4' | '3/4' | '6/8' | '2/4' | '5/4' | '7/8';

const TIME_SIGNATURES: Record<TimeSignature, { beats: number; subdivision: number }> = {
  '4/4': { beats: 4, subdivision: 4 },
  '3/4': { beats: 3, subdivision: 4 },
  '6/8': { beats: 6, subdivision: 8 },
  '2/4': { beats: 2, subdivision: 4 },
  '5/4': { beats: 5, subdivision: 4 },
  '7/8': { beats: 7, subdivision: 8 },
};

export function VisualMetronome() {
  const [bpm, setBpm] = React.useState<number>(120);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentBeat, setCurrentBeat] = React.useState<number>(0);
  const [timeSignature, setTimeSignature] = React.useState<TimeSignature>('4/4');
  const [accentFirst, setAccentFirst] = React.useState(true);
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [flashEnabled, setFlashEnabled] = React.useState(true);

  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = React.useRef<AudioContext | null>(null);

  const { beats } = TIME_SIGNATURES[timeSignature];

  const playClick = React.useCallback((isAccent: boolean) => {
    if (!soundEnabled) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Higher pitch for accent, lower for regular beat
    oscillator.frequency.value = isAccent ? 1000 : 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }, [soundEnabled]);

  const startTimer = React.useCallback(() => {
    const msPerBeat = 60000 / bpm;
    setCurrentBeat(1);
    playClick(accentFirst);

    intervalRef.current = setInterval(() => {
      setCurrentBeat(prev => {
        const nextBeat = prev >= beats ? 1 : prev + 1;
        playClick(accentFirst && nextBeat === 1);
        return nextBeat;
      });
    }, msPerBeat);
  }, [bpm, beats, accentFirst, playClick]);

  const stopTimer = React.useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentBeat(0);
  }, []);

  const handleStart = React.useCallback(() => {
    startTimer();
    setIsPlaying(true);
  }, [startTimer]);

  const handleStop = React.useCallback(() => {
    stopTimer();
    setIsPlaying(false);
  }, [stopTimer]);



  const toggleMetronome = () => {
    if (isPlaying) {
      handleStop();
    } else {
      handleStart();
    }
  };

  // Restart metronome when BPM or time signature changes while playing
  React.useEffect(() => {
    if (isPlaying) {
      stopTimer();
      startTimer();
    }
  }, [bpm, timeSignature, isPlaying, stopTimer, startTimer]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const timeSignatureOptions = Object.keys(TIME_SIGNATURES).map(ts => ({
    value: ts,
    label: ts,
  }));

  const adjustBpm = (delta: number) => {
    setBpm(prev => Math.max(20, Math.min(300, prev + delta)));
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Visuell metronom</CardTitle>
        <CardDescription>
          Hold takten med lys og lyd. Fint til øving.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* BPM Control */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => adjustBpm(-5)}
            className="text-xl"
          >
            -5
          </Button>
          <Button
            variant="outline"
            onClick={() => adjustBpm(-1)}
          >
            -1
          </Button>
          <div className="flex-1 text-center">
            <NumberInput
              id="bpm"
              label=""
              value={bpm}
              onChange={setBpm}
              min={20}
              max={300}
              step={1}
              className="text-center"
            />
            <p className="text-sm text-muted-foreground mt-1">BPM</p>
          </div>
          <Button
            variant="outline"
            onClick={() => adjustBpm(1)}
          >
            +1
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => adjustBpm(5)}
            className="text-xl"
          >
            +5
          </Button>
        </div>

        {/* Genre Presets */}
        <div>
          <p className="text-sm font-medium mb-2">Tempovalg</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(BPM_PRESETS).slice(0, 6).map(([genre, preset]) => (
              <Button
                key={genre}
                variant={bpm === preset.typical ? 'default' : 'outline'}
                size="sm"
                onClick={() => setBpm(preset.typical)}
              >
                {genre.replace('-', ' ')} ({preset.typical})
              </Button>
            ))}
          </div>
        </div>

        {/* Time Signature */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="time-signature">Taktart</Label>
            <Select
              id="time-signature"
              options={timeSignatureOptions}
              value={timeSignature}
              onChange={(e) => setTimeSignature(e.target.value as TimeSignature)}
            />
          </div>
          <div className="space-y-2">
            <Label>Valg</Label>
            <div className="flex gap-2">
              <Button
                variant={accentFirst ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAccentFirst(!accentFirst)}
              >
                Aksent på 1
              </Button>
              <Button
                variant={soundEnabled ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                Lyd
              </Button>
              <Button
                variant={flashEnabled ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFlashEnabled(!flashEnabled)}
              >
                Blink
              </Button>
            </div>
          </div>
        </div>

        {/* Visual Beat Display */}
        <div
          className={`
            rounded-lg p-8 transition-colors duration-100
            ${isPlaying && flashEnabled && currentBeat > 0
              ? currentBeat === 1 && accentFirst
                ? 'bg-primary'
                : 'bg-primary/60'
              : 'bg-muted'
            }
          `}
        >
          <div className="flex justify-center gap-3">
            {Array.from({ length: beats }, (_, i) => (
              <div
                key={i}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold
                  transition-all duration-100
                  ${currentBeat === i + 1
                    ? i === 0 && accentFirst
                      ? 'bg-white text-primary scale-125'
                      : 'bg-white/80 text-primary scale-110'
                    : 'bg-muted-foreground/20 text-muted-foreground'
                  }
                `}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <p className="text-center mt-4 text-4xl font-bold text-white">
            {isPlaying ? currentBeat : '—'}
          </p>
        </div>

        {/* Play/Stop Button */}
        <Button
          onClick={toggleMetronome}
          size="lg"
          className="w-full text-xl py-6"
          variant={isPlaying ? 'destructive' : 'default'}
        >
          {isPlaying ? 'Stopp' : 'Start'}
        </Button>

        {/* Tempo Info */}
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-muted-foreground">ms per slag</p>
            <p className="font-bold">{formatFixed((60000 / bpm), 1)}</p>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-muted-foreground">slag per sekund</p>
            <p className="font-bold">{formatFixed((bpm / 60), 2)}</p>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-muted-foreground">taktvarighet</p>
            <p className="font-bold">{formatFixed(((60000 / bpm) * beats / 1000), 2)}s</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-1">Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Bruk tastatur: mellomrom starter og stopper</li>
            <li>Slå på «Aksent på 1» for å markere første slag</li>
            <li>Juster BPM med +/- eller skriv inn direkte</li>
            <li>Prøv ulike taktarter for ulike stilarter</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default VisualMetronome;
