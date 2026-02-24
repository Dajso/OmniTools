'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateCapRate, type CapRateResult } from '@/lib/calculations/realestate/cap-rate';

export function CapRateCalculator() {
    const [price, setPrice] = React.useState('200000');
    const [rent, setRent] = React.useState('24000');
    const [expenses, setExpenses] = React.useState('8000');
    const [result, setResult] = React.useState<CapRateResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateCapRate({ purchasePrice: parseFloat(price), annualGrossRent: parseFloat(rent), annualExpenses: parseFloat(expenses) })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Error'); setResult(null); }
    }, [price, rent, expenses]);
    const reset = () => { setPrice('200000'); setRent('24000'); setExpenses('8000'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Cap Rate Calculator" description="Evaluate rental property returns"
            formula="Cap Rate = NOI / Purchase Price × 100" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Cap Rate" value={`${result.capRate}%`} copyable />
                    <ResultDisplay label="Net Operating Income" value={`$${result.noi.toLocaleString()}/yr`} />
                    <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">{result.rating}</div>
                </div>
            )}>
            <div className="space-y-4">
                <NumberInput id="price" label="Purchase Price ($)" value={price} onChange={v => setPrice(String(v))} min={1} step={10000} />
                <NumberInput id="rent" label="Annual Gross Rent ($)" value={rent} onChange={v => setRent(String(v))} min={0} step={1000} />
                <NumberInput id="expenses" label="Annual Expenses ($)" value={expenses} onChange={v => setExpenses(String(v))} min={0} step={500} />
            </div>
        </CalculatorBase>
    );
}
export default CapRateCalculator;
