'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateTurkeyThawing, type ThawMethod, type TurkeyThawingResult } from '@/lib/calculations/baking/turkey-thawing';

const METHOD_OPTIONS = [
    { value: 'refrigerator', label: 'Refrigerator (recommended)' },
    { value: 'cold-water', label: 'Cold Water (faster)' },
];

export function TurkeyThawingCalculator() {
    const [weight, setWeight] = React.useState('15');
    const [method, setMethod] = React.useState<string>('refrigerator');
    const [result, setResult] = React.useState<TurkeyThawingResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateTurkeyThawing({ weightLbs: parseFloat(weight), method: method as ThawMethod });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Error'); setResult(null); }
    }, [weight, method]);

    const reset = () => { setWeight('15'); setMethod('refrigerator'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Turkey Thawing Time Calculator" description="How long to thaw your turkey"
            formula="Fridge: 24h per 5 lbs | Cold Water: 30 min per lb" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Thawing Time" value={result.formatted} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Hours" value={`${result.hours}`} />
                        <ResultDisplay label="Days" value={`${result.days}`} />
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-800">{result.tips}</div>
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="weight" label="Turkey Weight (lbs)" value={weight} onChange={(v) => setWeight(String(v))} min={1} max={30} step={1} />
                <SelectInput id="method" label="Thawing Method" value={method} onChange={setMethod} options={METHOD_OPTIONS} />
            </div>
        </CalculatorBase>
    );
}

export default TurkeyThawingCalculator;
