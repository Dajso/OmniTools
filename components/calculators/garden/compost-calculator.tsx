'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Button } from '@/components/ui/button';
import {
  calculateCompostRatio,
  COMPOST_MATERIALS,
  OPTIMAL_CN_RANGE,
  type CompostResult,
  type CompostMixInput,
} from '@/lib/calculations/garden';

interface MaterialEntry {
  id: string;
  material: string;
  amount: number;
}

const MATERIAL_OPTIONS = Object.entries(COMPOST_MATERIALS).map(([key, value]) => ({
  value: key,
  label: `${value.name} (${value.cnRatio}:1) - ${value.type}`,
}));

export function CompostCalculator() {
  const [materials, setMaterials] = React.useState<MaterialEntry[]>([
    { id: '1', material: 'grass-clippings', amount: 2 },
    { id: '2', material: 'dry-leaves', amount: 3 },
  ]);
  const [results, setResults] = React.useState<CompostResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const addMaterial = () => {
    setMaterials([
      ...materials,
      { id: Date.now().toString(), material: 'food-scraps', amount: 1 },
    ]);
  };

  const removeMaterial = (id: string) => {
    if (materials.length > 1) {
      setMaterials(materials.filter((m) => m.id !== id));
    }
  };

  const updateMaterial = (id: string, field: keyof MaterialEntry, value: string | number) => {
    setMaterials(
      materials.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const calculate = React.useCallback(() => {
    try {
      setError(null);
      const mixInputs: CompostMixInput[] = materials.map((m) => ({
        material: m.material,
        amount: m.amount,
      }));
      const result = calculateCompostRatio({
        materials: mixInputs,
        weightUnit: 'parts',
      });
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResults(null);
    }
  }, [materials]);

  const reset = () => {
    setMaterials([
      { id: '1', material: 'grass-clippings', amount: 2 },
      { id: '2', material: 'dry-leaves', amount: 3 },
    ]);
    setResults(null);
    setError(null);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <CalculatorBase
      title="Compost C:N Ratio Calculator"
      description="Calculate the carbon to nitrogen ratio of your compost mix for optimal decomposition"
      formula="C:N Ratio = Total Carbon / Total Nitrogen"
      formulaExplanation={`Optimal range is ${OPTIMAL_CN_RANGE.min}:1 to ${OPTIMAL_CN_RANGE.max}:1`}
      onCalculate={calculate}
      onReset={reset}
      error={error || undefined}
      results={
        results && (
          <div className="space-y-4">
            <ResultDisplay
              label="C:N Ratio"
              value={`${results.cnRatio}:1`}
              highlight
              copyable
            />

            <div
              className={`p-4 rounded-lg ${results.isOptimal
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                }`}
            >
              <p className="text-sm font-medium">
                {results.isOptimal ? '✓ Optimal Range!' : '⚠ Adjustment Needed'}
              </p>
              <p className="text-sm mt-1">{results.recommendation}</p>
            </div>

            {results.suggestedAdditions && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Suggested Addition</p>
                <p className="text-sm text-muted-foreground">
                  Add ~{results.suggestedAdditions.amount} parts of{' '}
                  {COMPOST_MATERIALS[results.suggestedAdditions.material]?.name ||
                    results.suggestedAdditions.material}
                </p>
              </div>
            )}

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Material Breakdown</p>
              <div className="space-y-2">
                {results.breakdown.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm p-2 bg-muted/30 rounded"
                  >
                    <span>{COMPOST_MATERIALS[item.material]?.name || item.material}</span>
                    <span className="text-muted-foreground">
                      {item.amount} parts ({item.cnRatio}:1)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Total Carbon"
                value={results.totalCarbon.toFixed(2)}
                unit="parts"
              />
              <ResultDisplay
                label="Total Nitrogen"
                value={results.totalNitrogen.toFixed(2)}
                unit="parts"
              />
            </div>
          </div>
        )
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Add your compost materials and their relative amounts (parts/buckets/wheelbarrows)
        </p>

        {materials.map((entry, index) => (
          <div key={entry.id} className="flex gap-2 items-end">
            <div className="flex-1">
              <SelectInput
                id={`material-${entry.id}`}
                label={index === 0 ? 'Material' : undefined}
                value={entry.material}
                onChange={(v) => updateMaterial(entry.id, 'material', v)}
                options={MATERIAL_OPTIONS}
              />
            </div>
            <div className="w-24">
              <NumberInput
                id={`amount-${entry.id}`}
                label={index === 0 ? 'Parts' : undefined}
                value={entry.amount}
                onChange={(v) => updateMaterial(entry.id, 'amount', v)}
                min={0.1}
                max={100}
                step={0.5}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeMaterial(entry.id)}
              disabled={materials.length <= 1}
              className="mb-0.5"
            >
              ✕
            </Button>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addMaterial} className="w-full">
          + Add Material
        </Button>
      </div>
    </CalculatorBase>
  );
}

export default CompostCalculator;
