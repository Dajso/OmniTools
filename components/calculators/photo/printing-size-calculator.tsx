'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Card } from '@/components/ui/card';

interface PrintResult {
  maxWidthInches: number;
  maxHeightInches: number;
  maxWidthCm: number;
  maxHeightCm: number;
  quality: 'excellent' | 'good' | 'acceptable' | 'poor';
  qualityDescription: string;
  megapixels: number;
  actualDpi: number;
}

const DPI_PRESETS = [
  { value: 300, label: '300 DPI (Professional Print)' },
  { value: 240, label: '240 DPI (High Quality)' },
  { value: 150, label: '150 DPI (Standard Quality)' },
  { value: 72, label: '72 DPI (Web/Screen)' },
];

const PRINT_SIZE_PRESETS = [
  { name: '4×6"', width: 4, height: 6 },
  { name: '5×7"', width: 5, height: 7 },
  { name: '8×10"', width: 8, height: 10 },
  { name: '11×14"', width: 11, height: 14 },
  { name: '16×20"', width: 16, height: 20 },
  { name: '24×36"', width: 24, height: 36 },
];

function calculatePrintSize(
  widthPx: number,
  heightPx: number,
  targetDpi: number
): PrintResult {
  const maxWidthInches = widthPx / targetDpi;
  const maxHeightInches = heightPx / targetDpi;
  const maxWidthCm = maxWidthInches * 2.54;
  const maxHeightCm = maxHeightInches * 2.54;
  const megapixels = (widthPx * heightPx) / 1000000;

  let quality: PrintResult['quality'];
  let qualityDescription: string;

  if (targetDpi >= 300) {
    quality = 'excellent';
    qualityDescription = 'Professional quality, suitable for close viewing';
  } else if (targetDpi >= 200) {
    quality = 'good';
    qualityDescription = 'Good quality for most prints';
  } else if (targetDpi >= 150) {
    quality = 'acceptable';
    qualityDescription = 'Acceptable for viewing at arm\'s length';
  } else {
    quality = 'poor';
    qualityDescription = 'Only suitable for large prints viewed from distance';
  }

  return {
    maxWidthInches: Math.round(maxWidthInches * 100) / 100,
    maxHeightInches: Math.round(maxHeightInches * 100) / 100,
    maxWidthCm: Math.round(maxWidthCm * 100) / 100,
    maxHeightCm: Math.round(maxHeightCm * 100) / 100,
    quality,
    qualityDescription,
    megapixels: Math.round(megapixels * 100) / 100,
    actualDpi: targetDpi,
  };
}

function calculateRequiredPixels(
  printWidthInches: number,
  printHeightInches: number,
  targetDpi: number
): { widthPx: number; heightPx: number; megapixels: number } {
  const widthPx = Math.ceil(printWidthInches * targetDpi);
  const heightPx = Math.ceil(printHeightInches * targetDpi);
  const megapixels = (widthPx * heightPx) / 1000000;

  return {
    widthPx,
    heightPx,
    megapixels: Math.round(megapixels * 100) / 100,
  };
}

