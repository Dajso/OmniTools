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
import { formatFixed } from '@/lib/utils/formatting';

interface MaterialEntry {
  id: string;
  material: string;
  amount: number;
}

const MATERIAL_OPTIONS = Object.entries(COMPOST_MATERIALS).map(([key, value]) => ({
  value: key,
  label: `${value.name} (${value.cnRatio}:1) – ${value.type === 'green' ? 'grønt' : 'brunt'}`,
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
      setError(err instanceof Error ? err.message : 'Feil i beregningen');
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
      title="Kompost: C:N-forhold"
      description="Regn ut forholdet mellom karbon og nitrogen i komposten for best mulig nedbryting"
      formula="C:N-forhold = total karbon ÷ total nitrogen"
      formulaExplanation={`Ideelt område er ${OPTIMAL_CN_RANGE.min}:1 til ${OPTIMAL_CN_RANGE.max}:1`}
      onCalculate={calculate}
      onReset={reset}
      error={error || undefined}
      results={
        results && (
          <div className="space-y-4">
            <ResultDisplay
              label="C:N-forhold"
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
                {results.isOptimal ? '✓ Ideelt område' : '⚠ Bør justeres'}
              </p>
              <p className="text-sm mt-1">{results.recommendation}</p>
            </div>

            {results.suggestedAdditions && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Forslag til tilsetning</p>
                <p className="text-sm text-muted-foreground">
                  Tilsett ca. {formatFixed(results.suggestedAdditions.amount, 1)} deler{' '}
                  {(COMPOST_MATERIALS[results.suggestedAdditions.material]?.name ||
                    results.suggestedAdditions.material).toLowerCase()}
                </p>
              </div>
            )}

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Fordeling av materialer</p>
              <div className="space-y-2">
                {results.breakdown.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm p-2 bg-muted/30 rounded"
                  >
                    <span>{COMPOST_MATERIALS[item.material]?.name || item.material}</span>
                    <span className="text-muted-foreground">
                      {item.amount} deler ({item.cnRatio}:1)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Total karbon"
                value={formatFixed(results.totalCarbon, 2)}
                unit="deler"
              />
              <ResultDisplay
                label="Total nitrogen"
                value={formatFixed(results.totalNitrogen, 2)}
                unit="deler"
              />
            </div>
          </div>
        )
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Legg inn materialene i komposten og mengden av hver (deler, bøtter eller trillebårlass – det er forholdet som teller)
        </p>

        {materials.map((entry, index) => (
          <div key={entry.id} className="flex gap-2 items-end">
            <div className="flex-1">
              <SelectInput
                id={`material-${entry.id}`}
                label={index === 0 ? 'Materiale' : undefined}
                value={entry.material}
                onChange={(v) => updateMaterial(entry.id, 'material', v)}
                options={MATERIAL_OPTIONS}
              />
            </div>
            <div className="w-24">
              <NumberInput
                id={`amount-${entry.id}`}
                label={index === 0 ? 'Deler' : undefined}
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
          + Legg til materiale
        </Button>
      </div>
    </CalculatorBase>
  );
}

export default CompostCalculator;
