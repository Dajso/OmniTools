'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  americanToDecimal,
  fractionalToDecimal,
  decimalToImpliedProbability,
  type OddsFormat,
} from '@/lib/calculations/betting';

interface ProbabilityResult {
  impliedProbability: number;
  decimalOdds: number;
  fairOdds: number;
  noVigProbability: number;
}

function calculateImpliedProbability(
  odds: number | string,
  format: OddsFormat
): ProbabilityResult {
  let decimal: number;
  
  if (format === 'american') {
    decimal = americanToDecimal(odds as number);
  } else if (format === 'fractional') {
    decimal = fractionalToDecimal(odds as string);
  } else {
    decimal = odds as number;
  }
  
  const impliedProbability = decimalToImpliedProbability(decimal);
  
  return {
    impliedProbability,
    decimalOdds: decimal,
    fairOdds: 100 / impliedProbability,
    noVigProbability: impliedProbability,
  };
}

export function ImpliedProbabilityCalculator() {
  const [inputValue, setInputValue] = React.useState<string>('-110');
  const [inputFormat, setInputFormat] = React.useState<OddsFormat>('american');
  const [result, setResult] = React.useState<ProbabilityResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      let value: number | string;
      
      if (inputFormat === 'fractional') {
        value = inputValue;
      } else {
        const parsed = parseFloat(inputValue);
        if (isNaN(parsed)) {
          throw new Error('Please enter a valid number');
        }
        if (inputFormat === 'american' && parsed === 0) {
          throw new Error('American odds cannot be zero');
        }
        if (inputFormat === 'decimal' && parsed <= 1) {
          throw new Error('Decimal odds must be greater than 1');
        }
        value = parsed;
      }
      
      const probResult = calculateImpliedProbability(value, inputFormat);
      setResult(probResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [inputValue, inputFormat]);

  const reset = () => {
    setInputValue('-110');
    setInputFormat('american');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  // Common odds reference
  const commonOdds = [
    { american: -500, label: 'Heavy Favorite' },
    { american: -200, label: 'Strong Favorite' },
    { american: -110, label: 'Standard Vig' },
    { american: +100, label: 'Even Money' },
    { american: +150, label: 'Slight Underdog' },
    { american: +300, label: 'Underdog' },
    { american: +1000, label: 'Long Shot' },
  ];

  return (
    <CalculatorBase
      title="Implied Probability Calculator"
      description="Calculate the implied probability from betting odds"
      formula="Implied Probability = (1 / Decimal Odds) × 100"
      formulaExplanation="Implied probability shows the likelihood of an outcome as suggested by the odds."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay
            label="Implied Probability"
            value={`${result.impliedProbability.toFixed(2)}%`}
            highlight
            copyable
          />
          
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Decimal Odds"
              value={result.decimalOdds.toFixed(3)}
              copyable
            />
            <ResultDisplay
              label="Fair Value Odds"
              value={result.fairOdds.toFixed(3)}
              copyable
            />
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Probability Visualization</p>
            <div className="relative h-8 bg-muted rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-300"
                style={{ width: `${Math.min(result.impliedProbability, 100)}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                {result.impliedProbability.toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Common Odds Reference</p>
            <div className="grid grid-cols-2 gap-2">
              {commonOdds.map((item) => {
                const prob = decimalToImpliedProbability(americanToDecimal(item.american));
                return (
                  <Card 
                    key={item.american}
                    className={`p-2 cursor-pointer hover:bg-muted/50 transition-colors ${
                      Math.abs(parseFloat(inputValue) - item.american) < 1 && inputFormat === 'american'
                        ? 'ring-2 ring-primary'
                        : ''
                    }`}
                    onClick={() => {
                      setInputFormat('american');
                      setInputValue(item.american.toString());
                    }}
                  >
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-mono">
                        {item.american > 0 ? '+' : ''}{item.american}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {prob.toFixed(1)}% implied
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              💡 If you believe the true probability is higher than {result.impliedProbability.toFixed(1)}%, 
              this bet may have value. If lower, the bookmaker has the edge.
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="odds-format">Odds Format</Label>
          <select
            id="odds-format"
            value={inputFormat}
            onChange={(e) => {
              setInputFormat(e.target.value as OddsFormat);
              if (e.target.value === 'american') setInputValue('-110');
              else if (e.target.value === 'decimal') setInputValue('1.91');
              else setInputValue('10/11');
            }}
            className="w-full mt-1 p-2 border rounded-md bg-background"
          >
            <option value="american">American (+150, -110)</option>
            <option value="decimal">Decimal (2.50)</option>
            <option value="fractional">Fractional (3/2)</option>
          </select>
        </div>

        <div>
          <Label htmlFor="odds-value">Odds Value</Label>
          <Input
            id="odds-value"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={inputFormat === 'american' ? '-110' : inputFormat === 'decimal' ? '1.91' : '10/11'}
            className="mt-1"
          />
        </div>

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm text-muted-foreground">
            💡 Click on any common odds above to quickly calculate its implied probability.
          </p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default ImpliedProbabilityCalculator;
