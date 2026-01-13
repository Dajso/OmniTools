'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { UnitToggle } from '@/components/ui/unit-toggle';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculateBraSize, type BraSizeResults } from '@/lib/calculations/health/size-converters';

export function BraSizeCalculator() {
  const [band, setBand] = React.useState(34);
  const [bust, setBust] = React.useState(38);
  const [unit, setUnit] = React.useState<'imperial' | 'metric'>('imperial');
  const [results, setResults] = React.useState<BraSizeResults | null>(null);

  const calculate = () => {
    const result = calculateBraSize({ bandMeasurement: band, bustMeasurement: bust, unit });
    setResults(result);
  };

  React.useEffect(() => { calculate(); }, [band, bust, unit]);

  const handleUnitChange = (newUnit: 'imperial' | 'metric') => {
    const factor = newUnit === 'metric' ? 2.54 : 1 / 2.54;
    setBand(Math.round(band * factor));
    setBust(Math.round(bust * factor));
    setUnit(newUnit);
  };

  return (
    <CalculatorBase
      title="Bra Size Calculator"
      description="Find your bra size based on band and bust measurements"
      onCalculate={calculate}
      onReset={() => { setBand(34); setBust(38); }}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Your Size (US/UK)" value={results.us} highlight copyable />
          <div className="grid grid-cols-3 gap-4">
            <ResultDisplay label="US Size" value={results.us} />
            <ResultDisplay label="UK Size" value={results.uk} />
            <ResultDisplay label="EU Size" value={results.eu} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Band Size" value={results.bandSize} />
            <ResultDisplay label="Cup Size" value={results.cupSize} />
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">How to Measure</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Band: Measure around your ribcage, just under your bust</li>
              <li>• Bust: Measure around the fullest part of your bust</li>
              <li>• Keep the tape level and snug but not tight</li>
            </ul>
          </div>
        </div>
      )}
    >
      <div className="flex justify-end mb-2">
        <UnitToggle value={unit} onChange={handleUnitChange} labels={{ imperial: 'inches', metric: 'cm' }} />
      </div>
      <NumberInput id="band" label="Band Measurement (under bust)" value={band} onChange={setBand} min={20} max={60} unit={unit === 'imperial' ? 'in' : 'cm'} required />
      <NumberInput id="bust" label="Bust Measurement (fullest point)" value={bust} onChange={setBust} min={25} max={70} unit={unit === 'imperial' ? 'in' : 'cm'} required />
    </CalculatorBase>
  );
}

export default BraSizeCalculator;
