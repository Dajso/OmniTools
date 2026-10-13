'use client';

import * as React from 'react';
import { formatFixed } from '@/lib/utils/formatting';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Card } from '@/components/ui/card';

interface AspectRatioResult {
  width: number;
  height: number;
  ratio: string;
  decimal: number;
  megapixels: number;
}

const COMMON_RATIOS = [
  { name: '16:9', width: 16, height: 9, description: 'HD-video, YouTube' },
  { name: '4:3', width: 4, height: 3, description: 'Vanlig TV, iPad' },
  { name: '3:2', width: 3, height: 2, description: 'Speilrefleks-bilder' },
  { name: '1:1', width: 1, height: 1, description: 'Instagram, kvadratisk' },
  { name: '21:9', width: 21, height: 9, description: 'Ultrabredt kino' },
  { name: '9:16', width: 9, height: 16, description: 'TikTok, Stories' },
  { name: '2.39:1', width: 2.39, height: 1, description: 'Anamorfisk kino' },
  { name: '1.85:1', width: 1.85, height: 1, description: 'Bredt kinoformat' },
];

const RESOLUTION_PRESETS = [
  { name: '4K UHD', width: 3840, height: 2160 },
  { name: '1080p', width: 1920, height: 1080 },
  { name: '720p', width: 1280, height: 720 },
  { name: '8K', width: 7680, height: 4320 },
  { name: 'Instagram', width: 1080, height: 1080 },
  { name: 'TikTok', width: 1080, height: 1920 },
];

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function calculateAspectRatio(width: number, height: number): AspectRatioResult {
  const divisor = gcd(width, height);
  const ratioWidth = Math.round(width / divisor);
  const ratioHeight = Math.round(height / divisor);
  const decimal = width / height;
  const megapixels = (width * height) / 1000000;

  return {
    width,
    height,
    ratio: `${ratioWidth}:${ratioHeight}`,
    decimal: Math.round(decimal * 1000) / 1000,
    megapixels: Math.round(megapixels * 100) / 100,
  };
}

function calculateDimension(
  known: 'width' | 'height',
  value: number,
  ratioWidth: number,
  ratioHeight: number
): { width: number; height: number } {
  if (known === 'width') {
    return {
      width: value,
      height: Math.round((value * ratioHeight) / ratioWidth),
    };
  }
  return {
    width: Math.round((value * ratioWidth) / ratioHeight),
    height: value,
  };
}

export function AspectRatioCalculator() {
  const [width, setWidth] = React.useState(1920);
  const [height, setHeight] = React.useState(1080);
  const [targetWidth, setTargetWidth] = React.useState(3840);
  const [result, setResult] = React.useState<AspectRatioResult | null>(null);
  const [scaledResult, setScaledResult] = React.useState<{ width: number; height: number } | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      if (width <= 0 || height <= 0) {
        setError('Bredde og høyde må være større enn 0');
        setResult(null);
        return;
      }

      const aspectResult = calculateAspectRatio(width, height);
      setResult(aspectResult);

      if (targetWidth > 0) {
        const divisor = gcd(width, height);
        const ratioW = width / divisor;
        const ratioH = height / divisor;
        const scaled = calculateDimension('width', targetWidth, ratioW, ratioH);
        setScaledResult(scaled);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
      setResult(null);
    }
  }, [width, height, targetWidth]);

  const reset = () => {
    setWidth(1920);
    setHeight(1080);
    setTargetWidth(3840);
    setResult(null);
    setScaledResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const applyRatio = (ratioWidth: number, ratioHeight: number) => {
    const newHeight = Math.round((width * ratioHeight) / ratioWidth);
    setHeight(newHeight);
  };

  const applyPreset = (presetWidth: number, presetHeight: number) => {
    setWidth(presetWidth);
    setHeight(presetHeight);
  };

  return (
    <CalculatorBase
      title="Bildeformat"
      description="Regn ut og omform sideforhold for video og foto"
      formula="Sideforhold = bredde : høyde (forkortet)"
      formulaExplanation="Finn det forkortede forholdet og skaler størrelsen med samme proporsjoner"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay
            label="Sideforhold"
            value={result.ratio}
            highlight
            copyable
          />
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Desimalforhold"
              value={result.decimal.toString()}
              copyable
            />
            <ResultDisplay
              label="Megapiksler"
              value={`${formatFixed(result.megapixels, 2)} MP`}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Bredde"
              value={`${result.width} px`}
            />
            <ResultDisplay
              label="Høyde"
              value={`${result.height} px`}
            />
          </div>
          {scaledResult && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-2">Skalert til {targetWidth}px bredde:</p>
              <div className="grid grid-cols-2 gap-4">
                <ResultDisplay
                  label="Ny bredde"
                  value={`${scaledResult.width} px`}
                  copyable
                />
                <ResultDisplay
                  label="Ny høyde"
                  value={`${scaledResult.height} px`}
                  copyable
                />
              </div>
            </div>
          )}
          {/* Visual Preview */}
          <div className="bg-muted/50 p-4 rounded-md">
            <p className="text-sm font-medium mb-2">Forhåndsvisning</p>
            <div className="flex justify-center">
              <div
                className="bg-primary/20 border-2 border-primary rounded"
                style={{
                  width: Math.min(200, 200 * (result.width / Math.max(result.width, result.height))),
                  height: Math.min(200, 200 * (result.height / Math.max(result.width, result.height))),
                }}
              >
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                  {result.ratio}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="width"
            label="Bredde (piksler)"
            value={width}
            onChange={setWidth}
            min={1}
            max={100000}
            step={1}
          />
          <NumberInput
            id="height"
            label="Høyde (piksler)"
            value={height}
            onChange={setHeight}
            min={1}
            max={100000}
            step={1}
          />
        </div>

        <NumberInput
          id="target-width"
          label="Skaler til bredde (piksler)"
          value={targetWidth}
          onChange={setTargetWidth}
          min={1}
          max={100000}
          step={1}
        />

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Vanlige sideforhold</p>
          <div className="grid grid-cols-2 gap-2">
            {COMMON_RATIOS.slice(0, 6).map((ratio) => (
              <Card
                key={ratio.name}
                className="p-2 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => applyRatio(ratio.width, ratio.height)}
              >
                <p className="text-sm font-medium">{ratio.name}</p>
                <p className="text-xs text-muted-foreground">{ratio.description}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Vanlige oppløsninger</p>
          <div className="flex gap-2 flex-wrap">
            {RESOLUTION_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset.width, preset.height)}
                className="px-3 py-1 text-xs rounded-md border bg-background hover:bg-muted border-input transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default AspectRatioCalculator;
