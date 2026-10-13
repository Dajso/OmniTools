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
      setError(err instanceof Error ? err.message : 'Feil i beregningen');
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

  // Wrapper functions to convert number to string for state
  const handleVoltageChange = (v: number) => setVoltage(v === 0 ? '' : String(v));
  const handleCurrentChange = (v: number) => setCurrent(v === 0 ? '' : String(v));
  const handleResistanceChange = (v: number) => setResistance(v === 0 ? '' : String(v));
  const handlePowerChange = (v: number) => setPower(v === 0 ? '' : String(v));

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Ohms lov"
      description="Regn ut spenning, strøm, motstand og effekt"
      formula="V = I × R, P = V × I"
      formulaExplanation="Fyll inn to verdier for å regne ut de andre"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Spenning (V)"
              value={result.formattedVoltage}
              highlight={result.calculated.includes('voltage')}
              copyable
            />
            <ResultDisplay
              label="Strøm (I)"
              value={result.formattedCurrent}
              highlight={result.calculated.includes('current')}
              copyable
            />
            <ResultDisplay
              label="Motstand (R)"
              value={result.formattedResistance}
              highlight={result.calculated.includes('resistance')}
              copyable
            />
            <ResultDisplay
              label="Effekt (P)"
              value={result.formattedPower}
              highlight={result.calculated.includes('power')}
              copyable
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Uthevede verdier er regnet ut fra det du la inn
          </p>
        </div>
      )}
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Fyll inn to verdier:</p>
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="voltage"
            label="Spenning"
            value={voltage}
            onChange={handleVoltageChange}
            placeholder="Volt (V)"
            min={0}
            step={0.1}
          />
          <NumberInput
            id="current"
            label="Strøm"
            value={current}
            onChange={handleCurrentChange}
            placeholder="Ampere (A)"
            min={0}
            step={0.001}
          />
          <NumberInput
            id="resistance"
            label="Motstand"
            value={resistance}
            onChange={handleResistanceChange}
            placeholder="Ohm (Ω)"
            min={0.001}
            step={1}
          />
          <NumberInput
            id="power"
            label="Effekt"
            value={power}
            onChange={handlePowerChange}
            placeholder="Watt (W)"
            min={0}
            step={0.1}
          />
        </div>

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Formler for Ohms lov</p>
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
