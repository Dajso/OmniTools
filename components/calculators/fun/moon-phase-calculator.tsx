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

/**
 * Zod schema for moon phase inputs
 */
const moonPhaseSchema = z.object({
  date: z.string().min(1, 'Date is required'),
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
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <CalculatorBase
      title="Moon Phase Calculator"
      description="Discover the moon phase for any date with a visual display"
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
                {results.illumination.toFixed(1)}% illuminated
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <PhaseInfoCard
                label="Moon Age"
                value={`${results.age.toFixed(1)} days`}
                icon="📅"
              />
              <PhaseInfoCard
                label="Illumination"
                value={`${results.illumination.toFixed(1)}%`}
                icon="💡"
              />
              <PhaseInfoCard
                label="Next Full Moon"
                value={formatDate(results.nextFull)}
                icon="🌕"
              />
              <PhaseInfoCard
                label="Next New Moon"
                value={formatDate(results.nextNew)}
                icon="🌑"
              />
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-2">About {results.phaseName}</h4>
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
          <Label htmlFor="date">Select Date</Label>
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
    'new': 'The Moon is between Earth and the Sun, with its illuminated side facing away from us. This is a time for new beginnings and setting intentions.',
    'waxing-crescent': 'A sliver of the Moon becomes visible. This phase represents growth, creativity, and taking action on new plans.',
    'first-quarter': 'Half of the Moon is illuminated. This is a time for decision-making and overcoming challenges.',
    'waxing-gibbous': 'More than half of the Moon is illuminated and growing. Focus on refinement and adjustment of your goals.',
    'full': 'The entire face of the Moon is illuminated. This is a time of completion, celebration, and heightened emotions.',
    'waning-gibbous': 'The Moon begins to decrease in illumination. A time for gratitude, sharing, and introspection.',
    'last-quarter': 'Half of the Moon is illuminated and decreasing. Release what no longer serves you and prepare for renewal.',
    'waning-crescent': 'Only a sliver remains visible. Rest, reflect, and prepare for the new cycle ahead.',
  };
  return descriptions[phase];
}

export default MoonPhaseCalculator;
