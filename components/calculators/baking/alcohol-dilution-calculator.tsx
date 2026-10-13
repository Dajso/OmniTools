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
        } catch (err) { setError(err instanceof Error ? err.message : 'Feil'); setResult(null); }
    }, [volume, currentABV, targetABV]);

    const reset = () => { setVolume('750'); setCurrentABV('75'); setTargetABV('40'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Alkoholfortynning" description="Fortynn sprit til ønsket alkoholstyrke"
            formula="Vann = (V × styrke₁ ÷ styrke₂) − V" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Vann som skal tilsettes" value={`${result.waterToAddMl.toLocaleString('nb-NO')} ml`} copyable />
                    <ResultDisplay label="Total mengde etterpå" value={`${result.finalVolumeMl.toLocaleString('nb-NO')} ml`} />
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="volume" label="Nåværende mengde (ml)" value={volume} onChange={(v) => setVolume(String(v))} min={1} step={50} />
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="current-abv" label="Nåværende alkoholstyrke (%)" value={currentABV} onChange={(v) => setCurrentABV(String(v))} min={1} max={100} step={1} />
                    <NumberInput id="target-abv" label="Ønsket alkoholstyrke (%)" value={targetABV} onChange={(v) => setTargetABV(String(v))} min={1} max={99} step={1} />
                </div>
            </div>
        </CalculatorBase>
    );
}

export default AlcoholDilutionCalculator;
