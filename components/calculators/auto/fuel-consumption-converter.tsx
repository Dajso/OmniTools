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
  const [value, setValue] = React.useState(30);
  const [fromUnit, setFromUnit] = React.useState<FuelEconomyUnit>('mpg-us');
  const [result, setResult] = React.useState<FuelEconomyConversion | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      
      if (value <= 0) {
        setError('Fuel economy value must be positive');
        setResult(null);
        return;
      }
      
      const conversion = convertFuelEconomy(value, fromUnit);
      setResult(conversion);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion error');
      setResult(null);
    }
  }, [value, fromUnit]);

  const reset = () => {
    setValue(30);
    setFromUnit('mpg-us');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => { calculate(); }, [calculate]);

  const getUnitInfo = (unitId: FuelEconomyUnit) => {
    return FUEL_ECONOMY_UNITS.find(u => u.id === unitId);
  };

  return (
    <CalculatorBase
      title="Fuel Consumption Converter"
      description="Convert between MPG, L/100km, and km/L fuel economy units"
      formula="L/100km = 235.215 / MPG (US)"
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
              label="L/100km" 
              value={result.formatted['l-100km']}
              copyable
            />
            <ResultDisplay 
              label="km/L" 
              value={result.formatted['km-l']}
              copyable
            />
          </div>

          <div className="bg-muted/50 p-3 rounded-lg text-sm space-y-2">
            <p className="font-medium">Unit Comparison:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">Higher is Better:</p>
                <ul className="list-disc list-inside">
                  <li>MPG (US/UK)</li>
                  <li>km/L</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground">Lower is Better:</p>
                <ul className="list-disc list-inside">
                  <li>L/100km</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded-lg text-sm">
            <p className="font-medium mb-2">Regional Usage:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• <strong>MPG (US)</strong>: United States</li>
              <li>• <strong>MPG (UK)</strong>: United Kingdom, Commonwealth</li>
              <li>• <strong>L/100km</strong>: Europe, Australia, Canada</li>
              <li>• <strong>km/L</strong>: Japan, South Korea, parts of Asia</li>
            </ul>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <NumberInput
          id="fuel-value"
          label="Fuel Economy Value"
          value={value}
          onChange={setValue}
          min={0.1}
          step={0.1}
        />
        
        <SelectInput
          id="from-unit"
          label="Convert From"
          value={fromUnit}
          onChange={(v) => setFromUnit(v as FuelEconomyUnit)}
          options={UNIT_OPTIONS}
        />
      </div>
    </CalculatorBase>
  );
}

export default FuelConsumptionConverter;
