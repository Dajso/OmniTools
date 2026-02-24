'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateSunPeakHours, type SunPeakHoursResult } from '@/lib/calculations/solar/sun-peak-hours';

export function SunPeakHoursCalculator() {
    const [latitude, setLatitude] = React.useState('35');
    const [panelWatts, setPanelWatts] = React.useState('400');
    const [result, setResult] = React.useState<SunPeakHoursResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateSunPeakHours({ latitude: parseFloat(latitude), panelWatts: parseFloat(panelWatts) });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Calculation error'); setResult(null); }
    }, [latitude, panelWatts]);

    const reset = () => { setLatitude('35'); setPanelWatts('400'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Sun Peak Hours Calculator" description="Estimate peak sun hours for your location"
            formula="Based on latitude zone lookup" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Zone" value={result.zone} />
                    <div className="grid grid-cols-3 gap-4">
                        <ResultDisplay label="Annual Avg" value={`${result.annualAvgHours} hrs`} copyable />
                        <ResultDisplay label="Summer" value={`${result.summerHours} hrs`} />
                        <ResultDisplay label="Winter" value={`${result.winterHours} hrs`} />
                    </div>
                    {result.dailyEnergyWh !== undefined && (
                        <div className="grid grid-cols-2 gap-4">
                            <ResultDisplay label="Daily Energy" value={`${result.dailyEnergyWh} Wh`} />
                            <ResultDisplay label="Monthly Energy" value={`${result.monthlyEnergyKWh} kWh`} />
                        </div>
                    )}
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="latitude" label="Latitude (°)" value={latitude} onChange={(v) => setLatitude(String(v))} min={-90} max={90} step={1} />
                <NumberInput id="panel-watts" label="Panel Wattage (optional, for energy estimate)" value={panelWatts} onChange={(v) => setPanelWatts(String(v))} min={0} step={50} />
            </div>
        </CalculatorBase>
    );
}

export default SunPeakHoursCalculator;
