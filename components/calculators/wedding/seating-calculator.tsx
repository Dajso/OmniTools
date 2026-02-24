'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateSeating, type SeatingResult } from '@/lib/calculations/wedding/seating';

export function SeatingCalculator() {
    const [guests, setGuests] = React.useState('100');
    const [seats, setSeats] = React.useState('10');
    const [headTable, setHeadTable] = React.useState('8');
    const [result, setResult] = React.useState<SeatingResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateSeating({ guests: parseInt(guests), seatsPerTable: parseInt(seats), headTableGuests: parseInt(headTable) })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Error'); setResult(null); }
    }, [guests, seats, headTable]);
    const reset = () => { setGuests('100'); setSeats('10'); setHeadTable('8'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Seating Arrangement Calculator" description="How many tables do you need?"
            formula="Tables = (Guests − Head Table) / Seats Per Table" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Tables Needed" value={`${result.tablesNeeded}`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Total Seats" value={`${result.totalSeats}`} />
                        <ResultDisplay label="Empty Seats" value={`${result.emptySeats}`} />
                    </div>
                </div>
            )}>
            <div className="space-y-4">
                <NumberInput id="guests" label="Total Guests" value={guests} onChange={v => setGuests(String(v))} min={1} step={10} />
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="seats" label="Seats Per Table" value={seats} onChange={v => setSeats(String(v))} min={4} max={12} step={1} />
                    <NumberInput id="head" label="Head Table Guests" value={headTable} onChange={v => setHeadTable(String(v))} min={0} max={20} step={1} />
                </div>
            </div>
        </CalculatorBase>
    );
}
export default SeatingCalculator;
