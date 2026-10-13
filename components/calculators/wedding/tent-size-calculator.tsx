'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { formatNumber } from '@/lib/utils/formatting';
import { calculateTentSize, type EventLayout, type TentSizeResult } from '@/lib/calculations/wedding/tent-size';

const LAYOUT_OPTIONS = [
    { value: 'standing', label: 'Stående mottakelse' },
    { value: 'seated', label: 'Sittende middag' },
    { value: 'seated-dance', label: 'Sittende middag med dansegulv' },
];

export function TentSizeCalculator() {
    const [guests, setGuests] = React.useState('100');
    const [layout, setLayout] = React.useState<string>('seated-dance');
    const [result, setResult] = React.useState<TentSizeResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateTentSize({ guests: parseInt(guests), layout: layout as EventLayout })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Beregningsfeil'); setResult(null); }
    }, [guests, layout]);
    const reset = () => { setGuests('100'); setLayout('seated-dance'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Teltstørrelse" description="Hvor stort telt bør du leie"
            formula="Veiledende areal per person ut fra type arrangement" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Anbefalt telt" value={result.tentSize} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Areal som trengs" value={`${formatNumber(result.areaM2, { maximumFractionDigits: 1 })} m²`} />
                        <ResultDisplay label="Opplegg" value={result.layout} />
                    </div>
                </div>
            )}>
            <div className="space-y-4">
                <NumberInput id="guests" label="Antall gjester" value={guests} onChange={v => setGuests(String(v))} min={1} step={10} />
                <SelectInput id="layout" label="Type arrangement" value={layout} onChange={setLayout} options={LAYOUT_OPTIONS} />
            </div>
        </CalculatorBase>
    );
}
export default TentSizeCalculator;
