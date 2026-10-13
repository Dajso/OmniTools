'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculateBAC, type BiologicalSex, type BACResults } from '@/lib/calculations/health/bac-calculator';
import { formatNumber } from '@/lib/utils/formatting';
import { cn } from '@/lib/utils';

type DrinkType = 'beer' | 'wine' | 'spirits' | 'unit';

const SEX_OPTIONS = [
  { value: 'male', label: 'Mann' },
  { value: 'female', label: 'Kvinne' },
];

const DRINK_OPTIONS = [
  { value: 'beer', label: 'Øl (0,5 l, 4,7 %)' },
  { value: 'wine', label: 'Vin (15 cl, 12,5 %)' },
  { value: 'spirits', label: 'Sprit (4 cl, 40 %)' },
  { value: 'unit', label: 'Alkoholenhet (12 g ren alkohol)' },
];

const STATUS_LABELS: Record<BACResults['status'], string> = {
  sober: 'Edru',
  buzzed: 'Lett påvirket',
  impaired: 'Påvirket',
  drunk: 'Kraftig påvirket',
  dangerous: 'Farlig høy',
};

const STATUS_COLORS: Record<string, string> = {
  sober: 'bg-green-100 text-green-800',
  buzzed: 'bg-yellow-100 text-yellow-800',
  impaired: 'bg-orange-100 text-orange-800',
  drunk: 'bg-red-100 text-red-800',
  dangerous: 'bg-red-200 text-red-900',
};

export function BACCalculator() {
  const [weight, setWeight] = React.useState(75);
  const [sex, setSex] = React.useState<BiologicalSex>('male');
  const [drinks, setDrinks] = React.useState(3);
  const [hours, setHours] = React.useState(2);
  const [drinkType, setDrinkType] = React.useState<DrinkType>('beer');
  const [results, setResults] = React.useState<BACResults | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const calculate = React.useCallback(() => {
    try {
      setResults(calculateBAC({ weight, sex, drinks, hours, drinkType }));
      setError(undefined);
    } catch (e) {
      setResults(null);
      setError(e instanceof Error ? e.message : 'Ugyldig inndata');
    }
  }, [weight, sex, drinks, hours, drinkType]);

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Promillekalkulator"
      description="Anslå promillen din ut fra hva du har drukket, vekt og tid"
      formula="Widmark: promille = alkohol (g) ÷ (vekt (kg) × r) − 0,10 × timer"
      formulaExplanation="r er 0,68 for menn og 0,55 for kvinner. Forbrenningen settes til 0,10 promille per time, nederst i det normale området."
      onCalculate={calculate}
      onReset={() => { setWeight(75); setDrinks(3); setHours(2); setSex('male'); setDrinkType('beer'); }}
      error={error}
      results={results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <ResultDisplay label="Anslått promille" value={formatNumber(results.bac, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} unit="‰" highlight copyable />
            <span className={cn('px-3 py-1 rounded-full text-sm font-medium', STATUS_COLORS[results.status])}>
              {STATUS_LABELS[results.status]}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay label="Under promillegrensen (0,2)" value={results.legalToDrive ? 'Ja' : 'Nei'} />
            <ResultDisplay label="Tid til under 0,2" value={results.hoursUntilLegal} unit="timer" />
            <ResultDisplay label="Tid til null promille" value={results.timeToSober} unit="timer" />
            <ResultDisplay label="Alkoholenheter" value={formatNumber(results.units, { maximumFractionDigits: 1 })} />
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm">{results.effects}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-sm text-red-800">
              ⚠️ Dette er bare et anslag. Kjør aldri etter at du har drukket alkohol. Faktisk promille avhenger av mat, kroppssammensetning, medisiner og forbrenning. Du kan også være over grensen dagen derpå.
            </p>
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="weight" label="Kroppsvekt" value={weight} onChange={setWeight} min={30} max={250} unit="kg" required />
        <SelectInput id="sex" label="Biologisk kjønn" value={sex} onChange={(v) => setSex(v as BiologicalSex)} options={SEX_OPTIONS} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NumberInput id="drinks" label="Antall drinker" value={drinks} onChange={setDrinks} min={0} max={30} required />
        <SelectInput id="drinkType" label="Type drikke" value={drinkType} onChange={(v) => setDrinkType(v as DrinkType)} options={DRINK_OPTIONS} required />
      </div>
      <NumberInput id="hours" label="Timer siden første drink" value={hours} onChange={setHours} min={0} max={48} step={0.5} unit="timer" />
      <p className="text-xs text-muted-foreground">
        Promillegrensen for å føre motorkjøretøy i Norge er 0,2. Én alkoholenhet er 12 gram ren alkohol, omtrent en liten flaske øl.
      </p>
    </CalculatorBase>
  );
}

export default BACCalculator;
