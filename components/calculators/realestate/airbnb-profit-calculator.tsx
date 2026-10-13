'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateAirbnbProfit, type AirbnbResult } from '@/lib/calculations/realestate/airbnb-profit';
import { formatCurrency } from '@/lib/utils/formatting';

export function AirbnbProfitCalculator() {
    const [nightly, setNightly] = React.useState('1200');
    const [cleaning, setCleaning] = React.useState('600');
    const [occupancy, setOccupancy] = React.useState('60');
    const [days, setDays] = React.useState('30');
    const [expenses, setExpenses] = React.useState('12000');
    const [platformFee, setPlatformFee] = React.useState('3');
    const [tax, setTax] = React.useState('22');
    const [result, setResult] = React.useState<AirbnbResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            setResult(calculateAirbnbProfit({ nightlyRate: parseFloat(nightly), cleaningFee: parseFloat(cleaning), occupancyRate: parseFloat(occupancy), daysPerMonth: parseFloat(days), monthlyExpenses: parseFloat(expenses), platformFeePercent: parseFloat(platformFee), taxPercent: parseFloat(tax) || 0 }));
        } catch (e) { setError(e instanceof Error ? e.message : 'Feil'); setResult(null); }
    }, [nightly, cleaning, occupancy, days, expenses, platformFee, tax]);
    const reset = () => { setNightly('1200'); setCleaning('600'); setOccupancy('60'); setDays('30'); setExpenses('12000'); setPlatformFee('3'); setTax('22'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Utleie på Airbnb: overskudd" description="Anslå månedlig og årlig overskudd ved korttidsutleie"
            formula="Overskudd = inntekter − plattformgebyr − kostnader"
            formulaExplanation="Det regnes med 3 netter per opphold når rengjøring beregnes. Skatten gjelder overskuddet etter fradrag (22 % alminnelig inntekt). Egne regler kan gjelde for utleie av egen bolig, så sjekk skatteetaten.no."
            onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Overskudd per måned" value={formatCurrency(result.monthlyProfit, { decimals: 0 })} highlight copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Overskudd per år" value={formatCurrency(result.annualProfit, { decimals: 0 })} />
                        <ResultDisplay label="Etter skatt per år" value={formatCurrency(result.annualProfitAfterTax, { decimals: 0 })} />
                        <ResultDisplay label="Leieinntekter" value={formatCurrency(result.grossRevenue, { decimals: 0 })} />
                        <ResultDisplay label="Rengjøringsinntekt" value={formatCurrency(result.cleaningIncome, { decimals: 0 })} />
                        <ResultDisplay label="Plattformgebyr" value={`−${formatCurrency(result.platformFees, { decimals: 0 })}`} />
                        <ResultDisplay label="Netto inntekt" value={formatCurrency(result.netRevenue, { decimals: 0 })} />
                    </div>
                </div>
            )}>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="nightly" label="Pris per natt" value={nightly} onChange={v => setNightly(String(v))} min={0} step={50} unit="kr" />
                    <NumberInput id="cleaning" label="Rengjøringsgebyr" value={cleaning} onChange={v => setCleaning(String(v))} min={0} step={50} unit="kr" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="occupancy" label="Belegg" value={occupancy} onChange={v => setOccupancy(String(v))} min={0} max={100} step={5} unit="%" />
                    <NumberInput id="days" label="Dager i måneden" value={days} onChange={v => setDays(String(v))} min={28} max={31} step={1} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="expenses" label="Kostnader per måned" value={expenses} onChange={v => setExpenses(String(v))} min={0} step={500} unit="kr" />
                    <NumberInput id="platformFee" label="Plattformgebyr" value={platformFee} onChange={v => setPlatformFee(String(v))} min={0} max={20} step={0.5} unit="%" />
                </div>
                <NumberInput id="tax" label="Skatt på overskudd" value={tax} onChange={v => setTax(String(v))} min={0} max={60} step={1} unit="%" />
            </div>
        </CalculatorBase>
    );
}
export default AirbnbProfitCalculator;
