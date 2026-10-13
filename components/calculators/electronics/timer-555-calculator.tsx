'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateAstable, calculateMonostable, type AstableResult, type MonostableResult } from '@/lib/calculations/electronics/timer-555';
import { formatFixed } from '@/lib/utils/formatting';

type Mode = 'astable' | 'monostable';

export function Timer555Calculator() {
  const [mode, setMode] = React.useState<Mode>('astable');
  const [r1, setR1] = React.useState('10000');
  const [r2, setR2] = React.useState('10000');
  const [capacitor, setCapacitor] = React.useState('0.000001');
  const [astableResult, setAstableResult] = React.useState<AstableResult | null>(null);
  const [monostableResult, setMonostableResult] = React.useState<MonostableResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const r1Val = parseFloat(r1);
      const r2Val = parseFloat(r2);
      const capVal = parseFloat(capacitor);

      if (isNaN(r1Val) || isNaN(capVal) || (mode === 'astable' && isNaN(r2Val))) {
        setAstableResult(null);
        setMonostableResult(null);
        return;
      }

      if (mode === 'astable') {
        const res = calculateAstable({ r1: r1Val, r2: r2Val, capacitor: capVal });
        setAstableResult(res);
        setMonostableResult(null);
      } else {
        const res = calculateMonostable({ resistance: r1Val, capacitor: capVal });
        setMonostableResult(res);
        setAstableResult(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Feil i beregningen');
      setAstableResult(null);
      setMonostableResult(null);
    }
  }, [mode, r1, r2, capacitor]);

  const reset = () => {
    setMode('astable');
    setR1('10000');
    setR2('10000');
    setCapacitor('0.000001');
    setAstableResult(null);
    setMonostableResult(null);
    setError(undefined);
  };

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="555-timer"
      description="Regn ut frekvens og tider for 555-timer-kretser"
      formula={mode === 'astable' ? 'f = 1.44 / ((R1 + 2×R2) × C)' : 't = 1.1 × R × C'}
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={
        astableResult ? (
          <div className="space-y-4">
            <ResultDisplay label="Frekvens" value={astableResult.formattedFrequency} copyable />
            <div className="grid grid-cols-2 gap-4">
              <ResultDisplay label="Periode" value={astableResult.formattedPeriod} />
              <ResultDisplay label="Driftsandel" value={`${formatFixed(astableResult.dutyCycle, 1)}%`} />
              <ResultDisplay label="Tid høy" value={`${formatFixed((astableResult.highTime * 1000), 3)}ms`} />
              <ResultDisplay label="Tid lav" value={`${formatFixed((astableResult.lowTime * 1000), 3)}ms`} />
            </div>
          </div>
        ) : monostableResult ? (
          <div className="space-y-4">
            <ResultDisplay label="Pulslengde" value={monostableResult.formattedDuration} copyable />
          </div>
        ) : null
      }
    >
      <div className="space-y-4">
        <SelectInput
          id="mode"
          label="Modus"
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { value: 'astable', label: 'Astabil (oscillator)' },
            { value: 'monostable', label: 'Monostabil (enkeltpuls)' },
          ]}
        />

        <NumberInput id="r1" label={mode === 'astable' ? 'R1 (Ω)' : 'R (Ω)'} value={r1} onChange={setR1} min={1} step={1000} />
        {mode === 'astable' && (
          <NumberInput id="r2" label="R2 (Ω)" value={r2} onChange={setR2} min={1} step={1000} />
        )}
        <NumberInput id="capacitor" label="Kondensator (F)" value={capacitor} onChange={setCapacitor} min={0.000000001} step={0.000001} />

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Vanlige kondensatorverdier</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button type="button" onClick={() => setCapacitor('0.0000001')} className="p-1 hover:bg-muted rounded">100nF</button>
            <button type="button" onClick={() => setCapacitor('0.000001')} className="p-1 hover:bg-muted rounded">1µF</button>
            <button type="button" onClick={() => setCapacitor('0.00001')} className="p-1 hover:bg-muted rounded">10µF</button>
            <button type="button" onClick={() => setCapacitor('0.0001')} className="p-1 hover:bg-muted rounded">100µF</button>
            <button type="button" onClick={() => setCapacitor('0.00000001')} className="p-1 hover:bg-muted rounded">10nF</button>
            <button type="button" onClick={() => setCapacitor('0.000000001')} className="p-1 hover:bg-muted rounded">1nF</button>
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default Timer555Calculator;
