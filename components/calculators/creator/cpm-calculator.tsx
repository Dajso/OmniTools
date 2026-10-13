'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateCPM,
  calculateTotalCost,
  calculateImpressions,
  calculateAllMetrics,
  PLATFORM_CPM_AVERAGES,
  formatCurrency,
  formatNumber,
  formatPercentage,
  type CPMResult,
  type AdvertisingMetrics,
} from '@/lib/calculations/creator/cpm-calculator';
import { formatFixed } from '@/lib/utils/formatting';

const cpmSchema = z.object({
  mode: z.enum(['cpm', 'cost', 'impressions', 'full']),
  totalCost: z.number().min(0, 'Kostnaden kan ikke være negativ'),
  impressions: z.number().min(0, 'Antall visninger kan ikke være negativt'),
  cpm: z.number().min(0, 'CPM kan ikke være negativ'),
  clicks: z.number().min(0, 'Antall klikk kan ikke være negativt'),
});

type CPMInputs = z.infer<typeof cpmSchema>;

interface CPMResults {
  cpm?: number;
  totalCost?: number;
  impressions?: number;
  costPerImpression?: number;
  cpc?: number;
  ctr?: number;
}

const INITIAL_INPUTS: CPMInputs = {
  mode: 'cpm',
  totalCost: 5000,
  impressions: 100000,
  cpm: 50,
  clicks: 1000,
};

const MODE_OPTIONS = [
  { value: 'cpm', label: 'Regn ut CPM (fra kostnad og visninger)' },
  { value: 'cost', label: 'Regn ut kostnad (fra CPM og visninger)' },
  { value: 'impressions', label: 'Regn ut visninger (fra CPM og budsjett)' },
  { value: 'full', label: 'Full analyse (med klikk)' },
];

const PLATFORM_OPTIONS = [
  { value: '', label: 'Velg plattform å sammenligne med …' },
  ...Object.entries(PLATFORM_CPM_AVERAGES).map(([key, value]) => ({
    value: key,
    label: value.label,
  })),
];

function calculateCPMResults(inputs: CPMInputs): CPMResults {
  const { mode, totalCost, impressions, cpm, clicks } = inputs;

  switch (mode) {
    case 'cpm': {
      if (impressions <= 0) throw new Error('Antall visninger må være større enn 0');
      const result = calculateCPM({ totalCost, impressions });
      return {
        cpm: result.cpm,
        costPerImpression: result.costPerImpression,
        totalCost,
        impressions,
      };
    }
    case 'cost': {
      const cost = calculateTotalCost(cpm, impressions);
      return {
        totalCost: cost,
        cpm,
        impressions,
        costPerImpression: cpm / 1000,
      };
    }
    case 'impressions': {
      if (cpm <= 0) throw new Error('CPM må være større enn 0');
      const imps = calculateImpressions(cpm, totalCost);
      return {
        impressions: imps,
        cpm,
        totalCost,
        costPerImpression: cpm / 1000,
      };
    }
    case 'full': {
      if (impressions <= 0) throw new Error('Antall visninger må være større enn 0');
      const metrics = calculateAllMetrics(totalCost, impressions, clicks);
      return {
        cpm: metrics.cpm,
        totalCost,
        impressions,
        costPerImpression: totalCost / impressions,
        cpc: metrics.cpc,
        ctr: metrics.ctr,
      };
    }
    default:
      return {};
  }
}

