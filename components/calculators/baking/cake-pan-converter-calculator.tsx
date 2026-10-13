'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { calculateCakePanConversion, type PanShape, type CakePanResult } from '@/lib/calculations/baking/cake-pan-converter';

const SHAPE_OPTIONS = [
    { value: 'round', label: 'Rund' }, { value: 'square', label: 'Kvadratisk' }, { value: 'rectangle', label: 'Rektangulær' },
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
        } catch (err) { setError(err instanceof Error ? err.message : 'Feil'); setResult(null); }
    }, [origShape, origWidth, origLength, targetShape, targetWidth, targetLength]);

    const reset = () => { setOrigShape('round'); setOrigWidth('8'); setTargetShape('square'); setTargetWidth('9'); setResult(null); setError(undefined); };
    React.useEffect(() => { calculate(); }, [calculate]);

    return (
        <CalculatorBase title="Kakeform-omregner" description="Regn om oppskrifter mellom former og størrelser"
            formula="Skaleringsfaktor = ønsket areal ÷ opprinnelig areal" onCalculate={calculate} onReset={reset} error={error}
            results={result && (
                <div className="space-y-4">
                    <ResultDisplay label="Skaleringsfaktor" value={`×${result.scaleFactor}`} copyable />
                    <div className="grid grid-cols-2 gap-4">
                        <ResultDisplay label="Opprinnelig areal" value={`${result.originalArea} cm²`} />
                        <ResultDisplay label="Ønsket areal" value={`${result.targetArea} cm²`} />
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-800">{result.explanation}</div>
                </div>
            )}
        >
            <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Formen oppskriften bruker</h4>
                <div className="grid grid-cols-2 gap-4">
                    <SelectInput id="orig-shape" label="Form" value={origShape} onChange={setOrigShape} options={SHAPE_OPTIONS} />
                    <NumberInput id="orig-width" label="Bredde/diameter (cm)" value={origWidth} onChange={(v) => setOrigWidth(String(v))} min={1} step={0.5} />
                </div>
                {origShape === 'rectangle' && <NumberInput id="orig-length" label="Lengde (cm)" value={origLength} onChange={(v) => setOrigLength(String(v))} min={1} step={0.5} />}
                <h4 className="text-sm font-medium text-gray-700">Formen du har</h4>
                <div className="grid grid-cols-2 gap-4">
                    <SelectInput id="target-shape" label="Form" value={targetShape} onChange={setTargetShape} options={SHAPE_OPTIONS} />
                    <NumberInput id="target-width" label="Bredde/diameter (cm)" value={targetWidth} onChange={(v) => setTargetWidth(String(v))} min={1} step={0.5} />
                </div>
                {targetShape === 'rectangle' && <NumberInput id="target-length" label="Lengde (cm)" value={targetLength} onChange={(v) => setTargetLength(String(v))} min={1} step={0.5} />}
            </div>
        </CalculatorBase>
    );
}

export default CakePanConverterCalculator;
