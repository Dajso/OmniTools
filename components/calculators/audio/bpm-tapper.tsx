'use client';

import { formatFixed } from '@/lib/utils/formatting';
import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import {
  calculateBPMFromTaps,
  calculateDelayTimes,
  BPM_PRESETS,
  type DelayTimes,
} from '@/lib/calculations/audio/bpm-calculator';

export function BPMTapper() {
  const [tapTimestamps, setTapTimestamps] = React.useState<number[]>([]);
  const [bpm, setBpm] = React.useState<number | null>(null);
  const [delayTimes, setDelayTimes] = React.useState<DelayTimes | null>(null);
  const [manualBpm, setManualBpm] = React.useState<number>(120);
  const [mode, setMode] = React.useState<'tap' | 'manual'>('tap');
  const tapButtonRef = React.useRef<HTMLButtonElement>(null);

  const handleTap = React.useCallback(() => {
    const now = performance.now();
    setTapTimestamps(prev => {
      const newTaps = [...prev, now];
      // Keep only last 16 taps to prevent memory issues
      const recentTaps = newTaps.slice(-16);
      
      const calculatedBpm = calculateBPMFromTaps(recentTaps);
      if (calculatedBpm !== null) {
        setBpm(calculatedBpm);
        setDelayTimes(calculateDelayTimes(calculatedBpm));
      }
      
      return recentTaps;
    });
  }, []);

  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' && mode === 'tap') {
      e.preventDefault();
      handleTap();
    }
  }, [handleTap, mode]);

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleReset = () => {
    setTapTimestamps([]);
    setBpm(null);
    setDelayTimes(null);
  };

  const handleManualBpmChange = (value: number) => {
    setManualBpm(value);
    if (value > 0 && value <= 300) {
      setBpm(value);
      setDelayTimes(calculateDelayTimes(value));
    }
  };

  const applyPreset = (presetBpm: number) => {
    setManualBpm(presetBpm);
    setBpm(presetBpm);
    setDelayTimes(calculateDelayTimes(presetBpm));
    setMode('manual');
  };

  const formatMs = (ms: number) => formatFixed(ms, 1);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>BPM-tapper</CardTitle>
        <CardDescription>
          Tapp i takt med musikken, eller skriv inn BPM selv, for å regne ut ekkotider for ulike notelengder.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={mode === 'tap' ? 'default' : 'outline'}
            onClick={() => setMode('tap')}
            size="sm"
          >
            Tappemodus
          </Button>
          <Button
            variant={mode === 'manual' ? 'default' : 'outline'}
            onClick={() => setMode('manual')}
            size="sm"
          >
            Manuell
          </Button>
        </div>

        {mode === 'tap' ? (
          <>
            {/* Tap Area */}
            <button
              ref={tapButtonRef}
              onClick={handleTap}
              className="w-full h-40 rounded-lg bg-primary/10 hover:bg-primary/20 active:bg-primary/30 
                         transition-colors flex flex-col items-center justify-center cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-2 border-dashed border-primary/30"
              aria-label="Tapp for å finne BPM"
            >
              <span className="text-4xl font-bold text-primary">
                {bpm !== null ? `${bpm} BPM` : 'TAPP'}
              </span>
              <span className="text-sm text-muted-foreground mt-2">
                Klikk eller trykk mellomrom
              </span>
              {tapTimestamps.length > 0 && (
                <span className="text-xs text-muted-foreground mt-1">
                  {tapTimestamps.length} tapp{tapTimestamps.length !== 1 ? 's' : ''}
                </span>
              )}
            </button>

            <Button variant="outline" onClick={handleReset} className="w-full">
              Nullstill
            </Button>
          </>
        ) : (
          <>
            {/* Manual BPM Entry */}
            <NumberInput
              id="manual-bpm"
              label="BPM"
              value={manualBpm}
              onChange={handleManualBpmChange}
              min={20}
              max={300}
              step={1}
            />

            {/* Genre Presets */}
            <div>
              <p className="text-sm font-medium mb-2">Sjangervalg</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(BPM_PRESETS).map(([genre, preset]) => (
                  <Button
                    key={genre}
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset(preset.typical)}
                  >
                    {genre.replace('-', ' ')} ({preset.typical})
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* BPM Result */}
        {bpm !== null && (
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="BPM"
              value={bpm}
              highlight
              copyable
            />
            <ResultDisplay
              label="ms per slag"
              value={formatMs(60000 / bpm)}
              unit="ms"
              copyable
            />
          </div>
        )}

        {/* Delay Times */}
        {delayTimes && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Ekkotider</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <ResultDisplay label="1/4-note" value={formatMs(delayTimes.quarter)} unit="ms" copyable />
              <ResultDisplay label="1/8-note" value={formatMs(delayTimes.eighth)} unit="ms" copyable />
              <ResultDisplay label="1/16-note" value={formatMs(delayTimes.sixteenth)} unit="ms" copyable />
              <ResultDisplay label="1/32-note" value={formatMs(delayTimes.thirtySecond)} unit="ms" copyable />
              <ResultDisplay label="Punktert 1/4" value={formatMs(delayTimes.dottedQuarter)} unit="ms" copyable />
              <ResultDisplay label="Punktert 1/8" value={formatMs(delayTimes.dottedEighth)} unit="ms" copyable />
              <ResultDisplay label="Trioler 1/4" value={formatMs(delayTimes.tripletQuarter)} unit="ms" copyable />
              <ResultDisplay label="Trioler 1/8" value={formatMs(delayTimes.tripletEighth)} unit="ms" copyable />
              <ResultDisplay label="Trioler 1/16" value={formatMs(delayTimes.tripletSixteenth)} unit="ms" copyable />
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-1">Slik bruker du den:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Trykk på knappen eller mellomromstasten i takt med musikken</li>
            <li>BPM regnes ut som gjennomsnittet av de siste 8 tappene</li>
            <li>Bruk ekkotidene når du stiller inn delay- og romklangseffekter</li>
            <li>Bytt til manuell modus for å skrive inn en bestemt BPM</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default BPMTapper;
