'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { generatePassword, type PasswordOptions, type PasswordResult } from '@/lib/calculations/productivity/password-generator';

const DEFAULT_OPTIONS: PasswordOptions = {
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeAmbiguous: false,
};

const STRENGTH_COLORS: Record<PasswordResult['strength'], string> = {
  'weak': 'bg-red-500',
  'fair': 'bg-orange-500',
  'good': 'bg-yellow-500',
  'strong': 'bg-green-500',
  'very-strong': 'bg-emerald-600',
};

const STRENGTH_LABELS: Record<PasswordResult['strength'], string> = {
  'weak': 'Weak',
  'fair': 'Fair',
  'good': 'Good',
  'strong': 'Strong',
  'very-strong': 'Very Strong',
};

/**
 * Password Generator Component
 * 
 * Generates secure passwords with customizable options
 * @see Requirements 9.3
 */
export function PasswordGenerator() {
  const [options, setOptions] = React.useState<PasswordOptions>(DEFAULT_OPTIONS);
  const [result, setResult] = React.useState<PasswordResult | null>(null);
  const [copied, setCopied] = React.useState(false);

  // Generate initial password on mount
  React.useEffect(() => {
    handleGenerate();
  }, []);

  const handleGenerate = () => {
    const newResult = generatePassword(options);
    setResult(newResult);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (result?.password) {
      try {
        await navigator.clipboard.writeText(result.password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = result.password;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const updateOption = <K extends keyof PasswordOptions>(key: K, value: PasswordOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Password Generator</CardTitle>
        <CardDescription>
          Generate secure, random passwords with customizable options
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Generated Password Display */}
        {result && (
          <div className="space-y-3">
            <Label>Generated Password</Label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={result.password}
                className="flex-1 p-3 font-mono text-lg border rounded-md bg-muted"
                aria-label="Generated password"
              />
              <Button onClick={handleCopy} variant="outline">
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>

            {/* Strength Indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Strength: {STRENGTH_LABELS[result.strength]}</span>
                <span>{result.strengthScore}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${STRENGTH_COLORS[result.strength]}`}
                  style={{ width: `${result.strengthScore}%` }}
                  role="progressbar"
                  aria-valuenow={result.strengthScore}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Password strength: ${STRENGTH_LABELS[result.strength]}`}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Entropy: {result.entropy} bits</span>
                <span>Crack time: {result.crackTime}</span>
              </div>
            </div>
          </div>
        )}

        {/* Options */}
        <div className="space-y-4">
          <NumberInput
            id="password-length"
            label="Password Length"
            value={options.length}
            onChange={(v) => updateOption('length', v)}
            min={4}
            max={128}
            step={1}
          />

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeUppercase}
                onChange={(e) => updateOption('includeUppercase', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm">Uppercase (A-Z)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeLowercase}
                onChange={(e) => updateOption('includeLowercase', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm">Lowercase (a-z)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeNumbers}
                onChange={(e) => updateOption('includeNumbers', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm">Numbers (0-9)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeSymbols}
                onChange={(e) => updateOption('includeSymbols', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm">Symbols (!@#$...)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer col-span-2">
              <input
                type="checkbox"
                checked={options.excludeAmbiguous}
                onChange={(e) => updateOption('excludeAmbiguous', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm">Exclude ambiguous characters (0, O, l, 1, I)</span>
            </label>
          </div>
        </div>

        <Button onClick={handleGenerate} className="w-full">
          Generate New Password
        </Button>

        {/* Statistics */}
        {result && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">Password Statistics</p>
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Length" value={result.password.length.toString()} />
              <ResultDisplay label="Entropy" value={`${result.entropy} bits`} />
              <ResultDisplay label="Strength" value={STRENGTH_LABELS[result.strength]} />
              <ResultDisplay label="Crack Time" value={result.crackTime} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PasswordGenerator;
