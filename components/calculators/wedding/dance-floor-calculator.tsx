'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { formatNumber } from '@/lib/utils/formatting';
import { calculateDanceFloor, type DanceFloorResult } from '@/lib/calculations/wedding/dance-floor';

export function DanceFloorCalculator() {
    const [guests, setGuests] = React.useState('100');
    const [dancerPercent, setDancerPercent] = React.useState('40');
    const [result, setResult] = React.useState<DanceFloorResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateDanceFloor({ guests: parseInt(guests), dancerPercent: parseFloat(dancerPercent) })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Beregningsfeil'); setResult(null); }
    }, [guests, dancerPercent]);
    const reset = () => { setGuests('100'); setDancerPercent('40'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Størrelse på dansegulv" description="Finn riktig størrelse på dansegulvet"
            formula="Ca. 0,5 m² per danser" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Anbefalt størrelse" value={result.sizeStr} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Dansere samtidig" value={`${result.dancers}`} />
                        <ResultDisplay label="Areal" value={`${formatNumber(result.areaM2, { maximumFractionDigits: 1 })} m²`} />
                    </div>
                </div>
            )}>
            <div className="space-y-4">
                <NumberInput id="guests" label="Antall gjester" value={guests} onChange={v => setGuests(String(v))} min={1} step={10} />
                <NumberInput id="dancer" label="Andel som danser samtidig (%)" value={dancerPercent} onChange={v => setDancerPercent(String(v))} min={10} max={100} step={5} />
            </div>
        </CalculatorBase>
    );
}
export default DanceFloorCalculator;
