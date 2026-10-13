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
  fullName: z.string().min(1, 'Fullt navn må fylles ut').max(100, 'Navnet er for langt'),
  birthDate: z.string().min(1, 'Fødselsdato må fylles ut'),
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
              Mester
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
      title="Numerologi"
      description="Finn tallene dine i numerologi og hva de betyr, ut fra navn og fødselsdato"
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
                title="Livsveitall"
                number={results.lifePathNumber}
                meaning={results.lifePathMeaning}
                icon="🛤️"
                color="bg-purple-50 border-purple-200"
              />
              
              <NumberCard
                title="Uttrykkstall"
                number={results.expressionNumber}
                meaning={results.expressionMeaning}
                icon="✨"
                color="bg-blue-50 border-blue-200"
              />
              
              <NumberCard
                title="Sjelstall"
                number={results.soulUrgeNumber}
                meaning={results.soulUrgeMeaning}
                icon="💖"
                color="bg-pink-50 border-pink-200"
              />
            </div>
            
            {/* Secondary numbers */}
            <div className="grid grid-cols-2 gap-4">
              <NumberBadge label="Personlighetstall" number={results.personalityNumber} />
              <NumberBadge label="Fødselsdagstall" number={results.birthdayNumber} />
            </div>
            
            {/* Master numbers explanation */}
            {[results.lifePathNumber, results.expressionNumber, results.soulUrgeNumber].some(n => [11, 22, 33].includes(n)) && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">✨ Du har et mestertall!</h4>
                <p className="text-sm text-yellow-700">
                  Mestertall (11, 22, 33) regnes som sterke i numerologien. De har større åndelig betydning og større potensial, men også større utfordringer.
                </p>
              </div>
            )}
            
            {/* How it works */}
            <div className="bg-muted/30 p-4 rounded-lg text-sm">
              <h4 className="font-medium mb-2">Slik fungerer numerologi</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• <strong>Livsvei:</strong> Regnes ut fra fødselsdatoen din</li>
                <li>• <strong>Uttrykk:</strong> Regnes ut fra alle bokstavene i navnet ditt</li>
                <li>• <strong>Sjelsdrift:</strong> Bygger på vokalene i navnet ditt</li>
                <li>• <strong>Personlighet:</strong> Bygger på konsonantene i navnet ditt</li>
                <li>• <strong>Fødselsdag:</strong> Bare fødselsdagen din, redusert til ett siffer</li>
              </ul>
            </div>
          </div>
        )
      }
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Fullt navn</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Skriv inn hele fødselsnavnet ditt"
            value={inputs.fullName}
            onChange={(e) => setInput('fullName', e.target.value)}
            className={cn(errors.fullName && 'border-destructive')}
          />
          {errors.fullName && (
            <p className="text-sm text-destructive mt-1">{errors.fullName}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Bruk hele navnet slik det står i fødselsattesten
          </p>
        </div>
        
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

export default NumerologyCalculator;
