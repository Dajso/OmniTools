'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateDCPower, type SolveFor, type DCPowerResult } from '@/lib/calculations/solar/dc-power';
import { formatNumber } from '@/lib/utils/formatting';

const SOLVE_OPTIONS = [
    { value: 'watts', label: 'Regn ut watt (ampere × volt)' },
    { value: 'amps', label: 'Regn ut ampere (watt ÷ volt)' },
    { value: 'volts', label: 'Regn ut volt (watt ÷ ampere)' },
];

const num = (v: number) => formatNumber(v, { maximumFractionDigits: 3 });

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
        } catch (err) { setError(err instanceof Error ? err.message : 'Beregningsfeil'); setResult(null); }
    }, [solveFor, watts, amps, volts]);

    const reset = () => { setSolveFor('watts'); setWatts('120'); setAmps('10'); setVolts('12'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase
            title="Ampere og watt (DC)"
            description="Regn mellom watt, ampere og volt for likestrøm"
            formula="P = U × I (watt = volt × ampere)"
            formulaExplanation="Gjelder for likestrøm, som i solcelleanlegg, båt, bobil og 12 V-systemer. Ved lav spenning blir strømmen høy, og da trengs tykkere kabler."
            onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="grid grid-cols-3 gap-4">
                    <ResultDisplay label="Effekt" value={`${num(result.watts)} W`} copyable />
                    <ResultDisplay label="Strøm" value={`${num(result.amps)} A`} />
                    <ResultDisplay label="Spenning" value={`${num(result.volts)} V`} />
                </div>
            )}
        >
            <div className="space-y-4">
                <SelectInput id="solve-for" label="Regn ut" value={solveFor} onChange={setSolveFor} options={SOLVE_OPTIONS} />
                {solveFor !== 'watts' && <NumberInput id="watts" label="Effekt" value={watts} onChange={(v) => setWatts(String(v))} min={0.1} step={10} unit="W" />}
                {solveFor !== 'amps' && <NumberInput id="amps" label="Strøm" value={amps} onChange={(v) => setAmps(String(v))} min={0.1} step={1} unit="A" />}
                {solveFor !== 'volts' && <NumberInput id="volts" label="Spenning" value={volts} onChange={(v) => setVolts(String(v))} min={0.1} step={1} unit="V" />}
            </div>
        </CalculatorBase>
    );
}

export default DCPowerCalculator;
