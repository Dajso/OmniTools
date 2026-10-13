'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateSocksMetric,
  type SockMetricResult,
} from '@/lib/calculations/crafts';
import { formatNumber } from '@/lib/utils/formatting';

const socksSizeSchema = z.object({
  footLength: z.number().min(12).max(32),
  footCircumference: z.number().min(12).max(40),
  ankleCircumference: z.number().min(12).max(40),
  legLength: z.number().min(5).max(50),
  stitchesPer10cm: z.number().min(15).max(50),
  rowsPer10cm: z.number().min(15).max(65),
  yarnWeight: z.enum(['fingering', 'sport', 'dk']),
});

type SocksSizeInputs = z.infer<typeof socksSizeSchema>;

const INITIAL_INPUTS: SocksSizeInputs = {
  footLength: 24,
  footCircumference: 23,
  ankleCircumference: 22,
  legLength: 15,
  stitchesPer10cm: 32,
  rowsPer10cm: 44,
  yarnWeight: 'fingering',
};

const YARN_WEIGHT_OPTIONS = [
  { value: 'fingering', label: 'Sokkegarn (fingering)' },
  { value: 'sport', label: 'Sportsgarn' },
  { value: 'dk', label: 'Lett garn (DK)' },
];

const YARN_WEIGHT_NAMES: Record<SocksSizeInputs['yarnWeight'], string> = {
  fingering: 'sokkegarn',
  sport: 'sportsgarn',
  dk: 'lett garn (DK)',
};

function calculateSocksSize(inputs: SocksSizeInputs): SockMetricResult {
  return calculateSocksMetric({
    footLengthCm: inputs.footLength,
    footCircumferenceCm: inputs.footCircumference,
    ankleCircumferenceCm: inputs.ankleCircumference,
    legLengthCm: inputs.legLength,
    stitchesPer10cm: inputs.stitchesPer10cm,
    rowsPer10cm: inputs.rowsPer10cm,
    yarnWeight: inputs.yarnWeight,
  });
}

function cm(value: number): string {
  return formatNumber(value, { maximumFractionDigits: 1 });
}

