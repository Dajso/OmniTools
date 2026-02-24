'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateCatering, type CateringResult } from '@/lib/calculations/wedding/catering';

export function CateringCalculator() {
    const [guests, setGuests] = React.useState('100');
    const [apps, setApps] = React.useState('6');
    const [result, setResult] = React.useState<CateringResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateCatering({ guests: parseInt(guests), appetizerCount: parseInt(apps) })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Error'); setResult(null); }
    }, [guests, apps]);
    const reset = () => { setGuests('100'); setApps('6'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Catering Quantity Estimator" description="How much food for your buffet"
            formula="6-8 oz protein, 4 oz sides per guest" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Main Protein" value={`${result.mainProteinLbs} lbs`} />
                        <ResultDisplay label="Side Dishes" value={`${result.sideDishLbs} lbs`} />
                        <ResultDisplay label="Salad" value={`${result.saladLbs} lbs`} />
                        <ResultDisplay label="Bread Rolls" value={`${result.breadRolls}`} />
                        <ResultDisplay label="Dessert Servings" value={`${result.dessertServings}`} />
                        <ResultDisplay label="Appetizer Pieces" value={`${result.appetizerPieces}`} />
                    </div>
                </div>
            )}>
            <div className="space-y-4">
                <NumberInput id="guests" label="Number of Guests" value={guests} onChange={v => setGuests(String(v))} min={1} step={10} />
                <NumberInput id="apps" label="Appetizer Pieces Per Person" value={apps} onChange={v => setApps(String(v))} min={0} max={12} step={1} />
            </div>
        </CalculatorBase>
    );
}
export default CateringCalculator;
