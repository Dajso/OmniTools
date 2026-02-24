'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateWaterChange, type WaterChangeResult } from '@/lib/calculations/aquarium/water-change';

export function WaterChangeCalculator() {
    const [concentration, setConcentration] = React.useState('40');
    const [changePercent, setChangePercent] = React.useState('20');
    const [numChanges, setNumChanges] = React.useState('1');
    const [target, setTarget] = React.useState('20');
    const [result, setResult] = React.useState<WaterChangeResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateWaterChange({
                currentConcentration: parseFloat(concentration), changePercent: parseFloat(changePercent),
                numberOfChanges: parseInt(numChanges), targetConcentration: parseFloat(target),
            });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Calculation error'); setResult(null); }
    }, [concentration, changePercent, numChanges, target]);

    const reset = () => { setConcentration('40'); setChangePercent('20'); setNumChanges('1'); setTarget('20'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Water Change Calculator" description="Calculate how water changes reduce concentrations"
            formula="C_new = C_old × (1 - change%)" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Final Concentration" value={`${result.finalConcentration} ppm`} copyable />
                    <ResultDisplay label="Total Reduction" value={`${result.reductionPercent}%`} />
                    {result.changesToTarget !== undefined && (
                        <ResultDisplay label="Changes to Reach Target" value={`${result.changesToTarget} water changes`} />
                    )}
                    {result.concentrationHistory.length > 2 && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-sm font-medium text-gray-700 mb-2">Concentration After Each Change</div>
                            <div className="flex flex-wrap gap-2">
                                {result.concentrationHistory.map((c, i) => (
                                    <span key={i} className="text-xs bg-white border rounded px-2 py-1">
                                        {i === 0 ? 'Start' : `#${i}`}: {c} ppm
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="concentration" label="Current Concentration (ppm)" value={concentration} onChange={(v) => setConcentration(String(v))} min={0} step={5} />
                <NumberInput id="change-percent" label="Water Change (%)" value={changePercent} onChange={(v) => setChangePercent(String(v))} min={1} max={100} step={5} />
                <NumberInput id="num-changes" label="Number of Water Changes" value={numChanges} onChange={(v) => setNumChanges(String(v))} min={1} max={20} step={1} />
                <NumberInput id="target" label="Target Concentration (ppm)" value={target} onChange={(v) => setTarget(String(v))} min={0} step={5} />
            </div>
        </CalculatorBase>
    );
}

export default WaterChangeCalculator;
