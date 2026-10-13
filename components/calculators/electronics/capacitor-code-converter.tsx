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
      setError(err instanceof Error ? err.message : 'Ugyldig kode');
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
      title="Kondensatorkode"
      description="Regn om kondensatorkoder (for eksempel 104) til faktisk verdi"
      formula="Verdi = (S1×10 + S2) × 10^M pF"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay label="Kapasitans" value={result.formatted} copyable />
          <div className="grid grid-cols-3 gap-4">
            <ResultDisplay label="Pikofarad" value={`${result.picofarads.toLocaleString('nb-NO')} pF`} />
            <ResultDisplay label="Nanofarad" value={`${result.nanofarads} nF`} />
            <ResultDisplay label="Mikrofarad" value={`${result.microfarads} µF`} />
          </div>
          {result.tolerance && (
            <ResultDisplay label="Toleranse" value={`±${result.tolerance}%`} />
          )}
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="input-code">Kondensatorkode</Label>
          <Input
            id="input-code"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="e.g., 104"
            className="font-mono text-lg"
          />
        </div>

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Vanlige koder</p>
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
          <p className="text-sm font-medium mb-2">Slik leser du koden</p>
          <p className="text-xs text-muted-foreground">
            En tresifret kode som <span className="font-mono">104</span> betyr:
            <br />• De to første sifrene (10) = gjeldende siffer
            <br />• Tredje siffer (4) = antall nuller som legges til
            <br />• Resultat: 10 + 0000 = 100 000 pF = 100 nF
          </p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default CapacitorCodeConverter;
