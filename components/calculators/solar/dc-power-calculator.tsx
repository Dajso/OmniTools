'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateDCPower, type SolveFor, type DCPowerResult } from '@/lib/calculations/solar/dc-power';

const SOLVE_OPTIONS = [
    { value: 'watts', label: 'Calculate Watts (from Amps × Volts)' },
    { value: 'amps', label: 'Calculate Amps (from Watts ÷ Volts)' },
    { value: 'volts', label: 'Calculate Volts (from Watts ÷ Amps)' },
];

export function DCPowerCalculator() {
    const [solveFor, setSolveFor] = React.useState<string>('watts');
    const [watts, setWatts] = React.useState('120');
    const [amps, setAmps] = React.useState('10');
    const [volts, setVolts] = React.useState('12');
    const [result, setResult] = React.useState<DCPowerResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateDCPower({
                solveFor: solveFor as SolveFor,
                watts: parseFloat(watts), amps: parseFloat(amps), volts: parseFloat(volts),
            });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Calculation error'); setResult(null); }
    }, [solveFor, watts, amps, volts]);

    const reset = () => { setSolveFor('watts'); setWatts('120'); setAmps('10'); setVolts('12'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="DC Power Calculator" description="Convert between Watts, Amps, and Volts"
            formula="P = V × I" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="grid grid-cols-3 gap-4">
                    <ResultDisplay label="Watts (W)" value={`${result.watts}`} copyable />
                    <ResultDisplay label="Amps (A)" value={`${result.amps}`} />
                    <ResultDisplay label="Volts (V)" value={`${result.volts}`} />
                </div>
            )}
        >
            <div className="space-y-4">
                <SelectInput id="solve-for" label="Solve For" value={solveFor} onChange={setSolveFor} options={SOLVE_OPTIONS} />
                {solveFor !== 'watts' && <NumberInput id="watts" label="Watts" value={watts} onChange={(v) => setWatts(String(v))} min={0.1} step={10} />}
                {solveFor !== 'amps' && <NumberInput id="amps" label="Amps" value={amps} onChange={(v) => setAmps(String(v))} min={0.1} step={1} />}
                {solveFor !== 'volts' && <NumberInput id="volts" label="Volts" value={volts} onChange={(v) => setVolts(String(v))} min={0.1} step={1} />}
            </div>
        </CalculatorBase>
    );
}

export default DCPowerCalculator;
