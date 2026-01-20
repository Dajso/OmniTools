'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ShortenedAddress {
  original: string;
  shortened: string;
  prefix: string;
  suffix: string;
  prefixLength: number;
  suffixLength: number;
  type: 'ethereum' | 'bitcoin' | 'solana' | 'unknown';
}

const EXAMPLE_ADDRESSES = [
  { label: 'Ethereum', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f8fE21', type: 'ethereum' as const },
  { label: 'Bitcoin', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', type: 'bitcoin' as const },
  { label: 'Solana', address: '7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV', type: 'solana' as const },
];

function detectAddressType(address: string): 'ethereum' | 'bitcoin' | 'solana' | 'unknown' {
  if (address.startsWith('0x') && address.length === 42) {
    return 'ethereum';
  }
  if ((address.startsWith('1') || address.startsWith('3') || address.startsWith('bc1')) && address.length >= 26 && address.length <= 62) {
    return 'bitcoin';
  }
  if (address.length >= 32 && address.length <= 44 && /^[1-9A-HJ-NP-Za-km-z]+$/.test(address)) {
    return 'solana';
  }
  return 'unknown';
}

function shortenAddress(address: string, prefixLength: number, suffixLength: number): ShortenedAddress {
  const type = detectAddressType(address);
  const prefix = address.slice(0, prefixLength);
  const suffix = address.slice(-suffixLength);
  const shortened = `${prefix}...${suffix}`;

  return {
    original: address,
    shortened,
    prefix,
    suffix,
    prefixLength,
    suffixLength,
    type,
  };
}

export function AddressShortener() {
  const [address, setAddress] = React.useState('0x742d35Cc6634C0532925a3b844Bc9e7595f8fE21');
  const [prefixLength, setPrefixLength] = React.useState(6);
  const [suffixLength, setSuffixLength] = React.useState(4);
  const [result, setResult] = React.useState<ShortenedAddress | null>(null);
  const [error, setError] = React.useState<string | undefined>();
  const [copied, setCopied] = React.useState(false);

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      if (!address || address.length < prefixLength + suffixLength) {
        setError('Address is too short for the selected prefix/suffix lengths');
        setResult(null);
        return;
      }
      const shortened = shortenAddress(address, prefixLength, suffixLength);
      setResult(shortened);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error processing address');
      setResult(null);
    }
  }, [address, prefixLength, suffixLength]);

  const reset = () => {
    setAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f8fE21');
    setPrefixLength(6);
    setSuffixLength(4);
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ethereum': return 'text-blue-600';
      case 'bitcoin': return 'text-orange-600';
      case 'solana': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <CalculatorBase
      title="Address Shortener"
      description="Shorten blockchain addresses for display (0x123...abc format)"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="bg-primary/10 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Shortened Address</p>
            <div className="flex items-center gap-2">
              <code className="text-xl font-mono font-bold break-all">{result.shortened}</code>
              <button
                type="button"
                onClick={() => copyToClipboard(result.shortened)}
                className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Address Type"
              value={result.type.charAt(0).toUpperCase() + result.type.slice(1)}
            />
            <ResultDisplay
              label="Original Length"
              value={`${result.original.length} chars`}
            />
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Full Address</p>
            <code className="text-xs font-mono break-all text-muted-foreground">
              {result.original}
            </code>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Common Formats</p>
            <div className="space-y-2">
              {[
                { prefix: 4, suffix: 4, label: 'Minimal (4...4)' },
                { prefix: 6, suffix: 4, label: 'Standard (6...4)' },
                { prefix: 8, suffix: 6, label: 'Extended (8...6)' },
                { prefix: 10, suffix: 8, label: 'Long (10...8)' },
              ].map((format) => {
                const shortened = shortenAddress(address, format.prefix, format.suffix);
                return (
                  <Card
                    key={format.label}
                    className="p-2 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setPrefixLength(format.prefix);
                      setSuffixLength(format.suffix);
                    }}
                  >
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{format.label}</span>
                      <code className="font-mono">{shortened.shortened}</code>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="address">Blockchain Address</Label>
          <Input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter a blockchain address"
            className="font-mono text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="prefix-length">Prefix Length</Label>
            <Input
              id="prefix-length"
              type="number"
              value={prefixLength}
              onChange={(e) => setPrefixLength(parseInt(e.target.value) || 4)}
              min={2}
              max={20}
            />
          </div>
          <div>
            <Label htmlFor="suffix-length">Suffix Length</Label>
            <Input
              id="suffix-length"
              type="number"
              value={suffixLength}
              onChange={(e) => setSuffixLength(parseInt(e.target.value) || 4)}
              min={2}
              max={20}
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Example Addresses</p>
          <div className="space-y-2">
            {EXAMPLE_ADDRESSES.map((example) => (
              <Card
                key={example.label}
                className="p-2 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setAddress(example.address)}
              >
                <div className="flex justify-between items-center text-sm">
                  <span className={getTypeColor(example.type)}>{example.label}</span>
                  <code className="font-mono text-xs truncate max-w-[200px]">{example.address}</code>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default AddressShortener;
