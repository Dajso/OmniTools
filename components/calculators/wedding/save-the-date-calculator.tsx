'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { calculateSaveTheDate, type SaveTheDateResult } from '@/lib/calculations/wedding/save-the-date';

export function SaveTheDateCalculator() {
    const defaultDate = new Date(); defaultDate.setFullYear(defaultDate.getFullYear() + 1);
    const [weddingDate, setWeddingDate] = React.useState(defaultDate.toISOString().split('T')[0]);
    const [result, setResult] = React.useState<SaveTheDateResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateSaveTheDate({ weddingDate })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Error'); setResult(null); }
    }, [weddingDate]);
    const reset = () => { setWeddingDate(defaultDate.toISOString().split('T')[0]); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Save the Date Timeline" description="Wedding planning milestone timeline"
            formula="Based on standard wedding planning timeline" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-3">
                    {result.events.map((e, i) => (
                        <div key={i} className={`flex items-center justify-between text-sm py-2 px-3 rounded-lg ${e.daysFromNow < 0 ? 'bg-gray-100 text-gray-400' : e.daysFromNow <= 7 ? 'bg-red-50 text-red-800' : e.daysFromNow <= 30 ? 'bg-amber-50 text-amber-800' : 'bg-white'} border border-gray-100`}>
                            <div>
                                <div className="font-medium">{e.event}</div>
                                <div className="text-xs">{e.date}</div>
                            </div>
                            <span className={`text-xs font-mono ${e.daysFromNow < 0 ? 'text-gray-400' : e.daysFromNow <= 7 ? 'text-red-600 font-bold' : ''}`}>
                                {e.daysFromNow < 0 ? 'Passed' : e.daysFromNow === 0 ? 'Today!' : `${e.daysFromNow}d`}
                            </span>
                        </div>
                    ))}
                </div>
            )}>
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Wedding Date</label>
                <input type="date" value={weddingDate} onChange={e => setWeddingDate(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2" />
            </div>
        </CalculatorBase>
    );
}
export default SaveTheDateCalculator;
