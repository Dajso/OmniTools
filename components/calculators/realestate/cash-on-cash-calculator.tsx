'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateCashOnCash, type CashOnCashResult } from '@/lib/calculations/realestate/cash-on-cash';
import { formatPercent } from '@/lib/utils/formatting';

export function CashOnCashCalculator() {
    const [cashFlow, setCashFlow] = React.useState('40000');
    const [invested, setInvested] = React.useState('700000');
    const [result, setResult] = React.useState<CashOnCashResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateCashOnCash({ annualCashFlow: parseFloat(cashFlow), totalCashInvested: parseFloat(invested) })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Feil'); setResult(null); }
    }, [cashFlow, invested]);
    const reset = () => { setCashFlow('40000'); setInvested('700000'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Egenkapitalavkastning" description="Regn ut avkastningen på egenkapitalen du har bundet i en utleiebolig"
            formula="Avkastning = årlig kontantstrøm før skatt ÷ investert egenkapital × 100"
            formulaExplanation="Kontantstrømmen er leieinntekter minus kostnader, renter og avdrag. Egenkapitalen er det du faktisk har satt inn: egenkapital, omkostninger og oppussing."
            onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Egenkapitalavkastning" value={formatPercent(result.cocReturn, { isDecimal: false })} highlight copyable />
                    <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">{result.rating}</div>
                </div>
            )}>
            <div className="space-y-4">
                <NumberInput id="cashFlow" label="Årlig kontantstrøm før skatt" value={cashFlow} onChange={v => setCashFlow(String(v))} step={5000} unit="kr" />
                <NumberInput id="invested" label="Investert egenkapital" value={invested} onChange={v => setInvested(String(v))} min={1} step={50000} unit="kr" />
            </div>
        </CalculatorBase>
    );
}
export default CashOnCashCalculator;
