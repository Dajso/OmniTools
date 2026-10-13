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
  const [amount, setAmount] = React.useState<number>(1000);
  const [fromCurrency, setFromCurrency] = React.useState<string>('NOK');
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
      setError(err instanceof Error ? err.message : 'Omregningsfeil');
      setResults(null);
    }
  }, [amount, fromCurrency, toCurrency]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const reset = () => {
    setAmount(1000);
    setFromCurrency('NOK');
    setToCurrency('EUR');
    setResults(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const getCurrencySymbol = (code: string): string => {
    const currency = SUPPORTED_CURRENCIES.find(c => c.code === code);
    return currency ? (code === 'NOK' ? 'kr' : currency.code) : code;
  };

  // Quick amount buttons
  const quickAmounts = [100, 500, 1000, 5000, 10000];

  return (
    <CalculatorBase
      title="Valutakalkulator"
      description="Regn om mellom norske kroner og andre valutaer. Fungerer også uten nett."
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
                <span>Bruker lagrede kurser (kan være utdatert)</span>
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4" />
                <span>Bruker nyeste kurser</span>
              </>
            )}
            <span className="text-muted-foreground ml-auto">
              Kursdato: {results.rateDate}
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
              value={results.rate.toLocaleString('nb-NO', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
              unit={results.toCurrency}
              copyable 
            />
            <ResultDisplay 
              label={`1 ${results.toCurrency} =`}
              value={results.inverseRate.toLocaleString('nb-NO', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
              unit={results.fromCurrency}
              copyable 
            />
          </div>

          {/* Hurtigoppslag Table */}
          <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground mb-2">Hurtigoppslag</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[10, 50, 100, 500, 1000, 5000].map(val => (
                <div key={val} className="flex justify-between p-2 bg-muted rounded">
                  <span>{val} {getCurrencySymbol(fromCurrency)}</span>
                  <span className="font-medium">
                    {(val * results.rate).toLocaleString('nb-NO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {getCurrencySymbol(toCurrency)}
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
            Beløp
          </label>
          <div className="relative">
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {getCurrencySymbol(fromCurrency)}
            </span>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
              className="w-full pl-3 pr-14 py-2 border rounded-md bg-background text-lg"
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
              Fra
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
            aria-label="Bytt valuta"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium" htmlFor="to-currency">
              Til
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
          <p className="text-sm font-medium text-muted-foreground">Vanlige valutapar</p>
          <div className="flex flex-wrap gap-2">
            {[
              { from: 'NOK', to: 'EUR' },
              { from: 'NOK', to: 'USD' },
              { from: 'NOK', to: 'SEK' },
              { from: 'NOK', to: 'DKK' },
              { from: 'NOK', to: 'GBP' },
              { from: 'EUR', to: 'NOK' },
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
