'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateEggConversion, type EggSize, type EggSizeConversionResult } from '@/lib/calculations/baking/egg-size-converter';

const SIZE_OPTIONS = [
    { value: 'jumbo', label: 'Jumbo (63g)' }, { value: 'extra-large', label: 'Extra Large (56g)' },
    { value: 'large', label: 'Large (50g)' }, { value: 'medium', label: 'Medium (44g)' }, { value: 'small', label: 'Small (38g)' },
];

export function EggSizeConverterCalculator() {
    const [count, setCount] = React.useState('3');
    const [recipeSize, setRecipeSize] = React.useState<string>('jumbo');
    const [availableSize, setAvailableSize] = React.useState<string>('large');
    const [result, setResult] = React.useState<EggSizeConversionResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateEggConversion({ recipeCount: parseInt(count), recipeSize: recipeSize as EggSize, availableSize: availableSize as EggSize });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Error'); setResult(null); }
    }, [count, recipeSize, availableSize]);

    const reset = () => { setCount('3'); setRecipeSize('jumbo'); setAvailableSize('large'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Egg Size Converter" description="Convert between egg sizes for baking"
            formula="Based on USDA average egg weights" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Eggs Needed" value={`${result.eggsRounded} eggs`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Recipe Weight" value={`${result.recipeWeightG}g`} />
                        <ResultDisplay label="Actual Weight" value={`${result.availableWeightG}g`} />
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-800">{result.explanation}</div>
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="count" label="Recipe calls for (count)" value={count} onChange={(v) => setCount(String(v))} min={1} max={24} step={1} />
                <div className="grid grid-cols-2 gap-4">
                    <SelectInput id="recipe-size" label="Recipe Egg Size" value={recipeSize} onChange={setRecipeSize} options={SIZE_OPTIONS} />
                    <SelectInput id="available-size" label="I Have" value={availableSize} onChange={setAvailableSize} options={SIZE_OPTIONS} />
                </div>
            </div>
        </CalculatorBase>
    );
}

export default EggSizeConverterCalculator;
