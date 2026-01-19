'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';

interface PCBTraceResult {
  width: number;
  widthMils: number;
  area: number;
  resistance: number;
  voltageDrop: number;
  powerLoss: number;
}

function calculatePCBTrace(
  current: number,
  tempRise: number,
  copperWeight: number,
  traceLength: number,
  isExternal: boolean
): PCBTraceResult {
  // IPC-2221 formula for trace width
  // Area = (I / (k × ΔT^b))^(1/c)
  // k, b, c are constants from IPC-2221
  const k = isExternal ? 0.048 : 0.024;
  const b = 0.44;
  const c = 0.725;

  // Calculate required cross-sectional area in mils²
  const area = Math.pow(current / (k * Math.pow(tempRise, b)), 1 / c);

  // Convert copper weight (oz/ft²) to thickness in mils
  // 1 oz/ft² = 1.37 mils
  const thickness = copperWeight * 1.37;

  // Calculate width in mils
  const widthMils = area / thickness;

  // Convert to mm
  const width = widthMils * 0.0254;

  // Calculate resistance (copper resistivity at 20°C = 1.7×10⁻⁸ Ω·m)
  const resistivity = 1.7e-8;
  const areaM2 = (area * 0.0254 * 0.0254) / 1e6; // Convert mils² to m²
  const lengthM = traceLength / 1000; // Convert mm to m
  const resistance = (resistivity * lengthM) / areaM2;

  // Calculate voltage drop and power loss
  const voltageDrop = current * resistance;
  const powerLoss = current * current * resistance;

  return { width, widthMils, area, resistance, voltageDrop, powerLoss };
}

export function PCBTraceCalculator() {
  const [current, setCurrent] = React.useState('1');
  const [tempRise, setTempRise] = React.useState('10');
  const [copperWeight, setCopperWeight] = React.useState('1');
  const [traceLength, setTraceLength] = React.useState('100');
  const [layer, setLayer] = React.useState('external');
  const [result, setResult] = React.useState<PCBTraceResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const i = parseFloat(current);
      const dt = parseFloat(tempRise);
      const oz = parseFloat(copperWeight);
      const len = parseFloat(traceLength);

      if (isNaN(i) || isNaN(dt) || isNaN(oz) || isNaN(len)) {
        setResult(null);
        return;
      }

      const res = calculatePCBTrace(i, dt, oz, len, layer === 'external');
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [current, tempRise, copperWeight, traceLength, layer]);

  const reset = () => {
    setCurrent('1');
    setTempRise('10');
    setCopperWeight('1');
    setTraceLength('100');
    setLayer('external');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="PCB Trace Width Calculator"
      description="Calculate minimum trace width for a given current (IPC-2221)"
      formula="Based on IPC-2221 standard"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay label="Minimum Trace Width" value={`${result.width.toFixed(3)} mm (${result.widthMils.toFixed(1)} mils)`} copyable />
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Cross-Section Area" value={`${result.area.toFixed(1)} mils²`} />
            <ResultDisplay label="Trace Resistance" value={`${(result.resistance * 1000).toFixed(3)} mΩ`} />
            <ResultDisplay label="Voltage Drop" value={`${(result.voltageDrop * 1000).toFixed(2)} mV`} />
            <ResultDisplay label="Power Loss" value={`${(result.powerLoss * 1000).toFixed(3)} mW`} />
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <NumberInput id="current" label="Current (A)" value={current} onChange={setCurrent} min={0.1} step={0.5} />
        <NumberInput id="temp-rise" label="Temperature Rise (°C)" value={tempRise} onChange={setTempRise} min={1} max={100} step={5} />
        <SelectInput
          id="copper-weight"
          label="Copper Weight"
          value={copperWeight}
          onChange={setCopperWeight}
          options={[
            { value: '0.5', label: '0.5 oz/ft² (17µm)' },
            { value: '1', label: '1 oz/ft² (35µm)' },
            { value: '2', label: '2 oz/ft² (70µm)' },
            { value: '3', label: '3 oz/ft² (105µm)' },
          ]}
        />
        <SelectInput
          id="layer"
          label="Layer Type"
          value={layer}
          onChange={setLayer}
          options={[
            { value: 'external', label: 'External (outer layer)' },
            { value: 'internal', label: 'Internal (inner layer)' },
          ]}
        />
        <NumberInput id="trace-length" label="Trace Length (mm)" value={traceLength} onChange={setTraceLength} min={1} step={10} />
      </div>
    </CalculatorBase>
  );
}

export default PCBTraceCalculator;
