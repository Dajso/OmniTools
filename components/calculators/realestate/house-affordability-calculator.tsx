'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateHouseAffordability, type HouseAffordabilityResult } from '@/lib/calculations/realestate/house-affordability';
import { formatCurrency } from '@/lib/utils/formatting';

export function HouseAffordabilityCalculator() {
    const [income, setIncome] = React.useState('800000');
    const [debts, setDebts] = React.useState('0');
    const [equity, setEquity] = React.useState('800000');
    const [rate, setRate] = React.useState('5');
    const [term, setTerm] = React.useState('25');
    const [result, setResult] = React.useState<HouseAffordabilityResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            setResult(calculateHouseAffordability({ annualIncome: parseFloat(income), existingDebt: parseFloat(debts) || 0, equity: parseFloat(equity) || 0, interestRate: parseFloat(rate), loanTermYears: parseInt(term) }));
        } catch (e) { setError(e instanceof Error ? e.message : 'Feil'); setResult(null); }
    }, [income, debts, equity, rate, term]);
    const reset = () => { setIncome('800000'); setDebts('0'); setEquity('800000'); setRate('5'); setTerm('25'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Hvor mye bolig har jeg råd til?" description="Se hvor dyr bolig du kan kjøpe etter bankenes krav om 5 ganger inntekt og 15 % egenkapital"
            formula="Maks boligpris = det laveste av (5 × inntekt − gjeld + egenkapital) og (egenkapital ÷ 0,15)"
            formulaExplanation="Utlånsforskriften krever at samlet gjeld ikke er mer enn 5 ganger bruttoinntekten, at du har minst 15 % egenkapital, og at du tåler en renteøkning på 3 prosentpoeng. Banken gjør alltid en egen vurdering av din betjeningsevne."
            onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Maks boligpris" value={formatCurrency(result.maxHomePrice, { decimals: 0 })} highlight copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Maks nytt lån" value={formatCurrency(result.maxLoanAmount, { decimals: 0 })} />
                        <ResultDisplay label="Gjeld som andel av inntekt" value={`${result.debtMultiple.toLocaleString('nb-NO')} × inntekt`} />
                        <ResultDisplay label="Månedlig betaling" value={formatCurrency(result.monthlyPayment, { decimals: 0 })} />
                        <ResultDisplay label="Ved 3 pp høyere rente" value={formatCurrency(result.monthlyPaymentStress, { decimals: 0 })} />
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                        {result.limitingFactor === 'income' ? 'Inntekten begrenser hvor mye du kan låne.' : 'Egenkapitalen begrenser: du trenger minst 15 % av kjøpesummen.'}
                    </div>
                </div>
            )}>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="income" label="Samlet bruttoinntekt per år" value={income} onChange={v => setIncome(String(v))} min={1} step={10000} unit="kr" />
                    <NumberInput id="debts" label="Annen gjeld" value={debts} onChange={v => setDebts(String(v))} min={0} step={10000} unit="kr" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="equity" label="Egenkapital" value={equity} onChange={v => setEquity(String(v))} min={0} step={50000} unit="kr" />
                    <NumberInput id="rate" label="Rente" value={rate} onChange={v => setRate(String(v))} min={0.1} max={20} step={0.25} unit="%" />
                </div>
                <NumberInput id="term" label="Nedbetalingstid (maks 30 år)" value={term} onChange={v => setTerm(String(v))} min={1} max={30} step={1} unit="år" />
            </div>
        </CalculatorBase>
    );
}
export default HouseAffordabilityCalculator;
