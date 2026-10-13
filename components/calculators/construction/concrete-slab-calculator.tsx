'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import {
  calculateConcreteSlab,
  SLAB_THICKNESS_PRESETS,
  type ConcreteSlabResult,
} from '@/lib/calculations/construction/concrete-slab-calculator';
import { formatNumber } from '@/lib/utils/formatting';

const fmt = (v: number, d: number) => formatNumber(v, { minimumFractionDigits: d, maximumFractionDigits: d });

const THICKNESS_OPTIONS = [
  ...Object.entries(SLAB_THICKNESS_PRESETS).map(([value, label]) => ({ value, label })),
  { value: 'custom', label: 'Egen tykkelse' },
];

export function ConcreteSlabCalculator() {
  const [lengthM, setLengthM] = React.useState(6);
  const [widthM, setWidthM] = React.useState(4);
  const [preset, setPreset] = React.useState('10');
  const [customThickness, setCustomThickness] = React.useState(10);
  const [wastePercent, setWastePercent] = React.useState(10);
  const [useRebar, setUseRebar] = React.useState(true);
  const [rebarSpacingCm, setRebarSpacingCm] = React.useState(20);
  const [useSubbase, setUseSubbase] = React.useState(true);
  const [subbaseCm, setSubbaseCm] = React.useState(15);
  const [result, setResult] = React.useState<ConcreteSlabResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const thicknessCm = preset === 'custom' ? customThickness : Number(preset);

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      setResult(
        calculateConcreteSlab({
          lengthM,
          widthM,
          thicknessCm,
          wastePercent,
          rebarSpacingCm: useRebar ? rebarSpacingCm : undefined,
          subbaseCm: useSubbase ? subbaseCm : undefined,
        })
      );
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : 'Beregningsfeil');
    }
  }, [lengthM, widthM, thicknessCm, wastePercent, useRebar, rebarSpacingCm, useSubbase, subbaseCm]);

  React.useEffect(() => { calculate(); }, [calculate]);

  const reset = () => {
    setLengthM(6); setWidthM(4); setPreset('10'); setCustomThickness(10);
    setWastePercent(10); setUseRebar(true); setRebarSpacingCm(20);
    setUseSubbase(true); setSubbaseCm(15);
  };

  return (
    <CalculatorBase
      title="Betongplate"
      description="Regn ut hvor mye betong du trenger til en plate, gulv eller uteplass"
      formula="Volum = lengde × bredde × tykkelse × (1 + svinn)"
      formulaExplanation="Lengde og bredde i meter, tykkelse i cm. Herdet betong veier ca. 2 300 kg/m³. En sekk ferdigbetong er 25 kg."
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Betong å bestille" value={fmt(result.volumeWithWasteM3, 2)} unit="m³" highlight copyable />
            <ResultDisplay label="Sekker à 25 kg" value={formatNumber(result.sacks)} unit="sekker" copyable />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <ResultDisplay label="Areal" value={fmt(result.areaM2, 1)} unit="m²" />
            <ResultDisplay label="Volum uten svinn" value={fmt(result.volumeM3, 2)} unit="m³" />
            <ResultDisplay label="Vekt" value={formatNumber(result.weightKg)} unit="kg" />
          </div>
          <ResultDisplay
            label="Betongbil"
            value={`${result.trucks.loads} ${result.trucks.loads === 1 ? 'lass' : 'lass'}`}
            unit={result.trucks.loads > 1 ? `siste lass ${fmt(result.trucks.lastLoadM3, 1)} m³` : undefined}
          />
          {result.rebar && (
            <div className="bg-muted/50 p-3 rounded-lg text-sm">
              <p className="font-medium mb-1">Armering (nett, c/c {rebarSpacingCm} cm)</p>
              <p className="text-muted-foreground">
                {result.rebar.barsAlongLength} jern langs, {result.rebar.barsAlongWidth} jern på tvers, til sammen {fmt(result.rebar.totalMeters, 1)} m.
                Armeringsnett: ca. {fmt(result.rebar.meshAreaM2, 1)} m² inkl. overlapp.
              </p>
            </div>
          )}
          {result.subbaseM3 !== undefined && (
            <div className="bg-muted/50 p-3 rounded-lg text-sm">
              <p className="font-medium mb-1">Pukk under platen</p>
              <p className="text-muted-foreground">
                {fmt(result.subbaseM3, 2)} m³, ca. {fmt(result.subbaseTonnes ?? 0, 1)} tonn.
              </p>
            </div>
          )}
          <p className="text-sm text-muted-foreground">{result.recommendation}</p>
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="length" label="Lengde" value={lengthM} onChange={setLengthM} min={0.1} step={0.1} unit="m" required />
        <NumberInput id="width" label="Bredde" value={widthM} onChange={setWidthM} min={0.1} step={0.1} unit="m" required />
      </div>
      <SelectInput id="thickness-preset" label="Bruksområde / tykkelse" value={preset} onChange={setPreset} options={THICKNESS_OPTIONS} />
      {preset === 'custom' && (
        <NumberInput id="thickness" label="Tykkelse" value={customThickness} onChange={setCustomThickness} min={1} max={100} step={1} unit="cm" required />
      )}
      <NumberInput id="waste" label="Tillegg for svinn" value={wastePercent} onChange={setWastePercent} min={0} max={100} step={1} unit="%" />

      <div className="border-t pt-4 space-y-3">
        <div className="flex items-center gap-2">
          <input type="checkbox" id="use-rebar" checked={useRebar} onChange={(e) => setUseRebar(e.target.checked)} className="rounded" />
          <label htmlFor="use-rebar" className="text-sm font-medium">Regn med armering</label>
        </div>
        {useRebar && (
          <NumberInput id="rebar-spacing" label="Avstand mellom armeringsjern" value={rebarSpacingCm} onChange={setRebarSpacingCm} min={5} max={100} step={5} unit="cm" />
        )}
        <div className="flex items-center gap-2">
          <input type="checkbox" id="use-subbase" checked={useSubbase} onChange={(e) => setUseSubbase(e.target.checked)} className="rounded" />
          <label htmlFor="use-subbase" className="text-sm font-medium">Regn med pukk under platen</label>
        </div>
        {useSubbase && (
          <NumberInput id="subbase" label="Tykkelse på pukk" value={subbaseCm} onChange={setSubbaseCm} min={1} max={100} step={1} unit="cm" />
        )}
      </div>
    </CalculatorBase>
  );
}

export default ConcreteSlabCalculator;
