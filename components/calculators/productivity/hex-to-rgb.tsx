'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ResultDisplay } from '@/components/ui/result-display';
import { convertColor, type ColorResults } from '@/lib/calculations/productivity/hex-to-rgb';

export function HexToRgbConverter() {
  const [input, setInput] = React.useState('#3b82f6');
  const [mode, setMode] = React.useState<'hex-to-rgb' | 'rgb-to-hex'>('hex-to-rgb');
  const [results, setResults] = React.useState<ColorResults | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleConvert = () => {
    try {
      setError(null);
      const result = convertColor({ value: input, mode });
      setResults(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed');
      setResults(null);
    }
  };

  React.useEffect(() => { handleConvert(); }, []);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Hex to RGB Converter</CardTitle>
        <CardDescription>Convert between hex and RGB color formats</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button variant={mode === 'hex-to-rgb' ? 'default' : 'outline'} onClick={() => setMode('hex-to-rgb')}>Hex → RGB</Button>
          <Button variant={mode === 'rgb-to-hex' ? 'default' : 'outline'} onClick={() => setMode('rgb-to-hex')}>RGB → Hex</Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="color-input">{mode === 'hex-to-rgb' ? 'Hex Color' : 'RGB Values'}</Label>
          <input
            id="color-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'hex-to-rgb' ? '#3b82f6 or 3b82f6' : '59, 130, 246'}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <Button onClick={handleConvert} className="w-full">Convert</Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {results && (
          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg border shadow-sm" style={{ backgroundColor: results.hex }} />
              <div className="flex-1 grid grid-cols-2 gap-3">
                <ResultDisplay label="Hex" value={results.hex} copyable />
                <ResultDisplay label="RGB" value={results.rgbString} copyable />
                <ResultDisplay label="HSL" value={results.hslString} copyable />
                <ResultDisplay label="R, G, B" value={`${results.rgb.r}, ${results.rgb.g}, ${results.rgb.b}`} copyable />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default HexToRgbConverter;
