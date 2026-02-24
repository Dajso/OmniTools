'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateInverterSize, type InverterSizeResult } from '@/lib/calculations/solar/inverter-size';

interface AppEntry { name: string; watts: number; quantity: number; surgeMultiplier: number; }

export function InverterSizeCalculator() {
    const [margin, setMargin] = React.useState('25');
    const [appliances, setAppliances] = React.useState<AppEntry[]>([
        { name: 'Refrigerator', watts: 150, quantity: 1, surgeMultiplier: 3 },
        { name: 'LED Lights', watts: 10, quantity: 5, surgeMultiplier: 1 },
    ]);
    const [result, setResult] = React.useState<InverterSizeResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const addApp = () => setAppliances([...appliances, { name: '', watts: 100, quantity: 1, surgeMultiplier: 1 }]);
    const removeApp = (i: number) => setAppliances(appliances.filter((_, idx) => idx !== i));
    const updateApp = (i: number, field: keyof AppEntry, value: string | number) =>
        setAppliances(appliances.map((a, idx) => idx === i ? { ...a, [field]: value } : a));

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateInverterSize({ appliances, safetyMargin: parseFloat(margin) });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Calculation error'); setResult(null); }
    }, [appliances, margin]);

    const reset = () => { setMargin('25'); setAppliances([{ name: 'Refrigerator', watts: 150, quantity: 1, surgeMultiplier: 3 }]); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Inverter Size Calculator" description="Calculate the right inverter size"
            formula="Inverter ≥ Total Watts × (1 + Safety Margin)" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Recommended Inverter" value={`${result.recommendedInverterW}W / ${result.recommendedInverterVA} VA`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Continuous Load" value={`${result.continuousWatts}W`} />
                        <ResultDisplay label="Peak Surge" value={`${result.surgeWatts}W`} />
                    </div>
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="margin" label="Safety Margin (%)" value={margin} onChange={(v) => setMargin(String(v))} min={0} max={100} step={5} />
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Appliances</label>
                    {appliances.map((a, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <input type="text" value={a.name} onChange={(e) => updateApp(i, 'name', e.target.value)}
                                placeholder="Name" className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm" />
                            <input type="number" value={a.watts} onChange={(e) => updateApp(i, 'watts', parseFloat(e.target.value) || 0)}
                                className="w-20 rounded-md border border-gray-300 px-3 py-2 text-sm" min={1} placeholder="W" />
                            <input type="number" value={a.quantity} onChange={(e) => updateApp(i, 'quantity', parseInt(e.target.value) || 0)}
                                className="w-14 rounded-md border border-gray-300 px-3 py-2 text-sm" min={1} placeholder="#" />
                            <input type="number" value={a.surgeMultiplier} onChange={(e) => updateApp(i, 'surgeMultiplier', parseFloat(e.target.value) || 1)}
                                className="w-16 rounded-md border border-gray-300 px-3 py-2 text-sm" min={1} max={10} step={0.5} placeholder="×" title="Surge multiplier" />
                            {appliances.length > 1 && (
                                <button onClick={() => removeApp(i)} className="text-red-500 hover:text-red-700 text-sm px-2">✕</button>
                            )}
                        </div>
                    ))}
                    <button onClick={addApp} className="text-sm text-blue-600 hover:text-blue-800">+ Add Appliance</button>
                </div>
            </div>
        </CalculatorBase>
    );
}

export default InverterSizeCalculator;
