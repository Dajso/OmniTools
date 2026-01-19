'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import {
  calculateDensity,
  MATERIAL_DENSITIES,
  willFloat,
  percentSubmerged,
  type DensityResult,
} from '@/lib/calculations/physics/density-calculator';

const materialOptions = [
  { value: '', label: 'Select a material (optional)' },
  { value: 'custom', label: '-- Custom Values --' },
  ...Object.entries(MATERIAL_DENSITIES).map(([key, value]) => ({
    value: key,
    label: `${key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} (${value} kg/m³)`,
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
      setError(err instanceof Error ? err.message : 'Calculation error');
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
      title="Density Calculator"
      description="Calculate density, mass, or volume using ρ = m/V"
      formula="ρ = m / V"
      formulaExplanation="Density equals mass divided by volume. Enter any two values to calculate the third."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultDisplay
              label="Density (ρ)"
              value={result.formattedDensity}
              highlight={result.calculated === 'density'}
              copyable
            />
            <ResultDisplay
              label="Mass (m)"
              value={result.formattedMass}
              highlight={result.calculated === 'mass'}
              copyable
            />
            <ResultDisplay
              label="Volume (V)"
              value={result.formattedVolume}
              highlight={result.calculated === 'volume'}
              copyable
            />
          </div>

          {result.closestMaterial && (
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm">
                <span className="font-medium">Similar material: </span>
                {result.closestMaterial.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </p>
            </div>
          )}

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Buoyancy in Water</p>
            <p className="text-sm">
              {floatsInWater 
                ? `✓ This object would float (${submergedPercent?.toFixed(1)}% submerged)`
                : '✗ This object would sink in water'}
            </p>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Highlighted value was calculated from your inputs
          </p>
        </div>
      )}
    >
      <div className="space-y-4">
        <SelectInput
          id="material"
          label="Material Preset"
          value={selectedMaterial}
          onChange={handleMaterialChange}
          options={materialOptions}
        />

        <p className="text-sm text-muted-foreground">Enter any two values:</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumberInput
            id="density"
            label="Density"
            value={density}
            onChange={setDensity}
            placeholder="kg/m³"
            min={0}
            step={0.1}
          />
          <NumberInput
            id="mass"
            label="Mass"
            value={mass}
            onChange={setMass}
            placeholder="kg"
            min={0}
            step={0.001}
          />
          <NumberInput
            id="volume"
            label="Volume"
            value={volume}
            onChange={setVolume}
            placeholder="m³"
            min={0}
            step={0.0001}
          />
        </div>

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Density Formulas</p>
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
