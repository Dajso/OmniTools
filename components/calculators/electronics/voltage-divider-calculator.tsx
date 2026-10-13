'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateVoltageDivider, type VoltageDividerResult } from '@/lib/calculations/electronics/voltage-divider';
import { formatFixed } from '@/lib/utils/formatting';

export function VoltageDividerCalculator() {
  const [inputVoltage, setInputVoltage] = React.useState('12');
  const [r1, setR1] = React.useState('10000');
  const [r2, setR2] = React.useState('10000');
  const [result, setResult] = React.useState<VoltageDividerResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const vin = parseFloat(inputVoltage);
      const r1Val = parseFloat(r1);
      const r2Val = parseFloat(r2);

      if (isNaN(vin) || isNaN(r1Val) || isNaN(r2Val)) {
        setResult(null);
        return;
      }

      const res = calculateVoltageDivider({ inputVoltage: vin, r1: r1Val, r2: r2Val });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Feil i beregningen');
      setResult(null);
    }
  }, [inputVoltage, r1, r2]);

  const reset = () => {
    setInputVoltage('12');
    setR1('10000');
    setR2('10000');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Spenningsdeler"
      description="Regn ut utgangsspenningen til en spenningsdeler med motstander"
      formula="Vut = Vinn × (R2 ÷ (R1 + R2))"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay label="Utgangsspenning" value={result.formattedOutput} copyable />
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Delingsforhold" value={`${formatFixed((result.divisionRatio * 100), 1)}%`} />
            <ResultDisplay label="Strøm" value={`${formatFixed((result.current * 1000), 3)} mA`} />
            <ResultDisplay label="Effekt (R1)" value={`${formatFixed((result.powerR1 * 1000), 3)} mW`} />
            <ResultDisplay label="Effekt (R2)" value={`${formatFixed((result.powerR2 * 1000), 3)} mW`} />
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <NumberInput id="input-voltage" label="Inngangsspenning (V)" value={inputVoltage} onChange={setInputVoltage} min={0} step={0.1} />
        <div className="grid grid-cols-2 gap-4">
          <NumberInput id="r1" label="R1 (Ω)" value={r1} onChange={setR1} min={0} step={100} />
          <NumberInput id="r2" label="R2 (Ω)" value={r2} onChange={setR2} min={0} step={100} />
        </div>

        <div className="bg-muted/50 p-3 rounded-md text-center">
          <pre className="text-xs">
{`Vinn │ [R1] │ ├──── Vut │ [R2] │ GND`}
          </pre>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default VoltageDividerCalculator;
