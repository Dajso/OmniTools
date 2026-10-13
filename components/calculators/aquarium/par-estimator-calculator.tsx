'use client';

import * as React from 'react';
import { formatNumber } from '@/lib/utils/formatting';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculatePAR, WATER_CLARITY, type PAREstimatorResult } from '@/lib/calculations/aquarium/par-estimator';

const CLARITY_OPTIONS = Object.entries(WATER_CLARITY).map(([value, data]) => ({ value, label: data.name }));

export function PAREstimatorCalculator() {
    const [surfacePAR, setSurfacePAR] = React.useState('120');
    const [depth, setDepth] = React.useState('40');
    const [clarity, setClarity] = React.useState('clear');
    const [result, setResult] = React.useState<PAREstimatorResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculatePAR({ surfacePAR: parseFloat(surfacePAR), depthCm: parseFloat(depth), clarity });
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Beregningsfeil'); setResult(null); }
    }, [surfacePAR, depth, clarity]);

    const reset = () => { setSurfacePAR('120'); setDepth('40'); setClarity('clear'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Lysstyrke (PAR)" description="Anslå PAR nede ved bunnsubstratet"
            formula="PAR på dybden = PAR ved overflaten × e^(−k × dybde)" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="PAR ved bunnen" value={`${formatNumber(result.parAtDepth)} µmol/m²/s`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Lys igjen" value={`${formatNumber(result.percentRemaining)} %`} />
                        <ResultDisplay label="Lysnivå" value={result.lightLevel} />
                    </div>
                    <ResultDisplay label="Passende planter" value={result.suitablePlants} />
                </div>
            )}
        >
            <div className="space-y-4">
                <NumberInput id="surface-par" label="PAR ved overflaten (µmol/m²/s)" value={surfacePAR} onChange={(v) => setSurfacePAR(String(v))} min={1} step={10} />
                <NumberInput id="depth" label="Vanndybde (cm)" value={depth} onChange={(v) => setDepth(String(v))} min={1} step={5} />
                <SelectInput id="clarity" label="Vannklarhet" value={clarity} onChange={setClarity} options={CLARITY_OPTIONS} />
            </div>
        </CalculatorBase>
    );
}

export default PAREstimatorCalculator;
