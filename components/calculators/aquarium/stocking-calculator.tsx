'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { formatFixed, formatNumber } from '@/lib/utils/formatting';
import { calculateStocking, type StockingResult } from '@/lib/calculations/aquarium/stocking';

interface FishEntry { name: string; sizeCm: number; quantity: number; }

export function StockingCalculator() {
    const [volume, setVolume] = React.useState('80');
    const [fish, setFish] = React.useState<FishEntry[]>([{ name: 'Neontetra', sizeCm: 3.5, quantity: 6 }]);
    const [result, setResult] = React.useState<StockingResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const addFish = () => setFish([...fish, { name: '', sizeCm: 5, quantity: 1 }]);
    const removeFish = (i: number) => setFish(fish.filter((_, idx) => idx !== i));
    const updateFish = (i: number, field: keyof FishEntry, value: string | number) =>
        setFish(fish.map((f, idx) => idx === i ? { ...f, [field]: value } : f));

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateStocking({ volumeLiters: parseFloat(volume), fish });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Beregningsfeil'); setResult(null); }
    }, [volume, fish]);

    const reset = () => { setVolume('80'); setFish([{ name: 'Neontetra', sizeCm: 3.5, quantity: 6 }]); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Fiskebesetning" description="Sjekk om det er plass til fiskene i akvariet"
            formula="Omtrent 0,67 cm fisk per liter vann (veiledende)" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Besetningsgrad" value={`${formatNumber(result.stockingPercent)} % — ${result.status}`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Samlet fiskelengde" value={`${formatFixed(result.totalCm, 1)} cm`} />
                        <ResultDisplay label="Maks kapasitet" value={`${formatFixed(result.maxCm, 1)} cm`} />
                    </div>
                    <ResultDisplay label="Anbefaling" value={result.recommendation} />
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="volume" label="Akvariumvolum (liter)" value={volume} onChange={(v) => setVolume(String(v))} min={1} step={5} />
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Fiskeliste</label>
                    {fish.map((f, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <input type="text" value={f.name} onChange={(e) => updateFish(i, 'name', e.target.value)}
                                placeholder="Fiskenavn" className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm" />
                            <input type="number" value={f.sizeCm} onChange={(e) => updateFish(i, 'sizeCm', parseFloat(e.target.value) || 0)}
                                className="w-20 rounded-md border border-gray-300 px-3 py-2 text-sm" min={0.5} step={0.5} placeholder="cm" />
                            <input type="number" value={f.quantity} onChange={(e) => updateFish(i, 'quantity', parseInt(e.target.value) || 0)}
                                className="w-16 rounded-md border border-gray-300 px-3 py-2 text-sm" min={1} step={1} placeholder="antall" />
                            {fish.length > 1 && (
                                <button onClick={() => removeFish(i)} className="text-red-500 hover:text-red-700 text-sm px-2">✕</button>
                            )}
                        </div>
                    ))}
                    <button onClick={addFish} className="text-sm text-blue-600 hover:text-blue-800">+ Legg til fisk</button>
                </div>
            </div>
        </CalculatorBase>
    );
}

export default StockingCalculator;
