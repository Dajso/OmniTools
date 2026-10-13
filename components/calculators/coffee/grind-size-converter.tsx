'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  convertGrindSize,
  type GrindSizeResults,
  type ConfidenceLevel,
} from '@/lib/calculations/coffee/grind-size-converter';
import {
  getGrinderList,
  getGrinderConfig,
  type GrinderConfig,
} from '@/lib/calculations/coffee/grind-size-converter';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Info, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * Zod schema for grind size converter inputs
 * Validates source grinder, setting, and target grinder
 */
const grindSizeSchema = z.object({
  sourceGrinder: z.string().min(1, 'Velg en kvern å regne fra'),
  sourceSetting: z.number()
    .min(0, 'Innstillingen må være minst 0')
    .max(100, 'Innstillingen kan ikke være over 100'),
  targetGrinder: z.string().min(1, 'Velg en kvern å regne til'),
});

type GrindSizeFormInputs = z.infer<typeof grindSizeSchema>;

/**
 * Initial input values for the calculator
 */
const INITIAL_INPUTS: GrindSizeFormInputs = {
  sourceGrinder: 'comandante',
  sourceSetting: 20,
  targetGrinder: 'baratza-encore',
};

/**
 * Confidence badge component
 */
function ConfidenceBadge({ confidence }: { confidence: ConfidenceLevel }) {
  const config = {
    'high': {
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      icon: CheckCircle2,
      label: 'Høy sikkerhet',
    },
    'medium': {
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      icon: Info,
      label: 'Middels sikkerhet',
    },
    'low': {
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      icon: AlertCircle,
      label: 'Lav sikkerhet',
    },
  };

  const { color, icon: Icon, label } = config[confidence];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${color}`}>
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </span>
  );
}

/**
 * Grind Size Converter Component
 * 
 * Converts grind settings between different grinder models.
 * Uses conversion tables and normalization to map settings across grinders.
 * 
 * Features:
 * - Source and target grinder selection
 * - Setting input with validation
 * - Converted setting display
 * - Grind size description
 * - Confidence level indicator
 * - Helpful conversion notes
 * - Input validation with error messages
 * - Accessible with ARIA labels
 * 
 * @see Requirements 6.1, 6.2, 15.1, 15.2
 */
export function GrindSizeConverter() {
  const grinderList = React.useMemo(() => getGrinderList(), []);

  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating
  } = useCalculator<GrindSizeFormInputs, GrindSizeResults>({
    initialInputs: INITIAL_INPUTS,
    schema: grindSizeSchema,
    calculate: convertGrindSize,
    storageKey: 'grind-size-converter',
  });

  // Get source grinder config for setting range validation
  const sourceConfig = React.useMemo(
    () => getGrinderConfig(inputs.sourceGrinder),
    [inputs.sourceGrinder]
  );

  // Auto-calculate on input changes
  React.useEffect(() => {
    if (isValid) {
      calculate();
    }
  }, [inputs, isValid, calculate]);

  // Get setting range for source grinder
  const settingRange = sourceConfig
    ? `${sourceConfig.range[0]} - ${sourceConfig.range[1]}`
    : '0 - 100';

  return (
    <CalculatorBase
      title="Kvernstørrelse"
      description="Regn om kvernstilling mellom ulike kverner, så du får samme resultat"
      formula="Normalisert stilling = (stilling − min) / (maks − min)"
      formulaExplanation="Omregneren legger innstillingen på en skala fra 0 til 1, finner kvernstørrelsen og regner den om til skalaen på den andre kvernen."
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={results && (
        <div className="space-y-4">
          {/* Main result */}
          <ResultDisplay
            label="Stilling på ny kvern"
            value={results.targetSetting.toString()}
            highlight
            copyable
          />

          {/* Grind description */}
          <ResultDisplay
            label="Kvernstørrelse"
            value={results.grindDescription}
          />

          {/* Confidence badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Sikkerhet:</span>
            <ConfidenceBadge confidence={results.confidence} />
          </div>

          {/* Grind size categories */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-muted/50 rounded-lg p-3 border border-border">
              <p className="font-medium text-muted-foreground mb-1">Fra kvern</p>
              <p className="text-foreground capitalize">{results.sourceGrindSize.replace('-', ' ')}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 border border-border">
              <p className="font-medium text-muted-foreground mb-1">Til kvern</p>
              <p className="text-foreground capitalize">{results.targetGrindSize.replace('-', ' ')}</p>
            </div>
          </div>

          {/* Conversion notes */}
          {results.notes.length > 0 && (
            <div className="bg-muted/50 rounded-lg p-4 border border-border space-y-3">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Merknader</p>
                  {results.notes.map((note, index) => (
                    <p key={index} className="text-sm text-muted-foreground">
                      {note}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Important reminder */}
          <div className="text-xs text-muted-foreground bg-amber-50 dark:bg-amber-950/20 rounded-md p-3 border border-amber-200 dark:border-amber-900/30">
            <p className="font-medium text-amber-900 dark:text-amber-400 mb-1">⚠️ Viktig</p>
            <p className="text-amber-800 dark:text-amber-500">
              Omregningen er omtrentlig. Bruk resultatet som et utgangspunkt og juster etter smak. Kvernsteinenes form, alder og kalibrering påvirker resultatet.
            </p>
          </div>
        </div>
      )}
    >
      {/* Source Grinder Selection */}
      <div className="space-y-2">
        <Label htmlFor="sourceGrinder">
          Kvern du regner fra <span className="text-destructive">*</span>
        </Label>
        <Select
          id="sourceGrinder"
          value={inputs.sourceGrinder}
          onChange={(e) => setInput('sourceGrinder', e.target.value)}
          options={grinderList.map((grinder: { id: string; name: string }) => ({
            value: grinder.id,
            label: grinder.name,
          }))}
          aria-label="Velg kvern å regne fra"
          aria-required="true"
          className={errors.sourceGrinder ? 'border-destructive' : ''}
        />
        {errors.sourceGrinder && (
          <p className="text-sm text-destructive" role="alert">
            {errors.sourceGrinder}
          </p>
        )}
      </div>

      {/* Source Setting Input */}
      <NumberInput
        id="sourceSetting"
        label="Stilling på denne kvernen"
        value={inputs.sourceSetting}
        onChange={(v) => setInput('sourceSetting', v)}
        min={sourceConfig?.range[0] || 0}
        max={sourceConfig?.range[1] || 100}
        step={0.5}
        error={errors.sourceSetting}
        required
        placeholder="20"
      />
      <p className="text-xs text-muted-foreground -mt-1">
        Gyldig område: {settingRange}
      </p>

      {/* Target Grinder Selection */}
      <div className="space-y-2">
        <Label htmlFor="targetGrinder">
          Kvern du regner til <span className="text-destructive">*</span>
        </Label>
        <Select
          id="targetGrinder"
          value={inputs.targetGrinder}
          onChange={(e) => setInput('targetGrinder', e.target.value)}
          options={grinderList.map((grinder: { id: string; name: string }) => ({
            value: grinder.id,
            label: grinder.name,
          }))}
          aria-label="Velg kvern å regne til"
          aria-required="true"
          className={errors.targetGrinder ? 'border-destructive' : ''}
        />
        {errors.targetGrinder && (
          <p className="text-sm text-destructive" role="alert">
            {errors.targetGrinder}
          </p>
        )}
      </div>

      {/* Grind size reference */}
      <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
        <p className="font-medium">Oversikt over kvernstørrelser:</p>
        <ul className="space-y-0.5 ml-4">
          <li>• Ekstra fin: tyrkisk kaffe, svært fin espresso</li>
          <li>• Fin: espresso, mokakanne</li>
          <li>• Middels fin: pour over (V60, Kalita), AeroPress</li>
          <li>• Middels: traktekaffe, Chemex</li>
          <li>• Middels grov: Clever dripper, sifon</li>
          <li>• Grov: presskanne, cold brew</li>
          <li>• Ekstra grov: kokekaffe, cold brew (lang trekketid)</li>
        </ul>
      </div>
    </CalculatorBase>
  );
}

export default GrindSizeConverter;
