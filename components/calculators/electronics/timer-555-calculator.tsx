'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateAstable, calculateMonostable, type AstableResult, type MonostableResult } from '@/lib/calculations/electronics/timer-555';

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
      setError(err instanceof Error ? err.message : 'Calculation error');
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
      title="555 Timer Calculator"
      description="Calculate frequency and timing for 555 timer circuits"
      formula={mode === 'astable' ? 'f = 1.44 / ((R1 + 2×R2) × C)' : 't = 1.1 × R × C'}
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={
        astableResult ? (
          <div className="space-y-4">
            <ResultDisplay label="Frequency" value={astableResult.formattedFrequency} copyable />
            <div className="grid grid-cols-2 gap-4">
              <ResultDisplay label="Period" value={astableResult.formattedPeriod} />
              <ResultDisplay label="Duty Cycle" value={`${astableResult.dutyCycle.toFixed(1)}%`} />
              <ResultDisplay label="High Time" value={`${(astableResult.highTime * 1000).toFixed(3)}ms`} />
              <ResultDisplay label="Low Time" value={`${(astableResult.lowTime * 1000).toFixed(3)}ms`} />
            </div>
          </div>
        ) : monostableResult ? (
          <div className="space-y-4">
            <ResultDisplay label="Pulse Duration" value={monostableResult.formattedDuration} copyable />
          </div>
        ) : null
      }
    >
      <div className="space-y-4">
        <SelectInput
          id="mode"
          label="Mode"
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { value: 'astable', label: 'Astable (Oscillator)' },
            { value: 'monostable', label: 'Monostable (One-Shot)' },
          ]}
        />

        <NumberInput id="r1" label={mode === 'astable' ? 'R1 (Ω)' : 'R (Ω)'} value={r1} onChange={setR1} min={1} step={1000} />
        {mode === 'astable' && (
          <NumberInput id="r2" label="R2 (Ω)" value={r2} onChange={setR2} min={1} step={1000} />
        )}
        <NumberInput id="capacitor" label="Capacitor (F)" value={capacitor} onChange={setCapacitor} min={0.000000001} step={0.000001} />

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Common Capacitor Values</p>
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
