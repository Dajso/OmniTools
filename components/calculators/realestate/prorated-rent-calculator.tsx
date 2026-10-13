'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateProratedRent, type ProratedRentResult } from '@/lib/calculations/realestate/prorated-rent';
import { formatCurrency } from '@/lib/utils/formatting';

export function ProratedRentCalculator() {
    const [rent, setRent] = React.useState('12000');
    const [day, setDay] = React.useState('15');
    const [daysInMonth, setDaysInMonth] = React.useState('30');
    const [result, setResult] = React.useState<ProratedRentResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateProratedRent({ monthlyRent: parseFloat(rent), moveInDay: parseInt(day), daysInMonth: parseInt(daysInMonth) })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Feil'); setResult(null); }
    }, [rent, day, daysInMonth]);
    const reset = () => { setRent('12000'); setDay('15'); setDaysInMonth('30'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Forholdsmessig husleie" description="Regn ut husleie for en delvis måned når du flytter inn eller ut midt i måneden"
            formula="Husleie = (månedsleie ÷ dager i måneden) × gjenstående dager" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Husleie for perioden" value={formatCurrency(result.proratedAmount)} highlight copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Pris per dag" value={formatCurrency(result.dailyRate)} />
                        <ResultDisplay label="Antall dager" value={`${result.remainingDays}`} />
                    </div>
                </div>
            )}>
            <div className="space-y-4">
                <NumberInput id="rent" label="Husleie per måned" value={rent} onChange={v => setRent(String(v))} min={1} step={500} unit="kr" />
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="day" label="Innflyttingsdag" value={day} onChange={v => setDay(String(v))} min={1} max={31} step={1} />
                    <NumberInput id="daysInMonth" label="Dager i måneden" value={daysInMonth} onChange={v => setDaysInMonth(String(v))} min={28} max={31} step={1} />
                </div>
            </div>
        </CalculatorBase>
    );
}
export default ProratedRentCalculator;
