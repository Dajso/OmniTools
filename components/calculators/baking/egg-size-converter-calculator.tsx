'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateEggConversion, type EggSize, type EggSizeConversionResult } from '@/lib/calculations/baking/egg-size-converter';

const SIZE_OPTIONS = [
    { value: 'extra-large', label: 'XL – ekstra stor (over 73 g, ca. 69 g spiselig)' },
    { value: 'large', label: 'L – stor (63–73 g, ca. 60 g spiselig)' },
    { value: 'medium', label: 'M – middels (53–63 g, ca. 51 g spiselig)' },
    { value: 'small', label: 'S – liten (under 53 g, ca. 42 g spiselig)' },
];

export function EggSizeConverterCalculator() {
    const [count, setCount] = React.useState('3');
    const [recipeSize, setRecipeSize] = React.useState<string>('medium');
    const [availableSize, setAvailableSize] = React.useState<string>('large');
    const [result, setResult] = React.useState<EggSizeConversionResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateEggConversion({ recipeCount: parseInt(count), recipeSize: recipeSize as EggSize, availableSize: availableSize as EggSize });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Feil'); setResult(null); }
    }, [count, recipeSize, availableSize]);

    const reset = () => { setCount('3'); setRecipeSize('medium'); setAvailableSize('large'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Eggstørrelse" description="Regn om mellom eggstørrelser (S, M, L, XL) i bakingen"
            formula="Basert på gjennomsnittsvekt for spiselig egg uten skall: S 42 g, M 51 g, L 60 g, XL 69 g" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Egg du trenger" value={`${result.eggsRounded} egg`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Vekt i oppskriften" value={`${result.recipeWeightG} g`} />
                        <ResultDisplay label="Faktisk vekt" value={`${result.availableWeightG} g`} />
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-800">{result.explanation}</div>
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="count" label="Oppskriften oppgir (antall)" value={count} onChange={(v) => setCount(String(v))} min={1} max={24} step={1} />
                <div className="grid grid-cols-2 gap-4">
                    <SelectInput id="recipe-size" label="Eggstørrelse i oppskriften" value={recipeSize} onChange={setRecipeSize} options={SIZE_OPTIONS} />
                    <SelectInput id="available-size" label="Jeg har" value={availableSize} onChange={setAvailableSize} options={SIZE_OPTIONS} />
                </div>
            </div>
        </CalculatorBase>
    );
}

export default EggSizeConverterCalculator;
