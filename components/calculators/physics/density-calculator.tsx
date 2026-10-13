'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import {
  calculateDensity,
  MATERIAL_DENSITIES,
  materialName,
  willFloat,
  percentSubmerged,
  type DensityResult,
} from '@/lib/calculations/physics/density-calculator';
import { formatFixed } from '@/lib/utils/formatting';

const materialOptions = [
  { value: '', label: 'Velg et materiale (valgfritt)' },
  { value: 'custom', label: '-- Egne verdier --' },
  ...Object.entries(MATERIAL_DENSITIES).map(([key, value]) => ({
    value: key,
    label: `${materialName(key)} (${value} kg/m³)`,
  })),
];

export function DensityCalculator() {
  const [density, setDensity] = React.useState<string>('');
  const [mass, setMass] = React.useState<string>('');
  const [volume, setVolume] = React.useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = React.useState<string>('');
  const [result, setResult] = React.useState<DensityResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const input = {
        density: density ? parseFloat(density) : undefined,
        mass: mass ? parseFloat(mass) : undefined,
        volume: volume ? parseFloat(volume) : undefined,
      };

      const providedCount = [input.density, input.mass, input.volume]
        .filter(v => v !== undefined && !isNaN(v)).length;

      if (providedCount < 2) {
        setResult(null);
        return;
      }

      const res = calculateDensity(input);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
      setResult(null);
    }
  }, [density, mass, volume]);

  const handleMaterialChange = (value: string) => {
    setSelectedMaterial(value);
    if (value && value !== 'custom' && MATERIAL_DENSITIES[value]) {
      setDensity(MATERIAL_DENSITIES[value].toString());
    }
  };

  const reset = () => {
    setDensity('');
    setMass('');
    setVolume('');
    setSelectedMaterial('');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => { calculate(); }, [calculate]);

  const floatsInWater = result ? willFloat(result.density) : null;
  const submergedPercent = result ? percentSubmerged(result.density) : null;

  return (
    <CalculatorBase
      title="Tetthetskalkulator"
      description="Regn ut tetthet, masse eller volum med ρ = m/V"
      formula="ρ = m / V"
      formulaExplanation="Tetthet er masse delt på volum. Fyll inn to verdier, så regnes den tredje ut."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultDisplay
              label="Tetthet (ρ)"
              value={result.formattedDensity}
              highlight={result.calculated === 'density'}
              copyable
            />
            <ResultDisplay
              label="Masse (m)"
              value={result.formattedMass}
              highlight={result.calculated === 'mass'}
              copyable
            />
            <ResultDisplay
              label="Volum (V)"
              value={result.formattedVolume}
              highlight={result.calculated === 'volume'}
              copyable
            />
          </div>

          {result.closestMaterial && (
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm">
                <span className="font-medium">Lignende materiale: </span>
                {materialName(result.closestMaterial)}
              </p>
            </div>
          )}

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Oppdrift i vann</p>
            <p className="text-sm">
              {floatsInWater 
                ? `✓ Gjenstanden flyter (${formatFixed(submergedPercent ?? 0, 1)} % under vann)`
                : '✗ Gjenstanden synker i vann'}
            </p>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Den uthevede verdien er regnet ut fra det du har fylt inn
          </p>
        </div>
      )}
    >
      <div className="space-y-4">
        <SelectInput
          id="material"
          label="Materialvalg"
          value={selectedMaterial}
          onChange={handleMaterialChange}
          options={materialOptions}
        />

        <p className="text-sm text-muted-foreground">Fyll inn to verdier:</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumberInput
            id="density"
            label="Tetthet"
            value={density}
            onChange={setDensity}
            placeholder="kg/m³"
            min={0}
            step={0.1}
          />
          <NumberInput
            id="mass"
            label="Masse"
            value={mass}
            onChange={setMass}
            placeholder="kg"
            min={0}
            step={0.001}
          />
          <NumberInput
            id="volume"
            label="Volum"
            value={volume}
            onChange={setVolume}
            placeholder="m³"
            min={0}
            step={0.0001}
          />
        </div>

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Formler for tetthet</p>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div>ρ = m / V</div>
            <div>m = ρ × V</div>
            <div>V = m / ρ</div>
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default DensityCalculator;
