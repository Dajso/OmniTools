'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { convertCookingUnit, getIngredientOptions, type CookingUnit, type CookingConversionResults } from '@/lib/calculations/health/cooking-converter';

const VOLUME_UNITS = [
  { value: 'cups', label: 'Cups' },
  { value: 'tablespoons', label: 'Tablespoons' },
  { value: 'teaspoons', label: 'Teaspoons' },
  { value: 'fluid_oz', label: 'Fluid Ounces' },
  { value: 'ml', label: 'Milliliters' },
  { value: 'liters', label: 'Liters' },
];

const WEIGHT_UNITS = [
  { value: 'grams', label: 'Grams' },
  { value: 'oz', label: 'Ounces' },
  { value: 'pounds', label: 'Pounds' },
];

const ALL_UNITS = [...VOLUME_UNITS, ...WEIGHT_UNITS];

const INGREDIENT_OPTIONS = [
  { value: '', label: 'Select ingredient (for volume↔weight)' },
  ...getIngredientOptions(),
];

export function CookingConverter() {
  const [value, setValue] = React.useState(1);
  const [fromUnit, setFromUnit] = React.useState<CookingUnit>('cups');
  const [toUnit, setToUnit] = React.useState<CookingUnit>('ml');
  const [ingredient, setIngredient] = React.useState('');
  const [results, setResults] = React.useState<CookingConversionResults | null>(null);
  const [error, setError] = React.useState('');

  const calculate = React.useCallback(() => {
    try {
      setError('');
      const result = convertCookingUnit({
        value,
        fromUnit,
        toUnit,
        ingredient: ingredient || undefined,
      });
      setResults(result);
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
      title="Cooking Unit Converter"
      description="Convert between cooking measurements like cups, tablespoons, grams, and more"
      onCalculate={calculate}
      onReset={() => { setValue(1); setFromUnit('cups'); setToUnit('ml'); setIngredient(''); }}
      error={error}
      results={results && (
        <div className="space-y-4">
          <ResultDisplay
            label={`${value} ${fromUnit}`}
            value={results.formatted}
            unit={toUnit.replace('_', ' ')}
            highlight
            copyable
          />

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Quick Reference</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div>1 cup = 16 tbsp</div>
              <div>1 cup = 48 tsp</div>
              <div>1 cup = 8 fl oz</div>
              <div>1 cup = 237 ml</div>
              <div>1 tbsp = 3 tsp</div>
              <div>1 tbsp = 15 ml</div>
              <div>1 oz = 28.35 g</div>
              <div>1 lb = 454 g</div>
            </div>
          </div>
        </div>
      )}
    >
      <NumberInput id="value" label="Amount" value={value} onChange={setValue} min={0.001} step={0.25} required />

      <div className="grid grid-cols-2 gap-4">
        <SelectInput id="fromUnit" label="From" value={fromUnit} onChange={(v) => setFromUnit(v as CookingUnit)} options={ALL_UNITS} required />
        <SelectInput id="toUnit" label="To" value={toUnit} onChange={(v) => setToUnit(v as CookingUnit)} options={ALL_UNITS} required />
      </div>

      {needsIngredient && (
        <SelectInput
          id="ingredient"
          label="Ingredient (required for volume↔weight)"
          value={ingredient}
          onChange={setIngredient}
          options={INGREDIENT_OPTIONS}
          error={needsIngredient && !ingredient ? 'Select an ingredient for volume to weight conversion' : undefined}
        />
      )}
    </CalculatorBase>
  );
}

export default CookingConverter;
