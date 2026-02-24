'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateSourdoughHydration, type SourdoughHydrationResult } from '@/lib/calculations/baking/sourdough-hydration';

export function SourdoughHydrationCalculator() {
    const [flour, setFlour] = React.useState('500');
    const [water, setWater] = React.useState('325');
    const [starter, setStarter] = React.useState('100');
    const [starterHydration, setStarterHydration] = React.useState('100');
    const [additionalFlour, setAdditionalFlour] = React.useState('0');
    const [result, setResult] = React.useState<SourdoughHydrationResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateSourdoughHydration({
                flourG: parseFloat(flour), waterG: parseFloat(water), starterG: parseFloat(starter),
                starterHydration: parseFloat(starterHydration), additionalFlourG: parseFloat(additionalFlour),
            });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Error'); setResult(null); }
    }, [flour, water, starter, starterHydration, additionalFlour]);

    const reset = () => { setFlour('500'); setWater('325'); setStarter('100'); setStarterHydration('100'); setAdditionalFlour('0'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Sourdough Hydration Calculator" description="Calculate total dough hydration"
            formula="Hydration = Total Water / Total Flour × 100" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Hydration" value={`${result.hydrationPercent}%`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Total Flour" value={`${result.totalFlour}g`} />
                        <ResultDisplay label="Total Water" value={`${result.totalWater}g`} />
                        <ResultDisplay label="Starter → Flour" value={`${result.starterFlour}g`} />
                        <ResultDisplay label="Starter → Water" value={`${result.starterWater}g`} />
                    </div>
                    <ResultDisplay label="Total Dough" value={`${result.totalDoughWeight}g`} />
                </div>
            )}
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="flour" label="Flour (g)" value={flour} onChange={(v) => setFlour(String(v))} min={0} step={10} />
                    <NumberInput id="water" label="Water (g)" value={water} onChange={(v) => setWater(String(v))} min={0} step={10} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="starter" label="Starter (g)" value={starter} onChange={(v) => setStarter(String(v))} min={0} step={10} />
                    <NumberInput id="starter-hydration" label="Starter Hydration (%)" value={starterHydration} onChange={(v) => setStarterHydration(String(v))} min={50} max={200} step={5} />
                </div>
                <NumberInput id="additional-flour" label="Additional Flour (whole wheat, rye, etc.) (g)" value={additionalFlour} onChange={(v) => setAdditionalFlour(String(v))} min={0} step={10} />
            </div>
        </CalculatorBase>
    );
}

export default SourdoughHydrationCalculator;
