'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateOffGridRuntime, type OffGridRuntimeResult } from '@/lib/calculations/solar/off-grid-runtime';

interface AppEntry { name: string; watts: number; quantity: number; }

export function OffGridRuntimeCalculator() {
    const [batteryAh, setBatteryAh] = React.useState('200');
    const [voltage, setVoltage] = React.useState('12');
    const [dod, setDod] = React.useState('80');
    const [efficiency, setEfficiency] = React.useState('90');
    const [appliances, setAppliances] = React.useState<AppEntry[]>([{ name: 'LED-lys', watts: 10, quantity: 3 }]);
    const [result, setResult] = React.useState<OffGridRuntimeResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const addApp = () => setAppliances([...appliances, { name: '', watts: 50, quantity: 1 }]);
    const removeApp = (i: number) => setAppliances(appliances.filter((_, idx) => idx !== i));
    const updateApp = (i: number, field: keyof AppEntry, value: string | number) =>
        setAppliances(appliances.map((a, idx) => idx === i ? { ...a, [field]: value } : a));

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateOffGridRuntime({
                batteryAh: parseFloat(batteryAh), batteryVoltage: parseFloat(voltage),
                dodPercent: parseFloat(dod), inverterEfficiency: parseFloat(efficiency), appliances,
            });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Beregningsfeil'); setResult(null); }
    }, [batteryAh, voltage, dod, efficiency, appliances]);

    const reset = () => { setBatteryAh('200'); setVoltage('12'); setDod('80'); setEfficiency('90'); setAppliances([{ name: 'LED-lys', watts: 10, quantity: 3 }]); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Driftstid på batteri" description="Regn ut hvor lenge reservestrøm klarer å drive utstyr ved strømbrudd eller på hytta"
            formula="Driftstid = brukbar energi (Wh) ÷ samlet effekt (W)"
            formulaExplanation="Brukbar energi = batterikapasitet (Ah) × spenning (V) × utladningsdybde × virkningsgrad for vekselretter. Kulde reduserer kapasiteten, så regn med mindre ved minusgrader." onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Driftstid" value={result.runtimeFormatted} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Samlet effekt" value={`${result.totalWatts} W`} />
                        <ResultDisplay label="Brukbar energi" value={`${result.usableWh} Wh`} />
                    </div>
                </div>
            )}
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="battery-ah" label="Batterikapasitet" value={batteryAh} onChange={(v) => setBatteryAh(String(v))} min={1} step={50} unit="Ah" />
                    <NumberInput id="voltage" label="Spenning" value={voltage} onChange={(v) => setVoltage(String(v))} min={6} step={6} unit="V" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="dod" label="Utladningsdybde" value={dod} onChange={(v) => setDod(String(v))} min={10} max={100} step={5} unit="%" />
                    <NumberInput id="efficiency" label="Virkningsgrad vekselretter" value={efficiency} onChange={(v) => setEfficiency(String(v))} min={50} max={100} step={5} unit="%" />
                </div>
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Utstyr (navn, watt, antall)</label>
                    {appliances.map((a, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <input type="text" value={a.name} onChange={(e) => updateApp(i, 'name', e.target.value)}
                                placeholder="Navn" className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm" />
                            <input type="number" value={a.watts} onChange={(e) => updateApp(i, 'watts', parseFloat(e.target.value) || 0)}
                                className="w-20 rounded-md border border-gray-300 px-3 py-2 text-sm" min={1} placeholder="W" />
                            <input type="number" value={a.quantity} onChange={(e) => updateApp(i, 'quantity', parseInt(e.target.value) || 0)}
                                className="w-16 rounded-md border border-gray-300 px-3 py-2 text-sm" min={1} placeholder="stk" />
                            {appliances.length > 1 && (
                                <button onClick={() => removeApp(i)} className="text-red-500 hover:text-red-700 text-sm px-2">✕</button>
                            )}
                        </div>
                    ))}
                    <button onClick={addApp} className="text-sm text-blue-600 hover:text-blue-800">+ Legg til utstyr</button>
                </div>
            </div>
        </CalculatorBase>
    );
}

export default OffGridRuntimeCalculator;
