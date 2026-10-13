'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateLumber, type LumberResults } from '@/lib/calculations/home/home-calculations';
import { formatCurrency, formatNumber } from '@/lib/utils/formatting';

const lumberSchema = z.object({
  thicknessMm: z.number().min(5, 'Tykkelsen er for liten').max(500, 'Tykkelsen er for stor'),
  widthMm: z.number().min(10, 'Bredden er for liten').max(1000, 'Bredden er for stor'),
  length: z.number().min(0.3, 'Lengden er for liten').max(15, 'Lengden er for stor'),
  quantity: z.number().min(1, 'Minst ett stykk').max(10000, 'For mange stykker'),
  pricePerMeter: z.number().min(0, 'Prisen kan ikke være negativ').max(10000, 'Prisen er for høy'),
});

type LumberFormInputs = z.infer<typeof lumberSchema>;

const INITIAL_INPUTS: LumberFormInputs = { thicknessMm: 48, widthMm: 148, length: 4.8, quantity: 10, pricePerMeter: 35 };

const DIMENSIONS = [
  { label: '36×36', t: 36, w: 36 },
  { label: '48×98', t: 48, w: 98 },
  { label: '48×148', t: 48, w: 148 },
  { label: '48×198', t: 48, w: 198 },
  { label: '23×98', t: 23, w: 98 },
  { label: '23×148', t: 23, w: 148 },
];

export function LumberCalculator() {
  const { inputs, setInput, setInputs, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<LumberFormInputs, LumberResults>({
      initialInputs: INITIAL_INPUTS,
      schema: lumberSchema,
      calculate: calculateLumber,
      storageKey: 'lumber-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Trelastkalkulator"
      description="Regn ut løpemeter, volum og pris for trelast"
      formula="Løpemeter = lengde × antall, volum = tykkelse × bredde × lengde × antall"
      formulaExplanation="Dimensjonene oppgis i millimeter, og prisen per løpemeter."
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Totalt løpemeter" value={`${formatNumber(results.totalMeters, { maximumFractionDigits: 1 })} m`} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Volum totalt" value={`${formatNumber(results.volumeM3, { maximumFractionDigits: 3 })} m³`} copyable />
            <ResultDisplay label="Volum per stykk" value={`${formatNumber(results.volumePerPieceM3, { maximumFractionDigits: 4 })} m³`} copyable />
            <ResultDisplay label="Total pris" value={formatCurrency(results.totalCost, { decimals: 0 })} copyable />
          </div>
        </div>
      )}
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="Vanlige dimensjoner">
        {DIMENSIONS.map((d) => (
          <button key={d.label} type="button" onClick={() => setInputs({ thicknessMm: d.t, widthMm: d.w })}
            className={`px-3 py-1 text-sm rounded-md border transition-colors ${inputs.thicknessMm === d.t && inputs.widthMm === d.w ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
            {d.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="thicknessMm" label="Tykkelse" value={inputs.thicknessMm} onChange={(v) => setInput('thicknessMm', v)} min={5} step={1} unit="mm" error={errors.thicknessMm} required />
        <NumberInput id="widthMm" label="Bredde" value={inputs.widthMm} onChange={(v) => setInput('widthMm', v)} min={10} step={1} unit="mm" error={errors.widthMm} required />
        <NumberInput id="length" label="Lengde per stykk" value={inputs.length} onChange={(v) => setInput('length', v)} min={0.3} step={0.3} unit="m" error={errors.length} required />
        <NumberInput id="quantity" label="Antall" value={inputs.quantity} onChange={(v) => setInput('quantity', v)} min={1} step={1} error={errors.quantity} required />
        <NumberInput id="pricePerMeter" label="Pris per løpemeter" value={inputs.pricePerMeter} onChange={(v) => setInput('pricePerMeter', v)} min={0} step={1} unit="kr" error={errors.pricePerMeter} />
      </div>
      <p className="text-xs text-muted-foreground">
        Høvlet trelast har mindre mål enn nominelt, for eksempel 48×98 mm for «2×4». Prisene varierer mye mellom byggevarehandlere.
      </p>
    </CalculatorBase>
  );
}

export default LumberCalculator;
