'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateCakePanConversion, type PanShape, type CakePanResult } from '@/lib/calculations/baking/cake-pan-converter';

const SHAPE_OPTIONS = [
    { value: 'round', label: 'Round' }, { value: 'square', label: 'Square' }, { value: 'rectangle', label: 'Rectangle' },
];

export function CakePanConverterCalculator() {
    const [origShape, setOrigShape] = React.useState<string>('round');
    const [origWidth, setOrigWidth] = React.useState('8');
    const [origLength, setOrigLength] = React.useState('8');
    const [targetShape, setTargetShape] = React.useState<string>('square');
    const [targetWidth, setTargetWidth] = React.useState('9');
    const [targetLength, setTargetLength] = React.useState('9');
    const [result, setResult] = React.useState<CakePanResult | null>(null);
    const [error, setError] = React.useState<string | undefined>();

    const calculate = React.useCallback(() => {
        try {
            setError(undefined);
            const res = calculateCakePanConversion(
                { shape: origShape as PanShape, width: parseFloat(origWidth), length: parseFloat(origLength) },
                { shape: targetShape as PanShape, width: parseFloat(targetWidth), length: parseFloat(targetLength) },
            );
            setResult(res);
        } catch (err) { setError(err instanceof Error ? err.message : 'Error'); setResult(null); }
    }, [origShape, origWidth, origLength, targetShape, targetWidth, targetLength]);

    const reset = () => { setOrigShape('round'); setOrigWidth('8'); setTargetShape('square'); setTargetWidth('9'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Cake Pan Converter" description="Convert recipes between pan shapes and sizes"
            formula="Scale Factor = Target Area / Original Area" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Scale Factor" value={`×${result.scaleFactor}`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Original Area" value={`${result.originalArea} sq in`} />
                        <ResultDisplay label="Target Area" value={`${result.targetArea} sq in`} />
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-800">{result.explanation}</div>
                </div>
            )}
        >
            <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Original Pan</h4>
                <div className="grid grid-cols-2 gap-4">
                    <SelectInput id="orig-shape" label="Shape" value={origShape} onChange={setOrigShape} options={SHAPE_OPTIONS} />
                    <NumberInput id="orig-width" label="Width/Diameter (in)" value={origWidth} onChange={(v) => setOrigWidth(String(v))} min={1} step={0.5} />
                </div>
                {origShape === 'rectangle' && <NumberInput id="orig-length" label="Length (in)" value={origLength} onChange={(v) => setOrigLength(String(v))} min={1} step={0.5} />}
                <h4 className="text-sm font-medium text-gray-700">Target Pan</h4>
                <div className="grid grid-cols-2 gap-4">
                    <SelectInput id="target-shape" label="Shape" value={targetShape} onChange={setTargetShape} options={SHAPE_OPTIONS} />
                    <NumberInput id="target-width" label="Width/Diameter (in)" value={targetWidth} onChange={(v) => setTargetWidth(String(v))} min={1} step={0.5} />
                </div>
                {targetShape === 'rectangle' && <NumberInput id="target-length" label="Length (in)" value={targetLength} onChange={(v) => setTargetLength(String(v))} min={1} step={0.5} />}
            </div>
        </CalculatorBase>
    );
}

export default CakePanConverterCalculator;
