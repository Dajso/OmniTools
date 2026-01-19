'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import {
  calculateDoF,
  formatDistance,
  COMMON_APERTURES,
  COMMON_FOCAL_LENGTHS,
  SENSOR_SIZE_NAMES,
  type SensorSize,
  type DoFResult,
} from '@/lib/calculations/photo/depth-of-field';

const SENSOR_OPTIONS = Object.entries(SENSOR_SIZE_NAMES).map(([value, label]) => ({
  value,
  label,
}));

const APERTURE_OPTIONS = COMMON_APERTURES.map(f => ({
  value: f.toString(),
  label: `f/${f}`,
}));

export function DepthOfFieldCalculator() {
  const [focalLength, setFocalLength] = React.useState(50);
  const [aperture, setAperture] = React.useState(2.8);
  const [subjectDistance, setSubjectDistance] = React.useState(3);
  const [sensorSize, setSensorSize] = React.useState<SensorSize>('full-frame');
  const [result, setResult] = React.useState<DoFResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const dofResult = calculateDoF({
        focalLength,
        aperture,
        subjectDistance,
        sensorSize,
      });
      setResult(dofResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [focalLength, aperture, subjectDistance, sensorSize]);

  const reset = () => {
    setFocalLength(50);
    setAperture(2.8);
    setSubjectDistance(3);
    setSensorSize('full-frame');
    setResult(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <CalculatorBase
      title="Depth of Field Calculator"
      description="Calculate depth of field based on focal length, aperture, and subject distance"
      formula="DoF = Far Focus - Near Focus"
      formulaExplanation="Depth of field depends on focal length, aperture, subject distance, and sensor size"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <ResultDisplay
            label="Total Depth of Field"
            value={formatDistance(result.totalDoF)}
            highlight
            copyable
          />
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="Near Focus"
              value={formatDistance(result.nearFocus)}
              copyable
            />
            <ResultDisplay
              label="Far Focus"
              value={formatDistance(result.farFocus)}
              copyable
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="DoF in Front"
              value={formatDistance(result.dofInFront)}
            />
            <ResultDisplay
              label="DoF Behind"
              value={formatDistance(result.dofBehind)}
            />
          </div>
          <ResultDisplay
            label="Hyperfocal Distance"
            value={formatDistance(result.hyperfocalDistance)}
            copyable
          />
          {result.isInfinityFocus && (
            <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
              Far focus extends to infinity. Everything beyond {formatDistance(result.nearFocus)} will be in focus.
            </div>
          )}
          <div className="bg-muted/50 p-3 rounded-md text-sm">
            <p className="font-medium mb-1">Circle of Confusion</p>
            <p className="text-muted-foreground">{result.circleOfConfusion} mm</p>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <NumberInput
          id="focal-length"
          label="Focal Length (mm)"
          value={focalLength}
          onChange={setFocalLength}
          min={1}
          max={1200}
          step={1}
        />
        <div className="flex gap-2 flex-wrap">
          {[24, 35, 50, 85, 135, 200].map(fl => (
            <button
              key={fl}
              type="button"
              onClick={() => setFocalLength(fl)}
              className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                focalLength === fl
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:bg-muted border-input'
              }`}
            >
              {fl}mm
            </button>
          ))}
        </div>

        <SelectInput
          id="aperture"
          label="Aperture"
          value={aperture.toString()}
          onChange={(v) => setAperture(parseFloat(v))}
          options={APERTURE_OPTIONS}
        />

        <NumberInput
          id="subject-distance"
          label="Subject Distance (meters)"
          value={subjectDistance}
          onChange={setSubjectDistance}
          min={0.1}
          max={1000}
          step={0.1}
        />

        <SelectInput
          id="sensor-size"
          label="Sensor Size"
          value={sensorSize}
          onChange={(v) => setSensorSize(v as SensorSize)}
          options={SENSOR_OPTIONS}
        />
      </div>
    </CalculatorBase>
  );
}

export default DepthOfFieldCalculator;
