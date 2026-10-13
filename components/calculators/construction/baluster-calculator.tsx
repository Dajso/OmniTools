'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import {
  calculateBalusterSpacing,
  type BalusterResult,
  type BalusterUnit,
} from '@/lib/calculations/construction/baluster-calculator';

/**
 * Options for baluster width presets dropdown
 */
const balusterWidthOptions = [
  { value: '', label: 'Egendefinert bredde' },
  { value: '36', label: 'Trespile 36 × 36 mm – vanligst' },
  { value: '30', label: 'Firkantpile i metall (30 mm)' },
  { value: '25', label: 'Rundt metallrør (25 mm)' },
  { value: '20', label: 'Firkantpile i metall (20 mm)' },
  { value: '16', label: 'Rund pile i metall (16 mm)' },
];

/**
 * Vanlige lengder (mm) mellom stolper
 */
const spanPresetOptions = [
  { value: '', label: 'Egendefinert' },
  { value: '600', label: '600 mm' },
  { value: '900', label: '900 mm' },
  { value: '1200', label: '1 200 mm' },
  { value: '1500', label: '1 500 mm' },
  { value: '1800', label: '1 800 mm' },
  { value: '2400', label: '2 400 mm' },
  { value: '3000', label: '3 000 mm' },
];

/**
 * Kalkulator for spiler i rekkverk: antall og mellomrom med største åpning 100 mm (TEK17).
 */
export function BalusterCalculator() {
  // Input state
  const [selectedSpanPreset, setSelectedSpanPreset] = React.useState<string>('1800');
  const [customSpan, setCustomSpan] = React.useState<string>('1800');
  const [selectedBalusterWidth, setSelectedBalusterWidth] = React.useState<string>('36');
  const [customBalusterWidth, setCustomBalusterWidth] = React.useState<string>('36');
  const unit = 'mm';
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
        setError('Spilebredden må være mindre enn total åpning');
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
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
      setResult(null);
    }
  }, [customSpan, customBalusterWidth, unit, postWidth]);

  /**
   * Reset all inputs to defaults
   */
  const reset = () => {
    setSelectedSpanPreset('1800');
    setCustomSpan('1800');
    setSelectedBalusterWidth('36');
    setCustomBalusterWidth('36');
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
  const getUnitAbbrev = () => ' mm';

  return (
    <CalculatorBase
      title="Spiler i rekkverk"
      description="Regn ut avstanden mellom spilene i rekkverket, slik at åpningene holder seg under 100 mm"
      formula="Åpning = (total bredde − antall spiler × spilebredde) ÷ (antall spiler + 1)"
      formulaExplanation="TEK17 krever at åpninger i rekkverk ikke er større enn 100 mm (en kule på 10 cm skal ikke gå gjennom), for at barn ikke skal kunne sette seg fast eller falle gjennom. Rekkverk skal også ha riktig høyde, normalt minst 1,0 m. Sjekk gjeldende regler for ditt tiltak."
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
              label="Antall spiler"
              value={result.numberOfBalusters.toString()}
              highlight
              copyable
            />
            <ResultDisplay
              label="Åpning mellom spiler"
              value={result.formattedSpacing}
              highlight
              copyable
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultDisplay
              label="Senteravstand"
              value={result.formattedCenterToCenter}
              copyable
            />
            <ResultDisplay
              label="Åpning mot stolpe"
              value={result.formattedPostToBalusterGap}
              copyable
            />
          </div>

          {/* Layout Breakdown */}
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Oppsett</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Total åpning:</span>{' '}
                <span className="font-medium">{result.totalWidth} mm</span>
              </div>
              <div>
                <span className="text-muted-foreground">Spilebredde:</span>{' '}
                <span className="font-medium">{result.balusterWidth} mm</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total bredde på spilene:</span>{' '}
                <span className="font-medium">{result.layout.totalBalusterWidth.toFixed(0)} mm</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total bredde på åpningene:</span>{' '}
                <span className="font-medium">{result.layout.totalGapWidth.toFixed(0)} mm</span>
              </div>
            </div>
          </div>

          {/* Visual Layout */}
          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-md border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium mb-3 text-blue-800 dark:text-blue-200">
              Slik monterer du
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-gray-400 rounded-sm" title="Stolpe"></span>
                <span className="text-muted-foreground">Stolpe</span>
                <span className="mx-2">→</span>
                <span className="font-mono">{result.formattedPostToBalusterGap}</span>
                <span className="mx-2">→</span>
                <span className="w-3 h-4 bg-amber-600 rounded-sm" title="Spile"></span>
                <span className="text-muted-foreground">Første spile</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-4 bg-amber-600 rounded-sm" title="Spile"></span>
                <span className="text-muted-foreground">Spile</span>
                <span className="mx-2">→</span>
                <span className="font-mono">{result.formattedSpacing}</span>
                <span className="mx-2">→</span>
                <span className="w-3 h-4 bg-amber-600 rounded-sm" title="Spile"></span>
                <span className="text-muted-foreground">Neste spile</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Gjenta {result.numberOfBalusters - 1} ganger mellom spilene, og deretter {result.formattedPostToBalusterGap} til stolpen i andre enden.
              </p>
            </div>
          </div>

          {/* Maximum Gap Reference */}
          <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-md border border-amber-200 dark:border-amber-800">
            <p className="text-sm font-medium mb-2 text-amber-800 dark:text-amber-200">
              Maksimal åpning i rekkverk (TEK17)
            </p>
            <p className="text-sm text-muted-foreground">
              Det skal ikke være mulig å få en kule på 100 mm gjennom en åpning i rekkverket. Åpningen mellom spilene må derfor være mindre enn 100 mm ({result.maxAllowedGap.toFixed(0)} mm i valgt enhet).
            </p>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectInput
            id="spanPreset"
            label="Vanlige lengder"
            value={selectedSpanPreset}
            onChange={handleSpanPresetChange}
            options={spanPresetOptions}
          />
          <NumberInput
            id="totalWidth"
            label="Total åpning (mellom stolpene)"
            value={customSpan}
            onChange={(v) => {
              setCustomSpan(v.toString());
              setSelectedSpanPreset('');
            }}
            placeholder="mm"
            min={1}
            step={10}
            unit="mm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectInput
            id="balusterWidthPreset"
            label="Type spiler"
            value={selectedBalusterWidth}
            onChange={handleBalusterWidthChange}
            options={balusterWidthOptions}
          />
          <NumberInput
            id="balusterWidth"
            label="Spilebredde"
            value={customBalusterWidth}
            onChange={(v) => {
              setCustomBalusterWidth(v.toString());
              setSelectedBalusterWidth('');
            }}
            placeholder="mm"
            min={1}
            step={1}
            unit="mm"
          />
        </div>

        <NumberInput
          id="postWidth"
          label="Stolpebredde (valgfritt, bare for referanse)"
          value={postWidth}
          onChange={(v) => setPostWidth(v.toString())}
          placeholder="mm"
          min={0}
          step={5}
          unit="mm"
        />

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Måletips</p>
          <p className="text-xs text-muted-foreground">
            Mål den <strong>frie åpningen</strong> mellom innsiden av stolpene. Dette er området som skal fylles med spiler. Ikke ta med stolpebredden i målet.
          </p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default BalusterCalculator;
