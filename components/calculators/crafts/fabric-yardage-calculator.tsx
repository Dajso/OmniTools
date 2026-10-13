'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateFabricMetersMetric,
  FABRIC_WIDTH_OPTIONS_CM,
  type GarmentType,
  type SizeCategory,
  type FabricWidth,
  type FabricYardageMetricResult,
} from '@/lib/calculations/crafts';
import { formatNumber } from '@/lib/utils/formatting';

const fabricYardageSchema = z.object({
  garmentType: z.string(),
  size: z.string(),
  fabricWidth: z.number(),
  hasNap: z.boolean(),
  patternRepeat: z.number().min(0),
});

type FabricYardageInputs = {
  garmentType: GarmentType;
  size: SizeCategory;
  fabricWidth: FabricWidth;
  hasNap: boolean;
  patternRepeat: number;
};

const INITIAL_INPUTS: FabricYardageInputs = {
  garmentType: 'dress-midi',
  size: 'm',
  fabricWidth: 45,
  hasNap: false,
  patternRepeat: 0,
};

const GARMENT_OPTIONS = [
  { value: 'dress-short', label: 'Kort kjole' },
  { value: 'dress-midi', label: 'Midikjole' },
  { value: 'dress-maxi', label: 'Maxikjole' },
  { value: 'skirt-short', label: 'Kort skjørt' },
  { value: 'skirt-midi', label: 'Midiskjørt' },
  { value: 'skirt-maxi', label: 'Langt skjørt' },
  { value: 'pants', label: 'Bukse' },
  { value: 'shorts', label: 'Shorts' },
  { value: 'blouse', label: 'Bluse' },
  { value: 'shirt', label: 'Skjorte' },
  { value: 'jacket', label: 'Jakke' },
  { value: 'coat', label: 'Kåpe' },
];

const SIZE_OPTIONS = [
  { value: 'xs', label: 'XS' },
  { value: 's', label: 'S' },
  { value: 'm', label: 'M' },
  { value: 'l', label: 'L' },
  { value: 'xl', label: 'XL' },
  { value: 'xxl', label: 'XXL' },
  { value: '3xl', label: '3XL' },
];

const FABRIC_WIDTH_LABELS: Record<number, string> = {
  36: 'smalt stoff, f.eks. kvalitetsbomull',
  45: 'vanlig bredde',
  54: 'interiørstoff',
  60: 'jersey og bredt stoff',
};

const FABRIC_WIDTH_OPTIONS = FABRIC_WIDTH_OPTIONS_CM.map((w) => ({
  value: String(w.value),
  label: `${w.cm} cm (${FABRIC_WIDTH_LABELS[w.value]})`,
}));

const NAP_OPTIONS = [
  { value: 'false', label: 'Nei (ensfarget eller uten retning)' },
  { value: 'true', label: 'Ja (luv eller mønster med retning)' },
];

function meters(value: number): string {
  return formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function FabricYardageCalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<FabricYardageInputs, FabricYardageMetricResult>({
    initialInputs: INITIAL_INPUTS,
    schema: fabricYardageSchema as unknown as z.ZodType<FabricYardageInputs>,
    calculate: (formInputs) => {
      return calculateFabricMetersMetric({
        garmentType: formInputs.garmentType,
        size: formInputs.size,
        fabricWidth: formInputs.fabricWidth,
        hasNap: formInputs.hasNap,
        patternRepeatCm: formInputs.patternRepeat,
      });
    },
    storageKey: 'fabric-yardage-calculator',
  });

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <CalculatorBase
      title="Stoffbehov"
      description="Regn ut hvor mye stoff du trenger til et syprosjekt"
      formula="Meter = grunnmengde × breddefaktor × (1 + luv) + mønstertillegg"
      formulaExplanation="Grunnmengden justeres for stoffbredde, retning i stoffet og mønsterraport"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            <ResultDisplay
              label="Hovedstoff"
              value={formatNumber(results.metersNeeded, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              unit="m"
              highlight
              copyable
            />

            <p className="text-xs text-muted-foreground">
              Rundet opp til nærmeste 10 cm. Tallene er veiledende, så sjekk mønsterets egen
              stoffoppgave når du har den.
            </p>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Slik er det regnet ut</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Grunnmengde</span>
                  <span>{meters(results.baseMeters)}&nbsp;m</span>
                </div>
                {results.napMeters > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tillegg for retning (+15&nbsp;%)</span>
                    <span>+{meters(results.napMeters)}&nbsp;m</span>
                  </div>
                )}
                {results.patternMeters > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tillegg for mønsterraport</span>
                    <span>+{meters(results.patternMeters)}&nbsp;m</span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Annet materiell</p>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay
                  label="Fôr (om du vil ha det)"
                  value={formatNumber(results.liningMeters, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  unit="m"
                />
                <ResultDisplay
                  label="Vlieselin (ca. 50 cm bredt)"
                  value={formatNumber(results.interfacingMeters, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  unit="m"
                />
              </div>
            </div>
          </div>
        )
      }
    >
      <SelectInput
        id="garmentType"
        label="Type plagg"
        value={inputs.garmentType}
        onChange={(v) => setInput('garmentType', v as GarmentType)}
        options={GARMENT_OPTIONS}
      />

      <SelectInput
        id="size"
        label="Størrelse"
        value={inputs.size}
        onChange={(v) => setInput('size', v as SizeCategory)}
        options={SIZE_OPTIONS}
      />

      <SelectInput
        id="fabricWidth"
        label="Stoffbredde"
        value={String(inputs.fabricWidth)}
        onChange={(v) => setInput('fabricWidth', Number(v) as FabricWidth)}
        options={FABRIC_WIDTH_OPTIONS}
      />

      <SelectInput
        id="hasNap"
        label="Stoff med retning?"
        value={String(inputs.hasNap)}
        onChange={(v) => setInput('hasNap', v === 'true')}
        options={NAP_OPTIONS}
      />

      <NumberInput
        id="patternRepeat"
        label="Mønsterraport"
        value={inputs.patternRepeat}
        onChange={(v) => setInput('patternRepeat', v)}
        min={0}
        max={90}
        step={1}
        unit="cm"
        error={errors.patternRepeat}
      />
    </CalculatorBase>
  );
}

export default FabricYardageCalculator;
