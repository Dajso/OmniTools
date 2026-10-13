'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { calculateBodyFat, type BiologicalSex, type BodyFatResults } from '@/lib/calculations/health/body-fat';
import { cn } from '@/lib/utils';

const SEX_OPTIONS = [
  { value: 'male', label: 'Mann' },
  { value: 'female', label: 'Kvinne' },
];

export function BodyFatCalculator() {
  const [sex, setSex] = React.useState<BiologicalSex>('male');
  const [height, setHeight] = React.useState(180);
  const [waist, setWaist] = React.useState(86);
  const [neck, setNeck] = React.useState(38);
  const [hip, setHip] = React.useState(98);
  const [results, setResults] = React.useState<BodyFatResults | null>(null);
  const [error, setError] = React.useState('');

  const calculate = React.useCallback(() => {
    try {
      setError('');
      const result = calculateBodyFat({ sex, height, waist, neck, hip: sex === 'female' ? hip : undefined, unit: 'metric' });
      setResults(result);
    } catch (e) {
      setResults(null);
      setError((e as Error).message);
    }
  }, [sex, height, waist, neck, hip]);

  React.useEffect(() => { calculate(); }, [calculate]);

  return (
    <CalculatorBase
      title="Kroppsfettkalkulator"
      description="Anslå kroppsfettprosenten din med Navy-metoden"
      formula="Navy-metoden bruker høyde, livvidde og halsomkrets (og hofter for kvinner)"
      formulaExplanation="Alle mål oppgis i cm. Metoden er et anslag og kan avvike fra målinger med DEXA eller bioimpedans."
      onCalculate={calculate}
      onReset={() => { setHeight(180); setWaist(86); setNeck(38); setHip(98); }}
      error={error}
      results={results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <ResultDisplay label="Kroppsfett" value={results.bodyFatPercent} unit="%" highlight copyable />
            <span className={cn('px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary')}>
              {results.category}
            </span>
          </div>
          <ResultDisplay label="Typisk sunt område" value={`${results.idealRange.min} % – ${results.idealRange.max} %`} />
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Kategorier for kroppsfett ({sex === 'male' ? 'menn' : 'kvinner'})</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Essensielt: {sex === 'male' ? '2–6 %' : '10–14 %'}</div>
              <div>Atlet: {sex === 'male' ? '6–14 %' : '14–21 %'}</div>
              <div>Godt trent: {sex === 'male' ? '14–18 %' : '21–25 %'}</div>
              <div>Gjennomsnitt: {sex === 'male' ? '18–25 %' : '25–32 %'}</div>
            </div>
          </div>
        </div>
      )}
    >
      <SelectInput id="sex" label="Biologisk kjønn" value={sex} onChange={(v) => setSex(v as BiologicalSex)} options={SEX_OPTIONS} required />
      <NumberInput id="height" label="Høyde" value={height} onChange={setHeight} min={90} max={250} unit="cm" required />
      <NumberInput id="waist" label="Livvidde (ved navlen)" value={waist} onChange={setWaist} min={40} max={200} unit="cm" required />
      <NumberInput id="neck" label="Halsomkrets" value={neck} onChange={setNeck} min={20} max={70} unit="cm" required />
      {sex === 'female' && (
        <NumberInput id="hip" label="Hofteomkrets (bredeste punkt)" value={hip} onChange={setHip} min={50} max={200} unit="cm" required />
      )}
    </CalculatorBase>
  );
}

export default BodyFatCalculator;
