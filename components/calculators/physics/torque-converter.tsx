'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import {
  convertTorqueToAllUnits,
  TorqueUnit,
  TORQUE_UNIT_NAMES,
  TORQUE_UNIT_SYMBOLS,
} from '@/lib/calculations/physics/torque-converter';

const unitOptions = (Object.keys(TORQUE_UNIT_NAMES) as TorqueUnit[]).map((unit) => ({
  value: unit,
  label: `${TORQUE_UNIT_NAMES[unit]} (${TORQUE_UNIT_SYMBOLS[unit]})`,
}));

// Group units for organized display
const primaryUnits: TorqueUnit[] = ['nm', 'knm', 'ftlb', 'inlb', 'kgm'];
const secondaryUnits: TorqueUnit[] = ['kgcm', 'gcm', 'dyncm', 'ozin'];

function formatValue(value: number): string {
  if (value === 0) return '0';
  if (Math.abs(value) >= 1000000) {
    return value.toExponential(4);
  }
  if (Math.abs(value) >= 1000) {
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
  if (Math.abs(value) >= 1) {
    return value.toLocaleString(undefined, { maximumFractionDigits: 4 });
  }
  if (Math.abs(value) >= 0.0001) {
    return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
  }
  return value.toExponential(4);
}

export function TorqueConverter() {
  const [value, setValue] = React.useState<number>(100);
  const [sourceUnit, setSourceUnit] = React.useState<TorqueUnit>('nm');
  const [conversions, setConversions] = React.useState<Record<TorqueUnit, number> | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);

      const result = convertTorqueToAllUnits(value, sourceUnit);
      setConversions(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion error');
      setConversions(null);
    }
  }, [value, sourceUnit]);

  const reset = () => {
    setValue(100);
    setSourceUnit('nm');
    setConversions(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <CalculatorBase
      title="Torque Converter"
      description="Convert torque between different units including Newton-meter, Foot-pound, Kilogram-meter, and more"
      formula="Conversion via Newton-meter (SI base unit)"
      formulaExplanation="All torque values are converted through Newton-meter (N·m) as the base unit. Enter a value and select the source unit to see conversions to all other units."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={conversions && (
        <div className="space-y-6">
          {/* Primary Units */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Common Units</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {primaryUnits.map((unit) => (
                <ResultDisplay
                  key={unit}
                  label={TORQUE_UNIT_NAMES[unit]}
                  value={`${formatValue(conversions[unit])} ${TORQUE_UNIT_SYMBOLS[unit]}`}
                  highlight={unit === sourceUnit}
                  copyable
                />
              ))}
            </div>
          </div>

          {/* Secondary Units */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Additional Units</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {secondaryUnits.map((unit) => (
                <ResultDisplay
                  key={unit}
                  label={TORQUE_UNIT_NAMES[unit]}
                  value={`${formatValue(conversions[unit])} ${TORQUE_UNIT_SYMBOLS[unit]}`}
                  highlight={unit === sourceUnit}
                  copyable
                />
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Highlighted value is your input unit
          </p>
        </div>
      )}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            id="torque-value"
            label="Torque Value"
            value={value}
            onChange={setValue}
            placeholder="Enter torque value"
            step={0.01}
          />
          <SelectInput
            id="source-unit"
            label="Source Unit"
            value={sourceUnit}
            onChange={(val) => setSourceUnit(val as TorqueUnit)}
            options={unitOptions}
          />
        </div>

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Common Torque References</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>• Car wheel lug nut: ~110 N·m (~80 ft-lb)</div>
            <div>• Bicycle pedal: ~35 N·m</div>
            <div>• Spark plug: ~20 N·m</div>
            <div>• High-perf engine: ~500 N·m</div>
          </div>
        </div>

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Unit Relationships</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            <div>1 N·m ≈ 0.7376 ft-lb</div>
            <div>1 ft-lb ≈ 1.3558 N·m</div>
            <div>1 N·m ≈ 8.8507 in-lb</div>
            <div>1 kg·m ≈ 9.8067 N·m</div>
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default TorqueConverter;
