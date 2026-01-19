'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import {
  calculateConcreteSlab,
  estimateConcreteTrucks,
  SLAB_THICKNESS_PRESETS,
  REBAR_SPACING_PRESETS,
  type ConcreteSlabResult,
  type DimensionUnit,
} from '@/lib/calculations/construction/concrete-slab-calculator';

/**
 * Options for dimension unit dropdown
 */
const dimensionUnitOptions = [
  { value: 'feet', label: 'Feet' },
  { value: 'inches', label: 'Inches' },
  { value: 'meters', label: 'Meters' },
];

/**
 * Options for thickness unit dropdown
 */
const thicknessUnitOptions = [
  { value: 'inches', label: 'Inches' },
  { value: 'feet', label: 'Feet' },
];

/**
 * Options for slab thickness presets dropdown
 */
const thicknessPresetOptions = [
  { value: '', label: 'Custom thickness' },
  { value: '4', label: '4" - Sidewalk/Patio/Garage' },
  { value: '5', label: '5" - Driveway' },
  { value: '6', label: '6" - Heavy Duty/Industrial' },
  { value: '8', label: '8" - Foundation' },
];

/**
 * Options for rebar spacing presets dropdown
 */
const rebarSpacingOptions = [
  { value: '', label: 'No rebar' },
  { value: '12', label: '12" on center (Heavy Duty)' },
  { value: '16', label: '16" on center (Standard)' },
  { value: '18', label: '18" on center (Medium)' },
  { value: '24', label: '24" on center (Light Duty)' },
];

/**
 * Concrete Slab Calculator Component
 * 
 * Calculates concrete volume, bags needed, and rebar estimation for slab projects.
 * Supports multiple units and includes waste percentage calculation.
 * 
 * @see Requirements 32.4 - Concrete Slab Calculator with rebar estimation
 */
