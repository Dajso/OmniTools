'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { useCalculator } from '@/lib/hooks/use-calculator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * Zod schema for age inputs
 */
const ageSchema = z.object({
  birthDate: z.string().min(1, 'Fødselsdato må fylles ut'),
  birthTime: z.string().optional(),
});

type AgeInputs = {
  birthDate: string;
  birthTime: string;
};

const INITIAL_INPUTS: AgeInputs = {
  birthDate: '',
  birthTime: '00:00',
};

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  totalWeeks: number;
  nextBirthday: Date;
  daysUntilBirthday: number;
  heartbeats: number;
  breaths: number;
}

/**
 * Stat card component
 */
function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-muted/50 p-4 rounded-lg text-center">
      <span className="text-2xl mb-1 block">{icon}</span>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

/**
 * Large stat display component
 */
function LargeStat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-lg text-center">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-3xl md:text-4xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{unit}</p>
    </div>
  );
}

/**
 * Calculate age details from birth date
 */
function calculateAge(birthDate: Date, birthTime: string): AgeResult {
  const now = new Date();
  const birth = new Date(birthDate);
  
  // Add birth time if provided
  if (birthTime) {
    const [hours, minutes] = birthTime.split(':').map(Number);
    birth.setHours(hours, minutes, 0, 0);
  }
  
  // Calculate years, months, days
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();
  
  if (days < 0) {
    months--;
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += lastMonth.getDate();
  }
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  // Calculate totals
  const diffMs = now.getTime() - birth.getTime();
  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  const totalWeeks = Math.floor(totalDays / 7);
  
  // Calculate next birthday
  const nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday <= now) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
  }
  const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  // Fun estimates (average values)
  const heartbeats = Math.floor(totalMinutes * 72); // ~72 bpm average
  const breaths = Math.floor(totalMinutes * 16); // ~16 breaths per minute average
  
  return {
    years,
    months,
    days,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    totalWeeks,
    nextBirthday,
    daysUntilBirthday,
    heartbeats,
    breaths,
  };
}

/**
 * Format large numbers with commas
 */
function formatNumber(num: number): string {
  return num.toLocaleString('nb-NO');
}

/**
 * Age in Days/Seconds Calculator Component
 * 
 * Calculates your exact age in various units including days,
 * hours, minutes, and seconds.
 * 
 * Features:
 * - Precise age calculation
 * - Multiple time units
 * - Next birthday countdown
 * - Fun statistics (heartbeats, breaths)
 * 
 * @see Requirements 19.6
 */
export function AgeInDaysCalculator() {
  const [liveResults, setLiveResults] = React.useState<AgeResult | null>(null);
  
  const {
    inputs,
    setInput,
    results,
    errors,
    isValid,
    calculate,
    reset,
    isCalculating,
  } = useCalculator<AgeInputs, AgeResult>({
    initialInputs: INITIAL_INPUTS,
    schema: ageSchema as unknown as z.ZodType<AgeInputs>,
    calculate: (formInputs) => {
      const date = new Date(formInputs.birthDate);
      return calculateAge(date, formInputs.birthTime);
    },
    storageKey: 'age-in-days-calculator',
  });

  // Live update seconds counter
  React.useEffect(() => {
    if (!results) return;
    
    const interval = setInterval(() => {
      const date = new Date(inputs.birthDate);
      setLiveResults(calculateAge(date, inputs.birthTime));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [results, inputs.birthDate, inputs.birthTime]);

  const displayResults = liveResults || results;

  return (
    <CalculatorBase
      title="Alder i dager"
      description="Finn ut nøyaktig hvor gammel du er i dager, timer, minutter og sekunder"
      isCalculateDisabled={!isValid || !inputs.birthDate}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={() => {
        reset();
        setLiveResults(null);
      }}
      error={(errors as Record<string, string>)._calculation}
      results={
        displayResults && (
          <div className="space-y-6">
            {/* Main age display */}
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-2">Du er</p>
              <p className="text-4xl font-bold">
                {displayResults.years} år, {displayResults.months} måneder, {displayResults.days} dager
              </p>
              <p className="text-sm text-muted-foreground mt-2">gammel</p>
            </div>
            
            {/* Large stats */}
            <div className="grid grid-cols-2 gap-4">
              <LargeStat
                label="Dager totalt"
                value={formatNumber(displayResults.totalDays)}
                unit="dager levd"
              />
              <LargeStat
                label="Sekunder totalt"
                value={formatNumber(displayResults.totalSeconds)}
                unit="sekunder levd"
              />
            </div>
            
            {/* Detailed stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                label="Uker"
                value={formatNumber(displayResults.totalWeeks)}
                icon="📅"
              />
              <StatCard
                label="Timer"
                value={formatNumber(displayResults.totalHours)}
                icon="⏰"
              />
              <StatCard
                label="Minutter"
                value={formatNumber(displayResults.totalMinutes)}
                icon="⏱️"
              />
              <StatCard
                label="Dager til bursdag"
                value={formatNumber(displayResults.daysUntilBirthday)}
                icon="🎂"
              />
            </div>
            
            {/* Fun facts */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <span>🎉</span> Artige fakta om livet ditt
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Anslåtte hjerteslag</p>
                  <p className="font-semibold text-lg">{formatNumber(displayResults.heartbeats)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Anslåtte åndedrag</p>
                  <p className="font-semibold text-lg">{formatNumber(displayResults.breaths)}</p>
                </div>
              </div>
            </div>
            
            {/* Next birthday */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Neste bursdag er</p>
              <p className="font-semibold text-lg">
                {displayResults.nextBirthday.toLocaleDateString('nb-NO', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-sm text-pink-600 mt-1">
                🎂 {displayResults.daysUntilBirthday} dager igjen!
              </p>
            </div>
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
        
        <div>
          <Label htmlFor="birthTime">Fødselstidspunkt (valgfritt)</Label>
          <Input
            id="birthTime"
            type="time"
            value={inputs.birthTime}
            onChange={(e) => setInput('birthTime', e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Legg til klokkeslettet du ble født for mer nøyaktige tall
          </p>
        </div>
      </div>
    </CalculatorBase>
  );
}

export default AgeInDaysCalculator;
