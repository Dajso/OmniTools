'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { SelectInput } from '@/components/ui/select-input';
import { Label } from '@/components/ui/label';
import {
  generateHash,
  HASH_ALGORITHMS,
  type HashAlgorithm,
  type HashResult,
} from '@/lib/calculations/crypto';

const ALGORITHM_OPTIONS = Object.entries(HASH_ALGORITHMS).map(([value, info]) => ({
  value,
  label: `${info.name} (${info.bitLength}-bit)`,
}));

export function HashGenerator() {
  const [inputText, setInputText] = React.useState('Hello, World!');
  const [algorithm, setAlgorithm] = React.useState<HashAlgorithm>('sha256');
  const [result, setResult] = React.useState<HashResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();
  const [isCalculating, setIsCalculating] = React.useState(false);

  const calculate = React.useCallback(async () => {
    try {
      setError(undefined);
      setIsCalculating(true);
      const hashResult = await generateHash({
        data: inputText,
        algorithm,
      });
      setResult(hashResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hash generation error');
      setResult(null);
    } finally {
      setIsCalculating(false);
    }
  }, [inputText, algorithm]);

  const reset = () => {
    setInputText('Hello, World!');
    setAlgorithm('sha256');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const algorithmInfo = HASH_ALGORITHMS[algorithm];

  return (
    <CalculatorBase
      title="Hash Generator"
      description="Generate cryptographic hashes using SHA-256 and Keccak-256 algorithms"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      isCalculating={isCalculating}
      results={result && (
        <div className="space-y-4">
          <div className="bg-primary/10 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Hash Output</p>
            <code className="text-sm font-mono break-all block">{result.hash}</code>
          </div>

          <ResultDisplay
            label="With 0x Prefix"
            value={result.hashWithPrefix}
            copyable
          />

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Algorithm"
              value={algorithmInfo.name}
            />
            <ResultDisplay
              label="Bit Length"
              value={`${result.bitLength} bits`}
            />
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium mb-1">Algorithm Info</p>
            <p className="text-xs text-muted-foreground">{algorithmInfo.description}</p>
            <p className="text-xs text-muted-foreground mt-1">
              <strong>Use case:</strong> {algorithmInfo.useCase}
            </p>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">Hash Properties</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Deterministic: Same input always produces same output</li>
              <li>• One-way: Cannot reverse the hash to get the original input</li>
              <li>• Collision-resistant: Extremely unlikely for two inputs to produce the same hash</li>
              <li>• Avalanche effect: Small input changes cause large output changes</li>
            </ul>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="input-text">Input Text</Label>
          <textarea
            id="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to hash"
            className="w-full min-h-[100px] p-3 border rounded-md font-mono text-sm resize-y bg-background"
            rows={4}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {inputText.length} characters
          </p>
        </div>

        <SelectInput
          id="algorithm"
          label="Hash Algorithm"
          value={algorithm}
          onChange={(v) => setAlgorithm(v as HashAlgorithm)}
          options={ALGORITHM_OPTIONS}
        />

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Algorithm Comparison</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">SHA-256</span>
              <span>Bitcoin, general cryptography</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Keccak-256</span>
              <span>Ethereum addresses, signatures</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">SHA-512</span>
              <span>High-security applications</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border border-yellow-200 dark:border-yellow-800">
          ⚠️ This tool is for educational purposes. Never hash sensitive data like passwords in a browser - use proper server-side hashing with salts.
        </p>
      </div>
    </CalculatorBase>
  );
}

export default HashGenerator;
