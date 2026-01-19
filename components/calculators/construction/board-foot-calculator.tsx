'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import {
  calculateBoardFeet,
  calculateBoardFeetFromNominal,
  NOMINAL_TO_ACTUAL,
  type BoardFootResult,
} from '@/lib/calculations/construction/board-foot-calculator';

/**
 * Options for nominal lumber sizes dropdown
 */
const nominalSizeOptions = [
  { value: '', label: 'Custom dimensions' },
  ...Object.keys(NOMINAL_TO_ACTUAL).map((size) => {
    const actual = NOMINAL_TO_ACTUAL[size];
    return {
      value: size,
      label: `${size.toUpperCase()} (${actual.thickness}" × ${actual.width}" actual)`,
    };
  }),
];

/**
 * Common lumber lengths in feet
 */
const lengthOptions = [
  { value: '', label: 'Custom length' },
  { value: '6', label: '6 feet' },
  { value: '8', label: '8 feet' },
  { value: '10', label: '10 feet' },
  { value: '12', label: '12 feet' },
  { value: '14', label: '14 feet' },
  { value: '16', label: '16 feet' },
  { value: '18', label: '18 feet' },
  { value: '20', label: '20 feet' },
];

/**
 * Board Foot Calculator Component
 * 
 * Calculates board feet for lumber pricing and estimation.
 * Supports both nominal lumber sizes (2x4, 2x6, etc.) and custom dimensions.
 * 
 * @see Requirements 32.1 - Board Foot Calculator for lumber pricing
 */
