'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateProratedRent, type ProratedRentResult } from '@/lib/calculations/realestate/prorated-rent';

export function ProratedRentCalculator() {
    const [rent, setRent] = React.useState('1500');
    const [day, setDay] = React.useState('15');
    const [daysInMonth, setDaysInMonth] = React.useState('30');
    const [result, setResult] = React.useState<ProratedRentResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateProratedRent({ monthlyRent: parseFloat(rent), moveInDay: parseInt(day), daysInMonth: parseInt(daysInMonth) })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Error'); setResult(null); }
    }, [rent, day, daysInMonth]);
    const reset = () => { setRent('1500'); setDay('15'); setDaysInMonth('30'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Prorated Rent Calculator" description="Calculate partial month rent"
            formula="Prorated = (Monthly Rent / Days in Month) × Remaining Days" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Prorated Rent" value={`$${result.proratedAmount.toFixed(2)}`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Daily Rate" value={`$${result.dailyRate.toFixed(2)}`} />
                        <ResultDisplay label="Remaining Days" value={`${result.remainingDays}`} />
                    </div>
                </div>
            )}>
            <div className="space-y-4">
                <NumberInput id="rent" label="Monthly Rent ($)" value={rent} onChange={v => setRent(String(v))} min={1} step={50} />
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="day" label="Move-in Day" value={day} onChange={v => setDay(String(v))} min={1} max={31} step={1} />
                    <NumberInput id="daysInMonth" label="Days in Month" value={daysInMonth} onChange={v => setDaysInMonth(String(v))} min={28} max={31} step={1} />
                </div>
            </div>
        </CalculatorBase>
    );
}
export default ProratedRentCalculator;
