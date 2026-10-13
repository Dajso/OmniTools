'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateGeneratorFuel, FUEL_TYPES, type GeneratorFuelResult } from '@/lib/calculations/solar/generator-fuel';
import { formatNumber } from '@/lib/utils/formatting';

const FUEL_OPTIONS = Object.entries(FUEL_TYPES).map(([value, data]) => ({ value, label: data.name }));

export function GeneratorFuelCalculator() {
    const [ratedWatts, setRatedWatts] = React.useState('3000');
    const [load, setLoad] = React.useState('50');
    const [tank, setTank] = React.useState('15');
    const [fuelType, setFuelType] = React.useState('gasoline');
    const [result, setResult] = React.useState<GeneratorFuelResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateGeneratorFuel({ ratedWatts: parseFloat(ratedWatts), loadPercent: parseFloat(load), tankLiters: parseFloat(tank), fuelType });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Beregningsfeil'); setResult(null); }
    }, [ratedWatts, load, tank, fuelType]);

    const reset = () => { setRatedWatts('3000'); setLoad('50'); setTank('15'); setFuelType('gasoline'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase
            title="Aggregat: drivstofforbruk"
            description="Hvor lenge går aggregatet på én tank?"
            formula="Driftstid = tank (liter) ÷ forbruk per time"
            formulaExplanation="Forbruket regnes ut fra energiinnholdet i drivstoffet (bensin ca. 8,9 kWh/l, diesel ca. 10 kWh/l) og en virkningsgrad på ca. 25–30 %. Små aggregater er ofte mer sløsete ved lav last, så regn dette som et anslag."
            onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Driftstid" value={result.runtimeFormatted} highlight copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Forbruk per time" value={`${formatNumber(result.fuelPerHour, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} l/t`} />
                        <ResultDisplay label="Faktisk belastning" value={`${formatNumber(result.actualLoad)} W`} />
                    </div>
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="rated-watts" label="Merkeeffekt på aggregatet" value={ratedWatts} onChange={(v) => setRatedWatts(String(v))} min={500} step={500} unit="W" />
                <NumberInput id="load" label="Belastning" value={load} onChange={(v) => setLoad(String(v))} min={1} max={100} step={5} unit="%" />
                <NumberInput id="tank" label="Tankstørrelse" value={tank} onChange={(v) => setTank(String(v))} min={0.5} step={0.5} unit="liter" />
                <SelectInput id="fuel-type" label="Drivstoff" value={fuelType} onChange={setFuelType} options={FUEL_OPTIONS} />
            </div>
        </CalculatorBase>
    );
}

export default GeneratorFuelCalculator;
