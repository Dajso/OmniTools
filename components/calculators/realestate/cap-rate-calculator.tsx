'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateCapRate, type CapRateResult } from '@/lib/calculations/realestate/cap-rate';
import { formatCurrency, formatPercent } from '@/lib/utils/formatting';

export function CapRateCalculator() {
    const [price, setPrice] = React.useState('3500000');
    const [rent, setRent] = React.useState('180000');
    const [expenses, setExpenses] = React.useState('50000');
    const [result, setResult] = React.useState<CapRateResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateCapRate({ purchasePrice: parseFloat(price), annualGrossRent: parseFloat(rent), annualExpenses: parseFloat(expenses) })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Feil'); setResult(null); }
    }, [price, rent, expenses]);
    const reset = () => { setPrice('3500000'); setRent('180000'); setExpenses('50000'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Yield-kalkulator (direkteavkastning)" description="Regn ut brutto- og nettoyield på en utleiebolig"
            formula="Nettoyield = (leie − kostnader) ÷ kjøpesum × 100"
            formulaExplanation="Bruttoyield regnes av leien alene. Nettoyield trekker fra felleskostnader, eiendomsskatt, forsikring, vedlikehold og ledighet. Renter og avdrag er ikke med."
            onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Nettoyield" value={formatPercent(result.capRate, { isDecimal: false })} highlight copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Bruttoyield" value={formatPercent(result.grossYield, { isDecimal: false })} />
                        <ResultDisplay label="Netto leieinntekt" value={`${formatCurrency(result.noi, { decimals: 0 })} per år`} />
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">{result.rating}</div>
                </div>
            )}>
            <div className="space-y-4">
                <NumberInput id="price" label="Kjøpesum" value={price} onChange={v => setPrice(String(v))} min={1} step={50000} unit="kr" />
                <NumberInput id="rent" label="Brutto leie per år" value={rent} onChange={v => setRent(String(v))} min={0} step={5000} unit="kr" />
                <NumberInput id="expenses" label="Kostnader per år" value={expenses} onChange={v => setExpenses(String(v))} min={0} step={1000} unit="kr" />
            </div>
        </CalculatorBase>
    );
}
export default CapRateCalculator;
