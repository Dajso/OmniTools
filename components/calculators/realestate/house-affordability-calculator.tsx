'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateHouseAffordability, type HouseAffordabilityResult } from '@/lib/calculations/realestate/house-affordability';

export function HouseAffordabilityCalculator() {
    const [income, setIncome] = React.useState('5000');
    const [debts, setDebts] = React.useState('500');
    const [dp, setDp] = React.useState('20');
    const [rate, setRate] = React.useState('6.5');
    const [term, setTerm] = React.useState('30');
    const [dti, setDti] = React.useState('36');
    const [result, setResult] = React.useState<HouseAffordabilityResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateHouseAffordability({ monthlyIncome: parseFloat(income), monthlyDebts: parseFloat(debts), downPaymentPercent: parseFloat(dp), interestRate: parseFloat(rate), loanTermYears: parseInt(term), dtiLimit: parseFloat(dti) })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Error'); setResult(null); }
    }, [income, debts, dp, rate, term, dti]);
    const reset = () => { setIncome('5000'); setDebts('500'); setDp('20'); setRate('6.5'); setTerm('30'); setDti('36'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="House Affordability Calculator" description="How much house can you afford?"
            formula="Based on DTI ratio and mortgage reverse calculation" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Max Home Price" value={`$${result.maxHomePrice.toLocaleString()}`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Max Loan" value={`$${result.maxLoanAmount.toLocaleString()}`} />
                        <ResultDisplay label="Down Payment" value={`$${result.downPayment.toLocaleString()}`} />
                        <ResultDisplay label="Max Monthly Payment" value={`$${result.maxMonthlyPayment.toLocaleString()}`} />
                        <ResultDisplay label="DTI Ratio" value={`${result.dtiRatio}%`} />
                    </div>
                </div>
            )}>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="income" label="Monthly Income ($)" value={income} onChange={v => setIncome(String(v))} min={1} step={500} />
                    <NumberInput id="debts" label="Monthly Debts ($)" value={debts} onChange={v => setDebts(String(v))} min={0} step={100} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="dp" label="Down Payment (%)" value={dp} onChange={v => setDp(String(v))} min={0} max={50} step={5} />
                    <NumberInput id="rate" label="Interest Rate (%)" value={rate} onChange={v => setRate(String(v))} min={0.1} max={20} step={0.25} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="term" label="Loan Term (years)" value={term} onChange={v => setTerm(String(v))} min={10} max={30} step={5} />
                    <NumberInput id="dti" label="Max DTI Ratio (%)" value={dti} onChange={v => setDti(String(v))} min={20} max={50} step={1} />
                </div>
            </div>
        </CalculatorBase>
    );
}
export default HouseAffordabilityCalculator;
