'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateDanceFloor, type DanceFloorResult } from '@/lib/calculations/wedding/dance-floor';

export function DanceFloorCalculator() {
    const [guests, setGuests] = React.useState('100');
    const [dancerPercent, setDancerPercent] = React.useState('40');
    const [result, setResult] = React.useState<DanceFloorResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateDanceFloor({ guests: parseInt(guests), dancerPercent: parseFloat(dancerPercent) })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Error'); setResult(null); }
    }, [guests, dancerPercent]);
    const reset = () => { setGuests('100'); setDancerPercent('40'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Dance Floor Size Calculator" description="Right size for your party"
            formula="4.5 sq ft per dancer" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Recommended Size" value={result.sizeStr} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Active Dancers" value={`${result.dancers}`} />
                        <ResultDisplay label="Area Needed" value={`${result.sqFt} sq ft`} />
                    </div>
                </div>
            )}>
            <div className="space-y-4">
                <NumberInput id="guests" label="Total Guests" value={guests} onChange={v => setGuests(String(v))} min={1} step={10} />
                <NumberInput id="dancer" label="% Dancing at Once" value={dancerPercent} onChange={v => setDancerPercent(String(v))} min={10} max={100} step={5} />
            </div>
        </CalculatorBase>
    );
}
export default DanceFloorCalculator;
