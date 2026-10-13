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
        } catch (err) { setError(err instanceof Error ? err.message : 'Feil'); setResult(null); }
    }, [flour, water, starter, starterHydration, additionalFlour]);

    const reset = () => { setFlour('500'); setWater('325'); setStarter('100'); setStarterHydration('100'); setAdditionalFlour('0'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Hydrering i surdeig" description="Regn ut total hydrering i deigen"
            formula="Hydrering = total vannmengde ÷ total melmengde × 100" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Hydrering" value={`${result.hydrationPercent}%`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Total melvekt" value={`${result.totalFlour}g`} />
                        <ResultDisplay label="Total vannmengde" value={`${result.totalWater}g`} />
                        <ResultDisplay label="Surdeigsstarter → mel" value={`${result.starterFlour}g`} />
                        <ResultDisplay label="Surdeigsstarter → vann" value={`${result.starterWater}g`} />
                    </div>
                    <ResultDisplay label="Total deigvekt" value={`${result.totalDoughWeight}g`} />
                </div>
            )}
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="flour" label="Mel (g)" value={flour} onChange={(v) => setFlour(String(v))} min={0} step={10} />
                    <NumberInput id="water" label="Vann (g)" value={water} onChange={(v) => setWater(String(v))} min={0} step={10} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="starter" label="Surdeigsstarter (g)" value={starter} onChange={(v) => setStarter(String(v))} min={0} step={10} />
                    <NumberInput id="starter-hydration" label="Hydrering i starteren (%)" value={starterHydration} onChange={(v) => setStarterHydration(String(v))} min={50} max={200} step={5} />
                </div>
                <NumberInput id="additional-flour" label="Ekstra mel (grovt, rug osv.) (g)" value={additionalFlour} onChange={(v) => setAdditionalFlour(String(v))} min={0} step={10} />
            </div>
        </CalculatorBase>
    );
}

export default SourdoughHydrationCalculator;
