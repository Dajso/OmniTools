'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Card } from '@/components/ui/card';
import {
  calculateEDPI,
  compareEDPI,
  getProPlayerEDPIExamples,
  sensitivityForTargetEDPI,
  type EDPIResult,
} from '@/lib/calculations/gaming/edpi-calculator';
import { formatFixed } from '@/lib/utils/formatting';

const DPI_PRESETS = [400, 800, 1600, 3200];

export function EDPICalculator() {
  const [dpi, setDpi] = React.useState(800);
  const [sensitivity, setSensitivity] = React.useState(1);
  const [targetEDPI, setTargetEDPI] = React.useState<number | null>(null);
  const [result, setResult] = React.useState<EDPIResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const proExamples = React.useMemo(() => getProPlayerEDPIExamples(), []);

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      if (dpi <= 0) {
        setError('DPI must be positive');
        setResult(null);
        return;
      }
      if (sensitivity < 0) {
        setError('Sensitivity cannot be negative');
        setResult(null);
        return;
      }

      const edpiResult = calculateEDPI({ dpi, sensitivity });
      setResult(edpiResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [dpi, sensitivity]);

  const reset = () => {
    setDpi(800);
    setSensitivity(1);
    setTargetEDPI(null);
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'very-low': return 'text-blue-600';
      case 'low': return 'text-cyan-600';
      case 'medium': return 'text-green-600';
      case 'high': return 'text-orange-600';
      case 'very-high': return 'text-red-600';
      default: return '';
    }
  };

  const targetSensitivity = targetEDPI && dpi > 0
    ? sensitivityForTargetEDPI(targetEDPI, dpi)
    : null;

  return (
    <CalculatorBase
      title="eDPI Calculator"
      description="Calculate your effective DPI (eDPI) and compare with pro player settings"
      formula="eDPI = DPI × In-game Sensitivity"
      formulaExplanation="eDPI standardizes sensitivity comparison across different DPI settings"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay
            label="Your eDPI"
            value={formatFixed(result.edpi, 0)}
            highlight
            copyable
          />
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="DPI"
              value={result.dpi.toString()}
            />
            <ResultDisplay
              label="Sensitivity"
              value={result.sensitivity.toString()}
            />
          </div>
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium mb-1">
              Classification:{' '}
              <span className={getClassificationColor(result.classification)}>
                {result.classification.replace('-', ' ').toUpperCase()}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">{result.recommendation}</p>
          </div>

          {targetEDPI && targetSensitivity !== null && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-2">Target eDPI Conversion</p>
              <ResultDisplay
                label={`Sensitivity for ${targetEDPI} eDPI at ${dpi} DPI`}
                value={formatFixed(targetSensitivity, 4)}
                copyable
              />
            </div>
          )}
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <NumberInput
            id="dpi"
            label="Mouse DPI"
            value={dpi}
            onChange={setDpi}
            min={100}
            max={32000}
            step={100}
          />
          <div className="flex gap-2 mt-2">
            {DPI_PRESETS.map(preset => (
              <button
                key={preset}
                type="button"
                onClick={() => setDpi(preset)}
                className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                  dpi === preset
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-muted border-input'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <NumberInput
          id="sensitivity"
          label="In-game Sensitivity"
          value={sensitivity}
          onChange={setSensitivity}
          min={0}
          max={100}
          step={0.01}
        />

        <div className="border-t pt-4">
          <NumberInput
            id="target-edpi"
            label="Target eDPI (optional)"
            value={targetEDPI || 0}
            onChange={(v) => setTargetEDPI(v || null)}
            min={0}
            max={100000}
            step={10}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter a target eDPI to calculate the required sensitivity
          </p>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Pro Player Reference</p>
          <div className="space-y-2">
            {proExamples.map((pro) => (
              <Card
                key={pro.player}
                className="p-2 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => {
                  setDpi(pro.dpi);
                  setSensitivity(pro.sensitivity);
                }}
              >
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium">{pro.player}</span>
                    <span className="text-muted-foreground ml-2">({pro.game})</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono">{pro.edpi} eDPI</span>
                    <span className="text-muted-foreground ml-2 text-xs">
                      {pro.dpi} DPI × {pro.sensitivity}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Click on a pro player to use their settings
          </p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default EDPICalculator;
