'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateCarpet, type CarpetResults } from '@/lib/calculations/home/home-calculations';
import { formatCurrency, formatNumber } from '@/lib/utils/formatting';

const carpetSchema = z.object({
  roomLength: z.number().min(0.5, 'Lengden må være minst 0,5 m').max(100, 'Lengden er for stor'),
  roomWidth: z.number().min(0.5, 'Bredden må være minst 0,5 m').max(100, 'Bredden er for stor'),
  rollWidth: z.number().min(1).max(6),
  pricePerM2: z.number().min(0, 'Prisen kan ikke være negativ').max(100000, 'Prisen er for høy'),
});

type CarpetFormInputs = z.infer<typeof carpetSchema>;

const INITIAL_INPUTS: CarpetFormInputs = { roomLength: 5, roomWidth: 3.5, rollWidth: 4, pricePerM2: 300 };

const ROLL_WIDTHS = [
  { value: '2', label: '2 m' },
  { value: '3', label: '3 m' },
  { value: '4', label: '4 m' },
  { value: '5', label: '5 m' },
];

export function CarpetCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<CarpetFormInputs, CarpetResults>({
      initialInputs: INITIAL_INPUTS,
      schema: carpetSchema,
      calculate: calculateCarpet,
      storageKey: 'carpet-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Teppekalkulator"
      description="Regn ut hvor mange løpemeter teppe eller gulvbelegg du må kjøpe"
      formula="Løpemeter = antall baner × (banelengde + 10 cm)"
      formulaExplanation="Kalkulatoren prøver begge leggeretninger og velger den som gir minst kapp."
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Løpemeter å kjøpe" value={`${formatNumber(results.runningMeters, { maximumFractionDigits: 1 })} m`} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Romareal" value={`${formatNumber(results.roomArea, { maximumFractionDigits: 1 })} m²`} copyable />
            <ResultDisplay label="Areal du betaler for" value={`${formatNumber(results.purchasedArea, { maximumFractionDigits: 1 })} m²`} copyable />
            <ResultDisplay label="Kapp og svinn" value={`${formatNumber(results.wastePercent, { maximumFractionDigits: 1 })} %`} copyable />
            <ResultDisplay label="Anslått pris" value={formatCurrency(results.estimatedCost, { decimals: 0 })} copyable />
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="roomLength" label="Romlengde" value={inputs.roomLength} onChange={(v) => setInput('roomLength', v)} min={0.5} step={0.1} unit="m" error={errors.roomLength} required />
        <NumberInput id="roomWidth" label="Rombredde" value={inputs.roomWidth} onChange={(v) => setInput('roomWidth', v)} min={0.5} step={0.1} unit="m" error={errors.roomWidth} required />
        <SelectInput id="rollWidth" label="Rullbredde" value={String(inputs.rollWidth)} onChange={(v) => setInput('rollWidth', Number(v))} options={ROLL_WIDTHS} error={errors.rollWidth} />
        <NumberInput id="pricePerM2" label="Pris per m²" value={inputs.pricePerM2} onChange={(v) => setInput('pricePerM2', v)} min={0} step={10} unit="kr" error={errors.pricePerM2} />
      </div>
    </CalculatorBase>
  );
}

export default CarpetCalculator;
