'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateFlowerStems, type ArrangementType, type FlowerStemResult, STEM_COUNTS } from '@/lib/calculations/wedding/flower-stems';

const TYPE_OPTIONS = Object.entries(STEM_COUNTS).map(([k, v]) => ({ value: k, label: v.label }));

export function FlowerStemCalculator() {
    const [items, setItems] = React.useState([
        { type: 'bridal-bouquet' as ArrangementType, quantity: 1 },
        { type: 'bridesmaid-bouquet' as ArrangementType, quantity: 4 },
        { type: 'boutonniere' as ArrangementType, quantity: 5 },
        { type: 'centerpiece-small' as ArrangementType, quantity: 10 },
    ]);
    const [result, setResult] = React.useState<FlowerStemResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const addItem = () => setItems([...items, { type: 'centerpiece-small' as ArrangementType, quantity: 1 }]);
    const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
    const updateItem = (i: number, field: string, value: string | number) =>
        setItems(items.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateFlowerStems({ items })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Error'); setResult(null); }
    }, [items]);
    const reset = () => { setItems([{ type: 'bridal-bouquet', quantity: 1 }]); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Flower Stem Counter" description="How many stems to buy"
            formula="Based on average stems per arrangement type" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Total Stems Needed" value={`${result.grandTotal} stems`} copyable />
                    <div className="space-y-2">
                        {result.breakdown.map((b, i) => (
                            <div key={i} className="flex justify-between text-sm border-b border-gray-100 py-1">
                                <span>{b.label} × {b.quantity}</span><span className="font-mono">{b.totalStems} stems</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}>
            <div className="space-y-3">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <SelectInput id={`type-${i}`} label="" value={item.type} onChange={v => updateItem(i, 'type', v)} options={TYPE_OPTIONS} />
                        <NumberInput id={`qty-${i}`} label="" value={String(item.quantity)} onChange={v => updateItem(i, 'quantity', Number(v))} min={1} max={50} step={1} />
                        {items.length > 1 && <button onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700 text-sm px-2">✕</button>}
                    </div>
                ))}
                <button onClick={addItem} className="text-sm text-blue-600 hover:text-blue-800">+ Add Arrangement</button>
            </div>
        </CalculatorBase>
    );
}
export default FlowerStemCalculator;
