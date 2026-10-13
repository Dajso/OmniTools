'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Button } from '@/components/ui/button';
import { 
  addFractions,
  subtractFractions,
  multiplyFractions,
  divideFractions,
  simplifyFraction,
  fractionToDecimal,
  formatFraction,
  type Fraction,
} from '@/lib/calculations/academic/fraction-calculator';
import { formatFixed } from '@/lib/utils/formatting';

type Operation = 'add' | 'subtract' | 'multiply' | 'divide' | 'simplify';

const OPERATION_OPTIONS = [
  { value: 'add', label: 'Addisjon (+)' },
  { value: 'subtract', label: 'Subtraksjon (−)' },
  { value: 'multiply', label: 'Multiplikasjon (×)' },
  { value: 'divide', label: 'Divisjon (÷)' },
  { value: 'simplify', label: 'Forkort' },
];

const OPERATION_SYMBOLS: Record<Operation, string> = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
  simplify: '→',
};

interface FractionResult {
  result: Fraction;
  decimal: number;
  formatted: string;
  expression: string;
}

export function FractionCalculator() {
  const [operation, setOperation] = React.useState<Operation>('add');
  const [num1, setNum1] = React.useState<number>(1);
  const [den1, setDen1] = React.useState<number>(2);
  const [num2, setNum2] = React.useState<number>(1);
  const [den2, setDen2] = React.useState<number>(4);
  const [error, setError] = React.useState<string | undefined>();
  const [results, setResults] = React.useState<FractionResult | null>(null);

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);

      const fraction1: Fraction = { numerator: num1, denominator: den1 };
      const fraction2: Fraction = { numerator: num2, denominator: den2 };

      if (den1 === 0 || (operation !== 'simplify' && den2 === 0)) {
        setError('Nevneren kan ikke være null');
        setResults(null);
        return;
      }

      let result: Fraction;
      let expression: string;

      switch (operation) {
        case 'add':
          result = addFractions(fraction1, fraction2);
          expression = `${formatFraction(fraction1)} + ${formatFraction(fraction2)}`;
          break;
        case 'subtract':
          result = subtractFractions(fraction1, fraction2);
          expression = `${formatFraction(fraction1)} − ${formatFraction(fraction2)}`;
          break;
        case 'multiply':
          result = multiplyFractions(fraction1, fraction2);
          expression = `${formatFraction(fraction1)} × ${formatFraction(fraction2)}`;
          break;
        case 'divide':
          if (num2 === 0) {
            setError('Du kan ikke dele på null');
            setResults(null);
            return;
          }
          result = divideFractions(fraction1, fraction2);
          expression = `${formatFraction(fraction1)} ÷ ${formatFraction(fraction2)}`;
          break;
        case 'simplify':
          result = simplifyFraction(fraction1);
          expression = `Simplify ${formatFraction(fraction1)}`;
          break;
        default:
          throw new Error('Ugyldig regneart');
      }

      setResults({
        result,
        decimal: fractionToDecimal(result),
        formatted: formatFraction(result),
        expression,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Feil i beregningen');
      setResults(null);
    }
  }, [operation, num1, den1, num2, den2]);

  const reset = () => {
    setOperation('add');
    setNum1(1);
    setDen1(2);
    setNum2(1);
    setDen2(4);
    setResults(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const showSecondFraction = operation !== 'simplify';

  return (
    <CalculatorBase
      title="Brøkkalkulator"
      description="Legg sammen, trekk fra, gang, del og forkort brøker"
      formula="Svaret forkortes automatisk så mye som mulig"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={results && (
        <div className="space-y-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">{results.expression}</p>
            <p className="text-3xl font-bold">{results.formatted}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Teller" 
              value={results.result.numerator.toString()} 
              copyable 
            />
            <ResultDisplay 
              label="Nevner" 
              value={results.result.denominator.toString()} 
              copyable 
            />
          </div>
          
          <ResultDisplay 
            label="Desimaltall" 
            value={formatFixed(results.decimal, 6).replace(/,?0+$/, '')} 
            copyable 
          />

          {results.result.denominator !== 1 && Math.abs(results.result.numerator) > results.result.denominator && (
            <ResultDisplay 
              label="Blandet tall" 
              value={formatMixedNumber(results.result)} 
              copyable 
            />
          )}
        </div>
      )}
    >
      <SelectInput
        id="operation"
        label="Regneart"
        value={operation}
        onChange={(v) => setOperation(v as Operation)}
        options={OPERATION_OPTIONS}
      />

      <div className="space-y-4">
        <p className="text-sm font-medium">Første brøk</p>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <NumberInput
              id="num1"
              label="Teller"
              value={num1}
              onChange={setNum1}
              step={1}
            />
          </div>
          <div className="text-2xl font-bold pt-6">/</div>
          <div className="flex-1">
            <NumberInput
              id="den1"
              label="Nevner"
              value={den1}
              onChange={setDen1}
              step={1}
              min={1}
            />
          </div>
        </div>
      </div>

      {showSecondFraction && (
        <>
          <div className="flex justify-center py-2">
            <span className="text-2xl font-bold text-primary">
              {OPERATION_SYMBOLS[operation]}
            </span>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium">Andre brøk</p>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <NumberInput
                  id="num2"
                  label="Teller"
                  value={num2}
                  onChange={setNum2}
                  step={1}
                />
              </div>
              <div className="text-2xl font-bold pt-6">/</div>
              <div className="flex-1">
                <NumberInput
                  id="den2"
                  label="Nevner"
                  value={den2}
                  onChange={setDen2}
                  step={1}
                  min={1}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </CalculatorBase>
  );
}

function formatMixedNumber(f: Fraction): string {
  const whole = Math.floor(Math.abs(f.numerator) / f.denominator);
  const remainder = Math.abs(f.numerator) % f.denominator;
  const sign = f.numerator < 0 ? '-' : '';
  
  if (remainder === 0) {
    return `${sign}${whole}`;
  }
  
  return `${sign}${whole} ${remainder}/${f.denominator}`;
}

export default FractionCalculator;
