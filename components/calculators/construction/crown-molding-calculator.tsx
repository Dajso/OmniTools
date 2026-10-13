'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import {
  calculateCrownMoldingAngles,
  SPRING_ANGLE_PRESETS,
  CORNER_ANGLE_PRESETS,
  type CrownMoldingResult,
} from '@/lib/calculations/construction/crown-molding-calculator';

/**
 * Options for spring angle presets dropdown
 */
const springAngleOptions = [
  { value: '', label: 'Egendefinert vinkel' },
  { value: '38', label: '38° (38/52-list) – vanligst' },
  { value: '45', label: '45° (45/45-list)' },
  { value: '52', label: '52° (52/38-list)' },
];

/**
 * Options for corner angle presets dropdown
 */
const cornerAngleOptions = [
  { value: '', label: 'Egendefinert vinkel' },
  { value: '90', label: '90° – vanlig hjørne' },
  { value: '135', label: '135° – stumpt hjørne' },
  { value: '45', label: '45° – spisst hjørne' },
];

/**
 * Options for corner type
 */
const cornerTypeOptions = [
  { value: 'inside', label: 'Innvendig hjørne' },
  { value: 'outside', label: 'Utvendig hjørne' },
];

/**
 * Crown Molding Angle Calculator Component
 * 
 * Calculates the miter and bevel angles needed to cut crown molding
 * for inside and outside corners.
 * 
 * @see Requirements 32.2, 32.6 - Crown Molding Angle Calculator with miter and bevel angles
 */
