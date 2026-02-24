'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateCashOnCash, type CashOnCashResult } from '@/lib/calculations/realestate/cash-on-cash';

export function CashOnCashCalculator() {
    const [cashFlow, setCashFlow] = React.useState('6000');
    const [invested, setInvested] = React.useState('50000');
    const [result, setResult] = React.useState<CashOnCashResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateCashOnCash({ annualCashFlow: parseFloat(cashFlow), totalCashInvested: parseFloat(invested) })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Error'); setResult(null); }
    }, [cashFlow, invested]);
    const reset = () => { setCashFlow('6000'); setInvested('50000'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Cash on Cash Return Calculator" description="Calculate leveraged real estate returns"
            formula="CoC = Annual Cash Flow / Total Cash Invested × 100" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Cash on Cash Return" value={`${result.cocReturn}%`} copyable />
                    <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">{result.rating}</div>
                </div>
            )}>
            <div className="space-y-4">
                <NumberInput id="cashFlow" label="Annual Pre-Tax Cash Flow ($)" value={cashFlow} onChange={v => setCashFlow(String(v))} min={0} step={500} />
                <NumberInput id="invested" label="Total Cash Invested ($)" value={invested} onChange={v => setInvested(String(v))} min={1} step={5000} />
            </div>
        </CalculatorBase>
    );
}
export default CashOnCashCalculator;