export function CPMCalculator() {
  const [platform, setPlatform] = React.useState('');

  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<CPMInputs, CPMResults>({
      initialInputs: INITIAL_INPUTS,
      schema: cpmSchema,
      calculate: calculateCPMResults,
      storageKey: 'cpm-calculator',
    });

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const platformData = platform ? PLATFORM_CPM_AVERAGES[platform] : null;

  const renderInputs = () => {
    switch (inputs.mode) {
      case 'cpm':
        return (
          <>
            <NumberInput
              id="totalCost"
              label="Annonsekostnad totalt"
              value={inputs.totalCost}
              onChange={(v) => setInput('totalCost', v)}
              min={0}
              step={10}
              unit="kr"
              error={errors.totalCost}
              required
            />
            <NumberInput
              id="impressions"
              label="Visninger totalt"
              value={inputs.impressions}
              onChange={(v) => setInput('impressions', v)}
              min={1}
              step={1000}
              error={errors.impressions}
              required
            />
          </>
        );
      case 'cost':
        return (
          <>
            <NumberInput
              id="cpm"
              label="CPM-sats"
              value={inputs.cpm}
              onChange={(v) => setInput('cpm', v)}
              min={0}
              step={5}
              unit="kr"
              error={errors.cpm}
              required
            />
            <NumberInput
              id="impressions"
              label="Ønsket antall visninger"
              value={inputs.impressions}
              onChange={(v) => setInput('impressions', v)}
              min={0}
              step={1000}
              error={errors.impressions}
              required
            />
          </>
        );
      case 'impressions':
        return (
          <>
            <NumberInput
              id="cpm"
              label="CPM-sats"
              value={inputs.cpm}
              onChange={(v) => setInput('cpm', v)}
              min={0.1}
              step={5}
              unit="kr"
              error={errors.cpm}
              required
            />
            <NumberInput
              id="totalCost"
              label="Budsjett"
              value={inputs.totalCost}
              onChange={(v) => setInput('totalCost', v)}
              min={0}
              step={10}
              unit="kr"
              error={errors.totalCost}
              required
            />
          </>
        );
      case 'full':
        return (
          <>
            <NumberInput
              id="totalCost"
              label="Annonsekostnad totalt"
              value={inputs.totalCost}
              onChange={(v) => setInput('totalCost', v)}
              min={0}
              step={10}
              unit="kr"
              error={errors.totalCost}
              required
            />
            <NumberInput
              id="impressions"
              label="Visninger totalt"
              value={inputs.impressions}
              onChange={(v) => setInput('impressions', v)}
              min={1}
              step={1000}
              error={errors.impressions}
              required
            />
            <NumberInput
              id="clicks"
              label="Klikk totalt"
              value={inputs.clicks}
              onChange={(v) => setInput('clicks', v)}
              min={0}
              step={10}
              error={errors.clicks}
            />
          </>
        );
    }
  };

  return (
    <CalculatorBase
      title="CPM-kalkulator"
      description="Regn ut CPM (kostnad per tusen visninger) for annonsekampanjer"
      formula="CPM = (total kostnad ÷ visninger) × 1000"
      onCalculate={calculate}
      onReset={reset}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            {results.cpm !== undefined && (
              <ResultDisplay
                label="CPM (kostnad per 1 000 visninger)"
                value={`${formatCurrency(results.cpm)} kr`}
                highlight
                copyable
              />
            )}

            <div className="grid grid-cols-2 gap-3">
              {results.totalCost !== undefined && inputs.mode !== 'cpm' && (
                <ResultDisplay
                  label="Total kostnad"
                  value={`${formatCurrency(results.totalCost)} kr`}
                  copyable
                />
              )}
              {results.impressions !== undefined && inputs.mode === 'impressions' && (
                <ResultDisplay
                  label="Visninger"
                  value={formatNumber(results.impressions)}
                  copyable
                />
              )}
              {results.costPerImpression !== undefined && (
                <ResultDisplay
                  label="Kostnad per visning"
                  value={`${formatFixed(results.costPerImpression, 6)} kr`}
                  copyable
                />
              )}
              {results.cpc !== undefined && results.cpc > 0 && (
                <ResultDisplay
                  label="CPC (kostnad per klikk)"
                  value={`${formatCurrency(results.cpc)} kr`}
                  copyable
                />
              )}
              {results.ctr !== undefined && (
                <ResultDisplay
                  label="CTR (klikkandel)"
                  value={formatPercentage(results.ctr)}
                  copyable
                />
              )}
            </div>

            {/* Platform Comparison */}
            {platformData && results.cpm !== undefined && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium">Sammenligning med plattform: {platformData.label}</p>
                <p className="text-sm text-muted-foreground">
                  Gjennomsnittlig CPM: {formatFixed(platformData.low, 0)}–{formatFixed(platformData.high, 0)} kr
                </p>
                <p className={`text-sm font-medium ${results.cpm < platformData.low ? 'text-green-600' :
                    results.cpm > platformData.high ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                  CPM-en din er {
                    results.cpm < platformData.low ? 'under' :
                      results.cpm > platformData.high ? 'over' : 'innenfor'
                  } det typiske området
                </p>
              </div>
            )}
          </div>
        )
      }
    >
      <div className="space-y-2">
        <Label htmlFor="mode">Beregningsmodus</Label>
        <Select
          id="mode"
          options={MODE_OPTIONS}
          value={inputs.mode}
          onChange={(e) => setInput('mode', e.target.value as CPMInputs['mode'])}
        />
      </div>

      {renderInputs()}

      <div className="space-y-2">
        <Label htmlFor="platform">Sammenlign med plattform (valgfritt)</Label>
        <Select
          id="platform"
          options={PLATFORM_OPTIONS}
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        />
      </div>
    </CalculatorBase>
  );
}

export default CPMCalculator;
