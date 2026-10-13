'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateWeddingCake, type WeddingCakeResult } from '@/lib/calculations/wedding/wedding-cake';

export function WeddingCakeCalculator() {
    const [guests, setGuests] = React.useState('150');
    const [result, setResult] = React.useState<WeddingCakeResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateWeddingCake({ guests: parseInt(guests) })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Beregningsfeil'); setResult(null); }
    }, [guests]);
    const reset = () => { setGuests('150'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Bryllupskake" description="Antall etasjer og porsjoner ut fra antall gjester"
            formula="Basert på vanlige størrelser på kakelag (små bryllupsstykker)" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Anbefalt" value={`Kake med ${result.tierCount} etasjer (${result.totalServings} porsjoner)`} copyable />
                    <div className="space-y-2">
                        {result.tiers.map((t, i) => (
                            <div key={i} className="flex justify-between text-sm border-b border-gray-100 py-1">
                                <span>Etasje {i + 1}: {t.size} cm i diameter</span><span className="font-mono">{t.servings} porsjoner</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}>
            <NumberInput id="guests" label="Antall gjester" value={guests} onChange={v => setGuests(String(v))} min={1} max={500} step={10} />
        </CalculatorBase>
    );
}
export default WeddingCakeCalculator;
