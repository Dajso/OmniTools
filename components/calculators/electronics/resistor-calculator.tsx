'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { SelectInput } from '@/components/ui/select-input';
import { Label } from '@/components/ui/label';
import {
  calculate4BandResistor,
  calculate5BandResistor,
  COLOR_DISPLAY,
  COLOR_VALUES,
  COLOR_MULTIPLIERS,
  COLOR_TOLERANCES,
  type BandColor,
  type ResistorValue,
} from '@/lib/calculations/electronics/resistor-calculator';

const DIGIT_COLORS: { value: BandColor; label: string }[] = [
  { value: 'black', label: 'Black (0)' },
  { value: 'brown', label: 'Brown (1)' },
  { value: 'red', label: 'Red (2)' },
  { value: 'orange', label: 'Orange (3)' },
  { value: 'yellow', label: 'Yellow (4)' },
  { value: 'green', label: 'Green (5)' },
  { value: 'blue', label: 'Blue (6)' },
  { value: 'violet', label: 'Violet (7)' },
  { value: 'gray', label: 'Gray (8)' },
  { value: 'white', label: 'White (9)' },
];

const FIRST_DIGIT_COLORS = DIGIT_COLORS.filter(c => c.value !== 'black');

const MULTIPLIER_COLORS: { value: BandColor; label: string }[] = [
  { value: 'black', label: 'Black (×1)' },
  { value: 'brown', label: 'Brown (×10)' },
  { value: 'red', label: 'Red (×100)' },
  { value: 'orange', label: 'Orange (×1k)' },
  { value: 'yellow', label: 'Yellow (×10k)' },
  { value: 'green', label: 'Green (×100k)' },
  { value: 'blue', label: 'Blue (×1M)' },
  { value: 'violet', label: 'Violet (×10M)' },
  { value: 'gold', label: 'Gold (×0.1)' },
  { value: 'silver', label: 'Silver (×0.01)' },
];

const TOLERANCE_COLORS: { value: BandColor; label: string }[] = [
  { value: 'brown', label: 'Brown (±1%)' },
  { value: 'red', label: 'Red (±2%)' },
  { value: 'green', label: 'Green (±0.5%)' },
  { value: 'blue', label: 'Blue (±0.25%)' },
  { value: 'violet', label: 'Violet (±0.1%)' },
  { value: 'gold', label: 'Gold (±5%)' },
  { value: 'silver', label: 'Silver (±10%)' },
  { value: 'none', label: 'None (±20%)' },
];

function ColorBand({ color, label }: { color: BandColor; label: string }) {
  const display = COLOR_DISPLAY[color];
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-8 h-16 rounded border-2 border-gray-300"
        style={{ 
          backgroundColor: display?.hex || 'transparent',
          border: color === 'none' ? '2px dashed #ccc' : undefined,
        }}
        title={display?.name}
      />
      <span className="text-xs mt-1 text-muted-foreground">{label}</span>
    </div>
  );
}

export function ResistorCalculator() {
  const [bandCount, setBandCount] = React.useState<4 | 5>(4);
  const [band1, setBand1] = React.useState<BandColor>('brown');
  const [band2, setBand2] = React.useState<BandColor>('black');
  const [band3, setBand3] = React.useState<BandColor>('black');
  const [multiplier, setMultiplier] = React.useState<BandColor>('red');
  const [tolerance, setTolerance] = React.useState<BandColor>('gold');
  const [result, setResult] = React.useState<ResistorValue | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      let res: ResistorValue;
      if (bandCount === 4) {
        res = calculate4BandResistor({ band1, band2, multiplier, tolerance });
      } else {
        res = calculate5BandResistor({ band1, band2, band3, multiplier, tolerance });
      }
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [bandCount, band1, band2, band3, multiplier, tolerance]);

  const reset = () => {
    setBandCount(4);
    setBand1('brown');
    setBand2('black');
    setBand3('black');
    setMultiplier('red');
    setTolerance('gold');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Resistor Color Code Calculator"
      description="Calculate resistance from color bands"
      formula={bandCount === 4 ? 'R = (10×D1 + D2) × Multiplier' : 'R = (100×D1 + 10×D2 + D3) × Multiplier'}
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay label="Resistance" value={result.formattedWithTolerance} copyable />
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Min Value" value={`${result.minResistance.toFixed(2)}Ω`} />
            <ResultDisplay label="Max Value" value={`${result.maxResistance.toFixed(2)}Ω`} />
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div className="flex justify-center gap-2 p-4 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
          <ColorBand color={band1} label="1st" />
          <ColorBand color={band2} label="2nd" />
          {bandCount === 5 && <ColorBand color={band3} label="3rd" />}
          <ColorBand color={multiplier} label="Mult" />
          <div className="w-4" />
          <ColorBand color={tolerance} label="Tol" />
        </div>

        <SelectInput
          id="band-count"
          label="Number of Bands"
          value={String(bandCount)}
          onChange={(v) => setBandCount(Number(v) as 4 | 5)}
          options={[
            { value: '4', label: '4-Band Resistor' },
            { value: '5', label: '5-Band Resistor' },
          ]}
        />

        <div className="grid grid-cols-2 gap-4">
          <SelectInput id="band1" label="1st Band" value={band1} onChange={(v) => setBand1(v as BandColor)} options={FIRST_DIGIT_COLORS} />
          <SelectInput id="band2" label="2nd Band" value={band2} onChange={(v) => setBand2(v as BandColor)} options={DIGIT_COLORS} />
        </div>

        {bandCount === 5 && (
          <SelectInput id="band3" label="3rd Band" value={band3} onChange={(v) => setBand3(v as BandColor)} options={DIGIT_COLORS} />
        )}

        <div className="grid grid-cols-2 gap-4">
          <SelectInput id="multiplier" label="Multiplier" value={multiplier} onChange={(v) => setMultiplier(v as BandColor)} options={MULTIPLIER_COLORS} />
          <SelectInput id="tolerance" label="Tolerance" value={tolerance} onChange={(v) => setTolerance(v as BandColor)} options={TOLERANCE_COLORS} />
        </div>
      </div>
    </CalculatorBase>
  );
}

export default ResistorCalculator;