export function SocksSizeCalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<SocksSizeInputs, SockMetricResult>({
    initialInputs: INITIAL_INPUTS,
    schema: socksSizeSchema,
    calculate: calculateSocksSize,
    storageKey: 'socks-size-calculator',
  });

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <CalculatorBase
      title="Sokkestørrelse"
      description="Regn ut mål og maskeantall til sokker ut fra fotmålene dine"
      formula="Opplegg = fotomkrets × maskefasthet × (1 − negativ ease)"
      formulaExplanation="Sokker strikkes vanligvis 10 % mindre enn foten, slik at de sitter tett"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            {/* Size Info */}
            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Skostørrelse</p>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">EU</p>
                  <p className="font-medium">{formatNumber(results.euSize, { maximumFractionDigits: 1 })}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sokkestørrelse</p>
                  <p className="font-medium">{results.sizeGroup}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Veiledende. Størrelsen kan variere litt mellom merker.
              </p>
            </div>

            {/* Stitch Counts */}
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Masker å legge opp"
                value={results.castOnStitches}
                unit="masker"
                highlight
                copyable
              />
              <ResultDisplay
                label="Masker i hælen"
                value={results.heelStitches}
                unit="masker"
                copyable
              />
              <ResultDisplay
                label="Masker å plukke opp til kilen"
                value={results.gussetPickupStitches}
                unit="masker per side"
                copyable
              />
              <ResultDisplay
                label="Masker igjen i tåen"
                value={results.toeStitches}
                unit="masker"
                copyable
              />
            </div>

            {/* Measurements */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Mål</p>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay
                  label="Fotlengde til tåfellingen"
                  value={results.footLengthToToeCm}
                  unit="cm"
                />
                <ResultDisplay
                  label="Lengde på hælstroppen"
                  value={results.heelFlapLengthCm}
                  unit="cm"
                />
                <ResultDisplay
                  label="Legglengde"
                  value={results.legLengthCm}
                  unit="cm"
                />
                <ResultDisplay
                  label="Negativ ease"
                  value={results.negativeEase}
                  unit="%"
                />
              </div>
            </div>

            {/* Yarn Estimate */}
            <div className="border-t pt-4">
              <ResultDisplay
                label="Garnbehov (per par)"
                value={`ca. ${formatNumber(results.yarnMeters, { maximumFractionDigits: 0 })}`}
                unit="m"
                highlight
              />
              <p className="text-xs text-muted-foreground mt-1">
                Basert på {YARN_WEIGHT_NAMES[inputs.yarnWeight]}
              </p>
            </div>

            {/* Visual Sock Diagram */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Oppbygging av sokken</p>
              <div className="flex justify-center">
                <svg
                  viewBox="0 0 200 300"
                  className="w-40 h-60"
                  aria-label="Skisse av sokkens deler og mål"
                >
                  {/* Cuff */}
                  <rect x="50" y="10" width="100" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
                  <text x="100" y="25" textAnchor="middle" className="text-[8px] fill-current">Mansjett</text>

                  {/* Leg */}
                  <rect x="50" y="30" width="100" height="80" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
                  <text x="100" y="75" textAnchor="middle" className="text-[8px] fill-current">{cm(results.legLengthCm)} cm legg</text>

                  {/* Heel flap */}
                  <path d="M 50 110 L 50 150 Q 50 180 80 180 L 120 180 Q 150 180 150 150 L 150 110" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
                  <text x="100" y="145" textAnchor="middle" className="text-[8px] fill-current">Hæl</text>

                  {/* Foot */}
                  <rect x="50" y="180" width="100" height="60" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
                  <text x="100" y="215" textAnchor="middle" className="text-[8px] fill-current">{cm(results.footLengthToToeCm)} cm fot</text>

                  {/* Toe */}
                  <path d="M 50 240 L 50 260 Q 50 290 100 290 Q 150 290 150 260 L 150 240" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
                  <text x="100" y="270" textAnchor="middle" className="text-[8px] fill-current">Tå</text>

                  {/* Stitch count labels */}
                  <text x="160" y="25" className="text-[7px] fill-current text-muted-foreground">{results.castOnStitches} masker</text>
                  <text x="160" y="165" className="text-[7px] fill-current text-muted-foreground">{results.heelStitches} masker</text>
                </svg>
              </div>
            </div>
          </div>
        )
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          id="footLength"
          label="Fotlengde"
          value={inputs.footLength}
          onChange={(v) => setInput('footLength', v)}
          min={12}
          max={32}
          step={0.5}
          unit="cm"
          error={errors.footLength}
          required
        />
        <NumberInput
          id="footCircumference"
          label="Fotomkrets (over tåleddene)"
          value={inputs.footCircumference}
          onChange={(v) => setInput('footCircumference', v)}
          min={12}
          max={40}
          step={0.5}
          unit="cm"
          error={errors.footCircumference}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          id="ankleCircumference"
          label="Ankelomkrets"
          value={inputs.ankleCircumference}
          onChange={(v) => setInput('ankleCircumference', v)}
          min={12}
          max={40}
          step={0.5}
          unit="cm"
          error={errors.ankleCircumference}
        />
        <NumberInput
          id="legLength"
          label="Ønsket legglengde"
          value={inputs.legLength}
          onChange={(v) => setInput('legLength', v)}
          min={5}
          max={50}
          step={1}
          unit="cm"
          error={errors.legLength}
        />
      </div>

      <div className="border-t pt-4 mt-4">
        <p className="text-sm font-medium mb-3">Din strikkefasthet (per 10 cm)</p>
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            id="stitchesPer10cm"
            label="Masker"
            value={inputs.stitchesPer10cm}
            onChange={(v) => setInput('stitchesPer10cm', v)}
            min={15}
            max={50}
            step={1}
            error={errors.stitchesPer10cm}
            required
          />
          <NumberInput
            id="rowsPer10cm"
            label="Pinner"
            value={inputs.rowsPer10cm}
            onChange={(v) => setInput('rowsPer10cm', v)}
            min={15}
            max={65}
            step={1}
            error={errors.rowsPer10cm}
            required
          />
        </div>
      </div>

      <SelectInput
        id="yarnWeight"
        label="Garntykkelse"
        value={inputs.yarnWeight}
        onChange={(v) => setInput('yarnWeight', v as 'fingering' | 'sport' | 'dk')}
        options={YARN_WEIGHT_OPTIONS}
      />
    </CalculatorBase>
  );
}

export default SocksSizeCalculator;
