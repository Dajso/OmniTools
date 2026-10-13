'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculateImageResolution, COMMON_PRINT_SIZES, type ImageResolutionResults } from '@/lib/calculations/productivity/image-resolution-calculator';

const fmt1 = (v: number) => v.toLocaleString('nb-NO', { maximumFractionDigits: 1 });

export function ImageResolutionCalculator() {
  const [mode, setMode] = React.useState<'calculate-dpi' | 'calculate-print-size' | 'calculate-pixels'>('calculate-print-size');
  const [widthPixels, setWidthPixels] = React.useState(3000);
  const [heightPixels, setHeightPixels] = React.useState(2000);
  const [widthCm, setWidthCm] = React.useState(30);
  const [heightCm, setHeightCm] = React.useState(20);
  const [dpi, setDpi] = React.useState(300);
  const [results, setResults] = React.useState<ImageResolutionResults | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleCalculate = React.useCallback(() => {
    try {
      setError(null);
      const result = calculateImageResolution({ mode, widthPixels, heightPixels, widthCm, heightCm, dpi });
      setResults(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Beregningen mislyktes');
      setResults(null);
    }
  }, [mode, widthPixels, heightPixels, widthCm, heightCm, dpi]);

  React.useEffect(() => { handleCalculate(); }, [handleCalculate]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Bildeoppløsning</CardTitle>
        <CardDescription>Regn ut DPI, trykkstørrelse og antall piksler</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Regn ut</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)} className="w-full p-2 border rounded-md">
            <option value="calculate-print-size">Trykkstørrelse (fra piksler og DPI)</option>
            <option value="calculate-pixels">Piksler (fra trykkstørrelse og DPI)</option>
            <option value="calculate-dpi">DPI (fra piksler og trykkstørrelse)</option>
          </select>
        </div>
        {(mode === 'calculate-print-size' || mode === 'calculate-dpi') && (
          <div className="grid grid-cols-2 gap-4">
            <NumberInput id="width-px" label="Bredde (piksler)" value={widthPixels} onChange={setWidthPixels} min={1} />
            <NumberInput id="height-px" label="Høyde (piksler)" value={heightPixels} onChange={setHeightPixels} min={1} />
          </div>
        )}
        {(mode === 'calculate-pixels' || mode === 'calculate-dpi') && (
          <div className="grid grid-cols-2 gap-4">
            <NumberInput id="width-cm" label="Bredde (cm)" value={widthCm} onChange={setWidthCm} min={0.1} step={0.5} />
            <NumberInput id="height-cm" label="Høyde (cm)" value={heightCm} onChange={setHeightCm} min={0.1} step={0.5} />
          </div>
        )}
        {(mode === 'calculate-print-size' || mode === 'calculate-pixels') && (
          <NumberInput id="dpi" label="DPI/PPI" value={dpi} onChange={setDpi} min={1} />
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {results && (
          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <ResultDisplay label="Piksler" value={`${results.widthPixels} × ${results.heightPixels}`} copyable />
              <ResultDisplay label="Trykkstørrelse (cm)" value={`${fmt1(results.widthCm)} × ${fmt1(results.heightCm)} cm`} copyable />
              <ResultDisplay label="Trykkstørrelse (tommer)" value={`${fmt1(results.widthInches)}" × ${fmt1(results.heightInches)}"`} />
              <ResultDisplay label="DPI/PPI" value={results.dpi.toString()} copyable />
              <ResultDisplay label="Megapiksler" value={`${results.megapixels} MP`} />
              <ResultDisplay label="Kvalitet" value={results.printQuality} />
            </div>
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-medium mb-2">Anslått filstørrelse</p>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span>RAW: {results.fileSize.raw}</span>
                <span>JPEG: {results.fileSize.jpeg}</span>
                <span>PNG: {results.fileSize.png}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ImageResolutionCalculator;