export function PrintingSizeCalculator() {
  const [mode, setMode] = React.useState<'fromPixels' | 'fromPrint'>('fromPixels');
  const [widthPx, setWidthPx] = React.useState(6000);
  const [heightPx, setHeightPx] = React.useState(4000);
  const [printWidth, setPrintWidth] = React.useState(8);
  const [printHeight, setPrintHeight] = React.useState(10);
  const [targetDpi, setTargetDpi] = React.useState(300);
  const [result, setResult] = React.useState<PrintResult | null>(null);
  const [requiredPixels, setRequiredPixels] = React.useState<{ widthPx: number; heightPx: number; megapixels: number } | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      
      if (mode === 'fromPixels') {
        if (widthPx <= 0 || heightPx <= 0) {
          setError('Dimensions must be positive');
          setResult(null);
          return;
        }
        const printResult = calculatePrintSize(widthPx, heightPx, targetDpi);
        setResult(printResult);
        setRequiredPixels(null);
      } else {
        if (printWidth <= 0 || printHeight <= 0) {
          setError('Print dimensions must be positive');
          setRequiredPixels(null);
          return;
        }
        const pixels = calculateRequiredPixels(printWidth, printHeight, targetDpi);
        setRequiredPixels(pixels);
        setResult(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
      setRequiredPixels(null);
    }
  }, [mode, widthPx, heightPx, printWidth, printHeight, targetDpi]);

  const reset = () => {
    setMode('fromPixels');
    setWidthPx(6000);
    setHeightPx(4000);
    setPrintWidth(8);
    setPrintHeight(10);
    setTargetDpi(300);
    setResult(null);
    setRequiredPixels(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const getQualityColor = (quality: PrintResult['quality']) => {
    switch (quality) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'acceptable': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
    }
  };

  return (
    <CalculatorBase
      title="Printing Size Calculator"
      description="Calculate maximum print size from image resolution or required pixels for a print size"
      formula="Print Size = Pixels ÷ DPI"
      formulaExplanation="Higher DPI means sharper prints but smaller maximum size"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={
        <>
          {result && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <ResultDisplay
                  label="Max Print Size (inches)"
                  value={`${result.maxWidthInches}" × ${result.maxHeightInches}"`}
                  highlight
                  copyable
                />
                <ResultDisplay
                  label="Max Print Size (cm)"
                  value={`${result.maxWidthCm} × ${result.maxHeightCm} cm`}
                  copyable
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ResultDisplay
                  label="Image Resolution"
                  value={`${result.megapixels} MP`}
                />
                <ResultDisplay
                  label="Print DPI"
                  value={result.actualDpi.toString()}
                />
              </div>
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm font-medium mb-1">
                  Quality: <span className={getQualityColor(result.quality)}>{result.quality.toUpperCase()}</span>
                </p>
                <p className="text-sm text-muted-foreground">{result.qualityDescription}</p>
              </div>
            </div>
          )}
          {requiredPixels && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <ResultDisplay
                  label="Required Width"
                  value={`${requiredPixels.widthPx.toLocaleString()} px`}
                  highlight
                  copyable
                />
                <ResultDisplay
                  label="Required Height"
                  value={`${requiredPixels.heightPx.toLocaleString()} px`}
                  highlight
                  copyable
                />
              </div>
              <ResultDisplay
                label="Required Resolution"
                value={`${requiredPixels.megapixels} MP`}
              />
              <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
                For a {printWidth}" × {printHeight}" print at {targetDpi} DPI, you need at least {requiredPixels.megapixels} megapixels.
              </div>
            </div>
          )}
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('fromPixels')}
            className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
              mode === 'fromPixels'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background hover:bg-muted border-input'
            }`}
          >
            From Image Size
          </button>
          <button
            type="button"
            onClick={() => setMode('fromPrint')}
            className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
              mode === 'fromPrint'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background hover:bg-muted border-input'
            }`}
          >
            From Print Size
          </button>
        </div>

        {mode === 'fromPixels' ? (
          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              id="width-px"
              label="Image Width (pixels)"
              value={widthPx}
              onChange={setWidthPx}
              min={1}
              max={100000}
              step={1}
            />
            <NumberInput
              id="height-px"
              label="Image Height (pixels)"
              value={heightPx}
              onChange={setHeightPx}
              min={1}
              max={100000}
              step={1}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              id="print-width"
              label="Print Width (inches)"
              value={printWidth}
              onChange={setPrintWidth}
              min={0.1}
              max={100}
              step={0.5}
            />
            <NumberInput
              id="print-height"
              label="Print Height (inches)"
              value={printHeight}
              onChange={setPrintHeight}
              min={0.1}
              max={100}
              step={0.5}
            />
          </div>
        )}

        <SelectInput
          id="target-dpi"
          label="Target DPI"
          value={targetDpi.toString()}
          onChange={(v) => setTargetDpi(parseInt(v))}
          options={DPI_PRESETS.map(p => ({ value: p.value.toString(), label: p.label }))}
        />

        {mode === 'fromPrint' && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Common Print Sizes</p>
            <div className="grid grid-cols-3 gap-2">
              {PRINT_SIZE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setPrintWidth(preset.width);
                    setPrintHeight(preset.height);
                  }}
                  className="px-3 py-2 text-xs rounded-md border bg-background hover:bg-muted border-input transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t pt-4 text-sm text-muted-foreground">
          <p className="font-medium mb-2">DPI Guidelines:</p>
          <ul className="space-y-1">
            <li>• 300 DPI: Professional prints, close viewing</li>
            <li>• 240 DPI: High quality home prints</li>
            <li>• 150 DPI: Large prints viewed from distance</li>
            <li>• 72 DPI: Screen display only</li>
          </ul>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default PrintingSizeCalculator;
