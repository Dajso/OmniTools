'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateAlcoholDilution, type AlcoholDilutionResult } from '@/lib/calculations/baking/alcohol-dilution';

export function AlcoholDilutionCalculator() {
    const [volume, setVolume] = React.useState('750');
    const [currentABV, setCurrentABV] = React.useState('75');
    const [targetABV, setTargetABV] = React.useState('40');
    const [result, setResult] = React.useState<AlcoholDilutionResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateAlcoholDilution({ volumeMl: parseFloat(volume), currentABV: parseFloat(currentABV), targetABV: parseFloat(targetABV) });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Error'); setResult(null); }
    }, [volume, currentABV, targetABV]);

    const reset = () => { setVolume('750'); setCurrentABV('75'); setTargetABV('40'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Alcohol Dilution Calculator" description="Dilute spirits to your target ABV"
            formula="Water = (V × ABV₁ / ABV₂) − V" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Water to Add" value={`${result.waterToAddMl} mL (${result.waterToAddOz} fl oz)`} copyable />
                    <ResultDisplay label="Final Volume" value={`${result.finalVolumeMl} mL (${result.finalVolumeOz} fl oz)`} />
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="volume" label="Current Volume (mL)" value={volume} onChange={(v) => setVolume(String(v))} min={1} step={50} />
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="current-abv" label="Current ABV (%)" value={currentABV} onChange={(v) => setCurrentABV(String(v))} min={1} max={100} step={1} />
                    <NumberInput id="target-abv" label="Target ABV (%)" value={targetABV} onChange={(v) => setTargetABV(String(v))} min={1} max={99} step={1} />
                </div>
            </div>
        </CalculatorBase>
    );
}

export default AlcoholDilutionCalculator;
