'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  calculateLoveCompatibility,
  getFlamesMeaning,
  type LoveCompatibilityResult,
} from '@/lib/calculations/fun/love-compatibility';
import { cn } from '@/lib/utils';

/**
 * Zod schema for love compatibility inputs
 */
const loveCompatibilitySchema = z.object({
  name1: z.string().min(1, 'First name is required').max(50, 'Name too long'),
  name2: z.string().min(1, 'Second name is required').max(50, 'Name too long'),
});

type LoveCompatibilityInputs = {
  name1: string;
  name2: string;
};

const INITIAL_INPUTS: LoveCompatibilityInputs = {
  name1: '',
  name2: '',
};

/**
 * Heart animation component
 */
function HeartAnimation({ percentage }: { percentage: number }) {
  const heartSize = Math.max(40, Math.min(100, percentage));
  
  return (
    <div className="flex justify-center my-4">
      <div 
        className="relative animate-pulse"
        style={{ 
          width: `${heartSize}px`, 
          height: `${heartSize}px`,
          animationDuration: `${2 - (percentage / 100)}s`
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-full h-full text-red-500"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
    </div>
  );
}

/**
 * Compatibility meter component
 */
function CompatibilityMeter({ percentage }: { percentage: number }) {
  const getColor = (pct: number) => {
    if (pct >= 75) return 'bg-green-500';
    if (pct >= 50) return 'bg-yellow-500';
    if (pct >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-muted-foreground">Compatibility</span>
        <span className="font-bold text-lg">{percentage}%</span>
      </div>
      <div className="h-4 bg-muted rounded-full overflow-hidden">
        <div
          className={cn('h-full transition-all duration-1000 ease-out rounded-full', getColor(percentage))}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/**
 * FLAMES badge component
 */
function FlamesBadge({ result }: { result: LoveCompatibilityResult['flamesResult'] }) {
  const meaning = getFlamesMeaning(result);
  
  const colorMap: Record<string, string> = {
    friends: 'bg-blue-100 text-blue-700 border-blue-200',
    lovers: 'bg-pink-100 text-pink-700 border-pink-200',
    affection: 'bg-purple-100 text-purple-700 border-purple-200',
    marriage: 'bg-green-100 text-green-700 border-green-200',
    enemies: 'bg-red-100 text-red-700 border-red-200',
    siblings: 'bg-orange-100 text-orange-700 border-orange-200',
  };

  return (
    <div className={cn('px-4 py-2 rounded-lg border text-center', colorMap[result])}>
      <p className="font-semibold text-lg">{meaning.label}</p>
      <p className="text-sm opacity-80">{meaning.description}</p>
    </div>
  );
}

/**
 * Love Compatibility Calculator Component
 * 
 * Calculates love compatibility based on names using the classic FLAMES
 * method combined with numerology for a fun compatibility score.
 * 
 * Features:
 * - Name-based compatibility calculation
 * - FLAMES result display
 * - Animated heart visualization
 * - Compatibility percentage meter
 * - Personalized advice
 * 
 * @see Requirements 19.1
 */
export function LoveCompatibilityCalculator() {
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<LoveCompatibilityInputs, LoveCompatibilityResult>({
    initialInputs: INITIAL_INPUTS,
    schema: loveCompatibilitySchema as unknown as z.ZodType<LoveCompatibilityInputs>,
    calculate: (formInputs) => {
      return calculateLoveCompatibility(formInputs.name1, formInputs.name2);
    },
    storageKey: 'love-compatibility-calculator',
  });

  return (
    <CalculatorBase
      title="Love Compatibility Test"
      description="Enter two names to discover your love compatibility using the classic FLAMES method and numerology"
      isCalculateDisabled={!isValid || !inputs.name1 || !inputs.name2}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-6">
            <HeartAnimation percentage={results.percentage} />
            
            <CompatibilityMeter percentage={results.percentage} />
            
            <div className="text-center">
              <p className="text-lg font-medium">
                {results.name1} & {results.name2}
              </p>
              <p className="text-muted-foreground mt-1">{results.description}</p>
            </div>
            
            <FlamesBadge result={results.flamesResult} />
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-1">💡 Advice</p>
              <p className="text-sm text-muted-foreground">{results.advice}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center text-sm">
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-muted-foreground">Numerology Match</p>
                <p className="font-semibold text-lg">{results.numerologyMatch}%</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-muted-foreground">Overall Score</p>
                <p className="font-semibold text-lg">{results.percentage}%</p>
              </div>
            </div>
          </div>
        )
      }
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="name1">First Name</Label>
          <Input
            id="name1"
            type="text"
            placeholder="Enter first name"
            value={inputs.name1}
            onChange={(e) => setInput('name1', e.target.value)}
            className={cn(errors.name1 && 'border-destructive')}
          />
          {errors.name1 && (
            <p className="text-sm text-destructive mt-1">{errors.name1}</p>
          )}
        </div>
        
        <div className="flex justify-center">
          <span className="text-2xl">❤️</span>
        </div>
        
        <div>
          <Label htmlFor="name2">Second Name</Label>
          <Input
            id="name2"
            type="text"
            placeholder="Enter second name"
            value={inputs.name2}
            onChange={(e) => setInput('name2', e.target.value)}
            className={cn(errors.name2 && 'border-destructive')}
          />
          {errors.name2 && (
            <p className="text-sm text-destructive mt-1">{errors.name2}</p>
          )}
        </div>
      </div>
    </CalculatorBase>
  );
}

export default LoveCompatibilityCalculator;
