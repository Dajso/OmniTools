'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';

interface HeatSinkResult {
  requiredThermalResistance: number;
  junctionTemp: number;
  caseTemp: number;
  heatSinkTemp: number;
  safetyMargin: number;
}

function calculateHeatSink(
  powerDissipation: number,
  maxJunctionTemp: number,
  ambientTemp: number,
  thermalResistanceJC: number,
  thermalResistanceCS: number,
  heatSinkResistance?: number
): HeatSinkResult {
  // Calculate required thermal resistance from heat sink to ambient
  // Tj = Ta + P × (Rjc + Rcs + Rsa)
  // Rsa = (Tj - Ta) / P - Rjc - Rcs

  const tempDiff = maxJunctionTemp - ambientTemp;
  const requiredThermalResistance = (tempDiff / powerDissipation) - thermalResistanceJC - thermalResistanceCS;

  // Calculate actual temperatures if heat sink resistance is provided
  const actualRsa = heatSinkResistance || requiredThermalResistance;
  const totalResistance = thermalResistanceJC + thermalResistanceCS + actualRsa;
  const junctionTemp = ambientTemp + (powerDissipation * totalResistance);
  const caseTemp = junctionTemp - (powerDissipation * thermalResistanceJC);
  const heatSinkTemp = caseTemp - (powerDissipation * thermalResistanceCS);
  const safetyMargin = maxJunctionTemp - junctionTemp;

  return {
    requiredThermalResistance: Math.max(0, requiredThermalResistance),
    junctionTemp,
    caseTemp,
    heatSinkTemp,
    safetyMargin,
  };
}

export function HeatSinkCalculator() {
  const [powerDissipation, setPowerDissipation] = React.useState('10');
  const [maxJunctionTemp, setMaxJunctionTemp] = React.useState('150');
  const [ambientTemp, setAmbientTemp] = React.useState('25');
  const [thermalResistanceJC, setThermalResistanceJC] = React.useState('1');
  const [thermalResistanceCS, setThermalResistanceCS] = React.useState('0.5');
  const [heatSinkResistance, setHeatSinkResistance] = React.useState('');
  const [result, setResult] = React.useState<HeatSinkResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const p = parseFloat(powerDissipation);
      const tjMax = parseFloat(maxJunctionTemp);
      const ta = parseFloat(ambientTemp);
      const rjc = parseFloat(thermalResistanceJC);
      const rcs = parseFloat(thermalResistanceCS);
      const rsa = heatSinkResistance ? parseFloat(heatSinkResistance) : undefined;

      if (isNaN(p) || isNaN(tjMax) || isNaN(ta) || isNaN(rjc) || isNaN(rcs)) {
        setResult(null);
        return;
      }

      const res = calculateHeatSink(p, tjMax, ta, rjc, rcs, rsa);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [powerDissipation, maxJunctionTemp, ambientTemp, thermalResistanceJC, thermalResistanceCS, heatSinkResistance]);

  const reset = () => {
    setPowerDissipation('10');
    setMaxJunctionTemp('150');
    setAmbientTemp('25');
    setThermalResistanceJC('1');
    setThermalResistanceCS('0.5');
    setHeatSinkResistance('');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Heat Sink Calculator"
      description="Calculate required thermal resistance for heat sinks"
      formula="Tj = Ta + P × (Rjc + Rcs + Rsa)"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay
            label="Required Heat Sink Thermal Resistance"
            value={`≤ ${result.requiredThermalResistance.toFixed(2)} °C/W`}
            copyable
          />
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Junction Temp" value={`${result.junctionTemp.toFixed(1)}°C`} />
            <ResultDisplay label="Case Temp" value={`${result.caseTemp.toFixed(1)}°C`} />
            <ResultDisplay label="Heat Sink Temp" value={`${result.heatSinkTemp.toFixed(1)}°C`} />
            <ResultDisplay
              label="Safety Margin"
              value={`${result.safetyMargin.toFixed(1)}°C`}
              highlight={result.safetyMargin < 0}
            />
          </div>
          {result.safetyMargin < 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm text-red-700 dark:text-red-300">
                ⚠️ Warning: Junction temperature exceeds maximum! Use a better heat sink.
              </p>
            </div>
          )}
        </div>
      )}
    >
      <div className="space-y-4">
        <NumberInput id="power" label="Power Dissipation (W)" value={powerDissipation} onChange={setPowerDissipation} min={0.1} step={1} />
        <div className="grid grid-cols-2 gap-4">
          <NumberInput id="tj-max" label="Max Junction Temp (°C)" value={maxJunctionTemp} onChange={setMaxJunctionTemp} min={50} max={200} step={5} />
          <NumberInput id="ambient" label="Ambient Temp (°C)" value={ambientTemp} onChange={setAmbientTemp} min={-40} max={85} step={5} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <NumberInput id="rjc" label="Rjc - Junction to Case (°C/W)" value={thermalResistanceJC} onChange={setThermalResistanceJC} min={0} step={0.1} />
          <NumberInput id="rcs" label="Rcs - Case to Sink (°C/W)" value={thermalResistanceCS} onChange={setThermalResistanceCS} min={0} step={0.1} />
        </div>
        <NumberInput
          id="rsa"
          label="Heat Sink Resistance (°C/W) - Optional"
          value={heatSinkResistance}
          onChange={setHeatSinkResistance}
          min={0}
          step={0.5}
        />

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Thermal Interface Materials</p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Thermal paste:</strong> ~0.2-0.5 °C/W</p>
            <p><strong>Thermal pad:</strong> ~0.5-2 °C/W</p>
            <p><strong>Mica + grease:</strong> ~0.4-0.9 °C/W</p>
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default HeatSinkCalculator;
