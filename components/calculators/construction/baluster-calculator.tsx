'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import {
  calculateBalusterSpacing,
  BALUSTER_WIDTH_PRESETS,
  type BalusterResult,
  type BalusterUnit,
} from '@/lib/calculations/construction/baluster-calculator';

/**
 * Options for baluster width presets dropdown
 */
const balusterWidthOptions = [
  { value: '', label: 'Custom width' },
  { value: '1.5', label: '2×2 Lumber (1.5" actual) - Most Common' },
  { value: '1.25', label: 'Standard Square (1.25")' },
  { value: '1', label: 'Round Metal (1")' },
  { value: '0.75', label: 'Square Metal (3/4")' },
  { value: '0.625', label: 'Round Metal (5/8")' },
];

/**
 * Options for unit of measurement
 */
const unitOptions = [
  { value: 'inches', label: 'Inches' },
  { value: 'cm', label: 'Centimeters' },
  { value: 'mm', label: 'Millimeters' },
];

/**
 * Common railing span presets
 */
const spanPresetOptions = [
  { value: '', label: 'Custom span' },
  { value: '24', label: '24" (2 feet)' },
  { value: '30', label: '30" (2.5 feet)' },
  { value: '36', label: '36" (3 feet)' },
  { value: '42', label: '42" (3.5 feet)' },
  { value: '48', label: '48" (4 feet)' },
  { value: '60', label: '60" (5 feet)' },
  { value: '72', label: '72" (6 feet)' },
  { value: '84', label: '84" (7 feet)' },
  { value: '96', label: '96" (8 feet)' },
];

/**
 * Baluster Spacing Calculator Component
 * 
 * Calculates the optimal number of balusters and spacing for railings
 * while ensuring compliance with the 4-inch sphere rule (building code
 * requirement that gaps between balusters must not exceed 4 inches).
 * 
 * @see Requirements 32.3, 32.7 - Baluster Spacing Calculator for code compliance
 */
