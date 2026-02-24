'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateSunsetTime, type SunsetResult } from '@/lib/calculations/wedding/sunset-time';

export function SunsetTimeCalculator() {
    const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
    const [latitude, setLatitude] = React.useState('40');
    const [result, setResult] = React.useState<SunsetResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateSunsetTime({ date, latitude: parseFloat(latitude) })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Error'); setResult(null); }
    }, [date, latitude]);
    const reset = () => { setDate(new Date().toISOString().split('T')[0]); setLatitude('40'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Sunset Time for Wedding" description="Plan your ceremony around golden hour"
            formula="Solar angle calculation based on latitude and date" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 text-center">
                        <div className="text-sm text-amber-700 mb-1">🌅 Sunset</div>
                        <div className="text-3xl font-bold text-amber-900">{result.sunsetTime}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Golden Hour Start" value={result.goldenHourStart} />
                        <ResultDisplay label="Golden Hour End" value={result.goldenHourEnd} />
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700">{result.note}</div>
                </div>
            )}>
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2" />
                <NumberInput id="latitude" label="Latitude (°N, e.g. NYC=40, LA=34)" value={latitude} onChange={v => setLatitude(String(v))} min={-66} max={66} step={1} />
            </div>
        </CalculatorBase>
    );
}
export default SunsetTimeCalculator;
