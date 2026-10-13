'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import {
  calculateRoofFraming,
  COMMON_PITCHES,
  type RoofFramingResult,
} from '@/lib/calculations/construction/roof-framing-calculator';
import { formatNumber } from '@/lib/utils/formatting';

const fmt = (v: number, d: number) => formatNumber(v, { minimumFractionDigits: d, maximumFractionDigits: d });

const PITCH_OPTIONS = [
  ...Object.keys(COMMON_PITCHES).map((k) => ({ value: k, label: `${k}°` })),
  { value: 'custom', label: 'Egen takvinkel' },
];

const SPACING_OPTIONS = [
  { value: '400', label: '400 mm' },
  { value: '600', label: '600 mm' },
  { value: '900', label: '900 mm' },
];

export function RoofFramingCalculator() {
  const [spanM, setSpanM] = React.useState(8);
  const [pitchPreset, setPitchPreset] = React.useState('27');
  const [customPitch, setCustomPitch] = React.useState(25);
  const [spacing, setSpacing] = React.useState('600');
  const [overhangCm, setOverhangCm] = React.useState(40);
  const [buildingLengthM, setBuildingLengthM] = React.useState(10);
  const [result, setResult] = React.useState<RoofFramingResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const pitchDeg = pitchPreset === 'custom' ? customPitch : Number(pitchPreset);

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      setResult(
        calculateRoofFraming({
          spanM,
          pitchDeg,
          rafterSpacingMm: Number(spacing),
          overhangCm,
          buildingLengthM: buildingLengthM > 0 ? buildingLengthM : undefined,
        })
      );
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : 'Beregningsfeil');
    }
  }, [spanM, pitchDeg, spacing, overhangCm, buildingLengthM]);

  React.useEffect(() => { calculate(); }, [calculate]);

  const reset = () => {
    setSpanM(8); setPitchPreset('27'); setCustomPitch(25); setSpacing('600');
    setOverhangCm(40); setBuildingLengthM(10);
  };

  return (
    <CalculatorBase
      title="Taksperrer"
      description="Regn ut sperrelengde, møneshøyde, vinkler og antall sperrer for et saltak"
      formula="Sperrelengde = (bredde ÷ 2) ÷ cos(takvinkel)"
      formulaExplanation="Husbredden måles fra ytterkant til ytterkant av veggene. Møneshøyden er målt fra overkant av yttervegg (toppsvill) til mønet. Utstikket regnes horisontalt."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Sperrelengde inkl. utstikk" value={fmt(result.totalRafterLengthM, 2)} unit="m" highlight copyable />
            <ResultDisplay label="Møneshøyde over vegg" value={fmt(result.ridgeHeightM, 2)} unit="m" copyable />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <ResultDisplay label="Sperre til vegg" value={fmt(result.rafterLengthM, 2)} unit="m" />
            <ResultDisplay label="Utstikk langs sperra" value={fmt(result.overhangRafterM, 2)} unit="m" />
            <ResultDisplay label="Stigning" value={fmt(result.slopePercent, 1)} unit="%" />
          </div>
          {result.totalRafters !== undefined && (
            <div className="grid grid-cols-3 gap-4">
              <ResultDisplay label="Sperrer per side" value={formatNumber(result.raftersPerSide ?? 0)} unit="stk" />
              <ResultDisplay label="Sperrer totalt" value={formatNumber(result.totalRafters)} unit="stk" highlight />
              <ResultDisplay label="Takflate" value={fmt(result.roofAreaM2 ?? 0, 1)} unit="m²" />
            </div>
          )}
          <div className="bg-muted/50 p-3 rounded-lg text-sm space-y-1">
            <p className="font-medium">Vinkler for kapping</p>
            <p className="text-muted-foreground">
              Loddkutt (ved mønet): {fmt(result.plumbCutDeg, 1)}° fra loddrett.
              Sperreinnskjæring (på yttervegg): {fmt(result.seatCutDeg, 1)}° fra sperrekanten.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Dimensjon på sperrene (tverrsnitt) avhenger av spenn, snølast og avstand, og må kontrolleres mot byggeforskrift og leverandørens tabeller.
          </p>
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="span" label="Husbredde (ytterkant til ytterkant)" value={spanM} onChange={setSpanM} min={1} max={30} step={0.1} unit="m" required />
        <NumberInput id="building-length" label="Byggets lengde" value={buildingLengthM} onChange={setBuildingLengthM} min={0} step={0.1} unit="m" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <SelectInput id="pitch" label="Takvinkel" value={pitchPreset} onChange={setPitchPreset} options={PITCH_OPTIONS} />
        {pitchPreset === 'custom' && (
          <NumberInput id="custom-pitch" label="Takvinkel" value={customPitch} onChange={setCustomPitch} min={1} max={79} step={0.5} unit="°" required />
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <SelectInput id="spacing" label="Avstand mellom sperrer (c/c)" value={spacing} onChange={setSpacing} options={SPACING_OPTIONS} />
        <NumberInput id="overhang" label="Takutstikk" value={overhangCm} onChange={setOverhangCm} min={0} max={120} step={5} unit="cm" />
      </div>
    </CalculatorBase>
  );
}

export default RoofFramingCalculator;