export function CrownMoldingCalculator() {
  // Input state
  const [selectedSpringAngle, setSelectedSpringAngle] = React.useState<string>('38');
  const [customSpringAngle, setCustomSpringAngle] = React.useState<string>('38');
  const [selectedCornerAngle, setSelectedCornerAngle] = React.useState<string>('90');
  const [customCornerAngle, setCustomCornerAngle] = React.useState<string>('90');
  const [cornerType, setCornerType] = React.useState<string>('inside');
  
  // Result state
  const [result, setResult] = React.useState<CrownMoldingResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  /**
   * Handle spring angle preset selection
   */
  const handleSpringAngleChange = (value: string) => {
    setSelectedSpringAngle(value);
    if (value) {
      setCustomSpringAngle(value);
    }
  };

  /**
   * Handle corner angle preset selection
   */
  const handleCornerAngleChange = (value: string) => {
    setSelectedCornerAngle(value);
    if (value) {
      setCustomCornerAngle(value);
    }
  };

  /**
   * Calculate crown molding angles based on current inputs
   */
  const calculate = React.useCallback(() => {
    try {
      setError(undefined);

      const springAngle = parseFloat(customSpringAngle);
      const cornerAngle = parseFloat(customCornerAngle);

      // Validate inputs
      if (isNaN(springAngle) || springAngle <= 0 || springAngle >= 90) {
        setResult(null);
        return;
      }
      if (isNaN(cornerAngle) || cornerAngle <= 0 || cornerAngle >= 180) {
        setResult(null);
        return;
      }

      const res = calculateCrownMoldingAngles({
        springAngle,
        cornerAngle,
        cornerType: cornerType as 'inside' | 'outside',
      });

      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
      setResult(null);
    }
  }, [customSpringAngle, customCornerAngle, cornerType]);

  /**
   * Reset all inputs to defaults
   */
  const reset = () => {
    setSelectedSpringAngle('38');
    setCustomSpringAngle('38');
    setSelectedCornerAngle('90');
    setCustomCornerAngle('90');
    setCornerType('inside');
    setResult(null);
    setError(undefined);
  };

  // Auto-calculate when inputs change
  React.useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <CalculatorBase
      title="Gjæringsvinkler for taklist"
      description="Regn ut gjærings- og skråvinkel for sagene når du skjærer taklist"
      formula="Gjæring = arctan(sin(listvinkel) ÷ tan(hjørnevinkel ÷ 2)), skråvinkel = arcsin(cos(listvinkel) × sin(hjørnevinkel ÷ 2))"
      formulaExplanation="Taklist krever sammensatte kutt fordi den står i en vinkel (listvinkelen) fra veggen. Gjæringsvinkelen er hvor mye sagbladet dreies, og skråvinkelen er hvor mye bladet vippes."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultDisplay
              label="Gjæringsvinkel"
              value={result.formattedMiterAngle}
              highlight
              copyable
            />
            <ResultDisplay
              label="Skråvinkel"
              value={result.formattedBevelAngle}
              highlight
              copyable
            />
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Innstillinger som er brukt</p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Listvinkel:</span>{' '}
                <span className="font-medium">{result.springAngle}°</span>
              </div>
              <div>
                <span className="text-muted-foreground">Hjørnevinkel:</span>{' '}
                <span className="font-medium">{result.cornerAngle}°</span>
              </div>
              <div>
                <span className="text-muted-foreground">Hjørnetype:</span>{' '}
                <span className="font-medium capitalize">{result.cornerType}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-md border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium mb-3 text-blue-800 dark:text-blue-200">
              Oppsett på gjærsag
            </p>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-blue-700 dark:text-blue-300">Venstre stykke:</p>
                <p className="text-muted-foreground">{result.sawSetup.leftPieceInstructions}</p>
              </div>
              <div>
                <p className="font-medium text-blue-700 dark:text-blue-300">Høyre stykke:</p>
                <p className="text-muted-foreground">{result.sawSetup.rightPieceInstructions}</p>
              </div>
            </div>
          </div>

          {result.flatMethod && (
            <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-md border border-amber-200 dark:border-amber-800">
              <p className="text-sm font-medium mb-2 text-amber-800 dark:text-amber-200">
                Alternativ: skjære liggende
              </p>
              <div className="text-sm">
                <p className="mb-2">
                  <span className="text-muted-foreground">Gjæringsvinkel:</span>{' '}
                  <span className="font-medium">{result.flatMethod.formattedMiterAngle}</span>
                </p>
                <p className="text-muted-foreground">{result.flatMethod.instructions}</p>
              </div>
            </div>
          )}
        </div>
      )}
    >
      <div className="space-y-4">
        <SelectInput
          id="cornerType"
          label="Hjørnetype"
          value={cornerType}
          onChange={setCornerType}
          options={cornerTypeOptions}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectInput
            id="springAnglePreset"
            label="Type taklist"
            value={selectedSpringAngle}
            onChange={handleSpringAngleChange}
            options={springAngleOptions}
          />
          <NumberInput
            id="springAngle"
            label="Listvinkel"
            value={customSpringAngle}
            onChange={(v) => {
              setCustomSpringAngle(v.toString());
              setSelectedSpringAngle('');
            }}
            placeholder="grader"
            min={1}
            max={89}
            step={0.5}
            unit="°"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectInput
            id="cornerAnglePreset"
            label="Hjørnevinkel (forhåndsvalg)"
            value={selectedCornerAngle}
            onChange={handleCornerAngleChange}
            options={cornerAngleOptions}
          />
          <NumberInput
            id="cornerAngle"
            label="Hjørnevinkel"
            value={customCornerAngle}
            onChange={(v) => {
              setCustomCornerAngle(v.toString());
              setSelectedCornerAngle('');
            }}
            placeholder="grader"
            min={1}
            max={179}
            step={0.5}
            unit="°"
          />
        </div>

        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Om listvinkler</p>
          <p className="text-xs text-muted-foreground">
            Listvinkelen er vinkelen mellom baksiden av taklisten og veggen. Vanlige typer er 38/52 (38° listvinkel, vanligst) og 45/45 (45° listvinkel). Se emballasjen eller mål vinkelen.
          </p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default CrownMoldingCalculator;
