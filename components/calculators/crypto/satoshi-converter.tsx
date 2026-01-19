'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Card } from '@/components/ui/card';

const SATS_PER_BTC = 100_000_000;

interface ConversionResult {
  satoshis: number;
  btc: number;
  usd: number;
  mbtc: number;
  bits: number;
}

const COMMON_AMOUNTS = [
  { label: '1 Satoshi', sats: 1 },
  { label: '100 Sats', sats: 100 },
  { label: '1,000 Sats', sats: 1000 },
  { label: '10,000 Sats', sats: 10000 },
  { label: '100,000 Sats', sats: 100000 },
  { label: '1 Million Sats', sats: 1000000 },
];

export function SatoshiConverter() {
  const [satoshis, setSatoshis] = React.useState(100000);
  const [btcPriceUsd, setBtcPriceUsd] = React.useState(45000);
  const [conversionMode, setConversionMode] = React.useState<'sats' | 'btc' | 'usd'>('sats');
  const [inputValue, setInputValue] = React.useState(100000);
  const [result, setResult] = React.useState<ConversionResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      
      let sats: number;
      
      if (conversionMode === 'sats') {
        sats = inputValue;
      } else if (conversionMode === 'btc') {
        sats = inputValue * SATS_PER_BTC;
      } else {
        // USD to sats
        const btcAmount = inputValue / btcPriceUsd;
        sats = btcAmount * SATS_PER_BTC;
      }

      const btc = sats / SATS_PER_BTC;
      const usd = btc * btcPriceUsd;
      const mbtc = btc * 1000;
      const bits = sats / 100;

      setResult({
        satoshis: sats,
        btc,
        usd,
        mbtc,
        bits,
      });
      setSatoshis(sats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [inputValue, btcPriceUsd, conversionMode]);

  const reset = () => {
    setSatoshis(100000);
    setBtcPriceUsd(45000);
    setConversionMode('sats');
    setInputValue(100000);
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const handleModeChange = (mode: 'sats' | 'btc' | 'usd') => {
    setConversionMode(mode);
    if (result) {
      if (mode === 'sats') {
        setInputValue(result.satoshis);
      } else if (mode === 'btc') {
        setInputValue(result.btc);
      } else {
        setInputValue(result.usd);
      }
    }
  };

  return (
    <CalculatorBase
      title="Satoshi to USD Converter"
      description="Convert between Satoshis, Bitcoin, and USD"
      formula="1 BTC = 100,000,000 Satoshis"
      formulaExplanation="A Satoshi is the smallest unit of Bitcoin, named after its creator Satoshi Nakamoto"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay
            label="USD Value"
            value={`$${result.usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`}
            highlight
            copyable
          />
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Satoshis"
              value={result.satoshis.toLocaleString()}
              copyable
            />
            <ResultDisplay
              label="Bitcoin"
              value={result.btc.toFixed(8)}
              copyable
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="mBTC (Millibits)"
              value={result.mbtc.toFixed(5)}
              copyable
            />
            <ResultDisplay
              label="Bits (μBTC)"
              value={result.bits.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              copyable
            />
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Quick Conversions</p>
            <div className="grid grid-cols-2 gap-2">
              {COMMON_AMOUNTS.map((amount) => {
                const btcVal = amount.sats / SATS_PER_BTC;
                const usdVal = btcVal * btcPriceUsd;
                return (
                  <Card
                    key={amount.label}
                    className="p-2 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setConversionMode('sats');
                      setInputValue(amount.sats);
                    }}
                  >
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{amount.label}</span>
                      <span className="font-mono">${usdVal.toFixed(usdVal < 1 ? 6 : 2)}</span>
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
        <div className="flex gap-2 mb-4">
          {(['sats', 'btc', 'usd'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => handleModeChange(mode)}
              className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                conversionMode === mode
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:bg-muted border-input'
              }`}
            >
              {mode === 'sats' ? 'Satoshis' : mode === 'btc' ? 'Bitcoin' : 'USD'}
            </button>
          ))}
        </div>

        <NumberInput
          id="input-value"
          label={conversionMode === 'sats' ? 'Satoshis' : conversionMode === 'btc' ? 'Bitcoin' : 'USD Amount'}
          value={inputValue}
          onChange={setInputValue}
          min={0}
          step={conversionMode === 'btc' ? 0.00000001 : conversionMode === 'usd' ? 1 : 1}
          unit={conversionMode === 'sats' ? 'sats' : conversionMode === 'btc' ? 'BTC' : 'USD'}
        />

        <NumberInput
          id="btc-price"
          label="Bitcoin Price"
          value={btcPriceUsd}
          onChange={setBtcPriceUsd}
          min={0}
          step={100}
          unit="USD"
        />

        <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
          💡 Bitcoin prices change constantly. Enter the current market price for accurate conversions.
        </p>
      </div>
    </CalculatorBase>
  );
}

export default SatoshiConverter;
