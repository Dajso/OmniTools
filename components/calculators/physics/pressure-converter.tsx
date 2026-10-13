'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import {
  convertToAllUnits,
  PressureUnit,
  PRESSURE_UNIT_NAMES,
  PRESSURE_UNIT_SYMBOLS,
} from '@/lib/calculations/physics/pressure-converter';

const unitOptions = (Object.keys(PRESSURE_UNIT_NAMES) as PressureUnit[]).map((unit) => ({
  value: unit,
  label: `${PRESSURE_UNIT_NAMES[unit]} (${PRESSURE_UNIT_SYMBOLS[unit]})`,
}));

// Group units for organized display
const primaryUnits: PressureUnit[] = ['pa', 'kpa', 'mpa', 'bar', 'psi', 'atm'];
const secondaryUnits: PressureUnit[] = ['mbar', 'torr', 'mmhg', 'inhg', 'cmh2o', 'inh2o'];

function formatValue(value: number): string {
  if (value === 0) return '0';
  if (Math.abs(value) >= 1000000) {
    return value.toExponential(4);
  }
  if (Math.abs(value) >= 1000) {
    return value.toLocaleString('nb-NO', { maximumFractionDigits: 2 });
  }
  if (Math.abs(value) >= 1) {
    return value.toLocaleString('nb-NO', { maximumFractionDigits: 4 });
  }
  if (Math.abs(value) >= 0.0001) {
    return value.toLocaleString('nb-NO', { maximumFractionDigits: 6 });
  }
  return value.toExponential(4);
}

export function PressureConverter() {
  const [value, setValue] = React.useState<number>(1);
  const [sourceUnit, setSourceUnit] = React.useState<PressureUnit>('bar');
  const [conversions, setConversions] = React.useState<Record<PressureUnit, number> | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);

      if (value < 0) {
        setError('Trykket kan ikke være negativt (absolutt trykk)');
        setConversions(null);
        return;
      }

      const result = convertToAllUnits(value, sourceUnit);
      setConversions(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Omregningsfeil');
      setConversions(null);
    }
  }, [value, sourceUnit]);

  const reset = () => {
    setValue(1);
    setSourceUnit('bar');
    setConversions(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <CalculatorBase
      title="Trykkomregner"
      description="Regn om trykk mellom bar, psi, pascal, atmosfærer og flere enheter"
      formula="Omregning via pascal (SI-grunnenheten)"
      formulaExplanation="Alle trykk regnes om via pascal (Pa) som grunnenhet. Fyll inn en verdi og velg enheten du har, så får du den i alle andre enheter."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={conversions && (
        <div className="space-y-6">
          {/* Primary Units */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Vanlige enheter</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {primaryUnits.map((unit) => (
                <ResultDisplay
                  key={unit}
                  label={PRESSURE_UNIT_NAMES[unit]}
                  value={`${formatValue(conversions[unit])} ${PRESSURE_UNIT_SYMBOLS[unit]}`}
                  highlight={unit === sourceUnit}
                  copyable
                />
              ))}
            </div>
          </div>

          {/* Secondary Units */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Flere enheter</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {secondaryUnits.map((unit) => (
                <ResultDisplay
                  key={unit}
                  label={PRESSURE_UNIT_NAMES[unit]}
                  value={`${formatValue(conversions[unit])} ${PRESSURE_UNIT_SYMBOLS[unit]}`}
                  highlight={unit === sourceUnit}
                  copyable
                />
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Den uthevede verdien er enheten du fylte inn
          </p>
        </div>
      )}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            id="pressure-value"
            label="Trykk"
            value={value}
            onChange={setValue}
            placeholder="Fyll inn trykk"
            min={0}
            step={0.01}
          />
          <SelectInput
            id="source-unit"
            label="Fra enhet"
            value={sourceUnit}
            onChange={(val) => setSourceUnit(val as PressureUnit)}
            options={unitOptions}
          />
        </div>

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Typiske trykk</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>• Normalt lufttrykk: 101 325 Pa = 1 atm</div>
            <div>• Bildekk: ca. 2,2 bar (32 psi)</div>
            <div>• Blodtrykk (systolisk): ca. 120 mmHg</div>
            <div>• Havdyp (1000 m): ca. 100 atm</div>
          </div>
        </div>

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Sammenhenger mellom enhetene</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            <div>1 bar = 100 000 Pa</div>
            <div>1 atm = 101 325 Pa</div>
            <div>1 psi ≈ 6 894,76 Pa</div>
            <div>1 torr ≈ 133,32 Pa</div>
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default PressureConverter;
