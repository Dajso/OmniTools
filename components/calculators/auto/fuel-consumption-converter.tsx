'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import {
  convertFuelEconomy,
  FUEL_ECONOMY_UNITS,
  type FuelEconomyUnit,
  type FuelEconomyConversion,
} from '@/lib/calculations/auto/fuel-consumption-converter';

const UNIT_OPTIONS = FUEL_ECONOMY_UNITS.map(unit => ({
  value: unit.id,
  label: unit.shortName,
}));

export function FuelConsumptionConverter() {
  const [value, setValue] = React.useState(6.5);
  const [fromUnit, setFromUnit] = React.useState<FuelEconomyUnit>('l-100km');
  const [result, setResult] = React.useState<FuelEconomyConversion | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      
      if (value <= 0) {
        setError('Forbruket må være større enn null');
        setResult(null);
        return;
      }
      
      const conversion = convertFuelEconomy(value, fromUnit);
      setResult(conversion);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Omregningsfeil');
      setResult(null);
    }
  }, [value, fromUnit]);

  const reset = () => {
    setValue(6.5);
    setFromUnit('l-100km');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => { calculate(); }, [calculate]);

  const getUnitInfo = (unitId: FuelEconomyUnit) => {
    return FUEL_ECONOMY_UNITS.find(u => u.id === unitId);
  };

  return (
    <CalculatorBase
      title="Omregner for drivstofforbruk"
      description="Regn om mellom liter per 100 km, km per liter og miles per gallon"
      formula="l/100 km = 235,215 ÷ MPG (US)"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="MPG (US)" 
              value={result.formatted['mpg-us']}
              copyable
            />
            <ResultDisplay 
              label="MPG (UK)" 
              value={result.formatted['mpg-uk']}
              copyable
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="l/100 km" 
              value={result.formatted['l-100km']}
              copyable
            />
            <ResultDisplay 
              label="km/l" 
              value={result.formatted['km-l']}
              copyable
            />
          </div>

          <div className="bg-muted/50 p-3 rounded-lg text-sm space-y-2">
            <p className="font-medium">Sammenligning av enhetene:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">Høyere er bedre:</p>
                <ul className="list-disc list-inside">
                  <li>MPG (US/UK)</li>
                  <li>km/l</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground">Lavere er bedre:</p>
                <ul className="list-disc list-inside">
                  <li>l/100 km</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded-lg text-sm">
            <p className="font-medium mb-2">Brukes i:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• <strong>MPG (US)</strong>: USA</li>
              <li>• <strong>MPG (UK)</strong>: Storbritannia</li>
              <li>• <strong>l/100 km</strong>: Europa og Norge</li>
              <li>• <strong>km/l</strong>: Japan og deler av Asia</li>
            </ul>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <NumberInput
          id="fuel-value"
          label="Forbruk"
          value={value}
          onChange={setValue}
          min={0.1}
          step={0.1}
        />
        
        <SelectInput
          id="from-unit"
          label="Regn om fra"
          value={fromUnit}
          onChange={(v) => setFromUnit(v as FuelEconomyUnit)}
          options={UNIT_OPTIONS}
        />
      </div>
    </CalculatorBase>
  );
}

export default FuelConsumptionConverter;
