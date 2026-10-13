'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { formatFixed } from '@/lib/utils/formatting';

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
      setError(err instanceof Error ? err.message : 'Feil i beregningen');
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

  // Wrapper functions to convert number to string for state
  const handlePowerChange = (v: number) => setPowerDissipation(String(v));
  const handleTjMaxChange = (v: number) => setMaxJunctionTemp(String(v));
  const handleAmbientChange = (v: number) => setAmbientTemp(String(v));
  const handleRjcChange = (v: number) => setThermalResistanceJC(String(v));
  const handleRcsChange = (v: number) => setThermalResistanceCS(String(v));
  const handleRsaChange = (v: number) => setHeatSinkResistance(v === 0 ? '' : String(v));

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Kjøleribbe"
      description="Regn ut nødvendig termisk motstand for kjøleribbe"
      formula="Tj = Ta + P × (Rjc + Rcs + Rsa)"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay
            label="Nødvendig termisk motstand for kjøleribben"
            value={`≤ ${formatFixed(result.requiredThermalResistance, 2)} °C/W`}
            copyable
          />
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Temperatur i halvlederen" value={`${formatFixed(result.junctionTemp, 1)}°C`} />
            <ResultDisplay label="Kapslingstemperatur" value={`${formatFixed(result.caseTemp, 1)}°C`} />
            <ResultDisplay label="Kjøleribbetemperatur" value={`${formatFixed(result.heatSinkTemp, 1)}°C`} />
            <ResultDisplay
              label="Sikkerhetsmargin"
              value={`${formatFixed(result.safetyMargin, 1)}°C`}
              highlight={result.safetyMargin < 0}
            />
          </div>
          {result.safetyMargin < 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm text-red-700 dark:text-red-300">
                ⚠️ Advarsel: Temperaturen i halvlederen overstiger maksimum! Bruk en bedre kjøleribbe.
              </p>
            </div>
          )}
        </div>
      )}
    >
      <div className="space-y-4">
        <NumberInput id="power" label="Avgitt effekt (W)" value={powerDissipation} onChange={handlePowerChange} min={0.1} step={1} />
        <div className="grid grid-cols-2 gap-4">
          <NumberInput id="tj-max" label="Maks temperatur i halvlederen (°C)" value={maxJunctionTemp} onChange={handleTjMaxChange} min={50} max={200} step={5} />
          <NumberInput id="ambient" label="Omgivelsestemperatur (°C)" value={ambientTemp} onChange={handleAmbientChange} min={-40} max={85} step={5} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <NumberInput id="rjc" label="Rjc – halvleder til kapsling (°C/W)" value={thermalResistanceJC} onChange={handleRjcChange} min={0} step={0.1} />
          <NumberInput id="rcs" label="Rcs – kapsling til kjøleribbe (°C/W)" value={thermalResistanceCS} onChange={handleRcsChange} min={0} step={0.1} />
        </div>
        <NumberInput
          id="rsa"
          label="Kjøleribbens motstand (°C/W) – valgfritt"
          value={heatSinkResistance}
          onChange={handleRsaChange}
          min={0}
          step={0.5}
        />

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Varmeledende materialer</p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Varmepasta:</strong> ~0,2–0,5 °C/W</p>
            <p><strong>Varmepute:</strong> ~0,5–2 °C/W</p>
            <p><strong>Glimmer og fett:</strong> ~0,4–0,9 °C/W</p>
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default HeatSinkCalculator;
