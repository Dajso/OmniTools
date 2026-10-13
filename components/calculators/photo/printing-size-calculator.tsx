'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Card } from '@/components/ui/card';
import { formatFixed } from '@/lib/utils/formatting';

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

const QUALITY_NAMES: Record<PrintResult['quality'], string> = {
  excellent: 'UTMERKET',
  good: 'GOD',
  acceptable: 'BRUKBAR',
  poor: 'LAV',
};

const DPI_PRESETS = [
  { value: 300, label: '300 DPI (profesjonelt trykk)' },
  { value: 240, label: '240 DPI (høy kvalitet)' },
  { value: 150, label: '150 DPI (vanlig kvalitet)' },
  { value: 72, label: '72 DPI (nett/skjerm)' },
];

// Størrelser i cm (bredde × høyde)
const PRINT_SIZE_PRESETS = [
  { name: '10×15 cm', width: 10, height: 15 },
  { name: '13×18 cm', width: 13, height: 18 },
  { name: 'A5 (14,8×21)', width: 14.8, height: 21 },
  { name: 'A4 (21×29,7)', width: 21, height: 29.7 },
  { name: 'A3 (29,7×42)', width: 29.7, height: 42 },
  { name: '30×40 cm', width: 30, height: 40 },
  { name: '50×70 cm', width: 50, height: 70 },
  { name: '70×100 cm', width: 70, height: 100 },
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
    qualityDescription = 'Profesjonell kvalitet, egnet for nærbetraktning';
  } else if (targetDpi >= 200) {
    quality = 'good';
    qualityDescription = 'God kvalitet for de fleste utskrifter';
  } else if (targetDpi >= 150) {
    quality = 'acceptable';
    qualityDescription = 'Brukbart når bildet ses på en armlengdes avstand';
  } else {
    quality = 'poor';
    qualityDescription = 'Passer bare til store utskrifter som ses på avstand';
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
  printWidthCm: number,
  printHeightCm: number,
  targetDpi: number
): { widthPx: number; heightPx: number; megapixels: number } {
  const widthPx = Math.ceil((printWidthCm / 2.54) * targetDpi);
  const heightPx = Math.ceil((printHeightCm / 2.54) * targetDpi);
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
  const [printWidth, setPrintWidth] = React.useState(30);
  const [printHeight, setPrintHeight] = React.useState(40);
  const [targetDpi, setTargetDpi] = React.useState(300);
  const [result, setResult] = React.useState<PrintResult | null>(null);
  const [requiredPixels, setRequiredPixels] = React.useState<{ widthPx: number; heightPx: number; megapixels: number } | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      
      if (mode === 'fromPixels') {
        if (widthPx <= 0 || heightPx <= 0) {
          setError('Målene må være større enn 0');
          setResult(null);
          return;
        }
        const printResult = calculatePrintSize(widthPx, heightPx, targetDpi);
        setResult(printResult);
        setRequiredPixels(null);
      } else {
        if (printWidth <= 0 || printHeight <= 0) {
          setError('Utskriftsmålene må være større enn 0');
          setRequiredPixels(null);
          return;
        }
        const pixels = calculateRequiredPixels(printWidth, printHeight, targetDpi);
        setRequiredPixels(pixels);
        setResult(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
      setResult(null);
      setRequiredPixels(null);
    }
  }, [mode, widthPx, heightPx, printWidth, printHeight, targetDpi]);

  const reset = () => {
    setMode('fromPixels');
    setWidthPx(6000);
    setHeightPx(4000);
    setPrintWidth(30);
    setPrintHeight(40);
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
      title="Utskriftsstørrelse"
      description="Regn ut største utskriftsstørrelse ut fra bildets oppløsning, eller hvor mange piksler du trenger til en bestemt størrelse"
      formula="Utskriftsstørrelse = piksler ÷ DPI"
      formulaExplanation="Høyere DPI gir skarpere utskrift, men mindre maksimal størrelse"
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={
        <>
          {result && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <ResultDisplay
                  label="Største størrelse (cm)"
                  value={`${formatFixed(result.maxWidthCm, 1)} × ${formatFixed(result.maxHeightCm, 1)} cm`}
                  highlight
                  copyable
                />
                <ResultDisplay
                  label="Største størrelse (tommer)"
                  value={`${formatFixed(result.maxWidthInches, 1)}" × ${formatFixed(result.maxHeightInches, 1)}"`}
                  copyable
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ResultDisplay
                  label="Bildeoppløsning"
                  value={`${formatFixed(result.megapixels, 1)} MP`}
                />
                <ResultDisplay
                  label="Utskrifts-DPI"
                  value={result.actualDpi.toString()}
                />
              </div>
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm font-medium mb-1">
                  Kvalitet: <span className={getQualityColor(result.quality)}>{QUALITY_NAMES[result.quality]}</span>
                </p>
                <p className="text-sm text-muted-foreground">{result.qualityDescription}</p>
              </div>
            </div>
          )}
          {requiredPixels && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <ResultDisplay
                  label="Nødvendig bredde"
                  value={`${requiredPixels.widthPx.toLocaleString('nb-NO')} px`}
                  highlight
                  copyable
                />
                <ResultDisplay
                  label="Nødvendig høyde"
                  value={`${requiredPixels.heightPx.toLocaleString('nb-NO')} px`}
                  highlight
                  copyable
                />
              </div>
              <ResultDisplay
                label="Nødvendig oppløsning"
                value={`${formatFixed(requiredPixels.megapixels, 2)} MP`}
              />
              <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
                For en {formatFixed(printWidth, 1)} × {formatFixed(printHeight, 1)} cm utskrift ved {targetDpi} DPI trenger du minst {formatFixed(requiredPixels.megapixels, 2)} megapiksler.
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
            Fra bildestørrelse
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
            Fra utskriftsstørrelse
          </button>
        </div>

        {mode === 'fromPixels' ? (
          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              id="width-px"
              label="Bildebredde (piksler)"
              value={widthPx}
              onChange={setWidthPx}
              min={1}
              max={100000}
              step={1}
            />
            <NumberInput
              id="height-px"
              label="Bildehøyde (piksler)"
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
              label="Utskriftsbredde (cm)"
              value={printWidth}
              onChange={setPrintWidth}
              min={1}
              max={500}
              step={1}
            />
            <NumberInput
              id="print-height"
              label="Utskriftshøyde (cm)"
              value={printHeight}
              onChange={setPrintHeight}
              min={1}
              max={500}
              step={1}
            />
          </div>
        )}

        <SelectInput
          id="target-dpi"
          label="Ønsket DPI"
          value={targetDpi.toString()}
          onChange={(v) => setTargetDpi(parseInt(v))}
          options={DPI_PRESETS.map(p => ({ value: p.value.toString(), label: p.label }))}
        />

        {mode === 'fromPrint' && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Vanlige utskriftsstørrelser</p>
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
          <p className="font-medium mb-2">DPI-veiledning:</p>
          <ul className="space-y-1">
            <li>• 300 DPI: profesjonelle utskrifter, nærbetraktning</li>
            <li>• 240 DPI: høy kvalitet på utskrifter hjemme</li>
            <li>• 150 DPI: store utskrifter som ses på avstand</li>
            <li>• 72 DPI: bare til skjermvisning</li>
          </ul>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default PrintingSizeCalculator;
