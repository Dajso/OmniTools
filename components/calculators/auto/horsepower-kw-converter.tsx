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
  { value: 'kw', label: 'Kilowatt (kW)' },
  { value: 'ps', label: 'Metriske hestekrefter (hk / PS)' },
  { value: 'hp', label: 'Imperiale hestekrefter (HP)' },
  { value: 'bhp', label: 'Brake horsepower (BHP)' },
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
  const [value, setValue] = React.useState(110);
  const [fromUnit, setFromUnit] = React.useState<PowerUnit>('kw');
  const [result, setResult] = React.useState<ConversionResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      
      if (value <= 0) {
        setError('Effekten må være større enn null');
        setResult(null);
        return;
      }
      
      const conversion = convertPower(value, fromUnit);
      setResult(conversion);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Omregningsfeil');
      setResult(null);
    }
  }, [value, fromUnit]);

  const reset = () => {
    setValue(110);
    setFromUnit('kw');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Hestekrefter til kW"
      description="Regn om mellom kilowatt, metriske hestekrefter og imperiale hestekrefter"
      formula="1 hk (PS) = 0,7355 kW | 1 HP = 0,7457 kW"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Hestekrefter (hk, imperial)" 
              value={`${result.hp.toFixed(1).replace('.', ',')} HP`}
              copyable
            />
            <ResultDisplay 
              label="Kilowatt (kW)" 
              value={`${result.kw.toFixed(1).replace('.', ',')} kW`}
              copyable
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Metriske hk (PS)" 
              value={`${result.ps.toFixed(1).replace('.', ',')} PS`}
              copyable
            />
            <ResultDisplay 
              label="Brake HP (BHP)" 
              value={`${result.bhp.toFixed(1).replace('.', ',')} BHP`}
              copyable
            />
          </div>

          <div className="bg-muted/50 p-3 rounded-lg text-sm space-y-2">
            <p className="font-medium">Kort oppsummert:</p>
            <ul className="text-muted-foreground text-xs space-y-1">
              <li>• HP: imperial hestekraft, brukes i USA og Storbritannia</li>
              <li>• kW: SI-enheten, oppgis i vognkortet i Norge og for elbiler</li>
              <li>• PS / hk: metrisk hestekraft, vanlig i Europa</li>
              <li>• BHP: effekt målt ved veivakselen</li>
            </ul>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <NumberInput
          id="power-value"
          label="Effekt"
          value={value}
          onChange={setValue}
          min={0}
          step={1}
        />
        
        <SelectInput
          id="from-unit"
          label="Regn om fra"
          value={fromUnit}
          onChange={(v) => setFromUnit(v as PowerUnit)}
          options={POWER_UNITS}
        />
      </div>
    </CalculatorBase>
  );
}

export default HorsepowerKwConverter;