export function ConcreteSlabCalculator() {
  // Input state
  const [length, setLength] = React.useState<string>('10');
  const [width, setWidth] = React.useState<string>('12');
  const [dimensionUnit, setDimensionUnit] = React.useState<string>('feet');
  const [selectedThicknessPreset, setSelectedThicknessPreset] = React.useState<string>('4');
  const [customThickness, setCustomThickness] = React.useState<string>('4');
  const [thicknessUnit, setThicknessUnit] = React.useState<string>('inches');
  const [selectedRebarSpacing, setSelectedRebarSpacing] = React.useState<string>('16');
  const [wastePercentage, setWastePercentage] = React.useState<string>('10');
  
  // Result state
  const [result, setResult] = React.useState<ConcreteSlabResult | null>(null);
  const [truckEstimate, setTruckEstimate] = React.useState<ReturnType<typeof estimateConcreteTrucks> | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  /**
   * Handle thickness preset selection
   */
  const handleThicknessPresetChange = (value: string) => {
    setSelectedThicknessPreset(value);
    if (value) {
      setCustomThickness(value);
      setThicknessUnit('inches');
    }
  };

  /**
   * Calculate concrete slab based on current inputs
   */
  const calculate = React.useCallback(() => {
    try {
      setError(undefined);

      const lengthVal = parseFloat(length);
      const widthVal = parseFloat(width);
      const thicknessVal = parseFloat(customThickness);
      const wasteVal = parseFloat(wastePercentage) || 10;
      const rebarSpacingVal = selectedRebarSpacing ? parseFloat(selectedRebarSpacing) : undefined;

      // Validate inputs
      if (isNaN(lengthVal) || lengthVal <= 0) {
        setResult(null);
        setTruckEstimate(null);
        return;
      }
      if (isNaN(widthVal) || widthVal <= 0) {
        setResult(null);
        setTruckEstimate(null);
        return;
      }
      if (isNaN(thicknessVal) || thicknessVal <= 0) {
        setResult(null);
        setTruckEstimate(null);
        return;
      }

      const res = calculateConcreteSlab({
        length: lengthVal,
        width: widthVal,
        thickness: thicknessVal,
        dimensionUnit: dimensionUnit as DimensionUnit,
        thicknessUnit: thicknessUnit as DimensionUnit,
        rebarSpacing: rebarSpacingVal,
        wastePercentage: wasteVal,
      });

      setResult(res);
      setTruckEstimate(estimateConcreteTrucks(res.volumeWithWasteCubicYards));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
      setTruckEstimate(null);
    }
  }, [length, width, customThickness, dimensionUnit, thicknessUnit, selectedRebarSpacing, wastePercentage]);

  /**
   * Reset all inputs to defaults
   */
  const reset = () => {
    setLength('10');
    setWidth('12');
    setDimensionUnit('feet');
    setSelectedThicknessPreset('4');
    setCustomThickness('4');
    setThicknessUnit('inches');
    setSelectedRebarSpacing('16');
    setWastePercentage('10');
    setResult(null);
    setTruckEstimate(null);
    setError(undefined);
  };

  // Auto-calculate when inputs change
  React.useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <CalculatorBase
      title="Concrete Slab Calculator"
      description="Calculate concrete volume, bags needed, and rebar estimation for slab projects"
      formula="Volume (cu yd) = (Length × Width × Thickness) / 27"
      formulaExplanation="Where all dimensions are converted to feet. One cubic yard equals 27 cubic feet. Includes waste percentage for spillage and uneven ground."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          {/* Main Volume Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultDisplay
              label="Concrete Volume"
              value={result.formattedVolumeCubicYards}
              highlight
              copyable
            />
            <ResultDisplay
              label="Volume with Waste"
              value={result.formattedVolumeWithWaste}
              highlight
              copyable
            />
          </div>

          {/* Bags Needed */}
          <div className="bg-muted/50 p-4 rounded-md">
            <p className="text-sm font-medium mb-3">Bags Needed (with {result.wastePercentage}% waste)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-background p-3 rounded-md border">
                <p className="text-xs text-muted-foreground mb-1">60 lb Bags</p>
                <p className="text-2xl font-bold">{result.bagsNeeded.bags60lb}</p>
                <p className="text-xs text-muted-foreground">({result.bagsNeeded.coverage60lb} cu ft each)</p>
              </div>
              <div className="bg-background p-3 rounded-md border">
                <p className="text-xs text-muted-foreground mb-1">80 lb Bags</p>
                <p className="text-2xl font-bold">{result.bagsNeeded.bags80lb}</p>
                <p className="text-xs text-muted-foreground">({result.bagsNeeded.coverage80lb} cu ft each)</p>
              </div>
            </div>
          </div>

          {/* Rebar Estimation */}
          {result.rebarEstimation && (
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-md border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium mb-3 text-blue-800 dark:text-blue-200">
                Rebar Estimation ({result.rebarEstimation.formattedSpacing})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Lengthwise Pieces:</span>{' '}
                  <span className="font-medium">{result.rebarEstimation.lengthwisePieces}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Widthwise Pieces:</span>{' '}
                  <span className="font-medium">{result.rebarEstimation.widthwisePieces}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Pieces:</span>{' '}
                  <span className="font-bold">{result.rebarEstimation.totalPieces}</span>
                </div>
                <div className="col-span-2 sm:col-span-3 pt-2 border-t border-blue-200 dark:border-blue-700">
                  <span className="text-muted-foreground">Total Linear Feet:</span>{' '}
                  <span className="font-bold">{result.rebarEstimation.totalLinearFeet.toFixed(1)} ft</span>
                </div>
              </div>
            </div>
          )}

          {/* Ready-Mix Truck Estimate */}
          {truckEstimate && (
            <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-md border border-amber-200 dark:border-amber-800">
              <p className="text-sm font-medium mb-2 text-amber-800 dark:text-amber-200">
                Ready-Mix Concrete Delivery
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                {truckEstimate.recommendation}
              </p>
              {truckEstimate.totalTrucks > 0 && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Trucks needed:</span>{' '}
                  <span className="font-medium">{truckEstimate.totalTrucks}</span>
                  {truckEstimate.partialLoad > 0 && (
                    <span className="text-muted-foreground"> (includes {truckEstimate.partialLoad.toFixed(2)} cu yd partial load)</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Dimensions Summary */}
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Slab Dimensions</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Length:</span>{' '}
                <span className="font-medium">{result.dimensions.length.toFixed(2)} ft</span>
              </div>
              <div>
                <span className="text-muted-foreground">Width:</span>{' '}
                <span className="font-medium">{result.dimensions.width.toFixed(2)} ft</span>
              </div>
              <div>
                <span className="text-muted-foreground">Thickness:</span>{' '}
                <span className="font-medium">{(result.dimensions.thickness * 12).toFixed(1)}"</span>
              </div>
              <div>
                <span className="text-muted-foreground">Area:</span>{' '}
                <span className="font-medium">{result.formattedArea}</span>
              </div>
            </div>
          </div>

          {/* Volume Reference */}
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Volume Reference</p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Cubic Feet:</span>{' '}
                <span className="font-medium">{result.volumeCubicFeet.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Cubic Yards:</span>{' '}
                <span className="font-medium">{result.volumeCubicYards.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Cubic Meters:</span>{' '}
                <span className="font-medium">{result.volumeCubicMeters.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        {/* Dimension Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumberInput
            id="length"
            label="Length"
            value={length}
            onChange={(v) => setLength(v.toString())}
            placeholder="length"
            min={0.1}
            step={0.5}
          />
          <NumberInput
            id="width"
            label="Width"
            value={width}
            onChange={(v) => setWidth(v.toString())}
            placeholder="width"
            min={0.1}
            step={0.5}
          />
          <SelectInput
            id="dimensionUnit"
            label="Unit"
            value={dimensionUnit}
            onChange={setDimensionUnit}
            options={dimensionUnitOptions}
          />
        </div>

        {/* Thickness Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SelectInput
            id="thicknessPreset"
            label="Slab Type"
            value={selectedThicknessPreset}
            onChange={handleThicknessPresetChange}
            options={thicknessPresetOptions}
          />
          <NumberInput
            id="thickness"
            label="Thickness"
            value={customThickness}
            onChange={(v) => {
              setCustomThickness(v.toString());
              setSelectedThicknessPreset('');
            }}
            placeholder="thickness"
            min={0.5}
            step={0.5}
          />
          <SelectInput
            id="thicknessUnit"
            label="Thickness Unit"
            value={thicknessUnit}
            onChange={setThicknessUnit}
            options={thicknessUnitOptions}
          />
        </div>

        {/* Rebar and Waste */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectInput
            id="rebarSpacing"
            label="Rebar Spacing"
            value={selectedRebarSpacing}
            onChange={setSelectedRebarSpacing}
            options={rebarSpacingOptions}
          />
          <NumberInput
            id="wastePercentage"
            label="Waste Percentage"
            value={wastePercentage}
            onChange={(v) => setWastePercentage(v.toString())}
            placeholder="%"
            min={0}
            max={50}
            step={1}
            unit="%"
          />
        </div>

        {/* Info Box */}
        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Thickness Guidelines</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li><strong>4"</strong> - Sidewalks, patios, garage floors</li>
            <li><strong>5-6"</strong> - Driveways, heavy foot traffic areas</li>
            <li><strong>6"</strong> - Heavy duty, industrial applications</li>
            <li><strong>8"+</strong> - Foundations, structural slabs</li>
          </ul>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default ConcreteSlabCalculator;
