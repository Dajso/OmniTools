'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { Button } from '@/components/ui/button';
import { 
  convertCurrency,
  SUPPORTED_CURRENCIES,
  formatCurrency,
  type ConversionResult 
} from '@/lib/calculations/travel/currency-converter';
import { ArrowRightLeft, Wifi, WifiOff, RefreshCw } from 'lucide-react';

export function CurrencyConverter() {
  const [amount, setAmount] = React.useState<number>(100);
  const [fromCurrency, setFromCurrency] = React.useState<string>('USD');
  const [toCurrency, setToCurrency] = React.useState<string>('EUR');
  const [results, setResults] = React.useState<ConversionResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      
      if (amount <= 0) {
        setResults(null);
        return;
      }

      const result = convertCurrency(amount, fromCurrency, toCurrency);
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion error');
      setResults(null);
    }
  }, [amount, fromCurrency, toCurrency]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const reset = () => {
    setAmount(100);
    setFromCurrency('USD');
    setToCurrency('EUR');
    setResults(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const getCurrencySymbol = (code: string): string => {
    const currency = SUPPORTED_CURRENCIES.find(c => c.code === code);
    return currency?.symbol || code;
  };

  // Quick amount buttons
  const quickAmounts = [10, 50, 100, 500, 1000];

  return (
    <CalculatorBase
      title="Currency Converter"
      description="Convert between world currencies with offline support"
      onReset={reset}
      error={error}
      results={results && (
        <div className="space-y-4">
          {/* Offline indicator */}
          <div className={`flex items-center gap-2 text-sm ${
            results.isOffline ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {results.isOffline ? (
              <>
                <WifiOff className="h-4 w-4" />
                <span>Using cached rates (may be outdated)</span>
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4" />
                <span>Using latest rates</span>
              </>
            )}
            <span className="text-muted-foreground ml-auto">
              Rate date: {results.rateDate}
            </span>
          </div>

          {/* Main Result */}
          <div className="p-6 bg-primary/5 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-2">
              {formatCurrency(results.fromAmount, results.fromCurrency)} =
            </p>
            <p className="text-4xl font-bold text-primary">
              {formatCurrency(results.toAmount, results.toCurrency)}
            </p>
          </div>

          {/* Exchange Rates */}
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label={`1 ${results.fromCurrency} =`}
              value={results.rate.toFixed(4)}
              unit={results.toCurrency}
              copyable 
            />
            <ResultDisplay 
              label={`1 ${results.toCurrency} =`}
              value={results.inverseRate.toFixed(4)}
              unit={results.fromCurrency}
              copyable 
            />
          </div>

          {/* Quick Reference Table */}
          <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground mb-2">Quick Reference</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[1, 5, 10, 50, 100, 500].map(val => (
                <div key={val} className="flex justify-between p-2 bg-muted rounded">
                  <span>{getCurrencySymbol(fromCurrency)}{val}</span>
                  <span className="font-medium">
                    {getCurrencySymbol(toCurrency)}{(val * results.rate).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="amount">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {getCurrencySymbol(fromCurrency)}
            </span>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
              className="w-full pl-10 pr-3 py-2 border rounded-md bg-background text-lg"
            />
          </div>
          {/* Quick amount buttons */}
          <div className="flex flex-wrap gap-2">
            {quickAmounts.map(val => (
              <Button
                key={val}
                type="button"
                variant={amount === val ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAmount(val)}
              >
                {val}
              </Button>
            ))}
          </div>
        </div>

        {/* Currency Selection */}
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium" htmlFor="from-currency">
              From
            </label>
            <select
              id="from-currency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
            >
              {SUPPORTED_CURRENCIES.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={swapCurrencies}
            className="mb-0.5"
            aria-label="Swap currencies"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium" htmlFor="to-currency">
              To
            </label>
            <select
              id="to-currency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
            >
              {SUPPORTED_CURRENCIES.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Popular Currency Pairs */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Popular Pairs</p>
          <div className="flex flex-wrap gap-2">
            {[
              { from: 'USD', to: 'EUR' },
              { from: 'USD', to: 'GBP' },
              { from: 'EUR', to: 'GBP' },
              { from: 'USD', to: 'JPY' },
              { from: 'USD', to: 'CAD' },
              { from: 'EUR', to: 'CHF' },
            ].map(pair => (
              <Button
                key={`${pair.from}-${pair.to}`}
                type="button"
                variant={fromCurrency === pair.from && toCurrency === pair.to ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setFromCurrency(pair.from);
                  setToCurrency(pair.to);
                }}
              >
                {pair.from}/{pair.to}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default CurrencyConverter;
