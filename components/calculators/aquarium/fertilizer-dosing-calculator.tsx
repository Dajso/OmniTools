'use client';

import * as React from 'react';
import { formatNumber } from '@/lib/utils/formatting';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { calculateFertilizerDosing, type FertilizerDosingResult } from '@/lib/calculations/aquarium/fertilizer-dosing';

export function FertilizerDosingCalculator() {
    const [volume, setVolume] = React.useState('100');
    const [result, setResult] = React.useState<FertilizerDosingResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateFertilizerDosing({ volumeLiters: parseFloat(volume) });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Beregningsfeil'); setResult(null); }
    }, [volume]);

    const reset = () => { setVolume('100'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Gjødseldosering (EI-metoden)" description="Regn ut dosering etter EI-metoden for plantekar"
            formula="Dosene er skalert fra en referanse på 150 liter" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Makronæringsstoffer (3 × i uka)</div>
                    {result.macroDoses.map((dose, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-3">
                            <ResultDisplay label={`${dose.compound} (${dose.formula})`} value={`${formatNumber(dose.gramsPerDose)} g per dose`} />
                            <p className="text-xs text-gray-500 mt-1">{dose.targetPPM} • Totalt per uke: {dose.totalGramsPerWeek}g</p>
                        </div>
                    ))}
                    <div className="text-sm font-medium text-gray-700 mt-4 mb-2">Mikronæringsstoffer (3 × i uka)</div>
                    <div className="bg-gray-50 rounded-lg p-3">
                        <ResultDisplay label={`${result.microDose.compound} (${result.microDose.formula})`} value={`${formatNumber(result.microDose.gramsPerDose)} g per dose`} />
                        <p className="text-xs text-gray-500 mt-1">{result.microDose.targetPPM} • Totalt per uke: {result.microDose.totalGramsPerWeek}g</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800 mt-4">
                        <strong>Plan:</strong> {result.weeklySchedule}
                    </div>
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="volume" label="Akvariumvolum (liter)" value={volume} onChange={(v) => setVolume(String(v))} min={1} step={10} />
            </div>
        </CalculatorBase>
    );
}

export default FertilizerDosingCalculator;
