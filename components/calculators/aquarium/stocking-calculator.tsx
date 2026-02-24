'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateStocking, type StockingResult } from '@/lib/calculations/aquarium/stocking';

interface FishEntry { name: string; sizeInches: number; quantity: number; }

export function StockingCalculator() {
    const [volume, setVolume] = React.useState('20');
    const [fish, setFish] = React.useState<FishEntry[]>([{ name: 'Neon Tetra', sizeInches: 1.5, quantity: 6 }]);
    const [result, setResult] = React.useState<StockingResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const addFish = () => setFish([...fish, { name: '', sizeInches: 2, quantity: 1 }]);
    const removeFish = (i: number) => setFish(fish.filter((_, idx) => idx !== i));
    const updateFish = (i: number, field: keyof FishEntry, value: string | number) =>
        setFish(fish.map((f, idx) => idx === i ? { ...f, [field]: value } : f));

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateStocking({ volumeGallons: parseFloat(volume), fish });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Calculation error'); setResult(null); }
    }, [volume, fish]);

    const reset = () => { setVolume('20'); setFish([{ name: 'Neon Tetra', sizeInches: 1.5, quantity: 6 }]); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Stocking Calculator" description="Check if your aquarium stocking level is safe"
            formula="1 inch of fish per gallon of water (guideline)" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Stocking Level" value={`${result.stockingPercent}% — ${result.status}`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Total Fish Inches" value={`${result.totalInches}"`} />
                        <ResultDisplay label="Max Capacity" value={`${result.maxInches}"`} />
                    </div>
                    <ResultDisplay label="Recommendation" value={result.recommendation} />
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="volume" label="Tank Volume (US Gallons)" value={volume} onChange={(v) => setVolume(String(v))} min={1} step={5} />
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Fish List</label>
                    {fish.map((f, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <input type="text" value={f.name} onChange={(e) => updateFish(i, 'name', e.target.value)}
                                placeholder="Fish name" className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm" />
                            <input type="number" value={f.sizeInches} onChange={(e) => updateFish(i, 'sizeInches', parseFloat(e.target.value) || 0)}
                                className="w-20 rounded-md border border-gray-300 px-3 py-2 text-sm" min={0.5} step={0.5} placeholder="in" />
                            <input type="number" value={f.quantity} onChange={(e) => updateFish(i, 'quantity', parseInt(e.target.value) || 0)}
                                className="w-16 rounded-md border border-gray-300 px-3 py-2 text-sm" min={1} step={1} placeholder="qty" />
                            {fish.length > 1 && (
                                <button onClick={() => removeFish(i)} className="text-red-500 hover:text-red-700 text-sm px-2">✕</button>
                            )}
                        </div>
                    ))}
                    <button onClick={addFish} className="text-sm text-blue-600 hover:text-blue-800">+ Add Fish</button>
                </div>
            </div>
        </CalculatorBase>
    );
}

export default StockingCalculator;
