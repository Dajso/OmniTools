'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateAirbnbProfit, type AirbnbResult } from '@/lib/calculations/realestate/airbnb-profit';

export function AirbnbProfitCalculator() {
    const [nightly, setNightly] = React.useState('150');
    const [cleaning, setCleaning] = React.useState('100');
    const [occupancy, setOccupancy] = React.useState('70');
    const [days, setDays] = React.useState('30');
    const [expenses, setExpenses] = React.useState('2000');
    const [platformFee, setPlatformFee] = React.useState('3');
    const [result, setResult] = React.useState<AirbnbResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateAirbnbProfit({ nightlyRate: parseFloat(nightly), cleaningFee: parseFloat(cleaning), occupancyRate: parseFloat(occupancy), daysPerMonth: parseFloat(days), monthlyExpenses: parseFloat(expenses), platformFeePercent: parseFloat(platformFee) })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Error'); setResult(null); }
    }, [nightly, cleaning, occupancy, days, expenses, platformFee]);
    const reset = () => { setNightly('150'); setCleaning('100'); setOccupancy('70'); setDays('30'); setExpenses('2000'); setPlatformFee('3'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Airbnb Profit Estimator" description="Estimate monthly short-term rental profit"
            formula="Profit = Revenue - Platform Fees - Expenses" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Monthly Profit" value={`$${result.monthlyProfit.toLocaleString()}`} copyable />
                    <ResultDisplay label="Annual Profit" value={`$${result.annualProfit.toLocaleString()}`} />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Gross Revenue" value={`$${result.grossRevenue.toLocaleString()}`} />
                        <ResultDisplay label="Cleaning Income" value={`$${result.cleaningIncome.toLocaleString()}`} />
                        <ResultDisplay label="Platform Fees" value={`-$${result.platformFees.toLocaleString()}`} />
                        <ResultDisplay label="Net Revenue" value={`$${result.netRevenue.toLocaleString()}`} />
                    </div>
                </div>
            )}>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="nightly" label="Nightly Rate ($)" value={nightly} onChange={v => setNightly(String(v))} min={0} step={10} />
                    <NumberInput id="cleaning" label="Cleaning Fee ($)" value={cleaning} onChange={v => setCleaning(String(v))} min={0} step={10} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="occupancy" label="Occupancy Rate (%)" value={occupancy} onChange={v => setOccupancy(String(v))} min={0} max={100} step={5} />
                    <NumberInput id="days" label="Days/Month" value={days} onChange={v => setDays(String(v))} min={28} max={31} step={1} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="expenses" label="Monthly Expenses ($)" value={expenses} onChange={v => setExpenses(String(v))} min={0} step={100} />
                    <NumberInput id="platformFee" label="Platform Fee (%)" value={platformFee} onChange={v => setPlatformFee(String(v))} min={0} max={20} step={0.5} />
                </div>
            </div>
        </CalculatorBase>
    );
}
export default AirbnbProfitCalculator;
