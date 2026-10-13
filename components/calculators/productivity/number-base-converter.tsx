'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ResultDisplay } from '@/components/ui/result-display';
import {
  convertNumberBase,
  groupDigits,
  NUMBER_BASES,
  type NumberBase,
  type NumberBaseResults,
} from '@/lib/calculations/productivity/number-base-converter';

export function NumberBaseConverter() {
  const [input, setInput] = React.useState('255');
  const [base, setBase] = React.useState<NumberBase>(10);
  const [results, setResults] = React.useState<NumberBaseResults | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      setError(null);
      setResults(convertNumberBase(input, base));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Omregningen mislyktes');
      setResults(null);
    }
  }, [input, base]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Tallsystem-omregner</CardTitle>
        <CardDescription>Regn om mellom binære, oktale, desimale og heksadesimale tall</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="base-select">Tallsystemet du skriver inn</Label>
          <select
            id="base-select"
            value={base}
            onChange={(e) => setBase(Number(e.target.value) as NumberBase)}
            className="w-full p-2 border rounded-md"
          >
            {NUMBER_BASES.map((b) => (
              <option key={b.base} value={b.base}>{b.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="number-input">Tall</Label>
          <input
            id="number-input"
            type="text"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-2 border rounded-md font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="255"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {results && (
          <div className="border-t pt-4 grid gap-3">
            <ResultDisplay label="Binær (2)" value={groupDigits(results.binary, 4)} copyable />
            <ResultDisplay label="Oktal (8)" value={results.octal} copyable />
            <ResultDisplay label="Desimal (10)" value={results.decimal} copyable highlight />
            <ResultDisplay label="Heksadesimal (16)" value={groupDigits(results.hexadecimal, 2)} copyable />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default NumberBaseConverter;
