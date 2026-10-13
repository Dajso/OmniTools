'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateUnitCost, type CostIngredient, type UnitCostResult } from '@/lib/calculations/baking/unit-cost-per-serving';

export function UnitCostPerServingCalculator() {
    const [servings, setServings] = React.useState('6');
    const [margin, setMargin] = React.useState('30');
    const [ingredients, setIngredients] = React.useState<CostIngredient[]>([
        { name: 'Kylling', cost: 8.50 }, { name: 'Ris', cost: 2.00 }, { name: 'Grønnsaker', cost: 3.50 },
    ]);
    const [result, setResult] = React.useState<UnitCostResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const addIng = () => setIngredients([...ingredients, { name: '', cost: 0 }]);
    const removeIng = (i: number) => setIngredients(ingredients.filter((_, idx) => idx !== i));
    const updateIng = (i: number, field: keyof CostIngredient, value: string | number) =>
        setIngredients(ingredients.map((ing, idx) => idx === i ? { ...ing, [field]: value } : ing));

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateUnitCost({ ingredients, servings: parseInt(servings), targetMarginPercent: parseFloat(margin) });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Feil'); setResult(null); }
    }, [ingredients, servings, margin]);

    const reset = () => { setServings('6'); setMargin('30'); setIngredients([{ name: 'Kylling', cost: 8.50 }]); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Kostnad per porsjon" description="Regn ut hva oppskriften koster per porsjon"
            formula="Kostnad per porsjon = total kostnad ÷ antall porsjoner" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Kostnad per porsjon" value={`${result.costPerServing.toFixed(2).replace('.', ',')} kr`} copyable />
                    <ResultDisplay label="Total kostnad" value={`${result.totalCost.toFixed(2).replace('.', ',')} kr`} />
                    {result.suggestedPrice && (
                        <div className="grid grid-cols-2 gap-4">
                            <ResultDisplay label="Foreslått pris" value={`${result.suggestedPrice.toFixed(2).replace('.', ',')} kr`} />
                            <ResultDisplay label="Fortjeneste per porsjon" value={`${result.margin?.toFixed(2).replace('.', ',')} kr`} />
                        </div>
                    )}
                </div>
            )}
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="servings" label="Antall porsjoner" value={servings} onChange={(v) => setServings(String(v))} min={1} step={1} />
                    <NumberInput id="margin" label="Ønsket margin (%)" value={margin} onChange={(v) => setMargin(String(v))} min={0} max={90} step={5} />
                </div>
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Ingredienser</label>
                    {ingredients.map((ing, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <input type="text" value={ing.name} onChange={(e) => updateIng(i, 'name', e.target.value)}
                                placeholder="Ingrediens" className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm" />
                            <div className="relative">
                                <span className="absolute right-3 top-2 text-gray-400 text-sm">kr</span>
                                <input type="number" value={ing.cost} onChange={(e) => updateIng(i, 'cost', parseFloat(e.target.value) || 0)}
                                    className="w-24 rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm" min={0} step={0.5} />
                            </div>
                            {ingredients.length > 1 && (
                                <button onClick={() => removeIng(i)} className="text-red-500 hover:text-red-700 text-sm px-2">✕</button>
                            )}
                        </div>
                    ))}
                    <button onClick={addIng} className="text-sm text-blue-600 hover:text-blue-800">+ Legg til ingrediens</button>
                </div>
            </div>
        </CalculatorBase>
    );
}

export default UnitCostPerServingCalculator;
