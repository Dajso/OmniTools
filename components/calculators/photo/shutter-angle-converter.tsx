'use client';

import * as React from 'react';
import { formatFixed, formatNumber } from '@/lib/utils/formatting';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Card } from '@/components/ui/card';
import {
  shutterAngleToSpeed,
  shutterSpeedToAngle,
  COMMON_SHUTTER_ANGLES,
  CINEMA_FRAME_RATES,
  CINEMA_PRESETS,
  generateShutterTable,
  type ShutterConversionResult,
} from '@/lib/calculations/photo/shutter-angle-converter';

const FRAME_RATE_OPTIONS = CINEMA_FRAME_RATES.map(fr => ({
  value: fr.fps.toString(),
  label: `${formatNumber(fr.fps, { maximumFractionDigits: 3 })} b/s – ${fr.description}`,
}));

export function ShutterAngleConverter() {
  const [mode, setMode] = React.useState<'angleToSpeed' | 'speedToAngle'>('angleToSpeed');
  const [shutterAngle, setShutterAngle] = React.useState(180);
  const [shutterSpeed, setShutterSpeed] = React.useState(1 / 48);
  const [frameRate, setFrameRate] = React.useState(24);
  const [result, setResult] = React.useState<ShutterConversionResult | null>(null);
  const [shutterTable, setShutterTable] = React.useState<ReturnType<typeof generateShutterTable>>([]);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);

      let conversionResult: ShutterConversionResult;

      if (mode === 'angleToSpeed') {
        conversionResult = shutterAngleToSpeed({ shutterAngle, frameRate });
      } else {
        conversionResult = shutterSpeedToAngle({ shutterSpeed, frameRate });
      }

      setResult(conversionResult);
      setShutterTable(generateShutterTable(frameRate));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
      setResult(null);
    }
  }, [mode, shutterAngle, shutterSpeed, frameRate]);

  const reset = () => {
    setMode('angleToSpeed');
    setShutterAngle(180);
    setShutterSpeed(1 / 48);
    setFrameRate(24);
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const applyPreset = (preset: typeof CINEMA_PRESETS[0]) => {
    setMode('angleToSpeed');
    setShutterAngle(preset.shutterAngle);
  };

  return (
    <CalculatorBase
      title="Lukkervinkel"
      description="Regn om mellom lukkervinkel (film) og lukkertid (foto)"
      formula="Lukkertid = (vinkel ÷ 360) × (1 ÷ bildefrekvens)"
      formulaExplanation="Lukkervinkel brukes i film for å beskrive eksponeringstiden i forhold til bildefrekvensen"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Lukkervinkel"
              value={`${result.shutterAngle}°`}
              highlight={mode === 'speedToAngle'}
              copyable
            />
            <ResultDisplay
              label="Lukkertid"
              value={result.shutterSpeedFormatted}
              highlight={mode === 'angleToSpeed'}
              copyable
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Bildefrekvens"
              value={`${formatNumber(result.frameRate, { maximumFractionDigits: 3 })} b/s`}
            />
            <ResultDisplay
              label="Eksponering %"
              value={`${result.exposurePercent}%`}
            />
          </div>
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium mb-1">Bevegelsesuskarphet</p>
            <p className="text-sm text-muted-foreground">{result.motionBlurDescription}</p>
          </div>

          {/* Shutter Table for Current Frame Rate */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Lukkertabell ved {frameRate} b/s</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {shutterTable.slice(0, 6).map((row) => (
                <div
                  key={row.angle}
                  className={`flex justify-between p-2 rounded ${Math.abs(row.angle - result.shutterAngle) < 1
                      ? 'bg-primary/10 border border-primary'
                      : 'bg-muted/30'
                    }`}
                >
                  <span>{row.angle}°</span>
                  <span className="font-mono">{row.speedFormatted}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('angleToSpeed')}
            className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${mode === 'angleToSpeed'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background hover:bg-muted border-input'
              }`}
          >
            Vinkel → tid
          </button>
          <button
            type="button"
            onClick={() => setMode('speedToAngle')}
            className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${mode === 'speedToAngle'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background hover:bg-muted border-input'
              }`}
          >
            Tid → vinkel
          </button>
        </div>

        {mode === 'angleToSpeed' ? (
          <>
            <NumberInput
              id="shutter-angle"
              label="Lukkervinkel (grader)"
              value={shutterAngle}
              onChange={setShutterAngle}
              min={1}
              max={360}
              step={0.1}
            />
            <div className="flex gap-2 flex-wrap">
              {[180, 172.8, 144, 90, 45].map(angle => (
                <button
                  key={angle}
                  type="button"
                  onClick={() => setShutterAngle(angle)}
                  className={`px-3 py-1 text-xs rounded-md border transition-colors ${shutterAngle === angle
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background hover:bg-muted border-input'
                    }`}
                >
                  {angle}°
                </button>
              ))}
            </div>
          </>
        ) : (
          <NumberInput
            id="shutter-speed"
            label="Lukkertid (sekunder)"
            value={shutterSpeed}
            onChange={setShutterSpeed}
            min={0.00001}
            max={1}
            step={0.0001}
          />
        )}

        <SelectInput
          id="frame-rate"
          label="Bildefrekvens"
          value={frameRate.toString()}
          onChange={(v) => setFrameRate(parseFloat(v))}
          options={FRAME_RATE_OPTIONS}
        />

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Filmlook</p>
          <div className="space-y-2">
            {CINEMA_PRESETS.slice(0, 4).map((preset) => (
              <Card
                key={preset.name}
                className={`p-2 cursor-pointer transition-colors ${shutterAngle === preset.shutterAngle && mode === 'angleToSpeed'
                    ? 'bg-primary/10 border-primary'
                    : 'hover:bg-muted/50'
                  }`}
                onClick={() => applyPreset(preset)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{preset.name}</p>
                    <p className="text-xs text-muted-foreground">{preset.description}</p>
                  </div>
                  <span className="text-sm font-mono">{preset.shutterAngle}°</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 text-sm text-muted-foreground">
          <p className="font-medium mb-2">180°-regelen:</p>
          <p>For naturlig bevegelsesuskarphet setter du lukkervinkelen til 180° (lukkertid = 1/(2 × bilder per sekund)). Ved 24 b/s blir det 1/48 sekund.</p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default ShutterAngleConverter;
