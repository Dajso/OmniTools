'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateMulch, type MulchResults } from '@/lib/calculations/home/home-calculations';
import { formatNumber } from '@/lib/utils/formatting';

const mulchSchema = z.object({
  length: z.number().min(0.1, 'Lengden må være over 0').max(1000, 'Lengden er for stor'),
  width: z.number().min(0.1, 'Bredden må være over 0').max(1000, 'Bredden er for stor'),
  depthCm: z.number().min(0.5, 'Tykkelsen må være minst 0,5 cm').max(50, 'Tykkelsen er for stor'),
});

type MulchFormInputs = z.infer<typeof mulchSchema>;

const INITIAL_INPUTS: MulchFormInputs = { length: 5, width: 3, depthCm: 7 };

export function MulchCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<MulchFormInputs, MulchResults>({
      initialInputs: INITIAL_INPUTS,
      schema: mulchSchema,
      calculate: calculateMulch,
      storageKey: 'mulch-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Barkflis- og jordkalkulator"
      description="Regn ut hvor mye barkflis, jord eller kompost du trenger til bedet"
      formula="Volum = lengde × bredde × (tykkelse ÷ 100)"
      formulaExplanation="Tykkelsen oppgis i cm. 1 m³ tilsvarer 1 000 liter."
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Liter å kjøpe" value={`${formatNumber(results.liters)} liter`} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Areal" value={`${formatNumber(results.area, { maximumFractionDigits: 1 })} m²`} copyable />
            <ResultDisplay label="Volum" value={`${formatNumber(results.volumeM3, { maximumFractionDigits: 2 })} m³`} copyable />
            <ResultDisplay label="Sekker à 50 liter" value={results.bags50l.toString()} copyable />
            <ResultDisplay label="Sekker à 80 liter" value={results.bags80l.toString()} copyable />
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-3 gap-4">
        <NumberInput id="length" label="Lengde" value={inputs.length} onChange={(v) => setInput('length', v)} min={0.1} step={0.5} unit="m" error={errors.length} required />
        <NumberInput id="width" label="Bredde" value={inputs.width} onChange={(v) => setInput('width', v)} min={0.1} step={0.5} unit="m" error={errors.width} required />
        <NumberInput id="depthCm" label="Tykkelse" value={inputs.depthCm} onChange={(v) => setInput('depthCm', v)} min={0.5} max={50} step={0.5} unit="cm" error={errors.depthCm} required />
      </div>
      <p className="text-xs text-muted-foreground">
        Barkflis legges vanligvis 5–8 cm tykt for å hindre ugress. Til nye bed og plen trengs gjerne 10–20 cm jord.
      </p>
    </CalculatorBase>
  );
}

export default MulchCalculator;
