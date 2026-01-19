'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { SelectInput } from '@/components/ui/select-input';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  convertEthereumUnits,
  UNIT_NAMES,
  UNIT_DECIMALS,
  type EthereumUnit,
  type EthereumConversionResult,
} from '@/lib/calculations/crypto';

const UNIT_OPTIONS: { value: EthereumUnit; label: string }[] = [
  { value: 'wei', label: 'Wei' },
  { value: 'kwei', label: 'Kwei (Babbage)' },
  { value: 'mwei', label: 'Mwei (Lovelace)' },
  { value: 'gwei', label: 'Gwei (Shannon)' },
  { value: 'szabo', label: 'Szabo' },
  { value: 'finney', label: 'Finney' },
  { value: 'ether', label: 'Ether' },
];

const COMMON_CONVERSIONS = [
  { from: 'ether', to: 'gwei', value: '1', label: '1 ETH in Gwei' },
  { from: 'ether', to: 'wei', value: '1', label: '1 ETH in Wei' },
  { from: 'gwei', to: 'ether', value: '1', label: '1 Gwei in ETH' },
  { from: 'gwei', to: 'wei', value: '1000000000', label: '1B Gwei in Wei' },
];

export function EthereumUnitConverter() {
  const [inputValue, setInputValue] = React.useState('1');
  const [fromUnit, setFromUnit] = React.useState<EthereumUnit>('ether');
  const [toUnit, setToUnit] = React.useState<EthereumUnit>('gwei');
  const [result, setResult] = React.useState<EthereumConversionResult | null>(null);
  const [allConversions, setAllConversions] = React.useState<Record<EthereumUnit, string>>({} as Record<EthereumUnit, string>);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      
      if (!inputValue || inputValue === '') {
        setResult(null);
        return;
      }

      const conversionResult = convertEthereumUnits({
        value: inputValue,
        fromUnit,
        toUnit,
      });
      setResult(conversionResult);

      // Calculate all unit conversions
      const conversions: Record<EthereumUnit, string> = {} as Record<EthereumUnit, string>;
      for (const unit of UNIT_OPTIONS) {
        try {
          const conv = convertEthereumUnits({
            value: inputValue,
            fromUnit,
            toUnit: unit.value,
          });
          conversions[unit.value] = conv.value;
        } catch {
          conversions[unit.value] = 'Error';
        }
      }
      setAllConversions(conversions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion error');
      setResult(null);
    }
  }, [inputValue, fromUnit, toUnit]);

  const reset = () => {
    setInputValue('1');
    setFromUnit('ether');
    setToUnit('gwei');
    setResult(null);
    setAllConversions({} as Record<EthereumUnit, string>);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    if (result) {
      setInputValue(result.value);
    }
  };

  return (
    <CalculatorBase
      title="Ethereum Unit Converter"
      description="Convert between Ethereum units (Wei, Gwei, Ether)"
      formula="1 Ether = 10⁹ Gwei = 10¹⁸ Wei"
      formulaExplanation="Ethereum uses 18 decimal places for precision"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="bg-primary/10 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Result</p>
            <p className="text-xl font-bold font-mono break-all">{result.value}</p>
            <p className="text-sm text-muted-foreground">{UNIT_NAMES[toUnit]}</p>
          </div>

          {result.precisionWarning && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3">
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                ⚠️ This value is very large. The numeric representation may have precision loss. 
                Use the string value for exact calculations.
              </p>
            </div>
          )}

          <ResultDisplay
            label="Formatted"
            value={result.formatted}
            copyable
          />

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">All Unit Conversions</p>
            <div className="space-y-2">
              {UNIT_OPTIONS.map((unit) => (
                <Card
                  key={unit.value}
                  className={`p-2 cursor-pointer hover:bg-muted/50 transition-colors ${
                    unit.value === toUnit ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setToUnit(unit.value)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-sm">{unit.label}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        (10^{18 - UNIT_DECIMALS[unit.value]} Wei)
                      </span>
                    </div>
                    <code className="font-mono text-xs truncate max-w-[150px]">
                      {allConversions[unit.value] || '...'}
                    </code>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="input-value">Amount</Label>
          <Input
            id="input-value"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter amount"
            className="font-mono"
          />
        </div>

        <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-end">
          <SelectInput
            id="from-unit"
            label="From"
            value={fromUnit}
            onChange={(v) => setFromUnit(v as EthereumUnit)}
            options={UNIT_OPTIONS}
          />
          <button
            type="button"
            onClick={swapUnits}
            className="mb-1 p-2 hover:bg-muted rounded-md transition-colors"
            title="Swap units"
          >
            ⇄
          </button>
          <SelectInput
            id="to-unit"
            label="To"
            value={toUnit}
            onChange={(v) => setToUnit(v as EthereumUnit)}
            options={UNIT_OPTIONS}
          />
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Quick Conversions</p>
          <div className="grid grid-cols-2 gap-2">
            {COMMON_CONVERSIONS.map((conv, index) => (
              <Card
                key={index}
                className="p-2 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => {
                  setInputValue(conv.value);
                  setFromUnit(conv.from as EthereumUnit);
                  setToUnit(conv.to as EthereumUnit);
                }}
              >
                <p className="text-xs text-muted-foreground">{conv.label}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Unit Reference</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Wei</span>
              <span>10⁰</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kwei</span>
              <span>10³</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mwei</span>
              <span>10⁶</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gwei</span>
              <span>10⁹</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Szabo</span>
              <span>10¹²</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Finney</span>
              <span>10¹⁵</span>
            </div>
            <div className="flex justify-between col-span-2">
              <span className="text-muted-foreground">Ether</span>
              <span>10¹⁸</span>
            </div>
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default EthereumUnitConverter;
