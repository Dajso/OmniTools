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
        catch (e) { setError(e instanceof Error ? e.message : 'Error'); setResult(null); }
    }, [guests, hours, drinkers, wine, beer, spirit]);
    const reset = () => { setGuests('100'); setHours('5'); setDrinkers('80'); setWine('40'); setBeer('40'); setSpirit('20'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);
    return (
        <CalculatorBase title="Wedding Alcohol Calculator" description="How much to buy for your reception"
            formula="~1 drink per person per hour" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-red-50 rounded-lg p-3 text-center"><div className="text-2xl font-bold text-red-600">{result.wineBottles}</div><div className="text-xs text-gray-600">Wine Bottles</div></div>
                        <div className="bg-amber-50 rounded-lg p-3 text-center"><div className="text-2xl font-bold text-amber-600">{result.beerCases}</div><div className="text-xs text-gray-600">Beer Cases (24pk)</div></div>
                        <div className="bg-blue-50 rounded-lg p-3 text-center"><div className="text-2xl font-bold text-blue-600">{result.spiritBottles}</div><div className="text-xs text-gray-600">Spirit Bottles</div></div>
                    </div>
                    <ResultDisplay label="Total Drinks" value={`${result.totalDrinks} (${result.totalDrinkers} drinkers)`} />
                </div>
            )}>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="guests" label="Total Guests" value={guests} onChange={v => setGuests(String(v))} min={1} step={10} />
                    <NumberInput id="hours" label="Duration (hours)" value={hours} onChange={v => setHours(String(v))} min={1} max={12} step={1} />
                </div>
                <NumberInput id="drinkers" label="Drinkers (%)" value={drinkers} onChange={v => setDrinkers(String(v))} min={0} max={100} step={5} />
                <div className="grid grid-cols-3 gap-4">
                    <NumberInput id="wine" label="Wine (%)" value={wine} onChange={v => setWine(String(v))} min={0} max={100} step={5} />
                    <NumberInput id="beer" label="Beer (%)" value={beer} onChange={v => setBeer(String(v))} min={0} max={100} step={5} />
                    <NumberInput id="spirit" label="Spirits (%)" value={spirit} onChange={v => setSpirit(String(v))} min={0} max={100} step={5} />
                </div>
            </div>
        </CalculatorBase>
    );
}
export default WeddingAlcoholCalculator;
