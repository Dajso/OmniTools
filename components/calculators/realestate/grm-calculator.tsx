'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateGRM, type GRMResult } from '@/lib/calculations/realestate/grm';

export function GRMCalculator() {
    const [price, setPrice] = React.useState('3500000');
    const [rent, setRent] = React.useState('180000');
    const [result, setResult] = React.useState<GRMResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateGRM({ propertyPrice: parseFloat(price), annualGrossRent: parseFloat(rent) })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Feil'); setResult(null); }
    }, [price, rent]);
    const reset = () => { setPrice('3500000'); setRent('180000'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Brutto leiemultiplikator" description="Et raskt nøkkeltall for å vurdere prisen på en utleiebolig"
            formula="Multiplikator = kjøpesum ÷ årlig brutto leie" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Leiemultiplikator" value={result.grm.toLocaleString('nb-NO')} highlight copyable />
                    <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">{result.rating}</div>
                </div>
            )}>
            <div className="space-y-4">
                <NumberInput id="price" label="Kjøpesum" value={price} onChange={v => setPrice(String(v))} min={1} step={50000} unit="kr" />
                <NumberInput id="rent" label="Brutto leie per år" value={rent} onChange={v => setRent(String(v))} min={1} step={5000} unit="kr" />
            </div>
        </CalculatorBase>
    );
}
export default GRMCalculator;
