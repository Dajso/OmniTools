'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateTentSize, type EventLayout, type TentSizeResult } from '@/lib/calculations/wedding/tent-size';

const LAYOUT_OPTIONS = [
    { value: 'standing', label: 'Standing Cocktail' },
    { value: 'seated', label: 'Seated Dinner' },
    { value: 'seated-dance', label: 'Seated + Dance Floor' },
];

export function TentSizeCalculator() {
    const [guests, setGuests] = React.useState('100');
    const [layout, setLayout] = React.useState<string>('seated-dance');
    const [result, setResult] = React.useState<TentSizeResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateTentSize({ guests: parseInt(guests), layout: layout as EventLayout })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Error'); setResult(null); }
    }, [guests, layout]);
    const reset = () => { setGuests('100'); setLayout('seated-dance'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Tent Size Calculator" description="How big a tent to rent"
            formula="Based on sq ft per person by layout" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Recommended Tent" value={result.tentSize} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Area Needed" value={`${result.sqFt} sq ft`} />
                        <ResultDisplay label="Layout" value={result.layout} />
                    </div>
                </div>
            )}>
            <div className="space-y-4">
                <NumberInput id="guests" label="Total Guests" value={guests} onChange={v => setGuests(String(v))} min={1} step={10} />
                <SelectInput id="layout" label="Event Layout" value={layout} onChange={setLayout} options={LAYOUT_OPTIONS} />
            </div>
        </CalculatorBase>
    );
}
export default TentSizeCalculator;
