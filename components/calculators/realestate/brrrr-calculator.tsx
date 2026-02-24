'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateBRRRR, type BRRRRResult } from '@/lib/calculations/realestate/brrrr';

export function BRRRRCalculator() {
    const [purchasePrice, setPurchasePrice] = React.useState('100000');
    const [rehabCost, setRehabCost] = React.useState('30000');
    const [arv, setArv] = React.useState('180000');
    const [rent, setRent] = React.useState('1500');
    const [expenses, setExpenses] = React.useState('800');
    const [ltv, setLtv] = React.useState('75');
    const [closing, setClosing] = React.useState('5000');
    const [result, setResult] = React.useState<BRRRRResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateBRRRR({ purchasePrice: parseFloat(purchasePrice), rehabCost: parseFloat(rehabCost), afterRepairValue: parseFloat(arv), monthlyRent: parseFloat(rent), monthlyExpenses: parseFloat(expenses), refinanceLTV: parseFloat(ltv), closingCosts: parseFloat(closing) })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Error'); setResult(null); }
    }, [purchasePrice, rehabCost, arv, rent, expenses, ltv, closing]);
    const reset = () => { setPurchasePrice('100000'); setRehabCost('30000'); setArv('180000'); setRent('1500'); setExpenses('800'); setLtv('75'); setClosing('5000'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="BRRRR Calculator" description="Buy, Rehab, Rent, Refinance, Repeat"
            formula="Cash Left = Total Investment − Refinance Amount" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    {result.allMoneyOut ? (
                        <div className="bg-green-50 rounded-lg p-3 text-sm text-green-800 font-semibold">🎉 All money out! You pulled 100% of your capital.</div>
                    ) : (
                        <ResultDisplay label="Cash Left in Deal" value={`$${result.cashLeftInDeal.toLocaleString()}`} />
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Total Investment" value={`$${result.totalInvestment.toLocaleString()}`} />
                        <ResultDisplay label="Refinance Amount" value={`$${result.refinanceAmount.toLocaleString()}`} />
                        <ResultDisplay label="Monthly Cash Flow" value={`$${result.monthlyCashFlow.toLocaleString()}`} />
                        <ResultDisplay label="Cash on Cash" value={result.cashOnCash === Infinity ? '∞' : `${result.cashOnCash}%`} />
                    </div>
                </div>
            )}>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="purchase" label="Purchase Price ($)" value={purchasePrice} onChange={v => setPurchasePrice(String(v))} min={0} step={5000} />
                    <NumberInput id="rehab" label="Rehab Cost ($)" value={rehabCost} onChange={v => setRehabCost(String(v))} min={0} step={1000} />
                </div>
                <NumberInput id="arv" label="After Repair Value ($)" value={arv} onChange={v => setArv(String(v))} min={0} step={5000} />
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="rent" label="Monthly Rent ($)" value={rent} onChange={v => setRent(String(v))} min={0} step={100} />
                    <NumberInput id="expenses" label="Monthly Expenses ($)" value={expenses} onChange={v => setExpenses(String(v))} min={0} step={50} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="ltv" label="Refinance LTV (%)" value={ltv} onChange={v => setLtv(String(v))} min={50} max={90} step={5} />
                    <NumberInput id="closing" label="Closing Costs ($)" value={closing} onChange={v => setClosing(String(v))} min={0} step={500} />
                </div>
            </div>
        </CalculatorBase>
    );
}
export default BRRRRCalculator;
