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

const cpmSchema = z.object({
  mode: z.enum(['cpm', 'cost', 'impressions', 'full']),
  totalCost: z.number().min(0, 'Cost cannot be negative'),
  impressions: z.number().min(0, 'Impressions cannot be negative'),
  cpm: z.number().min(0, 'CPM cannot be negative'),
  clicks: z.number().min(0, 'Clicks cannot be negative'),
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
  totalCost: 500,
  impressions: 100000,
  cpm: 5,
  clicks: 1000,
};

const MODE_OPTIONS = [
  { value: 'cpm', label: 'Calculate CPM (from cost & impressions)' },
  { value: 'cost', label: 'Calculate Cost (from CPM & impressions)' },
  { value: 'impressions', label: 'Calculate Impressions (from CPM & budget)' },
  { value: 'full', label: 'Full Analysis (with clicks)' },
];

const PLATFORM_OPTIONS = [
  { value: '', label: 'Select platform for comparison...' },
  ...Object.entries(PLATFORM_CPM_AVERAGES).map(([key, value]) => ({
    value: key,
    label: value.label,
  })),
];

function calculateCPMResults(inputs: CPMInputs): CPMResults {
  const { mode, totalCost, impressions, cpm, clicks } = inputs;

  switch (mode) {
    case 'cpm': {
      if (impressions <= 0) throw new Error('Impressions must be positive');
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
      if (cpm <= 0) throw new Error('CPM must be positive');
      const imps = calculateImpressions(cpm, totalCost);
      return {
        impressions: imps,
        cpm,
        totalCost,
        costPerImpression: cpm / 1000,
      };
    }
    case 'full': {
      if (impressions <= 0) throw new Error('Impressions must be positive');
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
  }, []);

  const platformData = platform ? PLATFORM_CPM_AVERAGES[platform] : null;

  const renderInputs = () => {
    switch (inputs.mode) {
      case 'cpm':
        return (
          <>
            <NumberInput
              id="totalCost"
              label="Total Ad Spend"
              value={inputs.totalCost}
              onChange={(v) => setInput('totalCost', v)}
              min={0}
              step={10}
              unit="$"
              error={errors.totalCost}
              required
            />
            <NumberInput
              id="impressions"
              label="Total Impressions"
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
              label="CPM Rate"
              value={inputs.cpm}
              onChange={(v) => setInput('cpm', v)}
              min={0}
              step={0.5}
              unit="$"
              error={errors.cpm}
              required
            />
            <NumberInput
              id="impressions"
              label="Target Impressions"
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
              label="CPM Rate"
              value={inputs.cpm}
              onChange={(v) => setInput('cpm', v)}
              min={0.01}
              step={0.5}
              unit="$"
              error={errors.cpm}
              required
            />
            <NumberInput
              id="totalCost"
              label="Budget"
              value={inputs.totalCost}
              onChange={(v) => setInput('totalCost', v)}
              min={0}
              step={10}
              unit="$"
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
              label="Total Ad Spend"
              value={inputs.totalCost}
              onChange={(v) => setInput('totalCost', v)}
              min={0}
              step={10}
              unit="$"
              error={errors.totalCost}
              required
            />
            <NumberInput
              id="impressions"
              label="Total Impressions"
              value={inputs.impressions}
              onChange={(v) => setInput('impressions', v)}
              min={1}
              step={1000}
              error={errors.impressions}
              required
            />
            <NumberInput
              id="clicks"
              label="Total Clicks"
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
      title="CPM Calculator"
      description="Calculate Cost Per Mille (cost per thousand impressions) for advertising campaigns"
      formula="CPM = (Total Cost / Impressions) × 1000"
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
                label="CPM (Cost Per 1,000 Impressions)"
                value={`$${formatCurrency(results.cpm)}`}
                highlight
                copyable
              />
            )}

            <div className="grid grid-cols-2 gap-3">
              {results.totalCost !== undefined && inputs.mode !== 'cpm' && (
                <ResultDisplay
                  label="Total Cost"
                  value={`$${formatCurrency(results.totalCost)}`}
                  copyable
                />
              )}
              {results.impressions !== undefined && inputs.mode === 'impressions' && (
                <ResultDisplay
                  label="Impressions"
                  value={formatNumber(results.impressions)}
                  copyable
                />
              )}
              {results.costPerImpression !== undefined && (
                <ResultDisplay
                  label="Cost Per Impression"
                  value={`$${results.costPerImpression.toFixed(6)}`}
                  copyable
                />
              )}
              {results.cpc !== undefined && results.cpc > 0 && (
                <ResultDisplay
                  label="CPC (Cost Per Click)"
                  value={`$${formatCurrency(results.cpc)}`}
                  copyable
                />
              )}
              {results.ctr !== undefined && (
                <ResultDisplay
                  label="CTR (Click-Through Rate)"
                  value={formatPercentage(results.ctr)}
                  copyable
                />
              )}
            </div>

            {/* Platform Comparison */}
            {platformData && results.cpm !== undefined && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium">Platform Comparison: {platformData.label}</p>
                <p className="text-sm text-muted-foreground">
                  Average CPM: ${platformData.low.toFixed(2)} - ${platformData.high.toFixed(2)}
                </p>
                <p className={`text-sm font-medium ${
                  results.cpm < platformData.low ? 'text-green-600' :
                  results.cpm > platformData.high ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  Your CPM is {
                    results.cpm < platformData.low ? 'below' :
                    results.cpm > platformData.high ? 'above' : 'within'
                  } the typical range
                </p>
              </div>
            )}
          </div>
        )
      }
    >
      <div className="space-y-2">
        <Label htmlFor="mode">Calculation Mode</Label>
        <Select
          id="mode"
          options={MODE_OPTIONS}
          value={inputs.mode}
          onChange={(e) => setInput('mode', e.target.value as CPMInputs['mode'])}
        />
      </div>

      {renderInputs()}

      <div className="space-y-2">
        <Label htmlFor="platform">Compare to Platform (Optional)</Label>
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
