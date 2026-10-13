'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { convertCookingUnit, getIngredientOptions, type CookingUnit, type CookingConversionResults } from '@/lib/calculations/health/cooking-converter';

const VOLUME_UNITS = [
  { value: 'dl', label: 'Desiliter (dl)' },
  { value: 'tablespoons', label: 'Spiseskje (ss)' },
  { value: 'teaspoons', label: 'Teskje (ts)' },
  { value: 'krm', label: 'Krydermål (krm)' },
  { value: 'ml', label: 'Milliliter (ml)' },
  { value: 'liters', label: 'Liter (l)' },
  { value: 'cups', label: 'Cup (USA)' },
  { value: 'fluid_oz', label: 'Fluid ounce (fl oz)' },
];

const WEIGHT_UNITS = [
  { value: 'grams', label: 'Gram (g)' },
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'oz', label: 'Ounce (oz)' },
  { value: 'pounds', label: 'Pund (lb)' },
];

const ALL_UNITS = [...VOLUME_UNITS, ...WEIGHT_UNITS];
const UNIT_SHORT: Record<string, string> = {
  dl: 'dl', tablespoons: 'ss', teaspoons: 'ts', krm: 'krm', ml: 'ml', liters: 'l',
  cups: 'cup', fluid_oz: 'fl oz', grams: 'g', kg: 'kg', oz: 'oz', pounds: 'lb',
};

const INGREDIENT_OPTIONS = [
  { value: '', label: 'Velg ingrediens (for volum ↔ vekt)' },
  ...getIngredientOptions(),
];

export function CookingConverter() {
  const [value, setValue] = React.useState(1);
  const [fromUnit, setFromUnit] = React.useState<CookingUnit>('cups');
  const [toUnit, setToUnit] = React.useState<CookingUnit>('dl');
  const [ingredient, setIngredient] = React.useState('');
  const [results, setResults] = React.useState<CookingConversionResults | null>(null);
  const [error, setError] = React.useState('');

  const calculate = React.useCallback(() => {
    try {
      setError('');
      setResults(convertCookingUnit({ value, fromUnit, toUnit, ingredient: ingredient || undefined }));
    } catch (e) {
      setError((e as Error).message);
      setResults(null);
    }
  }, [value, fromUnit, toUnit, ingredient]);

  React.useEffect(() => { calculate(); }, [calculate]);

  const needsIngredient = (
    (VOLUME_UNITS.some(u => u.value === fromUnit) && WEIGHT_UNITS.some(u => u.value === toUnit)) ||
    (WEIGHT_UNITS.some(u => u.value === fromUnit) && VOLUME_UNITS.some(u => u.value === toUnit))
  );

  return (
    <CalculatorBase
      title="Kjøkkenomregner"
      description="Gjør om mellom dl, ss, ts, gram og utenlandske mål som cups og ounces"
      onCalculate={calculate}
      onReset={() => { setValue(1); setFromUnit('cups'); setToUnit('dl'); setIngredient(''); }}
      error={error}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay
            label={`${value} ${UNIT_SHORT[fromUnit] ?? fromUnit}`}
            value={results.formatted}
            unit={UNIT_SHORT[toUnit] ?? toUnit}
            highlight
            copyable
          />

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Hurtigoversikt</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div>1 dl = 100 ml</div>
              <div>1 ss = 15 ml</div>
              <div>1 ts = 5 ml</div>
              <div>1 krm = 1 ml</div>
              <div>1 ss = 3 ts</div>
              <div>1 dl ≈ 6⅔ ss</div>
              <div>1 cup (USA) ≈ 2,37 dl</div>
              <div>1 oz = 28,35 g</div>
              <div>1 lb = 454 g</div>
              <div>1 fl oz ≈ 30 ml</div>
            </div>
          </div>
        </div>
      )}
    >
      <NumberInput id="value" label="Mengde" value={value} onChange={setValue} min={0.001} step={0.25} required />

      <div className="grid grid-cols-2 gap-4">
        <SelectInput id="fromUnit" label="Fra" value={fromUnit} onChange={(v) => setFromUnit(v as CookingUnit)} options={ALL_UNITS} required />
        <SelectInput id="toUnit" label="Til" value={toUnit} onChange={(v) => setToUnit(v as CookingUnit)} options={ALL_UNITS} required />
      </div>

      {needsIngredient && (
        <SelectInput
          id="ingredient"
          label="Ingrediens (kreves for volum ↔ vekt)"
          value={ingredient}
          onChange={setIngredient}
          options={INGREDIENT_OPTIONS}
          error={needsIngredient && !ingredient ? 'Velg en ingrediens for å gå mellom volum og vekt' : undefined}
        />
      )}
    </CalculatorBase>
  );
}

export default CookingConverter;
