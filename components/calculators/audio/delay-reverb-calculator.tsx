'use client';

import { formatFixed } from '@/lib/utils/formatting';
import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import {
  calculateDelayTimes,
  calculateReverbPreDelay,
  calculateReverbDecay,
  BPM_PRESETS,
  type DelayTimes,
} from '@/lib/calculations/audio/bpm-calculator';
import { Button } from '@/components/ui/button';

export function DelayReverbCalculator() {
  const [bpm, setBpm] = React.useState<number>(120);
  const [delayTimes, setDelayTimes] = React.useState<DelayTimes | null>(null);
  const [reverbPreDelay, setReverbPreDelay] = React.useState<number>(0);
  const [reverbDecay, setReverbDecay] = React.useState<number>(0);
  const [decayBeats, setDecayBeats] = React.useState<number>(2);

  React.useEffect(() => {
    if (bpm > 0 && bpm <= 300) {
      setDelayTimes(calculateDelayTimes(bpm));
      setReverbPreDelay(calculateReverbPreDelay(bpm, 1/64));
      setReverbDecay(calculateReverbDecay(bpm, decayBeats));
    }
  }, [bpm, decayBeats]);

  const formatMs = (ms: number) => formatFixed(ms, 1);

  const applyPreset = (presetBpm: number) => {
    setBpm(presetBpm);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Delay- og romklangkalkulator</CardTitle>
        <CardDescription>
          Regn ut tempo-synkede delay- og romklangtider til musikkproduksjonen din.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* BPM Input */}
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="bpm"
            label="BPM (tempo)"
            value={bpm}
            onChange={setBpm}
            min={20}
            max={300}
            step={1}
          />
          <NumberInput
            id="decay-beats"
            label="Romklangens utklingning (slag)"
            value={decayBeats}
            onChange={setDecayBeats}
            min={0.5}
            max={8}
            step={0.5}
          />
        </div>

        {/* Genre Presets */}
        <div>
          <p className="text-sm font-medium mb-2">Sjangervalg</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(BPM_PRESETS).slice(0, 6).map(([genre, preset]) => (
              <Button
                key={genre}
                variant={bpm === preset.typical ? 'default' : 'outline'}
                size="sm"
                onClick={() => applyPreset(preset.typical)}
              >
                {genre.replace('-', ' ')} ({preset.typical})
              </Button>
            ))}
          </div>
        </div>

        {/* Reverb Times */}
        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Romklanginnstillinger</p>
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Pre-delay (1/64-note)"
              value={formatMs(reverbPreDelay)}
              unit="ms"
              copyable
            />
            <ResultDisplay
              label={`Utklingningstid (${decayBeats} slag)`}
              value={formatMs(reverbDecay)}
              unit="ms"
              copyable
            />
          </div>
        </div>

        {/* Delay Times - Standard Notes */}
        {delayTimes && (
          <>
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3">Vanlige notelengder</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <ResultDisplay label="1/4-note" value={formatMs(delayTimes.quarter)} unit="ms" copyable />
                <ResultDisplay label="1/8-note" value={formatMs(delayTimes.eighth)} unit="ms" copyable />
                <ResultDisplay label="1/16-note" value={formatMs(delayTimes.sixteenth)} unit="ms" copyable />
                <ResultDisplay label="1/32-note" value={formatMs(delayTimes.thirtySecond)} unit="ms" copyable />
              </div>
            </div>

            {/* Delay Times - Dotted Notes */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3">Punkterte noter</p>
              <div className="grid grid-cols-3 gap-3">
                <ResultDisplay label="Punktert 1/4" value={formatMs(delayTimes.dottedQuarter)} unit="ms" copyable />
                <ResultDisplay label="Punktert 1/8" value={formatMs(delayTimes.dottedEighth)} unit="ms" copyable />
                <ResultDisplay label="Punktert 1/16" value={formatMs(delayTimes.dottedSixteenth)} unit="ms" copyable />
              </div>
            </div>

            {/* Delay Times - Triplet Notes */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3">Trioler</p>
              <div className="grid grid-cols-3 gap-3">
                <ResultDisplay label="Trioler 1/4" value={formatMs(delayTimes.tripletQuarter)} unit="ms" copyable />
                <ResultDisplay label="Trioler 1/8" value={formatMs(delayTimes.tripletEighth)} unit="ms" copyable />
                <ResultDisplay label="Trioler 1/16" value={formatMs(delayTimes.tripletSixteenth)} unit="ms" copyable />
              </div>
            </div>
          </>
        )}

        {/* Formula Reference */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-1">Formler:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Kvartnote (ms) = 60 000 ÷ BPM</li>
            <li>Punktert note = note × 1,5</li>
            <li>Triolnote = note × (2/3)</li>
            <li>Pre-delay = kvartnote × (1/16)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default DelayReverbCalculator;
