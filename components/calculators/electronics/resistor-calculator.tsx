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
import { formatFixed } from '@/lib/utils/formatting';

const DIGIT_COLORS: { value: BandColor; label: string }[] = [
  { value: 'black', label: 'Svart (0)' },
  { value: 'brown', label: 'Brun (1)' },
  { value: 'red', label: 'Rød (2)' },
  { value: 'orange', label: 'Oransje (3)' },
  { value: 'yellow', label: 'Gul (4)' },
  { value: 'green', label: 'Grønn (5)' },
  { value: 'blue', label: 'Blå (6)' },
  { value: 'violet', label: 'Fiolett (7)' },
  { value: 'gray', label: 'Grå (8)' },
  { value: 'white', label: 'Hvit (9)' },
];

const FIRST_DIGIT_COLORS = DIGIT_COLORS.filter(c => c.value !== 'black');

const MULTIPLIER_COLORS: { value: BandColor; label: string }[] = [
  { value: 'black', label: 'Svart (×1)' },
  { value: 'brown', label: 'Brun (×10)' },
  { value: 'red', label: 'Rød (×100)' },
  { value: 'orange', label: 'Oransje (×1k)' },
  { value: 'yellow', label: 'Gul (×10k)' },
  { value: 'green', label: 'Grønn (×100k)' },
  { value: 'blue', label: 'Blå (×1M)' },
  { value: 'violet', label: 'Fiolett (×10M)' },
  { value: 'gold', label: 'Gull (×0,1)' },
  { value: 'silver', label: 'Sølv (×0,01)' },
];

const TOLERANCE_COLORS: { value: BandColor; label: string }[] = [
  { value: 'brown', label: 'Brun (±1 %)' },
  { value: 'red', label: 'Rød (±2 %)' },
  { value: 'green', label: 'Grønn (±0,5 %)' },
  { value: 'blue', label: 'Blå (±0,25 %)' },
  { value: 'violet', label: 'Fiolett (±0,1 %)' },
  { value: 'gold', label: 'Gull (±5 %)' },
  { value: 'silver', label: 'Sølv (±10 %)' },
  { value: 'none', label: 'Ingen (±20 %)' },
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
      setError(err instanceof Error ? err.message : 'Feil i beregningen');
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
      title="Motstand: fargekode"
      description="Regn ut motstanden ut fra fargebåndene"
      formula={bandCount === 4 ? 'R = (10×S1 + S2) × multiplikator' : 'R = (100×S1 + 10×S2 + S3) × multiplikator'}
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay label="Motstand" value={result.formattedWithTolerance} copyable />
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Minsteverdi" value={`${formatFixed(result.minResistance, 2)}Ω`} />
            <ResultDisplay label="Størsteverdi" value={`${formatFixed(result.maxResistance, 2)}Ω`} />
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div className="flex justify-center gap-2 p-4 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
          <ColorBand color={band1} label="1." />
          <ColorBand color={band2} label="2." />
          {bandCount === 5 && <ColorBand color={band3} label="3." />}
          <ColorBand color={multiplier} label="Mult." />
          <div className="w-4" />
          <ColorBand color={tolerance} label="Tol." />
        </div>

        <SelectInput
          id="band-count"
          label="Antall bånd"
          value={String(bandCount)}
          onChange={(v) => setBandCount(Number(v) as 4 | 5)}
          options={[
            { value: '4', label: 'Motstand med 4 bånd' },
            { value: '5', label: 'Motstand med 5 bånd' },
          ]}
        />

        <div className="grid grid-cols-2 gap-4">
          <SelectInput id="band1" label="1. bånd" value={band1} onChange={(v) => setBand1(v as BandColor)} options={FIRST_DIGIT_COLORS} />
          <SelectInput id="band2" label="2. bånd" value={band2} onChange={(v) => setBand2(v as BandColor)} options={DIGIT_COLORS} />
        </div>

        {bandCount === 5 && (
          <SelectInput id="band3" label="3. bånd" value={band3} onChange={(v) => setBand3(v as BandColor)} options={DIGIT_COLORS} />
        )}

        <div className="grid grid-cols-2 gap-4">
          <SelectInput id="multiplier" label="Multiplikator" value={multiplier} onChange={(v) => setMultiplier(v as BandColor)} options={MULTIPLIER_COLORS} />
          <SelectInput id="tolerance" label="Toleranse" value={tolerance} onChange={(v) => setTolerance(v as BandColor)} options={TOLERANCE_COLORS} />
        </div>
      </div>
    </CalculatorBase>
  );
}

export default ResistorCalculator;
