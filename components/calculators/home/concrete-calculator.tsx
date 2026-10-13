'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { calculateConcrete, type ConcreteResults } from '@/lib/calculations/home/home-calculations';
import { formatNumber } from '@/lib/utils/formatting';

const concreteSchema = z.object({
  length: z.number().min(0.1, 'Lengden må være over 0').max(1000, 'Lengden er for stor'),
  width: z.number().min(0.1, 'Bredden må være over 0').max(1000, 'Bredden er for stor'),
  thicknessCm: z.number().min(1, 'Tykkelsen må være minst 1 cm').max(200, 'Tykkelsen er for stor'),
  wastePercent: z.number().min(0, 'Kan ikke være negativt').max(50, 'Svinnet er for høyt'),
});

type ConcreteFormInputs = z.infer<typeof concreteSchema>;

const INITIAL_INPUTS: ConcreteFormInputs = { length: 4, width: 3, thicknessCm: 10, wastePercent: 10 };

export function ConcreteCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<ConcreteFormInputs, ConcreteResults>({
      initialInputs: INITIAL_INPUTS,
      schema: concreteSchema,
      calculate: calculateConcrete,
      storageKey: 'concrete-calculator-no',
    });

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Betongkalkulator"
      description="Regn ut hvor mye betong du trenger til plate, fundament eller gulv"
      formula="Volum = lengde × bredde × tykkelse"
      formulaExplanation="Tykkelsen oppgis i cm og gjøres om til meter. Ferdig herdet betong veier ca. 2 300 kg per m³."
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay label="Betong å bestille (med svinn)" value={`${formatNumber(results.volumeWithWaste, { maximumFractionDigits: 2 })} m³`} highlight copyable />
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Areal" value={`${formatNumber(results.area, { maximumFractionDigits: 1 })} m²`} copyable />
            <ResultDisplay label="Volum uten svinn" value={`${formatNumber(results.volume, { maximumFractionDigits: 2 })} m³`} copyable />
            <ResultDisplay label="Vekt" value={`${formatNumber(results.weightKg)} kg`} copyable />
            <ResultDisplay label="Sekker à 25 kg (ferdigblandet)" value={formatNumber(results.bags25kg)} copyable />
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="length" label="Lengde" value={inputs.length} onChange={(v) => setInput('length', v)} min={0.1} step={0.1} unit="m" error={errors.length} required />
        <NumberInput id="width" label="Bredde" value={inputs.width} onChange={(v) => setInput('width', v)} min={0.1} step={0.1} unit="m" error={errors.width} required />
        <NumberInput id="thicknessCm" label="Tykkelse" value={inputs.thicknessCm} onChange={(v) => setInput('thicknessCm', v)} min={1} step={1} unit="cm" error={errors.thicknessCm} required />
        <NumberInput id="wastePercent" label="Tillegg for svinn" value={inputs.wastePercent} onChange={(v) => setInput('wastePercent', v)} min={0} max={50} step={1} unit="%" error={errors.wastePercent} />
      </div>
      <p className="text-xs text-muted-foreground">
        Bestill gjerne litt for mye. Det er dyrere å få levert en ekstra last enn å ha noen sekker til overs. Ferdigbetong leveres i hele eller halve kubikkmeter.
      </p>
    </CalculatorBase>
  );
}

export default ConcreteCalculator;
