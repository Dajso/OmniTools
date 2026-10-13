'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Card } from '@/components/ui/card';
import {
  calculateNDFilterExposure,
  ND_FILTERS,
  LONG_EXPOSURE_SCENARIOS,
  formatShutterSpeed,
  type NDFilterResult,
} from '@/lib/calculations/photo/nd-filter-calculator';
import { formatFixed } from '@/lib/utils/formatting';

const SHUTTER_SPEED_PRESETS = [
  { value: 1/8000, label: '1/8000' },
  { value: 1/4000, label: '1/4000' },
  { value: 1/2000, label: '1/2000' },
  { value: 1/1000, label: '1/1000' },
  { value: 1/500, label: '1/500' },
  { value: 1/250, label: '1/250' },
  { value: 1/125, label: '1/125' },
  { value: 1/60, label: '1/60' },
  { value: 1/30, label: '1/30' },
  { value: 1/15, label: '1/15' },
  { value: 1/8, label: '1/8' },
  { value: 1/4, label: '1/4' },
  { value: 0.5, label: '1/2' },
  { value: 1, label: '1s' },
  { value: 2, label: '2s' },
];

const ND_FILTER_OPTIONS = ND_FILTERS.map(f => ({
  value: f.stops.toString(),
  label: `${f.name} (${f.stops} blendertrinn)`,
}));

export function NDFilterCalculator() {
  const [baseShutterSpeed, setBaseShutterSpeed] = React.useState(1/125);
  const [selectedFilter, setSelectedFilter] = React.useState('10');
  const [result, setResult] = React.useState<NDFilterResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const stops = parseFloat(selectedFilter);
      const ndResult = calculateNDFilterExposure({
        baseShutterSpeed,
        stops,
      });
      setResult(ndResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
      setResult(null);
    }
  }, [baseShutterSpeed, selectedFilter]);

  const reset = () => {
    setBaseShutterSpeed(1/125);
    setSelectedFilter('10');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <CalculatorBase
      title="ND-filter"
      description="Regn ut eksponering når du bruker nøytrale gråfilter (ND)"
      formula="Ny lukkertid = grunn-lukkertid × 2^trinn"
      formulaExplanation="Hvert trinn i ND-filteret dobler eksponeringstiden"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Lukkertid uten filter"
              value={result.baseShutterSpeedFormatted}
            />
            <ResultDisplay
              label="Ny lukkertid"
              value={result.newShutterSpeedFormatted}
              highlight
              copyable
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <ResultDisplay
              label="Blendertrinn"
              value={result.stops.toString()}
            />
            <ResultDisplay
              label="Filterfaktor"
              value={`${result.filterFactor}×`}
            />
            <ResultDisplay
              label="Optisk tetthet"
              value={formatFixed(result.opticalDensity, 1)}
            />
          </div>
          {result.recommendedFilter && (
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm font-medium mb-1">Anbefalt filter</p>
              <p className="text-lg font-bold text-primary">{result.recommendedFilter.name}</p>
              <p className="text-sm text-muted-foreground">
                {result.recommendedFilter.transmissionPercent}% lysgjennomgang
              </p>
            </div>
          )}
          {result.newShutterSpeed >= 30 && (
            <div className="bg-yellow-50 text-yellow-700 p-3 rounded-md text-sm">
              <p className="font-medium">Tips til lang eksponering:</p>
              <ul className="mt-1 space-y-1">
                <li>• Bruk et solid stativ</li>
                <li>• Bruk fjernutløser eller selvutløser</li>
                <li>• Slå på speilutløsning med forsinkelse (speilrefleks)</li>
                <li>• Vurder bulb-modus</li>
              </ul>
            </div>
          )}
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Lukkertid uten filter</label>
          <div className="grid grid-cols-5 gap-2">
            {SHUTTER_SPEED_PRESETS.slice(0, 10).map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setBaseShutterSpeed(preset.value)}
                className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                  Math.abs(baseShutterSpeed - preset.value) < 0.0001
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-muted border-input'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <NumberInput
          id="base-shutter"
          label="Eller skriv inn selv (sekunder)"
          value={baseShutterSpeed}
          onChange={setBaseShutterSpeed}
          min={0.00001}
          max={60}
          step={0.001}
        />

        <SelectInput
          id="nd-filter"
          label="ND-filter"
          value={selectedFilter}
          onChange={setSelectedFilter}
          options={ND_FILTER_OPTIONS}
        />

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Vanlige ND-filtre</p>
          <div className="grid grid-cols-2 gap-2">
            {ND_FILTERS.slice(0, 8).map((filter) => (
              <Card
                key={filter.name}
                className={`p-2 cursor-pointer transition-colors ${
                  selectedFilter === filter.stops.toString()
                    ? 'bg-primary/10 border-primary'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedFilter(filter.stops.toString())}
              >
                <p className="text-sm font-medium">{filter.name}</p>
                <p className="text-xs text-muted-foreground">
                  {filter.stops} blendertrinn • ND {filter.opticalDensity}
                </p>
              </Card>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Situasjoner for lang eksponering</p>
          <div className="space-y-2 text-sm">
            {LONG_EXPOSURE_SCENARIOS.slice(0, 4).map((scenario) => (
              <div key={scenario.name} className="flex justify-between p-2 bg-muted/30 rounded">
                <span>{scenario.name}</span>
                <span className="text-muted-foreground">{scenario.minSeconds}-{scenario.maxSeconds}s</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default NDFilterCalculator;
