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
        { name: 'Chicken', cost: 8.50 }, { name: 'Rice', cost: 2.00 }, { name: 'Vegetables', cost: 3.50 },
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
        } catch (err) { setError(err instanceof Error ? err.message : 'Error'); setResult(null); }
    }, [ingredients, servings, margin]);

    const reset = () => { setServings('6'); setMargin('30'); setIngredients([{ name: 'Chicken', cost: 8.50 }]); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Unit Cost Per Serving" description="Calculate recipe cost per serving"
            formula="Cost per Serving = Total Cost / Servings" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Cost Per Serving" value={`$${result.costPerServing.toFixed(2)}`} copyable />
                    <ResultDisplay label="Total Cost" value={`$${result.totalCost.toFixed(2)}`} />
                    {result.suggestedPrice && (
                        <div className="grid grid-cols-2 gap-4">
                            <ResultDisplay label="Suggested Price" value={`$${result.suggestedPrice.toFixed(2)}`} />
                            <ResultDisplay label="Profit/Serving" value={`$${result.margin?.toFixed(2)}`} />
                        </div>
                    )}
                </div>
            )}
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="servings" label="Servings" value={servings} onChange={(v) => setServings(String(v))} min={1} step={1} />
                    <NumberInput id="margin" label="Target Margin (%)" value={margin} onChange={(v) => setMargin(String(v))} min={0} max={90} step={5} />
                </div>
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Ingredients</label>
                    {ingredients.map((ing, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <input type="text" value={ing.name} onChange={(e) => updateIng(i, 'name', e.target.value)}
                                placeholder="Ingredient" className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm" />
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-400 text-sm">$</span>
                                <input type="number" value={ing.cost} onChange={(e) => updateIng(i, 'cost', parseFloat(e.target.value) || 0)}
                                    className="w-24 rounded-md border border-gray-300 pl-6 pr-3 py-2 text-sm" min={0} step={0.5} />
                            </div>
                            {ingredients.length > 1 && (
                                <button onClick={() => removeIng(i)} className="text-red-500 hover:text-red-700 text-sm px-2">✕</button>
                            )}
                        </div>
                    ))}
                    <button onClick={addIng} className="text-sm text-blue-600 hover:text-blue-800">+ Add Ingredient</button>
                </div>
            </div>
        </CalculatorBase>
    );
}

export default UnitCostPerServingCalculator;
