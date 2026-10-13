'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  getMoonPhase,
  getNextPhase,
  type MoonPhase,
  type MoonPhaseName,
} from '@/lib/calculations/fun/moon-phase-calculator';
import { cn } from '@/lib/utils';
import { formatFixed } from '@/lib/utils/formatting';

/**
 * Zod schema for moon phase inputs
 */
const moonPhaseSchema = z.object({
  date: z.string().min(1, 'Dato må fylles ut'),
});

type MoonPhaseInputs = {
  date: string;
};

const INITIAL_INPUTS: MoonPhaseInputs = {
  date: new Date().toISOString().split('T')[0],
};

/**
 * Visual moon phase display component
 */
function MoonVisual({ phase, illumination }: { phase: MoonPhaseName; illumination: number }) {
  // Calculate the shadow position based on illumination and phase
  const isWaxing = phase.includes('waxing') || phase === 'first-quarter';
  const isWaning = phase.includes('waning') || phase === 'last-quarter';
  const isFull = phase === 'full';
  const isNew = phase === 'new';

  return (
    <div className="flex justify-center my-6">
      <div className="relative w-32 h-32">
        {/* Moon base (lit portion) */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 shadow-lg" />
        
        {/* Shadow overlay */}
        {!isFull && (
          <div
            className="absolute inset-0 rounded-full bg-slate-800 transition-all duration-500"
            style={{
              clipPath: isNew
                ? 'inset(0)'
                : isWaxing
                ? `inset(0 0 0 ${illumination}%)`
                : isWaning
                ? `inset(0 ${illumination}% 0 0)`
                : 'inset(0)',
              opacity: isNew ? 1 : 0.95,
            }}
          />
        )}
        
        {/* Moon surface texture */}
        <div className="absolute inset-0 rounded-full opacity-20">
          <div className="absolute top-4 left-6 w-4 h-4 rounded-full bg-gray-400" />
          <div className="absolute top-8 right-8 w-6 h-6 rounded-full bg-gray-400" />
          <div className="absolute bottom-6 left-10 w-5 h-5 rounded-full bg-gray-400" />
          <div className="absolute bottom-10 right-6 w-3 h-3 rounded-full bg-gray-400" />
        </div>
        
        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: `0 0 ${20 + illumination / 5}px ${illumination / 10}px rgba(255, 255, 200, ${illumination / 200})`,
          }}
        />
      </div>
    </div>
  );
}

/**
 * Phase info card component
 */
function PhaseInfoCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-muted/50 p-3 rounded-lg text-center">
      <span className="text-2xl mb-1 block">{icon}</span>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold text-sm">{value}</p>
    </div>
  );
}

/**
 * Moon Phase Calculator Component
 * 
 * Calculates and displays the moon phase for any given date with
 * a visual representation of the moon.
 * 
 * Features:
 * - Visual moon phase display
 * - Illumination percentage
 * - Moon age in days
 * - Next phase predictions
 * 
 * @see Requirements 19.2
 */
export function MoonPhaseCalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<MoonPhaseInputs, MoonPhase & { nextFull: Date; nextNew: Date }>({
    initialInputs: INITIAL_INPUTS,
    schema: moonPhaseSchema as unknown as z.ZodType<MoonPhaseInputs>,
    calculate: (formInputs) => {
      const date = new Date(formInputs.date);
      const moonPhase = getMoonPhase(date);
      const nextFull = getNextPhase('full', date);
      const nextNew = getNextPhase('new', date);
      return { ...moonPhase, nextFull, nextNew };
    },
    storageKey: 'moon-phase-calculator',
  });

  // Auto-calculate on mount and date change
  React.useEffect(() => {
    if (inputs.date) {
      calculate();
    }
  }, [inputs.date, calculate]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('nb-NO', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <CalculatorBase
      title="Månefase"
      description="Se månefasen for en hvilken som helst dato, med bilde"
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-6">
            <MoonVisual phase={results.phase} illumination={results.illumination} />
            
            <div className="text-center">
              <span className="text-4xl mb-2 block">{results.emoji}</span>
              <h3 className="text-xl font-bold">{results.phaseName}</h3>
              <p className="text-muted-foreground">
                {formatFixed(results.illumination, 1)} % opplyst
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <PhaseInfoCard
                label="Månens alder"
                value={`${formatFixed(results.age, 1)} dager`}
                icon="📅"
              />
              <PhaseInfoCard
                label="Opplysning"
                value={`${formatFixed(results.illumination, 1)} %`}
                icon="💡"
              />
              <PhaseInfoCard
                label="Neste fullmåne"
                value={formatDate(results.nextFull)}
                icon="🌕"
              />
              <PhaseInfoCard
                label="Neste nymåne"
                value={formatDate(results.nextNew)}
                icon="🌑"
              />
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Om {results.phaseName}</h4>
              <p className="text-sm text-muted-foreground">
                {getPhaseDescription(results.phase)}
              </p>
            </div>
          </div>
        )
      }
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="date">Velg dato</Label>
          <Input
            id="date"
            type="date"
            value={inputs.date}
            onChange={(e) => setInput('date', e.target.value)}
            className={cn(errors.date && 'border-destructive')}
          />
          {errors.date && (
            <p className="text-sm text-destructive mt-1">{errors.date}</p>
          )}
        </div>
      </div>
    </CalculatorBase>
  );
}

/**
 * Get description for each moon phase
 */
function getPhaseDescription(phase: MoonPhaseName): string {
  const descriptions: Record<MoonPhaseName, string> = {
    'new': 'Månen står mellom jorda og solen, og den opplyste siden vender bort fra oss. Passer for nye begynnelser og for å sette mål.',
    'waxing-crescent': 'En tynn flis av månen blir synlig. Fasen står for vekst, kreativitet og for å sette planer ut i livet.',
    'first-quarter': 'Halve månen er opplyst. Passer for å ta beslutninger og møte utfordringer.',
    'waxing-gibbous': 'Mer enn halve månen er opplyst, og den vokser. Fokuser på å finpusse og justere målene dine.',
    'full': 'Hele månen er opplyst. En tid for å fullføre, feire og for sterke følelser.',
    'waning-gibbous': 'Månen begynner å avta. En tid for takknemlighet, deling og ettertanke.',
    'last-quarter': 'Halve månen er opplyst, og den avtar. Slipp det som ikke lenger tjener deg, og gjør deg klar for fornyelse.',
    'waning-crescent': 'Bare en tynn flis er synlig. Hvil, tenk over det som har skjedd, og gjør deg klar for en ny syklus.',
  };
  return descriptions[phase];
}

export default MoonPhaseCalculator;