export function BoardFootCalculator() {
  // Input state
  const [nominalSize, setNominalSize] = React.useState<string>('');
  const [thickness, setThickness] = React.useState<string>('');
  const [width, setWidth] = React.useState<string>('');
  const [selectedLength, setSelectedLength] = React.useState<string>('8');
  const [customLength, setCustomLength] = React.useState<string>('');
  const [quantity, setQuantity] = React.useState<string>('1');
  const [pricePerBoardFoot, setPricePerBoardFoot] = React.useState<string>('');
  
  // Result state
  const [result, setResult] = React.useState<BoardFootResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  /**
   * Handle nominal size selection
   * Updates thickness and width when a preset is selected
   */
  const handleNominalSizeChange = (value: string) => {
    setNominalSize(value);
    if (value && NOMINAL_TO_ACTUAL[value]) {
      const actual = NOMINAL_TO_ACTUAL[value];
      setThickness(actual.thickness.toString());
      setWidth(actual.width.toString());
    }
  };

  /**
   * Handle length selection
   */
  const handleLengthChange = (value: string) => {
    setSelectedLength(value);
    if (value) {
      setCustomLength(value);
    }
  };

  /**
   * Calculate board feet based on current inputs
   */
  const calculate = React.useCallback(() => {
    try {
      setError(undefined);

      const thicknessVal = parseFloat(thickness);
      const widthVal = parseFloat(width);
      const lengthVal = parseFloat(customLength || selectedLength);
      const quantityVal = parseInt(quantity, 10) || 1;
      const priceVal = pricePerBoardFoot ? parseFloat(pricePerBoardFoot) : undefined;

      // Validate inputs
      if (isNaN(thicknessVal) || thicknessVal <= 0) {
        setResult(null);
        return;
      }
      if (isNaN(widthVal) || widthVal <= 0) {
        setResult(null);
        return;
      }
      if (isNaN(lengthVal) || lengthVal <= 0) {
        setResult(null);
        return;
      }

      const res = calculateBoardFeet({
        thickness: thicknessVal,
        width: widthVal,
        length: lengthVal,
        lengthUnit: 'feet',
        quantity: quantityVal,
        pricePerBoardFoot: priceVal,
      });

      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [thickness, width, customLength, selectedLength, quantity, pricePerBoardFoot]);

  /**
   * Reset all inputs to defaults
   */
  const reset = () => {
    setNominalSize('');
    setThickness('');
    setWidth('');
    setSelectedLength('8');
    setCustomLength('');
    setQuantity('1');
    setPricePerBoardFoot('');
    setResult(null);
    setError(undefined);
  };

  // Auto-calculate when inputs change
  React.useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <CalculatorBase
      title="Board Foot Calculator"
      description="Calculate board feet for lumber pricing and estimation"
      formula="Board Feet = (Thickness × Width × Length) / 12"
      formulaExplanation="Where thickness and width are in inches, and length is in feet. One board foot equals 144 cubic inches (1 ft × 1 ft × 1 in)."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultDisplay
              label="Board Feet per Piece"
              value={result.formattedBoardFeet}
              highlight
              copyable
            />
            <ResultDisplay
              label="Total Board Feet"
              value={result.formattedTotalBoardFeet}
              highlight={result.quantity > 1}
              copyable
            />
          </div>

          {result.totalPrice !== undefined && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ResultDisplay
                label="Price per Piece"
                value={`$${result.formattedPricePerPiece}`}
                copyable
              />
              <ResultDisplay
                label="Total Price"
                value={`$${result.formattedTotalPrice}`}
                highlight
                copyable
              />
            </div>
          )}

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Dimensions Used</p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Thickness:</span>{' '}
                <span className="font-medium">{result.dimensions.thickness}"</span>
              </div>
              <div>
                <span className="text-muted-foreground">Width:</span>{' '}
                <span className="font-medium">{result.dimensions.width}"</span>
              </div>
              <div>
                <span className="text-muted-foreground">Length:</span>{' '}
                <span className="font-medium">{result.dimensions.length}'</span>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Volume Reference</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Cubic Inches:</span>{' '}
                <span className="font-medium">{result.volumeCubicInches.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Cubic Feet:</span>{' '}
                <span className="font-medium">{result.volumeCubicFeet.toFixed(4)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <SelectInput
          id="nominalSize"
          label="Nominal Lumber Size"
          value={nominalSize}
          onChange={handleNominalSizeChange}
          options={nominalSizeOptions}
        />

        <p className="text-sm text-muted-foreground">
          {nominalSize ? 'Dimensions auto-filled from nominal size:' : 'Or enter custom dimensions:'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            id="thickness"
            label="Thickness (actual)"
            value={thickness}
            onChange={(v) => {
              setThickness(v.toString());
              if (nominalSize) setNominalSize('');
            }}
            placeholder="inches"
            min={0.1}
            step={0.25}
            unit="in"
          />
          <NumberInput
            id="width"
            label="Width (actual)"
            value={width}
            onChange={(v) => {
              setWidth(v.toString());
              if (nominalSize) setNominalSize('');
            }}
            placeholder="inches"
            min={0.1}
            step={0.25}
            unit="in"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectInput
            id="selectedLength"
            label="Common Length"
            value={selectedLength}
            onChange={handleLengthChange}
            options={lengthOptions}
          />
          <NumberInput
            id="customLength"
            label="Length"
            value={customLength || selectedLength}
            onChange={(v) => {
              setCustomLength(v.toString());
              setSelectedLength('');
            }}
            placeholder="feet"
            min={0.1}
            step={1}
            unit="ft"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            id="quantity"
            label="Quantity"
            value={quantity}
            onChange={(v) => setQuantity(Math.max(1, Math.round(v)).toString())}
            placeholder="pieces"
            min={1}
            step={1}
          />
          <NumberInput
            id="pricePerBoardFoot"
            label="Price per Board Foot (optional)"
            value={pricePerBoardFoot}
            onChange={(v) => setPricePerBoardFoot(v.toString())}
            placeholder="$/BF"
            min={0}
            step={0.01}
            unit="$"
          />
        </div>

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Nominal vs Actual Sizes</p>
          <p className="text-xs text-muted-foreground">
            Lumber is sold by nominal size (e.g., 2×4), but actual dimensions are smaller after drying and planing.
            A 2×4 is actually 1.5" × 3.5". This calculator uses actual dimensions for accurate board foot calculations.
          </p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default BoardFootCalculator;
