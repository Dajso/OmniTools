'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Card } from '@/components/ui/card';
import {
  calculateEquivalentFocalLength,
  getAllEquivalentFocalLengths,
  getLensCategory,
  SENSOR_FORMATS,
  LENS_CATEGORY_DESCRIPTIONS,
  COMMON_FOCAL_LENGTHS,
  formatFocalLength,
  formatFieldOfView,
  type FocalLengthResult,
} from '@/lib/calculations/photo/focal-length-calculator';

const SENSOR_OPTIONS = Object.entries(SENSOR_FORMATS).map(([key, format]) => ({
  value: key,
  label: `${format.name} (${format.cropFactor}×)`,
}));

const FOCAL_LENGTH_PRESETS = [14, 24, 35, 50, 85, 135, 200];

export function FocalLengthCalculator() {
  const [focalLength, setFocalLength] = React.useState(50);
  const [sourceFormat, setSourceFormat] = React.useState('full-frame');
  const [targetFormat, setTargetFormat] = React.useState('aps-c-nikon');
  const [result, setResult] = React.useState<FocalLengthResult | null>(null);
  const [allEquivalents, setAllEquivalents] = React.useState<Record<string, number> | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      const focalResult = calculateEquivalentFocalLength(
        focalLength,
        sourceFormat as keyof typeof SENSOR_FORMATS,
        targetFormat as keyof typeof SENSOR_FORMATS
      );
      setResult(focalResult);

      const equivalents = getAllEquivalentFocalLengths(
        focalLength,
        sourceFormat as keyof typeof SENSOR_FORMATS
      );
      setAllEquivalents(equivalents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
      setAllEquivalents(null);
    }
  }, [focalLength, sourceFormat, targetFormat]);

  const reset = () => {
    setFocalLength(50);
    setSourceFormat('full-frame');
    setTargetFormat('aps-c-nikon');
    setResult(null);
    setAllEquivalents(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const lensCategory = result ? getLensCategory(result.equivalentFocalLength) : null;

  return (
    <CalculatorBase
      title="Focal Length Calculator"
      description="Calculate equivalent focal lengths across different sensor sizes"
      formula="Equivalent FL = Actual FL × Crop Factor"
      formulaExplanation="Convert focal lengths between sensor formats to understand field of view equivalence"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay
              label="35mm Equivalent"
              value={`${result.equivalentFocalLength}mm`}
              highlight
              copyable
            />
            <ResultDisplay
              label={`On ${SENSOR_FORMATS[targetFormat as keyof typeof SENSOR_FORMATS]?.name.split(' ')[0]}`}
              value={`${result.convertedFocalLength}mm`}
              highlight
              copyable
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <ResultDisplay
              label="Horizontal FoV"
              value={formatFieldOfView(result.horizontalFoV)}
            />
            <ResultDisplay
              label="Vertical FoV"
              value={formatFieldOfView(result.verticalFoV)}
            />
            <ResultDisplay
              label="Diagonal FoV"
              value={formatFieldOfView(result.diagonalFoV)}
            />
          </div>

          {lensCategory && (
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm font-medium mb-1">
                Lens Category: <span className="text-primary capitalize">{lensCategory.replace('-', ' ')}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {LENS_CATEGORY_DESCRIPTIONS[lensCategory]}
              </p>
            </div>
          )}

          {/* All Equivalents Table */}
          {allEquivalents && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3">Equivalent Focal Lengths</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(SENSOR_FORMATS).slice(0, 6).map(([key, format]) => (
                  <div key={key} className="flex justify-between p-2 bg-muted/30 rounded">
                    <span className="text-muted-foreground">{format.name.split(' ')[0]}:</span>
                    <span className="font-medium">{allEquivalents[key]}mm</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
          max={2000}
          step={1}
        />
        <div className="flex gap-2 flex-wrap">
          {FOCAL_LENGTH_PRESETS.map(fl => (
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
          id="source-format"
          label="Your Camera Sensor"
          value={sourceFormat}
          onChange={setSourceFormat}
          options={SENSOR_OPTIONS}
        />

        <SelectInput
          id="target-format"
          label="Compare To"
          value={targetFormat}
          onChange={setTargetFormat}
          options={SENSOR_OPTIONS}
        />

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Common Focal Lengths</p>
          <div className="space-y-2">
            {COMMON_FOCAL_LENGTHS.slice(0, 6).map((item) => (
              <Card
                key={item.focalLength}
                className="p-2 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setFocalLength(item.focalLength)}
              >
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">{item.focalLength}mm</span>
                  <span className="text-muted-foreground text-xs">{item.use}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default FocalLengthCalculator;
