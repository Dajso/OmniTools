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
        catch (e) { setError(e instanceof Error ? e.message : 'Beregningsfeil'); setResult(null); }
    }, [guests, seats, headTable]);
    const reset = () => { setGuests('100'); setSeats('10'); setHeadTable('8'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Bordplassering" description="Hvor mange bord trenger dere?"
            formula="Bord = (gjester − æresbord) ÷ plasser per bord" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Antall bord" value={`${result.tablesNeeded}`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Plasser totalt" value={`${result.totalSeats}`} />
                        <ResultDisplay label="Ledige plasser" value={`${result.emptySeats}`} />
                    </div>
                </div>
            )}>
            <div className="space-y-4">
                <NumberInput id="guests" label="Antall gjester" value={guests} onChange={v => setGuests(String(v))} min={1} step={10} />
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="seats" label="Plasser per bord" value={seats} onChange={v => setSeats(String(v))} min={4} max={12} step={1} />
                    <NumberInput id="head" label="Gjester ved æresbordet" value={headTable} onChange={v => setHeadTable(String(v))} min={0} max={20} step={1} />
                </div>
            </div>
        </CalculatorBase>
    );
}
export default SeatingCalculator;
