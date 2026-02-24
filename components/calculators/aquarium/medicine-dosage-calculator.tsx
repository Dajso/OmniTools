'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateMedicineDosage, MEDICATIONS, type MedicineDosageResult } from '@/lib/calculations/aquarium/medicine-dosage';

const MED_OPTIONS = Object.entries(MEDICATIONS).map(([value, data]) => ({ value, label: data.name }));

export function MedicineDosageCalculator() {
    const [volume, setVolume] = React.useState('100');
    const [medication, setMedication] = React.useState('malachite-green');
    const [customDose, setCustomDose] = React.useState('1.0');
    const [result, setResult] = React.useState<MedicineDosageResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateMedicineDosage({ volumeLiters: parseFloat(volume), medication, customDose: parseFloat(customDose) });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Calculation error'); setResult(null); }
    }, [volume, medication, customDose]);

    const reset = () => { setVolume('100'); setMedication('malachite-green'); setCustomDose('1.0'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Medicine Dosage Calculator" description="Calculate aquarium medication dosing"
            formula="Dose = (Volume ÷ 10) × mL per 10L" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Dose Required" value={`${result.doseMl} mL`} copyable />
                    <ResultDisplay label="Teaspoons" value={`${result.doseTeaspoons} tsp`} />
                    <div className="bg-yellow-50 rounded-lg p-3 text-sm text-yellow-800">
                        <strong>Note:</strong> {result.notes}
                    </div>
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="volume" label="Tank Volume (Liters)" value={volume} onChange={(v) => setVolume(String(v))} min={1} step={10} />
                <SelectInput id="medication" label="Medication" value={medication} onChange={setMedication} options={MED_OPTIONS} />
                {medication === 'custom' && (
                    <NumberInput id="custom-dose" label="mL per 10 Liters" value={customDose} onChange={(v) => setCustomDose(String(v))} min={0.1} step={0.1} />
                )}
            </div>
        </CalculatorBase>
    );
}

export default MedicineDosageCalculator;
