'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { formatFixed } from '@/lib/utils/formatting';
import { calculateSaltMix, SALT_BRANDS, type SaltMixResult } from '@/lib/calculations/aquarium/salt-mix';

const BRAND_OPTIONS = Object.entries(SALT_BRANDS).map(([value, data]) => ({ value, label: data.name }));

export function SaltMixCalculator() {
    const [volume, setVolume] = React.useState('100');
    const [targetSG, setTargetSG] = React.useState('1.025');
    const [brand, setBrand] = React.useState('instant-ocean');
    const [customGrams, setCustomGrams] = React.useState('9.8');
    const [result, setResult] = React.useState<SaltMixResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateSaltMix({ volumeLiters: parseFloat(volume), targetSG: parseFloat(targetSG), brand, customGramsPerLiter: parseFloat(customGrams) });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Beregningsfeil'); setResult(null); }
    }, [volume, targetSG, brand, customGrams]);

    const reset = () => { setVolume('100'); setTargetSG('1.025'); setBrand('instant-ocean'); setCustomGrams('9.8'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Saltblanding" description="Regn ut saltblandingen til saltvannsakvariet"
            formula="Salt = volum (liter) × gram per liter × saltholdighetsfaktor" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Salt som trengs" value={`${formatFixed(result.saltGrams, 0)} g (${formatFixed(result.saltKg, 2)} kg)`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Salt per liter" value={`${formatFixed(result.gramsPerLiter, 1)} g`} />
                        <ResultDisplay label="Ønsket saltholdighet" value={`${formatFixed(result.targetSalinityPPT, 1)} ‰`} />
                    </div>
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="volume" label="Vannvolum (liter)" value={volume} onChange={(v) => setVolume(String(v))} min={1} step={10} />
                <NumberInput id="target-sg" label="Ønsket egenvekt" value={targetSG} onChange={(v) => setTargetSG(String(v))} min={1.0} max={1.04} step={0.001} />
                <SelectInput id="brand" label="Salttype" value={brand} onChange={setBrand} options={BRAND_OPTIONS} />
                {brand === 'custom' && (
                    <NumberInput id="custom-grams" label="Gram per liter" value={customGrams} onChange={(v) => setCustomGrams(String(v))} min={1} step={1} />
                )}
            </div>
        </CalculatorBase>
    );
}

export default SaltMixCalculator;
