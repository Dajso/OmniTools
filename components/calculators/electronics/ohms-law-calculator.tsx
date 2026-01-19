'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateOhmsLaw, type OhmsLawResult } from '@/lib/calculations/electronics/ohms-law';

export function OhmsLawCalculator() {
  const [voltage, setVoltage] = React.useState<string>('');
  const [current, setCurrent] = React.useState<string>('');
  const [resistance, setResistance] = React.useState<string>('');
  const [power, setPower] = React.useState<string>('');
  const [result, setResult] = React.useState<OhmsLawResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const input = {
        voltage: voltage ? parseFloat(voltage) : undefined,
        current: current ? parseFloat(current) : undefined,
        resistance: resistance ? parseFloat(resistance) : undefined,
        power: power ? parseFloat(power) : undefined,
      };

      const providedCount = [input.voltage, input.current, input.resistance, input.power]
        .filter(v => v !== undefined && !isNaN(v)).length;

      if (providedCount < 2) {
        setResult(null);
        return;
      }

      const res = calculateOhmsLaw(input);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [voltage, current, resistance, power]);

  const reset = () => {
    setVoltage('');
    setCurrent('');
    setResistance('');
    setPower('');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Ohm's Law Calculator"
      description="Calculate voltage, current, resistance, and power"
      formula="V = I × R, P = V × I"
      formulaExplanation="Enter any two values to calculate the others"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Voltage (V)"
              value={result.formattedVoltage}
              highlight={result.calculated.includes('voltage')}
              copyable
            />
            <ResultDisplay
              label="Current (I)"
              value={result.formattedCurrent}
              highlight={result.calculated.includes('current')}
              copyable
            />
            <ResultDisplay
              label="Resistance (R)"
              value={result.formattedResistance}
              highlight={result.calculated.includes('resistance')}
              copyable
            />
            <ResultDisplay
              label="Power (P)"
              value={result.formattedPower}
              highlight={result.calculated.includes('power')}
              copyable
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Highlighted values were calculated from your inputs
          </p>
        </div>
      )}
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Enter any two values:</p>
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="voltage"
            label="Voltage"
            value={voltage}
            onChange={setVoltage}
            placeholder="Volts (V)"
            min={0}
            step={0.1}
          />
          <NumberInput
            id="current"
            label="Current"
            value={current}
            onChange={setCurrent}
            placeholder="Amperes (A)"
            min={0}
            step={0.001}
          />
          <NumberInput
            id="resistance"
            label="Resistance"
            value={resistance}
            onChange={setResistance}
            placeholder="Ohms (Ω)"
            min={0.001}
            step={1}
          />
          <NumberInput
            id="power"
            label="Power"
            value={power}
            onChange={setPower}
            placeholder="Watts (W)"
            min={0}
            step={0.1}
          />
        </div>

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Ohm's Law Formulas</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div>V = I × R</div>
            <div>I = V / R</div>
            <div>R = V / I</div>
            <div>P = V × I</div>
            <div>P = I² × R</div>
            <div>P = V² / R</div>
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default OhmsLawCalculator;
