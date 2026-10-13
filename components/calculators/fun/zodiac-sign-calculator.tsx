'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  getZodiacInfo,
  checkCompatibility,
  type ZodiacInfo,
  type ZodiacSign,
} from '@/lib/calculations/fun/zodiac-calculator';
import { cn } from '@/lib/utils';

/**
 * Zod schema for zodiac inputs
 */
const zodiacSchema = z.object({
  birthDate: z.string().min(1, 'Fødselsdato må fylles ut'),
});

type ZodiacInputs = {
  birthDate: string;
};

const INITIAL_INPUTS: ZodiacInputs = {
  birthDate: '',
};

/**
 * Element badge component
 */
const ELEMENT_NAMES: Record<ZodiacInfo['element'], string> = { fire: 'Ild', earth: 'Jord', air: 'Luft', water: 'Vann' };
const MODALITY_NAMES: Record<ZodiacInfo['modality'], string> = { cardinal: 'Kardinal', fixed: 'Fast', mutable: 'Foranderlig' };

function ElementBadge({ element }: { element: ZodiacInfo['element'] }) {
  const elementStyles = {
    fire: 'bg-red-100 text-red-700 border-red-200',
    earth: 'bg-amber-100 text-amber-700 border-amber-200',
    air: 'bg-sky-100 text-sky-700 border-sky-200',
    water: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  const elementEmojis = {
    fire: '🔥',
    earth: '🌍',
    air: '💨',
    water: '💧',
  };

  return (
    <span className={cn('px-3 py-1 rounded-full text-sm border inline-flex items-center gap-1', elementStyles[element])}>
      {elementEmojis[element]} {ELEMENT_NAMES[element]}
    </span>
  );
}

/**
 * Trait list component
 */
function TraitList({ title, items, icon }: { title: string; items: string[]; icon: string }) {
  return (
    <div className="bg-muted/30 p-4 rounded-lg">
      <h4 className="font-medium mb-2 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span key={index} className="px-2 py-1 bg-background rounded text-sm">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Compatibility section component
 */
function CompatibilitySection({ compatibleSigns }: { compatibleSigns: ZodiacSign[] }) {
  const signEmojis: Record<ZodiacSign, string> = {
    aries: '♈',
    taurus: '♉',
    gemini: '♊',
    cancer: '♋',
    leo: '♌',
    virgo: '♍',
    libra: '♎',
    scorpio: '♏',
    sagittarius: '♐',
    capricorn: '♑',
    aquarius: '♒',
    pisces: '♓',
  };

  return (
    <div className="bg-muted/30 p-4 rounded-lg">
      <h4 className="font-medium mb-2 flex items-center gap-2">
        <span>💕</span> Mest kompatible tegn
      </h4>
      <div className="flex flex-wrap gap-2">
        {compatibleSigns.map((sign) => (
          <span key={sign} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
            {signEmojis[sign]} {sign.charAt(0).toUpperCase() + sign.slice(1)}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Zodiac Sign Calculator Component
 * 
 * Calculates the zodiac sign based on birth date and provides
 * detailed information including traits, compatibility, and more.
 * 
 * Features:
 * - Zodiac sign determination
 * - Element and modality display
 * - Personality traits
 * - Strengths and weaknesses
 * - Compatible signs
 * 
 * @see Requirements 19.3
 */
export function ZodiacSignCalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<ZodiacInputs, ZodiacInfo>({
    initialInputs: INITIAL_INPUTS,
    schema: zodiacSchema as unknown as z.ZodType<ZodiacInputs>,
    calculate: (formInputs) => {
      const date = new Date(formInputs.birthDate);
      return getZodiacInfo(date);
    },
    storageKey: 'zodiac-sign-calculator',
  });

  return (
    <CalculatorBase
      title="Stjernetegn"
      description="Skriv inn fødselsdatoen din og finn stjernetegnet og personlighetstrekkene dine"
      isCalculateDisabled={!isValid || !inputs.birthDate}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-6">
            {/* Main sign display */}
            <div className="text-center py-4">
              <span className="text-6xl mb-2 block">{results.emoji}</span>
              <h3 className="text-2xl font-bold">{results.name}</h3>
              <p className="text-3xl text-muted-foreground">{results.symbol}</p>
              <p className="text-sm text-muted-foreground mt-1">{results.dateRange}</p>
            </div>
            
            {/* Element and modality */}
            <div className="flex justify-center gap-3 flex-wrap">
              <ElementBadge element={results.element} />
              <span className="px-3 py-1 rounded-full text-sm border bg-muted">
                {MODALITY_NAMES[results.modality]}
              </span>
              <span className="px-3 py-1 rounded-full text-sm border bg-purple-100 text-purple-700 border-purple-200">
                🪐 {results.rulingPlanet}
              </span>
            </div>
            
            {/* Traits */}
            <TraitList title="Viktige egenskaper" items={results.traits} icon="✨" />
            
            {/* Strengths and Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TraitList title="Styrker" items={results.strengths} icon="💪" />
              <TraitList title="Svakheter" items={results.weaknesses} icon="⚠️" />
            </div>
            
            {/* Compatibility */}
            <CompatibilitySection compatibleSigns={results.compatibility} />
          </div>
        )
      }
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="birthDate">Fødselsdatoen din</Label>
          <Input
            id="birthDate"
            type="date"
            value={inputs.birthDate}
            onChange={(e) => setInput('birthDate', e.target.value)}
            className={cn(errors.birthDate && 'border-destructive')}
          />
          {errors.birthDate && (
            <p className="text-sm text-destructive mt-1">{errors.birthDate}</p>
          )}
        </div>
      </div>
    </CalculatorBase>
  );
}

export default ZodiacSignCalculator;
