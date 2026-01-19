'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  calculateNumerology,
  type NumerologyResult,
} from '@/lib/calculations/fun/numerology-calculator';
import { cn } from '@/lib/utils';

/**
 * Zod schema for numerology inputs
 */
const numerologySchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100, 'Name too long'),
  birthDate: z.string().min(1, 'Birth date is required'),
});

type NumerologyInputs = {
  fullName: string;
  birthDate: string;
};

const INITIAL_INPUTS: NumerologyInputs = {
  fullName: '',
  birthDate: '',
};

/**
 * Number display component with meaning
 */
function NumberCard({ 
  title, 
  number, 
  meaning, 
  icon,
  color 
}: { 
  title: string; 
  number: number; 
  meaning: string;
  icon: string;
  color: string;
}) {
  const isMasterNumber = [11, 22, 33].includes(number);
  
  return (
    <div className={cn('p-4 rounded-lg border', color)}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <h4 className="font-medium">{title}</h4>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-2xl font-bold">{number}</span>
          {isMasterNumber && (
            <span className="text-xs bg-yellow-200 text-yellow-800 px-1.5 py-0.5 rounded">
              Master
            </span>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{meaning}</p>
    </div>
  );
}

/**
 * Small number badge component
 */
function NumberBadge({ label, number }: { label: string; number: number }) {
  return (
    <div className="bg-muted/50 p-3 rounded-lg text-center">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-xl font-bold">{number}</p>
    </div>
  );
}

/**
 * Numerology Calculator Component
 * 
 * Calculates numerology numbers including Life Path, Expression,
 * Soul Urge, Personality, and Birthday numbers.
 * 
 * Features:
 * - Life Path Number calculation
 * - Expression (Destiny) Number
 * - Soul Urge (Heart's Desire) Number
 * - Personality Number
 * - Birthday Number
 * - Master number recognition (11, 22, 33)
 * 
 * @see Requirements 19.5
 */
export function NumerologyCalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<NumerologyInputs, NumerologyResult>({
    initialInputs: INITIAL_INPUTS,
    schema: numerologySchema as unknown as z.ZodType<NumerologyInputs>,
    calculate: (formInputs) => {
      const date = new Date(formInputs.birthDate);
      return calculateNumerology(formInputs.fullName, date);
    },
    storageKey: 'numerology-calculator',
  });

  return (
    <CalculatorBase
      title="Numerology Calculator"
      description="Discover your numerology numbers and their meanings based on your name and birth date"
      isCalculateDisabled={!isValid || !inputs.fullName || !inputs.birthDate}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-6">
            {/* Main numbers */}
            <div className="space-y-4">
              <NumberCard
                title="Life Path Number"
                number={results.lifePathNumber}
                meaning={results.lifePathMeaning}
                icon="🛤️"
                color="bg-purple-50 border-purple-200"
              />
              
              <NumberCard
                title="Expression Number"
                number={results.expressionNumber}
                meaning={results.expressionMeaning}
                icon="✨"
                color="bg-blue-50 border-blue-200"
              />
              
              <NumberCard
                title="Soul Urge Number"
                number={results.soulUrgeNumber}
                meaning={results.soulUrgeMeaning}
                icon="💖"
                color="bg-pink-50 border-pink-200"
              />
            </div>
            
            {/* Secondary numbers */}
            <div className="grid grid-cols-2 gap-4">
              <NumberBadge label="Personality Number" number={results.personalityNumber} />
              <NumberBadge label="Birthday Number" number={results.birthdayNumber} />
            </div>
            
            {/* Master numbers explanation */}
            {[results.lifePathNumber, results.expressionNumber, results.soulUrgeNumber].some(n => [11, 22, 33].includes(n)) && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">✨ You have a Master Number!</h4>
                <p className="text-sm text-yellow-700">
                  Master numbers (11, 22, 33) are considered powerful in numerology. They carry higher spiritual significance and greater potential, but also greater challenges.
                </p>
              </div>
            )}
            
            {/* How it works */}
            <div className="bg-muted/30 p-4 rounded-lg text-sm">
              <h4 className="font-medium mb-2">How Numerology Works</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• <strong>Life Path:</strong> Derived from your birth date</li>
                <li>• <strong>Expression:</strong> Calculated from all letters in your name</li>
                <li>• <strong>Soul Urge:</strong> Based on vowels in your name</li>
                <li>• <strong>Personality:</strong> Based on consonants in your name</li>
                <li>• <strong>Birthday:</strong> Simply your birth day reduced</li>
              </ul>
            </div>
          </div>
        )
      }
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Your Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full birth name"
            value={inputs.fullName}
            onChange={(e) => setInput('fullName', e.target.value)}
            className={cn(errors.fullName && 'border-destructive')}
          />
          {errors.fullName && (
            <p className="text-sm text-destructive mt-1">{errors.fullName}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Use your full name as it appears on your birth certificate
          </p>
        </div>
        
        <div>
          <Label htmlFor="birthDate">Your Birth Date</Label>
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

export default NumerologyCalculator;
