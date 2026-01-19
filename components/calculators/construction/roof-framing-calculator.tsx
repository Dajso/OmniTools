'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import {
  calculateRoofFraming,
  COMMON_PITCHES,
  COMMON_RAFTER_SPACINGS,
  type RoofFramingResult,
} from '@/lib/calculations/construction/roof-framing-calculator';

/**
 * Options for common roof pitch presets dropdown
 */
const pitchPresetOptions = [
  { value: '', label: 'Custom pitch' },
  { value: '2', label: '2:12 - Low slope (minimum for shingles)' },
  { value: '4', label: '4:12 - Moderate (common residential)' },
  { value: '6', label: '6:12 - Standard (most common residential)' },
  { value: '8', label: '8:12 - Steep (good for snow shedding)' },
  { value: '10', label: '10:12 - Very steep (dramatic appearance)' },
  { value: '12', label: '12:12 - 45° angle (maximum common pitch)' },
];

/**
 * Options for rafter spacing dropdown
 */
const rafterSpacingOptions = [
  { value: '12', label: '12" on center' },
  { value: '16', label: '16" on center (most common)' },
  { value: '24', label: '24" on center' },
];

/**
 * Options for common overhang presets dropdown
 */
const overhangPresetOptions = [
  { value: '', label: 'Custom overhang' },
  { value: '0', label: 'No overhang' },
  { value: '6', label: '6" - Minimal' },
  { value: '12', label: '12" (1 foot) - Standard' },
  { value: '18', label: '18" - Extended' },
  { value: '24', label: '24" (2 feet) - Large' },
];

/**
 * Roof Framing Calculator Component
 * 
 * Calculates roof framing dimensions including rafter length, ridge height,
 * number of rafters, and common rafter cut angles.
 * 
 * @see Requirements 32.5 - Roof Framing Calculator
 */
