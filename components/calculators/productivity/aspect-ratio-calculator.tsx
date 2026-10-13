'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculateAspectRatio, COMMON_RATIOS, type AspectRatioResults } from '@/lib/calculations/productivity/aspect-ratio-calculator';

export function AspectRatioCalculator() {
  const [width, setWidth] = React.useState(1920);
  const [height, setHeight] = React.useState(1080);
  const [mode, setMode] = React.useState<'calculate' | 'resize-width' | 'resize-height'>('calculate');
  const [targetWidth, setTargetWidth] = React.useState(1280);
  const [targetHeight, setTargetHeight] = React.useState(720);
  const [results, setResults] = React.useState<AspectRatioResults | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleCalculate = React.useCallback(() => {
    try {
      setError(null);
      const result = calculateAspectRatio({ width, height, mode, targetWidth, targetHeight });
      setResults(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Beregningen mislyktes');
      setResults(null);
    }
  }, [width, height, mode, targetWidth, targetHeight]);

  React.useEffect(() => { handleCalculate(); }, [handleCalculate]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Sideforhold</CardTitle>
        <CardDescription>Regn ut og endre størrelse med riktig sideforhold</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <NumberInput id="width" label="Bredde" value={width} onChange={setWidth} min={1} />
          <NumberInput id="height" label="Høyde" value={height} onChange={setHeight} min={1} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Modus</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)} className="w-full p-2 border rounded-md">
            <option value="calculate">Regn ut forhold</option>
            <option value="resize-width">Endre størrelse etter bredde</option>
            <option value="resize-height">Endre størrelse etter høyde</option>
          </select>
        </div>
        {mode === 'resize-width' && (
          <NumberInput id="target-width" label="Ønsket bredde" value={targetWidth} onChange={setTargetWidth} min={1} />
        )}
        {mode === 'resize-height' && (
          <NumberInput id="target-height" label="Ønsket høyde" value={targetHeight} onChange={setTargetHeight} min={1} />
        )}
        <div className="flex flex-wrap gap-2">
          {COMMON_RATIOS.slice(0, 6).map((r) => (
            <Button key={r.ratio} size="sm" variant="outline" onClick={() => {
              const [w, h] = r.ratio.split(':').map(Number);
              setWidth(w * 100);
              setHeight(h * 100);
            }}>{r.ratio}</Button>
          ))}
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {results && (
          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-32 h-20 border-2 border-primary rounded flex items-center justify-center bg-primary/10"
                style={{ aspectRatio: `${results.width}/${results.height}` }}>
                <span className="text-xs font-mono">{results.ratio}</span>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-3">
                <ResultDisplay label="Forhold" value={results.ratio} highlight copyable />
                <ResultDisplay label="Desimaltall" value={results.decimal.toString()} copyable />
                <ResultDisplay label="Mål" value={`${results.width} × ${results.height}`} copyable />
                <ResultDisplay label="Format" value={results.orientation} />
              </div>
            </div>
            {results.commonName && (
              <p className="text-sm text-muted-foreground">Vanlig navn: {results.commonName}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AspectRatioCalculator;
