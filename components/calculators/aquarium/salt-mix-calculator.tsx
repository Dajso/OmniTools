'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateSaltMix, SALT_BRANDS, type SaltMixResult } from '@/lib/calculations/aquarium/salt-mix';

const BRAND_OPTIONS = Object.entries(SALT_BRANDS).map(([value, data]) => ({ value, label: data.name }));

export function SaltMixCalculator() {
    const [volume, setVolume] = React.useState('100');
    const [targetSG, setTargetSG] = React.useState('1.025');
    const [brand, setBrand] = React.useState('instant-ocean');
    const [customGrams, setCustomGrams] = React.useState('37');
    const [result, setResult] = React.useState<SaltMixResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateSaltMix({ volumeLiters: parseFloat(volume), targetSG: parseFloat(targetSG), brand, customGramsPerGallon: parseFloat(customGrams) });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Calculation error'); setResult(null); }
    }, [volume, targetSG, brand, customGrams]);

    const reset = () => { setVolume('100'); setTargetSG('1.025'); setBrand('instant-ocean'); setCustomGrams('37'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Salt Mix Calculator" description="Calculate salt mix for your marine aquarium"
            formula="Salt = (Volume in Gallons) × (Grams/Gallon) × Salinity Factor" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Salt Needed" value={`${result.saltGrams} g (${result.saltKg} kg)`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Ounces" value={`${result.saltOz} oz`} />
                        <ResultDisplay label="Cups (approx)" value={`${result.saltCups}`} />
                        <ResultDisplay label="Target Salinity" value={`${result.targetSalinityPPT} ppt`} />
                    </div>
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="volume" label="Water Volume (Liters)" value={volume} onChange={(v) => setVolume(String(v))} min={1} step={10} />
                <NumberInput id="target-sg" label="Target Specific Gravity" value={targetSG} onChange={(v) => setTargetSG(String(v))} min={1.0} max={1.04} step={0.001} />
                <SelectInput id="brand" label="Salt Brand" value={brand} onChange={setBrand} options={BRAND_OPTIONS} />
                {brand === 'custom' && (
                    <NumberInput id="custom-grams" label="Grams per Gallon" value={customGrams} onChange={(v) => setCustomGrams(String(v))} min={1} step={1} />
                )}
            </div>
        </CalculatorBase>
    );
}

export default SaltMixCalculator;
