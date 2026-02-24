'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateCO2Bubble, type CO2BubbleResult } from '@/lib/calculations/aquarium/co2-bubble';

export function CO2BubbleCalculator() {
    const [kh, setKh] = React.useState('4');
    const [ph, setPh] = React.useState('6.8');
    const [volume, setVolume] = React.useState('100');
    const [result, setResult] = React.useState<CO2BubbleResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateCO2Bubble({ kh: parseFloat(kh), ph: parseFloat(ph), volumeLiters: parseFloat(volume) });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Calculation error'); setResult(null); }
    }, [kh, ph, volume]);

    const reset = () => { setKh('4'); setPh('6.8'); setVolume('100'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="CO2 Bubble Count Calculator" description="Calculate CO2 from KH and pH values"
            formula="CO2 (mg/L) = 3.0 × KH × 10^(7.0 - pH)" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="CO2 Concentration" value={`${result.co2ppm} ppm`} copyable />
                    <ResultDisplay label="Status" value={result.status} />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Suggested Bubble Rate" value={`${result.bubblesPerSecond} bubbles/sec`} />
                        <ResultDisplay label="Target CO2" value={`${result.targetCo2} ppm`} />
                    </div>
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="kh" label="KH (dKH)" value={kh} onChange={(v) => setKh(String(v))} min={0.5} step={0.5} />
                <NumberInput id="ph" label="pH" value={ph} onChange={(v) => setPh(String(v))} min={4} max={9} step={0.1} />
                <NumberInput id="volume" label="Tank Volume (Liters)" value={volume} onChange={(v) => setVolume(String(v))} min={1} step={10} />
            </div>
        </CalculatorBase>
    );
}

export default CO2BubbleCalculator;
