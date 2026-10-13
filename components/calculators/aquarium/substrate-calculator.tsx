'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateSubstrate, SUBSTRATE_TYPES, type SubstrateResult } from '@/lib/calculations/aquarium/substrate';
import { formatFixed } from '@/lib/utils/formatting';

const SUBSTRATE_OPTIONS = [
    ...Object.entries(SUBSTRATE_TYPES).map(([value, data]) => ({
        value, label: `${data.name} (${data.density} kg/L)`,
    })),
];

export function SubstrateCalculator() {
    const [length, setLength] = React.useState('60');
    const [width, setWidth] = React.useState('30');
    const [depth, setDepth] = React.useState('5');
    const [substrateType, setSubstrateType] = React.useState('gravel');
    const [customDensity, setCustomDensity] = React.useState('1.5');
    const [result, setResult] = React.useState<SubstrateResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateSubstrate({
                length: parseFloat(length), width: parseFloat(width), depth: parseFloat(depth),
                substrateType, customDensity: parseFloat(customDensity),
            });
            setResult(res);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Calculation error');
            setResult(null);
        }
    }, [length, width, depth, substrateType, customDensity]);

    const reset = () => {
        setLength('60'); setWidth('30'); setDepth('5');
        setSubstrateType('gravel'); setCustomDensity('1.5');
        setResult(null); setError(undefined);
    };

    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase
            title="Substrate Calculator"
            description="Calculate the amount of substrate needed for your aquarium"
            formula="Weight = Length × Width × Depth × Density"
            onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Weight Needed" value={`${formatFixed(result.weightKg, 2)} kg`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Weight (lbs)" value={formatFixed(result.weightLbs, 2)} />
                        <ResultDisplay label="Volume (Liters)" value={formatFixed(result.volumeLiters, 2)} />
                    </div>
                </div>
            )}
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput id="length" label="Tank Length (cm)" value={length} onChange={(v) => setLength(String(v))} min={1} step={1} />
                    <NumberInput id="width" label="Tank Width (cm)" value={width} onChange={(v) => setWidth(String(v))} min={1} step={1} />
                </div>
                <NumberInput id="depth" label="Substrate Depth (cm)" value={depth} onChange={(v) => setDepth(String(v))} min={0.5} step={0.5} />
                <SelectInput id="substrate-type" label="Substrate Type" value={substrateType} onChange={setSubstrateType} options={SUBSTRATE_OPTIONS} />
                {substrateType === 'custom' && (
                    <NumberInput id="custom-density" label="Custom Density (kg/L)" value={customDensity} onChange={(v) => setCustomDensity(String(v))} min={0.1} step={0.1} />
                )}
            </div>
        </CalculatorBase>
    );
}

export default SubstrateCalculator;
