'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { formatCurrency } from '@/lib/utils/formatting';
import { calculateBudgetAllocation, type BudgetAllocatorResult } from '@/lib/calculations/wedding/budget-allocator';

export function BudgetAllocatorCalculator() {
    const [budget, setBudget] = React.useState('200000');
    const [result, setResult] = React.useState<BudgetAllocatorResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateBudgetAllocation({ totalBudget: parseFloat(budget) })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Beregningsfeil'); setResult(null); }
    }, [budget]);
    const reset = () => { setBudget('200000'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Bryllupsbudsjett" description="Fordel budsjettet på de vanligste postene"
            formula="Veiledende prosentandeler av totalbudsjettet" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Totalbudsjett" value={formatCurrency(parseFloat(budget), { decimals: 0 })} />
                    <div className="space-y-2">
                        {result.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-sm border-b border-gray-100 py-2">
                                <span className="text-gray-700">{item.category}</span>
                                <div className="flex items-center gap-3">
                                    <div className="w-24 bg-gray-200 rounded-full h-2"><div className="bg-pink-500 h-2 rounded-full" style={{ width: `${item.percent}%` }} /></div>
                                    <span className="font-mono text-right w-28">{formatCurrency(item.amount, { decimals: 0 })}</span>
                                    <span className="text-gray-400 w-10 text-right">{item.percent}&nbsp;%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}>
            <NumberInput id="budget" label="Totalbudsjett for bryllupet (kr)" value={budget} onChange={v => setBudget(String(v))} min={1000} step={10000} />
        </CalculatorBase>
    );
}
export default BudgetAllocatorCalculator;
