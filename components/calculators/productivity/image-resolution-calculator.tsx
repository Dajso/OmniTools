'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculateImageResolution, COMMON_PRINT_SIZES, type ImageResolutionResults } from '@/lib/calculations/productivity/image-resolution-calculator';

export function ImageResolutionCalculator() {
  const [mode, setMode] = React.useState<'calculate-dpi' | 'calculate-print-size' | 'calculate-pixels'>('calculate-print-size');
  const [widthPixels, setWidthPixels] = React.useState(3000);
  const [heightPixels, setHeightPixels] = React.useState(2000);
  const [widthInches, setWidthInches] = React.useState(10);
  const [heightInches, setHeightInches] = React.useState(8);
  const [dpi, setDpi] = React.useState(300);
  const [results, setResults] = React.useState<ImageResolutionResults | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleCalculate = () => {
    try {
      setError(null);
      const result = calculateImageResolution({ mode, widthPixels, heightPixels, widthInches, heightInches, dpi });
      setResults(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Calculation failed');
      setResults(null);
    }
  };

  React.useEffect(() => { handleCalculate(); }, [mode, widthPixels, heightPixels, widthInches, heightInches, dpi]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Image Resolution Calculator</CardTitle>
        <CardDescription>Calculate DPI, print size, and pixel dimensions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Calculate</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)} className="w-full p-2 border rounded-md">
            <option value="calculate-print-size">Print Size (from pixels + DPI)</option>
            <option value="calculate-pixels">Pixels (from print size + DPI)</option>
            <option value="calculate-dpi">DPI (from pixels + print size)</option>
          </select>
        </div>
        {(mode === 'calculate-print-size' || mode === 'calculate-dpi') && (
          <div className="grid grid-cols-2 gap-4">
            <NumberInput id="width-px" label="Width (pixels)" value={widthPixels} onChange={setWidthPixels} min={1} />
            <NumberInput id="height-px" label="Height (pixels)" value={heightPixels} onChange={setHeightPixels} min={1} />
          </div>
        )}
        {(mode === 'calculate-pixels' || mode === 'calculate-dpi') && (
          <div className="grid grid-cols-2 gap-4">
            <NumberInput id="width-in" label="Width (inches)" value={widthInches} onChange={setWidthInches} min={0.1} step={0.1} />
            <NumberInput id="height-in" label="Height (inches)" value={heightInches} onChange={setHeightInches} min={0.1} step={0.1} />
          </div>
        )}
        {(mode === 'calculate-print-size' || mode === 'calculate-pixels') && (
          <NumberInput id="dpi" label="DPI/PPI" value={dpi} onChange={setDpi} min={1} />
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {results && (
          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <ResultDisplay label="Pixels" value={`${results.widthPixels} × ${results.heightPixels}`} copyable />
              <ResultDisplay label="Print Size (in)" value={`${results.widthInches}" × ${results.heightInches}"`} copyable />
              <ResultDisplay label="Print Size (cm)" value={`${results.widthCm} × ${results.heightCm} cm`} copyable />
              <ResultDisplay label="DPI/PPI" value={results.dpi.toString()} copyable />
              <ResultDisplay label="Megapixels" value={`${results.megapixels} MP`} />
              <ResultDisplay label="Quality" value={results.printQuality} />
            </div>
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-medium mb-2">Estimated File Sizes</p>
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
