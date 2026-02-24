'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateGRM, type GRMResult } from '@/lib/calculations/realestate/grm';

export function GRMCalculator() {
    const [price, setPrice] = React.useState('200000');
    const [rent, setRent] = React.useState('24000');
    const [result, setResult] = React.useState<GRMResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateGRM({ propertyPrice: parseFloat(price), annualGrossRent: parseFloat(rent) })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Error'); setResult(null); }
    }, [price, rent]);
    const reset = () => { setPrice('200000'); setRent('24000'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Gross Rent Multiplier (GRM)" description="Quick property valuation metric"
            formula="GRM = Property Price / Annual Gross Rent" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="GRM" value={`${result.grm}`} copyable />
                    <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">{result.rating}</div>
                </div>
            )}>
            <div className="space-y-4">
                <NumberInput id="price" label="Property Price ($)" value={price} onChange={v => setPrice(String(v))} min={1} step={10000} />
                <NumberInput id="rent" label="Annual Gross Rent ($)" value={rent} onChange={v => setRent(String(v))} min={1} step={1000} />
            </div>
        </CalculatorBase>
    );
}
export default GRMCalculator;
