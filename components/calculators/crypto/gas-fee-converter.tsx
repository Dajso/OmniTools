'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { SelectInput } from '@/components/ui/select-input';
import { Card } from '@/components/ui/card';
import {
  calculateGasFee,
  calculateCommonTransactionCosts,
  COMMON_GAS_LIMITS,
  type GasFeeResult,
} from '@/lib/calculations/crypto';

const TRANSACTION_TYPE_OPTIONS = [
  { value: 'custom', label: 'Custom' },
  ...Object.keys(COMMON_GAS_LIMITS).map(type => ({
    value: type,
    label: type,
  })),
];

export function GasFeeConverter() {
  const [gasPriceGwei, setGasPriceGwei] = React.useState(30);
  const [gasLimit, setGasLimit] = React.useState(21000);
  const [ethPriceUsd, setEthPriceUsd] = React.useState(2500);
  const [transactionType, setTransactionType] = React.useState('ETH Transfer');
  const [result, setResult] = React.useState<GasFeeResult | null>(null);
  const [commonCosts, setCommonCosts] = React.useState<ReturnType<typeof calculateCommonTransactionCosts>>([]);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const gasFeeResult = calculateGasFee({
        gasPriceGwei,
        gasLimit,
        ethPriceUsd,
      });
      setResult(gasFeeResult);
      setCommonCosts(calculateCommonTransactionCosts(gasPriceGwei, ethPriceUsd));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [gasPriceGwei, gasLimit, ethPriceUsd]);

  const reset = () => {
    setGasPriceGwei(30);
    setGasLimit(21000);
    setEthPriceUsd(2500);
    setTransactionType('ETH Transfer');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  React.useEffect(() => {
    if (transactionType !== 'custom' && COMMON_GAS_LIMITS[transactionType]) {
      setGasLimit(COMMON_GAS_LIMITS[transactionType]);
    }
  }, [transactionType]);

  return (
    <CalculatorBase
      title="Gas Fee Converter"
      description="Calculate Ethereum gas fees and convert between Gwei and USD"
      formula="Gas Fee = Gas Price (Gwei) × Gas Limit"
      formulaExplanation="Gas fees are paid in ETH but calculated using Gwei (1 ETH = 10⁹ Gwei)"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay
            label="Transaction Cost (USD)"
            value={`$${result.costUsd.toFixed(4)}`}
            highlight
            copyable
          />
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Cost in ETH"
              value={result.costEth.toFixed(8)}
              copyable
            />
            <ResultDisplay
              label="Cost in Gwei"
              value={result.costGwei.toLocaleString()}
              copyable
            />
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Common Transaction Costs</p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {commonCosts.map((cost) => (
                <Card
                  key={cost.type}
                  className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    setTransactionType(cost.type);
                    setGasLimit(cost.gasLimit);
                  }}
                >
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium">{cost.type}</span>
                      <span className="text-muted-foreground ml-2 text-xs">
                        ({cost.gasLimit.toLocaleString()} gas)
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono">${cost.costUsd.toFixed(2)}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <NumberInput
          id="gas-price"
          label="Gas Price"
          value={gasPriceGwei}
          onChange={setGasPriceGwei}
          min={0}
          step={1}
          unit="Gwei"
        />

        <SelectInput
          id="transaction-type"
          label="Transaction Type"
          value={transactionType}
          onChange={setTransactionType}
          options={TRANSACTION_TYPE_OPTIONS}
        />

        <NumberInput
          id="gas-limit"
          label="Gas Limit"
          value={gasLimit}
          onChange={setGasLimit}
          min={21000}
          step={1000}
          unit="units"
        />

        <NumberInput
          id="eth-price"
          label="ETH Price"
          value={ethPriceUsd}
          onChange={setEthPriceUsd}
          min={0}
          step={10}
          unit="USD"
        />

        <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
          💡 Gas prices fluctuate based on network demand. Check current prices on{' '}
          <a href="https://etherscan.io/gastracker" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Etherscan Gas Tracker
          </a>
        </p>
      </div>
    </CalculatorBase>
  );
}

export default GasFeeConverter;
