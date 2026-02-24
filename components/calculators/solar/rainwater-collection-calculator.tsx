'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateRainwaterCollection, type RainwaterCollectionResult } from '@/lib/calculations/solar/rainwater-collection';

export function RainwaterCollectionCalculator() {
    const [roofArea, setRoofArea] = React.useState('1500');
    const [rainfall, setRainfall] = React.useState('40');
    const [efficiency, setEfficiency] = React.useState('80');
    const [result, setResult] = React.useState<RainwaterCollectionResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateRainwaterCollection({ roofAreaSqFt: parseFloat(roofArea), annualRainfallInches: parseFloat(rainfall), efficiencyPercent: parseFloat(efficiency) });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Calculation error'); setResult(null); }
    }, [roofArea, rainfall, efficiency]);

    const reset = () => { setRoofArea('1500'); setRainfall('40'); setEfficiency('80'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Rainwater Collection Calculator" description="Estimate how much rainwater your roof can collect"
            formula="Volume = Roof Area × Rainfall × Efficiency × 0.623" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Annual Collection" value={`${result.annualGallons.toLocaleString()} gallons (${result.annualLiters.toLocaleString()} L)`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Monthly (avg)" value={`${result.monthlyGallons.toLocaleString()} gal`} />
                        <ResultDisplay label="Monthly (avg)" value={`${result.monthlyLiters.toLocaleString()} L`} />
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">{result.explanation}</div>
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="roof-area" label="Roof Catchment Area (sq ft)" value={roofArea} onChange={(v) => setRoofArea(String(v))} min={100} step={100} />
                <NumberInput id="rainfall" label="Annual Rainfall (inches)" value={rainfall} onChange={(v) => setRainfall(String(v))} min={1} step={5} />
                <NumberInput id="efficiency" label="Collection Efficiency (%)" value={efficiency} onChange={(v) => setEfficiency(String(v))} min={50} max={95} step={5} />
            </div>
        </CalculatorBase>
    );
}

export default RainwaterCollectionCalculator;
