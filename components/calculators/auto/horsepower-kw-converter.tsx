'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { hpToKw, kwToHp } from '@/lib/calculations/auto/zero-sixty-estimator';

type PowerUnit = 'hp' | 'kw' | 'ps' | 'bhp';

interface ConversionResult {
  hp: number;
  kw: number;
  ps: number;
  bhp: number;
}

const POWER_UNITS: { value: PowerUnit; label: string }[] = [
  { value: 'hp', label: 'Horsepower (HP)' },
  { value: 'kw', label: 'Kilowatts (kW)' },
  { value: 'ps', label: 'Metric Horsepower (PS)' },
  { value: 'bhp', label: 'Brake Horsepower (BHP)' },
];

// Conversion constants
const HP_TO_KW = 0.7457;
const PS_TO_KW = 0.7355;
const BHP_TO_KW = 0.7457; // BHP is essentially the same as HP

function convertPower(value: number, fromUnit: PowerUnit): ConversionResult {
  let kw: number;
  
  switch (fromUnit) {
    case 'hp':
      kw = value * HP_TO_KW;
      break;
    case 'kw':
      kw = value;
      break;
    case 'ps':
      kw = value * PS_TO_KW;
      break;
    case 'bhp':
      kw = value * BHP_TO_KW;
      break;
    default:
      kw = value * HP_TO_KW;
  }
  
  return {
    hp: kw / HP_TO_KW,
    kw: kw,
    ps: kw / PS_TO_KW,
    bhp: kw / BHP_TO_KW,
  };
}

export function HorsepowerKwConverter() {
  const [value, setValue] = React.useState(300);
  const [fromUnit, setFromUnit] = React.useState<PowerUnit>('hp');
  const [result, setResult] = React.useState<ConversionResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      
      if (value <= 0) {
        setError('Power value must be positive');
        setResult(null);
        return;
      }
      
      const conversion = convertPower(value, fromUnit);
      setResult(conversion);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion error');
      setResult(null);
    }
  }, [value, fromUnit]);

  const reset = () => {
    setValue(300);
    setFromUnit('hp');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Horsepower to kW Converter"
      description="Convert between horsepower, kilowatts, and metric horsepower"
      formula="1 HP = 0.7457 kW | 1 PS = 0.7355 kW"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Horsepower (HP)" 
              value={`${result.hp.toFixed(2)} HP`}
              copyable
            />
            <ResultDisplay 
              label="Kilowatts (kW)" 
              value={`${result.kw.toFixed(2)} kW`}
              copyable
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Metric HP (PS)" 
              value={`${result.ps.toFixed(2)} PS`}
              copyable
            />
            <ResultDisplay 
              label="Brake HP (BHP)" 
              value={`${result.bhp.toFixed(2)} BHP`}
              copyable
            />
          </div>

          <div className="bg-muted/50 p-3 rounded-lg text-sm space-y-2">
            <p className="font-medium">Quick Reference:</p>
            <ul className="text-muted-foreground text-xs space-y-1">
              <li>• HP (Horsepower): Used in USA, UK for engine power</li>
              <li>• kW (Kilowatts): SI unit, used in Europe and for EVs</li>
              <li>• PS (Pferdestärke): Metric HP, used in Germany/Japan</li>
              <li>• BHP (Brake HP): Power measured at the crankshaft</li>
            </ul>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <NumberInput
          id="power-value"
          label="Power Value"
          value={value}
          onChange={setValue}
          min={0}
          step={1}
        />
        
        <SelectInput
          id="from-unit"
          label="Convert From"
          value={fromUnit}
          onChange={(v) => setFromUnit(v as PowerUnit)}
          options={POWER_UNITS}
        />
      </div>
    </CalculatorBase>
  );
}

export default HorsepowerKwConverter;
