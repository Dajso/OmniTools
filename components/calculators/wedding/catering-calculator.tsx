'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { formatNumber } from '@/lib/utils/formatting';
import { calculateCatering, type CateringResult } from '@/lib/calculations/wedding/catering';

export function CateringCalculator() {
    const [guests, setGuests] = React.useState('100');
    const [apps, setApps] = React.useState('6');
    const [result, setResult] = React.useState<CateringResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateCatering({ guests: parseInt(guests), appetizerCount: parseInt(apps) })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Beregningsfeil'); setResult(null); }
    }, [guests, apps]);
    const reset = () => { setGuests('100'); setApps('6'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Mengde mat til bryllupsmiddag" description="Hvor mye mat trenger du til buffeten eller middagen"
            formula="Veiledende: ca. 200 g kjøtt/fisk, 150 g tilbehør og 70 g salat per gjest" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Hovedrett (kjøtt/fisk)" value={`${formatNumber(result.mainProteinKg, { maximumFractionDigits: 1 })} kg`} />
                        <ResultDisplay label="Tilbehør" value={`${formatNumber(result.sideDishKg, { maximumFractionDigits: 1 })} kg`} />
                        <ResultDisplay label="Salat" value={`${formatNumber(result.saladKg, { maximumFractionDigits: 1 })} kg`} />
                        <ResultDisplay label="Rundstykker/brød" value={`${result.breadRolls}`} />
                        <ResultDisplay label="Dessertporsjoner" value={`${result.dessertServings}`} />
                        <ResultDisplay label="Småretter/snitter (stk.)" value={`${result.appetizerPieces}`} />
                    </div>
                </div>
            )}>
            <div className="space-y-4">
                <NumberInput id="guests" label="Antall gjester" value={guests} onChange={v => setGuests(String(v))} min={1} step={10} />
                <NumberInput id="apps" label="Småretter per person" value={apps} onChange={v => setApps(String(v))} min={0} max={12} step={1} />
            </div>
        </CalculatorBase>
    );
}
export default CateringCalculator;
