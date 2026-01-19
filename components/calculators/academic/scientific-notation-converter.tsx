'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Button } from '@/components/ui/button';
import { 
  toScientificNotation,
  fromScientificNotation,
  toEngineeringNotation,
  parseScientificNotation,
  SI_PREFIXES,
} from '@/lib/calculations/academic/scientific-notation-converter';

type ConversionMode = 'toScientific' | 'fromScientific';

export function ScientificNotationConverter() {
  const [mode, setMode] = React.useState<ConversionMode>('toScientific');
  const [decimalInput, setDecimalInput] = React.useState<string>('314159');
  const [coefficient, setCoefficient] = React.useState<number>(3.14159);
  const [exponent, setExponent] = React.useState<number>(5);
  const [error, setError] = React.useState<string | undefined>();
  const [results, setResults] = React.useState<{
    decimal: string;
    scientific: string;
    eNotation: string;
    engineering: string;
    siPrefix?: string;
  } | null>(null);

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);

      if (mode === 'toScientific') {
        const value = parseFloat(decimalInput);
        if (isNaN(value)) {
          setError('Please enter a valid number');
          setResults(null);
          return;
        }

        const scientific = toScientificNotation(value);
        const engineering = toEngineeringNotation(value);
        
        // Find SI prefix if applicable
        const engExp = Math.floor(Math.log10(Math.abs(value)) / 3) * 3;
        const siPrefix = SI_PREFIXES[engExp];

        setResults({
          decimal: value.toString(),
          scientific: scientific.formatted,
          eNotation: `${scientific.coefficient.toPrecision(6).replace(/\.?0+$/, '')}e${scientific.exponent}`,
          engineering,
          siPrefix: siPrefix ? `${siPrefix.name} (${siPrefix.symbol})` : undefined,
        });
      } else {
        const value = fromScientificNotation(coefficient, exponent);
        const scientific = toScientificNotation(value);
        const engineering = toEngineeringNotation(value);

        // Find SI prefix if applicable
        const engExp = Math.floor(exponent / 3) * 3;
        const siPrefix = SI_PREFIXES[engExp];

        setResults({
          decimal: value.toLocaleString('en-US', { maximumFractionDigits: 20 }),
          scientific: scientific.formatted,
          eNotation: `${coefficient}e${exponent}`,
          engineering,
          siPrefix: siPrefix ? `${siPrefix.name} (${siPrefix.symbol})` : undefined,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion error');
      setResults(null);
    }
  }, [mode, decimalInput, coefficient, exponent]);

  const reset = () => {
    setDecimalInput('314159');
    setCoefficient(3.14159);
    setExponent(5);
    setResults(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <CalculatorBase
      title="Scientific Notation Converter"
      description="Convert numbers to and from scientific notation"
      formula="N = c × 10^e (where 1 ≤ |c| < 10)"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay 
            label="Decimal" 
            value={results.decimal} 
            highlight 
            copyable 
          />
          <ResultDisplay 
            label="Scientific Notation" 
            value={results.scientific} 
            copyable 
          />
          <ResultDisplay 
            label="E Notation" 
            value={results.eNotation} 
            copyable 
          />
          <ResultDisplay 
            label="Engineering Notation" 
            value={results.engineering} 
            copyable 
          />
          {results.siPrefix && (
            <ResultDisplay 
              label="SI Prefix" 
              value={results.siPrefix} 
            />
          )}
        </div>
      )}
    >
      <div className="flex gap-2 mb-4">
        <Button
          type="button"
          variant={mode === 'toScientific' ? 'default' : 'outline'}
          onClick={() => setMode('toScientific')}
          className="flex-1"
        >
          Decimal → Scientific
        </Button>
        <Button
          type="button"
          variant={mode === 'fromScientific' ? 'default' : 'outline'}
          onClick={() => setMode('fromScientific')}
          className="flex-1"
        >
          Scientific → Decimal
        </Button>
      </div>

      {mode === 'toScientific' ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="decimalInput" className="block text-sm font-medium">
              Decimal Number
            </label>
            <input
              id="decimalInput"
              type="text"
              value={decimalInput}
              onChange={(e) => setDecimalInput(e.target.value)}
              placeholder="Enter a number (e.g., 314159)"
              className="w-full px-3 py-2 border rounded-md bg-background"
            />
            <p className="text-xs text-muted-foreground">
              Enter any number (supports very large and very small numbers)
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <NumberInput
            id="coefficient"
            label="Coefficient (c)"
            value={coefficient}
            onChange={setCoefficient}
            step={0.000001}
          />
          <NumberInput
            id="exponent"
            label="Exponent (e)"
            value={exponent}
            onChange={setExponent}
            step={1}
          />
          <p className="text-xs text-muted-foreground">
            Format: c × 10^e (e.g., 3.14159 × 10^5 = 314159)
          </p>
        </div>
      )}
    </CalculatorBase>
  );
}

export default ScientificNotationConverter;