export function RoofFramingCalculator() {
  // Input state
  const [span, setSpan] = React.useState<string>('24');
  const [selectedPitchPreset, setSelectedPitchPreset] = React.useState<string>('6');
  const [customPitch, setCustomPitch] = React.useState<string>('6');
  const [rafterSpacing, setRafterSpacing] = React.useState<string>('16');
  const [selectedOverhangPreset, setSelectedOverhangPreset] = React.useState<string>('12');
  const [customOverhang, setCustomOverhang] = React.useState<string>('12');
  const [buildingLength, setBuildingLength] = React.useState<string>('40');
  
  // Result state
  const [result, setResult] = React.useState<RoofFramingResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  /**
   * Handle pitch preset selection
   */
  const handlePitchPresetChange = (value: string) => {
    setSelectedPitchPreset(value);
    if (value) {
      setCustomPitch(value);
    }
  };

  /**
   * Handle overhang preset selection
   */
  const handleOverhangPresetChange = (value: string) => {
    setSelectedOverhangPreset(value);
    if (value) {
      setCustomOverhang(value);
    }
  };

  /**
   * Calculate roof framing based on current inputs
   */
  const calculate = React.useCallback(() => {
    try {
      setError(undefined);

      const spanVal = parseFloat(span);
      const pitchVal = parseFloat(customPitch);
      const spacingVal = parseFloat(rafterSpacing);
      const overhangVal = parseFloat(customOverhang);
      const lengthVal = buildingLength ? parseFloat(buildingLength) : undefined;

      // Validate inputs
      if (isNaN(spanVal) || spanVal <= 0) {
        setResult(null);
        return;
      }
      if (isNaN(pitchVal) || pitchVal < 0) {
        setResult(null);
        return;
      }
      if (isNaN(spacingVal) || spacingVal <= 0) {
        setResult(null);
        return;
      }
      if (isNaN(overhangVal) || overhangVal < 0) {
        setResult(null);
        return;
      }

      const res = calculateRoofFraming({
        span: spanVal,
        pitch: pitchVal,
        rafterSpacing: spacingVal,
        overhang: overhangVal,
        buildingLength: lengthVal && !isNaN(lengthVal) && lengthVal > 0 ? lengthVal : undefined,
      });

      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [span, customPitch, rafterSpacing, customOverhang, buildingLength]);

  /**
   * Reset all inputs to defaults
   */
  const reset = () => {
    setSpan('24');
    setSelectedPitchPreset('6');
    setCustomPitch('6');
    setRafterSpacing('16');
    setSelectedOverhangPreset('12');
    setCustomOverhang('12');
    setBuildingLength('40');
    setResult(null);
    setError(undefined);
  };

  // Auto-calculate when inputs change
  React.useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <CalculatorBase
      title="Roof Framing Calculator"
      description="Calculate rafter length, ridge height, cut angles, and number of rafters for roof framing"
      formula="Rafter Length = √(Run² + Rise²)"
      formulaExplanation="Where Run = Span/2 and Rise = Run × (Pitch/12). The pitch is expressed as rise per 12 inches of run (e.g., 6:12 means 6 inches rise per 12 inches run)."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          {/* Main Rafter Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultDisplay
              label="Rafter Length (to ridge)"
              value={result.formattedRafterLength}
              highlight
              copyable
            />
            <ResultDisplay
              label="Total Rafter Length (with overhang)"
              value={result.formattedTotalRafterLength}
              highlight
              copyable
            />
          </div>

          {/* Ridge Height and Slope */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultDisplay
              label="Ridge Height"
              value={result.formattedRidgeHeight}
              copyable
            />
            <ResultDisplay
              label="Roof Slope"
              value={`${result.pitchRatio} (${result.formattedSlopeAngle})`}
              copyable
            />
          </div>

          {/* Rafter Count */}
          {result.totalRafters !== undefined && (
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-md border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium mb-3 text-blue-800 dark:text-blue-200">
                Rafter Count
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground text-sm">Per Side:</span>{' '}
                  <span className="font-bold text-lg">{result.raftersPerSide}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">Total (both sides):</span>{' '}
                  <span className="font-bold text-lg">{result.totalRafters}</span>
                </div>
              </div>
            </div>
          )}

          {/* Rafter Cut Angles */}
          <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-md border border-amber-200 dark:border-amber-800">
            <p className="text-sm font-medium mb-3 text-amber-800 dark:text-amber-200">
              Rafter Cut Angles
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
              <div className="bg-background p-3 rounded-md border">
                <p className="text-xs text-muted-foreground mb-1">Plumb Cut (Ridge & Tail)</p>
                <p className="text-xl font-bold">{result.rafterCuts.formattedPlumbCut}</p>
              </div>
              <div className="bg-background p-3 rounded-md border">
                <p className="text-xs text-muted-foreground mb-1">Seat Cut (Bird&apos;s Mouth)</p>
                <p className="text-xl font-bold">{result.rafterCuts.formattedSeatCut}</p>
              </div>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Framing Square Setup:</span>{' '}
              <span className="font-medium">{result.rafterCuts.framingSquareSetup}</span>
            </div>
          </div>

          {/* Dimensions Summary */}
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Calculated Dimensions</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Run:</span>{' '}
                <span className="font-medium">{(result.run / 12).toFixed(2)} ft</span>
              </div>
              <div>
                <span className="text-muted-foreground">Rise:</span>{' '}
                <span className="font-medium">{(result.rise / 12).toFixed(2)} ft</span>
              </div>
              <div>
                <span className="text-muted-foreground">Overhang Length:</span>{' '}
                <span className="font-medium">{result.overhangRafterLength.toFixed(2)}"</span>
              </div>
              <div>
                <span className="text-muted-foreground">Unit Rafter Length:</span>{' '}
                <span className="font-medium">{result.unitRafterLength.toFixed(3)}"/ft</span>
              </div>
            </div>
          </div>

          {/* Input Summary */}
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Input Summary</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Span:</span>{' '}
                <span className="font-medium">{result.input.span} ft</span>
              </div>
              <div>
                <span className="text-muted-foreground">Pitch:</span>{' '}
                <span className="font-medium">{result.pitchRatio}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Spacing:</span>{' '}
                <span className="font-medium">{result.input.rafterSpacing}" OC</span>
              </div>
              <div>
                <span className="text-muted-foreground">Overhang:</span>{' '}
                <span className="font-medium">{result.input.overhang}"</span>
              </div>
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        {/* Span Input */}
        <NumberInput
          id="span"
          label="Building Span (wall to wall)"
          value={span}
          onChange={(v) => setSpan(v.toString())}
          placeholder="feet"
          min={1}
          max={100}
          step={1}
          unit="ft"
        />

        {/* Pitch Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectInput
            id="pitchPreset"
            label="Roof Pitch Preset"
            value={selectedPitchPreset}
            onChange={handlePitchPresetChange}
            options={pitchPresetOptions}
          />
          <NumberInput
            id="customPitch"
            label="Pitch (rise per 12&quot; run)"
            value={customPitch}
            onChange={(v) => {
              setCustomPitch(v.toString());
              setSelectedPitchPreset('');
            }}
            placeholder="e.g., 6 for 6:12"
            min={0}
            max={24}
            step={0.5}
            unit=":12"
          />
        </div>

        {/* Rafter Spacing */}
        <SelectInput
          id="rafterSpacing"
          label="Rafter Spacing"
          value={rafterSpacing}
          onChange={setRafterSpacing}
          options={rafterSpacingOptions}
        />

        {/* Overhang Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectInput
            id="overhangPreset"
            label="Overhang Preset"
            value={selectedOverhangPreset}
            onChange={handleOverhangPresetChange}
            options={overhangPresetOptions}
          />
          <NumberInput
            id="customOverhang"
            label="Overhang (horizontal)"
            value={customOverhang}
            onChange={(v) => {
              setCustomOverhang(v.toString());
              setSelectedOverhangPreset('');
            }}
            placeholder="inches"
            min={0}
            max={48}
            step={1}
            unit="in"
          />
        </div>

        {/* Building Length (optional) */}
        <NumberInput
          id="buildingLength"
          label="Building Length (optional, for rafter count)"
          value={buildingLength}
          onChange={(v) => setBuildingLength(v.toString())}
          placeholder="feet"
          min={1}
          step={1}
          unit="ft"
        />

        {/* Info Box */}
        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Roof Pitch Guide</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li><strong>2:12 to 4:12</strong> - Low slope, requires special roofing materials</li>
            <li><strong>4:12 to 6:12</strong> - Moderate slope, standard asphalt shingles</li>
            <li><strong>6:12 to 9:12</strong> - Standard residential, good water/snow shedding</li>
            <li><strong>9:12 to 12:12</strong> - Steep slope, dramatic appearance, difficult to walk on</li>
          </ul>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default RoofFramingCalculator;
