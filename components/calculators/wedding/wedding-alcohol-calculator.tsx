'use client';
import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateWeddingAlcohol, type WeddingAlcoholResult } from '@/lib/calculations/wedding/wedding-alcohol';

export function WeddingAlcoholCalculator() {
    const [guests, setGuests] = React.useState('100');
    const [hours, setHours] = React.useState('5');
    const [drinkers, setDrinkers] = React.useState('80');
    const [wine, setWine] = React.useState('40');
    const [beer, setBeer] = React.useState('40');
    const [spirit, setSpirit] = React.useState('20');
    const [result, setResult] = React.useState<WeddingAlcoholResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();
    const calculate = React.useCallback(() => {
        try { setError(undefined); setResult(calculateWeddingAlcohol({ guests: parseInt(guests), durationHours: parseInt(hours), drinkerPercent: parseFloat(drinkers), winePercent: parseFloat(wine), beerPercent: parseFloat(beer), spiritPercent: parseFloat(spirit) })); }
        catch (e) { setError(e instanceof Error ? e.message : 'Beregningsfeil'); setResult(null); }
    }, [guests, hours, drinkers, wine, beer, spirit]);
    const reset = () => { setGuests('100'); setHours('5'); setDrinkers('80'); setWine('40'); setBeer('40'); setSpirit('20'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Alkohol til bryllup" description="Hvor mye du bør kjøpe til selskapet"
            formula="Ca. 1 drikke per drikkende gjest per time" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-red-50 rounded-lg p-3 text-center"><div className="text-2xl font-bold text-red-600">{result.wineBottles}</div><div className="text-xs text-gray-600">Vinflasker (0,75 l)</div></div>
                        <div className="bg-amber-50 rounded-lg p-3 text-center"><div className="text-2xl font-bold text-amber-600">{result.beerCases}</div><div className="text-xs text-gray-600">Ølkasser (24 stk.)</div></div>
                        <div className="bg-blue-50 rounded-lg p-3 text-center"><div className="text-2xl font-bold text-blue-600">{result.spiritBottles}</div><div className="text-xs text-gray-600">Flasker sterkt (0,7 l)</div></div>
                    </div>
                    <ResultDisplay label="Drikker totalt" value={`${result.totalDrinks} (${result.totalDrinkers} som drikker)`} />
                </div>
            )}>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="guests" label="Antall gjester" value={guests} onChange={v => setGuests(String(v))} min={1} step={10} />
                    <NumberInput id="hours" label="Varighet (timer)" value={hours} onChange={v => setHours(String(v))} min={1} max={12} step={1} />
                </div>
                <NumberInput id="drinkers" label="Andel som drikker alkohol (%)" value={drinkers} onChange={v => setDrinkers(String(v))} min={0} max={100} step={5} />
                <div className="grid grid-cols-3 gap-4">
                    <NumberInput id="wine" label="Vin (%)" value={wine} onChange={v => setWine(String(v))} min={0} max={100} step={5} />
                    <NumberInput id="beer" label="Øl (%)" value={beer} onChange={v => setBeer(String(v))} min={0} max={100} step={5} />
                    <NumberInput id="spirit" label="Sterkt (%)" value={spirit} onChange={v => setSpirit(String(v))} min={0} max={100} step={5} />
                </div>
            </div>
        </CalculatorBase>
    );
}
export default WeddingAlcoholCalculator;
