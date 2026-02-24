'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculate1031Exchange, type Exchange1031Result } from '@/lib/calculations/realestate/exchange-1031';

export function Exchange1031Calculator() {
    const [saleDate, setSaleDate] = React.useState(new Date().toISOString().split('T')[0]);
    const [result, setResult] = React.useState<Exchange1031Result | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculate1031Exchange({ saleDate })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Error'); setResult(null); }
    }, [saleDate]);
    const reset = () => { setSaleDate(new Date().toISOString().split('T')[0]); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="1031 Exchange Deadline Calculator" description="Track your exchange deadlines"
            formula="45-day identification, 180-day closing from sale date" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Sale Date" value={result.saleDate} />
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                        <h4 className="font-semibold text-amber-800 mb-2">📅 45-Day Identification Deadline</h4>
                        <p className="text-lg font-bold text-amber-900">{result.identificationDeadline}</p>
                        <p className="text-sm text-amber-700 mt-1">{result.daysUntilIdentification > 0 ? `${result.daysUntilIdentification} days remaining` : 'Deadline passed!'}</p>
                    </div>
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <h4 className="font-semibold text-blue-800 mb-2">🏠 180-Day Closing Deadline</h4>
                        <p className="text-lg font-bold text-blue-900">{result.closingDeadline}</p>
                        <p className="text-sm text-blue-700 mt-1">{result.daysUntilClosing > 0 ? `${result.daysUntilClosing} days remaining` : 'Deadline passed!'}</p>
                    </div>
                </div>
            )}>
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Property Sale Date</label>
                <input type="date" value={saleDate} onChange={e => setSaleDate(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2" />
            </div>
        </CalculatorBase>
    );
}
export default Exchange1031Calculator;
