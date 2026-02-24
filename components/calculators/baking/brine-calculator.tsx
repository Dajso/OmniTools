'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateBrine, type BrineResult } from '@/lib/calculations/baking/brine';

export function BrineCalculator() {
    const [waterCups, setWaterCups] = React.useState('8');
    const [saltPercent, setSaltPercent] = React.useState('5');
    const [result, setResult] = React.useState<BrineResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateBrine({ waterCups: parseFloat(waterCups), saltPercent: parseFloat(saltPercent) });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Error'); setResult(null); }
    }, [waterCups, saltPercent]);

    const reset = () => { setWaterCups('8'); setSaltPercent('5'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Brine Calculator" description="Calculate salt-to-water ratio for brining"
            formula="Salt = Water × (% / (100 - %))" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Salt Needed" value={`${result.saltG}g (${result.saltTbsp} Tbsp)`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Water" value={`${result.waterMl} mL (${result.waterOz} oz)`} />
                        <ResultDisplay label="Salt" value={`${result.saltOz} oz`} />
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">{result.concentration}</div>
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="water" label="Water (cups)" value={waterCups} onChange={(v) => setWaterCups(String(v))} min={1} step={1} />
                <NumberInput id="salt" label="Salt Concentration (%)" value={saltPercent} onChange={(v) => setSaltPercent(String(v))} min={1} max={26} step={0.5} />
            </div>
        </CalculatorBase>
    );
}

export default BrineCalculator;
