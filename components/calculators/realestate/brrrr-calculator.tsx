'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateBRRRR, type BRRRRResult } from '@/lib/calculations/realestate/brrrr';
import { formatCurrency, formatPercent } from '@/lib/utils/formatting';

export function BRRRRCalculator() {
    const [purchasePrice, setPurchasePrice] = React.useState('2500000');
    const [rehabCost, setRehabCost] = React.useState('500000');
    const [arv, setArv] = React.useState('3800000');
    const [rent, setRent] = React.useState('15000');
    const [expenses, setExpenses] = React.useState('4000');
    const [ltv, setLtv] = React.useState('85');
    const [closing, setClosing] = React.useState('80000');
    const [result, setResult] = React.useState<BRRRRResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateBRRRR({ purchasePrice: parseFloat(purchasePrice), rehabCost: parseFloat(rehabCost), afterRepairValue: parseFloat(arv), monthlyRent: parseFloat(rent), monthlyExpenses: parseFloat(expenses), refinanceLTV: parseFloat(ltv), closingCosts: parseFloat(closing) })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Feil'); setResult(null); }
    }, [purchasePrice, rehabCost, arv, rent, expenses, ltv, closing]);
    const reset = () => { setPurchasePrice('2500000'); setRehabCost('500000'); setArv('3800000'); setRent('15000'); setExpenses('4000'); setLtv('85'); setClosing('80000'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="BRRRR-kalkulator" description="Kjøp, pusse opp, leie ut, refinansiere og gjenta"
            formula="Bundet kapital = total investering − nytt lån etter refinansiering"
            formulaExplanation="Etter oppussing refinansierer du boligen til ny verdi. I Norge kan lånet ikke overstige 85 % av boligverdien. Kontantstrømmen her er leie minus kostnader, før renter og avdrag på det nye lånet."
            onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    {result.allMoneyOut ? (
                        <div className="bg-green-50 rounded-lg p-3 text-sm text-green-800 font-semibold">Hele investeringen er tatt ut igjen ved refinansieringen.</div>
                    ) : (
                        <ResultDisplay label="Kapital bundet i boligen" value={formatCurrency(result.cashLeftInDeal, { decimals: 0 })} highlight />
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Total investering" value={formatCurrency(result.totalInvestment, { decimals: 0 })} />
                        <ResultDisplay label="Nytt lån" value={formatCurrency(result.refinanceAmount, { decimals: 0 })} />
                        <ResultDisplay label="Kontantstrøm per måned" value={formatCurrency(result.monthlyCashFlow, { decimals: 0 })} />
                        <ResultDisplay label="Avkastning på bundet kapital" value={result.cashOnCash === Infinity ? '∞' : formatPercent(result.cashOnCash, { isDecimal: false })} />
                    </div>
                </div>
            )}>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="purchase" label="Kjøpesum" value={purchasePrice} onChange={v => setPurchasePrice(String(v))} min={0} step={50000} unit="kr" />
                    <NumberInput id="rehab" label="Oppussing" value={rehabCost} onChange={v => setRehabCost(String(v))} min={0} step={10000} unit="kr" />
                </div>
                <NumberInput id="arv" label="Verdi etter oppussing" value={arv} onChange={v => setArv(String(v))} min={0} step={50000} unit="kr" />
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="rent" label="Leie per måned" value={rent} onChange={v => setRent(String(v))} min={0} step={500} unit="kr" />
                    <NumberInput id="expenses" label="Kostnader per måned" value={expenses} onChange={v => setExpenses(String(v))} min={0} step={500} unit="kr" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="ltv" label="Belåningsgrad ved refinansiering" value={ltv} onChange={v => setLtv(String(v))} min={50} max={85} step={5} unit="%" />
                    <NumberInput id="closing" label="Omkostninger" value={closing} onChange={v => setClosing(String(v))} min={0} step={5000} unit="kr" />
                </div>
            </div>
        </CalculatorBase>
    );
}
export default BRRRRCalculator;
