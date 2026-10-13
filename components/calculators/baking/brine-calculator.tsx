'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateBrine, type BrineResult } from '@/lib/calculations/baking/brine';

export function BrineCalculator() {
    const [waterLiters, setWaterLiters] = React.useState('2');
    const [saltPercent, setSaltPercent] = React.useState('5');
    const [result, setResult] = React.useState<BrineResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateBrine({ waterLiters: parseFloat(waterLiters), saltPercent: parseFloat(saltPercent) });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Feil'); setResult(null); }
    }, [waterLiters, saltPercent]);

    const reset = () => { setWaterLiters('2'); setSaltPercent('5'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Saltlakekalkulator" description="Regn ut forholdet mellom salt og vann i en saltlake"
            formula="Salt = vann × (% ÷ (100 − %))" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Salt som trengs" value={`${result.saltG} g (${result.saltTbsp} ss)`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Vann" value={`${result.waterMl} ml`} />
                        <ResultDisplay label="Salt" value={`${result.saltG} g`} />
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">{result.concentration}</div>
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="water" label="Vann (liter)" value={waterLiters} onChange={(v) => setWaterLiters(String(v))} min={0.1} step={0.5} unit="l" />
                <NumberInput id="salt" label="Saltkonsentrasjon (%)" value={saltPercent} onChange={(v) => setSaltPercent(String(v))} min={1} max={26} step={0.5} />
            </div>
        </CalculatorBase>
    );
}

export default BrineCalculator;
