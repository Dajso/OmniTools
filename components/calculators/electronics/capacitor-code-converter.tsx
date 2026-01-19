'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { decodeCapacitorCode, encodeCapacitorCode, type CapacitorValue } from '@/lib/calculations/electronics/capacitor-code';

export function CapacitorCodeConverter() {
  const [inputCode, setInputCode] = React.useState('104');
  const [result, setResult] = React.useState<CapacitorValue | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      if (!inputCode.trim()) {
        setResult(null);
        return;
      }
      const res = decodeCapacitorCode(inputCode);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code');
      setResult(null);
    }
  }, [inputCode]);

  const reset = () => {
    setInputCode('104');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => { calculate(); }, [calculate]);

  const commonCodes = [
    { code: '104', desc: '100nF' },
    { code: '103', desc: '10nF' },
    { code: '102', desc: '1nF' },
    { code: '473', desc: '47nF' },
    { code: '224', desc: '220nF' },
    { code: '105', desc: '1µF' },
  ];

  return (
    <CalculatorBase
      title="Capacitor Code Converter"
      description="Convert capacitor codes (e.g., 104) to actual values"
      formula="Value = (D1×10 + D2) × 10^M pF"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay label="Capacitance" value={result.formatted} copyable />
          <div className="grid grid-cols-3 gap-4">
            <ResultDisplay label="Picofarads" value={`${result.picofarads.toLocaleString()} pF`} />
            <ResultDisplay label="Nanofarads" value={`${result.nanofarads} nF`} />
            <ResultDisplay label="Microfarads" value={`${result.microfarads} µF`} />
          </div>
          {result.tolerance && (
            <ResultDisplay label="Tolerance" value={`±${result.tolerance}%`} />
          )}
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="input-code">Capacitor Code</Label>
          <Input
            id="input-code"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="e.g., 104"
            className="font-mono text-lg"
          />
        </div>

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Common Codes</p>
          <div className="grid grid-cols-3 gap-2">
            {commonCodes.map(({ code, desc }) => (
              <button
                key={code}
                type="button"
                onClick={() => setInputCode(code)}
                className="p-2 text-left hover:bg-muted rounded text-sm"
              >
                <span className="font-mono font-bold">{code}</span>
                <span className="text-muted-foreground ml-2">{desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">How to Read</p>
          <p className="text-xs text-muted-foreground">
            A 3-digit code like <span className="font-mono">104</span> means:
            <br />• First two digits (10) = significant figures
            <br />• Third digit (4) = number of zeros to add
            <br />• Result: 10 + 0000 = 100,000 pF = 100 nF
          </p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default CapacitorCodeConverter;
