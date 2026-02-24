'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateAquariumVolume, type TankShape, type AquariumVolumeResult } from '@/lib/calculations/aquarium/aquarium-volume';

const SHAPE_OPTIONS = [
    { value: 'rectangular', label: 'Rectangular' },
    { value: 'cylindrical', label: 'Cylindrical' },
    { value: 'bowfront', label: 'Bow-Front' },
];

export function AquariumVolumeCalculator() {
    const [shape, setShape] = React.useState<string>('rectangular');
    const [length, setLength] = React.useState('60');
    const [width, setWidth] = React.useState('30');
    const [height, setHeight] = React.useState('36');
    const [diameter, setDiameter] = React.useState('40');
    const [bowDepth, setBowDepth] = React.useState('8');
    const [result, setResult] = React.useState<AquariumVolumeResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateAquariumVolume({
                shape: shape as TankShape,
                length: parseFloat(length),
                width: parseFloat(width),
                height: parseFloat(height),
                diameter: parseFloat(diameter),
                bowDepth: parseFloat(bowDepth),
            });
            setResult(res);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Calculation error');
            setResult(null);
        }
    }, [shape, length, width, height, diameter, bowDepth]);

    const reset = () => {
        setShape('rectangular');
        setLength('60'); setWidth('30'); setHeight('36');
        setDiameter('40'); setBowDepth('8');
        setResult(null); setError(undefined);
    };

    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase
            title="Aquarium Volume Calculator"
            description="Calculate your aquarium volume in liters and gallons"
            formula="Volume varies by shape: L×W×H, πr²h, or rectangular + bow section"
            onCalculate={calculate}
            onReset={reset}
            error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Volume (Liters)" value={result.liters.toFixed(1)} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="US Gallons" value={result.usGallons.toFixed(1)} />
                        <ResultDisplay label="UK Gallons" value={result.ukGallons.toFixed(1)} />
                        <ResultDisplay label="Cubic cm" value={result.cubicCm.toFixed(0)} />
                        <ResultDisplay label="Cubic Inches" value={result.cubicInches.toFixed(1)} />
                    </div>
                </div>
            )}
        >
            <div className="space-y-4">
                <SelectInput id="shape" label="Tank Shape" value={shape} onChange={setShape} options={SHAPE_OPTIONS} />
                {shape === 'cylindrical' ? (
                    <>
                        <NumberInput id="diameter" label="Diameter (cm)" value={diameter} onChange={(v) => setDiameter(String(v))} min={1} step={1} />
                        <NumberInput id="height" label="Height (cm)" value={height} onChange={(v) => setHeight(String(v))} min={1} step={1} />
                    </>
                ) : (
                    <>
                        <NumberInput id="length" label="Length (cm)" value={length} onChange={(v) => setLength(String(v))} min={1} step={1} />
                        <NumberInput id="width" label="Width (cm)" value={width} onChange={(v) => setWidth(String(v))} min={1} step={1} />
                        <NumberInput id="height" label="Height (cm)" value={height} onChange={(v) => setHeight(String(v))} min={1} step={1} />
                        {shape === 'bowfront' && (
                            <NumberInput id="bowDepth" label="Bow Depth (cm)" value={bowDepth} onChange={(v) => setBowDepth(String(v))} min={0} step={1} />
                        )}
                    </>
                )}
            </div>
        </CalculatorBase>
    );
}

export default AquariumVolumeCalculator;