export function BalusterCalculator() {
  // Input state
  const [selectedSpanPreset, setSelectedSpanPreset] = React.useState<string>('36');
  const [customSpan, setCustomSpan] = React.useState<string>('36');
  const [selectedBalusterWidth, setSelectedBalusterWidth] = React.useState<string>('1.5');
  const [customBalusterWidth, setCustomBalusterWidth] = React.useState<string>('1.5');
  const [unit, setUnit] = React.useState<string>('inches');
  const [postWidth, setPostWidth] = React.useState<string>('');
  
  // Result state
  const [result, setResult] = React.useState<BalusterResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  /**
   * Handle span preset selection
   */
  const handleSpanPresetChange = (value: string) => {
    setSelectedSpanPreset(value);
    if (value) {
      setCustomSpan(value);
    }
  };

  /**
   * Handle baluster width preset selection
   */
  const handleBalusterWidthChange = (value: string) => {
    setSelectedBalusterWidth(value);
    if (value) {
      setCustomBalusterWidth(value);
    }
  };

  /**
   * Calculate baluster spacing based on current inputs
   */
  const calculate = React.useCallback(() => {
    try {
      setError(undefined);

      const totalWidth = parseFloat(customSpan);
      const balusterWidth = parseFloat(customBalusterWidth);
      const postWidthVal = postWidth ? parseFloat(postWidth) : undefined;

      // Validate inputs
      if (isNaN(totalWidth) || totalWidth <= 0) {
        setResult(null);
        return;
      }
      if (isNaN(balusterWidth) || balusterWidth <= 0) {
        setResult(null);
        return;
      }
      if (balusterWidth >= totalWidth) {
        setError('Baluster width must be less than total span');
        setResult(null);
        return;
      }

      const res = calculateBalusterSpacing({
        totalWidth,
        balusterWidth,
        postWidth: postWidthVal,
        unit: unit as BalusterUnit,
        optimizeSpacing: true,
      });

      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [customSpan, customBalusterWidth, unit, postWidth]);

  /**
   * Reset all inputs to defaults
   */
  const reset = () => {
    setSelectedSpanPreset('36');
    setCustomSpan('36');
    setSelectedBalusterWidth('1.5');
    setCustomBalusterWidth('1.5');
    setUnit('inches');
    setPostWidth('');
    setResult(null);
    setError(undefined);
  };

  // Auto-calculate when inputs change
  React.useEffect(() => {
    calculate();
  }, [calculate]);

  /**
   * Get unit abbreviation for display
   */
  const getUnitAbbrev = () => {
    switch (unit) {
      case 'mm': return 'mm';
      case 'cm': return 'cm';
      default: return '"';
    }
  };

  return (
    <CalculatorBase
      title="Baluster Spacing Calculator"
      description="Calculate baluster spacing for code-compliant railings"
      formula="Gap = (Total Width - (Balusters × Baluster Width)) / (Balusters + 1)"
      formulaExplanation="The 4-inch sphere rule (IRC R312.1.3) requires that gaps between balusters must not exceed 4 inches to prevent children from getting their heads stuck."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          {/* Code Compliance Status */}
          <div className={`p-4 rounded-md border ${
            result.isCodeCompliant 
              ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
          }`}>
            <p className={`text-sm font-medium ${
              result.isCodeCompliant 
                ? 'text-green-800 dark:text-green-200' 
                : 'text-red-800 dark:text-red-200'
            }`}>
              {result.complianceMessage}
            </p>
          </div>

          {/* Main Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultDisplay
              label="Number of Balusters"
              value={result.numberOfBalusters.toString()}
              highlight
              copyable
            />
            <ResultDisplay
              label="Gap Between Balusters"
              value={result.formattedSpacing}
              highlight
              copyable
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultDisplay
              label="Center-to-Center Spacing"
              value={result.formattedCenterToCenter}
              copyable
            />
            <ResultDisplay
              label="Post-to-Baluster Gap"
              value={result.formattedPostToBalusterGap}
              copyable
            />
          </div>

          {/* Layout Breakdown */}
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Layout Breakdown</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Total Span:</span>{' '}
                <span className="font-medium">{result.totalWidth}{getUnitAbbrev()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Baluster Width:</span>{' '}
                <span className="font-medium">{result.balusterWidth}{getUnitAbbrev()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Baluster Width:</span>{' '}
                <span className="font-medium">{result.layout.totalBalusterWidth.toFixed(2)}{getUnitAbbrev()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Gap Width:</span>{' '}
                <span className="font-medium">{result.layout.totalGapWidth.toFixed(2)}{getUnitAbbrev()}</span>
              </div>
            </div>
          </div>

          {/* Visual Layout */}
          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-md border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium mb-3 text-blue-800 dark:text-blue-200">
              Installation Layout
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-gray-400 rounded-sm" title="Post"></span>
                <span className="text-muted-foreground">Post</span>
                <span className="mx-2">→</span>
                <span className="font-mono">{result.formattedPostToBalusterGap}</span>
                <span className="mx-2">→</span>
                <span className="w-3 h-4 bg-amber-600 rounded-sm" title="Baluster"></span>
                <span className="text-muted-foreground">First Baluster</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-4 bg-amber-600 rounded-sm" title="Baluster"></span>
                <span className="text-muted-foreground">Baluster</span>
                <span className="mx-2">→</span>
                <span className="font-mono">{result.formattedSpacing}</span>
                <span className="mx-2">→</span>
                <span className="w-3 h-4 bg-amber-600 rounded-sm" title="Baluster"></span>
                <span className="text-muted-foreground">Next Baluster</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Repeat {result.numberOfBalusters - 1} times between balusters, then {result.formattedPostToBalusterGap} to the end post.
              </p>
            </div>
          </div>

          {/* Maximum Gap Reference */}
          <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-md border border-amber-200 dark:border-amber-800">
            <p className="text-sm font-medium mb-2 text-amber-800 dark:text-amber-200">
              4-Inch Sphere Rule (IRC R312.1.3)
            </p>
            <p className="text-sm text-muted-foreground">
              Building codes require that a 4-inch sphere cannot pass through any opening in a guard or railing. 
              This means the gap between balusters must be less than 4 inches ({result.maxAllowedGap.toFixed(2)}{getUnitAbbrev()} in your selected unit).
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <SelectInput
          id="unit"
          label="Unit of Measurement"
          value={unit}
          onChange={setUnit}
          options={unitOptions}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectInput
            id="spanPreset"
            label="Common Span Lengths"
            value={selectedSpanPreset}
            onChange={handleSpanPresetChange}
            options={spanPresetOptions}
          />
          <NumberInput
            id="totalWidth"
            label="Total Span (between posts)"
            value={customSpan}
            onChange={(v) => {
              setCustomSpan(v.toString());
              setSelectedSpanPreset('');
            }}
            placeholder={unit}
            min={1}
            step={0.5}
            unit={getUnitAbbrev()}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectInput
            id="balusterWidthPreset"
            label="Baluster Type"
            value={selectedBalusterWidth}
            onChange={handleBalusterWidthChange}
            options={balusterWidthOptions}
          />
          <NumberInput
            id="balusterWidth"
            label="Baluster Width"
            value={customBalusterWidth}
            onChange={(v) => {
              setCustomBalusterWidth(v.toString());
              setSelectedBalusterWidth('');
            }}
            placeholder={unit}
            min={0.1}
            step={0.125}
            unit={getUnitAbbrev()}
          />
        </div>

        <NumberInput
          id="postWidth"
          label="Post Width (optional, for reference)"
          value={postWidth}
          onChange={(v) => setPostWidth(v.toString())}
          placeholder={unit}
          min={0}
          step={0.5}
          unit={getUnitAbbrev()}
        />

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Measuring Tips</p>
          <p className="text-xs text-muted-foreground">
            Measure the <strong>clear span</strong> between the inside edges of your posts. 
            This is the area that will be filled with balusters. Do not include the post widths in this measurement.
          </p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default BalusterCalculator;
