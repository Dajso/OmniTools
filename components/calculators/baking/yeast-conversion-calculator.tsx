'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateYeastConversion, type YeastType, type YeastConversionResult } from '@/lib/calculations/baking/yeast-conversion';

const YEAST_OPTIONS = [
    { value: 'fresh', label: 'Fresh Yeast' }, { value: 'active-dry', label: 'Active Dry Yeast' }, { value: 'instant', label: 'Instant Yeast' },
];

export function YeastConversionCalculator() {
    const [amount, setAmount] = React.useState('42');
    const [fromType, setFromType] = React.useState<string>('fresh');
    const [toType, setToType] = React.useState<string>('instant');
    const [result, setResult] = React.useState<YeastConversionResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateYeastConversion({ amount: parseFloat(amount), fromType: fromType as YeastType, toType: toType as YeastType });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Error'); setResult(null); }
    }, [amount, fromType, toType]);

    const reset = () => { setAmount('42'); setFromType('fresh'); setToType('instant'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Yeast Conversion Calculator" description="Convert between yeast types"
            formula="Fresh × 0.4 = Active Dry × 0.83 = Instant" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label={`${result.toLabel}`} value={`${result.result}g`} copyable />
                    <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-800">
                        {amount}g {result.fromLabel} = {result.result}g {result.toLabel}
                    </div>
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="amount" label="Amount (g)" value={amount} onChange={(v) => setAmount(String(v))} min={0.1} step={1} />
                <div className="grid grid-cols-2 gap-4">
                    <SelectInput id="from-type" label="From" value={fromType} onChange={setFromType} options={YEAST_OPTIONS} />
                    <SelectInput id="to-type" label="To" value={toType} onChange={setToType} options={YEAST_OPTIONS} />
                </div>
            </div>
        </CalculatorBase>
    );
}

export default YeastConversionCalculator;
