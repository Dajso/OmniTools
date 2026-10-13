'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateBakersPercentage, type Ingredient, type BakersPercentageResult } from '@/lib/calculations/baking/bakers-percentage';

export function BakersPercentageCalculator() {
    const [ingredients, setIngredients] = React.useState<Ingredient[]>([
        { name: 'Hvetemel', weightG: 500, isFlour: true },
        { name: 'Vann', weightG: 350, isFlour: false },
        { name: 'Salt', weightG: 10, isFlour: false },
        { name: 'Gjær', weightG: 5, isFlour: false },
    ]);
    const [targetFlour, setTargetFlour] = React.useState('');
    const [result, setResult] = React.useState<BakersPercentageResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const addIng = () => setIngredients([...ingredients, { name: '', weightG: 0, isFlour: false }]);
    const removeIng = (i: number) => setIngredients(ingredients.filter((_, idx) => idx !== i));
    const updateIng = (i: number, field: keyof Ingredient, value: string | number | boolean) =>
        setIngredients(ingredients.map((ing, idx) => idx === i ? { ...ing, [field]: value } : ing));

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const tFlour = targetFlour ? parseFloat(targetFlour) : undefined;
            const res = calculateBakersPercentage(ingredients, tFlour);
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Feil'); setResult(null); }
    }, [ingredients, targetFlour]);

    const reset = () => {
        setIngredients([{ name: 'Hvetemel', weightG: 500, isFlour: true }, { name: 'Vann', weightG: 350, isFlour: false }, { name: 'Salt', weightG: 10, isFlour: false }]);
        setTargetFlour(''); setResult(null); setError(undefined);
    };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Bakerprosent" description="Regn oppskrifter om til bakerprosent"
            formula="% = vekt av ingrediens ÷ total melvekt × 100" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Total melvekt" value={`${result.totalFlour}g (100%)`} />
                    <div className="space-y-2">
                        {result.ingredients.map((i, idx) => (
                            <div key={idx} className="flex justify-between text-sm py-1 border-b border-gray-100">
                                <span>{i.name}{i.isFlour ? ' 🌾' : ''}</span>
                                <span className="font-mono font-medium">{i.percentage}%</span>
                            </div>
                        ))}
                    </div>
                    {result.scaledIngredients && (
                        <div className="mt-4">
                            <h4 className="font-medium text-sm mb-2">Skalert oppskrift</h4>
                            {result.scaledIngredients.map((i, idx) => (
                                <div key={idx} className="flex justify-between text-sm py-1 border-b border-gray-100">
                                    <span>{i.name}</span><span className="font-mono">{i.weightG}g</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        >
            <div className="space-y-4">
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Ingredienser</label>
                    {ingredients.map((ing, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <input type="text" value={ing.name} onChange={(e) => updateIng(i, 'name', e.target.value)}
                                placeholder="Navn" className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm" />
                            <input type="number" value={ing.weightG} onChange={(e) => updateIng(i, 'weightG', parseFloat(e.target.value) || 0)}
                                className="w-24 rounded-md border border-gray-300 px-3 py-2 text-sm" min={0} placeholder="gram" />
                            <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                                <input type="checkbox" checked={ing.isFlour} onChange={(e) => updateIng(i, 'isFlour', e.target.checked)} />Mel
                            </label>
                            {ingredients.length > 2 && (
                                <button onClick={() => removeIng(i)} className="text-red-500 hover:text-red-700 text-sm px-2">✕</button>
                            )}
                        </div>
                    ))}
                    <button onClick={addIng} className="text-sm text-blue-600 hover:text-blue-800">+ Legg til ingrediens</button>
                </div>
                <NumberInput id="target-flour" label="Skaler til melvekt (g, valgfritt)" value={targetFlour} onChange={(v) => setTargetFlour(String(v))} min={0} step={50} />
            </div>
        </CalculatorBase>
    );
}

export default BakersPercentageCalculator;
