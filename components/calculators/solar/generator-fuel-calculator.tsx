'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateGeneratorFuel, FUEL_TYPES, type GeneratorFuelResult } from '@/lib/calculations/solar/generator-fuel';

const FUEL_OPTIONS = Object.entries(FUEL_TYPES).map(([value, data]) => ({ value, label: data.name }));

export function GeneratorFuelCalculator() {
    const [ratedWatts, setRatedWatts] = React.useState('5000');
    const [load, setLoad] = React.useState('50');
    const [tank, setTank] = React.useState('5');
    const [fuelType, setFuelType] = React.useState('gasoline');
    const [result, setResult] = React.useState<GeneratorFuelResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateGeneratorFuel({ ratedWatts: parseFloat(ratedWatts), loadPercent: parseFloat(load), tankGallons: parseFloat(tank), fuelType });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Calculation error'); setResult(null); }
    }, [ratedWatts, load, tank, fuelType]);

    const reset = () => { setRatedWatts('5000'); setLoad('50'); setTank('5'); setFuelType('gasoline'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Generator Fuel Consumption Calculator" description="How long will your generator run?"
            formula="Runtime = Tank Size / Fuel per Hour" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Runtime" value={result.runtimeFormatted} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Fuel per Hour" value={`${result.fuelPerHour} gal/hr`} />
                        <ResultDisplay label="Actual Load" value={`${result.actualLoad}W`} />
                    </div>
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="rated-watts" label="Generator Rated Watts" value={ratedWatts} onChange={(v) => setRatedWatts(String(v))} min={500} step={500} />
                <NumberInput id="load" label="Load (%)" value={load} onChange={(v) => setLoad(String(v))} min={1} max={100} step={5} />
                <NumberInput id="tank" label="Tank Size (Gallons)" value={tank} onChange={(v) => setTank(String(v))} min={0.5} step={0.5} />
                <SelectInput id="fuel-type" label="Fuel Type" value={fuelType} onChange={setFuelType} options={FUEL_OPTIONS} />
            </div>
        </CalculatorBase>
    );
}

export default GeneratorFuelCalculator;
