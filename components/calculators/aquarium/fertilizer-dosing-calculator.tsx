'use client';

import * as React from 'react';
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
        } catch (err) { setError(err instanceof Error ? err.message : 'Calculation error'); setResult(null); }
    }, [volume]);

    const reset = () => { setVolume('100'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Fertilizer Dosing (EI Method)" description="Calculate EI method dosing for planted tanks"
            formula="Doses scaled from 150L standard reference" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Macro Nutrients (3× per week)</div>
                    {result.macroDoses.map((dose, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-3">
                            <ResultDisplay label={`${dose.compound} (${dose.formula})`} value={`${dose.gramsPerDose}g per dose`} />
                            <p className="text-xs text-gray-500 mt-1">{dose.targetPPM} • Weekly total: {dose.totalGramsPerWeek}g</p>
                        </div>
                    ))}
                    <div className="text-sm font-medium text-gray-700 mt-4 mb-2">Micro Nutrients (3× per week)</div>
                    <div className="bg-gray-50 rounded-lg p-3">
                        <ResultDisplay label={`${result.microDose.compound} (${result.microDose.formula})`} value={`${result.microDose.gramsPerDose}g per dose`} />
                        <p className="text-xs text-gray-500 mt-1">{result.microDose.targetPPM} • Weekly total: {result.microDose.totalGramsPerWeek}g</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800 mt-4">
                        <strong>Schedule:</strong> {result.weeklySchedule}
                    </div>
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="volume" label="Tank Volume (Liters)" value={volume} onChange={(v) => setVolume(String(v))} min={1} step={10} />
            </div>
        </CalculatorBase>
    );
}

export default FertilizerDosingCalculator;
